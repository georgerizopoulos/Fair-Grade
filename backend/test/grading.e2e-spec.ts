import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// The LLM is mocked: no network, no AWS credentials. The fake reads the
// criteria JSON out of the prompt and gives full marks, unless `llmMode` says
// otherwise.
let llmMode: 'ok' | 'fail' | 'failStudent2' = 'ok';
vi.mock('./../src/grading/llm.client.js', () => ({
  complete: vi.fn(async (_system: string, user: string) => {
    if (llmMode === 'fail') throw new Error('no credits');
    if (llmMode === 'failStudent2' && user.includes('ANSWER TWO')) {
      return 'not json';
    }
    const json = user.slice(user.indexOf('['), user.indexOf(']') + 1);
    const criteria = JSON.parse(json) as {
      criterionId: string;
      maxPoints: number;
    }[];
    return JSON.stringify({
      scores: criteria.map((c) => ({
        criterionId: c.criterionId,
        points: c.maxPoints,
        reasoning: 'Fully correct.',
      })),
    });
  }),
}));

const TCP_RUBRIC = {
  courseName: 'HY335 - Computer Networks',
  questionText: 'Explain how the TCP three-way handshake works.',
  criteria: [
    { description: 'Names all 3 steps in order', maxPoints: 3 },
    { description: 'Explains sequence numbers', maxPoints: 3 },
  ],
};

describe('POST /grade/run (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  let instructorToken: string;
  let taToken: string;
  let rubricId: string;

  async function tokenFor(email: string, role: string) {
    await http
      .post('/auth/register')
      .send({ name: email, email, password: 'demo1234', role })
      .expect(201);
    const res = await http
      .post('/auth/login')
      .send({ email, password: 'demo1234' })
      .expect(200);
    return res.body.token as string;
  }

  const run = (body: object, token = instructorToken) =>
    http
      .post('/grade/run')
      .set('Authorization', `Bearer ${token}`)
      .send(body);

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
    prisma = app.get(PrismaService);

    await wipeDb(prisma);

    instructorToken = await tokenFor('prof@test.com', 'instructor');
    taToken = await tokenFor('ta1@test.com', 'ta');

    const rubric = await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send(TCP_RUBRIC)
      .expect(201);
    rubricId = rubric.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('400 when rubricId is missing', async () => {
    const res = await run({}).expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('403 for a TA', async () => {
    await run({ rubricId }, taToken).expect(403);
  });

  it('404 for an unknown rubric', async () => {
    const res = await run({ rubricId: 'nope' }).expect(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  it('409 when the rubric has no answers', async () => {
    const res = await run({ rubricId }).expect(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('200 grades every answer and saves one AI grade per criterion', async () => {
    await http
      .post('/answers/bulk')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        rubricId,
        answers: [
          { studentIdAnon: 'student_001', answerText: 'ANSWER ONE' },
          { studentIdAnon: 'student_002', answerText: 'ANSWER TWO' },
        ],
      })
      .expect(201);

    llmMode = 'ok';
    const res = await run({ rubricId }).expect(200);
    expect(res.body).toMatchObject({
      rubricId,
      answersTotal: 2,
      answersGraded: 2,
      aiGradesSaved: 4,
      failedAnswers: [],
    });
    expect(typeof res.body.durationMs).toBe('number');
    expect(await prisma.aiGrade.count()).toBe(4);
  });

  it('re-running overwrites instead of duplicating', async () => {
    await run({ rubricId }).expect(200);
    expect(await prisma.aiGrade.count()).toBe(4);
  });

  it('200 with failedAnswers when only some answers fail', async () => {
    llmMode = 'failStudent2';
    const res = await run({ rubricId }).expect(200);
    expect(res.body.answersGraded).toBe(1);
    expect(res.body.aiGradesSaved).toBe(2);
    expect(res.body.failedAnswers).toEqual([
      expect.objectContaining({ studentIdAnon: 'student_002' }),
    ]);
  });

  it('502 when every answer fails', async () => {
    llmMode = 'fail';
    const res = await run({ rubricId }).expect(502);
    expect(res.body.error.code).toBe('LLM_FAILURE');
  });
});
