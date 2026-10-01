import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { AccessModule } from './access/access.module.js';
import { AnswersModule } from './answers/answers.module.js';
import { AuthModule } from './auth/auth.module.js';
import { AllExceptionsFilter } from './common/all-exceptions.filter.js';
import { AuthGuard } from './common/auth.guard.js';
import { UserRoleInterceptor } from './common/user-role.interceptor.js';
import { CoursesModule } from './courses/courses.module.js';
import { validationPipe } from './common/validation.pipe.js';
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
    AccessModule,
    HealthModule,
    AuthModule,
    UsersModule,
    RubricsModule,
    AnswersModule,
    TaGradesModule,
    GradingModule,
    ResultsModule,
    DeviationModule,
    CoursesModule,
  ],
  providers: [
    // Registered here rather than in main.ts so tests using AppModule get them too.
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_PIPE, useValue: validationPipe },
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_INTERCEPTOR, useClass: UserRoleInterceptor },
  ],
})
export class AppModule {}
