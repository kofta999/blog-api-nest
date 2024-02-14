import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { FindAllResource } from 'src/shared/interfaces/FindAllResource';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, userId: string): Promise<Post> {
    const post = new Post();
    post.content = createPostDto.content;
    post.title = createPostDto.title;
    post.userId = userId;

    await this.postsRepository.save(post);

    return post;
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
  ): Promise<FindAllResource<Post>> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const [data, total] = await this.postsRepository.findAndCount({
      take: limit,
      skip: (page - 1) * limit,
      order: { createdAt: 'DESC' },
    });

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      totalPages,
      limit,
      currPage: page,
      nextPage: page === totalPages ? null : page + 1,
      prevPage: page === 1 ? null : page - 1,
    };
  }

  async findOne(id: string, options: FindOneOptions<Post> = {}): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      ...options,
    });

    if (!post) {
      throw new ServiceError(ServiceErrorKey.NotFound);
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
    userId: string,
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
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (userId !== postToUpdate.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
    }

    const updatedPost = await this.postsRepository.save({
      ...postToUpdate,
      ...updatePostDto,
    });

    return updatedPost;
  }

  async remove(id: string, userId: string): Promise<void> {
    const existingPost = await this.postsRepository.findOne({
      where: {
        id,
      },
      select: {
        userId: true,
      },
    });

    if (!existingPost) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (userId !== existingPost.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
    }

    await this.postsRepository.delete({ id });
  }
}
