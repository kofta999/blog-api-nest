import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '../auth/decorators/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('test')
  test(@User() user) {
    return this.usersService.findOneById(user.id);
  }
}
