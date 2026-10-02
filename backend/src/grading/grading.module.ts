import { Module } from '@nestjs/common';
import { GradingRunService } from './grading-run.service.js';
import { GradingController } from './grading.controller.js';

// Shared by Γιώργος (grading.controller.ts, API_SPEC #13) and Κώστας
// (grading.service.ts, llm.client.ts, prompt.ts, deviation.ts). Already wired
// into app.module.ts.
@Module({
  controllers: [GradingController],
  providers: [GradingRunService],
})
export class GradingModule {}
