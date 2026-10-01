"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { apiFetch } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

interface Rubric {
  id: string;
  courseName: string;
  questionText: string;
  criteriaCount: number;
  totalPoints: number;
}
interface Criterion {
  id: string;
  position: number;
  description: string;
  maxPoints: number;
}
interface RubricDetail extends Rubric {
  criteria: Criterion[];
}
interface Answer {
  id: string;
  studentIdAnon: string;
  answerText: string;
}
interface ExistingGrade {
  answerId: string;
  criterionId: string;
  pointsGiven: number;
}

export default function TaGradingPage() {
  const { user, loading: authLoading } = useRequireRole("ta");

  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [rubricDetail, setRubricDetail] = useState<RubricDetail | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [grades, setGrades] = useState<Record<string, number>>({});
  // Answer ids with every criterion saved on the server.
  const [savedAnswers, setSavedAnswers] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);

  // Load rubrics
  useEffect(() => {
    if (!user) return;
    apiFetch<{ rubrics: Rubric[] }>("/rubrics")
      .then(({ rubrics: r }) => {
        setRubrics(r);
        if (r.length > 0) setSelectedRubricId(r[0].id);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load rubrics"));
  }, [user]);

  // Load rubric detail + answers + existing grades
  useEffect(() => {
    if (!selectedRubricId) return;

    Promise.all([
      apiFetch<RubricDetail>(`/rubrics/${selectedRubricId}`),
      apiFetch<{ answers: Answer[] }>(`/answers?rubricId=${selectedRubricId}`),
      apiFetch<{ grades: ExistingGrade[] }>(
        `/ta-grades?rubricId=${selectedRubricId}`,
      ),
    ])
      .then(([detail, ans, existing]) => {
        setRubricDetail(detail);
        setAnswers(ans.answers);
        // Pre-fill existing grades
        const map: Record<string, number> = {};
        const perAnswer = new Map<string, number>();
        for (const g of existing.grades) {
          map[`${g.answerId}:${g.criterionId}`] = g.pointsGiven;
          perAnswer.set(g.answerId, (perAnswer.get(g.answerId) ?? 0) + 1);
        }
        setGrades(map);
        setSavedAnswers(
          new Set(
            [...perAnswer]
              .filter(([, n]) => n >= detail.criteria.length)
              .map(([id]) => id),
          ),
        );
        setCurrentIdx(0);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load grading data"));
  }, [selectedRubricId]);

  function getGrade(answerId: string, criterionId: string): string {
    const key = `${answerId}:${criterionId}`;
    return key in grades ? String(grades[key]) : "";
  }

  function setGrade(answerId: string, criterionId: string, val: string) {
    const key = `${answerId}:${criterionId}`;
    const num = parseFloat(val);
    setGrades((prev) => ({
      ...prev,
      [key]: isNaN(num) ? 0 : num,
    }));
  }

  // Save one answer: all its criteria, no taId (the backend uses the token).
  async function saveAnswer(answerId: string) {
    if (!rubricDetail) return;
    setError("");
    setSuccess("");

    const gradesList = rubricDetail.criteria.map((c) => ({
      answerId,
      criterionId: c.id,
      pointsGiven: grades[`${answerId}:${c.id}`] ?? 0,
    }));
    const bad = rubricDetail.criteria.find((c) => {
      const pts = grades[`${answerId}:${c.id}`];
      return pts !== undefined && (pts < 0 || pts > c.maxPoints);
    });
    if (bad) {
      setError(`C${bad.position} must be between 0 and ${bad.maxPoints}`);
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/ta-grades/bulk", {
        method: "POST",
        body: { grades: gradesList },
      });
      setSavedAnswers((prev) => new Set(prev).add(answerId));
      setSuccess("Saved");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !user) return null;

  const criteria = rubricDetail?.criteria.sort(
    (a, b) => a.position - b.position,
  ) ?? [];
  const currentAnswer = answers[currentIdx];

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Grade Answers</h1>
        {answers.length > 0 && (
          <Badge variant="outline">
            Graded {savedAnswers.size} of {answers.length}
          </Badge>
        )}
      </div>

      {/* Messages */}
      {error && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-green-500/50 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">{success}</div>}

      {/* Rubric picker */}
      {rubrics.length > 0 && (
        <select
          className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
          value={selectedRubricId ?? ""}
          onChange={(e) => setSelectedRubricId(e.target.value)}
        >
          {rubrics.map((r) => (
            <option key={r.id} value={r.id}>
              {r.courseName} — {r.questionText.slice(0, 60)}
            </option>
          ))}
        </select>
      )}

      {answers.length === 0 && (
        <p className="text-sm text-muted-foreground">No answers to grade.</p>
      )}

      {/* Navigation */}
      {answers.length > 0 && (
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(currentIdx - 1)}
          >
            ← Prev
          </Button>
          <span className="text-sm text-muted-foreground">
            {currentIdx + 1} / {answers.length}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={currentIdx === answers.length - 1}
            onClick={() => setCurrentIdx(currentIdx + 1)}
          >
            Next →
          </Button>
          <Badge variant="outline">{currentAnswer?.studentIdAnon}</Badge>
          {currentAnswer && savedAnswers.has(currentAnswer.id) && (
            <Badge variant="secondary">Saved</Badge>
          )}
        </div>
      )}

      {/* Current answer + grading */}
      {currentAnswer && (
        <Card>
          <CardHeader>
            <CardTitle>{currentAnswer.studentIdAnon}</CardTitle>
            <CardDescription>Read the answer, then score each criterion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap">
              {currentAnswer.answerText}
            </div>

            <div className="space-y-3">
              {criteria.map((c) => (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="flex-1 text-sm">
                    <span className="font-medium">C{c.position}:</span>{" "}
                    {c.description}
                    <span className="ml-1 text-muted-foreground">(max {c.maxPoints})</span>
                  </div>
                  <Input
                    className="w-20 text-center"
                    type="number"
                    step="0.5"
                    min="0"
                    max={c.maxPoints}
                    value={getGrade(currentAnswer.id, c.id)}
                    onChange={(e) => setGrade(currentAnswer.id, c.id, e.target.value)}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>

            <Button onClick={() => saveAnswer(currentAnswer.id)} disabled={saving}>
              {saving
                ? "Saving…"
                : savedAnswers.has(currentAnswer.id)
                  ? "Saved ✓ (save again)"
                  : "Save"}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
