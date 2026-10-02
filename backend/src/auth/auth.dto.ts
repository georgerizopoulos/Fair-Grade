import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import type { Role } from '../generated/prisma/client.js';

// Upper bounds keep a single request from carrying megabytes of "password".
export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEmail()
  @MaxLength(254)
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password: string;

  @IsIn(['instructor', 'ta'])
  role: Role;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(254)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  password: string;
}
