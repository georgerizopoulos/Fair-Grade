import type { IconName } from "./icons";
import type { ExamStatus, SidebarExam } from "./shell-data";

export type Role = "instructor" | "ta";

export interface ShellCourse {
  id: string; // used in URLs
  code: string; // HY335
  name: string; // Computer Networks
  reopenRequests?: number; // badge next to "Overview" (instructor)
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
  status?: ExamStatus; // exam rows: a small status dot
  current?: boolean; // exam rows: the exam this page belongs to
  children?: NavItem[]; // the current exam's pages, shown indented
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export type InstructorNavKey =
  "exams" | "stats" | "members" | "setup" | "report" | "courses" | "users";
export type TaNavKey = "exams" | "my-stats" | "my-papers" | "add-paper" | "courses";

// Every exam of the course, the current one first loaded from the page if the
// list hasn't arrived yet, so the sidebar never jumps.
function examList(exam: ShellExam | undefined, exams: SidebarExam[] | null | undefined) {
  if (exams && (!exam || exams.some((e) => e.id === exam.id))) return exams;
  return exam ? [...(exams ?? []), { id: exam.id, name: exam.name, status: "OPEN" as const }] : (exams ?? []);
}

// Sidebar for the instructor.
export function instructorNav({
  course,
  exam,
  exams,
  active,
}: {
  course?: ShellCourse;
  exam?: ShellExam;
  exams?: SidebarExam[] | null;
  active?: InstructorNavKey;
}): NavSection[] {
  const sections: NavSection[] = [];
  if (course) {
    const base = `/courses/${course.id}`;
    sections.push({
      title: "Course",
      items: [
        {
          href: base,
          label: "Overview",
          icon: "exams",
          active: active === "exams",
          badge: course.reopenRequests || undefined,
        },
        { href: `${base}/stats`, label: "Stats", icon: "stats", active: active === "stats" },
        { href: `${base}/members`, label: "Members", icon: "members", active: active === "members" },
      ],
    });
    const list = examList(exam, exams);
    if (list.length) {
      sections.push({
        title: "Exams",
        items: list.map((e) => {
          const examBase = `${base}/exams/${e.id}`;
          const isCurrent = e.id === exam?.id;
          const graded = e.status === "OPEN" || e.status === "PUBLISHED";
          return {
            href: graded ? `${examBase}/report` : `${examBase}/setup`,
            label: e.name,
            icon: "setup",
            status: e.status,
            current: isCurrent,
            children: isCurrent
              ? [
                  { href: `${examBase}/setup`, label: "Setup", icon: "setup", active: active === "setup" },
                  {
                    href: `${examBase}/report`,
                    label: "Report",
                    icon: "pulse",
                    active: active === "report",
                    badge: exam?.flagged || undefined,
                  },
                ]
              : undefined,
          };
        }),
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

// Sidebar for a TA: their course, the exams they can grade, their courses.
export function taNav({
  course,
  exam,
  exams,
  active,
}: {
  course?: ShellCourse;
  exam?: ShellExam;
  exams?: SidebarExam[] | null;
  active?: TaNavKey;
}): NavSection[] {
  const sections: NavSection[] = [];
  if (course) {
    const base = `/courses/${course.id}`;
    sections.push({
      title: "Course",
      items: [{ href: base, label: "Overview", icon: "exams", active: active === "exams" }],
    });
    const list = examList(exam, exams);
    if (list.length) {
      sections.push({
        title: "Exams",
        items: list.map((e) => {
          const examBase = `${base}/exams/${e.id}`;
          const isCurrent = e.id === exam?.id;
          const canAdd = e.canAddPapers ?? e.status === "OPEN";
          return {
            href: `${examBase}/papers`,
            label: e.name,
            icon: "pencil",
            status: e.status,
            current: isCurrent,
            children: isCurrent
              ? [
                  { href: `${examBase}/papers`, label: "My papers", icon: "pencil", active: active === "my-papers" },
                  ...(canAdd
                    ? [{ href: `${examBase}/papers/new`, label: "Add paper", icon: "upload" as const, active: active === "add-paper" }]
                    : []),
                  { href: `${examBase}/stats`, label: "My stats", icon: "pulse", active: active === "my-stats" },
                ]
              : undefined,
          };
        }),
      });
    }
  }
  sections.push({
    title: "Workspace",
    items: [{ href: "/courses", label: "All courses", icon: "courses", active: active === "courses" }],
  });
  return sections;
}
