import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import type { AuthUser } from '../common/auth.decorators.js';
import type { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto, UpdateUserDto } from './users.dto.js';

const publicUser = {
  id: true,
  name: true,
  email: true,
  role: true,
  status: true,
  lastSignInAt: true,
  createdAt: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /users: everyone who can sign in, with the courses they're in.
  async list(viewer: AuthUser, role?: Role) {
    const users = await this.prisma.user.findMany({
      where: role ? { role } : {},
      select: {
        ...publicUser,
        memberships: {
          select: { course: { select: { id: true, code: true } } },
        },
        ownedCourses: { select: { id: true, code: true } },
      },
      orderBy: { name: 'asc' },
    });
    return {
      viewerRole: viewer.role,
      users: users.map(({ memberships, ownedCourses, ...u }) => ({
        ...u,
        courses: [...ownedCourses, ...memberships.map((m) => m.course)],
        isYou: u.id === viewer.id,
      })),
    };
  }

  // Shared with POST /courses/:id/members ("create an account and add it").
  async create(dto: CreateUserDto) {
    const email = dto.email.toLowerCase();
    if (await this.prisma.user.findUnique({ where: { email } })) {
      throw new ConflictException(`Email ${email} is already registered`);
    }
    const temporaryPassword =
      dto.mode === 'invite' ? randomBytes(6).toString('base64url') : undefined;
    const password =
      dto.mode === 'password' ? dto.password! : temporaryPassword!;

    const user = await this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        role: dto.role,
        passwordHash: await bcrypt.hash(password, 10),
        status: dto.mode === 'invite' ? 'INVITED' : 'ACTIVE',
      },
      select: publicUser,
    });
    // Shown once so the instructor can pass it on; never stored in plain text.
    return temporaryPassword ? { ...user, temporaryPassword } : user;
  }

  async update(viewer: AuthUser, id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    if (
      id === viewer.id &&
      (dto.status === 'DEACTIVATED' || dto.role === 'ta')
    ) {
      throw new BadRequestException(
        "You can't deactivate yourself or remove your own instructor role",
      );
    }

    const email = dto.email?.toLowerCase();
    if (email && email !== user.email) {
      if (await this.prisma.user.findUnique({ where: { email } })) {
        throw new ConflictException(`Email ${email} is already registered`);
      }
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: dto.name,
        email,
        role: dto.role,
        // Reactivating someone who never signed in puts them back to INVITED.
        status:
          dto.status === 'ACTIVE' && !user.lastSignInAt
            ? 'INVITED'
            : dto.status,
      },
      select: publicUser,
    });
  }
}
