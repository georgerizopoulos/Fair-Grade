import { Module } from '@nestjs/common';
import { AiWorkerService } from './ai-worker.service.js';
import { LlmQuestionGrader, QUESTION_GRADER } from './question-grader.js';

// AI grading of submitted papers. Owned by Κώστας; the worker contract is in
// DOCS/API_SPEC.md → Paper lifecycle.
@Module({
  providers: [
    AiWorkerService,
    { provide: QUESTION_GRADER, useClass: LlmQuestionGrader },
  ],
  exports: [AiWorkerService],
})
export class AiModule {}
