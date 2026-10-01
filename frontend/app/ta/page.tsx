"use client";

import { useState } from "react";
import { mockRubric } from "../../mocks/dashboard";

const criteria = [
  { id: "criterion-uuid-1", description: "Names SYN, SYN-ACK, and ACK in order", maxPoints: 3 },
  { id: "criterion-uuid-2", description: "Explains sequence numbers", maxPoints: 3 },
  { id: "criterion-uuid-3", description: "Explains why the handshake is needed", maxPoints: 2 },
  { id: "criterion-uuid-4", description: "Answer is clearly organized", maxPoints: 2 },
];

const answers = [
  { id: "answer-uuid-4", student: "student_004", text: "SYN, then SYN-ACK, then ACK. Sequence numbers let both sides track bytes..." },
  { id: "answer-uuid-9", student: "student_009", text: "First the client sends SYN. The server answers SYN-ACK..." },
];

export default function TaGradingPage() {
  const [grades, setGrades] = useState<Record<string, Record<string, string>>>({
    "answer-uuid-4": { "criterion-uuid-1": "3", "criterion-uuid-2": "2" },
    "answer-uuid-9": { "criterion-uuid-1": "3", "criterion-uuid-2": "3", "criterion-uuid-3": "2" },
  });
  const [saved, setSaved] = useState<string[]>([]);
  const gradedAnswers = Object.values(grades).filter((answer) => Object.keys(answer).length === criteria.length).length;

  const updateGrade = (answerId: string, criterionId: string, value: string) => {
    setGrades((current) => ({ ...current, [answerId]: { ...current[answerId], [criterionId]: value } }));
    setSaved((current) => current.filter((id) => id !== answerId));
  };

  return (
    <main className="mx-auto w-full max-w-5xl space-y-8 px-6 py-10">
      <header className="space-y-2"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Fair-Grade / TA workspace</p><h1 className="text-4xl font-semibold tracking-tight">Grade answers</h1><p className="text-slate-600">{mockRubric.courseName} · Graded {gradedAnswers} of {answers.length}.</p></header>
      <section className="space-y-5">{answers.map((answer) => <article key={answer.id} className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">{answer.student}</p><p className="mt-3 max-w-3xl text-slate-800">{answer.text}</p></div><button type="button" onClick={() => setSaved((current) => current.includes(answer.id) ? current : [...current, answer.id])} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700">Save</button></div><div className="mt-6 grid gap-4 sm:grid-cols-2">{criteria.map((item) => <label key={item.id} className="space-y-2 text-sm"><span className="block font-medium">{item.description} <span className="text-slate-500">(max {item.maxPoints})</span></span><input className="w-full rounded-lg border border-slate-300 px-3 py-2" type="number" min="0" max={item.maxPoints} step="0.5" value={grades[answer.id]?.[item.id] ?? ""} onChange={(event) => updateGrade(answer.id, item.id, event.target.value)} /></label>)}</div>{saved.includes(answer.id) && <p className="mt-4 text-sm font-semibold text-emerald-700">Saved</p>}</article>)}</section>
    </main>
  );
}
