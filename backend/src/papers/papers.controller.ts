import {
  Body,
  Controller,
  Get,
  HttpCode,
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
import { MyPapersQuery, UpdatePaperDto } from './papers.dto.js';
import { PapersService } from './papers.service.js';

// Who may do what is checked in PapersService through AccessService
// (course member / owner, own paper, paper status).
@Controller()
export class PapersController {
  constructor(private readonly papers: PapersService) {}

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
  requestReopen(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.papers.requestReopen(user, id);
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
