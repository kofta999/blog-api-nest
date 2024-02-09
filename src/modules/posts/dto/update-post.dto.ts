import { createPostSchema } from './create-post.dto';
import { z } from 'zod';

export const updatePostSchema = createPostSchema.partial();

export type UpdatePostDto = z.infer<typeof updatePostSchema>;
