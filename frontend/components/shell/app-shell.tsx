import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Icon, Logo } from "./icons";
import type { NavSection, Role, ShellCourse } from "./nav";
import { Avatar, Kbd, RoleChip } from "./primitives";
import { ThemeSwitch } from "./theme-switch";

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
const PANEL_SHADOW =
  "0 0 0 1px rgba(var(--ink-rgb), 0.07), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)";

export interface ShellUser {
  name: string;
  role: Role;
}

// Page frame: sidebar on the left, content column on the right.
//
//   <AppShell user={user} course={course} nav={instructorNav({ course, active: "exams" })}>
//     <PageHeader crumbs={[...]} />
//     ...
//   </AppShell>
export function AppShell({
  user,
  course,
  nav,
  children,
}: {
  user: ShellUser;
  course?: ShellCourse;
  nav: NavSection[];
  children: ReactNode;
}) {
  return (
    <div
      className="fg-shell"
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: FONT,
        color: "var(--text)",
        background:
          "radial-gradient(1200px 520px at 30% -8%, var(--surface) 0%, rgba(var(--surface-rgb), 0) 70%), var(--bg)",
      }}
    >
      <Sidebar user={user} course={course} nav={nav} />
      <main style={{ flexGrow: 1, minWidth: 0, padding: "26px 44px 96px" }}>
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}

export function Sidebar({
  user,
  course,
  nav,
}: {
  user: ShellUser;
  course?: ShellCourse;
  nav: NavSection[];
}) {
  const instructor = user.role === "instructor";
  return (
    <aside
      className="fg-side"
      style={{ width: "252px", flexShrink: 0, padding: "14px 0 14px 14px" }}
    >
      <div
        style={{
          position: "sticky",
          top: "14px",
          minHeight: "calc(100vh - 28px)",
          background: "rgba(var(--surface-rgb), 0.62)",
          boxShadow: PANEL_SHADOW,
          borderRadius: "24px",
          padding: "18px 12px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "2px 2px 16px 8px",
          }}
        >
          <Logo />
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "var(--ink)",
              flexGrow: 1,
            }}
          >
            Fair Grade
          </span>
          <ThemeSwitch />
        </div>

        <RoleCard role={user.role} />
        {course && <CourseSwitcher course={course} />}
        <SearchButton />

        <nav aria-label="Main" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {nav.map((section, i) => (
            <Fragment key={section.title}>
              <div
                style={{
                  fontSize: "12px",
                  color: "var(--faint)",
                  padding: i === 0 ? "0 12px 6px" : "20px 12px 6px",
                }}
              >
                {section.title}
              </div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={item.active ? "page" : undefined}
                  className="fg-press"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "11px",
                    height: "38px",
                    padding: "0 12px",
                    borderRadius: "12px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    ...(item.active
                      ? {
                          background: "var(--raised)",
                          color: "var(--ink)",
                          boxShadow:
                            "0 0 0 1px rgba(var(--ink-rgb), 0.07), 0 1px 2px rgba(var(--shadow-rgb), 0.06)",
                        }
                      : { color: "var(--muted)" }),
                  }}
                >
                  <Icon name={item.icon} />
                  <span>{item.label}</span>
                  {item.badge != null && (
                    <span
                      style={{
                        marginLeft: "auto",
                        minWidth: "20px",
                        height: "20px",
                        padding: "0 6px",
                        borderRadius: "999px",
                        background: "var(--red-t)",
                        color: "var(--red-x)",
                        fontSize: "11.5px",
                        fontWeight: 600,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </Fragment>
          ))}
        </nav>

        <div style={{ flexGrow: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "12px 6px 2px 8px",
            borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
          }}
        >
          <Avatar initial={user.name.charAt(0)} size={32} ink={instructor} />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ink)" }}>
              {user.name}
            </span>
            <span style={{ marginTop: "3px" }}>
              <RoleChip role={user.role} />
            </span>
          </div>
          <Link
            href="/login"
            aria-label="Log out"
            className="fg-press"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "999px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              background: "transparent",
              color: "var(--muted)",
              border: 0,
              cursor: "pointer",
              textDecoration: "none",
            }}
          >
            <Icon name="logout" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

// "You are signed in as …" card at the top of the sidebar.
function RoleCard({ role }: { role: Role }) {
  const instructor = role === "instructor";
  const accent = instructor ? "var(--gold-icon)" : "#9EE0D0";
  return (
    <div
      className="fg-dark"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "11px",
        padding: "11px 12px",
        margin: "0 0 14px",
        borderRadius: "16px",
        background:
          "radial-gradient(180px 90px at 100% 0%, #2A3142 0%, rgba(42, 49, 66, 0) 70%), var(--ink)",
        boxShadow:
          "inset 0 1px 0 rgba(var(--surface-rgb), 0.08), 0 12px 26px -16px rgba(var(--shadow-rgb), 0.75)",
      }}
    >
      <span
        style={{
          width: "32px",
          height: "32px",
          borderRadius: "10px",
          background: "rgba(var(--surface-rgb), 0.09)",
          boxShadow: "inset 0 0 0 1px rgba(var(--surface-rgb), 0.10)",
          color: accent,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon name={instructor ? "key" : "pencil"} size={16} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
        <span style={{ fontSize: "11.5px", color: "#8E95A3" }}>You are signed in as</span>
        <span
          style={{
            fontSize: "14.5px",
            fontWeight: 600,
            letterSpacing: "-0.01em",
            color: "var(--surface)",
            whiteSpace: "nowrap",
          }}
        >
          {instructor ? "Instructor" : "Teaching assistant"}
        </span>
      </span>
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "999px",
          background: accent,
          boxShadow: "0 0 0 3px rgba(var(--surface-rgb), 0.06)",
          flexShrink: 0,
        }}
        title={instructor ? "Full access" : "Grader"}
      />
    </div>
  );
}

function CourseSwitcher({ course }: { course: ShellCourse }) {
  return (
    <button
      type="button"
      className="fg-press"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        padding: "10px 12px",
        marginBottom: "20px",
        border: 0,
        borderRadius: "14px",
        background: "var(--surface)",
        boxShadow: PANEL_SHADOW,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "9px",
          background: "var(--blue-t)",
          color: "var(--blue-x)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        {course.code.replace(/^\D+/, "")}
      </span>
      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
        <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ink)" }}>
          {course.code}
        </span>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>{course.name}</span>
      </span>
      <span style={{ color: "var(--faint)" }}>
        <Icon name="chevrons" size={16} />
      </span>
    </button>
  );
}

function SearchButton() {
  return (
    <button
      type="button"
      className="fg-press"
      aria-label="Search, shortcut Command K"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "100%",
        height: "38px",
        padding: "0 8px 0 12px",
        marginBottom: "18px",
        border: 0,
        borderRadius: "12px",
        background: "rgba(var(--ink-rgb), 0.04)",
        color: "var(--muted)",
        fontFamily: FONT,
        fontSize: "13.5px",
        cursor: "pointer",
      }}
    >
      <Icon name="search" size={16} />
      <span style={{ flexGrow: 1, textAlign: "left" }}>Search</span>
      <Kbd>⌘K</Kbd>
    </button>
  );
}

export interface Crumb {
  label: ReactNode;
  href?: string;
}

// Breadcrumbs on the left, page actions on the right.
export function PageHeader({ crumbs, children }: { crumbs: Crumb[]; children?: ReactNode }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        minHeight: "40px",
        flexWrap: "wrap",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "13.5px",
          fontWeight: 500,
        }}
      >
        {crumbs.map((c, i) => {
          const last = i === crumbs.length - 1;
          return (
            <Fragment key={i}>
              {i > 0 && <span style={{ color: "var(--faint)", padding: "0 2px" }}>/</span>}
              {last ? (
                <span style={{ color: "var(--ink)" }}>{c.label}</span>
              ) : (
                <span style={{ color: "var(--muted)" }}>
                  {c.href ? (
                    <Link href={c.href} style={{ color: "var(--muted)", textDecoration: "none" }}>
                      {c.label}
                    </Link>
                  ) : (
                    c.label
                  )}
                </span>
              )}
            </Fragment>
          );
        })}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        {children}
      </div>
    </div>
  );
}

// Big page title with an optional one-line description.
export function PageTitle({ title, description }: { title: ReactNode; description?: ReactNode }) {
  return (
    <div className="fg-in">
      <div>
        <h1
          style={{
            margin: 0,
            fontSize: "34px",
            fontWeight: 600,
            letterSpacing: "-0.035em",
            lineHeight: 1.1,
            color: "var(--ink)",
          }}
        >
          {title}
        </h1>
        {description != null && (
          <p
            style={{
              margin: "10px 0 0",
              fontSize: "15px",
              lineHeight: 1.55,
              color: "var(--muted)",
              maxWidth: "620px",
            }}
          >
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
