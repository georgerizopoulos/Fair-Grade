import { Global, Module } from '@nestjs/common';
import { AccessService } from './access.service.js';

// Global: every module can inject AccessService.
@Global()
@Module({
  providers: [AccessService],
  exports: [AccessService],
})
export class AccessModule {}
