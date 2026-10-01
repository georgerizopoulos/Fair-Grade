// Static design, generated from design-reference/html/States.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import type { Metadata } from "next";
import {
  Button,
  Card,
  Kbd,
  Pill,
  SecondaryButton,
  SectionHeader,
  ThemeSwitch,
} from "@/components/shell";

export const metadata: Metadata = { title: "States \u00b7 Fair Grade" };

export default function StatesPage() {
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
          color: "var(--text)",
          background:
            "radial-gradient(1200px 520px at 20% -10%, var(--surface) 0%, rgba(var(--surface-rgb), 0) 70%), var(--bg)",
          padding: "72px 64px 96px",
        }}
      >
        <div
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          <div
            className="fg-in"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "24px",
            }}
          >
            <div>
              <div style={{ marginBottom: "14px" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    height: "24px",
                    padding: "0 10px",
                    borderRadius: "999px",
                    background: "var(--surface)",
                    boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                    color: "var(--muted)",
                    fontSize: "10.5px",
                    fontWeight: "500",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                  }}
                >
                  Empty, error, access
                </span>
              </div>
              <h1
                style={{
                  margin: "0",
                  fontSize: "34px",
                  fontWeight: "600",
                  letterSpacing: "-0.035em",
                  lineHeight: "1.1",
                  color: "var(--ink)",
                }}
              >
                States
              </h1>
              <p
                style={{
                  margin: "10px 0 0",
                  fontSize: "15px",
                  lineHeight: "1.55",
                  color: "var(--muted)",
                  maxWidth: "620px",
                }}
              >
                Every page answers three questions when something is missing: what happened, why,
                and what to do next.
              </p>
            </div>
            <ThemeSwitch />
          </div>
          <div
            className="fg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
              gap: "20px",
              alignItems: "start",
            }}
          >
            <div
              className="fg-span"
              style={{ gridColumn: "span 4", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d1" padding="28px" fill>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "14px",
                    minHeight: "250px",
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                      color: "var(--ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
                      <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
                    </svg>
                  </span>
                  <h2
                    style={{
                      margin: "6px 0 0",
                      fontSize: "21px",
                      fontWeight: "600",
                      letterSpacing: "-0.03em",
                      color: "var(--ink)",
                    }}
                  >
                    You don&apos;t have access to this course
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--muted)",
                      maxWidth: "380px",
                    }}
                  >
                    Ask the instructor of HY360 Database Systems to add you as a TA. It appears here
                    as soon as they do.
                  </p>
                  <div style={{ flexGrow: "1" }}></div>
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
                        <path d="M19 12H5" />
                        <path d="M11 6l-6 6 6 6" />
                      </svg>
                    }
                    href="/courses"
                  >
                    <span>Back to my courses</span>
                  </SecondaryButton>
                </div>
              </Card>
            </div>
            <div
              className="fg-span"
              style={{ gridColumn: "span 4", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d2" padding="28px" fill>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "14px",
                    minHeight: "250px",
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: "var(--blue-t)",
                      color: "var(--blue)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
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
                  </span>
                  <h2
                    style={{
                      margin: "6px 0 0",
                      fontSize: "21px",
                      fontWeight: "600",
                      letterSpacing: "-0.03em",
                      color: "var(--ink)",
                    }}
                  >
                    No papers yet
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--muted)",
                      maxWidth: "380px",
                    }}
                  >
                    Scan the first paper you hold. Each answer lands under its question, ready to
                    grade.
                  </p>
                  <div style={{ flexGrow: "1" }}></div>
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
                    Add paper
                  </Button>
                </div>
              </Card>
            </div>
            <div
              className="fg-span"
              style={{ gridColumn: "span 4", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d3" padding="28px" fill>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "14px",
                    minHeight: "250px",
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: "var(--amber-t)",
                      color: "var(--amber)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
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
                  </span>
                  <h2
                    style={{
                      margin: "6px 0 0",
                      fontSize: "21px",
                      fontWeight: "600",
                      letterSpacing: "-0.03em",
                      color: "var(--ink)",
                    }}
                  >
                    Page 3 is hard to read
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--muted)",
                      maxWidth: "380px",
                    }}
                  >
                    We could not read Q3 on page 3. Rescan that page, or type the student&apos;s
                    answer yourself.
                  </p>
                  <div style={{ flexGrow: "1" }}></div>
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
                          <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                          <path d="M19.5 5v6h-6" />
                        </svg>
                      }
                    >
                      <span>Rescan page</span>
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
                          <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18z" />
                          <path d="M14.5 6.5l3 3" />
                        </svg>
                      }
                    >
                      <span>Type the answer</span>
                    </SecondaryButton>
                  </div>
                </div>
              </Card>
            </div>
            <div
              className="fg-span"
              style={{ gridColumn: "span 5", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d4" padding="28px" fill>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "14px",
                    minHeight: "250px",
                  }}
                >
                  <span
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "16px",
                      background: "var(--red-t)",
                      color: "var(--red)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M12 4.5l8.5 15h-17z" />
                      <path d="M12 10.5v4" />
                      <path d="M12 17.3v.2" />
                    </svg>
                  </span>
                  <h2
                    style={{
                      margin: "6px 0 0",
                      fontSize: "21px",
                      fontWeight: "600",
                      letterSpacing: "-0.03em",
                      color: "var(--ink)",
                    }}
                  >
                    The AI could not grade this paper
                  </h2>
                  <p
                    style={{
                      margin: "0",
                      fontSize: "14px",
                      lineHeight: "1.6",
                      color: "var(--muted)",
                      maxWidth: "380px",
                    }}
                  >
                    The AI service did not respond. Your grades are saved and locked. We will retry
                    automatically, or you can retry now.
                  </p>
                  <div style={{ flexGrow: "1" }}></div>
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
                        <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                        <path d="M19.5 5v6h-6" />
                      </svg>
                    }
                  >
                    Retry now
                  </Button>
                </div>
              </Card>
            </div>
            <div
              className="fg-span"
              style={{ gridColumn: "span 7", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d5" padding="28px" fill>
                <SectionHeader title={<>Loading the report</>} />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderTop: "0",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                  <div
                    style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px" }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "42%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "26%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      display: "block",
                      height: "12px",
                      width: "120px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                  <div
                    style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px" }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "42%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "26%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      display: "block",
                      height: "12px",
                      width: "120px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                  <div
                    style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px" }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "42%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "26%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      display: "block",
                      height: "12px",
                      width: "120px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    padding: "12px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                  <div
                    style={{ flexGrow: "1", display: "flex", flexDirection: "column", gap: "8px" }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "42%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "12px",
                        width: "26%",
                        borderRadius: "999px",
                        background: "rgba(var(--ink-rgb), 0.06)",
                      }}
                    ></span>
                  </div>
                  <span
                    style={{
                      display: "block",
                      height: "12px",
                      width: "120px",
                      borderRadius: "999px",
                      background: "rgba(var(--ink-rgb), 0.06)",
                    }}
                  ></span>
                </div>
              </Card>
            </div>
            <div className="fg-span" style={{ gridColumn: "span 7", minWidth: "0" }}>
              <div
                className="fg-in fg-d5"
                style={{
                  background: "rgba(var(--ink-rgb), 0.028)",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.05)",
                  borderRadius: "26px",
                  padding: "6px",
                }}
              >
                <div
                  style={{
                    background: "var(--amber-t)",
                    borderRadius: "20px",
                    padding: "18px 22px",
                    boxShadow:
                      "inset 0 1px 0 rgba(var(--surface-rgb), 0.9), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                  }}
                >
                  <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--amber)"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <circle cx="12" cy="12" r="8.5" />
                      <path d="M12 11v5" />
                      <path d="M12 7.8v.2" />
                    </svg>
                    <p style={{ margin: "0", fontSize: "14.5px", color: "var(--amber-x)" }}>
                      AI grading for{" "}
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "13.5px",
                          color: "var(--amber-x)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        csd5148
                      </span>{" "}
                      is taking longer than usual. You can keep grading other papers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="fg-span"
              style={{ gridColumn: "span 5", minWidth: "0", alignSelf: "stretch" }}
            >
              <Card className="fg-in fg-d6" size="lg" padding="28px" fill>
                <h2
                  style={{
                    margin: "0",
                    fontSize: "21px",
                    fontWeight: "600",
                    letterSpacing: "-0.03em",
                    color: "var(--ink)",
                  }}
                >
                  Reopen csd5108 for Maria?
                </h2>
                <p
                  style={{
                    margin: "10px 0 0",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "var(--muted)",
                  }}
                >
                  She can change her grades and submit again. The AI grade stays as it is, and the
                  report keeps both versions.
                </p>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: "10px",
                    marginTop: "24px",
                  }}
                >
                  <SecondaryButton>
                    <span>Cancel</span>
                  </SecondaryButton>
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
                        <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                        <path d="M19.5 5v6h-6" />
                      </svg>
                    }
                  >
                    Reopen paper
                  </Button>
                </div>
              </Card>
            </div>
            <div className="fg-span" style={{ gridColumn: "span 12", minWidth: "0" }}>
              <Card className="fg-in fg-d6" padding="28px">
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "22px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: "0",
                        fontSize: "21px",
                        fontWeight: "600",
                        letterSpacing: "-0.03em",
                        color: "var(--ink)",
                      }}
                    >
                      Search anything
                    </h2>
                    <p
                      style={{
                        margin: "8px 0 0",
                        fontSize: "14px",
                        lineHeight: "1.6",
                        color: "var(--muted)",
                        maxWidth: "520px",
                      }}
                    >
                      Press <Kbd>⌘K</Kbd> on any page. Type a name, a student ID or a question and
                      jump straight there.
                    </p>
                  </div>
                </div>
                <div
                  style={{
                    padding: "44px 24px",
                    borderRadius: "20px",
                    background:
                      "radial-gradient(500px 240px at 50% 0%, rgba(51, 88, 212, 0.10) 0%, rgba(51, 88, 212, 0) 70%), rgba(var(--ink-rgb), 0.05)",
                  }}
                >
                  <div
                    role="dialog"
                    aria-label="Search"
                    style={{
                      width: "100%",
                      maxWidth: "660px",
                      margin: "0 auto",
                      borderRadius: "22px",
                      background: "rgba(var(--surface-rgb), 0.92)",
                      boxShadow:
                        "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 30px 80px -20px rgba(var(--shadow-rgb), 0.35)",
                      overflow: "hidden",
                      backdropFilter: "blur(18px)",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "18px 20px",
                        borderBottom: "1px solid rgba(var(--ink-rgb), 0.07)",
                      }}
                    >
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                        style={{ flexShrink: "0", display: "block" }}
                      >
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="M16 16l4 4" />
                      </svg>
                      <span style={{ fontSize: "17px", color: "var(--ink)", flexGrow: "1" }}>
                        maria q2
                        <span
                          className="fg-caret"
                          style={{
                            display: "inline-block",
                            width: "1.5px",
                            height: "20px",
                            marginLeft: "2px",
                            verticalAlign: "-4px",
                            background: "var(--blue)",
                          }}
                        ></span>
                      </span>
                      <Kbd>esc</Kbd>
                    </div>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <div
                        style={{ fontSize: "12px", color: "var(--faint)", padding: "4px 12px 6px" }}
                      >
                        TAs
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                          background: "rgba(var(--ink-rgb), 0.05)",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "10px",
                            background: "var(--red)",
                            color: "var(--surface)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: "0",
                          }}
                        >
                          <span style={{ fontSize: "13px", fontWeight: "600" }}>M</span>
                        </span>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "1",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            Maria Papadaki
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            Flagged on Midterm Q2, gap −1.05
                          </span>
                        </span>
                        <Pill tone="red" dot>
                          Flagged
                        </Pill>
                        <Kbd>↵</Kbd>
                      </div>
                    </div>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <div
                        style={{ fontSize: "12px", color: "var(--faint)", padding: "4px 12px 6px" }}
                      >
                        Papers
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "10px",
                            background: "var(--blue-t)",
                            color: "var(--blue-x)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: "0",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
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
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "1",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                                fontSize: "13.5px",
                                color: "var(--ink)",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              csd5108
                            </span>
                            , Midterm
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            Maria 4.5, AI 7. Largest gap on Q2
                          </span>
                        </span>
                        <span
                          style={{
                            fontSize: "12.5px",
                            color: "var(--red-x)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          −2.5
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "10px",
                            background: "var(--blue-t)",
                            color: "var(--blue-x)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: "0",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
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
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "1",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            <span
                              style={{
                                fontFamily:
                                  "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                                fontSize: "13.5px",
                                color: "var(--ink)",
                                letterSpacing: "-0.01em",
                              }}
                            >
                              csd5117
                            </span>
                            , Midterm
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            Maria 4, AI 5.5. Fails with her grade
                          </span>
                        </span>
                        <span
                          style={{
                            fontSize: "12.5px",
                            color: "var(--red-x)",
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          −1.5
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <div
                        style={{ fontSize: "12px", color: "var(--faint)", padding: "4px 12px 6px" }}
                      >
                        Questions
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "10px",
                            background: "rgba(var(--ink-rgb), 0.06)",
                            color: "var(--ink)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: "0",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                            style={{ flexShrink: "0", display: "block" }}
                          >
                            <path d="M5 7h9" />
                            <path d="M18 7h1" />
                            <circle cx="16" cy="7" r="2" />
                            <path d="M5 17h1" />
                            <path d="M10 17h9" />
                            <circle cx="8" cy="17" r="2" />
                          </svg>
                        </span>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "1",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            Midterm Q2, TCP and UDP
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            Model answer and 3 key points, 3 points
                          </span>
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "8px 8px 4px" }}>
                      <div
                        style={{ fontSize: "12px", color: "var(--faint)", padding: "4px 12px 6px" }}
                      >
                        Actions
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          padding: "10px 12px",
                          borderRadius: "12px",
                        }}
                      >
                        <span
                          style={{
                            width: "30px",
                            height: "30px",
                            borderRadius: "10px",
                            background: "rgba(var(--ink-rgb), 0.06)",
                            color: "var(--ink)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: "0",
                          }}
                        >
                          <svg
                            width="15"
                            height="15"
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
                        </span>
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            flexGrow: "1",
                            minWidth: "0",
                          }}
                        >
                          <span
                            style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}
                          >
                            Reopen a paper for Maria
                          </span>
                          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                            Lets her regrade and submit again
                          </span>
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "16px",
                        padding: "12px 20px",
                        borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                        fontSize: "12px",
                        color: "var(--muted)",
                      }}
                    >
                      <span style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        <Kbd>↑</Kbd>
                        <Kbd>↓</Kbd> to move
                      </span>
                      <span style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}>
                        <Kbd>↵</Kbd> to open
                      </span>
                      <span style={{ marginLeft: "auto" }}>
                        Searches TAs, papers, questions and actions
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
