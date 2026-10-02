import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export interface PaperPdfUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
  size: number;
}

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

export class CreatePaperDto {
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  taId?: string;
}

// POST /papers/:id/request-reopen: an optional note for the instructor.
export class RequestReopenDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MaxLength(500)
  reason?: string;
}
