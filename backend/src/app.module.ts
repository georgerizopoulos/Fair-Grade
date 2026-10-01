import { Module } from '@nestjs/common';
import { AnswersModule } from './answers/answers.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DeviationModule } from './deviation/deviation.module.js';
import { GradingModule } from './grading/grading.module.js';
import { HealthModule } from './health/health.module.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { ResultsModule } from './results/results.module.js';
import { RubricsModule } from './rubrics/rubrics.module.js';
import { TaGradesModule } from './ta-grades/ta-grades.module.js';
import { UsersModule } from './users/users.module.js';

// Owned by Γιώργος. Every feature module is already listed here, so nobody
// else needs to edit this file.
@Module({
  imports: [
    PrismaModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RubricsModule,
    AnswersModule,
    TaGradesModule,
    GradingModule,
    ResultsModule,
    DeviationModule,
  ],
})
export class AppModule {}
