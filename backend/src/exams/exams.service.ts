import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { AccessService } from '../access/access.service.js';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type {
  BulkQuestionsDto,
  CreateExamDto,
  PatchExamDto,
} from './exams.dto.js';
import {
  QUESTIONS_IMPORTER,
  type QuestionsImporter,
  type SolutionsPdfUpload,
} from './questions-importer.js';

@Injectable()
export class ExamsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly access: AccessService,
    @Inject(QUESTIONS_IMPORTER)
    private readonly questionsImporter: QuestionsImporter,
  ) {}

  async listByCourse(user: AuthUser, courseId: string) {
    await this.access.ownedCourse(user, courseId);

    const exams = await this.prisma.exam.findMany({
      where: { courseId },
      include: {
        _count: { select: { questions: true, papers: true } },
      },
      orderBy: [{ heldAt: 'asc' }, { createdAt: 'asc' }],
    });

    return {
      courseId,
      exams: exams.map((e) => ({
        id: e.id,
        name: e.name,
        heldAt: e.heldAt,
        status: e.status,
        questionCount: e._count.questions,
        paperCount: e._count.papers,
      })),
    };
  }

  async create(user: AuthUser, courseId: string, dto: CreateExamDto) {
    await this.access.ownedCourse(user, courseId);

    const exam = await this.prisma.exam.create({
      data: {
        courseId,
        name: dto.name,
        heldAt: dto.heldAt ? new Date(dto.heldAt) : null,
      },
    });

    return this.get(user, exam.id);
  }

  async get(user: AuthUser, examId: string) {
    await this.access.ownedExam(user, examId);

    const exam = await this.prisma.exam.findUniqueOrThrow({
      where: { id: examId },
      include: {
        course: { select: { id: true, code: true, name: true } },
        _count: { select: { questions: true, papers: true } },
      },
    });

    return {
      id: exam.id,
      name: exam.name,
      heldAt: exam.heldAt,
      status: exam.status,
      passMark: exam.passMark,
      courseId: exam.courseId,
      course: exam.course,
      questionCount: exam._count.questions,
      paperCount: exam._count.papers,
    };
  }

  async patch(user: AuthUser, examId: string, dto: PatchExamDto) {
    await this.access.ownedExam(user, examId);

    await this.prisma.exam.update({
      where: { id: examId },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.heldAt !== undefined
          ? { heldAt: dto.heldAt ? new Date(dto.heldAt) : null }
          : {}),
        ...(dto.passMark !== undefined ? { passMark: dto.passMark } : {}),
      },
    });

    return this.get(user, examId);
  }

  async getQuestions(user: AuthUser, examId: string) {
    await this.access.ownedExam(user, examId);

    const questions = await this.prisma.question.findMany({
      where: { examId },
      include: { rubricPoints: { orderBy: { order: 'asc' } } },
      orderBy: { order: 'asc' },
    });

    return {
      examId,
      questions: questions.map((q) => ({
        id: q.id,
        code: q.code,
        title: q.title,
        prompt: q.prompt,
        maxPoints: q.maxPoints,
        modelAnswer: q.modelAnswer,
        order: q.order,
        rubric: q.rubricPoints.map((rp) => ({
          id: rp.id,
          text: rp.text,
          points: rp.points,
          order: rp.order,
        })),
      })),
    };
  }

  async saveQuestions(user: AuthUser, examId: string, dto: BulkQuestionsDto) {
    await this.access.ownedExam(user, examId);

    // Validate: rubric points must add up to maxPoints for each question.
    for (const q of dto.questions) {
      const sum = q.rubric.reduce((s, r) => s + r.points, 0);
      if (Math.abs(sum - q.maxPoints) > 0.001) {
        throw new BadRequestException(
          `${q.code}: rubric points add up to ${sum}, not ${q.maxPoints}`,
        );
      }
    }

    const codes = dto.questions.map((question) => question.code);
    if (new Set(codes).size !== codes.length) {
      throw new BadRequestException('Question codes must be unique within an exam');
    }

    await this.prisma.$transaction(async (tx) => {
      const existing = await tx.question.findMany({
        where: { examId },
        select: { id: true, code: true },
      });
      const requestedCodes = new Set(codes);
      const removed = existing.filter((question) => !requestedCodes.has(question.code));

      if (removed.length > 0) {
        const papersUsingRemovedQuestions = await tx.paperAnswer.count({
          where: { questionId: { in: removed.map((question) => question.id) } },
        });
        if (papersUsingRemovedQuestions > 0) {
          throw new ConflictException(
            'Cannot remove questions that are already used by papers',
          );
        }
        await tx.question.deleteMany({
          where: { id: { in: removed.map((question) => question.id) } },
        });
      }

      const existingByCode = new Map(existing.map((question) => [question.code, question]));

      for (let i = 0; i < dto.questions.length; i++) {
        const q = dto.questions[i];
        const fields = {
          code: q.code,
          title: q.title,
          prompt: q.prompt,
          maxPoints: q.maxPoints,
          modelAnswer: q.modelAnswer,
          order: i + 1,
        };
        const found = existingByCode.get(q.code);
        const question = found
          ? await tx.question.update({
              where: { id: found.id },
              data: fields,
            })
          : await tx.question.create({
              data: { examId, ...fields },
            });

        await tx.rubricPoint.deleteMany({ where: { questionId: question.id } });
        if (q.rubric.length > 0) {
          await tx.rubricPoint.createMany({
            data: q.rubric.map((point, index) => ({
              questionId: question.id,
              text: point.text,
              points: point.points,
              order: index + 1,
            })),
          });
        }
      }
    });

    return this.getQuestions(user, examId);
  }

  async importQuestions(
    user: AuthUser,
    examId: string,
    file: SolutionsPdfUpload,
  ) {
    await this.access.ownedExam(user, examId);
    return {
      examId,
      questions: await this.questionsImporter.importSolutionsPdf(file.buffer),
    };
  }
}
