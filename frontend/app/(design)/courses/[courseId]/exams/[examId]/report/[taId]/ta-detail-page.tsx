"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, useEffect, useState } from "react";
import {
  AppShell,
  Card,
  NoAccess,
  Notice,
  PageHeader,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";
import {
  FlagAvatar,
  MONO_ID,
  TABLE_FRAME,
  TableHead,
  gapColor,
  initial,
  pts,
  rowStyle,
  signed,
  svg,
} from "../report-ui";

// One TA against the AI (design: TADetail.html), from GET /exams/:id/report/tas/:taId.

interface QuestionGap {
  questionId: string;
  code: string;
  title: string;
  maxPoints: number;
  sampleSize: number;
  averageGap: number | null;
  threshold: number;
  flagged: boolean;
}

interface AnswerGap {
  paperId: string;
  studentId: string;
  questionCode: string;
  maxPoints: number;
  taPoints: number;
  aiPoints: number;
  gap: number;
  aiReasoning: string | null;
  transcription: string;
}

interface TaDetail {
  exam: { id: string; name: string; maxTotal: number };
  course: { id: string; code: string | null; name: string };
  ta: { id: string; name: string; email: string };
  papersGraded: number;
  taAverage: number | null;
  aiAverage: number | null;
  paperGap: number | null;
  flaggedQuestionCodes: string[];
  questions: QuestionGap[];
  largestGaps: AnswerGap[];
  papers: {
    paperId: string;
    studentId: string;
    questions: { code: string; maxPoints: number; taPoints: number | null; aiPoints: number | null }[];
    taTotal: number | null;
    aiTotal: number | null;
    gap: number | null;
  }[];
}

const BIG: CSSProperties = {
  fontSize: "36px",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  color: "var(--ink)",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};

export function TaDetailLivePage() {
  const { courseId, examId, taId } = useParams<{ courseId: string; examId: string; taId: string }>();
  const [data, setData] = useState<TaDetail | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<TaDetail>(`/exams/${examId}/report/tas/${taId}`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error("Could not load")));
    return () => {
      cancelled = true;
    };
  }, [examId, taId]);

  const shellCourse = {
    id: courseId,
    code: data?.course.code ?? data?.course.name ?? "",
    name: data?.course.name ?? "",
  };
  const shellExam = data ? { id: examId, name: data.exam.name } : undefined;

  if (error) {
    const denied = error instanceof ApiError && (error.status === 403 || error.status === 404);
    return (
      <AppShell course={shellCourse} access="instructor">
        {denied ? <NoAccess message={error.message} /> : <Notice tone="error">{error.message}</Notice>}
      </AppShell>
    );
  }
  if (!data) {
    return (
      <AppShell course={shellCourse} exam={shellExam} access="instructor">
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Loading…</p>
      </AppShell>
    );
  }

  const { ta, exam, course, questions } = data;
  const first = ta.name.split(" ")[0];
  const base = `/courses/${courseId}/exams/${examId}`;
  const flagged = questions.filter((q) => q.flagged);
  const worst = [...flagged].sort((a, b) => Math.abs(b.averageGap ?? 0) - Math.abs(a.averageGap ?? 0))[0];
  const range = Math.max(2, Math.ceil(Math.max(0, ...questions.map((q) => Math.abs(q.averageGap ?? 0)))));
  const x = (g: number) => 50 + (Math.max(-range, Math.min(range, g)) / range) * 50;
  const papers = showAll ? data.papers : data.papers.slice(0, 6);
  const PAPER_COLUMNS = `120px repeat(${Math.max(questions.length, 1)}, minmax(0, 1fr)) 120px 90px`;

  return (
    <AppShell course={shellCourse} exam={shellExam} access="instructor">
      <PageHeader
        crumbs={[
          { label: [course.code, course.name].filter(Boolean).join(" "), href: `/courses/${courseId}` },
          { label: exam.name, href: `${base}/setup` },
          { label: "Report", href: `${base}/report` },
          { label: ta.name },
        ]}
      >
        <SecondaryButton
          href={`${base}/report`}
          icon={
            <svg {...svg(16)}>
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
          }
        >
          <span>All TAs</span>
        </SecondaryButton>
      </PageHeader>

      <div className="fg-in" style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}>
        {flagged.length ? (
          <FlagAvatar name={ta.name} size={52} />
        ) : (
          <span
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "999px",
              background: "var(--avatar-bg)",
              color: "var(--avatar-fg)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: 600,
            }}
          >
            {initial(ta.name)}
          </span>
        )}
        <div style={{ flexGrow: 1 }}>
          <h1
            style={{
              margin: 0,
              fontSize: "34px",
              fontWeight: 600,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
              color: "var(--ink)",
            }}
          >
            {ta.name}
          </h1>
          <p style={{ margin: "6px 0 0", fontSize: "14.5px", color: "var(--muted)" }}>
            <span style={{ ...MONO_ID, fontSize: "13px" }}>{ta.email}</span>. {data.papersGraded}{" "}
            {exam.name.toLowerCase()} paper{data.papersGraded === 1 ? "" : "s"} graded by the AI.
          </p>
        </div>
        {flagged.length ? (
          <Pill tone="red" dot>
            Flagged on {flagged.map((q) => q.code).join(", ")}
          </Pill>
        ) : (
          <Pill tone="green" dot>
            Within the threshold
          </Pill>
        )}
      </div>

      <Card className="fg-in fg-d1" padding="22px 24px">
        <div
          className="fg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr)) minmax(0, 1.6fr)",
            alignItems: "center",
            marginLeft: "-24px",
          }}
        >
          <Metric label="Papers graded" value={data.papersGraded} note={exam.name} />
          <Metric
            label={`${first}'s average`}
            value={data.taAverage?.toFixed(1) ?? "—"}
            unit={`/ ${pts(exam.maxTotal)}`}
            note={`AI on the same papers ${data.aiAverage?.toFixed(1) ?? "—"}`}
          />
          <Metric
            label="Paper gap"
            value={signed(data.paperGap)}
            color={gapColor(data.paperGap)}
            note="Average per paper"
          />
          <Metric
            label="Flagged on"
            value={worst ? worst.code : "None"}
            color={worst ? "var(--red)" : "var(--green-x)"}
            note={worst ? worst.title : "Every question within the band"}
          />
          <div
            style={{
              marginLeft: "24px",
              padding: "16px 18px",
              borderRadius: "16px",
              background: worst ? "var(--blue-t)" : "var(--green-t)",
              color: worst ? "var(--blue-x)" : "var(--green-x)",
              fontSize: "13.5px",
              lineHeight: 1.55,
            }}
          >
            {worst
              ? `Next step: compare ${first}'s ${worst.code} grading with the model answer, then reopen the papers you want regraded.`
              : `${first} grades close to the AI on every question. Nothing to follow up.`}
          </div>
        </div>
      </Card>

      <Card className="fg-in fg-d2" padding="28px">
        <SectionHeader
          title={`${first} compared with the AI, per question`}
          description={`Centre line is the AI. Shaded band is the flag threshold. Bars show ${first}'s average gap.`}
        >
          <div style={{ display: "flex", gap: "14px", fontSize: "12.5px" }}>
            <span style={{ color: "var(--red-x)" }}>Stricter</span>
            <span style={{ color: "var(--blue-x)" }}>More lenient</span>
          </div>
        </SectionHeader>
        {questions.map((q, i) => {
          const gap = q.averageGap ?? 0;
          const band = (q.threshold / range) * 100;
          const color = gap < 0 ? "var(--red)" : "var(--blue)";
          const from = Math.min(x(gap), 50);
          const width = Math.abs(x(gap) - 50);
          return (
            <div
              key={q.questionId}
              className="fg-reflow-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 0.9fr) minmax(260px, 1.7fr) 150px 100px",
                gap: "20px",
                alignItems: "center",
                padding: "14px 0",
                borderTop: i === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                  <span style={{ color: "var(--faint)", marginRight: "6px" }}>{q.code}</span>
                  {q.title}
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                  {pts(q.maxPoints)} points. Band ±{q.threshold.toFixed(2)}. {q.sampleSize} paper
                  {q.sampleSize === 1 ? "" : "s"}.
                </span>
              </span>
              <div style={{ position: "relative", height: "38px", minWidth: "200px" }} aria-hidden="true">
                <span
                  style={{
                    position: "absolute",
                    left: `${50 - band / 2}%`,
                    width: `${band}%`,
                    top: "4px",
                    bottom: "4px",
                    borderRadius: "8px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                  }}
                />
                {[0, 25, 75, 100].map((l) => (
                  <span
                    key={l}
                    style={{
                      position: "absolute",
                      left: `${l}%`,
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  />
                ))}
                <span
                  style={{
                    position: "absolute",
                    left: "50%",
                    top: "2px",
                    bottom: "2px",
                    width: "1.5px",
                    marginLeft: "-0.75px",
                    background: "var(--ink)",
                  }}
                />
                {q.averageGap != null && (
                  <>
                    <span
                      style={{
                        position: "absolute",
                        left: `${from}%`,
                        top: "14px",
                        width: `${width}%`,
                        height: "10px",
                        borderRadius: "999px",
                        background: color,
                        opacity: q.flagged ? 1 : 0.45,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        left: `${x(gap)}%`,
                        top: "19px",
                        width: "12px",
                        height: "12px",
                        borderRadius: "999px",
                        background: "var(--surface)",
                        boxShadow: `0 0 0 2px ${color}`,
                        transform: "translate(-50%, -50%)",
                      }}
                    />
                  </>
                )}
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: q.flagged ? (gap < 0 ? "var(--red-x)" : "var(--blue-x)") : "var(--muted)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {q.averageGap == null
                  ? "No papers yet"
                  : Math.abs(gap) < 0.005
                    ? "Same as the AI"
                    : `${Math.abs(gap).toFixed(2)} ${gap < 0 ? "stricter" : "more lenient"}`}
              </span>
              <span>
                {q.flagged ? (
                  <Pill tone="red" dot>
                    Flagged
                  </Pill>
                ) : (
                  <Pill tone="green" dot>
                    OK
                  </Pill>
                )}
              </span>
            </div>
          );
        })}
      </Card>

      {data.largestGaps.length > 0 && (
        <div>
          <SectionHeader
            title={worst ? "Papers behind the flag" : "Largest gaps"}
            description={
              worst
                ? `${worst.code}, ${worst.title}. The ${data.largestGaps.length} largest gaps, largest first.`
                : `The ${data.largestGaps.length} answers where ${first} and the AI differ most.`
            }
          />
          <div
            className="fg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: "20px",
              alignItems: "start",
              marginTop: "18px",
            }}
          >
            <div className="fg-span" style={{ gridColumn: data.largestGaps.length > 1 ? "span 7" : "span 12", minWidth: 0 }}>
              <GapCard gap={data.largestGaps[0]} first={first} big />
            </div>
            {data.largestGaps.length > 1 && (
              <div className="fg-span" style={{ gridColumn: "span 5", minWidth: 0 }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {data.largestGaps.slice(1).map((g) => (
                    <GapCard key={`${g.paperId}-${g.questionCode}`} gap={g} first={first} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Card className="fg-in fg-d4" padding="26px">
        <SectionHeader
          title={`${first}'s papers`}
          description={`Each cell is ${first} / AI. Gaps of 1 point or more are highlighted. ${papers.length} of ${data.papers.length} shown.`}
        >
          {data.papers.length > 6 && (
            <SecondaryButton
              onClick={() => setShowAll((v) => !v)}
              icon={
                <svg {...svg(16)}>
                  <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                  <path d="M13.5 3.5V9H19" />
                </svg>
              }
            >
              <span>{showAll ? "Show fewer" : `Show all ${data.papers.length}`}</span>
            </SecondaryButton>
          )}
        </SectionHeader>
        {data.papers.length === 0 ? (
          <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>
            No AI-graded papers from {first} in this exam yet.
          </p>
        ) : (
          <>
            <TableHead
              columns={PAPER_COLUMNS}
              labels={[
                "Student ID",
                ...questions.map((q) => `${q.code} (max ${pts(q.maxPoints)})`),
                "Total",
                "Gap",
              ]}
            />
            <div style={TABLE_FRAME}>
              {papers.map((p, i) => (
                <Link
                  key={p.paperId}
                  href={`/papers/${p.paperId}`}
                  className="fg-row"
                  style={rowStyle(PAPER_COLUMNS, i === 0, "10px 20px")}
                >
                  <span style={{ ...MONO_ID, fontSize: "13px", color: "var(--text)" }}>{p.studentId}</span>
                  {p.questions.map((c) => {
                    const g = c.taPoints != null && c.aiPoints != null ? c.taPoints - c.aiPoints : 0;
                    const hot = Math.abs(g) >= 1;
                    return (
                      <span
                        key={c.code}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          height: "30px",
                          padding: "0 10px",
                          borderRadius: "9px",
                          fontSize: "13.5px",
                          fontVariantNumeric: "tabular-nums",
                          justifySelf: "start",
                          background: hot ? (g < 0 ? "var(--red-t)" : "var(--blue-t)") : "transparent",
                          color: hot ? (g < 0 ? "var(--red-x)" : "var(--blue-x)") : "var(--text)",
                        }}
                      >
                        {pts(c.taPoints)}
                        <span style={{ color: "var(--faint)" }}>/</span>
                        {pts(c.aiPoints)}
                      </span>
                    );
                  })}
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                    {pts(p.taTotal)} <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>{pts(p.aiTotal)}</span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums", color: gapColor(p.gap) }}>
                    {signed(p.gap)}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </Card>
    </AppShell>
  );
}

function Metric({
  label,
  value,
  unit,
  note,
  color,
}: {
  label: string;
  value: React.ReactNode;
  unit?: string;
  note: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "4px 24px",
        borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
        minWidth: 0,
      }}
    >
      <span style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</span>
      <span>
        <span style={{ ...BIG, ...(color ? { color } : {}) }}>{value}</span>
        {unit && <span style={{ fontSize: "15px", color: "var(--muted)" }}> {unit}</span>}
      </span>
      <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>{note}</span>
    </div>
  );
}

function GapCard({ gap: g, first, big = false }: { gap: AnswerGap; first: string; big?: boolean }) {
  return (
    <Card className="fg-in fg-d3" padding={big ? "30px" : "24px"}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ ...MONO_ID, fontSize: "12.5px", color: "var(--muted)" }}>
          {g.studentId}, {g.questionCode}
        </span>
        <Pill tone={g.gap < 0 ? "red" : "blue"}>Gap {signed(g.gap, 1).replace(/\.0$/, "")}</Pill>
      </div>
      <p
        style={{
          margin: "16px 0 0",
          fontSize: big ? "20px" : "15px",
          lineHeight: 1.55,
          letterSpacing: "-0.01em",
          color: "var(--ink)",
          whiteSpace: "pre-wrap",
        }}
      >
        {g.transcription || <span style={{ color: "var(--muted)" }}>No transcription.</span>}
      </p>
      <div className="fg-reflow-grid" style={{ marginTop: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ padding: "12px 14px", borderRadius: "14px", background: "rgba(var(--ink-rgb), 0.04)" }}>
          <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>{first}</div>
          <div style={{ marginTop: "6px" }}>
            <span style={{ ...BIG, fontSize: "24px" }}>{pts(g.taPoints)}</span>
            <span style={{ fontSize: "13px", color: "var(--muted)" }}> / {pts(g.maxPoints)}</span>
          </div>
        </div>
        <div style={{ padding: "12px 14px", borderRadius: "14px", background: "var(--blue-t)" }}>
          <div style={{ fontSize: "12.5px", color: "var(--blue-x)" }}>AI</div>
          <div style={{ marginTop: "6px" }}>
            <span style={{ ...BIG, fontSize: "24px", color: "var(--blue-x)" }}>{pts(g.aiPoints)}</span>
            <span style={{ fontSize: "13px", color: "var(--blue-x)" }}> / {pts(g.maxPoints)}</span>
          </div>
        </div>
      </div>
      {g.aiReasoning && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "12px",
            padding: "12px 14px",
            borderRadius: "14px",
            background: "rgba(var(--ink-rgb), 0.03)",
          }}
        >
          <svg {...svg(16)} stroke="var(--blue)">
            <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
            <path d="M7 7l1.8 1.8M15.2 15.2L17 17M17 7l-1.8 1.8M8.8 15.2L7 17" />
          </svg>
          <p style={{ margin: 0, fontSize: "13.5px", lineHeight: 1.55, color: "var(--text)" }}>
            <span style={{ color: "var(--blue-x)", fontWeight: 500 }}>AI reasoning.</span> {g.aiReasoning}
          </p>
        </div>
      )}
      <div style={{ marginTop: "14px" }}>
        <SecondaryButton
          href={`/papers/${g.paperId}`}
          icon={
            <svg {...svg(16)}>
              <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
              <path d="M13.5 3.5V9H19" />
            </svg>
          }
        >
          <span>Open paper</span>
        </SecondaryButton>
      </div>
    </Card>
  );
}
