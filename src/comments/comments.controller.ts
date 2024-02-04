import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  ForbiddenException,
  HttpCode,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  createCommentSchema,
} from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/users/entities/user.entity';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCommentSchema))
    createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @User() user: UserEntity,
  ) {
    return this.commentsService.create(createCommentDto, postId, user);
  }

  @Get()
  @Public()
  findAll(@Param('postId') postId: string) {
    return this.commentsService.findAll(postId);
  }

  @Put(':commentId')
  async update(
    @Body(new ZodValidationPipe(createCommentSchema))
    updateCommentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
    @User() user: UserEntity,
  ) {
    try {
      const comment = await this.commentsService.update(
        commentId,
        updateCommentDto,
        user,
      );

      if (!comment) {
        throw new NotFoundException('Comment not found');
      }

      return comment;
    } catch (error) {
      if (error.message === 'Unauthorized') {
        throw new ForbiddenException("This comment isn't owned by user");
      } else {
        throw error;
      }
    }
  }

  @Delete(':commentId')
  @HttpCode(204)
  async remove(
    @Param('commentId') commentId: string,
    @User() user: UserEntity,
  ) {
    try {
      const comment = await this.commentsService.remove(commentId, user);
      console.log(comment);

      if (comment == null) {
        throw new NotFoundException('Comment not found');
      }
    } catch (error) {
      if (error.message === 'Unauthorized') {
        throw new ForbiddenException("This comment isn't owned by user");
      } else {
        throw error;
      }
    }
  }
}
