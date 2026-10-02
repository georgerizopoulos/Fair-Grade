import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import {
  CreatePaperDto,
  MyPapersQuery,
  type PaperPdfUpload,
  RequestReopenDto,
  UpdatePaperDto,
} from './papers.dto.js';
import { PapersService } from './papers.service.js';

// Who may do what is checked in PapersService through AccessService
// (course member / owner, own paper, paper status).
@Controller()
export class PapersController {
  constructor(private readonly papers: PapersService) {}

  @Roles('instructor', 'ta')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 20 * 1024 * 1024, files: 1 },
    }),
  )
  @Post('exams/:id/papers')
  upload(
    @CurrentUser() user: AuthUser,
    @Param('id') examId: string,
    @Body() dto: CreatePaperDto,
    @UploadedFile() file?: PaperPdfUpload,
  ) {
    if (!file) throw new BadRequestException('PDF file is required');
    return this.papers.upload(user, examId, dto, file);
  }

  @Roles('instructor', 'ta')
  @Post('papers/:id/pages/:index/rescan')
  @HttpCode(200)
  rescanPage(
    @CurrentUser() user: AuthUser,
    @Param('id') paperId: string,
    @Param('index', ParseIntPipe) index: number,
  ) {
    return this.papers.rescanPage(user, paperId, index);
  }

  @Get('papers/:id')
  get(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.get(user, id);
  }

  @Roles('ta')
  @Patch('papers/:id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdatePaperDto,
  ) {
    return this.papers.update(user, id, dto);
  }

  @Roles('ta')
  @Post('papers/:id/submit')
  @HttpCode(200)
  submit(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.submit(user, id);
  }

  @Post('papers/:id/request-reopen')
  @HttpCode(200)
  requestReopen(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: RequestReopenDto,
  ) {
    return this.papers.requestReopen(user, id, dto.reason);
  }

  @Roles('instructor')
  @Post('papers/:id/decline-reopen')
  @HttpCode(200)
  declineReopen(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.declineReopen(user, id);
  }

  @Post('papers/:id/reopen')
  @HttpCode(200)
  reopen(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.reopen(user, id);
  }

  @Post('papers/:id/retry-ai')
  @HttpCode(200)
  retryAi(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.retryAi(user, id);
  }

  @Get('exams/:id/my-papers')
  myPapers(
    @CurrentUser() user: AuthUser,
    @Param('id') examId: string,
    @Query() query: MyPapersQuery,
  ) {
    return this.papers.myPapers(user, examId, query);
  }
}
