// Static design, generated from design-reference/html/Members.html
// by frontend/scripts/html2jsx.py. Demo content only: nothing here talks
// to the API yet. When wiring it up, replace the constants with real data.
import type { Metadata } from "next";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  IconButton,
  PageHeader,
  PageTitle,
  Pill,
  RoleChip,
  SectionHeader,
  YouTag,
  instructorNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "Members \u00b7 Fair Grade" };

const user = { name: "Instructor Demo", role: "instructor" } as const;
const course = { id: "hy335", code: "HY335", name: "Computer Networks" };

export default function MembersPage() {
  return (
    <>
      <AppShell user={user} course={course} nav={instructorNav({ course, active: "members" })}>
        <PageHeader
          crumbs={[
            { label: "HY335 Computer Networks", href: "/courses/hy335" },
            { label: "Members" },
          ]}
        >
          <Button
            variant="outline"
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
            Invite by email
          </Button>
        </PageHeader>
        <PageTitle
          title={<>Members</>}
          description={<>Who can open HY335 and grade its exams.</>}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <Card className="fg-in fg-d1" padding="26px">
                <SectionHeader
                  title={<>People in HY335</>}
                  description={<>6 people. Only they can open this course.</>}
                />
                <div
                  className="fg-hide-sm"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                    gap: "16px",
                    padding: "0 20px 10px",
                    fontSize: "12.5px",
                    color: "var(--muted)",
                  }}
                >
                  <span>Person</span>
                  <span>Role</span>
                  <span>Papers</span>
                  <span>Access</span>
                  <span></span>
                </div>
                <div
                  style={{
                    borderRadius: "18px",
                    boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderTop: "0",
                      background:
                        "linear-gradient(90deg, rgba(51, 88, 212, 0.06) 0%, rgba(51, 88, 212, 0) 60%)",
                      boxShadow: "inset 3px 0 0 var(--blue)",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                    >
                      <Avatar initial="I" size={34} ink />
                      <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                        <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                          Instructor Demo
                          <YouTag />
                        </span>
                        <span
                          style={{
                            fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                            fontSize: "12px",
                            color: "var(--muted)",
                            letterSpacing: "-0.01em",
                          }}
                        >
                          instructor@demo.com
                        </span>
                      </span>
                    </span>
                    <RoleChip role="instructor" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      —
                    </span>
                    <span>
                      <Pill>Owner</Pill>
                    </span>
                    <span></span>
                  </div>
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}
                    >
                      <Avatar initial="M" size={34} />
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
                    <RoleChip role="ta" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      12
                    </span>
                    <span>
                      <Pill tone="green" dot>
                        Has access
                      </Pill>
                    </span>
                    <IconButton label="Actions for Maria Papadaki">
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
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="18" cy="12" r="1" />
                      </svg>
                    </IconButton>
                  </div>
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
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
                    <RoleChip role="ta" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      11
                    </span>
                    <span>
                      <Pill tone="green" dot>
                        Has access
                      </Pill>
                    </span>
                    <IconButton label="Actions for Giannis Petrou">
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
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="18" cy="12" r="1" />
                      </svg>
                    </IconButton>
                  </div>
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
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
                    <RoleChip role="ta" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      12
                    </span>
                    <span>
                      <Pill tone="green" dot>
                        Has access
                      </Pill>
                    </span>
                    <IconButton label="Actions for Eleni Markou">
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
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="18" cy="12" r="1" />
                      </svg>
                    </IconButton>
                  </div>
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
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
                    <RoleChip role="ta" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      11
                    </span>
                    <span>
                      <Pill tone="green" dot>
                        Has access
                      </Pill>
                    </span>
                    <IconButton label="Actions for Nikos Georgiou">
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
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="18" cy="12" r="1" />
                      </svg>
                    </IconButton>
                  </div>
                  <div
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: "minmax(0, 1fr) 112px 64px 124px 40px",
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
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
                    <RoleChip role="ta" size="md" />
                    <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>
                      12
                    </span>
                    <span>
                      <Pill tone="green" dot>
                        Has access
                      </Pill>
                    </span>
                    <IconButton label="Actions for Katerina Vlachou">
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
                        <circle cx="6" cy="12" r="1" />
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="18" cy="12" r="1" />
                      </svg>
                    </IconButton>
                  </div>
                </div>
              </Card>
              <Card className="fg-in fg-d3" padding="16px 20px">
                <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--blue)"
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
                  <p
                    style={{
                      margin: "0",
                      fontSize: "13.5px",
                      lineHeight: "1.55",
                      color: "var(--text)",
                    }}
                  >
                    A TA can add and grade papers in every exam of this course while they are a
                    member. Removing access keeps their submitted papers in the report.
                  </p>
                </div>
              </Card>
            </div>
          </div>
          <div className="fg-span" style={{ gridColumn: "span 4", minWidth: "0" }}>
            <div style={{ position: "sticky", top: "24px" }}>
              <Card className="fg-in fg-d2">
                <SectionHeader
                  title={<>Add a TA</>}
                  description={<>Search accounts by name or email.</>}
                />
                <div style={{ width: "100%" }}>
                  <div style={{ position: "relative" }}>
                    <span
                      style={{
                        position: "absolute",
                        left: "14px",
                        top: "12px",
                        color: "var(--faint)",
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
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="M16 16l4 4" />
                      </svg>
                    </span>
                    <input
                      id="find"
                      type="text"
                      placeholder="Name or email"
                      aria-label="Name or email"
                      style={{
                        width: "100%",
                        height: "44px",
                        padding: "0 14px 0 42px",
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
                <div
                  style={{
                    margin: "24px 0 16px",
                    borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
                  }}
                ></div>
                <h3
                  style={{ margin: "0", fontSize: "15px", fontWeight: "600", color: "var(--ink)" }}
                >
                  No account yet?
                </h3>
                <p
                  style={{
                    margin: "4px 0 14px",
                    fontSize: "13px",
                    color: "var(--muted)",
                    lineHeight: "1.5",
                  }}
                >
                  Create it here. They sign in with a temporary password and set their own.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ width: "100%" }}>
                    <label
                      htmlFor="nn"
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "var(--text)",
                        marginBottom: "8px",
                      }}
                    >
                      Name
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="nn"
                        type="text"
                        placeholder="Full name"
                        aria-label="Name"
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
                  <div style={{ width: "100%" }}>
                    <label
                      htmlFor="ne"
                      style={{
                        display: "block",
                        fontSize: "13px",
                        fontWeight: "500",
                        color: "var(--text)",
                        marginBottom: "8px",
                      }}
                    >
                      Email
                    </label>
                    <div style={{ position: "relative" }}>
                      <input
                        id="ne"
                        type="email"
                        placeholder="name@csd.uoc.gr"
                        aria-label="Email"
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
                </div>
                <div style={{ marginTop: "14px" }}>
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
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    }
                  >
                    Create account and add
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    </>
  );
}
