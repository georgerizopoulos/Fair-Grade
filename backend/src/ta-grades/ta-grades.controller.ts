import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import { BulkTaGradesDto, ListTaGradesQuery } from './ta-grades.dto.js';
import { TaGradesService } from './ta-grades.service.js';

@Controller('ta-grades')
export class TaGradesController {
  constructor(private readonly service: TaGradesService) {}

  @Roles('instructor', 'ta')
  @Post('bulk')
  save(@CurrentUser() user: AuthUser, @Body() dto: BulkTaGradesDto) {
    return this.service.bulkSave(user, dto);
  }

  @Roles('instructor', 'ta')
  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListTaGradesQuery) {
    return this.service.list(user, query);
  }
}
