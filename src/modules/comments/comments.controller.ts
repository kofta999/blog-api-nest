import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  Query,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import {
  CreateCommentDto,
  createCommentSchema,
} from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { User } from 'src/modules/auth/decorators/user.decorator';
import { ZodValidationPipe } from 'src/shared/pipes/validation.pipe';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { UserPayload } from 'src/shared/interfaces/UserPayload';

@Controller('posts/:postId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  create(
    @Body(new ZodValidationPipe(createCommentSchema))
    createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @User() { userId }: UserPayload,
  ) {
    return this.commentsService.create(createCommentDto, postId, userId);
  }

  @Get()
  @Public()
  findAll(
    @Param('postId') postId: string,
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    return this.commentsService.findAll(postId, page, limit);
  }

  @Put(':commentId')
  update(
    @Body(new ZodValidationPipe(createCommentSchema))
    updateCommentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
    @User() { userId }: UserPayload,
  ) {
    return this.commentsService.update(commentId, updateCommentDto, userId);
  }

  @Delete(':commentId')
  @HttpCode(204)
  remove(
    @Param('commentId') commentId: string,
    @User() { userId }: UserPayload,
  ) {
    return this.commentsService.remove(commentId, userId);
  }
}
