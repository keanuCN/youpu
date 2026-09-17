import { z } from 'zod';
import { riderProfileSchema } from './survey';

const passwordSchema = z.string().min(6, '密码至少 6 位').max(128, '密码不能超过 128 位');
const emailSchema = z.string().trim().email('邮箱格式不正确');
const emailCodeSchema = z.string().trim().regex(/^\d{6}$/, '验证码应为 6 位数字');
const emailCodePurposeSchema = z.enum(['register', 'reset-password']);

export const authEmailCodeSchema = z
  .object({
    email: emailSchema,
    purpose: emailCodePurposeSchema,
  })
  .strict();
export type AuthEmailCodeInput = z.infer<typeof authEmailCodeSchema>;

export const authRegisterSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    code: emailCodeSchema,
    nickname: z.string().trim().max(32, '昵称不能超过 32 个字').optional(),
  })
  .strict();
export type AuthRegisterInput = z.infer<typeof authRegisterSchema>;

export const authLoginSchema = z
  .object({ email: emailSchema, password: passwordSchema })
  .strict();
export type AuthLoginInput = z.infer<typeof authLoginSchema>;

export const authRefreshSchema = z.object({ refreshToken: z.string().min(32) }).strict();
export type AuthRefreshInput = z.infer<typeof authRefreshSchema>;

export const authResetPasswordSchema = z
  .object({ email: emailSchema, password: passwordSchema, code: emailCodeSchema })
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
