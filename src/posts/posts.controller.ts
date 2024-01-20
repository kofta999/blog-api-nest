import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const post = await this.postsService.findOne(id);
    if (!post) {
      throw new NotFoundException(`Post with ID: ${id} is not found`);
    }

    return post;
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
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
