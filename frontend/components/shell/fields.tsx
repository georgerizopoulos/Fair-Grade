import type { CSSProperties, ReactNode } from "react";

// Form fields of the design (44px inputs with a soft ring). Labels sit above.

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";

export const FIELD_STYLE: CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 14px",
  border: 0,
  borderRadius: "12px",
  background: "var(--surface)",
  boxShadow:
    "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)",
  fontFamily: FONT,
  fontSize: "14px",
  color: "var(--text)",
};

export const LABEL_STYLE: CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 500,
  color: "var(--text)",
  marginBottom: "8px",
};

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon,
  autoComplete,
  required,
  hint,
}: {
  id: string;
  label?: ReactNode; // without a label, give a placeholder (used as aria-label)
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "search" | "number" | "date";
  placeholder?: string;
  icon?: ReactNode; // shown inside the field, on the left
  autoComplete?: string;
  required?: boolean;
  hint?: ReactNode;
}) {
  return (
    <div style={{ width: "100%" }}>
      {label != null && (
        <label htmlFor={id} style={LABEL_STYLE}>
          {label}
        </label>
      )}
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: "14px",
              top: "13px",
              color: "var(--faint)",
              pointerEvents: "none",
            }}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          placeholder={placeholder}
          aria-label={label == null ? placeholder : undefined}
          autoComplete={autoComplete}
          required={required}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...FIELD_STYLE, ...(icon ? { paddingLeft: "42px" } : {}) }}
        />
      </div>
      {hint != null && (
        <p style={{ margin: "6px 0 0", fontSize: "12.5px", color: "var(--muted)" }}>{hint}</p>
      )}
    </div>
  );
}

// Inline message under a form or above a list. tone: error | ok | info.
export function Notice({
  tone = "info",
  children,
}: {
  tone?: "error" | "ok" | "info";
  children: ReactNode;
}) {
  const colors = {
    error: { bg: "var(--red-t)", fg: "var(--red-x)" },
    ok: { bg: "var(--green-t)", fg: "var(--green-x)" },
    info: { bg: "var(--blue-t)", fg: "var(--blue-x)" },
  }[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      style={{
        padding: "12px 16px",
        borderRadius: "14px",
        fontSize: "13.5px",
        lineHeight: 1.5,
        background: colors.bg,
        color: colors.fg,
      }}
    >
      {children}
    </div>
  );
}
