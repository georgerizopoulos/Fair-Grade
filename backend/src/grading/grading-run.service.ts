import {
  BadGatewayException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { runGrading } from './grading.service.js';

// API_SPEC #13 — loads the rubric + answers, calls runGrading() (pure, no DB),
// then upserts the AI grades. The AI never sees TA grades: we don't load them.
@Injectable()
export class GradingRunService {
  // Rubrics currently being graded, so a double click gets 409 instead of a
  // second full run. In-memory is fine: one backend process.
  private readonly running = new Set<string>();

  constructor(private readonly prisma: PrismaService) {}

  async run(rubricId: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id: rubricId },
      include: {
        course: true,
        criteria: { orderBy: { position: 'asc' } },
      },
    });
    if (!rubric) {
      throw new NotFoundException(`Rubric ${rubricId} not found`);
    }

    const answers = await this.prisma.studentAnswer.findMany({
      where: { rubricId },
      orderBy: { studentIdAnon: 'asc' },
      select: { id: true, studentIdAnon: true, answerText: true },
    });
    if (answers.length === 0) {
      throw new ConflictException(`Rubric ${rubricId} has no answers to grade`);
    }

    if (this.running.has(rubricId)) {
      throw new ConflictException(
        `Grading is already running for rubric ${rubricId}`,
      );
    }
    this.running.add(rubricId);

    const started = Date.now();
    try {
      const { aiGrades, failedAnswers } = await runGrading(
        {
          courseName: rubric.course.name,
          questionText: rubric.questionText,
          criteria: rubric.criteria.map((c) => ({
            id: c.id,
            description: c.description,
            maxPoints: c.maxPoints,
          })),
        },
        answers,
      );

      if (failedAnswers.length === answers.length) {
        throw new BadGatewayException(
          `AI grading failed for all ${answers.length} answers: ${failedAnswers[0].error}`,
        );
      }

      // Upsert on (answerId, criterionId) so re-running overwrites.
      await this.prisma.$transaction(
        aiGrades.map((g) =>
          this.prisma.aiGrade.upsert({
            where: {
              answerId_criterionId: {
                answerId: g.answerId,
                criterionId: g.criterionId,
              },
            },
            create: g,
            update: { points: g.points, reasoning: g.reasoning },
          }),
        ),
      );

      return {
        rubricId,
        answersTotal: answers.length,
        answersGraded: answers.length - failedAnswers.length,
        aiGradesSaved: aiGrades.length,
        failedAnswers,
        durationMs: Date.now() - started,
      };
    } finally {
      this.running.delete(rubricId);
    }
  }
}
