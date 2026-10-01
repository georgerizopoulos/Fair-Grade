import { Module } from '@nestjs/common';
import { RubricsController } from './rubrics.controller.js';
import { RubricsService } from './rubrics.service.js';

// Owned by Γιώργος. Add your controllers and providers here; this module is
// already wired into app.module.ts.
@Module({
  controllers: [RubricsController],
  providers: [RubricsService],
})
export class RubricsModule {}
