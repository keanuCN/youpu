import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parse } from 'yaml';
import { categorySeedSchema, productSeedSchema, parseSpecSchema } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

const EXPECTED_DIMENSIONS = ['response', 'comfort', 'versatility', 'convenience', 'value'];

/** 只同步固定器编辑评分；不触碰社区评分、评论、价格、规格或图片。 */
async function main() {
  const apply = process.argv.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const categorySeeds = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[])
    .map((value) => categorySeedSchema.parse(value));
  const categorySeed = categorySeeds.find((value) => value.slug === 'snowboard-binding');
  if (!categorySeed?.spec_schema) throw new Error('固定器评分模板缺失');
  const expected = parseSpecSchema(categorySeed.spec_schema).rating_dimensions?.map((dim) => dim.key) ?? [];
  if (canonical(expected) !== canonical(EXPECTED_DIMENSIONS)) throw new Error(`固定器评分维度不符：${expected.join(',')}`);

  const seeds = readdirSync(join(dataDir, 'snowboard-binding'))
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => productSeedSchema.parse(parse(readFileSync(join(dataDir, 'snowboard-binding', file), 'utf8'))))
    .filter((seed) => seed.status === 'published');
  if (seeds.length !== 59 || seeds.some((seed) => !seed.editorial_scores)) {
    throw new Error(`发布固定器应为 59 款且均有编辑评分；实际 ${seeds.length} 款`);
  }
  for (const seed of seeds) {
    const scores = seed.editorial_scores!;
    if (canonical(Object.keys(scores).sort()) !== canonical([...EXPECTED_DIMENSIONS].sort())) {
      throw new Error(`评分维度不完整：${seed.slug}`);
    }
    if (Object.values(scores).some((score) => !Number.isFinite(score) || score < 0 || score > 10)) {
      throw new Error(`评分超出 0–10：${seed.slug}`);
    }
  }

  const prisma = new PrismaService();
  try {
    await prisma.$transaction(async (tx) => {
      const category = await tx.category.findUniqueOrThrow({ where: { slug: 'snowboard-binding' } });
      const liveSchema = parseSpecSchema(category.specSchema);
      const liveDimensions = liveSchema.rating_dimensions?.map((dim) => dim.key) ?? [];
      if (canonical(liveDimensions) !== canonical(expected)) throw new Error('线上固定器评分模板与仓库不一致');

      const changes: Array<{ id: string; slug: string; scores: Record<string, number> }> = [];
      for (const seed of seeds) {
        const live = await tx.product.findUniqueOrThrow({ where: { slug: seed.slug }, include: { brand: true } });
        if (live.categoryId !== category.id || live.brand.slug !== seed.brand || live.model !== seed.model || live.year !== seed.year) {
          throw new Error(`线上产品身份不符：${seed.slug}`);
        }
        const scores = seed.editorial_scores!;
        const current = live.editorialScores as Record<string, number> | null;
        if (current && canonical(current) !== canonical(scores)) throw new Error(`线上已有不同编辑评分，请人工复核：${seed.slug}`);
        if (!current) changes.push({ id: live.id, slug: live.slug, scores });
      }
      console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', checked: seeds.length, changed: changes.map((row) => row.slug) }));
      if (!apply) return;
      for (const change of changes) {
        await tx.product.update({ where: { id: change.id }, data: { editorialScores: toJsonInput(change.scores) } });
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: change.id,
            type: 'product.updated',
            payload: { reason: 'binding.editorial-scores-sync', fields: ['editorialScores'] },
          },
        });
      }
    }, { isolationLevel: 'Serializable', timeout: 60000 });
  } finally {
    await prisma.$disconnect();
  }
}

function canonical(value: unknown): string {
  return JSON.stringify(value, (_, item) => item && typeof item === 'object' && !Array.isArray(item)
    ? Object.fromEntries(Object.entries(item).sort(([a], [b]) => a.localeCompare(b)))
    : item);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
