"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TopBar } from "@/components/top-bar";
import { apiFetch } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

interface RubricPoint {
  id?: string;
  text: string;
  points: number;
}

interface Question {
  id?: string;
  code: string;
  title: string;
  prompt: string;
  maxPoints: number;
  modelAnswer: string;
  rubric: RubricPoint[];
}

interface ExamDetail {
  id: string;
  name: string;
  heldAt: string | null;
  status: string;
  passMark: number;
  course: { id: string; code: string; name: string };
}

function newQuestion(index: number): Question {
  return {
    code: `Q${index}`,
    title: "",
    prompt: "",
    maxPoints: 0,
    modelAnswer: "",
    rubric: [{ text: "", points: 0 }],
  };
}

function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function SetupEditor() {
  const { user, loading: authLoading } = useRequireRole("instructor");
  const { courseId, examId } = useParams<{
    courseId: string;
    examId: string;
  }>();
  const router = useRouter();
  const [exam, setExam] = useState<ExamDetail | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [name, setName] = useState("");
  const [heldAt, setHeldAt] = useState("");
  const [passMark, setPassMark] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    async function load() {
      try {
        const [examData, questionData] = await Promise.all([
          apiFetch<ExamDetail>(`/exams/${examId}`),
          apiFetch<{ questions: Question[] }>(`/exams/${examId}/questions`),
        ]);
        if (cancelled) return;
        setExam(examData);
        setName(examData.name);
        setHeldAt(dateValue(examData.heldAt));
        setPassMark(String(examData.passMark));
        setQuestions(questionData.questions);
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Could not load exam");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [examId, user]);

  const invalidQuestions = questions.some((question) => {
    const total = question.rubric.reduce((sum, point) => sum + point.points, 0);
    return (
      !question.code.trim() ||
      !question.title.trim() ||
      !question.prompt.trim() ||
      !question.modelAnswer.trim() ||
      question.maxPoints <= 0 ||
      question.rubric.length === 0 ||
      question.rubric.some((point) => !point.text.trim() || point.points < 0) ||
      Math.abs(total - question.maxPoints) > 0.001
    );
  });

  function updateQuestion(index: number, patch: Partial<Question>) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === index ? { ...question, ...patch } : question,
      ),
    );
  }

  function updateRubric(
    questionIndex: number,
    rubricIndex: number,
    patch: Partial<RubricPoint>,
  ) {
    setQuestions((current) =>
      current.map((question, i) =>
        i === questionIndex
          ? {
              ...question,
              rubric: question.rubric.map((point, j) =>
                j === rubricIndex ? { ...point, ...patch } : point,
              ),
            }
          : question,
      ),
    );
  }

  function moveQuestion(index: number, direction: -1 | 1) {
    setQuestions((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function moveRubric(questionIndex: number, index: number, direction: -1 | 1) {
    setQuestions((current) =>
      current.map((question, i) => {
        if (i !== questionIndex) return question;
        const target = index + direction;
        if (target < 0 || target >= question.rubric.length) return question;
        const rubric = [...question.rubric];
        [rubric[index], rubric[target]] = [rubric[target], rubric[index]];
        return { ...question, rubric };
      }),
    );
  }

  async function save() {
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const examChanged =
        exam &&
        (name !== exam.name ||
          heldAt !== dateValue(exam.heldAt) ||
          Number(passMark) !== exam.passMark);
      if (examChanged) {
        await apiFetch(`/exams/${examId}`, {
          method: "PATCH",
          body: {
            name,
            ...(heldAt ? { heldAt } : {}),
            passMark: Number(passMark),
          },
        });
      }

      await apiFetch(`/exams/${examId}/questions`, {
        method: "PUT",
        body: {
          questions: questions.map(
            ({ code, title, prompt, maxPoints, modelAnswer, rubric }) => ({
              code,
              title,
              prompt,
              maxPoints,
              modelAnswer,
              rubric: rubric.map(({ text, points }) => ({ text, points })),
            }),
          ),
        },
      });

      setSuccess("Exam setup saved.");
      const [examData, questionData] = await Promise.all([
        apiFetch<ExamDetail>(`/exams/${examId}`),
        apiFetch<{ questions: Question[] }>(`/exams/${examId}/questions`),
      ]);
      setExam(examData);
      setQuestions(questionData.questions);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save exam setup");
    } finally {
      setSaving(false);
    }
  }

  if (authLoading || !user) return null;
  if (loading) {
    return <div className="px-6 py-12 text-sm text-muted-foreground">Loading exam...</div>;
  }

  return (
    <>
      <TopBar />
      <main className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Button variant="ghost" className="mb-3 px-0" onClick={() => router.push(`/courses/${courseId}`)}>
              Back to course
            </Button>
            <p className="text-sm text-muted-foreground">{exam?.course.code} - {exam?.course.name}</p>
            <h1 className="text-2xl font-semibold">Exam setup</h1>
          </div>
          <Button onClick={save} disabled={saving || invalidQuestions || !name.trim()}>
            {saving ? "Saving..." : "Save setup"}
          </Button>
        </div>

        {error && <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/5 px-4 py-3 text-sm text-destructive">{error}</div>}
        {success && <div role="status" className="rounded-lg border border-emerald-600/30 bg-emerald-600/5 px-4 py-3 text-sm text-emerald-700">{success}</div>}
        {!exam && !error && <p className="text-sm text-muted-foreground">Exam not found.</p>}

        {exam && (
          <Card>
            <CardHeader>
              <CardTitle>Exam details</CardTitle>
              <CardDescription>Set the exam name, date, and pass mark.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="exam-name">Name</Label>
                <Input id="exam-name" value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-date">Date</Label>
                <Input id="exam-date" type="date" value={heldAt} onChange={(event) => setHeldAt(event.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pass-mark">Pass mark</Label>
                <Input id="pass-mark" type="number" min="0" step="0.5" value={passMark} onChange={(event) => setPassMark(event.target.value)} />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">Questions and rubric</h2>
            <p className="text-sm text-muted-foreground">Rubric points must add up to each question's maximum.</p>
          </div>
          <Button variant="outline" onClick={() => setQuestions((current) => [...current, newQuestion(current.length + 1)])}>
            <Plus aria-hidden="true" /> Add question
          </Button>
        </div>

        {questions.length === 0 && (
          <Card>
            <CardContent className="py-10 text-center text-sm text-muted-foreground">
              No questions yet. Add a question to build this exam's rubric.
            </CardContent>
          </Card>
        )}

        {questions.map((question, questionIndex) => {
          const rubricTotal = question.rubric.reduce((sum, point) => sum + point.points, 0);
          const addsUp = Math.abs(rubricTotal - question.maxPoints) <= 0.001;

          return (
            <Card key={question.id ?? `${question.code}-${questionIndex}`}>
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div>
                  <CardTitle>{question.code || `Question ${questionIndex + 1}`}</CardTitle>
                  <CardDescription>Question {questionIndex + 1} of {questions.length}</CardDescription>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" aria-label="Move question up" title="Move up" disabled={questionIndex === 0} onClick={() => moveQuestion(questionIndex, -1)}><ChevronUp aria-hidden="true" /></Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Move question down" title="Move down" disabled={questionIndex === questions.length - 1} onClick={() => moveQuestion(questionIndex, 1)}><ChevronDown aria-hidden="true" /></Button>
                  <Button variant="ghost" size="icon-sm" aria-label="Remove question" title="Remove question" onClick={() => setQuestions((current) => current.filter((_, i) => i !== questionIndex))}><Trash2 aria-hidden="true" /></Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-[110px_1fr_130px]">
                  <div className="space-y-2">
                    <Label>Code</Label>
                    <Input value={question.code} onChange={(event) => updateQuestion(questionIndex, { code: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={question.title} onChange={(event) => updateQuestion(questionIndex, { title: event.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Maximum points</Label>
                    <Input type="number" min="0" step="0.5" value={question.maxPoints} onChange={(event) => updateQuestion(questionIndex, { maxPoints: Number(event.target.value) })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Question prompt</Label>
                  <Textarea value={question.prompt} onChange={(event) => updateQuestion(questionIndex, { prompt: event.target.value })} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Model answer</Label>
                  <Textarea value={question.modelAnswer} onChange={(event) => updateQuestion(questionIndex, { modelAnswer: event.target.value })} rows={3} />
                </div>

                <section className="space-y-3 border-t pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold">Rubric points</h3>
                    <p className={`text-sm font-medium ${addsUp ? "text-emerald-700" : "text-destructive"}`}>
                      Adds up to {rubricTotal} / {question.maxPoints} points {addsUp ? "OK" : "- adjust rubric"}
                    </p>
                  </div>
                  {question.rubric.map((point, rubricIndex) => (
                    <div key={point.id ?? rubricIndex} className="grid items-center gap-2 sm:grid-cols-[1fr_120px_auto]">
                      <Input aria-label={`Rubric point ${rubricIndex + 1} description`} value={point.text} placeholder="Describe what earns these points" onChange={(event) => updateRubric(questionIndex, rubricIndex, { text: event.target.value })} />
                      <Input aria-label={`Rubric point ${rubricIndex + 1} score`} type="number" min="0" step="0.5" value={point.points} onChange={(event) => updateRubric(questionIndex, rubricIndex, { points: Number(event.target.value) })} />
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" aria-label="Move rubric point up" title="Move up" disabled={rubricIndex === 0} onClick={() => moveRubric(questionIndex, rubricIndex, -1)}><ChevronUp aria-hidden="true" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Move rubric point down" title="Move down" disabled={rubricIndex === question.rubric.length - 1} onClick={() => moveRubric(questionIndex, rubricIndex, 1)}><ChevronDown aria-hidden="true" /></Button>
                        <Button variant="ghost" size="icon-sm" aria-label="Remove rubric point" title="Remove rubric point" disabled={question.rubric.length === 1} onClick={() => updateQuestion(questionIndex, { rubric: question.rubric.filter((_, i) => i !== rubricIndex) })}><Trash2 aria-hidden="true" /></Button>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={() => updateQuestion(questionIndex, { rubric: [...question.rubric, { text: "", points: 0 }] })}>
                    <Plus aria-hidden="true" /> Add rubric point
                  </Button>
                </section>
              </CardContent>
            </Card>
          );
        })}

        <div className="flex justify-end">
          <Button onClick={save} disabled={saving || invalidQuestions || !name.trim()}>
            {saving ? "Saving..." : "Save setup"}
          </Button>
        </div>
      </main>
    </>
  );
}