import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { EntityNotFoundError, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { NotPermittedError } from 'src/errors/not-permitted.error';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = new Post();
    post.content = createPostDto.content;
    post.title = createPostDto.title;
    post.userId = user.id;

    await this.postsRepository.save(post);

    return post;
  }

  async findAll(): Promise<Post[]> {
    // TODO: Add pagination
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOneBy({ id });

    if (!post) {
      throw new EntityNotFoundError(Post, 'Post not found');
    }

    return post;
  }

  async findByUser(userId: string): Promise<Post[]> {
    return this.postsRepository.find({
      where: {
        userId: userId,
      },
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
    user: User,
  ): Promise<Post> {
    const postToUpdate = await this.postsRepository.findOne({
      where: {
        id,
      },
      select: {
        userId: true,
        title: true,
        content: true,
      },
    });

    if (!postToUpdate) {
      throw new EntityNotFoundError(Post, 'Post not found');
    }

    if (user.id !== postToUpdate.userId) {
      throw new NotPermittedError('This post is for another user');
    }

    const updatedPost = await this.postsRepository.save({
      ...postToUpdate,
      ...updatePostDto,
    });

    return updatedPost;
  }

  async remove(id: string, user: User): Promise<void> {
    const existingPost = await this.postsRepository.findOne({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingPost) {
      throw new EntityNotFoundError(Post, 'Post not found');
    }

    if (user.id !== existingPost.userId) {
      throw new NotPermittedError('This post is for another user');
    }

    await this.postsRepository.delete({ id });
  }
}
