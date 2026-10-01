// Sign-in page (design-reference/html/Login.html). The form on the left is
// live; the panel on the right is a static illustration.
import type { Metadata } from "next";
import { Avatar, Pill, ThemeSwitch } from "@/components/shell";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Sign in \u00b7 Fair Grade" };

export default function LoginPage() {
  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
          color: "var(--text)",
          background:
            "radial-gradient(1000px 520px at 10% 0%, var(--surface) 0%, rgba(var(--surface-rgb), 0) 70%), var(--bg)",
          padding: "20px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.08fr)",
          gap: "20px",
        }}
        className="fg-split"
      >
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "36px 56px 32px",
          }}
        >
          <div className="fg-in" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              aria-hidden="true"
              style={{ flexShrink: "0", display: "block" }}
            >
              <rect width="32" height="32" rx="10" fill="var(--ink)" />
              <rect x="8" y="11" width="16" height="2.6" rx="1.3" fill="var(--surface)" />
              <rect x="8" y="18.4" width="11" height="2.6" rx="1.3" fill="var(--surface)" />
              <circle cx="23" cy="19.7" r="2.2" fill="var(--red)" />
            </svg>
            <span
              style={{
                fontSize: "17px",
                fontWeight: "600",
                letterSpacing: "-0.02em",
                color: "var(--ink)",
                flexGrow: "1",
              }}
            >
              Fair Grade
            </span>
            <ThemeSwitch />
          </div>
          <LoginForm />
          <p style={{ margin: "0", fontSize: "12.5px", color: "var(--faint)" }}>
            FuturEd AI Hackathon 2026. Team Byte Me.
          </p>
        </section>
        <section
          className="fg-in fg-d2 fg-dark"
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "32px",
            background:
              "radial-gradient(700px 420px at 80% 10%, #23293A 0%, rgba(35, 41, 58, 0) 70%), var(--ink)",
            color: "var(--surface)",
            padding: "56px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "32px",
          }}
        >
          <div style={{ maxWidth: "520px" }}>
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
              For instructors and TAs
            </span>
            <h2
              style={{
                margin: "22px 0 0",
                fontSize: "50px",
                fontWeight: "600",
                letterSpacing: "-0.045em",
                lineHeight: "1.02",
              }}
            >
              Same rubric.
              <br />
              Same standard.
              <br />
              <span style={{ color: "#8E95A3" }}>Every grader.</span>
            </h2>
            <p
              style={{
                margin: "18px 0 0",
                fontSize: "16px",
                lineHeight: "1.6",
                color: "#A6ACB8",
                maxWidth: "440px",
              }}
            >
              TAs scan and grade each paper. The AI grades the same answers. You see where they
              disagree, before grades go out.
            </p>
          </div>
          <div style={{ position: "relative", height: "480px" }}>
            <div
              style={{
                position: "absolute",
                left: "0",
                top: "0",
                width: "450px",
                transform: "rotate(-1.5deg)",
              }}
            >
              <div
                className="fg-dark"
                style={{
                  background: "rgba(var(--surface-rgb), 0.06)",
                  boxShadow: "0 0 0 1px rgba(var(--surface-rgb), 0.10)",
                  borderRadius: "26px",
                  padding: "6px",
                }}
              >
                <div
                  style={{
                    background: "var(--surface)",
                    borderRadius: "20px",
                    padding: "20px 22px",
                    boxShadow:
                      "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "6px",
                    }}
                  >
                    <span style={{ fontSize: "13.5px", fontWeight: "600", color: "var(--ink)" }}>
                      Midterm, gap per question
                    </span>
                    <Pill tone="red" dot>
                      1 flagged
                    </Pill>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr)",
                      gap: "24px",
                      alignItems: "center",
                      borderTop: "0",
                    }}
                  >
                    <div style={{ position: "relative", height: "92px" }}>
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
                        <Avatar initial="M" size={18} />
                      </span>
                      <span
                        title="Katerina Vlachou 0.00"
                        style={{
                          position: "absolute",
                          left: "50.00%",
                          top: "calc(50% + -16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="K" size={18} />
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
                        <Avatar initial="N" size={18} />
                      </span>
                      <span
                        title="Eleni Markou +0.10"
                        style={{
                          position: "absolute",
                          left: "52.50%",
                          top: "calc(50% + 16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="E" size={18} />
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
                        <Avatar initial="G" size={18} />
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr)",
                      gap: "24px",
                      alignItems: "center",
                      borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                    }}
                  >
                    <div style={{ position: "relative", height: "92px" }}>
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
                            width: "18px",
                            height: "18px",
                            borderRadius: "999px",
                            background: "var(--red)",
                            color: "var(--surface)",
                            boxShadow:
                              "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "7px",
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
                          left: "calc(23.75% + 17px)",
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
                        <Avatar initial="N" size={18} />
                      </span>
                      <span
                        title="Eleni Markou +0.05"
                        style={{
                          position: "absolute",
                          left: "51.25%",
                          top: "calc(50% + -16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="E" size={18} />
                      </span>
                      <span
                        title="Katerina Vlachou +0.05"
                        style={{
                          position: "absolute",
                          left: "51.25%",
                          top: "calc(50% + 16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="K" size={18} />
                      </span>
                      <span
                        title="Giannis Petrou +0.10"
                        style={{
                          position: "absolute",
                          left: "52.50%",
                          top: "calc(50% + -32px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="G" size={18} />
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr)",
                      gap: "24px",
                      alignItems: "center",
                      borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                    }}
                  >
                    <div style={{ position: "relative", height: "92px" }}>
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
                        <Avatar initial="M" size={18} />
                      </span>
                      <span
                        title="Nikos Georgiou \u22120.05"
                        style={{
                          position: "absolute",
                          left: "48.75%",
                          top: "calc(50% + -16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="N" size={18} />
                      </span>
                      <span
                        title="Eleni Markou +0.05"
                        style={{
                          position: "absolute",
                          left: "51.25%",
                          top: "calc(50% + 16px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="E" size={18} />
                      </span>
                      <span
                        title="Katerina Vlachou +0.05"
                        style={{
                          position: "absolute",
                          left: "51.25%",
                          top: "calc(50% + -32px)",
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Avatar initial="K" size={18} />
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
                        <Avatar initial="G" size={18} />
                      </span>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "11.5px",
                      marginTop: "6px",
                    }}
                  >
                    <span style={{ color: "var(--red-x)" }}>Stricter</span>
                    <span style={{ color: "var(--muted)" }}>AI</span>
                    <span style={{ color: "var(--blue-x)" }}>Lenient</span>
                  </div>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                right: "4px",
                bottom: "0",
                width: "290px",
                transform: "rotate(2.5deg)",
              }}
            >
              <div
                className="fg-dark"
                style={{
                  background: "rgba(var(--surface-rgb), 0.06)",
                  boxShadow: "0 0 0 1px rgba(var(--surface-rgb), 0.10)",
                  borderRadius: "24px",
                  padding: "6px",
                }}
              >
                <div
                  style={{
                    background: "var(--surface)",
                    borderRadius: "18px",
                    padding: "16px 18px",
                    boxShadow:
                      "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
                  }}
                >
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
                      csd5146
                    </span>
                    <Pill tone="blue" dot>
                      AI graded
                    </Pill>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      gap: "18px",
                      marginTop: "12px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--muted)" }}>TA</div>
                      <span
                        style={{
                          fontSize: "30px",
                          fontWeight: "500",
                          letterSpacing: "-0.04em",
                          color: "var(--ink)",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: "1",
                        }}
                      >
                        7
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--muted)" }}> / 10</span>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "var(--blue-x)" }}>AI</div>
                      <span
                        style={{
                          fontSize: "30px",
                          fontWeight: "500",
                          letterSpacing: "-0.04em",
                          color: "var(--blue-x)",
                          fontVariantNumeric: "tabular-nums",
                          lineHeight: "1",
                        }}
                      >
                        8
                      </span>
                      <span style={{ fontSize: "13px", color: "var(--blue-x)" }}> / 10</span>
                    </div>
                    <div style={{ marginLeft: "auto" }}>
                      <Pill tone="red" dot>
                        Q2 −1
                      </Pill>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
