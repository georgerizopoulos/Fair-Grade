import type { PrismaService } from './../src/prisma/prisma.service.js';

// Empties every table, children first. Each e2e file calls this in beforeAll.
export async function wipeDb(prisma: PrismaService) {
  await prisma.activityLog.deleteMany();
  await prisma.paperRevision.deleteMany();
  await prisma.paperAnswer.deleteMany();
  await prisma.paperPage.deleteMany();
  await prisma.paper.deleteMany();
  await prisma.rubricPoint.deleteMany();
  await prisma.question.deleteMany();
  await prisma.exam.deleteMany();
  await prisma.courseMember.deleteMany();
  await prisma.aiGrade.deleteMany();
  await prisma.taGrade.deleteMany();
  await prisma.studentAnswer.deleteMany();
  await prisma.criterion.deleteMany();
  await prisma.rubric.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();
}
