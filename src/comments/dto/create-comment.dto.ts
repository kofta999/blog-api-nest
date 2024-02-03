import { z } from 'zod';

export const createCommentSchema = z.object({
  content: z.string().min(5),
});

export type CreateCommentDto = z.infer<typeof createCommentSchema>;
