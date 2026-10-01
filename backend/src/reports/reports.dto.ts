export interface MyStatsResponse {
  exam: {
    id: string;
    name: string;
    passMark: number;
  };
  course: {
    id: string;
    code: string | null;
    name: string;
    leaderboardVisibility: 'OFF' | 'ANONYMOUS' | 'NAMED';
  };
  counts: {
    total: number;
    submitted: number;
    aiGraded: number;
    pending: number;
    drafts: number;
  };
  summary: {
    taAverage: number | null;
    aiAverage: number | null;
    averageGap: number | null;
    exactMatches: number | null;
    withinHalfPoint: number | null;
    comparedPapers: number;
    medianTimePerPaperMs: number | null;
    largestGap: {
      gap: number;
      studentId: string;
      questionCode: string;
    } | null;
    flaggedQuestionCount: number | null;
  };
  paperComparisons: {
    paperId: string;
    studentId: string;
    status: 'AI_GRADED';
    submittedAt: Date | null;
    taTotal: number | null;
    aiTotal: number | null;
    gap: number | null;
  }[];
  questions: {
    questionId: string;
    code: string;
    title: string;
    maxPoints: number;
    sampleSize: number | null;
    taAverage: number | null;
    aiAverage: number | null;
    averageGap: number | null;
    flagged: boolean | null;
  }[];
  worthASecondLook: {
    paperId: string;
    studentId: string;
    questionCode: string;
    taPoints: number;
    aiPoints: number;
    gap: number;
    aiReasoning: string | null;
  }[];
  leaderboard?: {
    rank: number | null;
    label: string;
    averageGap: number | null;
    isYou: boolean;
  }[];
  badges?: { code: string; label: string }[];
}

export interface TaReportQuestionGap {
  questionId: string;
  code: string;
  title: string;
  maxPoints: number;
  sampleSize: number;
  taAverage: number | null;
  aiAverage: number | null;
  averageGap: number | null;
  threshold: number;
  flagged: boolean;
}

export interface TaReportFlaggedPaper {
  paperId: string;
  studentId: string;
  taPoints: number;
  aiPoints: number;
  gap: number;
  aiReasoning: string | null;
}

// One answer with a large TA vs AI gap, with the text both of them graded.
export interface TaReportAnswerGap extends TaReportFlaggedPaper {
  questionCode: string;
  maxPoints: number;
  transcription: string;
}

export interface TaReportPaper {
  paperId: string;
  studentId: string;
  questions: {
    questionId: string;
    code: string;
    maxPoints: number;
    taPoints: number | null;
    aiPoints: number | null;
  }[];
  taTotal: number | null;
  aiTotal: number | null;
  gap: number | null;
}

export interface TaDetailReportResponse {
  exam: { id: string; name: string; maxTotal: number };
  course: { id: string; code: string | null; name: string };
  ta: { id: string; name: string; email: string };
  papersGraded: number;
  taAverage: number | null;
  aiAverage: number | null;
  paperGap: number | null;
  flaggedQuestionCodes: string[];
  questions: TaReportQuestionGap[];
  flaggedPapers: Record<string, TaReportFlaggedPaper[]>;
  // The 3 largest single-answer gaps: on the most flagged question if any, else anywhere.
  largestGaps: TaReportAnswerGap[];
  papers: TaReportPaper[];
}

export interface ExamReportTaSummary {
  taId: string;
  taName: string;
  email: string;
  papersGraded: number;
  // Average |question gap| (kept for older clients).
  averageGap: number | null;
  taAverage: number | null; // average paper total
  aiAverage: number | null;
  paperGap: number | null; // average TA − AI per paper
  flagged: boolean;
  flaggedQuestionCodes: string[];
  questions: {
    code: string;
    averageGap: number | null;
    sampleSize: number;
    flagged: boolean;
  }[];
}

export interface ExamReportQuestion {
  questionId: string;
  code: string;
  title: string;
  maxPoints: number;
  threshold: number;
  tas: {
    taId: string;
    taName: string;
    averageGap: number | null;
    sampleSize: number;
    flagged: boolean;
  }[];
}

export interface ExamReportPaper {
  paperId: string;
  studentId: string;
  taId: string;
  taName: string;
  taTotal: number | null;
  aiTotal: number | null;
  gap: number | null;
  mostlyCode: string | null;
}

export interface ExamReportResponse {
  exam: { id: string; name: string; maxTotal: number };
  course: { id: string; code: string | null; name: string };
  totalPapers: number; // every paper, drafts included
  submittedPapers: number;
  aiGradedPapers: number;
  aiGradingPapers: number;
  aiFailedPapers: number;
  taAverage: number | null; // average paper total over AI-graded papers
  aiAverage: number | null;
  flaggedTaCount: number;
  // The most serious flag: the flagged TA with the largest paper gap, on their
  // most off question. Null when no TA is flagged.
  headline: {
    taId: string;
    taName: string;
    paperGap: number | null;
    papersGraded: number;
    questionCode: string;
    questionTitle: string;
    maxPoints: number;
    questionGap: number;
    threshold: number;
  } | null;
  questions: ExamReportQuestion[];
  tas: ExamReportTaSummary[]; // flagged first, then by |paper gap|
  papers: ExamReportPaper[]; // AI-graded papers, largest |gap| first
}
