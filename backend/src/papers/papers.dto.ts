import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class AnswerEdit {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  // The TA's fix of the transcribed (or typed) answer.
  @IsOptional()
  @IsString()
  transcription?: string;

  // 0 to the question's max in 0.5 steps (checked in the service, which knows
  // the max). null clears it.
  @IsOptional()
  @ValidateIf((_, v) => v !== null)
  @IsNumber()
  @Min(0)
  taPoints?: number | null;
}

// PATCH /papers/:id: save the draft. Only the questions you send change.
export class UpdatePaperDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => AnswerEdit)
  answers: AnswerEdit[];
}

export class MyPapersQuery {
  @IsOptional()
  @IsIn(['all', 'drafts', 'submitted'])
  filter?: 'all' | 'drafts' | 'submitted';

  // Search by student ID (contains, case-insensitive).
  @IsOptional()
  @IsString()
  q?: string;
}
