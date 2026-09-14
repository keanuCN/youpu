import { randomBytes } from 'node:crypto';

/**
 * UUIDv7（时间有序，数据库设计 §1 全局约定）：前 48 位为毫秒时间戳，索引友好。
 * PG16 无内置 uuidv7，按约定在应用层生成。
 */
export function uuidv7(): string {
  const bytes = randomBytes(16);
  const ts = Date.now();
  bytes[0] = (ts / 2 ** 40) & 0xff;
  bytes[1] = (ts / 2 ** 32) & 0xff;
  bytes[2] = (ts / 2 ** 24) & 0xff;
  bytes[3] = (ts / 2 ** 16) & 0xff;
  bytes[4] = (ts / 2 ** 8) & 0xff;
  bytes[5] = ts & 0xff;
  bytes[6] = (bytes[6]! & 0x0f) | 0x70; // version = 7
  bytes[8] = (bytes[8]! & 0x3f) | 0x80; // variant = RFC 4122
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}
