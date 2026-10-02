import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// Brute-force and oversize protection on the public and upload endpoints.
// Its own file, so the failed-login counters start from zero.
describe('Abuse limits (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;

  const login = (email: string, password: string) =>
    http.post('/auth/login').send({ email, password });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
    prisma = app.get(PrismaService);
    await wipeDb(prisma);

    const passwordHash = await bcrypt.hash('demo1234', 4);
    for (const key of ['victim', 'bystander', 'typo']) {
      await prisma.user.create({
        data: {
          name: key,
          email: `${key}@test.com`,
          passwordHash,
          role: 'instructor',
        },
      });
    }
  });

  afterAll(async () => {
    await app.close();
  });

  it('locks an account after 10 failed sign-ins: 429 RATE_LIMITED with Retry-After, even for the right password', async () => {
    for (let i = 0; i < 10; i++) {
      await login('victim@test.com', `wrong-${i}`).expect(401);
    }
    const blocked = await login('victim@test.com', 'wrong-again').expect(429);
    expect(blocked.body.error.code).toBe('RATE_LIMITED');
    expect(blocked.body.error.message).toMatch(/Try again in \d+ minutes?/);
    expect(Number(blocked.headers['retry-after'])).toBeGreaterThan(0);

    // Guessing right after the lock must not work either.
    await login('victim@test.com', 'demo1234').expect(429);
  });

  it('the lock is per account: another account from the same IP still signs in', async () => {
    await login('bystander@test.com', 'demo1234').expect(200);
  });

  it('a good sign-in clears the failed count', async () => {
    for (let i = 0; i < 9; i++) {
      await login('typo@test.com', `wrong-${i}`).expect(401);
    }
    await login('typo@test.com', 'demo1234').expect(200);
    for (let i = 0; i < 9; i++) {
      await login('typo@test.com', `wrong-${i}`).expect(401);
    }
  });

  it('unknown emails count too (no account is needed to be rate limited)', async () => {
    for (let i = 0; i < 10; i++) {
      await login('ghost@test.com', 'whatever').expect(401);
    }
    await login('ghost@test.com', 'whatever').expect(429);
  });

  it('POST /auth/register: 10 attempts per hour per IP, then 429', async () => {
    // TA sign-ups are refused (403) but still cost a request, so they count.
    for (let i = 0; i < 10; i++) {
      await http
        .post('/auth/register')
        .send({
          name: 'Spam',
          email: `spam-${i}@test.com`,
          password: 'demo1234',
          role: 'ta',
        })
        .expect(403);
    }
    const blocked = await http
      .post('/auth/register')
      .send({
        name: 'Spam',
        email: 'spam-10@test.com',
        password: 'demo1234',
        role: 'instructor',
      })
      .expect(429);
    expect(blocked.body.error.code).toBe('RATE_LIMITED');
    expect(
      await prisma.user.findUnique({ where: { email: 'spam-10@test.com' } }),
    ).toBeNull();
  });

  it('rejects absurdly long credentials with a 400 that names the field', async () => {
    const res = await login('bystander@test.com', 'x'.repeat(201)).expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('password');
  });

  it('POST /exams/:id/questions/import: a file over 20 MiB → 413 PAYLOAD_TOO_LARGE', async () => {
    const owner = await prisma.user.findUniqueOrThrow({
      where: { email: 'bystander@test.com' },
    });
    const course = await prisma.course.create({
      data: {
        code: 'HY999',
        name: 'Limits',
        semester: 'W',
        ownerId: owner.id,
      },
    });
    const exam = await prisma.exam.create({
      data: { courseId: course.id, name: 'Midterm', status: 'DRAFT' },
    });
    const token = (await login('bystander@test.com', 'demo1234')).body.token;

    const res = await http
      .post(`/exams/${exam.id}/questions/import`)
      .set('Authorization', `Bearer ${token}`)
      .attach('file', Buffer.alloc(21 * 1024 * 1024), {
        filename: 'solutions.pdf',
        contentType: 'application/pdf',
      })
      .expect(413);
    expect(res.body.error.code).toBe('PAYLOAD_TOO_LARGE');
  });
});
