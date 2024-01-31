import { z } from 'zod';
import { createUserSchema } from './create-user.dto';

const createUserShape = createUserSchema.shape;
export const loginUserSchema = z
  .object({
    email: createUserShape.email.optional(),
    username: createUserShape.username.optional(),
    password: createUserShape.password,
  })
  .refine((data) => Boolean(data.email) !== Boolean(data.username), {
    message: 'Only email or username should be provided, not both',
  });

export type LoginUserDto = z.infer<typeof loginUserSchema>;
