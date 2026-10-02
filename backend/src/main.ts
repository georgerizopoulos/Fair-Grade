import 'dotenv/config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { checkEnv, parseTrustProxy } from './common/env.js';
import { securityHeaders } from './common/security-headers.js';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const { errors, warnings } = checkEnv(process.env);
  warnings.forEach((w) => logger.warn(w));
  if (errors.length) {
    errors.forEach((e) => logger.error(e));
    process.exit(1);
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.disable('x-powered-by');
  // Behind a reverse proxy (TRUST_PROXY=1, "loopback", ...) so the sign-in
  // limits and HSTS see the real client and protocol.
  app.set('trust proxy', parseTrustProxy(process.env.TRUST_PROXY));
  app.use(securityHeaders);
  app.enableShutdownHooks(); // stop the AI worker and close Prisma on SIGTERM
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    exposedHeaders: ['X-User-Role', 'X-User-Id', 'Retry-After'],
  });
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
