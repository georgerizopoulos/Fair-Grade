import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Roles } from '../common/auth.decorators.js';
import { BulkAnswersDto, ListAnswersQuery } from './answers.dto.js';
import { AnswersService } from './answers.service.js';

@Controller('answers')
export class AnswersController {
  constructor(private readonly service: AnswersService) {}

  @Roles('instructor')
  @Post('bulk')
  create(@Body() dto: BulkAnswersDto) {
    return this.service.bulkCreate(dto);
  }

  @Roles('instructor', 'ta')
  @Get()
  list(@Query() query: ListAnswersQuery) {
    return this.service.list(query.rubricId);
  }
}
