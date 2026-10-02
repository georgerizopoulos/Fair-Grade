import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.getHttpAdapter().getInstance().disable('x-powered-by');
  app.enableShutdownHooks(); // stop the AI worker and close Prisma on SIGTERM
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
    exposedHeaders: ['X-User-Role', 'X-User-Id'],
  });
  await app.listen(process.env.PORT ?? 3001);
}
await bootstrap();
