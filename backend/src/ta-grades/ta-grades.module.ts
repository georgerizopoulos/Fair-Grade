import { Module } from '@nestjs/common';
import { TaGradesController } from './ta-grades.controller.js';
import { TaGradesService } from './ta-grades.service.js';

// Owned by Stavros. Wired into app.module.ts.
@Module({
  controllers: [TaGradesController],
  providers: [TaGradesService],
})
export class TaGradesModule {}