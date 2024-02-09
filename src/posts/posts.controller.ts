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
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { Public } from 'src/auth/decorators/public.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createPostSchema)) createPostDto: CreatePostDto,
    @User() user: UserEntity,
  ) {
    return this.postsService.create(createPostDto, user);
  }

  @Public()
  @Get()
  findAll(@Query('page') page: number, @Query('limit') limit: number) {
    return this.postsService.findAll(page, limit);
  }

  @Public()
  @Get('/user/:id')
  findByUser(@Param('userId') userId: string) {
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
    @User() user: UserEntity,
  ) {
    return this.postsService.update(id, updatePostDto, user);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @User() user: UserEntity) {
    return this.postsService.remove(id, user);
  }
}
