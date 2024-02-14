import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './entities/bookmark.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectRepository(Bookmark)
    private readonly bookmarkRepository: Repository<Bookmark>,
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}

  async create(userId: string, postId: string): Promise<Bookmark> {
    const user = await this.usersService.findOneById(userId, {
      select: {
        id: true,
      },
    });
    if (!user) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    const post = await this.postsService.findOne(postId, {
      select: {
        id: true,
      },
    });
    if (!post) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    const bookmark = new Bookmark();
    bookmark.userId = userId;
    bookmark.postId = postId;

    return this.bookmarkRepository.save(bookmark);
  }

  async findAll(userId: string): Promise<Bookmark[]> {
    return this.bookmarkRepository.find({
      where: {
        userId,
      },
      select: {
        postId: true,
      },
    });
  }

  async remove(id: number): Promise<void> {
    const bookmark = await this.bookmarkRepository.findOneBy({ id });
    if (!bookmark) throw new ServiceError(ServiceErrorKey.NotFound);

    await this.bookmarkRepository.remove(bookmark);
  }
}
