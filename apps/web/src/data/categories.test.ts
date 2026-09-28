import assert from "node:assert/strict";
import test from "node:test";

import { CATEGORY_TREE, flatCategoryList, getCategory, isLive } from "./categories";

const HIDDEN_CATEGORY_SLUGS = new Set([
  "watches",
  "sports-watch",
  "gps-watch",
  "beverage-kitchen",
  "outdoor-camping",
  "running",
  "fitness",
  "diving",
  "digital-accessories",
]);

test("暂不开放的品类组不出现在前台目录树中", () => {
  const visibleSlugs = new Set(flatCategoryList().map((category) => category.slug));

  for (const slug of HIDDEN_CATEGORY_SLUGS) {
    assert.equal(visibleSlugs.has(slug), false, `${slug} 应从前台目录中隐藏`);
  }
});

test("收窄品类范围时保留当前重点品类", () => {
  const visibleSlugs = new Set(flatCategoryList().map((category) => category.slug));
  const rootSlugs = new Set(CATEGORY_TREE.map((category) => category.slug));

  assert.equal(rootSlugs.has("sport"), true);
  assert.equal(visibleSlugs.has("snowboard"), true);
  assert.equal(visibleSlugs.has("action-cam"), true);
  assert.equal(visibleSlugs.has("road-bike"), true);
});

test("雪服已开档且具备参数展示与基础筛选配置", () => {
  const category = getCategory("skiing-apparel");

  assert.equal(isLive("skiing-apparel"), true);
  assert.ok(category);
  assert.ok(category.specTemplate.some((group) => group.fields.some((field) => field.key === "waterproofMm")));
  assert.deepEqual(category.filterTemplate.map((filter) => filter.key), ["brands", "years"]);
});
