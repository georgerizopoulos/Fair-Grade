"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AppShell,
  Avatar,
  Card,
  NoAccess,
  Notice,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";
import {
  ArrowUpRight,
  Chevron,
  FlagAvatar,
  GapCell,
  Kpi,
  MONO_ID,
  Segmented,
  TABLE_FRAME,
  TaAvatar,
  TableHead,
  downloadCsv,
  gapColor,
  pts,
  rowStyle,
  signed,
  svg,
} from "./report-ui";

// Exam report for the instructor (design: Report.html), from GET /exams/:id/report.

interface QuestionGap {
  code: string;
  averageGap: number | null;
  sampleSize: number;
  flagged: boolean;
}

interface Report {
  exam: { id: string; name: string; maxTotal: number; passMark: number };
  course: { id: string; code: string | null; name: string };
  totalPapers: number;
  submittedPapers: number;
  aiGradedPapers: number;
  aiGradingPapers: number;
  aiFailedPapers: number;
  taAverage: number | null;
  aiAverage: number | null;
  flaggedTaCount: number;
  passing: { passMark: number; comparedPapers: number; passedTa: number; passedAi: number; differ: number };
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
  questions: {
    questionId: string;
    code: string;
    title: string;
    maxPoints: number;
    threshold: number;
    tas: { taId: string; taName: string; averageGap: number | null; sampleSize: number; flagged: boolean }[];
  }[];
  tas: {
    taId: string;
    taName: string;
    email: string;
    papersGraded: number;
    taAverage: number | null;
    aiAverage: number | null;
    paperGap: number | null;
    flagged: boolean;
    flaggedQuestionCodes: string[];
    questions: QuestionGap[];
  }[];
  papers: {
    paperId: string;
    studentId: string;
    taId: string;
    taName: string;
    taTotal: number | null;
    aiTotal: number | null;
    gap: number | null;
    mostlyCode: string | null;
    passedTa: boolean | null;
    passedAi: boolean | null;
  }[];
}

type PassFilter = "all" | "passed" | "failed" | "differ";

const TA_COLUMNS = "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px";
const PAPER_COLUMNS = "130px minmax(0, 1fr) 100px 100px 100px 90px 24px";
const PASS_COLUMNS = "130px minmax(0, 1fr) 100px 100px 110px 110px 24px";
const firstName = (name: string) => name.split(" ")[0];

export function ExamReportLivePage() {
  const { courseId, examId } = useParams<{ courseId: string; examId: string }>();
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [passFilter, setPassFilter] = useState<PassFilter>("all");
  const [showAllResults, setShowAllResults] = useState(false);

  useEffect(() => {
    let cancelled = false;
    apiFetch<Report>(`/exams/${examId}/report`)
      .then((r) => !cancelled && setReport(r))
      .catch((e) => !cancelled && setError(e instanceof Error ? e : new Error("Could not load")));
    return () => {
      cancelled = true;
    };
  }, [examId]);

  const shellCourse = {
    id: courseId,
    code: report?.course.code ?? report?.course.name ?? "",
    name: report?.course.name ?? "",
  };
  const shellExam = report
    ? { id: examId, name: report.exam.name, flagged: report.flaggedTaCount || undefined }
    : undefined;

  if (error) {
    const denied = error instanceof ApiError && (error.status === 403 || error.status === 404);
    return (
      <AppShell course={shellCourse} active="report" access="instructor">
        {denied ? <NoAccess /> : <Notice tone="error">{error.message}</Notice>}
      </AppShell>
    );
  }
  if (!report) {
    return (
      <AppShell course={shellCourse} exam={shellExam} active="report" access="instructor">
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Loading the report…</p>
      </AppShell>
    );
  }

  const { exam, course, headline, tas, papers } = report;
  const base = `/courses/${courseId}/exams/${examId}`;
  const flaggedCodes = [...new Set(tas.flatMap((t) => t.flaggedQuestionCodes))];
  const shownPapers = showAll ? papers : papers.slice(0, 5);

  const verdict = (passed: boolean | null) => (passed == null ? "" : passed ? "passed" : "failed");
  const byStudent = papers.slice().sort((a, b) => a.studentId.localeCompare(b.studentId));
  const passedPapers = byStudent.filter((p) => p.passedTa);
  const fileName = (suffix: string) => `${course.code ?? "course"}-${exam.name}-${suffix}.csv`.replace(/\s+/g, "-");

  function exportGrades() {
    downloadCsv(fileName("grades"), [
      ["student_id", "graded_by", "ta_total", "ai_total", "gap", "max_total", "pass_mark", "ta_result", "ai_result"],
      ...byStudent.map((p) => [
        p.studentId,
        p.taName,
        p.taTotal,
        p.aiTotal,
        p.gap,
        exam.maxTotal,
        exam.passMark,
        verdict(p.passedTa),
        verdict(p.passedAi),
      ]),
    ]);
  }

  // Everyone whose TA grade reaches the pass mark, with the AI's verdict beside it.
  function exportPassed() {
    downloadCsv(fileName("passed"), [
      ["student_id", "graded_by", "ta_total", "ai_total", "max_total", "pass_mark", "ai_result"],
      ...passedPapers.map((p) => [p.studentId, p.taName, p.taTotal, p.aiTotal, exam.maxTotal, exam.passMark, verdict(p.passedAi)]),
    ]);
  }

  const resultRows = byStudent.filter((p) =>
    passFilter === "passed"
      ? p.passedTa
      : passFilter === "failed"
        ? p.passedTa === false
        : passFilter === "differ"
          ? p.passedTa != null && p.passedAi != null && p.passedTa !== p.passedAi
          : true,
  );
  const shownResults = showAllResults ? resultRows : resultRows.slice(0, 10);

  return (
    <AppShell course={shellCourse} exam={shellExam} active="report" access="instructor">
      <PageHeader
        crumbs={[
          { label: [course.code, course.name].filter(Boolean).join(" "), href: `/courses/${courseId}` },
          { label: exam.name, href: `${base}/setup` },
          { label: "Report" },
        ]}
      >
        <SecondaryButton
          onClick={exportGrades}
          disabled={papers.length === 0}
          icon={
            <svg {...svg(16)}>
              <path d="M12 15.5V4.5" />
              <path d="M7.5 9l4.5-4.5L16.5 9" />
              <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
            </svg>
          }
        >
          <span>Export grades</span>
        </SecondaryButton>
        <SecondaryButton
          onClick={exportPassed}
          disabled={passedPapers.length === 0}
          icon={
            <svg {...svg(16)}>
              <path d="M5 12.5l4.5 4.5L19 7.5" />
            </svg>
          }
        >
          <span>Export passed</span>
        </SecondaryButton>
      </PageHeader>
      <PageTitle
        title={`${exam.name} report`}
        description={
          <>
            Every submitted paper has a TA grade and an AI grade. This is where they disagree, by TA
            and by question.
          </>
        }
      />

      <div
        className="fg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div className="fg-span" style={{ gridColumn: "span 7", minWidth: 0, alignSelf: "stretch" }}>
          <Headline report={report} reviewHref={headline ? `${base}/report/${headline.taId}` : undefined} />
        </div>
        <div className="fg-span" style={{ gridColumn: "span 5", minWidth: 0 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <Kpi
              label="Papers graded"
              value={report.submittedPapers}
              note={`By ${tas.length} TA${tas.length === 1 ? "" : "s"}`}
            />
            <Kpi
              label="AI graded"
              value={report.aiGradedPapers}
              unit={`/ ${report.submittedPapers}`}
              note={
                report.aiFailedPapers > 0
                  ? `${report.aiGradingPapers} being graded, ${report.aiFailedPapers} failed`
                  : `${report.aiGradingPapers} being graded now`
              }
            />
            <Kpi
              className="fg-in fg-d3"
              label="Average TA grade"
              value={pts(report.taAverage)}
              unit={`/ ${pts(exam.maxTotal)}`}
              note={`AI average ${pts(report.aiAverage)}`}
            />
            <Kpi
              className="fg-in fg-d3"
              label="Flagged"
              value={report.flaggedTaCount}
              color={report.flaggedTaCount > 0 ? "var(--red)" : undefined}
              unit={`of ${tas.length} TA${tas.length === 1 ? "" : "s"}`}
              note={flaggedCodes.length ? `On ${flaggedCodes.join(", ")}` : "Nobody outside the threshold"}
            />
          </div>
        </div>

        <div className="fg-span" style={{ gridColumn: "span 12", minWidth: 0 }}>
          <GapPerQuestion report={report} />
        </div>

        <div className="fg-span" style={{ gridColumn: "span 12", minWidth: 0 }}>
          <Card className="fg-in fg-d5" padding="26px">
            <SectionHeader
              title="Teaching assistants"
              description="Average paper grade, TA versus AI, and the gap on each question."
            />
            {tas.length === 0 ? (
              <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>
                No AI-graded papers yet. TAs show up here once the AI has graded one of their papers.
              </p>
            ) : (
              <>
                <TableHead
                  columns={TA_COLUMNS}
                  labels={[
                    "TA",
                    "Papers",
                    "TA / AI avg",
                    "Paper gap",
                    `Gap per question, ${report.questions[0]?.code ?? ""} to ${report.questions.at(-1)?.code ?? ""}`,
                    "Status",
                    "",
                  ]}
                />
                <div style={TABLE_FRAME}>
                  {tas.map((t, i) => (
                    <Link
                      key={t.taId}
                      href={`${base}/report/${t.taId}`}
                      className="fg-row"
                      style={rowStyle(TA_COLUMNS, i === 0)}
                    >
                      <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                        <TaAvatar name={t.taName} flagged={t.flagged} size={34} />
                        <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                            {t.taName}
                          </span>
                          <span style={{ ...MONO_ID, fontSize: "12px", color: "var(--muted)" }}>{t.email}</span>
                        </span>
                      </span>
                      <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                        {t.papersGraded}
                      </span>
                      <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                        {t.taAverage?.toFixed(1) ?? "—"} <span style={{ color: "var(--faint)" }}>/</span>{" "}
                        <span style={{ color: "var(--blue-x)" }}>{t.aiAverage?.toFixed(1) ?? "—"}</span>
                      </span>
                      <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums", color: gapColor(t.paperGap) }}>
                        {signed(t.paperGap)}
                      </span>
                      <div style={{ display: "flex", gap: "4px" }}>
                        {t.questions.map((q, qi) => (
                          <GapCell
                            key={q.code}
                            gap={q.averageGap}
                            flagged={q.flagged}
                            threshold={report.questions[qi]?.threshold ?? 0.5}
                          />
                        ))}
                      </div>
                      <span>
                        {t.flagged ? (
                          <Pill tone="red" dot>
                            Flagged
                          </Pill>
                        ) : (
                          <Pill tone="green" dot>
                            OK
                          </Pill>
                        )}
                      </span>
                      <Chevron />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>

        <div className="fg-span" style={{ gridColumn: "span 12", minWidth: 0 }}>
          <Card className="fg-in fg-d5" padding="26px">
            <SectionHeader
              title="Who passed"
              description={`Pass mark ${pts(exam.passMark)} of ${pts(exam.maxTotal)}. The TA's grade decides; the AI's verdict is shown next to it.`}
            >
              <SecondaryButton
                onClick={exportPassed}
                disabled={passedPapers.length === 0}
                icon={
                  <svg {...svg(16)}>
                    <path d="M12 15.5V4.5" />
                    <path d="M7.5 9l4.5-4.5L16.5 9" />
                    <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
                  </svg>
                }
              >
                <span>Export passed ({passedPapers.length})</span>
              </SecondaryButton>
            </SectionHeader>
            {papers.length === 0 ? (
              <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>
                Nobody to show yet. Papers appear here once the AI has graded them.
              </p>
            ) : (
              <>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "20px" }}>
                  <PassStat
                    label="Passed, by the TA"
                    value={report.passing.passedTa}
                    of={report.passing.comparedPapers}
                  />
                  <PassStat
                    label="Passed, by the AI"
                    value={report.passing.passedAi}
                    of={report.passing.comparedPapers}
                    color="var(--blue-x)"
                  />
                  <PassStat
                    label="TA and AI disagree"
                    value={report.passing.differ}
                    of={report.passing.comparedPapers}
                    color={report.passing.differ > 0 ? "var(--red-x)" : undefined}
                  />
                </div>
                <div style={{ marginBottom: "6px" }}>
                  <Segmented<PassFilter>
                    label="Filter papers by result"
                    value={passFilter}
                    onChange={(v) => {
                      setPassFilter(v);
                      setShowAllResults(false);
                    }}
                    options={[
                      { value: "all", label: `All ${papers.length}` },
                      { value: "passed", label: `Passed ${report.passing.passedTa}` },
                      { value: "failed", label: `Not passed ${report.passing.comparedPapers - report.passing.passedTa}` },
                      { value: "differ", label: `Disagree ${report.passing.differ}` },
                    ]}
                  />
                </div>
                {resultRows.length === 0 ? (
                  <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>No papers match this filter.</p>
                ) : (
                  <>
                    <TableHead
                      columns={PASS_COLUMNS}
                      labels={["Student ID", "Graded by", "TA", "AI", "TA result", "AI result", ""]}
                    />
                    <div style={TABLE_FRAME}>
                      {shownResults.map((p, i) => (
                        <Link
                          key={p.paperId}
                          href={`/papers/${p.paperId}`}
                          className="fg-row"
                          style={rowStyle(PASS_COLUMNS, i === 0, "13px 20px")}
                        >
                          <span style={{ ...MONO_ID, fontSize: "13.5px", color: "var(--ink)" }}>{p.studentId}</span>
                          <span style={{ fontSize: "13.5px" }}>{p.taName}</span>
                          <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>{pts(p.taTotal)}</span>
                          <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums", color: "var(--blue-x)" }}>
                            {pts(p.aiTotal)}
                          </span>
                          <span>
                            {p.passedTa == null ? (
                              <span style={{ color: "var(--faint)" }}>—</span>
                            ) : (
                              <Pill tone={p.passedTa ? "green" : "neutral"}>{p.passedTa ? "Passed" : "Not passed"}</Pill>
                            )}
                          </span>
                          <span>
                            {p.passedAi == null ? (
                              <span style={{ color: "var(--faint)" }}>—</span>
                            ) : (
                              <Pill tone={p.passedAi === p.passedTa ? "blue" : "amber"}>
                                {p.passedAi ? "Passed" : "Not passed"}
                              </Pill>
                            )}
                          </span>
                          <Chevron />
                        </Link>
                      ))}
                    </div>
                    {resultRows.length > 10 && (
                      <div style={{ marginTop: "14px" }}>
                        <SecondaryButton onClick={() => setShowAllResults((v) => !v)}>
                          <span>{showAllResults ? "Show the first 10" : `Show all ${resultRows.length}`}</span>
                        </SecondaryButton>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </Card>
        </div>

        <div className="fg-span" style={{ gridColumn: "span 12", minWidth: 0 }}>
          <Card className="fg-in fg-d5" padding="26px">
            <SectionHeader
              title="Largest gaps on a single paper"
              description="Open a paper to see the scan, both grades and the AI's reasoning."
            >
              {papers.length > 5 && (
                <SecondaryButton
                  onClick={() => setShowAll((v) => !v)}
                  icon={
                    <svg {...svg(16)}>
                      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                      <path d="M13.5 3.5V9H19" />
                    </svg>
                  }
                >
                  <span>{showAll ? "Show the top 5" : `All ${papers.length} papers`}</span>
                </SecondaryButton>
              )}
            </SectionHeader>
            {papers.length === 0 ? (
              <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>
                Nothing to compare yet.
              </p>
            ) : (
              <>
                <TableHead
                  columns={PAPER_COLUMNS}
                  labels={["Student ID", "Graded by", "TA", "AI", "Gap", "Mostly", ""]}
                />
                <div style={TABLE_FRAME}>
                  {shownPapers.map((p, i) => (
                    <Link
                      key={p.paperId}
                      href={`/papers/${p.paperId}`}
                      className="fg-row"
                      style={rowStyle(PAPER_COLUMNS, i === 0, "13px 20px")}
                    >
                      <span style={{ ...MONO_ID, fontSize: "13.5px", color: "var(--ink)" }}>{p.studentId}</span>
                      <span style={{ fontSize: "13.5px" }}>{p.taName}</span>
                      <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                        {pts(p.taTotal)} / {pts(exam.maxTotal)}
                      </span>
                      <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums", color: "var(--blue-x)" }}>
                        {pts(p.aiTotal)} / {pts(exam.maxTotal)}
                      </span>
                      <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums", color: gapColor(p.gap) }}>
                        {signed(p.gap)}
                      </span>
                      <span>{p.mostlyCode ? <Pill>{p.mostlyCode}</Pill> : <span style={{ color: "var(--faint)" }}>—</span>}</span>
                      <Chevron />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  );
}

function PassStat({ label, value, of, color }: { label: string; value: number; of: number; color?: string }) {
  const share = of > 0 ? Math.round((value / of) * 100) : 0;
  return (
    <div style={{ padding: "16px 18px", borderRadius: "14px", background: "rgba(var(--ink-rgb), 0.04)" }}>
      <div style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</div>
      <div style={{ marginTop: "8px" }}>
        <span style={{ fontSize: "28px", fontWeight: 500, letterSpacing: "-0.03em", color: color ?? "var(--ink)" }}>{value}</span>
        <span style={{ fontSize: "15px", color: "var(--muted)" }}> / {of}</span>
        <span style={{ marginLeft: "10px", fontSize: "13px", color: "var(--muted)" }}>{share}%</span>
      </div>
    </div>
  );
}

function Headline({ report, reviewHref }: { report: Report; reviewHref?: string }) {
  const h = report.headline;
  let title: React.ReactNode;
  let body: React.ReactNode;
  let pill = "Flag raised";
  if (h) {
    const first = firstName(h.taName);
    const gap = h.paperGap ?? 0;
    const share = gap !== 0 ? h.questionGap / gap : 0;
    const where =
      share >= 0.7
        ? `almost all of it on ${h.questionCode}`
        : share >= 0.4
          ? `most of it on ${h.questionCode}`
          : `and is furthest off on ${h.questionCode}`;
    title = (
      <>
        {h.taName} gives papers{" "}
        <span style={{ color: gap < 0 ? "#F29B9B" : "#A9BBFF" }}>
          {Math.abs(gap).toFixed(1)} points {gap < 0 ? "less" : "more"}
        </span>{" "}
        than the AI on average, {where}.
      </>
    );
    body = (
      <>
        On {h.questionCode}, {h.questionTitle}, {first}&apos;s average gap is {signed(h.questionGap)} across{" "}
        {h.papersGraded} papers. The threshold for a {pts(h.maxPoints)}-point question is {h.threshold.toFixed(2)}.
      </>
    );
  } else if (report.aiGradedPapers === 0) {
    pill = "Waiting for papers";
    title = <>No papers have been graded by the AI yet.</>;
    body = <>As TAs submit papers, the AI grades them and the comparison shows up here.</>;
  } else {
    pill = "No flags";
    title = <>Every TA is within the threshold on every question.</>;
    body = (
      <>
        A TA is flagged when their average gap on a question is more than 15% of its points, over at
        least 3 papers. {report.aiGradedPapers} papers compared so far.
      </>
    );
  }

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
          background: h
            ? "radial-gradient(600px 300px at 100% 0%, #2B2230 0%, rgba(43, 34, 48, 0) 70%), var(--ink)"
            : "radial-gradient(600px 300px at 100% 0%, #22302A 0%, rgba(34, 48, 42, 0) 70%), var(--ink)",
          borderRadius: "23px",
          padding: "30px",
          boxShadow:
            "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
          height: "100%",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
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
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "999px",
                background: h ? "#E8EAEE" : "#7FD3A4",
              }}
            />
            {pill}
          </span>
          <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>
            {report.submittedPapers} paper{report.submittedPapers === 1 ? "" : "s"} so far
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
            maxWidth: "580px",
          }}
        >
          {title}
        </p>
        <p style={{ margin: "14px 0 0", fontSize: "14px", color: "#A6ACB8", lineHeight: 1.6, maxWidth: "540px" }}>
          {body}
        </p>
        {h && reviewHref && (
          <div style={{ marginTop: "26px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href={reviewHref}
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
              <span>Review {firstName(h.taName)}&apos;s papers</span>
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
                <ArrowUpRight stroke="var(--surface)" />
              </span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// One row per question: each TA is a dot at their average gap; the shaded band
// is ±threshold. Dots that would overlap are stacked vertically.
function GapPerQuestion({ report }: { report: Report }) {
  const all = report.questions.flatMap((q) => q.tas.map((t) => Math.abs(t.averageGap ?? 0)));
  const range = Math.max(2, Math.ceil(Math.max(0, ...all)));
  const x = (gap: number) => 50 + (Math.max(-range, Math.min(range, gap)) / range) * 50;
  const ticks = [-range, -range / 2, 0, range / 2, range];
  const COLS = "230px minmax(0, 1fr) 130px";

  return (
    <Card className="fg-in fg-d4" padding="28px">
      <SectionHeader
        title="Gap per question"
        description="Each dot is a TA's average gap from the AI on one question. Dots outside the shaded band are flagged."
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "center", fontSize: "12.5px", color: "var(--muted)" }}>
          <FlagAvatar name={report.tas.find((t) => t.flagged)?.taName ?? "M"} size={22} />
          <span>Flagged</span>
          <Avatar initial={(report.tas.find((t) => !t.flagged)?.taName ?? "N").charAt(0)} size={22} />
          <span>Within threshold</span>
        </div>
      </SectionHeader>
      {report.questions.length === 0 && (
        <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--muted)" }}>This exam has no questions yet.</p>
      )}
      {report.questions.map((q, qi) => {
        const outside = q.tas.filter((t) => t.flagged).length;
        const placed: { left: number; offset: number }[] = [];
        const dots = q.tas
          .filter((t) => t.averageGap != null)
          .sort((a, b) => a.averageGap! - b.averageGap!)
          .map((t) => {
            const left = x(t.averageGap!);
            const taken = placed.filter((p) => Math.abs(p.left - left) < 3.2).map((p) => p.offset);
            const offset = [0, -23, 23, -46, 46].find((o) => !taken.includes(o)) ?? 0;
            placed.push({ left, offset });
            return { t, left, offset };
          });
        const band = (q.threshold / range) * 100;
        return (
          <div
            key={q.questionId}
            style={{
              display: "grid",
              gridTemplateColumns: COLS,
              gap: "24px",
              alignItems: "center",
              borderTop: qi === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: 0 }}>
              <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>{q.code}</span>
                {q.title}
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                {pts(q.maxPoints)} points. Flag beyond ±{q.threshold.toFixed(2)}
              </span>
            </div>
            <div style={{ position: "relative", height: "128px" }}>
              <span
                style={{
                  position: "absolute",
                  left: `${50 - band / 2}%`,
                  width: `${band}%`,
                  top: "10px",
                  bottom: "10px",
                  borderRadius: "10px",
                  background: "rgba(var(--ink-rgb), 0.045)",
                }}
              />
              {[0, 25, 75, 100].map((l) => (
                <span
                  key={l}
                  style={{
                    position: "absolute",
                    left: `${l}%`,
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    background: "rgba(var(--ink-rgb), 0.07)",
                  }}
                />
              ))}
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: 0,
                  bottom: 0,
                  width: "1.5px",
                  marginLeft: "-0.75px",
                  background: "var(--ink)",
                }}
              />
              {dots.map(({ t, left, offset }) => (
                <span key={t.taId}>
                  <span
                    title={`${t.taName} ${signed(t.averageGap)} over ${t.sampleSize} papers`}
                    style={{
                      position: "absolute",
                      left: `${left}%`,
                      top: `calc(50% + ${offset}px)`,
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <TaAvatar name={t.taName} flagged={t.flagged} size={26} />
                  </span>
                  {t.flagged && (
                    <span
                      style={{
                        position: "absolute",
                        ...(left > 80
                          ? { right: `calc(${100 - left}% + 21px)` }
                          : { left: `calc(${left}% + 21px)` }),
                        top: `calc(50% + ${offset}px - 11px)`,
                        height: "22px",
                        padding: "0 8px",
                        borderRadius: "999px",
                        background: t.averageGap! < 0 ? "var(--red)" : "var(--blue)",
                        color: "var(--surface)",
                        fontSize: "12px",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {signed(t.averageGap)}
                    </span>
                  )}
                </span>
              ))}
            </div>
            <div style={{ textAlign: "right" }}>
              {outside === 0 ? (
                <Pill tone="green" dot>
                  All within
                </Pill>
              ) : (
                <Pill tone="red" dot>
                  {outside} TA{outside === 1 ? "" : "s"} outside
                </Pill>
              )}
            </div>
          </div>
        );
      })}
      {report.questions.length > 0 && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: "24px", marginTop: "6px" }}>
            <span />
            <div
              style={{
                position: "relative",
                height: "18px",
                fontSize: "12px",
                color: "var(--muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {ticks.map((t) => (
                <span
                  key={t}
                  style={{ position: "absolute", left: `${x(t)}%`, transform: "translateX(-50%)" }}
                >
                  {t === 0 ? "AI" : signed(t, Number.isInteger(t) ? 0 : 1)}
                </span>
              ))}
            </div>
            <span />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: COLS, gap: "24px", marginTop: "6px" }}>
            <span />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}>
              <span style={{ color: "var(--red-x)" }}>Stricter than the AI</span>
              <span style={{ color: "var(--blue-x)" }}>More lenient</span>
            </div>
            <span />
          </div>
        </>
      )}
    </Card>
  );
}
