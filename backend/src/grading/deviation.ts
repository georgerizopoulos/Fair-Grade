// The single definition of how deviation + flags are computed (API_SPEC.md →
// Deviation Rules). Pure function: no LLM, no AWS, no DB. GET /deviation calls
// this; nobody reimplements it.

export const FLAG_RATIO = 0.15; // gap must exceed 15% of the criterion's maxPoints
export const MIN_SAMPLES = 3; // at least 3 answers before a gap counts as a pattern

// --- Input shapes (the controller maps Prisma rows into these) ---

export interface DeviationCriterion {
  id: string;
  position: number;
  description: string;
  maxPoints: number;
}

export interface DeviationRubric {
  criteria: DeviationCriterion[];
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
  points: number; // pointsGiven
}

export interface DeviationTaUser {
  id: string;
  name: string;
}

// --- Output shapes (the taSummaries array of GET /deviation #15) ---

export interface DeviationExample {
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
  examples: DeviationExample[];
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

const round2 = (x: number): number => Math.round(x * 100) / 100;

const key = (answerId: string, criterionId: string): string =>
  `${answerId}:${criterionId}`;

/**
 * Compute the deviation report, grouped by TA, exactly per the Deviation Rules.
 * Returns the taSummaries array.
 */
export function computeDeviation(
  rubric: DeviationRubric,
  answers: DeviationAnswer[],
  aiGrades: DeviationAiGrade[],
  taGrades: DeviationTaGrade[],
  taUsers: DeviationTaUser[],
): TaSummary[] {
  // Lookups
  const criteria = [...rubric.criteria].sort((a, b) => a.position - b.position);
  const answersById = new Map(answers.map((a) => [a.id, a]));
  const aiByKey = new Map(aiGrades.map((g) => [key(g.answerId, g.criterionId), g]));
  const nameById = new Map(taUsers.map((u) => [u.id, u.name]));

  // Only answers that actually belong to this rubric count.
  const knownAnswer = (id: string): boolean => answersById.has(id);

  // Group this rubric's TA grades by TA id.
  const taGradesByTa = new Map<string, DeviationTaGrade[]>();
  for (const g of taGrades) {
    if (!knownAnswer(g.answerId)) continue;
    const list = taGradesByTa.get(g.taId) ?? [];
    list.push(g);
    taGradesByTa.set(g.taId, list);
  }

  const summaries: TaSummary[] = [];

  for (const [taId, grades] of taGradesByTa) {
    // Fast lookup of this TA's points for a given answer+criterion.
    const taByKey = new Map(grades.map((g) => [key(g.answerId, g.criterionId), g]));

    const criterionSummaries: CriterionSummary[] = criteria.map((c) => {
      // Answers where THIS TA and the AI both graded THIS criterion.
      const rows: DeviationExample[] = [];
      for (const answer of answers) {
        const ta = taByKey.get(key(answer.id, c.id));
        const ai = aiByKey.get(key(answer.id, c.id));
        if (!ta || !ai) continue;
        rows.push({
          answerId: answer.id,
          studentIdAnon: answer.studentIdAnon,
          answerText: answer.answerText,
          taPoints: ta.points,
          aiPoints: ai.points,
          deviation: ta.points - ai.points,
          aiReasoning: ai.reasoning,
        });
      }

      const sampleSize = rows.length;
      const avgDeviation =
        sampleSize === 0
          ? null
          : round2(rows.reduce((sum, r) => sum + r.deviation, 0) / sampleSize);

      let direction: CriterionSummary['direction'] = 'aligned';
      if (avgDeviation !== null && avgDeviation < 0) direction = 'stricter';
      else if (avgDeviation !== null && avgDeviation > 0) direction = 'lenient';

      const flagged =
        sampleSize >= MIN_SAMPLES &&
        avgDeviation !== null &&
        Math.abs(avgDeviation) > FLAG_RATIO * c.maxPoints;

      // Up to 3 biggest-gap answers, largest first — only for a flagged criterion.
      const examples = flagged
        ? [...rows]
            .sort((a, b) => Math.abs(b.deviation) - Math.abs(a.deviation))
            .slice(0, 3)
        : [];

      return {
        criterionId: c.id,
        position: c.position,
        description: c.description,
        maxPoints: c.maxPoints,
        sampleSize,
        avgDeviation,
        direction,
        flagged,
        examples,
      };
    });

    // TA-level aggregates.
    const answersGraded = new Set(grades.map((g) => g.answerId)).size;

    const graded = criterionSummaries.filter((cs) => cs.sampleSize >= 1);
    const overallDeviation =
      graded.length === 0
        ? 0
        : round2(
            graded.reduce((sum, cs) => sum + Math.abs(cs.avgDeviation ?? 0), 0) /
              graded.length,
          );

    const flaggedCriteriaCount = criterionSummaries.filter((cs) => cs.flagged).length;

    summaries.push({
      taId,
      taName: nameById.get(taId) ?? taId,
      answersGraded,
      overallDeviation,
      flagged: flaggedCriteriaCount > 0,
      flaggedCriteriaCount,
      criteria: criterionSummaries,
    });
  }

  // Flagged TAs first, then by overallDeviation descending.
  summaries.sort((a, b) => {
    if (a.flagged !== b.flagged) return a.flagged ? -1 : 1;
    return b.overallDeviation - a.overallDeviation;
  });

  return summaries;
}
