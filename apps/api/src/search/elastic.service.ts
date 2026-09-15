import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Client } from '@elastic/elasticsearch';
import type { estypes } from '@elastic/elasticsearch';
import { env } from '../config/env';
import type { SearchParams } from './search-query';

export interface ElasticSearchResult {
  ids: string[];
  total: number;
}

/** 索引名：youpu-products（类目 >10 个后按大类拆分，见 DB 设计 §9） */
export function productsIndexName(): string {
  return `${env.ES_INDEX_PREFIX}-products`;
}

@Injectable()
export class ElasticService implements OnModuleInit {
  private readonly logger = new Logger(ElasticService.name);
  private client: Client | null = null;
  private indexEnsured = false;

  get enabled(): boolean {
    return this.client !== null;
  }

  onModuleInit(): void {
    if (!env.ES_NODE) {
      this.logger.warn('未配置 ES_NODE，ES 相关能力（搜索/筛选分面）停用');
      return;
    }
    this.client = new Client({ node: env.ES_NODE, requestTimeout: 5000, maxRetries: 2 });
  }

  private require(): Client {
    if (!this.client) throw new Error('Elasticsearch 未配置（ES_NODE 为空）');
    return this.client;
  }

  async ping(): Promise<boolean> {
    if (!this.client) return false;
    try {
      await this.client.ping();
      return true;
    } catch {
      return false;
    }
  }

  /** 建索引（含 ik 分词与联想字段），已存在则跳过；进程内只检查一次 */
  async ensureIndex(): Promise<void> {
    if (this.indexEnsured) return;
    const client = this.require();
    const exists = await client.indices.exists({ index: productsIndexName() });
    if (!exists) {
      await client.indices.create({
        index: productsIndexName(),
        mappings: {
          properties: {
            id: { type: 'keyword' },
            slug: { type: 'keyword' },
            model: { type: 'text', analyzer: 'ik_max_word', search_analyzer: 'ik_smart', fields: { keyword: { type: 'keyword' } } },
            title: {
              type: 'text',
              analyzer: 'ik_max_word',
              search_analyzer: 'ik_smart',
              fields: { suggest: { type: 'search_as_you_type' } },
            },
            brandSlug: { type: 'keyword' },
            brandName: { type: 'keyword' },
            brandNameCn: { type: 'keyword' },
            categorySlug: { type: 'keyword' },
            categoryName: { type: 'keyword' },
            categoryPath: { type: 'keyword' },
            year: { type: 'short' },
            priceMin: { type: 'float' },
            priceMax: { type: 'float' },
            rating: { type: 'float' },
            /** 综合指数（编辑评分加权，计算值） */
            composite: { type: 'float' },
            ratingCount: { type: 'integer' },
            view7d: { type: 'integer' },
            oneLiner: { type: 'text', analyzer: 'ik_max_word' },
            // 按 spec_schema 拍平的筛选字段（filter: range|multi），同步脚本负责补 _mapping
            specs: { type: 'object', dynamic: true },
          },
        },
      });
      this.logger.log(`已创建索引 ${productsIndexName()}`);
    }
    this.indexEnsured = true;
  }

  async indexProduct(doc: Record<string, unknown> & { id: string }): Promise<void> {
    await this.require().index({ index: productsIndexName(), id: doc.id, document: doc, refresh: false });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.require().delete({ index: productsIndexName(), id }, { ignore: [404] });
  }

  async bulkIndex(docs: Array<Record<string, unknown> & { id: string }>): Promise<number> {
    if (docs.length === 0) return 0;
    const operations = docs.flatMap((doc) => [{ index: { _index: productsIndexName(), _id: doc.id } }, doc]);
    const res = await this.require().bulk({ operations, refresh: true });
    if (res.errors) {
      const failed = res.items.filter((i) => i.index?.error).length;
      this.logger.warn(`批量索引进 ES 有 ${failed} 条失败`);
    }
    return docs.length;
  }

  async searchProducts(params: SearchParams): Promise<ElasticSearchResult> {
    const client = this.require();
    await this.ensureIndex();

    const filter: Array<Record<string, unknown>> = [];
    if (params.category) filter.push({ term: { categorySlug: params.category } });
    if (params.brand) filter.push({ term: { brandSlug: params.brand } });
    if (params.year !== undefined) filter.push({ term: { year: params.year } });
    if (params.priceMin !== undefined) filter.push({ range: { priceMax: { gte: params.priceMin } } });
    if (params.priceMax !== undefined) filter.push({ range: { priceMin: { lte: params.priceMax } } });

    const sort: estypes.Sort = params.sort === 'new'
      ? [{ year: 'desc' }, { rating: 'desc' }]
      : params.sort === 'rating'
        ? [{ rating: 'desc' }, { ratingCount: 'desc' }]
        : [{ _score: { order: 'desc' } }, { ratingCount: 'desc' }];

    const response = await client.search({
      index: productsIndexName(),
      from: (params.page - 1) * params.pageSize,
      size: params.pageSize,
      track_total_hits: true,
      query: {
        bool: {
          must: [{
            multi_match: {
              query: params.q,
              fields: ['model^6', 'title^5', 'brandName^4', 'oneLiner'],
              type: 'best_fields',
              operator: 'and',
            },
          }],
          filter,
        },
      },
      sort,
    });

    const total = typeof response.hits.total === 'number'
      ? response.hits.total
      : response.hits.total?.value ?? 0;
    const ids = response.hits.hits
      .map((hit) => hit._id)
      .filter((id): id is string => typeof id === 'string');
    return { ids, total };
  }
}
