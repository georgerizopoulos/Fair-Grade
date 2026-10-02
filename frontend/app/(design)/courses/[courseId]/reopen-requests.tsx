"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { RotateCcw, X } from "lucide-react";
import { Avatar, Card, MONO, Notice, Pill, SecondaryButton, SectionHeader } from "@/components/shell";
import { apiFetch } from "@/lib/api";

// Papers a TA asked to reopen (instructor, course page).
//   GET  /courses/:id/reopen-requests
//   POST /papers/:id/reopen, /papers/:id/decline-reopen

interface ReopenRequest {
  paperId: string;
  studentId: string;
  status: string;
  ta: { id: string; name: string };
  exam: { id: string; name: string };
  requestedAt: string | null;
  reason: string | null;
  taTotal: number | null;
  aiTotal: number | null;
  gap: number | null;
  maxTotal: number;
}

const pts = (x: number | null) => (x == null ? "—" : String(Math.round(x * 100) / 100));

function when(iso: string | null) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const hm = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today ${hm}`;
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]} ${hm}`;
}

export function ReopenRequestsCard({
  courseId,
  count,
  onChange,
}: {
  courseId: string;
  count: number; // from GET /courses/:id; refetches when it changes
  onChange: () => void;
}) {
  const [requests, setRequests] = useState<ReopenRequest[] | null>(null);
  const [busy, setBusy] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<{ requests: ReopenRequest[] }>(`/courses/${courseId}/reopen-requests`)
      .then((r) => !cancelled && setRequests(r.requests))
      .catch(() => !cancelled && setRequests([]));
    return () => {
      cancelled = true;
    };
  }, [courseId, count]);

  async function act(r: ReopenRequest, kind: "reopen" | "decline-reopen") {
    setBusy(`${kind}-${r.paperId}`);
    setNotice(null);
    try {
      await apiFetch(`/papers/${r.paperId}/${kind}`, { method: "POST" });
      setNotice({
        tone: "ok",
        text:
          kind === "reopen"
            ? `${r.studentId} is back to a draft for ${r.ta.name}. The AI grades it again when they resubmit.`
            : `Declined. ${r.studentId} stays as ${r.ta.name} submitted it.`,
      });
      onChange();
    } catch (e) {
      setNotice({ tone: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setBusy("");
    }
  }

  if (!requests || (requests.length === 0 && !notice)) return null;

  return (
    <Card className="fg-in" padding="24px">
      <SectionHeader
        title={
          <span style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
            Reopen requests
            {requests.length > 0 && <Pill tone="amber">{requests.length}</Pill>}
          </span>
        }
        description="TAs asked to change a paper they already submitted. Reopen it to make it a draft again, or decline to keep their grade."
      />
      {notice && (
        <div style={{ marginTop: "14px" }}>
          <Notice tone={notice.tone}>{notice.text}</Notice>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "16px" }}>
        {requests.map((r) => {
          const grading = r.status === "AI_GRADING";
          return (
            <div
              key={r.paperId}
              style={{
                display: "flex",
                gap: "14px",
                alignItems: "flex-start",
                flexWrap: "wrap",
                padding: "14px 16px",
                borderRadius: "16px",
                background: "var(--amber-t)",
                boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.05)",
              }}
            >
              <Avatar initial={r.ta.name.charAt(0)} size={34} />
              <div style={{ flex: "1 1 320px", minWidth: 0 }}>
                <div style={{ fontSize: "14px", color: "var(--text)", lineHeight: 1.45 }}>
                  <b style={{ fontWeight: 600, color: "var(--ink)" }}>{r.ta.name}</b> asks to reopen{" "}
                  <Link
                    href={`/papers/${r.paperId}`}
                    style={{ fontFamily: MONO, fontSize: "13px", color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: "3px" }}
                  >
                    {r.studentId}
                  </Link>{" "}
                  in {r.exam.name}
                </div>
                {r.reason ? (
                  <p style={{ margin: "6px 0 0", fontSize: "13.5px", lineHeight: 1.5, color: "var(--text)" }}>
                    &ldquo;{r.reason}&rdquo;
                  </p>
                ) : (
                  <p style={{ margin: "6px 0 0", fontSize: "13px", color: "var(--muted)" }}>No note.</p>
                )}
                <div style={{ marginTop: "8px", display: "flex", gap: "14px", flexWrap: "wrap", fontSize: "12.5px", color: "var(--muted)" }}>
                  <span>{when(r.requestedAt)}</span>
                  <span style={{ fontVariantNumeric: "tabular-nums" }}>
                    TA {pts(r.taTotal)} / {pts(r.maxTotal)}
                    {r.aiTotal != null && (
                      <>
                        {" · "}
                        <span style={{ color: "var(--blue-x)" }}>
                          AI {pts(r.aiTotal)} / {pts(r.maxTotal)}
                        </span>
                      </>
                    )}
                  </span>
                  {grading && <span>The AI is still grading it; reopen once it finishes.</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <SecondaryButton
                  onClick={() => act(r, "decline-reopen")}
                  disabled={busy !== ""}
                  icon={<X size={15} />}
                >
                  {busy === `decline-reopen-${r.paperId}` ? "Declining…" : "Decline"}
                </SecondaryButton>
                <SecondaryButton
                  onClick={() => act(r, "reopen")}
                  disabled={busy !== "" || grading}
                  icon={<RotateCcw size={15} />}
                >
                  {busy === `reopen-${r.paperId}` ? "Reopening…" : "Reopen"}
                </SecondaryButton>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
