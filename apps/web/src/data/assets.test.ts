import assert from "node:assert/strict";
import { readFileSync, statSync } from "node:fs";
import test from "node:test";

import { HERO_IMAGE_POOL } from "./assets";

test("keeps the original ridge hero as fallback and serves bounded local WebP candidates", () => {
  const ridge = HERO_IMAGE_POOL.find((image) => image.locationLabel === "雪山山脊");
  assert.ok(ridge);
  assert.match(ridge.src, /^https:\/\/g\.cdn\.meoo\.host\//);
  assert.equal(ridge.webpSrcSet, "/hero/ridge-768.webp 768w, /hero/ridge-1440.webp 1440w");

  for (const [name, maxBytes] of [["ridge-768.webp", 50_000], ["ridge-1440.webp", 125_000]] as const) {
    const imagePath = new URL(`../../public/hero/${name}`, import.meta.url);
    const image = readFileSync(imagePath);
    assert.ok(statSync(imagePath).size < maxBytes, `${name} should stay below ${maxBytes} bytes`);
    assert.equal(image.toString("ascii", 0, 4), "RIFF");
    assert.equal(image.toString("ascii", 8, 12), "WEBP");
  }
});

test("keeps Commons hero photo sources and credits while serving local responsive WebP variants", () => {
  const photos = [
    { location: "新疆阿勒泰 / 将军山", stem: "jiangjunshan", sourcePart: "Jiangjunshan_Ski_Resort.jpg" },
    { location: "新疆阿勒泰地区", stem: "altay-picture3", sourcePart: "picture3.jpg" },
    { location: "新疆阿勒泰 / 禾木", stem: "hemu-picture10", sourcePart: "picture10.jpg" },
    { location: "新疆阿勒泰地区", stem: "altay-picture1", sourcePart: "picture1.jpg" },
  ] as const;

  for (const photo of photos) {
    const image = HERO_IMAGE_POOL.find(
      (item) => item.locationLabel === photo.location && item.sourcePage?.includes(photo.sourcePart),
    );
    assert.ok(image);
    assert.match(image.src, /^https:\/\/upload\.wikimedia\.org\//);
    assert.ok("licenseUrl" in image && image.licenseUrl);
    assert.equal(
      image.webpSrcSet,
      `/hero/${photo.stem}-768.webp 768w, /hero/${photo.stem}-1280.webp 1280w`,
    );

    for (const [width, maxBytes] of [
      [768, 130_000],
      [1280, 300_000],
    ] as const) {
      const imagePath = new URL(`../../public/hero/${photo.stem}-${width}.webp`, import.meta.url);
      const bytes = readFileSync(imagePath);
      assert.ok(statSync(imagePath).size < maxBytes, `${photo.stem}-${width}.webp should stay bounded`);
      assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
      assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
    }
  }
});
