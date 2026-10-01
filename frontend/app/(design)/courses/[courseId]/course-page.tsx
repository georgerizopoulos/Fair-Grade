"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, FileUp, Plus, Settings } from "lucide-react";
import {
  AppShell,
  Button,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  RoleChip,
  SecondaryButton,
  SectionHeader,
  YouTag,
  type PillTone,
} from "@/components/shell";
import { apiFetch } from "@/lib/api";
import { useSession } from "@/lib/auth";

interface CourseExam {
  id: string;
  name: string;
  heldAt: string | null;
  status: "DRAFT" | "QUESTIONS_READY" | "OPEN" | "PUBLISHED";
  passMark: number;
  questionCount: number;
  canAddPapers?: boolean;
  progress: {
    papers: number;
    drafts: number;
    submitted: number;
    aiGrading: number;
    aiGraded: number;
    aiFailed: number;
  };
}

interface CourseMember {
  userId: string;
  name: string;
  email: string;
  role: "instructor" | "ta";
  addedAt: string;
  isYou: boolean;
}

interface CourseDetail {
  viewerRole: "instructor" | "ta";
  id: string;
  code: string | null;
  name: string;
  semester: string | null;
  leaderboardVisibility?: "OFF" | "ANONYMOUS" | "NAMED";
  owner: { id: string; name: string; isYou: boolean } | null;
  exams: CourseExam[];
  members: CourseMember[];
}

const EXAM_STATUS: Record<CourseExam["status"], { label: string; tone: PillTone }> = {
  DRAFT: { label: "Draft", tone: "neutral" },
  QUESTIONS_READY: { label: "Questions ready", tone: "blue" },
  OPEN: { label: "Open for grading", tone: "amber" },
  PUBLISHED: { label: "Grades published", tone: "green" },
};

function formatHeld(heldAt: string | null) {
  if (!heldAt) return "No date set";
  return new Date(heldAt).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function CourseLivePage() {
  const user = useSession();
  const router = useRouter();
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setLoading(true);
    apiFetch<CourseDetail>(`/courses/${courseId}`)
      .then((data) => {
        if (!cancelled) {
          setCourse(data);
          setError("");
        }
      })
      .catch((cause) => {
        if (cancelled) return;
        const message = cause instanceof Error ? cause.message : "Could not load course";
        if (message.includes("not found") || message.includes("Cannot GET")) {
          apiFetch<{ courses: { id: string; code: string | null }[] }>("/courses")
            .then(({ courses }) => {
              const match = courses.find(
                (candidate) => candidate.code?.toLowerCase() === courseId.toLowerCase(),
              );
              if (match) {
                router.replace(`/courses/${match.id}`);
                return;
              }
              setError(message);
            })
            .catch(() => setError(message));
        } else {
          setError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [courseId, router, user]);

  const shellCourse = course
    ? { id: course.id, code: course.code ?? course.name, name: course.name }
    : { id: courseId, code: "", name: "" };
  const isTa = course?.viewerRole === "ta";

  if (!user || loading || !course) {
    return (
      <AppShell course={shellCourse} active="exams">
        <div className="px-8 py-10 text-sm" style={{ color: "var(--muted)" }}>
          {error ? error : "Loading course..."}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell course={shellCourse} active="exams" access="any">
      <PageHeader
        crumbs={[
          { label: "All courses", href: "/courses" },
          { label: `${course.code ?? ""} ${course.name}`.trim() },
        ]}
      >
        {/* Only the instructor creates exams. */}
        {!isTa && (
          <Button size="lg" icon={<Plus size={16} />}>
            New exam
          </Button>
        )}
      </PageHeader>

      <PageTitle
        title={`${course.code ?? ""} ${course.name}`.trim()}
        description={
          isTa
            ? "The exams you grade in this course. Open one to add and grade papers."
            : course.semester ?? undefined
        }
      />

      {error && (
        <div role="alert" style={{ padding: "12px 14px", borderRadius: "12px", color: "var(--red-x)", background: "var(--red-t)", fontSize: "13px" }}>
          {error}
        </div>
      )}

      <Card padding="22px">
        <SectionHeader
          title="Exams"
          description={
            isTa
              ? "You can add papers to an exam while it is open for grading."
              : "Set up each exam's questions and model answers, then open it for the TAs."
          }
        />
        {course.exams.length === 0 ? (
          <div style={{ padding: "32px 18px", textAlign: "center", color: "var(--muted)" }}>
            <p style={{ color: "var(--ink)", fontWeight: 600 }}>No exams yet</p>
            <p style={{ fontSize: "13px" }}>
              {isTa
                ? "Nothing to grade yet. Exams appear here once the instructor opens them."
                : "Create an exam to upload its questions and model answers."}
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {course.exams.map((exam) => {
              const status = EXAM_STATUS[exam.status];
              return (
                <div
                  key={exam.id}
                  style={{
                    padding: "18px 20px",
                    borderRadius: "16px",
                    background: "rgba(var(--ink-rgb), 0.025)",
                    boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, letterSpacing: "-0.02em", color: "var(--ink)" }}>
                          {exam.name}
                        </h3>
                        <Pill tone={status.tone} dot>
                          {status.label}
                        </Pill>
                      </div>
                      <p style={{ margin: "5px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                        {formatHeld(exam.heldAt)} · {exam.questionCount} question
                        {exam.questionCount === 1 ? "" : "s"}
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      {isTa ? (
                        <>
                          {exam.canAddPapers && (
                            <SecondaryButton
                              href={`/courses/${course.id}/exams/${exam.id}/papers/new`}
                              icon={<FileUp size={16} />}
                            >
                              Add paper
                            </SecondaryButton>
                          )}
                          <Button
                            href={`/courses/${course.id}/exams/${exam.id}/papers`}
                            icon={<ArrowRight size={16} />}
                          >
                            My papers
                          </Button>
                        </>
                      ) : (
                        <>
                          <SecondaryButton
                            href={`/courses/${course.id}/exams/${exam.id}/setup`}
                            icon={<Settings size={16} />}
                          >
                            Setup
                          </SecondaryButton>
                          <Button
                            href={`/courses/${course.id}/exams/${exam.id}/report`}
                            icon={<ArrowRight size={16} />}
                          >
                            Open report
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  {/* A TA sees only their own paper counts; the instructor sees the cohort. */}
                  <div style={{ display: "flex", gap: "22px", flexWrap: "wrap", fontSize: "13px", color: "var(--muted)" }}>
                    <span>
                      {isTa ? "My papers" : "Papers"}{" "}
                      <strong style={{ color: "var(--ink)" }}>{exam.progress.papers}</strong>
                    </span>
                    <span>
                      Drafts <strong style={{ color: "var(--ink)" }}>{exam.progress.drafts}</strong>
                    </span>
                    <span>
                      Submitted <strong style={{ color: "var(--ink)" }}>{exam.progress.submitted}</strong>
                    </span>
                    <span>
                      AI graded <strong style={{ color: "var(--ink)" }}>{exam.progress.aiGraded}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      <Card padding="22px">
        <SectionHeader
          title="People"
          description={
            isTa
              ? "The instructor and TAs of this course."
              : "The instructor and every TA. TAs see each exam once it is open."
          }
        >
          {!isTa && (
            <SecondaryButton href={`/courses/${course.id}/members`} icon={<ArrowRight size={16} />}>
              Manage members
            </SecondaryButton>
          )}
        </SectionHeader>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {course.owner && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 0" }}>
              <span style={{ flexGrow: 1, minWidth: 0, fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                {course.owner.name}
                {course.owner.isYou && <YouTag />}
              </span>
              <RoleChip role="instructor" />
            </div>
          )}
          {course.members
            .filter((m) => m.role === "ta")
            .map((member) => (
              <div
                key={member.userId}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 0",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <span style={{ flexGrow: 1, minWidth: 0, fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                  {member.name}
                  {member.isYou && <YouTag />}
                </span>
                <RoleChip role="ta" />
              </div>
            ))}
        </div>
      </Card>
    </AppShell>
  );
}
