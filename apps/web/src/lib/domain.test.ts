import assert from "node:assert/strict";
import test from "node:test";

import { GEAR } from "../data/boards";
import { getCategory } from "../data/categories";
import { guestState } from "./persisted";
import { applyFilters, buildCompareMatrix, compareConclusion, DEFAULT_FILTERS, rankRows } from "./domain";

test("explicit flex filters exclude products whose flex is unknown", () => {
  const source = GEAR[0];
  assert.ok(source);

  const unknownFlex = {
    ...source,
    id: "unknown-flex",
    flexValue: 0,
    flexLabel: "待补充",
    specs: { ...source.specs, flex: null },
  };
  const knownSoft = {
    ...source,
    id: "known-soft",
    flexValue: 3,
    flexLabel: "偏软",
    specs: { ...source.specs, flex: 3 },
  };

  const result = applyFilters([unknownFlex, knownSoft], { ...DEFAULT_FILTERS, flex: ["soft"] });
  assert.deepEqual(result.map((item) => item.id), ["known-soft"]);
});

test("default price bounds keep unknown prices visible, explicit prices do not", () => {
  const source = GEAR[0];
  assert.ok(source);
  const unknownPrice = { ...source, id: "unknown-price", price: 0, priceBand: { min: 0, max: 0 } };

  assert.equal(applyFilters([unknownPrice], DEFAULT_FILTERS).length, 1);
  assert.equal(applyFilters([unknownPrice], { ...DEFAULT_FILTERS, price: [3000, 5000] }).length, 0);
});

test("category-specific default price bounds keep unknown prices visible", () => {
  const source = GEAR[0];
  assert.ok(source);
  const unknownPrice = { ...source, id: "unknown-category-price", price: 0, priceBand: { min: 0, max: 0 } };
  const badmintonBounds: [number, number] = [500, 2500];

  assert.equal(
    applyFilters([unknownPrice], { ...DEFAULT_FILTERS, price: badmintonBounds }, badmintonBounds).length,
    1,
  );
  assert.equal(
    applyFilters([unknownPrice], { ...DEFAULT_FILTERS, price: [800, 1800] }, badmintonBounds).length,
    0,
  );
});

test("non-snowboard comparison omits snowboard-only hardcore rows and conclusions", () => {
  const base = GEAR[0];
  assert.ok(base);
  const source = {
    ...base,
    id: "badminton-compare-source",
    categorySlug: "badminton-racket",
    model: "测试羽毛球拍",
    specs: { ...base.specs, weightClass: "4U", balance: "均衡", maxTension: 28 },
  };
  const category = getCategory("badminton-racket");
  assert.ok(category);

  const second = { ...source, id: "badminton-compare-copy", model: `${source.model} 对照` };
  const rows = buildCompareMatrix([source, second], category.specTemplate, category.scoreDims);
  assert.equal(rows.some((row) => row.label === "进阶指数"), false);
  assert.equal(rows.some((row) => row.label === "参考价"), true);
  assert.equal(compareConclusion([source, second]).some((line) => line.includes("最吃技术")), false);
});

test("snowboard comparison keeps the hardcore row and conclusion", () => {
  const source = GEAR.find((item) => item.categorySlug === "snowboard");
  assert.ok(source);
  const category = getCategory("snowboard");
  assert.ok(category);

  const second = { ...source, id: "snowboard-compare-copy", model: `${source.model} 对照` };
  const rows = buildCompareMatrix([source, second], category.specTemplate, category.scoreDims);
  assert.equal(rows.some((row) => row.label === "进阶指数"), true);
  assert.equal(compareConclusion([source, second]).some((line) => line.includes("最吃技术")), true);
});

test("rank rows use the selected category pool and category rank definitions", () => {
  const base = GEAR[0];
  assert.ok(base);
  const source = {
    ...base,
    id: "badminton-rank-source",
    categorySlug: "badminton-racket",
    model: "测试进攻拍",
    composite: 82,
    hardcore: 0,
    price: 1200,
    priceBand: { min: 1100, max: 1300 },
  };
  const second = {
    ...source,
    id: "badminton-rank-second",
    model: "测试控制拍",
    composite: 76,
    price: 900,
    priceBand: { min: 800, max: 1000 },
  };

  const rows = rankRows(guestState(), "overall", "badminton-racket", [source, second]);
  assert.equal(rows.length, 2);
  assert.ok(rows.every((row) => row.gear.categorySlug === "badminton-racket"));
  assert.equal(rows[0]?.gear.id, source.id);

  const valueRows = rankRows(guestState(), "value", "badminton-racket", [source, second]);
  assert.deepEqual(new Set(valueRows.map((row) => row.gear.id)), new Set([source.id, second.id]));
});
