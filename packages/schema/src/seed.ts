import { z } from 'zod';

/**
 * seed / 采集草稿 YAML 契约（技术方案 §4：data/ 目录降级为"初始批量导入格式 + 采集草稿暂存区"）。
 * 导入脚本：YAML → 本 schema → specs 再对类目 spec_schema 校验 → 入库。
 */

export const imageKindSchema = z.enum(['base', 'face', 'side', 'shape', 'field', 'card3x4']);

export const seedImageSchema = z.object({
  url: z.string().url(),
  kind: imageKindSchema,
  alt: z.string().max(256).optional(),
  /** 图片来源标注（版权留痕） */
  source: z.string().max(256).optional(),
  sort_order: z.number().int().default(0),
});

export const seedDataSourceSchema = z.object({
  kind: z.enum(['official', 'manual', 'crawl']),
  origin_url: z.string().url().optional(),
  snapshot_url: z.string().url().optional(),
});

export const productSeedSchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug 需为 kebab-case（URL 即此，全站唯一）'),
  category: z.string().min(1).describe('类目 slug，如 snowboard'),
  brand: z.string().min(1).describe('品牌 slug，如 burton'),
  model: z.string().min(1),
  year: z.number().int().min(2000).max(2100),
  title: z.string().min(1),
  one_liner: z.string().max(200).optional().describe('一句话点评（人写，AI 润色）'),
  price: z
    .object({
      min: z.number().min(0),
      max: z.number().min(0),
      currency: z.string().length(3).default('CNY'),
    })
    .optional(),
  /** 按类目 spec_schema.fields 校验后的参数 */
  specs: z.record(z.string(), z.unknown()),
  /** 编辑分项评分（键 = spec_schema.rating_dimensions[].key，0–10）；综合指数由权重算出，不落库 */
  editorial_scores: z.record(z.string(), z.number().min(0).max(10)).optional(),
  images: z.array(seedImageSchema).default([]),
  data_source: seedDataSourceSchema.optional(),
  status: z.enum(['draft', 'published']).default('draft'),
});
export type ProductSeed = z.infer<typeof productSeedSchema>;

export const brandSeedSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  name_cn: z.string().optional(),
  country: z.string().max(8).optional(),
  logo_url: z.string().url().optional(),
  official_url: z.string().url().optional(),
  description: z.string().optional(),
});
export type BrandSeed = z.infer<typeof brandSeedSchema>;

export const categorySeedSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  name: z.string().min(1),
  /** 父类目 slug，顶层不填 */
  parent: z.string().optional(),
  sort_order: z.number().int().default(0),
  /** 叶子类目必填：见 packages/schema spec-schema.ts */
  spec_schema: z.unknown().optional(),
  recommend_config: z.unknown().optional(),
});
export type CategorySeed = z.infer<typeof categorySeedSchema>;
