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

2026-10-15 榜单排序回退修复：发现服务器源码落后于 GitHub `main`，新建前台时使用了旧版 `rankRows`。已从提交 `b6dc25a` 的工作树同步源码并分别构建 IP 与域名站，覆盖后的单板综合榜包含本地确认的优先顺序；榜单页 HTTP 200，API 健康检查 `db=true`、`redis=true`，点单根路径 HTTP 200。源码部署前备份、两套构建日志和校验结果保存在 `/opt/youpu-releases/20261015-full-commit-66dd5e6/`。本次没有写生产数据库：同步预检发现滑雪种子字段与类目规格声明不一致，需先补齐 schema 再同步 MACH / Ogasaka 新商品。

2026-10-15 已补充“单板教练认证体系”，按加拿大 CASI、日本 JSBA、美国 AASI/PSIA-AASI、新西兰 SBINZ、国际 ISIA 与中国职业技能评价体系介绍，并将该区块放在三件套搭配之后。IP 内测站 `http://115.190.156.88/youpu/guides/snowboard-setup` 与域名站服务器本机 HTTPS 路由均返回 HTTP 200；三个服务 active，根路径点单应用返回 HTTP 200。发布目录 `/opt/youpu-releases/20261015-instructor-systems/`，源码与 systemd 配置备份保留在该目录。部署只更新 Web 页面与标志图片，没有改动数据库或 API。公网域名仍受备案接入限制。

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

2026-10-12 域名迁移验证当时未向真实用户发送测试邮件或创建注册账号，因此该次记录不代表验证码端到端验收。此后用户已自行注册并确认管理台可用；真实邮件投递链路仍需单独验收。

## 2026-10-19 上线准备只读检查

- `http://115.190.156.88/youpu/`、`/youpu/auth`、`/youpu/admin/` 返回 HTTP 200；管理台此处只验证页面响应，用户此前已确认其登录后可用。
- `/youpu/api/health` 返回 `status=ok`、`db=true`、`redis=true`、`es=false`；单板目录 API 返回 134 条记录。
- 分页只读核对全部 134 条单板：4 款缺封面（COSONE PRO、GRAY QUADRA、GRAY QUADRA II、MOSS U4 Half），编辑评分字段完整，当前有价格的记录均为 CNY；目录 API 暂无显示社区评分数大于零的单板。缺图和社区实测应按真实来源逐步补齐，不添加示例评分或评论。
- 未携带会话访问 `/youpu/api/admin/auth/me` 返回 401，符合未登录预期，不代表用户自己的管理会话无效。未调用注册邮件、评论或审核写接口。
- 此处记录的是部署前状态。用户随后要求统一部署，三款有来源的单板图片、工作区前台和管理台变更已于 2026-10-19 发布；域名公网仍等待接入备案，邮件真实投递、登录后的社区写入和审核链路仍待人工端到端验收。

2026-10-19 部署完成：GRAY QUADRA、GRAY QUADRA II、MOSS Snowstick U4 Half 的商品图已镜像到 TOS，并以事务写入生产数据库；价格、参数、编辑评分、社区评价、收藏和浏览统计均未改动。COSONE 官网图片资源仍为 404，保留无图。IP 内测站首页、登录、管理台、单板科普、API 健康及点单根路径全部返回 200；域名站在服务器本机用正式 Host/SNI 检查首页、管理台、科普和 API 均为 200。公开域名仍受火山引擎接入备案影响，未能进行公网验收。

本次发布目录：`/opt/youpu-releases/20261019-images-and-ui/`；生产库同步前备份及校验清单在该目录，前台构建日志也保存在其中。IP/域名前台构建目录为 `.next-20261019-deploy-ip`、`.next-20261019-deploy-domain`；管理台发布目录为 `/opt/youpu/apps/admin/releases/20261019-deploy/{ip,domain}`。三个 systemd 服务均 active。旧前台构建和管理台目录保留，回滚可将 `NEXT_DIST_DIR` 改回原来的 `.next-f8877e5-{ip,domain}`，并将管理台 `current-ip`、`current-domain` 符号链接恢复到发布目录中的 `admin-*-before.txt` 所记目标后重启两个前台服务。

发布验证：IP 前台、域名 Host/SNI 前台及管理台构建成功；API `tsc -p tsconfig.build.json` 成功。全仓 `pnpm typecheck` 仍被未改动的 `apps/api/src/community/community.service.test.ts` 类型夹具错误阻断（测试对象包含契约不支持的 `images` 属性），未影响 API 生产构建。部署后代码和数据记录随本地 `main` 分支发布提交保留。

## 2026-10-20 前台更新

已发布提交 `6010eec`。前台更新包含注册昵称提示、个人中心预设头像、单板科普插图及近期界面调整；本次没有同步或修改生产数据库。服务器发布目录为 `/opt/youpu-releases/20261020-frontend-6010eec/`，其中保存部署前源码、systemd 配置备份和构建输入包。IP 与域名前台分别构建到 `.next-20261020-6010eec-ip`、`.next-20261020-6010eec-domain`，两个服务均已切换并保持 active。

发布验收：IP 内测站首页、登录页和头像资源均返回 HTTP 200；域名站通过服务器本机正式 Host/SNI 检查，首页、登录页和头像资源均返回 HTTP 200。两个入口的 API 健康状态均为 `db=true`、`redis=true`。域名公网访问仍受火山引擎接入备案限制，本次未做公网验收。回滚时将 `systemd-before/` 中的两个站点 drop-in 配置恢复并重启 `youpu-web` 与 `youpu-domain-web`，旧构建目录仍保留。

## 2026-10-20 首屏优化与单板科普图片

已发布提交 `36435c3`。首页随机雪场主图改为首屏服务端直接渲染，商品推荐与分类计数请求延后并减少数据量；单板风格科普替换为 7 张原创 WebP 图片，包含全山、刻滑、平花、公园、跳台、半管和自由骑。图片单张约 74–109 KB，并按 IP 子路径正确加 `/youpu` 前缀。本次未修改生产数据库。

IP 与域名前台分别使用 `.next-20261020-36435c3-ip`、`.next-20261020-36435c3-domain`，服务 drop-in 为 `zzzzzzzzzz-home-speed-20261020.conf`。发布备份及两份构建日志位于 `/opt/youpu-releases/20261020-home-speed-snowboard-art-36435c3-r5/`。部署后 IP 首页、域名站本机 Host/SNI 首页、两站单板科普页及 IP 根路径点单应用均返回 HTTP 200；单板图片资源可访问；API 健康状态为 `db=true`、`redis=true`、`es=false`。域名公网访问仍受火山引擎接入备案影响，本次只做服务器本机 Host/SNI 验收。

## 2026-10-20 品类目录、参数横表与商务广告位

已发布提交 `36b06a3`。全部品类菜单、目录页及首页入口移除英文分类副标题；完整参数横表的商品列等宽分配，长内容自动换行；教练认证标志按部署子路径加载本地图片；左右商务广告位展示联系微信号及用户提供的二维码。未修改或同步生产数据库。

IP 与域名前台分别构建到 `.next-20261020-36b06a3-ip` 和 `.next-20261020-36b06a3-domain`，通过 `zzzzzzzzzzzzz-20261020-36b06a3.conf` 切换。源码备份、发布包及构建日志位于 `/opt/youpu-releases/20261020-ui-36b06a3/`。部署后两个服务均 active；IP 内测站、服务器本机 Host/SNI 域名站及两站二维码图片均返回 HTTP 200；API 健康检查为 `db=true`、`redis=true`、`es=false`。域名公网访问仍受火山引擎接入备案影响，本次只做服务器本机 Host/SNI 验收。

## 回滚依据

生产 API 环境备份：`/opt/youpu/apps/api/.env.before-domain-20261012`（600 权限）。回滚邮件发件人时只恢复 `EMAIL_FROM`，保留其他环境项并重启 API。

原 Next 配置备份：`/opt/youpu/apps/web/next.config.mjs.before-domain-20261012`；HTTP nginx 备份：`/etc/nginx/conf.d/youpu.asia.conf.before-tls`。原有 IP 入口的配置和构建未被替换。

## 2026-10-23 备案完成后公网复测

- 火山引擎备案控制台“互联网信息服务”列表显示网站 `youpu.asia`、服务备案号 `津ICP备2026009482号-3`、接入 IP `115.190.156.88`、状态“正常”；已结束订单显示备案完成，更新时间为 2026-10-23 16:00（北京时间）。
- 公共 DNS 的 A 记录及 `www` 均指向 `115.190.156.88`。从外部网络请求根域名，HTTP 仍返回 `Server: Suzaku` 和 302 到 `https://webblock.volcengine.com`；HTTPS 在 TLS 握手阶段被重置。
- 服务器侧只读核验：Nginx 配置检查通过，`nginx`、`youpu-domain-web`、`youpu-api` 均 active；本机带正式 Host/SNI 请求 HTTPS 首页返回 200，IP 内测入口 `/youpu/` 返回 200。证书包含根域名与 `www`，有效期至 2027-01-10。
- 结论：应用、源站 Nginx、证书和 DNS 均正常，失败发生在公网边缘层，尚未解除拦截；本次未改服务器配置、应用或生产数据。火山引擎官方[备案完成 FAQ](https://docs.volcengine.com/docs/6428/141467)说明备案信息跨系统同步可能延迟；官方[接入备案 FAQ](https://docs.volcengine.com/docs/Record/AccessFilingFAQ?lang=zh)说明接入完成并通过审核后会尽快解除阻断。
- 后续：等待同步后复测 HTTP/HTTPS；若仍被拦截，向火山引擎备案支持提交域名、服务备案号、完成时间、HTTP 响应头和 TLS 重置结果，请其核查边缘拦截状态。本记录不含个人实名资料。

仓库旧域名部署日志、历史数据抓取 `snapshot_url` 保留作为来源记录；它们不是当前正式站配置。
