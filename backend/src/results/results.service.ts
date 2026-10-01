import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

// API_SPEC #14 — every answer with AI and TA grades side by side, per criterion.
@Injectable()
export class ResultsService {
  constructor(private readonly prisma: PrismaService) {}

  async getResults(rubricId: string, taId?: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id: rubricId },
      include: { criteria: { orderBy: { position: 'asc' } } },
    });
    if (!rubric) {
      throw new NotFoundException(`Rubric ${rubricId} not found`);
    }

    if (taId) {
      const ta = await this.prisma.user.findUnique({ where: { id: taId } });
      if (!ta || ta.role !== 'ta') {
        throw new NotFoundException(`No TA with id ${taId}`);
      }
    }

    const answers = await this.prisma.studentAnswer.findMany({
      where: {
        rubricId,
        // With ?taId= only answers that TA graded appear.
        ...(taId ? { taGrades: { some: { taId } } } : {}),
      },
      orderBy: { studentIdAnon: 'asc' },
      include: {
        aiGrades: true,
        taGrades: {
          where: taId ? { taId } : {},
          include: { ta: { select: { id: true, name: true } } },
        },
      },
    });

    const aiGraded =
      (await this.prisma.aiGrade.count({
        where: { answer: { rubricId } },
      })) > 0;

    return {
      rubricId,
      aiGraded,
      answers: answers.map((answer) => ({
        answerId: answer.id,
        studentIdAnon: answer.studentIdAnon,
        answerText: answer.answerText,
        criteria: rubric.criteria.map((criterion) => {
          const ai = answer.aiGrades.find(
            (g) => g.criterionId === criterion.id,
          );
          return {
            criterionId: criterion.id,
            position: criterion.position,
            description: criterion.description,
            maxPoints: criterion.maxPoints,
            aiGrade: ai ? { points: ai.points, reasoning: ai.reasoning } : null,
            taGrades: answer.taGrades
              .filter((g) => g.criterionId === criterion.id)
              .map((g) => ({
                taId: g.ta.id,
                taName: g.ta.name,
                points: g.pointsGiven,
              })),
          };
        }),
      })),
    };
  }
}
