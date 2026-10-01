import { Module } from '@nestjs/common';
import { RubricsController } from './rubrics.controller.js';
import { RubricsService } from './rubrics.service.js';

// Owned by Γιώργος. RubricsService is exported so other modules (grading,
// results, deviation) can load a rubric with its criteria, or get a 404.
@Module({
  controllers: [RubricsController],
  providers: [RubricsService],
  exports: [RubricsService],
})
export class RubricsModule {}
