"use client";

import { useRouter } from "next/navigation";
import { type CSSProperties, type FormEvent, useEffect, useState } from "react";
import { Avatar, Button, MONO, RoleChip } from "@/components/shell";
import { getCurrentUser, homeFor, login } from "@/lib/auth";

const DEMO_PASSWORD = "demo1234";
const DEMO_ACCOUNTS = [
  { email: "instructor@demo.com", initial: "I", role: "instructor" as const },
  { email: "nikos@demo.com", initial: "N", role: "ta" as const },
  { email: "maria@demo.com", initial: "M", role: "ta" as const },
];

const LABEL: CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text)",
  marginBottom: "8px",
};
const INPUT: CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  border: 0,
  borderRadius: "12px",
  background: "var(--surface)",
  boxShadow:
    "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
  fontFamily: "'Geist', 'Segoe UI', system-ui, sans-serif",
  fontSize: "14px",
  color: "var(--text)",
  outline: "none",
};

// Sign-in form. Instructors land on their courses, TAs on the exam they grade.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in: skip the form.
  useEffect(() => {
    getCurrentUser()
      .then(async (user) => {
        if (user) router.replace(await homeFor(user));
      })
      .catch(() => {});
  }, [router]);

  async function signIn(e: string, p: string) {
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(e, p);
      router.replace(await homeFor(user));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
      setSubmitting(false);
    }
  }

  function onSubmit(ev: FormEvent) {
    ev.preventDefault();
    void signIn(email, password);
  }

  return (
    <form
      onSubmit={onSubmit}
      className="fg-in fg-d1"
      style={{
        width: "100%",
        maxWidth: "400px",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        padding: "48px 0",
      }}
      aria-labelledby="t"
    >
      <div>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            height: "24px",
            padding: "0 10px",
            borderRadius: "999px",
            background: "var(--surface)",
            boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11)",
            color: "var(--muted)",
            fontSize: "10.5px",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          Course staff
        </span>
        <h1
          id="t"
          style={{
            margin: "14px 0 0",
            fontSize: "40px",
            fontWeight: 600,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            color: "var(--ink)",
          }}
        >
          Sign in
        </h1>
        <p
          style={{ margin: "10px 0 0", fontSize: "15px", lineHeight: 1.55, color: "var(--muted)" }}
        >
          Use the account your instructor created for you.
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <label htmlFor="email" style={LABEL}>
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          placeholder="instructor@demo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={INPUT}
        />
      </div>
      <div style={{ width: "100%" }}>
        <label htmlFor="password" style={LABEL}>
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={INPUT}
        />
        {error && (
          <p role="alert" style={{ margin: "10px 0 0", fontSize: "13.5px", color: "var(--red-x)" }}>
            {error}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        disabled={submitting}
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
            style={{ flexShrink: 0, display: "block" }}
          >
            <path d="M5 12h14" />
            <path d="M13 6l6 6-6 6" />
          </svg>
        }
      >
        {submitting ? "Signing in…" : "Sign in"}
      </Button>

      <div
        style={{
          marginTop: "10px",
          paddingTop: "18px",
          borderTop: "1px solid rgba(var(--ink-rgb), 0.07)",
        }}
      >
        <p style={{ margin: "0 0 10px", fontSize: "12.5px", color: "var(--muted)" }}>
          Demo accounts. Password <span style={{ fontFamily: MONO }}>{DEMO_PASSWORD}</span>
        </p>
        {DEMO_ACCOUNTS.map((a) => (
          <button
            key={a.email}
            type="button"
            disabled={submitting}
            onClick={() => {
              setEmail(a.email);
              setPassword(DEMO_PASSWORD);
              void signIn(a.email, DEMO_PASSWORD);
            }}
            className="fg-press fg-row"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              width: "calc(100% + 20px)",
              padding: "8px 10px",
              margin: "0 -10px",
              border: 0,
              borderRadius: "12px",
              background: "transparent",
              color: "var(--text)",
              cursor: "pointer",
              textAlign: "left",
            }}
          >
            <Avatar initial={a.initial} size={26} ink={a.role === "instructor"} />
            <span style={{ fontFamily: MONO, fontSize: "13px", flexGrow: 1 }}>{a.email}</span>
            <RoleChip role={a.role} />
          </button>
        ))}
      </div>
    </form>
  );
}
