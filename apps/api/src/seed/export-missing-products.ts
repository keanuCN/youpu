import 'dotenv/config';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PrismaService } from '../common/prisma.service';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';

function readArgs(): { category?: string; apply: boolean } {
  const args = process.argv.slice(2);
  const categoryIndex = args.indexOf('--category');
  const category = categoryIndex >= 0 ? args[categoryIndex + 1] : undefined;
  if (categoryIndex >= 0 && (!category || category.startsWith('--'))) {
    throw new Error('--category 后需要类目 slug');
  }
  return { category, apply: args.includes('--apply') };
}

function readSeedSlugs(dataDir: string): Set<string> {
  const slugs = new Set<string>();
  for (const entry of readdirSync(dataDir, { withFileTypes: true })) {
    if (!entry.isDirectory() || ['raw', 'tmp'].includes(entry.name)) continue;
    const categoryDir = join(dataDir, entry.name);
    for (const filename of readdirSync(categoryDir)) {
      if (!/\.ya?ml$/i.test(filename)) continue;
      const parsed = parseYaml(readFileSync(join(categoryDir, filename), 'utf8')) as { slug?: unknown };
      if (typeof parsed?.slug === 'string') slugs.add(parsed.slug);
    }
  }
  return slugs;
}

function toSeed(product: any, source: any) {
  const seed: Record<string, unknown> = {
    slug: product.slug,
    category: product.category.slug,
    brand: product.brand.slug,
    model: product.model,
    year: product.year,
    title: product.title,
    specs: product.specs ?? {},
    images: product.images.map((image: any) => ({
      url: image.url,
      kind: image.kind,
      ...(image.alt ? { alt: image.alt } : {}),
      ...(image.source ? { source: image.source } : {}),
      sort_order: image.sortOrder,
    })),
    status: product.status,
  };
  if (product.oneLiner) seed.one_liner = product.oneLiner;
  if (product.priceMin !== null && product.priceMax !== null) {
    seed.price = {
      min: Number(product.priceMin),
      max: Number(product.priceMax),
      currency: product.priceCurrency,
    };
  }
  if (product.editorialScores && typeof product.editorialScores === 'object') {
    seed.editorial_scores = product.editorialScores;
  }
  if (source && ['official', 'manual', 'crawl'].includes(source.kind)) {
    const dataSource: Record<string, string> = { kind: source.kind };
    if (typeof source.originUrl === 'string' && /^https?:\/\//i.test(source.originUrl)) {
      dataSource.origin_url = source.originUrl;
    }
    if (typeof source.snapshotUrl === 'string' && /^https?:\/\//i.test(source.snapshotUrl)) {
      dataSource.snapshot_url = source.snapshotUrl;
    }
    seed.data_source = dataSource;
  }
  return seed;
}

async function main(): Promise<void> {
  const { category, apply } = readArgs();
  const dataDir = resolve(process.env.DATA_DIR ?? '../../data');
  const seededSlugs = readSeedSlugs(dataDir);
  const prisma = new PrismaService();

  try {
    await prisma.$connect();
    const products = await prisma.product.findMany({
      where: { status: 'published', ...(category ? { category: { slug: category } } : {}) },
      include: { brand: true, category: true, images: { orderBy: { sortOrder: 'asc' } } },
      orderBy: [{ category: { slug: 'asc' } }, { slug: 'asc' }],
    });
    const missing = products.filter((product) => !seededSlugs.has(product.slug));
    const sourceIds = [...new Set(missing.map((product) => product.dataSource).filter((id): id is string => Boolean(id)))];
    const sources = await prisma.dataSource.findMany({ where: { id: { in: sourceIds } } });
    const sourceById = new Map(sources.map((source) => [source.id, source]));

    console.log(`数据库已发布商品 ${products.length} 款；仓库种子缺失 ${missing.length} 款${category ? `（${category}）` : ''}。`);
    if (missing.length === 0) return;
    for (const product of missing) {
      const source = product.dataSource ? sourceById.get(product.dataSource) : undefined;
      if (!source) console.warn(`来源记录缺失：${product.slug}；导出时会保留其他数据库字段。`);
      const outputDir = join(dataDir, product.category.slug);
      const outputFile = join(outputDir, `${product.slug}.yaml`);
      if (existsSync(outputFile)) throw new Error(`目标文件已存在，停止避免覆盖：${outputFile}`);
      if (apply) {
        mkdirSync(outputDir, { recursive: true });
        writeFileSync(outputFile, stringifyYaml(toSeed(product, source)), 'utf8');
      }
      console.log(`${apply ? '已导出' : '待导出'}：${product.slug}${product.images.length ? `（${product.images.length} 张图）` : '（无图）'}`);
    }
    if (!apply) console.log('预览模式未写文件；确认目标无误后追加 --apply 执行。');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
