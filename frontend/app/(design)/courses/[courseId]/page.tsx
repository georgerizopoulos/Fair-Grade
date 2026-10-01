// Static design, generated from design-reference/html/Course.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import { CourseLivePage } from "./course-page";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  PageHeader,
  Pill,
  RoleChip,
  SecondaryButton,
  SectionHeader,
  YouTag,
} from "@/components/shell";

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };

export default function CoursePage() {
  return <CourseLivePage />;
}

export function StaticCoursePage() {
  return (
    <>
      <AppShell course={course} active="exams">
        <PageHeader
          crumbs={[
            { label: "All courses", href: "/courses" },
            { label: "HY335 Computer Networks" },
          ]}
        >
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
            New exam
          </Button>
        </PageHeader>
        <div className="fg-in" style={{ display: "flex", alignItems: "center", gap: "18px" }}>
          <span
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "18px",
              background: "var(--blue-t)",
              color: "var(--blue-x)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "20px",
              fontWeight: "600",
              flexShrink: "0",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            335
          </span>
          <div>
            <div>
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
                HY335 Computer Networks
              </h1>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "14.5px", color: "var(--muted)" }}>
              Winter semester 2026–27. Instructor Demo with 5 TAs.
            </p>
          </div>
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
          <div className="fg-span" style={{ gridColumn: "span 8", minWidth: "0" }}>
            <Card className="fg-in fg-d1" padding="26px">
              <SectionHeader
                title={<>Exams</>}
                description={
                  <>
                    For each exam you upload the questions and model answers. TAs then scan and
                    grade the papers they hold.
                  </>
                }
              />
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
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3
                          style={{
                            margin: "0",
                            fontSize: "19px",
                            fontWeight: "600",
                            letterSpacing: "-0.025em",
                            color: "var(--ink)",
                          }}
                        >
                          Midterm
                        </h3>
                        <Pill tone="red" dot>
                          1 TA flagged
                        </Pill>
                      </div>
                      <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                        Held 30 Sep 2026. Grading in progress.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                            <path d="M5 7h9" />
                            <path d="M18 7h1" />
                            <circle cx="16" cy="7" r="2" />
                            <path d="M5 17h1" />
                            <path d="M10 17h9" />
                            <circle cx="8" cy="17" r="2" />
                          </svg>
                        }
                        href="/courses/hy335/exams/midterm/setup"
                      >
                        <span>Setup</span>
                      </SecondaryButton>
                      <Button
                        href="/courses/hy335/exams/midterm/report"
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
                            <path d="M7 17L17 7" />
                            <path d="M9 7h8v8" />
                          </svg>
                        }
                      >
                        Open report
                      </Button>
                    </div>
                  </div>
                  <div
                    className="fg-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
                      gap: "22px",
                      alignItems: "end",
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                        Papers graded
                      </span>
                      <span
                        style={{
                          fontSize: "26px",
                          fontWeight: "500",
                          letterSpacing: "-0.04em",
                          color: "var(--ink)",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: "1",
                        }}
                      >
                        58
                      </span>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Graders</span>
                      <span style={{ display: "flex" }}>
                        <span style={{ marginLeft: "0px" }}>
                          <Avatar initial="M" size={26} />
                        </span>
                        <span style={{ marginLeft: "-7px" }}>
                          <Avatar initial="G" size={26} />
                        </span>
                        <span style={{ marginLeft: "-7px" }}>
                          <Avatar initial="E" size={26} />
                        </span>
                        <span style={{ marginLeft: "-7px" }}>
                          <Avatar initial="N" size={26} />
                        </span>
                        <span style={{ marginLeft: "-7px" }}>
                          <Avatar initial="K" size={26} />
                        </span>
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "7px",
                        minWidth: "0",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          fontSize: "12.5px",
                        }}
                      >
                        <span style={{ color: "var(--muted)" }}>AI graded</span>
                        <span style={{ color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
                          57 / 58
                        </span>
                      </div>
                      <div
                        style={{
                          height: "4px",
                          borderRadius: "999px",
                          background: "rgba(var(--ink-rgb), 0.06)",
                        }}
                      >
                        <div
                          style={{
                            width: "98%",
                            height: "4px",
                            borderRadius: "999px",
                            background: "var(--blue)",
                          }}
                        ></div>
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Questions</span>
                      <span style={{ fontSize: "14px", color: "var(--ink)" }}>3, 10 points</span>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "22px 24px",
                    borderRadius: "20px",
                    background: "rgba(var(--ink-rgb), 0.02)",
                    boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3
                          style={{
                            margin: "0",
                            fontSize: "19px",
                            fontWeight: "600",
                            letterSpacing: "-0.025em",
                            color: "var(--ink)",
                          }}
                        >
                          Final
                        </h3>
                        <Pill dot>Questions ready</Pill>
                      </div>
                      <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                        January 2027.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                            <path d="M5 12h14" />
                            <path d="M13 6l6 6-6 6" />
                          </svg>
                        }
                        href="/courses/hy335/exams/midterm/setup"
                      >
                        <span>Edit questions</span>
                      </SecondaryButton>
                    </div>
                  </div>
                  <div
                    className="fg-grid"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                      gap: "22px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "13.5px",
                        color: "var(--ink)",
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "var(--green)",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
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
                      Questions and model answers
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "13.5px",
                        color: "var(--muted)",
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(var(--ink-rgb), 0.06)",
                        }}
                      ></span>
                      Open for grading
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "13.5px",
                        color: "var(--muted)",
                      }}
                    >
                      <span
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "999px",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: "rgba(var(--ink-rgb), 0.06)",
                        }}
                      ></span>
                      Papers scanned by TAs
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    padding: "22px 24px",
                    borderRadius: "20px",
                    background: "rgba(var(--ink-rgb), 0.02)",
                    boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      gap: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <h3
                          style={{
                            margin: "0",
                            fontSize: "19px",
                            fontWeight: "600",
                            letterSpacing: "-0.025em",
                            color: "var(--ink)",
                          }}
                        >
                          Resit
                        </h3>
                        <Pill>Not started</Pill>
                      </div>
                      <p style={{ margin: "5px 0 0", fontSize: "13.5px", color: "var(--muted)" }}>
                        September 2027.
                      </p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                        <span>Add questions</span>
                      </SecondaryButton>
                    </div>
                  </div>
                  <p style={{ margin: "0", fontSize: "13.5px", color: "var(--muted)" }}>
                    Upload the questions and model answers when the paper is ready.
                  </p>
                </div>
              </div>
              <div style={{ margin: "24px 0 10px", fontSize: "12.5px", color: "var(--muted)" }}>
                Graded earlier
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                  overflow: "hidden",
                }}
              >
                <Link
                  href="/courses/hy335/exams/midterm/report"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 90px 130px 110px 24px",
                    gap: "14px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "0",
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14.5px", fontWeight: "600", color: "var(--ink)" }}>
                      Quiz 2
                    </span>
                    <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                      23 Sep 2026, grades published
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    54 papers
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    Avg gap <span style={{ color: "var(--ink)", fontWeight: "500" }}>0.53</span>
                  </span>
                  <span>
                    <Pill tone="red" dot>
                      1 flagged
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
                  href="/courses/hy335/exams/midterm/report"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 90px 130px 110px 24px",
                    gap: "14px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    <span style={{ fontSize: "14.5px", fontWeight: "600", color: "var(--ink)" }}>
                      Quiz 1
                    </span>
                    <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                      16 Sep 2026, grades published
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    55 papers
                  </span>
                  <span
                    style={{
                      fontSize: "13px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    Avg gap <span style={{ color: "var(--ink)", fontWeight: "500" }}>0.64</span>
                  </span>
                  <span>
                    <Pill tone="red" dot>
                      2 flagged
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
          </div>
          <div className="fg-span" style={{ gridColumn: "span 4", minWidth: "0" }}>
            <div
              style={{
                position: "sticky",
                top: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              <Card className="fg-in fg-d2">
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <h2
                    style={{
                      margin: "0",
                      fontSize: "17px",
                      fontWeight: "600",
                      letterSpacing: "-0.02em",
                      color: "var(--ink)",
                    }}
                  >
                    Course stats
                  </h2>
                  <Pill tone="green" dot>
                    Improving
                  </Pill>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-between",
                    gap: "12px",
                    marginTop: "16px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                      Average gap per paper
                    </div>
                    <div style={{ marginTop: "8px" }}>
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
                        0.48
                      </span>
                      <span
                        style={{ fontSize: "12.5px", color: "var(--green-x)", marginLeft: "8px" }}
                      >
                        −25%
                      </span>
                    </div>
                  </div>
                  <div style={{ paddingBottom: "6px" }}>
                    <svg
                      width="110"
                      height="40"
                      viewBox="0 0 110 40"
                      aria-hidden="true"
                      style={{ display: "block" }}
                    >
                      <polyline
                        points="6,8 55,22 104,28"
                        fill="none"
                        stroke="var(--ink)"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="6"
                        cy="8"
                        r="2.6"
                        fill="var(--surface)"
                        stroke="var(--ink)"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx="55"
                        cy="22"
                        r="2.6"
                        fill="var(--surface)"
                        stroke="var(--ink)"
                        strokeWidth="1.5"
                      />
                      <circle cx="104" cy="28" r="3.6" fill="var(--green)" />
                    </svg>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginTop: "18px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "rgba(243, 213, 138, 0.22)",
                  }}
                >
                  <span
                    style={{
                      width: "30px",
                      height: "30px",
                      borderRadius: "999px",
                      background: "var(--gold-icon)",
                      color: "var(--ink)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: "600",
                    }}
                  >
                    K
                  </span>
                  <span style={{ display: "flex", flexDirection: "column", flexGrow: "1" }}>
                    <span style={{ fontSize: "13.5px", fontWeight: "500", color: "var(--ink)" }}>
                      Katerina Vlachou
                    </span>
                    <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                      Closest to the AI, 0.13
                    </span>
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#9A7A24"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{ flexShrink: "0", display: "block" }}
                  >
                    <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
                    <path d="M8 6H5.5A2.5 2.5 0 0 0 8 10.3" />
                    <path d="M16 6h2.5A2.5 2.5 0 0 1 16 10.3" />
                    <path d="M12 13v3" />
                    <path d="M8.5 20h7" />
                    <path d="M10 20c0-1.8.9-3 2-3s2 1.2 2 3" />
                  </svg>
                </div>
                <div style={{ marginTop: "16px" }}>
                  <Button
                    fullWidth
                    href="/courses/hy335/stats"
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
                        <path d="M7 17L17 7" />
                        <path d="M9 7h8v8" />
                      </svg>
                    }
                  >
                    Open course stats
                  </Button>
                </div>
              </Card>
              <Card className="fg-in fg-d2">
                <SectionHeader
                  title={<>People</>}
                  description={<>6 people. TAs see every exam in this course.</>}
                />
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "0",
                  }}
                >
                  <Avatar initial="I" size={32} ink />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Instructor Demo
                      <YouTag />
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="instructor" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  ></span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <Avatar initial="M" size={32} />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Maria Papadaki
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="ta" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    12 papers
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <Avatar initial="G" size={32} />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Giannis Petrou
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="ta" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    11 papers
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <Avatar initial="E" size={32} />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Eleni Markou
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="ta" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    12 papers
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <Avatar initial="N" size={32} />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Nikos Georgiou
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="ta" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    11 papers
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "10px 0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <Avatar initial="K" size={32} />
                  <span
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flexGrow: "1",
                      minWidth: "0",
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      Katerina Vlachou
                    </span>
                    <span style={{ marginTop: "4px" }}>
                      <RoleChip role="ta" />
                    </span>
                  </span>
                  <span
                    style={{
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    12 papers
                  </span>
                </div>
                <div style={{ marginTop: "16px" }}>
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
                        <circle cx="9" cy="8.5" r="3.2" />
                        <path d="M3.5 19c.8-3.3 3-5 5.5-5s4.7 1.7 5.5 5" />
                        <circle cx="17" cy="9.5" r="2.4" />
                        <path d="M16 14.2c2.3.1 4 1.6 4.6 4.3" />
                      </svg>
                    }
                    href="/courses/hy335/members"
                  >
                    <span>Manage members</span>
                  </SecondaryButton>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
