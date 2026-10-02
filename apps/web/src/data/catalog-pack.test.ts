import assert from "node:assert/strict";
import test from "node:test";

import type { GearItem } from "../types";
import { applyCatalogSnapshot } from "./catalog-pack";
import type { CatalogSnapshotItem } from "./catalog-snapshot";

const base: GearItem = {
  id: "local-camera-1",
  categorySlug: "action-cam",
  brand: "DJI",
  model: "Osmo Action 6",
  year: 2026,
  price: 2999,
  priceCurrency: "CNY",
  scenes: ["cycling"],
  flexValue: 0,
  flexLabel: "不适用",
  hero: "/local-cover.png",
  gallery: [{ url: "/local-cover.png", label: "本地内容" }],
  specs: { maxVideo: "4K" },
  scores: { imageQuality: 8 },
  composite: 82,
  hardcore: 0,
  heat: 10,
  whoFor: ["本地编辑内容"],
  analysis: { verdict: "本地结论", strengths: ["保留"], weaknesses: [], fits: [], notFits: [] },
  priceBand: { min: 2999, max: 2999 },
  ratingDist: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 },
  isNew: false,
  addedAt: "2026-01-01",
};

function snapshot(overrides: Partial<CatalogSnapshotItem>): CatalogSnapshotItem {
  return {
    id: "cloud-1",
    slug: "dji-osmo-action-6-2026",
    title: "DJI Osmo Action 6 2026",
    model: "Osmo Action 6",
    year: 2026,
    oneLiner: "云端结论",
    priceMin: 3299,
    priceMax: 3499,
    priceCurrency: "CNY",
    coverUrl: "/cloud-cover.png",
    ratingOverall: null,
    ratingCount: 0,
    favoriteCount: 0,
    composite: 86.5,
    brand: { slug: "dji", name: "DJI", nameCn: "大疆" },
    categorySlug: "action-cam",
    specs: { maxVideo: "8K", scenes: ["cycling", "travel"] },
    highlights: [],
    ...overrides,
  };
}

test("云端快照覆盖事实字段并保留本地编辑内容", () => {
  const [result] = applyCatalogSnapshot([base], [snapshot({})]);

  assert.equal(result?.id, "local-camera-1");
  assert.equal(result?.price, 3399);
  assert.equal(result?.hero, "/cloud-cover.png");
  assert.deepEqual(result?.scenes, ["cycling", "travel"]);
  assert.equal(result?.specs.maxVideo, "8K");
  assert.deepEqual(result?.whoFor, ["本地编辑内容"]);
  assert.equal(result?.analysis.verdict, "云端结论");
  assert.equal(result?.scores.imageQuality, 8);
});

test("未获准的云端封面回退时保留本地图像语义，不伪装成目录封面", () => {
  const local = { ...base, gallery: [{ url: base.hero, label: "底面 / BASE" }] };
  const [result] = applyCatalogSnapshot([local], [snapshot({ coverUrl: "https://untrusted.example/image.jpg" })]);

  assert.deepEqual(result?.gallery, local.gallery);
});

test("云端新增产品进入统一目录并使用明确的空默认值", () => {
  const result = applyCatalogSnapshot([], [snapshot({ slug: "new-brand-new-model-2026", model: "New Model" })]);

  assert.equal(result.length, 1);
  assert.equal(result[0]?.id, "new-brand-new-model-2026");
  assert.equal(result[0]?.composite, 86.5);
  assert.deepEqual(result[0]?.whoFor, []);
  assert.deepEqual(result[0]?.ratingDist, { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 });
});
