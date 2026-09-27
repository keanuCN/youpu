import assert from 'node:assert/strict';
import test from 'node:test';
import { adminFetch } from './api';

test('adminFetch sends multipart file data with bearer auth and lets fetch set its boundary', async () => {
  const originalFetch = globalThis.fetch;
  let requestUrl = '';
  let requestInit: RequestInit | undefined;
  globalThis.fetch = async (input, init) => {
    requestUrl = String(input);
    requestInit = init;
    return new Response(JSON.stringify({ url: 'https://cdn.example/photo.webp' }), { status: 201 });
  };

  try {
    const file = new File(['source image'], 'photo.png', { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', file);
    const result = await adminFetch<{ url: string }>('admin-token', '/product-images', {
      method: 'POST',
      body: formData,
    });

    assert.match(requestUrl, /\/api\/admin\/product-images$/);
    assert.equal(new Headers(requestInit?.headers).get('authorization'), 'Bearer admin-token');
    assert.equal(new Headers(requestInit?.headers).has('content-type'), false);
    assert.equal((requestInit?.body as FormData).get('file') instanceof Blob, true);
    assert.equal(result.url, 'https://cdn.example/photo.webp');
  } finally {
    globalThis.fetch = originalFetch;
  }
});
