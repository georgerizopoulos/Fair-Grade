// Static design, generated from design-reference/html/TADetail.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import {
  AppShell,
  Card,
  PageHeader,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";

export const metadata: Metadata = { title: "Maria Papadaki \u00b7 Fair Grade" };

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm", flagged: 1 };

export default function TaDetailPage() {
  return (
    <>
      <AppShell course={course} exam={exam} active="report" access="instructor">
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "Report", href: "/courses/hy335/exams/midterm/report" },
            { label: "Maria Papadaki" },
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
                <path d="M19 12H5" />
                <path d="M11 6l-6 6 6 6" />
              </svg>
            }
            href="/courses/hy335/exams/midterm/report"
          >
            <span>All TAs</span>
          </SecondaryButton>
        </PageHeader>
        <div
          className="fg-in"
          style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap" }}
        >
          <span
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "999px",
              background: "var(--red)",
              color: "var(--surface)",
              boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "600",
              flexShrink: "0",
            }}
          >
            M
          </span>
          <div style={{ flexGrow: "1" }}>
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
                Maria Papadaki
              </h1>
            </div>
            <p style={{ margin: "6px 0 0", fontSize: "14.5px", color: "var(--muted)" }}>
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--muted)",
                  letterSpacing: "-0.01em",
                }}
              >
                maria@demo.com
              </span>
              . 12 midterm papers graded.
            </p>
          </div>
          <Pill tone="red" dot>
            Flagged on Q2
          </Pill>
        </div>
        <Card className="fg-in fg-d1" padding="22px 24px">
          <div
            className="fg-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, minmax(0, 1fr)) minmax(0, 1.6fr)",
              alignItems: "center",
              marginLeft: "-24px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "4px 24px",
                borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Papers graded</span>
              <span>
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
                  12
                </span>
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Midterm</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "4px 24px",
                borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Her average</span>
              <span>
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
                  5.9
                </span>
                <span style={{ fontSize: "15px", color: "var(--muted)" }}> / 10</span>
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                AI on the same papers 7.3
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "4px 24px",
                borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Paper gap</span>
              <span>
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
                  −1.40
                </span>
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>Average per paper</span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                padding: "4px 24px",
                borderLeft: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Flagged on</span>
              <span>
                <span
                  style={{
                    fontSize: "36px",
                    fontWeight: "500",
                    letterSpacing: "-0.04em",
                    color: "var(--red)",
                    fontVariantNumeric: "tabular-nums",
                    lineHeight: "1",
                  }}
                >
                  Q2
                </span>
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>TCP and UDP</span>
            </div>
            <div
              style={{
                marginLeft: "24px",
                padding: "16px 18px",
                borderRadius: "16px",
                background: "var(--blue-t)",
                color: "var(--blue-x)",
                fontSize: "13.5px",
                lineHeight: "1.55",
              }}
            >
              Next step: compare her Q2 grading with the model answer, then reopen the papers you
              want her to regrade.
            </div>
          </div>
        </Card>
        <Card className="fg-in fg-d2" padding="28px">
          <SectionHeader
            title={<>Maria compared with the AI, per question</>}
            description={
              <>
                Centre line is the AI. Shaded band is the flag threshold. Bars show her average gap.
              </>
            }
          >
            <div style={{ display: "flex", gap: "14px", fontSize: "12.5px" }}>
              <span style={{ color: "var(--red-x)" }}>Stricter</span>
              <span style={{ color: "var(--blue-x)" }}>More lenient</span>
            </div>
          </SectionHeader>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(260px, 1.7fr) 150px 100px",
              gap: "20px",
              alignItems: "center",
              padding: "14px 0",
              borderTop: "0",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q1</span>TCP three-way
                handshake
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                4 points. Band ±0.60. 12 papers.
              </span>
            </span>
            <div
              style={{ position: "relative", height: "38px", minWidth: "200px", flexGrow: "1" }}
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
                  left: "45.00%",
                  top: "14.0px",
                  width: "5.00%",
                  height: "10px",
                  borderRadius: "999px",
                  background: "var(--red)",
                  opacity: "0.45",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  left: "45.00%",
                  top: "19.0px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  background: "var(--surface)",
                  boxShadow: "0 0 0 2px var(--red)",
                  transform: "translate(-50%, -50%)",
                }}
              ></span>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              0.20 stricter
            </span>
            <span>
              <Pill tone="green" dot>
                OK
              </Pill>
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(260px, 1.7fr) 150px 100px",
              gap: "20px",
              alignItems: "center",
              padding: "14px 0",
              borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q2</span>TCP and UDP
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                3 points. Band ±0.45. 12 papers.
              </span>
            </span>
            <div
              style={{ position: "relative", height: "38px", minWidth: "200px", flexGrow: "1" }}
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
                  left: "23.75%",
                  top: "14.0px",
                  width: "26.25%",
                  height: "10px",
                  borderRadius: "999px",
                  background: "var(--red)",
                  opacity: "1",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  left: "23.75%",
                  top: "19.0px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  background: "var(--surface)",
                  boxShadow: "0 0 0 2px var(--red)",
                  transform: "translate(-50%, -50%)",
                }}
              ></span>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--red-x)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              1.05 stricter
            </span>
            <span>
              <Pill tone="red" dot>
                Flagged
              </Pill>
            </span>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 0.9fr) minmax(260px, 1.7fr) 150px 100px",
              gap: "20px",
              alignItems: "center",
              padding: "14px 0",
              borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
            }}
          >
            <span style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q3</span>DNS resolution
              </span>
              <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                3 points. Band ±0.45. 12 papers.
              </span>
            </span>
            <div
              style={{ position: "relative", height: "38px", minWidth: "200px", flexGrow: "1" }}
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
                  left: "46.25%",
                  top: "14.0px",
                  width: "3.75%",
                  height: "10px",
                  borderRadius: "999px",
                  background: "var(--red)",
                  opacity: "0.45",
                }}
              ></span>
              <span
                style={{
                  position: "absolute",
                  left: "46.25%",
                  top: "19.0px",
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  background: "var(--surface)",
                  boxShadow: "0 0 0 2px var(--red)",
                  transform: "translate(-50%, -50%)",
                }}
              ></span>
            </div>
            <span
              style={{
                fontSize: "14px",
                fontWeight: "500",
                color: "var(--muted)",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              0.15 stricter
            </span>
            <span>
              <Pill tone="green" dot>
                OK
              </Pill>
            </span>
          </div>
        </Card>
        <div>
          <SectionHeader
            title={<>Papers behind the flag</>}
            description={<>Q2, TCP and UDP. The three largest gaps, largest first.</>}
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
            <div className="fg-span" style={{ gridColumn: "span 7", minWidth: "0" }}>
              <Card className="fg-in fg-d3" padding="30px">
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
                >
                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                      fontSize: "12.5px",
                      color: "var(--muted)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    csd5108, Q2
                  </span>
                  <Pill tone="red">Gap −1.5</Pill>
                </div>
                <p
                  style={{
                    margin: "16px 0 0",
                    fontSize: "20px",
                    lineHeight: "1.55",
                    letterSpacing: "-0.01em",
                    color: "var(--ink)",
                  }}
                >
                  TCP is connection oriented and resends lost segments, so it is reliable but
                  slower. UDP just sends datagrams with no handshake. Use TCP for web pages, UDP for
                  video calls where a late packet is useless.
                </p>
                <div style={{ marginTop: "18px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "14px",
                        background: "rgba(var(--ink-rgb), 0.04)",
                      }}
                    >
                      <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Maria</div>
                      <div style={{ marginTop: "6px" }}>
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "500",
                            letterSpacing: "-0.04em",
                            color: "var(--ink)",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: "1",
                          }}
                        >
                          1
                        </span>
                        <span style={{ fontSize: "13px", color: "var(--muted)" }}> / 3</span>
                      </div>
                    </div>
                    <div
                      style={{
                        padding: "12px 14px",
                        borderRadius: "14px",
                        background: "var(--blue-t)",
                      }}
                    >
                      <div style={{ fontSize: "12.5px", color: "var(--blue-x)" }}>AI</div>
                      <div style={{ marginTop: "6px" }}>
                        <span
                          style={{
                            fontSize: "24px",
                            fontWeight: "500",
                            letterSpacing: "-0.04em",
                            color: "var(--blue-x)",
                            fontVariantNumeric: "tabular-nums",
                            lineHeight: "1",
                          }}
                        >
                          2.5
                        </span>
                        <span style={{ fontSize: "13px", color: "var(--blue-x)" }}> / 3</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    marginTop: "12px",
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "rgba(var(--ink-rgb), 0.03)",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
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
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color: "var(--text)",
                    }}
                  >
                    <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>AI reasoning.</span>{" "}
                    Names connection setup and reliability as the difference and gives a correct use
                    case for each. Misses flow and congestion control, so not full marks.
                  </p>
                </div>
                <div style={{ marginTop: "14px" }}>
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
                    href="/papers/csd5146"
                  >
                    <span>Open paper</span>
                  </SecondaryButton>
                </div>
              </Card>
            </div>
            <div className="fg-span" style={{ gridColumn: "span 5", minWidth: "0" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <Card className="fg-in fg-d3">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                        fontSize: "12.5px",
                        color: "var(--muted)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      csd5112, Q2
                    </span>
                    <Pill tone="red">Gap −1</Pill>
                  </div>
                  <p
                    style={{
                      margin: "16px 0 0",
                      fontSize: "15px",
                      lineHeight: "1.55",
                      letterSpacing: "-0.01em",
                      color: "var(--ink)",
                    }}
                  >
                    TCP checks that everything arrives, UDP doesn&apos;t. TCP for email, UDP for
                    games.
                  </p>
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "14px",
                          background: "rgba(var(--ink-rgb), 0.04)",
                        }}
                      >
                        <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Maria</div>
                        <div style={{ marginTop: "6px" }}>
                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "500",
                              letterSpacing: "-0.04em",
                              color: "var(--ink)",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: "1",
                            }}
                          >
                            1
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--muted)" }}> / 3</span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "14px",
                          background: "var(--blue-t)",
                        }}
                      >
                        <div style={{ fontSize: "12.5px", color: "var(--blue-x)" }}>AI</div>
                        <div style={{ marginTop: "6px" }}>
                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "500",
                              letterSpacing: "-0.04em",
                              color: "var(--blue-x)",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: "1",
                            }}
                          >
                            2
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--blue-x)" }}> / 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "rgba(var(--ink-rgb), 0.03)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                        fontSize: "13.5px",
                        lineHeight: "1.55",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>
                        AI reasoning.
                      </span>{" "}
                      Correct core difference and two valid use cases, but no explanation of how TCP
                      achieves reliability.
                    </p>
                  </div>
                  <div style={{ marginTop: "14px" }}>
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
                      href="/papers/csd5146"
                    >
                      <span>Open paper</span>
                    </SecondaryButton>
                  </div>
                </Card>
                <Card className="fg-in fg-d4">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                        fontSize: "12.5px",
                        color: "var(--muted)",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      csd5117, Q2
                    </span>
                    <Pill tone="red">Gap −1</Pill>
                  </div>
                  <p
                    style={{
                      margin: "16px 0 0",
                      fontSize: "15px",
                      lineHeight: "1.55",
                      letterSpacing: "-0.01em",
                      color: "var(--ink)",
                    }}
                  >
                    UDP is faster because it has no header. TCP is used for downloads.
                  </p>
                  <div style={{ marginTop: "18px" }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "14px",
                          background: "rgba(var(--ink-rgb), 0.04)",
                        }}
                      >
                        <div style={{ fontSize: "12.5px", color: "var(--muted)" }}>Maria</div>
                        <div style={{ marginTop: "6px" }}>
                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "500",
                              letterSpacing: "-0.04em",
                              color: "var(--ink)",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: "1",
                            }}
                          >
                            0.5
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--muted)" }}> / 3</span>
                        </div>
                      </div>
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "14px",
                          background: "var(--blue-t)",
                        }}
                      >
                        <div style={{ fontSize: "12.5px", color: "var(--blue-x)" }}>AI</div>
                        <div style={{ marginTop: "6px" }}>
                          <span
                            style={{
                              fontSize: "24px",
                              fontWeight: "500",
                              letterSpacing: "-0.04em",
                              color: "var(--blue-x)",
                              fontVariantNumeric: "tabular-nums",
                              lineHeight: "1",
                            }}
                          >
                            1.5
                          </span>
                          <span style={{ fontSize: "13px", color: "var(--blue-x)" }}> / 3</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      marginTop: "12px",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      background: "rgba(var(--ink-rgb), 0.03)",
                    }}
                  >
                    <svg
                      width="16"
                      height="16"
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
                        fontSize: "13.5px",
                        lineHeight: "1.55",
                        color: "var(--text)",
                      }}
                    >
                      <span style={{ color: "var(--blue-x)", fontWeight: "500" }}>
                        AI reasoning.
                      </span>{" "}
                      The use case for TCP is right. The claim that UDP has no header is wrong, so
                      the difference is only partly correct.
                    </p>
                  </div>
                  <div style={{ marginTop: "14px" }}>
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
                      href="/papers/csd5146"
                    >
                      <span>Open paper</span>
                    </SecondaryButton>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
        <Card className="fg-in fg-d5" padding="26px">
          <SectionHeader
            title={<>Maria&apos;s papers</>}
            description={
              <>Each cell is Maria / AI. Gaps of 1 point or more are highlighted. 6 of 12 shown.</>
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
            >
              <span>Show all 12</span>
            </SecondaryButton>
          </SectionHeader>
          <div
            className="fg-hide-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
              gap: "16px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Student ID</span>
            <span>Q1 (max 4)</span>
            <span>Q2 (max 3)</span>
            <span>Q3 (max 3)</span>
            <span>Total</span>
            <span>Gap</span>
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
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "0",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5101
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                3.5<span style={{ color: "var(--faint)" }}>/</span>3.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                1.5<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2.5<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                7.5 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>8.5</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −1.00
              </span>
            </Link>
            <Link
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5104
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                3<span style={{ color: "var(--faint)" }}>/</span>3
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                1<span style={{ color: "var(--faint)" }}>/</span>2
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                6 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>7.5</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −1.50
              </span>
            </Link>
            <Link
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5108
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2<span style={{ color: "var(--faint)" }}>/</span>2
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                1<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                1.5<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                4.5 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>7</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −2.50
              </span>
            </Link>
            <Link
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5112
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2.5<span style={{ color: "var(--faint)" }}>/</span>3
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                1<span style={{ color: "var(--faint)" }}>/</span>2
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                1.5<span style={{ color: "var(--faint)" }}>/</span>2
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                5 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>7</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −2.00
              </span>
            </Link>
            <Link
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5115
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                4<span style={{ color: "var(--faint)" }}>/</span>4
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                3<span style={{ color: "var(--faint)" }}>/</span>3
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                9 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>9.5</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −0.50
              </span>
            </Link>
            <Link
              href="/papers/csd5146"
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "120px repeat(3, minmax(0, 1fr)) 120px 90px",
                gap: "16px",
                alignItems: "center",
                padding: "10px 20px",
                textDecoration: "none",
                color: "var(--text)",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                  fontSize: "13px",
                  color: "var(--text)",
                  letterSpacing: "-0.01em",
                }}
              >
                csd5117
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                2<span style={{ color: "var(--faint)" }}>/</span>2.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  background: "var(--red-t)",
                  color: "var(--red-x)",
                }}
              >
                0.5<span style={{ color: "var(--faint)" }}>/</span>1.5
              </span>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  height: "30px",
                  padding: "0 10px",
                  borderRadius: "9px",
                  fontSize: "13.5px",
                  fontVariantNumeric: "tabular-nums",
                  justifySelf: "start",
                  color: "var(--text)",
                }}
              >
                1.5<span style={{ color: "var(--faint)" }}>/</span>1.5
              </span>
              <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                4 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                <span style={{ color: "var(--blue-x)" }}>5.5</span>
              </span>
              <span
                style={{
                  fontSize: "14px",
                  fontVariantNumeric: "tabular-nums",
                  color: "var(--red-x)",
                }}
              >
                −1.50
              </span>
            </Link>
          </div>
        </Card>
      </AppShell>
    </>
  );
}
