import { Controller, Get, Query } from '@nestjs/common';
import { IsIn, IsOptional } from 'class-validator';
import { Roles } from '../common/auth.decorators.js';
import type { Role } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';

// Reference endpoint — copy this pattern for your own:
//   - @Roles(...) on the handler → 401 without a token, 403 for the wrong role
//   - a DTO class for @Query()/@Body() → 400 VALIDATION_ERROR naming the field
//   - throw NotFoundException / ConflictException / ... → the error filter
//     turns it into the API_SPEC error shape
//   - return a plain object → JSON response

class ListUsersQuery {
  @IsOptional()
  @IsIn(['instructor', 'ta'])
  role?: Role;
}

@Controller('users')
export class UsersController {
  constructor(private readonly prisma: PrismaService) {}

  // API_SPEC #5
  @Roles('instructor')
  @Get()
  async list(@Query() query: ListUsersQuery) {
    const users = await this.prisma.user.findMany({
      where: query.role ? { role: query.role } : {},
      select: { id: true, name: true, email: true, role: true },
      orderBy: { name: 'asc' },
    });
    return { users };
  }
}
