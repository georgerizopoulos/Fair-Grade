import { Transform } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';
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
