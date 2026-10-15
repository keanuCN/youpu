# youpu.asia 域名迁移（2026-10-12）

## 当前配置

- 服务器：`115.190.156.88`，源码目录 `/opt/youpu`。
- 正式站：`https://youpu.asia`，`www.youpu.asia` 跳转到主域名。
- `youpu-domain-web`：监听 `127.0.0.1:3002`，独立构建目录 `.next-youpu-domain`。
- `youpu-api`：监听 `127.0.0.1:3001`，允许新域名的 CORS 请求。
- 原 IP 根路径点单应用和 `/youpu` 入口保留。
- 注册邮件发件人：`no-reply@youpu.asia`。Resend 已验证新域名；现有发送密钥为 All domains，无需更换密钥。

## DNS 记录

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| @ | A | 115.190.156.88 |
| www | A | 115.190.156.88 |
| resend._domainkey | TXT | 见同目录 dns/youpu.asia-records-20261012.csv |
| rsend | CNAME | rsend.forge.rmta.net |
| send | CNAME | send.forge.rmta.net |
| _dmarc | TXT | v=DMARC1; p=none; |

发信记录按本次 Resend 控制台生成的值配置。未来更换发信平台或区域时，重新读取平台记录，不照搬历史值。未启用邮件接收。

## HTTPS 与续期

证书包含 `youpu.asia` 和 `www.youpu.asia`，路径 `/etc/letsencrypt/live/youpu.asia/`，到期时间 **2027-01-10**。

本次 HTTP 验证被云平台拦截，改用人工 DNS 验证签发。**当前不支持无人值守自动续期**；须在到期前重新执行 DNS 验证，添加 Certbot 当次生成的 TXT 值，再重载 nginx。仓库里的两份 ACME CSV 是本次一次性挑战记录，不能用于续期。

```bash
certbot certonly --manual --preferred-challenges dns -d youpu.asia -d www.youpu.asia
nginx -t && systemctl reload nginx
```

## 发布域名前台

2026-10-15 已更新单板科普排版，并增加可切换预设和前后脚角度滑块的俯视站姿模拟。IP 内测站与域名站分别切换到 `.next-snowboard-stance-ui-20261015-{ip,domain}`；IP 科普页与域名科普页在服务器本机校验均为 HTTP 200，点单根站 HTTP 200，三个服务均 active。构建与发布资料位于服务器 `/opt/youpu-releases/20261015-snowboard-stance-ui/`。域名公网访问仍受备案接入限制。

2026-10-15 商品图片迁移随后完成线上同步：生产数据库中 228 款匹配商品的 295 张图已改为 TOS 地址；IP 内测站和域名前台均已切换到 `.next-image-tos-20261015-ip` / `.next-image-tos-20261015-domain`。备份和验收记录见[图片存储说明](../docs/product-image-storage.md)，服务器发布目录为 `/opt/youpu-releases/20261015-image-tos/`。两站首页、单板科普和商品详情经本机请求均返回 200，API 健康为 `db=true`、`redis=true`。域名公网仍受火山引擎备案接入限制。

2026-10-15 已同步滑雪装备资料并发布新前台构建。生产数据库更新 210 款、增加 3 款双板；两个前台目录分别为 `.next-snow-data-20261015-ip` 和 `.next-snow-data-20261015-domain`，API 已重建并重启。线上核验、字段校验限制与回滚备份见[滑雪数据同步记录](./snow-data-sync-20261015.md)，服务器发布目录为 `/opt/youpu-releases/20261015-snow-data-sync/`。IP 内测站与服务端本机 HTTPS 页面返回 200；域名公网访问仍受备案接入限制。

2026-10-14 已发布单板科普快速导航及 Regular / Goofy 站姿选择说明。当前 IP 内测站使用 `.next-regular-goofy-20261014-ip`，域名站使用 `.next-regular-goofy-20261014-domain`；发布备份和构建日志位于服务器 `/opt/youpu-releases/20261014-regular-goofy/`。线上页面检查通过。域名公网访问仍受备案接入限制，服务器本机 HTTPS 验证不代表公网可访问。

2026-10-13 第二轮装备内容已发布；发布记录见[装备发布说明](./equipment-20261013.md)。下方命令记录的是首次域名迁移使用的原构建目录。

独立构建目录避免覆盖 IP `/youpu` 入口的已有构建。生产环境变量需同时用于构建和运行：

```bash
cd /opt/youpu
runuser -u youpu -- env NODE_ENV=production NEXT_DIST_DIR=.next-youpu-domain NEXT_PUBLIC_BASE_PATH= NEXT_PUBLIC_SITE_URL=https://youpu.asia NEXT_PUBLIC_API_BASE=https://youpu.asia NEXT_PUBLIC_CONTENT_SOURCE=api pnpm --filter @youpu/web build
systemctl restart youpu-domain-web
```

Nginx 模板：`deploy/nginx/youpu.asia.conf`；systemd 模板：`deploy/systemd/youpu-domain-web.service`。

## 已完成与外部限制

已完成生产构建、nginx 配置检查、证书签发、Resend 域名验证、API 发件地址切换。服务器本机通过正式 Host/SNI 访问 HTTPS 首页为 200，API 健康接口为 `db=true, redis=true`；原 IP 两个入口仍为 200。页面站点元数据使用新域名。

**外部尚不可正常访问**：HTTP 返回 `Server: Suzaku` 并跳转到 `https://webblock.volcengine.com`，HTTPS 连接被重置。域名需要核对并完成火山引擎备案/接入备案；本机成功不能视为公网验收通过。

2026-10-13 用户确认：`youpu.asia` 已取得 ICP 备案，但尚未接入火山引擎。下一步办理接入备案，使用现有备案信息和当前服务器 `115.190.156.88`；备案主体、服务负责人、真实性核验及协议提交由本人核对完成。控制台：<https://console.volcengine.com/beian/overview/>。接入审核完成后再复核公网 HTTPS 访问。

未向真实用户发送测试邮件，未创建注册账号，故不宣称验证码端到端投递验收完成。

## 回滚依据

生产 API 环境备份：`/opt/youpu/apps/api/.env.before-domain-20261012`（600 权限）。回滚邮件发件人时只恢复 `EMAIL_FROM`，保留其他环境项并重启 API。

原 Next 配置备份：`/opt/youpu/apps/web/next.config.mjs.before-domain-20261012`；HTTP nginx 备份：`/etc/nginx/conf.d/youpu.asia.conf.before-tls`。原有 IP 入口的配置和构建未被替换。

仓库旧域名部署日志、历史数据抓取 `snapshot_url` 保留作为来源记录；它们不是当前正式站配置。
