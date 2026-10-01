// TA vs AI math for reports, TA detail and "my stats". Plain functions, no Nest
// or Prisma, so they are unit-tested in report-math.spec.ts.
//
// Rules (change request §5):
//   gap            = TA points − AI points (negative: the TA is stricter)
//   paper gap      = TA total − AI total on one paper
//   question gap   = average gap on one question over a TA's AI-graded papers
//   flagged        = |question gap| > 15% of the question's points, with ≥ 3 papers
//   leaderboard    = average |paper gap| (smaller is closer to the AI)

export const FLAG_RATIO = 0.15;
export const MIN_SAMPLES = 3;

export interface MathQuestion {
  id: string;
  code: string;
  title: string;
  maxPoints: number;
}

export interface MathAnswer {
  questionId: string;
  taPoints: number | null;
  aiPoints: number | null;
}

export interface MathPaper {
  id: string;
  studentId: string;
  answers: MathAnswer[];
}

export interface QuestionGap {
  questionId: string;
  code: string;
  title: string;
  maxPoints: number;
  sampleSize: number;
  taAverage: number | null;
  aiAverage: number | null;
  averageGap: number | null;
  threshold: number;
  flagged: boolean;
}

export interface PaperGap {
  paperId: string;
  studentId: string;
  taTotal: number | null;
  aiTotal: number | null;
  gap: number | null;
  // Question with the largest |gap| on this paper ("mostly Q2"); null if none differ.
  mostlyCode: string | null;
}

export interface TaSummary {
  papers: number;
  taAverage: number | null;
  aiAverage: number | null;
  paperGap: number | null;
  meanAbsPaperGap: number | null;
  questions: QuestionGap[];
  flaggedQuestionCodes: string[];
}

export const round2 = (x: number) => Math.round(x * 100) / 100;

export function mean(xs: number[]): number | null {
  return xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : null;
}

export function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

const r2OrNull = (x: number | null) => (x == null ? null : round2(x));

export function threshold(maxPoints: number) {
  return round2(FLAG_RATIO * maxPoints);
}

function pairsOf<A extends MathAnswer>(answers: A[]) {
  return answers.filter(
    (a): a is A & { taPoints: number; aiPoints: number } =>
      a.taPoints != null && a.aiPoints != null,
  );
}

// Average TA vs AI on one question, over the given answers to it.
export function questionGap(
  q: MathQuestion,
  answers: MathAnswer[],
): QuestionGap {
  const pairs = pairsOf(answers);
  const taAverage = mean(pairs.map((p) => p.taPoints));
  const aiAverage = mean(pairs.map((p) => p.aiPoints));
  const averageGap = mean(pairs.map((p) => p.taPoints - p.aiPoints));
  const limit = threshold(q.maxPoints);
  return {
    questionId: q.id,
    code: q.code,
    title: q.title,
    maxPoints: q.maxPoints,
    sampleSize: pairs.length,
    taAverage: r2OrNull(taAverage),
    aiAverage: r2OrNull(aiAverage),
    averageGap: r2OrNull(averageGap),
    threshold: limit,
    // Compare unrounded, so −0.451 on a 3-point question still flags.
    flagged:
      pairs.length >= MIN_SAMPLES &&
      averageGap != null &&
      Math.abs(averageGap) > limit + 1e-9,
  };
}

// Totals of one paper. A total is null until every question has points.
export function paperGap(
  paper: MathPaper,
  questions: MathQuestion[],
): PaperGap {
  const byQuestion = new Map(paper.answers.map((a) => [a.questionId, a]));
  const rows = questions.map((q) => ({ q, a: byQuestion.get(q.id) }));
  const complete = (key: 'taPoints' | 'aiPoints') =>
    rows.length > 0 && rows.every((r) => r.a?.[key] != null);
  const total = (key: 'taPoints' | 'aiPoints') =>
    complete(key) ? rows.reduce((s, r) => s + r.a![key]!, 0) : null;

  const taTotal = total('taPoints');
  const aiTotal = total('aiPoints');
  let mostlyCode: string | null = null;
  let largest = 0;
  for (const { q, a } of rows) {
    if (a?.taPoints == null || a.aiPoints == null) continue;
    const g = Math.abs(a.taPoints - a.aiPoints);
    if (g > largest) {
      largest = g;
      mostlyCode = q.code;
    }
  }
  return {
    paperId: paper.id,
    studentId: paper.studentId,
    taTotal,
    aiTotal,
    gap: taTotal != null && aiTotal != null ? round2(taTotal - aiTotal) : null,
    mostlyCode,
  };
}

// Everything about one TA's AI-graded papers in one exam.
export function taSummary(
  papers: MathPaper[],
  questions: MathQuestion[],
): TaSummary {
  const rows = papers.map((p) => paperGap(p, questions));
  const complete = rows.filter((r) => r.gap != null);
  const perQuestion = questions.map((q) =>
    questionGap(
      q,
      papers.flatMap((p) => p.answers.filter((a) => a.questionId === q.id)),
    ),
  );
  return {
    papers: papers.length,
    taAverage: r2OrNull(mean(complete.map((r) => r.taTotal!))),
    aiAverage: r2OrNull(mean(complete.map((r) => r.aiTotal!))),
    paperGap: r2OrNull(mean(complete.map((r) => r.gap!))),
    meanAbsPaperGap: r2OrNull(mean(complete.map((r) => Math.abs(r.gap!)))),
    questions: perQuestion,
    flaggedQuestionCodes: perQuestion
      .filter((q) => q.flagged)
      .map((q) => q.code),
  };
}

// Single answers with the largest |gap|, largest first. Keeps the paper's own
// answer fields (reasoning, transcription) on each result.
export function largestAnswerGaps<P extends MathPaper>(
  papers: P[],
  questions: MathQuestion[],
  limit: number,
  onlyQuestionId?: string,
) {
  type A = P['answers'][number];
  const codeOf = new Map(questions.map((q) => [q.id, q.code]));
  return papers
    .flatMap((paper) =>
      pairsOf<A>(paper.answers)
        .filter((a) => codeOf.has(a.questionId))
        .filter((a) => !onlyQuestionId || a.questionId === onlyQuestionId)
        .map((a) => ({
          paper,
          answer: a,
          questionCode: codeOf.get(a.questionId)!,
          gap: round2(a.taPoints - a.aiPoints),
        })),
    )
    .filter((x) => x.gap !== 0)
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap))
    .slice(0, limit);
}
