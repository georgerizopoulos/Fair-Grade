// Parses + validates ONE LLM reply against the rubric. No LLM, no retries,
// no DB — it just judges a single reply: good (clean scores) or bad (why).

// One validated score, ready to become an ai_grades row (minus answerId,
// which the service stamps on).
export interface ValidatedScore {
  criterionId: string;
  points: number;
  reasoning: string;
}

// What the validator needs to know about each criterion to check the rules.
export interface SchemaCriterion {
  id: string;
  maxPoints: number;
}

export type ParseResult =
  | { ok: true; scores: ValidatedScore[] }
  | { ok: false; error: string };

/**
 * Pull a JSON object out of raw model text. Models sometimes wrap JSON in
 * ```json fences or add a stray sentence, so if a direct parse fails we fall
 * back to the substring between the first { and the last }.
 */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');
    if (start === -1 || end === -1 || end < start) {
      throw new Error('no JSON object found in reply');
    }
    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

/**
 * Validate a raw LLM reply against the rubric's criteria.
 * Checks shape first, then the business rules the model can't be trusted on.
 */
export function parseAndValidate(
  rawText: string,
  criteria: SchemaCriterion[],
): ParseResult {
  // 1. Parse
  let parsed: unknown;
  try {
    parsed = extractJson(rawText);
  } catch (e) {
    return { ok: false, error: `invalid JSON: ${(e as Error).message}` };
  }

  // 2. Shape: { scores: [...] }
  const scoresRaw = (parsed as { scores?: unknown })?.scores;
  if (!Array.isArray(scoresRaw)) {
    return { ok: false, error: 'reply has no "scores" array' };
  }

  // 3. Each entry has the right fields and types
  const scores: ValidatedScore[] = [];
  for (const [i, entry] of scoresRaw.entries()) {
    const e = entry as Record<string, unknown>;
    if (typeof e?.criterionId !== 'string') {
      return { ok: false, error: `scores[${i}].criterionId missing or not a string` };
    }
    if (typeof e?.points !== 'number' || Number.isNaN(e.points)) {
      return { ok: false, error: `scores[${i}].points missing or not a number` };
    }
    if (typeof e?.reasoning !== 'string' || e.reasoning.trim() === '') {
      return { ok: false, error: `scores[${i}].reasoning missing or empty` };
    }
    scores.push({
      criterionId: e.criterionId,
      points: e.points,
      reasoning: e.reasoning.trim(),
    });
  }

  // 4. Business rules the model can't be trusted on.
  const byId = new Map(criteria.map((c) => [c.id, c]));
  const seen = new Set<string>();
  for (const s of scores) {
    const criterion = byId.get(s.criterionId);
    if (!criterion) {
      return { ok: false, error: `unknown criterionId "${s.criterionId}"` };
    }
    if (seen.has(s.criterionId)) {
      return { ok: false, error: `criterionId "${s.criterionId}" graded twice` };
    }
    seen.add(s.criterionId);
    if (s.points < 0 || s.points > criterion.maxPoints) {
      return {
        ok: false,
        error: `points ${s.points} out of range 0..${criterion.maxPoints} for criterion "${s.criterionId}"`,
      };
    }
  }

  // 5. Every criterion must be graded exactly once (none missing).
  if (seen.size !== criteria.length) {
    const missing = criteria.filter((c) => !seen.has(c.id)).map((c) => c.id);
    return { ok: false, error: `criteria not graded: ${missing.join(', ')}` };
  }

  return { ok: true, scores };
}
