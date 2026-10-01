import { Controller, Get, Param } from '@nestjs/common';
import { Roles } from '../common/auth.decorators.js';
import { DeviationService } from './deviation.service.js';

@Controller('deviation')
export class DeviationController {
  constructor(private readonly deviation: DeviationService) {}

  // API_SPEC #15
  @Roles('instructor')
  @Get(':rubricId')
  get(@Param('rubricId') rubricId: string) {
    return this.deviation.getReport(rubricId);
  }
}
