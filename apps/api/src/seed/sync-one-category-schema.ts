import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { categorySeedSchema, parseSpecSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

async function main(): Promise<void> {
  const slug = process.argv[2];
  if (!slug) throw new Error('用法：seed:category-schema <类目 slug>');

  const source = parseYaml(readFileSync(resolve(process.cwd(), '../../data/categories.yaml'), 'utf8')) as unknown[];
  const raw = source.find((item) => typeof item === 'object' && item !== null && 'slug' in item && item.slug === slug);
  if (!raw) throw new Error(`categories.yaml 中找不到类目：${slug}`);
  const parsed = categorySeedSchema.safeParse(raw);
  if (!parsed.success) throw new Error(`类目 seed 校验失败：${parsed.error.issues.map((issue) => issue.message).join('; ')}`);
  if (!parsed.data.spec_schema) throw new Error(`类目没有规格定义：${slug}`);

  const prisma = new PrismaService();
  try {
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) throw new Error(`数据库中不存在类目：${slug}`);
    const schema = parseSpecSchema(parsed.data.spec_schema);
    await prisma.category.update({ where: { id: existing.id }, data: { specSchema: toJsonInput(schema) } });
    console.log(`单个类目规格定义已同步：${slug}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
