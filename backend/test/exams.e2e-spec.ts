import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import {
  QUESTIONS_IMPORTER,
  type DraftQuestion,
  type QuestionsImporter,
} from './../src/exams/questions-importer.js';
import { wipeDb } from './helpers.js';

const IMPORTED: DraftQuestion[] = [
  {
    code: 'Q1',
    title: 'Imported',
    prompt: 'From the PDF',
    maxPoints: 2,
    modelAnswer: 'An answer',
    rubric: [{ text: 'Everything', points: 2 }],
  },
];

class FakeImporter implements QuestionsImporter {
  importSolutionsPdf() {
    return Promise.resolve(IMPORTED);
  }
}

const question = (code: string, maxPoints = 4) => ({
  code,
  title: `${code} title`,
  prompt: `${code} prompt`,
  maxPoints,
  modelAnswer: `${code} model answer`,
  rubric: [
    { text: 'first half', points: maxPoints / 2 },
    { text: 'second half', points: maxPoints / 2 },
  ],
});

// Exams and their questions: instructor-only, owner-only, and the rules that
// keep a graded exam's questions from changing under the TAs.
describe('Exams and questions (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};

  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(QUESTIONS_IMPORTER)
      .useClass(FakeImporter)
      .compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
    prisma = app.get(PrismaService);
    await wipeDb(prisma);

    const passwordHash = await bcrypt.hash('demo1234', 4);
    for (const [key, role] of [
      ['instructor', 'instructor'],
      ['other', 'instructor'],
      ['nikos', 'ta'],
    ] as const) {
      const u = await prisma.user.create({
        data: { name: key, email: `${key}@test.com`, passwordHash, role },
      });
      ids[key] = u.id;
    }

    const course = await prisma.course.create({
      data: {
        code: 'HY335',
        name: 'Computer Networks',
        semester: 'Winter 2026–27',
        ownerId: ids.instructor,
        members: { create: [{ userId: ids.nikos, role: 'ta' }] },
      },
    });
    ids.course = course.id;

    for (const key of ['instructor', 'other', 'nikos']) {
      const res = await http
        .post('/auth/login')
        .send({ email: `${key}@test.com`, password: 'demo1234' })
        .expect(200);
      tokens[key] = res.body.token;
    }
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /courses/:courseId/exams', () => {
    it('creates a draft exam for the course owner', async () => {
      const res = await http
        .post(`/courses/${ids.course}/exams`)
        .set(auth('instructor'))
        .send({ name: '  Midterm  ', heldAt: '2026-09-30' })
        .expect(201);
      expect(res.body).toMatchObject({
        name: 'Midterm',
        status: 'DRAFT',
        courseId: ids.course,
        course: { code: 'HY335' },
        questionCount: 0,
        paperCount: 0,
      });
      ids.exam = res.body.id;
    });

    it('400 without a name or with a bad date', async () => {
      const noName = await http
        .post(`/courses/${ids.course}/exams`)
        .set(auth('instructor'))
        .send({ name: '   ' })
        .expect(400);
      expect(noName.body.error.message).toContain('name');
      const badDate = await http
        .post(`/courses/${ids.course}/exams`)
        .set(auth('instructor'))
        .send({ name: 'Final', heldAt: 'tomorrow' })
        .expect(400);
      expect(badDate.body.error.message).toContain('heldAt');
    });

    it('401 without a token', () =>
      http
        .post(`/courses/${ids.course}/exams`)
        .send({ name: 'X' })
        .expect(401));

    it('403 for a TA, even a member of the course', () =>
      http
        .post(`/courses/${ids.course}/exams`)
        .set(auth('nikos'))
        .send({ name: 'X' })
        .expect(403));

    it("403 for another instructor's course", () =>
      http
        .post(`/courses/${ids.course}/exams`)
        .set(auth('other'))
        .send({ name: 'X' })
        .expect(403));

    it('404 for an unknown course', () =>
      http
        .post('/courses/nope/exams')
        .set(auth('instructor'))
        .send({ name: 'X' })
        .expect(404));
  });

  describe('GET /courses/:courseId/exams and GET /exams/:id', () => {
    it('lists the course exams with counts', async () => {
      const res = await http
        .get(`/courses/${ids.course}/exams`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body.exams).toEqual([
        expect.objectContaining({
          id: ids.exam,
          name: 'Midterm',
          status: 'DRAFT',
          questionCount: 0,
          paperCount: 0,
        }),
      ]);
    });

    it('gets one exam', async () => {
      const res = await http
        .get(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body).toMatchObject({ id: ids.exam, name: 'Midterm' });
    });

    it('403 for a TA and for another instructor', async () => {
      await http
        .get(`/courses/${ids.course}/exams`)
        .set(auth('nikos'))
        .expect(403);
      await http.get(`/exams/${ids.exam}`).set(auth('nikos')).expect(403);
      await http.get(`/exams/${ids.exam}`).set(auth('other')).expect(403);
    });

    it('404 for an unknown exam', () =>
      http.get('/exams/nope').set(auth('instructor')).expect(404));
  });

  describe('PUT /exams/:id/questions', () => {
    it('400 when the rubric points do not add up to the max, naming the question', async () => {
      const bad = question('Q1', 4);
      bad.rubric[1].points = 1;
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({ questions: [bad] })
        .expect(400);
      expect(res.body.error.message).toBe(
        'Q1: rubric points add up to 3, not 4',
      );
    });

    it('400 on duplicate question codes', async () => {
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({ questions: [question('Q1'), question('Q1')] })
        .expect(400);
      expect(res.body.error.message).toContain('unique');
    });

    it('400 naming the nested field that is wrong', async () => {
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({ questions: [{ ...question('Q1'), rubric: [] }] })
        .expect(400);
      expect(res.body.error.message).toContain('rubric');
    });

    it('saves the questions in order and makes a draft exam ready', async () => {
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({ questions: [question('Q1', 4), question('Q2', 3)] })
        .expect(200);
      expect(res.body.questions.map((q: { code: string }) => q.code)).toEqual([
        'Q1',
        'Q2',
      ]);
      expect(res.body.questions[0].rubric).toHaveLength(2);
      ids.q1 = res.body.questions[0].id;

      const exam = await http
        .get(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .expect(200);
      expect(exam.body).toMatchObject({
        status: 'QUESTIONS_READY',
        questionCount: 2,
      });
    });

    it('keeps a question id when saved again under the same code', async () => {
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({
          questions: [
            { ...question('Q1', 4), title: 'Renamed' },
            question('Q2', 3),
          ],
        })
        .expect(200);
      expect(res.body.questions[0]).toMatchObject({
        id: ids.q1,
        title: 'Renamed',
      });
    });

    it('403 for a TA and for another instructor', async () => {
      const body = { questions: [question('Q1')] };
      await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('nikos'))
        .send(body)
        .expect(403);
      await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('other'))
        .send(body)
        .expect(403);
      await http
        .get(`/exams/${ids.exam}/questions`)
        .set(auth('nikos'))
        .expect(403);
    });
  });

  describe('PATCH /exams/:id', () => {
    it('updates the name, date and pass mark', async () => {
      const res = await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .send({ name: 'Midterm 1', passMark: 3.5, heldAt: null })
        .expect(200);
      expect(res.body).toMatchObject({
        name: 'Midterm 1',
        passMark: 3.5,
        heldAt: null,
      });
    });

    it('400 for an unknown status or a negative pass mark', async () => {
      await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .send({ status: 'CLOSED' })
        .expect(400);
      await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .send({ passMark: -1 })
        .expect(400);
    });

    it('400 opening an exam that has no questions', async () => {
      const empty = await prisma.exam.create({
        data: { courseId: ids.course, name: 'Empty' },
      });
      const res = await http
        .patch(`/exams/${empty.id}`)
        .set(auth('instructor'))
        .send({ status: 'OPEN' })
        .expect(400);
      expect(res.body.error.message).toContain('question');
    });

    it('opens, then 409 going back to draft once a TA added a paper', async () => {
      await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .send({ status: 'OPEN' })
        .expect(200);
      const paper = await prisma.paper.create({
        data: {
          examId: ids.exam,
          taId: ids.nikos,
          studentId: 'csd5150',
          status: 'DRAFT',
          answers: {
            create: [
              {
                questionId: ids.q1,
                transcription: '',
                uncertainWords: [],
                pages: [],
              },
            ],
          },
        },
      });
      ids.paper = paper.id;
      const res = await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('instructor'))
        .send({ status: 'DRAFT' })
        .expect(409);
      expect(res.body.error.message).toContain('1 paper');
    });

    it('409 removing a question a paper already uses', async () => {
      const res = await http
        .put(`/exams/${ids.exam}/questions`)
        .set(auth('instructor'))
        .send({ questions: [question('Q2', 3)] })
        .expect(409);
      expect(res.body.error.message).toContain('used by papers');
    });

    it('403 for a TA and for another instructor', async () => {
      await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('nikos'))
        .send({ name: 'X' })
        .expect(403);
      await http
        .patch(`/exams/${ids.exam}`)
        .set(auth('other'))
        .send({ name: 'X' })
        .expect(403);
    });
  });

  describe('POST /exams/:id/questions/import', () => {
    const pdf = Buffer.from('%PDF-1.4\n%fake\n');

    it('returns draft questions without saving them', async () => {
      const res = await http
        .post(`/exams/${ids.exam}/questions/import`)
        .set(auth('instructor'))
        .attach('file', pdf, {
          filename: 'solutions.pdf',
          contentType: 'application/pdf',
        })
        .expect(201);
      expect(res.body).toEqual({ examId: ids.exam, questions: IMPORTED });
      expect(await prisma.question.count({ where: { examId: ids.exam } })).toBe(
        2,
      );
    });

    it('400 without a file or with something that is not a PDF', async () => {
      await http
        .post(`/exams/${ids.exam}/questions/import`)
        .set(auth('instructor'))
        .expect(400);
      await http
        .post(`/exams/${ids.exam}/questions/import`)
        .set(auth('instructor'))
        .attach('file', Buffer.from('hello'), {
          filename: 'solutions.pdf',
          contentType: 'application/pdf',
        })
        .expect(400);
    });

    it('403 for a TA and for another instructor', async () => {
      for (const who of ['nikos', 'other']) {
        await http
          .post(`/exams/${ids.exam}/questions/import`)
          .set(auth(who))
          .attach('file', pdf, {
            filename: 'solutions.pdf',
            contentType: 'application/pdf',
          })
          .expect(403);
      }
    });
  });
});
