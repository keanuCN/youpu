import 'dotenv/config';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { parse } from 'yaml';
import { categorySeedSchema, productSeedSchema, parseSpecSchema, validateSpecs } from '@youpu/schema';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';

/** 只更新装备规格和类目模板，保留生产价格、状态、图片、评分及社区数据。 */
async function main() {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const index = args.indexOf('--categories');
  const categories = (index >= 0 ? args[index + 1] : 'snowboard,snowboard-binding,snowboard-boot,skis')?.split(',');
  const allowed = new Set(['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis']);
  if (!categories?.length || categories.some(slug => !allowed.has(slug))) throw new Error('只允许同步四个滑雪装备类目');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const categorySeeds = (parse(readFileSync(join(dataDir, 'categories.yaml'), 'utf8')) as unknown[])
    .map(value => categorySeedSchema.parse(value)).filter(seed => categories.includes(seed.slug));
  const products = categories.flatMap(category => readdirSync(join(dataDir, category))
    .filter(file => file.endsWith('.yaml')).map(file => productSeedSchema.parse(parse(readFileSync(join(dataDir, category, file), 'utf8')))));
  for (const category of categories) {
    const seed = categorySeeds.find(seed => seed.slug === category);
    if (!seed?.spec_schema) throw new Error(`类目模板缺失：${category}`);
    const specSchema = parseSpecSchema(seed.spec_schema);
    for (const product of products.filter(product => product.category === category)) {
      const result = validateSpecs(specSchema, product.specs);
      if (!result.ok) throw new Error(`${product.slug}: ${JSON.stringify(result.issues)}`);
    }
  }
  const prisma = new PrismaService();
  try {
    const onlineCategories = await prisma.category.findMany({ where: { slug: { in: categories } }, select: { id: true, slug: true } });
    if (onlineCategories.length !== categories.length) throw new Error('生产类目缺失');
    const online = await prisma.product.findMany({ where: { slug: { in: products.map(product => product.slug) } },
      select: { id: true, slug: true, categoryId: true, brand: { select: { slug: true } }, model: true, year: true } });
    const bySlug = new Map(online.map(product => [product.slug, product]));
    const missing = products.filter(product => !bySlug.has(product.slug)).map(product => product.slug);
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', categories, products: products.length, existing: online.length, missing }));
    if (missing.length) throw new Error('有产品尚不存在，未执行任何更新；先核对缺失产品');
    for (const seed of products) {
      const product = bySlug.get(seed.slug)!;
      const category = onlineCategories.find(category => category.slug === seed.category)!;
      if (product.categoryId !== category.id || product.brand.slug !== seed.brand || product.model !== seed.model || product.year !== seed.year)
        throw new Error(`生产身份与种子不符：${seed.slug}`);
    }
    if (!apply) return;
    await prisma.$transaction(async tx => {
      for (const seed of categorySeeds) {
        await tx.category.update({ where: { slug: seed.slug }, data: { specSchema: toJsonInput(parseSpecSchema(seed.spec_schema)) } });
      }
      for (const seed of products) {
        const product = await tx.product.update({ where: { slug: seed.slug }, data: { specs: toJsonInput(seed.specs) }, select: { id: true } });
        await tx.outboxEvent.create({ data: { aggregate: 'product', aggregateId: product.id,
          type: 'product.updated', payload: { reason: 'equipment.content-sync' } } });
      }
    }, { timeout: 60000 });
    console.log(`装备规格同步完成：${products.length} 款，${categorySeeds.length} 个模板。`);
  } finally { await prisma.$disconnect(); }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
