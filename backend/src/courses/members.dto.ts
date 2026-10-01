import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

// POST /courses/:id/members. Either add an existing TA (`userId`), or create
// a TA account and add it (`name` + `email`, with a temporary `password` or,
// without one, as an invite).
export class AddMemberDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  userId?: string;

  @ValidateIf((o: AddMemberDto) => !o.userId)
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ValidateIf((o: AddMemberDto) => !o.userId)
  @Transform(trim)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
