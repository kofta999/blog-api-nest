import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { User } from '../auth/decorators/user.decorator';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @User() userId: string,
    @Body() createBookmarkDto: { postId: string },
  ) {
    return this.bookmarksService.create(userId, createBookmarkDto.postId);
  }

  @Get()
  findAll(@User() userId: string) {
    return this.bookmarksService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(+id);
  }
}
