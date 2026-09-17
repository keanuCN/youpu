import { z } from 'zod';

/** 环境变量契约 —— 启动即校验，缺失/格式错直接 fail fast */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().default(3001),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().default('redis://localhost:6379'),
  ES_NODE: z.string().url().optional(),
  ES_INDEX_PREFIX: z.string().default('youpu'),
  CORS_ORIGINS: z
    .string()
    .default('http://localhost:3000,http://localhost:3002,http://127.0.0.1:3000,http://127.0.0.1:3002'),
  DATA_DIR: z.string().default('../../data'),
  /** 单人内测阶段的管理端 Bearer 令牌；生产环境必须显式配置。 */
  ADMIN_TOKEN: z.string().min(16).optional(),
  ADMIN_ROLE: z.enum(['editor', 'admin']).default('admin'),
  /** 当前单令牌后台对应的审计操作人账号；本地未配置时自动使用本地审计账号。 */
  ADMIN_ACTOR_ID: z.string().uuid().optional(),
  /** 本地 M3 访问令牌签名密钥；上线前必须替换为独立随机密钥。 */
  AUTH_SECRET: z.string().min(16).default('youpu-local-auth-secret-change-me'),
  /** 邮箱验证码投递。开发环境未配置时返回 devCode，生产环境会明确报错。 */
  EMAIL_SMTP_HOST: z.string().optional(),
  EMAIL_SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(587),
  EMAIL_SMTP_SECURE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  EMAIL_SMTP_USER: z.string().optional(),
  EMAIL_SMTP_PASSWORD: z.string().optional(),
  EMAIL_FROM: z.preprocess((value) => (value === '' ? undefined : value), z.string().email().optional()),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const detail = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`环境变量校验失败（对照 apps/api/.env.example）：\n${detail}`);
  }
  return parsed.data;
}

export const env: Env = loadEnv();
