import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import type { PaperStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  largestAnswerGaps,
  mean,
  median,
  MIN_SAMPLES,
  paperGap,
  round2,
  taSummary,
  threshold,
} from './report-math.js';
import type {
  ExamReportPaper,
  ExamReportQuestion,
  ExamReportResponse,
  ExamReportTaSummary,
  MyStatsResponse,
  TaDetailReportResponse,
  TaReportFlaggedPaper,
  TaReportPaper,
} from './reports.dto.js';

const DRAFT_STATUSES: PaperStatus[] = ['TRANSCRIBING', 'DRAFT'];
const QUESTION_SELECT = {
  id: true,
  code: true,
  title: true,
  maxPoints: true,
} as const;
// A single answer this far from the AI is "worth a second look" on My stats.
const SECOND_LOOK_GAP = 1;

const absOrInf = (x: number | null) => (x == null ? -1 : Math.abs(x));

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  // GET /exams/:id/my-stats: the signed-in TA's own papers against the AI.
  async myStats(user: AuthUser, examId: string): Promise<MyStatsResponse> {
    const exam = await this.access.exam(user, examId);
    if (user.role !== 'ta') {
      throw new ForbiddenException('Only TAs can view their exam stats');
    }

    const ownPaperWhere = { examId, taId: user.id };
    const leaderboardAllowed = exam.course.leaderboardVisibility !== 'OFF';
    const [
      total,
      submitted,
      aiGraded,
      pending,
      drafts,
      papers,
      questions,
      everyone,
    ] = await Promise.all([
      this.prisma.paper.count({ where: ownPaperWhere }),
      this.prisma.paper.count({
        where: { ...ownPaperWhere, submittedAt: { not: null } },
      }),
      this.prisma.paper.count({
        where: { ...ownPaperWhere, status: 'AI_GRADED' },
      }),
      this.prisma.paper.count({
        where: { ...ownPaperWhere, status: 'AI_GRADING' },
      }),
      this.prisma.paper.count({
        where: { ...ownPaperWhere, status: { in: DRAFT_STATUSES } },
      }),
      this.prisma.paper.findMany({
        where: { ...ownPaperWhere, status: 'AI_GRADED' },
        select: {
          id: true,
          studentId: true,
          status: true,
          createdAt: true,
          submittedAt: true,
          answers: {
            select: {
              questionId: true,
              taPoints: true,
              aiPoints: true,
              aiReasoning: true,
            },
          },
        },
        orderBy: { submittedAt: 'asc' },
      }),
      this.prisma.question.findMany({
        where: { examId },
        select: QUESTION_SELECT,
        orderBy: { order: 'asc' },
      }),
      // Every TA's papers, for the leaderboard only: points, no student IDs.
      this.prisma.paper.findMany({
        where: { examId, status: 'AI_GRADED' },
        select: {
          id: true,
          taId: true,
          ta: { select: { name: true } },
          answers: {
            select: { questionId: true, taPoints: true, aiPoints: true },
          },
        },
      }),
    ]);

    const mine = taSummary(papers, questions);
    const rows = papers.map((p) => ({ paper: p, ...paperGap(p, questions) }));
    const compared = rows.filter((r) => r.gap != null);
    const minutes = papers
      .filter((p) => p.submittedAt)
      .map((p) => p.submittedAt!.getTime() - p.createdAt.getTime())
      .filter((ms) => ms > 0);
    const [largest] = largestAnswerGaps(papers, questions, 1);
    const secondLook = largestAnswerGaps(papers, questions, 5).filter(
      (x) => Math.abs(x.gap) >= SECOND_LOOK_GAP,
    );

    // Leaderboard: average |paper gap| per TA in this exam, closest first.
    const byTa = new Map<string, { name: string; papers: typeof everyone }>();
    for (const p of everyone) {
      const entry = byTa.get(p.taId) ?? { name: p.ta.name, papers: [] };
      entry.papers.push(p);
      byTa.set(p.taId, entry);
    }
    const board = [...byTa.entries()]
      .map(([taId, { name, papers: taPapers }]) => ({
        taId,
        name,
        score: taSummary(
          taPapers.map((p) => ({ ...p, studentId: '' })),
          questions,
        ).meanAbsPaperGap,
      }))
      .filter((r) => r.score != null)
      .sort((a, b) => a.score! - b.score!);
    const named = exam.course.leaderboardVisibility === 'NAMED';
    const leaderboard = board.map((r, i) => ({
      rank: i + 1,
      label: r.taId === user.id || named ? r.name : `TA ${i + 1}`,
      averageGap: r.score,
      isYou: r.taId === user.id,
    }));

    const myRank = leaderboard.find((r) => r.isYou)?.rank ?? null;
    const within = compared.filter((r) => Math.abs(r.gap!) <= 0.5).length;
    const badges: { code: string; label: string }[] = [];
    if (myRank === 1 && leaderboard.length > 1) {
      badges.push({ code: 'closest', label: 'Closest to the AI in this exam' });
    }
    if (compared.length >= 5 && within / compared.length >= 0.8) {
      badges.push({
        code: 'steady',
        label: '8 in 10 papers within half a point',
      });
    }
    if (
      compared.length >= MIN_SAMPLES &&
      mine.flaggedQuestionCodes.length === 0
    ) {
      badges.push({ code: 'no-flags', label: 'No flagged questions' });
    }

    return {
      exam: {
        id: exam.id,
        name: exam.name,
        passMark: exam.passMark,
      },
      course: {
        id: exam.course.id,
        code: exam.course.code,
        name: exam.course.name,
        leaderboardVisibility: exam.course.leaderboardVisibility,
      },
      counts: { total, submitted, aiGraded, pending, drafts },
      summary: {
        taAverage: mine.taAverage,
        aiAverage: mine.aiAverage,
        averageGap: mine.paperGap,
        exactMatches: compared.filter((r) => r.gap === 0).length,
        withinHalfPoint: within,
        comparedPapers: compared.length,
        medianTimePerPaperMs: median(minutes),
        largestGap: largest
          ? {
              gap: largest.gap,
              studentId: largest.paper.studentId,
              questionCode: largest.questionCode,
            }
          : null,
        flaggedQuestionCount: mine.flaggedQuestionCodes.length,
      },
      paperComparisons: rows.map((r) => ({
        paperId: r.paperId,
        studentId: r.studentId,
        status: 'AI_GRADED' as const,
        submittedAt: r.paper.submittedAt,
        taTotal: r.taTotal,
        aiTotal: r.aiTotal,
        gap: r.gap,
      })),
      questions: mine.questions.map((q) => ({
        questionId: q.questionId,
        code: q.code,
        title: q.title,
        maxPoints: q.maxPoints,
        sampleSize: q.sampleSize,
        taAverage: q.taAverage,
        aiAverage: q.aiAverage,
        averageGap: q.averageGap,
        flagged: q.flagged,
      })),
      worthASecondLook: secondLook.map((x) => ({
        paperId: x.paper.id,
        studentId: x.paper.studentId,
        questionCode: x.questionCode,
        taPoints: x.answer.taPoints,
        aiPoints: x.answer.aiPoints,
        gap: x.gap,
        aiReasoning: x.answer.aiReasoning,
      })),
      ...(leaderboardAllowed ? { leaderboard, badges } : {}),
    };
  }

  // GET /exams/:id/report/tas/:taId: one TA against the AI, per question and paper.
  async taDetailReport(
    user: AuthUser,
    examId: string,
    taId: string,
  ): Promise<TaDetailReportResponse> {
    const exam = await this.access.ownedExam(user, examId);

    const ta = await this.prisma.user.findUnique({
      where: { id: taId },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!ta || ta.role !== 'ta') {
      throw new NotFoundException(`TA ${taId} not found`);
    }

    const questions = await this.prisma.question.findMany({
      where: { examId },
      select: QUESTION_SELECT,
      orderBy: { order: 'asc' },
    });

    const papers = await this.prisma.paper.findMany({
      where: { examId, taId, status: 'AI_GRADED' },
      include: {
        answers: {
          select: {
            questionId: true,
            taPoints: true,
            aiPoints: true,
            aiReasoning: true,
            transcription: true,
          },
        },
      },
      orderBy: { studentId: 'asc' },
    });

    const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);
    const summary = taSummary(papers, questions);

    const flaggedPapers: Record<string, TaReportFlaggedPaper[]> = {};
    for (const q of summary.questions.filter((x) => x.flagged)) {
      flaggedPapers[q.code] = largestAnswerGaps(
        papers,
        questions,
        papers.length,
        q.questionId,
      ).map((x) => ({
        paperId: x.paper.id,
        studentId: x.paper.studentId,
        taPoints: x.answer.taPoints,
        aiPoints: x.answer.aiPoints,
        gap: x.gap,
        aiReasoning: x.answer.aiReasoning ?? null,
      }));
    }

    // The papers behind the most serious flag, or the largest gaps anywhere.
    const worst = summary.questions
      .filter((q) => q.flagged)
      .sort((a, b) => absOrInf(b.averageGap) - absOrInf(a.averageGap))[0];
    const maxOf = new Map(questions.map((q) => [q.id, q.maxPoints]));
    const largestGaps = largestAnswerGaps(
      papers,
      questions,
      3,
      worst?.questionId,
    ).map((x) => ({
      paperId: x.paper.id,
      studentId: x.paper.studentId,
      questionCode: x.questionCode,
      maxPoints: maxOf.get(x.answer.questionId)!,
      taPoints: x.answer.taPoints,
      aiPoints: x.answer.aiPoints,
      gap: x.gap,
      aiReasoning: x.answer.aiReasoning ?? null,
      transcription: x.answer.transcription ?? '',
    }));

    const paperRows: TaReportPaper[] = papers.map((p) => {
      const answerMap = new Map(p.answers.map((a) => [a.questionId, a]));
      const totals = paperGap(p, questions);
      return {
        paperId: p.id,
        studentId: p.studentId,
        questions: questions.map((q) => ({
          questionId: q.id,
          code: q.code,
          maxPoints: q.maxPoints,
          taPoints: answerMap.get(q.id)?.taPoints ?? null,
          aiPoints: answerMap.get(q.id)?.aiPoints ?? null,
        })),
        taTotal: totals.taTotal,
        aiTotal: totals.aiTotal,
        gap: totals.gap,
      };
    });

    return {
      exam: { id: exam.id, name: exam.name, maxTotal },
      course: {
        id: exam.course.id,
        code: exam.course.code,
        name: exam.course.name,
      },
      ta: { id: ta.id, name: ta.name, email: ta.email },
      papersGraded: papers.length,
      taAverage: summary.taAverage,
      aiAverage: summary.aiAverage,
      paperGap: summary.paperGap,
      flaggedQuestionCodes: summary.flaggedQuestionCodes,
      questions: summary.questions,
      flaggedPapers,
      largestGaps,
      papers: paperRows,
    };
  }

  // GET /exams/:id/report: every TA against the AI, for the course instructor.
  async examReport(
    user: AuthUser,
    examId: string,
  ): Promise<ExamReportResponse> {
    const exam = await this.access.ownedExam(user, examId);

    const [
      questions,
      graded,
      totalPapers,
      submittedPapers,
      aiGradingPapers,
      aiFailedPapers,
    ] = await Promise.all([
      this.prisma.question.findMany({
        where: { examId },
        select: QUESTION_SELECT,
        orderBy: { order: 'asc' },
      }),
      this.prisma.paper.findMany({
        where: { examId, status: 'AI_GRADED' },
        include: {
          ta: { select: { id: true, name: true, email: true } },
          answers: {
            select: { questionId: true, taPoints: true, aiPoints: true },
          },
        },
      }),
      this.prisma.paper.count({ where: { examId } }),
      this.prisma.paper.count({
        where: { examId, submittedAt: { not: null } },
      }),
      this.prisma.paper.count({ where: { examId, status: 'AI_GRADING' } }),
      this.prisma.paper.count({ where: { examId, status: 'AI_FAILED' } }),
    ]);
    const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);

    const byTa = new Map<
      string,
      { name: string; email: string; papers: typeof graded }
    >();
    for (const p of graded) {
      const entry = byTa.get(p.ta.id) ?? {
        name: p.ta.name,
        email: p.ta.email ?? '',
        papers: [],
      };
      entry.papers.push(p);
      byTa.set(p.ta.id, entry);
    }

    const tas: ExamReportTaSummary[] = [...byTa.entries()].map(
      ([taId, { name, email, papers }]) => {
        const s = taSummary(papers, questions);
        const gaps = s.questions
          .filter((q) => q.averageGap != null)
          .map((q) => Math.abs(q.averageGap!));
        const avgAbs = mean(gaps);
        return {
          taId,
          taName: name,
          email,
          papersGraded: papers.length,
          averageGap: avgAbs == null ? null : round2(avgAbs),
          taAverage: s.taAverage,
          aiAverage: s.aiAverage,
          paperGap: s.paperGap,
          flagged: s.flaggedQuestionCodes.length > 0,
          flaggedQuestionCodes: s.flaggedQuestionCodes,
          questions: s.questions.map((q) => ({
            code: q.code,
            averageGap: q.averageGap,
            sampleSize: q.sampleSize,
            flagged: q.flagged,
          })),
        };
      },
    );
    tas.sort((a, b) => {
      if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
      return absOrInf(b.paperGap) - absOrInf(a.paperGap);
    });

    const questionRows: ExamReportQuestion[] = questions.map((q, i) => ({
      questionId: q.id,
      code: q.code,
      title: q.title,
      maxPoints: q.maxPoints,
      threshold: threshold(q.maxPoints),
      tas: tas.map((t) => ({
        taId: t.taId,
        taName: t.taName,
        averageGap: t.questions[i].averageGap,
        sampleSize: t.questions[i].sampleSize,
        flagged: t.questions[i].flagged,
      })),
    }));

    const papers: ExamReportPaper[] = graded
      .map((p) => ({
        ...paperGap(p, questions),
        taId: p.ta.id,
        taName: p.ta.name,
      }))
      .sort((a, b) => absOrInf(b.gap) - absOrInf(a.gap));

    const complete = papers.filter((p) => p.gap != null);
    const taAverage = mean(complete.map((p) => p.taTotal!));
    const aiAverage = mean(complete.map((p) => p.aiTotal!));

    // Headline: the flagged TA with the largest paper gap, on their worst question.
    let headline: ExamReportResponse['headline'] = null;
    const top = tas.find((t) => t.flagged);
    if (top) {
      const worst = questionRows
        .map((q) => ({ q, row: q.tas.find((t) => t.taId === top.taId)! }))
        .filter((x) => x.row.flagged)
        .sort(
          (a, b) => absOrInf(b.row.averageGap) - absOrInf(a.row.averageGap),
        )[0];
      headline = {
        taId: top.taId,
        taName: top.taName,
        paperGap: top.paperGap,
        papersGraded: top.papersGraded,
        questionCode: worst.q.code,
        questionTitle: worst.q.title,
        maxPoints: worst.q.maxPoints,
        questionGap: worst.row.averageGap!,
        threshold: worst.q.threshold,
      };
    }

    return {
      exam: { id: exam.id, name: exam.name, maxTotal },
      course: {
        id: exam.course.id,
        code: exam.course.code,
        name: exam.course.name,
      },
      totalPapers,
      submittedPapers,
      aiGradedPapers: graded.length,
      aiGradingPapers,
      aiFailedPapers,
      taAverage: taAverage == null ? null : round2(taAverage),
      aiAverage: aiAverage == null ? null : round2(aiAverage),
      flaggedTaCount: tas.filter((t) => t.flagged).length,
      headline,
      questions: questionRows,
      tas,
      papers,
    };
  }
}
