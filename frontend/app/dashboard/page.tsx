"use client";

import Link from "next/link";
<<<<<<< HEAD
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { apiFetch } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

interface Rubric {
  id: string;
  courseName: string;
  questionText: string;
  aiGraded: boolean;
}
interface CriterionDeviation {
  criterionId: string;
  position: number;
  description: string;
  maxPoints: number;
  sampleSize: number;
  avgDeviation: number | null;
  direction: "stricter" | "lenient" | "aligned";
  flagged: boolean;
}
interface TaSummary {
  taId: string;
  taName: string;
  answersGraded: number;
  overallDeviation: number;
  flagged: boolean;
  flaggedCriteriaCount: number;
  criteria: CriterionDeviation[];
}
interface DeviationReport {
  rubricId: string;
  aiGraded: boolean;
  taSummaries: TaSummary[];
}

function DashboardInner() {
  const { user, loading: authLoading } = useRequireRole("instructor");
  const searchParams = useSearchParams();

  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [report, setReport] = useState<DeviationReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Load rubrics
  useEffect(() => {
    if (!user) return;
    apiFetch<{ rubrics: Rubric[] }>("/rubrics").then(({ rubrics: r }) => {
      setRubrics(r);
      const qp = searchParams.get("rubricId");
      if (qp && r.some((x) => x.id === qp)) setSelectedRubricId(qp);
      else if (r.length > 0) setSelectedRubricId(r[0].id);
    });
  }, [user, searchParams]);

  // Load deviation report
  useEffect(() => {
    if (!selectedRubricId) return;
    setLoadingReport(true);
    apiFetch<DeviationReport>(`/deviation/${selectedRubricId}`)
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoadingReport(false));
  }, [selectedRubricId]);

  if (authLoading || !user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Dashboard</h1>
        {rubrics.length > 1 && (
          <select
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={selectedRubricId ?? ""}
            onChange={(e) => setSelectedRubricId(e.target.value)}
          >
            {rubrics.map((r) => (
              <option key={r.id} value={r.id}>
                {r.courseName}
              </option>
            ))}
          </select>
        )}
      </div>

      {loadingReport && <p className="text-sm text-muted-foreground">Loading?</p>}

      {report && !report.aiGraded && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            AI grading has not been run yet.{" "}
            <Link href="/upload" className="underline">
              Go to Upload
            </Link>{" "}
            to run it.
          </CardContent>
        </Card>
      )}

      {report?.aiGraded && report.taSummaries.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No TA grades found for this rubric.
          </CardContent>
        </Card>
      )}

      {report?.aiGraded &&
        report.taSummaries.map((ta) => (
          <Link key={ta.taId} href={`/dashboard/${ta.taId}?rubricId=${selectedRubricId}`}>
            <Card className="transition-shadow hover:shadow-md cursor-pointer">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {ta.taName}
                    {ta.flagged && <Badge variant="destructive">Flagged</Badge>}
                  </CardTitle>
                  <div className="flex gap-2">
                    <Badge variant="outline">{ta.answersGraded} answers</Badge>
                    <Badge variant={ta.flagged ? "destructive" : "secondary"}>
                      Deviation: {ta.overallDeviation.toFixed(2)}
                    </Badge>
                    {ta.flaggedCriteriaCount > 0 && (
                      <Badge variant="destructive">
                        {ta.flaggedCriteriaCount} flagged criteria
                      </Badge>
                    )}
                  </div>
                </div>
                <CardDescription>Click to see details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {ta.criteria.map((c) => (
                    <div
                      key={c.criterionId}
                      className={`flex items-center justify-between rounded-md px-3 py-1.5 text-sm ${
                        c.flagged
                          ? "bg-destructive/10 text-destructive"
                          : "bg-muted/50"
                      }`}
                    >
                      <span>
                        C{c.position}: {c.description.slice(0, 50)}
                        {c.description.length > 50 ? "?" : ""}
                      </span>
                      <span className="flex items-center gap-2">
                        {c.avgDeviation !== null ? (
                          <>
                            <span className="font-mono">
                              {c.avgDeviation > 0 ? "+" : ""}
                              {c.avgDeviation.toFixed(2)}
                            </span>
                            <Badge
                              variant={c.flagged ? "destructive" : "outline"}
                              className="text-xs"
                            >
                              {c.direction}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground">?</span>
                        )}
                        {c.flagged && <span className="text-xs">?</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense>
      <DashboardInner />
    </Suspense>
=======
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
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
  );
}
