// Static design, generated from design-reference/html/Upload.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import {
  AppShell,
  Button,
  Card,
  IconButton,
  PageHeader,
  PageTitle,
  SecondaryButton,
  instructorNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "Set up the midterm \u00b7 Fair Grade" };

const user = { name: "Instructor Demo", role: "instructor" } as const;
const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm", flagged: 1 };

export default function ExamSetupPage() {
  return (
    <>
      <AppShell user={user} course={course} nav={instructorNav({ course, exam, active: "setup" })}>
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "Setup" },
          ]}
        >
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
                <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
                <circle cx="12" cy="12" r="2.8" />
              </svg>
            }
            href="/courses/hy335/exams/midterm/papers"
          >
            <span>Preview as TA</span>
          </SecondaryButton>
        </PageHeader>
        <PageTitle
          title={<>Set up the midterm</>}
          description={
            <>
              Upload the questions and model answers. That is the rubric every TA and the AI grade
              against.
            </>
          }
        />
        <div
          className="fg-grid fg-in fg-d1"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) 360px",
            gap: "28px",
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "32px minmax(0, 1fr)",
                gap: "18px",
                alignItems: "start",
              }}
            >
              <div style={{ position: "relative", height: "100%", paddingTop: "18px" }}>
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    background: "var(--green)",
                    color: "var(--surface)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: "0",
                    position: "relative",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--surface)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: "0", display: "block" }}
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: "15.5px",
                    top: "40px",
                    bottom: "-22px",
                    width: "1px",
                    background: "rgba(var(--ink-rgb), 0.11)",
                  }}
                ></span>
              </div>
              <div>
                <Card padding="26px">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "17px",
                          fontWeight: "600",
                          letterSpacing: "-0.02em",
                          color: "var(--ink)",
                        }}
                      >
                        Questions and model answers
                      </h2>
                      <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                        3 questions, 10 points. Imported from midterm-solutions.pdf.
                      </p>
                    </div>
                  </div>
                  <div style={{ marginTop: "22px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "16px",
                        flexWrap: "wrap",
                        marginBottom: "16px",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 14px 10px 10px",
                          borderRadius: "16px",
                          background: "rgba(var(--ink-rgb), 0.03)",
                        }}
                      >
                        <span
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "11px",
                            background: "var(--surface)",
                            boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--muted)",
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
                            <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                            <path d="M13.5 3.5V9H19" />
                          </svg>
                        </span>
                        <span style={{ display: "flex", flexDirection: "column" }}>
                          <span
                            style={{ fontSize: "13.5px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            midterm-solutions.pdf
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            3 questions found. Check them below.
                          </span>
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: "8px" }}>
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
                              <path d="M12 15.5V4.5" />
                              <path d="M7.5 9l4.5-4.5L16.5 9" />
                              <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
                            </svg>
                          }
                        >
                          <span>Import from PDF</span>
                        </SecondaryButton>
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
                              <path d="M12 5v14M5 12h14" />
                            </svg>
                          }
                        >
                          <span>Add question</span>
                        </SecondaryButton>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div
                        style={{
                          padding: "22px 24px",
                          borderRadius: "20px",
                          background: "var(--surface)",
                          boxShadow:
                            "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span
                              style={{
                                height: "28px",
                                padding: "0 10px",
                                borderRadius: "9px",
                                background: "var(--ink)",
                                color: "var(--surface)",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              Q1
                            </span>
                            <span
                              style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}
                            >
                              TCP three-way handshake
                            </span>
                          </div>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "13px",
                              color: "var(--muted)",
                            }}
                          >
                            Points
                            <input
                              aria-label="Q1 points"
                              type="number"
                              step="0.5"
                              defaultValue="4"
                              style={{
                                width: "64px",
                                height: "36px",
                                padding: "0 10px",
                                border: "0",
                                borderRadius: "10px",
                                boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                fontSize: "14px",
                                color: "var(--text)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            />
                          </span>
                        </div>
                        <div style={{ width: "100%" }}>
                          <label
                            htmlFor="q1-q"
                            style={{
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--text)",
                              marginBottom: "8px",
                            }}
                          >
                            Question
                          </label>
                          <div style={{ position: "relative" }}>
                            <input
                              id="q1-q"
                              type="text"
                              defaultValue="Explain how the TCP three-way handshake works."
                              aria-label="Question"
                              style={{
                                width: "100%",
                                height: "44px",
                                padding: "0 14px 0 14px",
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
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
                            Model answer
                          </div>
                          <div
                            style={{
                              padding: "14px 16px",
                              borderRadius: "14px",
                              background: "var(--surface-2)",
                              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "var(--text)",
                            }}
                          >
                            The client sends SYN with an initial sequence number x. The server
                            replies SYN-ACK with its own number y and acknowledges x+1. The client
                            replies ACK y+1. Both sides now know each other&apos;s starting sequence
                            numbers, so lost or reordered data can be detected.
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontSize: "13px", fontWeight: "500" }}>
                              Rubric: points for each key idea
                            </span>
                            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                              Adds up to 4
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q1 key point"
                                defaultValue="Names the three steps in order"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q1 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="2"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q1 key point"
                                defaultValue="Explains what the sequence numbers are for"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q1 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="1"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q1 key point"
                                defaultValue="Says why the handshake is needed before data"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q1 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="1"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "22px 24px",
                          borderRadius: "20px",
                          background: "var(--surface)",
                          boxShadow:
                            "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span
                              style={{
                                height: "28px",
                                padding: "0 10px",
                                borderRadius: "9px",
                                background: "var(--ink)",
                                color: "var(--surface)",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              Q2
                            </span>
                            <span
                              style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}
                            >
                              TCP and UDP
                            </span>
                          </div>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "13px",
                              color: "var(--muted)",
                            }}
                          >
                            Points
                            <input
                              aria-label="Q2 points"
                              type="number"
                              step="0.5"
                              defaultValue="3"
                              style={{
                                width: "64px",
                                height: "36px",
                                padding: "0 10px",
                                border: "0",
                                borderRadius: "10px",
                                boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                fontSize: "14px",
                                color: "var(--text)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            />
                          </span>
                        </div>
                        <div style={{ width: "100%" }}>
                          <label
                            htmlFor="q2-q"
                            style={{
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--text)",
                              marginBottom: "8px",
                            }}
                          >
                            Question
                          </label>
                          <div style={{ position: "relative" }}>
                            <input
                              id="q2-q"
                              type="text"
                              defaultValue="Compare TCP and UDP and give one use case for each."
                              aria-label="Question"
                              style={{
                                width: "100%",
                                height: "44px",
                                padding: "0 14px 0 14px",
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
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
                            Model answer
                          </div>
                          <div
                            style={{
                              padding: "14px 16px",
                              borderRadius: "14px",
                              background: "var(--surface-2)",
                              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "var(--text)",
                            }}
                          >
                            TCP is connection-oriented and reliable: it retransmits lost segments
                            and controls flow and congestion. UDP sends independent datagrams with
                            no setup or retransmission, so it has less overhead. TCP suits file
                            transfer or the web; UDP suits voice, video or games where late data is
                            useless.
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontSize: "13px", fontWeight: "500" }}>
                              Rubric: points for each key idea
                            </span>
                            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                              Adds up to 3
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q2 key point"
                                defaultValue="Correct core difference: connection and reliability"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q2 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="1.5"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q2 key point"
                                defaultValue="A valid use case for each"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q2 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="1"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q2 key point"
                                defaultValue="Mentions overhead, flow or congestion control"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q2 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="0.5"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "22px 24px",
                          borderRadius: "20px",
                          background: "var(--surface)",
                          boxShadow:
                            "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                          display: "flex",
                          flexDirection: "column",
                          gap: "16px",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <span
                              style={{
                                height: "28px",
                                padding: "0 10px",
                                borderRadius: "9px",
                                background: "var(--ink)",
                                color: "var(--surface)",
                                fontSize: "13px",
                                fontWeight: "600",
                                display: "inline-flex",
                                alignItems: "center",
                              }}
                            >
                              Q3
                            </span>
                            <span
                              style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}
                            >
                              DNS resolution
                            </span>
                          </div>
                          <span
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "13px",
                              color: "var(--muted)",
                            }}
                          >
                            Points
                            <input
                              aria-label="Q3 points"
                              type="number"
                              step="0.5"
                              defaultValue="3"
                              style={{
                                width: "64px",
                                height: "36px",
                                padding: "0 10px",
                                border: "0",
                                borderRadius: "10px",
                                boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                fontSize: "14px",
                                color: "var(--text)",
                                fontVariantNumeric: "tabular-nums",
                              }}
                            />
                          </span>
                        </div>
                        <div style={{ width: "100%" }}>
                          <label
                            htmlFor="q3-q"
                            style={{
                              display: "block",
                              fontSize: "13px",
                              fontWeight: "500",
                              color: "var(--text)",
                              marginBottom: "8px",
                            }}
                          >
                            Question
                          </label>
                          <div style={{ position: "relative" }}>
                            <input
                              id="q3-q"
                              type="text"
                              defaultValue="What does a DNS resolver do when a name is not in its cache?"
                              aria-label="Question"
                              style={{
                                width: "100%",
                                height: "44px",
                                padding: "0 14px 0 14px",
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
                        <div>
                          <div style={{ fontSize: "13px", fontWeight: "500", marginBottom: "8px" }}>
                            Model answer
                          </div>
                          <div
                            style={{
                              padding: "14px 16px",
                              borderRadius: "14px",
                              background: "var(--surface-2)",
                              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                              fontSize: "14px",
                              lineHeight: "1.6",
                              color: "var(--text)",
                            }}
                          >
                            It resolves the name iteratively: it asks a root server, follows the
                            referral to the TLD server, then to the authoritative server for the
                            domain, and returns the answer. It caches the result for the
                            record&apos;s TTL.
                          </div>
                        </div>
                        <div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <span style={{ fontSize: "13px", fontWeight: "500" }}>
                              Rubric: points for each key idea
                            </span>
                            <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                              Adds up to 3
                            </span>
                          </div>
                          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q3 key point"
                                defaultValue="Root, TLD, authoritative, in order"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q3 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="2"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "minmax(0, 1fr) 80px 40px",
                                gap: "10px",
                                alignItems: "center",
                              }}
                            >
                              <input
                                aria-label="Q3 key point"
                                defaultValue="Caches the answer for the TTL"
                                style={{
                                  height: "40px",
                                  padding: "0 12px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                }}
                              />
                              <input
                                aria-label="Q3 key point points"
                                type="number"
                                step="0.5"
                                defaultValue="1"
                                style={{
                                  height: "40px",
                                  padding: "0 10px",
                                  border: "0",
                                  borderRadius: "10px",
                                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                                  fontSize: "13.5px",
                                  color: "var(--text)",
                                  fontVariantNumeric: "tabular-nums",
                                }}
                              />
                              <IconButton label="Remove key point">
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
                                  <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
                                </svg>
                              </IconButton>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "18px",
                        gap: "12px",
                      }}
                    >
                      <span style={{ fontSize: "14px", color: "var(--muted)" }}>
                        Total{" "}
                        <span
                          style={{
                            fontSize: "20px",
                            fontWeight: "500",
                            letterSpacing: "-0.04em",
                            color: "var(--ink)",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: "1",
                          }}
                        >
                          10
                        </span>{" "}
                        points across 3 questions
                      </span>
                      <Button
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
                            <path d="M5 12.5l4.5 4.5L19 7.5" />
                          </svg>
                        }
                      >
                        Save questions
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "grid",
                gridTemplateColumns: "32px minmax(0, 1fr)",
                gap: "18px",
                alignItems: "start",
              }}
            >
              <div style={{ position: "relative", height: "100%", paddingTop: "18px" }}>
                <span
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "999px",
                    background: "var(--green)",
                    color: "var(--surface)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: "0",
                    position: "relative",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--surface)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: "0", display: "block" }}
                  >
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                </span>
              </div>
              <div>
                <Card padding="20px 24px">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div>
                      <h2
                        style={{
                          margin: "0",
                          fontSize: "17px",
                          fontWeight: "600",
                          letterSpacing: "-0.02em",
                          color: "var(--ink)",
                        }}
                      >
                        Who grades
                      </h2>
                      <p style={{ margin: "4px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                        All 5 TAs of HY335. Grades lock after submit.
                      </p>
                    </div>
                    <SecondaryButton>
                      <span>Edit</span>
                    </SecondaryButton>
                  </div>
                </Card>
              </div>
            </div>
          </div>
          <div
            style={{
              position: "sticky",
              top: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <div
              className="fg-dark"
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
                  padding: "26px",
                  boxShadow:
                    "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
                >
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
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    AI grading
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#7FD3A4" }}>Automatic</span>
                </div>
                <h2
                  style={{
                    margin: "18px 0 6px",
                    fontSize: "25px",
                    fontWeight: "600",
                    letterSpacing: "-0.035em",
                    color: "var(--surface)",
                    lineHeight: "1.15",
                  }}
                >
                  The AI grades each paper as soon as a TA submits it
                </h2>
                <p
                  style={{
                    margin: "0 0 18px",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#A6ACB8",
                  }}
                >
                  Same questions, same model answers, same transcribed text. It never sees the
                  TA&apos;s grade or the student&apos;s name.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "0",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "var(--avatar-bg)", flexGrow: "1" }}>
                    Papers submitted
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "var(--avatar-bg)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    58
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--surface-rgb), 0.08)",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "var(--avatar-bg)", flexGrow: "1" }}>
                    AI graded
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#7FD3A4",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    57
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--surface-rgb), 0.08)",
                  }}
                >
                  <span style={{ fontSize: "14px", color: "var(--avatar-bg)", flexGrow: "1" }}>
                    Being graded now
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#F3C977",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    1
                  </span>
                </div>
                <div style={{ marginTop: "20px" }}>
                  <Link
                    href="/courses/hy335/exams/midterm/report"
                    className="fg-press"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
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
                    <span>Open the report</span>
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
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--surface)"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: "0", display: "block" }}
                      >
                        <path d="M7 17L17 7" />
                        <path d="M9 7h8v8" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
            <Card padding="16px 18px">
              <div style={{ display: "flex", gap: "12px" }}>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                  style={{ flexShrink: "0", display: "block" }}
                >
                  <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
                  <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                </svg>
                <p
                  style={{
                    margin: "0",
                    fontSize: "13px",
                    lineHeight: "1.55",
                    color: "var(--muted)",
                  }}
                >
                  Sent to the AI: question, model answer, rubric and the transcribed answer. Never
                  sent: student IDs, names, TA grades.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </AppShell>
    </>
  );
}
