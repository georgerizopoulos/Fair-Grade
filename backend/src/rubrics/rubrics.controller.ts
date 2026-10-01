import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../common/auth.decorators.js';
import { CreateRubricDto } from './rubrics.dto.js';
import { RubricsService } from './rubrics.service.js';

@Controller('rubrics')
export class RubricsController {
  constructor(private readonly rubrics: RubricsService) {}

  // API_SPEC #6
  @Roles('instructor')
  @Post()
  create(@Body() dto: CreateRubricDto) {
    return this.rubrics.create(dto);
  }

  // API_SPEC #7
  @Roles('instructor', 'ta')
  @Get()
  list() {
    return this.rubrics.list();
  }

  // API_SPEC #8
  @Roles('instructor', 'ta')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.rubrics.get(id);
  }
}
