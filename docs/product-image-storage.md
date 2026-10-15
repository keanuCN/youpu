# 商品图片存储与加速

## 2026-10-15 核对结果

- 火山引擎 TOS 中已有 `youpu` 桶，区域为华北 2（北京），标准存储、单 AZ，创建于 2026-09-27。
- 控制台显示存储总量约 16.77 MiB。已有 `product-images/mirror/` 目录。
- 桶 ACL 为私有；桶策略允许所有用户对 `youpu/product-images/*` 执行 `GetObject`。无需开放桶列表或其他路径。
- 对已知对象的匿名 HEAD 返回 200、`image/webp`，缓存为 `public, max-age=31536000, immutable`。
- 桶的域名管理为空，尚未绑定自定义域名或 CDN 加速域名。TOS 公共地址本身不等于 CDN。
- 发布前全量读取线上公开 API 得到 317 件商品，317 张封面全部使用外部图片地址，TOS 封面为 0；线上图片当时尚未使用已有对象存储。发布后的状态见下方“线上同步与部署”。
- 仓库的滑雪范围（单板、固定器、雪鞋、双板、滑雪服装）有 234 件已发布商品、297 张不同的源图，其中 4 件单板没有图片。迁移工具会保留缺图，不生成替代商品图。

这些数量是迁移前的当日快照；以命令重新检查为准。初次核对阶段只读云资源，后续上传见下方最新进展；未修改权限、创建 CDN 或发布应用。

## 线上同步与部署（2026-10-15）

- 已更新生产数据库中 **228 款线上已有商品的 295 张图**。五个类目的 TOS 封面数：单板 76、固定器 62、雪鞋 40、双板 42、滑雪服 8。
- 同步前后商品非图片字段哈希一致；价格、规格、编辑评分、社区评分与评论、收藏、商品统计和账号未改动。生产商品总数保持 317，没有新增或删除商品。
- IP 内测站和域名前台均已构建并切换到独立构建目录。首页、单板科普、商品详情通过服务器本机请求返回 200；API 健康为 `db=true`、`redis=true`。代表商品图 HEAD 返回 200、`image/webp`，缓存为一年不可变。
- 本地仍有 4 款有图单板（MOSS 两款、NOBADAY 两款）尚未建入生产数据库，另外两款无图 Donek 也未建入；它们不在本次图片更新范围。生产中已撤下的旧 HEAD 双板记录保留。全量目录增删与旧款归档待单独核对。
- 火山引擎桶未配置 CDN 加速域名，当前网页直接读取 TOS 公共对象并使用对象缓存策略。
- 发布备份在服务器 `/opt/youpu-releases/20261015-image-tos/`：`database-before.dump` 是写入前整库备份，`source-before.tar.gz` 保存被覆盖的旧源文件，`systemd-before/` 保存旧服务配置。数据库整库恢复可能覆盖发布后新增的用户数据，回滚前须先检查最新评论、评分与收藏。
- 两个前台当前使用 `.next-image-tos-20261015-ip` 和 `.next-image-tos-20261015-domain`。域名公网仍受火山引擎备案接入拦截；本机 Host/SNI 的 200 不代表公网已开放。

## 本次已完成的本地迁移

### 最新进展：补齐剩余图片（2026-10-15）

已找到仓库根目录被 Git 忽略的 `.env` 中的既有 TOS 服务端配置，并完成后续上传。当前 **234 件滑雪种子商品中，232 件有图商品的 301 张不同图片已全部迁入 TOS**；剩余两件为 Donek Knapton Twin Custom 和 Raven Custom，官方型号页的预览链接指向 `blanktemplate.png`，继续保留无图状态，不使用空白模板充当实图。

| 类目 | 已使用 TOS 封面的商品数 |
|---|---:|
| 单板 | 80 |
| 单板固定器 | 62 |
| 单板雪鞋 | 40 |
| 双板 | 42 |
| 滑雪服装 | 8 |
| 合计 | 232 |

- 在先前复用 106 张图片的基础上，本轮又完成 195 张源图的上传与公开读取验证，其中包含新补的 MOSS 两款共 4 张正反面图片。
- MOSS 图片分别取自官方 `U4 2027`、`WING SW 67 2027` 商品 JSON 的 `images` 字段，型号和年份对应；来源摘录见 `data/raw/snowboard/image-completion-2026-10-15/sources.json`。
- 先前两张 Salomon、K2 Raider 的读取失败均经重试解决，当前已无待迁移的已有源图。
- 本地前台快照仍为 323 件商品，仅有 232 个封面地址变化，价格、参数和社区数据逐项核对一致。
- 新增 `apps/web/src/data/product-image-galleries.json`，从已发布种子导出完整图集，前台备用内容包使用已迁移的全部图集，避免“封面是 TOS、详情缩略图仍读旧外链”。当后台更新了封面、与种子不一致时，前台不会把旧种子图集套回去。
- 232 个种子文件与各批次原始备份累计比对，确认仅图片字段变化；MOSS 两款新加图片前的备份位于 `data/tmp/image-source-completion-20261015/backups/snowboard/`。
- 图片相关测试现为 **25 项通过**；API 生产构建和前端类型检查通过。数据库与应用后续已按上文同步部署。

本轮上传报告与备份：

- `data/tmp/product-image-mirror/2026-10-15T03-55-39-983Z-6320/`：首张上传验证。
- `data/tmp/product-image-mirror/2026-10-15T03-56-19-735Z-23884/`：上传成功 189 张，K2 Raider 当时超时并保留原地址。
- `data/tmp/product-image-mirror/2026-10-15T04-01-20-863Z-42248/`：K2 Raider 重试与 4 张 MOSS 图片均成功。

### 前一批：复用历史对象

通过源图重新下载、归一化和内容哈希匹配，复用历史 TOS 对象，已更新 **106 件商品的封面**：

| 类目 | 改用已有 TOS 封面的商品数 |
|---|---:|
| 单板 | 51 |
| 单板固定器 | 33 |
| 单板雪鞋 | 2 |
| 双板 | 14 |
| 滑雪服装 | 6 |
| 合计 | 106 |

对应 106 个种子文件均已备份；逐个比较确认只改变 `images[].url`。当时本地前台快照仅更新这 106 个封面 URL，商品总数为 323，其他事实字段和社区统计逐条比对一致。当时剩余 191 张不同源图未匹配到可验证的历史对象或源站读取失败，已在上方最新批次中处理完成。

恢复依据位于本机以下批次目录（均由 Git 忽略，部署前应保留）：

- `data/tmp/product-image-mirror/2026-10-15T03-18-41-109Z-41988/`：首张单板图片复用。
- `data/tmp/product-image-mirror/2026-10-15T03-19-07-153Z-41908/`：其余单板图片核对，复用 50 张。
- `data/tmp/product-image-mirror/2026-10-15T03-21-58-448Z-19584/`：固定器、雪鞋、双板和服装，复用 55 张。
- `data/tmp/product-image-snapshot-before.json`：本次更新前的前台快照，用于逐项验证。

当时数据库和线上站点尚未同步这批 URL；后续已在上文记录的 2026-10-15 发布中完成。

验证结果：图片上传、迁移保护、种子改写和前端 URL 规则共 18 项测试通过；API 生产构建和前端类型检查通过。完整 API 类型检查仍被已有的 `src/community/community.service.test.ts:85` 评论测试类型错误阻塞（测试传入的 `images` 不在当前类型中），与本次图片改动无关。

## 已有上传能力

管理台上传经 API 转为最长边 1600 像素、质量 82 的 WebP；对象使用独立文件名并带一年不可变缓存。密钥只在 API 服务端使用。

前台的自有 TOS 图片在开发、API 和内容包模式均直接读取，不再绕过应用图片代理；外部图片仍沿用原有代理规则。`SafeImage` 默认异步解码，调用方可覆盖。

## 将种子图片迁移到 TOS

`mirror:seed-product-images` 默认只预览。它读取已发布商品 YAML，不连接数据库，默认只处理上述五个滑雪类目。

在仓库根目录预览迁移数量（不下载、不上传、不修改文件）：

```bash
pnpm --filter @youpu/api mirror:seed-product-images
```

抽查 3 张单板源图，下载并转换为 WebP（不上传、不改种子；报告写入 `data/tmp/product-image-mirror/`）：

```bash
pnpm --filter @youpu/api mirror:seed-product-images --category snowboard --limit 3 --check-sources
```

已有镜像可以先复用，无需密钥、不写入云端：工具下载源图计算哈希，验证对应 TOS 对象的公开读取、类型和大小，仅把匹配图片的本地种子 URL 改为已有地址，并生成备份。不存在或验证失败的对象保留源地址，报告列为失败项，命令非零退出；这不撤回同批次成功替换的本地文件。

```bash
pnpm --filter @youpu/api mirror:seed-product-images --category snowboard --reuse-existing
```

如果需要上传新的图片，在被 Git 忽略的 API 环境文件中配置下面六项。现有 `apps/api/.env.example` 有对应字段；不要把密钥写进 README、命令行或前端变量：

当前本机已在仓库根目录 `.env` 保存完整 TOS 配置；不必新建密钥，也不需要把密钥复制到前端。`--env-file` 建议传绝对路径，避免运行时对相对环境文件路径的处理产生歧义。

```dotenv
TOS_REGION=cn-beijing
TOS_BUCKET=youpu
TOS_ENDPOINT=https://tos-cn-beijing.volces.com
TOS_PUBLIC_BASE_URL=https://youpu.tos-cn-beijing.volces.com
TOS_ACCESS_KEY=<现有服务端访问密钥>
TOS_SECRET_KEY=<现有服务端访问密钥>
```

先迁移一张单板图，核对生成的报告和 YAML 差异。在仓库根目录执行：

```powershell
$taskTosEnv=(Join-Path (Get-Location) '.env')
pnpm --filter @youpu/api mirror:seed-product-images --env-file $taskTosEnv --category snowboard --limit 1 --apply
```

确认后迁移默认五个滑雪类目的其余图片：

```powershell
$taskTosEnv=(Join-Path (Get-Location) '.env')
pnpm --filter @youpu/api mirror:seed-product-images --env-file $taskTosEnv --apply
```

如果本机设置了 HTTP 代理，SDK 上传可能报 `ERR_INVALID_PROTOCOL`。本次已确认 TOS 可直接通过 HTTPS 访问，运行上传命令前可仅为当前命令环境给 TOS 域名追加直连例外，保留其他代理设置：

```powershell
$env:NO_PROXY="$env:NO_PROXY,youpu.tos-cn-beijing.volces.com,tos-cn-beijing.volces.com"
```

上传错误报告仅保留状态码/错误分类，不记录请求配置或密钥。

流程说明：

1. 仅下载登记过的 HTTPS 来源；每次重定向重新检查域名，限制文件大小和解码像素数。
2. 转成 WebP 后用内容 SHA-256 生成 `product-images/mirror/<hash>.webp`，验证并复用已存在对象，不覆盖图片。
3. 上传后验证公开 HEAD 返回的类型和大小，验证成功才把对应 `images[].url` 改为 TOS 地址。复用模式执行相同验证但不上传。失败的图片保留源 URL，命令非零退出。
4. 每张图片完成后保存报告；每个 YAML 写入前备份原文。来源说明、商品数据、注释和中文内容保留，文件在运行期间被其他操作修改会停止写入。
5. 报告和备份保存在 `data/tmp/product-image-mirror/<批次>/`，由 Git 忽略。重跑会跳过种子中已有 TOS 地址；中断后尚未引用的哈希对象可在重跑时复用。

`--limit` 限制的是不同源图数量，不是商品数量。不同商品共用同一源图时会一同替换。批次报告中的 `changedFiles` 是已备份并准备替换的文件列表；遇到进程中断应结合实际 diff 判断哪些写入已经完成。

迁移命令本身只改变本地种子，不自动同步数据库或部署前台。准备发布时，审核 YAML diff，再用现有 `seed:images` 按文件同步图片，并发布包含 TOS 地址的目录快照与完整图集。这样从 seed 重建时不会恢复成外链。`export:seed` 是旧的原型内容导出工具，会重新写入 YAML，不要用它覆盖已经迁移和人工完善的种子文件。

仅将种子中的封面地址更新到本地前台快照、同时更新完整备用图集（保留全部商品、价格、参数和社区统计），可以使用图片专用导出模式。在仓库根目录执行：

```powershell
$env:CONTENT_EXPORT_SEED_DIR=(Join-Path (Get-Location) 'data')
$env:CONTENT_EXPORT_SEED_CATEGORIES='snowboard,snowboard-binding,snowboard-boot,skis,skiing-apparel'
$env:CONTENT_EXPORT_SEED_IMAGE_ONLY='true'
pnpm --filter @youpu/web export:catalog
```

该模式只更新现有快照封面，不同步数据库、不增删商品。运行后清除临时环境变量，再执行正常的数据导出。

## 复核与恢复

比较种子、API 和前台快照的封面来源。默认检查本地 API；检查线上时用环境变量指定完整 API 基地址：

```powershell
$env:CATALOG_AUDIT_API_BASE='http://115.190.156.88/youpu'
pnpm --filter @youpu/web audit:catalog
```

该命令只读目录，汇总 TOS、外链、本地、缺图和无效地址数量，不下载图片。应确认种子、数据库 API 和最终构建快照中的 TOS 数量一致。

需要撤回本地 URL 替换时，从对应批次的 `backups/<类目>/<文件>.yaml` 恢复经过核对的文件；保留运行后新增的人工修改，避免直接覆盖整目录。不要删除 TOS 对象，其他商品或已发布页面可能仍在引用。

## 后续 CDN 接入

### 可行性核对（2026-10-15）

- 推荐图片域名：`img.youpu.asia`；加速区域先选中国内地，源站选同账号 TOS 对象存储 `youpu`（北京）的公开默认域名 `youpu.tos-cn-beijing.volces.com`。不改网站主站的 DNS，也不应把 TOS“传输加速”误认为 CDN。
- `youpu.asia` 已有 ICP 备案记录。火山引擎文档说明：中国内地或全球加速要求加速域名有 ICP 备案，但备案信息不强制接入火山引擎；因此图片 CDN 可与主站备案接入申请分开处理。创建前仍需在控制台确认域名准入状态。
- TOS 图片对象已有 `Cache-Control: public, max-age=31536000, immutable`，且文件名按内容哈希生成，适合 CDN 长缓存。以后应用端将 TOS 公共 URL 前缀切换为 `https://img.youpu.asia`，保留后续对象路径；当前线上图片仍直接访问 TOS。
- 本机对一个约 60 KiB 的真实 WebP 对象做了 5 次 HTTPS HEAD：首个请求 299 ms，后续连接复用为 73–92 ms，均返回 200。该结果只代表本机到 TOS 的 HEAD 测量，不代表用户端完整图片加载或 CDN 实测；CDN 是否改善实际体验还需完成后用命中/未命中请求对照。
- 火山引擎 CDN 官方按量价格文档列出中国内地首档（每月 0–10 TB）0.22 元/GB，HTTPS 请求数为 0.05 元/万次（部分账号限时免费）。按当前首档粗算，100 GB 出网约 22 元、500 GB 约 110 元，实际以地域、计费项和最终账单为准。CDN 基础服务开通后不能主动退订；停用域名也不一定停止费用，需删除加速域名或同时停用并撤销 CNAME。启用前应先在账号用量查询查看流量，并设置用量封顶和账单告警。
- 本轮未新建 CDN 域名、未开通计费服务、未设置 DNS CNAME，也未切换线上图片 URL。控制台 CDN 页无法在本轮稳定读取，因此实际域名可用性、账号计费状态及封顶设置尚待控制台核实。

官方说明：[新增 CDN 加速域名](https://docs.volcengine.com/docs/Informationdeliverynetwork/Addadomainname?lang=zh)、[TOS 配合 CDN 加速](https://docs.volcengine.com/docs/TorchObjectStorage/AcceleratingTOSResourceAccesswithCDN?lang=zh)、[ICP备案和 CDN 场景](https://docs.volcengine.com/docs/Record/Filingscenario?lang=zh)、[CDN 计费说明](https://docs.volcengine.com/docs/Informationdeliverynetwork/Billinginstructions-17?lang=zh)。

### 接入顺序

1. 在 CDN 控制台确认服务状态、备案准入和用量封顶；按量服务开通不可主动退订，先确认可接受的月度流量费用上限。
2. 添加 `img.youpu.asia`，选择中国内地加速和 TOS 对象存储源站；只保留图片所需的 HTTPS 与缓存配置，避免启用不需要的 QUIC、日志等增值功能。
3. 在 DNSPod 添加控制台分配的 CNAME，并完成 HTTPS 证书配置；核实 CNAME 和证书生效后，以同一 WebP 分别检查首次回源与重复命中。
4. 将前台图片 URL 的 TOS 主机名改为 CDN 主机名，优先使用统一 URL 前缀配置，避免逐项改写数据库/种子中的对象路径；灰度核对首页和商品详情图片后再正式部署。

当前尚未创建 CDN 服务或更改 DNS。应用切换和线上部署仍待用户明确安排；新增云服务或付费配置需先确认成本上限。
