import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { AiWorkerService } from './../src/ai/ai-worker.service.js';
import {
  type GradeQuestionInput,
  QUESTION_GRADER,
  type QuestionGrader,
} from './../src/ai/question-grader.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// The AI worker, with a fake grader in place of the LLM.
describe('AI worker (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  let worker: AiWorkerService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};
  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

  // What the fake LLM does next. Default: full marks minus nothing.
  let behaviour: (
    q: GradeQuestionInput,
  ) => Promise<{ points: number; reasoning: string }>;
  const seen: GradeQuestionInput[] = [];
  const fakeGrader: QuestionGrader = {
    grade: (q) => {
      seen.push(q);
      return behaviour(q);
    },
  };

  async function newPaper(studentId: string, taPoints: [number, number]) {
    const paper = await prisma.paper.create({
      data: {
        examId: ids.exam,
        taId: ids.nikos,
        studentId,
        status: 'DRAFT',
        answers: {
          create: [
            {
              questionId: ids.q1,
              transcription: 'answer one',
              taPoints: taPoints[0],
              uncertainWords: [],
              pages: [],
            },
            {
              questionId: ids.q2,
              transcription: 'answer two',
              taPoints: taPoints[1],
              uncertainWords: [],
              pages: [],
            },
          ],
        },
      },
    });
    await http
      .post(`/papers/${paper.id}/submit`)
      .set(auth('nikos'))
      .expect(200);
    return paper.id;
  }

  const makeDue = (paperId: string) =>
    prisma.paper.update({
      where: { id: paperId },
      data: { aiNextAttemptAt: new Date(Date.now() - 1000) },
    });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QUESTION_GRADER)
      .useValue(fakeGrader)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
    prisma = app.get(PrismaService);
    worker = app.get(AiWorkerService);
    await wipeDb(prisma);

    const passwordHash = await bcrypt.hash('demo1234', 4);
    for (const [key, role] of [
      ['instructor', 'instructor'],
      ['nikos', 'ta'],
    ] as const) {
      const u = await prisma.user.create({
        data: { name: key, email: `${key}@test.com`, passwordHash, role },
      });
      ids[key] = u.id;
      tokens[key] = (
        await http
          .post('/auth/login')
          .send({ email: `${key}@test.com`, password: 'demo1234' })
      ).body.token;
    }
    const course = await prisma.course.create({
      data: {
        code: 'HY335',
        name: 'Computer Networks',
        semester: 'W',
        ownerId: ids.instructor,
        members: { create: [{ userId: ids.nikos, role: 'ta' }] },
      },
    });
    const exam = await prisma.exam.create({
      data: { courseId: course.id, name: 'Midterm', status: 'OPEN' },
    });
    const q1 = await prisma.question.create({
      data: {
        examId: exam.id,
        code: 'Q1',
        title: 'Handshake',
        prompt: 'Explain the handshake.',
        maxPoints: 3,
        modelAnswer: 'SYN, SYN-ACK, ACK.',
        order: 1,
        rubricPoints: {
          create: [{ text: 'Three steps', points: 3, order: 1 }],
        },
      },
    });
    const q2 = await prisma.question.create({
      data: {
        examId: exam.id,
        code: 'Q2',
        title: 'TCP vs UDP',
        prompt: 'Compare TCP and UDP.',
        maxPoints: 2,
        modelAnswer: 'Reliable vs not.',
        order: 2,
        rubricPoints: {
          create: [{ text: 'Core difference', points: 2, order: 1 }],
        },
      },
    });
    ids.course = course.id;
    ids.exam = exam.id;
    ids.q1 = q1.id;
    ids.q2 = q2.id;
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    seen.length = 0;
    behaviour = async (q) => ({
      points: q.maxPoints,
      reasoning: `${q.code} is complete.`,
    });
  });

  it('grades a submitted paper: AI points and reasoning saved, AI_GRADED, activity written', async () => {
    const paperId = await newPaper('csd5001', [3, 2]);
    expect(await worker.processDue()).toBe(1);

    const paper = await prisma.paper.findUniqueOrThrow({
      where: { id: paperId },
      include: { answers: { orderBy: { questionId: 'asc' } } },
    });
    expect(paper.status).toBe('AI_GRADED');
    expect(paper.aiGradedAt).toBeInstanceOf(Date);
    expect(
      paper.answers.map((a) => a.aiPoints ?? 0).sort((a, b) => a - b),
    ).toEqual([2, 3]);

    const res = await http
      .get(`/papers/${paperId}`)
      .set(auth('nikos'))
      .expect(200);
    expect(res.body).toMatchObject({ status: 'AI_GRADED', aiTotal: 5, gap: 0 });
    expect(res.body.answers[0].aiReasoning).toBe('Q1 is complete.');

    const log = await prisma.activityLog.findFirst({
      where: { paperId, type: 'AI_GRADED' },
    });
    expect(log).not.toBeNull();
  });

  it('sends the model only exam content and the transcription: no student ID, names or TA points', async () => {
    await newPaper('csd5002', [1, 1]);
    await worker.processDue();
    expect(seen).toHaveLength(2);
    const sent = JSON.stringify(seen);
    expect(sent).not.toContain('csd5002');
    for (const q of seen) {
      expect(Object.keys(q).sort()).toEqual([
        'answer',
        'code',
        'maxPoints',
        'modelAnswer',
        'prompt',
        'rubric',
      ]);
    }
    expect(sent).not.toContain('nikos');
    expect(sent).not.toContain('taPoints');
  });

  it('does nothing for papers that are not due', async () => {
    expect(await worker.processDue()).toBe(0);
  });

  it('retries with backoff, then AI_FAILED after 3 attempts; retry-ai queues it again', async () => {
    behaviour = async () => {
      throw new Error('Bedrock timed out');
    };
    const paperId = await newPaper('csd5003', [2, 1]);

    await worker.processDue();
    let p = await prisma.paper.findUniqueOrThrow({ where: { id: paperId } });
    expect(p).toMatchObject({ status: 'AI_GRADING', aiAttempts: 1 });
    expect(p.aiNextAttemptAt!.getTime()).toBeGreaterThan(Date.now());
    expect(await worker.processDue()).toBe(0); // backing off

    await makeDue(paperId);
    await worker.processDue();
    await makeDue(paperId);
    await worker.processDue();
    p = await prisma.paper.findUniqueOrThrow({ where: { id: paperId } });
    expect(p).toMatchObject({ status: 'AI_FAILED', aiAttempts: 3 });
    expect(p.aiError).toContain('Bedrock timed out');
    expect(
      await prisma.activityLog.count({ where: { paperId, type: 'AI_FAILED' } }),
    ).toBe(1);

    const failed = await http
      .get(`/papers/${paperId}`)
      .set(auth('nikos'))
      .expect(200);
    expect(failed.body.aiError).toContain('Bedrock timed out');

    behaviour = async (q) => ({ points: 1, reasoning: `${q.code} partly.` });
    await http
      .post(`/papers/${paperId}/retry-ai`)
      .set(auth('nikos'))
      .expect(200);
    await worker.processDue();
    p = await prisma.paper.findUniqueOrThrow({ where: { id: paperId } });
    expect(p).toMatchObject({ status: 'AI_GRADED', aiError: null });
  });

  it('drops the result if the paper was reopened while the AI was grading', async () => {
    let release!: () => void;
    const gate = new Promise<void>((r) => (release = r));
    behaviour = async (q) => {
      await gate;
      return { points: q.maxPoints, reasoning: 'late' };
    };
    const paperId = await newPaper('csd5004', [3, 2]);

    const run = worker.processDue();
    await new Promise((r) => setTimeout(r, 50));
    await prisma.paper.update({
      where: { id: paperId },
      data: { status: 'DRAFT', submittedAt: null },
    });
    release();
    await run;

    const p = await prisma.paper.findUniqueOrThrow({
      where: { id: paperId },
      include: { answers: true },
    });
    expect(p.status).toBe('DRAFT');
    expect(p.answers.every((a) => a.aiPoints === null)).toBe(true);
  });

  it('writes TA_FLAGGED once, when a TA crosses the threshold on a question', async () => {
    // Nikos gives 0 on Q1 where the AI gives 3: gap −3 on a 3-point question.
    // Papers so far that are AI_GRADED: csd5001 (Q1 gap 0), csd5002, csd5003.
    await prisma.activityLog.deleteMany({ where: { type: 'TA_FLAGGED' } });
    behaviour = async (q) => ({ points: q.maxPoints, reasoning: 'full' });
    for (const s of ['csd5101', 'csd5102', 'csd5103']) {
      await newPaper(s, [0, 2]);
      await worker.processDue();
    }
    const flags = await prisma.activityLog.findMany({
      where: { type: 'TA_FLAGGED' },
    });
    expect(flags).toHaveLength(1);
    expect(flags[0].payload).toMatchObject({
      taId: ids.nikos,
      questionCode: 'Q1',
    });

    await newPaper('csd5104', [0, 2]);
    await worker.processDue();
    expect(
      await prisma.activityLog.count({ where: { type: 'TA_FLAGGED' } }),
    ).toBe(1);
  });
});
