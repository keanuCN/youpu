import assert from "node:assert/strict";
import test from "node:test";

import { shouldExportCatalogBeforeBuild, shouldRejectCatalogCountDecrease } from "./catalog-build-policy";

test("配置目录 API 地址时，构建前应刷新目录快照", () => {
  assert.equal(shouldExportCatalogBeforeBuild({ CONTENT_EXPORT_API_BASE: "https://api.example.com" }), true);
});

test("未配置目录 API 地址时，构建继续使用仓库内快照", () => {
  assert.equal(shouldExportCatalogBeforeBuild({}), false);
  assert.equal(shouldExportCatalogBeforeBuild({ CONTENT_EXPORT_API_BASE: "  " }), false);
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
