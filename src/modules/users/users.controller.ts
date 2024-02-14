import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '../auth/decorators/user.decorator';
import { UserPayload } from 'src/shared/interfaces/UserPayload';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/:id/follow')
  async follow(
    @User() { userId }: UserPayload,
    @Param('id') followedId: string,
  ) {
    await this.usersService.follow(userId, followedId);
    return {
      message: 'successfully followed',
    };
  }

  @Delete('/:id/follow')
  async unFollow(
    @User() { userId }: UserPayload,
    @Param('id') followedId: string,
  ) {
    await this.usersService.unFollow(userId, followedId);
    return {
      message: 'successfully unfollowed',
    };
  }

  @Public()
  @Get('/:id/followers')
  getFollowers(@Param('id') id: string) {
    return this.usersService.getFollowers(id);
  }

  @Public()
  @Get('/:id/following')
  getFollowing(@Param('id') id: string) {
    return this.usersService.getFollowing(id);
  }
}
