// Static design, generated from design-reference/html/TAScan.html
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
} from "@/components/shell";

export const metadata: Metadata = { title: "Add a paper \u00b7 Fair Grade" };

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm" };

export default function AddPaperPage() {
  return (
    <>
      <AppShell course={course} exam={exam} active="add-paper" access="ta">
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "My papers", href: "/courses/hy335/exams/midterm/papers" },
            { label: "Add paper" },
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
                <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
              </svg>
            }
            href="/courses/hy335/exams/midterm/papers"
          >
            <span>Cancel</span>
          </SecondaryButton>
        </PageHeader>
        <PageTitle
          title={<>Add a paper</>}
          description={<>Scan the whole paper into one PDF. Phone scanner apps work fine.</>}
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
          <div className="fg-span" style={{ gridColumn: "span 8", minWidth: "0" }}>
            <Card className="fg-in fg-d1" padding="28px">
              <div
                className="fg-grid"
                style={{
                  display: "grid",
                  gridTemplateColumns: "220px minmax(0, 1fr)",
                  gap: "20px",
                  alignItems: "end",
                  marginBottom: "22px",
                }}
              >
                <div style={{ width: "100%" }}>
                  <label
                    htmlFor="sid"
                    style={{
                      display: "block",
                      fontSize: "13px",
                      fontWeight: "500",
                      color: "var(--text)",
                      marginBottom: "8px",
                    }}
                  >
                    Student ID
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="sid"
                      type="text"
                      defaultValue="csd5146"
                      aria-label="Student ID"
                      style={{
                        width: "100%",
                        height: "44px",
                        padding: "0 14px 0 14px",
                        border: "0",
                        borderRadius: "12px",
                        background: "var(--surface)",
                        boxShadow:
                          "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                        fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                        fontSize: "14px",
                        color: "var(--text)",
                        outline: "none",
                      }}
                    />
                  </div>
                </div>
                <p
                  style={{
                    margin: "0 0 12px",
                    fontSize: "13px",
                    color: "var(--muted)",
                    lineHeight: "1.5",
                  }}
                >
                  Kept with the grade only. The AI never sees it.
                </p>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  padding: "14px 16px",
                  borderRadius: "18px",
                  background: "rgba(var(--ink-rgb), 0.03)",
                  marginBottom: "22px",
                }}
              >
                <span
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: "var(--red-t)",
                    color: "var(--red)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
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
                <span style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                    midterm-csd5146.pdf
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>4 pages, 2.1 MB</span>
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
                      <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                      <path d="M19.5 5v6h-6" />
                    </svg>
                  }
                >
                  <span>Replace</span>
                </SecondaryButton>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "14px",
                }}
              >
                <h3
                  style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}
                >
                  Reading the handwriting
                </h3>
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--muted)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  Page 3 of 4
                </span>
              </div>
              <div
                style={{
                  height: "4px",
                  borderRadius: "999px",
                  background: "rgba(var(--ink-rgb), 0.06)",
                  marginBottom: "20px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: "62%",
                    height: "4px",
                    borderRadius: "999px",
                    background: "var(--amber)",
                  }}
                ></div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "0.72",
                      borderRadius: "10px",
                      background: "#FBFBF8",
                      boxShadow:
                        "0 0 0 1.5px var(--green), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                      padding: "18px 14px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "82%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "70%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "88%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "64%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "76%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "58%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "80%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span style={{ position: "absolute", left: "10px", bottom: "10px" }}>
                      <Pill tone="green" dot>
                        Read
                      </Pill>
                    </span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    Page 1 · Q1
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "0.72",
                      borderRadius: "10px",
                      background: "#FBFBF8",
                      boxShadow:
                        "0 0 0 1.5px var(--green), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                      padding: "18px 14px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "82%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "70%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "88%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "64%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "76%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "58%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "80%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span style={{ position: "absolute", left: "10px", bottom: "10px" }}>
                      <Pill tone="green" dot>
                        Read
                      </Pill>
                    </span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    Page 2 · Q1, Q2
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "0.72",
                      borderRadius: "10px",
                      background: "#FBFBF8",
                      boxShadow:
                        "0 0 0 1.5px var(--amber), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                      padding: "18px 14px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "82%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "70%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "88%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "64%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "76%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "58%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "80%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      className="fg-bar"
                      style={{
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "0",
                        height: "40%",
                        background:
                          "linear-gradient(180deg, rgba(243, 201, 119, 0) 0%, rgba(243, 201, 119, 0.35) 100%)",
                      }}
                    ></span>
                    <span style={{ position: "absolute", left: "10px", bottom: "10px" }}>
                      <Pill tone="amber" dot>
                        Reading
                      </Pill>
                    </span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    Page 3 · Q2, Q3
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div
                    style={{
                      position: "relative",
                      aspectRatio: "0.72",
                      borderRadius: "10px",
                      background: "#FBFBF8",
                      boxShadow:
                        "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                      padding: "18px 14px",
                      overflow: "hidden",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "70%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "84%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "60%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "78%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span
                      style={{
                        display: "block",
                        height: "3px",
                        width: "66%",
                        borderRadius: "9px",
                        background: "rgba(31, 42, 68, 0.35)",
                        marginBottom: "7px",
                      }}
                    ></span>
                    <span style={{ position: "absolute", left: "10px", bottom: "10px" }}>
                      <Pill>Waiting</Pill>
                    </span>
                  </div>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)", whiteSpace: "nowrap" }}>
                    Page 4
                  </span>
                </div>
              </div>
            </Card>
          </div>
          <div className="fg-span" style={{ gridColumn: "span 4", minWidth: "0" }}>
            <Card className="fg-in fg-d2" padding="26px">
              <SectionHeader
                title={<>Answers found so far</>}
                description={
                  <>Each answer goes under its question. You check them on the next step.</>
                }
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderTop: "0",
                }}
              >
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
                  }}
                >
                  Q1
                </span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--ink)" }}>
                  TCP three-way handshake
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Pages 1–2</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
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
                  }}
                >
                  Q2
                </span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--ink)" }}>
                  TCP and UDP
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Pages 2–3</span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 0",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <span
                  style={{
                    height: "26px",
                    padding: "0 9px",
                    borderRadius: "8px",
                    background: "rgba(var(--ink-rgb), 0.06)",
                    color: "var(--muted)",
                    fontSize: "12.5px",
                    fontWeight: "600",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  Q3
                </span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--ink)" }}>
                  DNS resolution
                </span>
                <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Looking…</span>
              </div>
              <div style={{ marginTop: "20px" }}>
                <Button
                  size="lg"
                  fullWidth
                  href="/papers/csd5146/grade"
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
                      <path d="M5 12h14" />
                      <path d="M13 6l6 6-6 6" />
                    </svg>
                  }
                >
                  Continue to grading
                </Button>
              </div>
              <p
                style={{
                  margin: "12px 0 0",
                  fontSize: "12.5px",
                  color: "var(--muted)",
                  lineHeight: "1.5",
                }}
              >
                Hard to read? You can correct any answer by hand on the next step.
              </p>
            </Card>
          </div>
        </div>
      </AppShell>
    </>
  );
}
