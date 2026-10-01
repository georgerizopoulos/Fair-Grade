import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

// Building blocks of the Fair Grade design. Styles are copied from the design
// reference so pages built from these look exactly like the mockups.

const FONT = "'Geist', 'Segoe UI', system-ui, sans-serif";
export const MONO = "'Geist Mono', ui-monospace, 'SFMono-Regular', monospace";
const RING = "0 0 0 1px rgba(var(--ink-rgb), 0.11)";
const LIFT =
  "0 1px 1px rgba(var(--shadow-rgb), 0.02), 0 6px 18px -10px rgba(var(--shadow-rgb), 0.08)";

// ---------------------------------------------------------------- Card

const CARD_SIZES = {
  // outer radius, outer padding, inner radius
  md: { outer: "26px", pad: "6px", inner: "20px" },
  feature: { outer: "28px", pad: "6px", inner: "22px" },
  lg: { outer: "30px", pad: "7px", inner: "23px" },
} as const;

// A white panel inside a soft frame. `padding` is the inner padding.
export function Card({
  children,
  padding = "24px",
  size = "md",
  fill = false,
  className,
  style,
  innerStyle,
}: {
  children: ReactNode;
  padding?: string;
  size?: keyof typeof CARD_SIZES;
  fill?: boolean; // stretch to the row height
  className?: string;
  style?: CSSProperties;
  innerStyle?: CSSProperties;
}) {
  const s = CARD_SIZES[size];
  return (
    <div
      className={className}
      style={{
        background: "rgba(var(--ink-rgb), 0.028)",
        boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.05)",
        borderRadius: s.outer,
        padding: s.pad,
        ...(fill ? { height: "100%" } : {}),
        ...style,
      }}
    >
      <div
        style={{
          background: "var(--surface)",
          borderRadius: s.inner,
          padding,
          boxShadow: `inset 0 1px 0 rgba(var(--surface-rgb), 0.9), ${LIFT}`,
          ...(fill ? { height: "100%" } : {}),
          ...innerStyle,
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Title + description at the top of a card, with an optional action on the right.
export function SectionHeader({
  title,
  description,
  children,
}: {
  title: ReactNode;
  description?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: "16px",
        marginBottom: "20px",
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            fontSize: "17px",
            fontWeight: 600,
            letterSpacing: "-0.02em",
            color: "var(--ink)",
          }}
        >
          {title}
        </h2>
        {description != null && (
          <p
            style={{
              margin: "5px 0 0",
              fontSize: "13.5px",
              lineHeight: 1.5,
              color: "var(--muted)",
              maxWidth: "560px",
            }}
          >
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

// ---------------------------------------------------------------- Pill

const PILL_TONES = {
  green: { bg: "var(--green-t)", fg: "var(--green-x)", dot: "var(--green)" },
  red: { bg: "var(--red-t)", fg: "var(--red-x)", dot: "var(--red)" },
  blue: { bg: "var(--blue-t)", fg: "var(--blue-x)", dot: "var(--blue)" },
  amber: { bg: "var(--amber-t)", fg: "var(--amber-x)", dot: "var(--amber)" },
  neutral: { bg: "rgba(var(--ink-rgb), 0.05)", fg: "var(--text-2)", dot: "var(--dot)" },
} as const;
export type PillTone = keyof typeof PILL_TONES;

// Status pill. Colours carry meaning: red = stricter / flagged, blue = AI,
// green = submitted / OK, amber = in progress, neutral = draft / info.
export function Pill({
  tone = "neutral",
  dot = false,
  children,
}: {
  tone?: PillTone;
  dot?: boolean;
  children: ReactNode;
}) {
  const t = PILL_TONES[tone];
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "7px",
        height: "26px",
        padding: "0 10px",
        borderRadius: "999px",
        background: t.bg,
        color: t.fg,
        fontSize: "12.5px",
        fontWeight: 500,
        whiteSpace: "nowrap",
      }}
    >
      {dot && (
        <span style={{ width: "6px", height: "6px", borderRadius: "999px", background: t.dot }} />
      )}
      {children}
    </span>
  );
}

// ---------------------------------------------------------------- Buttons

// Renders a Next <Link> when `href` is given, otherwise a <button>.
function Pressable({
  href,
  style,
  children,
  ...rest
}: {
  href?: string;
  style: CSSProperties;
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  "aria-label"?: string;
}) {
  if (href) {
    return (
      <Link href={href} className="fg-press" style={style} aria-label={rest["aria-label"]}>
        {children}
      </Link>
    );
  }
  return (
    <button type={rest.type ?? "button"} className="fg-press" style={style} {...rest}>
      {children}
    </button>
  );
}

const KNOB_VARIANTS = {
  primary: {
    bg: "var(--ink)",
    fg: "var(--surface)",
    shadow: "none",
    knobBg: "rgba(var(--surface-rgb), 0.12)",
    knobFg: "var(--surface)",
  },
  outline: {
    bg: "var(--surface)",
    fg: "var(--ink)",
    shadow: RING,
    knobBg: "rgba(var(--ink-rgb), 0.035)",
    knobFg: "var(--ink)",
  },
  danger: {
    bg: "var(--red)",
    fg: "var(--surface)",
    shadow: "none",
    knobBg: "rgba(var(--surface-rgb), 0.16)",
    knobFg: "var(--surface)",
  },
} as const;

// Pill button with a round icon "knob" on the right (the main actions).
export function Button({
  children,
  icon,
  href,
  variant = "primary",
  size = "md",
  fullWidth = false,
  onClick,
  type,
  disabled,
}: {
  children: ReactNode;
  icon: ReactNode;
  href?: string;
  variant?: keyof typeof KNOB_VARIANTS;
  size?: "md" | "lg";
  fullWidth?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const v = KNOB_VARIANTS[variant];
  const lg = size === "lg";
  const knob = lg ? "34px" : "28px";
  return (
    <Pressable
      href={href}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        height: lg ? "48px" : "40px",
        padding: lg ? "6px 7px 6px 20px" : "6px 7px 6px 16px",
        borderRadius: "999px",
        background: v.bg,
        color: v.fg,
        boxShadow: v.shadow,
        border: 0,
        fontFamily: FONT,
        fontSize: lg ? "15px" : "14px",
        fontWeight: 500,
        letterSpacing: "-0.01em",
        textDecoration: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
        ...(fullWidth ? { width: "100%", justifyContent: "space-between" } : {}),
      }}
    >
      <span>{children}</span>
      <span
        className="fg-knob"
        style={{
          width: knob,
          height: knob,
          borderRadius: "999px",
          background: v.knobBg,
          color: v.knobFg,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {icon}
      </span>
    </Pressable>
  );
}

// Plain white pill button (secondary actions). `children` is the label, `icon` goes first.
export function SecondaryButton({
  children,
  icon,
  href,
  onClick,
  type,
  disabled,
}: {
  children: ReactNode;
  icon?: ReactNode;
  href?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <Pressable
      href={href}
      onClick={onClick}
      type={type}
      disabled={disabled}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        height: "40px",
        padding: "0 16px",
        borderRadius: "999px",
        background: "var(--surface)",
        color: "var(--ink)",
        boxShadow: `${RING}, ${LIFT}`,
        border: 0,
        fontFamily: FONT,
        fontSize: "14px",
        fontWeight: 500,
        textDecoration: "none",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {icon}
      {children}
    </Pressable>
  );
}

// Round 40px icon-only button. Always give it a label.
export function IconButton({
  label,
  children,
  href,
  onClick,
}: {
  label: string;
  children: ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  return (
    <Pressable
      href={href}
      onClick={onClick}
      aria-label={label}
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
      {children}
    </Pressable>
  );
}

// ---------------------------------------------------------------- People

const AVATAR_FONT: Record<number, string> = {
  18: "7px",
  22: "9px",
  26: "10px",
  28: "11px",
  32: "13px",
  34: "14px",
};

// Round initial. `ink` is used for the instructor.
export function Avatar({
  initial,
  size = 32,
  ink = false,
}: {
  initial: string;
  size?: 18 | 22 | 26 | 28 | 32 | 34;
  ink?: boolean;
}) {
  return (
    <span
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "999px",
        background: ink ? "var(--ink)" : "var(--avatar-bg)",
        color: ink ? "var(--surface)" : "var(--avatar-fg)",
        boxShadow: "0 0 0 2px var(--surface)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: AVATAR_FONT[size],
        fontWeight: 600,
        flexShrink: 0,
      }}
    >
      {initial}
    </span>
  );
}

export function RoleChip({ role, size = "sm" }: { role: "instructor" | "ta"; size?: "sm" | "md" }) {
  const instructor = role === "instructor";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        height: size === "sm" ? "22px" : "26px",
        padding: "0 10px 0 8px",
        borderRadius: "999px",
        background: instructor ? "var(--ink)" : "rgba(var(--ink-rgb), 0.06)",
        color: instructor ? "var(--surface)" : "var(--ink)",
        fontSize: size === "sm" ? "11.5px" : "12.5px",
        fontWeight: 500,
        whiteSpace: "nowrap",
        width: "fit-content",
      }}
    >
      <svg
        width="13"
        height="13"
        viewBox="0 0 24 24"
        fill="none"
        stroke={instructor ? "var(--gold-icon)" : "var(--teal)"}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ flexShrink: 0, display: "block" }}
      >
        {instructor ? (
          <>
            <circle cx="8" cy="15" r="3.5" />
            <path d="M10.5 12.5L19 4M16 7l2 2" />
          </>
        ) : (
          <>
            <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18z" />
            <path d="M14.5 6.5l3 3" />
          </>
        )}
      </svg>
      {instructor ? "Instructor" : "TA"}
    </span>
  );
}

// Marks the signed-in user's own row in any list of people.
export function YouTag() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "20px",
        padding: "0 7px",
        marginLeft: "8px",
        borderRadius: "999px",
        background: "var(--blue)",
        color: "var(--surface)",
        fontSize: "11px",
        fontWeight: 600,
        letterSpacing: "0.01em",
        verticalAlign: "1px",
      }}
    >
      You
    </span>
  );
}

export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        height: "22px",
        padding: "0 7px",
        borderRadius: "7px",
        background: "var(--surface)",
        boxShadow: "0 0 0 1px rgba(var(--ink-rgb), 0.11), 0 1px 0 rgba(var(--ink-rgb), 0.11)",
        fontFamily: FONT,
        fontSize: "11.5px",
        fontWeight: 500,
        color: "var(--muted)",
      }}
    >
      {children}
    </kbd>
  );
}
