import 'dotenv/config';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import {
  applyImageMigrationManifest,
  assertImageMigrationTarget,
  createImageMigrationManifest,
  downloadRemoteImage,
  parseImageMigrationArgs,
  parseImageMigrationManifest,
  resolveImageMigrationManifestPath,
  summarizeImageMigration,
} from './tos-image-migration';

async function main(args: string[]): Promise<void> {
  const command = parseImageMigrationArgs(args);
  const dataDir = resolve(process.cwd(), process.env.DATA_DIR ?? '../../data');

  if (command.mode === 'plan') {
    const publicBaseUrl = process.env.TOS_PUBLIC_BASE_URL;
    if (!publicBaseUrl) throw new Error('生成迁移清单前，请先在 API 环境配置 TOS_PUBLIC_BASE_URL');
    const manifest = await createImageMigrationManifest(dataDir, publicBaseUrl);
    const outputPath = await resolveImageMigrationManifestPath(dataDir, resolve(process.cwd(), command.outputPath));
    await saveJsonAtomically(outputPath, manifest);
    const counts = summarizeImageMigration(manifest);
    console.log(`迁移清单已生成：${outputPath}`);
    console.log(`状态统计：未批准待审核 ${counts.pending - counts.approvedPending}，已批准待迁移 ${counts.approvedPending}，成功 ${counts.done}，已批准失败 ${counts.approvedFailed}。`);
    console.log('默认不会下载、上传或修改商品资料。');
    console.log('请先逐项核实图片使用权，只把确认可用的条目标为 approved: true。');
    return;
  }

  const manifestPath = await resolveImageMigrationManifestPath(dataDir, resolve(process.cwd(), command.manifestPath));
  const manifest = parseImageMigrationManifest(JSON.parse(await readFile(manifestPath, 'utf8')) as unknown);
  const { env } = await import('../config/env');
  if (!env.TOS_PUBLIC_BASE_URL) throw new Error('执行迁移前，请在 API 环境完整配置 TOS');
  assertImageMigrationTarget(manifest, env.TOS_PUBLIC_BASE_URL);
  const { AdminImageUploadService } = await import('../admin/admin-image-upload.service');
  const uploader = new AdminImageUploadService();
  const updated = await applyImageMigrationManifest(manifest, {
    dataDir,
    fetchImage: downloadRemoteImage,
    upload: async (buffer, contentType) => uploader.upload({ buffer, mimetype: contentType }),
    onEntryUpdated: async (progress) => saveJsonAtomically(manifestPath, progress),
  });
  await saveJsonAtomically(manifestPath, updated);

  const counts = summarizeImageMigration(updated);
  console.log(`迁移结果：成功 ${counts.done}，已批准失败 ${counts.approvedFailed}，未批准待审核 ${counts.pending - counts.approvedPending}，待处理 ${counts.approvedPending}。`);
  console.log(`结果清单：${manifestPath}`);
  if (counts.approvedFailed > 0) process.exitCode = 1;
}

async function saveJsonAtomically(path: string, value: unknown): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  const temporaryPath = `${path}.${process.pid}.tmp`;
  try {
    await writeFile(temporaryPath, `${JSON.stringify(value, null, 2)}\n`, { encoding: 'utf8', flag: 'w' });
    await rename(temporaryPath, path);
  } catch (error) {
    const { unlink } = await import('node:fs/promises');
    await unlink(temporaryPath).catch(() => undefined);
    throw error;
  }
}

main(process.argv.slice(2)).catch((error: unknown) => {
  console.error(`图片迁移失败：${error instanceof Error ? error.message : String(error)}`);
  console.error('用法：pnpm --filter @youpu/api tos:images:plan -- --out ../../data/tmp/tos-image-migration.json');
  console.error('或：pnpm --filter @youpu/api tos:images:apply -- --manifest ../../data/tmp/tos-image-migration.json --apply');
  process.exitCode = 1;
});
