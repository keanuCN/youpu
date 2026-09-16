import { z } from 'zod';
import { riderProfileSchema } from './survey';

const passwordSchema = z.string().min(6, '密码至少 6 位').max(128, '密码不能超过 128 位');
const phoneSchema = z
  .string()
  .trim()
  .regex(/^(?:\+?86)?1[3-9]\d{9}$/, '手机号格式不正确');

export const authPhoneCodeSchema = z.object({ phone: phoneSchema }).strict();
export type AuthPhoneCodeInput = z.infer<typeof authPhoneCodeSchema>;

export const authPhoneLoginSchema = z
  .object({
    phone: phoneSchema,
    code: z.string().trim().regex(/^\d{6}$/, '验证码应为 6 位数字'),
    nickname: z.string().trim().max(32, '昵称不能超过 32 个字').optional(),
  })
  .strict();
export type AuthPhoneLoginInput = z.infer<typeof authPhoneLoginSchema>;

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
