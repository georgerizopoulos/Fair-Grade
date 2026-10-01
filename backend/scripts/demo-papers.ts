// Demo papers for HY335 (change request §7): Exam 1, Exam 2 and the Midterm,
// graded by the five TAs, with the AI's grades already in place.
//
// The numbers come from targets per TA and per question (average TA − AI gap)
// plus "anchor" papers that must match exactly (Nikos's Midterm stack, Maria's
// flagged Q2 papers, csd5146 with its transcription and AI reasoning). The
// remaining papers are generated deterministically to hit the targets.
//
// Gaps are sums of half points, so an average over n papers can only land on
// multiples of 0.5 / n: targets are met to the nearest reachable value
// (e.g. Maria's Midterm Q2 is −12.5 / 12 = −1.04 for a target of −1.05).

import type { PrismaClient } from '../src/generated/prisma/client.js';

type Pair = [ta: number, ai: number];

interface Anchor {
  studentId: string;
  points: Pair[]; // per question, in question order
  status?: 'AI_GRADED' | 'AI_GRADING' | 'DRAFT';
  day?: 'yesterday' | 'today';
  at?: string; // "HH:MM" today, for the live activity feed
  transcription?: string[];
  uncertainWords?: string[][];
  reasoning?: string[];
}

interface TaPlan {
  ta: string; // user key
  papers: number; // AI-graded papers, anchors included
  aiAverage: number; // average AI total on the generated papers
  gaps: number[]; // target average TA − AI gap per question
  medianMinutes: number;
  anchors?: Anchor[];
  extra?: Anchor[]; // papers that are not AI-graded (AI grading now, drafts)
}

interface ExamPlan {
  exam: string; // exam name in HY335
  firstPaperDay: string; // ISO date the TAs started adding papers
  plans: TaPlan[];
}

const CSD5146 = {
  transcription: [
    'The client sends SYN with a random sequence number x. The server answers SYN-ACK with its own number y and ack x+1. Then the client sends ACK y+1 and the connection is open. This way both sides agree on the starting numbers.',
    'TCP is reliable, UDP is not. TCP is used for web pages, UDP for streaming.',
    'The resolver asks the root server, then the .gr server, then the server of the domain, and keeps the answer in its cache for next time.',
  ],
  uncertainWords: [['x+1', 'y+1'], [], []],
  reasoning: [
    'All three steps in the right order with the numbers explained. Does not say why the handshake is needed before data, so not full marks.',
    'States the core difference, reliability, and gives a correct use case for each. Nothing on how TCP achieves it or on overhead.',
    'Correct order: root, TLD, authoritative, and mentions caching. Does not mention the TTL.',
  ],
};

export const PAPER_PLANS: ExamPlan[] = [
  {
    exam: 'Exam 1',
    firstPaperDay: '2026-09-17',
    plans: [
      {
        ta: 'maria',
        papers: 11,
        aiAverage: 7.2,
        gaps: [-0.5, -0.55, -0.15],
        medianMinutes: 19,
      },
      {
        ta: 'giannis',
        papers: 11,
        aiAverage: 7.0,
        gaps: [0.5, 0.45, 0.15],
        medianMinutes: 16,
        // Fails with the AI, passes with Giannis.
        anchors: [
          {
            studentId: 'csd5124',
            points: [
              [2, 1.5],
              [2.5, 2],
              [1, 1],
            ],
          },
        ],
      },
      {
        ta: 'eleni',
        papers: 11,
        aiAverage: 7.1,
        gaps: [0.1, 0.1, 0.1],
        medianMinutes: 21,
      },
      {
        ta: 'nikos',
        papers: 11,
        aiAverage: 7.2,
        gaps: [-0.15, -0.15, -0.1],
        medianMinutes: 14,
      },
      {
        ta: 'katerina',
        papers: 11,
        aiAverage: 7.3,
        gaps: [0.05, 0.1, 0.05],
        medianMinutes: 18,
      },
    ],
  },
  {
    exam: 'Exam 2',
    firstPaperDay: '2026-09-24',
    plans: [
      {
        ta: 'maria',
        papers: 11,
        aiAverage: 7.3,
        gaps: [-0.3, -0.5, -0.5],
        medianMinutes: 19,
      },
      {
        ta: 'giannis',
        papers: 11,
        aiAverage: 7.1,
        gaps: [0.4, 0.2, 0.2],
        medianMinutes: 16,
      },
      {
        ta: 'eleni',
        papers: 10,
        aiAverage: 7.2,
        gaps: [0.1, 0.1, 0.05],
        medianMinutes: 21,
      },
      {
        ta: 'nikos',
        papers: 11,
        aiAverage: 7.2,
        gaps: [-0.1, -0.05, -0.05],
        medianMinutes: 14,
      },
      {
        ta: 'katerina',
        papers: 11,
        aiAverage: 7.2,
        gaps: [0.05, 0, 0.05],
        medianMinutes: 18,
      },
    ],
  },
  {
    exam: 'Midterm',
    firstPaperDay: '2026-09-30',
    plans: [
      {
        ta: 'maria',
        papers: 12,
        aiAverage: 7.3,
        gaps: [-0.2, -1.05, -0.15],
        medianMinutes: 19,
        anchors: [
          {
            studentId: 'csd5101',
            points: [
              [3.5, 3.5],
              [1.5, 2.5],
              [2.5, 2.5],
            ],
          },
          {
            studentId: 'csd5104',
            points: [
              [3, 3],
              [1, 2],
              [2, 2.5],
            ],
          },
          {
            studentId: 'csd5108',
            points: [
              [2, 2],
              [1, 2.5],
              [1.5, 2.5],
            ],
          },
          {
            studentId: 'csd5112',
            points: [
              [2.5, 3],
              [1, 2],
              [1.5, 2],
            ],
          },
          {
            studentId: 'csd5115',
            points: [
              [4, 4],
              [2, 2.5],
              [3, 3],
            ],
          },
          {
            studentId: 'csd5117',
            points: [
              [2, 2.5],
              [0.5, 1.5],
              [1.5, 1.5],
            ],
          },
        ],
      },
      {
        ta: 'giannis',
        papers: 11,
        aiAverage: 7.3,
        gaps: [0.4, 0.1, 0.1],
        medianMinutes: 16,
        anchors: [
          {
            studentId: 'csd5124',
            points: [
              [4, 3],
              [2.5, 2],
              [2, 2],
            ],
          },
        ],
      },
      {
        ta: 'eleni',
        papers: 12,
        aiAverage: 7.2,
        gaps: [0.1, 0.05, 0.05],
        medianMinutes: 21,
      },
      {
        ta: 'nikos',
        papers: 10,
        aiAverage: 7.1,
        gaps: [0.05, -0.1, -0.05],
        medianMinutes: 14,
        // His whole Midterm stack, in grading order: 5 exact matches, 9 within
        // half a point, the largest gap −1 on csd5146 Q2.
        anchors: [
          {
            studentId: 'csd5121',
            day: 'yesterday',
            points: [
              [3.5, 3.5],
              [2.5, 2.5],
              [2, 2],
            ],
          },
          {
            studentId: 'csd5125',
            day: 'yesterday',
            points: [
              [3, 3],
              [1.5, 1.5],
              [2, 2],
            ],
          },
          {
            studentId: 'csd5129',
            day: 'yesterday',
            points: [
              [3.5, 3.5],
              [2.5, 2],
              [2, 2],
            ],
          },
          {
            studentId: 'csd5133',
            points: [
              [2, 2],
              [1, 1],
              [1, 1.5],
            ],
          },
          {
            studentId: 'csd5136',
            points: [
              [3.5, 3.5],
              [2, 2],
              [2, 2],
            ],
          },
          {
            studentId: 'csd5137',
            points: [
              [2.5, 2],
              [1.5, 1.5],
              [1.5, 1.5],
            ],
          },
          {
            studentId: 'csd5139',
            points: [
              [4, 4],
              [2.5, 2.5],
              [2.5, 2.5],
            ],
          },
          {
            studentId: 'csd5141',
            points: [
              [3, 3],
              [1.5, 2],
              [1.5, 1.5],
            ],
          },
          {
            studentId: 'csd5144',
            points: [
              [3.5, 3.5],
              [2.5, 2.5],
              [2.5, 2.5],
            ],
          },
          {
            studentId: 'csd5146',
            at: '12:31',
            points: [
              [3.5, 3.5],
              [1, 2],
              [2.5, 2.5],
            ],
            ...CSD5146,
          },
        ],
        extra: [
          // Submitted, the AI is still on it (kept out of the worker's reach).
          {
            studentId: 'csd5148',
            at: '12:38',
            status: 'AI_GRADING',
            points: [
              [3, 0],
              [1.5, 0],
              [2, 0],
            ],
          },
          // Not submitted yet: the live demo grades and submits this one.
          { studentId: 'csd5150', at: '12:44', status: 'DRAFT', points: [] },
        ],
      },
      {
        ta: 'katerina',
        papers: 12,
        aiAverage: 7.0,
        gaps: [0, 0.05, 0.05],
        medianMinutes: 18,
        anchors: [
          {
            studentId: 'csd5149',
            at: '12:41',
            points: [
              [3, 3],
              [2, 2],
              [2, 2],
            ],
          },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------- generation

// Deterministic pseudo-random numbers, so every seed run gives the same papers.
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const half = (x: number) => Math.round(x * 2) / 2;
const clamp = (x: number, lo: number, hi: number) =>
  Math.min(Math.max(x, lo), hi);

interface Generated {
  studentId: string;
  points: Pair[];
  status: 'AI_GRADED' | 'AI_GRADING' | 'DRAFT';
  minutes: number;
  createdAt: Date;
  anchor?: Anchor;
}

// Splits a total gap (in half points) over n papers as evenly as possible.
function spreadGap(totalHalves: number, n: number): number[] {
  const out = Array<number>(n).fill(0);
  if (n === 0) return out;
  const base = Math.trunc(totalHalves / n);
  let rest = totalHalves - base * n;
  for (let i = 0; i < n; i++) out[i] = base;
  // Put the leftover half points on papers spread across the stack.
  for (let i = 0; rest !== 0; i = (i + 3) % n) {
    out[i] += Math.sign(rest);
    rest -= Math.sign(rest);
  }
  return out.map((h) => h / 2);
}

// Minutes per paper whose median is exactly `median`.
function minutesAround(
  median: number,
  n: number,
  rand: () => number,
): number[] {
  const xs = Array.from({ length: n }, (_, i) => {
    const offset = Math.round((i - (n - 1) / 2) * 1.5 + (rand() - 0.5) * 2);
    return Math.max(4, median + offset);
  }).sort((a, b) => a - b);
  xs[Math.floor((n - 1) / 2)] = median;
  if (n % 2 === 0) xs[n / 2] = median;
  // Shuffle so grading order isn't sorted by time.
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
}

export function generateStack(
  plan: TaPlan,
  maxPoints: number[],
  rand: () => number,
): Pair[][] {
  const anchors = plan.anchors ?? [];
  const n = plan.papers - anchors.length;
  const total = maxPoints.reduce((s, m) => s + m, 0);

  // Gap still needed per question after the anchors, rounded to half points.
  const gaps = maxPoints.map((_, q) => {
    const target = plan.gaps[q] * plan.papers;
    const fromAnchors = anchors.reduce(
      (s, a) => s + (a.points[q][0] - a.points[q][1]),
      0,
    );
    return spreadGap(Math.round((target - fromAnchors) * 2), n);
  });

  return Array.from({ length: n }, (_, i) =>
    maxPoints.map((max, q) => {
      const gap = gaps[q][i];
      const mean = (plan.aiAverage * max) / total;
      const ai = half(
        clamp(
          mean + (rand() - 0.5) * max * 0.6,
          Math.max(0, -gap),
          Math.min(max, max - gap),
        ),
      );
      return [ai + gap, ai] as Pair;
    }),
  );
}

// ---------------------------------------------------------------- write

const ANSWERS: Record<string, string[]> = {
  'Exam 1': [
    'Link layer with Ethernet, network layer with IP, transport with TCP and UDP, application with HTTP.',
    'Four subnets of 64 addresses: .0, .64, .128 and .192, each with 62 usable hosts.',
    'A switch works with MAC addresses inside the LAN; a router forwards IP packets between networks.',
  ],
  'Exam 2': [
    'Persistent connections keep one TCP connection open for several requests, so there is no new handshake per object.',
    'The proxy keeps a copy of popular pages and answers from the LAN; a conditional GET checks it is still fresh.',
    'SMTP sends the mail to the server and between servers; IMAP reads it and keeps folders on the server.',
  ],
  Midterm: [
    'The client sends SYN, the server answers SYN-ACK, the client sends ACK, then data can flow.',
    'TCP is reliable and connection-oriented, UDP is faster with no setup. Web uses TCP, video calls use UDP.',
    'The resolver asks the root server, then the TLD server, then the authoritative server, and caches the answer.',
  ],
};

function reasoningFor(ai: number, max: number): string {
  if (ai >= max) return 'Covers every key point of the rubric.';
  if (ai === 0) return 'Does not address what the question asks.';
  if (ai >= max * 0.6) return 'Covers most key points but leaves one out.';
  return 'Gets part of the idea but misses several key points.';
}

function at(date: Date, hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d;
}

export async function seedPapers(
  prisma: PrismaClient,
  userId: Map<string, string>,
) {
  const course = await prisma.course.findUniqueOrThrow({
    where: { code: 'HY335' },
    include: {
      exams: {
        include: { questions: { orderBy: { order: 'asc' } } },
      },
    },
  });
  const today = new Date();
  const yesterday = new Date(today.getTime() - 24 * 3600 * 1000);
  let created = 0;
  let nextId = 5300; // generated student IDs, clear of the anchors

  for (const [e, examPlan] of PAPER_PLANS.entries()) {
    const exam = course.exams.find((x) => x.name === examPlan.exam);
    if (!exam) throw new Error(`HY335 has no exam "${examPlan.exam}"`);
    const maxPoints = exam.questions.map((q) => q.maxPoints);
    const isMidterm = examPlan.exam === 'Midterm';

    for (const [t, plan] of examPlan.plans.entries()) {
      const rand = rng(1000 * (e + 1) + t);
      const taId = userId.get(plan.ta)!;
      const generated = generateStack(plan, maxPoints, rand);
      const anchors = plan.anchors ?? [];
      const stack: Generated[] = [];
      const minutes = minutesAround(plan.medianMinutes, plan.papers, rand);

      // Generated papers first, anchors last (they're the most recent ones).
      generated.forEach((points, i) =>
        stack.push({
          studentId: `csd${nextId++}`,
          points,
          status: 'AI_GRADED',
          minutes: minutes[i],
          createdAt: new Date(0),
        }),
      );
      anchors.forEach((a, i) =>
        stack.push({
          studentId: a.studentId,
          points: a.points,
          status: 'AI_GRADED',
          minutes: minutes[generated.length + i],
          createdAt: new Date(0),
          anchor: a,
        }),
      );
      for (const x of plan.extra ?? []) {
        stack.push({
          studentId: x.studentId,
          points: x.points,
          status: x.status!,
          minutes: plan.medianMinutes,
          createdAt: new Date(0),
          anchor: x,
        });
      }

      // Timeline: older exams spread over the days after the exam; the Midterm
      // runs into today, so the live activity feed has fresh entries.
      let clock = new Date(`${examPlan.firstPaperDay}T09:00:00`);
      let todayClock = at(today, '09:00');
      let yesterdayClock = at(yesterday, '14:00');
      const step = (d: Date, p: Generated) =>
        new Date(d.getTime() + (p.minutes + 6) * 60_000);
      for (const p of stack) {
        if (p.anchor?.at) {
          // Fixed time today: submitted at `at`.
          p.createdAt = new Date(
            at(today, p.anchor.at).getTime() - p.minutes * 60_000,
          );
        } else if (isMidterm && p.anchor?.day === 'yesterday') {
          p.createdAt = yesterdayClock;
          yesterdayClock = step(yesterdayClock, p);
        } else if (isMidterm && p.anchor) {
          p.createdAt = todayClock;
          todayClock = step(todayClock, p);
        } else {
          p.createdAt = clock;
          clock = step(clock, p);
          if (clock.getHours() >= 18)
            clock = new Date(clock.getTime() + 15 * 3600 * 1000);
        }

        const submittedAt =
          p.status === 'DRAFT'
            ? null
            : new Date(p.createdAt.getTime() + p.minutes * 60_000);
        const graded = p.status === 'AI_GRADED';
        await prisma.paper.create({
          data: {
            examId: exam.id,
            taId,
            studentId: p.studentId,
            pageCount: 3,
            status: p.status,
            createdAt: p.createdAt,
            submittedAt,
            aiGradedAt:
              graded && submittedAt
                ? new Date(submittedAt.getTime() + 40_000)
                : null,
            // csd5148 stays "AI grading" for the demo instead of being picked up.
            aiNextAttemptAt:
              p.status === 'AI_GRADING' ? new Date('2099-01-01') : null,
            pages: {
              create: [0, 1, 2].map((index) => ({
                index,
                status: 'READ' as const,
              })),
            },
            answers: {
              create: exam.questions.map((q, i) => {
                const pair = p.points[i];
                return {
                  questionId: q.id,
                  transcription:
                    p.anchor?.transcription?.[i] ?? ANSWERS[examPlan.exam][i],
                  uncertainWords: p.anchor?.uncertainWords?.[i] ?? [],
                  pages: [i],
                  taPoints: p.status === 'DRAFT' ? null : (pair?.[0] ?? null),
                  aiPoints: graded ? pair[1] : null,
                  aiReasoning: graded
                    ? (p.anchor?.reasoning?.[i] ??
                      reasoningFor(pair[1], q.maxPoints))
                    : null,
                };
              }),
            },
          },
        });
        created++;
      }
    }
  }
  return created;
}

// The "Activity today" feed of §7.
export async function seedActivity(
  prisma: PrismaClient,
  userId: Map<string, string>,
) {
  const course = await prisma.course.findUniqueOrThrow({
    where: { code: 'HY335' },
  });
  const midterm = await prisma.exam.findFirstOrThrow({
    where: { courseId: course.id, name: 'Midterm' },
    include: { questions: true },
  });
  const paper = (studentId: string) =>
    prisma.paper.findFirstOrThrow({ where: { examId: midterm.id, studentId } });
  const today = new Date();
  const q2 = midterm.questions.find((q) => q.code === 'Q2')!;
  const id = (k: string) => userId.get(k)!;

  const p5146 = await paper('csd5146');
  const p5148 = await paper('csd5148');
  const p5149 = await paper('csd5149');
  const p5150 = await paper('csd5150');

  await prisma.activityLog.createMany({
    data: [
      {
        courseId: course.id,
        type: 'MEMBER_ADDED',
        actorId: id('instructor'),
        createdAt: at(today, '09:40'),
        payload: { userId: id('giannis'), name: 'Giannis Petrou' },
      },
      {
        courseId: course.id,
        type: 'TA_FLAGGED',
        createdAt: at(today, '11:05'),
        payload: {
          taId: id('maria'),
          examId: midterm.id,
          questionId: q2.id,
          questionCode: 'Q2',
          averageGap: -1.04,
        },
      },
      {
        courseId: course.id,
        type: 'AI_GRADED',
        paperId: p5146.id,
        createdAt: at(today, '12:31'),
        payload: { studentId: 'csd5146', taId: id('nikos'), aiTotal: 8 },
      },
      {
        courseId: course.id,
        type: 'PAPER_SUBMITTED',
        actorId: id('nikos'),
        paperId: p5148.id,
        createdAt: at(today, '12:38'),
        payload: { studentId: 'csd5148' },
      },
      {
        courseId: course.id,
        type: 'AI_GRADED',
        paperId: p5149.id,
        createdAt: at(today, '12:41'),
        payload: { studentId: 'csd5149', taId: id('katerina'), aiTotal: 7 },
      },
      {
        courseId: course.id,
        type: 'PAPER_DRAFT_SAVED',
        actorId: id('nikos'),
        paperId: p5150.id,
        createdAt: at(today, '12:44'),
        payload: { studentId: 'csd5150' },
      },
    ],
  });
}
