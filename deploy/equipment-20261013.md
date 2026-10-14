# 滑雪装备内容发布 · 2026-10-13

服务器：`115.190.156.88`；源码目录：`/opt/youpu`。

## 发布内容

- 同步 206 款装备的 `specs`：单板 77、固定器 60、雪鞋 30、双板 39。
- 同步对应 4 个类目的参数模板。
- 双板逐长度表共 13 款、58 行；Assassin 2025/26 新增 9 档官方目录参数。
- 上线逐长度卡片、选码/兼容/价格来源说明、单板三件套指南及已修复的首页本地图片。
- 只更新已有产品规格；价格、标题、状态、评分、图片、账号及社区内容不在同步脚本的写入范围内。

同步脚本：`apps/api/src/seed/sync-equipment-content.ts`。默认仅预览；校验全部种子、生产身份与类目后才允许事务更新。

预览装备内容同步：

```bash
cd /opt/youpu/apps/api
pnpm exec tsx src/seed/sync-equipment-content.ts
```

在备份完成后同步规格和类目模板：

```bash
pnpm exec tsx src/seed/sync-equipment-content.ts --apply
```

## 当前构建

两个服务通过 systemd drop-in 使用本次独立构建，原构建保留：

| 服务 | 新构建目录 | drop-in |
| --- | --- | --- |
| youpu-web | apps/web/.next-equipment-20261013b-ip | /etc/systemd/system/youpu-web.service.d/equipment-20261013.conf |
| youpu-domain-web | apps/web/.next-equipment-20261013b-domain | /etc/systemd/system/youpu-domain-web.service.d/equipment-20261013.conf |

后续构建须使用服务正在使用的 `NEXT_DIST_DIR`，或按同样流程生成新目录并切换 drop-in；直接重建旧 `.next` 不会更新当前服务。

第二轮新增 6 张双板参数表、22 行（4 张完整表、2 张部分表），累计 19 款、80 行。第二轮已完成发布，备份与构建日志位于 `/opt/youpu-releases/20261013-equipment-round2/`；上一轮 `.next-equipment-20261013-ip/domain` 构建仍保留。详情见 `docs/滑雪数据深化-2026-10-13-第二轮.md`。

## 备份与核对

本次发布目录：`/opt/youpu-releases/20261013-equipment/`。

- `database-before.dump`：PostgreSQL 16 自定义格式数据库备份，目录清单已校验。
- `source-before.tar.gz`：替换前的前台源码、素材和四个装备类目 YAML。
- `preservation-result.json`：294 款产品更新前后数量一致；除 `specs`、`updated_at` 外所有产品字段摘要一致。
- `build-domain.log`、`build-ip.log`：两份生产构建成功。
- `publish.log`、`verification-api.json`：切换与 API 核对记录。

核对结果：API、IP 前台、域名前台服务 active；API 健康为 `db=true, redis=true`。公网 IP 首页、五款抽查详情和对应 API 为 200，详情包含新增表格/依据说明；原点单首页与 FIELD TEST 本地图片为 200。

`youpu.asia` 本机按正式 Host/SNI 请求为 200；公网 HTTP 仍跳转火山引擎拦截页，HTTPS 连接失败。用户已暂停接入备案，未继续申请。

## 回滚

回滚前先备份当前内容，再移开本次两个 drop-in，重载 systemd 并重启前台服务，即恢复原构建目录。不要清空数据库；如需回滚规格，应从备份恢复四个类目的 `spec_schema` 和对应产品 `specs`，不能全库覆盖后续用户数据。
