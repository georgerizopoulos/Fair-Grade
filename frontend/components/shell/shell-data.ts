"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

// Data the sidebar needs on every page: the course's exams and the user's
// courses. The last answer is kept in memory so the sidebar renders at once
// when you move between pages, and it is refreshed in the background.

export type ExamStatus = "DRAFT" | "QUESTIONS_READY" | "OPEN" | "PUBLISHED";

export interface SidebarExam {
  id: string;
  name: string;
  status: ExamStatus;
  canAddPapers?: boolean;
}

export interface SidebarCourse {
  id: string;
  code: string | null;
  name: string;
  semester?: string | null;
}

const examsMemory = new Map<string, SidebarExam[]>();
let coursesMemory: SidebarCourse[] | null = null;

export function useCourseExams(courseId?: string) {
  const [exams, setExams] = useState<SidebarExam[] | null>(() =>
    courseId ? (examsMemory.get(courseId) ?? null) : null,
  );
  useEffect(() => {
    if (!courseId) return;
    let cancelled = false;
    apiFetch<{ exams: SidebarExam[] }>(`/courses/${courseId}`)
      .then(({ exams: loaded }) => {
        const list = loaded.map(({ id, name, status, canAddPapers }) => ({ id, name, status, canAddPapers }));
        examsMemory.set(courseId, list);
        if (!cancelled) setExams(list);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [courseId]);
  return courseId ? (exams ?? examsMemory.get(courseId) ?? null) : null;
}

// Loaded when the course switcher opens.
export function useMyCourses(enabled: boolean) {
  const [courses, setCourses] = useState<SidebarCourse[] | null>(coursesMemory);
  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    apiFetch<{ courses: SidebarCourse[] }>("/courses")
      .then(({ courses: loaded }) => {
        coursesMemory = loaded;
        if (!cancelled) setCourses(loaded);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [enabled]);
  return courses;
}
