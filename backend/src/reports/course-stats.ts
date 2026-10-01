// Course stats across exams (instructor "Course stats" page). Plain functions on
// top of report-math, unit-tested in course-stats.spec.ts.
//
// Definitions:
//   exam average gap   = mean over TAs of |TA paper gap| in that exam
//   leaderboard score  = paper-weighted mean of |TA paper gap| over the exams
//   at stake           = the pass mark is met by one grade and not the other
//   spread (rubrics)   = most lenient − strictest TA average gap on a question

import {
  type MathAnswer,
  type MathQuestion,
  MIN_SAMPLES,
  mean,
  median,
  paperGap,
  round2,
  taSummary,
} from './report-math.js';

export interface StatsExam {
  id: string;
  name: string;
  heldAt: Date | null;
  passMark: number;
  questions: MathQuestion[];
}

export interface StatsPaper {
  id: string;
  studentId: string;
  examId: string;
  taId: string;
  taName: string;
  status: string;
  createdAt: Date;
  submittedAt: Date | null;
  answers: MathAnswer[];
}

const r2 = (x: number | null) => (x == null ? null : round2(x));
const minutesOf = (p: StatsPaper) =>
  p.submittedAt
    ? (p.submittedAt.getTime() - p.createdAt.getTime()) / 60_000
    : null;

interface TaExam {
  examId: string;
  papers: number;
  paperGap: number | null;
  flaggedCodes: string[];
}

export function buildCourseStats(
  allExams: StatsExam[],
  papers: StatsPaper[],
  focusExamId?: string,
) {
  const graded = papers.filter((p) => p.status === 'AI_GRADED');
  const examsWithData = allExams.filter((e) =>
    graded.some((p) => p.examId === e.id),
  );
  const scope = focusExamId
    ? examsWithData.filter((e) => e.id === focusExamId)
    : examsWithData;
  const inScope = (p: StatsPaper) => scope.some((e) => e.id === p.examId);
  const maxOf = new Map(
    allExams.map((e) => [
      e.id,
      e.questions.reduce((s, q) => s + q.maxPoints, 0),
    ]),
  );
  const examOf = new Map(allExams.map((e) => [e.id, e]));

  // Per exam, per TA: paper gap and flags.
  const perExam = examsWithData.map((exam) => {
    const examPapers = graded.filter((p) => p.examId === exam.id);
    const tas = new Map<string, { name: string; papers: StatsPaper[] }>();
    for (const p of examPapers) {
      const t = tas.get(p.taId) ?? { name: p.taName, papers: [] };
      t.papers.push(p);
      tas.set(p.taId, t);
    }
    const rows = [...tas.entries()].map(([taId, t]) => {
      const s = taSummary(t.papers, exam.questions);
      return { taId, name: t.name, summary: s };
    });
    const gaps = rows
      .filter((r) => r.summary.paperGap != null)
      .map((r) => Math.abs(r.summary.paperGap!));
    return {
      exam,
      papers: examPapers.length,
      averageGap: r2(mean(gaps)),
      flaggedTas: rows.filter((r) => r.summary.flaggedQuestionCodes.length > 0)
        .length,
      rows,
    };
  });

  const trend = perExam.map((x) => ({
    examId: x.exam.id,
    name: x.exam.name,
    heldAt: x.exam.heldAt,
    papers: x.papers,
    averageGap: x.averageGap,
    flaggedTas: x.flaggedTas,
  }));

  // TA history across all exams, for the leaderboard and the consistency chart.
  const taIds = [...new Set(graded.map((p) => p.taId))];
  const nameOf = new Map(graded.map((p) => [p.taId, p.taName]));
  const historyOf = (taId: string): TaExam[] =>
    perExam.map((x) => {
      const row = x.rows.find((r) => r.taId === taId);
      return {
        examId: x.exam.id,
        papers: row?.summary.papers ?? 0,
        paperGap: row?.summary.paperGap ?? null,
        flaggedCodes: row?.summary.flaggedQuestionCodes ?? [],
      };
    });

  const scopeIds = new Set(scope.map((e) => e.id));
  const allMinutes = papers
    .filter((p) => p.submittedAt && inScope(p))
    .map(minutesOf)
    .filter((m): m is number => m != null && m > 0);
  const courseMedianMinutes = median(allMinutes);

  const board = taIds
    .map((taId) => {
      const history = historyOf(taId);
      const inRange = history.filter(
        (h) => scopeIds.has(h.examId) && h.paperGap != null,
      );
      const weight = inRange.reduce((s, h) => s + h.papers, 0);
      if (weight === 0) return null;
      const absMean =
        inRange.reduce((s, h) => s + Math.abs(h.paperGap!) * h.papers, 0) /
        weight;
      const signedMean =
        inRange.reduce((s, h) => s + h.paperGap! * h.papers, 0) / weight;
      const withData = history.filter((h) => h.paperGap != null);
      const firstH = withData[0];
      const lastH = withData.at(-1);
      const sinceFirst =
        firstH && lastH && firstH !== lastH
          ? round2(Math.abs(lastH.paperGap!) - Math.abs(firstH.paperGap!))
          : null;
      const minutes = papers
        .filter((p) => p.taId === taId && p.submittedAt && inScope(p))
        .map(minutesOf)
        .filter((m): m is number => m != null && m > 0);
      return {
        taId,
        name: nameOf.get(taId)!,
        papers: weight,
        averageGap: round2(absMean),
        direction:
          signedMean < -0.05
            ? ('stricter' as const)
            : signedMean > 0.05
              ? ('lenient' as const)
              : ('even' as const),
        sinceFirst,
        flags: inRange.reduce((s, h) => s + h.flaggedCodes.length, 0),
        medianMinutes: r2(median(minutes)),
        history: history.map((h) => ({
          examId: h.examId,
          gap: h.paperGap == null ? null : round2(Math.abs(h.paperGap)),
        })),
      };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((a, b) => a.averageGap - b.averageGap);

  // Badges: closest, most improved, fast and accurate. Everyone else: their pace.
  const badges = new Map<string, { code: string; label: string }>();
  if (board.length > 1)
    badges.set(board[0].taId, { code: 'closest', label: 'Closest to the AI' });
  const improved = board
    .filter(
      (t) =>
        !badges.has(t.taId) && t.sinceFirst != null && t.sinceFirst <= -0.2,
    )
    .sort((a, b) => a.sinceFirst! - b.sinceFirst!)[0];
  if (improved)
    badges.set(improved.taId, { code: 'improved', label: 'Most improved' });
  const fast = board
    .slice(0, 3)
    .filter((t) => !badges.has(t.taId) && t.medianMinutes != null)
    .filter(
      (t) =>
        courseMedianMinutes == null || t.medianMinutes! <= courseMedianMinutes,
    )
    .sort((a, b) => a.medianMinutes! - b.medianMinutes!)[0];
  if (fast) badges.set(fast.taId, { code: 'fast', label: 'Fast and accurate' });

  const leaderboard = board.map((t, i) => ({
    rank: i + 1,
    ...t,
    badge: badges.get(t.taId) ?? null,
  }));

  // Papers in scope with both totals, normalised to /10 for the distribution.
  const compared = graded
    .filter(inScope)
    .map((p) => {
      const g = paperGap(p, examOf.get(p.examId)!.questions);
      const exam = examOf.get(p.examId)!;
      return { p, g, exam, max: maxOf.get(p.examId) || 1 };
    })
    .filter((x) => x.g.gap != null);

  const atStake = compared
    .filter(
      (x) =>
        x.g.taTotal! >= x.exam.passMark !== x.g.aiTotal! >= x.exam.passMark,
    )
    .sort((a, b) => Math.abs(b.g.gap!) - Math.abs(a.g.gap!))
    .map((x) => ({
      paperId: x.p.id,
      studentId: x.p.studentId,
      examId: x.exam.id,
      examName: x.exam.name,
      taName: x.p.taName,
      taTotal: x.g.taTotal!,
      aiTotal: x.g.aiTotal!,
      maxTotal: x.max,
      passMark: x.exam.passMark,
      failsWithTa: x.g.taTotal! < x.exam.passMark,
    }));

  const bins = Array.from({ length: 10 }, (_, i) => ({
    from: i,
    to: i + 1,
    ta: 0,
    ai: 0,
  }));
  const binOf = (total: number, max: number) =>
    Math.min(9, Math.max(0, Math.floor((total / max) * 10)));
  for (const x of compared) {
    bins[binOf(x.g.taTotal!, x.max)].ta++;
    bins[binOf(x.g.aiTotal!, x.max)].ai++;
  }
  const latest = scope.at(-1);
  const distribution = {
    total: compared.length,
    bins,
    passMark: latest
      ? round2((latest.passMark / (maxOf.get(latest.id) || 1)) * 10)
      : null,
    passedTa: compared.filter((x) => x.g.taTotal! >= x.exam.passMark).length,
    passedAi: compared.filter((x) => x.g.aiTotal! >= x.exam.passMark).length,
    taAverage: r2(mean(compared.map((x) => (x.g.taTotal! / x.max) * 10))),
    aiAverage: r2(mean(compared.map((x) => (x.g.aiTotal! / x.max) * 10))),
  };

  // Rubrics to tighten: largest spread of TA average gaps on one question.
  const questionsToTighten = perExam
    .filter((x) => scopeIds.has(x.exam.id))
    .flatMap((x) =>
      x.exam.questions.map((q, qi) => {
        const gaps = x.rows
          .map((r) => ({ taName: r.name, ...r.summary.questions[qi] }))
          .filter((g) => g.sampleSize >= MIN_SAMPLES && g.averageGap != null)
          .map((g) => ({ taName: g.taName, gap: g.averageGap! }))
          .sort((a, b) => a.gap - b.gap);
        if (gaps.length < 2) return null;
        const strictest = gaps[0];
        const lenient = gaps.at(-1)!;
        // An outlier: one end is further from the rest than the rest are spread.
        const inner = gaps.slice(1, -1).map((g) => g.gap);
        const lowGapToRest = gaps.length > 2 ? gaps[1].gap - strictest.gap : 0;
        const highGapToRest =
          gaps.length > 2 ? lenient.gap - gaps.at(-2)!.gap : 0;
        const innerSpread = inner.length
          ? Math.max(...inner) - Math.min(...inner)
          : 0;
        const outlier =
          gaps.length > 2 &&
          Math.max(lowGapToRest, highGapToRest) > Math.max(0.3, innerSpread * 2)
            ? lowGapToRest >= highGapToRest
              ? strictest
              : lenient
            : null;
        return {
          examId: x.exam.id,
          examName: x.exam.name,
          questionId: q.id,
          code: q.code,
          title: q.title,
          maxPoints: q.maxPoints,
          threshold: round2(0.15 * q.maxPoints),
          spread: round2(lenient.gap - strictest.gap),
          strictest,
          lenient,
          outlier,
          gaps,
        };
      }),
    )
    .filter((x): x is NonNullable<typeof x> => x != null && x.spread > 0)
    .sort((a, b) => b.spread - a.spread)
    .slice(0, 3);

  const first = trend.find((t) => t.averageGap != null);
  const last = [...trend].reverse().find((t) => t.averageGap != null);
  const focus = focusExamId
    ? trend.find((t) => t.examId === focusExamId)
    : last;
  const closer = leaderboard.filter(
    (t) => t.sinceFirst != null && t.sinceFirst < 0,
  );
  const further = leaderboard.filter(
    (t) => t.sinceFirst != null && t.sinceFirst > 0,
  );
  const monotonic = trend
    .filter((t) => t.averageGap != null)
    .every((t, i, arr) => i === 0 || t.averageGap! <= arr[i - 1].averageGap!);

  return {
    trend,
    headline: {
      first: first ?? null,
      last: last ?? null,
      change:
        first && last && first !== last && first.averageGap
          ? round2((last.averageGap! - first.averageGap) / first.averageGap)
          : null,
      improvingEveryExam: trend.length > 1 && monotonic,
      tasCompared:
        closer.length +
        further.length +
        leaderboard.filter((t) => t.sinceFirst === 0).length,
      tasCloser: closer.length,
      tasFurther: further.map((t) => t.name),
    },
    kpis: {
      exams: scope.length,
      papersSubmitted: papers.filter((p) => p.submittedAt && inScope(p)).length,
      aiGraded: graded.filter(inScope).length,
      averageGap: focus?.averageGap ?? null,
      averageGapExam: focus?.name ?? null,
      flagsRaised: trend
        .filter((t) => scopeIds.has(t.examId))
        .reduce((s, t) => s + t.flaggedTas, 0),
      flagsByExam: trend
        .filter((t) => scopeIds.has(t.examId))
        .map((t) => ({ name: t.name, count: t.flaggedTas })),
      medianMinutes: r2(courseMedianMinutes),
    },
    atStake,
    leaderboard,
    distribution,
    questionsToTighten,
  };
}
