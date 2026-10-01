import { ConflictException, Injectable } from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';
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
    const courses = await this.prisma.course.findMany({
      where: this.access.visibleCourseFilter(user),
      include: {
        exams: true,
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
  async get(user: AuthUser, courseId: string) {
    await this.access.course(user, courseId);

    const course = await this.prisma.course.findUniqueOrThrow({
      where: { id: courseId },
      include: {
        owner: { select: { id: true, name: true } },
        exams: {
          include: {
            _count: { select: { questions: true } },
            papers: { select: { status: true } },
          },
        },
        members: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { addedAt: 'asc' },
        },
      },
    });

    return {
      viewerRole: user.role,
      id: course.id,
      code: course.code,
      name: course.name,
      semester: course.semester,
      leaderboardVisibility: course.leaderboardVisibility,
      owner: course.owner
        ? { ...course.owner, isYou: course.owner.id === user.id }
        : null,
      exams: [...course.exams].sort(byHeldAt).map((e) => {
        const count = (status: string) =>
          e.papers.filter((p) => p.status === status).length;
        return {
          id: e.id,
          name: e.name,
          heldAt: e.heldAt,
          status: e.status,
          passMark: e.passMark,
          questionCount: e._count.questions,
          progress: {
            papers: e.papers.length,
            drafts: count('DRAFT') + count('TRANSCRIBING'),
            submitted:
              count('AI_GRADING') + count('AI_GRADED') + count('AI_FAILED'),
            aiGrading: count('AI_GRADING'),
            aiGraded: count('AI_GRADED'),
            aiFailed: count('AI_FAILED'),
          },
        };
      }),
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
}
