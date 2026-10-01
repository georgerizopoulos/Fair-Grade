import { Transform, Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateExamDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsDateString()
  @IsOptional()
  heldAt?: string;
}

export class PatchExamDto {
  @Transform(trim)
  @IsString()
  @IsOptional()
  name?: string;

  @IsDateString()
  @IsOptional()
  heldAt?: string | null;

  @IsNumber()
  @Min(0)
  @IsOptional()
  passMark?: number;
}

export class RubricPointDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  text!: string;

  @IsNumber()
  @Min(0)
  points!: number;
}

export class QuestionDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  code!: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  prompt!: string;

  @IsNumber()
  @Min(0)
  maxPoints!: number;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  modelAnswer!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => RubricPointDto)
  rubric!: RubricPointDto[];
}

export class BulkQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions!: QuestionDto[];
}

