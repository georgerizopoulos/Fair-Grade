import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import type { JwtPayload } from '../common/auth.guard.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';

const BCRYPT_ROUNDS = 10;

// Fields safe to return; password_hash never leaves the backend.
const publicUser = { id: true, name: true, email: true, role: true } as const;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // Public sign-up is for instructors only: the department secretariat vouches
  // for them outside the app. TAs never sign themselves up; the course
  // instructor creates their account (POST /users, POST /courses/:id/members).
  async register(dto: RegisterDto) {
    if (dto.role !== 'instructor') {
      throw new ForbiddenException(
        'TA accounts are created by the course instructor. Ask your instructor to add you.',
      );
    }
    const email = dto.email.toLowerCase();
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new ConflictException(`Email ${email} is already registered`);
    }

    return this.prisma.user.create({
      data: {
        name: dto.name,
        email,
        passwordHash: await bcrypt.hash(dto.password, BCRYPT_ROUNDS),
        role: dto.role,
      },
      select: { ...publicUser, createdAt: true },
    });
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    // Same message for unknown email and wrong password, so it doesn't reveal
    // which accounts exist.
    if (
      !user ||
      user.status === 'DEACTIVATED' ||
      !(await bcrypt.compare(dto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // First sign-in activates an invited account.
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastSignInAt: new Date(), status: 'ACTIVE' },
    });

    const payload: JwtPayload = {
      sub: user.id,
      role: user.role,
      name: user.name,
    };
    return {
      token: await this.jwt.signAsync(payload),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }
}
