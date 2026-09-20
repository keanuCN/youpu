import assert from 'node:assert/strict';
import test from 'node:test';
import { Prisma } from '../../common/db';
import type { OutboxRow } from '../outbox.types';
import { NotificationConsumer } from './notification.consumer';

function notificationEvent(overrides: Partial<OutboxRow> = {}): OutboxRow {
  return {
    id: 42n,
    aggregate: 'rating',
    aggregateId: 'rating-id',
    type: 'notification.created',
    attempts: 0,
    payload: {
      accountId: 'account-id',
      type: 'reply',
      actorId: 'actor-id',
      targetType: 'rating',
      targetId: 'rating-id',
      payload: { path: '/gear/burton-custom-camber#reviews', anchor: 'rating-id' },
    },
    ...overrides,
  };
}

test('writes the outbox event id as the notification source event id', async () => {
  let createCall: { data: Record<string, unknown> } | undefined;
  const prisma = {
    notification: {
      create: async (input: { data: Record<string, unknown> }) => {
        createCall = input;
        return {};
      },
    },
  };
  const consumer = new NotificationConsumer(prisma as never);

  await consumer.handle(notificationEvent());

  assert.equal(createCall?.data.sourceEventId, 42n);
  assert.equal(createCall?.data.accountId, 'account-id');
  assert.equal(createCall?.data.targetId, 'rating-id');
});

test('treats a duplicate source event as already delivered', async () => {
  const duplicate = new Prisma.PrismaClientKnownRequestError('duplicate source event', {
    code: 'P2002',
    clientVersion: '5.22.0',
  });
  const prisma = {
    notification: {
      create: async () => {
        throw duplicate;
      },
    },
  };
  const consumer = new NotificationConsumer(prisma as never);

  await assert.doesNotReject(() => consumer.handle(notificationEvent()));
});

test('rethrows notification persistence errors other than duplicate keys', async () => {
  const error = new Error('database unavailable');
  const prisma = {
    notification: {
      create: async () => {
        throw error;
      },
    },
  };
  const consumer = new NotificationConsumer(prisma as never);

  await assert.rejects(() => consumer.handle(notificationEvent()), error);
});
