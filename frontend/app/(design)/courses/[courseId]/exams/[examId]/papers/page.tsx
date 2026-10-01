// Static design, generated from design-reference/html/TAPapers.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import { AppShell, Card, PageHeader, PageTitle, Pill, SecondaryButton } from "@/components/shell";
import { TaPapersLivePage } from "../../../../../papers/paper-pages";

export const metadata: Metadata = { title: "My midterm papers \u00b7 Fair Grade" };

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm" };

export default function TaPapersPage() {
  return <TaPapersLivePage />;
}

export function StaticTaPapersPage() {
  return (
    <>
      <AppShell course={course} exam={exam} active="my-papers" access="ta">
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "My papers" },
          ]}
        />
        <PageTitle
          title={<>My midterm papers</>}
          description={
            <>
              Every paper you scanned and graded. After you submit, the AI grades the same answers
              and you can compare.
            </>
          }
        />
        <div
          className="fg-in fg-d1 fg-dark"
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
              padding: "28px 30px",
              boxShadow:
                "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
            }}
          >
            <div
              className="fg-grid"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) auto",
                gap: "24px",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "22px",
                    fontWeight: "600",
                    letterSpacing: "-0.03em",
                    color: "var(--surface)",
                  }}
                >
                  Have a paper in front of you?
                </h2>
                <p
                  style={{
                    margin: "8px 0 0",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#A6ACB8",
                    maxWidth: "520px",
                  }}
                >
                  Scan it as a PDF. We read the handwriting and place each answer under its
                  question, so you can grade it next to the model answer.
                </p>
              </div>
              <Link
                href="/courses/hy335/exams/midterm/papers/new"
                className="fg-press"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  height: "56px",
                  padding: "7px 7px 7px 22px",
                  borderRadius: "999px",
                  background: "var(--surface)",
                  color: "var(--ink)",
                  textDecoration: "none",
                  fontSize: "15.5px",
                  fontWeight: "600",
                }}
              >
                <span>Add paper</span>
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
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--surface)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: "0", display: "block" }}
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div
          className="fg-grid fg-in fg-d1"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "20px" }}
        >
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Papers you graded</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "34px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                11
              </span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              Plus 1 draft you have not submitted
            </div>
          </Card>
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Average gap from the AI</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "34px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                −0.10
              </span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              Within the threshold on every question
            </div>
          </Card>
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Waiting for the AI</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "34px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--amber-x)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                1
              </span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              csd5148, usually under a minute
            </div>
          </Card>
        </div>
        <Card className="fg-in fg-d2">
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
              aria-label="Filter papers"
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
                All 12
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
                Drafts 1
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
                Submitted 11
              </button>
            </div>
            <div style={{ width: "260px" }}>
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
                    id="ps"
                    type="text"
                    placeholder="Find a student ID"
                    aria-label="Find a student ID"
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
              gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
              gap: "16px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Student ID</span>
            <span>Added</span>
            <span>Your grade</span>
            <span>AI grade</span>
            <span>Gap</span>
            <span>Status</span>
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
              href="/papers/csd5146/grade"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "0",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5150
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 12:44</span>
              <span>
                <span style={{ color: "var(--faint)" }}>—</span>
              </span>
              <span>
                <span style={{ color: "var(--faint)" }}>—</span>
              </span>
              <span>
                <span style={{ color: "var(--faint)" }}>—</span>
              </span>
              <span>
                <Pill dot>Draft</Pill>
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5148
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 12:38</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  6.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span style={{ color: "var(--amber-x)", fontSize: "13px" }}>Grading</span>
              </span>
              <span>
                <span style={{ color: "var(--faint)" }}>—</span>
              </span>
              <span>
                <Pill tone="amber" dot>
                  AI grading
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5146
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 12:31</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  7
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  8
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--red-x)",
                  }}
                >
                  −1.00
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5144
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 12:02</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  8.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  8.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  0
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5141
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 11:40</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  6
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  6.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--red-x)",
                  }}
                >
                  −0.50
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5139
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 11:15</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  9
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  9
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  0
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5137
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 10:52</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  5.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--blue-x)",
                  }}
                >
                  +0.50
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1fr) 130px 110px 110px 110px 140px 24px",
                gap: "16px",
                alignItems: "center",
                padding: "14px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "14px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5136
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 10:30</span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  7.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "17px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  7.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 10</span>
              </span>
              <span>
                <span
                  style={{
                    fontSize: "14px",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  0
                </span>
              </span>
              <span>
                <Pill tone="blue" dot>
                  AI graded
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <span style={{ fontSize: "13px", color: "var(--muted)" }}>
              Showing the 8 most recent of 12
            </span>
            <SecondaryButton
              icon={
                <svg
                  width="16"
                  height="16"
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
              }
            >
              <span>Show all</span>
            </SecondaryButton>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
