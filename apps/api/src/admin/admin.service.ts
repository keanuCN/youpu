import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  adminBrandInputSchema,
  adminCategoryInputSchema,
  adminProductInputSchema,
  adminProductPatchSchema,
  adminBrandPatchSchema,
  adminCategoryPatchSchema,
  adminModerationPatchSchema,
  adminRatingModerationPatchSchema,
  adminAccountPatchSchema,
  parseSpecSchema,
  validateSpecs,
  type AdminAccountPatch,
  type AdminBrandInput,
  type AdminBrandPatch,
  type AdminCategoryInput,
  type AdminCategoryPatch,
  type AdminModerationPatch,
  type AdminRatingModerationPatch,
  type AdminProductInput,
  type AdminProductPatch,
  type SpecSchema,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';
import { RedisService } from '../common/redis.module';
import { ElasticService } from '../search/elastic.service';
import { env } from '../config/env';
import { buildAnalyticsMetrics } from './analytics-metrics';
import { assertAccountAccessChangeAllowed } from './admin-account-policy';
import { selectAuditActor } from './admin-audit-actor';

const DAY_MS = 24 * 60 * 60 * 1000;
const chinaDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

interface AnalyticsSummaryRow {
  events: number;
  unique_visitors: number;
  product_views: number;
  active_accounts: number;
}

interface AnalyticsFunnelRow {
  exposed_visitors: number;
  clicked_visitors: number;
  viewed_visitors: number;
  intent_visitors: number;
}

interface AnalyticsEngagementRow {
  searches: number;
  recommend_starts: number;
  recommend_completions: number;
  signups: number;
  ratings: number;
  replies: number;
}

interface DailyAnalyticsRow {
  date: string;
  visitors: number;
  events: number;
  product_views: number;
}

interface EventBreakdownRow {
  name: string;
  count: number;
}

interface PathBreakdownRow {
  path: string;
  count: number;
}

interface TopProductRow {
  product_id: string;
  title: string | null;
  brand: string | null;
  event_count: number;
}

interface RecentAnalyticsEventRow {
  visitor: string;
  name: string;
  path: string | null;
  product_id: string | null;
  created_at: Date;
}

interface DashboardQualityRow {
  no_visual_asset: number;
  no_price: number;
  no_source: number;
  no_editorial_scores: number;
}

export interface AdminProductListQuery {
  search?: string;
  status?: 'draft' | 'published';
  categorySlug?: string;
  brandSlug?: string;
  missing?: AdminProductMissingField;
  page?: number;
  pageSize?: number;
}

export const ADMIN_PRODUCT_MISSING_FIELDS = ['image', 'price', 'source', 'scores'] as const;
export type AdminProductMissingField = (typeof ADMIN_PRODUCT_MISSING_FIELDS)[number];

export interface AdminAuditLogQuery {
  entity?: string;
  action?: string;
  page?: number;
  pageSize?: number;
}

const LOCAL_AUDIT_ACTOR_EMAIL = 'admin@youpu.local';

function chinaDateKey(date: Date): string {
  const parts = Object.fromEntries(
    chinaDateFormatter.formatToParts(date).map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

function auditSnapshot(value: unknown): unknown {
  return JSON.parse(
    JSON.stringify(value, (_key, nested) => (typeof nested === 'bigint' ? nested.toString() : nested)),
  );
}

function buildDailySeries(days: number, rows: Map<string, DailyAnalyticsRow>) {
  const todayKey = chinaDateKey(new Date());
  const todayStart = new Date(`${todayKey}T00:00:00+08:00`);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(todayStart.getTime() - (days - index - 1) * DAY_MS);
    const key = chinaDateKey(date);
    const row = rows.get(key);
    return {
      date: key,
      visitors: Number(row?.visitors ?? 0),
      events: Number(row?.events ?? 0),
      productViews: Number(row?.product_views ?? 0),
    };
  });
}

function roundMb(bytes: number): number {
  return Math.round((bytes / 1024 / 1024) * 10) / 10;
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);
  private auditActorPromise?: Promise<string>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly elastic: ElasticService,
  ) {}

  async dashboard() {
    const [products, publishedProducts, drafts, brands, categories, recentProducts, qualityRows] = await this.prisma.$transaction([
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
      this.prisma.$queryRaw<DashboardQualityRow[]>`
        SELECT
          COUNT(*) FILTER (
            WHERE NULLIF(BTRIM(cover_url), '') IS NULL
              AND NOT EXISTS (SELECT 1 FROM product_image pi WHERE pi.product_id = product.id)
          )::int AS no_visual_asset,
          COUNT(*) FILTER (WHERE price_min IS NULL AND price_max IS NULL)::int AS no_price,
          COUNT(*) FILTER (WHERE NULLIF(BTRIM(data_source), '') IS NULL)::int AS no_source,
          COUNT(*) FILTER (WHERE editorial_scores IS NULL)::int AS no_editorial_scores
        FROM product
      `,
    ]);

    const quality = qualityRows[0] ?? {
      no_visual_asset: 0,
      no_price: 0,
      no_source: 0,
      no_editorial_scores: 0,
    };

    return {
      metrics: {
        products,
        publishedProducts,
        drafts,
        brands,
        categories,
        dataQuality: {
          noVisualAsset: Number(quality.no_visual_asset),
          noPrice: Number(quality.no_price),
          noSource: Number(quality.no_source),
          noEditorialScores: Number(quality.no_editorial_scores),
        },
      },
      recentProducts: recentProducts.map((product) => ({
        ...product,
        updatedAt: product.updatedAt.toISOString(),
      })),
    };
  }

  async listAccounts() {
    const rows = await this.prisma.account.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });

    return rows.map((row) => ({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async updateAccountAccess(id: string, input: AdminAccountPatch, actorId?: string) {
    const body = adminAccountPatchSchema.parse(input);
    const result = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.account.findUnique({
        where: { id },
        select: {
          id: true,
          email: true,
          nickname: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });
      if (!existing) throw new NotFoundException(`账号不存在：${id}`);

      const activeAdminCount = await tx.account.count({ where: { role: 'admin', status: 'active' } });
      assertAccountAccessChangeAllowed(existing, activeAdminCount, body);

      const data: Prisma.AccountUncheckedUpdateInput = {
        ...(body.role === undefined ? {} : { role: body.role }),
        ...(body.status === undefined ? {} : { status: body.status }),
      };
      const updated = await tx.account.update({
        where: { id },
        data,
        select: {
          id: true,
          email: true,
          nickname: true,
          role: true,
          status: true,
          createdAt: true,
        },
      });

      return { before: existing, after: updated };
    });

    await this.recordAudit({
      actorId,
      action: 'update',
      entity: 'account',
      entityId: id,
      before: result.before,
      after: result.after,
    });

    return {
      ...result.after,
      createdAt: result.after.createdAt.toISOString(),
    };
  }

  async listAuditLogs(params: AdminAuditLogQuery = {}) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 50));
    const where: Prisma.AuditLogWhereInput = {};
    if (params.entity) where.entity = params.entity;
    if (params.action) where.action = params.action;

    const [total, rows] = await this.prisma.$transaction([
      this.prisma.auditLog.count({ where }),
      this.prisma.auditLog.findMany({
        where,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          actor: { select: { id: true, nickname: true, email: true, role: true } },
        },
      }),
    ]);

    return {
      total,
      page,
      pageSize,
      items: rows.map((row) => ({
        id: row.id.toString(),
        action: row.action,
        entity: row.entity,
        entityId: row.entityId,
        before: row.before ?? null,
        after: row.after ?? null,
        // Prisma 对 Unsupported("inet") 不提供读取字段；当前单令牌管理层也未传递请求 IP。
        ip: null,
        createdAt: row.createdAt.toISOString(),
        actor: row.actor,
      })),
    };
  }

  async analytics(days = 14) {
    const rangeDays = Math.min(90, Math.max(1, Math.floor(days)));
    const to = new Date();
    const from = new Date(to.getTime() - rangeDays * DAY_MS);

    const [summaryRows, funnelRows, engagementRows, dailyRows, eventRows, pathRows, productRows, recentRows, system] = await Promise.all([
      this.prisma.$queryRaw<AnalyticsSummaryRow[]>`
        SELECT
          COUNT(*)::int AS events,
          COUNT(DISTINCT anon_id)::int AS unique_visitors,
          COUNT(*) FILTER (WHERE name = 'detail_view')::int AS product_views,
          COUNT(DISTINCT account_id) FILTER (WHERE account_id IS NOT NULL)::int AS active_accounts
        FROM event
        WHERE created_at >= ${from}
      `,
      this.prisma.$queryRaw<AnalyticsFunnelRow[]>`
        SELECT
          COUNT(DISTINCT anon_id) FILTER (WHERE name = 'expose')::int AS exposed_visitors,
          COUNT(DISTINCT anon_id) FILTER (WHERE name = 'card_click')::int AS clicked_visitors,
          COUNT(DISTINCT anon_id) FILTER (WHERE name = 'detail_view')::int AS viewed_visitors,
          COUNT(DISTINCT anon_id) FILTER (WHERE name IN ('favorite_add', 'outbound_click'))::int AS intent_visitors
        FROM event
        WHERE created_at >= ${from}
      `,
      this.prisma.$queryRaw<AnalyticsEngagementRow[]>`
        SELECT
          COUNT(*) FILTER (WHERE name = 'search')::int AS searches,
          COUNT(*) FILTER (WHERE name = 'recommend_start')::int AS recommend_starts,
          COUNT(*) FILTER (WHERE name = 'recommend_complete')::int AS recommend_completions,
          COUNT(*) FILTER (WHERE name = 'signup')::int AS signups,
          COUNT(*) FILTER (WHERE name = 'rating_submit')::int AS ratings,
          COUNT(*) FILTER (WHERE name = 'reply_submit')::int AS replies
        FROM event
        WHERE created_at >= ${from}
      `,
      this.prisma.$queryRaw<DailyAnalyticsRow[]>`
        SELECT
          TO_CHAR((created_at AT TIME ZONE 'Asia/Shanghai')::date, 'YYYY-MM-DD') AS date,
          COUNT(DISTINCT anon_id)::int AS visitors,
          COUNT(*)::int AS events,
          COUNT(*) FILTER (WHERE name = 'detail_view')::int AS product_views
        FROM event
        WHERE created_at >= ${from}
        GROUP BY (created_at AT TIME ZONE 'Asia/Shanghai')::date
        ORDER BY date ASC
      `,
      this.prisma.$queryRaw<EventBreakdownRow[]>`
        SELECT name, COUNT(*)::int AS count
        FROM event
        WHERE created_at >= ${from}
        GROUP BY name
        ORDER BY count DESC, name ASC
        LIMIT 12
      `,
      this.prisma.$queryRaw<PathBreakdownRow[]>`
        SELECT COALESCE(NULLIF(path, ''), '(未记录路径)') AS path, COUNT(*)::int AS count
        FROM event
        WHERE created_at >= ${from}
        GROUP BY 1
        ORDER BY count DESC, path ASC
        LIMIT 8
      `,
      this.prisma.$queryRaw<TopProductRow[]>`
        SELECT
          e.props->>'product_id' AS product_id,
          COALESCE(MAX(p.title), e.props->>'product_id') AS title,
          COALESCE(MAX(b.name_cn), MAX(b.name), '') AS brand,
          COUNT(*)::int AS event_count
        FROM event e
        LEFT JOIN product p ON p.id::text = e.props->>'product_id' OR p.slug = e.props->>'product_id'
        LEFT JOIN brand b ON b.id = p.brand_id
        WHERE e.created_at >= ${from}
          AND e.name IN ('expose', 'card_click', 'detail_view', 'favorite_add', 'outbound_click', 'share_card_download')
          AND e.props ? 'product_id'
        GROUP BY e.props->>'product_id'
        ORDER BY event_count DESC, product_id ASC
        LIMIT 8
      `,
      this.prisma.$queryRaw<RecentAnalyticsEventRow[]>`
        SELECT
          LEFT(anon_id::text, 8) AS visitor,
          name,
          path,
          props->>'product_id' AS product_id,
          created_at
        FROM event
        WHERE created_at >= ${from}
        ORDER BY created_at DESC
        LIMIT 24
      `,
      this.systemStatus(),
    ]);

    const summary = summaryRows[0] ?? {
      events: 0,
      unique_visitors: 0,
      product_views: 0,
      active_accounts: 0,
    };
    const dailyMap = new Map(dailyRows.map((row) => [row.date, row]));
    const funnel = funnelRows[0] ?? {
      exposed_visitors: 0,
      clicked_visitors: 0,
      viewed_visitors: 0,
      intent_visitors: 0,
    };
    const engagement = engagementRows[0] ?? {
      searches: 0,
      recommend_starts: 0,
      recommend_completions: 0,
      signups: 0,
      ratings: 0,
      replies: 0,
    };
    const analyticsMetrics = buildAnalyticsMetrics({
      funnel: {
        exposedVisitors: Number(funnel.exposed_visitors),
        clickedVisitors: Number(funnel.clicked_visitors),
        viewedVisitors: Number(funnel.viewed_visitors),
        intentVisitors: Number(funnel.intent_visitors),
      },
      engagement: {
        searches: Number(engagement.searches),
        recommendStarts: Number(engagement.recommend_starts),
        recommendCompletions: Number(engagement.recommend_completions),
        signups: Number(engagement.signups),
        ratings: Number(engagement.ratings),
        replies: Number(engagement.replies),
      },
    });

    return {
      rangeDays,
      from: from.toISOString(),
      to: to.toISOString(),
      summary: {
        events: Number(summary.events),
        uniqueVisitors: Number(summary.unique_visitors),
        productViews: Number(summary.product_views),
        activeAccounts: Number(summary.active_accounts),
      },
      funnel: analyticsMetrics.funnel,
      engagement: analyticsMetrics.engagement,
      daily: buildDailySeries(rangeDays, dailyMap),
      eventBreakdown: eventRows.map((row) => ({ name: row.name, count: Number(row.count) })),
      topPaths: pathRows.map((row) => ({ path: row.path, count: Number(row.count) })),
      topProducts: productRows.map((row) => ({
        productId: row.product_id,
        title: row.title || row.product_id,
        brand: row.brand || '',
        count: Number(row.event_count),
      })),
      recentEvents: recentRows.map((row) => ({
        visitor: row.visitor,
        name: row.name,
        path: row.path || null,
        productId: row.product_id || null,
        createdAt: row.created_at.toISOString(),
      })),
      system,
    };
  }

  async systemStatus() {
    const checkedAt = new Date();
    const [database, redis, elasticsearch, outboxPending, eventStreamLength] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.elastic.ping(),
      this.prisma.outboxEvent.count({ where: { processedAt: null } }).catch(() => null),
      this.redis.client.xlen('events:raw').catch(() => null),
    ]);
    const memory = process.memoryUsage();

    return {
      status: database && redis ? 'ok' : 'degraded',
      checkedAt: checkedAt.toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      nodeVersion: process.version,
      memory: {
        rssMb: roundMb(memory.rss),
        heapUsedMb: roundMb(memory.heapUsed),
        heapTotalMb: roundMb(memory.heapTotal),
      },
      services: {
        api: true,
        database,
        redis,
        elasticsearch,
        elasticsearchEnabled: this.elastic.enabled,
      },
      queue: { outboxPending, eventStreamLength },
    };
  }

  async listReports(status?: string) {
    const where = status && ['open', 'resolved', 'dismissed'].includes(status) ? { status } : {};
    const rows = await this.prisma.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        reporter: { select: { id: true, nickname: true, email: true } },
        handler: { select: { id: true, nickname: true } },
      },
    });
    return rows.map((row) => ({ ...row, createdAt: row.createdAt.toISOString() }));
  }

  async updateReport(id: string, input: AdminModerationPatch, actorId?: string) {
    const body = adminModerationPatchSchema.parse(input);
    const existing = await this.prisma.report.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`举报不存在：${id}`);
    const updated = await this.prisma.report.update({
      where: { id },
      data: { ...(body.status === undefined ? {} : { status: body.status }) },
      select: { id: true, targetType: true, targetId: true, reason: true, status: true, createdAt: true },
    });
    await this.recordAudit({
      actorId,
      action: 'moderate',
      entity: 'report',
      entityId: id,
      before: { status: existing.status },
      after: { status: updated.status },
    });
    return updated;
  }

  async listRatings(status?: string) {
    const where = status && ['published', 'hidden', 'rejected'].includes(status) ? { status } : {};
    const rows = await this.prisma.rating.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        account: { select: { id: true, nickname: true, email: true } },
        product: { select: { id: true, slug: true, title: true } },
      },
    });
    return rows.map((row) => ({
      id: row.id,
      overall: Number(row.overall),
      content: row.content,
      helpfulCount: row.helpfulCount,
      status: row.status,
      createdAt: row.createdAt.toISOString(),
      account: row.account,
      product: row.product,
    }));
  }

  async updateRatingStatus(id: string, input: AdminRatingModerationPatch, actorId?: string) {
    const body = adminRatingModerationPatchSchema.parse(input);
    const existing = await this.prisma.rating.findUnique({ where: { id }, select: { productId: true, status: true } });
    if (!existing) throw new NotFoundException(`评分不存在：${id}`);
    const result = await this.prisma.$transaction(async (tx) => {
      const rating = await tx.rating.update({ where: { id }, data: { ...(body.status === undefined ? {} : { status: body.status }) } });
      await tx.outboxEvent.create({
        data: { aggregate: 'product', aggregateId: existing.productId, type: 'rating.changed', payload: { reason: 'admin.moderation' } },
      });
      return { id: rating.id, status: rating.status, productId: rating.productId };
    });
    await this.recordAudit({
      actorId,
      action: 'moderate',
      entity: 'rating',
      entityId: id,
      before: { status: existing.status, productId: existing.productId },
      after: { status: result.status, productId: result.productId },
    });
    return result;
  }

  private async checkDatabase(): Promise<boolean> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }

  private async checkRedis(): Promise<boolean> {
    try {
      await this.redis.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  async listProducts(params: AdminProductListQuery) {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    const where: Prisma.ProductWhereInput = {};
    if (params.status) where.status = params.status;
    if (params.categorySlug) where.category = { slug: params.categorySlug };
    if (params.brandSlug) where.brand = { slug: params.brandSlug };
    if (params.missing === 'image') {
      where.coverUrl = null;
      where.images = { none: {} };
    }
    if (params.missing === 'price') {
      where.priceMin = null;
      where.priceMax = null;
    }
    if (params.missing === 'source') where.dataSource = null;
    if (params.missing === 'scores') where.editorialScores = { equals: Prisma.DbNull };
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

  async createProduct(input: AdminProductInput, actorId?: string) {
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
      const result = await this.getProduct(product.id);
      await this.recordAudit({ actorId, action: 'create', entity: 'product', entityId: product.id, after: result });
      return result;
    } catch (error) {
      this.throwPrismaConflict(error, '产品 slug 或品牌/型号/年份已存在');
      throw error;
    }
  }

  async updateProduct(id: string, input: AdminProductPatch, actorId?: string) {
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
      const result = await this.getProduct(id);
      const action =
        body.status === 'published' && existing.status !== 'published'
          ? 'publish'
          : body.status === 'draft' && existing.status === 'published'
            ? 'hide'
            : 'update';
      await this.recordAudit({ actorId, action, entity: 'product', entityId: id, before: existing, after: result });
      return result;
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

  async createBrand(input: AdminBrandInput, actorId?: string) {
    const body = adminBrandInputSchema.parse(input);
    try {
      const result = await this.prisma.brand.create({
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
      await this.recordAudit({ actorId, action: 'create', entity: 'brand', entityId: result.id, after: result });
      return result;
    } catch (error) {
      this.throwPrismaConflict(error, '品牌 slug 已存在');
      throw error;
    }
  }

  async updateBrand(id: string, input: AdminBrandPatch, actorId?: string) {
    const body = adminBrandPatchSchema.parse(input);
    const existing = await this.requireBrand(id);
    try {
      const result = await this.prisma.brand.update({
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
      await this.recordAudit({ actorId, action: 'update', entity: 'brand', entityId: id, before: existing, after: result });
      return result;
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

  async createCategory(input: AdminCategoryInput, actorId?: string) {
    const body = adminCategoryInputSchema.parse(input);
    const level = await this.levelForParent(body.parentId);
    if (body.specSchema !== undefined && body.specSchema !== null) this.parseCategorySchema(body.specSchema);
    try {
      const result = await this.prisma.category.create({
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
      await this.recordAudit({ actorId, action: 'create', entity: 'category', entityId: result.id, after: result });
      return result;
    } catch (error) {
      this.throwPrismaConflict(error, '类目 slug 已存在');
      throw error;
    }
  }

  async updateCategory(id: string, input: AdminCategoryPatch, actorId?: string) {
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
      const result = await this.prisma.category.update({
        where: { id },
        data: categoryUpdateData,
      });
      await this.recordAudit({ actorId, action: 'update', entity: 'category', entityId: id, before: existing, after: result });
      return result;
    } catch (error) {
      this.throwPrismaConflict(error, '类目 slug 已存在');
      throw error;
    }
  }

  private async recordAudit(input: {
    actorId?: string;
    action: string;
    entity: string;
    entityId?: string;
    before?: unknown;
    after?: unknown;
  }): Promise<void> {
    try {
      const actorId = input.actorId ?? selectAuditActor(null, await this.getAuditActorId());
      await this.prisma.auditLog.create({
        data: {
          actorId,
          action: input.action,
          entity: input.entity,
          entityId: input.entityId,
          before:
            input.before === undefined
              ? undefined
              : input.before === null
                ? Prisma.JsonNull
                : toJsonInput(auditSnapshot(input.before)),
          after:
            input.after === undefined
              ? undefined
              : input.after === null
                ? Prisma.JsonNull
                : toJsonInput(auditSnapshot(input.after)),
        },
      });
    } catch (error) {
      // 审计不能让本地已经完成的资料写入回滚；生产接入正式 actor 后再提升为强制闸门。
      this.logger.warn(`审计日志写入失败：${(error as Error).message}`);
    }
  }

  private getAuditActorId(): Promise<string> {
    this.auditActorPromise ??= this.resolveAuditActor();
    return this.auditActorPromise;
  }

  private async resolveAuditActor(): Promise<string> {
    if (env.ADMIN_ACTOR_ID) {
      const actor = await this.prisma.account.findUnique({
        where: { id: env.ADMIN_ACTOR_ID },
        select: { id: true, role: true, status: true },
      });
      if (!actor || !['editor', 'admin'].includes(actor.role) || actor.status !== 'active') {
        throw new Error('ADMIN_ACTOR_ID 未指向启用中的 editor/admin 账号');
      }
      return actor.id;
    }

    if (env.NODE_ENV === 'production') {
      throw new Error('生产环境必须配置 ADMIN_ACTOR_ID，才能写入审计日志');
    }

    const actor = await this.prisma.account.upsert({
      where: { email: LOCAL_AUDIT_ACTOR_EMAIL },
      update: { nickname: '本地后台管理员', role: 'admin', status: 'active' },
      create: {
        id: uuidv7(),
        email: LOCAL_AUDIT_ACTOR_EMAIL,
        nickname: '本地后台管理员',
        role: 'admin',
        status: 'active',
      },
      select: { id: true },
    });
    return actor.id;
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
      quality: {
        missing: [
          !row.coverUrl && images.length === 0 ? 'image' : null,
          row.priceMin === null && row.priceMax === null ? 'price' : null,
          !row.dataSource ? 'source' : null,
          row.editorialScores == null ? 'scores' : null,
        ].filter((field): field is AdminProductMissingField => field !== null),
      },
      ...(detail ? { images, specSchema: row.category?.specSchema ?? null } : { coverImage: images[0] ?? null }),
    };
  }

  private throwPrismaConflict(error: unknown, message: string): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException(message);
    }
  }
}
