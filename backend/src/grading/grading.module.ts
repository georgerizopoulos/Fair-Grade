import { Module } from '@nestjs/common';

// Shared by Γιώργος (grading.controller.ts, API_SPEC #13) and Κώστας
// (grading.service.ts, llm.client.ts, prompt.ts, deviation.ts). Already wired
// into app.module.ts.
@Module({
  controllers: [],
  providers: [],
})
export class GradingModule {}
