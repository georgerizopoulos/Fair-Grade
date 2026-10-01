"use client";

import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  AppShell,
  Avatar,
  Button,
  Card,
  IconButton,
  MONO,
  NoAccess,
  Notice,
  PageHeader,
  PageTitle,
  Pill,
  RoleChip,
  SecondaryButton,
  SectionHeader,
  TextField,
  YouTag,
} from "@/components/shell";
import { ApiError, apiFetch } from "@/lib/api";

// Members of a course (design: Members.html). Only members can open the course.
//   GET    /courses/:id, /courses/:id/members, /users?role=ta
//   POST   /courses/:id/members   { userId } or { name, email }
//   DELETE /courses/:id/members/:userId

type Status = "ACTIVE" | "INVITED" | "DEACTIVATED";

interface Person {
  userId: string;
  name: string;
  email: string;
  status: Status;
  isYou: boolean;
}

interface Member extends Person {
  role: "ta";
  papersGraded: number;
}

interface MembersResponse {
  owner: Person | null;
  members: Member[];
}

interface CourseInfo {
  id: string;
  code: string | null;
  name: string;
}

interface Account {
  id: string;
  name: string;
  email: string;
  status: Status;
}

const COLUMNS = "minmax(0, 1fr) 112px 64px 124px 96px";

const STATUS_PILL: Record<Status, { tone: "green" | "blue" | "red"; label: string }> = {
  ACTIVE: { tone: "green", label: "Has access" },
  INVITED: { tone: "blue", label: "Invited" },
  DEACTIVATED: { tone: "red", label: "Deactivated" },
};

const errorText = (cause: unknown) =>
  cause instanceof Error ? cause.message : "Something went wrong";

export function MembersEditor() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<CourseInfo | null>(null);
  const [data, setData] = useState<MembersResponse | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [notice, setNotice] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const reload = useCallback(
    () =>
      apiFetch<MembersResponse>(`/courses/${courseId}/members`).then((loaded) => setData(loaded)),
    [courseId],
  );

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      apiFetch<CourseInfo>(`/courses/${courseId}`),
      apiFetch<MembersResponse>(`/courses/${courseId}/members`),
      apiFetch<{ users: Account[] }>("/users?role=ta"),
    ])
      .then(([courseData, membersData, usersData]) => {
        if (cancelled) return;
        setCourse(courseData);
        setData(membersData);
        setAccounts(usersData.users);
      })
      .catch((cause) => {
        if (!cancelled) setLoadError(cause instanceof Error ? cause : new Error("Could not load"));
      });
    return () => {
      cancelled = true;
    };
  }, [courseId]);

  const shellCourse = {
    id: courseId,
    code: course?.code ?? course?.name ?? "",
    name: course?.name ?? "",
  };

  if (loadError) {
    const denied =
      loadError instanceof ApiError && (loadError.status === 403 || loadError.status === 404);
    return (
      <AppShell course={shellCourse} active="members" access="instructor">
        {denied ? <NoAccess /> : <Notice tone="error">{loadError.message}</Notice>}
      </AppShell>
    );
  }

  if (!course || !data) {
    return (
      <AppShell course={shellCourse} active="members" access="instructor">
        <p style={{ margin: 0, fontSize: "14px", color: "var(--muted)" }}>Loading members…</p>
      </AppShell>
    );
  }

  const code = course.code ?? course.name;
  const memberIds = new Set(data.members.map((m) => m.userId));
  const query = search.trim().toLowerCase();
  const matches = query
    ? accounts
        .filter(
          (a) =>
            !memberIds.has(a.id) &&
            (a.name.toLowerCase().includes(query) || a.email.toLowerCase().includes(query)),
        )
        .slice(0, 5)
    : [];
  const peopleCount = data.members.length + (data.owner ? 1 : 0);

  async function run(key: string, action: () => Promise<string>) {
    setBusy(key);
    setNotice(null);
    try {
      const message = await action();
      await reload();
      setNotice({ tone: "ok", text: message });
    } catch (cause) {
      setNotice({ tone: "error", text: errorText(cause) });
    } finally {
      setBusy("");
    }
  }

  const addExisting = (account: Account) =>
    run(`add-${account.id}`, async () => {
      await apiFetch(`/courses/${courseId}/members`, {
        method: "POST",
        body: { userId: account.id },
      });
      setSearch("");
      return `${account.name} can now open ${code}.`;
    });

  const createAndAdd = () =>
    run("create", async () => {
      const created = await apiFetch<{ name: string; temporaryPassword?: string }>(
        `/courses/${courseId}/members`,
        { method: "POST", body: { name: newName.trim(), email: newEmail.trim() } },
      );
      const users = await apiFetch<{ users: Account[] }>("/users?role=ta");
      setAccounts(users.users);
      setNewName("");
      setNewEmail("");
      return created.temporaryPassword
        ? `${created.name} was added. Temporary password: ${created.temporaryPassword} (send it to them; they change it at first sign-in).`
        : `${created.name} was added to ${code}.`;
    });

  const remove = (member: Member) =>
    run(`remove-${member.userId}`, async () => {
      await apiFetch(`/courses/${courseId}/members/${member.userId}`, { method: "DELETE" });
      setConfirmRemove(null);
      return `${member.name} no longer has access. Their submitted papers stay in the reports.`;
    });

  return (
    <AppShell course={shellCourse} active="members" access="instructor">
      <PageHeader
        crumbs={[
          { label: [course.code, course.name].filter(Boolean).join(" "), href: `/courses/${courseId}` },
          { label: "Members" },
        ]}
      />
      <PageTitle title="Members" description={<>Who can open {code} and grade its exams.</>} />

      {notice && <Notice tone={notice.tone}>{notice.text}</Notice>}

      <div
        className="fg-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "20px",
          alignItems: "start",
        }}
      >
        <div className="fg-span" style={{ gridColumn: "span 8", minWidth: 0 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Card className="fg-in fg-d1" padding="26px">
              <SectionHeader
                title={<>People in {code}</>}
                description={
                  <>
                    {peopleCount} {peopleCount === 1 ? "person" : "people"}. Only they can open this
                    course.
                  </>
                }
              />
              <div
                className="fg-hide-sm"
                style={{
                  display: "grid",
                  gridTemplateColumns: COLUMNS,
                  gap: "16px",
                  padding: "18px 20px 10px",
                  fontSize: "12.5px",
                  color: "var(--muted)",
                }}
              >
                <span>Person</span>
                <span>Role</span>
                <span>Papers</span>
                <span>Access</span>
                <span />
              </div>
              <div
                style={{
                  borderRadius: "18px",
                  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
                  overflow: "hidden",
                }}
              >
                {data.owner && (
                  <Row
                    person={data.owner}
                    first
                    role={<RoleChip role="instructor" size="md" />}
                    papers="—"
                    access={<Pill>Owner</Pill>}
                  />
                )}
                {data.members.map((member, i) => {
                  const pill = STATUS_PILL[member.status];
                  const confirming = confirmRemove === member.userId;
                  return (
                    <Row
                      key={member.userId}
                      person={member}
                      first={!data.owner && i === 0}
                      role={<RoleChip role="ta" size="md" />}
                      papers={String(member.papersGraded)}
                      access={
                        <Pill tone={pill.tone} dot>
                          {pill.label}
                        </Pill>
                      }
                      action={
                        confirming ? (
                          <span style={{ display: "flex", gap: "4px", justifyContent: "flex-end" }}>
                            <button
                              type="button"
                              className="fg-press"
                              onClick={() => remove(member)}
                              disabled={busy !== ""}
                              style={{
                                height: "32px",
                                padding: "0 12px",
                                border: 0,
                                borderRadius: "999px",
                                background: "var(--red)",
                                color: "var(--surface)",
                                fontSize: "12.5px",
                                fontWeight: 500,
                                cursor: "pointer",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {busy === `remove-${member.userId}` ? "…" : "Remove"}
                            </button>
                            <IconButton label="Keep access" onClick={() => setConfirmRemove(null)}>
                              <CrossIcon />
                            </IconButton>
                          </span>
                        ) : (
                          <span style={{ display: "flex", justifyContent: "flex-end" }}>
                            <IconButton
                              label={`Remove ${member.name} from ${code}`}
                              onClick={() => setConfirmRemove(member.userId)}
                            >
                              <RemoveIcon />
                            </IconButton>
                          </span>
                        )
                      }
                    />
                  );
                })}
                {data.members.length === 0 && (
                  <p
                    style={{
                      margin: 0,
                      padding: "18px 20px",
                      borderTop: data.owner ? "1px solid rgba(var(--ink-rgb), 0.07)" : 0,
                      fontSize: "13.5px",
                      color: "var(--muted)",
                    }}
                  >
                    No TAs yet. Add one on the right.
                  </p>
                )}
              </div>
            </Card>
            <Card className="fg-in fg-d3" padding="16px 20px">
              <div style={{ display: "flex", gap: "12px" }}>
                <svg {...svg(18)} stroke="var(--muted)">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 11v5M12 8h.01" />
                </svg>
                <p style={{ margin: 0, fontSize: "13px", lineHeight: 1.55, color: "var(--muted)" }}>
                  A TA can add and grade papers in every exam of this course while they are a
                  member. Removing access keeps their submitted papers in the report.
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="fg-span" style={{ gridColumn: "span 4", minWidth: 0 }}>
          <div style={{ position: "sticky", top: "24px" }}>
            <Card className="fg-in fg-d2">
              <SectionHeader title="Add a TA" description="Search accounts by name or email." />
              <div style={{ marginTop: "16px" }}>
                <TextField
                  id="find"
                  type="search"
                  placeholder="Name or email"
                  value={search}
                  onChange={setSearch}
                  icon={
                    <svg {...svg(18)}>
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16l4 4" />
                    </svg>
                  }
                />
              </div>
              {query && (
                <div style={{ marginTop: "10px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {matches.length === 0 && (
                    <p style={{ margin: "4px 2px", fontSize: "13px", color: "var(--muted)" }}>
                      No TA account matches. Create one below.
                    </p>
                  )}
                  {matches.map((account) => (
                    <div
                      key={account.id}
                      className="fg-row"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 8px 8px 10px",
                        borderRadius: "14px",
                      }}
                    >
                      <Avatar initial={account.name.charAt(0)} size={28} />
                      <span style={{ display: "flex", flexDirection: "column", minWidth: 0, flexGrow: 1 }}>
                        <span style={{ fontSize: "13.5px", fontWeight: 500, color: "var(--ink)" }}>
                          {account.name}
                        </span>
                        <span
                          style={{
                            fontFamily: MONO,
                            fontSize: "11.5px",
                            color: "var(--muted)",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {account.email}
                        </span>
                      </span>
                      <SecondaryButton onClick={() => addExisting(account)} disabled={busy !== ""}>
                        <span>{busy === `add-${account.id}` ? "Adding…" : "Add"}</span>
                      </SecondaryButton>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ margin: "24px 0 16px", borderTop: "1px solid rgba(var(--ink-rgb), 0.07)" }} />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>
                No account yet?
              </h3>
              <p style={{ margin: "4px 0 14px", fontSize: "13px", color: "var(--muted)", lineHeight: 1.5 }}>
                Create it here. They sign in with a temporary password and set their own.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void createAndAdd();
                }}
                style={{ display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <TextField id="nn" label="Name" placeholder="Full name" value={newName} onChange={setNewName} required />
                <TextField
                  id="ne"
                  label="Email"
                  type="email"
                  placeholder="name@csd.uoc.gr"
                  value={newEmail}
                  onChange={setNewEmail}
                  required
                />
                <div style={{ marginTop: "2px" }}>
                  <Button
                    type="submit"
                    disabled={busy !== "" || !newName.trim() || !newEmail.trim()}
                    icon={
                      <svg {...svg(16)} strokeWidth="1.6">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    }
                  >
                    {busy === "create" ? "Creating…" : "Create account and add"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({
  person,
  first,
  role,
  papers,
  access,
  action,
}: {
  person: Person;
  first: boolean;
  role: React.ReactNode;
  papers: string;
  access: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="fg-row"
      style={{
        display: "grid",
        gridTemplateColumns: COLUMNS,
        gap: "16px",
        alignItems: "center",
        padding: "12px 20px",
        borderTop: first ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
        ...(person.isYou
          ? {
              background: "linear-gradient(90deg, var(--blue-t) 0%, rgba(var(--surface-rgb), 0) 60%)",
              boxShadow: "inset 3px 0 0 var(--blue)",
            }
          : {}),
      }}
    >
      <span style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
        <Avatar initial={person.name.charAt(0)} size={34} ink={person.isYou} />
        <span style={{ display: "flex", flexDirection: "column", minWidth: 0 }}>
          <span style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)" }}>
            {person.name}
            {person.isYou && <YouTag />}
          </span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: "12px",
              color: "var(--muted)",
              letterSpacing: "-0.01em",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {person.email}
          </span>
        </span>
      </span>
      {role}
      <span style={{ fontSize: "13.5px", fontVariantNumeric: "tabular-nums" }}>{papers}</span>
      <span>{access}</span>
      {action ?? <span />}
    </div>
  );
}

function svg(size: number) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { flexShrink: 0, display: "block" },
  };
}

const CrossIcon = () => (
  <svg {...svg(18)}>
    <path d="M6.5 6.5l11 11M17.5 6.5l-11 11" />
  </svg>
);
const RemoveIcon = () => (
  <svg {...svg(18)}>
    <circle cx="10" cy="8.5" r="3.5" />
    <path d="M3.5 19.5c.8-3.2 3.4-5 6.5-5s5.7 1.8 6.5 5M16 11h5" />
  </svg>
);
