import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Public,
} from '../common/auth.decorators.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // API_SPEC #2
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  // API_SPEC #3
  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  // API_SPEC #4. AuthGuard has already loaded the user (or returned 401).
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
