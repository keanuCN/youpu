import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  normalizePriceRange,
  parseSpecSchema,
  validateSpecs,
  type ProductSeed,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';
import {
  applyCollectorChanges,
  assertCollectorChangesStillCurrent,
  parseCollectorImportPayload,
  type ParsedCollectorImport,
} from './admin-import-policy';

type ReviewInput = { decision: 'approve' | 'reject'; note?: string };

@Injectable()
export class AdminImportService {
  constructor(private readonly prisma: PrismaService) {}

  async list(status: 'pending' | 'approved' | 'rejected' = 'pending') {
    return this.prisma.productImport.findMany({
      where: { status },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  async get(id: string) {
    const record = await this.prisma.productImport.findUnique({ where: { id } });
    if (!record) throw new NotFoundException(`导入记录不存在：${id}`);
    return record;
  }

  async stage(payload: unknown, actorId?: string) {
    const parsed = parseCollectorImportPayload(payload);
    await this.validateReferencesAndSpecs(parsed);

    const existing = await this.prisma.product.findUnique({
      where: { slug: parsed.product.slug },
      select: { id: true, categoryId: true, brandId: true, status: true },
    });
    if (parsed.kind === 'new' && existing) throw new ConflictException(`商品已存在：${parsed.product.slug}`);
    if (parsed.kind === 'update' && !existing) throw new NotFoundException(`待更新商品不存在：${parsed.product.slug}`);

    if (parsed.kind === 'new') {
      const duplicate = await this.prisma.product.findFirst({
        where: {
          model: parsed.product.model,
          year: parsed.product.year,
          brand: { slug: parsed.product.brand },
        },
        select: { slug: true },
      });
      if (duplicate) throw new ConflictException(`同品牌型号年份商品已存在：${duplicate.slug}`);
    } else {
      const current = await this.prisma.product.findUnique({
        where: { slug: parsed.product.slug },
        select: { category: { select: { slug: true } }, brand: { select: { slug: true } } },
      });
      if (current?.category.slug !== parsed.product.category || current.brand.slug !== parsed.product.brand) {
        throw new BadRequestException('更新草稿不得修改商品所属类目或品牌');
      }
    }

    const pending = await this.prisma.productImport.findFirst({
      where: { slug: parsed.product.slug, status: 'pending' },
      select: { id: true },
    });
    if (pending) throw new ConflictException(`该商品已有待审核采集记录：${parsed.product.slug}`);

    try {
      return await this.prisma.productImport.create({
        data: {
          id: uuidv7(),
          kind: parsed.kind,
          slug: parsed.product.slug,
          product: toJsonInput(parsed.product),
          changes: toJsonInput(parsed.changes),
          ignoredChanges: toJsonInput(parsed.ignoredChanges),
          originUrl: parsed.source.originUrl,
          status: 'pending',
          submittedBy: actorId,
        },
      });
    } catch (error) {
      if (isUniqueConflict(error)) throw new ConflictException(`该商品已有待审核采集记录：${parsed.product.slug}`);
      throw error;
    }
  }

  async review(id: string, input: ReviewInput, actorId: string) {
    if (!actorId) throw new BadRequestException('审核操作需要已登录的管理员账号');
    const note = input.note?.trim() || null;

    return this.prisma.$transaction(async (tx) => {
      const record = await tx.productImport.findUnique({ where: { id } });
      if (!record) throw new NotFoundException(`导入记录不存在：${id}`);
      if (record.status !== 'pending') throw new ConflictException('该导入记录已处理，不能重复审核');
      const nextStatus = input.decision === 'approve' ? 'approved' : 'rejected';
      const claimed = await tx.productImport.updateMany({
        where: { id, status: 'pending' },
        data: { status: nextStatus, reviewedBy: actorId, reviewNote: note, reviewedAt: new Date() },
      });
      if (claimed.count !== 1) throw new ConflictException('该导入记录已由其他操作处理');

      if (input.decision === 'reject') {
        await tx.auditLog.create({
          data: {
            actorId,
            action: 'reject',
            entity: 'product_import',
            entityId: id,
            before: toJsonInput({ status: 'pending' }),
            after: toJsonInput({ status: 'rejected', slug: record.slug, note }),
          },
        });
        return { id, status: 'rejected', productId: null };
      }

      const product = record.product as unknown as ProductSeed;
      const parsed = parseCollectorImportPayload(
        record.kind === 'update'
          ? {
              kind: 'product-update-draft',
              target: { slug: record.slug },
              source: { originUrl: record.originUrl },
              changes: record.changes,
              ignoredChanges: record.ignoredChanges,
              product,
            }
          : product,
      );
      await this.validateReferencesAndSpecs(parsed, tx);
      let productId: string;
      let before: unknown = null;
      let after: unknown = null;

      if (parsed.kind === 'new') {
        const [category, brand, existing] = await Promise.all([
          tx.category.findUnique({ where: { slug: product.category } }),
          tx.brand.findUnique({ where: { slug: product.brand } }),
          tx.product.findUnique({ where: { slug: product.slug }, select: { id: true } }),
        ]);
        if (!category || !brand) throw new BadRequestException('商品类目或品牌已不存在');
        if (existing) throw new ConflictException(`商品已存在：${product.slug}`);
        const duplicate = await tx.product.findFirst({
          where: { brandId: brand.id, model: product.model, year: product.year },
          select: { slug: true },
        });
        if (duplicate) throw new ConflictException(`同品牌型号年份商品已存在：${duplicate.slug}`);
        const normalizedPrice = product.price
          ? normalizePriceRange(product.price)
          : { min: null, max: null, currency: 'CNY' as const };
        const sourceId = product.data_source
          ? (await tx.dataSource.create({
              data: {
                id: uuidv7(),
                brandId: brand.id,
                originUrl: product.data_source.origin_url ?? `manual:${product.slug}`,
                kind: product.data_source.kind,
                snapshotUrl: product.data_source.snapshot_url,
              },
              select: { id: true },
            })).id
          : null;
        const created = await tx.product.create({
          data: {
            id: uuidv7(),
            slug: product.slug,
            categoryId: category.id,
            brandId: brand.id,
            model: product.model,
            year: product.year,
            title: product.title,
            oneLiner: product.one_liner,
            priceMin: normalizedPrice.min,
            priceMax: normalizedPrice.max,
            priceCurrency: normalizedPrice.currency,
            specs: toJsonInput(product.specs),
            editorialScores: product.editorial_scores ? toJsonInput(product.editorial_scores) : undefined,
            status: 'draft',
            dataSource: sourceId,
            publishedAt: null,
          },
        });
        productId = created.id;
        after = { id: created.id, slug: product.slug, status: 'draft', specs: product.specs };
        if (product.images.length > 0) {
          await tx.productImage.createMany({
            data: product.images.map((image) => ({
              id: uuidv7(),
              productId,
              url: image.url,
              kind: image.kind,
              sortOrder: image.sort_order,
              alt: image.alt,
              source: image.source,
            })),
          });
        }
        await tx.productStat.create({ data: { productId } });
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: productId,
            type: 'product.updated',
            payload: toJsonInput({ reason: 'admin.import.approve' }),
          },
        });
      } else {
        const existing = await tx.product.findUnique({ where: { slug: product.slug } });
        if (!existing) throw new NotFoundException(`待更新商品不存在：${product.slug}`);
        assertCollectorChangesStillCurrent(
          (existing.specs ?? {}) as Record<string, unknown>,
          parsed.changes,
        );
        before = { id: existing.id, specs: existing.specs, dataSource: existing.dataSource };
        const nextSpecs = applyCollectorChanges(
          (existing.specs ?? {}) as Record<string, unknown>,
          parsed.changes,
        );
        const brandId = existing.brandId;
        const sourceId = await tx.dataSource.create({
          data: {
            id: uuidv7(),
            brandId,
            originUrl: parsed.source.originUrl ?? `manual:${product.slug}`,
            kind: 'crawl',
          },
          select: { id: true },
        });
        await tx.product.update({
          where: { id: existing.id },
          data: { specs: toJsonInput(nextSpecs), dataSource: sourceId.id },
        });
        productId = existing.id;
        after = { id: existing.id, slug: product.slug, specs: nextSpecs, dataSource: sourceId.id };
        await tx.outboxEvent.create({
          data: {
            aggregate: 'product',
            aggregateId: productId,
            type: 'product.updated',
            payload: toJsonInput({ reason: 'admin.import.update' }),
          },
        });
      }

      await tx.auditLog.create({
        data: {
          actorId,
          action: parsed.kind === 'new' ? 'create' : 'update',
          entity: 'product',
          entityId: productId,
          before: before === null ? undefined : toJsonInput(before),
          after: toJsonInput({ importId: id, ...after as Record<string, unknown> }),
        },
      });
      return { id, status: 'approved', productId };
    });
  }

  private async validateReferencesAndSpecs(parsed: ParsedCollectorImport, client: Prisma.TransactionClient = this.prisma) {
    const [category, brand] = await Promise.all([
      client.category.findUnique({ where: { slug: parsed.product.category }, select: { specSchema: true } }),
      client.brand.findUnique({ where: { slug: parsed.product.brand }, select: { id: true } }),
    ]);
    if (!category) throw new BadRequestException(`类目不存在：${parsed.product.category}`);
    if (!brand) throw new BadRequestException(`品牌不存在：${parsed.product.brand}`);
    if (!category.specSchema) throw new BadRequestException(`类目没有参数定义：${parsed.product.category}`);
    const validation = validateSpecs(parseSpecSchema(category.specSchema), parsed.product.specs);
    if (!validation.ok) {
      throw new BadRequestException(`商品参数校验失败：${validation.issues.map((issue) => `${issue.path} ${issue.message}`).join('；')}`);
    }
  }
}

function isUniqueConflict(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002';
}
