import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Roles } from '../common/auth.decorators.js';
import { CreateRubricDto } from './rubrics.dto.js';
import { RubricsService } from './rubrics.service.js';

@Controller('rubrics')
export class RubricsController {
  constructor(private readonly service: RubricsService) {}

  @Roles('instructor')
  @Post()
  create(@Body() dto: CreateRubricDto) {
    return this.service.create(dto);
  }

  @Roles('instructor', 'ta')
  @Get()
  list() {
    return this.service.list();
  }

  @Roles('instructor', 'ta')
  @Get(':id')
  get(@Param('id') id: string) {
    return this.service.get(id);
  }
}