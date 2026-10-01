import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class TaGradeItemDto {
  @IsString()
  @IsNotEmpty()
  answerId!: string;

  @IsString()
  @IsNotEmpty()
  criterionId!: string;

  @IsNumber()
  @Min(0)
  pointsGiven!: number;
}

export class BulkTaGradesDto {
  @IsString()
  @IsOptional()
  taId?: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => TaGradeItemDto)
  grades!: TaGradeItemDto[];
}

export class ListTaGradesQuery {
  @IsString()
  @IsNotEmpty()
  rubricId!: string;

  @IsString()
  @IsOptional()
  taId?: string;
}
