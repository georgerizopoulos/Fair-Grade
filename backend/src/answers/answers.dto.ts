import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class AnswerItemDto {
  @IsString()
  @IsNotEmpty()
  studentIdAnon!: string;

  @IsString()
  @IsNotEmpty()
  answerText!: string;
}

export class BulkAnswersDto {
  @IsString()
  @IsNotEmpty()
  rubricId!: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AnswerItemDto)
  answers!: AnswerItemDto[];
}

export class ListAnswersQuery {
  @IsString()
  @IsNotEmpty()
  rubricId!: string;
}
