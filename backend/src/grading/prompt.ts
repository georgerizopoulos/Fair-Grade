// Builds the grading prompt from a rubric + one answer. Pure string work:
// no LLM, no AWS, no DB. Same inputs always produce the same string.

// The minimal shape prompt-building needs from a criterion. The grading
// service maps its rubric rows into this before calling.
export interface PromptCriterion {
  id: string;
  description: string;
  maxPoints: number;
}

// Frozen system prompt — sets the grader's role and the hard rules.
// Kept separate from the per-answer content so it can be cached later.
export const SYSTEM_PROMPT = `You are a strict, fair exam grader.
You grade one student's answer against a rubric, one criterion at a time.

Rules:
- Grade every criterion independently, from 0 up to its maxPoints. Half points are allowed.
- Judge ONLY what the answer actually says. Do not give credit for what the student might have meant.
- For each criterion, give one or two sentences of reasoning pointing at what the answer does or doesn't say.
- Write the reasoning in the same language as the student's answer.
- Do not let your score for one criterion affect another.

Return ONLY a JSON object, with no markdown, no code fences, and no text before or after it.
The JSON must have exactly one entry per criterion, in this shape:
{ "scores": [ { "criterionId": "<the id>", "reasoning": "<one or two sentences>", "points": <number> } ] }`;

/**
 * Build the user prompt for grading one answer.
 * Criteria go in as JSON (with their IDs) so the model echoes the right id back.
 */
export function buildGradingPrompt(
  questionText: string,
  criteria: PromptCriterion[],
  answerText: string,
): string {
  // Only expose id/description/maxPoints — nothing the model shouldn't see.
  const criteriaJson = JSON.stringify(
    criteria.map((c) => ({
      criterionId: c.id,
      description: c.description,
      maxPoints: c.maxPoints,
    })),
    null,
    2,
  );

  return `Question:
${questionText}

Rubric criteria (JSON):
${criteriaJson}

Student answer:
${answerText}

Grade the answer now. Return ONLY the JSON object described in the instructions, with exactly one entry per criterion above.`;
}
