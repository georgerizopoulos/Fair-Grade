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
              name: 'Quiz 1',
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
      'Quiz 1',
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
      'Quiz 1',
      'Midterm',
    ]);
    expect(ta.body).not.toHaveProperty('leaderboardVisibility');
    // A TA can only add papers to the OPEN exam.
    const byName = (n: string) =>
      ta.body.exams.find((e: { name: string }) => e.name === n);
    expect(byName('Midterm').canAddPapers).toBe(true);
    expect(byName('Quiz 1').canAddPapers).toBe(false);

    const instructor = await http
      .get(`/courses/${ids.hy335}`)
      .set(auth('instructor'))
      .expect(200);
    // The instructor sees every exam, including the draft, and the setting.
    expect(instructor.body.exams.map((e: { name: string }) => e.name)).toEqual([
      'Quiz 1',
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
});
