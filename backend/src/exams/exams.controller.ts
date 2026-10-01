import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import {
  BulkQuestionsDto,
  CreateExamDto,
  PatchExamDto,
} from './exams.dto.js';
import { ExamsService } from './exams.service.js';
import type { SolutionsPdfUpload } from './questions-importer.js';

@Controller()
export class ExamsController {
  constructor(private readonly exams: ExamsService) {}

  @Roles('instructor')
  @Get('courses/:courseId/exams')
  list(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
  ) {
    return this.exams.listByCourse(user, courseId);
  }

  @Roles('instructor')
  @Post('courses/:courseId/exams')
  create(
    @CurrentUser() user: AuthUser,
    @Param('courseId') courseId: string,
    @Body() dto: CreateExamDto,
  ) {
    return this.exams.create(user, courseId, dto);
  }

  @Roles('instructor')
  @Get('exams/:id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.exams.get(user, id);
  }

  @Roles('instructor')
  @Patch('exams/:id')
  patch(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: PatchExamDto,
  ) {
    return this.exams.patch(user, id, dto);
  }

  @Roles('instructor')
  @Get('exams/:id/questions')
  getQuestions(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.exams.getQuestions(user, id);
  }

  @Roles('instructor')
  @Put('exams/:id/questions')
  saveQuestions(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: BulkQuestionsDto,
  ) {
    return this.exams.saveQuestions(user, id, dto);
  }

  @Roles('instructor')
  @UseInterceptors(FileInterceptor('file'))
  @Post('exams/:id/questions/import')
  importQuestions(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @UploadedFile() file?: SolutionsPdfUpload,
  ) {
    if (
      !file ||
      file.mimetype !== 'application/pdf' ||
      !file.originalname.toLowerCase().endsWith('.pdf') ||
      file.buffer.subarray(0, 5).toString() !== '%PDF-'
    ) {
      throw new BadRequestException('file must be a valid PDF');
    }
    return this.exams.importQuestions(user, id, file);
  }
}
