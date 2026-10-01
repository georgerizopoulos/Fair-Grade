export type AiGrade = { points: number; reasoning: string };
export type TaGrade = { taId: string; taName: string; points: number };

export type ResultCriterion = {
	criterionId: string;
	position: number;
	description: string;
	maxPoints: number;
	aiGrade: AiGrade | null;
	taGrades: TaGrade[];
};

export type ResultAnswer = {
	answerId: string;
	studentIdAnon: string;
	answerText: string;
	criteria: ResultCriterion[];
};

export type ResultsResponse = {
	rubricId: string;
	aiGraded: boolean;
	answers: ResultAnswer[];
};

export type DeviationExample = {
	answerId: string;
	studentIdAnon: string;
	answerText: string;
	taPoints: number;
	aiPoints: number;
	deviation: number;
	aiReasoning: string;
};

export type DeviationCriterion = {
	criterionId: string;
	position: number;
	description: string;
	maxPoints: number;
	sampleSize: number;
	avgDeviation: number | null;
	direction: "stricter" | "lenient" | "aligned";
	flagged: boolean;
	examples: DeviationExample[];
};

export type TaSummary = {
	taId: string;
	taName: string;
	answersGraded: number;
	overallDeviation: number;
	flagged: boolean;
	flaggedCriteriaCount: number;
	criteria: DeviationCriterion[];
};

export type DeviationResponse = {
	rubricId: string;
	aiGraded: boolean;
	thresholds: { flagRatio: number; minSamples: number };
	taSummaries: TaSummary[];
};

export const mockRubric = {
	id: "rubric-uuid",
	courseName: "HY335 - Computer Networks",
	questionText: "Explain how the TCP three-way handshake works.",
};

const criteria = [
	["criterion-uuid-1", 1, "Correctly names all 3 steps in order (SYN, SYN-ACK, ACK)", 3],
	["criterion-uuid-2", 2, "Explains what sequence numbers are used for in the handshake", 3],
	["criterion-uuid-3", 3, "States why a handshake is needed before data transfer (reliability/sync)", 2],
	["criterion-uuid-4", 4, "Answer is clearly organized and easy to follow", 2],
] as const;

const criterion = (index: number, values: Partial<DeviationCriterion> = {}): DeviationCriterion => {
	const [criterionId, position, description, maxPoints] = criteria[index];
	return {
		criterionId,
		position,
		description,
		maxPoints,
		sampleSize: 6,
		avgDeviation: 0,
		direction: "aligned",
		flagged: false,
		examples: [],
		...values,
	};
};

export const mockDeviation: DeviationResponse = {
	rubricId: mockRubric.id,
	aiGraded: true,
	thresholds: { flagRatio: 0.15, minSamples: 3 },
	taSummaries: [
		{
			taId: "ta-maria-uuid",
			taName: "Maria Papadaki",
			answersGraded: 6,
			overallDeviation: 0.44,
			flagged: true,
			flaggedCriteriaCount: 1,
			criteria: [
				criterion(0, { avgDeviation: 0.08, direction: "lenient" }),
				criterion(1, { avgDeviation: 0.17, direction: "lenient" }),
				criterion(2, { avgDeviation: -0.08, direction: "stricter" }),
				criterion(3, {
					avgDeviation: -1.42,
					direction: "stricter",
					flagged: true,
					examples: [
						{ answerId: "answer-uuid-4", studentIdAnon: "student_004", answerText: "SYN, then SYN-ACK, then ACK. Sequence numbers let both sides track bytes...", taPoints: 0, aiPoints: 2, deviation: -2, aiReasoning: "Short, ordered, and each step is explained in turn." },
						{ answerId: "answer-uuid-9", studentIdAnon: "student_009", answerText: "First the client sends SYN. The server answers SYN-ACK...", taPoints: 0, aiPoints: 2, deviation: -2, aiReasoning: "Clear step-by-step structure with one idea per sentence." },
						{ answerId: "answer-uuid-13", studentIdAnon: "student_013", answerText: "The handshake has three messages...", taPoints: 0.5, aiPoints: 2, deviation: -1.5, aiReasoning: "Logically ordered and easy to follow." },
					],
				}),
			],
		},
		{
			taId: "ta-nikos-uuid",
			taName: "Nikos Georgiou",
			answersGraded: 6,
			overallDeviation: 0.15,
			flagged: false,
			flaggedCriteriaCount: 0,
			criteria: [criterion(0), criterion(1, { avgDeviation: -0.17, direction: "stricter" }), criterion(2, { avgDeviation: -0.17, direction: "stricter" }), criterion(3, { avgDeviation: 0.25, direction: "lenient" })],
		},
	],
};

const resultCriterion = (index: number, points: number, taPoints: number): ResultCriterion => {
	const [criterionId, position, description, maxPoints] = criteria[index];
	return {
		criterionId,
		position,
		description,
		maxPoints,
		aiGrade: { points, reasoning: "The answer addresses this criterion clearly." },
		taGrades: [{ taId: "ta-maria-uuid", taName: "Maria Papadaki", points: taPoints }],
	};
};

export const mockResults: ResultsResponse = {
	rubricId: mockRubric.id,
	aiGraded: true,
	answers: [
		{ answerId: "answer-uuid-4", studentIdAnon: "student_004", answerText: "SYN, then SYN-ACK, then ACK. Sequence numbers let both sides track bytes...", criteria: [resultCriterion(0, 3, 3), resultCriterion(1, 2, 2), resultCriterion(2, 2, 2), resultCriterion(3, 2, 0)] },
		{ answerId: "answer-uuid-9", studentIdAnon: "student_009", answerText: "First the client sends SYN. The server answers SYN-ACK...", criteria: [resultCriterion(0, 3, 3), resultCriterion(1, 3, 3), resultCriterion(2, 2, 2), resultCriterion(3, 2, 0)] },
	],
};

export const mockRubrics = [{ ...mockRubric, aiGraded: true, createdAt: "2026-10-01T09:05:00Z" }];
