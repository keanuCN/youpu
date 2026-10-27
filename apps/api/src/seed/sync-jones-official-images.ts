import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { z } from 'zod';
import { PrismaService } from '../common/prisma.service';
import { uuidv7 } from '../common/uuid';

const manifestSchema = z.object({
  checkedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  items: z.array(z.object({
    slug: z.string().regex(/^jones-[a-z0-9-]+$/),
    season: z.enum(['2024/25', '2025/26']),
    sku: z.string().regex(/^J\.(25|26)\.[A-Z]+\.[A-Z]+$/),
    page: z.string().url(), image: z.string().url(),
  })).length(10),
});

async function main() {
  const args = process.argv.slice(2);
  if (args.some((arg) => arg !== '--apply') || args.length > 1) throw new Error('只支持 --apply；不传参数为只读预览');
  const apply = args.includes('--apply');
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');
  const manifest = manifestSchema.parse(JSON.parse(readFileSync(resolve(dataDir, 'raw/snowboard/jones-official-images-2026-10-27.json'), 'utf8')));
  if (new Set(manifest.items.map((item) => item.slug)).size !== manifest.items.length) throw new Error('清单存在重复型号');
  for (const item of manifest.items) {
    const image = new URL(item.image);
    const page = new URL(item.page);
    if (image.protocol !== 'https:' || image.hostname !== 'www.jonessnowboards.com' || !image.pathname.startsWith(`/cdn/shop/files/${item.sku}-`) || page.protocol !== 'https:' || page.hostname !== image.hostname || !page.pathname.startsWith('/products/')) {
      throw new Error(`来源或图片与货号不匹配：${item.slug}`);
    }
  }
  const prisma = new PrismaService();
  await prisma.$connect();
  try {
    const rows = await prisma.product.findMany({
      where: { slug: { in: manifest.items.map((item) => item.slug) } },
      include: { brand: { select: { slug: true } }, category: { select: { slug: true } }, images: true },
    });
    const bySlug = new Map(rows.map((row) => [row.slug, row]));
    const targets = manifest.items.map((item) => {
      const row = bySlug.get(item.slug);
      const expectedYear = item.season === '2024/25' ? 2025 : 2026;
      if (!row || row.brand.slug !== 'jones' || row.category.slug !== 'snowboard' || row.year !== expectedYear || row.status !== 'published' || !item.sku.startsWith(`J.${String(expectedYear).slice(2)}.`)) {
        throw new Error(`生产商品身份不符：${item.slug}`);
      }
      return { item, row, eligible: !row.coverUrl && row.images.length === 0 };
    });
    console.log(JSON.stringify({ mode: apply ? 'apply' : 'preview', eligible: targets.filter((target) => target.eligible).map(({ item }) => item.slug), skipped: targets.filter((target) => !target.eligible).map(({ item }) => item.slug) }, null, 2));
    if (!apply) return;
    await prisma.$transaction(async (tx) => {
      for (const { item, row, eligible } of targets) {
        if (!eligible) continue;
        const updated = await tx.product.updateMany({
          where: { id: row.id, status: 'published', coverUrl: null, images: { none: {} } },
          data: { coverUrl: item.image },
        });
        if (updated.count !== 1) throw new Error(`商品图片状态已变更，请重新预览：${item.slug}`);
        await tx.productImage.create({ data: {
          id: uuidv7(), productId: row.id, url: item.image, kind: 'face', sortOrder: 0,
          alt: `${row.title} 官方整板图`,
          source: `Jones 官方商品页 ${item.page}；${manifest.checkedAt} 核验；展示授权待核`,
        } });
      }
    }, { isolationLevel: 'Serializable', timeout: 30000 });
    console.log('图片同步完成；已有封面和图片未被覆盖。');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
