import type { CSSProperties, ReactNode } from "react";
import { Avatar, Card, MONO } from "@/components/shell";

// Small pieces shared by the exam report and the TA detail page.

// −1.05 / +0.40 / 0.00, with a real minus sign.
export function signed(x: number | null | undefined, digits = 2) {
  if (x == null) return "—";
  if (Math.abs(x) < 0.005) return (0).toFixed(digits);
  return `${x < 0 ? "−" : "+"}${Math.abs(x).toFixed(digits)}`;
}

// 7 / 7.5 / 7.25: no trailing zeros.
export function pts(x: number | null | undefined) {
  if (x == null) return "—";
  return String(Math.round(x * 100) / 100);
}

export const gapColor = (x: number | null | undefined) =>
  x == null || Math.abs(x) < 0.005 ? "var(--text)" : x < 0 ? "var(--red-x)" : "var(--blue-x)";

export const initial = (name: string) => name.trim().charAt(0).toUpperCase() || "?";

// Red avatar with a halo, for a flagged TA.
export function FlagAvatar({ name, size }: { name: string; size: 22 | 26 | 34 | 52 }) {
  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: "var(--red)",
        color: "var(--surface)",
        boxShadow: "0 0 0 3px var(--surface), 0 0 0 4px rgba(214, 69, 69, 0.35)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size >= 52 ? "20px" : size >= 34 ? "14px" : size >= 26 ? "10px" : "9px",
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initial(name)}
    </span>
  );
}

export function TaAvatar({ name, flagged, size }: { name: string; flagged: boolean; size: 22 | 26 | 34 }) {
  return flagged ? <FlagAvatar name={name} size={size} /> : <Avatar initial={initial(name)} size={size} />;
}

// One question's gap in the TA table: solid when flagged, tinted when notable.
export function GapCell({
  gap,
  threshold,
  flagged,
}: {
  gap: number | null;
  threshold: number;
  flagged: boolean;
}) {
  const abs = Math.abs(gap ?? 0);
  const lenient = (gap ?? 0) > 0;
  let bg = "rgba(var(--ink-rgb), 0.045)";
  let fg = "var(--text-2)";
  if (gap != null && flagged) {
    bg = lenient ? "var(--blue)" : "var(--red)";
    fg = "var(--surface)";
  } else if (gap != null && abs >= threshold * 0.6) {
    bg = lenient ? "var(--blue-t3)" : "var(--red-t3)";
    fg = lenient ? "var(--blue-x3)" : "var(--red-x3)";
  } else if (gap != null && abs >= 0.1 - 1e-9) {
    bg = lenient ? "var(--blue-t)" : "var(--red-t)";
    fg = lenient ? "var(--blue-x)" : "var(--red-x)";
  }
  return (
    <span
      style={{
        flex: 1,
        minWidth: "52px",
        height: "30px",
        borderRadius: "9px",
        background: bg,
        color: fg,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "12.5px",
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {signed(gap)}
    </span>
  );
}

export const MONO_ID: CSSProperties = { fontFamily: MONO, letterSpacing: "-0.01em" };

export const BIG: CSSProperties = {
  fontSize: "38px",
  fontWeight: 500,
  letterSpacing: "-0.04em",
  color: "var(--ink)",
  fontVariantNumeric: "tabular-nums",
  lineHeight: 1,
};

export function Kpi({
  label,
  value,
  unit,
  note,
  color,
  className = "fg-in fg-d2",
}: {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  note?: ReactNode;
  color?: string;
  className?: string;
}) {
  return (
    <Card className={className} padding="20px 22px" fill>
      <div style={{ fontSize: "13px", color: "var(--muted)" }}>{label}</div>
      <div style={{ marginTop: "12px" }}>
        <span style={{ ...BIG, ...(color ? { color } : {}) }}>{value}</span>
        {unit != null && <span style={{ fontSize: "16px", color: "var(--muted)" }}> {unit}</span>}
      </div>
      {note != null && (
        <div style={{ marginTop: "8px", fontSize: "12.5px", color: "var(--muted)" }}>{note}</div>
      )}
    </Card>
  );
}

// Table header row; `columns` is the grid template shared with the rows.
export function TableHead({ columns, labels }: { columns: string; labels: ReactNode[] }) {
  return (
    <div
      className="fg-hide-sm"
      style={{
        display: "grid",
        gridTemplateColumns: columns,
        gap: "16px",
        padding: "18px 20px 10px",
        fontSize: "12.5px",
        color: "var(--muted)",
      }}
    >
      {labels.map((l, i) => (
        <span key={i}>{l}</span>
      ))}
    </div>
  );
}

export const TABLE_FRAME: CSSProperties = {
  borderRadius: "18px",
  boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.07)",
  overflow: "hidden",
};

export function rowStyle(columns: string, first: boolean, padding = "14px 20px"): CSSProperties {
  return {
    display: "grid",
    gridTemplateColumns: columns,
    gap: "16px",
    alignItems: "center",
    padding,
    textDecoration: "none",
    color: "var(--text)",
    borderTop: first ? 0 : "1px solid rgba(var(--ink-rgb), 0.07)",
  };
}

export function svg(size: number, strokeWidth = 1.4) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    style: { flexShrink: 0, display: "block" },
  };
}

export const Chevron = () => (
  <span style={{ color: "var(--faint)" }}>
    <svg {...svg(18)}>
      <path d="M9.5 6l6 6-6 6" />
    </svg>
  </span>
);

export const ArrowUpRight = ({ stroke = "currentColor" }: { stroke?: string }) => (
  <svg {...svg(16, 1.6)} stroke={stroke}>
    <path d="M7 17L17 7" />
    <path d="M9 7h8v8" />
  </svg>
);

// Saves rows as a CSV file in the browser.
export function downloadCsv(filename: string, rows: (string | number | null)[][]) {
  const escape = (v: string | number | null) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const blob = new Blob([rows.map((r) => r.map(escape).join(",")).join("\n") + "\n"], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
