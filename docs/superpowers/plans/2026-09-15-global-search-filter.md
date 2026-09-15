# Global Search and Filters Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a cross-category `/search` experience backed by a stable API that uses PostgreSQL by default, Elasticsearch when available, and the local content pack as a frontend fallback.

**Architecture:** Add a shared Zod response contract and a small search query parser. The Nest API exposes `GET /api/search`; `SearchService` tries an optional Elasticsearch adapter and falls back to a PostgreSQL implementation that only reads published products. The Next frontend owns URL state, renders a reusable result/filter page, maps API items through the existing content mapper, and locally searches `GEAR` when the API is unavailable.

**Tech Stack:** TypeScript, Zod, NestJS, Prisma, PostgreSQL, Elasticsearch 8 with IK mappings, Next.js 14 App Router, React, Tailwind CSS, `tsx --test`.

## Global Constraints

- Node must remain `>=20` and the workspace must remain compatible with pnpm 9.
- Search results must include only products whose database status is `published`.
- Elasticsearch is optional and must not be required for API startup or PostgreSQL search.
- The public response must use one shared Zod contract for both PostgreSQL and Elasticsearch paths.
- Search URLs must preserve query, filters, sort, and page state.
- The first version does not add autocomplete, search history, personalized ranking, or draft preview.
- Existing `/browse/[slug]`, details, compare, image proxy, and localStorage behavior must remain intact.
- Query-string search pages must be `noindex, follow`.
- Use `no-store` for live API requests and fall back to the local content pack on frontend API failure.

## File Map

- Create `packages/schema/src/search.ts`: shared search query/response and facet schemas.
- Modify `packages/schema/src/index.ts`: export the search contract.
- Create `packages/schema/src/search.test.ts`: contract parsing tests.
- Create `apps/api/src/search/search-query.ts`: raw query parsing and validation.
- Create `apps/api/src/search/search-query.test.ts`: parser tests.
- Create `apps/api/src/search/search.service.ts`: provider selection, PostgreSQL search, pagination, and facets.
- Create `apps/api/src/search/search.service.test.ts`: pure ranking/filter helper tests.
- Create `apps/api/src/search/search.controller.ts`: `GET /api/search` endpoint.
- Modify `apps/api/src/search/search.module.ts`: register controller and service.
- Modify `apps/api/src/search/elastic.service.ts`: add optional search and aggregation adapter method.
- Modify `apps/api/src/outbox/consumers/product-es-sync.consumer.ts`: include model, slug, and category/brand fields required by the search document.
- Modify `apps/api/src/catalog/catalog.service.ts`: extract the published list-item serializer so catalog and search return identical items.
- Create `apps/web/src/lib/search.ts`: API request, local fallback search, URL parameter helpers, and frontend result mapping.
- Create `apps/web/src/lib/search.test.ts`: local search and URL parsing tests.
- Create `apps/web/src/app/search/page.tsx`: noindex search route and metadata.
- Create `apps/web/src/app/search/search-client.tsx`: result page, filters, sorting, pagination, loading, and empty states.
- Modify `apps/web/src/components/layout/site-header.tsx`: route both desktop and mobile search to `/search` and remove the old snowboard-only behavior.
- Modify `README.md`: document the endpoint, local fallback, and optional Elasticsearch behavior.

---

### Task 1: Add the shared search contract and query parser

**Files:**
- Create: `packages/schema/src/search.ts`
- Modify: `packages/schema/src/index.ts`
- Create: `packages/schema/src/search.test.ts`
- Create: `apps/api/src/search/search-query.ts`
- Create: `apps/api/src/search/search-query.test.ts`

**Interfaces:**
- Produces `searchSortSchema`, `searchResponseSchema`, `SearchResponse`, `SearchParams`, and `parseSearchQuery` for the API and web layers.
- `SearchParams` is `{ q: string; category?: string; brand?: string; year?: number; priceMin?: number; priceMax?: number; sort: 'relevance' | 'new' | 'rating'; page: number; pageSize: number }`.

- [ ] **Step 1: Write failing contract tests.**

Add tests that assert a valid response containing one `ProductListItem` and facets parses, while an invalid sort and a missing `items` array fail.

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { searchResponseSchema } from "./search";

test("search response accepts products and facets", () => {
  const result = searchResponseSchema.parse({
    query: "burton",
    total: 1,
    page: 1,
    pageSize: 20,
    items: [],
    facets: {
      categories: [{ slug: "snowboard", name: "单板", count: 1 }],
      brands: [{ slug: "burton", name: "Burton", nameCn: null, count: 1 }],
      years: [{ value: 2026, count: 1 }],
      price: { min: 6299, max: 6299 },
    },
  });
  assert.equal(result.facets.brands[0]?.slug, "burton");
});

test("search response rejects an unknown sort at the contract boundary", () => {
  const result = searchResponseSchema.safeParse({
    query: "burton",
    total: 0,
    page: 1,
    pageSize: 20,
    items: [],
    facets: { categories: [], brands: [], years: [], price: { min: null, max: null } },
    sort: "random",
  });
  assert.equal(result.success, false);
});
```

- [ ] **Step 2: Run the contract test and verify it fails.**

Run:

```powershell
pnpm exec tsx --test packages/schema/src/search.test.ts
```

Expected: FAIL because `packages/schema/src/search.ts` does not exist.

- [ ] **Step 3: Add the shared schemas and export them.**

Implement the following complete public shapes in `packages/schema/src/search.ts`:

```ts
import { z } from "zod";
import { productListItemSchema } from "./api";

export const searchSortSchema = z.enum(["relevance", "new", "rating"]);
export type SearchSort = z.infer<typeof searchSortSchema>;

export const searchFacetSchema = z.object({
  categories: z.array(z.object({ slug: z.string(), name: z.string(), count: z.number().int().nonnegative() })),
  brands: z.array(z.object({ slug: z.string(), name: z.string(), nameCn: z.string().nullable(), count: z.number().int().nonnegative() })),
  years: z.array(z.object({ value: z.number().int(), count: z.number().int().nonnegative() })),
  price: z.object({ min: z.number().nullable(), max: z.number().nullable() }),
});

export const searchResponseSchema = z.object({
  query: z.string(),
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive().max(48),
  sort: searchSortSchema,
  items: z.array(productListItemSchema),
  facets: searchFacetSchema,
});
export type SearchFacet = z.infer<typeof searchFacetSchema>;
export type SearchResponse = z.infer<typeof searchResponseSchema>;
```

Export `./search` from `packages/schema/src/index.ts`.

- [ ] **Step 4: Add failing query-parser tests.**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { parseSearchQuery } from "./search-query";

test("parser trims and defaults search parameters", () => {
  assert.deepEqual(parseSearchQuery({ q: "  burton ", page: undefined }), {
    q: "burton",
    sort: "relevance",
    page: 1,
    pageSize: 20,
  });
});

test("parser rejects empty queries, invalid numbers, and reversed prices", () => {
  assert.throws(() => parseSearchQuery({ q: " " }), /q/);
  assert.throws(() => parseSearchQuery({ q: "burton", page: "0" }), /page/);
  assert.throws(() => parseSearchQuery({ q: "burton", priceMin: "7000", priceMax: "3000" }), /price/);
});
```

- [ ] **Step 5: Run the parser test and verify it fails.**

Run:

```powershell
pnpm exec tsx --test apps/api/src/search/search-query.test.ts
```

Expected: FAIL because `parseSearchQuery` is not defined.

- [ ] **Step 6: Implement parser normalization.**

Use a pure parser with these exact rules:

```ts
export interface RawSearchQuery {
  q?: string;
  category?: string;
  brand?: string;
  year?: string;
  priceMin?: string;
  priceMax?: string;
  sort?: string;
  page?: string;
  pageSize?: string;
}

export interface SearchParams {
  q: string;
  category?: string;
  brand?: string;
  year?: number;
  priceMin?: number;
  priceMax?: number;
  sort: "relevance" | "new" | "rating";
  page: number;
  pageSize: number;
}

export function parseSearchQuery(input: RawSearchQuery): SearchParams {
  const q = input.q?.trim() ?? "";
  if (!q || q.length > 128) throw new Error("q 必须是 1–128 个字符");
  const page = parsePositive(input.page, "page", 1);
  const pageSize = Math.min(48, parsePositive(input.pageSize, "pageSize", 20));
  const sort = input.sort === undefined || input.sort === "" ? "relevance" : input.sort;
  if (sort !== "relevance" && sort !== "new" && sort !== "rating") throw new Error("sort 不合法");
  const year = parseOptionalInteger(input.year, "year");
  const priceMin = parseOptionalNumber(input.priceMin, "priceMin");
  const priceMax = parseOptionalNumber(input.priceMax, "priceMax");
  if (priceMin !== undefined && priceMax !== undefined && priceMin > priceMax) throw new Error("priceMin 不能高于 priceMax");
  return {
    q,
    category: input.category?.trim() || undefined,
    brand: input.brand?.trim() || undefined,
    year,
    priceMin,
    priceMax,
    sort,
    page,
    pageSize,
  };
}
```

Map parser errors to Nest `BadRequestException` only in the controller, not inside this pure module.

- [ ] **Step 7: Run both tests and typecheck the shared package.**

Run:

```powershell
pnpm exec tsx --test packages/schema/src/search.test.ts apps/api/src/search/search-query.test.ts
pnpm --filter @youpu/schema build
pnpm --filter @youpu/api typecheck
```

Expected: all tests pass and both packages typecheck.

- [ ] **Step 8: Commit the contract and parser.**

```powershell
git add packages/schema/src/search.ts packages/schema/src/search.test.ts packages/schema/src/index.ts apps/api/src/search/search-query.ts apps/api/src/search/search-query.test.ts
git commit -m "feat: add shared search contract and query parser"
```

### Task 2: Implement the PostgreSQL search provider

**Files:**
- Create: `apps/api/src/search/search.service.ts`
- Create: `apps/api/src/search/search.service.test.ts`
- Modify: `apps/api/src/catalog/catalog.service.ts`

**Interfaces:**
- Consumes `SearchParams` from `search-query.ts`, `PrismaService`, `ElasticService`, and the shared `SearchResponse` contract.
- Produces `SearchService.search(params: SearchParams): Promise<SearchResponse>`.
- Produces a reusable `toProductListItem(row: ProductListRow): ProductListItem` serializer used by catalog and search.

- [ ] **Step 1: Write provider helper tests.**

Test the pure helper used by PostgreSQL relevance fallback:

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { searchScore } from "./search.service";

test("exact model and brand matches rank above a one-liner-only match", () => {
  const exact = searchScore({ q: "burton custom", title: "Burton Custom Camber", model: "Custom Camber", brand: "Burton", oneLiner: null });
  const prose = searchScore({ q: "burton custom", title: "Jones Mountain Twin", model: "Mountain Twin", brand: "Jones", oneLiner: "适合 Burton Custom 用户升级" });
  assert.ok(exact > prose);
});

test("search score is case-insensitive and whitespace-normalized", () => {
  assert.equal(
    searchScore({ q: " BURTON ", title: "Burton Custom", model: "Custom", brand: "Burton", oneLiner: null }),
    searchScore({ q: "burton", title: "Burton Custom", model: "Custom", brand: "Burton", oneLiner: null }),
  );
});
```

- [ ] **Step 2: Run the helper test and verify it fails.**

Run:

```powershell
pnpm exec tsx --test apps/api/src/search/search.service.test.ts
```

Expected: FAIL because `searchScore` is not exported yet.

- [ ] **Step 3: Extract the catalog list serializer.**

Move the current list-row mapping, `pickListSpecs`, and `buildHighlights` logic from `apps/api/src/catalog/catalog.service.ts` into a focused serializer in the same service module or a focused adjacent module. Preserve the existing `GET /api/products` response byte shape. The serializer must receive the row's brand, category, stat, specs, and editorial fields and return the existing `ProductListItem` shape.

- [ ] **Step 4: Implement PostgreSQL matching and facets.**

Use one Prisma `where` object with these conditions:

```ts
const where: Prisma.ProductWhereInput = {
  status: "published",
  ...(params.category ? { category: { slug: params.category } } : {}),
  ...(params.brand ? { brand: { slug: params.brand } } : {}),
  ...(params.year === undefined ? {} : { year: params.year }),
  ...(params.priceMin === undefined ? {} : { priceMax: { gte: params.priceMin } }),
  ...(params.priceMax === undefined ? {} : { priceMin: { lte: params.priceMax } }),
  OR: [
    { title: { contains: params.q, mode: "insensitive" } },
    { model: { contains: params.q, mode: "insensitive" } },
    { slug: { contains: params.q, mode: "insensitive" } },
    { oneLiner: { contains: params.q, mode: "insensitive" } },
    { brand: { name: { contains: params.q, mode: "insensitive" } } },
    { brand: { nameCn: { contains: params.q, mode: "insensitive" } } },
  ],
};
```

Fetch the total and paginated rows in a transaction. Fetch only `id`, `title`, `model`, `slug`, `year`, `oneLiner`, pricing, cover, ratings, specs, editorial scores, the brief brand, the category schema, and stat fields required by the existing serializer. Build facets from the same filtered published row set using in-memory counts of category, brand, year, and price min/max; keep the first implementation bounded to the current catalog size and do not load nested specs for facet rows.

Implement these ordering rules:

```ts
if (params.sort === "new") return [{ year: "desc" }, { publishedAt: "desc" }];
if (params.sort === "rating") return [{ ratingOverall: { sort: "desc", nulls: "last" } }, { ratingCount: "desc" }];
return undefined;
```

For `relevance`, fetch the matching page with a stable database order and sort the bounded matching candidates by `searchScore` before slicing the page. Exact model, exact title, exact brand, title/model substring, and one-liner substring must have descending weights in that order.

- [ ] **Step 5: Implement the provider selection boundary.**

`SearchService.search` must use the following sequence:

```ts
if (this.elastic.enabled) {
  try {
    return await this.elastic.searchProducts(params);
  } catch (error) {
    this.logger.warn(`ES search failed; falling back to PostgreSQL: ${(error as Error).message}`);
  }
}
return this.searchPostgres(params);
```

The PostgreSQL path must always enforce `status: "published"` even when filters are absent.

- [ ] **Step 6: Run tests and preserve catalog behavior.**

Run:

```powershell
pnpm exec tsx --test apps/api/src/search/search.service.test.ts
pnpm --filter @youpu/api typecheck
```

Expected: helper tests pass, API typecheck passes, and the existing catalog list service compiles without changing its response contract.

- [ ] **Step 7: Commit the PostgreSQL provider.**

```powershell
git add apps/api/src/search/search.service.ts apps/api/src/search/search.service.test.ts apps/api/src/catalog/catalog.service.ts
git commit -m "feat: add PostgreSQL product search"
```

### Task 3: Add the API controller and optional Elasticsearch adapter

**Files:**
- Create: `apps/api/src/search/search.controller.ts`
- Modify: `apps/api/src/search/search.module.ts`
- Modify: `apps/api/src/search/elastic.service.ts`

**Interfaces:**
- `GET /api/search` returns `SearchResponse`.
- `ElasticService.searchProducts(params: SearchParams): Promise<SearchResponse>` is only called when `ElasticService.enabled` is true.

- [ ] **Step 1: Add the controller around the parser.**

Implement:

```ts
@Controller()
export class SearchController {
  constructor(private readonly search: SearchService) {}

  @Get("search")
  async search(@Query() query: RawSearchQuery): Promise<SearchResponse> {
    try {
      return await this.search.search(parseSearchQuery(query));
    } catch (error) {
      if (error instanceof Error && /^(q|sort|page|pageSize|year|price)/.test(error.message)) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }
  }
}
```

Keep this endpoint outside the admin guard. It is a public catalog endpoint and must not accept a bearer token requirement.

- [ ] **Step 2: Register the controller and provider.**

Update `apps/api/src/search/search.module.ts` so it imports `PrismaModule` through the existing global module behavior, provides `ElasticService` and `SearchService`, and lists `SearchController` in `controllers`.

- [ ] **Step 3: Add optional Elasticsearch search.**

Extend the index mapping and `ProductEsSyncConsumer` document with `slug`, `model`, `categorySlug`, and `brandSlug` in addition to the existing `title`, `brandName`, `categoryPath`, and score fields. Add one method to `ElasticService` that calls `ensureIndex`, executes a `bool` query with a `multi_match` over `title`, `model`, `brandName`, and `oneLiner`, applies published-index filters for category, brand, year, and price, and returns the shared response shape. Use terms aggregations for category, brand, and year facets and min/max aggregations for price. Apply explicit sort for `new` and `rating`, otherwise use `_score` descending followed by `ratingCount` descending.

The method must throw on connection, missing index, or malformed response so `SearchService` can fall back to PostgreSQL. It must never return draft records because the index only contains published products and its filter should include the published invariant in the document contract.

- [ ] **Step 4: Run API typecheck and endpoint smoke tests.**

Run:

```powershell
pnpm --filter @youpu/api typecheck
```

When PostgreSQL is available:

```powershell
Invoke-WebRequest 'http://localhost:3001/api/search?q=burton&page=1&pageSize=20' | Select-Object -ExpandProperty StatusCode
```

Expected: `200` and a JSON body containing `query`, `sort`, `items`, and `facets`. With ES unavailable, the API log may report the optional ES path is disabled, but the HTTP response remains `200` through PostgreSQL.

- [ ] **Step 5: Commit the endpoint and ES adapter.**

```powershell
git add apps/api/src/search/search.controller.ts apps/api/src/search/search.module.ts apps/api/src/search/elastic.service.ts
git commit -m "feat: expose product search API with optional Elasticsearch"
```

### Task 4: Add frontend search data access and local fallback

**Files:**
- Create: `apps/web/src/lib/search.ts`
- Create: `apps/web/src/lib/search.test.ts`

**Interfaces:**
- `searchCatalog(params: SearchRequest, fetcher?: typeof fetch): Promise<SearchCatalogResult>`.
- `SearchRequest` mirrors the URL/API fields: `{ q: string; category?: string; brand?: string; year?: number; priceMin?: number; priceMax?: number; sort: SearchSort; page: number; pageSize: number }`.
- `SearchCatalogResult` contains `{ query, total, page, pageSize, sort, items: GearItem[], facets, source: 'api' | 'pack' }`.

- [ ] **Step 1: Write fallback tests.**

```ts
import test from "node:test";
import assert from "node:assert/strict";
import { buildSearchParams, searchLocalGear } from "./search";
import { GEAR } from "../data/boards";

test("local search matches brand, model, and year", () => {
  const result = searchLocalGear(GEAR, { q: "burton", sort: "relevance", page: 1, pageSize: 20 });
  assert.ok(result.items.length > 0);
  assert.ok(result.items.every((item) => item.brand.toLowerCase().includes("burton")));
});

test("URL builder preserves filters and sort", () => {
  assert.equal(
    buildSearchParams({ q: "custom camber", category: "snowboard", priceMin: 3000, sort: "rating", page: 2, pageSize: 20 }).toString(),
    "q=custom+camber&category=snowboard&priceMin=3000&sort=rating&page=2&pageSize=20",
  );
});
```

- [ ] **Step 2: Run the fallback tests and verify they fail.**

Run:

```powershell
pnpm exec tsx --test apps/web/src/lib/search.test.ts
```

Expected: FAIL because `search.ts` does not exist.

- [ ] **Step 3: Implement API request and local fallback.**

Use `searchResponseSchema.parse(await response.json())` for the API path and `mapProductListItem` for each API item. Set `{ cache: "no-store" }` and abort after the existing content timeout. Catch network, non-2xx, and schema errors, then call `searchLocalGear(GEAR, params)`.

The local path must search the same fields available in `GearItem` (`brand`, `model`, and `year`), apply category, price, brand, and year filters, sort by relevance/new/rating using `composite`, and return page metadata plus facet counts derived from the filtered local result.

Use this URL helper shape:

```ts
export function buildSearchParams(params: SearchRequest): URLSearchParams {
  const query = new URLSearchParams();
  query.set("q", params.q);
  if (params.category) query.set("category", params.category);
  if (params.brand) query.set("brand", params.brand);
  if (params.year !== undefined) query.set("year", String(params.year));
  if (params.priceMin !== undefined) query.set("priceMin", String(params.priceMin));
  if (params.priceMax !== undefined) query.set("priceMax", String(params.priceMax));
  query.set("sort", params.sort);
  query.set("page", String(params.page));
  query.set("pageSize", String(params.pageSize));
  return query;
}
```

- [ ] **Step 4: Run frontend tests and typecheck.**

Run:

```powershell
pnpm exec tsx --test apps/web/src/lib/search.test.ts
pnpm --filter @youpu/web typecheck
```

Expected: all fallback tests pass and the web package typechecks.

- [ ] **Step 5: Commit frontend search data access.**

```powershell
git add apps/web/src/lib/search.ts apps/web/src/lib/search.test.ts
git commit -m "feat: add frontend search data fallback"
```

### Task 5: Build the `/search` result page and connect the header

**Files:**
- Create: `apps/web/src/app/search/page.tsx`
- Create: `apps/web/src/app/search/search-client.tsx`
- Modify: `apps/web/src/components/layout/site-header.tsx`

**Interfaces:**
- `SearchPage` provides `metadata` with `robots: { index: false, follow: true }` and renders `SearchClient`.
- `SearchClient` reads `q`, `category`, `brand`, `year`, `priceMin`, `priceMax`, `sort`, and `page` from `useSearchParams` and calls `searchCatalog`.

- [ ] **Step 1: Add the route shell and metadata.**

Create the page with a noindex metadata object and a client component. Do not use static `generateStaticParams` for this route.

```tsx
import type { Metadata } from "next";
import { SearchClient } from "./search-client";

export const metadata: Metadata = {
  title: "搜索装备",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return <SearchClient />;
}
```

- [ ] **Step 2: Implement query state and loading behavior.**

Initialize state from `useSearchParams`, normalize missing values to `sort: "relevance"`, `page: 1`, `pageSize: 20`, and request search results in an effect. When a filter, sort, or page changes, update the URL with `router.replace` and let the URL remain the single source of truth. Render a loading label while the request is pending and preserve the current result until the replacement response arrives.

- [ ] **Step 3: Implement the result grid and empty state.**

Render the result count, current query, mapped `GearCard` grid, and these empty states:

```tsx
{loading ? <p className="mono-label">SEARCHING / 搜索中……</p> : null}
{!loading && !items.length ? (
  <div className="border border-dashed border-border py-24 text-center">
    <p className="text-[15px] font-medium">没有找到符合条件的装备</p>
    <p className="mono-label mt-2">试着更换品牌、型号或放宽价格范围</p>
  </div>
) : null}
```

Use existing card links and image resolution through the `GearItem` mapping. Do not add a second card implementation.

- [ ] **Step 4: Implement filters and pagination.**

Render facet chips for categories, brands, and years; use the existing `Slider` for the price range; add sort controls for `relevance`, `new`, and `rating`; add previous/next buttons that update `page`. Reset page to 1 whenever a filter or sort changes. Use an accessible mobile `Sheet` matching the existing browse page.

- [ ] **Step 5: Update the header search behavior.**

Change both desktop and mobile submit handlers to:

```ts
const submitSearch = () => {
  const query = q.trim();
  if (!query) return;
  router.push(`/search?q=${encodeURIComponent(query)}`);
  setSearchOpen(false);
};
```

Remove the old local hit count and snowboard-only route. Track the final result count from `SearchClient` once per loaded query so analytics reflects API or pack results rather than a precomputed local guess.

- [ ] **Step 6: Run web checks and inspect both breakpoints.**

Run:

```powershell
pnpm --filter @youpu/web typecheck
pnpm --filter @youpu/web build
```

Then verify manually at `http://localhost:3000/search?q=burton`:

- desktop filters appear on the left;
- mobile filters open in a sheet;
- search URL survives refresh;
- result cards open the existing gear detail page;
- no-result state is readable;
- the header routes to `/search` from desktop and mobile.

- [ ] **Step 7: Commit the search page.**

```powershell
git add apps/web/src/app/search apps/web/src/components/layout/site-header.tsx
git commit -m "feat: add global search results page"
```

### Task 6: Document the feature and run the full verification pass

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document the endpoint and fallback behavior.**

Add a short section under the API/frontend documentation:

```md
### 全局搜索

`GET /api/search?q=关键词` 提供跨类目搜索、类目/品牌/年份/价格筛选和分页。
Elasticsearch 配置可用时使用中文分词；未配置或不可用时自动使用 PostgreSQL，API 不依赖 ES 才能启动。
前端 `/search` 失败时回退到本地内容包，因此静态前端仍可浏览已有内容。
```

- [ ] **Step 2: Run all focused tests.**

```powershell
pnpm exec tsx --test packages/schema/src/search.test.ts apps/api/src/search/search-query.test.ts apps/api/src/search/search.service.test.ts apps/web/src/lib/search.test.ts
```

Expected: every test passes.

- [ ] **Step 3: Run repository typechecks and builds.**

```powershell
pnpm typecheck
pnpm --filter @youpu/web build
pnpm --filter @youpu/api build
pnpm --filter @youpu/admin build
```

Expected: all commands exit with code 0 and no new TypeScript errors.

- [ ] **Step 4: Run live endpoint checks when infrastructure is available.**

```powershell
Invoke-WebRequest 'http://localhost:3001/api/search?q=burton&page=1&pageSize=20' | Select-Object -ExpandProperty StatusCode
Invoke-WebRequest 'http://localhost:3000/search?q=burton' | Select-Object -ExpandProperty StatusCode
```

Expected: both return `200`; the API JSON contains `items` and `facets`, and the page HTML contains the search route shell.

- [ ] **Step 5: Run `git diff --check` and inspect the final diff.**

```powershell
git diff --check
git status --short
git diff --stat HEAD~6..HEAD
```

Confirm that the search commits contain only search-related changes and that pre-existing content-layer/image changes remain untouched.

- [ ] **Step 6: Commit the documentation and verification updates.**

```powershell
git add README.md
git commit -m "docs: document global search"
```
