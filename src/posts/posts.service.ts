import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ServiceError, ServiceErrorKey } from 'src/errors/service.error';

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
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (user.id !== postToUpdate.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
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
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (user.id !== existingPost.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
    }

    await this.postsRepository.delete({ id });
  }
}
