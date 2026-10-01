"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { type CSSProperties, type ReactNode, useCallback, useEffect, useState } from "react";
import {
  AppShell,
  Avatar,
  Card,
  MONO,
  NoAccess,
  Notice,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";

// Course stats for the instructor (design: CourseStats.html), from
// GET /courses/:id/stats[?examId=] and GET /courses/:id/activity.

type Visibility = "OFF" | "ANONYMOUS" | "NAMED";

interface TrendPoint {
  examId: string;
  name: string;
  heldAt: string | null;
  papers: number;
  averageGap: number | null;
  flaggedTas: number;
}

interface Stats {
  course: { id: string; code: string | null; name: string; leaderboardVisibility: Visibility };
  exams: { id: string; name: string; heldAt: string | null; status: string; passMark: number }[];
  focusExamId: string | null;
  trend: TrendPoint[];
  headline: {
    first: TrendPoint | null;
    last: TrendPoint | null;
    change: number | null;
    improvingEveryExam: boolean;
    tasCompared: number;
    tasCloser: number;
    tasFurther: string[];
  };
  kpis: {
    exams: number;
    papersSubmitted: number;
    aiGraded: number;
    averageGap: number | null;
    averageGapExam: string | null;
    flagsRaised: number;
    flagsByExam: { name: string; count: number }[];
    medianMinutes: number | null;
  };
  atStake: {
    paperId: string;
    studentId: string;
    examName: string;
    taName: string;
    taTotal: number;
    aiTotal: number;
    maxTotal: number;
    passMark: number;
    failsWithTa: boolean;
  }[];
  leaderboard: {
    rank: number;
    taId: string;
    name: string;
    papers: number;
    averageGap: number;
    direction: "stricter" | "lenient" | "even";
    sinceFirst: number | null;
    flags: number;
    medianMinutes: number | null;
    history: { examId: string; gap: number | null }[];
    badge: { code: string; label: string } | null;
  }[];
  distribution: {
    total: number;
    bins: { from: number; to: number; ta: number; ai: number }[];
    passMark: number | null;
    passedTa: number;
    passedAi: number;
    taAverage: number | null;
    aiAverage: number | null;
  };
  questionsToTighten: {
    examId: string;
    examName: string;
    questionId: string;
    code: string;
    title: string;
    threshold: number;
    spread: number;
    strictest: { taName: string; gap: number };
    lenient: { taName: string; gap: number };
    outlier: { taName: string; gap: number } | null;
    gaps: { taName: string; gap: number }[];
  }[];
}

interface Activity {
  id: string;
  type: string;
  createdAt: string;
  actor: { id: string; name: string } | null;
  ta: { id: string; name: string } | null;
  member: { id: string; name: string } | null;
  paper: { id: string | null; studentId: string; status: string | null } | null;
  exam: { id: string; name: string } | null;
  questionCode: string | null;
  averageGap: number | null;
  aiResult: { gap: number | null; mostlyCode: string | null; largestGap: number } | null;
}

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
const first = (name: string | undefined | null) => (name ?? "").split(" ")[0] || "Someone";
const fix2 = (x: number | null | undefined) => (x == null ? "—" : x.toFixed(2));
const signed = (x: number | null | undefined, d = 2) =>
  x == null ? "—" : Math.abs(x) < 0.005 ? (0).toFixed(d) : `${x < 0 ? "−" : "+"}${Math.abs(x).toFixed(d)}`;
const pts = (x: number) => String(Math.round(x * 100) / 100);
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const shortDate = (iso: string | null) => {
  if (!iso) return "";
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
};

const BIG: CSSProperties = {
  fontSize: "36px",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  color: "var(--ink)",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};

function svg(size: number, strokeWidth = 1.4) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { flexShrink: 0, display: "block" },
  };
}

const TrophyIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...svg(size)}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
    <path d="M8 6H5.5A2.5 2.5 0 0 0 8 10.3" />
    <path d="M16 6h2.5A2.5 2.5 0 0 1 16 10.3" />
    <path d="M12 13v3" />
    <path d="M8.5 20h7" />
    <path d="M10 20c0-1.8.9-3 2-3s2 1.2 2 3" />
  </svg>
);
const ClockIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...svg(size)}>
    <circle cx="12" cy="12" r="8" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
const SparkIcon = ({ size = 14 }: { size?: number }) => (
  <svg {...svg(size)}>
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
    <path d="M7 7l1.8 1.8M15.2 15.2L17 17M17 7l-1.8 1.8M8.8 15.2L7 17" />
  </svg>
);
const BADGE_ICON: Record<string, (p: { size?: number }) => ReactNode> = {
  closest: TrophyIcon,
  fast: ClockIcon,
  improved: SparkIcon,
};

function Segmented<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{
        display: "inline-flex",
        padding: "4px",
        borderRadius: "999px",
        background: "rgba(var(--ink-rgb), 0.05)",
        gap: "2px",
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            className="fg-press"
            onClick={() => onChange(o.value)}
            style={{
              height: "34px",
              padding: "0 14px",
              border: 0,
              borderRadius: "999px",
              fontFamily: FONT,
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: "pointer",
              background: on ? "var(--raised)" : "transparent",
              color: on ? "var(--ink)" : "var(--muted)",
              boxShadow: on
                ? "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)"
                : undefined,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function CourseStatsLivePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [examId, setExamId] = useState<string>("all");
  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<Activity[] | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [visibilityError, setVisibilityError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const q = examId === "all" ? "" : `?examId=${encodeURIComponent(examId)}`;
    apiFetch<Stats>(`/courses/${courseId}/stats${q}`)
      .then((s) => !cancelled && setStats(s))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error("Could not load")));
    return () => {
      cancelled = true;
    };
  }, [courseId, examId]);

  const loadActivity = useCallback(
    () =>
      apiFetch<{ activity: Activity[] }>(`/courses/${courseId}/activity?limit=6`)
        .then((a) => setActivity(a.activity))
        .catch(() => setActivity((current) => current ?? [])),
    [courseId],
  );

  // The feed is "live": refresh it every 15 seconds while the page is open.
  useEffect(() => {
    void loadActivity();
    const timer = window.setInterval(() => void loadActivity(), 15_000);
    return () => window.clearInterval(timer);
  }, [loadActivity]);

  const shellCourse = {
    id: courseId,
    code: stats?.course.code ?? stats?.course.name ?? "",
    name: stats?.course.name ?? "",
  };

  if (error) {
    const denied = error instanceof ApiError && (error.status === 403 || error.status === 404);
    return (
      <AppShell course={shellCourse} active="stats" access="instructor">
        {denied ? <NoAccess /> : <Notice tone="error">{error.message}</Notice>}
      </AppShell>
    );
  }
  if (!stats) {
    return (
      <AppShell course={shellCourse} active="stats" access="instructor">
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Loading course stats…</p>
      </AppShell>
    );
  }

  const code = stats.course.code ?? stats.course.name;
  const hasData = stats.trend.length > 0;

  async function setVisibility(v: Visibility) {
    if (!stats) return;
    const previous = stats.course.leaderboardVisibility;
    setVisibilityError("");
    setStats({ ...stats, course: { ...stats.course, leaderboardVisibility: v } });
    try {
      await apiFetch(`/courses/${courseId}/settings`, { method: "PATCH", body: { leaderboardVisibility: v } });
    } catch (e) {
      setStats((s) => (s ? { ...s, course: { ...s.course, leaderboardVisibility: previous } } : s));
      setVisibilityError(e instanceof Error ? e.message : "Could not change the setting");
    }
  }

  return (
    <AppShell course={shellCourse} active="stats" access="instructor">
      <PageHeader
        crumbs={[
          { label: "All courses", href: "/courses" },
          { label: [stats.course.code, stats.course.name].filter(Boolean).join(" "), href: `/courses/${courseId}` },
          { label: "Stats" },
        ]}
      >
        {stats.trend.length > 1 && (
          <Segmented
            label="Filter by exam"
            value={examId}
            onChange={setExamId}
            options={[
              { value: "all", label: "All exams" },
              ...stats.trend.map((t) => ({ value: t.examId, label: t.name })),
            ]}
          />
        )}
        <SecondaryButton
          onClick={() => window.print()}
          icon={
            <svg {...svg(16)}>
              <path d="M12 15.5V4.5" />
              <path d="M7.5 9l4.5-4.5L16.5 9" />
              <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
            </svg>
          }
        >
          <span>Export PDF</span>
        </SecondaryButton>
      </PageHeader>
      <PageTitle
        title="Course stats"
        description={<>How consistently {code} is graded across every exam, and which TAs grade closest to the AI.</>}
      />

      {!hasData ? (
        <Card padding="28px">
          <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>
            No paper of {code} has been graded by the AI yet. Stats show up once TAs submit papers.
          </p>
        </Card>
      ) : (
        <>
          <div
            className="fg-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "20px", alignItems: "start" }}
          >
            <div className="fg-span" style={{ gridColumn: "span 8", minWidth: 0, alignSelf: "stretch" }}>
              <Hero stats={stats} code={code} />
            </div>
            <div className="fg-span" style={{ gridColumn: "span 4", minWidth: 0, alignSelf: "stretch" }}>
              <AtStake stats={stats} />
            </div>
          </div>

          <Kpis stats={stats} />

          <Leaderboard stats={stats} courseId={courseId} onVisibility={setVisibility} error={visibilityError} />

          <div
            className="fg-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "20px", alignItems: "start" }}
          >
            <div className="fg-span" style={{ gridColumn: "span 7", minWidth: 0, alignSelf: "stretch" }}>
              <Consistency stats={stats} />
            </div>
            <div className="fg-span" style={{ gridColumn: "span 5", minWidth: 0, alignSelf: "stretch" }}>
              <LiveActivity activity={activity} code={code} />
            </div>
          </div>

          <div
            className="fg-grid"
            style={{ display: "grid", gridTemplateColumns: "repeat(12, minmax(0, 1fr))", gap: "20px", alignItems: "start" }}
          >
            <div className="fg-span" style={{ gridColumn: "span 7", minWidth: 0, alignSelf: "stretch" }}>
              <Distribution stats={stats} />
            </div>
            <div className="fg-span" style={{ gridColumn: "span 5", minWidth: 0, alignSelf: "stretch" }}>
              <Tighten stats={stats} courseId={courseId} />
            </div>
          </div>
        </>
      )}
    </AppShell>
  );
}

// ---------------------------------------------------------------- hero

function Hero({ stats, code }: { stats: Stats; code: string }) {
  const { headline: h, trend, kpis } = stats;
  const a = h.first?.averageGap;
  const b = h.last?.averageGap;
  const better = h.change != null && h.change < 0;
  const worse = h.change != null && h.change > 0;
  const accent = worse ? "#F3C977" : "#8FD9AE";
  const pill = h.improvingEveryExam && better ? "Improving every exam" : better ? "Improving" : worse ? "Drifting from the AI" : trend.length === 1 ? "First exam" : "Steady";
  const shown = trend.slice(-4);

  let title: ReactNode;
  if (better || worse) {
    title = (
      <>
        {code} is graded {better ? "more" : "less"} consistently{" "}
        {better && h.improvingEveryExam ? "every exam" : `than at ${h.first?.name}`}. The average gap{" "}
        {better ? "fell" : "rose"}{" "}
        <span style={{ color: accent }}>
          from {fix2(a)} to {fix2(b)} points
        </span>
        .
      </>
    );
  } else {
    title = (
      <>
        {code} has {trend.length === 1 ? "one graded exam so far" : "held steady"}. The average gap is{" "}
        <span style={{ color: accent }}>{fix2(b)} points</span>.
      </>
    );
  }
  const sub =
    h.tasCompared > 0
      ? `${h.tasCloser} of ${h.tasCompared} TAs moved closer to the AI since ${h.first?.name}.${
          h.tasFurther.length ? ` ${h.tasFurther.map(first).join(", ")} moved further away.` : ""
        }`
      : "Each TA's gap from the AI, exam by exam, shows up here after a second exam.";

  return (
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
          background: worse
            ? "radial-gradient(640px 320px at 100% 0%, #3A3220 0%, rgba(58, 50, 32, 0) 70%), var(--ink)"
            : "radial-gradient(640px 320px at 100% 0%, #1E3A2E 0%, rgba(30, 58, 46, 0) 70%), var(--ink)",
          borderRadius: "23px",
          padding: "30px",
          boxShadow:
            "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              height: "26px",
              padding: "0 10px",
              borderRadius: "999px",
              background: worse ? "rgba(243, 201, 119, 0.16)" : "rgba(46, 139, 87, 0.18)",
              color: accent,
              fontSize: "12.5px",
              fontWeight: 500,
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: worse ? "#F3C977" : "#5CC48A" }} />
            {pill}
          </span>
          <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>
            {trend.length} exam{trend.length === 1 ? "" : "s"}, {trend.reduce((s, t) => s + t.papers, 0)} papers
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
            maxWidth: "620px",
          }}
        >
          {title}
        </p>
        <p style={{ margin: "12px 0 0", fontSize: "14px", color: "#A6ACB8", lineHeight: 1.6, maxWidth: "560px" }}>{sub}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: shown.map(() => "minmax(0, 1fr)").join(" auto "),
            gap: "10px",
            marginTop: "24px",
          }}
        >
          {shown.map((t, i) => {
            const last = i === shown.length - 1;
            return [
              <div
                key={t.examId}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: last ? "rgba(var(--surface-rgb), 0.10)" : "rgba(var(--surface-rgb), 0.04)",
                  boxShadow: last
                    ? "inset 0 0 0 1px rgba(var(--surface-rgb), 0.14)"
                    : "inset 0 0 0 1px rgba(var(--surface-rgb), 0.06)",
                  minWidth: 0,
                }}
              >
                <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>
                  {t.name}
                  {t.heldAt ? `, ${shortDate(t.heldAt)}` : ""}
                </span>
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 500,
                    letterSpacing: "-0.04em",
                    color: last ? "var(--surface)" : "#C3C8D2",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: 1,
                  }}
                >
                  {fix2(t.averageGap)}
                </span>
              </div>,
              !last && (
                <span key={`${t.examId}-arrow`} style={{ color: "#5B6170", display: "flex", alignItems: "center" }}>
                  <svg {...svg(18)}>
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
              ),
            ];
          })}
        </div>
        {kpis.exams === 1 && stats.focusExamId && (
          <p style={{ margin: "14px 0 0", fontSize: "12.5px", color: "#8E95A3" }}>
            The numbers below are for {kpis.averageGapExam} only.
          </p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- pass or fail

function AtStake({ stats }: { stats: Stats }) {
  const [all, setAll] = useState(false);
  const rows = all ? stats.atStake : stats.atStake.slice(0, 3);
  const failTa = stats.atStake.filter((x) => x.failsWithTa).length;
  const other = stats.atStake.length - failTa;
  const pass = stats.atStake[0] ?? stats.exams.find((e) => e.id === stats.trend.at(-1)?.examId);
  return (
    <Card className="fg-in fg-d2" padding="26px" fill>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <h2 style={{ margin: 0, fontSize: "17px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}>
          Pass or fail at stake
        </h2>
        {stats.atStake.length > 0 ? <Pill tone="amber">Review</Pill> : <Pill tone="green">None</Pill>}
      </div>
      <div style={{ marginTop: "14px", display: "flex", alignItems: "baseline", gap: "10px" }}>
        <span
          style={{
            fontSize: "48px",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: stats.atStake.length ? "var(--amber-x)" : "var(--green-x)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {stats.atStake.length}
        </span>
        <span style={{ fontSize: "14px", color: "var(--muted)", lineHeight: 1.4 }}>
          paper{stats.atStake.length === 1 ? "" : "s"} where the pass mark depends on who graded
        </span>
      </div>
      <p style={{ margin: "10px 0 12px", fontSize: "13px", lineHeight: 1.55, color: "var(--muted)" }}>
        {stats.atStake.length === 0
          ? "TA and AI agree on pass or fail for every paper."
          : `${failTa} fail with the TA's grade but pass with the AI's. ${other} go${other === 1 ? "es" : ""} the other way.`}
        {pass && "passMark" in pass ? ` Pass is ${pts(pass.passMark)}${"maxTotal" in pass ? ` out of ${pts(pass.maxTotal)}` : ""}.` : ""}
      </p>
      {rows.length > 0 && (
        <div style={{ borderTop: "1px solid rgba(var(--ink-rgb), 0.07)", paddingTop: "6px" }}>
          {rows.map((x) => (
            <Link
              key={x.paperId}
              href={`/papers/${x.paperId}`}
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "84px minmax(0, 1fr) auto",
                gap: "12px",
                alignItems: "center",
                padding: "11px 12px",
                margin: "0 -12px",
                borderRadius: "12px",
                textDecoration: "none",
                color: "var(--text)",
              }}
            >
              <span style={{ fontFamily: MONO, fontSize: "13px", color: "var(--ink)", letterSpacing: "-0.01em" }}>{x.studentId}</span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)", minWidth: 0 }}>
                {x.examName}, {first(x.taName)}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                <span style={{ color: x.taTotal < x.aiTotal ? "var(--red-x)" : "var(--blue-x)" }}>{pts(x.taTotal)}</span>
                <span style={{ color: "var(--faint)" }}>
                  <svg {...svg(13)}>
                    <path d="M5 12h14" />
                    <path d="M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span style={{ color: "var(--blue-x)", fontWeight: 500 }}>{pts(x.aiTotal)}</span>
              </span>
            </Link>
          ))}
        </div>
      )}
      {stats.atStake.length > 3 && (
        <div style={{ marginTop: "12px" }}>
          <SecondaryButton
            onClick={() => setAll((v) => !v)}
            icon={
              <svg {...svg(16)}>
                <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                <path d="M13.5 3.5V9H19" />
              </svg>
            }
          >
            <span>{all ? "Show fewer" : `Review all ${stats.atStake.length}`}</span>
          </SecondaryButton>
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------- KPIs

function Kpis({ stats }: { stats: Stats }) {
  const { kpis, headline } = stats;
  const flagsNote = kpis.flagsByExam.length
    ? kpis.flagsByExam.map((f) => `${f.count} on ${f.name}`).join(", ")
    : "No flags";
  const card = (label: string, value: ReactNode, note: ReactNode, extra?: ReactNode) => (
    <Card padding="20px 22px">
      <div style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</div>
      <div style={{ marginTop: "12px" }}>
        {value}
        {extra}
      </div>
      <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>{note}</div>
    </Card>
  );
  const changePct = headline.change != null && !stats.focusExamId ? Math.round(headline.change * 100) : null;
  return (
    <div className="fg-grid fg-in fg-d2" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }}>
      {card(
        "Papers graded",
        <span style={BIG}>{kpis.papersSubmitted}</span>,
        `${kpis.exams} exam${kpis.exams === 1 ? "" : "s"}. The AI graded ${kpis.aiGraded}`,
      )}
      {card(
        "Average gap",
        <span style={BIG}>{fix2(kpis.averageGap)}</span>,
        `Per paper, on ${kpis.averageGapExam ? (kpis.averageGapExam.match(/\d/) ? kpis.averageGapExam : `the ${kpis.averageGapExam.toLowerCase()}`) : "the latest exam"}`,
        changePct != null && changePct !== 0 ? (
          <span style={{ fontSize: "13px", color: changePct < 0 ? "var(--green-x)" : "var(--red-x)", marginLeft: "8px" }}>
            {changePct < 0 ? "−" : "+"}
            {Math.abs(changePct)}% since {headline.first?.name}
          </span>
        ) : null,
      )}
      {card("Flags raised", <span style={{ ...BIG, color: kpis.flagsRaised ? "var(--red-x)" : "var(--ink)" }}>{kpis.flagsRaised}</span>, flagsNote)}
      {card(
        "Time per paper",
        <span style={BIG}>{kpis.medianMinutes == null ? "—" : Math.round(kpis.medianMinutes)}</span>,
        "Median, from scan to submit",
        <span style={{ fontSize: "15px", color: "var(--muted)" }}> min</span>,
      )}
    </div>
  );
}

// ---------------------------------------------------------------- leaderboard

function Leaderboard({
  stats,
  courseId,
  onVisibility,
  error,
}: {
  stats: Stats;
  courseId: string;
  onVisibility: (v: Visibility) => void;
  error: string;
}) {
  const board = stats.leaderboard;
  const firstExam = stats.trend[0];
  const lastExam = stats.trend.at(-1);
  const maxGap = Math.max(0.5, ...board.flatMap((t) => t.history.map((h) => h.gap ?? 0)));
  const podium = [board[1], board[0], board[2]].filter(Boolean);
  const COLS = "44px minmax(0, 1.5fr) 74px 170px 120px 110px 64px 24px";
  const reportBase = lastExam ? `/courses/${courseId}/exams/${lastExam.examId}/report` : null;

  return (
    <Card className="fg-in fg-d3" padding="28px">
      <SectionHeader
        title="TA leaderboard"
        description="Ranked by the average gap from the AI across every exam. Smaller is better. Direction does not matter here, only distance."
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Visible to TAs</span>
          <Segmented<Visibility>
            label="Leaderboard visibility for TAs"
            value={stats.course.leaderboardVisibility}
            onChange={onVisibility}
            options={[
              { value: "OFF", label: "Off" },
              { value: "ANONYMOUS", label: "Without names" },
              { value: "NAMED", label: "With names" },
            ]}
          />
        </div>
      </SectionHeader>
      {error && (
        <div style={{ marginTop: "12px" }}>
          <Notice tone="error">{error}</Notice>
        </div>
      )}

      {podium.length > 0 && (
        <div
          className="fg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${podium.length}, minmax(0, 1fr))`,
            gap: "16px",
            alignItems: "end",
            margin: "22px 0",
          }}
        >
          {podium.map((t) =>
            t.rank === 1 ? (
              <div
                key={t.taId}
                className="fg-dark"
                style={{
                  background: "rgba(var(--surface-rgb), 0.06)",
                  boxShadow: "0 0 0 1px rgba(var(--surface-rgb), 0.10)",
                  borderRadius: "28px",
                  padding: "6px",
                }}
              >
                <div
                  style={{
                    background: "radial-gradient(360px 220px at 50% 0%, #3A3220 0%, rgba(58, 50, 32, 0) 70%), var(--ink)",
                    borderRadius: "22px",
                    padding: "22px 20px 24px",
                    boxShadow: "inset 0 1px 0 rgba(var(--surface-rgb), 0.08)",
                  }}
                >
                  <PodiumBody t={t} firstExam={firstExam?.name} dark />
                </div>
              </div>
            ) : (
              <Card key={t.taId} size="feature" padding="22px 20px 24px">
                <PodiumBody t={t} firstExam={firstExam?.name} />
              </Card>
            ),
          )}
        </div>
      )}

      <div
        className="fg-hide-sm"
        style={{ display: "grid", gridTemplateColumns: COLS, gap: "16px", padding: "0 20px 10px", fontSize: "12.5px", color: "var(--muted)" }}
      >
        <span>#</span>
        <span>TA</span>
        <span>Papers</span>
        <span>Average gap</span>
        <span>
          {firstExam?.name} to {lastExam?.name}
        </span>
        <span>Since {firstExam?.name}</span>
        <span>Flags</span>
        <span />
      </div>
      <div style={{ borderRadius: "18px", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)", overflow: "hidden" }}>
        {board.map((t, i) => {
          const Icon = t.badge ? BADGE_ICON[t.badge.code] : null;
          const pointsList = t.history
            .map((h, hi) => ({ h, x: t.history.length === 1 ? 52 : 4 + (hi * 96) / (t.history.length - 1) }))
            .filter((p) => p.h.gap != null)
            .map((p) => ({ x: p.x, y: 27 - (p.h.gap! / maxGap) * 24 }));
          const trendColor = t.sinceFirst == null || Math.abs(t.sinceFirst) < 0.005 ? "var(--ink)" : t.sinceFirst < 0 ? "var(--green)" : "var(--red)";
          const row = (
            <>
              <span style={{ fontFamily: MONO, fontSize: "14px", color: i < 3 ? "var(--ink)" : "var(--muted)" }}>
                {String(t.rank).padStart(2, "0")}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                {t.flags > 0 && t.rank === board.length ? (
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      color: "var(--surface)",
                      boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 600,
                      flexShrink: 0,
                    }}
                  >
                    {t.name.charAt(0)}
                  </span>
                ) : (
                  <Avatar initial={t.name.charAt(0)} size={34} />
                )}
                <span style={{ display: "flex", flexDirection: "column", gap: "2px", minWidth: 0 }}>
                  <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>{t.name}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--muted)" }}>
                    {Icon && <Icon size={13} />}
                    {t.badge ? t.badge.label : t.medianMinutes != null ? `${Math.round(t.medianMinutes)} min per paper` : ""}
                  </span>
                </span>
              </span>
              <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>{t.papers}</span>
              <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span
                  style={{
                    fontSize: "15px",
                    fontWeight: 500,
                    fontVariantNumeric: "tabular-nums",
                    color: t.flags > 0 && t.averageGap > 1 ? "var(--red-x)" : "var(--ink)",
                  }}
                >
                  {t.averageGap.toFixed(2)}
                </span>
                <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                  {t.direction === "even" ? "no clear direction" : `mostly ${t.direction === "lenient" ? "more lenient" : "stricter"}`}
                </span>
              </span>
              <svg width="104" height="30" viewBox="0 0 104 30" aria-hidden="true" style={{ display: "block", overflow: "visible" }}>
                {pointsList.length > 1 && (
                  <polyline
                    points={pointsList.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ")}
                    fill="none"
                    stroke="var(--ink)"
                    strokeWidth="1.6"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    opacity="0.8"
                  />
                )}
                {pointsList.map((p, pi) => {
                  const last = pi === pointsList.length - 1;
                  return (
                    <circle
                      key={pi}
                      cx={p.x}
                      cy={p.y}
                      r={last ? 3.4 : 2.2}
                      fill={last ? trendColor : "var(--surface)"}
                      stroke={last ? trendColor : "var(--ink)"}
                      strokeWidth="1.4"
                    />
                  );
                })}
              </svg>
              <span
                style={{
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  color: t.sinceFirst == null ? "var(--faint)" : t.sinceFirst < 0 ? "var(--green-x)" : t.sinceFirst > 0 ? "var(--red-x)" : "var(--muted)",
                }}
              >
                {t.sinceFirst == null ? "—" : signed(t.sinceFirst)}
              </span>
              <span>
                {t.flags > 0 ? (
                  <Pill tone="red" dot>
                    {t.flags}
                  </Pill>
                ) : (
                  <Pill>0</Pill>
                )}
              </span>
              <span style={{ color: "var(--faint)" }}>
                <svg {...svg(18)}>
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </span>
            </>
          );
          const style: CSSProperties = {
            display: "grid",
            gridTemplateColumns: COLS,
            gap: "16px",
            alignItems: "center",
            padding: "13px 20px",
            textDecoration: "none",
            color: "var(--text)",
            borderTop: i === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
          };
          return reportBase ? (
            <Link key={t.taId} href={`${reportBase}/${t.taId}`} className="fg-row" style={style}>
              {row}
            </Link>
          ) : (
            <div key={t.taId} className="fg-row" style={style}>
              {row}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PodiumBody({ t, firstExam, dark = false }: { t: Stats["leaderboard"][number]; firstExam?: string; dark?: boolean }) {
  const Icon = t.badge ? BADGE_ICON[t.badge.code] : null;
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: "10px",
        paddingBottom: dark ? "44px" : t.rank === 2 ? "16px" : 0,
      }}
    >
      <span style={{ fontFamily: MONO, fontSize: "13px", color: dark ? "#A6ACB8" : "var(--muted)" }}>#{t.rank}</span>
      <span
        style={{
          width: dark ? "64px" : "52px",
          height: dark ? "64px" : "52px",
          borderRadius: "999px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: dark ? "24px" : "20px",
          fontWeight: 600,
          background: dark ? "var(--gold-icon)" : "rgba(var(--ink-rgb), 0.06)",
          color: "var(--ink)",
          boxShadow: dark ? "0 0 0 4px rgba(243, 213, 138, 0.18)" : "0 0 0 4px var(--surface)",
        }}
      >
        {t.name.charAt(0)}
      </span>
      <span style={{ fontSize: dark ? "17px" : "15px", fontWeight: 600, letterSpacing: "-0.02em", color: dark ? "var(--surface)" : "var(--ink)" }}>
        {t.name}
      </span>
      <span style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
        <span
          style={{
            fontSize: dark ? "34px" : "28px",
            fontWeight: 500,
            letterSpacing: "-0.04em",
            color: dark ? "var(--surface)" : "var(--ink)",
            fontVariantNumeric: "tabular-nums",
            lineHeight: 1,
          }}
        >
          {t.averageGap.toFixed(2)}
        </span>
        <span style={{ fontSize: "12.5px", color: dark ? "#A6ACB8" : "var(--muted)" }}>avg gap</span>
      </span>
      <span style={{ fontSize: "12.5px", color: dark ? "#A6ACB8" : "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
        {t.sinceFirst != null ? `${signed(t.sinceFirst)} since ${firstExam}, ` : ""}
        {t.papers} papers
      </span>
      {t.badge && (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "26px",
            padding: "0 10px",
            borderRadius: "999px",
            fontSize: "12px",
            fontWeight: 500,
            background: dark ? "rgba(var(--surface-rgb), 0.10)" : "rgba(var(--ink-rgb), 0.05)",
            color: dark ? "var(--gold-icon)" : "var(--ink)",
          }}
        >
          {Icon && <Icon />}
          {t.badge.label}
        </span>
      )}
    </div>
  );
}

// ---------------------------------------------------------------- consistency chart

function Consistency({ stats }: { stats: Stats }) {
  const exams = stats.trend;
  const board = stats.leaderboard;
  const all = [...board.flatMap((t) => t.history.map((h) => h.gap ?? 0)), ...exams.map((e) => e.averageGap ?? 0)];
  const yMax = Math.max(0.5, Math.ceil(Math.max(...all) / 0.5) * 0.5);
  const y = (v: number) => 330 - (v / yMax) * 300;
  const x = (i: number) => (exams.length === 1 ? 250 : 30 + (i * 440) / (exams.length - 1));
  const ticks = Array.from({ length: Math.round(yMax / 0.5) + 1 }, (_, i) => i * 0.5);
  const lastIndex = exams.length - 1;
  const flaggedLast = new Set(board.filter((t) => t.flags > 0 && (t.history.at(-1)?.gap ?? 0) > 1).map((t) => t.taId));

  // Right-hand labels, nudged apart so they never overlap.
  const labels = [
    ...board.map((t) => ({
      key: t.taId,
      v: t.history.at(-1)?.gap,
      text: `${first(t.name)} ${fix2(t.history.at(-1)?.gap)}`,
      color: flaggedLast.has(t.taId) ? "var(--red-x)" : "var(--muted)",
      bold: false,
    })),
    {
      key: "avg",
      v: exams.at(-1)?.averageGap,
      text: `Course average ${fix2(exams.at(-1)?.averageGap)}`,
      color: "var(--ink)",
      bold: true,
    },
  ]
    .filter((l) => l.v != null)
    .map((l) => ({ ...l, y: y(l.v!) + 4 }))
    .sort((a, b) => a.y - b.y);
  for (let i = 1; i < labels.length; i++) {
    if (labels[i].y - labels[i - 1].y < 14) labels[i].y = labels[i - 1].y + 14;
  }

  const line = (values: (number | null)[]) =>
    values
      .map((v, i) => (v == null ? null : `${x(i).toFixed(1)},${y(v).toFixed(1)}`))
      .filter(Boolean)
      .join(" ");

  return (
    <Card className="fg-in fg-d4" padding="28px" fill>
      <SectionHeader
        title="Consistency over the semester"
        description="Average gap per paper for each TA, exam by exam. The black line is the course average."
      />
      <svg viewBox="0 0 640 380" width="100%" role="img" aria-label="Average gap per TA, exam by exam" style={{ display: "block", overflow: "visible", marginTop: "12px" }}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1="20" x2="480" y1={y(t)} y2={y(t)} stroke="rgba(var(--ink-rgb), 0.07)" />
            <text x="14" y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--muted)" fontFamily="Geist, sans-serif">
              {t.toFixed(1)}
            </text>
          </g>
        ))}
        {exams.map((e, i) => (
          <g key={e.examId}>
            <text x={x(i)} y="356" textAnchor="middle" fontSize="12" fill="var(--ink)" fontFamily="Geist, sans-serif">
              {e.name}
            </text>
            <text x={x(i)} y="372" textAnchor="middle" fontSize="11" fill="var(--muted)" fontFamily="Geist, sans-serif">
              {shortDate(e.heldAt)}
            </text>
          </g>
        ))}
        {board.map((t) => {
          const color = flaggedLast.has(t.taId) ? "var(--red)" : "var(--chart-grey)";
          const values = t.history.map((h) => h.gap);
          return (
            <g key={t.taId}>
              <polyline points={line(values)} fill="none" stroke={color} strokeWidth={flaggedLast.has(t.taId) ? 2.2 : 1.6} strokeLinejoin="round" />
              {values.map((v, i) =>
                v == null ? null : <circle key={i} cx={x(i)} cy={y(v)} r="3.2" fill="var(--surface)" stroke={color} strokeWidth="1.6" />,
              )}
            </g>
          );
        })}
        <polyline points={line(exams.map((e) => e.averageGap))} fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
        {exams.map((e, i) =>
          e.averageGap == null ? null : (
            <g key={e.examId}>
              <circle cx={x(i)} cy={y(e.averageGap)} r="5" fill="var(--ink)" />
              {i !== lastIndex && (
                <text x={x(i)} y={y(e.averageGap) - 12} textAnchor="middle" fontSize="12" fontWeight="600" fill="var(--ink)" fontFamily="Geist, sans-serif">
                  {e.averageGap.toFixed(2)}
                </text>
              )}
            </g>
          ),
        )}
        {labels.map((l) => (
          <text key={l.key} x="488" y={l.y} fontSize="11.5" fill={l.color} fontWeight={l.bold ? 600 : 400} fontFamily="Geist, sans-serif">
            {l.text}
          </text>
        ))}
      </svg>
    </Card>
  );
}

// ---------------------------------------------------------------- live activity

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const hm = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString()) return `Today ${hm}`;
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${hm}`;
  return `${shortDate(iso)} ${hm}`;
}

function describe(a: Activity, code: string): { text: ReactNode; icon: ReactNode; tone: string; pill?: ReactNode } {
  const id = (s?: string) => (
    <span style={{ fontFamily: MONO, fontSize: "12.5px", color: "var(--ink)", letterSpacing: "-0.01em" }}>{s}</span>
  );
  const b = (s: string) => <b style={{ fontWeight: 600 }}>{s}</b>;
  const sid = a.paper?.studentId;
  switch (a.type) {
    case "PAPER_DRAFT_SAVED":
      return {
        text: <>{b(first(a.actor?.name))} saved a draft of {id(sid)}</>,
        tone: "neutral",
        icon: (
          <svg {...svg(15)}>
            <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18z" />
            <path d="M14.5 6.5l3 3" />
          </svg>
        ),
      };
    case "PAPER_SUBMITTED":
      return {
        text: <>{b(first(a.actor?.name))} submitted {id(sid)}</>,
        tone: "amber",
        pill: a.paper?.status === "AI_GRADING" ? <Pill tone="amber" dot>AI grading</Pill> : undefined,
        icon: (
          <svg {...svg(15)}>
            <path d="M12 15.5V4.5" />
            <path d="M7.5 9l4.5-4.5L16.5 9" />
            <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
          </svg>
        ),
      };
    case "AI_GRADED": {
      const g = a.aiResult?.largestGap ?? 0;
      return {
        text: <>The AI graded {id(sid)} for {b(first(a.ta?.name))}</>,
        tone: "blue",
        pill:
          Math.abs(g) < 0.005 ? (
            <Pill>No gap</Pill>
          ) : (
            <Pill tone={g < 0 ? "red" : "blue"}>
              {signed(g, 1).replace(/\.0$/, "")} on {a.aiResult?.mostlyCode}
            </Pill>
          ),
        icon: <SparkIcon size={15} />,
      };
    }
    case "AI_FAILED":
      return {
        text: <>The AI could not grade {id(sid)} for {b(first(a.ta?.name))}</>,
        tone: "red",
        pill: <Pill tone="red">Retry needed</Pill>,
        icon: (
          <svg {...svg(15)}>
            <path d="M12 4.5l8.5 15h-17z" />
            <path d="M12 10v4M12 17h.01" />
          </svg>
        ),
      };
    case "TA_FLAGGED":
      return {
        text: (
          <>
            {b(first(a.ta?.name))} was flagged on {a.exam?.name} {a.questionCode}
          </>
        ),
        tone: "red",
        pill: <Pill tone="red" dot>Flag</Pill>,
        icon: (
          <svg {...svg(15)}>
            <path d="M12 4.5l8.5 15h-17z" />
            <path d="M12 10v4M12 17h.01" />
          </svg>
        ),
      };
    case "MEMBER_ADDED":
    case "MEMBER_REMOVED":
      return {
        text: (
          <>
            {b(first(a.member?.name))} was {a.type === "MEMBER_ADDED" ? "added to" : "removed from"} {code}
          </>
        ),
        tone: "neutral",
        icon: (
          <svg {...svg(15)}>
            <circle cx="9" cy="8.5" r="3.5" />
            <path d="M2.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5" />
            <path d="M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.7.7 3 2.3 3.5 4.7" />
          </svg>
        ),
      };
    case "PAPER_REOPENED":
    case "REOPEN_REQUESTED":
      return {
        text: (
          <>
            {b(first(a.actor?.name))} {a.type === "PAPER_REOPENED" ? "reopened" : "asked to reopen"} {id(sid)}
          </>
        ),
        tone: "amber",
        icon: (
          <svg {...svg(15)}>
            <path d="M4.5 12a7.5 7.5 0 1 0 2.2-5.3" />
            <path d="M4.5 4.5v4h4" />
          </svg>
        ),
      };
    default:
      return { text: a.type, tone: "neutral", icon: <SparkIcon size={15} /> };
  }
}

const TONE_BG: Record<string, { bg: string; fg: string }> = {
  neutral: { bg: "rgba(var(--ink-rgb), 0.06)", fg: "var(--ink)" },
  blue: { bg: "var(--blue-t)", fg: "var(--blue)" },
  amber: { bg: "var(--amber-t)", fg: "var(--amber)" },
  red: { bg: "var(--red-t)", fg: "var(--red)" },
};

function LiveActivity({ activity, code }: { activity: Activity[] | null; code: string }) {
  return (
    <Card className="fg-in fg-d4" padding="28px" fill>
      <SectionHeader title="Live activity" description="Grading and AI results as they happen.">
        <span style={{ display: "inline-flex", alignItems: "center", gap: "7px", fontSize: "12.5px", color: "var(--green-x)" }}>
          <span className="fg-pulse" style={{ width: "7px", height: "7px", borderRadius: "999px", background: "var(--green)" }} />
          Live
        </span>
      </SectionHeader>
      <div style={{ marginTop: "18px" }}>
        {activity == null && <p style={{ margin: 0, fontSize: "13.5px", color: "var(--muted)" }}>Loading…</p>}
        {activity?.length === 0 && <p style={{ margin: 0, fontSize: "13.5px", color: "var(--muted)" }}>Nothing yet.</p>}
        {activity?.map((a, i) => {
          const d = describe(a, code);
          const tone = TONE_BG[d.tone];
          const body = (
            <>
              <div style={{ fontSize: "13.5px", lineHeight: 1.45, color: "var(--text)" }}>{d.text}</div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                <span style={{ fontSize: "12px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>{timeLabel(a.createdAt)}</span>
                {d.pill}
              </div>
            </>
          );
          return (
            <div key={a.id} style={{ display: "grid", gridTemplateColumns: "30px minmax(0, 1fr)", gap: "12px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <span
                  style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "10px",
                    background: tone.bg,
                    color: tone.fg,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {d.icon}
                </span>
                {i < activity.length - 1 && (
                  <span style={{ flexGrow: 1, width: "1px", background: "rgba(var(--ink-rgb), 0.07)", margin: "4px 0" }} />
                )}
              </div>
              {a.paper?.id ? (
                <Link href={`/papers/${a.paper.id}`} style={{ padding: "4px 0 16px", minWidth: 0, textDecoration: "none", color: "inherit" }}>
                  {body}
                </Link>
              ) : (
                <div style={{ padding: "4px 0 16px", minWidth: 0 }}>{body}</div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- distribution

function Distribution({ stats }: { stats: Stats }) {
  const d = stats.distribution;
  const max = Math.max(1, ...d.bins.flatMap((b) => [b.ta, b.ai]));
  const pct = (n: number) => (d.total ? Math.round((n / d.total) * 100) : 0);
  const big = (color: string): CSSProperties => ({
    fontSize: "24px",
    fontWeight: 500,
    letterSpacing: "-0.04em",
    color,
    fontVariantNumeric: "tabular-nums",
    lineHeight: 1,
  });
  return (
    <Card className="fg-in fg-d5" padding="28px" fill>
      <SectionHeader title="Grade distribution" description={`All ${d.total} papers with both grades, out of 10.`}>
        <div style={{ display: "flex", gap: "14px", fontSize: "12.5px", color: "var(--muted)" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "var(--ink)" }} />
            TAs
          </span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: "var(--blue)" }} />
            AI
          </span>
        </div>
      </SectionHeader>
      <div style={{ position: "relative", display: "grid", gridTemplateColumns: "repeat(10, minmax(0, 1fr))", gap: "6px", marginTop: "28px" }}>
        {d.bins.map((bin) => (
          <div key={bin.from} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <div style={{ height: "170px", width: "100%", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "3px" }}>
              {(["ta", "ai"] as const).map((k) => (
                <span
                  key={k}
                  title={`${k === "ta" ? "TAs" : "AI"}: ${bin[k]}`}
                  style={{
                    width: "38%",
                    height: `${((bin[k] / max) * 100).toFixed(1)}%`,
                    minHeight: bin[k] ? "2px" : 0,
                    borderRadius: "6px 6px 2px 2px",
                    background: k === "ta" ? "var(--ink)" : "var(--blue)",
                    opacity: k === "ai" ? 0.85 : 1,
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: "11.5px", color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
              {bin.from}–{bin.to}
            </span>
          </div>
        ))}
        {d.passMark != null && (
          <>
            <span
              style={{
                position: "absolute",
                left: `${d.passMark * 10}%`,
                top: "-8px",
                bottom: "22px",
                width: 0,
                borderLeft: "1.5px dashed rgba(var(--ink-rgb), 0.35)",
              }}
            />
            <span style={{ position: "absolute", left: `${d.passMark * 10}%`, top: "-10px", marginLeft: "8px", fontSize: "11.5px", color: "var(--ink)", fontWeight: 500 }}>
              Pass
            </span>
          </>
        )}
      </div>
      <div
        className="fg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "16px",
          marginTop: "22px",
          paddingTop: "18px",
          borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
        }}
      >
        <div>
          <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Passed, TA grade</div>
          <div style={{ marginTop: "6px" }}>
            <span style={big("var(--ink)")}>{pct(d.passedTa)}%</span>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}> {d.passedTa} of {d.total}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Passed, AI grade</div>
          <div style={{ marginTop: "6px" }}>
            <span style={big("var(--blue-x)")}>{pct(d.passedAi)}%</span>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}> {d.passedAi} of {d.total}</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Average grade</div>
          <div style={{ marginTop: "6px" }}>
            <span style={big("var(--ink)")}>{d.taAverage?.toFixed(1) ?? "—"}</span>
            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}> vs </span>
            <span style={big("var(--blue-x)")}>{d.aiAverage?.toFixed(1) ?? "—"}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ---------------------------------------------------------------- rubrics to tighten

function Tighten({ stats, courseId }: { stats: Stats; courseId: string }) {
  const items = stats.questionsToTighten;
  const x = (g: number) => 50 + (Math.max(-2, Math.min(2, g)) / 2) * 50;
  const way = (g: number) =>
    Math.abs(g) < 0.005 ? "matches the AI" : `gives ${Math.abs(g).toFixed(2)} ${g < 0 ? "less" : "more"} than the AI`;
  const top = items[0];
  return (
    <Card className="fg-in fg-d5" padding="28px" fill>
      <SectionHeader title="Rubrics to tighten" description="Questions where the strictest and the most lenient TA are furthest apart." />
      {items.length === 0 && (
        <p style={{ margin: "18px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
          TAs agree with each other on every question so far.
        </p>
      )}
      <div style={{ marginTop: "8px" }}>
        {items.map((q, i) => {
          const band = (q.threshold / 2) * 100;
          const from = x(q.strictest.gap);
          const to = x(q.lenient.gap);
          return (
            <div key={q.questionId} style={{ padding: "14px 0", borderTop: i === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px" }}>
                <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                  <span style={{ color: "var(--faint)", marginRight: "6px" }}>
                    {q.examName} {q.code}
                  </span>
                  {q.title}
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)", whiteSpace: "nowrap", fontVariantNumeric: "tabular-nums" }}>
                  Spread {q.spread.toFixed(2)}
                </span>
              </div>
              <div style={{ position: "relative", height: "26px", margin: "10px 0 8px" }}>
                <span
                  style={{
                    position: "absolute",
                    left: `${50 - band / 2}%`,
                    width: `${band}%`,
                    top: "4px",
                    bottom: "4px",
                    borderRadius: "6px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                  }}
                />
                <span style={{ position: "absolute", left: "50%", top: 0, bottom: 0, width: "1.5px", marginLeft: "-0.75px", background: "var(--ink)" }} />
                <span style={{ position: "absolute", left: `${from}%`, width: `${to - from}%`, top: "12px", height: "2px", background: "rgba(var(--ink-rgb), 0.25)" }} />
                {q.gaps.slice(1, -1).map((g) => (
                  <span
                    key={g.taName}
                    title={`${g.taName} ${signed(g.gap)}`}
                    style={{
                      position: "absolute",
                      left: `${x(g.gap)}%`,
                      top: "13px",
                      width: "7px",
                      height: "7px",
                      borderRadius: "999px",
                      background: "var(--chart-grey)",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                ))}
                <span
                  title={`${q.strictest.taName} ${signed(q.strictest.gap)}`}
                  style={{ position: "absolute", left: `${from}%`, top: "13px", width: "11px", height: "11px", borderRadius: "999px", background: "var(--red)", transform: "translate(-50%, -50%)" }}
                />
                <span
                  title={`${q.lenient.taName} ${signed(q.lenient.gap)}`}
                  style={{ position: "absolute", left: `${to}%`, top: "13px", width: "11px", height: "11px", borderRadius: "999px", background: "var(--blue)", transform: "translate(-50%, -50%)" }}
                />
              </div>
              <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.5, color: "var(--muted)" }}>
                {q.outlier ? `${first(q.outlier.taName)} is the outlier. ` : ""}
                On average {first(q.strictest.taName)} {way(q.strictest.gap)} and {first(q.lenient.taName)}{" "}
                {way(q.lenient.gap)}. A clearer rubric line would bring them together.
              </p>
            </div>
          );
        })}
      </div>
      {top && (
        <div style={{ marginTop: "10px" }}>
          <SecondaryButton
            href={`/courses/${courseId}/exams/${top.examId}/setup`}
            icon={
              <svg {...svg(16)}>
                <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
                <circle cx="16" cy="7" r="2" />
                <circle cx="10" cy="17" r="2" />
              </svg>
            }
          >
            <span>Edit the {/\d/.test(top.examName) ? top.examName : top.examName.toLowerCase()} rubric</span>
          </SecondaryButton>
        </div>
      )}
    </Card>
  );
}
