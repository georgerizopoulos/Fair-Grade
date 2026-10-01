import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import type { PaperStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  ExamReportResponse,
  MyStatsResponse,
  TaDetailReportResponse,
  TaReportFlaggedPaper,
  TaReportPaper,
  TaReportQuestionGap,
} from './reports.dto.js';

const DRAFT_STATUSES: PaperStatus[] = ['TRANSCRIBING', 'DRAFT'];
const FLAG_RATIO = 0.15;
const MIN_SAMPLES = 3;

interface StubQuestion {
  id: string;
  code: string;
  title: string;
  maxPoints: number;
}

interface StubPaper {
  id: string;
  studentId: string;
  submittedAt: Date | null;
}

function stubStatistics(
  questions: StubQuestion[],
  papers: StubPaper[],
  comparedPapers: number,
): Pick<
  MyStatsResponse,
  'summary' | 'paperComparisons' | 'questions' | 'worthASecondLook' | 'badges' | 'leaderboard'
> {
  // Replace these null statistics with the corresponding functions from src/stats/ when available.
  return {
    summary: {
      taAverage: null,
      aiAverage: null,
      averageGap: null,
      exactMatches: null,
      withinHalfPoint: null,
      comparedPapers,
      medianTimePerPaperMs: null,
      largestGap: null,
      flaggedQuestionCount: null,
    },
    paperComparisons: papers.map((paper) => ({
      paperId: paper.id,
      studentId: paper.studentId,
      status: 'AI_GRADED',
      submittedAt: paper.submittedAt,
      taTotal: null,
      aiTotal: null,
      gap: null,
    })),
    questions: questions.map((question) => ({
      questionId: question.id,
      code: question.code,
      title: question.title,
      maxPoints: question.maxPoints,
      sampleSize: null,
      taAverage: null,
      aiAverage: null,
      averageGap: null,
      flagged: null,
    })),
    worthASecondLook: [],
    badges: [],
    leaderboard: [],
  };
}

function computeQuestionGap(
  question: StubQuestion,
  answers: { taPoints: number | null; aiPoints: number | null }[],
): TaReportQuestionGap {
  const pairs = answers.filter(
    (a): a is { taPoints: number; aiPoints: number } =>
      a.taPoints != null && a.aiPoints != null,
  );
  const sampleSize = pairs.length;
  const threshold = +(FLAG_RATIO * question.maxPoints).toFixed(2);

  if (sampleSize === 0) {
    return {
      questionId: question.id,
      code: question.code,
      title: question.title,
      maxPoints: question.maxPoints,
      sampleSize: 0,
      taAverage: null,
      aiAverage: null,
      averageGap: null,
      threshold,
      flagged: false,
    };
  }

  const taAvg = +(pairs.reduce((s, p) => s + p.taPoints, 0) / sampleSize).toFixed(2);
  const aiAvg = +(pairs.reduce((s, p) => s + p.aiPoints, 0) / sampleSize).toFixed(2);
  const avgGap = +(taAvg - aiAvg).toFixed(2);
  const flagged = sampleSize >= MIN_SAMPLES && Math.abs(avgGap) > threshold;

  return {
    questionId: question.id,
    code: question.code,
    title: question.title,
    maxPoints: question.maxPoints,
    sampleSize,
    taAverage: taAvg,
    aiAverage: aiAvg,
    averageGap: avgGap,
    threshold,
    flagged,
  };
}

@Injectable()
export class ReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  async myStats(user: AuthUser, examId: string): Promise<MyStatsResponse> {
    const exam = await this.access.exam(user, examId);
    if (user.role !== 'ta') {
      throw new ForbiddenException('Only TAs can view their exam stats');
    }

    const ownPaperWhere = { examId, taId: user.id };
    const [total, submitted, aiGraded, pending, drafts, papers, questions] =
      await Promise.all([
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
            submittedAt: true,
          },
          orderBy: { submittedAt: 'asc' },
        }),
        this.prisma.question.findMany({
          where: { examId },
          select: { id: true, code: true, title: true, maxPoints: true },
          orderBy: { order: 'asc' },
        }),
      ]);

    const statistics = stubStatistics(questions, papers, aiGraded);
    const leaderboardAllowed = exam.course.leaderboardVisibility !== 'OFF';

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
      summary: statistics.summary,
      paperComparisons: statistics.paperComparisons,
      questions: statistics.questions,
      worthASecondLook: statistics.worthASecondLook,
      ...(leaderboardAllowed
        ? {
            leaderboard: statistics.leaderboard,
            badges: statistics.badges,
          }
        : {}),
    };
  }

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
      select: { id: true, code: true, title: true, maxPoints: true },
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
          },
        },
      },
      orderBy: { studentId: 'asc' },
    });

    if (papers.length === 0) {
      throw new NotFoundException(
        `TA ${ta.name} has no AI-graded papers in this exam`,
      );
    }

    const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);

    const questionGaps: TaReportQuestionGap[] = questions.map((q) => {
      const answersForQ = papers.flatMap((p) =>
        p.answers
          .filter((a) => a.questionId === q.id)
          .map((a) => ({ taPoints: a.taPoints, aiPoints: a.aiPoints })),
      );
      return computeQuestionGap(q, answersForQ);
    });

    const flaggedQuestionCodes = questionGaps
      .filter((q) => q.flagged)
      .map((q) => q.code);

    const flaggedPapers: Record<string, TaReportFlaggedPaper[]> = {};
    for (const qGap of questionGaps) {
      if (!qGap.flagged) continue;
      const rows: TaReportFlaggedPaper[] = [];
      for (const paper of papers) {
        const answer = paper.answers.find((a) => a.questionId === qGap.questionId);
        if (answer?.taPoints != null && answer?.aiPoints != null) {
          const gap = +(answer.taPoints - answer.aiPoints).toFixed(2);
          rows.push({
            paperId: paper.id,
            studentId: paper.studentId,
            taPoints: answer.taPoints,
            aiPoints: answer.aiPoints,
            gap,
            aiReasoning: answer.aiReasoning,
          });
        }
      }
      rows.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
      flaggedPapers[qGap.code] = rows;
    }

    const paperRows: TaReportPaper[] = papers.map((p) => {
      const answerMap = new Map(p.answers.map((a) => [a.questionId, a]));
      const qRows = questions.map((q) => {
        const a = answerMap.get(q.id);
        return {
          questionId: q.id,
          code: q.code,
          maxPoints: q.maxPoints,
          taPoints: a?.taPoints ?? null,
          aiPoints: a?.aiPoints ?? null,
        };
      });
      const taTotal = qRows.every((r) => r.taPoints != null)
        ? qRows.reduce((s, r) => s + r.taPoints!, 0)
        : null;
      const aiTotal = qRows.every((r) => r.aiPoints != null)
        ? qRows.reduce((s, r) => s + r.aiPoints!, 0)
        : null;
      return {
        paperId: p.id,
        studentId: p.studentId,
        questions: qRows,
        taTotal,
        aiTotal,
        gap: taTotal != null && aiTotal != null ? +(taTotal - aiTotal).toFixed(2) : null,
      };
    });

    const allTa = paperRows.filter((p) => p.taTotal != null).map((p) => p.taTotal!);
    const allAi = paperRows.filter((p) => p.aiTotal != null).map((p) => p.aiTotal!);
    const taAverage = allTa.length > 0 ? +(allTa.reduce((s, v) => s + v, 0) / allTa.length).toFixed(2) : null;
    const aiAverage = allAi.length > 0 ? +(allAi.reduce((s, v) => s + v, 0) / allAi.length).toFixed(2) : null;
    const paperGap = taAverage != null && aiAverage != null ? +(taAverage - aiAverage).toFixed(2) : null;

    return {
      exam: { id: exam.id, name: exam.name, maxTotal },
      course: { id: exam.course.id, code: exam.course.code, name: exam.course.name },
      ta: { id: ta.id, name: ta.name, email: ta.email },
      papersGraded: papers.length,
      taAverage,
      aiAverage,
      paperGap,
      flaggedQuestionCodes,
      questions: questionGaps,
      flaggedPapers,
      papers: paperRows,
    };
  }

  async examReport(
    user: AuthUser,
    examId: string,
  ): Promise<ExamReportResponse> {
    const exam = await this.access.ownedExam(user, examId);

    const questions = await this.prisma.question.findMany({
      where: { examId },
      select: { id: true, code: true, title: true, maxPoints: true },
      orderBy: { order: 'asc' },
    });
    const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);

    const allPapers = await this.prisma.paper.findMany({
      where: { examId, status: 'AI_GRADED' },
      include: {
        ta: { select: { id: true, name: true } },
        answers: {
          select: { questionId: true, taPoints: true, aiPoints: true },
        },
      },
    });

    const totalPapers = await this.prisma.paper.count({ where: { examId } });

    const byTa = new Map<string, { name: string; papers: typeof allPapers }>();
    for (const p of allPapers) {
      const existing = byTa.get(p.ta.id);
      if (existing) {
        existing.papers.push(p);
      } else {
        byTa.set(p.ta.id, { name: p.ta.name, papers: [p] });
      }
    }

    const tas = [...byTa.entries()].map(([taId, { name, papers }]) => {
      const questionGaps = questions.map((q) => {
        const answersForQ = papers.flatMap((p) =>
          p.answers
            .filter((a) => a.questionId === q.id)
            .map((a) => ({ taPoints: a.taPoints, aiPoints: a.aiPoints })),
        );
        return computeQuestionGap(q, answersForQ);
      });
      const flaggedCodes = questionGaps.filter((q) => q.flagged).map((q) => q.code);
      const gaps = questionGaps.filter((q) => q.averageGap != null).map((q) => q.averageGap!);
      const averageGap = gaps.length > 0
        ? +(gaps.reduce((s, v) => s + Math.abs(v), 0) / gaps.length).toFixed(2)
        : null;

      return {
        taId,
        taName: name,
        papersGraded: papers.length,
        averageGap,
        flagged: flaggedCodes.length > 0,
        flaggedQuestionCodes: flaggedCodes,
      };
    });

    tas.sort((a, b) => {
      if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
      return (b.averageGap ?? 0) - (a.averageGap ?? 0);
    });

    return {
      exam: { id: exam.id, name: exam.name, maxTotal },
      course: { id: exam.course.id, code: exam.course.code, name: exam.course.name },
      totalPapers,
      aiGradedPapers: allPapers.length,
      tas,
    };
  }

  async taExamReport(
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
      select: { id: true, code: true, title: true, maxPoints: true },
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
          },
        },
      },
      orderBy: { studentId: 'asc' },
    });

    if (papers.length === 0) {
      throw new NotFoundException(
        `TA ${ta.name} has no AI-graded papers in this exam`,
      );
    }

    const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);

    const questionGaps: TaReportQuestionGap[] = questions.map((q) => {
      const answersForQ = papers.flatMap((p) =>
        p.answers
          .filter((a) => a.questionId === q.id)
          .map((a) => ({ taPoints: a.taPoints, aiPoints: a.aiPoints })),
      );
      return computeQuestionGap(q, answersForQ);
    });

    const flaggedQuestionCodes = questionGaps
      .filter((q) => q.flagged)
      .map((q) => q.code);

    const flaggedPapers: Record<string, TaReportFlaggedPaper[]> = {};
    for (const qGap of questionGaps) {
      if (!qGap.flagged) continue;
      const rows: TaReportFlaggedPaper[] = [];
      for (const paper of papers) {
        const answer = paper.answers.find((a) => a.questionId === qGap.questionId);
        if (answer?.taPoints != null && answer?.aiPoints != null) {
          const gap = +(answer.taPoints - answer.aiPoints).toFixed(2);
          rows.push({
            paperId: paper.id,
            studentId: paper.studentId,
            taPoints: answer.taPoints,
            aiPoints: answer.aiPoints,
            gap,
            aiReasoning: answer.aiReasoning,
          });
        }
      }
      rows.sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
      flaggedPapers[qGap.code] = rows;
    }

    const paperRows: TaReportPaper[] = papers.map((p) => {
      const answerMap = new Map(p.answers.map((a) => [a.questionId, a]));
      const qRows = questions.map((q) => {
        const a = answerMap.get(q.id);
        return {
          questionId: q.id,
          code: q.code,
          maxPoints: q.maxPoints,
          taPoints: a?.taPoints ?? null,
          aiPoints: a?.aiPoints ?? null,
        };
      });
      const taTotal = qRows.every((r) => r.taPoints != null)
        ? qRows.reduce((s, r) => s + r.taPoints!, 0)
        : null;
      const aiTotal = qRows.every((r) => r.aiPoints != null)
        ? qRows.reduce((s, r) => s + r.aiPoints!, 0)
        : null;
      return {
        paperId: p.id,
        studentId: p.studentId,
        questions: qRows,
        taTotal,
        aiTotal,
        gap: taTotal != null && aiTotal != null ? +(taTotal - aiTotal).toFixed(2) : null,
      };
    });

    const allTa = paperRows.filter((p) => p.taTotal != null).map((p) => p.taTotal!);
    const allAi = paperRows.filter((p) => p.aiTotal != null).map((p) => p.aiTotal!);
    const taAverage = allTa.length > 0 ? +(allTa.reduce((s, v) => s + v, 0) / allTa.length).toFixed(2) : null;
    const aiAverage = allAi.length > 0 ? +(allAi.reduce((s, v) => s + v, 0) / allAi.length).toFixed(2) : null;
    const paperGap = taAverage != null && aiAverage != null ? +(taAverage - aiAverage).toFixed(2) : null;

    return {
      exam: { id: exam.id, name: exam.name, maxTotal },
      course: { id: exam.course.id, code: exam.course.code, name: exam.course.name },
      ta: { id: ta.id, name: ta.name, email: ta.email },
      papersGraded: papers.length,
      taAverage,
      aiAverage,
      paperGap,
      flaggedQuestionCodes,
      questions: questionGaps,
      flaggedPapers,
      papers: paperRows,
    };
  }
}