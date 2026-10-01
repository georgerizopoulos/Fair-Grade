import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../common/auth.decorators.js';
import { GradingRunService } from './grading-run.service.js';

class RunGradingDto {
  @IsString()
  @IsNotEmpty()
  rubricId: string;
}

@Controller('grade')
export class GradingController {
  constructor(private readonly grading: GradingRunService) {}

  // API_SPEC #13
  @Roles('instructor')
  @Post('run')
  @HttpCode(200)
  run(@Body() dto: RunGradingDto) {
    return this.grading.run(dto.rubricId);
  }
}
