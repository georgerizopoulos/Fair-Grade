import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  type AuthUser,
  CurrentUser,
  Roles,
} from '../common/auth.decorators.js';
import { CreateUserDto, ListUsersQuery, UpdateUserDto } from './users.dto.js';
import { UsersService } from './users.service.js';

// Reference controller — copy this pattern for your own:
//   - @Roles(...) → 401 without a token, 403 for the wrong role
//   - a DTO class for @Query()/@Body() → 400 VALIDATION_ERROR naming the field
//   - throw NotFoundException / ConflictException / ... in the service → the
//     error filter turns it into the API_SPEC error shape
@Roles('instructor')
@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  list(@CurrentUser() user: AuthUser, @Query() query: ListUsersQuery) {
    return this.users.list(user, query.role);
  }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ) {
    return this.users.update(user, id, dto);
  }
}
