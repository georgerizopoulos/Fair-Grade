import type { Metadata } from "next";
import { ExamReportLivePage } from "./report-page";

export const metadata: Metadata = { title: "Exam report · Fair Grade" };

export default function ExamReportPage() {
  return <ExamReportLivePage />;
}
