import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import { PDFDocument } from 'pdf-lib';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// The paper lifecycle and who may see what:
//   upload → DRAFT → (save points) → submit → AI_GRADING → AI_GRADED / AI_FAILED
//   reopen (instructor only) → DRAFT again.
// The AI worker is off under NODE_ENV=test, so papers stay where we put them.
describe('Papers (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};
  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

  // A paper straight in the database: two answers, optionally with AI points.
  async function paper(
    taKey: 'nikos' | 'maria',
    studentId: string,
    opts: {
      status?:
        'DRAFT' | 'AI_GRADING' | 'AI_GRADED' | 'AI_FAILED' | 'TRANSCRIBING';
      taPoints?: [number | null, number | null];
      aiPoints?: [number, number];
      examId?: string;
    } = {},
  ) {
    const taPoints = opts.taPoints ?? [3, 1];
    const created = await prisma.paper.create({
      data: {
        examId: opts.examId ?? ids.exam,
        taId: ids[taKey],
        studentId,
        status: opts.status ?? 'DRAFT',
        pageCount: 2,
        submittedAt: opts.status && opts.status !== 'DRAFT' ? new Date() : null,
        pages: {
          create: [
            { index: 0, status: 'READ' },
            { index: 1, status: 'READ' },
          ],
        },
        answers: {
          create: [
            {
              questionId: ids.q1,
              transcription: 'answer one',
              taPoints: taPoints[0],
              aiPoints: opts.aiPoints?.[0] ?? null,
              aiReasoning: opts.aiPoints ? 'AI says Q1' : null,
              uncertainWords: [],
              pages: [],
            },
            {
              questionId: ids.q2,
              transcription: 'answer two',
              taPoints: taPoints[1],
              aiPoints: opts.aiPoints?.[1] ?? null,
              aiReasoning: opts.aiPoints ? 'AI says Q2' : null,
              uncertainWords: [],
              pages: [],
            },
          ],
        },
      },
    });
    return created.id;
  }

  const pdfFile = async () => {
    const doc = await PDFDocument.create();
    doc.addPage();
    doc.addPage();
    return Buffer.from(await doc.save());
  };

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
      ['otherInstructor', 'instructor'],
      ['nikos', 'ta'],
      ['maria', 'ta'],
      ['outsider', 'ta'],
    ] as const) {
      const u = await prisma.user.create({
        data: {
          name: key,
          email: `${key.toLowerCase()}@test.com`,
          passwordHash,
          role,
        },
      });
      ids[key] = u.id;
      tokens[key] = (
        await http.post('/auth/login').send({
          email: `${key.toLowerCase()}@test.com`,
          password: 'demo1234',
        })
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
            { userId: ids.nikos, role: 'ta' },
            { userId: ids.maria, role: 'ta' },
          ],
        },
      },
    });
    const exam = await prisma.exam.create({
      data: { courseId: course.id, name: 'Midterm', status: 'OPEN' },
    });
    const closed = await prisma.exam.create({
      data: { courseId: course.id, name: 'Final', status: 'DRAFT' },
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
    Object.assign(ids, {
      course: course.id,
      exam: exam.id,
      closedExam: closed.id,
      q1: q1.id,
      q2: q2.id,
    });
  });

  afterAll(async () => {
    // Uploaded PDFs land in uploads/ (gitignored); don't leave test files there.
    const uploaded = await prisma.paper.findMany({
      where: { pdfPath: { not: null } },
      select: { pdfPath: true },
    });
    await Promise.all(
      uploaded.map((p) =>
        rm(resolve(process.cwd(), p.pdfPath!), { force: true }),
      ),
    );
    await app.close();
  });

  // ------------------------------------------------------------ upload

  describe('POST /exams/:id/papers', () => {
    const upload = (
      who: string,
      examId: string,
      fields: Record<string, string>,
      file?: { buffer: Buffer; filename: string; contentType: string },
    ) => {
      let req = http.post(`/exams/${examId}/papers`).set(auth(who));
      for (const [k, v] of Object.entries(fields)) req = req.field(k, v);
      if (file) {
        req = req.attach('file', file.buffer, {
          filename: file.filename,
          contentType: file.contentType,
        });
      }
      return req;
    };
    const asPdf = async () => ({
      buffer: await pdfFile(),
      filename: 'scan.pdf',
      contentType: 'application/pdf',
    });

    it('a member TA uploads a PDF → 201 DRAFT with one answer per question, no AI grade', async () => {
      const res = await upload(
        'nikos',
        ids.exam,
        { studentId: ' csd5150 ' },
        await asPdf(),
      ).expect(201);
      expect(res.body).toMatchObject({
        viewerRole: 'ta',
        studentId: 'csd5150',
        status: 'DRAFT',
        locked: false,
        pageCount: 2,
        ta: { id: ids.nikos, isYou: true },
      });
      expect(res.body.answers.map((a: { code: string }) => a.code)).toEqual([
        'Q1',
        'Q2',
      ]);
      expect(res.body.answers[0].taPoints).toBeNull();
      expect(res.body.answers[0].aiPoints).toBeUndefined();
      expect(res.body.aiTotal).toBeUndefined();
      expect(
        await prisma.paperPage.count({ where: { paperId: res.body.id } }),
      ).toBe(2);
    });

    it('an instructor uploads on behalf of a TA (taId required)', async () => {
      await upload(
        'instructor',
        ids.exam,
        { studentId: 'csd5151' },
        await asPdf(),
      ).expect(400);
      const res = await upload(
        'instructor',
        ids.exam,
        { studentId: 'csd5151', taId: ids.maria },
        await asPdf(),
      ).expect(201);
      expect(res.body.ta.id).toBe(ids.maria);
      expect(res.body.viewerRole).toBe('instructor');
    });

    it('validates the file and the fields → 400', async () => {
      const noFile = await upload('nikos', ids.exam, {
        studentId: 'csd1',
      }).expect(400);
      expect(noFile.body.error.message).toContain('PDF file is required');

      const notPdf = await upload(
        'nikos',
        ids.exam,
        { studentId: 'csd1' },
        {
          buffer: Buffer.from('hello'),
          filename: 'scan.pdf',
          contentType: 'application/pdf',
        },
      ).expect(400);
      expect(notPdf.body.error.message).toContain('valid PDF');

      // A PDF by name and type only: the %PDF- header is what counts.
      await upload(
        'nikos',
        ids.exam,
        { studentId: 'csd1' },
        {
          buffer: Buffer.from('MZ not a pdf'),
          filename: 'scan.pdf',
          contentType: 'application/pdf',
        },
      ).expect(400);

      const noStudent = await upload(
        'nikos',
        ids.exam,
        {},
        await asPdf(),
      ).expect(400);
      expect(noStudent.body.error.message).toContain('studentId');
    });

    it('401 without a token, 403 for a TA outside the course, 404 for an unknown exam', async () => {
      await http.post(`/exams/${ids.exam}/papers`).expect(401);
      await upload(
        'outsider',
        ids.exam,
        { studentId: 'csd2' },
        await asPdf(),
      ).expect(403);
      await upload(
        'nikos',
        'nope',
        { studentId: 'csd2' },
        await asPdf(),
      ).expect(404);
    });

    it("403 for an instructor who doesn't own the course", async () => {
      await upload(
        'otherInstructor',
        ids.exam,
        { studentId: 'csd2', taId: ids.nikos },
        await asPdf(),
      ).expect(403);
    });

    it('409 naming the student when that student already has a paper in the exam', async () => {
      await paper('maria', 'csd5999');
      const res = await upload(
        'nikos',
        ids.exam,
        { studentId: 'csd5999' },
        await asPdf(),
      ).expect(409);
      expect(res.body.error.code).toBe('CONFLICT');
      expect(res.body.error.message).toContain('csd5999');
      // The refused upload left nothing behind.
      expect(
        await prisma.paper.count({
          where: { examId: ids.exam, studentId: 'csd5999' },
        }),
      ).toBe(1);
    });

    it('409 when the exam is not open for grading', async () => {
      const res = await upload(
        'nikos',
        ids.closedExam,
        { studentId: 'csd3' },
        await asPdf(),
      ).expect(409);
      expect(res.body.error.message).toContain('open for grading');
    });
  });

  // ------------------------------------------------------------ read

  describe('GET /papers/:id', () => {
    it('a TA opens their own paper; the owner instructor can too', async () => {
      const id = await paper('nikos', 'csd5200');
      const own = await http
        .get(`/papers/${id}`)
        .set(auth('nikos'))
        .expect(200);
      expect(own.body).toMatchObject({
        id,
        viewerRole: 'ta',
        studentId: 'csd5200',
      });
      await http.get(`/papers/${id}`).set(auth('instructor')).expect(200);
    });

    it("a TA can't open another TA's paper, even in the same course → 403", async () => {
      const id = await paper('nikos', 'csd5201');
      const res = await http
        .get(`/papers/${id}`)
        .set(auth('maria'))
        .expect(403);
      expect(res.body.error.code).toBe('FORBIDDEN');
    });

    it('403 for a TA outside the course and an instructor who does not own it; 404 unknown; 401 anonymous', async () => {
      const id = await paper('nikos', 'csd5202');
      await http.get(`/papers/${id}`).set(auth('outsider')).expect(403);
      await http.get(`/papers/${id}`).set(auth('otherInstructor')).expect(403);
      await http.get('/papers/nope').set(auth('nikos')).expect(404);
      await http.get(`/papers/${id}`).expect(401);
    });

    it("a TA doesn't see the AI's grade before submitting; the instructor does", async () => {
      // What a reopened paper looks like: back to DRAFT, old AI grade still stored.
      const id = await paper('nikos', 'csd5203', { aiPoints: [2, 1] });
      const ta = await http.get(`/papers/${id}`).set(auth('nikos')).expect(200);
      for (const a of ta.body.answers) {
        expect(a).not.toHaveProperty('aiPoints');
        expect(a).not.toHaveProperty('aiReasoning');
      }
      expect(ta.body).not.toHaveProperty('aiTotal');
      expect(ta.body).not.toHaveProperty('gap');
      expect(ta.body.aiGradedAt).toBeNull();
      expect(JSON.stringify(ta.body)).not.toContain('AI says');

      const instructor = await http
        .get(`/papers/${id}`)
        .set(auth('instructor'))
        .expect(200);
      expect(instructor.body.answers[0]).toMatchObject({
        aiPoints: 2,
        aiReasoning: 'AI says Q1',
      });
      expect(instructor.body.aiTotal).toBe(3);
    });

    it('after submitting, the TA sees the AI grade, reasoning and totals', async () => {
      const id = await paper('nikos', 'csd5204', {
        status: 'AI_GRADED',
        aiPoints: [2, 2],
      });
      const res = await http
        .get(`/papers/${id}`)
        .set(auth('nikos'))
        .expect(200);
      expect(
        res.body.answers.map((a: { aiPoints: number }) => a.aiPoints),
      ).toEqual([2, 2]);
      expect(res.body.answers[0].aiReasoning).toBe('AI says Q1');
      expect(res.body).toMatchObject({ taTotal: 4, aiTotal: 4, locked: true });
    });
  });

  describe('GET /exams/:id/my-papers', () => {
    it("lists only the signed-in TA's papers, with the AI total only once AI-graded", async () => {
      const mine = await paper('nikos', 'csd5300', {
        status: 'AI_GRADED',
        aiPoints: [3, 2],
      });
      const draft = await paper('nikos', 'csd5301', { aiPoints: [3, 2] });
      const theirs = await paper('maria', 'csd5302');
      const res = await http
        .get(`/exams/${ids.exam}/my-papers`)
        .set(auth('nikos'))
        .expect(200);
      const byId = new Map(
        res.body.papers.map((p: { id: string }) => [p.id, p]),
      );
      expect(byId.has(mine)).toBe(true);
      expect(byId.has(draft)).toBe(true);
      expect(byId.has(theirs)).toBe(false);
      expect(byId.get(mine)).toMatchObject({ aiTotal: 5, taTotal: 4, gap: -1 });
      expect(byId.get(draft)).toMatchObject({ aiTotal: null, taTotal: null });
    });

    it('filters and searches; a bad filter → 400', async () => {
      const submitted = await http
        .get(`/exams/${ids.exam}/my-papers?filter=submitted&q=CSD5300`)
        .set(auth('nikos'))
        .expect(200);
      expect(
        submitted.body.papers.map((p: { studentId: string }) => p.studentId),
      ).toEqual(['csd5300']);
      await http
        .get(`/exams/${ids.exam}/my-papers?filter=bogus`)
        .set(auth('nikos'))
        .expect(400);
    });

    it('403 for an instructor and for a TA outside the course; 404 unknown exam; 401 anonymous', async () => {
      await http
        .get(`/exams/${ids.exam}/my-papers`)
        .set(auth('instructor'))
        .expect(403);
      await http
        .get(`/exams/${ids.exam}/my-papers`)
        .set(auth('outsider'))
        .expect(403);
      await http.get('/exams/nope/my-papers').set(auth('nikos')).expect(404);
      await http.get(`/exams/${ids.exam}/my-papers`).expect(401);
    });
  });

  // ------------------------------------------------------------ draft

  describe('PATCH /papers/:id', () => {
    it('saves points and edits the transcription; the paper stays a DRAFT', async () => {
      const id = await paper('nikos', 'csd5400', { taPoints: [null, null] });
      const res = await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({
          answers: [
            { questionId: ids.q1, taPoints: 2.5, transcription: 'fixed text' },
            { questionId: ids.q2, taPoints: 0 },
          ],
        })
        .expect(200);
      expect(res.body.status).toBe('DRAFT');
      expect(res.body.answers[0]).toMatchObject({
        taPoints: 2.5,
        transcription: 'fixed text',
      });
      expect(res.body.answers[1].taPoints).toBe(0);

      // null clears a grade; omitted questions are untouched.
      const cleared = await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q1, taPoints: null }] })
        .expect(200);
      expect(cleared.body.answers[0].taPoints).toBeNull();
      expect(cleared.body.answers[1].taPoints).toBe(0);
    });

    it('rejects points above the maximum, off the 0.5 grid, or for a foreign question → 400 naming the question', async () => {
      const id = await paper('nikos', 'csd5401');
      const tooMany = await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q2, taPoints: 2.5 }] })
        .expect(400);
      expect(tooMany.body.error.message).toContain('Q2');
      expect(tooMany.body.error.message).toContain('0 to 2');

      const offGrid = await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q1, taPoints: 1.3 }] })
        .expect(400);
      expect(offGrid.body.error.message).toContain('steps of 0.5');

      const foreign = await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: 'not-a-question', taPoints: 1 }] })
        .expect(400);
      expect(foreign.body.error.message).toContain(
        'not a question of this exam',
      );

      await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [] })
        .expect(400);
      await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q1, taPoints: -1 }] })
        .expect(400);
      // Nothing from the rejected saves was kept.
      const stored = await prisma.paperAnswer.findFirstOrThrow({
        where: { paperId: id, questionId: ids.q1 },
      });
      expect(stored.taPoints).toBe(3);
    });

    it('only the TA who owns the paper can save: other TA, outsider and instructor → 403; unknown → 404; anonymous → 401', async () => {
      const id = await paper('nikos', 'csd5402');
      const body = { answers: [{ questionId: ids.q1, taPoints: 1 }] };
      await http
        .patch(`/papers/${id}`)
        .set(auth('maria'))
        .send(body)
        .expect(403);
      await http
        .patch(`/papers/${id}`)
        .set(auth('outsider'))
        .send(body)
        .expect(403);
      await http
        .patch(`/papers/${id}`)
        .set(auth('instructor'))
        .send(body)
        .expect(403);
      await http
        .patch('/papers/nope')
        .set(auth('nikos'))
        .send(body)
        .expect(404);
      await http.patch(`/papers/${id}`).send(body).expect(401);
    });

    it('409 once the paper is submitted (grades are locked) or still transcribing', async () => {
      const body = { answers: [{ questionId: ids.q1, taPoints: 1 }] };
      const submitted = await paper('nikos', 'csd5403', {
        status: 'AI_GRADED',
      });
      const locked = await http
        .patch(`/papers/${submitted}`)
        .set(auth('nikos'))
        .send(body)
        .expect(409);
      expect(locked.body.error.message).toContain('locked');
      const transcribing = await paper('nikos', 'csd5404', {
        status: 'TRANSCRIBING',
      });
      await http
        .patch(`/papers/${transcribing}`)
        .set(auth('nikos'))
        .send(body)
        .expect(409);
    });
  });

  // ------------------------------------------------------------ submit

  describe('POST /papers/:id/submit', () => {
    it('400 naming the questions that still have no points', async () => {
      const id = await paper('nikos', 'csd5500', { taPoints: [2, null] });
      const res = await http
        .post(`/papers/${id}/submit`)
        .set(auth('nikos'))
        .expect(400);
      expect(res.body.error.message).toContain('Q2');
      expect(res.body.error.message).not.toContain('Q1');
      expect(
        (await prisma.paper.findUniqueOrThrow({ where: { id } })).status,
      ).toBe('DRAFT');
    });

    it('submits: AI_GRADING, locked, queued for the worker, activity logged; then 409 on edit and on a second submit', async () => {
      const id = await paper('nikos', 'csd5501', { taPoints: [3, 2] });
      const res = await http
        .post(`/papers/${id}/submit`)
        .set(auth('nikos'))
        .expect(200);
      expect(res.body).toMatchObject({ status: 'AI_GRADING', locked: true });
      expect(res.body.submittedAt).toEqual(expect.any(String));

      const stored = await prisma.paper.findUniqueOrThrow({ where: { id } });
      expect(stored.aiNextAttemptAt).toBeInstanceOf(Date);
      expect(
        await prisma.activityLog.count({
          where: { paperId: id, type: 'PAPER_SUBMITTED' },
        }),
      ).toBe(1);

      await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q1, taPoints: 0 }] })
        .expect(409);
      await http.post(`/papers/${id}/submit`).set(auth('nikos')).expect(409);
    });

    it('403 for the instructor, another TA and an outsider; 404 unknown; 401 anonymous', async () => {
      const id = await paper('nikos', 'csd5502', { taPoints: [3, 2] });
      await http
        .post(`/papers/${id}/submit`)
        .set(auth('instructor'))
        .expect(403);
      await http.post(`/papers/${id}/submit`).set(auth('maria')).expect(403);
      await http.post(`/papers/${id}/submit`).set(auth('outsider')).expect(403);
      await http.post('/papers/nope/submit').set(auth('nikos')).expect(404);
      await http.post(`/papers/${id}/submit`).expect(401);
      expect(
        (await prisma.paper.findUniqueOrThrow({ where: { id } })).status,
      ).toBe('DRAFT');
    });
  });

  // ------------------------------------------------------------ reopen

  describe('reopen flow', () => {
    it('a TA asks to reopen a submitted paper (once, with a reason); a draft → 409; the instructor → 403', async () => {
      const draft = await paper('nikos', 'csd5600');
      await http
        .post(`/papers/${draft}/request-reopen`)
        .set(auth('nikos'))
        .send({})
        .expect(409);

      const id = await paper('nikos', 'csd5601', {
        status: 'AI_GRADED',
        aiPoints: [3, 2],
      });
      await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('instructor'))
        .send({})
        .expect(403);

      const asked = await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('nikos'))
        .send({ reason: 'I mis-added Q2' })
        .expect(200);
      expect(asked.body.reopenRequested).toBe(true);
      expect(asked.body.reopenRequest.reason).toBe('I mis-added Q2');
      // Asking again is harmless and doesn't log a second request.
      await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('nikos'))
        .send({})
        .expect(200);
      expect(
        await prisma.activityLog.count({
          where: { paperId: id, type: 'REOPEN_REQUESTED' },
        }),
      ).toBe(1);

      await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('maria'))
        .send({})
        .expect(403);
      await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('nikos'))
        .send({ reason: 'x'.repeat(501) })
        .expect(400);
    });

    it('only the course instructor reopens: TA, outsider and other instructor → 403', async () => {
      const id = await paper('nikos', 'csd5602', {
        status: 'AI_GRADED',
        aiPoints: [3, 2],
      });
      await http.post(`/papers/${id}/reopen`).set(auth('nikos')).expect(403);
      await http.post(`/papers/${id}/reopen`).set(auth('outsider')).expect(403);
      await http
        .post(`/papers/${id}/reopen`)
        .set(auth('otherInstructor'))
        .expect(403);
      await http
        .post('/papers/nope/reopen')
        .set(auth('instructor'))
        .expect(404);
      await http.post(`/papers/${id}/reopen`).expect(401);
      expect(
        (await prisma.paper.findUniqueOrThrow({ where: { id } })).status,
      ).toBe('AI_GRADED');
    });

    it('reopen → DRAFT, points snapshotted in a revision, request cleared, AI grade hidden from the TA again', async () => {
      const id = await paper('nikos', 'csd5603', {
        status: 'AI_GRADED',
        taPoints: [2, 1],
        aiPoints: [3, 2],
      });
      await prisma.paper.update({
        where: { id },
        data: { reopenRequested: true },
      });

      const res = await http
        .post(`/papers/${id}/reopen`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body).toMatchObject({
        status: 'DRAFT',
        locked: false,
        reopenRequested: false,
      });

      const revisions = await prisma.paperRevision.findMany({
        where: { paperId: id },
      });
      expect(revisions).toHaveLength(1);
      expect(revisions[0].createdBy).toBe(ids.instructor);
      expect(
        Object.values(
          revisions[0].taPointsSnapshot as Record<string, number>,
        ).sort((a, b) => a - b),
      ).toEqual([1, 2]);
      expect(
        await prisma.activityLog.count({
          where: { paperId: id, type: 'PAPER_REOPENED' },
        }),
      ).toBe(1);

      const ta = await http.get(`/papers/${id}`).set(auth('nikos')).expect(200);
      expect(ta.body.answers[0]).not.toHaveProperty('aiPoints');
      // ...and the TA can edit again.
      await http
        .patch(`/papers/${id}`)
        .set(auth('nikos'))
        .send({ answers: [{ questionId: ids.q1, taPoints: 3 }] })
        .expect(200);
    });

    it('409 reopening a draft, or a paper the AI is still grading', async () => {
      const draft = await paper('nikos', 'csd5604');
      await http
        .post(`/papers/${draft}/reopen`)
        .set(auth('instructor'))
        .expect(409);
      const grading = await paper('nikos', 'csd5605', { status: 'AI_GRADING' });
      const res = await http
        .post(`/papers/${grading}/reopen`)
        .set(auth('instructor'))
        .expect(409);
      expect(res.body.error.message).toContain('still grading');
    });

    it('decline-reopen: instructor only, and only when someone asked', async () => {
      const id = await paper('nikos', 'csd5606', {
        status: 'AI_GRADED',
        aiPoints: [3, 2],
      });
      await http
        .post(`/papers/${id}/decline-reopen`)
        .set(auth('instructor'))
        .expect(409);
      await http
        .post(`/papers/${id}/request-reopen`)
        .set(auth('nikos'))
        .send({})
        .expect(200);
      await http
        .post(`/papers/${id}/decline-reopen`)
        .set(auth('nikos'))
        .expect(403);
      await http
        .post(`/papers/${id}/decline-reopen`)
        .set(auth('otherInstructor'))
        .expect(403);
      const res = await http
        .post(`/papers/${id}/decline-reopen`)
        .set(auth('instructor'))
        .expect(200);
      expect(res.body).toMatchObject({
        reopenRequested: false,
        status: 'AI_GRADED',
      });
    });
  });

  // ------------------------------------------------------------ retry + rescan

  describe('POST /papers/:id/retry-ai', () => {
    it('re-queues an AI_FAILED paper with attempts reset; any other status → 409', async () => {
      const id = await paper('nikos', 'csd5700', { status: 'AI_FAILED' });
      await prisma.paper.update({
        where: { id },
        data: { aiAttempts: 3, aiError: 'Bedrock down' },
      });
      await http.post(`/papers/${id}/retry-ai`).set(auth('maria')).expect(403);

      const res = await http
        .post(`/papers/${id}/retry-ai`)
        .set(auth('nikos'))
        .expect(200);
      expect(res.body.status).toBe('AI_GRADING');
      expect(
        await prisma.paper.findUniqueOrThrow({ where: { id } }),
      ).toMatchObject({
        aiAttempts: 0,
        aiError: null,
      });

      await http.post(`/papers/${id}/retry-ai`).set(auth('nikos')).expect(409);
      const draft = await paper('nikos', 'csd5701');
      await http
        .post(`/papers/${draft}/retry-ai`)
        .set(auth('nikos'))
        .expect(409);
    });
  });

  describe('POST /papers/:id/pages/:index/rescan', () => {
    it('queues a page of a draft; 404 for a missing page; 400 for a bad index; 409 once submitted', async () => {
      const id = await paper('nikos', 'csd5800');
      const res = await http
        .post(`/papers/${id}/pages/1/rescan`)
        .set(auth('nikos'))
        .expect(200);
      expect(res.body).toEqual({ paperId: id, index: 1, status: 'WAITING' });

      await http
        .post(`/papers/${id}/pages/9/rescan`)
        .set(auth('nikos'))
        .expect(404);
      await http
        .post(`/papers/${id}/pages/-1/rescan`)
        .set(auth('nikos'))
        .expect(400);
      await http
        .post(`/papers/${id}/pages/abc/rescan`)
        .set(auth('nikos'))
        .expect(400);
      await http
        .post(`/papers/${id}/pages/0/rescan`)
        .set(auth('maria'))
        .expect(403);

      const submitted = await paper('nikos', 'csd5801', {
        status: 'AI_GRADED',
      });
      await http
        .post(`/papers/${submitted}/pages/0/rescan`)
        .set(auth('nikos'))
        .expect(409);
    });
  });
});
