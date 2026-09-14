export interface OutboxRow {
  id: bigint;
  aggregate: string;
  aggregateId: string;
  type: string;
  payload: Record<string, unknown>;
  attempts: number;
}

/** outbox 事件消费者：新增一种事件 = 实现一个 consumer 并注册（DB 设计 §7.2） */
export interface OutboxConsumer {
  readonly types: string[];
  handle(event: OutboxRow): Promise<void>;
}
