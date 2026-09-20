import { z } from 'zod';
import { specSchemaSchema } from './spec-schema';

/**
 * 目录类 API 响应契约（M2「内容层接 API」的接缝）。
 *
 * 约定：
 * - api 侧用这些类型约束 service 返回值（编译期保证不漂移）；
 * - web 侧切到 API 后用它解析响应（运行期同样一份校验）；
 * - 命名与 packages/schema 的领域类型保持独立：这里是**传输形状**，不是库表结构。
 */

export const brandBriefSchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameCn: z.string().nullable().optional(),
});
export type BrandBrief = z.infer<typeof brandBriefSchema>;

export const specHighlightSchema = z.object({
  key: z.string(),
  label: z.string(),
  value: z.string(),
});

export const productListItemSchema = z.object({
  id: z.string(),
  slug: z.string(),
  title: z.string(),
  model: z.string(),
  year: z.number(),
  oneLiner: z.string().nullable(),
  priceMin: z.number().nullable(),
  priceMax: z.number().nullable(),
  priceCurrency: z.literal('CNY'),
  coverUrl: z.string().nullable(),
  ratingOverall: z.number().nullable(),
  ratingCount: z.number(),
  favoriteCount: z.number(),
  /** 综合指数（编辑分项评分按类目权重算出，计算值不落库） */
  composite: z.number().nullable(),
  brand: brandBriefSchema,
  categorySlug: z.string(),
  /** §13 最小返回：列表只带非 nested 的标量参数 */
  specs: z.record(z.string(), z.unknown()),
  /** 卡片摘要，服务端按 spec_schema 格式化 */
  highlights: z.array(specHighlightSchema),
});
export type ProductListItem = z.infer<typeof productListItemSchema>;

export const productListResponseSchema = z.object({
  total: z.number(),
  page: z.number(),
  pageSize: z.number(),
  items: z.array(productListItemSchema),
});
export type ProductListResponse = z.infer<typeof productListResponseSchema>;

export const productImageSchema = z.object({
  url: z.string(),
  kind: z.string(),
  alt: z.string().nullable(),
  source: z.string().nullable(),
});

/** 参数表一行：服务端按 spec_schema 排好序、格式化好，前端零 hardcode */
export const specRowSchema = z.object({
  key: z.string(),
  label: z.string(),
  group: z.string(),
  value: z.string(),
  raw: z.unknown(),
  type: z.string(),
});
export type SpecRow = z.infer<typeof specRowSchema>;

export const productDetailSchema = productListItemSchema
  .omit({ highlights: true, categorySlug: true, specs: true })
  .extend({
    ratingSub: z.record(z.string(), z.number()).nullable(),
    /** 编辑分项评分（键与 rating_dimensions 对齐） */
    editorialScores: z.record(z.string(), z.number()).nullable(),
    brand: brandBriefSchema.extend({
      country: z.string().nullable(),
      officialUrl: z.string().nullable(),
    }),
    category: z.object({ slug: z.string(), name: z.string() }),
    images: z.array(productImageSchema),
    specs: z.record(z.string(), z.unknown()),
    specSchema: specSchemaSchema.nullable(),
    /** 展示行：schema 顺序 + 人类可读格式化 + 分组 */
    specRows: z.array(specRowSchema),
  });
export type ProductDetail = z.infer<typeof productDetailSchema>;

/** 对比页一次读取多件详情；接口仍复用详情契约，避免前端维护第二套参数形状。 */
export const productCompareResponseSchema = z.object({
  items: z.array(productDetailSchema),
});
export type ProductCompareResponse = z.infer<typeof productCompareResponseSchema>;

export const categoryTreeNodeSchema: z.ZodType<CategoryTreeNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    parentId: z.string().nullable(),
    slug: z.string(),
    name: z.string(),
    level: z.number(),
    coverUrl: z.string().nullable(),
    children: z.array(categoryTreeNodeSchema),
  }),
);
export interface CategoryTreeNode {
  id: string;
  parentId: string | null;
  slug: string;
  name: string;
  level: number;
  coverUrl: string | null;
  children: CategoryTreeNode[];
}
