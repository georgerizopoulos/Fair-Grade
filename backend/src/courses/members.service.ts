import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import { ActivityService } from '../activity/activity.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UsersService } from '../users/users.service.js';
import { AddMemberDto } from './members.dto.js';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
    private readonly users: UsersService,
    private readonly activity: ActivityService,
  ) {}

  // GET /courses/:id/members: the owner plus every TA, with papers graded here.
  async list(viewer: AuthUser, courseId: string) {
    const course = await this.access.course(viewer, courseId);
    const [owner, members, graded] = await Promise.all([
      course.ownerId
        ? this.prisma.user.findUnique({
            where: { id: course.ownerId },
            select: { id: true, name: true, email: true, status: true },
          })
        : null,
      this.prisma.courseMember.findMany({
        where: { courseId },
        include: {
          user: { select: { id: true, name: true, email: true, status: true } },
        },
        orderBy: { addedAt: 'asc' },
      }),
      this.prisma.paper.groupBy({
        by: ['taId'],
        where: { exam: { courseId }, submittedAt: { not: null } },
        _count: { _all: true },
      }),
    ]);
    const papersBy = new Map(graded.map((g) => [g.taId, g._count._all]));

    return {
      viewerRole: viewer.role,
      owner: owner
        ? { ...owner, userId: owner.id, isYou: owner.id === viewer.id }
        : null,
      members: members.map((m) => ({
        userId: m.user.id,
        name: m.user.name,
        email: m.user.email,
        status: m.user.status,
        role: m.role,
        addedAt: m.addedAt,
        papersGraded: papersBy.get(m.user.id) ?? 0,
        isYou: m.user.id === viewer.id,
      })),
    };
  }

  async add(viewer: AuthUser, courseId: string, dto: AddMemberDto) {
    await this.access.ownedCourse(viewer, courseId);

    let user: { id: string; name: string; role: string };
    let temporaryPassword: string | undefined;
    if (dto.userId) {
      const found = await this.prisma.user.findUnique({
        where: { id: dto.userId },
      });
      if (!found) throw new NotFoundException(`User ${dto.userId} not found`);
      user = found;
    } else {
      const created = await this.users.create({
        name: dto.name!,
        email: dto.email!,
        role: 'ta',
        mode: dto.password ? 'password' : 'invite',
        password: dto.password,
      });
      user = created;
      temporaryPassword =
        'temporaryPassword' in created ? created.temporaryPassword : undefined;
    }

    if (user.role !== 'ta') {
      throw new BadRequestException(
        `${user.name} is an instructor; only TAs are added as members`,
      );
    }
    const existing = await this.prisma.courseMember.findUnique({
      where: { courseId_userId: { courseId, userId: user.id } },
    });
    if (existing)
      throw new ConflictException(
        `${user.name} is already a member of this course`,
      );

    await this.prisma.courseMember.create({
      data: { courseId, userId: user.id, role: 'ta' },
    });
    await this.activity.log({
      courseId,
      type: 'MEMBER_ADDED',
      actorId: viewer.id,
      payload: { userId: user.id, name: user.name },
    });

    return {
      userId: user.id,
      name: user.name,
      role: 'ta' as const,
      ...(temporaryPassword ? { temporaryPassword } : {}),
    };
  }

  // Removing access keeps the TA's submitted papers; they still count in reports.
  async remove(viewer: AuthUser, courseId: string, userId: string) {
    await this.access.ownedCourse(viewer, courseId);
    const member = await this.prisma.courseMember.findUnique({
      where: { courseId_userId: { courseId, userId } },
      include: { user: { select: { name: true } } },
    });
    if (!member)
      throw new NotFoundException(
        `User ${userId} is not a member of this course`,
      );

    await this.prisma.courseMember.delete({
      where: { courseId_userId: { courseId, userId } },
    });
    await this.activity.log({
      courseId,
      type: 'MEMBER_REMOVED',
      actorId: viewer.id,
      payload: { userId, name: member.user.name },
    });
    return { removed: true, userId };
  }
}
