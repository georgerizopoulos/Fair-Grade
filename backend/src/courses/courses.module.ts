import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { CoursesController } from './courses.controller.js';
import { CoursesService } from './courses.service.js';
import { MembersController } from './members.controller.js';
import { MembersService } from './members.service.js';

@Module({
  imports: [UsersModule],
  controllers: [CoursesController, MembersController],
  providers: [CoursesService, MembersService],
  exports: [CoursesService],
})
export class CoursesModule {}
