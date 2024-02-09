import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/modules/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/shared/errors/service.error';
import { FindAllResource } from 'src/shared/interfaces/FindAllResource';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    user: User,
  ): Promise<Comment> {
    const comment = new Comment();
    comment.content = createCommentDto.content;
    comment.postId = postId;
    comment.userId = user.id;

    return this.commentsRepository.save(comment);
  }

  async findAll(
    postId: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<FindAllResource<Comment>> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);

    const [data, total] = await this.commentsRepository.findAndCount({
      where: {
        postId,
      },
      take: limit,
      skip: (page - 1) * limit,
      order: {
        createdAt: 'DESC',
      },
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

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    const existingComment = await this.commentsRepository.findOne({
      where: { id },
    });
    if (!existingComment) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (user.id !== existingComment.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
    }

    existingComment.content = updateCommentDto.content;

    return this.commentsRepository.save(existingComment);
  }

  async remove(id: string, user: User): Promise<void> {
    const existingComment = await this.commentsRepository.findOne({
      where: { id },
    });

    if (!existingComment) {
      throw new ServiceError(ServiceErrorKey.NotFound);
    }

    if (user.id !== existingComment.userId) {
      throw new ServiceError(ServiceErrorKey.Forbidden);
    }

    await this.commentsRepository.delete({ id });
  }
}
