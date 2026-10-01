import type { CSSProperties, ReactNode } from "react";

// Line icons used by the shell. Same 24×24 grid and stroke as the design.
export type IconName =
  | "exams"
  | "stats"
  | "members"
  | "courses"
  | "users"
  | "setup"
  | "pulse"
  | "pencil"
  | "upload"
  | "search"
  | "chevrons"
  | "logout"
  | "key"
  | "sun"
  | "moon";

const PATHS: Record<IconName, ReactNode> = {
  exams: (
    <>
      <path d="M13.5 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
      <path d="M13.5 3.5V9H19" />
    </>
  ),
  stats: (
    <>
      <path d="M5 19v-7" />
      <path d="M10 19V5" />
      <path d="M15 19v-9" />
      <path d="M20 19v-4" />
    </>
  ),
  members: (
    <>
      <circle cx="9" cy="8.5" r="3.2" />
      <path d="M3.5 19c.8-3.3 3-5 5.5-5s4.7 1.7 5.5 5" />
      <circle cx="17" cy="9.5" r="2.4" />
      <path d="M16 14.2c2.3.1 4 1.6 4.6 4.3" />
    </>
  ),
  courses: (
    <>
      <path d="M4 5.5h6.5a2 2 0 0 1 2 2V19a1.6 1.6 0 0 0-1.6-1.6H4z" />
      <path d="M20 5.5h-6.5a2 2 0 0 0-2 2V19a1.6 1.6 0 0 1 1.6-1.6H20z" />
    </>
  ),
  users: (
    <>
      <rect x="4" y="5" width="16" height="14" rx="3" />
      <circle cx="10" cy="11" r="2.3" />
      <path d="M6.8 16.5c.6-1.6 1.8-2.4 3.2-2.4s2.6.8 3.2 2.4" />
      <path d="M15 10h2.5M15 13h2.5" />
    </>
  ),
  setup: (
    <>
      <path d="M5 7h9" />
      <path d="M18 7h1" />
      <circle cx="16" cy="7" r="2" />
      <path d="M5 17h1" />
      <path d="M10 17h9" />
      <circle cx="8" cy="17" r="2" />
    </>
  ),
  pulse: <path d="M4 12h3l2.5-6 5 12 2.5-6h3" />,
  pencil: (
    <>
      <path d="M5 19l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L9 18z" />
      <path d="M14.5 6.5l3 3" />
    </>
  ),
  upload: (
    <>
      <path d="M12 15.5V4.5" />
      <path d="M7.5 9l4.5-4.5L16.5 9" />
      <path d="M4.5 15v3a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </>
  ),
  chevrons: (
    <>
      <path d="M8 9.5l4-4 4 4" />
      <path d="M8 14.5l4 4 4-4" />
    </>
  ),
  logout: (
    <>
      <path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4" />
      <path d="M10 16l-4-4 4-4" />
      <path d="M6 12h9" />
    </>
  ),
  key: (
    <>
      <circle cx="8" cy="15" r="3.5" />
      <path d="M10.5 12.5L19 4M16 7l2 2" />
    </>
  ),
  sun: (
    <>
      <circle cx="12" cy="12" r="3.6" />
      <path d="M12 3.5v1.6M12 18.9v1.6M3.5 12h1.6M18.9 12h1.6M6 6l1.1 1.1M16.9 16.9L18 18M18 6l-1.1 1.1M7.1 16.9L6 18" />
    </>
  ),
  moon: <path d="M19 14.2A7.5 7.5 0 0 1 9.8 5a7.5 7.5 0 1 0 9.2 9.2z" />,
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.4,
  stroke = "currentColor",
  style,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
  stroke?: string;
  style?: CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={stroke}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block", ...style }}
    >
      {PATHS[name]}
    </svg>
  );
}

// The Fair Grade mark: two lines and the red pen dot.
export function Logo({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      style={{ flexShrink: 0, display: "block" }}
    >
      <rect width="32" height="32" rx="10" fill="var(--ink)" />
      <rect x="8" y="11" width="16" height="2.6" rx="1.3" fill="var(--surface)" />
      <rect x="8" y="18.4" width="11" height="2.6" rx="1.3" fill="var(--surface)" />
      <circle cx="23" cy="19.7" r="2.2" fill="var(--red)" />
    </svg>
  );
}
