import assert from "node:assert/strict";
import test from "node:test";

import { categoryCardSignals } from "./gear-card-signals";

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
