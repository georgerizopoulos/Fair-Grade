import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import bcrypt from 'bcryptjs';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import { wipeDb } from './helpers.js';

// Phase 2: users and course membership.
describe('Users and members (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let prisma: PrismaService;
  const ids: Record<string, string> = {};
  const tokens: Record<string, string> = {};
  const auth = (who: string) => ({ Authorization: `Bearer ${tokens[who]}` });

  async function login(email: string, password = 'demo1234') {
    const res = await http.post('/auth/login').send({ email, password });
    return res;
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
      ['maria', 'ta'],
      ['nikos', 'ta'],
    ] as const) {
      const u = await prisma.user.create({
        data: { name: key, email: `${key}@test.com`, passwordHash, role },
      });
      ids[key] = u.id;
      tokens[key] = (await login(`${key}@test.com`)).body.token;
    }
    const hy335 = await prisma.course.create({
      data: {
        code: 'HY335',
        name: 'Computer Networks',
        semester: 'W',
        ownerId: ids.instructor,
        members: { create: [{ userId: ids.maria, role: 'ta' }] },
      },
    });
    const hy360 = await prisma.course.create({
      data: {
        code: 'HY360',
        name: 'Database Systems',
        semester: 'W',
        ownerId: ids.instructor,
      },
    });
    ids.hy335 = hy335.id;
    ids.hy360 = hy360.id;
  });

  afterAll(async () => {
    await app.close();
  });

  // ------------------------------------------------------------ the phase check

  it('a TA added to HY360 can open it; after removal they get 403 again', async () => {
    await http.get(`/courses/${ids.hy360}`).set(auth('nikos')).expect(403);

    await http
      .post(`/courses/${ids.hy360}/members`)
      .set(auth('instructor'))
      .send({ userId: ids.nikos })
      .expect(201);
    await http.get(`/courses/${ids.hy360}`).set(auth('nikos')).expect(200);
    const list = await http.get('/courses').set(auth('nikos')).expect(200);
    expect(list.body.courses.map((c: { code: string }) => c.code)).toEqual([
      'HY360',
    ]);

    await http
      .delete(`/courses/${ids.hy360}/members/${ids.nikos}`)
      .set(auth('instructor'))
      .expect(200);
    await http.get(`/courses/${ids.hy360}`).set(auth('nikos')).expect(403);

    const log = await prisma.activityLog.findMany({
      where: { courseId: ids.hy360 },
      orderBy: { createdAt: 'asc' },
    });
    expect(log.map((l) => l.type)).toEqual(['MEMBER_ADDED', 'MEMBER_REMOVED']);
    expect(log[0].actorId).toBe(ids.instructor);
  });

  // ------------------------------------------------------------ members

  it('GET members: owner and TAs, "You" marked, visible to members only', async () => {
    const res = await http
      .get(`/courses/${ids.hy335}/members`)
      .set(auth('maria'))
      .expect(200);
    expect(res.body.owner).toMatchObject({
      userId: ids.instructor,
      isYou: false,
    });
    expect(res.body.members).toEqual([
      expect.objectContaining({
        userId: ids.maria,
        role: 'ta',
        papersGraded: 0,
        isYou: true,
      }),
    ]);
    await http
      .get(`/courses/${ids.hy335}/members`)
      .set(auth('nikos'))
      .expect(403);
  });

  it('POST members: TAs cannot manage members; duplicates and instructors rejected', async () => {
    await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('maria'))
      .send({ userId: ids.nikos })
      .expect(403);
    await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('instructor'))
      .send({ userId: ids.maria })
      .expect(409);
    await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('instructor'))
      .send({ userId: ids.instructor })
      .expect(400);
    await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('instructor'))
      .send({ userId: 'nope' })
      .expect(404);
    const bad = await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('instructor'))
      .send({ name: 'No email' })
      .expect(400);
    expect(bad.body.error.message).toContain('email');
  });

  it('POST members: create an account and add it (invite), then that TA can sign in', async () => {
    const res = await http
      .post(`/courses/${ids.hy335}/members`)
      .set(auth('instructor'))
      .send({ name: 'Katerina Vlachou', email: 'Katerina@test.com' })
      .expect(201);
    expect(res.body.temporaryPassword).toEqual(expect.any(String));

    const created = await prisma.user.findUniqueOrThrow({
      where: { email: 'katerina@test.com' },
    });
    expect(created).toMatchObject({ role: 'ta', status: 'INVITED' });

    await login('katerina@test.com', res.body.temporaryPassword).then((r) =>
      expect(r.status).toBe(200),
    );
    const after = await prisma.user.findUniqueOrThrow({
      where: { email: 'katerina@test.com' },
    });
    expect(after.status).toBe('ACTIVE');
  });

  it('DELETE members: unknown member → 404, TA → 403', async () => {
    await http
      .delete(`/courses/${ids.hy335}/members/${ids.nikos}`)
      .set(auth('instructor'))
      .expect(404);
    await http
      .delete(`/courses/${ids.hy335}/members/${ids.maria}`)
      .set(auth('maria'))
      .expect(403);
  });

  // ------------------------------------------------------------ users

  it('POST /users with a temporary password → ACTIVE; invite → INVITED with a generated password', async () => {
    const withPw = await http
      .post('/users')
      .set(auth('instructor'))
      .send({
        name: 'Giannis',
        email: 'giannis@test.com',
        role: 'ta',
        mode: 'password',
        password: 'start123',
      })
      .expect(201);
    expect(withPw.body).toMatchObject({ status: 'ACTIVE', role: 'ta' });
    expect(withPw.body.temporaryPassword).toBeUndefined();
    expect(withPw.body.passwordHash).toBeUndefined();
    await login('giannis@test.com', 'start123').then((r) =>
      expect(r.status).toBe(200),
    );

    const invite = await http
      .post('/users')
      .set(auth('instructor'))
      .send({
        name: 'Alexandros',
        email: 'alex@test.com',
        role: 'ta',
        mode: 'invite',
      })
      .expect(201);
    expect(invite.body).toMatchObject({ status: 'INVITED' });
    expect(invite.body.temporaryPassword).toEqual(expect.any(String));
  });

  it('POST /users: validation, duplicates and role checks', async () => {
    await http
      .post('/users')
      .set(auth('maria'))
      .send({ name: 'X', email: 'x@test.com', role: 'ta', mode: 'invite' })
      .expect(403);
    const noPw = await http
      .post('/users')
      .set(auth('instructor'))
      .send({ name: 'X', email: 'x@test.com', role: 'ta', mode: 'password' })
      .expect(400);
    expect(noPw.body.error.message).toContain('password');
    await http
      .post('/users')
      .set(auth('instructor'))
      .send({
        name: 'Dup',
        email: 'MARIA@test.com',
        role: 'ta',
        mode: 'invite',
      })
      .expect(409);
  });

  it('GET /users: status, courses and "You"', async () => {
    const res = await http.get('/users').set(auth('instructor')).expect(200);
    const me = res.body.users.find(
      (u: { id: string }) => u.id === ids.instructor,
    );
    const maria = res.body.users.find(
      (u: { id: string }) => u.id === ids.maria,
    );
    expect(me).toMatchObject({ isYou: true, status: 'ACTIVE' });
    expect(me.courses.map((c: { code: string }) => c.code).sort()).toEqual([
      'HY335',
      'HY360',
    ]);
    expect(maria.courses.map((c: { code: string }) => c.code)).toEqual([
      'HY335',
    ]);
    expect(maria.lastSignInAt).toEqual(expect.any(String));
  });

  it('PATCH /users/:id: edit and deactivate; a deactivated user can no longer sign in or use a token', async () => {
    const renamed = await http
      .patch(`/users/${ids.nikos}`)
      .set(auth('instructor'))
      .send({ name: 'Nikos Georgiou' })
      .expect(200);
    expect(renamed.body.name).toBe('Nikos Georgiou');

    await http
      .patch(`/users/${ids.nikos}`)
      .set(auth('instructor'))
      .send({ status: 'DEACTIVATED' })
      .expect(200);
    expect((await login('nikos@test.com')).status).toBe(401);
    await http.get('/auth/me').set(auth('nikos')).expect(401);

    await http
      .patch(`/users/${ids.nikos}`)
      .set(auth('instructor'))
      .send({ status: 'ACTIVE' })
      .expect(200);
    expect((await login('nikos@test.com')).status).toBe(200);
  });

  it('PATCH /users/:id: no self-deactivation, 404 for unknown, TA → 403', async () => {
    await http
      .patch(`/users/${ids.instructor}`)
      .set(auth('instructor'))
      .send({ status: 'DEACTIVATED' })
      .expect(400);
    await http
      .patch('/users/nope')
      .set(auth('instructor'))
      .send({ name: 'x' })
      .expect(404);
    await http
      .patch(`/users/${ids.maria}`)
      .set(auth('maria'))
      .send({ name: 'x' })
      .expect(403);
  });
});
