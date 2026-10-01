import { Module } from '@nestjs/common';
import { AnswersController } from './answers.controller.js';
import { AnswersService } from './answers.service.js';

// Owned by Σταύρος. Wired into app.module.ts.
@Module({
  controllers: [AnswersController],
  providers: [AnswersService],
})
export class AnswersModule {}
