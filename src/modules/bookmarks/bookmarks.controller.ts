import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { User } from '../auth/decorators/user.decorator';
import { UserPayload } from 'src/shared/interfaces/UserPayload';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @User() { userId }: UserPayload,
    @Body() createBookmarkDto: { postId: string },
  ) {
    return this.bookmarksService.create(userId, createBookmarkDto.postId);
  }

  @Get()
  findAll(@User() { userId }: UserPayload) {
    return this.bookmarksService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(+id);
  }
}
