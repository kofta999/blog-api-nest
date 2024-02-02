import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postsRepository: Repository<Post>,
  ) {}

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    const post = new Post();
    post.content = createPostDto.content;
    post.title = createPostDto.title;
    post.user = user;

    const newPost = await this.postsRepository.save(post);
    if (newPost && newPost.user) {
      delete newPost.user;
    }

    return newPost;
  }

  async findAll(): Promise<Post[]> {
    return this.postsRepository.find();
  }

  async findOne(id: string): Promise<Post | null> {
    return this.postsRepository.findOneBy({ id });
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
  ): Promise<{ post: Post | null; error: string | null } | null> {
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
      return null;
    }

    if (user.id !== postToUpdate.userId) {
      return {
        post: null,
        error: "This post isn't owned by user",
      };
    }

    const updatedPost = await this.postsRepository.save({
      ...postToUpdate,
      ...updatePostDto,
    });

    return {
      post: updatedPost,
      error: null,
    };
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
