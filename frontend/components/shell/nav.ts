import type { IconName } from "./icons";

export type Role = "instructor" | "ta";

export interface ShellCourse {
  id: string; // used in URLs
  code: string; // HY335
  name: string; // Computer Networks
}

export interface ShellExam {
  id: string;
  name: string; // Midterm
  flagged?: number; // red badge next to "Report"
}

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
  active?: boolean;
  badge?: number;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export type InstructorNavKey =
  "exams" | "stats" | "members" | "setup" | "report" | "courses" | "users";
export type TaNavKey = "exams" | "my-stats" | "my-papers" | "add-paper" | "courses";

// Sidebar for the instructor. Course and exam sections only appear when given.
export function instructorNav({
  course,
  exam,
  active,
}: {
  course?: ShellCourse;
  exam?: ShellExam;
  active?: InstructorNavKey;
}): NavSection[] {
  const sections: NavSection[] = [];
  if (course) {
    const base = `/courses/${course.id}`;
    sections.push({
      title: course.code,
      items: [
        { href: base, label: "Exams", icon: "exams", active: active === "exams" },
        { href: `${base}/stats`, label: "Stats", icon: "stats", active: active === "stats" },
        {
          href: `${base}/members`,
          label: "Members",
          icon: "members",
          active: active === "members",
        },
      ],
    });
    if (exam) {
      const examBase = `${base}/exams/${exam.id}`;
      sections.push({
        title: exam.name,
        items: [
          { href: `${examBase}/setup`, label: "Setup", icon: "setup", active: active === "setup" },
          {
            href: `${examBase}/report`,
            label: "Report",
            icon: "pulse",
            active: active === "report",
            badge: exam.flagged || undefined,
          },
        ],
      });
    }
  }
  sections.push({
    title: "Workspace",
    items: [
      { href: "/courses", label: "All courses", icon: "courses", active: active === "courses" },
      { href: "/users", label: "Users", icon: "users", active: active === "users" },
    ],
  });
  return sections;
}

// Sidebar for a TA: their course, the exam they grade, and their courses list.
export function taNav({
  course,
  exam,
  active,
}: {
  course?: ShellCourse;
  exam?: ShellExam;
  active?: TaNavKey;
}): NavSection[] {
  const sections: NavSection[] = [];
  if (course) {
    sections.push({
      title: course.code,
      items: [
        {
          href: `/courses/${course.id}`,
          label: "Exams",
          icon: "exams",
          active: active === "exams",
        },
      ],
    });
    if (exam) {
      const examBase = `/courses/${course.id}/exams/${exam.id}`;
      sections.push({
        title: exam.name,
        items: [
          {
            href: `${examBase}/stats`,
            label: "My stats",
            icon: "pulse",
            active: active === "my-stats",
          },
          {
            href: `${examBase}/papers`,
            label: "My papers",
            icon: "pencil",
            active: active === "my-papers",
          },
          {
            href: `${examBase}/papers/new`,
            label: "Add paper",
            icon: "upload",
            active: active === "add-paper",
          },
        ],
      });
    }
  }
  sections.push({
    title: "Workspace",
    items: [
      { href: "/courses", label: "All courses", icon: "courses", active: active === "courses" },
    ],
  });
  return sections;
}
