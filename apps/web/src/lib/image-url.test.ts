import assert from "node:assert/strict";
import test from "node:test";

import { isAllowedImageUrl, resolveImageUrl } from "./image-url";

const CDN_IMAGE =
  "https://g.cdn.meoo.host/uvayfd7jql5o/ai-images/board-base-01.png?auth_key=test";

test("routes CDN images through the local proxy in development", () => {
  assert.equal(
    resolveImageUrl(CDN_IMAGE, true),
    `/api/image-proxy?url=${encodeURIComponent(CDN_IMAGE)}`,
  );
});

test("keeps image URLs unchanged outside development", () => {
  assert.equal(resolveImageUrl(CDN_IMAGE, false), CDN_IMAGE);
  assert.equal(resolveImageUrl("/local-image.png", true), "/local-image.png");
});

test("only allows local paths and the approved CDN image prefix", () => {
  assert.equal(isAllowedImageUrl("/local-image.png"), true);
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host/other/file.png"), false);
  assert.equal(isAllowedImageUrl("https://g.cdn.meoo.host:444/uvayfd7jql5o/ai-images/file.png"), false);
  assert.equal(isAllowedImageUrl("https://example.com/image.png"), false);
});
