import { Injectable, NotFoundException } from '@nestjs/common';
import {
  computeDeviation,
  FLAG_RATIO,
  MIN_SAMPLES,
} from '../grading/deviation.js';
import { PrismaService } from '../prisma/prisma.service.js';

// API_SPEC #15 — loads everything and hands it to Κώστας's computeDeviation().
@Injectable()
export class DeviationService {
  constructor(private readonly prisma: PrismaService) {}

  async getReport(rubricId: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id: rubricId },
      include: { criteria: { orderBy: { position: 'asc' } } },
    });
    if (!rubric) {
      throw new NotFoundException(`Rubric ${rubricId} not found`);
    }

    const [answers, aiGrades, taGrades] = await Promise.all([
      this.prisma.studentAnswer.findMany({
        where: { rubricId },
        select: { id: true, studentIdAnon: true, answerText: true },
      }),
      this.prisma.aiGrade.findMany({
        where: { answer: { rubricId } },
        select: {
          answerId: true,
          criterionId: true,
          points: true,
          reasoning: true,
        },
      }),
      this.prisma.taGrade.findMany({
        where: { answer: { rubricId } },
        select: {
          answerId: true,
          criterionId: true,
          taId: true,
          pointsGiven: true,
          ta: { select: { id: true, name: true } },
        },
      }),
    ]);

    const aiGraded = aiGrades.length > 0;

    // Unique TAs with at least one grade on this rubric.
    const tas = [...new Map(taGrades.map((g) => [g.ta.id, g.ta])).values()];

    return {
      rubricId,
      aiGraded,
      thresholds: { flagRatio: FLAG_RATIO, minSamples: MIN_SAMPLES },
      // Without AI grades there is nothing to compare against.
      taSummaries: aiGraded
        ? computeDeviation({
            criteria: rubric.criteria,
            tas,
            answers,
            aiGrades,
            taGrades,
          })
        : [],
    };
  }
}
