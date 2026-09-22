import { createHash } from 'node:crypto';

/**
 * 对 JSON 兼容值做稳定序列化：对象键排序，数组顺序保留。
 * 这样同一份页面快照不会因为字段生成顺序不同而产生新的摘要。
 */
export function stableJson(value: unknown): string {
  if (value === undefined) return 'null';
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map((item) => stableJson(item)).join(',')}]`;

  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableJson(record[key])}`)
    .join(',')}}`;
}

export function sha256Json(value: unknown): string {
  return createHash('sha256').update(stableJson(value), 'utf8').digest('hex');
}
