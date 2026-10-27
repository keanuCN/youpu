import assert from "node:assert/strict";
import test from "node:test";

import type { ProductDetail, ProductListItem } from "@youpu/schema";

import { GEAR, gearOfCategory } from "../data/boards";
import { productRefForGear } from "./api";
import { compactBrowseItem } from "./browse-payload";
import { mediaUrl } from "./gear-state";
import {
  getCategoryProducts,
  getCompareProducts,
  mapProductListItem,
  resolveContentSource,
} from "./content";

const localGear = GEAR[0]!;
test("compact list data preserves filters, image and product reference", () => {
  const original = { ...localGear, hero: "", gallery: [{ url: "https://example.com/board.webp", label: "正面" }] };
  const compact = compactBrowseItem(original);
  assert.equal(mediaUrl(compact), mediaUrl(original));
  assert.equal(productRefForGear(compact), productRefForGear(original));
  assert.deepEqual(compact.specs, original.specs);
  assert.deepEqual(compact.scenes, original.scenes);
  assert.equal(compact.sizeSpecs, undefined);
  assert.equal(compact.analysis.verdict, "");
});
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

test("uses the catalog slug for interactions when model text differs from the URL", () => {
  const gear = mapProductListItem({ ...apiItem, slug: "gray-sonicalmach-2027", model: "SONICAL MACH", brand: { slug: "gray", name: "GRAY" }, year: 2027 });
  assert.equal(productRefForGear(gear), "gray-sonicalmach-2027");
  const offline = GEAR.find(item => item.productSlug === "gray-sonicalmach-2027");
  assert.ok(offline);
  assert.equal(productRefForGear(offline), "gray-sonicalmach-2027");
});

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
  assert.deepEqual(gear.communityRating, { overall: 4.8, count: 12 });
  assert.deepEqual(gear.ratingDist, { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
});

test("maps API per-size equipment specs for the detail page", () => {
  const sizeSpecs = [
    { size: "156", waistWidth: 255, effectiveEdge: 1195, sidecutRadii: "7.5 m" },
    { size: "159W", waistWidth: 264, effectiveEdge: 1215, sidecutRadii: "7.8 m" },
  ];
  const gear = mapProductListItem({
    ...apiItem,
    specs: { ...apiItem.specs, sizeSpecs },
  });

  assert.deepEqual(gear.sizeSpecs, sizeSpecs);
});

test("does not restore an AI placeholder from API or local fallback images", () => {
  const aiUrl =
    "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";
  const gear = mapProductListItem({ ...apiItem, coverUrl: aiUrl }, localGear);

  assert.notEqual(gear.hero, aiUrl);
  assert.ok(gear.gallery.every((image) => image.url !== aiUrl));
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

test("loads every page of API category results", async () => {
  const items = Array.from({ length: 71 }, (_, index) => ({
    ...apiItem,
    id: `api-product-${index + 1}`,
    slug: `burton-product-${index + 1}-2026`,
    title: `Burton Product ${index + 1} 2026`,
    model: `Product ${index + 1}`,
  }));
  const requestedPages: number[] = [];
  const fetcher: typeof fetch = async (input) => {
    const url = new URL(String(input));
    const page = Number(url.searchParams.get("page"));
    const pageSize = 48;
    requestedPages.push(page);
    return new Response(JSON.stringify({
      total: items.length,
      page,
      pageSize,
      items: items.slice((page - 1) * pageSize, page * pageSize),
    }), { status: 200, headers: { "Content-Type": "application/json" } });
  };

  const result = await getCategoryProducts("snowboard", { source: "api", fetcher });

  assert.deepEqual(requestedPages, [1, 2]);
  assert.equal(result.length, 71);
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
