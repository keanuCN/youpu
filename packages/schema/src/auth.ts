import { z } from 'zod';
import { riderProfileSchema } from './survey';

const passwordSchema = z.string().min(6, '密码至少 6 位').max(128, '密码不能超过 128 位');

export const authRegisterSchema = z
  .object({
    email: z.string().email('邮箱格式不正确'),
    password: passwordSchema,
    nickname: z.string().trim().max(32, '昵称不能超过 32 个字').optional(),
  })
  .strict();
export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z
  .object({ email: z.string().email('邮箱格式不正确'), password: passwordSchema })
  .strict();
export type AuthLoginInput = z.infer<typeof authLoginSchema>;

export const authRefreshSchema = z.object({ refreshToken: z.string().min(32) }).strict();
export type AuthRefreshInput = z.infer<typeof authRefreshSchema>;

export const authResetPasswordSchema = z
  .object({ email: z.string().email('邮箱格式不正确'), password: passwordSchema })
  .strict();
export type AuthResetPasswordInput = z.infer<typeof authResetPasswordSchema>;

export const accountPatchSchema = z
  .object({
    nickname: z.string().trim().min(1).max(32).optional(),
    avatarUrl: z.string().url().nullable().optional(),
    riderProfile: riderProfileSchema.partial().optional(),
  })
  .strict();
export type AccountPatchInput = z.infer<typeof accountPatchSchema>;
