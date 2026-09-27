import assert from "node:assert/strict";
import test from "node:test";

import { productSeedSchema } from "./seed";

const validSeed = {
  slug: "test-model-2026",
  category: "snowboard-boot",
  brand: "example-brand",
  model: "Test Model",
  year: 2026,
  title: "Test Model 2026",
  specs: {},
  data_source: { kind: "official", origin_url: "https://example.com/product" },
  status: "published",
};

test("产品 seed 保留合法的数据来源字段", () => {
  const parsed = productSeedSchema.parse(validSeed);
  assert.deepEqual(parsed.data_source, validSeed.data_source);
});

test("产品 seed 拒绝拼错的数据来源字段而不是静默丢弃", () => {
  const parsed = productSeedSchema.safeParse({
    ...validSeed,
    data_source: undefined,
    "+data_source": validSeed.data_source,
  });

  assert.equal(parsed.success, false);
  if (!parsed.success) assert.equal(parsed.error.issues[0]?.code, "unrecognized_keys");
});
