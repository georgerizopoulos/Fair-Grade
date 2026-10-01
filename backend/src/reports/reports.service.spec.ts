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
    access.exam.mockRejectedValue(new ForbiddenException('not a course member'));

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
    expect(
      Reflect.getMetadata(ROLES_KEY, handler),
    ).toEqual(['ta']);
  });
});