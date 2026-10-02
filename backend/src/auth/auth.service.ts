import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcryptjs';
import type { JwtPayload } from '../common/auth.guard.js';
import { RateLimiter, describeWait } from '../common/rate-limiter.js';
import { TooManyRequestsException } from '../common/too-many-requests.exception.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { LoginDto, RegisterDto } from './auth.dto.js';

const BCRYPT_ROUNDS = 10;

// Abuse limits, per client IP (see TRUST_PROXY). Only failed sign-ins count, so
// normal use never hits them; a good sign-in clears that account's count.
const FAILED_LOGINS_PER_ACCOUNT = 10; // one IP guessing one account's password
const FAILED_LOGINS_PER_IP = 100; // one IP trying many accounts
const LOGIN_WINDOW_MS = 15 * 60_000;
const REGISTRATIONS_PER_IP = 10; // every attempt counts: it costs a hash and a row
const REGISTER_WINDOW_MS = 60 * 60_000;

// Compared against when the email is unknown, so a wrong email takes as long as
// a wrong password and response time doesn't reveal which accounts exist.
let dummyHash: string | undefined;

// Fields safe to return; password_hash never leaves the backend.
const publicUser = { id: true, name: true, email: true, role: true } as const;

@Injectable()
export class AuthService {
  private readonly failedByAccount = new RateLimiter(
    FAILED_LOGINS_PER_ACCOUNT,
    LOGIN_WINDOW_MS,
  );
  private readonly failedByIp = new RateLimiter(
    FAILED_LOGINS_PER_IP,
    LOGIN_WINDOW_MS,
  );
  private readonly registrations = new RateLimiter(
    REGISTRATIONS_PER_IP,
    REGISTER_WINDOW_MS,
  );

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  // Public sign-up is for instructors only: the department secretariat vouches
  // for them outside the app. TAs never sign themselves up; the course
  // instructor creates their account (POST /users, POST /courses/:id/members).
  async register(dto: RegisterDto, ip: string) {
    this.assertBelowLimit(this.registrations, ip, 'sign-up attempts');
    this.registrations.hit(ip);
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

  async login(dto: LoginDto, ip: string) {
    const email = dto.email.toLowerCase();
    const accountKey = `${ip}|${email}`;
    this.assertBelowLimit(this.failedByIp, ip, 'failed sign-in attempts');
    this.assertBelowLimit(
      this.failedByAccount,
      accountKey,
      'failed sign-in attempts',
    );

    const user = await this.prisma.user.findUnique({ where: { email } });
    dummyHash ??= await bcrypt.hash('not-a-real-password', BCRYPT_ROUNDS);
    const passwordOk = await bcrypt.compare(
      dto.password,
      user?.passwordHash ?? dummyHash,
    );
    // Same message for unknown email, wrong password and deactivated account,
    // so it doesn't reveal which accounts exist.
    if (!user || !passwordOk || user.status === 'DEACTIVATED') {
      this.failedByIp.hit(ip);
      this.failedByAccount.hit(accountKey);
      throw new UnauthorizedException('Invalid email or password');
    }
    this.failedByAccount.reset(accountKey);

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

  private assertBelowLimit(limiter: RateLimiter, key: string, what: string) {
    const wait = limiter.retryAfter(key);
    if (wait > 0) {
      throw new TooManyRequestsException(
        `Too many ${what}. Try again in ${describeWait(wait)}.`,
        wait,
      );
    }
  }
}
