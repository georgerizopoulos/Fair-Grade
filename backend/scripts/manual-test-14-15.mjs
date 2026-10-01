//Author: DIMITRIS
// Usage: node scripts/manual-test-14-15.mjs [--with-ai]
// Loads dataset rubric/answers/ta-grades via the real endpoints, then calls
// #14 and #15. With --with-ai it first writes ai_grades straight to the DB
// (intended scores) to simulate a grading run.

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const API = 'http://localhost:3001';
const DATASET = join(import.meta.dirname, '../../dataset');
const withAi = process.argv.includes('--with-ai');

const readJson = (f) => JSON.parse(readFileSync(join(DATASET, f), 'utf8'));

async function api(path, { token, method = 'GET', body } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

async function login(email) {
  const { token } = await api('/auth/login', {
    method: 'POST',
    body: { email, password: 'demo1234' },
  });
  return token;
}

const instructor = await login('instructor@demo.com');

// Reuse the rubric if this script already ran; otherwise create + upload.
let { rubrics } = await api('/rubrics', { token: instructor });
let rubricId = rubrics[0]?.id;
if (!rubricId) {
  const rubric = await api('/rubrics', {
    method: 'POST',
    token: instructor,
    body: readJson('rubric.json'),
  });
  rubricId = rubric.id;
  await api('/answers/bulk', {
    method: 'POST',
    token: instructor,
    body: { rubricId, answers: readJson('answers.json').answers },
  });

  const detail = await api(`/rubrics/${rubricId}`, { token: instructor });
  const { answers } = await api(`/answers?rubricId=${rubricId}`, {
    token: instructor,
  });
  const answerByStudent = new Map(answers.map((a) => [a.studentIdAnon, a.id]));
  const criteria = detail.criteria; // sorted by position

  // Each TA logs in and saves their own grades (no taId in body).
  const byTa = new Map();
  for (const g of readJson('ta-grades.json').grades) {
    if (!byTa.has(g.taEmail)) byTa.set(g.taEmail, []);
    for (let i = 0; i < g.scores.length; i++) {
      byTa.get(g.taEmail).push({
        answerId: answerByStudent.get(g.studentIdAnon),
        criterionId: criteria[i].id,
        pointsGiven: g.scores[i],
      });
    }
  }
  for (const [email, grades] of byTa) {
    const taToken = await login(email);
    const saved = await api('/ta-grades/bulk', {
      method: 'POST',
      token: taToken,
      body: { grades },
    });
    console.log(`${email}: saved ${saved.saved ?? grades.length} grades`);
  }
  console.log(`Rubric ${rubricId} created with answers + TA grades`);
} else {
  console.log(`Reusing rubric ${rubricId}`);
}

if (withAi) {
  // Simulate #13 by writing intended scores directly as ai_grades.
  const { PrismaLibSql } = await import('@prisma/adapter-libsql');
  const { PrismaClient } = await import('../src/generated/prisma/client.ts');
  const prisma = new PrismaClient({
    adapter: new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./dev.db' }),
  });
  const intended = {
    student_001: [3, 3, 2, 2],   student_002: [0.5, 0, 0.5, 1],
    student_003: [3, 2.5, 2, 0.5], student_004: [1, 1.5, 1.5, 1.5],
    student_005: [3, 1.5, 0, 2], student_006: [0, 0, 0, 1.5],
    student_007: [1.5, 2.5, 2, 1.5], student_008: [3, 3, 2, 2],
    student_009: [3, 1, 0, 2],   student_010: [1.5, 0, 1, 1.5],
    student_011: [1, 0.5, 0.5, 1.5], student_012: [3, 1.5, 0.5, 1],
    student_013: [3, 1, 2, 2],   student_014: [3, 3, 1.5, 0.5],
    student_015: [0, 0, 2, 1.5], student_016: [3, 3, 2, 2],
    student_017: [3, 2, 0, 1.5], student_018: [3, 3, 1.5, 2],
  };
  const answers = await prisma.studentAnswer.findMany({ where: { rubricId } });
  const criteria = await prisma.criterion.findMany({
    where: { rubricId },
    orderBy: { position: 'asc' },
  });
  for (const a of answers) {
    const scores = intended[a.studentIdAnon];
    for (let i = 0; i < criteria.length; i++) {
      await prisma.aiGrade.upsert({
        where: {
          answerId_criterionId: { answerId: a.id, criterionId: criteria[i].id },
        },
        create: {
          answerId: a.id,
          criterionId: criteria[i].id,
          points: scores[i],
          reasoning: `Intended score for C${i + 1}`,
        },
        update: { points: scores[i] },
      });
    }
  }
  await prisma.$disconnect();
  console.log('AI grades written (intended scores)');
}

// ---- #15 ----
const deviation = await api(`/deviation/${rubricId}`, { token: instructor });
console.log('\n#15 /deviation:', JSON.stringify({
  aiGraded: deviation.aiGraded,
  thresholds: deviation.thresholds,
  taSummaries: deviation.taSummaries.map((t) => ({
    taName: t.taName,
    answersGraded: t.answersGraded,
    overallDeviation: t.overallDeviation,
    flagged: t.flagged,
    flaggedCriteriaCount: t.flaggedCriteriaCount,
    criteria: t.criteria.map((c) => ({
      position: c.position,
      sampleSize: c.sampleSize,
      avgDeviation: c.avgDeviation,
      direction: c.direction,
      flagged: c.flagged,
      examples: c.examples.length,
    })),
  })),
}, null, 1));

// ---- #14 (all, then filtered by the first flagged/first TA) ----
const all = await api(`/grade/results/${rubricId}`, { token: instructor });
console.log(`\n#14 all: aiGraded=${all.aiGraded}, answers=${all.answers.length}`);
const first = all.answers[0];
console.log('first answer sample:', JSON.stringify({
  studentIdAnon: first.studentIdAnon,
  criteria: first.criteria.map((c) => ({
    position: c.position,
    aiGrade: c.aiGrade,
    taGrades: c.taGrades,
  })),
}, null, 1));

const taId = deviation.taSummaries[0]?.taId;
if (taId) {
  const filtered = await api(`/grade/results/${rubricId}?taId=${taId}`, {
    token: instructor,
  });
  const taGradeCount = filtered.answers.reduce(
    (n, a) => n + a.criteria.reduce((m, c) => m + c.taGrades.length, 0),
    0,
  );
  const foreign = filtered.answers.some((a) =>
    a.criteria.some((c) => c.taGrades.some((g) => g.taId !== taId)),
  );
  console.log(`\n#14 ?taId=${deviation.taSummaries[0].taName}: answers=${filtered.answers.length}, taGrades=${taGradeCount}, foreignGrades=${foreign}`);
}

// ---- error cases ----
for (const [name, path] of [
  ['#14 bad rubric', '/grade/results/nope'],
  ['#15 bad rubric', '/deviation/nope'],
  ['#14 bad taId', `/grade/results/${rubricId}?taId=nope`],
]) {
  try {
    await api(path, { token: instructor });
    console.log(`${name}: UNEXPECTED 200`);
  } catch (e) {
    console.log(`${name}: ${e.message.includes('404') ? '404 as expected' : e.message}`);
  }
}
