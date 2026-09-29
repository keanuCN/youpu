import assert from "node:assert/strict";
import test from "node:test";
import { NextRequest } from "next/server";

import { GET } from "./route";

test("streams AVIF responses from an approved image source", async () => {
  const originalFetch = globalThis.fetch;
  const body = new Uint8Array([0, 1, 2, 3, 4]);
  let upstreamAccept: string | null = null;
  globalThis.fetch = async (_input, init) => {
    upstreamAccept = new Headers(init?.headers).get("accept");
    return new Response(body, {
      status: 200,
      headers: { "Content-Type": "image/avif" },
    });
  };

  try {
    const source =
      "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/product.png?fit=bounds&width=800&height=800";
    const request = new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`, {
      headers: { Accept: "image/avif,image/webp,image/*,*/*;q=0.8" },
    });
    const response = await GET(request);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/avif");
    assert.equal(response.headers.get("vary"), "Accept");
    assert.equal(upstreamAccept, "image/avif,image/webp,image/jpeg,image/png,image/gif");
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), body);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("negotiates a format supported by the requesting browser", async () => {
  const originalFetch = globalThis.fetch;
  let upstreamAccept: string | null = null;
  globalThis.fetch = async (_input, init) => {
    upstreamAccept = new Headers(init?.headers).get("accept");
    return new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  };

  try {
    const source =
      "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/product.png?fit=bounds&width=800&height=800";
    const request = new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`, {
      headers: { Accept: "image/jpeg,image/png,*/*" },
    });
    const response = await GET(request);

    assert.equal(response.status, 200);
    assert.equal(response.headers.get("content-type"), "image/jpeg");
    assert.equal(upstreamAccept, "image/jpeg,image/png,image/webp,image/gif");
    assert.equal(response.headers.get("vary"), "Accept");
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("does not request AVIF when Accept is missing or explicitly rejects it", async () => {
  const originalFetch = globalThis.fetch;
  const upstreamAccepts: string[] = [];
  globalThis.fetch = async (_input, init) => {
    const accept = new Headers(init?.headers).get("accept") ?? "";
    upstreamAccepts.push(accept);
    return new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { "Content-Type": "image/jpeg" },
    });
  };

  try {
    const source =
      "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/product.png?fit=bounds&width=800&height=800";
    const missingAccept = await GET(
      new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`),
    );
    const avifRejected = await GET(
      new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`, {
        headers: { Accept: "image/avif;q=0,image/*,*/*;q=0.8" },
      }),
    );

    assert.equal(missingAccept.status, 200);
    assert.equal(avifRejected.status, 200);
    const noAcceptHeader = upstreamAccepts[0] ?? "";
    const noAvifHeader = upstreamAccepts[1] ?? "";
    assert.equal(noAcceptHeader.includes("image/avif"), false);
    assert.equal(noAvifHeader.includes("image/avif"), false);
    assert.equal(noAvifHeader.includes("image/webp"), true);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("rejects an upstream image format outside the negotiated set", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(new Uint8Array([1, 2, 3]), {
      status: 200,
      headers: { "Content-Type": "image/avif" },
    });

  try {
    const source =
      "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/product.png?fit=bounds&width=800&height=800";
    const response = await GET(
      new NextRequest(`http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`, {
        headers: { Accept: "image/jpeg,image/png" },
      }),
    );

    assert.equal(response.status, 406);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("continues to reject non-raster upstream responses", async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response("<svg></svg>", {
      status: 200,
      headers: { "Content-Type": "image/svg+xml" },
    });

  try {
    const source =
      "https://cdn.amersports.com/0acef4a9-61b7-47b0-84f4-b49f00cdfc5f/product.png?fit=bounds&width=800&height=800";
    const request = new NextRequest(
      `http://localhost:3000/api/image-proxy?url=${encodeURIComponent(source)}`,
    );
    const response = await GET(request);

    assert.equal(response.status, 415);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
