import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.dto';
import { ZodValidationPipe } from '../../shared/pipes/validation.pipe';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { UserPayload } from 'src/shared/interfaces/UserPayload';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createPostSchema)) createPostDto: CreatePostDto,
    @User() user: UserPayload,
  ) {
    return this.postsService.create(createPostDto, user.userId);
  }

  @Public()
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postsService.findAll(page, limit);
  }

  @Public()
  @Get('/user/:id')
  findByUser(@Param('userId') { userId }: UserPayload) {
    return this.postsService.findByUser(userId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.postsService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) updatePostDto: UpdatePostDto,
    @User() { userId }: UserPayload,
  ) {
    return this.postsService.update(id, updatePostDto, userId);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @User() { userId }: UserPayload) {
    return this.postsService.remove(id, userId);
  }
}
