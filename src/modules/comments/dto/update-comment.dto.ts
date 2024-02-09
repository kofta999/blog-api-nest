import { createCommentSchema, CreateCommentDto } from './create-comment.dto';

export const updateCommentSchema = createCommentSchema;
export type UpdateCommentDto = CreateCommentDto;
