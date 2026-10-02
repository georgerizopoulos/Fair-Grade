import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';
import type { BulkTaGradesDto, ListTaGradesQuery } from './ta-grades.dto.js';

@Injectable()
export class TaGradesService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureRubric(rubricId: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id: rubricId },
    });
    if (!rubric) throw new NotFoundException(`Rubric ${rubricId} not found`);
    return rubric;
  }

  private async findTa(taId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: taId } });
    if (!user || user.role !== 'ta') {
      throw new NotFoundException(`taId ${taId} does not exist or is not a TA`);
    }
    return user;
  }

  async bulkSave(user: AuthUser, dto: BulkTaGradesDto) {
    let ta: { id: string; name: string };

    if (user.role === 'ta') {
      // A TA always grades as itself; taId in body is ignored
      ta = { id: user.id, name: user.name };
    } else {
      // Instructor must provide taId
      if (!dto.taId) {
        throw new BadRequestException(
          'taId is required when caller is an instructor',
        );
      }
      const taUser = await this.findTa(dto.taId);
      ta = { id: taUser.id, name: taUser.name };
    }

    // Batch-load all referenced answers and criteria
    const answerIds = [...new Set(dto.grades.map((g) => g.answerId))];
    const criterionIds = [...new Set(dto.grades.map((g) => g.criterionId))];

    const [answers, criteria] = await Promise.all([
      this.prisma.studentAnswer.findMany({
        where: { id: { in: answerIds } },
        select: { id: true, rubricId: true },
      }),
      this.prisma.criterion.findMany({
        where: { id: { in: criterionIds } },
        select: { id: true, rubricId: true, maxPoints: true },
      }),
    ]);

    const answerMap = new Map(answers.map((a) => [a.id, a]));
    const criterionMap = new Map(criteria.map((c) => [c.id, c]));

    // Validate each row in order
    for (let i = 0; i < dto.grades.length; i++) {
      const g = dto.grades[i];

      const answer = answerMap.get(g.answerId);
      if (!answer) {
        throw new NotFoundException(
          `grades[${i}].answerId ${g.answerId} not found`,
        );
      }

      const criterion = criterionMap.get(g.criterionId);
      if (!criterion) {
        throw new NotFoundException(
          `grades[${i}].criterionId ${g.criterionId} not found`,
        );
      }

      if (criterion.rubricId !== answer.rubricId) {
        throw new BadRequestException(
          `grades[${i}]: criterion ${g.criterionId} does not belong to the same rubric as answer ${g.answerId}`,
        );
      }

      if (g.pointsGiven > criterion.maxPoints) {
        throw new BadRequestException(
          `grades[${i}].pointsGiven (${g.pointsGiven}) exceeds maxPoints (${criterion.maxPoints})`,
        );
      }
    }

    // All-or-nothing upsert
    const saved = await this.prisma.$transaction(
      dto.grades.map((g) =>
        this.prisma.taGrade.upsert({
          where: {
            answerId_criterionId_taId: {
              answerId: g.answerId,
              criterionId: g.criterionId,
              taId: ta.id,
            },
          },
          update: { pointsGiven: g.pointsGiven },
          create: {
            answerId: g.answerId,
            criterionId: g.criterionId,
            taId: ta.id,
            pointsGiven: g.pointsGiven,
          },
        }),
      ),
    );

    return { taId: ta.id, taName: ta.name, saved: saved.length };
  }

  async list(user: AuthUser, query: ListTaGradesQuery) {
    await this.ensureRubric(query.rubricId);

    // Determine which TA's grades to return
    let taFilter: string | undefined;

    if (user.role === 'ta') {
      // A TA only ever sees their own grades; taId query param is ignored
      taFilter = user.id;
    } else if (query.taId) {
      // Instructor filtering by one TA
      await this.findTa(query.taId);
      taFilter = query.taId;
    }
    // else: instructor with no taId ? all TAs

    const grades = await this.prisma.taGrade.findMany({
      where: {
        answer: { rubricId: query.rubricId },
        ...(taFilter ? { taId: taFilter } : {}),
      },
      select: {
        answerId: true,
        criterionId: true,
        taId: true,
        pointsGiven: true,
        answer: { select: { studentIdAnon: true } },
        criterion: { select: { position: true } },
        ta: { select: { name: true } },
      },
      orderBy: [
        { answer: { studentIdAnon: 'asc' } },
        { criterion: { position: 'asc' } },
        { ta: { name: 'asc' } },
      ],
    });

    return {
      rubricId: query.rubricId,
      grades: grades.map((g) => ({
        answerId: g.answerId,
        studentIdAnon: g.answer.studentIdAnon,
        criterionId: g.criterionId,
        position: g.criterion.position,
        taId: g.taId,
        taName: g.ta.name,
        pointsGiven: g.pointsGiven,
      })),
    };
  }
}
