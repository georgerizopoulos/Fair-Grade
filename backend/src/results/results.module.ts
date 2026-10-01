import { Module } from '@nestjs/common';
import { ResultsController } from './results.controller.js';
import { ResultsService } from './results.service.js';

// Owned by Δημήτρης. Already wired into app.module.ts.
@Module({
  controllers: [ResultsController],
  providers: [ResultsService],
})
export class ResultsModule {}
