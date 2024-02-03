import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  UnauthorizedException,
  HttpCode,
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
  findAll() {
    return this.postsService.findAll();
  }

  @Public()
  @Get('/user/:id')
  findByUser(@Param('userId') userId: string) {
    return this.postsService.findByUser(userId);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }

    return post;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updatePostSchema)) updatePostDto: UpdatePostDto,
    @User() user: UserEntity,
  ) {
    const result = await this.postsService.update(id, updatePostDto, user);
    if (!result) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }

    if (result.error) {
      throw new UnauthorizedException(result.error);
    }

    return { post: result.post };
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id') id: string, @User() user: UserEntity) {
    const result = await this.postsService.remove(id, user);
    if (!result) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }
    if (result.error) {
      throw new UnauthorizedException(result.error);
    }
    return { post: result.post };
  }
}
