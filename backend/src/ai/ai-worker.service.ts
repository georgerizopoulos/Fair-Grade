import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ActivityService } from '../activity/activity.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { QUESTION_GRADER, type QuestionGrader } from './question-grader.js';

// The AI grading worker (change request §5). Submitting a paper queues it:
// status AI_GRADING + aiNextAttemptAt. Every few seconds this picks due papers,
// grades every question against the model answer and rubric, and either
//   - writes aiPoints / aiReasoning and sets AI_GRADED, or
//   - after MAX_ATTEMPTS failed attempts sets AI_FAILED (the TA can retry).
// Results are only written while the paper is still AI_GRADING, so a paper
// reopened mid-grading is left alone.

const POLL_MS = 2_000;
const MAX_ATTEMPTS = 3;
const BACKOFF_MS = [5_000, 20_000]; // wait after attempt 1, after attempt 2
const LEASE_MS = 3 * 60_000; // a paper being graded isn't picked again for this long
const PAPERS_AT_ONCE = 3;
const FLAG_RATIO = 0.15;
const MIN_SAMPLES = 3;

@Injectable()
export class AiWorkerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger('AiWorker');
  private timer?: NodeJS.Timeout;
  private ticking = false;

  constructor(
    private readonly prisma: PrismaService,
    private readonly activity: ActivityService,
    @Inject(QUESTION_GRADER) private readonly grader: QuestionGrader,
  ) {}

  onModuleInit() {
    // Off in tests (they call processDue() themselves) and with AI_WORKER=off.
    if (process.env.NODE_ENV === 'test' || process.env.AI_WORKER === 'off')
      return;
    this.timer = setInterval(() => void this.tick(), POLL_MS);
    this.logger.log(`AI worker polling every ${POLL_MS / 1000}s`);
  }

  onModuleDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private async tick() {
    if (this.ticking) return;
    this.ticking = true;
    try {
      await this.processDue();
    } catch (e) {
      this.logger.error(e);
    } finally {
      this.ticking = false;
    }
  }

  // Grades every paper that is due now. Returns how many it picked up.
  async processDue(): Promise<number> {
    const now = new Date();
    const due = await this.prisma.paper.findMany({
      where: {
        status: 'AI_GRADING',
        OR: [{ aiNextAttemptAt: null }, { aiNextAttemptAt: { lte: now } }],
      },
      orderBy: { submittedAt: 'asc' },
      take: PAPERS_AT_ONCE,
      select: { id: true },
    });
    // Lease them so the next tick doesn't pick them up again mid-grading.
    const leased: string[] = [];
    for (const p of due) {
      const { count } = await this.prisma.paper.updateMany({
        where: { id: p.id, status: 'AI_GRADING' },
        data: { aiNextAttemptAt: new Date(now.getTime() + LEASE_MS) },
      });
      if (count) leased.push(p.id);
    }
    await Promise.all(leased.map((id) => this.gradePaper(id)));
    return leased.length;
  }

  private async gradePaper(paperId: string) {
    const paper = await this.prisma.paper.findUniqueOrThrow({
      where: { id: paperId },
      include: {
        answers: true,
        exam: {
          include: {
            questions: {
              orderBy: { order: 'asc' },
              include: { rubricPoints: { orderBy: { order: 'asc' } } },
            },
          },
        },
      },
    });
    const byQuestion = new Map(paper.answers.map((a) => [a.questionId, a]));

    let grades: { questionId: string; points: number; reasoning: string }[];
    try {
      // Only exam content and the transcribed answer go to the model.
      grades = await Promise.all(
        paper.exam.questions.map(async (q) => {
          const g = await this.grader.grade({
            code: q.code,
            prompt: q.prompt,
            maxPoints: q.maxPoints,
            modelAnswer: q.modelAnswer,
            rubric: q.rubricPoints.map((r) => ({
              text: r.text,
              points: r.points,
            })),
            answer: byQuestion.get(q.id)?.transcription ?? '',
          });
          return { questionId: q.id, ...g };
        }),
      );
    } catch (e) {
      await this.failAttempt(paper, (e as Error).message);
      return;
    }

    const saved = await this.prisma.$transaction(async (tx) => {
      const { count } = await tx.paper.updateMany({
        where: { id: paperId, status: 'AI_GRADING' },
        data: {
          status: 'AI_GRADED',
          aiGradedAt: new Date(),
          aiError: null,
          aiNextAttemptAt: null,
        },
      });
      if (!count) return false; // reopened while we were grading: drop the result
      for (const g of grades) {
        await tx.paperAnswer.upsert({
          where: { paperId_questionId: { paperId, questionId: g.questionId } },
          update: { aiPoints: g.points, aiReasoning: g.reasoning },
          create: {
            paperId,
            questionId: g.questionId,
            transcription: '',
            uncertainWords: [],
            pages: [],
            aiPoints: g.points,
            aiReasoning: g.reasoning,
          },
        });
      }
      return true;
    });
    if (!saved) return;

    await this.activity.log({
      courseId: paper.exam.courseId,
      type: 'AI_GRADED',
      paperId,
      payload: {
        studentId: paper.studentId,
        taId: paper.taId,
        aiTotal: grades.reduce((s, g) => s + g.points, 0),
      },
    });
    await this.logNewFlags(paper.examId, paper.exam.courseId, paper.taId);
  }

  private async failAttempt(
    paper: {
      id: string;
      studentId: string;
      taId: string;
      aiAttempts: number;
      exam: { courseId: string };
    },
    error: string,
  ) {
    const attempts = paper.aiAttempts + 1;
    const failed = attempts >= MAX_ATTEMPTS;
    const { count } = await this.prisma.paper.updateMany({
      where: { id: paper.id, status: 'AI_GRADING' },
      data: failed
        ? {
            status: 'AI_FAILED',
            aiAttempts: attempts,
            aiError: error,
            aiNextAttemptAt: null,
          }
        : {
            aiAttempts: attempts,
            aiError: error,
            aiNextAttemptAt: new Date(Date.now() + BACKOFF_MS[attempts - 1]),
          },
    });
    this.logger.warn(`AI attempt ${attempts}/${MAX_ATTEMPTS} failed: ${error}`);
    if (failed && count) {
      await this.activity.log({
        courseId: paper.exam.courseId,
        type: 'AI_FAILED',
        paperId: paper.id,
        payload: { studentId: paper.studentId, taId: paper.taId, error },
      });
    }
  }

  // TA_FLAGGED the first time a TA crosses the threshold on a question:
  // at least 3 AI-graded papers and |average gap| > 15% of the question's points.
  private async logNewFlags(examId: string, courseId: string, taId: string) {
    const answers = await this.prisma.paperAnswer.findMany({
      where: { paper: { examId, taId, status: 'AI_GRADED' } },
      include: {
        question: { select: { id: true, code: true, maxPoints: true } },
      },
    });
    const byQuestion = new Map<
      string,
      { code: string; max: number; gaps: number[] }
    >();
    for (const a of answers) {
      if (a.taPoints == null || a.aiPoints == null) continue;
      const entry = byQuestion.get(a.questionId) ?? {
        code: a.question.code,
        max: a.question.maxPoints,
        gaps: [],
      };
      entry.gaps.push(a.taPoints - a.aiPoints);
      byQuestion.set(a.questionId, entry);
    }

    const already = await this.prisma.activityLog.findMany({
      where: { courseId, type: 'TA_FLAGGED' },
      select: { payload: true },
    });
    const seen = new Set(
      already.map((l) => {
        const p = l.payload as { taId?: string; questionId?: string };
        return `${p.taId}:${p.questionId}`;
      }),
    );

    for (const [questionId, q] of byQuestion) {
      if (q.gaps.length < MIN_SAMPLES) continue;
      const avg = q.gaps.reduce((s, g) => s + g, 0) / q.gaps.length;
      if (
        Math.abs(avg) <= FLAG_RATIO * q.max ||
        seen.has(`${taId}:${questionId}`)
      )
        continue;
      await this.activity.log({
        courseId,
        type: 'TA_FLAGGED',
        payload: {
          taId,
          examId,
          questionId,
          questionCode: q.code,
          averageGap: Math.round(avg * 100) / 100,
        },
      });
    }
  }
}
