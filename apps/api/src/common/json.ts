import type { Prisma } from './db';

/** zod 解析产物 → Prisma Json 输入：结构上必为合法 JSON，类型层面做一次桥接 */
export function toJsonInput(value: unknown): Prisma.InputJsonValue {
  return value as Prisma.InputJsonValue;
}
