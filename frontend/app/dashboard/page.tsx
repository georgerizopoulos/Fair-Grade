"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mockDeviation, mockRubric } from "../../mocks/dashboard";

export default function DashboardPage() {
  const [rubricId, setRubricId] = useState(mockRubric.id);
  useEffect(() => {
    setRubricId(new URLSearchParams(window.location.search).get("rubricId") ?? mockRubric.id);
  }, []);
  const report = mockDeviation.rubricId === rubricId ? mockDeviation : { ...mockDeviation, aiGraded: false, taSummaries: [] };

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10">
      <header className="space-y-2">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Fair-Grade / Dashboard</p>
        <h1 className="text-4xl font-semibold tracking-tight">TA consistency</h1>
        <p className="max-w-2xl text-slate-600">{mockRubric.courseName} · {mockRubric.questionText}</p>
      </header>

      {!report.aiGraded ? (
        <section className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <h2 className="text-xl font-semibold text-amber-950">AI grading hasn&apos;t been run yet</h2>
          <Link className="mt-3 inline-block font-medium text-amber-800 underline" href="/upload">Go to upload</Link>
        </section>
      ) : report.taSummaries.length === 0 ? (
        <section className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">No TA grades uploaded yet.</section>
      ) : (
        <section className="space-y-3">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-slate-200 px-5 pb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <span>Teaching assistant</span><span>Answers graded</span><span>Overall deviation</span><span>Status</span>
          </div>
          {report.taSummaries.map((ta) => (
            <Link key={ta.taId} href={`/dashboard/${ta.taId}?rubricId=${rubricId}`} className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 transition hover:border-slate-400">
              <div><p className="font-semibold">{ta.taName}</p><p className="text-sm text-slate-500">{ta.flaggedCriteriaCount} flagged criteria</p></div>
              <span className="text-slate-700">{ta.answersGraded}</span>
              <span className="font-mono text-slate-700">{ta.overallDeviation.toFixed(2)}</span>
              <span className={`rounded-full px-3 py-1 text-sm font-semibold ${ta.flagged ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>{ta.flagged ? "Flagged" : "OK"}</span>
            </Link>
          ))}
        </section>
      )}
    </main>
  );
}
