"use client";

import { type ReactNode, useEffect, useState } from "react";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  MONO,
  Notice,
  PageHeader,
  PageTitle,
  Pill,
  RoleChip,
  SectionHeader,
  TextField,
  YouTag,
} from "@/components/shell";
import { apiFetch } from "@/lib/api";

// Everyone who can sign in (design: Users.html). Course access is managed on
// each course's Members page.
//   GET /users, POST /users. Account status is display-only here.

type Role = "instructor" | "ta";
type Status = "ACTIVE" | "INVITED" | "DEACTIVATED";
type Filter = "all" | Role;

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  lastSignInAt: string | null;
  courses: { id: string; code: string | null }[];
  isYou: boolean;
}

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
const COLUMNS = "minmax(0, 1.6fr) 110px minmax(0, 1fr) 130px 110px";

const STATUS: Record<Status, { tone: "green" | "blue" | "red"; label: string }> = {
  ACTIVE: { tone: "green", label: "Active" },
  INVITED: { tone: "blue", label: "Invited" },
  DEACTIVATED: { tone: "red", label: "Deactivated" },
};

function lastSignIn(iso: string | null) {
  if (!iso) return "Never";
  const d = new Date(iso);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const hm = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  if (d.toDateString() === now.toDateString()) return `Today ${hm}`;
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

function Tabs<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (v: T) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      style={{ display: "inline-flex", padding: "4px", borderRadius: "999px", background: "rgba(var(--ink-rgb), 0.05)", gap: "2px" }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={on}
            className="fg-press"
            onClick={() => onChange(o.value)}
            style={{
              height: "34px",
              padding: "0 14px",
              border: 0,
              borderRadius: "999px",
              fontFamily: FONT,
              fontSize: "13.5px",
              fontWeight: 500,
              cursor: "pointer",
              background: on ? "var(--raised)" : "transparent",
              color: on ? "var(--ink)" : "var(--muted)",
              boxShadow: on ? "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)" : undefined,
            }}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

const icon = (children: ReactNode, size = 16) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    style={{ flexShrink: 0, display: "block" }}
  >
    {children}
  </svg>
);

export function UsersLivePage() {
  const [users, setUsers] = useState<UserRow[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState("");
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "ta" as Role, mode: "invite" as "invite" | "password", password: "" });

  const load = () =>
    apiFetch<{ users: UserRow[] }>("/users")
      .then(({ users: loaded }) => setUsers(loaded))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users"));

  useEffect(() => {
    void load();
  }, []);

  async function run(key: string, action: () => Promise<string>) {
    setBusy(key);
    setNotice(null);
    try {
      const text = await action();
      await load();
      setNotice({ tone: "ok", text });
    } catch (e) {
      setNotice({ tone: "error", text: e instanceof Error ? e.message : "Something went wrong" });
    } finally {
      setBusy("");
    }
  }

  const create = () =>
    run("create", async () => {
      const created = await apiFetch<{ name: string; temporaryPassword?: string }>("/users", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          role: form.role,
          mode: form.mode,
          ...(form.mode === "password" ? { password: form.password } : {}),
        },
      });
      setForm({ name: "", email: "", role: form.role, mode: form.mode, password: "" });
      setCreating(false);
      return created.temporaryPassword
        ? `${created.name} was created. Temporary password: ${created.temporaryPassword} (shown once; they change it at first sign-in).`
        : `${created.name} was created and can sign in now.`;
    });

  const query = search.trim().toLowerCase();
  const visible = (users ?? [])
    .filter(
      (u) =>
        (filter === "all" || u.role === filter) &&
        (!query || u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)),
    )
    .sort((a, b) => Number(b.isYou) - Number(a.isYou) || Number(b.role === "instructor") - Number(a.role === "instructor") || a.name.localeCompare(b.name));

  const formValid =
    form.name.trim() !== "" && /\S+@\S+\.\S+/.test(form.email) && (form.mode === "invite" || form.password.length >= 6);

  return (
    <AppShell active="users" access="instructor">
      <PageHeader crumbs={[{ label: "Workspace" }, { label: "Users" }]}>
        <Button size="lg" onClick={() => setCreating((v) => !v)} icon={icon(<path d={creating ? "M6.5 6.5l11 11M17.5 6.5l-11 11" : "M12 5v14M5 12h14"} />)}>
          {creating ? "Close" : "New user"}
        </Button>
      </PageHeader>
      <PageTitle
        title="Users"
        description={<>Everyone who can sign in. Course access is managed from each course&apos;s Members page.</>}
      />

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      {creating && (
        <Card className="fg-in" padding="26px">
          <SectionHeader
            title="New user"
            description="An invite creates a temporary password, shown once. With a password, they can sign in straight away."
          />
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formValid) void create();
            }}
            style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "16px" }}
          >
            <div className="fg-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "14px" }}>
              <TextField id="nu-name" label="Name" placeholder="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} required />
              <TextField
                id="nu-email"
                label="Email"
                type="email"
                placeholder="name@csd.uoc.gr"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
              />
            </div>
            <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Role</div>
                <Tabs<Role>
                  label="Role"
                  value={form.role}
                  onChange={(role) => setForm({ ...form, role })}
                  options={[
                    { value: "ta", label: "Teaching assistant" },
                    { value: "instructor", label: "Instructor" },
                  ]}
                />
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 500, marginBottom: "8px" }}>Sign-in</div>
                <Tabs<"invite" | "password">
                  label="How they sign in"
                  value={form.mode}
                  onChange={(mode) => setForm({ ...form, mode })}
                  options={[
                    { value: "invite", label: "Invite" },
                    { value: "password", label: "Set a password" },
                  ]}
                />
              </div>
              {form.mode === "password" && (
                <div style={{ width: "260px" }}>
                  <TextField
                    id="nu-password"
                    label="Temporary password"
                    type="password"
                    placeholder="At least 6 characters"
                    value={form.password}
                    autoComplete="new-password"
                    onChange={(v) => setForm({ ...form, password: v })}
                  />
                </div>
              )}
            </div>
            <div>
              <Button type="submit" disabled={!formValid || busy !== ""} icon={icon(<path d="M5 12.5l4.5 4.5L19 7.5" />)}>
                {busy === "create" ? "Creating…" : "Create user"}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <Card className="fg-in fg-d1">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "18px" }}>
          <Tabs<Filter>
            label="Filter by role"
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "All" },
              { value: "instructor", label: "Instructors" },
              { value: "ta", label: "TAs" },
            ]}
          />
          <div style={{ width: "280px" }}>
            <TextField
              id="us"
              type="search"
              placeholder="Search name or email"
              value={search}
              onChange={setSearch}
              icon={icon(
                <>
                  <circle cx="11" cy="11" r="6.5" />
                  <path d="M16 16l4 4" />
                </>,
                18,
              )}
            />
          </div>
        </div>
        {users == null && !error && <p style={{ padding: "20px", margin: 0, color: "var(--muted)" }}>Loading users…</p>}
        {error && <Notice tone="error">{error}</Notice>}
        {users != null && visible.length === 0 && <p style={{ padding: "20px", margin: 0, color: "var(--muted)" }}>No users found.</p>}
        {visible.length > 0 && (
          <>
            <div
              className="fg-hide-sm"
              style={{ display: "grid", gridTemplateColumns: COLUMNS, gap: "16px", padding: "0 20px 10px", fontSize: "12.5px", color: "var(--muted)" }}
            >
              <span>Name</span>
              <span>Role</span>
              <span>Courses</span>
              <span>Last sign-in</span>
              <span>Status</span>
            </div>
            <div style={{ borderRadius: "18px", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)", overflow: "hidden" }}>
              {visible.map((u, i) => {
                const pill = STATUS[u.status];
                const deactivated = u.status === "DEACTIVATED";
                return (
                  <div
                    key={u.id}
                    className="fg-row"
                    style={{
                      display: "grid",
                      gridTemplateColumns: COLUMNS,
                      gap: "16px",
                      alignItems: "center",
                      padding: "12px 20px",
                      borderTop: i === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
                      opacity: deactivated ? 0.65 : 1,
                      ...(u.isYou
                        ? { background: "linear-gradient(90deg, var(--blue-t) 0%, rgba(var(--surface-rgb), 0) 60%)", boxShadow: "inset 3px 0 0 var(--blue)" }
                        : {}),
                    }}
                  >
                    <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                      <Avatar initial={u.name.charAt(0)} size={34} ink={u.role === "instructor"} />
                      <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                        <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
                          {u.name}
                          {u.isYou && <YouTag />}
                        </span>
                        <span style={{ fontFamily: MONO, fontSize: "12px", color: "var(--muted)", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {u.email}
                        </span>
                      </span>
                    </span>
                    <RoleChip role={u.role} size="md" />
                    <span style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                      {u.courses.length === 0 ? (
                        <span style={{ fontSize: "13px", color: "var(--faint)" }}>No course access</span>
                      ) : (
                        u.courses.map((c) => (
                          <span
                            key={c.id}
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
                            {c.code ?? "Course"}
                          </span>
                        ))
                      )}
                    </span>
                    <span style={{ fontSize: "13px", color: "var(--muted)" }}>{lastSignIn(u.lastSignInAt)}</span>
                    <span>
                      <Pill tone={pill.tone} dot>
                        {pill.label}
                      </Pill>
                    </span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>
    </AppShell>
  );
}
