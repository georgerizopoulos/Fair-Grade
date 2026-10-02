import { complete } from './llm.client.js';
import { SYSTEM_PROMPT, buildGradingPrompt } from './prompt.js';
import { parseAndValidate, type ValidatedScore } from './grading.schema.js';

// runGrading: has the AI grade every answer of a rubric, independently, against
// the rubric's criteria. Never sees TA grades. Returns the grades; the
// controller (Γιώργος) writes them to the DB.

const MAX_ATTEMPTS = 3; // 1 try + 2 retries, per API_SPEC #13
const CONCURRENCY = 5; // up to 5 answers graded in parallel

// --- Input shapes (the service maps Prisma rows into these) ---

export interface GradingRubric {
  courseName: string;
  questionText: string;
  criteria: { id: string; description: string; maxPoints: number }[];
}

export interface GradingAnswer {
  id: string;
  studentIdAnon: string;
  answerText: string;
}

// --- Output shapes ---

export interface AiGradeResult {
  answerId: string;
  criterionId: string;
  points: number;
  reasoning: string;
}

export interface FailedAnswer {
  answerId: string;
  studentIdAnon: string;
  error: string;
}

export interface RunGradingResult {
  aiGrades: AiGradeResult[];
  failedAnswers: FailedAnswer[];
}

/**
 * Layer 1 — grade ONE answer, once. Throws if the reply is invalid.
 * Stamps the answerId onto each score (the model never sees it).
 */
async function gradeOneAnswer(
  rubric: GradingRubric,
  answer: GradingAnswer,
): Promise<AiGradeResult[]> {
  const userPrompt = buildGradingPrompt(
    rubric.questionText,
    rubric.criteria,
    answer.answerText,
  );

  const raw = await complete(SYSTEM_PROMPT, userPrompt);

  const result = parseAndValidate(raw, rubric.criteria);
  if (!result.ok) {
    throw new Error(result.error);
  }

  return result.scores.map((s: ValidatedScore) => ({
    answerId: answer.id,
    criterionId: s.criterionId,
    points: s.points,
    reasoning: s.reasoning,
  }));
}

/**
 * Layer 2 — be stubborn: retry a single answer up to MAX_ATTEMPTS times.
 * After the last failure, surface the error instead of throwing.
 */
async function gradeWithRetries(
  rubric: GradingRubric,
  answer: GradingAnswer,
): Promise<
  { ok: true; grades: AiGradeResult[] } | { ok: false; error: string }
> {
  let lastError = 'unknown error';
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const grades = await gradeOneAnswer(rubric, answer);
      return { ok: true, grades };
    } catch (e) {
      lastError = (e as Error).message;
    }
  }
  return {
    ok: false,
    error: `failed after ${MAX_ATTEMPTS} attempts: ${lastError}`,
  };
}

/**
 * Layer 3 — grade the whole batch, CONCURRENCY answers at a time.
 * Collects the good grades and the dead answers separately.
 */
export async function runGrading(
  rubric: GradingRubric,
  answers: GradingAnswer[],
): Promise<RunGradingResult> {
  const aiGrades: AiGradeResult[] = [];
  const failedAnswers: FailedAnswer[] = [];

  for (let i = 0; i < answers.length; i += CONCURRENCY) {
    const batch = answers.slice(i, i + CONCURRENCY);
    const results = await Promise.all(
      batch.map((answer) => gradeWithRetries(rubric, answer)),
    );

    results.forEach((result, j) => {
      const answer = batch[j];
      if (result.ok) {
        aiGrades.push(...result.grades);
      } else {
        failedAnswers.push({
          answerId: answer.id,
          studentIdAnon: answer.studentIdAnon,
          error: result.error,
        });
      }
    });
  }

  return { aiGrades, failedAnswers };
}
