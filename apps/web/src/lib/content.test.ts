import assert from "node:assert/strict";
import test from "node:test";

import type { ProductDetail, ProductListItem } from "@youpu/schema";

import { GEAR, gearOfCategory } from "../data/boards";
import {
  getCategoryProducts,
  getCompareProducts,
  mapProductListItem,
  resolveContentSource,
} from "./content";

const localGear = GEAR[0]!;
const apiItem: ProductListItem = {
  id: "api-product-1",
  slug: "burton-custom-camber-2026",
  title: "Burton Custom Camber 2026",
  model: "Custom Camber",
  year: 2026,
  oneLiner: "API 版本的一句话结论",
  priceMin: 6200,
  priceMax: 6400,
  priceCurrency: "CNY",
  coverUrl: "/api-cover.png",
  ratingOverall: 4.8,
  ratingCount: 12,
  favoriteCount: 4,
  composite: 8.7,
  brand: { slug: "burton", name: "Burton", nameCn: "伯顿" },
  categorySlug: "snowboard",
  specs: { flex: 7, scenes: ["all-mountain", "carving"] },
  highlights: [{ key: "flex", label: "硬度", value: "7" }],
};

const apiDetail: ProductDetail = {
  ...apiItem,
  ratingSub: null,
  editorialScores: { stability: 8 },
  brand: { ...apiItem.brand, country: "US", officialUrl: "https://example.com" },
  category: { slug: "snowboard", name: "单板" },
  images: [],
  specSchema: null,
  specRows: [],
};

const failingFetcher: typeof fetch = async () => {
  throw new Error("API offline");
};

test("defaults to the local content pack", () => {
  assert.equal(resolveContentSource({}), "pack");
  assert.equal(resolveContentSource({ NEXT_PUBLIC_CONTENT_SOURCE: "api" }), "api");
});

test("maps an API list item while preserving local transitional fields", () => {
  const gear = mapProductListItem(apiItem, localGear);

  assert.equal(gear.id, localGear.id);
  assert.equal(gear.brand, "Burton");
  assert.equal(gear.price, 6300);
  assert.equal(gear.composite, 8.7);
  assert.equal(gear.hero, "/api-cover.png");
  assert.deepEqual(gear.analysis, localGear.analysis);
});

test("uses the API slug as the route id for products outside the local pack", () => {
  const gear = mapProductListItem({
    ...apiItem,
    id: "database-uuid",
    slug: "new-brand-new-product-2026",
    model: "New Product",
    brand: { ...apiItem.brand, name: "New Brand" },
  });

  assert.equal(gear.id, "new-brand-new-product-2026");
});

test("falls back to the local pack when the API request fails", async () => {
  let fallbackError: unknown;
  const result = await getCategoryProducts("snowboard", {
    source: "api",
    fetcher: failingFetcher,
    onFallback: (error) => {
      fallbackError = error;
    },
  });

  assert.deepEqual(result, gearOfCategory("snowboard"));
  assert.equal((fallbackError as Error).message, "API offline");
});

test("content API requests bypass the Next server cache", async () => {
  let receivedCache: RequestCache | undefined;
  const fetcher: typeof fetch = async (_input, init) => {
    receivedCache = init?.cache;
    return new Response(JSON.stringify({
      total: 0,
      page: 1,
      pageSize: 48,
      items: [],
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  await getCategoryProducts("snowboard", { source: "api", fetcher });
  assert.equal(receivedCache, "no-store");
});

test("loads API details for the compare dock in request order", async () => {
  let receivedUrl = "";
  const fetcher: typeof fetch = async (input, init) => {
    receivedUrl = String(input);
    assert.equal(init?.cache, "no-store");
    return new Response(JSON.stringify({ items: [apiDetail] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await getCompareProducts([apiDetail.slug], { source: "api", fetcher });
  assert.match(receivedUrl, /\/api\/products\?ids=burton-custom-camber-2026/);
  assert.equal(result.length, 1);
  assert.equal(result[0]?.model, apiDetail.model);
});

test("keeps an API product when its canonical slug differs from its display-derived slug", async () => {
  const canonical = {
    ...apiDetail,
    id: "database-uuid-victor",
    slug: "victor-auraspeed-100x-se-2026",
    title: "VICTOR AURASPEED 100X SE 2026",
    model: "AURASPEED 100X SE H",
    brand: { ...apiDetail.brand, name: "VICTOR", nameCn: "威克多" },
    category: { slug: "badminton-racket", name: "羽毛球拍" },
  } satisfies ProductDetail;
  let receivedUrl = "";
  const fetcher: typeof fetch = async (input) => {
    receivedUrl = String(input);
    return new Response(JSON.stringify({ items: [canonical] }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  };

  const result = await getCompareProducts([canonical.slug], { source: "api", fetcher });

  assert.match(receivedUrl, /victor-auraspeed-100x-se-2026/);
  assert.equal(result.length, 1);
  assert.equal(result[0]?.id, canonical.slug);
  assert.equal(result[0]?.model, canonical.model);
});
