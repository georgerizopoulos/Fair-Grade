import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
import type { Request } from 'express';
import {
  type AuthUser,
  CurrentUser,
  Public,
} from '../common/auth.decorators.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { AuthService } from './auth.service.js';

// The client's address, for the abuse limits. Behind a reverse proxy set
// TRUST_PROXY (see main.ts), otherwise this is the proxy's address.
const clientIp = (req: Request) =>
  req.ip ?? req.socket.remoteAddress ?? 'unknown';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // API_SPEC #2
  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto, @Req() req: Request) {
    return this.auth.register(dto, clientIp(req));
  }

  // API_SPEC #3
  @Public()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto, @Req() req: Request) {
    return this.auth.login(dto, clientIp(req));
  }

  // API_SPEC #4. AuthGuard has already loaded the user (or returned 401).
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return user;
  }
}
