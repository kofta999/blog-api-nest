import { z } from 'zod';

export const createPostSchema = z
  .object({
    title: z.string().min(5).max(100),
    content: z.string().min(10),
  })
  .required();

export type CreatePostDto = z.infer<typeof createPostSchema>;
