import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CriterionInput {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsPositive()
  maxPoints: number;
}

export class CreateRubricDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  courseName: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  questionText: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CriterionInput)
  criteria: CriterionInput[];
}
