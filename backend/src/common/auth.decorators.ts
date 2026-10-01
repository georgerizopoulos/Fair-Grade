import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import type { Role } from '../generated/prisma/client.js';

// The logged-in user, as loaded from the database by AuthGuard on every request.
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export const IS_PUBLIC_KEY = 'isPublic';
export const ROLES_KEY = 'roles';

// Every endpoint needs a valid token by default. @Public() opts out
// (only /health, /auth/register and /auth/login use it).
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Restrict an endpoint (or a whole controller) to these roles; anyone else gets
// 403 FORBIDDEN. Without @Roles, any logged-in user may call it.
//   @Roles('instructor')
//   @Roles('instructor', 'ta')
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Inject the logged-in user into a handler:
//   @Get() list(@CurrentUser() user: AuthUser) { ... user.id, user.role ... }
export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthUser =>
    ctx.switchToHttp().getRequest<{ user: AuthUser }>().user,
);
