"use client";

<<<<<<< HEAD
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
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentIdx, setCurrentIdx] = useState(0);

  // Load rubrics
  useEffect(() => {
    if (!user) return;
    apiFetch<{ rubrics: Rubric[] }>("/rubrics").then(({ rubrics: r }) => {
      setRubrics(r);
      if (r.length > 0) setSelectedRubricId(r[0].id);
    });
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
    ]).then(([detail, ans, existing]) => {
      setRubricDetail(detail);
      setAnswers(ans.answers);
      // Pre-fill existing grades
      const map: Record<string, number> = {};
      for (const g of existing.grades) {
        map[`${g.answerId}:${g.criterionId}`] = g.pointsGiven;
      }
      setGrades(map);
      setCurrentIdx(0);
    });
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

  async function handleSave() {
    if (!rubricDetail) return;
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const gradesList: { answerId: string; criterionId: string; pointsGiven: number }[] = [];
      for (const [key, pts] of Object.entries(grades)) {
        const [answerId, criterionId] = key.split(":");
        gradesList.push({ answerId, criterionId, pointsGiven: pts });
      }

      if (gradesList.length === 0) {
        setError("No grades to save");
        setSaving(false);
        return;
      }

      const result = await apiFetch<{ saved: number }>("/ta-grades/bulk", {
        method: "POST",
        body: { grades: gradesList },
      });
      setSuccess(`Saved ${result.saved} grades`);
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
      <h1 className="text-lg font-semibold">Grade Answers</h1>

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
              {r.courseName} ? {r.questionText.slice(0, 60)}
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
            ? Prev
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
            Next ?
          </Button>
          <Badge variant="outline">{currentAnswer?.studentIdAnon}</Badge>
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
                    placeholder="?"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save */}
      <Button onClick={handleSave} disabled={saving || Object.keys(grades).length === 0}>
        {saving ? "Saving?" : "Save All Grades"}
      </Button>
    </div>
=======
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
>>>>>>> 27f6e5c1f0c5b4209d3047028129632c7a825fff
  );
}
