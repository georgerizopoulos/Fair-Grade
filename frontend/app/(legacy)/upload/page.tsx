"use client";

import Papa from "papaparse";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
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

/* ?? preview row types ?? */
interface AnswerRow {
  studentIdAnon: string;
  answerText: string;
}
interface GradeRow {
  studentIdAnon: string;
  scores: number[];
  warnings: string[];
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
  const [existingAnswers, setExistingAnswers] = useState<{ id: string; studentIdAnon: string }[]>([]);
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- legacy page, frozen, deleted in the final pass (DOCS/TASKS.md)
    loadRubrics();
    apiFetch<{ users: TaUser[] }>("/users?role=ta")
      .then(({ users }) => setTas(users))
      .catch(() => {});
  }, [user, loadRubrics]);

  // Load rubric detail + existing answers when selection changes
  useEffect(() => {
    if (!selectedRubricId) return;
    apiFetch<RubricDetail>(`/rubrics/${selectedRubricId}`)
      .then(setRubricDetail)
      .catch(() => {});
    apiFetch<{ answers: { id: string; studentIdAnon: string }[] }>(
      `/answers?rubricId=${selectedRubricId}`,
    )
      .then(({ answers }) => setExistingAnswers(answers))
      .catch(() => setExistingAnswers([]));
  }, [selectedRubricId]);

  const clearMessages = () => {
    setError("");
    setSuccess("");
  };

  /* ?? Step 2: parse answers CSV with papaparse ?? */
  const answerPreview = useMemo<{ rows: AnswerRow[]; errors: string[] }>(() => {
    if (!answersCsv.trim()) return { rows: [], errors: [] };
    const result = Papa.parse<Record<string, string>>(answersCsv, {
      header: true,
      skipEmptyLines: true,
    });
    const errors: string[] = [];
    const rows: AnswerRow[] = [];
    const seen = new Set<string>();

    // If no header row detected, try headerless
    const hasHeader = result.meta.fields?.includes("studentIdAnon");
    if (!hasHeader) {
      const raw = Papa.parse<string[]>(answersCsv, { skipEmptyLines: true });
      for (let i = 0; i < raw.data.length; i++) {
        const cols = raw.data[i];
        if (cols.length < 2) {
          errors.push(`Row ${i + 1}: needs at least 2 columns (studentIdAnon, answerText)`);
          continue;
        }
        const sid = cols[0].trim();
        const text = cols.slice(1).join(",").trim();
        if (!sid) { errors.push(`Row ${i + 1}: empty studentIdAnon`); continue; }
        if (!text) { errors.push(`Row ${i + 1}: empty answerText`); continue; }
        if (seen.has(sid)) { errors.push(`Row ${i + 1}: duplicate "${sid}"`); continue; }
        seen.add(sid);
        rows.push({ studentIdAnon: sid, answerText: text });
      }
      return { rows, errors };
    }

    for (let i = 0; i < result.data.length; i++) {
      const row = result.data[i];
      const sid = row.studentIdAnon?.trim() ?? "";
      const text = row.answerText?.trim() ?? "";
      if (!sid) { errors.push(`Row ${i + 1}: empty studentIdAnon`); continue; }
      if (!text) { errors.push(`Row ${i + 1}: empty answerText`); continue; }
      if (seen.has(sid)) { errors.push(`Row ${i + 1}: duplicate "${sid}"`); continue; }
      seen.add(sid);
      rows.push({ studentIdAnon: sid, answerText: text });
    }
    return { rows, errors };
  }, [answersCsv]);

  /* ?? Step 3: parse grades CSV with papaparse + validate ?? */
  const sortedCriteria = useMemo(
    () => (rubricDetail?.criteria ?? []).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)),
    [rubricDetail],
  );
  const answerMap = useMemo(
    () => new Map(existingAnswers.map((a) => [a.studentIdAnon, a.id])),
    [existingAnswers],
  );

  const gradePreview = useMemo<{ rows: GradeRow[]; errors: string[] }>(() => {
    if (!gradesCsv.trim() || sortedCriteria.length === 0) return { rows: [], errors: [] };
    const raw = Papa.parse<string[]>(gradesCsv, { skipEmptyLines: true });
    const errors: string[] = [];
    const rows: GradeRow[] = [];

    let startIdx = 0;
    // Skip header row if present
    if (raw.data.length > 0) {
      const first = raw.data[0][0]?.trim().toLowerCase();
      if (first === "studentidanon" || first === "student_id_anon" || first === "student") {
        startIdx = 1;
      }
    }

    for (let i = startIdx; i < raw.data.length; i++) {
      const cols = raw.data[i];
      const sid = cols[0]?.trim() ?? "";
      if (!sid) { errors.push(`Row ${i + 1}: empty studentIdAnon`); continue; }

      const warnings: string[] = [];
      if (!answerMap.has(sid)) warnings.push("Unknown student");

      const scores: number[] = [];
      for (let j = 0; j < sortedCriteria.length; j++) {
        const val = cols[j + 1]?.trim();
        if (val === undefined || val === "") {
          warnings.push(`C${j + 1}: missing`);
          scores.push(0);
          continue;
        }
        const pts = parseFloat(val);
        if (isNaN(pts)) {
          warnings.push(`C${j + 1}: "${val}" is not a number`);
          scores.push(0);
        } else if (pts < 0) {
          warnings.push(`C${j + 1}: ${pts} < 0`);
          scores.push(pts);
        } else if (pts > sortedCriteria[j].maxPoints) {
          warnings.push(`C${j + 1}: ${pts} > max ${sortedCriteria[j].maxPoints}`);
          scores.push(pts);
        } else {
          scores.push(pts);
        }
      }
      rows.push({ studentIdAnon: sid, scores, warnings });
    }
    return { rows, errors };
  }, [gradesCsv, sortedCriteria, answerMap]);

  const gradeHasBlockingErrors = useMemo(
    () =>
      gradePreview.errors.length > 0 ||
      gradePreview.rows.some(
        (r) => !answerMap.has(r.studentIdAnon) || r.warnings.some((w) => w.includes(">") || w.includes("not a number")),
      ),
    [gradePreview, answerMap],
  );

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
    if (!selectedRubricId || answerPreview.rows.length === 0) return;
    clearMessages();
    setUploadingAnswers(true);
    try {
      const result = await apiFetch<{ created: unknown[] }>("/answers/bulk", {
        method: "POST",
        body: { rubricId: selectedRubricId, answers: answerPreview.rows },
      });
      setSuccess(`Uploaded ${result.created.length} answers`);
      setAnswersCsv("");
      await loadRubrics();
      // Refresh existing answers
      const { answers } = await apiFetch<{ answers: { id: string; studentIdAnon: string }[] }>(
        `/answers?rubricId=${selectedRubricId}`,
      );
      setExistingAnswers(answers);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to upload answers");
    } finally {
      setUploadingAnswers(false);
    }
  }

  // ?? Step 3: Upload TA Grades ??
  async function handleUploadGrades() {
    if (!selectedRubricId || !selectedTaId || sortedCriteria.length === 0) return;
    clearMessages();
    setUploadingGrades(true);
    try {
      const grades: { answerId: string; criterionId: string; pointsGiven: number }[] = [];
      for (const row of gradePreview.rows) {
        const answerId = answerMap.get(row.studentIdAnon);
        if (!answerId) throw new Error(`Unknown student: ${row.studentIdAnon}`);
        for (let j = 0; j < sortedCriteria.length; j++) {
          grades.push({
            answerId,
            criterionId: sortedCriteria[j].id!,
            pointsGiven: row.scores[j],
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
          <CardDescription>
            Paste CSV with header <code>studentIdAnon,answerText</code> ? or without header (first column = student ID, rest = answer)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            rows={6}
            placeholder={`studentIdAnon,answerText\nstudent_001,"The client sends a SYN packet..."\nstudent_002,"TCP handshake is when two computers..."`}
            value={answersCsv}
            onChange={(e) => setAnswersCsv(e.target.value)}
          />

          {/* Preview table */}
          {answerPreview.rows.length > 0 && (
            <div className="rounded-md border">
              <div className="border-b bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Preview ? {answerPreview.rows.length} answers
              </div>
              <div className="max-h-48 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="px-3 py-1.5 w-32">Student</th>
                      <th className="px-3 py-1.5">Answer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {answerPreview.rows.map((r, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="px-3 py-1 font-mono text-xs">{r.studentIdAnon}</td>
                        <td className="px-3 py-1 text-xs text-muted-foreground truncate max-w-md">
                          {r.answerText.slice(0, 80)}{r.answerText.length > 80 ? "?" : ""}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {answerPreview.errors.length > 0 && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
              {answerPreview.errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <Button
            onClick={handleUploadAnswers}
            disabled={uploadingAnswers || !selectedRubricId || answerPreview.rows.length === 0 || answerPreview.errors.length > 0}
          >
            {uploadingAnswers ? "Uploading?" : `Upload ${answerPreview.rows.length} Answers`}
          </Button>
        </CardContent>
      </Card>

      {/* Step 3: TA Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Step 3 ? TA Grades</CardTitle>
          <CardDescription>
            Pick a TA, then paste CSV: <code>studentIdAnon,c1,c2,?</code> (columns match criteria in position order)
          </CardDescription>
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
            placeholder={`studentIdAnon,c1,c2,c3,c4\nstudent_001,3,3,2,1.5\nstudent_002,2,3,1,1`}
            value={gradesCsv}
            onChange={(e) => setGradesCsv(e.target.value)}
          />

          {/* Preview table */}
          {gradePreview.rows.length > 0 && (
            <div className="rounded-md border">
              <div className="border-b bg-muted/50 px-3 py-1.5 text-xs font-medium text-muted-foreground">
                Preview ? {gradePreview.rows.length} students ? {sortedCriteria.length} criteria
              </div>
              <div className="max-h-56 overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-xs text-muted-foreground">
                      <th className="px-3 py-1.5">Student</th>
                      {sortedCriteria.map((c, j) => (
                        <th key={j} className="px-2 py-1.5 text-center">
                          C{c.position ?? j + 1}
                          <span className="block text-[10px] font-normal">max {c.maxPoints}</span>
                        </th>
                      ))}
                      <th className="px-3 py-1.5">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gradePreview.rows.map((r, i) => {
                      const unknown = !answerMap.has(r.studentIdAnon);
                      return (
                        <tr key={i} className={`border-b last:border-0 ${unknown || r.warnings.length > 0 ? "bg-destructive/5" : ""}`}>
                          <td className={`px-3 py-1 font-mono text-xs ${unknown ? "text-destructive font-bold" : ""}`}>
                            {r.studentIdAnon}
                          </td>
                          {r.scores.map((s, j) => {
                            const over = s > sortedCriteria[j]?.maxPoints;
                            const neg = s < 0;
                            return (
                              <td key={j} className={`px-2 py-1 text-center text-xs ${over || neg ? "text-destructive font-bold" : ""}`}>
                                {s}
                              </td>
                            );
                          })}
                          <td className="px-3 py-1 text-xs">
                            {r.warnings.length > 0 ? (
                              <span className="text-destructive">{r.warnings.join("; ")}</span>
                            ) : (
                              <span className="text-green-600">?</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          {gradePreview.errors.length > 0 && (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-xs text-destructive">
              {gradePreview.errors.map((e, i) => <div key={i}>{e}</div>)}
            </div>
          )}

          <Button
            onClick={handleUploadGrades}
            disabled={uploadingGrades || !selectedRubricId || !selectedTaId || gradePreview.rows.length === 0 || gradeHasBlockingErrors}
          >
            {uploadingGrades ? "Uploading?" : `Upload ${gradePreview.rows.length} Grade Rows`}
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
