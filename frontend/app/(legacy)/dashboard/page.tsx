"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
  const router = useRouter();
  const searchParams = useSearchParams();

  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [report, setReport] = useState<DeviationReport | null>(null);
  const [loadingReport, setLoadingReport] = useState(false);

  // Load rubrics; default: newest with aiGraded, else newest (#7 is newest-first)
  useEffect(() => {
    if (!user) return;
    apiFetch<{ rubrics: Rubric[] }>("/rubrics").then(({ rubrics: r }) => {
      setRubrics(r);
      const qp = searchParams.get("rubricId");
      if (qp && r.some((x) => x.id === qp)) setSelectedRubricId(qp);
      else setSelectedRubricId(r.find((x) => x.aiGraded)?.id ?? r[0]?.id ?? null);
    });
  }, [user, searchParams]);

  // Keep rubricId in the URL so refreshing keeps the same view.
  function pickRubric(id: string) {
    setSelectedRubricId(id);
    router.replace(`/dashboard?rubricId=${id}`);
  }

  // Load deviation report
  useEffect(() => {
    if (!selectedRubricId) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legacy page, frozen, deleted in the final pass (DOCS/TASKS.md)
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
        {rubrics.length > 0 && (
          <select
            className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm"
            value={selectedRubricId ?? ""}
            onChange={(e) => pickRubric(e.target.value)}
          >
            {rubrics.map((r) => (
              <option key={r.id} value={r.id}>
                {r.courseName} — {r.questionText.slice(0, 50)}
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
  );
}
