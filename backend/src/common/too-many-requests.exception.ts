import { HttpException, HttpStatus } from '@nestjs/common';

// 429 RATE_LIMITED. The error filter turns retryAfterSeconds into a Retry-After header.
export class TooManyRequestsException extends HttpException {
  constructor(
    message: string,
    readonly retryAfterSeconds: number,
  ) {
    super(message, HttpStatus.TOO_MANY_REQUESTS);
  }
}
