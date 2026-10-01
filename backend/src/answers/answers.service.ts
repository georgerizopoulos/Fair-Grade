import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { BulkAnswersDto } from './answers.dto.js';

@Injectable()
export class AnswersService {
  constructor(private readonly prisma: PrismaService) {}

  private async ensureRubric(rubricId: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id: rubricId },
    });
    if (!rubric) throw new NotFoundException(`Rubric ${rubricId} not found`);
    return rubric;
  }

  async bulkCreate(dto: BulkAnswersDto) {
    await this.ensureRubric(dto.rubricId);

    // Check for duplicates within the request
    const seen = new Set<string>();
    const dupsInRequest: string[] = [];
    for (const a of dto.answers) {
      if (seen.has(a.studentIdAnon)) dupsInRequest.push(a.studentIdAnon);
      seen.add(a.studentIdAnon);
    }
    if (dupsInRequest.length > 0) {
      throw new ConflictException(
        `Duplicate studentIdAnon in request: ${dupsInRequest.join(', ')}`,
      );
    }

    // Check for IDs that already exist in the DB for this rubric
    const existing = await this.prisma.studentAnswer.findMany({
      where: {
        rubricId: dto.rubricId,
        studentIdAnon: { in: dto.answers.map((a) => a.studentIdAnon) },
      },
      select: { studentIdAnon: true },
    });
    if (existing.length > 0) {
      const ids = existing.map((e) => e.studentIdAnon);
      throw new ConflictException(
        `studentIdAnon already exists for this rubric: ${ids.join(', ')}`,
      );
    }

    // All-or-nothing insert
    const created = await this.prisma.$transaction(
      dto.answers.map((a) =>
        this.prisma.studentAnswer.create({
          data: {
            rubricId: dto.rubricId,
            studentIdAnon: a.studentIdAnon,
            answerText: a.answerText,
          },
          select: { id: true, studentIdAnon: true },
        }),
      ),
    );

    return { rubricId: dto.rubricId, created };
  }

  async list(rubricId: string) {
    await this.ensureRubric(rubricId);

    const answers = await this.prisma.studentAnswer.findMany({
      where: { rubricId },
      select: {
        id: true,
        studentIdAnon: true,
        answerText: true,
        createdAt: true,
      },
      orderBy: { studentIdAnon: 'asc' },
    });

    return { rubricId, answers };
  }
}
