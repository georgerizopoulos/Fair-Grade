// Static design, generated from design-reference/html/PaperResult.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import type { Metadata } from "next";
import {
  AppShell,
  Button,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
  taNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "Paper result \u00b7 Fair Grade" };

const user = { name: "Nikos Georgiou", role: "ta" } as const;
const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm" };

export default function PaperResultPage() {
  return (
    <>
      <AppShell user={user} course={course} nav={taNav({ course, exam, active: "my-papers" })}>
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "My papers", href: "/courses/hy335/exams/midterm/papers" },
            { label: "csd5146" },
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
                <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
                <path d="M13.5 3.5V9H19" />
              </svg>
            }
            href="/papers/csd5146/grade"
          >
            <span>View scan</span>
          </SecondaryButton>
          <Button
            href="/courses/hy335/exams/midterm/papers/new"
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
            Add next paper
          </Button>
        </PageHeader>
        <PageTitle
          title={<>csd5146 compared with the AI</>}
          description={<>Midterm, graded by Nikos Georgiou. 3 questions, 10 points.</>}
        />
        <Card className="fg-in fg-d1" size="lg" padding="28px 30px">
          <div
            className="fg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.2fr)",
              gap: "0",
              alignItems: "stretch",
            }}
          >
            <div style={{ padding: "6px 28px 6px 4px" }}>
              <div style={{ fontSize: "13px", color: "var(--muted)" }}>Your grade</div>
              <div style={{ marginTop: "12px" }}>
                <span
                  style={{
                    fontSize: "64px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  7
                </span>
                <span style={{ fontSize: "20px", color: "var(--muted)" }}> / 10</span>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Pill tone="green" dot>
                  Submitted 12:31
                </Pill>
              </div>
            </div>
            <div
              style={{ padding: "6px 28px", borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)" }}
            >
              <div style={{ fontSize: "13px", color: "var(--blue-x)" }}>AI grade</div>
              <div style={{ marginTop: "12px" }}>
                <span
                  style={{
                    fontSize: "64px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  8
                </span>
                <span style={{ fontSize: "20px", color: "var(--blue-x)" }}> / 10</span>
              </div>
              <div style={{ marginTop: "10px" }}>
                <Pill tone="blue" dot>
                  Graded 12:32
                </Pill>
              </div>
            </div>
            <div
              style={{
                padding: "6px 4px 6px 28px",
                borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                gap: "14px",
              }}
            >
              <div>
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>Gap</div>
                <div style={{ marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "40px",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      color: "var(--red-x)",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: "1",
                    }}
                  >
                    −1
                  </span>
                  <span style={{ fontSize: "15px", color: "var(--muted)" }}> point</span>
                </div>
              </div>
              <p
                style={{
                  margin: "0",
                  fontSize: "13.5px",
                  lineHeight: "1.55",
                  color: "var(--text)",
                }}
              >
                You were stricter on <b>Q2</b>, by more than the 0.45 threshold for a 3-point
                question. Q1 and Q3 match.
              </p>
            </div>
          </div>
        </Card>
        <Card className="fg-in fg-d2" padding="26px">
          <SectionHeader
            title={<>Question by question</>}
            description={
              <>The AI graded the same transcribed answers against the same model answers.</>
            }
          />
          <div
            className="fg-hide-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) 90px 90px 110px",
              gap: "18px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Question</span>
            <span>You</span>
            <span>AI</span>
            <span>Gap</span>
          </div>
          <div
            style={{
              borderRadius: "18px",
              boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) 90px 90px 110px",
                gap: "18px",
                alignItems: "start",
                padding: "18px 20px",
                borderTop: "0",
                background: "transparent",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span
                  style={{
                    height: "26px",
                    padding: "0 9px",
                    borderRadius: "8px",
                    background: "var(--ink)",
                    color: "var(--surface)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: "0",
                  }}
                >
                  Q1
                </span>
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: "500", color: "var(--ink)" }}>
                    TCP three-way handshake
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "rgba(var(--ink-rgb), 0.03)",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--blue)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                      <path d="M7 7l1.8 1.8M15.2 15.2L17 17M17 7l-1.8 1.8M8.8 15.2L7 17" />
                    </svg>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>
                        AI reasoning.
                      </span>{" "}
                      All three steps in the right order with the numbers explained. Does not say
                      why the handshake is needed before data, so not full marks.
                    </p>
                  </div>
                </div>
              </div>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  3.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 4</span>
              </span>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  3.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 4</span>
              </span>
              <span style={{ paddingTop: "2px" }}>
                <Pill>No gap</Pill>
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) 90px 90px 110px",
                gap: "18px",
                alignItems: "start",
                padding: "18px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                background: "var(--red-t2)",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span
                  style={{
                    height: "26px",
                    padding: "0 9px",
                    borderRadius: "8px",
                    background: "var(--ink)",
                    color: "var(--surface)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: "0",
                  }}
                >
                  Q2
                </span>
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: "500", color: "var(--ink)" }}>
                    TCP and UDP
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "rgba(var(--ink-rgb), 0.03)",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--blue)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                      <path d="M7 7l1.8 1.8M15.2 15.2L17 17M17 7l-1.8 1.8M8.8 15.2L7 17" />
                    </svg>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>
                        AI reasoning.
                      </span>{" "}
                      States the core difference, reliability, and gives a correct use case for
                      each. Nothing on how TCP achieves it or on overhead.
                    </p>
                  </div>
                </div>
              </div>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  1
                </span>
                <span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  2
                </span>
                <span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span style={{ paddingTop: "2px" }}>
                <Pill tone="red" dot>
                  −1
                </Pill>
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.2fr) 90px 90px 110px",
                gap: "18px",
                alignItems: "start",
                padding: "18px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                background: "transparent",
              }}
            >
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span
                  style={{
                    height: "26px",
                    padding: "0 9px",
                    borderRadius: "8px",
                    background: "var(--ink)",
                    color: "var(--surface)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                    flexShrink: "0",
                  }}
                >
                  Q3
                </span>
                <div>
                  <div style={{ fontSize: "14.5px", fontWeight: "500", color: "var(--ink)" }}>
                    DNS resolution
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginTop: "8px",
                      padding: "10px 12px",
                      borderRadius: "12px",
                      background: "rgba(var(--ink-rgb), 0.03)",
                    }}
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--blue)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
                      <path d="M7 7l1.8 1.8M15.2 15.2L17 17M17 7l-1.8 1.8M8.8 15.2L7 17" />
                    </svg>
                    <p
                      style={{
                        margin: "0",
                        fontSize: "13px",
                        lineHeight: "1.55",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>
                        AI reasoning.
                      </span>{" "}
                      Correct order: root, TLD, authoritative, and mentions caching. Does not
                      mention the TTL.
                    </p>
                  </div>
                </div>
              </div>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  2.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{ fontSize: "15px", fontVariantNumeric: "tabular-nums", paddingTop: "4px" }}
              >
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--blue-x)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  2.5
                </span>
                <span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span style={{ paddingTop: "2px" }}>
                <Pill>No gap</Pill>
              </span>
            </div>
          </div>
        </Card>
        <Card className="fg-in fg-d3" padding="16px 20px">
          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
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
                flexGrow: "1",
                fontSize: "13.5px",
                color: "var(--muted)",
                lineHeight: "1.5",
              }}
            >
              Your grades are locked. If the transcription was wrong or you want to change a grade,
              ask the instructor to reopen this paper.
            </p>
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
                  <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                  <path d="M19.5 5v6h-6" />
                </svg>
              }
            >
              <span>Ask to reopen</span>
            </SecondaryButton>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
