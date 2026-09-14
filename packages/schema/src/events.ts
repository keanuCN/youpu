import { z } from 'zod';

/**
 * 埋点事件字典（技术方案 §12.2）—— 命名即规范，只埋决策需要的事件。
 * 前端 track() 与后端摄取校验共用；后端按 propsSchema 白名单过滤，杜绝任意字段注入。
 */

export const EVENT_NAMES = [
  'expose',
  'card_click',
  'detail_view',
  'compare_add',
  'compare_open',
  'recommend_start',
  'recommend_complete',
  'search',
  'favorite_add',
  'rating_submit',
  'reply_submit',
  'signup',
  'email_verify',
  'share_card_download',
  'outbound_click',
] as const;
export type EventName = (typeof EVENT_NAMES)[number];

const productId = z.string().min(1).max(64);
const fromSource = z.enum(['list', 'search', 'ranking', 'compare', 'home', 'recommend']);

export const eventPropsSchemas: Record<EventName, z.ZodType<Record<string, unknown>>> = {
  expose: z.object({
    category: z.string().max(64).optional(),
    product_id: productId.optional(),
    position: z.number().int().min(0).optional(),
    sort: z.string().max(32).optional(),
  }),
  card_click: z.object({ product_id: productId, from: fromSource.optional() }),
  detail_view: z.object({ product_id: productId, from: fromSource.optional() }),
  compare_add: z.object({
    product_ids: z.array(productId).min(1).max(4),
    source: fromSource.optional(),
  }),
  compare_open: z.object({
    product_ids: z.array(productId).min(1).max(4),
    source: fromSource.optional(),
  }),
  recommend_start: z.object({ survey: z.record(z.string(), z.unknown()).optional() }),
  recommend_complete: z.object({
    survey: z.record(z.string(), z.unknown()).optional(),
    result_ids: z.array(productId).max(10).optional(),
    fallback: z.boolean().optional(),
  }),
  search: z.object({ query: z.string().min(1).max(128), hits: z.number().int().min(0) }),
  favorite_add: z.object({ product_id: productId }),
  rating_submit: z.object({ product_id: productId }),
  reply_submit: z.object({ rating_id: z.string().min(1).max(64) }),
  signup: z.object({ channel: z.string().max(64).optional() }),
  email_verify: z.object({}),
  share_card_download: z.object({ product_id: productId }),
  outbound_click: z.object({ product_id: productId, target_domain: z.string().max(128) }),
};

export const trackEventSchema = z.object({
  name: z.enum(EVENT_NAMES),
  props: z.record(z.string(), z.unknown()).default({}),
  /** 客户端时间戳（ms） */
  ts: z.number().int().positive(),
  path: z.string().max(512).optional(),
});
export type TrackEvent = z.infer<typeof trackEventSchema>;

export const eventBatchSchema = z.object({
  anonId: z.string().uuid(),
  events: z.array(trackEventSchema).min(1).max(50),
});
export type EventBatch = z.infer<typeof eventBatchSchema>;

/** 按事件名裁掉未声明字段；返回 null 表示该事件整体非法 */
export function sanitizeEventProps(name: EventName, props: Record<string, unknown>): Record<string, unknown> | null {
  const result = eventPropsSchemas[name].safeParse(props);
  return result.success ? result.data : null;
}
