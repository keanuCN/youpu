import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtemp, mkdir, readFile, readdir, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
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
  summarizeImageMigration,
  replaceYamlIfUnchanged,
  withImageMigrationLock,
  writeMigrationManifestAtomically,
  writeNewMigrationManifestAtomically,
  type ImageMigrationManifest,
} from './tos-image-migration';

const execFileAsync = promisify(execFile);

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
      { url: 'https://youpu.tos-cn-beijing.volces.com/legacy/old.webp', kind: 'base', sort_order: 3 },
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
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com/cdn');

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

test('persists uploaded URL before YAML and resumes without downloading or uploading again', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;
    let checkpoint: ImageMigrationManifest | undefined;
    await assert.rejects(applyImageMigrationManifest(manifest, {
      dataDir: fixture.dataDir,
      fetchImage: async () => ({ buffer: Buffer.from('png'), contentType: 'image/png' }),
      upload: async () => ({ url: 'https://youpu.tos-cn-beijing.volces.com/product-images/resume.webp' }),
      onEntryUpdated: async (progress) => {
        if (itemAt(progress.entries, 0).status === 'uploaded') {
          checkpoint = structuredClone(progress);
          throw new Error('simulated interruption after checkpoint');
        }
      },
    }), /simulated interruption/);

    assert.equal(itemAt(checkpoint!.entries, 0).migratedUrl, 'https://youpu.tos-cn-beijing.volces.com/product-images/resume.webp');
    const beforeResume = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string }> };
    assert.equal(itemAt(beforeResume.images, 0).url, 'https://images.example.com/front.png');

    const resumed = await applyImageMigrationManifest(checkpoint!, {
      dataDir: fixture.dataDir,
      fetchImage: async () => assert.fail('checkpoint recovery must not redownload'),
      upload: async () => assert.fail('checkpoint recovery must not reupload'),
    });
    const finalYaml = parse(await readFile(fixture.file, 'utf8')) as { images: Array<{ url: string }> };
    assert.equal(itemAt(resumed.entries, 0).status, 'done');
    assert.equal(itemAt(finalYaml.images, 0).url, itemAt(checkpoint!.entries, 0).migratedUrl);
  } finally {
    await fixture.dispose();
  }
});

test('refuses to overwrite an existing review manifest', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-manifest-no-overwrite-'));
  const target = join(parent, 'review.json');
  const existing = '{"approved":true}\n';
  try {
    await writeFile(target, existing);
    await assert.rejects(writeNewMigrationManifestAtomically(target, { approved: false }), /已存在/);
    assert.equal(await readFile(target, 'utf8'), existing);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('atomically updates an existing apply manifest for progress checkpoints', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-manifest-progress-'));
  const target = join(parent, 'review.json');
  try {
    await writeFile(target, '{"step":1}\n');
    await writeMigrationManifestAtomically(target, { step: 2 });
    assert.deepEqual(JSON.parse(await readFile(target, 'utf8')), { step: 2 });
    assert.deepEqual((await readdir(parent)).sort(), ['review.json']);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('exclusive migration lock rejects a second concurrent apply and releases after completion', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-image-lock-'));
  const lockPath = join(parent, 'review.json.lock');
  let finishFirst: (() => void) | undefined;
  let signalEntered: (() => void) | undefined;
  const entered = new Promise<void>((resolve) => { signalEntered = resolve; });
  const first = withImageMigrationLock(lockPath, () => new Promise<void>((resolve) => {
    finishFirst = resolve;
    signalEntered?.();
  }));
  void first.catch(() => undefined);
  try {
    await entered;
    await assert.rejects(withImageMigrationLock(lockPath, async () => undefined), /已有迁移任务正在运行/);
    finishFirst?.();
    await first;
    await withImageMigrationLock(lockPath, async () => undefined);
  } finally {
    finishFirst?.();
    await first.catch(() => undefined);
    await rm(parent, { recursive: true, force: true });
  }
});

test('concurrent migration runs for the same YAML do not download or upload the same row twice', async () => {
  const fixture = await createFixture();
  let signalDownload: (() => void) | undefined;
  const downloadStarted = new Promise<void>((resolve) => { signalDownload = resolve; });
  let finishDownload: (() => void) | undefined;
  const downloadGate = new Promise<void>((resolve) => { finishDownload = resolve; });
  let first: Promise<ImageMigrationManifest> | undefined;
  let downloads = 0;
  let uploads = 0;
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;
    first = applyImageMigrationManifest(structuredClone(manifest), {
      dataDir: fixture.dataDir,
      fetchImage: async () => {
        downloads += 1;
        signalDownload?.();
        await downloadGate;
        return { buffer: Buffer.from('png'), contentType: 'image/png' };
      },
      upload: async () => { uploads += 1; return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/once.webp' }; },
    });
    await downloadStarted;
    const second = await applyImageMigrationManifest(structuredClone(manifest), {
      dataDir: fixture.dataDir,
      fetchImage: async () => { downloads += 1; return { buffer: Buffer.from('png'), contentType: 'image/png' }; },
      upload: async () => { uploads += 1; return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/twice.webp' }; },
    });
    assert.equal(itemAt(second.entries, 0).status, 'failed');
    assert.match(itemAt(second.entries, 0).error ?? '', /已有迁移任务正在运行/);
    finishDownload?.();
    const completed = await first;
    assert.equal(itemAt(completed.entries, 0).status, 'done');
    assert.equal(downloads, 1);
    assert.equal(uploads, 1);
  } finally {
    finishDownload?.();
    await first?.catch(() => undefined);
    await fixture.dispose();
  }
});

test('YAML replacement refuses to overwrite a file changed after its snapshot was read', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-yaml-write-race-'));
  const file = join(parent, 'product.yaml');
  try {
    await writeFile(file, 'title: concurrent editor change\n');
    await assert.rejects(
      replaceYamlIfUnchanged(file, 'title: migration snapshot\n', 'title: original\n'),
      /商品资料在写入前又发生变化/,
    );
    assert.equal(await readFile(file, 'utf8'), 'title: concurrent editor change\n');
    assert.deepEqual(await readdir(parent), ['product.yaml']);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('atomic manifest writer uses exclusive temp creation and preserves a pre-existing temp path', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-manifest-temp-link-'));
  const target = join(parent, 'review.json');
  const outside = join(parent, 'outside.txt');
  const planted = `${target}.fixed.tmp`;
  try {
    await writeFile(outside, 'must remain unchanged');
    await writeFile(planted, 'planted file must remain unchanged');
    await assert.rejects(writeMigrationManifestAtomically(target, { harmless: true }, () => 'fixed'), /临时文件名冲突/);
    assert.equal(await readFile(outside, 'utf8'), 'must remain unchanged');
    assert.equal(await readFile(planted, 'utf8'), 'planted file must remain unchanged');
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('preserves a concurrent YAML edit made while an approved image is uploading', async () => {
  const fixture = await createFixture();
  try {
    const manifest = await createImageMigrationManifest(fixture.dataDir, 'https://youpu.tos-cn-beijing.volces.com');
    itemAt(manifest.entries, 0).approved = true;

    const result = await applyImageMigrationManifest(manifest, {
      dataDir: fixture.dataDir,
      fetchImage: async () => ({ buffer: Buffer.from('png'), contentType: 'image/png' }),
      upload: async () => {
        const current = parse(await readFile(fixture.file, 'utf8')) as { title?: string; images: Array<{ url: string }> };
        current.title = 'concurrent title edit';
        itemAt(current.images, 0).url = 'https://images.example.com/concurrent.png';
        await writeFile(fixture.file, stringify(current));
        return { url: 'https://youpu.tos-cn-beijing.volces.com/product-images/migrated.webp' };
      },
    });

    const finalYaml = parse(await readFile(fixture.file, 'utf8')) as { title?: string; images: Array<{ url: string }> };
    assert.equal(itemAt(result.entries, 0).status, 'failed');
    assert.equal(finalYaml.title, 'concurrent title edit');
    assert.equal(itemAt(finalYaml.images, 0).url, 'https://images.example.com/concurrent.png');
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
  const chunk = new Uint8Array(1024 * 1024);
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      for (let index = 0; index < 11; index += 1) controller.enqueue(chunk);
      controller.close();
    },
  });
  await assert.rejects(
    downloadRemoteImage('https://images.example.com/chunked.png', async () => new Response(stream, {
      status: 200,
      headers: { 'content-type': 'image/png' },
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

test('counts approved failures separately from unapproved rows', () => {
  const manifest: ImageMigrationManifest = {
    version: 1,
    createdAt: '2026-09-27T00:00:00.000Z',
    publicBaseUrl: 'https://youpu.tos-cn-beijing.volces.com',
    entries: [
      { id: 'a', file: 'camera/a.yaml', productSlug: 'camera-a', imageIndex: 0, originalUrl: 'https://images.example.com/a.png', sourceNote: '', approved: false, status: 'failed' },
      { id: 'b', file: 'camera/b.yaml', productSlug: 'camera-b', imageIndex: 0, originalUrl: 'https://images.example.com/b.png', sourceNote: '', approved: true, status: 'failed' },
      { id: 'c', file: 'camera/c.yaml', productSlug: 'camera-c', imageIndex: 0, originalUrl: 'https://images.example.com/c.png', sourceNote: '', approved: true, status: 'pending' },
    ],
  };
  assert.deepEqual(summarizeImageMigration(manifest), {
    pending: 1,
    approvedPending: 1,
    done: 0,
    approvedFailed: 1,
  });
});

test('plan CLI writes a review manifest and status counts without requiring DB or TOS credentials', async () => {
  const fixture = await createFixture();
  const manifestPath = join(fixture.dataDir, 'tmp', 'cli-review.json');
  try {
    const { stdout } = await execFileAsync(process.execPath, [
      '--import', 'tsx', 'src/seed/migrate-product-images.ts', 'plan', '--out', manifestPath,
    ], {
      cwd: resolve(__dirname, '../..'),
      timeout: 20_000,
      env: {
        ...process.env,
        DATA_DIR: fixture.dataDir,
        DATABASE_URL: '',
        TOS_REGION: '',
        TOS_BUCKET: '',
        TOS_ENDPOINT: '',
        TOS_ACCESS_KEY: '',
        TOS_SECRET_KEY: '',
        TOS_PUBLIC_BASE_URL: 'https://youpu.tos-cn-beijing.volces.com',
      },
    });
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8')) as ImageMigrationManifest;

    assert.match(stdout, /未批准待审核 2/);
    assert.equal(manifest.entries.every((entry) => !entry.approved && entry.status === 'pending'), true);
  } finally {
    await fixture.dispose();
  }
});

test('restricts migration manifests to ignored data/tmp JSON files and validates loaded JSON', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-manifest-path-'));
  const dataDir = join(parent, 'data');
  try {
    await mkdir(dataDir);
    assert.equal(
      await resolveImageMigrationManifestPath(dataDir, join(dataDir, 'tmp', 'review.json')),
      join(dataDir, 'tmp', 'review.json'),
    );
    await assert.rejects(
      resolveImageMigrationManifestPath(dataDir, join(dataDir, 'camera', 'product.yaml')),
      /只能保存为 data\/tmp\//,
    );
    assert.throws(() => parseImageMigrationManifest({ version: 2, entries: [] }), /Too small|Invalid literal/);
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
});

test('rejects a migration-manifest directory symlink that escapes the data directory', async () => {
  const parent = await mkdtemp(join(tmpdir(), 'youpu-image-manifest-link-'));
  const dataDir = join(parent, 'data');
  const outsideDir = join(parent, 'outside');
  try {
    await mkdir(dataDir);
    await mkdir(outsideDir);
    await symlink(outsideDir, join(dataDir, 'tmp'), 'junction');
    await assert.rejects(
      resolveImageMigrationManifestPath(dataDir, join(dataDir, 'tmp', 'review.json')),
      /不能指向 data 目录之外/,
    );
  } finally {
    await rm(parent, { recursive: true, force: true });
  }
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
