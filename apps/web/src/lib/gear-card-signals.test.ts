import assert from "node:assert/strict";
import test from "node:test";

import { categoryCardSignals, isHotProduct } from "./gear-card-signals";

test("skiing product cards use their own category spec labels", () => {
  assert.deepEqual(categoryCardSignals("snowboard-binding", { entrySystem: "Step On", flex: 6 }), [
    ["穿脱系统", "Step On"],
    ["硬度", "6/10"],
  ]);
  assert.deepEqual(categoryCardSignals("snowboard-boot", { lacingSystem: "Dual BOA", flex: "中硬" }), [
    ["闭合系统", "Dual BOA"],
    ["硬度", "中硬"],
  ]);
  assert.deepEqual(categoryCardSignals("skis", { lengthOptions: "160 / 168 / 176 cm", waistWidth: 96 }), [
    ["板长选项", "160 / 168 / 176 cm"],
    ["板腰宽", "96 mm"],
  ]);
  assert.deepEqual(categoryCardSignals("skiing-apparel", { garmentType: "bib-pants", fit: "relaxed" }), [
    ["款式", "背带滑雪裤"],
    ["版型", "宽松"],
  ]);
});

test("missing category specs remain explicitly marked", () => {
  assert.deepEqual(categoryCardSignals("skiing-apparel", {}), [
    ["款式", "待补充"],
    ["版型", "待补充"],
  ]);
});

test("only products above the popularity threshold receive the hot signal", () => {
  assert.equal(isHotProduct(7000), true);
  assert.equal(isHotProduct(6999), false);
  assert.equal(isHotProduct(0), false);
  assert.equal(isHotProduct(Number.NaN), false);
});

test("manually selected products receive HOT without changing their heat score", () => {
  for (const id of [
    "gray-sonicalmach-lt-2027",
    "gray-tycoon-type-s-iz-2027",
    "ogasaka-fc-s-2026",
    "salomon-huck-knife-2027",
    "jones-flagship-2027",
  ]) {
    assert.equal(isHotProduct(0, id), true, `${id} should be marked HOT`);
  }
  assert.equal(isHotProduct(0, "unlisted-product"), false);
});
