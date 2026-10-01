// Static design, generated from design-reference/html/Dashboard.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import Link from "next/link";
import type { Metadata } from "next";
import {
  AppShell,
  Avatar,
  Card,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
  SectionHeader,
} from "@/components/shell";

export const metadata: Metadata = { title: "Midterm report \u00b7 Fair Grade" };

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm", flagged: 1 };

export default function ExamReportPage() {
  return (
    <>
      <AppShell course={course} exam={exam} active="report" access="instructor">
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "Report" },
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
                <path d="M12 15.5V4.5" />
                <path d="M7.5 9l4.5-4.5L16.5 9" />
                <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
              </svg>
            }
          >
            <span>Export grades</span>
          </SecondaryButton>
        </PageHeader>
        <PageTitle
          title={<>Midterm report</>}
          description={
            <>
              Every submitted paper has a TA grade and an AI grade. This is where they disagree, by
              TA and by question.
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
            style={{ gridColumn: "span 7", minWidth: "0", alignSelf: "stretch" }}
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
                    "radial-gradient(600px 300px at 100% 0%, #2B2230 0%, rgba(43, 34, 48, 0) 70%), var(--ink)",
                  borderRadius: "23px",
                  padding: "30px",
                  boxShadow:
                    "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                  height: "100%",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
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
                    <span
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "999px",
                        background: "#E8EAEE",
                      }}
                    ></span>
                    Flag raised
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#8E95A3" }}>58 papers so far</span>
                </div>
                <p
                  style={{
                    margin: "22px 0 0",
                    fontSize: "29px",
                    fontWeight: "500",
                    letterSpacing: "-0.035em",
                    lineHeight: "1.2",
                    color: "var(--surface)",
                    maxWidth: "580px",
                  }}
                >
                  Maria Papadaki gives papers{" "}
                  <span style={{ color: "#F29B9B" }}>1.4 points less</span> than the AI on average,
                  almost all of it on Q2.
                </p>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: "14px",
                    color: "#A6ACB8",
                    lineHeight: "1.6",
                    maxWidth: "540px",
                  }}
                >
                  On Q2, TCP and UDP, her average gap is −1.05 across 12 papers. The threshold for a
                  3-point question is 0.45.
                </p>
                <div style={{ marginTop: "26px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
                  <Link
                    href="/courses/hy335/exams/midterm/report/maria"
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
                    <span>Review her papers</span>
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
                        strokeWidth="1.6"
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
          </div>
          <div className="fg-span" style={{ gridColumn: "span 5", minWidth: "0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              <Card className="fg-in fg-d2" padding="20px 22px">
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>Papers graded</div>
                <div style={{ marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "38px",
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
                <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
                  By 5 TAs
                </div>
              </Card>
              <Card className="fg-in fg-d2" padding="20px 22px">
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>AI graded</div>
                <div style={{ marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      color: "var(--ink)",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: "1",
                    }}
                  >
                    57
                  </span>
                  <span style={{ fontSize: "16px", color: "var(--muted)" }}> / 58</span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
                  1 being graded now
                </div>
              </Card>
              <Card className="fg-in fg-d3" padding="20px 22px">
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>Average TA grade</div>
                <div style={{ marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      color: "var(--ink)",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: "1",
                    }}
                  >
                    7.06
                  </span>
                  <span style={{ fontSize: "16px", color: "var(--muted)" }}> / 10</span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
                  AI average 7.18
                </div>
              </Card>
              <Card className="fg-in fg-d3" padding="20px 22px">
                <div style={{ fontSize: "13px", color: "var(--muted)" }}>Flagged</div>
                <div style={{ marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "38px",
                      fontWeight: "500",
                      letterSpacing: "-0.04em",
                      color: "var(--red)",
                      fontVariantNumeric: "tabular-nums",
                      lineHeight: "1",
                    }}
                  >
                    1
                  </span>
                  <span style={{ fontSize: "16px", color: "var(--muted)" }}> of 5 TAs</span>
                </div>
                <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>
                  On Q2
                </div>
              </Card>
            </div>
          </div>
          <div className="fg-span" style={{ gridColumn: "span 12", minWidth: "0" }}>
            <Card className="fg-in fg-d4" padding="28px">
              <SectionHeader
                title={<>Gap per question</>}
                description={
                  <>
                    Each dot is a TA&apos;s average gap from the AI on one question. Dots outside
                    the shaded band are flagged.
                  </>
                }
              >
                <div
                  style={{
                    display: "flex",
                    gap: "14px",
                    alignItems: "center",
                    fontSize: "12.5px",
                    color: "var(--muted)",
                  }}
                >
                  <span
                    style={{
                      width: "22px",
                      height: "22px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      color: "var(--surface)",
                      boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "9px",
                      fontWeight: "600",
                      flexShrink: "0",
                    }}
                  >
                    M
                  </span>
                  <span>Flagged</span>
                  <Avatar initial="N" size={22} />
                  <span>Within threshold</span>
                </div>
              </SectionHeader>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "230px minmax(0, 1fr) 130px",
                  gap: "24px",
                  alignItems: "center",
                  borderTop: "0",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                    <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q1</span>TCP
                    three-way handshake
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                    4 points. Flag beyond ±0.60
                  </span>
                </div>
                <div style={{ position: "relative", height: "128px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "35.00%",
                      width: "30.00%",
                      top: "10px",
                      bottom: "10px",
                      borderRadius: "10px",
                      background: "rgba(var(--ink-rgb), 0.045)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
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
                    title="Maria Papadaki \u22120.20"
                    style={{
                      position: "absolute",
                      left: "45.00%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="M" size={26} />
                  </span>
                  <span
                    title="Katerina Vlachou 0.00"
                    style={{
                      position: "absolute",
                      left: "50.00%",
                      top: "calc(50% + -23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="K" size={26} />
                  </span>
                  <span
                    title="Nikos Georgiou +0.05"
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="N" size={26} />
                  </span>
                  <span
                    title="Eleni Markou +0.10"
                    style={{
                      position: "absolute",
                      left: "52.50%",
                      top: "calc(50% + 23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="E" size={26} />
                  </span>
                  <span
                    title="Giannis Petrou +0.40"
                    style={{
                      position: "absolute",
                      left: "60.00%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="G" size={26} />
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Pill tone="green" dot>
                    All within
                  </Pill>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "230px minmax(0, 1fr) 130px",
                  gap: "24px",
                  alignItems: "center",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                    <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q2</span>TCP and UDP
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                    3 points. Flag beyond ±0.45
                  </span>
                </div>
                <div style={{ position: "relative", height: "128px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "38.75%",
                      width: "22.50%",
                      top: "10px",
                      bottom: "10px",
                      borderRadius: "10px",
                      background: "rgba(var(--ink-rgb), 0.045)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
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
                    title="Maria Papadaki \u22121.05"
                    style={{
                      position: "absolute",
                      left: "23.75%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <span
                      style={{
                        width: "26px",
                        height: "26px",
                        borderRadius: "999px",
                        background: "var(--red)",
                        color: "var(--surface)",
                        boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        fontWeight: "600",
                        flexShrink: "0",
                      }}
                    >
                      M
                    </span>
                  </span>
                  <span
                    style={{
                      position: "absolute",
                      left: "calc(23.75% + 21px)",
                      top: "calc(50% + 0px - 11px)",
                      height: "22px",
                      padding: "0 8px",
                      borderRadius: "999px",
                      background: "var(--red)",
                      color: "var(--surface)",
                      fontSize: "12px",
                      fontWeight: "600",
                      display: "inline-flex",
                      alignItems: "center",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    −1.05
                  </span>
                  <span
                    title="Nikos Georgiou \u22120.10"
                    style={{
                      position: "absolute",
                      left: "47.50%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="N" size={26} />
                  </span>
                  <span
                    title="Eleni Markou +0.05"
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "calc(50% + -23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="E" size={26} />
                  </span>
                  <span
                    title="Katerina Vlachou +0.05"
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "calc(50% + 23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="K" size={26} />
                  </span>
                  <span
                    title="Giannis Petrou +0.10"
                    style={{
                      position: "absolute",
                      left: "52.50%",
                      top: "calc(50% + -46px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="G" size={26} />
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Pill tone="red" dot>
                    1 TA outside
                  </Pill>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "230px minmax(0, 1fr) 130px",
                  gap: "24px",
                  alignItems: "center",
                  borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                }}
              >
                <div
                  style={{ display: "flex", flexDirection: "column", gap: "3px", minWidth: "0" }}
                >
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                    <span style={{ color: "var(--faint)", marginRight: "6px" }}>Q3</span>DNS
                    resolution
                  </span>
                  <span style={{ fontSize: "12.5px", color: "var(--muted)" }}>
                    3 points. Flag beyond ±0.45
                  </span>
                </div>
                <div style={{ position: "relative", height: "128px" }}>
                  <span
                    style={{
                      position: "absolute",
                      left: "38.75%",
                      width: "22.50%",
                      top: "10px",
                      bottom: "10px",
                      borderRadius: "10px",
                      background: "rgba(var(--ink-rgb), 0.045)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "0%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "25%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "75%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
                  <span
                    style={{
                      position: "absolute",
                      left: "100%",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(var(--ink-rgb), 0.07)",
                    }}
                  ></span>
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
                    title="Maria Papadaki \u22120.15"
                    style={{
                      position: "absolute",
                      left: "46.25%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="M" size={26} />
                  </span>
                  <span
                    title="Nikos Georgiou \u22120.05"
                    style={{
                      position: "absolute",
                      left: "48.75%",
                      top: "calc(50% + -23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="N" size={26} />
                  </span>
                  <span
                    title="Eleni Markou +0.05"
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "calc(50% + 23px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="E" size={26} />
                  </span>
                  <span
                    title="Katerina Vlachou +0.05"
                    style={{
                      position: "absolute",
                      left: "51.25%",
                      top: "calc(50% + -46px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="K" size={26} />
                  </span>
                  <span
                    title="Giannis Petrou +0.10"
                    style={{
                      position: "absolute",
                      left: "52.50%",
                      top: "calc(50% + 0px)",
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <Avatar initial="G" size={26} />
                  </span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Pill tone="green" dot>
                    All within
                  </Pill>
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "230px minmax(0, 1fr) 130px",
                  gap: "24px",
                  marginTop: "10px",
                }}
              >
                <span></span>
                <div
                  style={{
                    position: "relative",
                    height: "18px",
                    fontSize: "12px",
                    color: "var(--muted)",
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  <span style={{ position: "absolute", left: "0%", transform: "translateX(-50%)" }}>
                    −2
                  </span>
                  <span
                    style={{ position: "absolute", left: "25%", transform: "translateX(-50%)" }}
                  >
                    −1
                  </span>
                  <span
                    style={{ position: "absolute", left: "50%", transform: "translateX(-50%)" }}
                  >
                    AI
                  </span>
                  <span
                    style={{ position: "absolute", left: "75%", transform: "translateX(-50%)" }}
                  >
                    +1
                  </span>
                  <span
                    style={{ position: "absolute", left: "100%", transform: "translateX(-50%)" }}
                  >
                    +2
                  </span>
                </div>
                <span></span>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "230px minmax(0, 1fr) 130px",
                  gap: "24px",
                  marginTop: "6px",
                }}
              >
                <span></span>
                <div
                  style={{ display: "flex", justifyContent: "space-between", fontSize: "12.5px" }}
                >
                  <span style={{ color: "var(--red-x)" }}>Stricter than the AI</span>
                  <span style={{ color: "var(--blue-x)" }}>More lenient</span>
                </div>
                <span></span>
              </div>
            </Card>
          </div>
          <div className="fg-span" style={{ gridColumn: "span 12", minWidth: "0" }}>
            <Card className="fg-in fg-d5" padding="26px">
              <SectionHeader
                title={<>Teaching assistants</>}
                description={<>Average paper grade, TA versus AI, and the gap on each question.</>}
              />
              <div
                className="fg-hide-sm"
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                  gap: "16px",
                  padding: "0 20px 10px",
                  fontSize: "12.5px",
                  color: "var(--muted)",
                }}
              >
                <span>TA</span>
                <span>Papers</span>
                <span>TA / AI avg</span>
                <span>Paper gap</span>
                <span>Gap per question, Q1 to Q3</span>
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
                  href="/courses/hy335/exams/midterm/report/maria"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "0",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                  >
                    <span
                      style={{
                        width: "34px",
                        height: "34px",
                        borderRadius: "999px",
                        background: "var(--red)",
                        color: "var(--surface)",
                        boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "14px",
                        fontWeight: "600",
                        flexShrink: "0",
                      }}
                    >
                      M
                    </span>
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                        Maria Papadaki
                      </span>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "12px",
                          color: "var(--muted)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        maria@demo.com
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>12</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    5.9 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>7.3</span>
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--red-x)",
                    }}
                  >
                    −1.40
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--red-t)",
                        color: "var(--red-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      −0.20
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--red)",
                        color: "var(--surface)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      −1.05
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--red-t)",
                        color: "var(--red-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      −0.15
                    </span>
                  </div>
                  <span>
                    <Pill tone="red" dot>
                      Flagged
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
                  href="/courses/hy335/exams/midterm/report/maria"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                  >
                    <Avatar initial="G" size={34} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                        Giannis Petrou
                      </span>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "12px",
                          color: "var(--muted)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        giannis@demo.com
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>11</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    7.9 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>7.3</span>
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    +0.60
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--blue-t3)",
                        color: "var(--blue-x3)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.40
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--blue-t)",
                        color: "var(--blue-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.10
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--blue-t)",
                        color: "var(--blue-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.10
                    </span>
                  </div>
                  <span>
                    <Pill tone="green" dot>
                      OK
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
                  href="/courses/hy335/exams/midterm/report/maria"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                  >
                    <Avatar initial="E" size={34} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                        Eleni Markou
                      </span>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "12px",
                          color: "var(--muted)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        eleni@demo.com
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>12</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    7.4 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>7.2</span>
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    +0.20
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--blue-t)",
                        color: "var(--blue-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.10
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.05
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.05
                    </span>
                  </div>
                  <span>
                    <Pill tone="green" dot>
                      OK
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
                  href="/courses/hy335/exams/midterm/report/maria"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                  >
                    <Avatar initial="N" size={34} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                        Nikos Georgiou
                      </span>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "12px",
                          color: "var(--muted)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        nikos@demo.com
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>11</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    7.0 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>7.1</span>
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--red-x)",
                    }}
                  >
                    −0.10
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.05
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "var(--red-t)",
                        color: "var(--red-x)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      −0.10
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      −0.05
                    </span>
                  </div>
                  <span>
                    <Pill tone="green" dot>
                      OK
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
                  href="/courses/hy335/exams/midterm/report/maria"
                  className="fg-row"
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "minmax(0, 1.4fr) 80px 120px 120px minmax(0, 1.2fr) 110px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "14px 20px",
                    textDecoration: "none",
                    color: "var(--text)",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <span
                    style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                  >
                    <Avatar initial="K" size={34} />
                    <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                      <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                        Katerina Vlachou
                      </span>
                      <span
                        style={{
                          fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                          fontSize: "12px",
                          color: "var(--muted)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        katerina@demo.com
                      </span>
                    </span>
                  </span>
                  <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>12</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    7.1 <span style={{ color: "var(--faint)" }}>/</span>{" "}
                    <span style={{ color: "var(--blue-x)" }}>7.0</span>
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    +0.10
                  </span>
                  <div style={{ display: "flex", gap: "4px" }}>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      0.00
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.05
                    </span>
                    <span
                      style={{
                        flex: "1",
                        minWidth: "52px",
                        height: "30px",
                        borderRadius: "9px",
                        background: "rgba(var(--ink-rgb), 0.045)",
                        color: "var(--text-2)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12.5px",
                        fontWeight: "500",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      +0.05
                    </span>
                  </div>
                  <span>
                    <Pill tone="green" dot>
                      OK
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
          <div className="fg-span" style={{ gridColumn: "span 12", minWidth: "0" }}>
            <Card className="fg-in fg-d5" padding="26px">
              <SectionHeader
                title={<>Largest gaps on a single paper</>}
                description={
                  <>Open a paper to see the scan, both grades and the AI&apos;s reasoning.</>
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
                  <span>All 58 papers</span>
                </SecondaryButton>
              </SectionHeader>
              <div
                className="fg-hide-sm"
                style={{
                  display: "grid",
                  gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                  gap: "16px",
                  padding: "0 20px 10px",
                  fontSize: "12.5px",
                  color: "var(--muted)",
                }}
              >
                <span>Student ID</span>
                <span>Graded by</span>
                <span>TA</span>
                <span>AI</span>
                <span>Gap</span>
                <span>Mostly</span>
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
                    gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "13px 20px",
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
                    csd5108
                  </span>
                  <span style={{ fontSize: "13.5px" }}>Maria Papadaki</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    4.5 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    7 / 10
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
                  <span>
                    <Pill>Q2</Pill>
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
                    gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "13px 20px",
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
                    csd5112
                  </span>
                  <span style={{ fontSize: "13.5px" }}>Maria Papadaki</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    5 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    7 / 10
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
                  <span>
                    <Pill>Q2</Pill>
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
                    gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "13px 20px",
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
                    csd5124
                  </span>
                  <span style={{ fontSize: "13.5px" }}>Giannis Petrou</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    8.5 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    7 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    +1.50
                  </span>
                  <span>
                    <Pill>Q1</Pill>
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
                    gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "13px 20px",
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
                    csd5117
                  </span>
                  <span style={{ fontSize: "13.5px" }}>Maria Papadaki</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    4 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    5.5 / 10
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
                  <span>
                    <Pill>Q2</Pill>
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
                    gridTemplateColumns: "130px minmax(0, 1fr) 100px 100px 100px 90px 24px",
                    gap: "16px",
                    alignItems: "center",
                    padding: "13px 20px",
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
                    csd5146
                  </span>
                  <span style={{ fontSize: "13.5px" }}>Nikos Georgiou</span>
                  <span style={{ fontSize: "14px", fontVariantNumeric: "tabular-nums" }}>
                    7 / 10
                  </span>
                  <span
                    style={{
                      fontSize: "14px",
                      fontVariantNumeric: "tabular-nums",
                      color: "var(--blue-x)",
                    }}
                  >
                    8 / 10
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
                  <span>
                    <Pill>Q2</Pill>
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
        </div>
      </AppShell>
    </>
  );
}
