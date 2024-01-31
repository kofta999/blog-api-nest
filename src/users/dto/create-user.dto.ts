import { z } from 'zod';

export const createUserSchema = z
  .object({
    fullName: z.string().min(5),
    username: z.string().min(5),
    email: z.string().email(),
    password: z
      .string()
      .min(6)
      .refine((pass) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/.test(pass), {
        message:
          'Password should include at least letter and number and has at minimum 6 characters',
      }),
  })
  .required();

export type CreateUserDto = z.infer<typeof createUserSchema>;
