// TEMPORARY STUB — Κώστας owns this file (Track 2 step 2). When he pushes the
// real computeDeviation(), this whole file is replaced; the signature below is
// the agreed contract so nothing else changes.
//
// Implements the Deviation Rules from API_SPEC.md so #15 works end to end in
// the meantime.

export const FLAG_RATIO = 0.15; // gap must exceed 15% of the criterion's maxPoints
export const MIN_SAMPLES = 3; // at least 3 answers before a gap counts as a pattern

export interface DeviationCriterion {
  id: string;
  position: number;
  description: string;
  maxPoints: number;
}

export interface DeviationTa {
  id: string;
  name: string;
}

export interface DeviationAnswer {
  id: string;
  studentIdAnon: string;
  answerText: string;
}

export interface DeviationAiGrade {
  answerId: string;
  criterionId: string;
  points: number;
  reasoning: string;
}

export interface DeviationTaGrade {
  answerId: string;
  criterionId: string;
  taId: string;
  pointsGiven: number;
}

export interface DeviationInput {
  criteria: DeviationCriterion[];
  tas: DeviationTa[];
  answers: DeviationAnswer[];
  aiGrades: DeviationAiGrade[];
  taGrades: DeviationTaGrade[];
}

export interface CriterionExample {
  answerId: string;
  studentIdAnon: string;
  answerText: string;
  taPoints: number;
  aiPoints: number;
  deviation: number;
  aiReasoning: string;
}

export interface CriterionSummary {
  criterionId: string;
  position: number;
  description: string;
  maxPoints: number;
  sampleSize: number;
  avgDeviation: number | null;
  direction: 'stricter' | 'lenient' | 'aligned';
  flagged: boolean;
  examples: CriterionExample[];
}

export interface TaSummary {
  taId: string;
  taName: string;
  answersGraded: number;
  overallDeviation: number;
  flagged: boolean;
  flaggedCriteriaCount: number;
  criteria: CriterionSummary[];
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function computeDeviation(input: DeviationInput): TaSummary[] {
  const answerById = new Map(input.answers.map((a) => [a.id, a]));
  const aiByKey = new Map(
    input.aiGrades.map((g) => [`${g.answerId}:${g.criterionId}`, g]),
  );

  const summaries: TaSummary[] = [];

  for (const ta of input.tas) {
    const ownGrades = input.taGrades.filter((g) => g.taId === ta.id);
    if (ownGrades.length === 0) continue; // only TAs with at least one grade

    const criteria: CriterionSummary[] = input.criteria.map((criterion) => {
      // Answers where both this TA and the AI graded this criterion.
      const pairs = ownGrades
        .filter((g) => g.criterionId === criterion.id)
        .flatMap((g) => {
          const ai = aiByKey.get(`${g.answerId}:${criterion.id}`);
          const answer = answerById.get(g.answerId);
          return ai && answer ? [{ ta: g, ai, answer }] : [];
        });

      const sampleSize = pairs.length;
      const avgDeviation =
        sampleSize === 0
          ? null
          : round2(
              pairs.reduce(
                (sum, p) => sum + (p.ta.pointsGiven - p.ai.points),
                0,
              ) / sampleSize,
            );

      const direction =
        avgDeviation === null || avgDeviation === 0
          ? 'aligned'
          : avgDeviation < 0
            ? 'stricter'
            : 'lenient';

      const flagged =
        sampleSize >= MIN_SAMPLES &&
        avgDeviation !== null &&
        Math.abs(avgDeviation) > FLAG_RATIO * criterion.maxPoints;

      const examples: CriterionExample[] = flagged
        ? pairs
            .map((p) => ({
              answerId: p.answer.id,
              studentIdAnon: p.answer.studentIdAnon,
              answerText: p.answer.answerText,
              taPoints: p.ta.pointsGiven,
              aiPoints: p.ai.points,
              deviation: round2(p.ta.pointsGiven - p.ai.points),
              aiReasoning: p.ai.reasoning,
            }))
            .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
            .slice(0, 3)
        : [];

      return {
        criterionId: criterion.id,
        position: criterion.position,
        description: criterion.description,
        maxPoints: criterion.maxPoints,
        sampleSize,
        avgDeviation,
        direction,
        flagged,
        examples,
      };
    });

    const withSamples = criteria.filter((c) => c.sampleSize >= 1);
    const overallDeviation =
      withSamples.length === 0
        ? 0
        : round2(
            withSamples.reduce(
              (sum, c) => sum + Math.abs(c.avgDeviation ?? 0),
              0,
            ) / withSamples.length,
          );

    const flaggedCriteriaCount = criteria.filter((c) => c.flagged).length;

    summaries.push({
      taId: ta.id,
      taName: ta.name,
      answersGraded: new Set(ownGrades.map((g) => g.answerId)).size,
      overallDeviation,
      flagged: flaggedCriteriaCount > 0,
      flaggedCriteriaCount,
      criteria,
    });
  }

  // Flagged first, then by overallDeviation, highest first.
  return summaries.sort((a, b) => {
    if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
    return b.overallDeviation - a.overallDeviation;
  });
}
