// Static design, generated from design-reference/html/TAGrade.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import type { Metadata } from "next";
import { GradePaperLivePage } from "../../paper-pages";
import {
  AppShell,
  Button,
  Card,
  IconButton,
  PageHeader,
  PageTitle,
  Pill,
  SecondaryButton,
} from "@/components/shell";

export const metadata: Metadata = { title: "Grade the paper \u00b7 Fair Grade" };

const course = { id: "hy335", code: "HY335", name: "Computer Networks" };
const exam = { id: "midterm", name: "Midterm" };

export default function GradePaperPage() {
  return <GradePaperLivePage />;
}

// Static design kept as the reference for the live page above; not rendered.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function StaticGradePaperPage() {
  return (
    <>
      <AppShell course={course} exam={exam} active="my-papers" access="ta">
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Midterm" },
            { label: "My papers", href: "/courses/hy335/exams/midterm/papers" },
            { label: "csd5146" },
          ]}
        >
          <Pill tone="amber" dot>
            2 words to check
          </Pill>
        </PageHeader>
        <PageTitle
          title={<>Grade the paper</>}
          description={
            <>
              Check each transcribed answer against the scan, fix anything misread, then give points
              per question.
            </>
          }
        />
        <div
          className="fg-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 0.92fr) minmax(0, 1.08fr)",
            gap: "20px",
            alignItems: "start",
          }}
        >
          <div style={{ position: "sticky", top: "24px" }}>
            <Card className="fg-in fg-d1" padding="20px">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    className="fg-press"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "0",
                      borderRadius: "10px",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13px",
                      cursor: "pointer",
                      background: "var(--ink)",
                      color: "var(--surface)",
                    }}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "0",
                      borderRadius: "10px",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13px",
                      cursor: "pointer",
                      background: "rgba(var(--ink-rgb), 0.05)",
                      color: "var(--muted)",
                    }}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "0",
                      borderRadius: "10px",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13px",
                      cursor: "pointer",
                      background: "rgba(var(--ink-rgb), 0.05)",
                      color: "var(--muted)",
                    }}
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    style={{
                      width: "36px",
                      height: "36px",
                      border: "0",
                      borderRadius: "10px",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13px",
                      cursor: "pointer",
                      background: "rgba(var(--ink-rgb), 0.05)",
                      color: "var(--muted)",
                    }}
                  >
                    4
                  </button>
                </div>
                <div style={{ display: "flex", gap: "4px" }}>
                  <IconButton label="Zoom">
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
                  </IconButton>
                  <IconButton label="Rotate page">
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
                      <path d="M19.5 11A7.5 7.5 0 1 0 17.3 16.3" />
                      <path d="M19.5 5v6h-6" />
                    </svg>
                  </IconButton>
                </div>
              </div>
              <div style={{ padding: "8px 10px 14px" }}>
                <div
                  style={{
                    position: "relative",
                    background: "#FBFBF8",
                    borderRadius: "6px",
                    padding: "38px 40px 46px 64px",
                    transform: "rotate(-0.4deg)",
                    boxShadow:
                      "0 1px 2px rgba(var(--shadow-rgb), 0.08), 0 18px 40px -20px rgba(var(--shadow-rgb), 0.35)",
                    backgroundImage:
                      "repeating-linear-gradient(180deg, transparent 0, transparent 33px, rgba(51, 88, 212, 0.13) 33px, rgba(51, 88, 212, 0.13) 34px)",
                  }}
                >
                  <span
                    style={{
                      position: "absolute",
                      left: "48px",
                      top: "0",
                      bottom: "0",
                      width: "1px",
                      background: "rgba(214, 69, 69, 0.35)",
                    }}
                  ></span>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11px",
                      color: "var(--faint)",
                      margin: "-22px 0 8px",
                      fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                    }}
                  >
                    <span>HY335 Midterm. csd5146</span>
                    <span>Page 1 of 4</span>
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    1. The client sends SYN with a
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    random sequence number x. The
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    server answers SYN-ACK with its
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    own number y and ack x+1. Then
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    the client sends ACK y+1 and the
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    connection is open. This way both
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    sides agree on the starting numbers.
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    2. TCP is reliable, UDP is not.
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    TCP is used for web pages,
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    UDP for streaming.
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  ></div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    3. The resolver asks the root
                  </div>
                  <div
                    style={{
                      fontFamily: "'Caveat', 'Bradley Hand', cursive",
                      fontSize: "23px",
                      lineHeight: "34px",
                      height: "34px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      color: "#1F2A44",
                      paddingLeft: "0px",
                    }}
                  >
                    server, then the .gr server ...
                  </div>
                </div>
              </div>
              <p style={{ margin: "10px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                    fontSize: "12px",
                    color: "var(--muted)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  midterm-csd5146.pdf
                </span>
                , page 1 of 4
              </p>
            </Card>
          </div>
          <Card className="fg-in fg-d2" size="lg" padding="28px">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span
                  style={{
                    fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                    fontSize: "16px",
                    color: "var(--ink)",
                    letterSpacing: "-0.01em",
                  }}
                >
                  csd5146
                </span>
                <Pill dot>Draft</Pill>
              </div>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Saved 12:29</span>
            </div>
            <div style={{ padding: "22px 0", borderTop: "0" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
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
                      flexShrink: "0",
                    }}
                  >
                    Q1
                  </span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}>
                      Explain how the TCP three-way handshake works.
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "3px" }}>
                      4 points
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "var(--surface-2)",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--muted)" }}>
                    Student&apos;s answer, transcribed
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      color: "var(--amber-x)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
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
                    2 words to check
                  </span>
                </div>
                <p
                  style={{ margin: "0", fontSize: "15px", lineHeight: "1.65", color: "var(--ink)" }}
                >
                  The client sends SYN with a random sequence number x. The server answers SYN-ACK
                  with its own number y and ack{" "}
                  <span
                    style={{
                      background: "var(--amber-t)",
                      color: "var(--amber-x)",
                      borderRadius: "4px",
                      padding: "0 3px",
                      boxShadow: "inset 0 -1.5px 0 var(--amber)",
                    }}
                  >
                    x+1
                  </span>
                  . Then the client sends ACK{" "}
                  <span
                    style={{
                      background: "var(--amber-t)",
                      color: "var(--amber-x)",
                      borderRadius: "4px",
                      padding: "0 3px",
                      boxShadow: "inset 0 -1.5px 0 var(--amber)",
                    }}
                  >
                    y+1
                  </span>{" "}
                  and the connection is open. This way both sides agree on the starting numbers.
                </p>
              </div>
              <details style={{ marginTop: "10px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--blue-x)",
                    padding: "6px 0",
                  }}
                >
                  Model answer and rubric
                </summary>
                <p
                  style={{
                    margin: "6px 0 8px",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    color: "var(--text)",
                  }}
                >
                  The client sends SYN with an initial sequence number x. The server replies SYN-ACK
                  with its own number y and acknowledges x+1. The client replies ACK y+1. Both sides
                  now know each other&apos;s starting sequence numbers, so lost or reordered data
                  can be detected.
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "0",
                    padding: "0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Names the three steps in order</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      2
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Explains what the sequence numbers are for</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      1
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Says why the handshake is needed before data</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      1
                    </span>
                  </li>
                </ul>
              </details>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "14px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink)" }}>
                  Your points
                </span>
                <div
                  role="group"
                  aria-label="Q1 points"
                  style={{
                    display: "flex",
                    gap: "3px",
                    padding: "4px",
                    borderRadius: "15px",
                    background: "rgba(var(--ink-rgb), 0.04)",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    1.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    2.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    3
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="true"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "#0E1116",
                      color: "#FFFFFF",
                      boxShadow: "0 1px 2px rgba(14,17,22,0.2)",
                    }}
                  >
                    3.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    4
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: "22px 0", borderTop: "1px solid rgba(var(--ink-rgb), 0.07)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
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
                      flexShrink: "0",
                    }}
                  >
                    Q2
                  </span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}>
                      Compare TCP and UDP and give one use case for each.
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "3px" }}>
                      3 points
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "var(--surface-2)",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--muted)" }}>
                    Student&apos;s answer, transcribed
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      color: "var(--green-x)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    Read clearly
                  </span>
                </div>
                <p
                  style={{ margin: "0", fontSize: "15px", lineHeight: "1.65", color: "var(--ink)" }}
                >
                  TCP is reliable, UDP is not. TCP is used for web pages, UDP for streaming.
                </p>
              </div>
              <details style={{ marginTop: "10px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--blue-x)",
                    padding: "6px 0",
                  }}
                >
                  Model answer and rubric
                </summary>
                <p
                  style={{
                    margin: "6px 0 8px",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    color: "var(--text)",
                  }}
                >
                  TCP is connection-oriented and reliable: it retransmits lost segments and controls
                  flow and congestion. UDP sends independent datagrams with no setup or
                  retransmission, so it has less overhead. TCP suits file transfer or the web; UDP
                  suits voice, video or games where late data is useless.
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "0",
                    padding: "0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Correct core difference: connection and reliability</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      1.5
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>A valid use case for each</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      1
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Mentions overhead, flow or congestion control</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      0.5
                    </span>
                  </li>
                </ul>
              </details>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "14px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink)" }}>
                  Your points
                </span>
                <div
                  role="group"
                  aria-label="Q2 points"
                  style={{
                    display: "flex",
                    gap: "3px",
                    padding: "4px",
                    borderRadius: "15px",
                    background: "rgba(var(--ink-rgb), 0.04)",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="true"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "#0E1116",
                      color: "#FFFFFF",
                      boxShadow: "0 1px 2px rgba(14,17,22,0.2)",
                    }}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    1.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    2.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    3
                  </button>
                </div>
              </div>
            </div>
            <div style={{ padding: "22px 0", borderTop: "1px solid rgba(var(--ink-rgb), 0.07)" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "16px",
                }}
              >
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
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
                      flexShrink: "0",
                    }}
                  >
                    Q3
                  </span>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}>
                      What does a DNS resolver do when a name is not in its cache?
                    </div>
                    <div style={{ fontSize: "12.5px", color: "var(--muted)", marginTop: "3px" }}>
                      3 points
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  marginTop: "14px",
                  padding: "14px 16px",
                  borderRadius: "16px",
                  background: "var(--surface-2)",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <span style={{ fontSize: "12.5px", fontWeight: "500", color: "var(--muted)" }}>
                    Student&apos;s answer, transcribed
                  </span>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "12.5px",
                      color: "var(--green-x)",
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ flexShrink: "0", display: "block" }}
                    >
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                    Read clearly
                  </span>
                </div>
                <p
                  style={{ margin: "0", fontSize: "15px", lineHeight: "1.65", color: "var(--ink)" }}
                >
                  The resolver asks the root server, then the .gr server, then the server of the
                  domain, and keeps the answer in its cache for next time.
                </p>
              </div>
              <details style={{ marginTop: "10px" }}>
                <summary
                  style={{
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "var(--blue-x)",
                    padding: "6px 0",
                  }}
                >
                  Model answer and rubric
                </summary>
                <p
                  style={{
                    margin: "6px 0 8px",
                    fontSize: "13.5px",
                    lineHeight: "1.6",
                    color: "var(--text)",
                  }}
                >
                  It resolves the name iteratively: it asks a root server, follows the referral to
                  the TLD server, then to the authoritative server for the domain, and returns the
                  answer. It caches the result for the record&apos;s TTL.
                </p>
                <ul
                  style={{
                    listStyle: "none",
                    margin: "0",
                    padding: "0",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                >
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Root, TLD, authoritative, in order</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      2
                    </span>
                  </li>
                  <li
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "6px 0",
                      fontSize: "13px",
                      color: "var(--text)",
                    }}
                  >
                    <span>Caches the answer for the TTL</span>
                    <span style={{ color: "var(--muted)", fontVariantNumeric: "tabular-nums" }}>
                      1
                    </span>
                  </li>
                </ul>
              </details>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px",
                  marginTop: "14px",
                  flexWrap: "wrap",
                }}
              >
                <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--ink)" }}>
                  Your points
                </span>
                <div
                  role="group"
                  aria-label="Q3 points"
                  style={{
                    display: "flex",
                    gap: "3px",
                    padding: "4px",
                    borderRadius: "15px",
                    background: "rgba(var(--ink-rgb), 0.04)",
                    flexWrap: "wrap",
                  }}
                >
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    0.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    1
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    1.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    2
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="true"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "#0E1116",
                      color: "#FFFFFF",
                      boxShadow: "0 1px 2px rgba(14,17,22,0.2)",
                    }}
                  >
                    2.5
                  </button>
                  <button
                    type="button"
                    className="fg-press"
                    aria-pressed="false"
                    style={{
                      minWidth: "42px",
                      height: "38px",
                      padding: "0 9px",
                      border: "0",
                      borderRadius: "11px",
                      cursor: "pointer",
                      fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                      fontSize: "13.5px",
                      fontWeight: "500",
                      fontVariantNumeric: "tabular-nums",
                      background: "transparent",
                      color: "#5B606B",
                      boxShadow: "none",
                    }}
                  >
                    3
                  </button>
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
                paddingTop: "20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
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
                  7
                </span>
                <span style={{ fontSize: "15px", color: "var(--muted)" }}>/ 10</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <SecondaryButton>
                  <span>Save draft</span>
                </SecondaryButton>
                <Button
                  size="lg"
                  href="/papers/csd5146"
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
                  Submit grades
                </Button>
              </div>
            </div>
            <p
              style={{
                margin: "12px 0 0",
                fontSize: "12.5px",
                color: "var(--muted)",
                lineHeight: "1.5",
              }}
            >
              When you submit, your grades lock and the AI grades the same answers. You will see
              both grades side by side.
            </p>
          </Card>
        </div>
      </AppShell>
    </>
  );
}
