import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { parse, stringify } from 'yaml';
import {
  applyImageMigrationManifest,
  assertImageMigrationTarget,
  createImageMigrationManifest,
  downloadRemoteImage,
  parseImageMigrationArgs,
  parseImageMigrationManifest,
  resolveImageMigrationManifestPath,
  type ImageMigrationManifest,
} from './tos-image-migration';

async function createFixture() {
  const dataDir = await mkdtemp(join(tmpdir(), 'youpu-image-migration-'));
  const categoryDir = join(dataDir, 'camera');
  const file = join(categoryDir, 'test-camera.yaml');
  await mkdir(categoryDir, { recursive: true });
  await writeFile(file, stringify({
    slug: 'test-camera-2026',
    images: [
      { url: 'https://images.example.com/front.png', kind: 'face', source: '官方产品页，版权待核', sort_order: 0 },
      { url: 'https://images.example.com/side.webp', kind: 'side', source: '经授权', sort_order: 1 },
      { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/existing.webp', kind: 'base', sort_order: 2 },
    ],
  }));
  return { dataDir, file, dispose: () => rm(dataDir, { recursive: true, force: true }) };
}

function itemAt<T>(items: T[], index: number): T {
  const item = items[index];
  assert.ok(item, `Expected an item at index ${index}`);
  return item;
}

test('creates an unapproved manifest for external HTTPS images and skips existing TOS objects', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');

    assert.equal(manifest.version, 1);
    assert.equal(manifest.entries.length, 2);
    assert.deepEqual(manifest.entries.map(({ imageIndex, sourceNote, approved, status }) => ({ imageIndex, sourceNote, approved, status })), [
      { imageIndex: 0, sourceNote: '官方产品页，版权待核', approved: false, status: 'pending' },
      { imageIndex: 1, sourceNote: '经授权', approved: false, status: 'pending' },
    ]);
    assert.equal(itemAt(manifest.entries, 0).file, 'camera/test-camera.yaml');
    assert.equal(itemAt(manifest.entries, 0).productSlug, 'test-camera-2026');
  } finally {
    await fixture.dispose();
  }
});

test('unapproved manifest entries never download or modify seed YAML', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    let downloads = 0;
    let uploads = 0;

    const result = await applyImageMigrationManifest(manifest, {
      dataDir: fixture.dataDir,
      fetchImage: async () => { downloads += 1; return { buffer: Buffer.from('image'), contentType: 'image/png' }; },
      upload: async () => { uploads += 1; return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/new.webp' }; },
    });

    assert.equal(downloads, 0);
    assert.equal(uploads, 0);
    assert.deepEqual(result.entries.map((entry) => entry.status), ['pending', 'pending']);
    const yaml = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string }> };
    assert.equal(itemAt(yaml.images, 0).url, 'https://images.example.com/front.png');
  } finally {
    await fixture.dispose();
  }
});

test('rejects an approved row when its current YAML URL no longer matches the reviewed manifest', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;
    const yaml = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string }> };
    itemAt(yaml.images, 0).url = 'https://images.example.com/replaced.png';
    await writeFile(fixture.file, stringify(yaml));
    let networkCalls = 0;

    const result = await applyImageMigrationManifest(manifest, {
      dataDir: fixture.dataDir,
      fetchImage: async () => { networkCalls += 1; return { buffer: Buffer.from('image'), contentType: 'image/png' }; },
      upload: async () => { networkCalls += 1; return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/new.webp' }; },
    });

    assert.equal(itemAt(result.entries, 0).status, 'failed');
    assert.match(itemAt(result.entries, 0).error ?? '', /已变化/);
    assert.equal(networkCalls, 0);
    const updatedYaml = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string }> };
    assert.equal(itemAt(updatedYaml.images, 0).url, 'https://images.example.com/replaced.png');
  } finally {
    await fixture.dispose();
  }
});

test('updates only an approved image and retains its source note and original URL in the report', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;
    let uploads = 0;
    const options = {
      dataDir: fixture.dataDir,
      fetchImage: async () => ({ buffer: Buffer.from('png'), contentType: 'image/png' }),
      upload: async () => { uploads += 1; return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/migrated.webp' }; },
    };

    const result = await applyImageMigrationManifest(manifest, options);
    const yaml = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string; source?: string }> };

    assert.equal(uploads, 1);
    assert.equal(itemAt(result.entries, 0).status, 'done');
    assert.equal(itemAt(result.entries, 0).migratedUrl, 'https://youpu.tos-cn-beijing.volces.com/product-images/migrated.webp');
    assert.equal(itemAt(result.entries, 0).originalUrl, 'https://images.example.com/front.png');
    assert.equal(itemAt(result.entries, 0).sourceNote, '官方产品页，版权待核');
    assert.equal(itemAt(yaml.images, 0).url, 'https://youpu.tos-cn-beijing.volces.com/product-images/migrated.webp');
    assert.equal(itemAt(yaml.images, 0).source, '官方产品页，版权待核');
    assert.equal(itemAt(yaml.images, 1).url, 'https://images.example.com/side.webp');

    await applyImageMigrationManifest(result, options);
    assert.equal(uploads, 1);
  } finally {
    await fixture.dispose();
  }
});

test('records upload and decode failures without changing the source URL and allows retry', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;
    const failed = await applyImageMigrationManifest(manifest, {
      dataDir: fixture.dataDir,
      fetchImage: async () => ({ buffer: Buffer.from('gif'), contentType: 'image/gif' }),
      upload: async () => assert.fail('unsupported image must not upload'),
    });
    assert.equal(itemAt(failed.entries, 0).status, 'failed');
    assert.match(itemAt(failed.entries, 0).error ?? '', /不支持/);

    const retried = await applyImageMigrationManifest(failed, {
      dataDir: fixture.dataDir,
      fetchImage: async () => ({ buffer: Buffer.from('png'), contentType: 'image/png' }),
      upload: async () => ({ url: 'https://youpu.tos-cn-beijing.volces.com/product-images/retried.webp' }),
    });
    assert.equal(itemAt(retried.entries, 0).status, 'done');
  } finally {
    await fixture.dispose();
  }
});

test('downloads only HTTPS image responses and rejects redirects or oversized content', async () => {
  await assert.rejects(downloadRemoteImage('http://images.example.com/a.png'), /仅允许 HTTPS/);

  await assert.rejects(
    downloadRemoteImage('https://images.example.com/a.png', async () => new Response(null, { status: 302 })),
    /不允许重定向/,
  );
  await assert.rejects(
    downloadRemoteImage('https://images.example.com/a.png', async () => new Response('large', {
      status: 200,
      headers: { 'content-type': 'image/png', 'content-length': String(10 * 1024 * 1024 + 1) },
    })),
    /超过 10 MiB/,
  );
});

test('requires explicit apply and a manifest path for migration CLI apply mode', () => {
  assert.throws(() => parseImageMigrationArgs(['apply', '--manifest', 'review.json']), /必须显式传入 --apply/);
  assert.throws(() => parseImageMigrationArgs(['apply', '--apply']), /必须提供 --manifest/);
  assert.deepEqual(parseImageMigrationArgs(['plan', '--out', 'review.json']), {
    mode: 'plan', outputPath: 'review.json',
  });
});

test('restricts migration manifests to ignored data/tmp JSON files and validates loaded JSON', () => {
  const dataDir = join(tmpdir(), 'youpu-data');
  assert.equal(
    resolveImageMigrationManifestPath(dataDir, join(dataDir, 'tmp', 'review.json')),
    join(dataDir, 'tmp', 'review.json'),
  );
  assert.throws(
    () => resolveImageMigrationManifestPath(dataDir, join(dataDir, 'camera', 'product.yaml')),
    /只能保存为 data\/tmp\//,
  );
  assert.throws(() => parseImageMigrationManifest({ version: 2, entries: [] }), /Too small|Invalid literal/);
});

test('rejects a reviewed manifest when the current TOS public URL changed', () => {
  const manifest: ImageMigrationManifest = {
    version: 1,
    createdAt: '2026-09-27T00:00:00.000Z',
    publicBaseUrl: 'https://youpu.tos-cn-beijing.volces.com',
    entries: [],
  };
  assert.throws(
    () => assertImageMigrationTarget(manifest, 'https://different-bucket.tos-cn-beijing.volces.com'),
    /不一致/,
  );
  assert.doesNotThrow(() => assertImageMigrationTarget(manifest, 'https://youpu.tos-cn-beijing.volces.com/'));
});

test('migration manifest entries expose a stable JSON-safe shape', () => {
  const manifest: ImageMigrationManifest = {
    version: 1,
    createdAt: '2026-09-27T00:00:00.000Z',
    publicBaseUrl: 'https://youpu.tos-cn-beijing.volces.com',
    entries: [],
  };
  assert.equal(JSON.parse(JSON.stringify(manifest)).version, 1);
});
