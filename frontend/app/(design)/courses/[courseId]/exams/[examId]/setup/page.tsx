import type { Metadata } from "next";
import { SetupEditor } from "./setup-editor";

export const metadata: Metadata = { title: "Exam setup · Fair Grade" };

export default function ExamSetupPage() {
  return <SetupEditor />;
}
