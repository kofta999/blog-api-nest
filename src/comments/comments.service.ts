import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { Repository } from 'typeorm';
import { ServiceError, ServiceErrorKey } from 'src/errors/service.error';

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

  async findAll(postId: string) {
    return this.commentsRepository.find({
      where: {
        postId,
      },
    });
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
