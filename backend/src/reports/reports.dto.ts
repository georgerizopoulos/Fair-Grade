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
  papers: TaReportPaper[];
}

export interface ExamReportTaSummary {
  taId: string;
  taName: string;
  papersGraded: number;
  averageGap: number | null;
  flagged: boolean;
  flaggedQuestionCodes: string[];
}

export interface ExamReportResponse {
  exam: { id: string; name: string; maxTotal: number };
  course: { id: string; code: string | null; name: string };
  totalPapers: number;
  aiGradedPapers: number;
  tas: ExamReportTaSummary[];
}