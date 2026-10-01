import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { buildCourseStats } from '../reports/course-stats.js';
import { paperGap } from '../reports/report-math.js';
import { CourseSettingsDto, CreateCourseDto } from './courses.dto.js';

// Exams in date order; exams without a date go last.
function byHeldAt<T extends { heldAt: Date | null; createdAt: Date }>(
  a: T,
  b: T,
) {
  const at = a.heldAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
  const bt = b.heldAt?.getTime() ?? Number.MAX_SAFE_INTEGER;
  return at - bt || a.createdAt.getTime() - b.createdAt.getTime();
}

@Injectable()
export class CoursesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
  ) {}

  // GET /courses: a TA only gets the courses they're a member of.
  async list(user: AuthUser) {
    const isTa = user.role === 'ta';
    const courses = await this.prisma.course.findMany({
      where: this.access.visibleCourseFilter(user),
      include: {
        // A TA doesn't see exams the instructor hasn't opened for grading yet.
        exams: isTa
          ? { where: { status: { in: ['OPEN', 'PUBLISHED'] } } }
          : true,
        _count: { select: { members: { where: { role: 'ta' } } } },
      },
      orderBy: { code: 'asc' },
    });

    return {
      viewerRole: user.role,
      courses: courses.map((c) => {
        const exams = [...c.exams].sort(byHeldAt);
        const latest = exams.at(-1);
        return {
          id: c.id,
          code: c.code,
          name: c.name,
          semester: c.semester,
          examCount: exams.length,
          taCount: c._count.members,
          latestExam: latest
            ? {
                id: latest.id,
                name: latest.name,
                status: latest.status,
                heldAt: latest.heldAt,
              }
            : null,
        };
      }),
    };
  }

  async create(user: AuthUser, dto: CreateCourseDto) {
    const clash = await this.prisma.course.findFirst({
      where: { OR: [{ code: dto.code }, { name: dto.name }] },
    });
    if (clash) {
      throw new ConflictException(
        `A course with code ${dto.code} or name "${dto.name}" already exists`,
      );
    }
    const course = await this.prisma.course.create({
      data: {
        code: dto.code,
        name: dto.name,
        semester: dto.semester,
        ownerId: user.id,
      },
    });
    return this.get(user, course.id);
  }

  // GET /courses/:id: header, exams in date order with progress, members.
  // A TA sees a narrower view than the instructor: only exams that are open for
  // grading or already published (not the drafts the instructor is still
  // preparing), progress for their own papers only, and no leaderboard setting
  // or cohort-wide numbers.
  async get(user: AuthUser, courseId: string) {
    await this.access.course(user, courseId);
    const isTa = user.role === 'ta';

    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        owner: { select: { id: true, name: true } },
        exams: {
          include: {
            _count: { select: { questions: true } },
            papers: {
              // A TA only ever counts their own papers.
              where: isTa ? { taId: user.id } : undefined,
              select: { status: true },
            },
          },
        },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { addedAt: 'asc' },
        },
      },
    });

    // TAs don't see exams the instructor hasn't opened for grading yet.
    const TA_VISIBLE: Set<string> = new Set(['OPEN', 'PUBLISHED']);
    const exams = [...course.exams]
      .filter((e) => !isTa || TA_VISIBLE.has(e.status))
      .sort(byHeldAt)
      .map((e) => {
        const count = (status: string) =>
          e.papers.filter((p) => p.status === status).length;
        const progress = {
          papers: e.papers.length,
          drafts: count('DRAFT') + count('TRANSCRIBING'),
          submitted:
            count('AI_GRADING') + count('AI_GRADED') + count('AI_FAILED'),
          aiGrading: count('AI_GRADING'),
          aiGraded: count('AI_GRADED'),
          aiFailed: count('AI_FAILED'),
        };
        return {
          id: e.id,
          name: e.name,
          heldAt: e.heldAt,
          status: e.status,
          passMark: e.passMark,
          questionCount: e._count.questions,
          // A TA can only add papers to an exam that is open for grading.
          ...(isTa ? { canAddPapers: e.status === 'OPEN' } : {}),
          // For a TA, progress counts only their own papers (see the query above).
          progress,
        };
      });

    return {
      viewerRole: user.role,
      id: course.id,
      code: course.code,
      name: course.name,
      semester: course.semester,
      // Leaderboard visibility is an instructor setting; TAs don't see it.
      ...(isTa ? {} : { leaderboardVisibility: course.leaderboardVisibility }),
      owner: course.owner
        ? { ...course.owner, isYou: course.owner.id === user.id }
        : null,
      exams,
      members: course.members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        role: m.role,
        addedAt: m.addedAt,
        isYou: m.user.id === user.id,
      })),
    };
  }

  async updateSettings(
    user: AuthUser,
    courseId: string,
    dto: CourseSettingsDto,
  ) {
    await this.access.ownedCourse(user, courseId);
    const course = await this.prisma.course.update({
      where: { id: courseId },
      data: { leaderboardVisibility: dto.leaderboardVisibility },
    });
    return {
      id: course.id,
      leaderboardVisibility: course.leaderboardVisibility,
    };
  }

  // GET /courses/:id/stats: TA vs AI across every exam of the course.
  async stats(user: AuthUser, courseId: string, examId?: string) {
    await this.access.ownedCourse(user, courseId);

    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        exams: {
          select: {
            id: true,
            name: true,
            heldAt: true,
            createdAt: true,
            passMark: true,
            status: true,
            questions: {
              select: { id: true, code: true, title: true, maxPoints: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
    const exams = [...course.exams].sort(byHeldAt);
    if (examId && !exams.some((e) => e.id === examId)) {
      throw new NotFoundException(`Exam ${examId} is not in this course`);
    }

    const papers = await this.prisma.paper.findMany({
      where: { exam: { courseId } },
      select: {
        id: true,
        studentId: true,
        examId: true,
        taId: true,
        status: true,
        createdAt: true,
        submittedAt: true,
        ta: { select: { name: true } },
        answers: {
          select: { questionId: true, taPoints: true, aiPoints: true },
        },
      },
    });

    return {
      viewerRole: user.role,
      course: {
        id: course.id,
        code: course.code,
        name: course.name,
        semester: course.semester,
        leaderboardVisibility: course.leaderboardVisibility,
      },
      exams: exams.map((exam) => ({
        id: exam.id,
        name: exam.name,
        heldAt: exam.heldAt,
        status: exam.status,
        passMark: exam.passMark,
      })),
      focusExamId: examId ?? null,
      ...buildCourseStats(
        exams,
        papers.map(({ ta, ...p }) => ({ ...p, taName: ta.name })),
        examId,
      ),
    };
  }

  // GET /courses/:id/activity: the latest entries of the course feed, with
  // names and, for AI results, the largest gap on the paper.
  async activity(user: AuthUser, courseId: string, limit: number) {
    await this.access.ownedCourse(user, courseId);

    const entries = await this.prisma.activityLog.findMany({
      where: { courseId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        actor: { select: { id: true, name: true } },
        paper: {
          select: {
            id: true,
            studentId: true,
            status: true,
            taId: true,
            ta: { select: { id: true, name: true } },
            exam: {
              select: {
                id: true,
                name: true,
                questions: {
                  select: {
                    id: true,
                    code: true,
                    title: true,
                    maxPoints: true,
                  },
                },
              },
            },
            answers: {
              select: { questionId: true, taPoints: true, aiPoints: true },
            },
          },
        },
      },
    });

    // Names and exams referenced only by id in the payload.
    const payloads = entries.map(
      (e) => (e.payload ?? {}) as Record<string, unknown>,
    );
    const ids = (key: string) => [
      ...new Set(
        payloads
          .map((p) => p[key])
          .filter((v): v is string => typeof v === 'string'),
      ),
    ];
    const [users, examRows] = await Promise.all([
      this.prisma.user.findMany({
        where: { id: { in: [...ids('taId'), ...ids('userId')] } },
        select: { id: true, name: true },
      }),
      this.prisma.exam.findMany({
        where: { id: { in: ids('examId') } },
        select: { id: true, name: true },
      }),
    ]);
    const userName = new Map(users.map((u) => [u.id, u.name]));
    const examName = new Map(examRows.map((e) => [e.id, e.name]));

    return {
      activity: entries.map((e, i) => {
        const p = payloads[i];
        const taId =
          (typeof p.taId === 'string' ? p.taId : null) ?? e.paper?.taId ?? null;
        const result =
          e.type === 'AI_GRADED' && e.paper
            ? paperGap(e.paper, e.paper.exam.questions)
            : null;
        return {
          id: e.id,
          type: e.type,
          createdAt: e.createdAt,
          actor: e.actor,
          ta: taId
            ? {
                id: taId,
                name: userName.get(taId) ?? e.paper?.ta.name ?? 'A TA',
              }
            : null,
          member:
            typeof p.userId === 'string'
              ? {
                  id: p.userId,
                  name: userName.get(p.userId) ?? String(p.name ?? 'A TA'),
                }
              : null,
          paper: e.paper
            ? {
                id: e.paper.id,
                studentId: e.paper.studentId,
                status: e.paper.status,
              }
            : typeof p.studentId === 'string'
              ? { id: null, studentId: p.studentId, status: null }
              : null,
          exam:
            typeof p.examId === 'string'
              ? { id: p.examId, name: examName.get(p.examId) ?? '' }
              : e.paper
                ? { id: e.paper.exam.id, name: e.paper.exam.name }
                : null,
          questionCode:
            typeof p.questionCode === 'string' ? p.questionCode : null,
          averageGap: typeof p.averageGap === 'number' ? p.averageGap : null,
          aiResult: result
            ? {
                gap: result.gap,
                mostlyCode: result.mostlyCode,
                largestGap: largestOnPaper(
                  e.paper!.answers,
                  result.mostlyCode,
                  e.paper!.exam.questions,
                ),
              }
            : null,
          error: typeof p.error === 'string' ? p.error : null,
        };
      }),
    };
  }
}

// TA − AI on the question that differs most on one paper (e.g. −1 on Q2).
function largestOnPaper(
  answers: {
    questionId: string;
    taPoints: number | null;
    aiPoints: number | null;
  }[],
  code: string | null,
  questions: { id: string; code: string }[],
) {
  const q = questions.find((x) => x.code === code);
  const a = q && answers.find((x) => x.questionId === q.id);
  return a?.taPoints != null && a.aiPoints != null
    ? a.taPoints - a.aiPoints
    : 0;
}
