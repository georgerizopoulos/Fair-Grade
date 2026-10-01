"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AppShell, Button, Card, PageHeader, PageTitle, Pill } from "@/components/shell";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth";

interface CourseSummary {
  id: string;
  code: string | null;
  name: string;
  semester: string | null;
  examCount: number;
  taCount: number;
  latestExam: { id: string; name: string; status: string } | null;
}

const CURRENT_SEMESTER = "Winter 2026–27";

const PILL_TONE: Record<string, "red" | "green" | "blue" | undefined> = {
  OPEN: "blue",
  PUBLISHED: "green",
  DRAFT: undefined,
  QUESTIONS_READY: undefined,
};

export default function CoursesPage() {
  const user = useSession();
  const [showAll, setShowAll] = useState(false);
  const [courses, setCourses] = useState<CourseSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ courses: CourseSummary[] }>("/courses")
      .then(({ courses: c }) => setCourses(c))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load courses"))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;

  const currentCourses = courses.filter((c) => c.semester === CURRENT_SEMESTER);
  const pastCourses = courses.filter((c) => c.semester !== CURRENT_SEMESTER);
  const visible = showAll ? courses : currentCourses;

  return (
    <AppShell active="courses">
      <PageHeader crumbs={[{ label: "All courses" }]}>
        {user.role === "instructor" && (
          <Button
            size="lg"
            icon={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
          >
            New course
          </Button>
        )}
      </PageHeader>
      <PageTitle
        title={<>Courses</>}
        description={<>Every course you teach or assist in. TAs only see the courses they have been added to.</>}
      />
      <Card className="fg-in fg-d1">
        {/* Filter tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "18px" }}>
          <div role="radiogroup" aria-label="Filter courses" style={{ display: "inline-flex", padding: "4px", borderRadius: "999px", background: "rgba(var(--ink-rgb), 0.05)", gap: "2px" }}>
            <FilterTab active={!showAll} onClick={() => setShowAll(false)}>
              This semester
            </FilterTab>
            {pastCourses.length > 0 && (
              <FilterTab active={showAll} onClick={() => setShowAll(true)}>
                All {courses.length}
              </FilterTab>
            )}
          </div>
          <div style={{ width: "280px" }}>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: "14px", top: "12px", color: "var(--faint)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
                  <circle cx="11" cy="11" r="6.5" /><path d="M16 16l4 4" />
                </svg>
              </span>
              <input id="cs" type="text" placeholder="Search courses" aria-label="Search courses" style={{ width: "100%", height: "44px", padding: "0 14px 0 42px", border: 0, borderRadius: "12px", background: "var(--surface)", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)", fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif", fontSize: "14px", color: "var(--text)", outline: "none" }} />
            </div>
          </div>
        </div>

        {/* Column headers */}
        <div className="fg-hide-sm" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px", gap: "16px", padding: "0 20px 10px", fontSize: "12.5px", color: "var(--muted)" }}>
          <span>Course</span><span>Semester</span><span>Exams</span><span>TAs</span><span>Latest exam</span><span />
        </div>

        {/* Course rows */}
        <div style={{ borderRadius: "18px", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)", overflow: "hidden" }}>
          {loading && <p style={{ padding: "20px", color: "var(--muted)" }}>Loading courses…</p>}
          {error && <p style={{ padding: "20px", color: "var(--red-x)" }}>{error}</p>}
          {!loading && visible.length === 0 && <p style={{ padding: "20px", color: "var(--muted)" }}>No courses found.</p>}

          {visible.map((course, i) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px",
                gap: "16px",
                alignItems: "center",
                padding: "16px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: i === 0 ? "0" : "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              {/* Course name + code */}
              <span style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
                <span style={{ width: "40px", height: "40px", borderRadius: "12px", background: course.semester === CURRENT_SEMESTER ? "var(--blue-t)" : "rgba(var(--ink-rgb), 0.06)", color: course.semester === CURRENT_SEMESTER ? "var(--blue-x)" : "var(--text-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600, flexShrink: 0 }}>
                  {course.code?.replace(/\D/g, "") || "—"}
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ fontSize: "15px", fontWeight: 500, color: "var(--ink)" }}>{course.name}</span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>{course.code}</span>
                </span>
              </span>

              <span style={{ fontSize: "13.5px", color: "var(--muted)" }}>{course.semester ?? "—"}</span>
              <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>{course.examCount}</span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>
                {course.taCount === 0 ? "No TAs yet" : `${course.taCount} TAs`}
              </span>

              {/* Latest exam */}
              <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                {course.latestExam ? (
                  <>
                    <span style={{ fontSize: "13.5px", color: "var(--ink)" }}>{course.latestExam.name}</span>
                    <Pill tone={PILL_TONE[course.latestExam.status]} dot>
                      {course.latestExam.status.replaceAll("_", " ")}
                    </Pill>
                  </>
                ) : (
                  <span style={{ fontSize: "13px", color: "var(--faint)" }}>No exams</span>
                )}
              </span>

              <span style={{ color: "var(--faint)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ flexShrink: 0, display: "block" }}>
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      className="fg-press"
      onClick={onClick}
      style={{
        height: "34px",
        padding: "0 14px",
        border: 0,
        borderRadius: "999px",
        fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
        fontSize: "13.5px",
        fontWeight: 500,
        cursor: "pointer",
        background: active ? "var(--raised)" : "transparent",
        color: active ? "var(--ink)" : "var(--muted)",
        boxShadow: active ? "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)" : undefined,
      }}
    >
      {children}
    </button>
  );
}
