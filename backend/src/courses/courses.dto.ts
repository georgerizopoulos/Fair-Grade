import { Transform } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import type { LeaderboardVisibility } from '../generated/prisma/client.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateCourseDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  code: string; // e.g. HY335

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  name: string; // e.g. Computer Networks

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  semester: string; // e.g. Winter 2026–27
}

export class CourseSettingsDto {
  @IsIn(['OFF', 'ANONYMOUS', 'NAMED'])
  leaderboardVisibility: LeaderboardVisibility;
}

// GET /courses/:id/stats?examId= : limit the KPIs, distribution and rubrics to one exam.
export class CourseStatsQuery {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  examId?: string;
}

// GET /courses/:id/activity?limit=
export class ActivityQuery {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    value === undefined ? undefined : Number(value),
  )
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
