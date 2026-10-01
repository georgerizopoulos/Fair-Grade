import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import { AddMemberDto } from './members.dto.js';
import { MembersService } from './members.service.js';

// Course membership is the only thing that gives a TA access to a course.
@Controller('courses/:courseId/members')
export class MembersController {
  constructor(private readonly members: MembersService) {}

  // Any member of the course can see who else is in it.
  @Get()
  list(@CurrentUser() user: AuthUser, @Param('courseId') courseId: string) {
    return this.members.list(user, courseId);
  }

  @Roles('instructor')
  @Post()
  add(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: AddMemberDto,
  ) {
    return this.members.add(user, courseId, dto);
  }

  @Roles('instructor')
  @Delete(':userId')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Param('userId') userId: string,
  ) {
    return this.members.remove(user, courseId, userId);
  }
}
