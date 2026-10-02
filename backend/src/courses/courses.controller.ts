import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import {
  ActivityQuery,
  CourseSettingsDto,
  CourseStatsQuery,
  CreateCourseDto,
} from './courses.dto.js';
import { CoursesService } from './courses.service.js';

// Course-level access (owner / member → else 403) is checked inside the
// service through AccessService, not just by role here.
@Controller('courses')
export class CoursesController {
  constructor(private readonly courses: CoursesService) {}

  @Get()
  list(@CurrentUser() user: AuthUser) {
    return this.courses.list(user);
  }

  @Roles('instructor')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCourseDto) {
    return this.courses.create(user, dto);
  }

  @Get(':id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.get(user, id);
  }

  @Roles('instructor')
  @Patch(':id/settings')
  updateSettings(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: CourseSettingsDto,
  ) {
    return this.courses.updateSettings(user, id, dto);
  }

  @Roles('instructor')
  @Get(':id/stats')
  stats(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: CourseStatsQuery,
  ) {
    return this.courses.stats(user, id, query.examId);
  }

  @Roles('instructor')
  @Get(':id/reopen-requests')
  reopenRequests(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.courses.reopenRequests(user, id);
  }

  @Roles('instructor')
  @Get(':id/activity')
  activity(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: ActivityQuery,
  ) {
    return this.courses.activity(user, id, query.limit ?? 20);
  }
}
