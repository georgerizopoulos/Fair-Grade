import { ForbiddenException, NotFoundException } from '@nestjs/common';
import type { AuthUser } from '../common/auth.decorators.js';
import type { PrismaService } from '../prisma/prisma.service.js';
import type { AccessService } from '../access/access.service.js';
import { ROLES_KEY } from '../common/auth.decorators.js';
import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';

describe('ReportsService.myStats', () => {
  const ta: AuthUser = {
    id: 'ta-1',
    name: 'TA',
    email: 'ta@example.test',
    role: 'ta',
  };

  let access: { exam: ReturnType<typeof vi.fn> };
  let prisma: {
    paper: {
      count: ReturnType<typeof vi.fn>;
      findMany: ReturnType<typeof vi.fn>;
    };
    question: { findMany: ReturnType<typeof vi.fn> };
  };
  let service: ReportsService;

  beforeEach(() => {
    access = {
      exam: vi.fn().mockResolvedValue({
        id: 'exam-1',
        name: 'Midterm',
        passMark: 5,
        courseId: 'course-1',
        course: {
          id: 'course-1',
          code: 'HY335',
          name: 'Computer Networks',
          leaderboardVisibility: 'ANONYMOUS',
        },
      }),
    };
    prisma = {
      paper: {
        count: vi.fn().mockResolvedValue(0),
        findMany: vi.fn().mockResolvedValue([]),
      },
      question: { findMany: vi.fn().mockResolvedValue([]) },
    };
    service = new ReportsService(
      prisma as unknown as PrismaService,
      access as unknown as AccessService,
    );
  });

  it('authorizes through AccessService and filters every paper query to the caller', async () => {
    await service.myStats(ta, 'exam-1');

    expect(access.exam).toHaveBeenCalledWith(ta, 'exam-1');
    for (const [query] of prisma.paper.count.mock.calls) {
      expect(query.where).toMatchObject({ examId: 'exam-1', taId: ta.id });
    }
    expect(prisma.paper.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { examId: 'exam-1', taId: ta.id, status: 'AI_GRADED' },
      }),
    );
  });

  it('propagates 403 when the TA is not a member of the course', async () => {
    access.exam.mockRejectedValue(
      new ForbiddenException('not a course member'),
    );

    await expect(service.myStats(ta, 'exam-1')).rejects.toThrow(
      ForbiddenException,
    );
    expect(prisma.paper.count).not.toHaveBeenCalled();
  });

  it('propagates 404 when the exam does not exist', async () => {
    access.exam.mockRejectedValue(new NotFoundException('exam not found'));

    await expect(service.myStats(ta, 'missing')).rejects.toThrow(
      NotFoundException,
    );
    expect(prisma.paper.count).not.toHaveBeenCalled();
  });

  it('omits leaderboard and badges when visibility is OFF', async () => {
    access.exam.mockResolvedValue({
      id: 'exam-1',
      name: 'Midterm',
      passMark: 5,
      courseId: 'course-1',
      course: {
        id: 'course-1',
        code: 'HY335',
        name: 'Computer Networks',
        leaderboardVisibility: 'OFF',
      },
    });

    const result = await service.myStats(ta, 'exam-1');

    expect(result).not.toHaveProperty('leaderboard');
    expect(result).not.toHaveProperty('badges');
  });

  it('restricts the endpoint controller method to TAs', () => {
    const handler = Object.getOwnPropertyDescriptor(
      ReportsController.prototype,
      'myStats',
    )?.value;
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['ta']);
  });
});

describe('ReportsService.examReport', () => {
  const instructor: AuthUser = {
    id: 'inst-1',
    name: 'Instructor',
    email: 'instructor@example.test',
    role: 'instructor',
  };

  let access: { ownedExam: ReturnType<typeof vi.fn> };
  let prisma: {
    question: { findMany: ReturnType<typeof vi.fn> };
    paper: {
      findMany: ReturnType<typeof vi.fn>;
      count: ReturnType<typeof vi.fn>;
    };
  };
  let service: ReportsService;

  beforeEach(() => {
    access = {
      ownedExam: vi.fn().mockResolvedValue({
        id: 'exam-1',
        name: 'Midterm',
        courseId: 'course-1',
        course: {
          id: 'course-1',
          code: 'HY335',
          name: 'Computer Networks',
        },
      }),
    };
    prisma = {
      question: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'q-1',
            code: 'Q1',
            title: 'Question 1',
            maxPoints: 3,
            order: 1,
          },
          {
            id: 'q-2',
            code: 'Q2',
            title: 'Question 2',
            maxPoints: 2,
            order: 2,
          },
        ]),
      },
      paper: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'paper-1',
            ta: { id: 'ta-1', name: 'TA One' },
            answers: [
              { questionId: 'q-1', taPoints: 2, aiPoints: 2 },
              { questionId: 'q-2', taPoints: 1.5, aiPoints: 1 },
            ],
          },
          {
            id: 'paper-2',
            ta: { id: 'ta-1', name: 'TA One' },
            answers: [
              { questionId: 'q-1', taPoints: 3, aiPoints: 2.5 },
              { questionId: 'q-2', taPoints: 1, aiPoints: 1 },
            ],
          },
        ]),
        count: vi.fn().mockResolvedValue(2),
      },
    };
    service = new ReportsService(
      prisma as unknown as PrismaService,
      access as unknown as AccessService,
    );
  });

  it('authorizes through AccessService and summarizes all TAs for the exam', async () => {
    const result = await service.examReport(instructor, 'exam-1');

    expect(access.ownedExam).toHaveBeenCalledWith(instructor, 'exam-1');
    expect(result.exam).toMatchObject({
      id: 'exam-1',
      name: 'Midterm',
      maxTotal: 5,
    });
    expect(result.tas).toHaveLength(1);
    expect(result.tas[0]).toMatchObject({
      taId: 'ta-1',
      taName: 'TA One',
      papersGraded: 2,
    });
  });

  it('restricts the endpoint controller method to instructors', () => {
    const handler = Object.getOwnPropertyDescriptor(
      ReportsController.prototype,
      'examReport',
    )?.value;
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['instructor']);
  });
});

describe('ReportsService.taDetailReport', () => {
  const instructor: AuthUser = {
    id: 'inst-1',
    name: 'Instructor',
    email: 'instructor@example.test',
    role: 'instructor',
  };
  const ta: AuthUser = {
    id: 'ta-1',
    name: 'TA',
    email: 'ta@example.test',
    role: 'ta',
  };

  let access: { ownedExam: ReturnType<typeof vi.fn> };
  let prisma: {
    user: { findUnique: ReturnType<typeof vi.fn> };
    question: { findMany: ReturnType<typeof vi.fn> };
    paper: { findMany: ReturnType<typeof vi.fn> };
  };
  let service: ReportsService;

  beforeEach(() => {
    access = {
      ownedExam: vi.fn().mockResolvedValue({
        id: 'exam-1',
        name: 'Midterm',
        courseId: 'course-1',
        course: {
          id: 'course-1',
          code: 'HY335',
          name: 'Computer Networks',
        },
      }),
    };
    prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'ta-1',
          name: 'TA One',
          email: 'ta@example.test',
          role: 'ta',
        }),
      },
      question: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'q-1',
            code: 'Q1',
            title: 'Question 1',
            maxPoints: 3,
            order: 1,
          },
        ]),
      },
      paper: {
        findMany: vi.fn().mockResolvedValue([
          {
            id: 'paper-1',
            studentId: 'csd5146',
            answers: [
              {
                questionId: 'q-1',
                taPoints: 2,
                aiPoints: 2,
                aiReasoning: 'Good',
              },
            ],
          },
        ]),
      },
    };
    service = new ReportsService(
      prisma as unknown as PrismaService,
      access as unknown as AccessService,
    );
  });

  it('restricts the endpoint controller method to instructors', () => {
    const handler = Object.getOwnPropertyDescriptor(
      ReportsController.prototype,
      'taDetailReport',
    )?.value;
    expect(Reflect.getMetadata(ROLES_KEY, handler)).toEqual(['instructor']);
  });

  it('returns 403 when a TA tries to access the report endpoint', async () => {
    access.ownedExam.mockRejectedValue(
      new ForbiddenException('not authorized'),
    );

    await expect(service.taDetailReport(ta, 'exam-1', 'ta-2')).rejects.toThrow(
      ForbiddenException,
    );
  });
});

describe('Flagging logic', () => {
  const instructor: AuthUser = {
    id: 'inst-1',
    name: 'Instructor',
    email: 'instructor@example.test',
    role: 'instructor',
  };

  let access: { ownedExam: ReturnType<typeof vi.fn> };
  let prisma: {
    user: { findUnique: ReturnType<typeof vi.fn> };
    question: { findMany: ReturnType<typeof vi.fn> };
    paper: { findMany: ReturnType<typeof vi.fn> };
  };
  let service: ReportsService;

  beforeEach(() => {
    access = {
      ownedExam: vi.fn().mockResolvedValue({
        id: 'exam-1',
        name: 'Midterm',
        courseId: 'course-1',
        course: {
          id: 'course-1',
          code: 'HY335',
          name: 'Computer Networks',
        },
      }),
    };
    prisma = {
      user: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'ta-1',
          name: 'Maria',
          email: 'maria@example.test',
          role: 'ta',
        }),
      },
      question: { findMany: vi.fn() },
      paper: { findMany: vi.fn() },
    };
    service = new ReportsService(
      prisma as unknown as PrismaService,
      access as unknown as AccessService,
    );
  });

  it('flags a TA with 1.05-point gap on a 3-point question over 3 papers (0.35 > 0.45 threshold = false, but 1.05 > 0.45 = true)', async () => {
    // Q1: 3 max points, threshold = 0.15 × 3 = 0.45
    // We need average gap > 0.45 to flag
    // TA gives 2, 2.5, 2.5 (avg 2.33), AI gives 1, 1, 1 (avg 1)
    // Gap = 2.33 - 1 = 1.33 which is > 0.45, so flagged
    prisma.question.findMany.mockResolvedValue([
      { id: 'q-1', code: 'Q1', title: 'Question 1', maxPoints: 3, order: 1 },
    ]);
    prisma.paper.findMany.mockResolvedValue([
      {
        id: 'p-1',
        studentId: 'csd001',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 1, aiReasoning: 'R1' },
        ],
      },
      {
        id: 'p-2',
        studentId: 'csd002',
        answers: [
          { questionId: 'q-1', taPoints: 2.5, aiPoints: 1, aiReasoning: 'R2' },
        ],
      },
      {
        id: 'p-3',
        studentId: 'csd003',
        answers: [
          { questionId: 'q-1', taPoints: 2.5, aiPoints: 1, aiReasoning: 'R3' },
        ],
      },
    ]);

    const result = await service.taDetailReport(instructor, 'exam-1', 'ta-1');

    // Average gap: (2-1 + 2.5-1 + 2.5-1) / 3 = (1 + 1.5 + 1.5) / 3 = 4/3 ≈ 1.33
    // Threshold: 0.15 × 3 = 0.45
    // 1.33 > 0.45 AND sample >= 3, so flagged = true
    expect(result.questions[0].flagged).toBe(true);
    expect(result.questions[0].sampleSize).toBe(3);
    expect(result.flaggedQuestionCodes).toContain('Q1');
  });

  it('does not flag a TA with a smaller gap below threshold', async () => {
    // Q1: 3 max points, threshold = 0.15 × 3 = 0.45
    // TA gives 2, 2, 2 (avg 2), AI gives 1.9, 1.9, 1.9 (avg 1.9)
    // Gap = 2 - 1.9 = 0.1 which is < 0.45, so not flagged
    prisma.question.findMany.mockResolvedValue([
      { id: 'q-1', code: 'Q1', title: 'Question 1', maxPoints: 3, order: 1 },
    ]);
    prisma.paper.findMany.mockResolvedValue([
      {
        id: 'p-1',
        studentId: 'csd001',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 1.9, aiReasoning: 'R1' },
        ],
      },
      {
        id: 'p-2',
        studentId: 'csd002',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 1.9, aiReasoning: 'R2' },
        ],
      },
      {
        id: 'p-3',
        studentId: 'csd003',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 1.9, aiReasoning: 'R3' },
        ],
      },
    ]);

    const result = await service.taDetailReport(instructor, 'exam-1', 'ta-1');

    // Average gap: (2-1.9) × 3 / 3 = 0.1
    // Threshold: 0.45
    // 0.1 < 0.45, so flagged = false
    expect(result.questions[0].flagged).toBe(false);
    expect(result.questions[0].sampleSize).toBe(3);
    expect(result.flaggedQuestionCodes).not.toContain('Q1');
  });

  it('does not flag when sample size is less than 3 even with large gap', async () => {
    // Q1: 3 max points, threshold = 0.45
    // Only 2 papers, gap = 2.0 (very large) but n < 3 so not flagged
    prisma.question.findMany.mockResolvedValue([
      { id: 'q-1', code: 'Q1', title: 'Question 1', maxPoints: 3, order: 1 },
    ]);
    prisma.paper.findMany.mockResolvedValue([
      {
        id: 'p-1',
        studentId: 'csd001',
        answers: [
          { questionId: 'q-1', taPoints: 3, aiPoints: 1, aiReasoning: 'R1' },
        ],
      },
      {
        id: 'p-2',
        studentId: 'csd002',
        answers: [
          { questionId: 'q-1', taPoints: 3, aiPoints: 1, aiReasoning: 'R2' },
        ],
      },
    ]);

    const result = await service.taDetailReport(instructor, 'exam-1', 'ta-1');

    expect(result.questions[0].flagged).toBe(false);
    expect(result.questions[0].sampleSize).toBe(2);
    expect(result.flaggedQuestionCodes).toHaveLength(0);
  });

  it('flags with exact 1.05 gap on a 2-point question (threshold = 0.3, 1.05 > 0.3)', async () => {
    // Q1: 2 max points, threshold = 0.15 × 2 = 0.30
    // TA gives 2, 2, 2 (avg 2), AI gives 0.95, 0.95, 0.95 (avg 0.95)
    // Gap = 2 - 0.95 = 1.05 which is > 0.30, so flagged
    prisma.question.findMany.mockResolvedValue([
      { id: 'q-1', code: 'Q1', title: 'Question 1', maxPoints: 2, order: 1 },
    ]);
    prisma.paper.findMany.mockResolvedValue([
      {
        id: 'p-1',
        studentId: 'csd001',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 0.95, aiReasoning: 'R1' },
        ],
      },
      {
        id: 'p-2',
        studentId: 'csd002',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 0.95, aiReasoning: 'R2' },
        ],
      },
      {
        id: 'p-3',
        studentId: 'csd003',
        answers: [
          { questionId: 'q-1', taPoints: 2, aiPoints: 0.95, aiReasoning: 'R3' },
        ],
      },
    ]);

    const result = await service.taDetailReport(instructor, 'exam-1', 'ta-1');

    expect(result.questions[0].flagged).toBe(true);
    expect(result.questions[0].threshold).toBe(0.3);
    expect(result.questions[0].averageGap).toBe(1.05);
    expect(result.flaggedQuestionCodes).toContain('Q1');
  });
});
