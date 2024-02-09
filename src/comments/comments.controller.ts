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
    @User() user: UserEntity,
  ) {
    return this.commentsService.update(commentId, updateCommentDto, user);
  }

  @Delete(':commentId')
  @HttpCode(204)
  remove(@Param('commentId') commentId: string, @User() user: UserEntity) {
    return this.commentsService.remove(commentId, user);
  }
}
