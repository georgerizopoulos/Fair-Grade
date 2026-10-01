"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

interface CriterionDev {
  criterionId: string;
  position: number;
  description: string;
  maxPoints: number;
  sampleSize: number;
  avgDeviation: number | null;
  direction: string;
  flagged: boolean;
  examples: {
    answerId: string;
    studentIdAnon: string;
    answerText: string;
    taPoints: number;
    aiPoints: number;
    deviation: number;
    aiReasoning: string;
  }[];
}
interface TaSummary {
  taId: string;
  taName: string;
  answersGraded: number;
  overallDeviation: number;
  flagged: boolean;
  flaggedCriteriaCount: number;
  criteria: CriterionDev[];
}

interface AnswerCrit {
  criterionId: string;
  position: number;
  description: string;
  maxPoints: number;
  aiGrade: { points: number; reasoning: string } | null;
  taGrades: { taId: string; taName: string; points: number }[];
}
interface Answer {
  answerId: string;
  studentIdAnon: string;
  answerText: string;
  criteria: AnswerCrit[];
}
interface GradeResults {
  rubricId: string;
  aiGraded: boolean;
  answers: Answer[];
}

function TaDetailInner() {
  const { user, loading: authLoading } = useRequireRole("instructor");
  const params = useParams<{ taId: string }>();
  const searchParams = useSearchParams();
  const rubricId = searchParams.get("rubricId") ?? "";
  const taId = params.taId;

  const [taSummary, setTaSummary] = useState<TaSummary | null>(null);
  const [results, setResults] = useState<GradeResults | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !rubricId) return;

    Promise.all([
      apiFetch<{ taSummaries: TaSummary[] }>(`/deviation/${rubricId}`),
      apiFetch<GradeResults>(`/grade/results/${rubricId}?taId=${taId}`),
    ])
      .then(([dev, res]) => {
        const ta = dev.taSummaries.find((t) => t.taId === taId) ?? null;
        setTaSummary(ta);
        setResults(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user, rubricId, taId]);

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center gap-3">
        <Link href={`/dashboard?rubricId=${rubricId}`}>
          <Button variant="ghost" size="sm">? Back</Button>
        </Link>
        <h1 className="text-lg font-semibold">
          {taSummary?.taName ?? "TA Detail"}
        </h1>
        {taSummary?.flagged && <Badge variant="destructive">Flagged</Badge>}
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading?</p>}

      {/* Deviation summary per criterion */}
      {taSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Deviation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 pb-3 text-sm text-muted-foreground">
              <span>Answers graded: {taSummary.answersGraded}</span>
              <span>Overall deviation: {taSummary.overallDeviation.toFixed(2)}</span>
              <span>Flagged criteria: {taSummary.flaggedCriteriaCount}</span>
            </div>
            <div className="space-y-3">
              {taSummary.criteria.map((c) => (
                <div key={c.criterionId}>
                  <div
                    className={`flex items-center justify-between rounded-md px-3 py-2 text-sm ${
                      c.flagged ? "bg-destructive/10" : "bg-muted/50"
                    }`}
                  >
                    <span className="flex-1">
                      <strong>C{c.position}:</strong> {c.description}
                    </span>
                    <span className="flex items-center gap-2 text-right">
                      {c.avgDeviation !== null ? (
                        <>
                          <span className="font-mono">
                            {c.avgDeviation > 0 ? "+" : ""}
                            {c.avgDeviation.toFixed(2)}
                          </span>
                          <Badge variant={c.flagged ? "destructive" : "outline"} className="text-xs">
                            {c.direction}
                          </Badge>
                        </>
                      ) : (
                        "?"
                      )}
                    </span>
                  </div>

                  {/* Flagged examples */}
                  {c.flagged && c.examples.length > 0 && (
                    <div className="ml-4 mt-2 space-y-2">
                      {c.examples.map((ex) => (
                        <div key={ex.answerId} className="rounded border p-3 text-sm">
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{ex.studentIdAnon}</span>
                            <span>
                              TA: {ex.taPoints} | AI: {ex.aiPoints} |{" "}
                              <span className={ex.deviation < 0 ? "text-destructive" : "text-orange-600"}>
                                � {ex.deviation > 0 ? "+" : ""}{ex.deviation}
                              </span>
                            </span>
                          </div>
                          <p className="mt-1 text-muted-foreground">{ex.answerText.slice(0, 200)}{ex.answerText.length > 200 ? "?" : ""}</p>
                          <p className="mt-1 italic text-muted-foreground">AI: {ex.aiReasoning}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full answer table */}
      {results && results.answers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {results.answers.map((a) => (
              <div key={a.answerId} className="rounded border p-3">
                <p className="text-sm font-medium">{a.studentIdAnon}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {a.answerText.slice(0, 300)}{a.answerText.length > 300 ? "?" : ""}
                </p>
                <div className="mt-2 grid gap-1">
                  {a.criteria.map((c) => (
                    <div key={c.criterionId} className="flex items-center gap-3 text-xs">
                      <span className="w-8 font-medium">C{c.position}</span>
                      <span className="w-16">
                        AI: {c.aiGrade?.points ?? "?"}
                      </span>
                      <span className="w-24">
                        TA: {c.taGrades[0]?.points ?? "?"}
                      </span>
                      {c.aiGrade && c.taGrades[0] && (
                        <span
                          className={
                            Math.abs(c.taGrades[0].points - c.aiGrade.points) > 0.5
                              ? "text-destructive"
                              : "text-muted-foreground"
                          }
                        >
                          � {(c.taGrades[0].points - c.aiGrade.points).toFixed(1)}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function TaDetailPage() {
  return (
    <Suspense>
      <TaDetailInner />
    </Suspense>
=======
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
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
  );
}
