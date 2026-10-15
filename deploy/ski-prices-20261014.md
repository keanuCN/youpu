# 双板人民币价格同步（2026-10-14）

## 部署结果

- 目标服务器：`115.190.156.88`，生产数据库 `youpu`。
- 双板目录共 39 款，其中 38 款已写入人民币价格；数据库统计 `39:38`（商品总数：有价数）。
- 线上原本没有 HEAD Easy Joy 2026/27（315656），本次未创建该产品。预览发现它的 `articleNumber`、`speed`、`turnShape`、`base` 和价格来源字段超出生产双板模板，`turnRadius` 也与模板的数字类型不符；应先整理模板和档案再发布。
- 数据库仅更新 `price_min`、`price_max`、`price_currency`。保留了规格、图片、商品状态、评分、收藏和社区数据。价格按服务端规范四舍五入到整元。
- API 健康检查通过：`db=true`、`redis=true`。Rossignol Experience 76 Xpress API 返回 CNY 3,212。
- 本次没有重启 API、前台服务或域名服务。

## 回滚材料

服务器 `/opt/youpu-releases/20261014-ski-prices/` 保存：

- `database-before.dump`：写入前 PostgreSQL 完整备份。
- `source-before.tar.gz`：同步覆盖文件的生产源码备份。
- `price-preview.log`、`sync-apply.log`、`ski-price-counts.txt`、`experience-76-api.json`、`api-health.json`：预览、写入及核验输出。

执行脚本：[publish-ski-prices-20261014.sh](publish-ski-prices-20261014.sh)。
