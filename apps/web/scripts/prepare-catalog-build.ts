import { spawnSync } from "node:child_process";

import { shouldExportCatalogBeforeBuild } from "./catalog-build-policy";

if (!shouldExportCatalogBeforeBuild({ CONTENT_EXPORT_API_BASE: process.env.CONTENT_EXPORT_API_BASE })) {
  console.log("未配置 CONTENT_EXPORT_API_BASE，构建使用仓库内目录快照。");
  process.exit(0);
}

console.log(`构建前刷新目录快照：${process.env.CONTENT_EXPORT_API_BASE}`);
const result = spawnSync("pnpm", ["exec", "tsx", "scripts/export-catalog-snapshot.ts"], {
  cwd: process.cwd(),
  env: process.env,
  stdio: "inherit",
  shell: process.platform === "win32",
});

if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);
