# 商品价格统一人民币 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将商品价格在数据库、API、前台本地资料包、后台表单、筛选和 SEO 中统一为人民币（CNY），并用固定汇率 `1 USD = 7.2 CNY` 处理现有美元价格。

**Architecture:** 在共享 schema 包中提供唯一的价格转换和区间规范化函数。seed 导入和数据库迁移负责把持久化数据转换为 CNY；web 本地资料包和 API 映射增加同一规范化逻辑作为内容边界防线；后台输入只接受 CNY。源 YAML/抓取快照仍可保留官方原始币种，但数据库 Product 的标准价格始终是 CNY。

**Tech Stack:** TypeScript, Zod, Prisma/PostgreSQL, Next.js, Node test runner, pnpm workspace。

## Global Constraints

- 固定汇率：`1 USD = 7.2 CNY`。
- 规范化结果四舍五入到元；空价格保持 `null`。
- Product API 和后台 Product 输入只能使用 `CNY`。
- 未配置的源币种必须报错，不能静默按 1:1 写入。
- 不接入实时汇率，不新增第三方依赖。
- 先写失败测试，再写生产代码；每个任务完成后运行对应测试。

## 文件结构

- Create: `packages/schema/src/price.ts` — 汇率常量、金额转换、价格区间规范化。
- Create: `packages/schema/src/price.test.ts` — 共享价格规则测试。
- Modify: `packages/schema/src/index.ts` — 导出价格模块。
- Modify: `packages/schema/src/api.ts` — Product API 币种限定为 CNY。
- Modify: `packages/schema/src/admin.ts` — 后台 Product 输入币种限定为 CNY。
- Modify: `apps/api/src/seed/importer.ts` — seed 入库前转换价格。
- Create: `apps/api/src/catalog/catalog.service.test.ts` — API 序列化的旧币种兼容测试。
- Modify: `apps/api/src/catalog/catalog.service.ts` — API 输出边界统一规范化为 CNY。
- Create: `apps/api/prisma/migrations/20260920000000_normalize_product_prices_cny/migration.sql` — 转换已有 Product 行并增加 CNY 检查约束。
- Modify: `apps/web/src/data/action-cams.ts` — 本地运动相机价格转换为 CNY。
- Modify: `apps/web/src/data/road-bikes.ts` — 本地公路车价格转换为 CNY。
- Modify: `apps/web/src/data/mountain-bikes.ts` — 本地山地车价格转换为 CNY。
- Modify: `apps/web/src/data/categories.ts` — live 类目币种和价格筛选范围统一为 CNY。
- Modify: `apps/web/src/lib/content.ts` — API/本地内容映射统一价格币种和价格区间。
- Modify: `apps/web/src/lib/format.ts` — 格式化始终输出人民币符号和金额。
- Create: `apps/web/src/lib/format.test.ts` — 人民币格式化测试。
- Modify: `apps/admin/src/components/admin-app.tsx` — 移除货币编辑输入，表单固定为人民币。
- Modify: `apps/admin/src/lib/api.ts` — 产品接口类型币种收窄为 CNY。
- Modify: `data/**/*.yaml` — 将现有正式 seed 商品中的 USD 金额按固定汇率转换为 CNY。

### Task 1: 建立共享价格规范化模块

**Files:**
- Create: `packages/schema/src/price.test.ts`
- Create: `packages/schema/src/price.ts`
- Modify: `packages/schema/src/index.ts`

**Interfaces:**
- `convertPriceToCny(value: number, currency?: string): number`
- `normalizePriceRange(input: { min?: number | null; max?: number | null; currency?: string }): { min: number | null; max: number | null; currency: 'CNY' }`

- [ ] **Step 1: Write the failing tests**

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { convertPriceToCny, normalizePriceRange } from './price';

test('keeps CNY unchanged and converts USD using the fixed rate', () => {
  assert.equal(convertPriceToCny(319, 'USD'), 2297);
  assert.equal(convertPriceToCny(2297, 'CNY'), 2297);
});

test('normalizes nullable ranges and rounds each endpoint', () => {
  assert.deepEqual(normalizePriceRange({ min: 319, max: 379.99, currency: 'USD' }), {
    min: 2297,
    max: 2736,
    currency: 'CNY',
  });
  assert.deepEqual(normalizePriceRange({ min: null, max: null, currency: 'USD' }), {
    min: null,
    max: null,
    currency: 'CNY',
  });
});

test('rejects invalid values, unknown currencies, and reversed ranges', () => {
  assert.throws(() => convertPriceToCny(-1, 'USD'), /非负/);
  assert.throws(() => convertPriceToCny(Number.NaN, 'USD'), /有限/);
  assert.throws(() => convertPriceToCny(100, 'EUR'), /未配置/);
  assert.throws(() => normalizePriceRange({ min: 300, max: 200, currency: 'CNY' }), /最小价格/);
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../packages/schema/src/price.test.ts`

Expected: FAIL because `src/price.ts` and its exports do not exist.

- [ ] **Step 3: Write the minimal implementation**

```ts
export const CANONICAL_PRICE_CURRENCY = 'CNY' as const;
export const PRICE_RATES_TO_CNY = { CNY: 1, USD: 7.2 } as const;

export function convertPriceToCny(value: number, currency = CANONICAL_PRICE_CURRENCY): number {
  if (!Number.isFinite(value)) throw new Error('价格必须是有限数字');
  if (value < 0) throw new Error('价格必须是非负数字');
  const code = currency.toUpperCase() as keyof typeof PRICE_RATES_TO_CNY;
  const rate = PRICE_RATES_TO_CNY[code];
  if (rate === undefined) throw new Error(`未配置价格币种换算：${currency}`);
  return Math.round(value * rate);
}

export function normalizePriceRange(input: {
  min?: number | null;
  max?: number | null;
  currency?: string;
}): { min: number | null; max: number | null; currency: typeof CANONICAL_PRICE_CURRENCY } {
  const currency = input.currency ?? CANONICAL_PRICE_CURRENCY;
  const code = currency.toUpperCase() as keyof typeof PRICE_RATES_TO_CNY;
  if (PRICE_RATES_TO_CNY[code] === undefined) throw new Error(`未配置价格币种换算：${currency}`);
  const min = input.min == null ? null : convertPriceToCny(input.min, currency);
  const max = input.max == null ? null : convertPriceToCny(input.max, currency);
  if (min !== null && max !== null && min > max) throw new Error('最小价格不能高于最大价格');
  return { min, max, currency: CANONICAL_PRICE_CURRENCY };
}
```

Export both functions from `packages/schema/src/index.ts`.

- [ ] **Step 4: Run the test to verify it passes**

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../packages/schema/src/price.test.ts`

Expected: PASS, 3 tests.

- [ ] **Step 5: Commit**

```bash
git add packages/schema/src/price.ts packages/schema/src/price.test.ts packages/schema/src/index.ts
git commit -m "feat: add shared CNY price normalization"
```

### Task 2: 约束 API 契约并规范 seed/admin 写入

**Files:**
- Modify: `packages/schema/src/api.ts`
- Modify: `packages/schema/src/admin.ts`
- Modify: `apps/api/src/seed/importer.ts`
- Create: `apps/api/prisma/migrations/20260920000000_normalize_product_prices_cny/migration.sql`

**Interfaces:**
- API `priceCurrency` returns `z.literal('CNY')`.
- Admin `priceCurrency` accepts only `z.literal('CNY')`.
- Seed `price.currency` remains source-compatible; importer calls `normalizePriceRange` before Prisma write.

- [ ] **Step 1: Write the failing contract test**

Add to `packages/schema/src/price.test.ts`:

```ts
import { adminProductInputSchema, productListItemSchema } from './index';

test('admin and API product contracts only expose CNY', () => {
  assert.throws(
    () => adminProductInputSchema.parse({
      slug: 'sample-product-2026', categorySlug: 'snowboard', brandSlug: 'sample',
      model: 'Sample', year: 2026, title: 'Sample', priceCurrency: 'USD', specs: {},
    }),
    /Invalid literal value/,
  );
  assert.throws(
    () => productListItemSchema.parse({
      id: '1', slug: 'sample-product-2026', title: 'Sample', model: 'Sample', year: 2026,
      oneLiner: null, priceMin: 100, priceMax: 200, priceCurrency: 'USD', coverUrl: null,
      ratingOverall: null, ratingCount: 0, favoriteCount: 0, composite: null,
      brand: { slug: 'sample', name: 'Sample' }, categorySlug: 'snowboard', specs: {}, highlights: [],
    }),
    /Invalid literal value/,
  );
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../packages/schema/src/price.test.ts`

Expected: FAIL because both contracts currently accept arbitrary three-letter currencies.

- [ ] **Step 3: Implement the write-boundary changes**

Change `priceCurrency` in `packages/schema/src/api.ts` and `packages/schema/src/admin.ts` to `z.literal('CNY')`. In `apps/api/src/seed/importer.ts`, replace the direct price assignments with:

```ts
const normalizedPrice = seed.price
  ? normalizePriceRange({ min: seed.price.min, max: seed.price.max, currency: seed.price.currency })
  : { min: null, max: null, currency: 'CNY' as const };

const productData = {
  // existing product fields remain unchanged
  priceMin: normalizedPrice.min,
  priceMax: normalizedPrice.max,
  priceCurrency: normalizedPrice.currency,
};
```

Import `normalizePriceRange` from `@youpu/schema`. The seed schema itself continues to accept the source currency so crawler drafts can represent official USD pages.

- [ ] **Step 4: Add the existing-data migration**

Create the migration with an explicit unsupported-currency guard, then convert USD rows and add the constraint:

```sql
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM product
    WHERE price_currency NOT IN ('CNY', 'USD')
  ) THEN
    RAISE EXCEPTION 'product contains unsupported price currency';
  END IF;
END $$;

UPDATE product
SET price_min = CASE WHEN price_min IS NULL THEN NULL ELSE ROUND(price_min * 7.2) END,
    price_max = CASE WHEN price_max IS NULL THEN NULL ELSE ROUND(price_max * 7.2) END,
    price_currency = 'CNY'
WHERE price_currency = 'USD';

ALTER TABLE product
  DROP CONSTRAINT IF EXISTS product_price_currency_cny;

ALTER TABLE product
  ADD CONSTRAINT product_price_currency_cny CHECK (price_currency = 'CNY');
```

- [ ] **Step 5: Run contract tests and migration**

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../packages/schema/src/price.test.ts`

Run: `pnpm db:migrate`

Expected: contract tests pass; Prisma reports the new migration applied; existing USD rows become CNY.

- [ ] **Step 6: Commit**

```bash
git add packages/schema/src/api.ts packages/schema/src/admin.ts apps/api/src/seed/importer.ts apps/api/prisma/migrations/20260920000000_normalize_product_prices_cny/migration.sql packages/schema/src/price.test.ts
git commit -m "feat: enforce CNY prices at API and database boundaries"
```

### Task 3: 统一 web 本地资料包、API 映射和格式化

**Files:**
- Modify: `apps/web/src/data/action-cams.ts`
- Modify: `apps/web/src/data/road-bikes.ts`
- Modify: `apps/web/src/data/mountain-bikes.ts`
- Modify: `apps/web/src/data/categories.ts`
- Modify: `apps/web/src/lib/content.ts`
- Modify: `apps/web/src/lib/format.ts`
- Create: `apps/web/src/lib/format.test.ts`

**Interfaces:**
- Every `GearItem` produced by local builders has `priceCurrency: 'CNY'` and CNY `price`/`priceBand` values.
- `mapProductListItem` and `mapProductDetail` return CNY prices even when handed a legacy USD API object.
- `fmtPrice(value, currency?)` always formats the normalized value as `¥...`.

- [ ] **Step 1: Write the failing web tests**

Create `apps/web/src/lib/format.test.ts`:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { fmtPrice } from './format';
import { ACTION_CAM_GEAR } from '../data/action-cams';
import { mapProductListItem } from './content';

test('formats every supported currency as a CNY amount', () => {
  assert.equal(fmtPrice(319, 'USD'), '¥2,297');
  assert.equal(fmtPrice(2297, 'CNY'), '¥2,297');
});

test('local action-camera data is canonical CNY', () => {
  const product = ACTION_CAM_GEAR.find((item) => item.model === 'Osmo Action 5 Pro');
  assert.ok(product);
  assert.equal(product.priceCurrency, 'CNY');
  assert.equal(product.price, 2297);
});

test('legacy API prices are normalized when mapped for web display', () => {
  const mapped = mapProductListItem({
    id: 'legacy', slug: 'legacy', title: 'Legacy', model: 'Legacy', year: 2026,
    oneLiner: null, priceMin: 319, priceMax: 379.99, priceCurrency: 'USD', coverUrl: null,
    ratingOverall: null, ratingCount: 0, favoriteCount: 0, composite: null,
    brand: { slug: 'dji', name: 'DJI', nameCn: null }, categorySlug: 'action-cam', specs: {}, highlights: [],
  });
  assert.equal(mapped.priceCurrency, 'CNY');
  assert.equal(mapped.price, 2517);
  assert.deepEqual(mapped.priceBand, { min: 2297, max: 2736 });
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `pnpm --filter @youpu/web exec node --import tsx --test src/lib/format.test.ts`

Expected: FAIL because the format helper and local/API data still preserve USD.

- [ ] **Step 3: Implement the web normalization**

Use `convertPriceToCny` in the three non-CNY local builders, set their output currency to CNY, and normalize their price bands. Set `ACTION_CAM`, `ROAD_BIKE`, and `MTB` category `priceCurrency` to CNY. Convert their filter bounds to CNY and use CNY-friendly slider steps (`100`, `1000`, and `1000` respectively).

In `content.ts`, normalize `item.priceMin`, `item.priceMax`, and `item.priceCurrency` once before calculating `price` and `priceBand`; return `priceCurrency: 'CNY'`. Keep the existing fallback behavior for missing prices.

In `format.ts`, call `convertPriceToCny` when a non-CNY currency is supplied, then format with the CNY symbol and zero decimal places. Remove the non-CNY symbol lookup from the output path.

- [ ] **Step 4: Run web tests to verify they pass**

Run: `pnpm --filter @youpu/web exec node --import tsx --test src/lib/format.test.ts src/lib/content.test.ts src/lib/search.test.ts`

Expected: PASS with all existing content/search tests and the new CNY assertions.

- [ ] **Step 5: Commit**

```bash
git add apps/web/src/data/action-cams.ts apps/web/src/data/road-bikes.ts apps/web/src/data/mountain-bikes.ts apps/web/src/data/categories.ts apps/web/src/lib/content.ts apps/web/src/lib/format.ts apps/web/src/lib/format.test.ts
git commit -m "feat: normalize web prices to CNY"
```

### Task 4: 固定后台商品表单为人民币

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx`
- Modify: `apps/admin/src/lib/api.ts`
- Create: `apps/admin/src/components/admin-app.test.ts`

**Interfaces:**
- New and edited product payloads always send `priceCurrency: 'CNY'`.
- The product form shows a read-only “人民币（CNY）” label instead of an editable currency input.
- Product list/detail display uses `¥` and does not show `USD` or arbitrary currency codes.

- [ ] **Step 1: Write the failing payload test**

Create `apps/admin/src/components/admin-app.test.ts` and import the current `buildProductPayload` after exporting it from the component in the implementation step. The fixture intentionally supplies `priceCurrency: 'USD'` to prove the builder ignores a stale form value:

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProductPayload } from './admin-app';

test('buildProductPayload always emits CNY for product prices', () => {
  const payload = buildProductPayload({
    slug: 'sample-product-2026', categorySlug: 'snowboard', brandSlug: 'sample',
    model: 'Sample', year: '2026', title: 'Sample', oneLiner: '',
    priceMin: '1000', priceMax: '2000', priceCurrency: 'USD', coverUrl: '',
    status: 'draft', sourceKind: 'manual', sourceUrl: '', snapshotUrl: '',
    specs: {}, editorialScores: {}, images: [],
  }, null);
  assert.equal(payload.priceCurrency, 'CNY');
});
```

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../apps/admin/src/components/admin-app.test.ts`

Expected: FAIL because the current builder copies `form.priceCurrency`.

- [ ] **Step 2: Implement the fixed-CNY form**

Export `buildProductPayload`, set the form state to `priceCurrency: 'CNY'`, make `productFormFromDetail` set the same canonical value, replace the currency `<input>` with a read-only field showing `人民币（CNY）`, and always send `priceCurrency: 'CNY'` in the create/update payload. Format the product list price with `¥` rather than appending `product.priceCurrency`.

- [ ] **Step 3: Run the focused admin checks**

Run: `pnpm --filter @youpu/api exec node --import tsx --test ../../apps/admin/src/lib/admin-session.test.ts ../../apps/admin/src/lib/admin-navigation.test.ts ../../apps/admin/src/components/admin-app.test.ts`

Expected: all tests pass and the payload always contains `priceCurrency: 'CNY'`.

- [ ] **Step 4: Commit**

```bash
git add apps/admin/src/components/admin-app.tsx apps/admin/src/lib/api.ts apps/admin/src/components/admin-app.test.ts
git commit -m "feat: lock admin product prices to CNY"
```

### Task 5: 端到端验证和资料库确认

**Files:**
- Create: `apps/api/src/catalog/catalog.service.test.ts` — 序列化旧 USD 数据时输出 CNY。
- Modify: `apps/api/src/catalog/catalog.service.ts` — 列表和详情序列化统一使用共享规范化器。
- Modify: `data/**/*.yaml` — 现有正式商品资料全部改为 CNY。

- [ ] **Step 1: Rebuild shared contracts**

Run: `pnpm --filter @youpu/schema build`

Expected: schema build passes and exports the price module.

- [ ] **Step 2: Validate and reseed source data**

Run: `pnpm --filter @youpu/api validate:data`

Run: `pnpm seed`

Expected: USD seed files import successfully as CNY Product rows; unsupported currencies fail with a clear message.

- [ ] **Step 3: Verify database/API values**

Run a read-only API check against `http://localhost:3001/api/products?category=action-cam&page=1&pageSize=48` and confirm every returned `priceCurrency` is `CNY`. Query the admin product list and confirm the same invariant.

- [ ] **Step 4: Verify frontends**

Open `http://localhost:3000` and `http://localhost:3002`, inspect an action camera, road bike, and mountain bike, and confirm cards, detail pages, price filters, SEO metadata, and admin form all show `¥`/人民币.

- [ ] **Step 5: Run proportional verification**

Run:

```bash
pnpm typecheck
pnpm build
```

Expected: schema, API, web, and admin type checks/builds pass. If Elasticsearch is not configured, record that search indexing is skipped; database and local web verification remain required.

- [ ] **Step 6: Commit verification-only fixes and report**

If verification changed files, commit them with `git add` and a focused message. Report the final commit, migration result, API invariant result, and the three local URLs.
