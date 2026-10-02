// Checks that the seeded HY335 data tells the demo story (change request §7).
//   npm run seed && npx tsx scripts/check-demo-numbers.ts
// Prints the numbers and exits with an error if a check fails.

import 'dotenv/config';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { PrismaClient } from '../src/generated/prisma/client.js';

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url: process.env.DATABASE_URL! }),
});

const FLAG_RATIO = 0.15;
const MIN_SAMPLES = 3;
const r2 = (x: number) => Math.round(x * 100) / 100;
const mean = (xs: number[]) =>
  xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0;

let failures = 0;
function expect(
  label: string,
  actual: number | string | boolean,
  expected: number | string | boolean,
  tol = 0.02,
) {
  const ok =
    typeof actual === 'number' && typeof expected === 'number'
      ? Math.abs(actual - expected) <= tol + 1e-9
      : actual === expected;
  if (!ok) failures++;
  console.log(
    `${ok ? '✔' : '✖'} ${label}: ${actual}${ok ? '' : `  (expected ${expected})`}`,
  );
}

async function main() {
  const course = await prisma.course.findUniqueOrThrow({
    where: { code: 'HY335' },
    include: {
      exams: {
        orderBy: { heldAt: 'asc' },
        include: {
          questions: { orderBy: { order: 'asc' } },
          papers: { include: { ta: true, answers: true } },
        },
      },
    },
  });

  // TA → papers (weighted) and |paper gap| per exam, for the leaderboard.
  const board = new Map<string, { papers: number; absSum: number }>();
  let allPapers = 0;
  let allGraded = 0;

  for (const exam of course.exams) {
    const graded = exam.papers.filter((p) => p.status === 'AI_GRADED');
    const submitted = exam.papers.filter((p) => p.submittedAt);
    if (!exam.papers.length) continue;
    allPapers += submitted.length;
    allGraded += graded.length;

    console.log(
      `\n${exam.name}: ${submitted.length} submitted, ${graded.length} AI graded`,
    );
    const byTa = new Map<string, typeof graded>();
    for (const p of graded)
      byTa.set(p.ta.name, [...(byTa.get(p.ta.name) ?? []), p]);

    const paperGaps: number[] = [];
    const flagged: string[] = [];
    for (const [ta, papers] of [...byTa].sort()) {
      const gapOf = (p: (typeof papers)[number]) =>
        p.answers.reduce((s, a) => s + (a.taPoints! - a.aiPoints!), 0);
      const paperGap = mean(papers.map(gapOf));
      paperGaps.push(Math.abs(paperGap));
      const b = board.get(ta) ?? { papers: 0, absSum: 0 };
      b.papers += papers.length;
      b.absSum += Math.abs(paperGap) * papers.length;
      board.set(ta, b);

      const perQ = exam.questions.map((q) => {
        const gaps = papers.map((p) => {
          const a = p.answers.find((x) => x.questionId === q.id)!;
          return a.taPoints! - a.aiPoints!;
        });
        const avg = mean(gaps);
        const isFlag =
          gaps.length >= MIN_SAMPLES &&
          Math.abs(avg) > FLAG_RATIO * q.maxPoints;
        if (isFlag) flagged.push(`${ta} ${q.code}`);
        return `${q.code} ${r2(avg) >= 0 ? '+' : ''}${r2(avg)}${isFlag ? ' ⚑' : ''}`;
      });
      const ta2 = mean(
        papers.map((p) => p.answers.reduce((s, a) => s + a.taPoints!, 0)),
      );
      const ai2 = mean(
        papers.map((p) => p.answers.reduce((s, a) => s + a.aiPoints!, 0)),
      );
      console.log(
        `  ${ta.padEnd(17)} ${String(papers.length).padStart(2)} papers  TA ${r2(ta2).toFixed(1)} / AI ${r2(ai2).toFixed(1)}  gap ${r2(paperGap)}  | ${perQ.join('  ')}`,
      );
    }
    console.log(
      `  exam average gap ${r2(mean(paperGaps))}, flagged: ${flagged.join(', ') || 'none'}`,
    );

    if (exam.name === 'Midterm') {
      expect('Midterm submitted', submitted.length, 58, 0);
      expect('Midterm AI graded', graded.length, 57, 0);
      expect('Midterm flags', flagged.join(', '), 'Maria Papadaki Q2');
      const maria = byTa.get('Maria Papadaki')!;
      const q2 = exam.questions.find((q) => q.code === 'Q2')!;
      expect(
        'Maria Midterm Q2 average gap',
        r2(
          mean(
            maria.map((p) => {
              const a = p.answers.find((x) => x.questionId === q2.id)!;
              return a.taPoints! - a.aiPoints!;
            }),
          ),
        ),
        -1.04,
        0.005,
      );
      const nikos = byTa.get('Nikos Georgiou')!;
      const totals = nikos.map((p) =>
        p.answers.reduce((s, a) => s + a.taPoints! - a.aiPoints!, 0),
      );
      expect(
        'Nikos exact matches (of 10)',
        totals.filter((g) => g === 0).length,
        5,
        0,
      );
      expect(
        'Nikos within half a point (of 10)',
        totals.filter((g) => Math.abs(g) <= 0.5).length,
        9,
        0,
      );
      expect('Nikos paper gap', r2(mean(totals)), -0.1);
    }
    if (exam.name === 'Exam 1') {
      expect('Exam 1 papers', submitted.length, 55, 0);
      expect(
        'Exam 1 flagged TAs',
        new Set(flagged.map((f) => f.split(' Q')[0])).size,
        2,
        0,
      );
    }
    if (exam.name === 'Exam 2') {
      expect('Exam 2 papers', submitted.length, 54, 0);
      expect(
        'Exam 2 flagged TAs',
        new Set(flagged.map((f) => f.split(' Q')[0])).size,
        1,
        0,
      );
    }
  }

  console.log(
    '\nLeaderboard (paper-weighted mean |paper gap|, smaller is better):',
  );
  const ranked = [...board]
    .map(([ta, b]) => [ta, r2(b.absSum / b.papers)] as const)
    .sort((a, b) => a[1] - b[1]);
  ranked.forEach(([ta, v], i) =>
    console.log(`  ${i + 1}. ${ta.padEnd(17)} ${v}`),
  );
  expect('#1 on the leaderboard', ranked[0][0], 'Katerina Vlachou');
  expect('last on the leaderboard', ranked.at(-1)![0], 'Maria Papadaki');
  expect('course papers submitted', allPapers, 167, 0);
  expect('course papers AI graded', allGraded, 166, 0);

  console.log(
    failures ? `\n✖ ${failures} check(s) failed` : '\n✔ demo numbers hold',
  );
  process.exitCode = failures ? 1 : 0;
}

main().finally(() => prisma.$disconnect());
