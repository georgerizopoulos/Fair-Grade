"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { apiFetch, ApiError } from "@/lib/api";
import { useRequireRole } from "@/lib/auth";

/* ?? types ?? */
interface Criterion {
  id?: string;
  position?: number;
  description: string;
  maxPoints: number;
}
interface Rubric {
  id: string;
  courseName: string;
  questionText: string;
  criteriaCount: number;
  totalPoints: number;
  answersCount: number;
  aiGraded: boolean;
}
interface RubricDetail extends Rubric {
  criteria: Criterion[];
}
interface TaUser {
  id: string;
  name: string;
  email: string;
}

/* ?? inner component (uses useSearchParams) ?? */
function UploadInner() {
  const { user, loading: authLoading } = useRequireRole("instructor");
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [selectedRubricId, setSelectedRubricId] = useState<string | null>(null);
  const [rubricDetail, setRubricDetail] = useState<RubricDetail | null>(null);
  const [tas, setTas] = useState<TaUser[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Step 1: Create Rubric
  const [courseName, setCourseName] = useState("");
  const [questionText, setQuestionText] = useState("");
  const [criteria, setCriteria] = useState<Criterion[]>([
    { description: "", maxPoints: 0 },
  ]);
  const [creatingRubric, setCreatingRubric] = useState(false);

  // Step 2: Answers
  const [answersCsv, setAnswersCsv] = useState("");
  const [uploadingAnswers, setUploadingAnswers] = useState(false);

  // Step 3: TA Grades
  const [selectedTaId, setSelectedTaId] = useState("");
  const [gradesCsv, setGradesCsv] = useState("");
  const [uploadingGrades, setUploadingGrades] = useState(false);

  // Step 4: AI Grading
  const [runningAi, setRunningAi] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);

  // Load rubrics and TAs
  const loadRubrics = useCallback(async () => {
    try {
      const { rubrics: r } = await apiFetch<{ rubrics: Rubric[] }>("/rubrics");
      setRubrics(r);
      const qp = searchParams.get("rubricId");
      if (qp && r.some((x) => x.id === qp)) setSelectedRubricId(qp);
      else if (r.length > 0 && !selectedRubricId) setSelectedRubricId(r[0].id);
    } catch {}
  }, [searchParams, selectedRubricId]);

  useEffect(() => {
    if (!user) return;
    loadRubrics();
    apiFetch<{ users: TaUser[] }>("/users?role=ta")
      .then(({ users }) => setTas(users))
      .catch(() => {});
  }, [user, loadRubrics]);

  // Load rubric detail when selection changes
  useEffect(() => {
    if (!selectedRubricId) return;
    apiFetch<RubricDetail>(`/rubrics/${selectedRubricId}`)
      .then(setRubricDetail)
      .catch(() => {});
  }, [selectedRubricId]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  // ?? Step 1: Create Rubric ??
  async function handleCreateRubric() {
    clearMessages();
    setCreatingRubric(true);
    try {
      const created = await apiFetch<RubricDetail>("/rubrics", {
        method: "POST",
        body: {
          courseName,
          questionText,
          criteria: criteria.map((c) => ({
            description: c.description,
            maxPoints: c.maxPoints,
          })),
        },
      });
      setSuccess("Rubric created");
      setSelectedRubricId(created.id);
      await loadRubrics();
      setCourseName("");
      setQuestionText("");
      setCriteria([{ description: "", maxPoints: 0 }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create rubric");
    } finally {
      setCreatingRubric(false);
    }
  }

  // ?? Step 2: Upload Answers ??
  async function handleUploadAnswers() {
    if (!selectedRubricId) return;
    clearMessages();
    setUploadingAnswers(true);
    try {
      const lines = answersCsv.trim().split("\n");
      const answers = lines
        .filter((l) => l.trim())
        .map((line) => {
          const idx = line.indexOf(",");
          if (idx === -1) throw new Error(`Bad CSV line: ${line}`);
          return {
            studentIdAnon: line.substring(0, idx).trim(),
            answerText: line.substring(idx + 1).trim(),
          };
        });
      const result = await apiFetch<{ created: unknown[] }>("/answers/bulk", {
        method: "POST",
        body: { rubricId: selectedRubricId, answers },
      });
      setSuccess(`Uploaded ${result.created.length} answers`);
      setAnswersCsv("");
      await loadRubrics();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload answers");
    } finally {
      setUploadingAnswers(false);
    }
  }

  // ?? Step 3: Upload TA Grades ??
  async function handleUploadGrades() {
    if (!selectedRubricId || !selectedTaId || !rubricDetail) return;
    clearMessages();
    setUploadingGrades(true);
    try {
      // Load answers to map studentIdAnon ? answerId
      const { answers } = await apiFetch<{
        answers: { id: string; studentIdAnon: string }[];
      }>(`/answers?rubricId=${selectedRubricId}`);
      const answerMap = new Map(answers.map((a) => [a.studentIdAnon, a.id]));

      const criteriaList = rubricDetail.criteria.sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0),
      );

      const lines = gradesCsv.trim().split("\n");
      const grades: { answerId: string; criterionId: string; pointsGiven: number }[] = [];

      for (const line of lines) {
        if (!line.trim()) continue;
        const parts = line.split(",").map((s) => s.trim());
        const studentId = parts[0];
        const answerId = answerMap.get(studentId);
        if (!answerId) throw new Error(`Unknown student: ${studentId}`);

        for (let i = 1; i < parts.length && i - 1 < criteriaList.length; i++) {
          const pts = parseFloat(parts[i]);
          if (isNaN(pts)) throw new Error(`Invalid score at column ${i} for ${studentId}`);
          grades.push({
            answerId,
            criterionId: criteriaList[i - 1].id!,
            pointsGiven: pts,
          });
        }
      }

      const result = await apiFetch<{ saved: number }>("/ta-grades/bulk", {
        method: "POST",
        body: { taId: selectedTaId, grades },
      });
      setSuccess(`Saved ${result.saved} grades`);
      setGradesCsv("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload grades");
    } finally {
      setUploadingGrades(false);
    }
  }

  // ?? Step 4: Run AI Grading ??
  async function handleRunAi() {
    if (!selectedRubricId) return;
    clearMessages();
    setRunningAi(true);
    setAiResult(null);
    try {
      const result = await apiFetch<{
        answersGraded: number;
        answersTotal: number;
        failedAnswers: { studentIdAnon: string }[];
      }>("/grade/run", {
        method: "POST",
        body: { rubricId: selectedRubricId },
      });
      setAiResult(
        `Graded ${result.answersGraded} of ${result.answersTotal} answers` +
          (result.failedAnswers.length > 0
            ? ` (${result.failedAnswers.length} failed)`
            : ""),
      );
      await loadRubrics();
      setTimeout(() => router.push(`/dashboard?rubricId=${selectedRubricId}`), 1500);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "AI grading failed");
    } finally {
      setRunningAi(false);
    }
  }

  if (authLoading || !user) return null;

  const selectedRubric = rubrics.find((r) => r.id === selectedRubricId);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4">
      <h1 className="text-lg font-semibold">Upload</h1>

      {/* Messages */}
      {error && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}
      {success && <div className="rounded-md border border-green-500/50 bg-green-50 p-3 text-sm text-green-700 dark:bg-green-950/20 dark:text-green-400">{success}</div>}

      {/* Rubric picker */}
      {rubrics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Rubric</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
            {selectedRubric && (
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary">{selectedRubric.criteriaCount} criteria</Badge>
                <Badge variant="secondary">{selectedRubric.totalPoints} pts</Badge>
                <Badge variant="secondary">{selectedRubric.answersCount} answers</Badge>
                <Badge variant={selectedRubric.aiGraded ? "default" : "outline"}>
                  {selectedRubric.aiGraded ? "AI graded" : "Not AI graded"}
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 1: Create Rubric */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1 ? Create Rubric</CardTitle>
          <CardDescription>Course, question, and grading criteria</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <Label>Course name</Label>
            <Input value={courseName} onChange={(e) => setCourseName(e.target.value)} placeholder="HY335 - Computer Networks" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Question</Label>
            <Textarea value={questionText} onChange={(e) => setQuestionText(e.target.value)} placeholder="Explain how the TCP three-way handshake works." />
          </div>
          <div className="space-y-2">
            <Label>Criteria</Label>
            {criteria.map((c, i) => (
              <div key={i} className="flex gap-2">
                <Input
                  className="flex-1"
                  placeholder="Description"
                  value={c.description}
                  onChange={(e) => {
                    const next = [...criteria];
                    next[i] = { ...next[i], description: e.target.value };
                    setCriteria(next);
                  }}
                />
                <Input
                  className="w-20"
                  type="number"
                  placeholder="Max pts"
                  value={c.maxPoints || ""}
                  onChange={(e) => {
                    const next = [...criteria];
                    next[i] = { ...next[i], maxPoints: parseFloat(e.target.value) || 0 };
                    setCriteria(next);
                  }}
                />
                {criteria.length > 1 && (
                  <Button variant="ghost" size="sm" onClick={() => setCriteria(criteria.filter((_, j) => j !== i))}>
                    ?
                  </Button>
                )}
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setCriteria([...criteria, { description: "", maxPoints: 0 }])}>
                + Add criterion
              </Button>
              <span className="text-xs text-muted-foreground">
                Total: {criteria.reduce((s, c) => s + c.maxPoints, 0)} pts
              </span>
            </div>
          </div>
          <Button onClick={handleCreateRubric} disabled={creatingRubric || !courseName || !questionText}>
            {creatingRubric ? "Creating?" : "Create Rubric"}
          </Button>
        </CardContent>
      </Card>

      {/* Step 2: Upload Answers */}
      <Card>
        <CardHeader>
          <CardTitle>Step 2 ? Student Answers</CardTitle>
          <CardDescription>Paste CSV: studentIdAnon,answerText (one per line)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={6}
            placeholder={`student_001,The client sends a SYN packet...\nstudent_002,TCP handshake is when two computers...`}
            value={answersCsv}
            onChange={(e) => setAnswersCsv(e.target.value)}
          />
          <Button onClick={handleUploadAnswers} disabled={uploadingAnswers || !selectedRubricId || !answersCsv.trim()}>
            {uploadingAnswers ? "Uploading?" : "Upload Answers"}
          </Button>
        </CardContent>
      </Card>

      {/* Step 3: TA Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3 ? TA Grades</CardTitle>
          <CardDescription>Pick a TA, then paste CSV: studentIdAnon,score1,score2,?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-1.5">
            <Label>TA</Label>
            <select
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm"
              value={selectedTaId}
              onChange={(e) => setSelectedTaId(e.target.value)}
            >
              <option value="">Select a TA?</option>
              {tas.map((ta) => (
                <option key={ta.id} value={ta.id}>
                  {ta.name} ({ta.email})
                </option>
              ))}
            </select>
          </div>
          <Textarea
            rows={6}
            placeholder={`student_001,3,2,2,1.5\nstudent_002,2,3,1,1`}
            value={gradesCsv}
            onChange={(e) => setGradesCsv(e.target.value)}
          />
          <Button onClick={handleUploadGrades} disabled={uploadingGrades || !selectedRubricId || !selectedTaId || !gradesCsv.trim()}>
            {uploadingGrades ? "Uploading?" : "Upload TA Grades"}
          </Button>
        </CardContent>
      </Card>

      {/* Step 4: Run AI Grading */}
      <Card>
        <CardHeader>
          <CardTitle>Run AI Grading</CardTitle>
          <CardDescription>Grade all answers with AI, then view the dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {aiResult && <p className="text-sm text-green-700 dark:text-green-400">{aiResult}</p>}
          <Button
            onClick={handleRunAi}
            disabled={runningAi || !selectedRubricId || (selectedRubric?.answersCount ?? 0) === 0}
          >
            {runningAi ? "Grading?" : "Run AI Grading"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense>
      <UploadInner />
    </Suspense>
  );
}
