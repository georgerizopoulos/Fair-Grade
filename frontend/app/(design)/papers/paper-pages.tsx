"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowRight, Check, ChevronLeft, FileUp, RotateCcw } from "lucide-react";
import {
  AppShell,
  NoAccess,
  Button,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";
import { apiFetch } from "@/lib/api";
import { useRequireRole, useSession } from "@/lib/auth";
import {
  loadShellContext,
  statusLabel,
  statusTone,
  uploadPaper,
  type MyPapersResponse,
  type PaperRecord,
  type ShellContext,
} from "./paper-client";

const fieldStyle: React.CSSProperties = {
  width: "100%",
  minHeight: "42px",
  padding: "10px 12px",
  border: "1px solid rgba(var(--ink-rgb), 0.12)",
  borderRadius: "12px",
  background: "var(--surface)",
  color: "var(--ink)",
  font: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "7px",
  fontSize: "13px",
  fontWeight: 600,
  color: "var(--text-2)",
};

function Alert({ children }: { children: string }) {
  return (
    <div role="alert" style={{ padding: "12px 14px", borderRadius: "12px", color: "var(--red-x)", background: "var(--red-t)", fontSize: "13px" }}>
      {children}
    </div>
  );
}

// While loading: a quiet line. If loading failed (no access, unknown exam or
// paper), the reason inside the normal layout instead of "Loading" forever.
function Pending({ error, text }: { error?: string; text: string }) {
  if (!error) {
    return <div className="px-8 py-10 text-sm" style={{ color: "var(--muted)" }}>{text}</div>;
  }
  return (
    <AppShell access="any">
      <NoAccess title="This page isn't available" message={error} />
    </AppShell>
  );
}

function ShellFrame({
  context,
  active,
  children,
}: {
  context: ShellContext;
  active: "my-papers" | "add-paper";
  children: React.ReactNode;
}) {
  return (
    <AppShell course={context.course} exam={context.exam} active={active} access="ta">
      {children}
    </AppShell>
  );
}

export function TaPapersLivePage() {
  const { user, loading: authLoading } = useRequireRole("ta");
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
  const [context, setContext] = useState<ShellContext | null>(null);
  const [data, setData] = useState<MyPapersResponse | null>(null);
  const [filter, setFilter] = useState<"all" | "drafts" | "submitted">("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role !== "ta") return;
    let cancelled = false;
    Promise.all([
      loadShellContext(courseId, examId),
      apiFetch<MyPapersResponse>(
        `/exams/${examId}/my-papers?filter=${filter}&q=${encodeURIComponent(search)}`,
      ),
    ])
      .then(([shell, papers]) => {
        if (cancelled) return;
        setContext(shell);
        setData(papers);
        setError("");
      })
      .catch((cause) => {
        if (!cancelled) setError(cause instanceof Error ? cause.message : "Could not load papers");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, examId, filter, search, user]);

  if (authLoading || !user || !context) {
    return <Pending error={error} text="Loading papers..." />;
  }

  const counts = data?.counts;
  return (
    <ShellFrame context={context} active="my-papers">
      <PageHeader crumbs={[{ label: context.course.code, href: `/courses/${courseId}` }, { label: context.exam.name }, { label: "My papers" }]} />
      <PageTitle
        title="My papers"
        description="Find drafts, continue grading, or compare submitted work with the AI."
      />
      <Card padding="22px">
        <SectionHeader title="Your papers" description="Search by student ID and filter by grading status.">
          <SecondaryButton href={`/courses/${courseId}/exams/${examId}/papers/new`} icon={<FileUp size={16} />}>Add paper</SecondaryButton>
        </SectionHeader>
        <div className="fg-reflow-grid" style={{ display: "grid", gridTemplateColumns: "minmax(200px, 1fr) auto", gap: "12px", marginBottom: "18px" }}>
          <input aria-label="Search student ID" placeholder="Search student ID" value={search} onChange={(event) => setSearch(event.target.value)} style={fieldStyle} />
          <div role="group" aria-label="Filter papers" style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
            {(["all", "drafts", "submitted"] as const).map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={filter === option}
                onClick={() => setFilter(option)}
                style={{ border: 0, cursor: "pointer", padding: "8px 12px", borderRadius: "999px", color: filter === option ? "var(--surface)" : "var(--ink)", background: filter === option ? "var(--ink)" : "rgba(var(--ink-rgb),0.06)", font: "inherit", fontSize: "13px" }}
              >
                {option[0].toUpperCase() + option.slice(1)}{counts ? ` (${option === "all" ? counts.all : option === "drafts" ? counts.drafts : counts.submitted})` : ""}
              </button>
            ))}
          </div>
        </div>
        {error && <Alert>{error}</Alert>}
        {loading && <p style={{ color: "var(--muted)", fontSize: "14px" }}>Loading papers...</p>}
        {!loading && !error && data?.papers.length === 0 && (
          <div style={{ padding: "38px 18px", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ color: "var(--ink)", fontWeight: 600 }}>No papers found</p>
            <p style={{ fontSize: "13px" }}>Add a PDF to start grading, or change the search and filter.</p>
          </div>
        )}
        {!loading && (data?.papers.length ?? 0) > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead><tr style={{ color: "var(--muted)", borderBottom: "1px solid rgba(var(--ink-rgb),0.08)" }}>
                <th style={{ padding: "10px" }}>Student</th><th style={{ padding: "10px" }}>Status</th><th style={{ padding: "10px" }}>TA total</th><th style={{ padding: "10px" }}>AI total</th><th style={{ padding: "10px" }}>Updated</th><th style={{ padding: "10px" }} />
              </tr></thead>
              <tbody>{data?.papers.map((paper) => (
                <tr key={paper.id} style={{ borderBottom: "1px solid rgba(var(--ink-rgb),0.06)" }}>
                  <td style={{ padding: "13px 10px", color: "var(--ink)", fontWeight: 600 }}>{paper.studentId}</td>
                  <td style={{ padding: "13px 10px" }}><Pill tone={statusTone(paper.status)} dot>{statusLabel(paper.status)}</Pill></td>
                  <td style={{ padding: "13px 10px", fontFamily: "var(--font-mono, monospace)" }}>{paper.taTotal ?? "-"}</td>
                  <td style={{ padding: "13px 10px", fontFamily: "var(--font-mono, monospace)" }}>{paper.aiTotal ?? "-"}</td>
                  <td style={{ padding: "13px 10px", color: "var(--muted)" }}>{new Date(paper.submittedAt ?? paper.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: "13px 10px", textAlign: "right" }}><SecondaryButton href={paper.status === "DRAFT" ? `/papers/${paper.id}/grade` : `/papers/${paper.id}`} icon={<ArrowRight size={15} />}>{paper.status === "DRAFT" ? "Continue" : "View"}</SecondaryButton></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </Card>
    </ShellFrame>
  );
}

export function AddPaperLivePage() {
  const { user, loading: authLoading } = useRequireRole("ta");
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
  const router = useRouter();
  const [context, setContext] = useState<ShellContext | null>(null);
  const [studentId, setStudentId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [paper, setPaper] = useState<PaperRecord | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [pollMessage, setPollMessage] = useState("");

  useEffect(() => {
    if (user?.role !== "ta") return;
    loadShellContext(courseId, examId).then(setContext).catch((cause) => setError(cause instanceof Error ? cause.message : "Could not load exam"));
  }, [courseId, examId, user]);

  useEffect(() => {
    if (!paper || !paper.pages.some((page) => page.status === "WAITING" || page.status === "READING")) return;
    const timer = window.setTimeout(async () => {
      try {
        const fresh = await apiFetch<PaperRecord>(`/papers/${paper.id}`);
        setPaper(fresh);
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Could not refresh page status");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [paper]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Choose a PDF to upload.");
      return;
    }
    if (file.type !== "application/pdf" || !file.name.toLowerCase().endsWith(".pdf")) {
      setError("The selected file must be a PDF.");
      return;
    }
    setUploading(true);
    setError("");
    try {
      const created = await uploadPaper(examId, studentId.trim(), file);
      setPaper(created);
      setPollMessage("Pages scanned and read. Review the transcription before you grade.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not upload paper");
    } finally {
      setUploading(false);
    }
  }

  async function rescan(index: number) {
    if (!paper) return;
    try {
      await apiFetch(`/papers/${paper.id}/pages/${index}/rescan`, { method: "POST" });
      const fresh = await apiFetch<PaperRecord>(`/papers/${paper.id}`);
      setPaper(fresh);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not rescan page");
    }
  }

  if (authLoading || !user || !context) {
    return <Pending error={error} text="Loading exam..." />;
  }

  return (
    <ShellFrame context={context} active="add-paper">
      <PageHeader crumbs={[{ label: context.course.code, href: `/courses/${courseId}` }, { label: context.exam.name, href: `/courses/${courseId}/exams/${examId}/papers` }, { label: "Add paper" }]} />
      <PageTitle title="Add a paper" description="Upload one student's paper PDF. The pages are scanned and the handwriting read, then you review and grade." />
      {error && <Alert>{error}</Alert>}
      {!paper ? (
        <Card padding="24px">
          <SectionHeader title="Paper details" description="PDF files up to 20 MiB are accepted." />
          <form onSubmit={submit} style={{ display: "grid", gap: "18px", maxWidth: "620px" }}>
            <label><span style={labelStyle}>Student ID</span><input required value={studentId} onChange={(event) => setStudentId(event.target.value)} placeholder="csd5151" style={fieldStyle} /></label>
            <label><span style={labelStyle}>PDF paper</span><input required type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0] ?? null)} style={fieldStyle} /></label>
            {file && <p style={{ margin: 0, fontSize: "13px", color: "var(--muted)" }}>{file.name} - {(file.size / 1024 / 1024).toFixed(1)} MiB</p>}
            <Button type="submit" disabled={uploading || !studentId.trim() || !file} icon={<FileUp size={16} />}>{uploading ? "Uploading..." : "Upload paper"}</Button>
          </form>
        </Card>
      ) : (
        <Card padding="24px">
          <SectionHeader title={`Paper ${paper.studentId}`} description={`${paper.pageCount} page${paper.pageCount === 1 ? "" : "s"} uploaded.`}>
            <Pill tone={statusTone(paper.status)} dot>{statusLabel(paper.status)}</Pill>
          </SectionHeader>
          {pollMessage && <p style={{ color: "var(--muted)", fontSize: "13px" }}>{pollMessage}</p>}
          <div style={{ display: "grid", gap: "8px", marginBottom: "20px" }}>
            {paper.pages.map((page) => (
              <div key={page.index} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "rgba(var(--ink-rgb),0.035)" }}>
                <span>Page {page.index + 1}</span><Pill tone={page.status === "READ" ? "green" : page.status === "UNREADABLE" ? "red" : "amber"}>{page.status.toLowerCase()}</Pill>
                <SecondaryButton onClick={() => rescan(page.index)} icon={<RotateCcw size={14} />}>Rescan</SecondaryButton>
              </div>
            ))}
          </div>
          <p style={{ color: "var(--muted)", fontSize: "13px" }}>The handwriting has been read. Review the transcription, check any highlighted words, and score each answer.</p>
          <Button onClick={() => router.push(`/papers/${paper.id}/grade`)} icon={<ArrowRight size={16} />}>Review and grade</Button>
        </Card>
      )}
    </ShellFrame>
  );
}

export function GradePaperLivePage() {
  const { user, loading: authLoading } = useRequireRole("ta");
  const { paperId } = useParams<{ paperId: string }>();
  const router = useRouter();
  const [paper, setPaper] = useState<PaperRecord | null>(null);
  const [context, setContext] = useState<ShellContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user || user.role !== "ta") return;
    let cancelled = false;
    apiFetch<PaperRecord>(`/papers/${paperId}`)
      .then((record) => {
        if (cancelled) return;
        setPaper(record);
        setContext({ course: record.course, exam: { id: record.exam.id, name: record.exam.name } });
      })
      .catch((cause) => !cancelled && setError(cause instanceof Error ? cause.message : "Could not load paper"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [paperId, user]);

  async function saveDraft() {
    if (!paper) return;
    setSaving(true);
    setError("");
    setMessage("");
    try {
      const updated = await apiFetch<PaperRecord>(`/papers/${paper.id}`, {
        method: "PATCH",
        body: {
          answers: paper.answers.map((answer) => ({
            questionId: answer.questionId,
            transcription: answer.transcription,
            taPoints: answer.taPoints,
          })),
        },
      });
      setPaper(updated);
      setMessage("Draft saved.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save draft");
    } finally {
      setSaving(false);
    }
  }

  async function submitPaper() {
    if (!paper) return;
    if (paper.answers.some((answer) => answer.taPoints == null)) {
      setError("Enter a score for every question before submitting.");
      return;
    }
    if (!window.confirm("Submit this paper? You will not be able to edit it unless it is reopened.")) return;
    setSaving(true);
    setError("");
    try {
      const saved = await apiFetch<PaperRecord>(`/papers/${paper.id}`, {
        method: "PATCH",
        body: {
          answers: paper.answers.map((answer) => ({
            questionId: answer.questionId,
            transcription: answer.transcription,
            taPoints: answer.taPoints,
          })),
        },
      });
      setPaper(saved);
      const submitted = await apiFetch<PaperRecord>(`/papers/${paper.id}/submit`, { method: "POST" });
      setPaper(submitted);
      router.push(`/papers/${paper.id}`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit paper");
    } finally {
      setSaving(false);
    }
  }

  function editAnswer(index: number, patch: Partial<PaperRecord["answers"][number]>) {
    setPaper((current) => current ? ({
      ...current,
      answers: current.answers.map((answer, i) => i === index ? { ...answer, ...patch } : answer),
      taTotal: current.answers.reduce((sum, answer, i) => {
        const points = i === index ? patch.taPoints ?? answer.taPoints : answer.taPoints;
        return sum + (points ?? 0);
      }, 0),
    }) : current);
  }

  if (authLoading || !user || loading || !context || !paper) {
    return <Pending error={loading ? undefined : error} text="Loading paper..." />;
  }

  const editable = paper.status === "DRAFT";
  return (
    <ShellFrame context={context} active="my-papers">
      <PageHeader crumbs={[{ label: context.course.code, href: `/courses/${context.course.id}` }, { label: context.exam.name, href: `/courses/${context.course.id}/exams/${context.exam.id}/papers` }, { label: "Grade paper" }]} />
      <PageTitle title={`Grade ${paper.studentId}`} description="Review the scanned transcription, fix any highlighted words, and score each answer from zero to the question maximum." />
      {error && <Alert>{error}</Alert>}{message && <Pill tone="green">{message}</Pill>}
      {!editable && <Alert>This paper is locked because it has been submitted.</Alert>}
      {paper.answers.length === 0 && <Card padding="22px"><p>No questions are set up for this exam yet.</p></Card>}
      {paper.answers.map((answer, index) => (
        <Card key={answer.questionId} padding="22px">
          <SectionHeader title={`${answer.code}: ${answer.title}`} description={`${answer.maxPoints} points maximum`} />
          <p style={{ whiteSpace: "pre-wrap", color: "var(--text-2)", lineHeight: 1.6 }}>{answer.prompt}</p>
          <div style={{ display: "grid", gap: "8px", marginTop: "14px" }}>
            {answer.rubricPoints.map((point) => <div key={point.text} style={{ display: "flex", justifyContent: "space-between", gap: "12px", fontSize: "13px", color: "var(--muted)" }}><span>{point.text}</span><span>{point.points} pts</span></div>)}
          </div>
          <label style={{ display: "block", marginTop: "18px" }}><span style={labelStyle}>Transcribed answer</span><textarea disabled={!editable} value={answer.transcription} onChange={(event) => editAnswer(index, { transcription: event.target.value })} rows={5} style={{ ...fieldStyle, resize: "vertical" }} /></label>
          {answer.uncertainWords.length > 0 && (
            <p style={{ margin: "8px 0 0", fontSize: "13px", color: "var(--amber-x, var(--muted))" }}>
              Words to check: {answer.uncertainWords.join(", ")}
            </p>
          )}
          <label style={{ display: "block", width: "180px", marginTop: "14px" }}><span style={labelStyle}>TA score</span><input disabled={!editable} type="number" min="0" max={answer.maxPoints} step="0.5" value={answer.taPoints ?? ""} onChange={(event) => editAnswer(index, { taPoints: event.target.value === "" ? null : Number(event.target.value) })} style={fieldStyle} /></label>
        </Card>
      ))}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
        <strong>Total: {paper.answers.reduce((sum, answer) => sum + (answer.taPoints ?? 0), 0)} / {paper.maxTotal}</strong>
        {editable && <div style={{ display: "flex", gap: "10px" }}><SecondaryButton onClick={saveDraft} disabled={saving}>Save draft</SecondaryButton><Button onClick={submitPaper} disabled={saving || paper.answers.some((answer) => answer.taPoints == null)} icon={<Check size={16} />}>{saving ? "Saving..." : "Submit for AI grading"}</Button></div>}
      </div>
    </ShellFrame>
  );
}

export function PaperResultLivePage() {
  const user = useSession();
  const { paperId } = useParams<{ paperId: string }>();
  const [paper, setPaper] = useState<PaperRecord | null>(null);
  const [context, setContext] = useState<ShellContext | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState("");
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    apiFetch<PaperRecord>(`/papers/${paperId}`)
      .then((record) => {
        if (cancelled) return;
        setPaper(record);
        setContext({ course: record.course, exam: { id: record.exam.id, name: record.exam.name } });
      })
      .catch((cause) => !cancelled && setActionError(cause instanceof Error ? cause.message : "Could not load paper"))
      .finally(() => !cancelled && setLoading(false));
    return () => { cancelled = true; };
  }, [paperId, user]);

  useEffect(() => {
    if (paper?.status !== "AI_GRADING") return;
    const timer = window.setTimeout(async () => {
      try {
        setPaper(await apiFetch<PaperRecord>(`/papers/${paper.id}`));
      } catch (cause) {
        setActionError(cause instanceof Error ? cause.message : "Could not refresh AI status");
      }
    }, 2500);
    return () => window.clearTimeout(timer);
  }, [paper]);

  async function action(path: string, confirmation?: string, body?: unknown) {
    if (!paper || working) return;
    if (confirmation && !window.confirm(confirmation)) return;
    setWorking(true);
    setActionError("");
    try {
      setPaper(await apiFetch<PaperRecord>(path, { method: "POST", body }));
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Action failed");
    } finally {
      setWorking(false);
    }
  }

  if (loading || !paper || !context) {
    return <Pending error={loading ? undefined : actionError} text="Loading paper..." />;
  }

  const submitted = ["AI_GRADING", "AI_GRADED", "AI_FAILED"].includes(paper.status);
  return (
    <AppShell course={context.course} exam={context.exam} active="my-papers" access="any">
      <PageHeader crumbs={[{ label: context.course.code, href: `/courses/${context.course.id}` }, { label: context.exam.name, href: `/courses/${context.course.id}/exams/${context.exam.id}/papers` }, { label: paper.studentId }]} />
      <PageTitle title={`Paper ${paper.studentId}`} description="Question-by-question comparison of the TA's scores and the independent AI assessment." />
      {actionError && <Alert>{actionError}</Alert>}
      <Card padding="20px"><div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}><Pill tone={statusTone(paper.status)} dot>{statusLabel(paper.status)}</Pill><span style={{ color: "var(--muted)", fontSize: "13px" }}>{paper.ta.name} - {paper.exam.name}</span>{paper.reopenRequested && <Pill tone="amber">Reopen requested</Pill>}{paper.aiError && <span style={{ color: "var(--red-x)", fontSize: "13px" }}>{paper.aiError}</span>}</div></Card>
      {user?.role === "instructor" && paper.reopenRequested && (
        <div role="status" style={{ padding: "18px 20px", borderRadius: "18px", background: "var(--amber-t)", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.05)", display: "flex", gap: "16px", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 320px", minWidth: 0 }}>
            <div style={{ fontSize: "14.5px", color: "var(--ink)", fontWeight: 600 }}>
              {paper.reopenRequest?.by?.name ?? paper.ta.name} asked you to reopen this paper
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "13.5px", lineHeight: 1.5, color: paper.reopenRequest?.reason ? "var(--text)" : "var(--muted)" }}>
              {paper.reopenRequest?.reason ? `“${paper.reopenRequest.reason}”` : "No note."}
            </p>
            {paper.status === "AI_GRADING" && <p style={{ margin: "6px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>The AI is still grading it; you can reopen it once it finishes.</p>}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <SecondaryButton onClick={() => action(`/papers/${paper.id}/decline-reopen`)} disabled={working}>Decline</SecondaryButton>
            <SecondaryButton onClick={() => action(`/papers/${paper.id}/reopen`)} disabled={working || paper.status === "AI_GRADING"} icon={<RotateCcw size={15} />}>Reopen</SecondaryButton>
          </div>
        </div>
      )}
      {paper.answers.map((answer) => (
        <Card key={answer.questionId} padding="22px">
          <SectionHeader title={`${answer.code}: ${answer.title}`} description={`${answer.maxPoints} points maximum`} />
          <p style={{ color: "var(--text-2)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{answer.transcription || "No transcription was saved."}</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "10px", marginTop: "18px" }}>
            <div><span style={labelStyle}>TA score</span><strong>{answer.taPoints ?? "Not graded"}</strong></div>
            <div><span style={labelStyle}>AI score</span><strong>{answer.aiPoints ?? (paper.status === "AI_GRADING" ? "Grading..." : "Not available")}</strong></div>
          </div>
          {answer.aiReasoning && <div style={{ marginTop: "16px", padding: "13px", borderRadius: "12px", background: "rgba(var(--blue-rgb),0.06)" }}><span style={labelStyle}>AI reasoning</span><p style={{ margin: 0, color: "var(--text-2)", lineHeight: 1.55 }}>{answer.aiReasoning}</p></div>}
        </Card>
      ))}
      {!submitted && paper.status === "DRAFT" && user?.role === "ta" && <SecondaryButton href={`/papers/${paper.id}/grade`} icon={<ChevronLeft size={15} />}>Continue grading</SecondaryButton>}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {user?.role === "ta" && submitted && !paper.reopenRequested && (
          <SecondaryButton
            onClick={() => {
              const reason = window.prompt("Ask the instructor to reopen this paper. What do you want to change? (optional)");
              if (reason !== null) void action(`/papers/${paper.id}/request-reopen`, undefined, reason.trim() ? { reason: reason.trim() } : {});
            }}
            disabled={working}
            icon={<RotateCcw size={15} />}
          >
            Request reopen
          </SecondaryButton>
        )}
        {user?.role === "ta" && paper.reopenRequested && (
          <span style={{ fontSize: "13px", color: "var(--muted)", alignSelf: "center" }}>
            You asked the instructor to reopen this paper. It becomes a draft again if they agree.
          </span>
        )}
        {user?.role === "instructor" && !paper.reopenRequested && ["AI_GRADED", "AI_FAILED"].includes(paper.status) && <SecondaryButton onClick={() => action(`/papers/${paper.id}/reopen`, `Reopen this paper so ${paper.ta.name} can regrade it?`)} disabled={working} icon={<RotateCcw size={15} />}>Reopen for the TA</SecondaryButton>}
        {paper.status === "AI_FAILED" && <Button onClick={() => action(`/papers/${paper.id}/retry-ai`)} disabled={working} icon={<ArrowRight size={16} />}>Retry AI grading</Button>}
      </div>
    </AppShell>
  );
}
