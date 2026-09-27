import assert from 'node:assert/strict';
import test from 'node:test';
import { AdminImportService } from './admin-import.service';

const category = {
  id: 'category-id',
  slug: 'snowboard',
  specSchema: { fields: [{ key: 'width', label: '宽度', type: 'number' }] },
};
const brand = { id: 'brand-id', slug: 'brand', name: 'Brand' };
const payload = {
  slug: 'brand-model-2026',
  category: 'snowboard',
  brand: 'brand',
  model: 'Model',
  year: 2026,
  title: 'Brand Model',
  specs: { width: 250 },
  data_source: { kind: 'crawl', origin_url: 'https://brand.example/products/model' },
};

function makePrisma(overrides: Record<string, unknown> = {}) {
  const calls = { productCreates: 0, importCreate: undefined as Record<string, unknown> | undefined };
  const prisma = {
    category: { findUnique: async () => category },
    brand: { findUnique: async () => brand },
    product: {
      findUnique: async () => null,
      findFirst: async () => null,
      create: async () => { calls.productCreates += 1; return {}; },
    },
    productImport: {
      findFirst: async () => null,
      create: async ({ data }: { data: Record<string, unknown> }) => {
        calls.importCreate = data;
        return { ...data, id: 'import-id', createdAt: new Date('2026-09-27T00:00:00.000Z') };
      },
      ...((overrides.productImport ?? {}) as Record<string, unknown>),
    },
    ...overrides,
  };
  return { prisma, calls };
}

test('stage validates a new seed and stores it pending without writing the product catalog', async () => {
  const { prisma, calls } = makePrisma();
  const service = new AdminImportService(prisma as never);

  const staged = await service.stage(payload, 'admin-id');

  assert.equal(staged.id, 'import-id');
  assert.equal(staged.status, 'pending');
  assert.equal(calls.productCreates, 0);
  assert.equal(calls.importCreate?.submittedBy, 'admin-id');
  assert.equal(calls.importCreate?.kind, 'new');
  assert.equal(calls.importCreate?.slug, payload.slug);
});

test('stage rejects a new seed when its slug already exists', async () => {
  const { prisma } = makePrisma({ product: { findUnique: async () => ({ id: 'existing-id' }) } });
  const service = new AdminImportService(prisma as never);

  await assert.rejects(() => service.stage(payload, 'admin-id'), /已存在/);
});

test('approving a new import creates a draft product only after an explicit review', async () => {
  const reviewCalls = { productCreate: undefined as Record<string, unknown> | undefined };
  const pending = {
    id: 'import-id', kind: 'new', slug: payload.slug, status: 'pending',
    product: { ...payload, images: [], status: 'draft' }, changes: [], ignoredChanges: [], originUrl: 'https://brand.example/products/model',
    submittedBy: 'admin-id', createdAt: new Date('2026-09-27T00:00:00.000Z'),
  };
  const tx = {
    category: { findUnique: async () => category },
    brand: { findUnique: async () => brand },
    productImport: {
      findUnique: async () => pending,
      updateMany: async () => ({ count: 1 }),
    },
    product: {
      findUnique: async () => null,
      findFirst: async () => null,
      create: async ({ data }: { data: Record<string, unknown> }) => { reviewCalls.productCreate = data; return { id: 'product-id', ...data }; },
    },
    productStat: { create: async () => undefined },
    dataSource: { create: async () => ({ id: 'source-id' }) },
    productImage: { createMany: async () => undefined },
    outboxEvent: { create: async () => undefined },
    auditLog: { create: async () => undefined },
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    ...tx,
  };
  const service = new AdminImportService(prisma as never);

  await service.review('import-id', { decision: 'approve' }, 'admin-id');

  assert.equal(reviewCalls.productCreate?.status, 'draft');
  assert.equal(reviewCalls.productCreate?.publishedAt, null);
});

test('approving an update changes only crawled fields and preserves the published product state', async () => {
  const specSchema = {
    fields: [
      { key: 'width', label: '宽度', type: 'number' },
      { key: 'flex', label: '硬度', type: 'number' },
      { key: 'manual', label: '人工备注', type: 'text' },
    ],
  };
  const existingProduct = {
    id: 'product-id', slug: payload.slug, brandId: brand.id, status: 'published',
    specs: { width: 249, flex: 9, manual: '人工补充' }, dataSource: 'old-source',
  };
  const pending = {
    id: 'import-id', kind: 'update', slug: payload.slug, status: 'pending',
    product: { ...payload, specs: { width: 250, flex: 8, manual: '采集旧值' }, images: [], status: 'draft' },
    changes: [{ path: 'width', kind: 'changed', previous: 249, current: 250 }],
    ignoredChanges: [], originUrl: 'https://brand.example/products/model',
  };
  const reviewCalls = { productUpdate: undefined as Record<string, unknown> | undefined };
  const tx = {
    category: { findUnique: async () => ({ ...category, specSchema }) },
    brand: { findUnique: async () => brand },
    productImport: {
      findUnique: async () => pending,
      updateMany: async () => ({ count: 1 }),
    },
    product: {
      findUnique: async () => existingProduct,
      findFirst: async () => null,
      update: async ({ data }: { data: Record<string, unknown> }) => { reviewCalls.productUpdate = data; return existingProduct; },
    },
    dataSource: { create: async () => ({ id: 'new-source-id' }) },
    outboxEvent: { create: async () => undefined },
    auditLog: { create: async () => undefined },
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    ...tx,
  };
  const service = new AdminImportService(prisma as never);

  await service.review('import-id', { decision: 'approve' }, 'admin-id');

  assert.deepEqual(reviewCalls.productUpdate?.specs, { width: 250, flex: 9, manual: '人工补充' });
  assert.equal('status' in (reviewCalls.productUpdate ?? {}), false);
});

test('review stops before catalog writes when another reviewer already claimed the queue item', async () => {
  let productCreated = false;
  const pending = {
    id: 'import-id', kind: 'new', slug: payload.slug, status: 'pending',
    product: { ...payload, images: [], status: 'draft' }, changes: [], ignoredChanges: [],
  };
  const tx = {
    productImport: {
      findUnique: async () => pending,
      updateMany: async () => ({ count: 0 }),
    },
    product: { create: async () => { productCreated = true; return { id: 'product-id' }; } },
  };
  const prisma = {
    $transaction: async <T>(callback: (transaction: typeof tx) => Promise<T>) => callback(tx),
    ...tx,
  };
  const service = new AdminImportService(prisma as never);

  await assert.rejects(() => service.review('import-id', { decision: 'approve' }, 'admin-id'), /其他操作处理/);
  assert.equal(productCreated, false);
});
