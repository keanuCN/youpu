import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  adminBrandInputSchema,
  adminCategoryInputSchema,
  adminProductInputSchema,
  adminProductPatchSchema,
  adminBrandPatchSchema,
  adminCategoryPatchSchema,
  parseSpecSchema,
  validateSpecs,
  type AdminBrandInput,
  type AdminBrandPatch,
  type AdminCategoryInput,
  type AdminCategoryPatch,
  type AdminProductInput,
  type AdminProductPatch,
  type SpecSchema,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';

export interface AdminProductListQuery {
  search?: string;
  status?: 'draft' | 'published';
  categorySlug?: string;
  brandSlug?: string;
  page?: number;
  pageSize?: number;
}

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async dashboard() {
    const [products, publishedProducts, drafts, brands, categories, recentProducts] = await this.prisma.$transaction([
      this.prisma.product.count(),
      this.prisma.product.count({ where: { status: 'published' } }),
      this.prisma.product.count({ where: { status: 'draft' } }),
      this.prisma.brand.count({ where: { status: 'active' } }),
      this.prisma.category.count({ where: { status: 'active' } }),
      this.prisma.product.findMany({
        orderBy: { updatedAt: 'desc' },
        take: 5,
        select: {
          id: true,
          slug: true,
          title: true,
          model: true,
          year: true,
          status: true,
          updatedAt: true,
          brand: { select: { slug: true, name: true, nameCn: true } },
          category: { select: { slug: true, name: true } },
        },
      }),
    ]);

    return {
      metrics: { products, publishedProducts, drafts, brands, categories },
      recentProducts: recentProducts.map((product) => ({
        ...product,
        updatedAt: product.updatedAt.toISOString(),
      })),
    };
  }

  async listProducts(params: AdminProductListQuery) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    const where: Prisma.ProductWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.categorySlug) where.category = { slug: params.categorySlug };
    if (params.brandSlug) where.brand = { slug: params.brandSlug };
    if (params.search) {
      where.OR = [
        { slug: { contains: params.search, mode: 'insensitive' } },
        { model: { contains: params.search, mode: 'insensitive' } },
        { title: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.product.count({ where }),
      this.prisma.product.findMany({
        where,
        orderBy: [{ updatedAt: 'desc' }, { year: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          brand: { select: { slug: true, name: true, nameCn: true } },
          category: { select: { slug: true, name: true } },
          images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: rows.map((row) => this.serializeProduct(row)),
    };
  }

  async getProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        brand: { select: { slug: true, name: true, nameCn: true } },
        category: { select: { id: true, slug: true, name: true, specSchema: true } },
        images: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException(`产品不存在：${id}`);
    return this.serializeProduct(product, true);
  }

  async createProduct(input: AdminProductInput) {
    const body = adminProductInputSchema.parse(input);
    const [category, brand] = await Promise.all([
      this.prisma.category.findUnique({ where: { slug: body.categorySlug } }),
      this.prisma.brand.findUnique({ where: { slug: body.brandSlug } }),
    ]);
    if (!category) throw new BadRequestException(`类目不存在：${body.categorySlug}`);
    if (!brand) throw new BadRequestException(`品牌不存在：${body.brandSlug}`);
    this.validatePriceRange(body.priceMin, body.priceMax);
    this.validateProductPayload(body, category.specSchema);

    try {
      const product = await this.prisma.$transaction(async (tx) => {
        const dataSourceId = body.dataSource
          ? (
              await tx.dataSource.create({
                data: {
                  id: uuidv7(),
                  brandId: brand.id,
                  originUrl: body.dataSource.originUrl ?? `manual:${body.slug}`,
                  kind: body.dataSource.kind,
                  snapshotUrl: body.dataSource.snapshotUrl,
                },
              })
            ).id
          : null;
        const created = await tx.product.create({
          data: {
            id: uuidv7(),
            slug: body.slug,
            categoryId: category.id,
            brandId: brand.id,
            model: body.model,
            year: body.year,
            title: body.title,
            oneLiner: body.oneLiner,
            priceMin: body.priceMin,
            priceMax: body.priceMax,
            priceCurrency: body.priceCurrency,
            coverUrl: body.coverUrl,
            specs: toJsonInput(body.specs),
            editorialScores: body.editorialScores ? toJsonInput(body.editorialScores) : undefined,
            status: body.status,
            dataSource: dataSourceId,
            publishedAt: body.status === 'published' ? new Date() : null,
          },
        });
        await this.replaceImages(tx, created.id, body.images);
        await tx.productStat.create({ data: { productId: created.id } });
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: created.id,
            type: 'product.updated',
            payload: toJsonInput({ reason: 'admin.create' }),
          },
        });
        return created;
      });
      return this.getProduct(product.id);
    } catch (error) {
      this.throwPrismaConflict(error, '产品 slug 或品牌/型号/年份已存在');
      throw error;
    }
  }

  async updateProduct(id: string, input: AdminProductPatch) {
    const body = adminProductPatchSchema.parse(input);
    const existing = await this.prisma.product.findUnique({
      where: { id },
      include: { category: { select: { specSchema: true } } },
    });
    if (!existing) throw new NotFoundException(`产品不存在：${id}`);

    const categorySlug = body.categorySlug;
    const brandSlug = body.brandSlug;
    const [category, brand] = await Promise.all([
      categorySlug ? this.prisma.category.findUnique({ where: { slug: categorySlug } }) : null,
      brandSlug ? this.prisma.brand.findUnique({ where: { slug: brandSlug } }) : null,
    ]);
    if (categorySlug && !category) throw new BadRequestException(`类目不存在：${categorySlug}`);
    if (brandSlug && !brand) throw new BadRequestException(`品牌不存在：${brandSlug}`);

    const merged = {
      categorySlug: categorySlug ?? (await this.categorySlug(existing.categoryId)),
      brandSlug: brandSlug ?? (await this.brandSlug(existing.brandId)),
      slug: body.slug ?? existing.slug,
      model: body.model ?? existing.model,
      year: body.year ?? existing.year,
      title: body.title ?? existing.title,
      specs: body.specs ?? ((existing.specs ?? {}) as Record<string, unknown>),
      editorialScores:
        body.editorialScores ?? ((existing.editorialScores ?? null) as Record<string, number> | null),
      status: body.status ?? (existing.status as 'draft' | 'published'),
    };
    const schema = category?.specSchema ?? existing.category.specSchema;
    this.validatePriceRange(
      body.priceMin === undefined ? (existing.priceMin === null ? null : Number(existing.priceMin)) : body.priceMin,
      body.priceMax === undefined ? (existing.priceMax === null ? null : Number(existing.priceMax)) : body.priceMax,
    );
    this.validateProductPayload(merged, schema);

    try {
      await this.prisma.$transaction(async (tx) => {
        const nextStatus = body.status ?? existing.status;
        const shouldPublish = nextStatus === 'published';
        const dataSourceId = body.dataSource
          ? (
              await tx.dataSource.create({
                data: {
                  id: uuidv7(),
                  brandId: (brand ?? undefined)?.id ?? existing.brandId,
                  originUrl: body.dataSource.originUrl ?? `manual:${merged.slug}`,
                  kind: body.dataSource.kind,
                  snapshotUrl: body.dataSource.snapshotUrl,
                },
              })
            ).id
          : undefined;
        const productUpdateData: Prisma.ProductUncheckedUpdateInput = {
            ...(body.slug === undefined ? {} : { slug: body.slug }),
            ...(category ? { categoryId: category.id } : {}),
            ...(brand ? { brandId: brand.id } : {}),
            ...(body.model === undefined ? {} : { model: body.model }),
            ...(body.year === undefined ? {} : { year: body.year }),
            ...(body.title === undefined ? {} : { title: body.title }),
            ...(body.oneLiner === undefined ? {} : { oneLiner: body.oneLiner }),
            ...(body.priceMin === undefined ? {} : { priceMin: body.priceMin }),
            ...(body.priceMax === undefined ? {} : { priceMax: body.priceMax }),
            ...(body.priceCurrency === undefined ? {} : { priceCurrency: body.priceCurrency }),
            ...(body.coverUrl === undefined ? {} : { coverUrl: body.coverUrl }),
            ...(body.specs === undefined ? {} : { specs: toJsonInput(body.specs) }),
            ...(body.editorialScores === undefined
              ? {}
              : {
                  editorialScores: body.editorialScores ? toJsonInput(body.editorialScores) : Prisma.DbNull,
                }),
            ...(body.status === undefined ? {} : { status: body.status }),
            ...(dataSourceId === undefined ? {} : { dataSource: dataSourceId }),
            ...(body.status === undefined
              ? {}
              : { publishedAt: shouldPublish ? existing.publishedAt ?? new Date() : null }),
        };
        await tx.product.update({
          where: { id },
          data: productUpdateData,
        });
        if (body.images !== undefined) await this.replaceImages(tx, id, body.images);
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: id,
            type: 'product.updated',
            payload: toJsonInput({ reason: 'admin.update' }),
          },
        });
      });
      return this.getProduct(id);
    } catch (error) {
      this.throwPrismaConflict(error, '产品 slug 或品牌/型号/年份已存在');
      throw error;
    }
  }

  async listBrands() {
    const rows = await this.prisma.brand.findMany({
      orderBy: [{ status: 'asc' }, { name: 'asc' }],
      include: { _count: { select: { products: true } } },
    });
    return rows.map((brand) => ({ ...brand, productCount: brand._count.products }));
  }

  async createBrand(input: AdminBrandInput) {
    const body = adminBrandInputSchema.parse(input);
    try {
      return await this.prisma.brand.create({
        data: {
          id: uuidv7(),
          slug: body.slug,
          name: body.name,
          nameCn: body.nameCn,
          country: body.country,
          logoUrl: body.logoUrl,
          officialUrl: body.officialUrl,
          description: body.description,
          status: body.status,
        },
      });
    } catch (error) {
      this.throwPrismaConflict(error, '品牌 slug 已存在');
      throw error;
    }
  }

  async updateBrand(id: string, input: AdminBrandPatch) {
    const body = adminBrandPatchSchema.parse(input);
    await this.requireBrand(id);
    try {
      return await this.prisma.brand.update({
        where: { id },
        data: {
          ...(body.slug === undefined ? {} : { slug: body.slug }),
          ...(body.name === undefined ? {} : { name: body.name }),
          ...(body.nameCn === undefined ? {} : { nameCn: body.nameCn }),
          ...(body.country === undefined ? {} : { country: body.country }),
          ...(body.logoUrl === undefined ? {} : { logoUrl: body.logoUrl }),
          ...(body.officialUrl === undefined ? {} : { officialUrl: body.officialUrl }),
          ...(body.description === undefined ? {} : { description: body.description }),
          ...(body.status === undefined ? {} : { status: body.status }),
        },
      });
    } catch (error) {
      this.throwPrismaConflict(error, '品牌 slug 已存在');
      throw error;
    }
  }

  async listCategories() {
    const rows = await this.prisma.category.findMany({
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
      include: {
        _count: { select: { products: true, children: true } },
        parent: { select: { id: true, slug: true, name: true } },
      },
    });
    return rows.map((category) => ({
      id: category.id,
      parentId: category.parentId,
      parent: category.parent,
      slug: category.slug,
      name: category.name,
      level: category.level,
      coverUrl: category.coverUrl,
      sortOrder: category.sortOrder,
      status: category.status,
      specSchema: category.specSchema,
      recommendConfig: category.recommendConfig,
      productCount: category._count.products,
      childCount: category._count.children,
    }));
  }

  async createCategory(input: AdminCategoryInput) {
    const body = adminCategoryInputSchema.parse(input);
    const level = await this.levelForParent(body.parentId);
    if (body.specSchema !== undefined && body.specSchema !== null) this.parseCategorySchema(body.specSchema);
    try {
      return await this.prisma.category.create({
        data: {
          id: uuidv7(),
          parentId: body.parentId,
          slug: body.slug,
          name: body.name,
          level,
          coverUrl: body.coverUrl,
          sortOrder: body.sortOrder,
          specSchema: body.specSchema === undefined || body.specSchema === null ? undefined : toJsonInput(body.specSchema),
          recommendConfig:
            body.recommendConfig === undefined || body.recommendConfig === null
              ? undefined
              : toJsonInput(body.recommendConfig),
          status: body.status,
        },
      });
    } catch (error) {
      this.throwPrismaConflict(error, '类目 slug 已存在');
      throw error;
    }
  }

  async updateCategory(id: string, input: AdminCategoryPatch) {
    const body = adminCategoryPatchSchema.parse(input);
    const existing = await this.prisma.category.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`类目不存在：${id}`);
    if (body.parentId === id) throw new BadRequestException('类目不能把自己设为父类目');
    await this.assertParentIsNotDescendant(id, body.parentId);
    const level = body.parentId === undefined ? undefined : await this.levelForParent(body.parentId);
    if (body.specSchema !== undefined && body.specSchema !== null) this.parseCategorySchema(body.specSchema);
    try {
      const categoryUpdateData: Prisma.CategoryUncheckedUpdateInput = {
          ...(body.slug === undefined ? {} : { slug: body.slug }),
          ...(body.name === undefined ? {} : { name: body.name }),
          ...(body.parentId === undefined ? {} : { parentId: body.parentId }),
          ...(level === undefined ? {} : { level }),
          ...(body.coverUrl === undefined ? {} : { coverUrl: body.coverUrl }),
          ...(body.sortOrder === undefined ? {} : { sortOrder: body.sortOrder }),
          ...(body.specSchema === undefined
            ? {}
            : { specSchema: body.specSchema === null ? Prisma.DbNull : toJsonInput(body.specSchema) }),
          ...(body.recommendConfig === undefined
            ? {}
            : {
                recommendConfig:
                  body.recommendConfig === null ? Prisma.DbNull : toJsonInput(body.recommendConfig),
              }),
          ...(body.status === undefined ? {} : { status: body.status }),
      };
      return await this.prisma.category.update({
        where: { id },
        data: categoryUpdateData,
      });
    } catch (error) {
      this.throwPrismaConflict(error, '类目 slug 已存在');
      throw error;
    }
  }

  private validateProductPayload(
    input: Pick<AdminProductInput, 'specs' | 'editorialScores'> & { categorySlug?: string },
    rawSchema: unknown,
  ): void {
    if (!rawSchema) throw new BadRequestException(`类目 ${input.categorySlug ?? ''} 未声明 spec_schema`);
    let schema: SpecSchema;
    try {
      schema = parseSpecSchema(rawSchema);
    } catch (error) {
      throw new BadRequestException(`类目 spec_schema 无效：${(error as Error).message}`);
    }
    const validation = validateSpecs(schema, input.specs);
    if (!validation.ok) {
      throw new BadRequestException({
        message: '产品 specs 校验失败',
        issues: validation.issues,
      });
    }
    if (input.editorialScores) {
      const dimensions = new Set((schema.rating_dimensions ?? []).map((dimension) => dimension.key));
      const unknown = Object.keys(input.editorialScores).filter((key) => !dimensions.has(key));
      if (unknown.length > 0) throw new BadRequestException(`editorialScores 含未声明维度：${unknown.join('、')}`);
    }
  }

  private parseCategorySchema(raw: unknown): SpecSchema {
    try {
      return parseSpecSchema(raw);
    } catch (error) {
      throw new BadRequestException(`specSchema 校验失败：${(error as Error).message}`);
    }
  }

  private validatePriceRange(priceMin: number | null | undefined, priceMax: number | null | undefined): void {
    if (priceMin !== null && priceMin !== undefined && priceMax !== null && priceMax !== undefined && priceMin > priceMax) {
      throw new BadRequestException('最低价不能高于最高价');
    }
  }

  private async assertParentIsNotDescendant(categoryId: string, parentId: string | null | undefined): Promise<void> {
    const visited = new Set<string>();
    let currentId = parentId;
    while (currentId) {
      if (currentId === categoryId) throw new BadRequestException('类目不能把后代设为父类目');
      if (visited.has(currentId)) throw new BadRequestException('类目树已存在循环引用');
      visited.add(currentId);
      const parent = await this.prisma.category.findUnique({ where: { id: currentId }, select: { parentId: true } });
      if (!parent) return;
      currentId = parent.parentId ?? undefined;
    }
  }

  private async replaceImages(
    tx: Prisma.TransactionClient,
    productId: string,
    images: AdminProductInput['images'],
  ): Promise<void> {
    await tx.productImage.deleteMany({ where: { productId } });
    if (images.length === 0) return;
    await tx.productImage.createMany({
      data: images.map((image: AdminProductInput['images'][number]) => ({
        id: uuidv7(),
        productId,
        url: image.url,
        kind: image.kind,
        sortOrder: image.sortOrder,
        alt: image.alt,
        source: image.source,
      })),
    });
  }

  private async levelForParent(parentId: string | null | undefined): Promise<number> {
    if (!parentId) return 1;
    const parent = await this.prisma.category.findUnique({ where: { id: parentId }, select: { level: true } });
    if (!parent) throw new BadRequestException(`父类目不存在：${parentId}`);
    return parent.level + 1;
  }

  private async categorySlug(id: string): Promise<string> {
    const row = await this.prisma.category.findUnique({ where: { id }, select: { slug: true } });
    if (!row) throw new BadRequestException(`产品原类目不存在：${id}`);
    return row.slug;
  }

  private async brandSlug(id: string): Promise<string> {
    const row = await this.prisma.brand.findUnique({ where: { id }, select: { slug: true } });
    if (!row) throw new BadRequestException(`产品原品牌不存在：${id}`);
    return row.slug;
  }

  private async requireBrand(id: string) {
    const brand = await this.prisma.brand.findUnique({ where: { id } });
    if (!brand) throw new NotFoundException(`品牌不存在：${id}`);
    return brand;
  }

  private serializeProduct(row: any, detail = false) {
    const images = row.images?.map((image: any) => ({
      id: image.id,
      url: image.url,
      kind: image.kind,
      alt: image.alt,
      source: image.source,
      sortOrder: image.sortOrder,
    })) ?? [];
    return {
      id: row.id,
      slug: row.slug,
      model: row.model,
      year: row.year,
      title: row.title,
      oneLiner: row.oneLiner,
      priceMin: row.priceMin === null ? null : Number(row.priceMin),
      priceMax: row.priceMax === null ? null : Number(row.priceMax),
      priceCurrency: row.priceCurrency,
      coverUrl: row.coverUrl,
      specs: (row.specs ?? {}) as Record<string, unknown>,
      editorialScores: (row.editorialScores ?? null) as Record<string, number> | null,
      status: row.status,
      dataSource: row.dataSource,
      publishedAt: row.publishedAt?.toISOString?.() ?? null,
      createdAt: row.createdAt?.toISOString?.() ?? null,
      updatedAt: row.updatedAt?.toISOString?.() ?? null,
      brand: row.brand,
      category: row.category,
      imageCount: images.length,
      ...(detail ? { images, specSchema: row.category?.specSchema ?? null } : { coverImage: images[0] ?? null }),
    };
  }

  private throwPrismaConflict(error: unknown, message: string): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException(message);
    }
  }
}
