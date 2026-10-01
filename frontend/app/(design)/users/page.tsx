"use client";

import { useEffect, useState } from "react";
import { AppShell, Avatar, Button, Card, PageHeader, PageTitle, Pill, RoleChip, YouTag } from "@/components/shell";
import { apiFetch } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

type Role = "instructor" | "ta";
type Filter = "all" | Role;

interface UserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: "ACTIVE" | "INVITED" | "DEACTIVATED";
  lastSignInAt: string | null;
  courses: { id: string; code: string | null }[];
  isYou: boolean;
}

export default function UsersPage() {
  const { user, loading: authLoading } = useRequireRole("instructor");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    apiFetch<{ users: UserRow[] }>("/users")
      .then(({ users: loaded }) => setUsers(loaded))
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load users"))
      .finally(() => setLoading(false));
  }, [user]);

  if (authLoading || !user) return null;

  const query = search.trim().toLowerCase();
  const visibleUsers = users
    .filter(
      (candidate) =>
        (filter === "all" || candidate.role === filter) &&
        (!query || candidate.name.toLowerCase().includes(query) || candidate.email.toLowerCase().includes(query)),
    )
    .sort((a, b) => Number(b.role === "instructor") - Number(a.role === "instructor"));

  return (
    <AppShell active="users" access="instructor">
      <PageHeader crumbs={[{ label: "Workspace" }, { label: "Users" }]}>
        <Button
          size="lg"
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>}
        >
          New user
        </Button>
      </PageHeader>
      <PageTitle title={<>Users</>} description={<>Everyone who can sign in. Course access is managed from each course&apos;s Members page.</>} />
      <Card className="fg-in fg-d1">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap", marginBottom: "18px" }}>
          <div role="radiogroup" aria-label="Filter by role" style={{ display: "inline-flex", padding: "4px", borderRadius: "999px", background: "rgba(var(--ink-rgb), 0.05)", gap: "2px" }}>
            <FilterTab active={filter === "all"} onClick={() => setFilter("all")}>All</FilterTab>
            <FilterTab active={filter === "instructor"} onClick={() => setFilter("instructor")}>Instructors</FilterTab>
            <FilterTab active={filter === "ta"} onClick={() => setFilter("ta")}>TAs</FilterTab>
          </div>
          <input id="us" type="search" placeholder="Search name or email" aria-label="Search name or email" value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: "280px", height: "44px", padding: "0 14px", border: 0, borderRadius: "12px", background: "var(--surface)", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)", fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif", fontSize: "14px", color: "var(--text)", outline: "none" }} />
        </div>
        {loading && <p style={{ padding: "20px", color: "var(--muted)" }}>Loading users…</p>}
        {error && <p style={{ padding: "20px", color: "var(--red-x)" }}>{error}</p>}
        {!loading && !error && visibleUsers.length === 0 && <p style={{ padding: "20px", color: "var(--muted)" }}>No users found.</p>}
        <div style={{ borderRadius: "18px", boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)", overflow: "hidden" }}>
          {visibleUsers.map((candidate, index) => (
            <div key={candidate.id} className="fg-row" style={{ display: "grid", gridTemplateColumns: "minmax(220px, 1.5fr) minmax(100px, 0.7fr) 130px minmax(160px, 1fr) 100px", gap: "16px", alignItems: "center", padding: "16px 20px", borderTop: index === 0 ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)" }}>
              <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <Avatar initial={candidate.name.charAt(0)} size={34} ink={candidate.role === "instructor"} />
                <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
                  <span style={{ color: "var(--ink)", fontSize: "14px", fontWeight: 500 }}>{candidate.name} {candidate.isYou && <YouTag />}</span>
                  <span style={{ color: "var(--muted)", fontSize: "12.5px" }}>{candidate.email}</span>
                </span>
              </span>
              <RoleChip role={candidate.role} size="md" />
              <Pill tone={candidate.status === "DEACTIVATED" ? "red" : candidate.status === "INVITED" ? "blue" : "green"} dot>
                {candidate.status === "ACTIVE" ? "Active" : candidate.status === "INVITED" ? "Invited" : "Deactivated"}
              </Pill>
              <span style={{ color: "var(--muted)", fontSize: "13px" }}>{candidate.courses.length ? candidate.courses.map((course) => course.code).filter(Boolean).join(", ") : "No courses"}</span>
              <span style={{ color: "var(--faint)", fontSize: "13px" }}>{candidate.lastSignInAt ? "Signed in" : "Not yet"}</span>
            </div>
          ))}
        </div>
      </Card>
    </AppShell>
  );
}

function FilterTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <button type="button" role="radio" aria-checked={active} className="fg-press" onClick={onClick} style={{ height: "34px", padding: "0 14px", border: 0, borderRadius: "999px", fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif", fontSize: "13.5px", fontWeight: 500, cursor: "pointer", background: active ? "var(--raised)" : "transparent", color: active ? "var(--ink)" : "var(--muted)", boxShadow: active ? "0 1px 2px rgba(var(--shadow-rgb), 0.10), 0 0 0 1px rgba(var(--ink-rgb), 0.07)" : undefined }}>{children}</button>;
}
