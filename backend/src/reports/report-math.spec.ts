import {
  largestAnswerGaps,
  median,
  paperGap,
  questionGap,
  taSummary,
  threshold,
  type MathPaper,
  type MathQuestion,
} from './report-math.js';

const Q: MathQuestion[] = [
  { id: 'q1', code: 'Q1', title: 'Handshake', maxPoints: 4 },
  { id: 'q2', code: 'Q2', title: 'TCP and UDP', maxPoints: 3 },
];

// [taQ1, aiQ1, taQ2, aiQ2]
function paper(id: string, p: [number, number, number, number]): MathPaper {
  return {
    id,
    studentId: `csd-${id}`,
    answers: [
      { questionId: 'q1', taPoints: p[0], aiPoints: p[1] },
      { questionId: 'q2', taPoints: p[2], aiPoints: p[3] },
    ],
  };
}

describe('report math', () => {
  it('threshold is 15% of the question points', () => {
    expect(threshold(3)).toBe(0.45);
    expect(threshold(4)).toBe(0.6);
  });

  it('flags a question when |average gap| is over the threshold with at least 3 papers', () => {
    const answers = [-1, -1, -1.15].map((g) => ({
      questionId: 'q2',
      taPoints: 2 + g,
      aiPoints: 2,
    }));
    const gap = questionGap(Q[1], answers);
    expect(gap).toMatchObject({
      sampleSize: 3,
      averageGap: -1.05,
      threshold: 0.45,
      flagged: true,
    });
  });

  it('does not flag with fewer than 3 papers, or at the threshold exactly', () => {
    const two = [-2, -2].map((g) => ({
      questionId: 'q2',
      taPoints: 3 + g,
      aiPoints: 3,
    }));
    expect(questionGap(Q[1], two).flagged).toBe(false);
    const atLimit = [-0.5, -0.5, -0.35].map((g) => ({
      questionId: 'q2',
      taPoints: 2 + g,
      aiPoints: 2,
    }));
    expect(questionGap(Q[1], atLimit)).toMatchObject({
      averageGap: -0.45,
      flagged: false,
    });
  });

  it('ignores answers without both grades', () => {
    const gap = questionGap(Q[0], [
      { questionId: 'q1', taPoints: 3, aiPoints: null },
      { questionId: 'q1', taPoints: 2, aiPoints: 3 },
    ]);
    expect(gap).toMatchObject({ sampleSize: 1, averageGap: -1 });
  });

  it('paper totals, gap and the question that explains most of it', () => {
    expect(paperGap(paper('a', [3, 3.5, 1, 2.5]), Q)).toEqual({
      paperId: 'a',
      studentId: 'csd-a',
      taTotal: 4,
      aiTotal: 6,
      gap: -2,
      mostlyCode: 'Q2',
    });
  });

  it('a paper total is null until every question is graded', () => {
    const p: MathPaper = {
      id: 'x',
      studentId: 's',
      answers: [{ questionId: 'q1', taPoints: 2, aiPoints: 2 }],
    };
    expect(paperGap(p, Q)).toMatchObject({
      taTotal: null,
      aiTotal: null,
      gap: null,
      mostlyCode: null,
    });
  });

  it('summarises a TA: averages, paper gap, mean |paper gap| and flags', () => {
    const s = taSummary(
      [
        paper('a', [4, 4, 1, 2]),
        paper('b', [3, 3, 1, 2.5]),
        paper('c', [2, 2.5, 2, 2.5]),
      ],
      Q,
    );
    expect(s).toMatchObject({
      papers: 3,
      taAverage: 4.33,
      aiAverage: 5.5,
      paperGap: -1.17,
      meanAbsPaperGap: 1.17,
      flaggedQuestionCodes: ['Q2'],
    });
    expect(s.questions[1]).toMatchObject({ averageGap: -1, flagged: true });
  });

  it('largest single-answer gaps, optionally on one question, keeping answer fields', () => {
    const papers = [
      {
        ...paper('a', [4, 2, 1, 2]),
        answers: [{ questionId: 'q1', taPoints: 4, aiPoints: 2, note: 'x' }],
      },
      paper('b', [3, 3, 0, 2.5]),
    ];
    const all = largestAnswerGaps(papers, Q, 2);
    expect(all.map((x) => [x.paper.id, x.questionCode, x.gap])).toEqual([
      ['b', 'Q2', -2.5],
      ['a', 'Q1', 2],
    ]);
    expect(
      largestAnswerGaps(papers, Q, 5, 'q1').map((x) => x.paper.id),
    ).toEqual(['a']);
  });

  it('median', () => {
    expect(median([])).toBeNull();
    expect(median([3, 1, 2])).toBe(2);
    expect(median([4, 1, 2, 3])).toBe(2.5);
  });
});
