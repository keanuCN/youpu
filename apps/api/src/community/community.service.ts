import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  accountPatchSchema,
  notificationReadSchema,
  ratingInputSchema,
  ratingListQuerySchema,
  recommendationInputSchema,
  reportInputSchema,
  replyInputSchema,
  type NotificationReadInput,
  type RatingInput,
  type RatingListQueryInput,
  type RecommendationInput,
  type ReportInput,
  type ReplyInput,
} from '@youpu/schema';
import { Prisma } from '../common/db';
import { PrismaService } from '../common/prisma.service';
import { toJsonInput } from '../common/json';
import { uuidv7 } from '../common/uuid';
import type { AccountView } from '../auth/auth.types';
import { evaluateCommunityRisk } from './community-moderation';
import { CommunityRateLimit } from './community-rate-limit';
import { filterAndSortRatings } from './rating-query';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PRODUCT_REF_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type ProductRow = {
  id: string;
  slug: string;
  model: string;
  year: number;
  title: string;
  priceMin: Prisma.Decimal | null;
  priceMax: Prisma.Decimal | null;
  specs: unknown;
  editorialScores: unknown;
  brand: { name: string; nameCn: string | null };
};

type RatingWithRelations = Prisma.RatingGetPayload<{
  include: {
    account: { select: { id: true; nickname: true; avatarUrl: true; riderProfile: true } };
    replies: {
      where: { status: string };
      orderBy: { createdAt: 'asc' };
      include: { account: { select: { id: true; nickname: true; avatarUrl: true } } };
    };
  };
}>;

export interface RecommendationCandidate {
  productId: string;
  slug: string;
  title: string;
  brand: string;
  model: string;
  year: number;
  match: number;
  reasons: string[];
  fallback: boolean;
}

@Injectable()
export class CommunityService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly communityRateLimit: CommunityRateLimit,
  ) {}

  async listRatings(productRef: string, query?: RatingListQueryInput, accountId?: string) {
    const parsedQuery = ratingListQuerySchema.parse(query ?? {});
    const product = await this.findPublishedProduct(productRef);
    const ratings = (await this.prisma.rating.findMany({
      where: { productId: product.id, status: 'published' },
      orderBy: [{ helpfulCount: 'desc' as const }, { createdAt: 'desc' as const }],
      include: {
        account: { select: { id: true, nickname: true, avatarUrl: true, riderProfile: true } },
        replies: {
          where: { status: 'published' },
          orderBy: { createdAt: 'asc' },
          include: { account: { select: { id: true, nickname: true, avatarUrl: true } } },
        },
      },
    })) as RatingWithRelations[];
    const viewer = parsedQuery.sort === 'similar' && accountId
      ? await this.prisma.account.findUnique({ where: { id: accountId }, select: { riderProfile: true } })
      : null;
    const orderedRatings = filterAndSortRatings(
      ratings.map((rating) => ({
        id: rating.id,
        riderProfile: asRecord(rating.riderProfile),
        helpfulCount: rating.helpfulCount,
        createdAt: rating.createdAt,
        rating,
      })),
      parsedQuery,
      viewer ? asRecord(viewer.riderProfile) : undefined,
    ).map((row) => row.rating);
    const votes = accountId && orderedRatings.length
      ? await this.prisma.ratingVote.findMany({ where: { accountId, ratingId: { in: orderedRatings.map((rating) => rating.id) } }, select: { ratingId: true } })
      : [];
    const voted = new Set(votes.map((vote) => vote.ratingId));
    const distribution = { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<string, number>;
    for (const rating of orderedRatings) {
      const star = String(Math.round(Number(rating.overall)));
      if (star in distribution) distribution[star] = (distribution[star] ?? 0) + 1;
    }
    const overall = orderedRatings.length
      ? round2(orderedRatings.reduce((sum, rating) => sum + Number(rating.overall), 0) / orderedRatings.length)
      : null;
    return {
      productId: product.id,
      productSlug: product.slug,
      summary: { overall, count: orderedRatings.length, distribution },
      items: orderedRatings.map((rating) => this.serializeRating(rating, voted.has(rating.id))),
    };
  }

  async upsertRating(productRef: string, account: AccountView, input: RatingInput) {
    const body = ratingInputSchema.parse(input);
    const product = await this.findPublishedProduct(productRef);
    const existing = await this.prisma.rating.findUnique({
      where: { productId_accountId: { productId: product.id, accountId: account.id } },
      select: { id: true },
    });
    await this.communityRateLimit.assertAllowed(account.id, 'rating');
    const riderProfile = Object.keys(body.riderProfile).length > 0 ? body.riderProfile : account.riderProfile;
    const moderation = evaluateCommunityRisk({ content: body.content, overall: body.overall });
    const moderationCheckedAt = new Date();
    const rating = await this.prisma.$transaction(async (tx) => {
      const saved = await tx.rating.upsert({
        where: { productId_accountId: { productId: product.id, accountId: account.id } },
        create: {
          id: uuidv7(),
          productId: product.id,
          accountId: account.id,
          overall: body.overall,
          sub: toJsonInput(body.sub),
          content: body.content ?? null,
          riderProfile: toJsonInput(riderProfile),
          moderationRisk: moderation.risk,
          moderationReasons: toJsonInput(moderation.reasons),
          moderationCheckedAt,
          status: 'published',
        },
        update: {
          overall: body.overall,
          sub: toJsonInput(body.sub),
          content: body.content ?? null,
          riderProfile: toJsonInput(riderProfile),
          moderationRisk: moderation.risk,
          moderationReasons: toJsonInput(moderation.reasons),
          moderationCheckedAt,
          status: 'published',
        },
        include: {
          account: { select: { id: true, nickname: true, avatarUrl: true, riderProfile: true } },
          replies: {
            where: { status: 'published' },
            orderBy: { createdAt: 'asc' },
            include: { account: { select: { id: true, nickname: true, avatarUrl: true } } },
          },
        },
      });
      await tx.outboxEvent.create({
        data: {
          aggregate: 'product',
          aggregateId: product.id,
          type: 'rating.changed',
          payload: toJsonInput({ reason: existing ? 'rating.update' : 'rating.create', ratingId: saved.id }),
        },
      });
      if (!existing) {
        const followers = await tx.favorite.findMany({ where: { productId: product.id, accountId: { not: account.id } }, select: { accountId: true } });
        for (const follower of followers) {
          await tx.outboxEvent.create({
            data: {
              aggregate: 'product',
              aggregateId: product.id,
              type: 'notification.created',
              payload: toJsonInput({
                accountId: follower.accountId,
                actorId: account.id,
                type: 'new_review',
                targetType: 'product',
                targetId: product.id,
                payload: {
                  productSlug: product.slug,
                  productTitle: product.title,
                  path: `/gear/${product.slug}#reviews`,
                  anchor: saved.id,
                  actorName: account.nickname,
                },
              }),
            },
          });
        }
      }
      return saved as RatingWithRelations;
    });
    return this.serializeRating(rating, false);
  }

  async deleteRating(id: string, accountId: string): Promise<{ ok: true }> {
    const rating = await this.prisma.rating.findUnique({ where: { id }, select: { productId: true, accountId: true } });
    if (!rating) throw new NotFoundException('评论不存在');
    if (rating.accountId !== accountId) throw new ConflictException('只能删除自己的评论');
    await this.prisma.$transaction([
      this.prisma.rating.delete({ where: { id } }),
      this.prisma.outboxEvent.create({
        data: { aggregate: 'product', aggregateId: rating.productId, type: 'rating.changed', payload: { reason: 'rating.delete' } },
      }),
    ]);
    return { ok: true };
  }

  async toggleHelpful(ratingId: string, account: AccountView) {
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
      select: { id: true, accountId: true, helpfulCount: true, product: { select: { slug: true } } },
    });
    if (!rating) throw new NotFoundException('评论不存在');
    await this.communityRateLimit.assertAllowed(account.id, 'helpful');
    const result = await this.prisma.$transaction(async (tx) => {
      const vote = await tx.ratingVote.findUnique({ where: { ratingId_accountId: { ratingId, accountId: account.id } } });
      if (vote) {
        await tx.ratingVote.delete({ where: { ratingId_accountId: { ratingId, accountId: account.id } } });
        const updated = await tx.rating.update({ where: { id: ratingId }, data: { helpfulCount: { decrement: 1 } }, select: { helpfulCount: true } });
        return { helpful: false, helpfulCount: Math.max(0, updated.helpfulCount) };
      }
      await tx.ratingVote.create({ data: { ratingId, accountId: account.id } });
      const updated = await tx.rating.update({ where: { id: ratingId }, data: { helpfulCount: { increment: 1 } }, select: { helpfulCount: true } });
      if (rating.accountId !== account.id) {
        await tx.outboxEvent.create({
          data: {
            aggregate: 'rating',
            aggregateId: ratingId,
            type: 'notification.created',
            payload: toJsonInput({
              accountId: rating.accountId,
              actorId: account.id,
              type: 'helpful',
              targetType: 'rating',
              targetId: ratingId,
              payload: {
                productSlug: rating.product.slug,
                path: `/gear/${rating.product.slug}#reviews`,
                anchor: ratingId,
                actorName: account.nickname,
              },
            }),
          },
        });
      }
      return { helpful: true, helpfulCount: updated.helpfulCount };
    });
    return result;
  }

  async createReply(ratingId: string, account: AccountView, input: ReplyInput) {
    const body = replyInputSchema.parse(input);
    const rating = await this.prisma.rating.findUnique({
      where: { id: ratingId },
      select: { id: true, accountId: true, product: { select: { slug: true } } },
    });
    if (!rating) throw new NotFoundException('评论不存在');
    if (body.replyTo) {
      const target = await this.prisma.account.findUnique({ where: { id: body.replyTo }, select: { id: true } });
      if (!target) throw new BadRequestException('回复对象不存在');
    }
    const duplicate = await this.prisma.ratingReply.findFirst({
      where: { ratingId, content: body.content, status: 'published' },
      select: { id: true },
    });
    await this.communityRateLimit.assertAllowed(account.id, 'reply');
    const moderation = evaluateCommunityRisk({ content: body.content, duplicate: Boolean(duplicate) });
    const moderationCheckedAt = new Date();
    const reply = await this.prisma.$transaction(async (tx) => {
      const created = await tx.ratingReply.create({
        data: {
          id: uuidv7(),
          ratingId,
          accountId: account.id,
          replyTo: body.replyTo ?? null,
          content: body.content,
          moderationRisk: moderation.risk,
          moderationReasons: toJsonInput(moderation.reasons),
          moderationCheckedAt,
          status: 'published',
        },
        include: { account: { select: { id: true, nickname: true, avatarUrl: true } } },
      });
      if (rating.accountId !== account.id) {
        await tx.outboxEvent.create({
          data: {
            aggregate: 'rating',
            aggregateId: ratingId,
            type: 'notification.created',
              payload: toJsonInput({
                accountId: rating.accountId,
                actorId: account.id,
                type: 'reply',
                targetType: 'rating',
                targetId: ratingId,
                payload: {
                  productSlug: rating.product.slug,
                  path: `/gear/${rating.product.slug}#reviews`,
                  anchor: ratingId,
                  actorName: account.nickname,
                  replyId: created.id,
                },
              }),
          },
        });
      }
      return created;
    });
    return this.serializeReply(reply);
  }

  async deleteReply(id: string, accountId: string): Promise<{ ok: true }> {
    const reply = await this.prisma.ratingReply.findUnique({ where: { id }, select: { accountId: true } });
    if (!reply) throw new NotFoundException('回复不存在');
    if (reply.accountId !== accountId) throw new ConflictException('只能删除自己的回复');
    await this.prisma.ratingReply.delete({ where: { id } });
    return { ok: true };
  }

  async createReport(accountId: string, input: ReportInput) {
    const body = reportInputSchema.parse(input);
    const target = body.targetType === 'rating'
      ? await this.prisma.rating.findUnique({ where: { id: body.targetId }, select: { id: true } })
      : await this.prisma.ratingReply.findUnique({ where: { id: body.targetId }, select: { id: true } });
    if (!target) throw new NotFoundException('被举报内容不存在');
    await this.communityRateLimit.assertAllowed(accountId, 'report');
    evaluateCommunityRisk({ content: [body.reason, body.note ?? ''].filter(Boolean).join(' ') });
    try {
      return await this.prisma.report.create({
        data: {
          id: uuidv7(),
          targetType: body.targetType,
          targetId: body.targetId,
          reporterId: accountId,
          reason: body.reason,
          note: body.note ?? null,
        },
        select: { id: true, targetType: true, targetId: true, reason: true, status: true, createdAt: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('你已经举报过这条内容');
      }
      throw error;
    }
  }

  async addFavorite(productRef: string, accountId: string) {
    const product = await this.findPublishedProduct(productRef);
    await this.prisma.$transaction(async (tx) => {
      await tx.favorite.upsert({
        where: { accountId_productId: { accountId, productId: product.id } },
        create: { accountId, productId: product.id },
        update: {},
      });
      await tx.outboxEvent.create({
        data: { aggregate: 'product', aggregateId: product.id, type: 'favorite.changed', payload: { reason: 'favorite.add' } },
      });
    });
    return { favorite: true, productId: product.id, productSlug: product.slug };
  }

  async removeFavorite(productRef: string, accountId: string) {
    const product = await this.findPublishedProduct(productRef);
    await this.prisma.$transaction(async (tx) => {
      await tx.favorite.deleteMany({ where: { accountId, productId: product.id } });
      await tx.outboxEvent.create({
        data: { aggregate: 'product', aggregateId: product.id, type: 'favorite.changed', payload: { reason: 'favorite.remove' } },
      });
    });
    return { favorite: false, productId: product.id, productSlug: product.slug };
  }

  async listFavorites(accountId: string) {
    const rows = await this.prisma.favorite.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      include: { product: { select: { id: true, slug: true, title: true, model: true, year: true, coverUrl: true } } },
    });
    return rows.map((row) => ({ ...row.product, createdAt: row.createdAt.toISOString() }));
  }

  async getMe(account: AccountView) {
    const [favorites, runs, notifications, ratings] = await Promise.all([
      this.listFavorites(account.id),
      this.prisma.recommendationRun.findMany({ where: { accountId: account.id }, orderBy: { createdAt: 'desc' }, take: 20 }),
      this.listNotifications(account.id, 5),
      this.prisma.rating.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { product: { select: { id: true, slug: true, title: true } } },
      }),
    ]);
    return {
      account,
      favorites,
      recommendationRuns: runs.map((run) => ({ ...run, createdAt: run.createdAt.toISOString() })),
      notifications,
      ratings: ratings.map((rating) => ({
        id: rating.id,
        productId: rating.product.id,
        productSlug: rating.product.slug,
        productTitle: rating.product.title,
        overall: Number(rating.overall),
        content: rating.content,
        riderProfile: asRecord(rating.riderProfile),
        helpfulCount: rating.helpfulCount,
        createdAt: rating.createdAt.toISOString(),
      })),
    };
  }

  async listNotifications(accountId: string, limit = 50) {
    const rows = await this.prisma.notification.findMany({
      where: { accountId },
      orderBy: { createdAt: 'desc' },
      take: Math.min(100, Math.max(1, limit)),
      include: { actor: { select: { id: true, nickname: true } } },
    });
    return rows.map((row) => ({
      id: row.id.toString(),
      type: row.type,
      read: row.readAt !== null,
      actor: row.actor,
      targetType: row.targetType,
      targetId: row.targetId,
      payload: row.payload,
      createdAt: row.createdAt.toISOString(),
    }));
  }

  async markNotification(accountId: string, id: string, input: NotificationReadInput) {
    if (!/^\d+$/.test(id)) throw new BadRequestException('通知 id 无效');
    const body = notificationReadSchema.parse(input);
    const updated = await this.prisma.notification.updateMany({
      where: { id: BigInt(id), accountId },
      data: { readAt: body.read ? new Date() : null },
    });
    if (!updated.count) throw new NotFoundException('通知不存在');
    return { ok: true };
  }

  async markAllNotifications(accountId: string) {
    const result = await this.prisma.notification.updateMany({ where: { accountId, readAt: null }, data: { readAt: new Date() } });
    return { ok: true, count: result.count };
  }

  async recommend(accountId: string | undefined, input: RecommendationInput) {
    const body = recommendationInputSchema.parse(input);
    const products = (await this.prisma.product.findMany({
      where: { status: 'published', category: { slug: body.categorySlug } },
      orderBy: [{ ratingCount: 'desc' }, { updatedAt: 'desc' }],
      include: { brand: { select: { name: true, nameCn: true } } },
    })) as ProductRow[];
    const candidates = products.map((product) => this.scoreProduct(product, body)).sort((a, b) => b.raw - a.raw);
    const top = candidates.slice(0, 3);
    const maxRaw = top[0]?.raw ?? 1;
    const minRaw = Math.min(0, top[top.length - 1]?.raw ?? 0);
    const picks: RecommendationCandidate[] = top.map((candidate, index) => ({
      productId: candidate.productId,
      slug: candidate.slug,
      title: candidate.title,
      brand: candidate.brand,
      model: candidate.model,
      year: candidate.year,
      match: Math.max(52, Math.min(98, Math.round(((candidate.raw - minRaw) / (maxRaw - minRaw || 1)) * 30 + 68 - index * 4))),
      reasons: candidate.reasons.slice(0, 3),
      fallback: candidate.raw < 0,
    }));
    if (accountId) {
      await this.prisma.recommendationRun.create({
        data: { id: uuidv7(), accountId, categorySlug: body.categorySlug, answers: toJsonInput(body.answers), picks: toJsonInput(picks) },
      });
    }
    return { categorySlug: body.categorySlug, picks };
  }

  private scoreProduct(product: ProductRow, input: RecommendationInput): RecommendationCandidate & { raw: number } {
    const answers = input.answers;
    const specs = asRecord(product.specs);
    const scenes = stringArray(specs.scenes);
    const price = priceOf(product);
    const flex = numberValue(specs.flex);
    const length = numberValue(specs.length) ?? 157;
    const hardcore = hardcoreOf(specs, asRecord(product.editorialScores));
    let raw = 0;
    const reasons: string[] = [];
    if (answers.scene?.length) {
      const hits = answers.scene.filter((scene) => scenes.includes(scene));
      if (hits.length) {
        raw += 30 * (hits.length / answers.scene.length) + (hits.length === answers.scene.length ? 8 : 0);
        reasons.push(`场景命中「${hits.join('、')}」`);
      } else raw -= 18;
    }
    const budget = budgetRange(answers.budget);
    if (budget && price !== null) {
      if (price >= budget[0] && price <= budget[1]) {
        raw += 20;
        reasons.push(`价格 ${price} 元落在你的预算内`);
      } else if (price > budget[1]) raw -= 25;
      else raw += 6;
    }
    const lengthRange = weightLength(answers.weight);
    if (lengthRange) {
      if (length >= lengthRange[0] && length <= lengthRange[1]) {
        raw += 12;
        reasons.push(`${length}cm 板长适配你的体重区间`);
      } else raw -= 8;
    }
    if (answers.flex && answers.flex !== 'unsure' && flex !== undefined) {
      const matched = answers.flex === 'soft' ? flex < 4 : answers.flex === 'mid' ? flex >= 4 && flex < 8 : flex >= 7;
      if (matched) {
        raw += 14;
        reasons.push(`硬度 ${flex}/10 符合你的偏好`);
      } else raw -= 10;
    }
    if (answers.level && hardcore !== null) {
      const matched = answers.level === 'first' ? hardcore <= 45 : answers.level === 'intermediate' ? hardcore > 35 && hardcore <= 62 : answers.level === 'advanced' ? hardcore > 55 && hardcore <= 78 : hardcore > 70;
      if (matched) {
        raw += answers.level === 'first' ? 18 : 16;
        reasons.push(answers.level === 'first' ? '进阶指数低，容错高，适合第一年' : '难度落在你的水平舒适区');
      } else if (answers.level === 'first' && hardcore > 65) raw -= 22;
    }
    if (answers.priority) {
      const scores = asRecord(product.editorialScores);
      const value = numberValue(scores[answers.priority === 'value' ? 'value' : answers.priority]);
      if (value !== undefined) {
        raw += (value - 5) * 4;
        if (value >= 8.5) reasons.push(`${answers.priority} ${value}/10，是它的强项`);
      }
    }
    const composite = compositeOf(product.editorialScores);
    if (composite !== null) raw += (composite - 70) * 0.4;
    return {
      productId: product.id,
      slug: product.slug,
      title: product.title,
      brand: product.brand.nameCn ?? product.brand.name,
      model: product.model,
      year: product.year,
      raw,
      reasons,
      match: 0,
      fallback: raw < 0,
    };
  }

  private async findPublishedProduct(ref: string): Promise<ProductRow & { id: string; slug: string; title: string }> {
    if (!UUID_RE.test(ref) && !PRODUCT_REF_RE.test(ref)) throw new BadRequestException('产品标识无效');
    const product = await this.prisma.product.findFirst({
      where: UUID_RE.test(ref) ? { id: ref, status: 'published' } : { slug: ref, status: 'published' },
      include: { brand: { select: { name: true, nameCn: true } } },
    });
    if (!product) throw new NotFoundException('产品不存在');
    return product as ProductRow & { id: string; slug: string; title: string };
  }

  private serializeRating(rating: RatingWithRelations, helpfulByMe: boolean) {
    return {
      id: rating.id,
      productId: rating.productId,
      overall: Number(rating.overall),
      sub: asRecord(rating.sub),
      content: rating.content,
      riderProfile: asRecord(rating.riderProfile),
      helpfulCount: rating.helpfulCount,
      helpfulByMe,
      status: rating.status,
      createdAt: rating.createdAt.toISOString(),
      updatedAt: rating.updatedAt.toISOString(),
      author: {
        id: rating.account.id,
        nickname: rating.account.nickname,
        avatarUrl: rating.account.avatarUrl,
        riderProfile: asRecord(rating.account.riderProfile),
      },
      replies: rating.replies.map((reply) => this.serializeReply(reply)),
    };
  }

  private serializeReply(reply: { id: string; ratingId: string; replyTo: string | null; content: string; createdAt: Date; account: { id: string; nickname: string; avatarUrl: string | null } }) {
    return {
      id: reply.id,
      ratingId: reply.ratingId,
      replyTo: reply.replyTo,
      content: reply.content,
      createdAt: reply.createdAt.toISOString(),
      author: reply.account,
    };
  }
}

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function numberValue(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() && Number.isFinite(Number(value))) return Number(value);
  return undefined;
}

function priceOf(product: ProductRow): number | null {
  if (product.priceMin !== null && product.priceMax !== null) return Math.round((Number(product.priceMin) + Number(product.priceMax)) / 2);
  if (product.priceMin !== null) return Number(product.priceMin);
  if (product.priceMax !== null) return Number(product.priceMax);
  return null;
}

function budgetRange(value: string | undefined): [number, number] | null {
  if (value === 'lt4000') return [0, 4000];
  if (value === '4000to6000') return [4000, 6000];
  if (value === '6000to8000') return [6000, 8000];
  if (value === 'any') return [0, 99999];
  return null;
}

function weightLength(value: string | undefined): [number, number] | null {
  if (value === 'lt60') return [148, 155];
  if (value === '60to75') return [153, 159];
  if (value === '75to90') return [156, 162];
  if (value === 'gt90') return [159, 168];
  return null;
}

function hardcoreOf(specs: Record<string, unknown>, scores: Record<string, unknown>): number | null {
  const flex = numberValue(specs.flex);
  const edge = numberValue(specs.effectiveEdge);
  const sidecut = numberValue(specs.sidecut);
  const damping = numberValue(specs.damping);
  const stability = numberValue(scores.stability);
  if (flex === undefined || edge === undefined || sidecut === undefined || damping === undefined || stability === undefined) return null;
  const norm = (value: number, lo: number, hi: number) => Math.min(1, Math.max(0, (value - lo) / (hi - lo)));
  return Math.round((norm(flex, 2, 10) * 0.3 + norm(edge, 1050, 1400) * 0.2 + (1 - norm(sidecut, 6, 11)) * 0.15 + norm(damping, 3, 10) * 0.2 + norm(stability, 3, 10) * 0.15) * 100);
}

function compositeOf(value: unknown): number | null {
  const scores = Object.values(asRecord(value)).map(numberValue).filter((item): item is number => item !== undefined);
  if (!scores.length) return null;
  return Math.round((scores.reduce((sum, item) => sum + item, 0) / scores.length) * 10);
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
