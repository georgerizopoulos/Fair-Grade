// npm run seed — wipes the database and loads the demo story (scripts/demo-data.ts).
// Writes straight to the database through Prisma; the server doesn't need to run.
// Safe to run as many times as you like.

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '../src/generated/prisma/client.js';
import { COURSES, DEMO_PASSWORD, USERS } from './demo-data.js';
import { seedActivity, seedPapers } from './demo-papers.js';

// The seed deletes every user, course and paper first. Never by accident on a
// real database: with NODE_ENV=production it needs ALLOW_SEED=1.
if (process.env.NODE_ENV === 'production' && process.env.ALLOW_SEED !== '1') {
  console.error(
    'Refusing to seed: NODE_ENV=production and the seed wipes the whole database.\n' +
      'If this really is a throwaway demo database, run it with ALLOW_SEED=1.',
  );
  process.exit(1);
}

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: process.env.DATABASE_URL! }),
});

// Stops the seed with a message that names the bad entry.
class SeedError extends Error {}

function check() {
  for (const course of COURSES) {
    for (const exam of course.exams) {
      for (const q of exam.questions) {
        const sum = q.rubric.reduce((s, [, p]) => s + p, 0);
        if (sum !== q.maxPoints) {
          throw new SeedError(
            `${course.code} ${exam.name} ${q.code}: rubric points add up to ${sum}, not ${q.maxPoints}`,
          );
        }
      }
    }
    for (const ta of course.tas) {
      if (!USERS.some((u) => u.key === ta && u.role === 'ta')) {
        throw new SeedError(`${course.code}: TA "${ta}" is not a TA user`);
      }
    }
  }
}

async function wipe() {
  // Children before parents, so no foreign key is ever left dangling.
  await prisma.activityLog.deleteMany();
  await prisma.paperRevision.deleteMany();
  await prisma.paperAnswer.deleteMany();
  await prisma.paperPage.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.rubricPoint.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.courseMember.deleteMany();
  // legacy single-question flow
  await prisma.aiGrade.deleteMany();
  await prisma.taGrade.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.rubric.deleteMany();

  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

async function seedUsers() {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const idByKey = new Map<string, string>();
  for (const u of USERS) {
    const created = await prisma.user.create({
      data: {
        name: u.name,
        email: u.email,
        passwordHash,
        role: u.role,
        status: u.status ?? 'ACTIVE',
      },
    });
    idByKey.set(u.key, created.id);
  }
  return idByKey;
}

async function seedCourses(userId: Map<string, string>) {
  const instructorId = userId.get('instructor')!;
  for (const c of COURSES) {
    const course = await prisma.course.create({
      data: {
        code: c.code,
        name: c.name,
        semester: c.semester,
        ownerId: instructorId,
        members: {
          create: c.tas.map((ta) => ({ userId: userId.get(ta)!, role: 'ta' })),
        },
      },
    });

    for (const e of c.exams) {
      await prisma.exam.create({
        data: {
          courseId: course.id,
          name: e.name,
          heldAt: new Date(e.heldAt),
          status: e.status,
          questions: {
            create: e.questions.map((q, i) => ({
              code: q.code,
              title: q.title,
              prompt: q.prompt,
              maxPoints: q.maxPoints,
              modelAnswer: q.modelAnswer,
              order: i + 1,
              rubricPoints: {
                create: q.rubric.map(([text, points], j) => ({
                  text,
                  points,
                  order: j + 1,
                })),
              },
            })),
          },
        },
      });
    }
  }
}

async function main() {
  check();
  await wipe();
  const userId = await seedUsers();
  console.log(`✔ ${USERS.length} users`);
  await seedCourses(userId);
  console.log(
    `✔ ${COURSES.length} courses, ${COURSES.reduce((n, c) => n + c.exams.length, 0)} exams`,
  );
  const papers = await seedPapers(prisma, userId);
  await seedActivity(prisma, userId);
  console.log(
    `✔ ${papers} HY335 papers with TA and AI grades, today's activity`,
  );

  console.log(`\nDemo logins (password ${DEMO_PASSWORD}):`);
  for (const u of USERS) {
    console.log(
      `  ${u.role.padEnd(10)} ${u.email}${u.status === 'INVITED' ? ' (invited)' : ''}`,
    );
  }
}

main()
  .catch((err) => {
    if (err instanceof SeedError) {
      console.error(
        `\n✖ Seed failed: ${err.message}\n  Nothing was changed in the database.`,
      );
    } else {
      console.error(err);
    }
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
