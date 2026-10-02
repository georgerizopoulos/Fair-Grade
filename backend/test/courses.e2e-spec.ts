import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// Phase 1 checks: course membership is the only thing that gives a TA access.
describe('Courses and membership (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};

  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

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
    const users = [
      ['instructor', 'instructor'],
      ['other', 'instructor'],
      ['maria', 'ta'],
      ['nikos', 'ta'],
      ['invited', 'ta'],
    ] as const;
    for (const [key, role] of users) {
      const u = await prisma.user.create({
        data: {
          name: key,
          email: `${key}@test.com`,
          passwordHash,
          role,
          status: key === 'invited' ? 'INVITED' : 'ACTIVE',
        },
      });
      ids[key] = u.id;
    }

    const hy335 = await prisma.course.create({
      data: {
        code: 'HY335',
        name: 'Computer Networks',
        semester: 'Winter 2026–27',
        ownerId: ids.instructor,
        members: {
          create: [
            { userId: ids.maria, role: 'ta' },
            { userId: ids.nikos, role: 'ta' },
          ],
        },
        exams: {
          create: [
            { name: 'Midterm', heldAt: new Date('2026-09-30'), status: 'OPEN' },
            {
              name: 'Exam 1',
              heldAt: new Date('2026-09-16'),
              status: 'PUBLISHED',
            },
            // The instructor is still preparing this one; a TA shouldn't see it.
            { name: 'Final', heldAt: new Date('2027-01-20'), status: 'DRAFT' },
          ],
        },
      },
    });
    const hy360 = await prisma.course.create({
      data: {
        code: 'HY360',
        name: 'Database Systems',
        semester: 'Winter 2026–27',
        ownerId: ids.instructor,
      },
    });
    const foreign = await prisma.course.create({
      data: {
        code: 'HY999',
        name: 'Someone else',
        semester: 'X',
        ownerId: ids.other,
      },
    });
    ids.hy335 = hy335.id;
    ids.hy360 = hy360.id;
    ids.foreign = foreign.id;

    for (const key of ['instructor', 'maria', 'invited']) {
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

  it('a TA sees only the courses they are a member of', async () => {
    const res = await http.get('/courses').set(auth('maria')).expect(200);
    expect(res.body.viewerRole).toBe('ta');
    expect(res.body.courses.map((c: { code: string }) => c.code)).toEqual([
      'HY335',
    ]);
    expect(res.body.courses[0]).toMatchObject({
      examCount: 2,
      taCount: 2,
      latestExam: { name: 'Midterm', status: 'OPEN' },
    });
  });

  it("the instructor sees the courses they own, not other instructors' courses", async () => {
    const res = await http.get('/courses').set(auth('instructor')).expect(200);
    expect(res.body.courses.map((c: { code: string }) => c.code)).toEqual([
      'HY335',
      'HY360',
    ]);
    await http
      .get(`/courses/${ids.foreign}`)
      .set(auth('instructor'))
      .expect(403);
  });

  it('a TA calling a course they are not a member of gets 403', async () => {
    const res = await http
      .get(`/courses/${ids.hy360}`)
      .set(auth('maria'))
      .expect(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('GET /courses/:id: exams in date order, members marked "You"', async () => {
    const res = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('maria'))
      .expect(200);
    expect(res.body.exams.map((e: { name: string }) => e.name)).toEqual([
      'Exam 1',
      'Midterm',
    ]);
    const me = res.body.members.find(
      (m: { userId: string }) => m.userId === ids.maria,
    );
    const other = res.body.members.find(
      (m: { userId: string }) => m.userId === ids.nikos,
    );
    expect(me.isYou).toBe(true);
    expect(other.isYou).toBe(false);
  });

  it('GET /courses/:id: a TA does not see draft exams or the leaderboard setting', async () => {
    const ta = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('maria'))
      .expect(200);
    // DRAFT "Final" is hidden; only OPEN/PUBLISHED exams show.
    expect(ta.body.exams.map((e: { name: string }) => e.name)).toEqual([
      'Exam 1',
      'Midterm',
    ]);
    expect(ta.body).not.toHaveProperty('leaderboardVisibility');
    // A TA can only add papers to the OPEN exam.
    const byName = (n: string) =>
      ta.body.exams.find((e: { name: string }) => e.name === n);
    expect(byName('Midterm').canAddPapers).toBe(true);
    expect(byName('Exam 1').canAddPapers).toBe(false);

    const instructor = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('instructor'))
      .expect(200);
    // The instructor sees every exam, including the draft, and the setting.
    expect(instructor.body.exams.map((e: { name: string }) => e.name)).toEqual([
      'Exam 1',
      'Midterm',
      'Final',
    ]);
    expect(instructor.body).toHaveProperty('leaderboardVisibility');
    expect(instructor.body.exams[0]).not.toHaveProperty('canAddPapers');
  });

  it('unknown course → 404', async () => {
    await http.get('/courses/nope').set(auth('instructor')).expect(404);
  });

  it('every authenticated response carries the caller role in a header', async () => {
    const res = await http.get('/courses').set(auth('maria')).expect(200);
    expect(res.headers['x-user-role']).toBe('ta');
    expect(res.headers['x-user-id']).toBe(ids.maria);
  });

  it('POST /courses: instructor only, owner is the caller, duplicates → 409', async () => {
    const body = {
      code: 'HY359',
      name: 'Web Programming',
      semester: 'Spring 2026',
    };
    await http.post('/courses').set(auth('maria')).send(body).expect(403);
    const res = await http
      .post('/courses')
      .set(auth('instructor'))
      .send(body)
      .expect(201);
    expect(res.body.owner).toMatchObject({ id: ids.instructor, isYou: true });
    await http.post('/courses').set(auth('instructor')).send(body).expect(409);
    await http
      .post('/courses')
      .set(auth('instructor'))
      .send({ code: '', name: 'x', semester: 'y' })
      .expect(400);
  });

  it('PATCH /courses/:id/settings: instructor only, validated', async () => {
    await http
      .patch(`/courses/${ids.hy335}/settings`)
      .set(auth('maria'))
      .send({ leaderboardVisibility: 'NAMED' })
      .expect(403);
    await http
      .patch(`/courses/${ids.hy335}/settings`)
      .set(auth('instructor'))
      .send({ leaderboardVisibility: 'LOUD' })
      .expect(400);
    const res = await http
      .patch(`/courses/${ids.hy335}/settings`)
      .set(auth('instructor'))
      .send({ leaderboardVisibility: 'NAMED' })
      .expect(200);
    expect(res.body.leaderboardVisibility).toBe('NAMED');
  });

  it('signing in records lastSignInAt and activates an invited user', async () => {
    const invited = await prisma.user.findUniqueOrThrow({
      where: { id: ids.invited },
    });
    expect(invited.status).toBe('ACTIVE');
    expect(invited.lastSignInAt).toBeInstanceOf(Date);
  });
  it('GET /courses/:id/stats: instructor only, empty before any AI grade', async () => {
    await http
      .get(`/courses/${ids.hy335}/stats`)
      .set(auth('maria'))
      .expect(403);
    await http
      .get(`/courses/${ids.foreign}/stats`)
      .set(auth('instructor'))
      .expect(403);
    const res = await http
      .get(`/courses/${ids.hy335}/stats`)
      .set(auth('instructor'))
      .expect(200);
    expect(res.body).toMatchObject({
      course: { code: 'HY335' },
      trend: [],
      leaderboard: [],
      atStake: [],
      kpis: { papersSubmitted: 0, aiGraded: 0 },
    });
    await http
      .get(`/courses/${ids.hy335}/stats?examId=not-in-this-course`)
      .set(auth('instructor'))
      .expect(404);
  });

  it('GET /courses/:id/stats: a paper whose pass depends on who graded is at stake', async () => {
    const midterm = await prisma.exam.findFirstOrThrow({
      where: { courseId: ids.hy335, name: 'Midterm' },
    });
    const q = await prisma.question.create({
      data: {
        examId: midterm.id,
        code: 'Q1',
        title: 'Everything',
        prompt: 'Explain.',
        maxPoints: 10,
        modelAnswer: 'All of it.',
        order: 1,
      },
    });
    await prisma.paper.create({
      data: {
        examId: midterm.id,
        taId: ids.maria,
        studentId: 'csd9001',
        status: 'AI_GRADED',
        createdAt: new Date('2026-09-30T10:00:00Z'),
        submittedAt: new Date('2026-09-30T10:20:00Z'),
        answers: {
          create: [
            {
              questionId: q.id,
              transcription: 'x',
              taPoints: 4,
              aiPoints: 6,
              uncertainWords: [],
              pages: [],
            },
          ],
        },
      },
    });

    const res = await http
      .get(`/courses/${ids.hy335}/stats?examId=${midterm.id}`)
      .set(auth('instructor'))
      .expect(200);
    expect(res.body.trend).toHaveLength(1);
    expect(res.body.trend[0]).toMatchObject({ name: 'Midterm', averageGap: 2 });
    expect(res.body.atStake).toEqual([
      expect.objectContaining({ studentId: 'csd9001', failsWithTa: true }),
    ]);
    expect(res.body.leaderboard[0]).toMatchObject({
      name: 'maria',
      papers: 1,
      averageGap: 2,
      direction: 'stricter',
      medianMinutes: 20,
    });
    expect(res.body.distribution).toMatchObject({
      total: 1,
      passedTa: 0,
      passedAi: 1,
    });
  });

  it('GET /courses/:id/activity: instructor only, newest first, limit validated', async () => {
    await prisma.activityLog.createMany({
      data: [
        {
          courseId: ids.hy335,
          type: 'MEMBER_ADDED',
          actorId: ids.instructor,
          payload: { userId: ids.nikos, name: 'nikos' },
          createdAt: new Date('2026-10-01T09:00:00Z'),
        },
        {
          courseId: ids.hy335,
          type: 'PAPER_SUBMITTED',
          actorId: ids.maria,
          payload: { studentId: 'csd9001' },
          createdAt: new Date('2026-10-01T10:00:00Z'),
        },
      ],
    });
    await http
      .get(`/courses/${ids.hy335}/activity`)
      .set(auth('maria'))
      .expect(403);
    await http
      .get(`/courses/${ids.hy335}/activity?limit=0`)
      .set(auth('instructor'))
      .expect(400);
    const res = await http
      .get(`/courses/${ids.hy335}/activity?limit=5`)
      .set(auth('instructor'))
      .expect(200);
    expect(res.body.activity.map((a: { type: string }) => a.type)).toEqual([
      'PAPER_SUBMITTED',
      'MEMBER_ADDED',
    ]);
    expect(res.body.activity[0]).toMatchObject({
      actor: { name: 'maria' },
      paper: { studentId: 'csd9001' },
    });
    expect(res.body.activity[1].member).toMatchObject({ name: 'nikos' });
  });
  it('exam status: a new exam is a draft, saving questions makes it ready, then it opens for TAs', async () => {
    const created = await http
      .post(`/courses/${ids.hy335}/exams`)
      .set(auth('instructor'))
      .send({ name: 'Resit', heldAt: '2027-02-10' })
      .expect(201);
    expect(created.body.status).toBe('DRAFT');
    const examId = created.body.id;

    await http
      .patch(`/exams/${examId}`)
      .set(auth('instructor'))
      .send({ status: 'OPEN' })
      .expect(400);
    await http
      .patch(`/exams/${examId}`)
      .set(auth('instructor'))
      .send({ status: 'CLOSED' })
      .expect(400);

    await http
      .put(`/exams/${examId}/questions`)
      .set(auth('instructor'))
      .send({
        questions: [
          {
            code: 'Q1',
            title: 'Routing',
            prompt: 'Explain routing.',
            maxPoints: 2,
            modelAnswer: 'Forwarding by table.',
            rubric: [{ text: 'Table lookup', points: 2 }],
          },
        ],
      })
      .expect(200);
    expect(
      (await http.get(`/exams/${examId}`).set(auth('instructor')).expect(200))
        .body.status,
    ).toBe('QUESTIONS_READY');

    await http
      .patch(`/exams/${examId}`)
      .set(auth('maria'))
      .send({ status: 'OPEN' })
      .expect(403);
    const opened = await http
      .patch(`/exams/${examId}`)
      .set(auth('instructor'))
      .send({ status: 'OPEN' })
      .expect(200);
    expect(opened.body.status).toBe('OPEN');

    const asTa = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('maria'))
      .expect(200);
    expect(
      asTa.body.exams.find((e: { id: string }) => e.id === examId),
    ).toMatchObject({
      canAddPapers: true,
    });
  });
  it('reopen requests: the TA asks with a note, the instructor sees it, declines or reopens', async () => {
    const paper = await prisma.paper.findFirstOrThrow({
      where: { studentId: 'csd9001' },
    });
    await http
      .post(`/papers/${paper.id}/request-reopen`)
      .set(auth('maria'))
      .send({ reason: 'I misread Q1, the answer deserves more.' })
      .expect(200);

    await http
      .get(`/courses/${ids.hy335}/reopen-requests`)
      .set(auth('maria'))
      .expect(403);
    const list = await http
      .get(`/courses/${ids.hy335}/reopen-requests`)
      .set(auth('instructor'))
      .expect(200);
    expect(list.body.requests).toEqual([
      expect.objectContaining({
        paperId: paper.id,
        studentId: 'csd9001',
        ta: { id: ids.maria, name: 'maria' },
        reason: 'I misread Q1, the answer deserves more.',
        taTotal: 4,
        aiTotal: 6,
      }),
    ]);
    const course = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('instructor'))
      .expect(200);
    expect(course.body.reopenRequests).toBe(1);
    const asTa = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('maria'))
      .expect(200);
    expect(asTa.body).not.toHaveProperty('reopenRequests');
    const one = await http
      .get(`/papers/${paper.id}`)
      .set(auth('instructor'))
      .expect(200);
    expect(one.body.reopenRequest).toMatchObject({
      by: { name: 'maria' },
      reason: 'I misread Q1, the answer deserves more.',
    });

    await http
      .post(`/papers/${paper.id}/decline-reopen`)
      .set(auth('maria'))
      .expect(403);
    await http
      .post(`/papers/${paper.id}/decline-reopen`)
      .set(auth('instructor'))
      .expect(200);
    await http
      .post(`/papers/${paper.id}/decline-reopen`)
      .set(auth('instructor'))
      .expect(409);
    expect(
      (
        await http
          .get(`/courses/${ids.hy335}/reopen-requests`)
          .set(auth('instructor'))
      ).body.requests,
    ).toEqual([]);

    await http
      .post(`/papers/${paper.id}/request-reopen`)
      .set(auth('maria'))
      .send({ reason: 'x'.repeat(501) })
      .expect(400);
    await http
      .post(`/papers/${paper.id}/request-reopen`)
      .set(auth('maria'))
      .expect(200);
    const reopened = await http
      .post(`/papers/${paper.id}/reopen`)
      .set(auth('instructor'))
      .expect(200);
    expect(reopened.body).toMatchObject({
      status: 'DRAFT',
      reopenRequested: false,
    });
  });
});
