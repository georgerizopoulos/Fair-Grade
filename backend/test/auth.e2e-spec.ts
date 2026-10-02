import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';
import { PrismaService } from './../src/prisma/prisma.service.js';
import bcrypt from 'bcryptjs';
import { wipeDb } from './helpers.js';

describe('Auth and roles (e2e)', () => {
  let app: INestApplication<App>;
  let http: ReturnType<typeof request>;
  let instructorToken: string;
  let taToken: string;

  const instructor = {
    name: 'Instructor Test',
    email: 'Instructor@Test.com',
    password: 'demo1234',
    role: 'instructor',
  };
  const ta = {
    name: 'Ta Test',
    email: 'ta@test.com',
    password: 'demo1234',
    role: 'ta',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
    http = request(app.getHttpServer());
    await wipeDb(app.get(PrismaService));
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register → 201, email lowercased, no password hash', async () => {
    const res = await http.post('/auth/register').send(instructor).expect(201);
    expect(res.body).toMatchObject({
      name: 'Instructor Test',
      email: 'instructor@test.com',
      role: 'instructor',
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(res.body.passwordHash).toBeUndefined();
    // TAs can't sign up; their account comes from the instructor.
    await app.get(PrismaService).user.create({
      data: {
        name: ta.name,
        email: ta.email,
        role: 'ta',
        passwordHash: await bcrypt.hash(ta.password, 4),
      },
    });
  });

  it('POST /auth/register → 403 for role ta, and creates nothing', async () => {
    const res = await http
      .post('/auth/register')
      .send({ ...ta, email: 'new-ta@test.com' })
      .expect(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
    expect(res.body.error.message).toContain(
      'created by the course instructor',
    );
    expect(
      await app
        .get(PrismaService)
        .user.findUnique({ where: { email: 'new-ta@test.com' } }),
    ).toBeNull();
  });

  it('POST /auth/register → 409 on duplicate email (any case)', async () => {
    const res = await http
      .post('/auth/register')
      .send({ ...instructor, email: 'INSTRUCTOR@test.com' })
      .expect(409);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('POST /auth/register → 400 naming the bad fields', async () => {
    const res = await http
      .post('/auth/register')
      .send({
        name: 'X',
        email: 'not-an-email',
        password: '123',
        role: 'admin',
      })
      .expect(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('email');
    expect(res.body.error.message).toContain('password');
    expect(res.body.error.message).toContain('role');
  });

  it('POST /auth/login → 200 with token and user', async () => {
    const res = await http
      .post('/auth/login')
      .send({ email: 'instructor@test.com', password: 'demo1234' })
      .expect(200);
    expect(res.body.token).toEqual(expect.any(String));
    expect(res.body.user).toMatchObject({
      email: 'instructor@test.com',
      role: 'instructor',
    });
    instructorToken = res.body.token;

    const taRes = await http
      .post('/auth/login')
      .send({ email: ta.email, password: ta.password })
      .expect(200);
    taToken = taRes.body.token;
  });

  it('POST /auth/login → 401 for wrong password and unknown email, same message', async () => {
    const wrong = await http
      .post('/auth/login')
      .send({ email: 'instructor@test.com', password: 'nope-nope' })
      .expect(401);
    const unknown = await http
      .post('/auth/login')
      .send({ email: 'ghost@test.com', password: 'demo1234' })
      .expect(401);
    expect(wrong.body.error.code).toBe('UNAUTHORIZED');
    expect(wrong.body.error.message).toBe(unknown.body.error.message);
  });

  it('GET /auth/me → 200 with the user, 401 without or with a bad token', async () => {
    const res = await http
      .get('/auth/me')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(200);
    expect(res.body).toMatchObject({
      email: 'instructor@test.com',
      role: 'instructor',
    });

    await http.get('/auth/me').expect(401);
    await http
      .get('/auth/me')
      .set('Authorization', 'Bearer garbage')
      .expect(401);
  });

  it('GET /users → instructor only, sorted by name, role filter validated', async () => {
    const all = await http
      .get('/users')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(200);
    expect(all.body.users.map((u: { name: string }) => u.name)).toEqual([
      'Instructor Test',
      'Ta Test',
    ]);

    const tas = await http
      .get('/users?role=ta')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(200);
    expect(tas.body.users).toHaveLength(1);
    expect(tas.body.users[0].passwordHash).toBeUndefined();

    const bad = await http
      .get('/users?role=admin')
      .set('Authorization', `Bearer ${instructorToken}`)
      .expect(400);
    expect(bad.body.error.code).toBe('VALIDATION_ERROR');

    const forbidden = await http
      .get('/users')
      .set('Authorization', `Bearer ${taToken}`)
      .expect(403);
    expect(forbidden.body.error.code).toBe('FORBIDDEN');
  });

  it('token for a deleted user → 401 (what happens after re-seeding)', async () => {
    await app.get(PrismaService).user.delete({ where: { email: ta.email } });
    await http
      .get('/auth/me')
      .set('Authorization', `Bearer ${taToken}`)
      .expect(401);
  });
});
