import { Module } from '@nestjs/common';
import { PapersController } from './papers.controller.js';
import { PapersService } from './papers.service.js';

// Paper lifecycle (Γιώργος). Upload + pages (POST /exams/:id/papers, rescan)
// are Σταύρος's and go in this module too.
@Module({
  controllers: [PapersController],
  providers: [PapersService],
  exports: [PapersService],
})
export class PapersModule {}
