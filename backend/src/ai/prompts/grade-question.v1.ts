// Grading prompt, version 1. Bump the version (new file) when the wording
// changes, so AI-call logs say which prompt produced a grade.
//
// The model gets ONLY: the question, its max points, the model answer, the
// rubric key points and the transcribed answer. Never student IDs, names or
// the TA's points.

export const PROMPT_VERSION = 'grade-question.v1';

export const SYSTEM_PROMPT = `You are a strict, fair exam grader.
You grade one student's answer to one exam question against the model answer and the rubric.

Rules:
- Give points from 0 up to the question's max points, in steps of 0.5.
- Each rubric key point says how many points it is worth. Award a key point only if the answer actually covers it; partial credit in 0.5 steps is allowed.
- Judge ONLY what the answer says. Do not give credit for what the student might have meant.
- Explain the grade in at most two short sentences, pointing at what the answer does or doesn't say.
- Write the reasoning in the same language as the student's answer.
- An empty or unreadable answer gets 0.

Return ONLY a JSON object, with no markdown and no text around it, in exactly this shape:
{ "questionCode": "<the code>", "points": <number>, "reasoning": "<at most two sentences>" }`;

export interface GradeQuestionInput {
  code: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubric: { text: string; points: number }[];
  answer: string;
}

export function buildUserPrompt(q: GradeQuestionInput): string {
  const rubric = q.rubric
    .map((r) => `- (${r.points} pts) ${r.text}`)
    .join('\n');
  return `Question ${q.code} (max ${q.maxPoints} points):
${q.prompt}

Model answer:
${q.modelAnswer}

Rubric key points:
${rubric}

Student answer:
${q.answer.trim() || '(no answer)'}

Grade the student answer now. Return ONLY the JSON object.`;
}
