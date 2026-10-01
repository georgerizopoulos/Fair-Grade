import { apiFetch, TOKEN_KEY } from "@/lib/api";

export interface ShellContext {
  course: { id: string; code: string; name: string };
  exam: { id: string; name: string };
}

export interface CourseRecord {
  id: string;
  code: string | null;
  name: string;
  exams: { id: string; name: string }[];
}

export interface PaperPageRecord {
  index: number;
  status: "WAITING" | "READING" | "READ" | "UNREADABLE";
}

export interface PaperAnswerRecord {
  questionId: string;
  code: string;
  title: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubricPoints: { text: string; points: number }[];
  transcription: string;
  uncertainWords: string[];
  pages: number[];
  taPoints: number | null;
  aiPoints?: number | null;
  aiReasoning?: string | null;
}

export interface PaperRecord {
  id: string;
  studentId: string;
  status: "TRANSCRIBING" | "DRAFT" | "AI_GRADING" | "AI_GRADED" | "AI_FAILED";
  reopenRequested: boolean;
  pageCount: number;
  pages: PaperPageRecord[];
  answers: PaperAnswerRecord[];
  course: { id: string; code: string; name: string };
  exam: { id: string; name: string; passMark: number };
  ta: { id: string; name: string; isYou: boolean };
  maxTotal: number;
  taTotal?: number | null;
  aiTotal?: number | null;
  gap?: number | null;
  aiGradedAt?: string | null;
  aiError?: string | null;
}

export interface MyPapersRecord {
  id: string;
  studentId: string;
  status: PaperRecord["status"];
  createdAt: string;
  submittedAt: string | null;
  reopenRequested: boolean;
  taTotal: number | null;
  aiTotal: number | null;
  gap: number | null;
}

export interface MyPapersResponse {
  examId: string;
  counts: {
    all: number;
    drafts: number;
    submitted: number;
    aiGrading: number;
    aiGraded: number;
    aiFailed: number;
  };
  papers: MyPapersRecord[];
}

export async function loadShellContext(
  courseId: string,
  examId: string,
): Promise<ShellContext> {
  const course = await apiFetch<CourseRecord>(`/courses/${courseId}`);
  const exam = course.exams.find((item) => item.id === examId);
  if (!exam) throw new Error("This exam was not found in the selected course.");
  return {
    course: {
      id: course.id,
      code: course.code ?? course.name,
      name: course.name,
    },
    exam: { id: exam.id, name: exam.name },
  };
}

export async function uploadPaper(
  examId: string,
  studentId: string,
  file: File,
): Promise<PaperRecord> {
  const form = new FormData();
  form.set("studentId", studentId);
  form.set("file", file);

  const token = localStorage.getItem(TOKEN_KEY);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"}/exams/${examId}/papers`,
    {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    },
  );
  const result = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.assign("/login");
    }
    throw new Error(result?.error?.message ?? `Upload failed (${response.status})`);
  }

  return result as PaperRecord;
}

export function statusTone(status: PaperRecord["status"]) {
  if (status === "AI_GRADED") return "green" as const;
  if (status === "AI_FAILED") return "red" as const;
  if (status === "AI_GRADING" || status === "TRANSCRIBING") return "amber" as const;
  return "neutral" as const;
}

export function statusLabel(status: PaperRecord["status"]) {
  return status.toLowerCase().replaceAll("_", " ");
}
