import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { AuthUser } from '../common/auth.decorators.js';
import { PrismaService } from '../prisma/prisma.service.js';

// The one place that answers "may this user touch this course / exam / paper?"
// Every course-scoped endpoint calls one of these before doing anything.
//
//   - Instructor: the course owner. (A legacy course with no owner is open to
//     every instructor.)
//   - TA: must be a member of the course. Membership is the ONLY thing that
//     gives a TA access.
//   - Papers: a TA only ever sees their own.
//
// Unknown id → 404. Known id, no access → 403.
@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  async course(user: AuthUser, courseId: string) {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });
    if (!course) throw new NotFoundException(`Course ${courseId} not found`);
    await this.assertCourse(user, course);
    return course;
  }

  async exam(user: AuthUser, examId: string) {
    const exam = await this.prisma.exam.findUnique({
      where: { id: examId },
      include: { course: true },
    });
    if (!exam) throw new NotFoundException(`Exam ${examId} not found`);
    await this.assertCourse(user, exam.course);
    return exam;
  }

  async paper(user: AuthUser, paperId: string) {
    const paper = await this.prisma.paper.findUnique({
      where: { id: paperId },
      include: { exam: { include: { course: true } } },
    });
    if (!paper) throw new NotFoundException(`Paper ${paperId} not found`);
    await this.assertCourse(user, paper.exam.course);
    if (user.role === 'ta' && paper.taId !== user.id) {
      throw new ForbiddenException('You can only open your own papers');
    }
    return paper;
  }

  // Instructor-only actions (create exams, manage members, reports...).
  async ownedCourse(user: AuthUser, courseId: string) {
    const course = await this.course(user, courseId);
    if (user.role !== 'instructor') {
      throw new ForbiddenException('Only the course instructor can do this');
    }
    return course;
  }

  async ownedExam(user: AuthUser, examId: string) {
    const exam = await this.exam(user, examId);
    if (user.role !== 'instructor') {
      throw new ForbiddenException('Only the course instructor can do this');
    }
    return exam;
  }

  // Course ids this user may see, for lists and search.
  async visibleCourseIds(user: AuthUser): Promise<string[]> {
    const courses = await this.prisma.course.findMany({
      where: this.visibleCourseFilter(user),
      select: { id: true },
    });
    return courses.map((c) => c.id);
  }

  visibleCourseFilter(user: AuthUser) {
    return user.role === 'instructor'
      ? { OR: [{ ownerId: user.id }, { ownerId: null }] }
      : { members: { some: { userId: user.id } } };
  }

  private async assertCourse(
    user: AuthUser,
    course: { id: string; ownerId: string | null },
  ) {
    if (user.role === 'instructor') {
      if (course.ownerId && course.ownerId !== user.id) {
        throw new ForbiddenException("You don't own this course");
      }
      return;
    }
    const member = await this.prisma.courseMember.findUnique({
      where: { courseId_userId: { courseId: course.id, userId: user.id } },
    });
    if (!member) {
      throw new ForbiddenException("You're not a member of this course");
    }
  }
}
