// Static design, generated from design-reference/html/Courses.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  instructorNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "Courses \u00b7 Fair Grade" };

const user = { name: "Instructor Demo", role: "instructor" } as const;

export default function CoursesPage() {
  return (
    <>
      <AppShell user={user} nav={instructorNav({ active: "courses" })}>
        <PageHeader crumbs={[{ label: "All courses" }]}>
          <Button
            size="lg"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: "0", display: "block" }}
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            }
          >
            New course
          </Button>
        </PageHeader>
        <PageTitle
          title={<>Courses</>}
          description={
            <>
              Every course you teach or assist in. TAs only see the courses they have been added to.
            </>
          }
        />
        <Card className="fg-in fg-d1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div
              role="radiogroup"
              aria-label="Filter courses"
              style={{
                display: "inline-flex",
                padding: "4px",
                borderRadius: "999px",
                background: "rgba(var(--ink-rgb), 0.05)",
                gap: "2px",
              }}
            >
              <button
                type="button"
                role="radio"
                aria-checked="false"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--muted)",
                }}
              >
                This semester 2
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="false"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--muted)",
                }}
              >
                Past 1
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="true"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "var(--raised)",
                  color: "var(--ink)",
                  boxShadow:
                    "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                }}
              >
                All 3
              </button>
            </div>
            <div style={{ width: "280px" }}>
              <div style={{ width: "100%" }}>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "14px",
                      top: "12px",
                      color: "var(--faint)",
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16l4 4" />
                    </svg>
                  </span>
                  <input
                    id="cs"
                    type="text"
                    placeholder="Search courses"
                    aria-label="Search courses"
                    style={{
                      width: "100%",
                      height: "44px",
                      padding: "0 14px 0 42px",
                      border: "0",
                      borderRadius: "12px",
                      background: "var(--surface)",
                      boxShadow:
                        "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "14px",
                      color: "var(--text)",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="fg-hide-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px",
              gap: "16px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Course</span>
            <span>Semester</span>
            <span>Exams</span>
            <span>TAs</span>
            <span>Latest exam</span>
            <span></span>
          </div>
          <div
            style={{
              borderRadius: "18px",
              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
              overflow: "hidden",
            }}
          >
            <Link
              href="/courses/hy335"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px",
                gap: "16px",
                alignItems: "center",
                padding: "16px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "0",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "0" }}>
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "var(--blue-t)",
                    color: "var(--blue-x)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                    flexShrink: "0",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  335
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>
                    Computer Networks
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>HY335</span>
                </span>
              </span>
              <span style={{ fontSize: "13.5px", color: "var(--muted)" }}>Winter 2026–27</span>
              <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>5</span>
              <span style={{ display: "flex" }}>
                <span style={{ marginLeft: "0px" }}>
                  <Avatar initial="M" size={28} />
                </span>
                <span style={{ marginLeft: "-7px" }}>
                  <Avatar initial="G" size={28} />
                </span>
                <span style={{ marginLeft: "-7px" }}>
                  <Avatar initial="E" size={28} />
                </span>
                <span style={{ marginLeft: "-7px" }}>
                  <Avatar initial="N" size={28} />
                </span>
                <span style={{ marginLeft: "-7px" }}>
                  <Avatar initial="K" size={28} />
                </span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                <span style={{ fontSize: "13.5px", color: "var(--ink)" }}>Midterm</span>
                <Pill tone="red" dot>
                  1 TA flagged
                </Pill>
              </span>
              <span style={{ color: "var(--faint)" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", display: "block" }}
                >
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/courses/hy335"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px",
                gap: "16px",
                alignItems: "center",
                padding: "16px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "0" }}>
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "var(--green-t)",
                    color: "var(--green-x)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                    flexShrink: "0",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  360
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>
                    Database Systems
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>HY360</span>
                </span>
              </span>
              <span style={{ fontSize: "13.5px", color: "var(--muted)" }}>Winter 2026–27</span>
              <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>1</span>
              <span style={{ fontSize: "13px", color: "var(--faint)" }}>No TAs yet</span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                <span style={{ fontSize: "13.5px", color: "var(--ink)" }}>Final</span>
                <Pill dot>Questions ready</Pill>
              </span>
              <span style={{ color: "var(--faint)" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", display: "block" }}
                >
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
            <Link
              href="/courses/hy335"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.5fr) 150px 70px 150px minmax(0, 1.4fr) 24px",
                gap: "16px",
                alignItems: "center",
                padding: "16px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: "0" }}>
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "rgba(var(--ink-rgb), 0.06)",
                    color: "var(--text-2)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "13px",
                    fontWeight: "600",
                    flexShrink: "0",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  359
                </span>
                <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                  <span style={{ fontSize: "15px", fontWeight: "500", color: "var(--ink)" }}>
                    Web Programming
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>HY359</span>
                </span>
              </span>
              <span style={{ fontSize: "13.5px", color: "var(--muted)" }}>Spring 2026</span>
              <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>2</span>
              <span style={{ display: "flex" }}>
                <span style={{ marginLeft: "0px" }}>
                  <Avatar initial="N" size={28} />
                </span>
                <span style={{ marginLeft: "-7px" }}>
                  <Avatar initial="E" size={28} />
                </span>
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "0" }}>
                <span style={{ fontSize: "13.5px", color: "var(--ink)" }}>Final</span>
                <Pill tone="green" dot>
                  Report ready
                </Pill>
              </span>
              <span style={{ color: "var(--faint)" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", display: "block" }}
                >
                  <path d="M9.5 6l6 6-6 6" />
                </svg>
              </span>
            </Link>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
