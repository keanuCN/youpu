import assert from "node:assert/strict";
import test from "node:test";

import type { ProductListItem } from "@youpu/schema";

import { GEAR, gearOfCategory } from "../data/boards";
import {
  getCategoryProducts,
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
  const result = await getCategoryProducts("snowboard", {
    source: "api",
    fetcher: failingFetcher,
  });

  assert.deepEqual(result, gearOfCategory("snowboard"));
});
