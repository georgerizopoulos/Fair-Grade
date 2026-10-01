import { Module } from '@nestjs/common';
import { ExamsController } from './exams.controller.js';
import { ExamsService } from './exams.service.js';
import {
  QUESTIONS_IMPORTER,
  UnavailableQuestionsImporter,
} from './questions-importer.js';

@Module({
  controllers: [ExamsController],
  providers: [
    ExamsService,
    { provide: QUESTIONS_IMPORTER, useClass: UnavailableQuestionsImporter },
  ],
})
export class ExamsModule {}
