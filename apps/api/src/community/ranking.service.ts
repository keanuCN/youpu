import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { z } from 'zod';
import { PrismaService } from '../common/prisma.service';
import { CommunityRateLimit } from './community-rate-limit';

export const rankingVoteQuerySchema = z.object({
  category: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(64),
  rank: z.string().regex(/^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/).max(64),
  season: z.string().regex(/^20\d{2}$/),
}).strict();
export const rankingVoteInputSchema = rankingVoteQuerySchema.extend({ product: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(160) }).strict();
type RankingQuery = z.infer<typeof rankingVoteQuerySchema>;
type RankingInput = z.infer<typeof rankingVoteInputSchema>;

const RANK_KEYS: Record<string, readonly string[]> = {
  snowboard: ['overall', 'all-mountain', 'carving', 'freestyle', 'powder', 'beginner', 'value'],
  'snowboard-binding': ['overall'], 'snowboard-boot': ['overall'], skis: ['overall'],
  'badminton-racket': ['overall', 'power', 'control', 'speed'],
  'casting-rod': ['overall', 'casting', 'sensitivity', 'strength'],
  'action-cam': ['overall', 'imageQuality', 'stabilization', 'battery', 'value'],
  'road-bike': ['overall', 'racing', 'climbing', 'endurance', 'value'],
  mtb: ['overall', 'climbing', 'descending', 'control', 'value'],
  'esports-keyboard': ['overall', 'response', 'customization', 'value'],
};

function assertRank(q: RankingQuery) {
  if (!RANK_KEYS[q.category]?.includes(q.rank)) throw new BadRequestException('榜单不存在');
}

@Injectable()
export class RankingService {
  constructor(private readonly prisma: PrismaService, private readonly limits: CommunityRateLimit) {}

  async getVotes(input: RankingQuery, accountId?: string) {
    const q = rankingVoteQuerySchema.parse(input);
    assertRank(q);
    const rows = await this.prisma.$queryRaw<Array<{ slug: string; votes: bigint }>>`
      SELECT p.slug, count(*) AS votes FROM community_ranking_vote v
      JOIN product p ON p.id = v.product_id AND p.status = 'published'
      WHERE v.category_slug = ${q.category} AND v.rank_key = ${q.rank} AND v.season = ${q.season}
      GROUP BY p.slug`;
    const mine = accountId ? await this.prisma.$queryRaw<Array<{ slug: string; changed: boolean }>>`
      SELECT p.slug, v.changed FROM community_ranking_vote v JOIN product p ON p.id = v.product_id
      WHERE v.category_slug = ${q.category} AND v.rank_key = ${q.rank} AND v.season = ${q.season} AND v.account_id = ${accountId}::uuid` : [];
    return { counts: Object.fromEntries(rows.map((row) => [row.slug, Number(row.votes)])), mine: mine[0] ?? null };
  }

  async vote(input: RankingInput, accountId: string) {
    const q = rankingVoteInputSchema.parse(input);
    assertRank(q);
    const product = await this.prisma.product.findFirst({ where: { slug: q.product, status: 'published', category: { slug: q.category, status: 'active' } }, select: { id: true } });
    if (!product) throw new NotFoundException('该装备不存在或不属于此品类');
    await this.limits.assertAllowed(accountId, 'rankingVote');
    const result = await this.prisma.$queryRaw<Array<{ changed: boolean }>>`
      INSERT INTO community_ranking_vote (category_slug, rank_key, season, account_id, product_id)
      VALUES (${q.category}, ${q.rank}, ${q.season}, ${accountId}::uuid, ${product.id}::uuid)
      ON CONFLICT (category_slug, rank_key, season, account_id) DO UPDATE
      SET product_id = EXCLUDED.product_id, changed = true, updated_at = now()
      WHERE NOT community_ranking_vote.changed AND community_ranking_vote.product_id <> EXCLUDED.product_id
      RETURNING changed`;
    if (!result.length) throw new ConflictException('本榜已投票，或改投机会已用完');
    return this.getVotes({ category: q.category, rank: q.rank, season: q.season }, accountId);
  }
}
