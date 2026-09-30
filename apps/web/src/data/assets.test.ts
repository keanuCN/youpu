import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { HERO_IMAGE_POOL } from "./assets";

test("keeps the original ridge hero as fallback and serves bounded local WebP candidates", () => {
  const ridge = HERO_IMAGE_POOL.find((image) => image.locationLabel === "雪山山脊");
  assert.ok(ridge);
  assert.match(ridge.src, /^https:\/\/g\.cdn\.meoo\.host\//);
  assert.equal(ridge.webpSrcSet, "/hero/ridge-768.webp 768w, /hero/ridge-1440.webp 1440w");

  for (const [name, maxBytes] of [["ridge-768.webp", 50_000], ["ridge-1440.webp", 200_000]] as const) {
    const imagePath = new URL(`../../public/hero/${name}`, import.meta.url);
    const image = readFileSync(imagePath);
    assert.ok(statSync(imagePath).size < maxBytes, `${name} should stay below ${maxBytes} bytes`);
    assert.equal(image.toString("ascii", 0, 4), "RIFF");
    assert.equal(image.toString("ascii", 8, 12), "WEBP");
  }
});
