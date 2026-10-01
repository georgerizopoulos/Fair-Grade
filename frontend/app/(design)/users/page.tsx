// Static design, generated from design-reference/html/Users.html
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
  YouTag,
  instructorNav,
} from "@/components/shell";

export const metadata: Metadata = { title: "Users \u00b7 Fair Grade" };

const user = { name: "Instructor Demo", role: "instructor" } as const;

export default function UsersPage() {
  return (
    <>
      <AppShell user={user} nav={instructorNav({ active: "users" })}>
        <PageHeader crumbs={[{ label: "Workspace" }, { label: "Users" }]}>
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
            New user
          </Button>
        </PageHeader>
        <PageTitle
          title={<>Users</>}
          description={
            <>
              Everyone who can sign in. Course access is managed from each course&apos;s Members
              page.
            </>
          }
        />
        <Card className="fg-in fg-d1">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "16px",
              flexWrap: "wrap",
              marginBottom: "18px",
            }}
          >
            <div
              role="radiogroup"
              aria-label="Filter by role"
              style={{
                display: "inline-flex",
                padding: "4px",
                borderRadius: "999px",
                background: "rgba(var(--ink-rgb), 0.05)",
                gap: "2px",
              }}
            >
              <button
                type="button"
                role="radio"
                aria-checked="true"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "var(--raised)",
                  color: "var(--ink)",
                  boxShadow:
                    "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                }}
              >
                All 7
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="false"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--muted)",
                }}
              >
                Instructors 1
              </button>
              <button
                type="button"
                role="radio"
                aria-checked="false"
                className="fg-press"
                style={{
                  height: "34px",
                  padding: "0 14px",
                  border: "0",
                  borderRadius: "999px",
                  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
                  fontSize: "13.5px",
                  fontWeight: "500",
                  cursor: "pointer",
                  background: "transparent",
                  color: "var(--muted)",
                }}
              >
                TAs 6
              </button>
            </div>
            <div style={{ width: "280px" }}>
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
                    id="us"
                    type="text"
                    placeholder="Search name or email"
                    aria-label="Search name or email"
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
            </div>
          </div>
          <div
            className="fg-hide-sm"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
              gap: "16px",
              padding: "0 20px 10px",
              fontSize: "12.5px",
              color: "var(--muted)",
            }}
          >
            <span>Name</span>
            <span>Role</span>
            <span>Courses</span>
            <span>Last sign-in</span>
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
            <div
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "0",
                background:
                  "linear-gradient(90deg, rgba(51, 88, 212, 0.06) 0%, rgba(51, 88, 212, 0) 60%)",
                boxShadow: "inset 3px 0 0 var(--blue)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY360
                </span>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY359
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 13:40</span>
              <span>
                <Pill tone="green" dot>
                  Active
                </Pill>
              </span>
              <IconButton label="Actions for Instructor Demo">
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
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 11:05</span>
              <span>
                <Pill tone="green" dot>
                  Active
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
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 09:40</span>
              <span>
                <Pill tone="green" dot>
                  Active
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
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY359
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Yesterday</span>
              <span>
                <Pill tone="green" dot>
                  Active
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
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY359
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 12:20</span>
              <span>
                <Pill tone="green" dot>
                  Active
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
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
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
              <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                <span
                  style={{
                    height: "24px",
                    padding: "0 9px",
                    borderRadius: "999px",
                    background: "rgba(var(--ink-rgb), 0.05)",
                    fontSize: "12.5px",
                    display: "inline-flex",
                    alignItems: "center",
                  }}
                >
                  HY335
                </span>
              </span>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Today 10:15</span>
              <span>
                <Pill tone="green" dot>
                  Active
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
            <div
              className="fg-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px 40px",
                gap: "16px",
                alignItems: "center",
                padding: "12px 20px",
                borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: "0" }}>
                <Avatar initial="A" size={34} />
                <span style={{ display: "flex", flexDirection: "column", minWidth: "0" }}>
                  <span style={{ fontSize: "14px", fontWeight: "500", color: "var(--ink)" }}>
                    Alexandros Kostakis
                  </span>
                  <span
                    style={{
                      fontFamily: "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace",
                      fontSize: "12px",
                      color: "var(--muted)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    alexandros@demo.com
                  </span>
                </span>
              </span>
              <RoleChip role="ta" size="md" />
              <Pill>No course access</Pill>
              <span style={{ fontSize: "13px", color: "var(--muted)" }}>Never</span>
              <span>
                <Pill tone="amber" dot>
                  Invited
                </Pill>
              </span>
              <IconButton label="Actions for Alexandros Kostakis">
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
      </AppShell>
    </>
  );
}
