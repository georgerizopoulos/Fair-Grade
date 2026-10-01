import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

const TCP_RUBRIC = {
  courseName: 'HY335 - Computer Networks',
  questionText: 'Explain how the TCP three-way handshake works.',
  criteria: [
    { description: 'Names all 3 steps in order', maxPoints: 3 },
    { description: 'Explains sequence numbers', maxPoints: 3 },
    { description: 'States why a handshake is needed', maxPoints: 2 },
    { description: 'Clearly organized', maxPoints: 2 },
  ],
};

describe('Rubrics (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  let instructorToken: string;
  let taToken: string;

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
  });

  afterAll(async () => {
    await app.close();
  });

  let rubricId: string;

  it('POST /rubrics → 201 with positions and totalPoints', async () => {
    const res = await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send(TCP_RUBRIC)
      .expect(201);

    expect(res.body).toMatchObject({
      courseName: TCP_RUBRIC.courseName,
      questionText: TCP_RUBRIC.questionText,
      totalPoints: 10,
    });
    expect(
      res.body.criteria.map((c: { position: number }) => c.position),
    ).toEqual([1, 2, 3, 4]);
    expect(res.body.criteria[3]).toMatchObject({
      description: 'Clearly organized',
      maxPoints: 2,
    });
    rubricId = res.body.id;
  });

  it('POST /rubrics reuses an existing course by name', async () => {
    const res = await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ ...TCP_RUBRIC, questionText: 'Second question' })
      .expect(201);
    expect(await prisma.course.count()).toBe(1);
    await prisma.criterion.deleteMany({ where: { rubricId: res.body.id } });
    await prisma.rubric.delete({ where: { id: res.body.id } });
  });

  it('POST /rubrics → 400 naming the bad criterion', async () => {
    const res = await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({
        ...TCP_RUBRIC,
        criteria: [
          ...TCP_RUBRIC.criteria.slice(0, 2),
          { description: 'x', maxPoints: 0 },
        ],
      })
      .expect(400);
    expect(res.body.error.message).toBe(
      'criteria[2].maxPoints must be a positive number',
    );

    const empty = await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .send({ courseName: '  ', questionText: 'Q', criteria: [] })
      .expect(400);
    expect(empty.body.error.message).toContain('courseName');
    expect(empty.body.error.message).toContain('criteria');
  });

  it('POST /rubrics → 403 for a TA', async () => {
    await http
      .post('/rubrics')
      .set('Authorization', `Bearer ${taToken}`)
      .send(TCP_RUBRIC)
      .expect(403);
  });

  it('GET /rubrics → summary for instructor and TA, aiGraded flips after an AI grade', async () => {
    const before = await http
      .get('/rubrics')
      .set('Authorization', `Bearer ${taToken}`)
      .expect(200);
    expect(before.body.rubrics).toHaveLength(1);
    expect(before.body.rubrics[0]).toMatchObject({
      id: rubricId,
      courseName: TCP_RUBRIC.courseName,
      criteriaCount: 4,
      totalPoints: 10,
      answersCount: 0,
      aiGraded: false,
    });

    const criterion = await prisma.criterion.findFirstOrThrow({
      where: { rubricId },
    });
    const answer = await prisma.studentAnswer.create({
      data: {
        rubricId,
        studentIdAnon: 'student_001',
        answerText: 'SYN, SYN-ACK, ACK',
      },
    });
    await prisma.aiGrade.create({
      data: {
        answerId: answer.id,
        criterionId: criterion.id,
        points: 3,
        reasoning: 'ok',
      },
    });

    const after = await http
      .get('/rubrics')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(200);
    expect(after.body.rubrics[0]).toMatchObject({
      answersCount: 1,
      aiGraded: true,
    });
  });

  it('GET /rubrics/:id → same shape as POST, 404 for unknown id', async () => {
    const res = await http
      .get(`/rubrics/${rubricId}`)
      .set('Authorization', `Bearer ${taToken}`)
      .expect(200);
    expect(res.body.id).toBe(rubricId);
    expect(res.body.totalPoints).toBe(10);
    expect(res.body.criteria).toHaveLength(4);

    const missing = await http
      .get('/rubrics/does-not-exist')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(404);
    expect(missing.body.error).toEqual({
      code: 'NOT_FOUND',
      message: 'Rubric does-not-exist not found',
    });
  });

  it('GET /rubrics → 401 without a token', async () => {
    await http.get('/rubrics').expect(401);
  });
});
