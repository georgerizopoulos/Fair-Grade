import { Module } from '@nestjs/common';
import { UsersController } from './users.controller.js';

// Owned by Γιώργος. Add your controllers and providers here; this module is
// already wired into app.module.ts.
@Module({
  controllers: [UsersController],
  providers: [],
})
export class UsersModule {}
