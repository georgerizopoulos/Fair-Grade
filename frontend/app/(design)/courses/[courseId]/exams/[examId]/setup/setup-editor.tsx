"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, type ReactNode, useEffect, useRef, useState } from "react";
import {
  AppShell,
  Button,
  Card,
  IconButton,
  NoAccess,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";

// Exam setup (design: Upload.html). The instructor sets the exam details and
// the questions, model answers and rubric that every TA and the AI grade against.
//   GET   /exams/:id, /exams/:id/questions, /courses/:courseId
//   PATCH /exams/:id            name, date, pass mark
//   PUT   /exams/:id/questions  the whole question list
//   POST  /exams/:id/questions/import  PDF → draft questions (not saved yet)

// The backend has no PDF importer yet (it answers 503), so the button stays
// hidden until one exists. Build with NEXT_PUBLIC_PDF_IMPORT=on to show it.
const PDF_IMPORT = process.env.NEXT_PUBLIC_PDF_IMPORT === "on";

interface RubricPoint {
  text: string;
  points: number;
}

interface Question {
  code: string;
  title: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubric: RubricPoint[];
}

interface ExamDetail {
  id: string;
  name: string;
  heldAt: string | null;
  status: string;
  passMark: number;
  course: { id: string; code: string | null; name: string };
}

interface Progress {
  papers: number;
  drafts: number;
  submitted: number;
  aiGrading: number;
  aiGraded: number;
  aiFailed: number;
}

interface CourseDetail {
  members: { userId: string; role: string }[];
  exams: { id: string; progress: Progress }[];
}

type ExamStatus = "DRAFT" | "QUESTIONS_READY" | "OPEN" | "PUBLISHED";

const STATUS_INFO: Record<ExamStatus, { label: string; tone: "neutral" | "blue" | "amber" | "green" }> = {
  DRAFT: { label: "Draft: save the questions first", tone: "neutral" },
  QUESTIONS_READY: { label: "Questions ready", tone: "blue" },
  OPEN: { label: "Open for grading", tone: "amber" },
  PUBLISHED: { label: "Grades published", tone: "green" },
};

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
const RING = "0 0 0 1px rgba(var(--ink-rgb), 0.11)";
const LIFT =
  "0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)";

const field: CSSProperties = {
  width: "100%",
  height: "40px",
  padding: "0 12px",
  border: 0,
  borderRadius: "10px",
  background: "var(--surface)",
  boxShadow: RING,
  fontFamily: FONT,
  fontSize: "13.5px",
  color: "var(--text)",
};
const numberField: CSSProperties = { ...field, fontVariantNumeric: "tabular-nums" };
const textArea: CSSProperties = {
  ...field,
  height: "auto",
  padding: "12px 14px",
  borderRadius: "14px",
  fontSize: "14px",
  lineHeight: "1.6",
  resize: "vertical",
  display: "block",
};
const label: CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text)",
  marginBottom: "8px",
};

const sum = (xs: number[]) => xs.reduce((s, x) => s + x, 0);
const fmt = (n: number) => String(Math.round(n * 100) / 100);
const dateValue = (value: string | null) => (value ? value.slice(0, 10) : "");

// Strip ids/order so the editor state compares cleanly with what was saved.
function clean(questions: Question[]): Question[] {
  return questions.map(({ code, title, prompt, maxPoints, modelAnswer, rubric }) => ({
    code,
    title,
    prompt,
    maxPoints,
    modelAnswer,
    rubric: rubric.map(({ text, points }) => ({ text, points })),
  }));
}

function nextCode(questions: Question[]) {
  const used = new Set(questions.map((q) => q.code));
  let n = questions.length + 1;
  while (used.has(`Q${n}`)) n++;
  return `Q${n}`;
}

// What is wrong with a question, or null if it is ready to save.
function problemOf(q: Question): string | null {
  if (!q.title.trim()) return "Give it a title.";
  if (!q.prompt.trim()) return "Write the question.";
  if (!q.modelAnswer.trim()) return "Write the model answer.";
  if (!(q.maxPoints > 0)) return "Points must be more than 0.";
  if (q.rubric.length === 0) return "Add at least one rubric point.";
  if (q.rubric.some((p) => !p.text.trim())) return "Every rubric point needs a description.";
  if (q.rubric.some((p) => !(p.points >= 0))) return "Rubric points can't be negative.";
  if (Math.abs(sum(q.rubric.map((p) => p.points)) - q.maxPoints) > 0.001) {
    return `Rubric adds up to ${fmt(sum(q.rubric.map((p) => p.points)))}, not ${fmt(q.maxPoints)}.`;
  }
  return null;
}

const errorText = (cause: unknown, fallback: string) =>
  cause instanceof Error ? cause.message : fallback;

export function SetupEditor() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [savedQuestions, setSavedQuestions] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [heldAt, setHeldAt] = useState("");
  const [passMark, setPassMark] = useState("");
  const [loadError, setLoadError] = useState<ApiError | Error | null>(null);
  const [busy, setBusy] = useState<"" | "details" | "questions" | "import" | "status">("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [importedFrom, setImportedFrom] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch<ExamDetail>(`/exams/${examId}`),
      apiFetch<{ questions: Question[] }>(`/exams/${examId}/questions`),
      apiFetch<CourseDetail>(`/courses/${courseId}`),
    ])
      .then(([examData, questionData, courseData]) => {
        if (cancelled) return;
        setExam(examData);
        setName(examData.name);
        setHeldAt(dateValue(examData.heldAt));
        setPassMark(String(examData.passMark));
        setQuestions(clean(questionData.questions));
        setSavedQuestions(clean(questionData.questions));
        setCourse(courseData);
      })
      .catch((cause) => {
        if (!cancelled) setLoadError(cause instanceof Error ? cause : new Error("Could not load"));
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, examId]);

  const shellCourse = {
    id: courseId,
    code: exam?.course.code ?? exam?.course.name ?? "",
    name: exam?.course.name ?? "",
  };
  const shellExam = exam ? { id: exam.id, name: exam.name } : undefined;

  if (loadError) {
    const denied =
      loadError instanceof ApiError && (loadError.status === 403 || loadError.status === 404);
    return (
      <AppShell course={shellCourse} active="setup" access="instructor">
        {denied ? (
          <NoAccess />
        ) : (
          <Card padding="28px">
            <p style={{ margin: 0, fontSize: "14px", color: "var(--red)" }}>{loadError.message}</p>
          </Card>
        )}
      </AppShell>
    );
  }

  if (!exam || !course) {
    return (
      <AppShell course={shellCourse} exam={shellExam} active="setup" access="instructor">
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Loading the exam…</p>
      </AppShell>
    );
  }

  const progress = course.exams.find((e) => e.id === examId)?.progress;
  const taCount = course.members.filter((m) => m.role === "ta").length;
  const courseLabel = [exam.course.code, exam.course.name].filter(Boolean).join(" ");
  const total = sum(questions.map((q) => q.maxPoints || 0));
  const problems = questions.map(problemOf);
  const questionsValid = questions.length > 0 && problems.every((p) => p === null);
  const questionsDirty = JSON.stringify(questions) !== JSON.stringify(savedQuestions);
  const detailsDirty =
    name !== exam.name ||
    heldAt !== dateValue(exam.heldAt) ||
    Number(passMark) !== exam.passMark;
  const detailsValid = name.trim() !== "" && passMark !== "" && Number(passMark) >= 0;

  function editQuestion(index: number, patch: Partial<Question>) {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function editRubric(qi: number, ri: number, patch: Partial<RubricPoint>) {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qi
          ? { ...q, rubric: q.rubric.map((p, j) => (j === ri ? { ...p, ...patch } : p)) }
          : q,
      ),
    );
  }

  function moveQuestion(index: number, by: -1 | 1) {
    setQuestions((qs) => {
      const to = index + by;
      if (to < 0 || to >= qs.length) return qs;
      const next = [...qs];
      [next[index], next[to]] = [next[to], next[index]];
      return next;
    });
  }

  function addQuestion() {
    setQuestions((qs) => [
      ...qs,
      {
        code: nextCode(qs),
        title: "",
        prompt: "",
        maxPoints: 0,
        modelAnswer: "",
        rubric: [{ text: "", points: 0 }],
      },
    ]);
  }

  async function changeStatus(status: ExamStatus, message: string) {
    setBusy("status");
    setNotice(null);
    try {
      setExam(await apiFetch<ExamDetail>(`/exams/${examId}`, { method: "PATCH", body: { status } }));
      setNotice({ tone: "ok", text: message });
    } catch (cause) {
      setNotice({ tone: "error", text: errorText(cause, "Could not change the exam status.") });
    } finally {
      setBusy("");
    }
  }

  const statusInfo = STATUS_INFO[exam.status as ExamStatus] ?? STATUS_INFO.DRAFT;

  async function saveDetails() {
    setBusy("details");
    setNotice(null);
    try {
      const updated = await apiFetch<ExamDetail>(`/exams/${examId}`, {
        method: "PATCH",
        body: { name: name.trim(), heldAt: heldAt || null, passMark: Number(passMark) },
      });
      setExam(updated);
      setName(updated.name);
      setHeldAt(dateValue(updated.heldAt));
      setPassMark(String(updated.passMark));
      setNotice({ tone: "ok", text: "Exam details saved." });
    } catch (cause) {
      setNotice({ tone: "error", text: errorText(cause, "Could not save the exam details.") });
    } finally {
      setBusy("");
    }
  }

  async function saveQuestions() {
    setBusy("questions");
    setNotice(null);
    try {
      const saved = await apiFetch<{ questions: Question[] }>(`/exams/${examId}/questions`, {
        method: "PUT",
        body: { questions: clean(questions) },
      });
      setQuestions(clean(saved.questions));
      setSavedQuestions(clean(saved.questions));
      setExam(await apiFetch<ExamDetail>(`/exams/${examId}`));
      setImportedFrom("");
      setNotice({ tone: "ok", text: "Questions saved. TAs and the AI grade against these now." });
    } catch (cause) {
      setNotice({ tone: "error", text: errorText(cause, "Could not save the questions.") });
    } finally {
      setBusy("");
    }
  }

  async function importPdf(file: File) {
    setBusy("import");
    setNotice(null);
    try {
      const form = new FormData();
      form.set("file", file);
      const result = await apiFetch<{ questions: Question[] }>(
        `/exams/${examId}/questions/import`,
        { method: "POST", body: form },
      );
      setQuestions(clean(result.questions));
      setImportedFrom(file.name);
    } catch (cause) {
      setNotice({ tone: "error", text: errorText(cause, "Could not import the PDF.") });
    } finally {
      setBusy("");
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  return (
    <AppShell course={shellCourse} exam={shellExam} active="setup" access="instructor">
      <PageHeader
        crumbs={[
          { label: courseLabel, href: `/courses/${courseId}` },
          { label: exam.name },
          { label: "Setup" },
        ]}
      >
        <Pill tone={statusInfo.tone} dot>
          {statusInfo.label}
        </Pill>
        {exam.status === "QUESTIONS_READY" && (
          <Button
            icon={<CheckIcon />}
            disabled={busy !== "" || questionsDirty || !questionsValid}
            onClick={() =>
              changeStatus("OPEN", `${exam.name} is open. TAs of ${exam.course.code ?? "the course"} can add and grade papers.`)
            }
          >
            {busy === "status" ? "Opening…" : "Open for grading"}
          </Button>
        )}
        {exam.status === "OPEN" && (
          <SecondaryButton
            disabled={busy !== ""}
            onClick={() => changeStatus("PUBLISHED", `Grades of ${exam.name} are published. TAs can't add new papers.`)}
          >
            <span>{busy === "status" ? "Publishing…" : "Publish grades"}</span>
          </SecondaryButton>
        )}
        {exam.status === "PUBLISHED" && (
          <SecondaryButton
            disabled={busy !== ""}
            onClick={() => changeStatus("OPEN", `${exam.name} is open for grading again.`)}
          >
            <span>{busy === "status" ? "Reopening…" : "Reopen for grading"}</span>
          </SecondaryButton>
        )}
      </PageHeader>
      <PageTitle
        title={/\d/.test(exam.name) ? `Set up ${exam.name}` : `Set up the ${exam.name.toLowerCase()}`}
        description={
          <>
            Write the questions and model answers. That is the rubric every TA and the AI grade
            against.
          </>
        }
      />

      {notice && (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className="fg-in"
          style={{
            padding: "12px 16px",
            borderRadius: "14px",
            fontSize: "13.5px",
            background: notice.tone === "error" ? "var(--red-t)" : "var(--green-t)",
            color: notice.tone === "error" ? "var(--red-x)" : "var(--green-x)",
          }}
        >
          {notice.text}
        </div>
      )}

      <div
        className="fg-grid fg-side-cols fg-in fg-d1"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) 360px",
          gap: "28px",
          alignItems: "start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
          {/* 1. Exam details */}
          <Step n={1} done={!detailsDirty && detailsValid}>
            <Card padding="22px 24px">
              <StepHeading
                title="Exam details"
                description="Name, date and the pass mark out of the exam total."
              >
                <SecondaryButton
                  onClick={saveDetails}
                  disabled={!detailsDirty || !detailsValid || busy !== ""}
                >
                  <span>{busy === "details" ? "Saving…" : detailsDirty ? "Save" : "Saved"}</span>
                </SecondaryButton>
              </StepHeading>
              <div
                className="fg-grid"
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gridTemplateColumns: "minmax(0, 1fr) 170px 120px",
                  gap: "14px",
                }}
              >
                <div>
                  <label htmlFor="exam-name" style={label}>
                    Name
                  </label>
                  <input
                    id="exam-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={field}
                  />
                </div>
                <div>
                  <label htmlFor="exam-date" style={label}>
                    Date
                  </label>
                  <input
                    id="exam-date"
                    type="date"
                    value={heldAt}
                    onChange={(e) => setHeldAt(e.target.value)}
                    style={{ ...field, colorScheme: "light dark" }}
                  />
                </div>
                <div>
                  <label htmlFor="pass-mark" style={label}>
                    Pass mark
                  </label>
                  <input
                    id="pass-mark"
                    type="number"
                    min="0"
                    step="0.5"
                    value={passMark}
                    onChange={(e) => setPassMark(e.target.value)}
                    style={numberField}
                  />
                </div>
              </div>
            </Card>
          </Step>

          {/* 2. Questions, model answers, rubric */}
          <Step n={2} done={questionsValid && !questionsDirty}>
            <Card padding="26px">
              <StepHeading
                title="Questions and model answers"
                description={
                  questions.length === 0
                    ? PDF_IMPORT
                      ? "No questions yet. Import the solutions PDF or add them by hand."
                      : "No questions yet. Add each question with its model answer and rubric."
                    : `${questions.length} question${questions.length === 1 ? "" : "s"}, ${fmt(total)} points.`
                }
              />
              <div style={{ marginTop: "22px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: importedFrom ? "space-between" : "flex-end",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "16px",
                  }}
                >
                  {importedFrom && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "10px 14px 10px 10px",
                        borderRadius: "16px",
                        background: "rgba(var(--ink-rgb), 0.03)",
                      }}
                    >
                      <span
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "11px",
                          background: "var(--surface)",
                          boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--muted)",
                        }}
                      >
                        <FileIcon />
                      </span>
                      <span style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--ink)" }}>
                          {importedFrom}
                        </span>
                        <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                          {questions.length} questions found. Check them below, then save.
                        </span>
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {PDF_IMPORT && (
                      <>
                        <input
                          ref={fileInput}
                          type="file"
                          accept="application/pdf,.pdf"
                          hidden
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void importPdf(file);
                          }}
                        />
                        <SecondaryButton
                          icon={<UploadIcon />}
                          onClick={() => fileInput.current?.click()}
                          disabled={busy !== ""}
                        >
                          <span>{busy === "import" ? "Reading the PDF…" : "Import from PDF"}</span>
                        </SecondaryButton>
                      </>
                    )}
                    <SecondaryButton icon={<PlusIcon />} onClick={addQuestion}>
                      <span>Add question</span>
                    </SecondaryButton>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {questions.map((q, qi) => (
                    <QuestionCard
                      key={q.code}
                      question={q}
                      problem={problems[qi]}
                      first={qi === 0}
                      last={qi === questions.length - 1}
                      onChange={(patch) => editQuestion(qi, patch)}
                      onRubric={(ri, patch) => editRubric(qi, ri, patch)}
                      onMove={(by) => moveQuestion(qi, by)}
                      onRemove={() => setQuestions((qs) => qs.filter((_, i) => i !== qi))}
                    />
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "18px",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                    Total{" "}
                    <span
                      style={{
                        fontSize: "20px",
                        fontWeight: 500,
                        letterSpacing: "-0.04em",
                        color: "var(--ink)",
                        fontVariantNumeric: "tabular-nums",
                        lineHeight: 1,
                      }}
                    >
                      {fmt(total)}
                    </span>{" "}
                    points across {questions.length} question{questions.length === 1 ? "" : "s"}
                    {questionsDirty && (
                      <span style={{ marginLeft: "10px", color: "var(--amber-x)" }}>
                        · Unsaved changes
                      </span>
                    )}
                  </span>
                  <Button
                    icon={<CheckIcon />}
                    onClick={saveQuestions}
                    disabled={!questionsDirty || !questionsValid || busy !== ""}
                  >
                    {busy === "questions" ? "Saving…" : questionsDirty ? "Save questions" : "Saved"}
                  </Button>
                </div>
              </div>
            </Card>
          </Step>

          {/* 3. Who grades */}
          <Step n={3} done={taCount > 0} last>
            <Card padding="20px 24px">
              <StepHeading
                title="Who grades"
                description={
                  taCount === 0
                    ? `No TAs in ${exam.course.code ?? "this course"} yet. Add them before grading starts.`
                    : `All ${taCount} TA${taCount === 1 ? "" : "s"} of ${exam.course.code ?? "the course"}. Grades lock after submit.`
                }
              >
                <SecondaryButton href={`/courses/${courseId}/members`}>
                  <span>Edit</span>
                </SecondaryButton>
              </StepHeading>
            </Card>
          </Step>
        </div>

        <AiGradingPanel progress={progress} reportHref={`/courses/${courseId}/exams/${examId}/report`} />
      </div>
    </AppShell>
  );
}

// ---------------------------------------------------------------- pieces

// Left rail marker: green check when the step is done, its number otherwise.
function Step({
  n,
  done,
  last = false,
  children,
}: {
  n: number;
  done: boolean;
  last?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "32px minmax(0, 1fr)",
        gap: "18px",
        alignItems: "start",
      }}
    >
      <div style={{ position: "relative", height: "100%", paddingTop: "18px" }}>
        <span
          aria-label={done ? `Step ${n}, done` : `Step ${n}`}
          style={{
            width: "32px",
            height: "32px",
            borderRadius: "999px",
            background: done ? "var(--green)" : "var(--surface)",
            boxShadow: done ? "none" : RING,
            color: done ? "var(--surface)" : "var(--ink)",
            fontSize: "13px",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          {done ? <CheckIcon stroke="var(--surface)" width={2} /> : n}
        </span>
        {!last && (
          <span
            style={{
              position: "absolute",
              left: "15.5px",
              top: "58px",
              bottom: "-22px",
              width: "1px",
              background: "rgba(var(--ink-rgb), 0.11)",
            }}
          />
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

function StepHeading({
  title,
  description,
  children,
}: {
  title: string;
  description: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function QuestionCard({
  question: q,
  problem,
  first,
  last,
  onChange,
  onRubric,
  onMove,
  onRemove,
}: {
  question: Question;
  problem: string | null;
  first: boolean;
  last: boolean;
  onChange: (patch: Partial<Question>) => void;
  onRubric: (index: number, patch: Partial<RubricPoint>) => void;
  onMove: (by: -1 | 1) => void;
  onRemove: () => void;
}) {
  const rubricTotal = sum(q.rubric.map((p) => p.points || 0));
  const addsUp = Math.abs(rubricTotal - q.maxPoints) <= 0.001;
  const id = q.code.toLowerCase();

  return (
    <div
      style={{
        padding: "22px 24px",
        borderRadius: "20px",
        background: "var(--surface)",
        boxShadow: `${RING}, ${LIFT}`,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexGrow: 1, minWidth: 0 }}>
          <span
            style={{
              height: "28px",
              padding: "0 10px",
              borderRadius: "9px",
              background: "var(--ink)",
              color: "var(--surface)",
              fontSize: "13px",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              flexShrink: 0,
            }}
          >
            {q.code}
          </span>
          <input
            aria-label={`${q.code} title`}
            placeholder="Question title"
            value={q.title}
            onChange={(e) => onChange({ title: e.target.value })}
            style={{
              flexGrow: 1,
              minWidth: 0,
              height: "34px",
              padding: "0 8px",
              marginLeft: "-8px",
              border: 0,
              borderRadius: "8px",
              background: "transparent",
              fontFamily: FONT,
              fontSize: "15px",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "13px",
              color: "var(--muted)",
              marginRight: "6px",
            }}
          >
            Points
            <input
              aria-label={`${q.code} points`}
              type="number"
              min="0"
              step="0.5"
              value={q.maxPoints}
              onChange={(e) => onChange({ maxPoints: Number(e.target.value) })}
              style={{ ...numberField, width: "64px", height: "36px", padding: "0 10px", fontSize: "14px" }}
            />
          </span>
          {!first && (
            <IconButton label={`Move ${q.code} up`} onClick={() => onMove(-1)}>
              <ChevronIcon up />
            </IconButton>
          )}
          {!last && (
            <IconButton label={`Move ${q.code} down`} onClick={() => onMove(1)}>
              <ChevronIcon />
            </IconButton>
          )}
          <IconButton label={`Remove ${q.code}`} onClick={onRemove}>
            <TrashIcon />
          </IconButton>
        </div>
      </div>

      <div>
        <label htmlFor={`${id}-q`} style={label}>
          Question
        </label>
        <textarea
          id={`${id}-q`}
          rows={2}
          value={q.prompt}
          onChange={(e) => onChange({ prompt: e.target.value })}
          style={{ ...textArea, boxShadow: `${RING}, ${LIFT}` }}
        />
      </div>

      <div>
        <label htmlFor={`${id}-a`} style={label}>
          Model answer
        </label>
        <textarea
          id={`${id}-a`}
          rows={4}
          value={q.modelAnswer}
          onChange={(e) => onChange({ modelAnswer: e.target.value })}
          style={{ ...textArea, background: "var(--surface-2)" }}
        />
      </div>

      <div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
          }}
        >
          <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text)" }}>
            Rubric: points for each key idea
          </span>
          <span
            style={{
              fontSize: "12.5px",
              color: addsUp ? "var(--muted)" : "var(--red)",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            {addsUp ? `Adds up to ${fmt(rubricTotal)}` : `Adds up to ${fmt(rubricTotal)} of ${fmt(q.maxPoints)}`}
          </span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {q.rubric.map((point, ri) => (
            <div
              key={ri}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                gap: "10px",
                alignItems: "center",
              }}
            >
              <input
                aria-label={`${q.code} key point ${ri + 1}`}
                placeholder="What earns these points"
                value={point.text}
                onChange={(e) => onRubric(ri, { text: e.target.value })}
                style={field}
              />
              <input
                aria-label={`${q.code} key point ${ri + 1} points`}
                type="number"
                min="0"
                step="0.5"
                value={point.points}
                onChange={(e) => onRubric(ri, { points: Number(e.target.value) })}
                style={{ ...numberField, padding: "0 10px" }}
              />
              {q.rubric.length > 1 ? (
                <IconButton
                  label={`Remove key point ${ri + 1}`}
                  onClick={() => onChange({ rubric: q.rubric.filter((_, j) => j !== ri) })}
                >
                  <CrossIcon />
                </IconButton>
              ) : (
                <span />
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => onChange({ rubric: [...q.rubric, { text: "", points: 0 }] })}
          className="fg-press"
          style={{
            marginTop: "10px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "32px",
            padding: "0 12px 0 8px",
            border: 0,
            borderRadius: "999px",
            background: "transparent",
            color: "var(--muted)",
            fontFamily: FONT,
            fontSize: "13px",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          <PlusIcon /> Add key point
        </button>
      </div>

      {problem && (
        <p style={{ margin: 0, fontSize: "12.5px", color: "var(--red)" }}>{problem}</p>
      )}
    </div>
  );
}

function AiGradingPanel({ progress, reportHref }: { progress?: Progress; reportHref: string }) {
  const rows: { label: string; value: number; color: string }[] = [
    { label: "Papers submitted", value: progress?.submitted ?? 0, color: "var(--avatar-bg)" },
    { label: "AI graded", value: progress?.aiGraded ?? 0, color: "#7FD3A4" },
    { label: "Being graded now", value: progress?.aiGrading ?? 0, color: "#F3C977" },
  ];
  if (progress?.aiFailed) {
    rows.push({ label: "AI failed, retry needed", value: progress.aiFailed, color: "#F29A92" });
  }

  return (
    <div
      style={{
        position: "sticky",
        top: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        className="fg-dark"
        style={{
          background: "rgba(var(--surface-rgb), 0.06)",
          boxShadow: "0 0 0 1px rgba(var(--surface-rgb), 0.10)",
          borderRadius: "30px",
          padding: "7px",
        }}
      >
        <div
          style={{
            background:
              "radial-gradient(520px 260px at 90% 0%, #262C3D 0%, rgba(38, 44, 61, 0) 70%), var(--ink)",
            borderRadius: "23px",
            padding: "26px",
            boxShadow: `inset 0 1px 0 rgba(var(--surface-rgb), 0.08), ${LIFT}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "26px",
                padding: "0 10px",
                borderRadius: "999px",
                background: "rgba(var(--surface-rgb), 0.10)",
                color: "#E8EAEE",
                fontSize: "12.5px",
                fontWeight: 500,
                whiteSpace: "nowrap",
              }}
            >
              AI grading
            </span>
            <span style={{ fontSize: "12.5px", color: "#7FD3A4" }}>Automatic</span>
          </div>
          <h2
            style={{
              margin: "18px 0 6px",
              fontSize: "25px",
              fontWeight: 600,
              letterSpacing: "-0.035em",
              color: "var(--surface)",
              lineHeight: 1.15,
            }}
          >
            The AI grades each paper as soon as a TA submits it
          </h2>
          <p style={{ margin: "0 0 18px", fontSize: "14px", lineHeight: 1.6, color: "#A6ACB8" }}>
            Same questions, same model answers, same transcribed text. It never sees the TA&apos;s
            grade or the student&apos;s name.
          </p>
          {rows.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "10px 0",
                borderTop: i === 0 ? 0 : "1px solid rgba(var(--surface-rgb), 0.08)",
              }}
            >
              <span style={{ fontSize: "14px", color: "var(--avatar-bg)", flexGrow: 1 }}>
                {row.label}
              </span>
              <span style={{ fontSize: "14px", color: row.color, fontVariantNumeric: "tabular-nums" }}>
                {row.value}
              </span>
            </div>
          ))}
          <div style={{ marginTop: "20px" }}>
            <Link
              href={reportHref}
              className="fg-press"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "56px",
                padding: "7px 7px 7px 22px",
                borderRadius: "999px",
                background: "var(--surface)",
                color: "var(--ink)",
                textDecoration: "none",
                fontSize: "15.5px",
                fontWeight: 600,
              }}
            >
              <span>Open the report</span>
              <span
                className="fg-knob"
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "999px",
                  background: "var(--ink)",
                  color: "var(--surface)",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg {...svg(16)} stroke="var(--surface)" strokeWidth="1.8">
                  <path d="M7 17L17 7" />
                  <path d="M9 7h8v8" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
      <Card padding="16px 18px">
        <div style={{ display: "flex", gap: "12px" }}>
          <svg {...svg(18)} stroke="var(--muted)">
            <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
          </svg>
          <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: "var(--muted)" }}>
            Sent to the AI: question, model answer, rubric and the transcribed answer. Never sent:
            student IDs, names, TA grades.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- icons

function svg(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { flexShrink: 0, display: "block" },
  };
}

function CheckIcon({ stroke = "currentColor", width = 1.6 }: { stroke?: string; width?: number }) {
  return (
    <svg {...svg(16)} stroke={stroke} strokeWidth={width}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
const FileIcon = () => (
  <svg {...svg(18)}>
    <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
    <path d="M13.5 3.5V9H19" />
  </svg>
);
const UploadIcon = () => (
  <svg {...svg(16)}>
    <path d="M12 15.5V4.5" />
    <path d="M7.5 9l4.5-4.5L16.5 9" />
    <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
  </svg>
);
const PlusIcon = () => (
  <svg {...svg(16)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
const CrossIcon = () => (
  <svg {...svg(18)}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </svg>
);
const TrashIcon = () => (
  <svg {...svg(18)}>
    <path d="M4.5 7h15M9.5 7V5h5v2M6.5 7l1 12.5h9l1-12.5" />
  </svg>
);
const ChevronIcon = ({ up = false }: { up?: boolean }) => (
  <svg {...svg(18)}>
    <path d={up ? "M6.5 14.5L12 9l5.5 5.5" : "M6.5 9.5L12 15l5.5-5.5"} />
  </svg>
);
