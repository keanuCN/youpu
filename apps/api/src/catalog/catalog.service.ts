import { Injectable, NotFoundException } from '@nestjs/common';
import {
  computeComposite,
  formatSpecValue,
  parseSpecSchema,
  type CategoryTreeNode,
  type ProductDetail,
  type ProductListItem,
  type ProductListResponse,
  type SpecSchema,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';

export const PRODUCT_SORTS = ['hot', 'new', 'rating'] as const;
export type ProductSort = (typeof PRODUCT_SORTS)[number];

export interface ListProductsParams {
  category?: string;
  brand?: string;
  sort?: ProductSort;
  page?: number;
  pageSize?: number;
}

export type CatalogProductListRow = Prisma.ProductGetPayload<{
  include: {
    brand: { select: { slug: true; name: true; nameCn: true } };
    category: { select: { id: true; slug: true; specSchema: true } };
    stat: { select: { view7d: true; viewTotal: true } };
  };
}>;

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryTree(): Promise<CategoryTreeNode[]> {
    const categories = await this.prisma.category.findMany({
      where: { status: 'active' },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
      select: { id: true, parentId: true, slug: true, name: true, level: true, coverUrl: true },
    });
    type Node = CategoryTreeNode;
    const byId = new Map<string, Node>(categories.map((c) => [c.id, { ...c, children: [] }]));
    const roots: Node[] = [];
    for (const node of byId.values()) {
      const parent = node.parentId ? byId.get(node.parentId) : undefined;
      if (parent) parent.children.push(node);
      else roots.push(node);
    }
    return roots;
  }

  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({ where: { slug } });
    if (!category || category.status !== 'active') throw new NotFoundException(`类目不存在：${slug}`);
    return {
      id: category.id,
      slug: category.slug,
      name: category.name,
      level: category.level,
      specSchema: category.specSchema ? parseSpecSchema(category.specSchema) : null,
    };
  }

  async listProducts(params: ListProductsParams): Promise<ProductListResponse> {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 12));
    const where: Prisma.ProductWhereInput = { status: 'published' };
    if (params.category) where.category = { slug: params.category };
    if (params.brand) where.brand = { slug: params.brand };

    const orderBy = this.buildOrderBy(params.sort ?? 'hot');

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          brand: { select: { slug: true, name: true, nameCn: true } },
          category: { select: { id: true, slug: true, specSchema: true } },
          stat: { select: { view7d: true, viewTotal: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: rows.map(serializeProductListItem),
    };
  }

  async getProductBySlug(slug: string): Promise<ProductDetail> {
    const product = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        brand: true,
        category: true,
        images: { orderBy: { sortOrder: 'asc' } },
        stat: { select: { view7d: true, viewTotal: true } },
      },
    });
    if (!product || product.status !== 'published') throw new NotFoundException(`产品不存在：${slug}`);

    const specSchema = product.category.specSchema ? parseSpecSchema(product.category.specSchema) : null;
    const specs = (product.specs ?? {}) as Record<string, unknown>;

    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      model: product.model,
      year: product.year,
      oneLiner: product.oneLiner,
      priceMin: product.priceMin === null ? null : Number(product.priceMin),
      priceMax: product.priceMax === null ? null : Number(product.priceMax),
      priceCurrency: product.priceCurrency,
      coverUrl: product.coverUrl,
      ratingOverall: product.ratingOverall === null ? null : Number(product.ratingOverall),
      ratingCount: product.ratingCount,
      ratingSub: (product.ratingSub ?? null) as Record<string, number> | null,
      editorialScores: (product.editorialScores ?? null) as Record<string, number> | null,
      composite: specSchema
        ? computeComposite(specSchema, (product.editorialScores ?? null) as Record<string, number> | null)
        : null,
      favoriteCount: product.favoriteCount,
      brand: {
        slug: product.brand.slug,
        name: product.brand.name,
        nameCn: product.brand.nameCn,
        country: product.brand.country,
        officialUrl: product.brand.officialUrl,
      },
      category: { slug: product.category.slug, name: product.category.name },
      images: product.images.map((img) => ({
        url: img.url,
        kind: img.kind,
        alt: img.alt,
        source: img.source,
      })),
      specs,
      /** 前端参数表 / 客观分析区按此动态渲染（新增品类零改动） */
      specSchema,
      /** 参数表展示行：schema 顺序 + 人类可读格式化 + 分组 */
      specRows: specSchema
        ? specSchema.fields.map((field) => ({
            key: field.key,
            label: field.label,
            group: field.group,
            value: formatSpecValue(field, specs[field.key]),
            raw: specs[field.key] ?? null,
            type: field.type,
          }))
        : [],
    };
  }

  private buildOrderBy(sort: ProductSort): Prisma.ProductOrderByWithRelationInput[] {
    switch (sort) {
      case 'new':
        return [{ year: 'desc' }, { publishedAt: 'desc' }];
      case 'rating':
        return [{ ratingOverall: { sort: 'desc', nulls: 'last' } }, { ratingCount: 'desc' }];
      case 'hot':
      default:
        return [
          { stat: { view7d: 'desc' } },
          { favoriteCount: 'desc' },
          { ratingOverall: { sort: 'desc', nulls: 'last' } },
        ];
    }
  }
}

export function serializeProductListItem(row: CatalogProductListRow): ProductListItem {
  const schema = row.category.specSchema ? parseSpecSchema(row.category.specSchema) : null;
  const editorialScores = (row.editorialScores ?? null) as Record<string, number> | null;
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    model: row.model,
    year: row.year,
    oneLiner: row.oneLiner,
    priceMin: row.priceMin === null ? null : Number(row.priceMin),
    priceMax: row.priceMax === null ? null : Number(row.priceMax),
    priceCurrency: row.priceCurrency,
    coverUrl: row.coverUrl,
    ratingOverall: row.ratingOverall === null ? null : Number(row.ratingOverall),
    ratingCount: row.ratingCount,
    favoriteCount: row.favoriteCount,
    composite: schema ? computeComposite(schema, editorialScores) : null,
    brand: row.brand,
    categorySlug: row.category.slug,
    // §13 防盗爬：列表页不返回全量 specs，只带非 nested 的标量字段
    specs: pickListSpecs(schema, row.specs),
    // 卡片展示用的已格式化参数摘要（服务端按 schema 生成，前端零 hardcode）
    highlights: buildHighlights(schema, row.specs),
  };
}

function pickListSpecs(schema: SpecSchema | null, raw: unknown): Record<string, unknown> {
  const specs = (raw ?? {}) as Record<string, unknown>;
  if (!schema) return {};
  const out: Record<string, unknown> = {};
  for (const field of schema.fields) {
    if (field.type === 'nested') continue;
    if (specs[field.key] !== undefined) out[field.key] = specs[field.key];
  }
  return out;
}

/** 卡片参数摘要：取 order 最靠前的至多 4 个可筛选字段，服务端格式化 */
function buildHighlights(schema: SpecSchema | null, raw: unknown): Array<{ key: string; label: string; value: string }> {
  const specs = (raw ?? {}) as Record<string, unknown>;
  if (!schema) return [];
  return schema.fields
    .filter((field) => field.filter !== false && field.type !== 'nested' && specs[field.key] !== undefined)
    .slice(0, 4)
    .map((field) => ({ key: field.key, label: field.label, value: formatSpecValue(field, specs[field.key]) }));
}
