import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SafeImage } from "./safe-image";

test("renders regular responsive candidates on img", () => {
  const html = renderToStaticMarkup(
    createElement(SafeImage, {
      src: "https://images.example/ski-middle.jpg",
      srcSet: "https://images.example/ski-small.jpg 260w, https://images.example/ski-middle.jpg 520w",
      sizes: "(max-width: 640px) 160px, 320px",
      alt: "ski",
      fallbackLabel: "ski",
    }),
  );

  assert.match(html, /srcSet="https:\/\/images\.example\/ski-small\.jpg 260w, https:\/\/images\.example\/ski-middle\.jpg 520w"/);
  assert.match(html, /sizes="\(max-width: 640px\) 160px, 320px"/);
});

test("keeps typed WebP candidates on picture source with original img fallback", () => {
  const html = renderToStaticMarkup(
    createElement(SafeImage, {
      src: "https://images.example/ski.png",
      srcSet: "https://images.example/ski.webp 520w",
      srcSetType: "image/webp",
      sizes: "320px",
      alt: "ski",
      fallbackLabel: "ski",
    }),
  );

  assert.match(html, /<picture class="contents"><source type="image\/webp" srcSet="https:\/\/images\.example\/ski\.webp 520w" sizes="320px"\/><img src="https:\/\/images\.example\/ski\.png"/);
  assert.equal((html.match(/srcSet=/g) ?? []).length, 1);
});
