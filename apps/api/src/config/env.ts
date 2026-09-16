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
  /** 本地 M3 访问令牌签名密钥；上线前必须替换为独立随机密钥。 */
  AUTH_SECRET: z.string().min(16).default('youpu-local-auth-secret-change-me'),
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
