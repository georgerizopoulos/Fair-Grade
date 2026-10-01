"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { mockDeviation, mockResults, mockRubric } from "../../../mocks/dashboard";

export default function TaDetailPage() {
  const { taId } = useParams<{ taId: string }>();
  const [rubricId, setRubricId] = useState(mockRubric.id);
  useEffect(() => {
    setRubricId(new URLSearchParams(window.location.search).get("rubricId") ?? mockRubric.id);
  }, []);
  const summary = mockDeviation.taSummaries.find((ta) => ta.taId === taId);
  const results = mockResults.answers.filter((answer) => answer.criteria.some((item) => item.taGrades.some((grade) => grade.taId === taId)));

  if (!summary || rubricId !== mockRubric.id) {
    return <main className="mx-auto max-w-5xl px-6 py-10"><Link className="text-sm font-semibold text-slate-600 underline" href={`/dashboard?rubricId=${rubricId}`}>← Back to dashboard</Link><p className="mt-8 text-slate-600">TA details are not available.</p></main>;
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-8 px-6 py-10">
      <Link className="text-sm font-semibold text-slate-600 underline" href={`/dashboard?rubricId=${rubricId}`}>← Back to dashboard</Link>
      <header className="space-y-2"><p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">TA drill-down</p><h1 className="text-4xl font-semibold tracking-tight">{summary.taName}</h1><p className="text-slate-600">{summary.flaggedCriteriaCount} flagged criteria · {summary.answersGraded} answers graded</p></header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Criteria analysis</h2>
        {summary.criteria.map((item) => <article key={item.criterionId} className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-slate-500">Criterion {item.position}</p><h3 className="mt-1 font-semibold">{item.description}</h3></div><span className={`rounded-full px-3 py-1 text-sm font-semibold ${item.flagged ? "bg-red-100 text-red-800" : "bg-emerald-100 text-emerald-800"}`}>{item.flagged ? "Flagged" : "OK"}</span></div>
          <div className="mt-5 grid gap-4 text-sm sm:grid-cols-3"><p><span className="block text-slate-500">Max points</span><strong>{item.maxPoints}</strong></p><p><span className="block text-slate-500">Average gap</span><strong>{item.avgDeviation === null ? "No shared samples" : `${Math.abs(item.avgDeviation).toFixed(2)} points ${item.direction === "stricter" ? "stricter than" : item.direction === "lenient" ? "more lenient than" : "aligned with"} the AI`}</strong></p><p><span className="block text-slate-500">Sample size</span><strong>{item.sampleSize}</strong></p></div>
          {item.flagged && <div className="mt-6 space-y-4 border-t border-slate-100 pt-5"><h4 className="font-semibold">Flagged examples</h4>{item.examples.map((example) => <div key={example.answerId} className="rounded-lg bg-slate-50 p-4 text-sm"><p className="font-semibold">{example.studentIdAnon}</p><p className="mt-2 text-slate-700">{example.answerText}</p><p className="mt-3 font-medium">TA: {example.taPoints} · AI: {example.aiPoints}</p><p className="mt-2 text-slate-600">AI reasoning: {example.aiReasoning}</p></div>)}</div>}
        </article>)}
      </section>

      <section className="space-y-4"><h2 className="text-2xl font-semibold">All answers graded by {summary.taName}</h2>{!mockResults.aiGraded ? <p className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-amber-950">AI grading hasn&apos;t been run yet.</p> : <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white"><table className="w-full min-w-[720px] text-left text-sm"><thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-4 py-3">Student</th>{summary.criteria.map((item) => <th key={item.criterionId} className="px-4 py-3">C{item.position} AI / TA</th>)}</tr></thead><tbody>{results.map((answer) => <tr key={answer.answerId} className="border-b border-slate-100 last:border-0"><td className="px-4 py-3 font-semibold">{answer.studentIdAnon}</td>{answer.criteria.map((item) => { const taGrade = item.taGrades.find((grade) => grade.taId === taId); return <td key={item.criterionId} className="px-4 py-3">{item.aiGrade?.points ?? "—"} / {taGrade?.points ?? "—"}</td>; })}</tr>)}</tbody></table></div>}</section>
    </main>
  );
}
