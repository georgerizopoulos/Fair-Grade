import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { Roles } from '../common/auth.decorators.js';
import { ResultsService } from './results.service.js';

class ResultsQuery {
  @IsOptional()
  @IsString()
  taId?: string;
}

@Controller('grade/results')
export class ResultsController {
  constructor(private readonly results: ResultsService) {}

  // API_SPEC #14
  @Roles('instructor')
  @Get(':rubricId')
  get(@Param('rubricId') rubricId: string, @Query() query: ResultsQuery) {
    return this.results.getResults(rubricId, query.taId);
  }
}
