// Totals for one paper. Pure, shared by every endpoint that shows a paper.
export interface AnswerPoints {
  maxPoints: number;
  taPoints: number | null;
  aiPoints: number | null;
}

export function paperTotals(answers: AnswerPoints[]) {
  const maxTotal = sum(answers.map((a) => a.maxPoints));
  const taComplete =
    answers.length > 0 && answers.every((a) => a.taPoints !== null);
  const aiComplete =
    answers.length > 0 && answers.every((a) => a.aiPoints !== null);
  const taTotal = taComplete ? sum(answers.map((a) => a.taPoints!)) : null;
  const aiTotal = aiComplete ? sum(answers.map((a) => a.aiPoints!)) : null;
  return {
    maxTotal,
    taTotal,
    aiTotal,
    // TA − AI. Negative: the TA was stricter.
    gap:
      taTotal !== null && aiTotal !== null ? round2(taTotal - aiTotal) : null,
  };
}

const sum = (xs: number[]) => round2(xs.reduce((s, x) => s + x, 0));
const round2 = (x: number) => Math.round(x * 100) / 100;

// Points are given in half-point steps.
export const isHalfStep = (x: number) => Number.isInteger(x * 2);
