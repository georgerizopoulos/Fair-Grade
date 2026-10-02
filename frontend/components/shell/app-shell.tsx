"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Fragment, type ReactNode, useEffect, useRef, useState } from "react";
import { HOME_BY_ROLE, logout, useSession } from "@/lib/auth";
import { Icon, Logo } from "./icons";
import {
  instructorNav,
  taNav,
  type NavItem,
  type NavSection,
  type Role,
  type ShellCourse,
  type ShellExam,
} from "./nav";
import { Avatar } from "./primitives";
import { type ExamStatus, useCourseExams, useMyCourses } from "./shell-data";
import { ThemeSwitch } from "./theme-switch";

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
const PANEL_SHADOW =
  "0 0 0 1px rgba(var(--ink-rgb), 0.07), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)";

export interface ShellUser {
  name: string;
  role: Role;
}

const INSTRUCTOR_KEYS = ["exams", "stats", "members", "setup", "report", "courses", "users"];
const TA_KEYS = ["exams", "my-stats", "my-papers", "add-paper", "courses"];

// Page frame: sidebar on the left, content column on the right. It loads the
// signed-in user (or redirects to /login), builds the sidebar for their role,
// and shows the "no access" state when the page is for the other role.
//
//   <AppShell course={course} exam={exam} active="report" access="instructor">
//     <PageHeader crumbs={[...]} />
//     ...
//   </AppShell>
export function AppShell({
  course,
  exam,
  active,
  access = "any",
  children,
}: {
  course?: ShellCourse;
  exam?: ShellExam;
  active?: string; // sidebar item to highlight, e.g. "report" or "my-papers"
  access?: Role | "any"; // who may open this page
  children: ReactNode;
}) {
  const user = useSession();
  const router = useRouter();
  const allowed = access === "any" || user?.role === access;

  // A signed-in user on a page for the other role is sent to their own home,
  // not shown the page. (useSession already bounces signed-out users to /login.)
  useEffect(() => {
    if (user && !allowed) router.replace(HOME_BY_ROLE[user.role]);
  }, [user, allowed, router]);

  const role: Role = user?.role ?? (access === "ta" ? "ta" : "instructor");
  const exams = useCourseExams(course?.id || undefined);
  const nav =
    role === "ta"
      ? taNav({
          course,
          exam,
          exams,
          active: TA_KEYS.includes(active ?? "") ? (active as never) : undefined,
        })
      : instructorNav({
          course,
          exam,
          exams,
          active: INSTRUCTOR_KEYS.includes(active ?? "") ? (active as never) : undefined,
        });

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
      <a className="fg-skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar user={user ?? { name: "", role }} course={course} nav={nav} />
      <main
        id="main-content"
        tabIndex={-1}
        style={{ flexGrow: 1, minWidth: 0, padding: "26px 44px 96px" }}
      >
        <div
          style={{
            maxWidth: "1120px",
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            gap: "28px",
          }}
        >
          {/* Nothing until we know who is looking, so the wrong role never sees
              the page. A wrong-role user is being redirected, so render nothing. */}
          {user && allowed && children}
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
            flexWrap: "wrap",
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

        {course && <CourseSwitcher course={course} />}

        <nav aria-label="Main" style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          {nav.map((section, i) => (
            <Fragment key={section.title}>
              <div
                style={{
                  fontSize: "11.5px",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                  textTransform: "uppercase",
                  color: "var(--faint)",
                  padding: i === 0 ? "0 12px 6px" : "18px 12px 6px",
                }}
              >
                {section.title}
              </div>
              {section.items.map((item) => (
                <Fragment key={item.href + item.label}>
                  <NavLink item={item} />
                  {item.children && (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                        margin: "2px 0 6px 23px",
                        paddingLeft: "10px",
                        borderLeft: "1px solid rgba(var(--ink-rgb), 0.09)",
                      }}
                    >
                      {item.children.map((child) => (
                        <NavLink key={child.href} item={child} small />
                      ))}
                    </div>
                  )}
                </Fragment>
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
          <Avatar initial={user.name.charAt(0) || " "} size={32} ink={instructor} />
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
            <span
              style={{
                fontSize: "13.5px",
                fontWeight: 600,
                color: "var(--ink)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {user.name}
            </span>
            <span style={{ fontSize: "12px", color: "var(--muted)" }}>
              {instructor ? "Instructor" : "Teaching assistant"}
            </span>
          </div>
          <button
            type="button"
            onClick={logout}
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
          </button>
        </div>
      </div>
    </aside>
  );
}

const STATUS_DOT: Record<ExamStatus, { color: string; label: string }> = {
  DRAFT: { color: "var(--dot)", label: "Draft" },
  QUESTIONS_READY: { color: "var(--blue)", label: "Questions ready" },
  OPEN: { color: "var(--amber)", label: "Open for grading" },
  PUBLISHED: { color: "var(--green)", label: "Grades published" },
};

function NavLink({ item, small = false }: { item: NavItem; small?: boolean }) {
  const highlighted = item.active || (item.current && !item.children?.some((c) => c.active));
  return (
    <Link
      href={item.href}
      aria-current={item.active ? "page" : undefined}
      className="fg-press"
      style={{
        display: "flex",
        alignItems: "center",
        gap: "11px",
        height: small ? "34px" : "38px",
        padding: small ? "0 10px" : "0 12px",
        borderRadius: "12px",
        textDecoration: "none",
        fontSize: small ? "13.5px" : "14px",
        fontWeight: 500,
        ...(highlighted
          ? {
              background: "var(--raised)",
              color: "var(--ink)",
              boxShadow:
                "0 0 0 1px rgba(var(--ink-rgb), 0.07), 0 1px 2px rgba(var(--shadow-rgb), 0.06)",
            }
          : { color: item.current ? "var(--ink)" : "var(--muted)" }),
      }}
    >
      {item.status ? (
        <span
          title={STATUS_DOT[item.status].label}
          style={{ width: "18px", display: "inline-flex", justifyContent: "center", flexShrink: 0 }}
        >
          <span
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "999px",
              background: STATUS_DOT[item.status].color,
            }}
          />
        </span>
      ) : (
        !small && <Icon name={item.icon} />
      )}
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {item.label}
      </span>
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
  );
}

// The current course; opens a list of the user's courses to switch.
function CourseSwitcher({ course }: { course: ShellCourse }) {
  const [open, setOpen] = useState(false);
  const courses = useMyCourses(open);
  const router = useRouter();
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  const tile = (code: string | null, on: boolean) => (
    <span
      style={{
        width: "30px",
        height: "30px",
        borderRadius: "9px",
        background: on ? "var(--blue-t)" : "rgba(var(--ink-rgb), 0.06)",
        color: on ? "var(--blue-x)" : "var(--text-2)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "11px",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {(code ?? "").replace(/^\D+/, "") || "—"}
    </span>
  );

  return (
    <div ref={box} style={{ marginBottom: "18px" }}>
      <button
        type="button"
        className="fg-press"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          width: "100%",
          padding: "10px 12px",
          border: 0,
          borderRadius: "14px",
          background: "var(--surface)",
          boxShadow: PANEL_SHADOW,
          cursor: "pointer",
          textAlign: "left",
          fontFamily: FONT,
        }}
      >
        {tile(course.code, true)}
        <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
          <span style={{ fontSize: "13.5px", fontWeight: 600, color: "var(--ink)" }}>{course.code}</span>
          <span
            style={{
              fontSize: "12px",
              color: "var(--muted)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {course.name}
          </span>
        </span>
        <span style={{ color: "var(--faint)" }}>
          <Icon name="chevrons" size={16} />
        </span>
      </button>
      {open && (
        <div
          role="listbox"
          aria-label="Switch course"
          style={{
            marginTop: "8px",
            maxHeight: "320px",
            overflowY: "auto",
            padding: "6px",
            borderRadius: "16px",
            background: "var(--raised)",
            boxShadow:
              "0 0 0 1px rgba(var(--ink-rgb), 0.08), 0 16px 40px -12px rgba(var(--shadow-rgb), 0.35)",
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {courses == null && (
            <span style={{ padding: "10px", fontSize: "13px", color: "var(--muted)" }}>Loading…</span>
          )}
          {courses?.map((c) => {
            const on = c.id === course.id;
            return (
              <button
                key={c.id}
                type="button"
                role="option"
                aria-selected={on}
                className="fg-row"
                onClick={() => {
                  setOpen(false);
                  if (!on) router.push(`/courses/${c.id}`);
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "8px",
                  border: 0,
                  borderRadius: "11px",
                  background: on ? "rgba(var(--ink-rgb), 0.05)" : "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: FONT,
                }}
              >
                {tile(c.code, on)}
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
                  <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{c.code ?? c.name}</span>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {c.name}
                  </span>
                </span>
                {on && (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12.5l4.5 4.5L19 7.5" />
                  </svg>
                )}
              </button>
            );
          })}
          <Link
            href="/courses"
            onClick={() => setOpen(false)}
            className="fg-row"
            style={{
              marginTop: "4px",
              padding: "9px 10px",
              borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
              borderRadius: "0 0 11px 11px",
              fontSize: "13px",
              color: "var(--muted)",
              textDecoration: "none",
            }}
          >
            All courses
          </Link>
        </div>
      )}
    </div>
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
        className="fg-breadcrumbs"
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
