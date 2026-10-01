import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';
import type { Role } from '../generated/prisma/client.js';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class ListUsersQuery {
  @IsOptional()
  @IsIn(['instructor', 'ta'])
  role?: Role;
}

// POST /users. `password`: the instructor sets a temporary password (status
// ACTIVE). `invite`: we generate one and return it once (status INVITED until
// the first sign-in).
export class CreateUserDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(trim)
  @IsEmail()
  email: string;

  @IsIn(['instructor', 'ta'])
  role: Role;

  @IsIn(['password', 'invite'])
  mode: 'password' | 'invite';

  @ValidateIf((o: CreateUserDto) => o.mode === 'password')
  @IsString()
  @MinLength(6)
  password?: string;
}

export class UpdateUserDto {
  @IsOptional()
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @Transform(trim)
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsIn(['instructor', 'ta'])
  role?: Role;

  // Deactivate / reactivate. INVITED is set by the system, never by hand.
  @IsOptional()
  @IsIn(['ACTIVE', 'DEACTIVATED'])
  status?: 'ACTIVE' | 'DEACTIVATED';
}
