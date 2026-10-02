import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// The demo story in miniature: Maria grades Q2 a point under the AI on three
// papers and is flagged; Nikos matches the AI. Drafts and papers the AI hasn't
// finished must not count anywhere.
describe('Reports (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};
  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

  async function paper(
    taKey: 'maria' | 'nikos',
    studentId: string,
    status: 'AI_GRADED' | 'AI_GRADING' | 'DRAFT',
    ta: [number, number],
    ai?: [number, number],
  ) {
    await prisma.paper.create({
      data: {
        examId: ids.exam,
        taId: ids[taKey],
        studentId,
        status,
        submittedAt: status === 'DRAFT' ? null : new Date(),
        answers: {
          create: [
            [ids.q1, ta[0], ai?.[0]],
            [ids.q2, ta[1], ai?.[1]],
          ].map(([questionId, taPoints, aiPoints]) => ({
            questionId: questionId as string,
            transcription: `answer ${studentId}`,
            taPoints: taPoints as number,
            aiPoints: (aiPoints as number | undefined) ?? null,
            aiReasoning: aiPoints == null ? null : 'AI reasoning',
            uncertainWords: [],
            pages: [],
          })),
        },
      },
    });
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

    const passwordHash = await bcrypt.hash('demo1234', 4);
    for (const [key, role] of [
      ['instructor', 'instructor'],
      ['otherinstructor', 'instructor'],
      ['maria', 'ta'],
      ['nikos', 'ta'],
      ['outsider', 'ta'],
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
        members: {
          create: [
            { userId: ids.maria, role: 'ta' },
            { userId: ids.nikos, role: 'ta' },
          ],
        },
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
        prompt: 'p',
        maxPoints: 3,
        modelAnswer: 'm',
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
        prompt: 'p',
        maxPoints: 2,
        modelAnswer: 'm',
        order: 2,
        rubricPoints: {
          create: [{ text: 'Core difference', points: 2, order: 1 }],
        },
      },
    });
    Object.assign(ids, {
      course: course.id,
      exam: exam.id,
      q1: q1.id,
      q2: q2.id,
    });

    for (const n of [1, 2, 3]) {
      // Maria: Q2 one point under the AI (threshold is 15% of 2 = 0.3).
      await paper('maria', `csd10${n}`, 'AI_GRADED', [3, 1], [3, 2]);
      await paper('nikos', `csd20${n}`, 'AI_GRADED', [3, 2], [3, 2]);
    }
    // Must not count: a draft with a huge gap-to-be, and a paper still with the AI.
    await paper('maria', 'csd109', 'DRAFT', [0, 0]);
    await paper('maria', 'csd108', 'AI_GRADING', [0, 0], [3, 2]);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /exams/:id/report', () => {
    it('flags Maria on Q2 and counts only AI-graded papers in the stats', async () => {
      const res = await http
        .get(`/exams/${ids.exam}/report`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body).toMatchObject({
        totalPapers: 8,
        submittedPapers: 7,
        aiGradedPapers: 6,
        aiGradingPapers: 1,
        flaggedTaCount: 1,
        exam: { maxTotal: 5 },
      });
      expect(res.body.headline).toMatchObject({
        taId: ids.maria,
        questionCode: 'Q2',
        questionGap: -1,
        papersGraded: 3,
      });

      const [first, second] = res.body.tas;
      expect(first).toMatchObject({
        taId: ids.maria,
        flagged: true,
        flaggedQuestionCodes: ['Q2'],
        papersGraded: 3,
      });
      expect(second).toMatchObject({ taId: ids.nikos, flagged: false });
      expect(res.body.papers).toHaveLength(6);
    });

    it('403 for a TA and for an instructor who does not own the course; 404 unknown; 401 anonymous', async () => {
      await http
        .get(`/exams/${ids.exam}/report`)
        .set(auth('maria'))
        .expect(403);
      await http
        .get(`/exams/${ids.exam}/report`)
        .set(auth('otherinstructor'))
        .expect(403);
      await http.get('/exams/nope/report').set(auth('instructor')).expect(404);
      await http.get(`/exams/${ids.exam}/report`).expect(401);
    });
  });

  describe('GET /exams/:id/report/tas/:taId', () => {
    it('shows one TA against the AI and the papers behind the flag', async () => {
      const res = await http
        .get(`/exams/${ids.exam}/report/tas/${ids.maria}`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body).toMatchObject({
        papersGraded: 3,
        flaggedQuestionCodes: ['Q2'],
        ta: { id: ids.maria },
      });
      expect(
        res.body.flaggedPapers.Q2.map(
          (p: { studentId: string }) => p.studentId,
        ).sort(),
      ).toEqual(['csd101', 'csd102', 'csd103']);
      expect(res.body.papers).toHaveLength(3);
    });

    it('404 for an unknown user or someone who is not a TA; 403 for TAs and other instructors; 401 anonymous', async () => {
      const base = `/exams/${ids.exam}/report/tas`;
      await http.get(`${base}/nope`).set(auth('instructor')).expect(404);
      await http
        .get(`${base}/${ids.instructor}`)
        .set(auth('instructor'))
        .expect(404);
      await http.get(`${base}/${ids.maria}`).set(auth('nikos')).expect(403);
      await http
        .get(`${base}/${ids.maria}`)
        .set(auth('otherinstructor'))
        .expect(403);
      await http.get(`${base}/${ids.maria}`).expect(401);
    });
  });

  describe('GET /exams/:id/my-stats', () => {
    it('a TA sees their own numbers, and only theirs', async () => {
      const res = await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('maria'))
        .expect(200);
      expect(res.body.counts).toMatchObject({
        total: 5,
        aiGraded: 3,
        pending: 1,
        drafts: 1,
      });
      expect(res.body.summary.flaggedQuestionCount).toBe(1);
      expect(
        res.body.paperComparisons
          .map((p: { studentId: string }) => p.studentId)
          .sort(),
      ).toEqual(['csd101', 'csd102', 'csd103']);

      const nikos = await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('nikos'))
        .expect(200);
      expect(nikos.body.counts.total).toBe(3);
      expect(nikos.body.summary.flaggedQuestionCount).toBe(0);
    });

    it('the leaderboard is anonymous by default: no other TA names, no student IDs', async () => {
      const res = await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('nikos'))
        .expect(200);
      expect(res.body.course.leaderboardVisibility).toBe('ANONYMOUS');
      expect(
        res.body.leaderboard.filter((r: { isYou: boolean }) => r.isYou),
      ).toHaveLength(1);
      const text = JSON.stringify(res.body.leaderboard);
      expect(text).not.toContain('maria');
      expect(text).not.toContain('csd1');
      // ...and nothing about the other TA's papers leaks elsewhere.
      expect(JSON.stringify(res.body.paperComparisons)).not.toContain('csd10');
    });

    it('turning the leaderboard OFF removes it', async () => {
      await prisma.course.update({
        where: { id: ids.course },
        data: { leaderboardVisibility: 'OFF' },
      });
      const res = await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('nikos'))
        .expect(200);
      expect(res.body.leaderboard).toBeUndefined();
      await prisma.course.update({
        where: { id: ids.course },
        data: { leaderboardVisibility: 'ANONYMOUS' },
      });
    });

    it('403 for an instructor and a TA outside the course; 404 unknown; 401 anonymous', async () => {
      await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('instructor'))
        .expect(403);
      await http
        .get(`/exams/${ids.exam}/my-stats`)
        .set(auth('outsider'))
        .expect(403);
      await http.get('/exams/nope/my-stats').set(auth('maria')).expect(404);
      await http.get(`/exams/${ids.exam}/my-stats`).expect(401);
    });
  });
});
