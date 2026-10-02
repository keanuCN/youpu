import assert from "node:assert/strict";
import test from "node:test";

import {
  getStaticExportConfigurationProblems,
  shouldExportCatalogBeforeBuild,
  shouldRejectCatalogCountDecrease,
} from "./catalog-build-policy";

test("配置目录 API 地址时，构建前应刷新目录快照", () => {
  assert.equal(shouldExportCatalogBeforeBuild({ CONTENT_EXPORT_API_BASE: "https://api.example.com" }), true);
});

test("未配置目录 API 地址时，构建继续使用仓库内快照", () => {
  assert.equal(shouldExportCatalogBeforeBuild({}), false);
  assert.equal(shouldExportCatalogBeforeBuild({ CONTENT_EXPORT_API_BASE: "  " }), false);
});

test("静态发布构建要求正式 HTTPS 域名、API 地址和目录快照源", () => {
  assert.deepEqual(
    getStaticExportConfigurationProblems({ NEXT_OUTPUT: "export" }),
    [
      "NEXT_PUBLIC_SITE_URL 必须设置为正式 HTTPS 域名",
      "NEXT_PUBLIC_API_BASE 必须设置为正式 HTTPS API 地址",
      "CONTENT_EXPORT_API_BASE 必须设置为正式 HTTPS 目录 API 地址",
    ],
  );
  assert.deepEqual(
    getStaticExportConfigurationProblems({
      NEXT_OUTPUT: "export",
      NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      NEXT_PUBLIC_API_BASE: "http://localhost:3001",
      CONTENT_EXPORT_API_BASE: "https://xiaopang.club",
    }),
    [
      "NEXT_PUBLIC_SITE_URL 必须设置为正式 HTTPS 域名",
      "NEXT_PUBLIC_API_BASE 必须设置为正式 HTTPS API 地址",
    ],
  );
});

test("服务端渲染开发构建不要求生产静态站点配置", () => {
  assert.deepEqual(getStaticExportConfigurationProblems({}), []);
});

test("静态发布构建接受正式 HTTPS 地址", () => {
  assert.deepEqual(
    getStaticExportConfigurationProblems({
      NEXT_OUTPUT: "export",
      NEXT_PUBLIC_SITE_URL: "https://xiaopang.club",
      NEXT_PUBLIC_API_BASE: "https://xiaopang.club",
      CONTENT_EXPORT_API_BASE: "https://xiaopang.club",
    }),
    [],
  );
});

test("默认拒绝会减少目录快照产品数的导出", () => {
  assert.equal(shouldRejectCatalogCountDecrease(235, 97, {}), true);
  assert.equal(shouldRejectCatalogCountDecrease(97, 235, {}), false);
  assert.equal(shouldRejectCatalogCountDecrease(97, 97, {}), false);
});

test("显式确认后允许减少目录快照产品数", () => {
  assert.equal(
    shouldRejectCatalogCountDecrease(235, 97, { CONTENT_EXPORT_ALLOW_COUNT_DECREASE: "true" }),
    false,
  );
  assert.equal(
    shouldRejectCatalogCountDecrease(235, 97, { CONTENT_EXPORT_ALLOW_COUNT_DECREASE: "1" }),
    true,
  );
});
