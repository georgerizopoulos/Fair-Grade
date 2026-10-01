"use client";

import Link from "next/link";
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
                                Ä {ex.deviation > 0 ? "+" : ""}{ex.deviation}
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
                          Ä {(c.taGrades[0].points - c.aiGrade.points).toFixed(1)}
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
  );
}
