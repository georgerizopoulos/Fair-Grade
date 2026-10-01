// npm run seed — wipes the database and loads the demo dataset from ../dataset.
// Writes straight to the database through Prisma; the server doesn't need to run.
// Safe to run as many times as you like.
//
// Owners: Γιώργος (wipe + users), Σταύρος (rubric, answers, TA grades).
// There is only ever this one seed script.

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PrismaClient, type Role } from '../src/generated/prisma/client.js';

const DATASET_DIR = resolve(
  process.env.DATASET_DIR ?? join(import.meta.dirname, '../../dataset'),
);

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: process.env.DATABASE_URL! }),
});

// Stops the seed with a message that names the file and the bad entry.
class SeedError extends Error {}

function readJson<T>(file: string): T {
  const path = join(DATASET_DIR, file);
  let text: string;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new SeedError(`${path} not found`);
  }
  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new SeedError(`${file} is not valid JSON: ${(err as Error).message}`);
  }
}

// ---------------------------------------------------------------- wipe

async function wipe() {
  // Children before parents, so no foreign key is ever left dangling.
  await prisma.aiGrade.deleteMany();
  await prisma.taGrade.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.rubric.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}

// ---------------------------------------------------------------- users

interface UserEntry {
  name: string;
  email: string;
  password: string;
  role: Role;
}

function checkUsers(users: UserEntry[]) {
  const seen = new Set<string>();
  users.forEach((u, i) => {
    const where = `users.json users[${i}] (${u?.email ?? 'no email'})`;
    if (!u?.name?.trim()) throw new SeedError(`${where}: name is missing`);
    if (!/^\S+@\S+\.\S+$/.test(u.email ?? ''))
      throw new SeedError(`${where}: email is invalid`);
    if ((u.password ?? '').length < 6)
      throw new SeedError(`${where}: password must be at least 6 characters`);
    if (u.role !== 'instructor' && u.role !== 'ta')
      throw new SeedError(`${where}: role must be "instructor" or "ta"`);
    const email = u.email.toLowerCase();
    if (seen.has(email)) throw new SeedError(`${where}: email appears twice`);
    seen.add(email);
  });
  const instructors = users.filter((u) => u.role === 'instructor').length;
  if (instructors !== 1)
    throw new SeedError(
      `users.json must have exactly one instructor, found ${instructors}`,
    );
}

// Returns email → user id, for the dataset part to turn taEmail into ta_id.
async function seedUsers(users: UserEntry[]) {
  const idByEmail = new Map<string, string>();
  for (const u of users) {
    const created = await prisma.user.create({
      data: {
        name: u.name.trim(),
        email: u.email.toLowerCase(),
        passwordHash: await bcrypt.hash(u.password, 10),
        role: u.role,
      },
    });
    idByEmail.set(created.email, created.id);
  }
  return idByEmail;
}

// ---------------------------------------------------------------- main

async function main() {
  console.log(`Seeding from ${DATASET_DIR}`);

  // Read and check every file before touching the database.
  const { users } = readJson<{ users: UserEntry[] }>('users.json');
  if (!Array.isArray(users))
    throw new SeedError('users.json must have a "users" array');
  checkUsers(users);

  await wipe();
  const userIdByEmail = await seedUsers(users);
  console.log(`✔ ${users.length} users`);

  // Σταύρος: rubric.json, answers.json and ta-grades.json go here (TASKS.md,
  // Track 4 step 5). Check the files above, next to users.json, then insert
  // using userIdByEmail to turn each taEmail into a user id.
  void userIdByEmail;

  console.log('\nDemo logins (password as in users.json):');
  for (const u of users)
    console.log(`  ${u.role.padEnd(10)} ${u.email.toLowerCase()}`);
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
