import { z } from 'zod';
import { registerSchema } from './register.dto';

const createUserShape = registerSchema.shape;
export const loginSchema = z
  .object({
    email: createUserShape.email.optional(),
    username: createUserShape.username.optional(),
    password: createUserShape.password,
  })
  .refine((data) => Boolean(data.email) !== Boolean(data.username), {
    message: 'Only email or username should be provided, not both',
  });

export type LoginDto = z.infer<typeof loginSchema>;
