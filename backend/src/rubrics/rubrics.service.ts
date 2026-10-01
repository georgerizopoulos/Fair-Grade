import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateRubricDto } from './rubrics.dto.js';

// Everything needed to build the #6 / #8 response shape.
const rubricWithCriteria = {
  course: { select: { name: true } },
  criteria: { orderBy: { position: 'asc' } },
} as const;

@Injectable()
export class RubricsService {
  constructor(private readonly prisma: PrismaService) {}

  // API_SPEC #6. Reuses the course if one with this name exists.
  async create(dto: CreateRubricDto) {
    const rubric = await this.prisma.$transaction(async (tx) => {
      const course = await tx.course.upsert({
        where: { name: dto.courseName },
        create: { name: dto.courseName },
        update: {},
      });
      return tx.rubric.create({
        data: {
          courseId: course.id,
          questionText: dto.questionText,
          criteria: {
            create: dto.criteria.map((c, i) => ({
              position: i + 1,
              description: c.description,
              maxPoints: c.maxPoints,
            })),
          },
        },
        include: rubricWithCriteria,
      });
    });
    return toRubricResponse(rubric);
  }

  // API_SPEC #7, newest first.
  async list() {
    const rubrics = await this.prisma.rubric.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        course: { select: { name: true } },
        criteria: { select: { maxPoints: true } },
        _count: { select: { answers: true } },
        // One answer with at least one AI grade is enough to say "AI graded".
        answers: {
          where: { aiGrades: { some: {} } },
          select: { id: true },
          take: 1,
        },
      },
    });

    return {
      rubrics: rubrics.map((r) => ({
        id: r.id,
        courseName: r.course.name,
        questionText: r.questionText,
        criteriaCount: r.criteria.length,
        totalPoints: sumPoints(r.criteria),
        answersCount: r._count.answers,
        aiGraded: r.answers.length > 0,
        createdAt: r.createdAt,
      })),
    };
  }

  // API_SPEC #8. Other modules can call this to load a rubric or 404.
  async get(id: string) {
    const rubric = await this.prisma.rubric.findUnique({
      where: { id },
      include: rubricWithCriteria,
    });
    if (!rubric) {
      throw new NotFoundException(`Rubric ${id} not found`);
    }
    return toRubricResponse(rubric);
  }
}

function sumPoints(criteria: { maxPoints: number }[]) {
  return criteria.reduce((sum, c) => sum + c.maxPoints, 0);
}

function toRubricResponse(rubric: {
  id: string;
  courseId: string;
  questionText: string;
  createdAt: Date;
  course: { name: string };
  criteria: {
    id: string;
    position: number;
    description: string;
    maxPoints: number;
  }[];
}) {
  return {
    id: rubric.id,
    courseId: rubric.courseId,
    courseName: rubric.course.name,
    questionText: rubric.questionText,
    totalPoints: sumPoints(rubric.criteria),
    createdAt: rubric.createdAt,
    criteria: rubric.criteria.map((c) => ({
      id: c.id,
      position: c.position,
      description: c.description,
      maxPoints: c.maxPoints,
    })),
  };
}