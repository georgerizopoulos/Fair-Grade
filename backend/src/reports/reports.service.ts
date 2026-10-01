import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import type { PaperStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { MyStatsResponse } from './reports.dto.js';

const DRAFT_STATUSES: PaperStatus[] = ['TRANSCRIBING', 'DRAFT'];

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
}