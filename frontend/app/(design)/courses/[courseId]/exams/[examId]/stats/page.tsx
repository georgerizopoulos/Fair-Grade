// Static design, generated from design-reference/html/TAStats.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import {
  AppShell,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
  taNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "My stats \u00b7 Fair Grade" };

const user = { name: "Nikos Georgiou", role: "ta" } as const;
const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm" };

export default function TaStatsPage() {
  return (
    <>
      <AppShell user={user} course={course} nav={taNav({ course, exam, active: "my-stats" })}>
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "My stats" },
          ]}
        >
          <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
            Updated when the AI finishes a paper
          </span>
        </PageHeader>
        <PageTitle
          title={<>My stats</>}
          description={
            <>
              How your grading compares with the AI on the same answers. Use it to calibrate, not as
              a score.
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
          <div
            className="fg-span"
            style={{ gridColumn: "span 8", minWidth: "0", alignSelf: "stretch" }}
          >
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
                  background:
                    "radial-gradient(600px 300px at 100% 0%, #1F2A44 0%, rgba(31, 42, 68, 0) 70%), var(--ink)",
                  borderRadius: "23px",
                  padding: "30px",
                  boxShadow:
                    "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                  height: "100%",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "7px",
                      height: "26px",
                      padding: "0 10px",
                      borderRadius: "999px",
                      background: "rgba(46, 139, 87, 0.18)",
                      color: "#8FD9AE",
                      fontSize: "12.5px",
                      fontWeight: "500",
                    }}
                  >
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "#5CC48A",
                      }}
                    ></span>
                    Within the threshold
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>
                    10 papers compared with the AI
                  </span>
                </div>
                <p
                  style={{
                    margin: "22px 0 0",
                    fontSize: "29px",
                    fontWeight: "500",
                    letterSpacing: "-0.035em",
                    lineHeight: "1.2",
                    color: "var(--surface)",
                    maxWidth: "600px",
                  }}
                >
                  You grade almost exactly like the AI. On average you give{" "}
                  <span style={{ color: "#8FD9AE" }}>0.10 points less</span> per paper.
                </p>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: "14px",
                    color: "#A6ACB8",
                    lineHeight: "1.6",
                    maxWidth: "560px",
                  }}
                >
                  All three questions are inside the band. Your largest gap is on Q2, TCP and UDP,
                  at 0.10 points less, against a threshold of 0.45.
                </p>
                <div
                  style={{
                    marginTop: "26px",
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                  }}
                >
                  <Link
                    href="/courses/hy335/exams/midterm/papers/new"
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
                      fontWeight: "500",
                    }}
                  >
                    <span>Add paper</span>
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href="/courses/hy335/exams/midterm/papers"
                    className="fg-press"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      height: "48px",
                      padding: "0 18px",
                      borderRadius: "999px",
                      color: "#D9DCE3",
                      textDecoration: "none",
                      fontSize: "14.5px",
                      fontWeight: "500",
                      boxShadow: "inset 0 0 0 1px rgba(var(--surface-rgb), 0.16)",
                    }}
                  >
                    See my papers
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div
            className="fg-span"
            style={{ gridColumn: "span 4", minWidth: "0", alignSelf: "stretch" }}
          >
            <Card className="fg-in fg-d2" padding="26px" fill>
              <div
                style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
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
                  Your stack
                </h2>
                <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Midterm</span>
              </div>
              <div style={{ marginTop: "16px" }}>
                <span
                  style={{
                    fontSize: "44px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  11
                </span>
                <span style={{ fontSize: "16px", color: "var(--muted)" }}> / 12 submitted</span>
              </div>
              <div style={{ display: "flex", gap: "4px", margin: "18px 0 14px" }}>
                <span
                  style={{
                    flex: "10",
                    height: "10px",
                    borderRadius: "999px",
                    background: "var(--blue)",
                  }}
                ></span>
                <span
                  style={{
                    flex: "1",
                    height: "10px",
                    borderRadius: "999px",
                    background: "var(--amber)",
                  }}
                ></span>
                <span
                  style={{
                    flex: "1",
                    height: "10px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.14)",
                  }}
                ></span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 0",
                  borderTop: "0",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "var(--blue)",
                  }}
                ></span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--text)" }}>
                  Compared with the AI
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "500",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  10
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 0",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "var(--amber)",
                  }}
                ></span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--text)" }}>
                  AI grading now
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "500",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  1
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "9px 0",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <span
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.14)",
                  }}
                ></span>
                <span style={{ flexGrow: "1", fontSize: "13.5px", color: "var(--text)" }}>
                  Draft, not submitted
                </span>
                <span
                  style={{
                    fontSize: "13.5px",
                    fontWeight: "500",
                    color: "var(--ink)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  1
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginTop: "12px",
                  padding: "11px 14px",
                  borderRadius: "14px",
                  background: "rgba(var(--ink-rgb), 0.035)",
                  fontSize: "13px",
                  color: "var(--text)",
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="var(--muted)"
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
                <span>Grades are due Friday 9 October.</span>
              </div>
            </Card>
          </div>
        </div>
        <div
          className="fg-grid fg-in fg-d2"
          style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: "20px" }}
        >
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Your average</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                7.0
              </span>
              <span style={{ fontSize: "15px", color: "var(--muted)" }}> / 10</span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              AI <span style={{ color: "var(--blue-x)" }}>7.1</span> on the same papers
            </div>
          </Card>
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Gap per paper</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "36px",
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
              You minus the AI, on average
            </div>
          </Card>
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Exact matches</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--ink)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                5
              </span>
              <span style={{ fontSize: "15px", color: "var(--muted)" }}> of 10</span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              9 of 10 within half a point
            </div>
          </Card>
          <Card padding="20px 22px">
            <div style={{ fontSize: "13px", color: "var(--muted)" }}>Largest gap</div>
            <div style={{ marginTop: "12px" }}>
              <span
                style={{
                  fontSize: "36px",
                  fontWeight: "500",
                  letterSpacing: "-0.04em",
                  color: "var(--red-x)",
                  fontVariantNumeric: "tabular-nums",
                  lineHeight: "1",
                }}
              >
                −1
              </span>
            </div>
            <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "12px",
                  color: "var(--muted)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5146
              </span>
              , on Q2
            </div>
          </Card>
        </div>
        <Card className="fg-in fg-d3" padding="28px">
          <SectionHeader
            title={<>You and the AI, paper by paper</>}
            description={
              <>
                Total out of 10, in the order you graded them. A line shows the gap: red when you
                gave less, blue when you gave more.
              </>
            }
          >
            <div
              style={{
                display: "flex",
                gap: "16px",
                alignItems: "center",
                fontSize: "12.5px",
                color: "var(--muted)",
                flexWrap: "wrap",
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    background: "var(--ink)",
                  }}
                ></span>
                You
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
                <span
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "999px",
                    boxShadow: "inset 0 0 0 2px var(--blue)",
                  }}
                ></span>
                AI
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "7px" }}>
                <span
                  style={{
                    width: "14px",
                    height: "14px",
                    borderRadius: "999px",
                    boxShadow: "inset 0 0 0 2px var(--blue)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "999px",
                      background: "var(--ink)",
                    }}
                  ></span>
                </span>
                Same grade
              </span>
            </div>
          </SectionHeader>
          <div style={{ padding: "6px 4px 0" }}>
            <svg
              viewBox="0 0 1000 300"
              width="100%"
              role="img"
              aria-label="Your grade and the AI grade for each paper, in the order you graded them"
              style={{ display: "block", overflow: "visible" }}
            >
              <line
                x1="44"
                x2="984"
                y1="205.7"
                y2="205.7"
                stroke="rgba(var(--ink-rgb), 0.07)"
                strokeWidth="1"
              />
              <text
                x="32"
                y="209.7"
                textAnchor="end"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                4
              </text>
              <line
                x1="44"
                x2="984"
                y1="145.1"
                y2="145.1"
                stroke="rgba(var(--ink-rgb), 0.07)"
                strokeWidth="1"
              />
              <text
                x="32"
                y="149.1"
                textAnchor="end"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                6
              </text>
              <line
                x1="44"
                x2="984"
                y1="84.6"
                y2="84.6"
                stroke="rgba(var(--ink-rgb), 0.07)"
                strokeWidth="1"
              />
              <text
                x="32"
                y="88.6"
                textAnchor="end"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                8
              </text>
              <line
                x1="44"
                x2="984"
                y1="24.0"
                y2="24.0"
                stroke="rgba(var(--ink-rgb), 0.07)"
                strokeWidth="1"
              />
              <text
                x="32"
                y="28.0"
                textAnchor="end"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                10
              </text>
              <line
                x1="318.4"
                x2="318.4"
                y1="14"
                y2="236"
                stroke="rgba(var(--ink-rgb), 0.14)"
                strokeDasharray="3 4"
              />
              <text
                x="308.4"
                y="22"
                textAnchor="end"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                Yesterday
              </text>
              <text
                x="328.4"
                y="22"
                fontSize="11.5"
                fill="var(--muted)"
                fontFamily="Geist, sans-serif"
              >
                Today
              </text>
              <Link href="/papers/csd5146" aria-label="csd5121: you 8, AI 8">
                <circle
                  cx="74.0"
                  cy="84.6"
                  r="9.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="74.0" cy="84.6" r="5" fill="var(--ink)" />
                <text
                  x="74.0"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5121
                </text>
                <text
                  x="74.0"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  8 / <tspan fill="var(--blue-x)">8</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5125: you 6.5, AI 6.5">
                <circle
                  cx="171.8"
                  cy="130.0"
                  r="9.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="171.8" cy="130.0" r="5" fill="var(--ink)" />
                <text
                  x="171.8"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5125
                </text>
                <text
                  x="171.8"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  6.5 / <tspan fill="var(--blue-x)">6.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5129: you 8, AI 7.5">
                <line
                  x1="269.6"
                  x2="269.6"
                  y1="84.6"
                  y2="99.7"
                  stroke="var(--blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle
                  cx="269.6"
                  cy="99.7"
                  r="6.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="269.6" cy="84.6" r="6" fill="var(--ink)" />
                <text
                  x="282.6"
                  y="96.1"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--blue-x)"
                  fontFamily="Geist, sans-serif"
                >
                  +0.5
                </text>
                <text
                  x="269.6"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5129
                </text>
                <text
                  x="269.6"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  8 / <tspan fill="var(--blue-x)">7.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5133: you 4, AI 4.5">
                <line
                  x1="367.3"
                  x2="367.3"
                  y1="205.7"
                  y2="190.6"
                  stroke="var(--red)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle
                  cx="367.3"
                  cy="190.6"
                  r="6.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="367.3" cy="205.7" r="6" fill="var(--ink)" />
                <text
                  x="380.3"
                  y="202.1"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--red-x)"
                  fontFamily="Geist, sans-serif"
                >
                  −0.5
                </text>
                <text
                  x="367.3"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5133
                </text>
                <text
                  x="367.3"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  4 / <tspan fill="var(--blue-x)">4.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5136: you 7.5, AI 7.5">
                <circle
                  cx="465.1"
                  cy="99.7"
                  r="9.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="465.1" cy="99.7" r="5" fill="var(--ink)" />
                <text
                  x="465.1"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5136
                </text>
                <text
                  x="465.1"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  7.5 / <tspan fill="var(--blue-x)">7.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5137: you 5.5, AI 5">
                <line
                  x1="562.9"
                  x2="562.9"
                  y1="160.3"
                  y2="175.4"
                  stroke="var(--blue)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle
                  cx="562.9"
                  cy="175.4"
                  r="6.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="562.9" cy="160.3" r="6" fill="var(--ink)" />
                <text
                  x="575.9"
                  y="171.9"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--blue-x)"
                  fontFamily="Geist, sans-serif"
                >
                  +0.5
                </text>
                <text
                  x="562.9"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5137
                </text>
                <text
                  x="562.9"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  5.5 / <tspan fill="var(--blue-x)">5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5139: you 9, AI 9">
                <circle
                  cx="660.7"
                  cy="54.3"
                  r="9.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="660.7" cy="54.3" r="5" fill="var(--ink)" />
                <text
                  x="660.7"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5139
                </text>
                <text
                  x="660.7"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  9 / <tspan fill="var(--blue-x)">9</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5141: you 6, AI 6.5">
                <line
                  x1="758.4"
                  x2="758.4"
                  y1="145.1"
                  y2="130.0"
                  stroke="var(--red)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle
                  cx="758.4"
                  cy="130.0"
                  r="6.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="758.4" cy="145.1" r="6" fill="var(--ink)" />
                <text
                  x="771.4"
                  y="141.6"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--red-x)"
                  fontFamily="Geist, sans-serif"
                >
                  −0.5
                </text>
                <text
                  x="758.4"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5141
                </text>
                <text
                  x="758.4"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  6 / <tspan fill="var(--blue-x)">6.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5144: you 8.5, AI 8.5">
                <circle
                  cx="856.2"
                  cy="69.4"
                  r="9.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="856.2" cy="69.4" r="5" fill="var(--ink)" />
                <text
                  x="856.2"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5144
                </text>
                <text
                  x="856.2"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  8.5 / <tspan fill="var(--blue-x)">8.5</tspan>
                </text>
              </Link>
              <Link href="/papers/csd5146" aria-label="csd5146: you 7, AI 8">
                <line
                  x1="954.0"
                  x2="954.0"
                  y1="114.9"
                  y2="84.6"
                  stroke="var(--red)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <circle
                  cx="954.0"
                  cy="84.6"
                  r="6.5"
                  fill="var(--surface)"
                  stroke="var(--blue)"
                  strokeWidth="2.5"
                />
                <circle cx="954.0" cy="114.9" r="6" fill="var(--ink)" />
                <text
                  x="967.0"
                  y="103.7"
                  fontSize="12"
                  fontWeight="500"
                  fill="var(--red-x)"
                  fontFamily="Geist, sans-serif"
                >
                  −1
                </text>
                <text
                  x="954.0"
                  y="262"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--text)"
                  fontFamily="Geist Mono, monospace"
                >
                  csd5146
                </text>
                <text
                  x="954.0"
                  y="280"
                  textAnchor="middle"
                  fontSize="11.5"
                  fill="var(--muted)"
                  fontFamily="Geist, sans-serif"
                >
                  7 / <tspan fill="var(--blue-x)">8</tspan>
                </text>
              </Link>
            </svg>
          </div>
        </Card>
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
            style={{ gridColumn: "span 7", minWidth: "0", alignSelf: "stretch" }}
          >
            <Card className="fg-in fg-d4" padding="28px" fill>
              <SectionHeader
                title={<>Your gap per question</>}
                description={
                  <>
                    Centre line is the AI. The shaded band is the flag threshold, 15% of the
                    question&apos;s points.
                  </>
                }
              />
              <div style={{ padding: "16px 0 12px", borderTop: "0" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q1</span>TCP
                      three-way handshake
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "var(--muted)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      You 3.05, AI <span style={{ color: "var(--blue-x)" }}>3.00</span> of 4. Band
                      ±0.60
                    </span>
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}
                  >
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0.05 more lenient
                    </span>
                    <Pill tone="green" dot>
                      OK
                    </Pill>
                  </span>
                </div>
                <div
                  style={{ position: "relative", height: "34px", minWidth: "200px", flexGrow: "1" }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "35.00%",
                      width: "30.00%",
                      top: "4px",
                      bottom: "4px",
                      borderRadius: "8px",
                      background: "rgba(var(--ink-rgb), 0.05)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "2px",
                      bottom: "2px",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "var(--ink)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50.00%",
                      top: "12.0px",
                      width: "1.25%",
                      height: "10px",
                      borderRadius: "999px",
                      background: "var(--blue)",
                      opacity: "0.45",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "17.0px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "999px",
                      background: "var(--surface)",
                      boxShadow: "0 0 0 2px var(--blue)",
                      transform: "translate(-50%, -50%)",
                    }}
                  ></span>
                </div>
              </div>
              <div
                style={{
                  padding: "16px 0 12px",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q2</span>TCP and
                      UDP
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "var(--muted)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      You 1.90, AI <span style={{ color: "var(--blue-x)" }}>2.00</span> of 3. Band
                      ±0.45
                    </span>
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}
                  >
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0.10 stricter
                    </span>
                    <Pill tone="green" dot>
                      OK
                    </Pill>
                  </span>
                </div>
                <div
                  style={{ position: "relative", height: "34px", minWidth: "200px", flexGrow: "1" }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "38.75%",
                      width: "22.50%",
                      top: "4px",
                      bottom: "4px",
                      borderRadius: "8px",
                      background: "rgba(var(--ink-rgb), 0.05)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "2px",
                      bottom: "2px",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "var(--ink)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "47.50%",
                      top: "12.0px",
                      width: "2.50%",
                      height: "10px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      opacity: "0.45",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "47.50%",
                      top: "17.0px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "999px",
                      background: "var(--surface)",
                      boxShadow: "0 0 0 2px var(--red)",
                      transform: "translate(-50%, -50%)",
                    }}
                  ></span>
                </div>
              </div>
              <div
                style={{
                  padding: "16px 0 12px",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "16px",
                    marginBottom: "8px",
                  }}
                >
                  <span
                    style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                      <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q3</span>DNS
                      resolution
                    </span>
                    <span
                      style={{
                        fontSize: "12.5px",
                        color: "var(--muted)",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      You 2.05, AI <span style={{ color: "var(--blue-x)" }}>2.10</span> of 3. Band
                      ±0.45
                    </span>
                  </span>
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: "0" }}
                  >
                    <span
                      style={{
                        fontSize: "13.5px",
                        color: "var(--muted)",
                        whiteSpace: "nowrap",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0.05 stricter
                    </span>
                    <Pill tone="green" dot>
                      OK
                    </Pill>
                  </span>
                </div>
                <div
                  style={{ position: "relative", height: "34px", minWidth: "200px", flexGrow: "1" }}
                  aria-hidden="true"
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "38.75%",
                      width: "22.50%",
                      top: "4px",
                      bottom: "4px",
                      borderRadius: "8px",
                      background: "rgba(var(--ink-rgb), 0.05)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "6px",
                      bottom: "6px",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "2px",
                      bottom: "2px",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "var(--ink)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "48.75%",
                      top: "12.0px",
                      width: "1.25%",
                      height: "10px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      opacity: "0.45",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "48.75%",
                      top: "17.0px",
                      width: "12px",
                      height: "12px",
                      borderRadius: "999px",
                      background: "var(--surface)",
                      boxShadow: "0 0 0 2px var(--red)",
                      transform: "translate(-50%, -50%)",
                    }}
                  ></span>
                </div>
              </div>
            </Card>
          </div>
          <div
            className="fg-span"
            style={{ gridColumn: "span 5", minWidth: "0", alignSelf: "stretch" }}
          >
            <Card className="fg-in fg-d4" padding="28px" fill>
              <SectionHeader
                title={<>Where you stand</>}
                description={
                  <>
                    Average gap per paper for every TA on the midterm, closest to the AI first.
                    Other TAs are not named.
                  </>
                }
              />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  padding: "0 0 8px",
                  fontSize: "12px",
                }}
              >
                <span></span>
                <span style={{ position: "relative", height: "16px" }}>
                  <span style={{ position: "absolute", left: "0", color: "var(--red-x)" }}>
                    Stricter
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      transform: "translateX(-50%)",
                      color: "var(--ink)",
                    }}
                  >
                    AI
                  </span>
                  <span style={{ position: "absolute", right: "0", color: "var(--blue-x)" }}>
                    More lenient
                  </span>
                </span>
                <span></span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  alignItems: "center",
                  padding: "9px 12px",
                  margin: "0 -12px",
                  borderRadius: "12px",
                  background: "rgba(var(--ink-rgb), 0.04)",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    color: "var(--ink)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      fontSize: "12px",
                      color: "var(--faint)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    1
                  </span>
                  You
                </span>
                <span style={{ position: "relative", height: "22px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "var(--ink)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      height: "10px",
                      marginTop: "-5px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      opacity: "1",
                      right: "50%",
                      width: "3.33%",
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: "13.5px",
                    fontWeight: "600",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--red-x)",
                  }}
                >
                  −0.10
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  alignItems: "center",
                  padding: "9px 12px",
                  margin: "0 -12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      fontSize: "12px",
                      color: "var(--faint)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    2
                  </span>
                  A TA
                </span>
                <span style={{ position: "relative", height: "22px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "rgba(var(--ink-rgb), 0.25)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      height: "10px",
                      marginTop: "-5px",
                      borderRadius: "999px",
                      background: "var(--blue)",
                      opacity: "0.3",
                      left: "50%",
                      width: "3.33%",
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  +0.10
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  alignItems: "center",
                  padding: "9px 12px",
                  margin: "0 -12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      fontSize: "12px",
                      color: "var(--faint)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    3
                  </span>
                  A TA
                </span>
                <span style={{ position: "relative", height: "22px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "rgba(var(--ink-rgb), 0.25)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      height: "10px",
                      marginTop: "-5px",
                      borderRadius: "999px",
                      background: "var(--blue)",
                      opacity: "0.3",
                      left: "50%",
                      width: "6.67%",
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  +0.20
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  alignItems: "center",
                  padding: "9px 12px",
                  margin: "0 -12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      fontSize: "12px",
                      color: "var(--faint)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    4
                  </span>
                  A TA
                </span>
                <span style={{ position: "relative", height: "22px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "rgba(var(--ink-rgb), 0.25)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      height: "10px",
                      marginTop: "-5px",
                      borderRadius: "999px",
                      background: "var(--blue)",
                      opacity: "0.3",
                      left: "50%",
                      width: "20.00%",
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  +0.60
                </span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "92px minmax(0, 1fr) 56px",
                  gap: "14px",
                  alignItems: "center",
                  padding: "9px 12px",
                  margin: "0 -12px",
                  borderRadius: "12px",
                }}
              >
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: "20px",
                      fontSize: "12px",
                      color: "var(--faint)",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    5
                  </span>
                  A TA
                </span>
                <span style={{ position: "relative", height: "22px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "0",
                      bottom: "0",
                      width: "1.5px",
                      marginLeft: "-0.75px",
                      background: "rgba(var(--ink-rgb), 0.25)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      top: "50%",
                      height: "10px",
                      marginTop: "-5px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      opacity: "0.3",
                      right: "50%",
                      width: "46.67%",
                    }}
                  ></span>
                </span>
                <span
                  style={{
                    textAlign: "right",
                    fontSize: "13.5px",
                    fontWeight: "400",
                    fontVariantNumeric: "tabular-nums",
                    color: "var(--muted)",
                  }}
                >
                  −1.40
                </span>
              </div>
              <p
                style={{
                  margin: "16px 0 0",
                  paddingTop: "14px",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  fontSize: "13px",
                  lineHeight: "1.55",
                  color: "var(--muted)",
                }}
              >
                You are tied for closest to the AI. Only you and the instructor see your numbers.
              </p>
            </Card>
          </div>
        </div>
        <Card className="fg-in fg-d5" padding="26px">
          <SectionHeader
            title={<>Worth a second look</>}
            description={
              <>
                Your largest gaps on a single question. Open one to read the answer next to the
                AI&apos;s reasoning.
              </>
            }
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
              href="/courses/hy335/exams/midterm/papers"
            >
              <span>All my papers</span>
            </SecondaryButton>
          </SectionHeader>
          <div
            className="fg-hide-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "110px minmax(0, 0.9fr) 72px 72px 64px minmax(0, 1.7fr) 24px",
              gap: "16px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Student ID</span>
            <span>Question</span>
            <span>You</span>
            <span>AI</span>
            <span>Gap</span>
            <span>AI reasoning</span>
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
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "110px minmax(0, 0.9fr) 72px 72px 64px minmax(0, 1.7fr) 24px",
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
                  fontSize: "13.5px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5146
              </span>
              <span style={{ fontSize: "13.5px", minWidth: "0" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q2</span>TCP and UDP
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                1<span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--blue-x)",
                }}
              >
                2<span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −1
              </span>
              <span
                style={{ display: "flex", gap: "8px", alignItems: "flex-start", minWidth: "0" }}
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
                <span
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "var(--muted)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  States the core difference, reliability, and gives a correct use case for each.
                  Nothing on how TCP achieves it or on overhead.
                </span>
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
                gridTemplateColumns: "110px minmax(0, 0.9fr) 72px 72px 64px minmax(0, 1.7fr) 24px",
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
                  fontSize: "13.5px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5137
              </span>
              <span style={{ fontSize: "13.5px", minWidth: "0" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q1</span>TCP three-way
                handshake
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                2.5<span style={{ color: "var(--muted)" }}> / 4</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--blue-x)",
                }}
              >
                2<span style={{ color: "var(--muted)" }}> / 4</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--blue-x)",
                }}
              >
                +0.5
              </span>
              <span
                style={{ display: "flex", gap: "8px", alignItems: "flex-start", minWidth: "0" }}
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
                <span
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "var(--muted)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Names SYN and ACK but skips SYN-ACK, so the order is incomplete. Sequence numbers
                  are not explained.
                </span>
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
                gridTemplateColumns: "110px minmax(0, 0.9fr) 72px 72px 64px minmax(0, 1.7fr) 24px",
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
                  fontSize: "13.5px",
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5141
              </span>
              <span style={{ fontSize: "13.5px", minWidth: "0" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q2</span>TCP and UDP
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                1.5<span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--blue-x)",
                }}
              >
                2<span style={{ color: "var(--muted)" }}> / 3</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −0.5
              </span>
              <span
                style={{ display: "flex", gap: "8px", alignItems: "flex-start", minWidth: "0" }}
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
                <span
                  style={{
                    fontSize: "13px",
                    lineHeight: "1.5",
                    color: "var(--muted)",
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: "2",
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  Correct difference and two valid use cases. Says nothing about overhead or
                  congestion control.
                </span>
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
