import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<Post> {
    return this.postsRepository.save(createPostDto);
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postsRepository.findOneBy({ id });
  }

  async update(id: string, updatePostDto: UpdatePostDto): Promise<Post | null> {
    const updatedPost = await this.postsRepository.preload({
      id,
      ...updatePostDto,
    });
    if (!updatedPost) {
      return null;
    }
    return this.postsRepository.save(updatedPost);
  }

  async remove(id: string): Promise<Post | null> {
    const existingPost = await this.postsRepository.findOneBy({ id });
    if (!existingPost) {
      return null;
    }
    await this.postsRepository.delete({ id });
    return existingPost;
  }
}
