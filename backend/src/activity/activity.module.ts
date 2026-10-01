import { Global, Module } from '@nestjs/common';
import { ActivityService } from './activity.service.js';

// Global: any module can inject ActivityService to write feed entries.
// Owned by Δημήτρης (GET /courses/:id/activity goes here too).
@Global()
@Module({
  providers: [ActivityService],
  exports: [ActivityService],
})
export class ActivityModule {}
