import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { AuthUser } from './auth.decorators.js';

// Every authenticated response carries the caller's role and id in headers,
// so the frontend always knows who it is talking as.
@Injectable()
export class UserRoleInterceptor implements NestInterceptor {
  intercept(ctx: ExecutionContext, next: CallHandler) {
    const http = ctx.switchToHttp();
    const user = http.getRequest<Request & { user?: AuthUser }>().user;
    if (user) {
      const res = http.getResponse<Response>();
      res.setHeader('X-User-Role', user.role);
      res.setHeader('X-User-Id', user.id);
    }
    return next.handle();
  }
}
