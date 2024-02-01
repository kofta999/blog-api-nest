import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto, createPostSchema } from './dto/create-post.dto';
import { UpdatePostDto, updatePostSchema } from './dto/update-post.dto';
import { ZodValidationPipe } from '../pipes/validation.pipe';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createPostSchema))
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.postsService.findAll();
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
  ) {
    const post = await this.postsService.update(id, updatePostDto);
    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }

    return post;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const post = await this.postsService.remove(id);
    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }
    return post;
  }
}
