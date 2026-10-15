# 双板数据线上同步记录（2026-10-14）

## 部署结果

- 线上站点：`http://115.190.156.88/youpu/`
- 已把仓库内 39 款双板资料同步到生产数据库；当前 39 款均有尺码规格，共 166 条尺码数据。
- Salomon QST 92、QST 98 的两条旧草稿从错误的 2026/27 标识改为有官方货号和目录依据的 2023/24 档案，保留草稿状态、原商品 ID、价格及社区数据。
- HEAD EASY JOY R 保持已发布，封面和商品图片更新为 HEAD article 316265 官方图。
- 其他商品的受保护字段和非 EASY JOY R 图片记录与部署前快照一致。
- HEAD Shape V2 R 继续保留 170 cm 的 12.5 m 半径；HEAD 租赁手册另列 12.4 m，具体记录已注明这是官方资料间的差异。

## 线上核验

- 双板汇总：`39:39:166`（总商品数：有尺码数据的商品数：尺码记录数），与本地 YAML 种子逐条统计一致。
- `youpu-api`、`youpu-web`、`youpu-domain-web` 均为 active；API 健康检查返回数据库和 Redis 正常。
- Easy Joy R、Shape V2 R API 数据已读取并核对；Easy Joy R 返回 article 316265 图片，Shape V2 R 返回一条 12.5 m 尺码规格。
- 本次只同步服务端数据库与种子文件，没有重启服务。
- API 健康检查中的 Elasticsearch 项仍为 `false`；本次变更没有涉及搜索配置。

## 回滚材料

生产机目录：`/opt/youpu-releases/20261014-ski-content/`

- `database-before.dump`：同步前 PostgreSQL 完整备份。
- `source-before.tar.gz`：同步覆盖的原种子文件备份。
- `sync-preview.log`、`sync-apply.log`、`verification-db.txt`、`api-health.json`：执行和核验记录。

部署脚本：[`publish-ski-content-20261014.sh`](publish-ski-content-20261014.sh)。
