// Turns one raw model reply into a clean grade. Pure: no LLM, no DB.
//   - points: clamped to 0…max and rounded to the nearest 0.5
//   - reasoning: trimmed, at most two sentences, never empty

export type GradeReply =
  | { ok: true; points: number; reasoning: string }
  | { ok: false; error: string };

export function parseGradeReply(raw: string, maxPoints: number): GradeReply {
  let parsed: unknown;
  try {
    parsed = extractJson(raw);
  } catch (e) {
    return { ok: false, error: `invalid JSON: ${(e as Error).message}` };
  }
  const obj = parsed as { points?: unknown; reasoning?: unknown };

  const points =
    typeof obj.points === 'string' ? Number(obj.points) : obj.points;
  if (typeof points !== 'number' || !Number.isFinite(points)) {
    return { ok: false, error: '"points" missing or not a number' };
  }
  if (typeof obj.reasoning !== 'string' || !obj.reasoning.trim()) {
    return { ok: false, error: '"reasoning" missing or empty' };
  }
  return {
    ok: true,
    points: clampToHalf(points, maxPoints),
    reasoning: firstSentences(obj.reasoning, 2),
  };
}

export function clampToHalf(points: number, maxPoints: number): number {
  const clamped = Math.min(Math.max(points, 0), maxPoints);
  return Math.round(clamped * 2) / 2;
}

export function firstSentences(text: string, n: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sentences = clean.match(/[^.!?;]+[.!?;]+(?=\s|$)|[^.!?;]+$/g) ?? [
    clean,
  ];
  return sentences
    .slice(0, n)
    .map((s) => s.trim())
    .join(' ');
}

// Models sometimes wrap JSON in ```json fences or add a stray sentence.
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end < start) throw new Error('no JSON object in reply');
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}
