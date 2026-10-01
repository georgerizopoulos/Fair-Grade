import { Controller, Get, Param } from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import { ReportsService } from './reports.service.js';

@Controller('exams')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Roles('ta')
  @Get(':id/my-stats')
  myStats(@CurrentUser() user: AuthUser, @Param('id') examId: string) {
    return this.reports.myStats(user, examId);
  }
}