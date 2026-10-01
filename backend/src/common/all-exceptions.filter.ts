import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { Prisma } from '../generated/prisma/client.js';

// Turns every error from every module into the API_SPEC error shape:
//   { "error": { "code": "NOT_FOUND", "message": "..." } }
//
// Throw the normal Nest exceptions and this filter picks the code from the
// status, so you never build the error body yourself:
//   BadRequestException      400 VALIDATION_ERROR
//   UnauthorizedException    401 UNAUTHORIZED
//   ForbiddenException       403 FORBIDDEN
//   NotFoundException        404 NOT_FOUND
//   ConflictException        409 CONFLICT
//   BadGatewayException      502 LLM_FAILURE
//   anything else            500 INTERNAL_ERROR
// Always pass a message that says exactly what was wrong (which field, which ID).

const CODES: Record<number, string> = {
  [HttpStatus.BAD_REQUEST]: 'VALIDATION_ERROR',
  [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
  [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
  [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
  [HttpStatus.CONFLICT]: 'CONFLICT',
  [HttpStatus.BAD_GATEWAY]: 'LLM_FAILURE',
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const res = host.switchToHttp().getResponse<Response>();
    const { status, message } = this.describe(exception);
    const code = CODES[status] ?? 'INTERNAL_ERROR';

    if (code === 'INTERNAL_ERROR') {
      this.logger.error(exception);
    }
    res.status(status).json({ error: { code, message } });
  }

  private describe(exception: unknown): { status: number; message: string } {
    if (exception instanceof HttpException) {
      const body = exception.getResponse();
      const raw =
        typeof body === 'string'
          ? body
          : (body as { message?: unknown }).message;
      const message = Array.isArray(raw)
        ? raw.join('; ')
        : String(raw ?? exception.message);
      return { status: exception.getStatus(), message };
    }

    // Safety net for unique-constraint races the service didn't check first.
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        return {
          status: HttpStatus.CONFLICT,
          message: 'A record with these values already exists',
        };
      }
      if (exception.code === 'P2025') {
        return { status: HttpStatus.NOT_FOUND, message: 'Record not found' };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    };
  }
}
