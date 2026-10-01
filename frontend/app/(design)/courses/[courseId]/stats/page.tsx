import type { Metadata } from "next";
import { CourseStatsLivePage } from "./course-stats-page";

export const metadata: Metadata = { title: "Course stats · Fair Grade" };

export default function CourseStatsPage() {
  return <CourseStatsLivePage />;
}
