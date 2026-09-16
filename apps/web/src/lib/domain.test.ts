import assert from "node:assert/strict";
import test from "node:test";

import { GEAR } from "../data/boards";
import { applyFilters, DEFAULT_FILTERS } from "./domain";

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
