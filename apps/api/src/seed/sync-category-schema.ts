import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parse as parseYaml } from 'yaml';
import { categorySeedSchema, parseSpecSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

function readCategorySlug(): string {
  const args = process.argv.slice(2);
  const index = args.indexOf('--category');
  const slug = index >= 0 ? args[index + 1] : undefined;
  if (!slug || slug.startsWith('--')) {
    throw new Error('用法：seed:category-schema -- --category <category-slug>');
  }
  return slug;
}

async function main(): Promise<void> {
  const slug = readCategorySlug();
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const rawCategories = parseYaml(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[];
  const rawCategory = rawCategories.find(
    (item): item is Record<string, unknown> => Boolean(item && typeof item === 'object' && 'slug' in item && item.slug === slug),
  );
  if (!rawCategory) throw new Error(`categories.yaml 中不存在类目：${slug}`);

  const seed = categorySeedSchema.parse(rawCategory);
  if (!seed.spec_schema) throw new Error(`类目没有规格模板：${slug}`);
  const specSchema = parseSpecSchema(seed.spec_schema);
  const prisma = new PrismaService();

  try {
    await prisma.$connect();
    const existing = await prisma.category.findUnique({ where: { slug }, select: { id: true } });
    if (!existing) throw new Error(`本地数据库中不存在类目：${slug}`);
    await prisma.category.update({ where: { slug }, data: { specSchema: toJsonInput(specSchema) } });
    console.log(`类目规格模板已同步：${slug}（${specSchema.fields.length} 个字段）`);
  } finally {
    await prisma.$disconnect();
  }
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
