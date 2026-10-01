import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import type { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { AuthUser, IS_PUBLIC_KEY, ROLES_KEY } from './auth.decorators.js';

export interface JwtPayload {
  sub: string;
  role: Role;
  name: string;
}

// Global guard (registered in app.module.ts) that runs before every endpoint:
//   1. @Public() endpoints pass straight through.
//   2. No/invalid/expired token → 401.
//   3. Token for a user that no longer exists (e.g. after `npm run seed`) → 401.
//   4. @Roles(...) set and the user's role isn't listed → 403.
// On success the user is available via @CurrentUser().
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const targets = [ctx.getHandler(), ctx.getClass()];
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, targets)) {
      return true;
    }

    const req = ctx.switchToHttp().getRequest<Request & { user?: AuthUser }>();
    const [scheme, token] = req.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Missing Authorization: Bearer <token> header',
      );
    }

    let payload: JwtPayload;
    try {
      payload = await this.jwt.verifyAsync<JwtPayload>(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true },
    });
    if (!user) {
      throw new UnauthorizedException(
        'The user in this token no longer exists, log in again',
      );
    }
    req.user = user;

    const roles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, targets);
    if (roles?.length && !roles.includes(user.role)) {
      throw new ForbiddenException(
        `Only ${roles.join(' or ')} users can call this endpoint`,
      );
    }
    return true;
  }
}
