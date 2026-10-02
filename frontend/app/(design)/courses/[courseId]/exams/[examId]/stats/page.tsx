// TA "My stats" for one exam (design-reference/html/TAStats.html), wired to
// GET /exams/:id/my-stats. Only AI-graded papers count in the comparisons.
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import {
  AppShell,
  Button,
  Card,
  MONO,
  NoAccess,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
  YouTag,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";

interface MyStats {
  exam: { id: string; name: string; passMark: number };
  course: { id: string; code: string | null; name: string; leaderboardVisibility: string };
  counts: { total: number; submitted: number; aiGraded: number; pending: number; drafts: number };
  summary: {
    taAverage: number | null;
    aiAverage: number | null;
    averageGap: number | null;
    exactMatches: number | null;
    withinHalfPoint: number | null;
    comparedPapers: number;
    medianTimePerPaperMs: number | null;
    largestGap: { gap: number; studentId: string; questionCode: string } | null;
    flaggedQuestionCount: number | null;
  };
  paperComparisons: {
    paperId: string;
    studentId: string;
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
  leaderboard?: { rank: number | null; label: string; averageGap: number | null; isYou: boolean }[];
  badges?: { code: string; label: string }[];
}

const FLAG_RATIO = 0.15; // same rule as the backend: |avg gap| > 15% of the question's points

// −1.2 / +0.5 / 0, with a real minus sign.
function signed(x: number | null | undefined, digits = 2) {
  if (x == null) return "—";
  if (x === 0) return "0";
  const s = Math.abs(x)
    .toFixed(digits)
    .replace(/\.?0+$/, (m) => (m.startsWith(".") ? "" : m));
  return `${x < 0 ? "−" : "+"}${s}`;
}
const fixed = (x: number | null | undefined, d = 1) => (x == null ? "—" : x.toFixed(d));
const gapColor = (x: number | null | undefined) =>
  x == null || x === 0 ? "var(--muted)" : x < 0 ? "var(--red-x)" : "var(--blue-x)";

const BIG: React.CSSProperties = {
  fontSize: "36px",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  color: "var(--ink)",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};

export default function TaStatsPage() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
  const [data, setData] = useState<MyStats | null>(null);
  const [error, setError] = useState<ApiError | Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiFetch<MyStats>(`/exams/${examId}/my-stats`)
      .then((d) => !cancelled && setData(d))
      .catch((e) => !cancelled && setError(e));
    return () => {
      cancelled = true;
    };
  }, [examId]);

  const course = {
    id: courseId,
    code: data?.course.code ?? "",
    name: data?.course.name ?? "",
  };
  const exam = { id: examId, name: data?.exam.name ?? "" };
  const base = `/courses/${courseId}/exams/${examId}`;

  let body: ReactNode;
  if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
    body = <NoAccess message={error.message} />;
  } else if (error) {
    body = <Card padding="28px">Could not load your stats: {error.message}</Card>;
  } else if (!data) {
    body = <Card padding="28px">Loading your stats…</Card>;
  } else {
    body = <Stats data={data} base={base} />;
  }

  return (
    <AppShell course={course} exam={exam} active="my-stats" access="ta">
      <PageHeader
        crumbs={[
          {
            label: `${course.code} ${course.name}`.trim() || "Course",
            href: `/courses/${courseId}`,
          },
          { label: exam.name || "Exam" },
          { label: "My stats" },
        ]}
      >
        <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
          Updated when the AI finishes a paper
        </span>
      </PageHeader>
      <PageTitle
        title="My stats"
        description="How your grading compares with the AI on the same answers. Use it to calibrate, not as a score."
      />
      {body}
    </AppShell>
  );
}

function Stats({ data, base }: { data: MyStats; base: string }) {
  const { summary, counts, questions } = data;
  const maxTotal = questions.reduce((s, q) => s + q.maxPoints, 0);
  const compared = summary.comparedPapers;
  const flagged = questions.filter((q) => q.flagged);
  const worst = [...questions]
    .filter((q) => q.averageGap != null)
    .sort((a, b) => Math.abs(b.averageGap!) - Math.abs(a.averageGap!))[0];
  const within = compared > 0 && flagged.length === 0;

  return (
    <>
      <div
        className="fg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Headline */}
        <div
          className="fg-span"
          style={{ gridColumn: "span 8", minWidth: 0, alignSelf: "stretch" }}
        >
          <div
            className="fg-in fg-d1 fg-dark"
            style={{
              background: "rgba(var(--surface-rgb), 0.06)",
              boxShadow: "0 0 0 1px rgba(var(--surface-rgb), 0.10)",
              borderRadius: "30px",
              padding: "7px",
              height: "100%",
            }}
          >
            <div
              style={{
                background:
                  "radial-gradient(600px 300px at 100% 0%, #1F2A44 0%, rgba(31, 42, 68, 0) 70%), var(--ink)",
                borderRadius: "23px",
                padding: "30px",
                height: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "12px",
                  flexWrap: "wrap",
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    height: "26px",
                    padding: "0 10px",
                    borderRadius: "999px",
                    background: within ? "rgba(46, 139, 87, 0.18)" : "rgba(214, 69, 69, 0.22)",
                    color: within ? "#8FD9AE" : "#FFB3B3",
                    fontSize: "12.5px",
                    fontWeight: 500,
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: within ? "#5CC48A" : "#F06A6A",
                    }}
                  />
                  {compared === 0
                    ? "Nothing to compare yet"
                    : within
                      ? "Within the threshold"
                      : `Outside the threshold on ${flagged.map((q) => q.code).join(", ")}`}
                </span>
                <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>
                  {compared} {compared === 1 ? "paper" : "papers"} compared with the AI
                </span>
              </div>
              <p
                style={{
                  margin: "22px 0 0",
                  fontSize: "29px",
                  fontWeight: 500,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.2,
                  color: "var(--surface)",
                  maxWidth: "600px",
                }}
              >
                {compared === 0 ? (
                  "Submit papers and the AI grades the same answers. Your comparison shows up here."
                ) : summary.averageGap === 0 ? (
                  "On average you give exactly what the AI gives."
                ) : (
                  <>
                    On average you give{" "}
                    <span style={{ color: summary.averageGap! < 0 ? "#FFB3B3" : "#A9BBFF" }}>
                      {Math.abs(summary.averageGap!).toFixed(2)} points{" "}
                      {summary.averageGap! < 0 ? "less" : "more"}
                    </span>{" "}
                    than the AI per paper, on this exam.
                  </>
                )}
              </p>
              {worst && worst.averageGap != null && (
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: "14px",
                    color: "#A6ACB8",
                    lineHeight: 1.6,
                    maxWidth: "560px",
                  }}
                >
                  Your largest average gap is on {worst.code}, {worst.title}, at{" "}
                  {signed(worst.averageGap)} against a threshold of{" "}
                  {(FLAG_RATIO * worst.maxPoints).toFixed(2)}.
                </p>
              )}
              <div style={{ marginTop: "26px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <Link
                  href={`${base}/papers/new`}
                  className="fg-press"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "12px",
                    height: "48px",
                    padding: "6px 7px 6px 20px",
                    borderRadius: "999px",
                    background: "var(--surface)",
                    color: "var(--ink)",
                    textDecoration: "none",
                    fontSize: "15px",
                    fontWeight: 500,
                  }}
                >
                  <span>Add paper</span>
                  <span
                    className="fg-knob"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "var(--ink)",
                      color: "var(--surface)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <PlusIcon />
                  </span>
                </Link>
                <Link
                  href={`${base}/papers`}
                  className="fg-press"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "48px",
                    padding: "0 18px",
                    borderRadius: "999px",
                    color: "#D9DCE3",
                    textDecoration: "none",
                    fontSize: "14.5px",
                    fontWeight: 500,
                    boxShadow: "inset 0 0 0 1px rgba(var(--surface-rgb), 0.16)",
                  }}
                >
                  See my papers
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Your stack */}
        <div
          className="fg-span"
          style={{ gridColumn: "span 4", minWidth: 0, alignSelf: "stretch" }}
        >
          <Card className="fg-in fg-d2" padding="26px" fill>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600, color: "var(--ink)" }}>
                Your stack
              </h2>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>{data.exam.name}</span>
            </div>
            <div style={{ marginTop: "16px" }}>
              <span style={{ ...BIG, fontSize: "44px" }}>{counts.submitted}</span>
              <span style={{ fontSize: "16px", color: "var(--muted)" }}>
                {" "}
                / {counts.total} submitted
              </span>
            </div>
            <div style={{ display: "flex", gap: "4px", margin: "18px 0 14px" }}>
              {[
                [counts.aiGraded, "var(--blue)"],
                [counts.pending, "var(--amber)"],
                [counts.drafts, "rgba(var(--ink-rgb), 0.14)"],
              ].map(([n, color], i) =>
                (n as number) > 0 ? (
                  <span
                    key={i}
                    style={{
                      flex: n as number,
                      height: "10px",
                      borderRadius: "999px",
                      background: color as string,
                    }}
                  />
                ) : null,
              )}
              {counts.total === 0 && (
                <span
                  style={{
                    flex: 1,
                    height: "10px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.06)",
                  }}
                />
              )}
            </div>
            <StackRow
              color="var(--blue)"
              label="Compared with the AI"
              value={counts.aiGraded}
              first
            />
            <StackRow color="var(--amber)" label="AI grading now" value={counts.pending} />
            <StackRow
              color="rgba(var(--ink-rgb), 0.14)"
              label="Draft, not submitted"
              value={counts.drafts}
            />
          </Card>
        </div>
      </div>

      {/* KPIs */}
      <div
        className="fg-grid fg-in fg-d2"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }}
      >
        <Card padding="20px 22px">
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Your average</div>
          <div style={{ marginTop: "12px" }}>
            <span style={BIG}>{fixed(summary.taAverage)}</span>
            <span style={{ fontSize: "15px", color: "var(--muted)" }}> / {maxTotal}</span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
            AI <span style={{ color: "var(--blue-x)" }}>{fixed(summary.aiAverage)}</span> on the
            same papers
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Gap per paper</div>
          <div style={{ marginTop: "12px" }}>
            <span style={BIG}>{signed(summary.averageGap)}</span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
            You minus the AI, on average
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Exact matches</div>
          <div style={{ marginTop: "12px" }}>
            <span style={BIG}>{summary.exactMatches ?? "—"}</span>
            <span style={{ fontSize: "15px", color: "var(--muted)" }}> of {compared}</span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
            {summary.withinHalfPoint ?? 0} of {compared} within half a point
          </div>
        </Card>
        <Card padding="20px 22px">
          <div style={{ fontSize: "13px", color: "var(--muted)" }}>Largest gap</div>
          <div style={{ marginTop: "12px" }}>
            <span style={{ ...BIG, color: gapColor(summary.largestGap?.gap) }}>
              {signed(summary.largestGap?.gap)}
            </span>
          </div>
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
            {summary.largestGap ? (
              <>
                <span style={{ fontFamily: MONO, fontSize: "12px" }}>
                  {summary.largestGap.studentId}
                </span>
                , on {summary.largestGap.questionCode}
              </>
            ) : (
              "No AI-graded papers yet"
            )}
          </div>
        </Card>
      </div>

      {/* Paper by paper */}
      <Card className="fg-in fg-d3" padding="28px">
        <SectionHeader
          title="You and the AI, paper by paper"
          description={`Total out of ${maxTotal}, in the order you graded them. Red: you gave less than the AI. Blue: you gave more.`}
        />
        {data.paperComparisons.length === 0 ? (
          <Empty base={base} />
        ) : (
          <div
            style={{
              borderRadius: "18px",
              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
              overflow: "hidden",
            }}
          >
            {data.paperComparisons.map((p, i) => (
              <Link
                key={p.paperId}
                href={`/papers/${p.paperId}`}
                className="fg-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "120px minmax(0, 1fr) 90px 90px 70px",
                  gap: "16px",
                  alignItems: "center",
                  padding: "12px 20px",
                  textDecoration: "none",
                  color: "var(--text)",
                  borderTop: i === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <span style={{ fontFamily: MONO, fontSize: "13.5px", color: "var(--ink)" }}>
                  {p.studentId}
                </span>
                <TotalsBar ta={p.taTotal} ai={p.aiTotal} max={maxTotal} />
                <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                  You {p.taTotal ?? "—"}
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  AI {p.aiTotal ?? "—"}
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    textAlign: "right",
                    color: gapColor(p.gap),
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {signed(p.gap, 1)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </Card>

      <div
        className="fg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        {/* Per question */}
        <div
          className="fg-span"
          style={{
            gridColumn: data.leaderboard ? "span 7" : "span 12",
            minWidth: 0,
            alignSelf: "stretch",
          }}
        >
          <Card className="fg-in fg-d4" padding="28px" fill>
            <SectionHeader
              title="Your gap per question"
              description="The centre line is the AI. The soft band is the flag threshold, 15% of the question's points."
            />
            {questions.map((q) => (
              <QuestionRuler key={q.questionId} q={q} />
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11.5px",
                marginTop: "8px",
              }}
            >
              <span style={{ color: "var(--red-x)" }}>Stricter</span>
              <span style={{ color: "var(--muted)" }}>AI</span>
              <span style={{ color: "var(--blue-x)" }}>Lenient</span>
            </div>
          </Card>
        </div>

        {/* Where you stand */}
        {data.leaderboard && (
          <div
            className="fg-span"
            style={{ gridColumn: "span 5", minWidth: 0, alignSelf: "stretch" }}
          >
            <Card className="fg-in fg-d4" padding="28px" fill>
              <SectionHeader
                title="Where you stand"
                description="TAs ranked by how close their grades are to the AI. Smaller gap is better."
              />
              {data.leaderboard.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "12px",
                    background: row.isYou ? "var(--blue-t)" : "transparent",
                  }}
                >
                  <span
                    style={{
                      width: "24px",
                      fontSize: "13px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {row.rank ?? "—"}
                  </span>
                  <span
                    style={{
                      flexGrow: 1,
                      fontSize: "14px",
                      fontWeight: row.isYou ? 600 : 500,
                      color: "var(--ink)",
                    }}
                  >
                    {row.label}
                    {row.isYou && <YouTag />}
                  </span>
                  <span
                    style={{
                      fontSize: "13.5px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--muted)",
                    }}
                  >
                    {row.averageGap == null ? "—" : Math.abs(row.averageGap).toFixed(2)}
                  </span>
                </div>
              ))}
              {data.badges && data.badges.length > 0 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginTop: "16px" }}>
                  {data.badges.map((b) => (
                    <Pill key={b.code} tone="amber" dot>
                      {b.label}
                    </Pill>
                  ))}
                </div>
              )}
            </Card>
          </div>
        )}
      </div>

      {/* Worth a second look */}
      <Card className="fg-in fg-d5" padding="26px">
        <SectionHeader
          title="Worth a second look"
          description="Your largest single-question gaps, with the AI's reasoning."
        />
        {data.worthASecondLook.length === 0 ? (
          <p style={{ margin: 0, fontSize: "13.5px", color: "var(--muted)" }}>Nothing yet.</p>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "14px",
            }}
            className="fg-grid"
          >
            {data.worthASecondLook.map((w) => (
              <Link
                key={`${w.paperId}-${w.questionCode}`}
                href={`/papers/${w.paperId}`}
                className="fg-press"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  padding: "18px",
                  borderRadius: "18px",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                  textDecoration: "none",
                  color: "var(--text)",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span style={{ fontFamily: MONO, fontSize: "13px", color: "var(--ink)" }}>
                    {w.studentId} · {w.questionCode}
                  </span>
                  <Pill tone={w.gap < 0 ? "red" : "blue"} dot>
                    {signed(w.gap, 1)}
                  </Pill>
                </div>
                <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                  You {w.taPoints} · <span style={{ color: "var(--blue-x)" }}>AI {w.aiPoints}</span>
                </span>
                {w.aiReasoning && (
                  <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55 }}>
                    <span style={{ color: "var(--blue-x)", fontWeight: 500 }}>AI reasoning.</span>{" "}
                    {w.aiReasoning}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}

function StackRow({
  color,
  label,
  value,
  first,
}: {
  color: string;
  label: string;
  value: number;
  first?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "9px 0",
        borderTop: first ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
      }}
    >
      <span style={{ width: "8px", height: "8px", borderRadius: "999px", background: color }} />
      <span style={{ flexGrow: 1, fontSize: "13.5px", color: "var(--text)" }}>{label}</span>
      <span
        style={{
          fontSize: "13.5px",
          fontWeight: 500,
          color: "var(--ink)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// Your total (ink) and the AI's (blue) on the same 0…max track.
function TotalsBar({ ta, ai, max }: { ta: number | null; ai: number | null; max: number }) {
  const pct = (x: number) => `${Math.max(0, Math.min(100, (x / (max || 1)) * 100))}%`;
  return (
    <div style={{ position: "relative", height: "18px" }} aria-hidden="true">
      <span
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: "8px",
          height: "2px",
          background: "rgba(var(--ink-rgb), 0.07)",
        }}
      />
      {ta != null && ai != null && ta !== ai && (
        <span
          style={{
            position: "absolute",
            top: "7px",
            height: "4px",
            borderRadius: "999px",
            left: pct(Math.min(ta, ai)),
            width: `calc(${pct(Math.abs(ta - ai))})`,
            background: ta < ai ? "var(--red)" : "var(--blue)",
          }}
        />
      )}
      {ai != null && <Dot left={pct(ai)} color="var(--blue)" />}
      {ta != null && <Dot left={pct(ta)} color="var(--ink)" />}
    </div>
  );
}

function Dot({ left, color }: { left: string; color: string }) {
  return (
    <span
      style={{
        position: "absolute",
        left,
        top: "9px",
        width: "10px",
        height: "10px",
        borderRadius: "999px",
        background: color,
        boxShadow: "0 0 0 2px var(--surface)",
        transform: "translate(-50%, -50%)",
      }}
    />
  );
}

// The deviation ruler from the design system: centre = AI, band = ±15% of the
// question's points, bar = this TA's average gap (25% of the width per point).
function QuestionRuler({ q }: { q: MyStats["questions"][number] }) {
  const PER_POINT = 25;
  const band = FLAG_RATIO * q.maxPoints * PER_POINT;
  const gap = q.averageGap;
  const at = gap == null ? 50 : Math.max(2, Math.min(98, 50 + gap * PER_POINT));
  const color = gap == null || gap === 0 ? "var(--ink)" : gap < 0 ? "var(--red)" : "var(--blue)";
  return (
    <div
      className="fg-reflow-grid"
      style={{
        display: "grid",
        gridTemplateColumns: "170px minmax(0, 1fr) 120px",
        gap: "18px",
        alignItems: "center",
        padding: "8px 0",
      }}
    >
      <span style={{ fontSize: "14px", fontWeight: 500 }}>
        {q.code} {q.title}
      </span>
      <div style={{ position: "relative", height: "36px" }} aria-hidden="true">
        <span
          style={{
            position: "absolute",
            left: `${50 - band}%`,
            width: `${band * 2}%`,
            top: "4px",
            bottom: "4px",
            borderRadius: "8px",
            background: "rgba(var(--ink-rgb), 0.05)",
          }}
        />
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
        {gap != null && gap !== 0 && (
          <span
            style={{
              position: "absolute",
              left: `${Math.min(50, at)}%`,
              width: `${Math.abs(at - 50)}%`,
              top: "13px",
              height: "10px",
              borderRadius: "999px",
              background: color,
              opacity: q.flagged ? 1 : 0.45,
            }}
          />
        )}
        {gap != null && (
          <span
            style={{
              position: "absolute",
              left: `${at}%`,
              top: "18px",
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: "var(--surface)",
              boxShadow: `0 0 0 2px ${color}`,
              transform: "translate(-50%, -50%)",
            }}
          />
        )}
      </div>
      <span
        style={{
          fontSize: "13.5px",
          textAlign: "right",
          color: q.flagged ? gapColor(gap) : "var(--muted)",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {gap == null
          ? "No data yet"
          : gap === 0
            ? "Aligned"
            : `${Math.abs(gap).toFixed(2)} ${gap < 0 ? "stricter" : "lenient"}`}
      </span>
    </div>
  );
}

function Empty({ base }: { base: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
        No AI-graded papers yet. Submit a paper and the AI grades the same answers.
      </p>
      <div style={{ display: "flex", gap: "10px" }}>
        <SecondaryButton href={`${base}/papers`}>
          <span>My papers</span>
        </SecondaryButton>
        <Button href={`${base}/papers/new`} icon={<PlusIcon />}>
          Add paper
        </Button>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
