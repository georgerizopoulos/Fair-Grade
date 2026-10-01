import { clampToHalf, firstSentences, parseGradeReply } from './grade-reply.js';

describe('parseGradeReply', () => {
  it('reads a clean reply', () => {
    expect(
      parseGradeReply(
        '{"questionCode":"Q2","points":2,"reasoning":"Good."}',
        3,
      ),
    ).toEqual({
      ok: true,
      points: 2,
      reasoning: 'Good.',
    });
  });

  it('finds JSON inside fences or chatter', () => {
    const r = parseGradeReply(
      'Sure!\n```json\n{"points": 1.5, "reasoning": "Partly."}\n```',
      3,
    );
    expect(r).toEqual({ ok: true, points: 1.5, reasoning: 'Partly.' });
  });

  it('clamps to 0…max and rounds to 0.5', () => {
    expect(
      parseGradeReply('{"points": 7, "reasoning": "x."}', 3),
    ).toMatchObject({ points: 3 });
    expect(
      parseGradeReply('{"points": -1, "reasoning": "x."}', 3),
    ).toMatchObject({ points: 0 });
    expect(
      parseGradeReply('{"points": 1.3, "reasoning": "x."}', 3),
    ).toMatchObject({ points: 1.5 });
    expect(
      parseGradeReply('{"points": "2", "reasoning": "x."}', 3),
    ).toMatchObject({ points: 2 });
  });

  it('keeps at most two sentences of reasoning', () => {
    const r = parseGradeReply(
      '{"points": 1, "reasoning": "First one. Second one! Third one? Fourth."}',
      3,
    );
    expect(r).toMatchObject({ reasoning: 'First one. Second one!' });
  });

  it('rejects junk', () => {
    expect(parseGradeReply('no json here', 3).ok).toBe(false);
    expect(parseGradeReply('{"points": "lots", "reasoning": "x"}', 3).ok).toBe(
      false,
    );
    expect(parseGradeReply('{"points": 1, "reasoning": "  "}', 3).ok).toBe(
      false,
    );
  });
});

describe('helpers', () => {
  it('clampToHalf', () => {
    expect(clampToHalf(2.74, 4)).toBe(2.5);
    expect(clampToHalf(2.76, 4)).toBe(3);
  });
  it('firstSentences keeps text without a final period', () => {
    expect(firstSentences('No period at the end', 2)).toBe(
      'No period at the end',
    );
  });
});
