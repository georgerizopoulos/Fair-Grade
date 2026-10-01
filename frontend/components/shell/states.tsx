import type { ReactNode } from "react";
import { Card, SecondaryButton } from "./primitives";

// "You don't have access" state (design/states). Shown by AppShell when a page
// is for the other role, and by pages when the API answers 403.
export function NoAccess({
  title = "You don't have access to this page",
  message = "It belongs to a course or a role you're not part of. Ask the course instructor to add you if you think you should see it.",
  action,
}: {
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card className="fg-in" padding="28px">
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: "14px",
          minHeight: "250px",
        }}
      >
        <span
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "16px",
            background: "rgba(var(--ink-rgb), 0.06)",
            color: "var(--ink)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            style={{ flexShrink: 0, display: "block" }}
          >
            <rect x="5" y="10.5" width="14" height="9.5" rx="2.5" />
            <path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" />
          </svg>
        </span>
        <h2
          style={{
            margin: "6px 0 0",
            fontSize: "21px",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "14px",
            lineHeight: 1.6,
            color: "var(--muted)",
            maxWidth: "380px",
          }}
        >
          {message}
        </p>
        <div style={{ flexGrow: 1 }} />
        {action ?? (
          <SecondaryButton
            href="/courses"
            icon={
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{ flexShrink: 0, display: "block" }}
              >
                <path d="M19 12H5" />
                <path d="M11 6l-6 6 6 6" />
              </svg>
            }
          >
            <span>Back to my courses</span>
          </SecondaryButton>
        )}
      </div>
    </Card>
  );
}
