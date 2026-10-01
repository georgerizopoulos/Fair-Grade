import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
import { PDFDocument } from 'pdf-lib';
import { AccessService } from '../access/access.service.js';
import { ActivityService } from '../activity/activity.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import type { PaperStatus, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { isHalfStep, paperTotals } from './paper-totals.js';
import {
  CreatePaperDto,
  MyPapersQuery,
  PaperPdfUpload,
  UpdatePaperDto,
} from './papers.dto.js';

const MAX_PDF_BYTES = 20 * 1024 * 1024;

// Paper lifecycle (change request §1.4–§1.6):
//
//   TRANSCRIBING → DRAFT ──submit──▶ AI_GRADING ──worker──▶ AI_GRADED
//                    ▲                    │                    │
//                    │                    └──worker──▶ AI_FAILED ──retry-ai──▶ AI_GRADING
//                    └────────── reopen (instructor) ◀─────────┘
//
// Submitting is how a paper is queued: the AI worker (ai/, Κώστας) picks up
// papers with status AI_GRADING and aiNextAttemptAt <= now. It must only write
// results while the paper is still AI_GRADING.

const SUBMITTED: PaperStatus[] = ['AI_GRADING', 'AI_GRADED', 'AI_FAILED'];
const DRAFT_LOG_EVERY_MS = 10 * 60 * 1000; // autosave shouldn't flood the activity feed

@Injectable()
export class PapersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
    private readonly activity: ActivityService,
  ) {}

  async upload(
    user: AuthUser,
    examId: string,
    dto: CreatePaperDto,
    file: PaperPdfUpload,
  ) {
    if (user.role === 'instructor') {
      await this.access.ownedExam(user, examId);
    } else {
      await this.access.exam(user, examId);
    }

    const taId = user.role === 'ta' ? user.id : dto.taId;
    if (!taId) {
      throw new BadRequestException(
        'taId is required when an instructor uploads a paper',
      );
    }

    if (file.size > MAX_PDF_BYTES) {
      throw new BadRequestException('PDF must be 20 MiB or smaller');
    }
    if (
      file.mimetype !== 'application/pdf' ||
      !file.originalname.toLowerCase().endsWith('.pdf') ||
      file.buffer.subarray(0, 5).toString() !== '%PDF-'
    ) {
      throw new BadRequestException('file must be a valid PDF');
    }

    const ta = await this.prisma.user.findUnique({ where: { id: taId } });
    if (!ta || ta.role !== 'ta') {
      throw new NotFoundException(`taId ${taId} does not exist or is not a TA`);
    }
    await this.access.exam(ta, examId);

    let pageCount: number;
    try {
      pageCount = (await PDFDocument.load(file.buffer)).getPageCount();
    } catch {
      throw new BadRequestException('PDF could not be read');
    }
    if (pageCount < 1) throw new BadRequestException('PDF must contain a page');

    const uploadsDir = resolve(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    const filename = `${randomUUID()}.pdf`;
    const diskPath = resolve(uploadsDir, filename);
    const relativePath = `uploads${sep}${filename}`;
    await writeFile(diskPath, file.buffer, { flag: 'wx' });

    try {
      const paper = await this.prisma.$transaction(async (tx) => {
        const created = await tx.paper.create({
          data: {
            examId,
            taId,
            studentId: dto.studentId,
            pdfPath: relativePath,
            pageCount,
            status: 'DRAFT',
          },
        });

        for (let index = 0; index < pageCount; index++) {
          await tx.paperPage.create({
            data: { paperId: created.id, index, status: 'WAITING' },
          });
        }

        const questions = await tx.question.findMany({
          where: { examId },
          orderBy: { order: 'asc' },
          select: { id: true },
        });
        for (const question of questions) {
          await tx.paperAnswer.create({
            data: {
              paperId: created.id,
              questionId: question.id,
              transcription: '',
              uncertainWords: [],
              pages: [],
            },
          });
        }

        return created;
      });

      // Future transcription hook: enqueue this stored PDF with the exam questions.
      return this.get(user, paper.id);
    } catch (error) {
      await unlink(diskPath).catch(() => undefined);
      throw error;
    }
  }

  async rescanPage(user: AuthUser, paperId: string, index: number) {
    const paper = await this.access.paper(user, paperId);
    if (index < 0) throw new BadRequestException('page index must be 0 or greater');
    if (paper.status !== 'DRAFT') {
      throw new ConflictException('Only draft paper pages can be rescanned');
    }

    const page = await this.prisma.paperPage.findUnique({
      where: { paperId_index: { paperId, index } },
    });
    if (!page) {
      throw new NotFoundException(`Page ${index} not found for paper ${paperId}`);
    }

    const updated = await this.prisma.paperPage.update({
      where: { paperId_index: { paperId, index } },
      data: { status: 'WAITING' },
    });

    // Future transcription hook: enqueue this page when a vision model is available.
    return { paperId, index, status: updated.status };
  }

  // ---------------------------------------------------------------- read

  // GET /papers/:id. A TA only sees the AI's grade once the paper is submitted.
  async get(user: AuthUser, paperId: string) {
    await this.access.paper(user, paperId);
    const paper = await this.prisma.paper.findUniqueOrThrow({
      where: { id: paperId },
      include: {
        ta: { select: { id: true, name: true } },
        exam: {
          include: {
            course: { select: { id: true, code: true, name: true } },
            questions: {
              orderBy: { order: 'asc' },
              include: { rubricPoints: { orderBy: { order: 'asc' } } },
            },
          },
        },
        answers: true,
        pages: { orderBy: { index: 'asc' } },
      },
    });

    const aiVisible =
      user.role === 'instructor' || SUBMITTED.includes(paper.status);
    const byQuestion = new Map(paper.answers.map((a) => [a.questionId, a]));
    const answers = paper.exam.questions.map((q) => {
      const a = byQuestion.get(q.id);
      return {
        questionId: q.id,
        code: q.code,
        title: q.title,
        prompt: q.prompt,
        maxPoints: q.maxPoints,
        modelAnswer: q.modelAnswer,
        rubricPoints: q.rubricPoints.map((r) => ({
          text: r.text,
          points: r.points,
        })),
        transcription: a?.transcription ?? '',
        uncertainWords: (a?.uncertainWords as string[] | undefined) ?? [],
        pages: (a?.pages as number[] | undefined) ?? [],
        taPoints: a?.taPoints ?? null,
        ...(aiVisible
          ? {
              aiPoints: a?.aiPoints ?? null,
              aiReasoning: a?.aiReasoning ?? null,
            }
          : {}),
      };
    });
    const totals = paperTotals(
      answers.map((a) => ({
        maxPoints: a.maxPoints,
        taPoints: a.taPoints,
        aiPoints: aiVisible ? (a.aiPoints ?? null) : null,
      })),
    );

    return {
      viewerRole: user.role,
      id: paper.id,
      studentId: paper.studentId,
      status: paper.status,
      reopenRequested: paper.reopenRequested,
      locked: paper.status !== 'DRAFT',
      createdAt: paper.createdAt,
      submittedAt: paper.submittedAt,
      aiGradedAt: aiVisible ? paper.aiGradedAt : null,
      aiError: aiVisible ? paper.aiError : null,
      pageCount: paper.pageCount,
      ta: { ...paper.ta, isYou: paper.ta.id === user.id },
      exam: {
        id: paper.exam.id,
        name: paper.exam.name,
        passMark: paper.exam.passMark,
      },
      course: paper.exam.course,
      pages: paper.pages.map((p) => ({ index: p.index, status: p.status })),
      answers,
      ...(aiVisible
        ? totals
        : { maxTotal: totals.maxTotal, taTotal: totals.taTotal }),
    };
  }

  // GET /exams/:id/my-papers. The signed-in TA's papers in this exam, newest first.
  async myPapers(user: AuthUser, examId: string, query: MyPapersQuery) {
    await this.access.exam(user, examId);
    if (user.role !== 'ta') {
      throw new ForbiddenException(
        'Only TAs have their own papers; open the exam report instead',
      );
    }

    const papers = await this.prisma.paper.findMany({
      where: { examId, taId: user.id },
      include: {
        answers: { include: { question: { select: { maxPoints: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
    const questionCount = await this.prisma.question.count({
      where: { examId },
    });

    const rows = papers.map((p) => {
      const submitted = SUBMITTED.includes(p.status);
      // Missing answer rows count as "no points yet".
      const answers = p.answers.map((a) => ({
        maxPoints: a.question.maxPoints,
        taPoints: a.taPoints,
        aiPoints: p.status === 'AI_GRADED' ? a.aiPoints : null,
      }));
      const totals =
        answers.length === questionCount
          ? paperTotals(answers)
          : { taTotal: null, aiTotal: null, gap: null };
      return {
        id: p.id,
        studentId: p.studentId,
        status: p.status,
        createdAt: p.createdAt,
        submittedAt: p.submittedAt,
        reopenRequested: p.reopenRequested,
        taTotal: submitted ? totals.taTotal : null,
        aiTotal: totals.aiTotal,
        gap: totals.gap,
      };
    });

    const count = (...s: PaperStatus[]) =>
      rows.filter((r) => s.includes(r.status)).length;
    const counts = {
      all: rows.length,
      drafts: count('TRANSCRIBING', 'DRAFT'),
      submitted: count(...SUBMITTED),
      aiGrading: count('AI_GRADING'),
      aiGraded: count('AI_GRADED'),
      aiFailed: count('AI_FAILED'),
    };

    const q = query.q?.trim().toLowerCase();
    const filtered = rows.filter(
      (r) =>
        (query.filter === 'drafts'
          ? !SUBMITTED.includes(r.status)
          : query.filter === 'submitted'
            ? SUBMITTED.includes(r.status)
            : true) &&
        (!q || r.studentId.toLowerCase().includes(q)),
    );
    return { examId, counts, papers: filtered };
  }

  // ---------------------------------------------------------------- draft

  // PATCH /papers/:id. Owning TA only, DRAFT only.
  async update(user: AuthUser, paperId: string, dto: UpdatePaperDto) {
    const paper = await this.ownDraft(user, paperId);
    const questions = await this.prisma.question.findMany({
      where: { examId: paper.examId },
    });
    const byId = new Map(questions.map((q) => [q.id, q]));

    for (const [i, a] of dto.answers.entries()) {
      const q = byId.get(a.questionId);
      if (!q) {
        throw new BadRequestException(
          `answers[${i}].questionId ${a.questionId} is not a question of this exam`,
        );
      }
      if (
        a.taPoints != null &&
        (a.taPoints > q.maxPoints || !isHalfStep(a.taPoints))
      ) {
        throw new BadRequestException(
          `answers[${i}].taPoints for ${q.code} must be 0 to ${q.maxPoints} in steps of 0.5`,
        );
      }
    }

    await this.prisma.$transaction(
      dto.answers.map((a) => {
        const data: Prisma.PaperAnswerUncheckedUpdateInput = {};
        if (a.transcription !== undefined) data.transcription = a.transcription;
        if (a.taPoints !== undefined) data.taPoints = a.taPoints;
        return this.prisma.paperAnswer.upsert({
          where: { paperId_questionId: { paperId, questionId: a.questionId } },
          update: data,
          create: {
            paperId,
            questionId: a.questionId,
            transcription: a.transcription ?? '',
            taPoints: a.taPoints ?? null,
            uncertainWords: [],
            pages: [],
          },
        });
      }),
    );

    const recent = await this.prisma.activityLog.findFirst({
      where: {
        paperId,
        type: 'PAPER_DRAFT_SAVED',
        createdAt: { gt: new Date(Date.now() - DRAFT_LOG_EVERY_MS) },
      },
    });
    if (!recent) {
      await this.activity.log({
        courseId: paper.exam.courseId,
        type: 'PAPER_DRAFT_SAVED',
        actorId: user.id,
        paperId,
        payload: { studentId: paper.studentId },
      });
    }
    return this.get(user, paperId);
  }

  // POST /papers/:id/submit. Every question needs points; then the grades lock
  // and the paper waits for the AI.
  async submit(user: AuthUser, paperId: string) {
    const paper = await this.ownDraft(user, paperId);
    const questions = await this.prisma.question.findMany({
      where: { examId: paper.examId },
      orderBy: { order: 'asc' },
      include: { answers: { where: { paperId } } },
    });
    if (questions.length === 0) {
      throw new BadRequestException('This exam has no questions yet');
    }
    const missing = questions
      .filter((q) => q.answers[0]?.taPoints == null)
      .map((q) => q.code);
    if (missing.length) {
      throw new BadRequestException(
        `Give points for every question before submitting: ${missing.join(', ')}`,
      );
    }

    await this.prisma.paper.update({
      where: { id: paperId },
      data: {
        status: 'AI_GRADING',
        submittedAt: new Date(),
        reopenRequested: false,
        aiAttempts: 0,
        aiNextAttemptAt: new Date(),
        aiError: null,
      },
    });
    await this.activity.log({
      courseId: paper.exam.courseId,
      type: 'PAPER_SUBMITTED',
      actorId: user.id,
      paperId,
      payload: { studentId: paper.studentId },
    });
    return this.get(user, paperId);
  }

  // ---------------------------------------------------------------- after submit

  // POST /papers/:id/request-reopen. The TA asks; only the instructor can reopen.
  async requestReopen(user: AuthUser, paperId: string) {
    const paper = await this.access.paper(user, paperId);
    if (user.role !== 'ta') {
      throw new ForbiddenException('Instructors reopen papers directly');
    }
    if (!SUBMITTED.includes(paper.status)) {
      throw new ConflictException('Only a submitted paper can be reopened');
    }
    if (!paper.reopenRequested) {
      await this.prisma.paper.update({
        where: { id: paperId },
        data: { reopenRequested: true },
      });
      await this.activity.log({
        courseId: paper.exam.courseId,
        type: 'REOPEN_REQUESTED',
        actorId: user.id,
        paperId,
        payload: { studentId: paper.studentId },
      });
    }
    return this.get(user, paperId);
  }

  // POST /papers/:id/reopen. Back to DRAFT for the TA; their points so far are
  // kept in a PaperRevision. The AI grade stays and is re-run on the next submit.
  async reopen(user: AuthUser, paperId: string) {
    const paper = await this.access.paper(user, paperId);
    if (user.role !== 'instructor') {
      throw new ForbiddenException(
        'Only the course instructor can reopen a paper; ask for it instead',
      );
    }
    if (paper.status !== 'AI_GRADED' && paper.status !== 'AI_FAILED') {
      throw new ConflictException(
        paper.status === 'AI_GRADING'
          ? 'The AI is still grading this paper; reopen it once it has finished'
          : 'This paper is not submitted',
      );
    }

    const answers = await this.prisma.paperAnswer.findMany({
      where: { paperId },
    });
    const snapshot = Object.fromEntries(
      answers.map((a) => [a.questionId, a.taPoints]),
    );
    await this.prisma.$transaction([
      this.prisma.paperRevision.create({
        data: { paperId, taPointsSnapshot: snapshot, createdBy: user.id },
      }),
      this.prisma.paper.update({
        where: { id: paperId },
        data: { status: 'DRAFT', submittedAt: null, reopenRequested: false },
      }),
    ]);
    await this.activity.log({
      courseId: paper.exam.courseId,
      type: 'PAPER_REOPENED',
      actorId: user.id,
      paperId,
      payload: { studentId: paper.studentId, taId: paper.taId },
    });
    return this.get(user, paperId);
  }

  // POST /papers/:id/retry-ai. After AI_FAILED: queue it again, attempts reset.
  async retryAi(user: AuthUser, paperId: string) {
    const paper = await this.access.paper(user, paperId);
    if (paper.status !== 'AI_FAILED') {
      throw new ConflictException(
        'Only a paper whose AI grading failed can be retried',
      );
    }
    await this.prisma.paper.update({
      where: { id: paperId },
      data: {
        status: 'AI_GRADING',
        aiAttempts: 0,
        aiNextAttemptAt: new Date(),
        aiError: null,
      },
    });
    return this.get(user, paperId);
  }

  // ---------------------------------------------------------------- helpers

  private async ownDraft(user: AuthUser, paperId: string) {
    const paper = await this.access.paper(user, paperId);
    if (paper.taId !== user.id) {
      throw new ForbiddenException(
        'Only the TA who added this paper can grade it',
      );
    }
    if (paper.status !== 'DRAFT') {
      throw new ConflictException(
        paper.status === 'TRANSCRIBING'
          ? 'The paper is still being transcribed'
          : 'Grades are locked after submit; ask the instructor to reopen the paper',
      );
    }
    return paper;
  }
}
