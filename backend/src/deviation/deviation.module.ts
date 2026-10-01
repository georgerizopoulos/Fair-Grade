import { Module } from '@nestjs/common';
import { DeviationController } from './deviation.controller.js';
import { DeviationService } from './deviation.service.js';

// Owned by Δημήτρης. Already wired into app.module.ts.
@Module({
  controllers: [DeviationController],
  providers: [DeviationService],
})
export class DeviationModule {}
