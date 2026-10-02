import { spawnSync } from "node:child_process";

import {
  getStaticExportConfigurationProblems,
  shouldExportCatalogBeforeBuild,
} from "./catalog-build-policy";

const staticExportProblems = getStaticExportConfigurationProblems({
  NEXT_OUTPUT: process.env.NEXT_OUTPUT,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  CONTENT_EXPORT_API_BASE: process.env.CONTENT_EXPORT_API_BASE,
});
if (staticExportProblems.length > 0) {
  console.error("静态发布构建配置无效：\n- " + staticExportProblems.join("\n- "));
  process.exit(1);
}

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
