import { z } from 'zod';

export const createUserSchema = z.object({
  body: z
    .object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string({ required_error: 'Last name is required' }),
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password is too short - should be min 6 characters'),
      passwordConfirmation: z.string({
        required_error: 'Please confirm your password',
      }),
      email: z.string({ required_error: 'Email is required' }).email('Not valid email address'),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password don't match",
      path: ['passwordConfirmation'],
    }),
});

export const verifyUserSchema = z.object({
  params: z.object({
    id: z.string(),
    verificationCode: z.string(),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: 'Email is required',
      })
      .email('Not valid email address'),
  }),
});

export const resetPasswordSchema = z.object({
  params: z.object({
    id: z.string(),
    passwordResetCode: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password is too short - should be min 6 characters'),
      passwordConfirmation: z.string({
        required_error: 'Please confirm your password',
      }),
    })
    .refine((data) => data.password === data.passwordConfirmation, {
      message: "Password don't match",
      path: ['passwordConfirmation'],
    }),
});

export type CreateUserInput = z.TypeOf<typeof createUserSchema>['body'];
export type VerifyUserInput = z.TypeOf<typeof verifyUserSchema>['params'];
export type ForgotPasswordInput = z.TypeOf<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.TypeOf<typeof resetPasswordSchema>;
