import { Injectable } from '@nestjs/common';
import type { ActivityType, Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

// Writes the course activity feed. Call it right after the action succeeds.
// Never put student data in the payload beyond the student ID already shown in the UI.
@Injectable()
export class ActivityService {
  constructor(private readonly prisma: PrismaService) {}

  log(entry: {
    courseId: string;
    type: ActivityType;
    actorId?: string;
    paperId?: string;
    payload?: Prisma.InputJsonValue;
  }) {
    return this.prisma.activityLog.create({
      data: {
        courseId: entry.courseId,
        type: entry.type,
        actorId: entry.actorId,
        paperId: entry.paperId,
        payload: entry.payload ?? {},
      },
    });
  }
}
