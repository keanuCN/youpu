# 有谱 youpu

> 万物参数图鉴 + 客观分析 + 社区评价的装备选择网站
> **买之前，来有谱。**

把装备拆成数据，再决定买不买：结构化参数图鉴、横向对比、按条件推荐、社区实测评价放在同一张表上。
**首发品类单板**（创始人熟悉该领域，作为数据质量的兜底），架构按多品类设计——新增品类 = 插一条类目配置 + 录数据，前后端零代码改动。

- **目标市场**：中文用户，PC 为主、移动端兼顾；流量主战场在微信搜一搜 / 知乎 / 小红书（详见技术方案 §14）
- **v1 不做**：英文站、纯 AI 无审核内容、自建电商、盈利功能

## 技术栈

| 层 | 选型 |
|---|---|
| 前端 | Next.js 14（App Router）+ TypeScript + Tailwind CSS v4 |
| 后端 | NestJS + Prisma + PostgreSQL 16 |
| 搜索 / 缓存 | Elasticsearch 8（analysis-ik 中文分词）/ Redis |
| 图片 / 部署 | 火山引擎 TOS / Docker Compose + Nginx + GitHub Actions |
| 契约 | `packages/schema`：zod 定义 spec_schema、事件字典、API 响应类型，前后端共用 |

## 仓库结构

```
youpu/
├── apps/
│   ├── web/              # Next.js 用户侧（SSR）
│   │   ├── src/data/     # 内容包回退数据（API 模式不可用时继续保证浏览）
│   │   └── scripts/      # export-seed-yaml.ts / export-catalog-snapshot.ts：内容包与云端目录工具
│   ├── admin/            # 管理端（数据分析、资料库、审核、审计与账号权限，端口 3002）
│   └── api/              # NestJS 后端（Prisma / Redis / ES）
│       └── prisma/       # schema.prisma + 手写 SQL 迁移
├── packages/schema/      # 共享契约（spec_schema 解释器、事件字典、API 响应类型）
├── data/                 # seed 数据（类目/品牌/单板 YAML），PG 为主数据源时它是导入格式
├── docker/               # compose（PG/Redis/ES-ik/Umami）+ ES 中文分词自定义镜像
├── docs/                 # 设计文档（技术方案 / 数据库设计）+ 实施记录（M2 接 API 准备等）
└── 原型/                 # 前端设计原型（页面与交互的设计稿，样式与文案以它为准）
```

## 快速开始

前置：**Node ≥ 20**、**pnpm 9**（Node 25+ 已移除 corepack，用 `npm i -g pnpm@9` 安装）、
[Docker Desktop](https://www.docker.com/products/docker-desktop/)（跑后端时才需要）。

```bash
pnpm install                                              # 安装依赖（含 prisma generate）
cp apps/web/.env.example apps/web/.env.local              # 前端配置（默认值即可）
```

### A. 只看前端（无需 Docker）

```bash
pnpm dev:web        # http://localhost:3000
pnpm dev:admin      # http://localhost:3002（需先启动 API）
```

页面默认使用 `apps/web/src/data/` 内容包；账号注册、登录和社区写入通过 API 完成，个人偏好在本机缓存并随账号同步。冷启动社区内容由 `NEXT_PUBLIC_CURATED_BASELINE` 控制，详见“数据来源”说明。
仅看内容包时不需要 API，埋点上报在 API 不可用时会静默跳过。

静态前台构建时，如果设置了 `CONTENT_EXPORT_API_BASE`，会自动从公开目录 API 拉取最新快照再构建；快照会覆盖价格、封面、参数、品类和新增产品，已有编辑分析与评分分布继续保留在内容包中。未设置时沿用仓库内快照，纯前端启动不需要 API：

```powershell
$env:CONTENT_EXPORT_API_BASE = "http://localhost:3001"
pnpm --filter @youpu/web build
```

导出步骤也可单独执行：`pnpm --filter @youpu/web export:catalog`。配置了正式 API 地址的 CI 构建同样会在构建前刷新目录；构建产物仍需按部署流程发布，数据库变更不会绕过审核直接上线。

需要从线上数据库生成本地快照时，只替换 `CONTENT_EXPORT_API_BASE` 为正式 API 地址。此流程只读取公开目录接口，不会把数据库密码或邮件密钥写入仓库；静态产物仍需单独部署。

需要联调目录 API 时，在 `apps/web/.env.local` 设置 `NEXT_PUBLIC_CONTENT_SOURCE=api`。
档案库列表和详情页会优先请求 API，接口不可用、超时或响应不符合共享契约时自动回退内容包；API 恢复后无需改页面代码即可继续使用 API 数据。
API 模式使用 Next 服务端渲染；静态导出模式仍使用内容包，构建配置会拒绝两者同时开启。当前 M2 的详情页仅对本地已配置的 live 类目提供完整评分、参数模板与同场景推荐，未知类目会安全回退或显示空态，避免误用单板配置。

核对仓库种子、本地 API 发布目录和前台快照是否一致：启动本地 API 后执行 `pnpm --filter @youpu/web audit:catalog`。该命令只读三种数据源，按类目汇总数量、列出商品差异，并提示种子缺图 / 缺价及 API 缺少封面的商品；API 地址可通过 `CATALOG_AUDIT_API_BASE` 指定。它不会修改数据或生成快照。

### 采集资料审核

采集器默认把可审核的新品草稿写入 `data/tmp/collector/drafts/`，已有商品的参数更新写入对应批次的 `updates/`。
启动 API 和后台后，在 `http://localhost:3002` 登录，进入“采集任务”并选择这些 YAML 文件上传；可一次选择多个文件，单个文件上限 80 KB。
API 会校验类目、品牌、参数和重复商品，再放入待审核队列。确认新品只会创建未发布草稿；确认更新只应用采集报告中的新增 / 修改参数，保留人工补充字段和当前发布状态；来源页面缺失的字段不会被删除。若商品在采集后已有参数变更，系统会阻止过期更新并要求重新采集。

### 全局搜索

顶部搜索进入 `/search?q=关键词`，支持品牌、型号、中文关键词、类目、品牌、年份、价格区间、排序和分页。
搜索 API 为 `GET /api/search`：配置 Elasticsearch 时使用中文分词；未配置或不可用时自动使用 PostgreSQL。
前端 API 请求失败时回退到本地内容包，因此只启动 Web 也可以搜索现有内容。

### B. 全栈（需要 Docker）

```bash
cp .env.example .env                                      # compose 变量（默认值即可直接跑）
cp apps/api/.env.example apps/api/.env
pnpm infra:up      # 起 PG + Redis（默认只这两个）；需要 ES/Umami 用 pnpm infra:up:full
pnpm db:migrate    # 建表（22 张表 + 触发器 + event 按月分区）
pnpm seed          # 导入类目 / 品牌 / data/ 中的产品种子
pnpm dev           # web:3000 + api:3001
pnpm dev:admin     # 另开终端启动后台：3002
```

#### 商品图片存储（火山引擎 TOS）

后台商品图片上传使用火山引擎 TOS。将 `apps/api/.env.example` 复制为 `apps/api/.env` 后，填写以下配置；`.env` 已被 Git 忽略，真实密钥不要写入或提交到 `.env.example`：

| 变量 | 用途 |
|---|---|
| `TOS_REGION` | 存储桶地域，例如 `cn-beijing` |
| `TOS_BUCKET` | 存储桶名称 |
| `TOS_ENDPOINT` | TOS API 访问地址（含 `https://`） |
| `TOS_ACCESS_KEY` / `TOS_SECRET_KEY` | 专用 IAM 用户的访问密钥；只配置在 API 服务端 |
| `TOS_PUBLIC_BASE_URL` | 浏览器可访问的对象公共 URL 前缀，不带末尾 `/` |

六项必须全部填写，否则上传接口会提示图片存储未配置。建议为专用 IAM 用户仅授予目标桶 `product-images/*` 路径的 `PutObject` 权限；图片读取通过公开 URL 提供，请确保桶或自定义域名允许浏览器读取对象。配置完成后重启 API。

上传仅接受 JPEG、PNG、WebP 静态图片，单张原图最大 10 MB；服务端会自动纠正方向、限制最长边为 1600 像素并转为 WebP（质量 82），再保存到 `product-images/` 路径。上传 API 为需管理员认证的 `POST /api/admin/product-images`。

已有外链图片可使用 `pnpm --filter @youpu/api mirror:seed-product-images` 预览迁移；加上 `--check-sources` 只检查下载与压缩，`--reuse-existing` 只复用内容哈希、类型和大小均验证通过的已有 TOS 图片并备份、更新种子，不需要密钥；显式使用 `--apply` 才会上传缺少的图片。默认覆盖单板、固定器、雪鞋、双板和滑雪服装，不连接数据库、不自动部署。前台自有 TOS 图片直接读取并缓存。控制台现状、凭据配置、迁移、检查和恢复步骤见[商品图片存储与加速](docs/product-image-storage.md)。

2026-10-15 已完成滑雪种子中 232 件有图商品的 301 张图片迁移，并更新本地封面快照及完整备用图集；MOSS U4、WING SW 67 已补入对应 2027 官方正反面图片。两款 Donek 定制板继续保留无图状态。随后已将线上已有且与种子身份匹配的 228 款商品、295 张图同步到 TOS，并部署 IP 内测站和域名前台。线上尚缺 4 款有图单板商品记录（MOSS 两款、NOBADAY 两款），以及两款无图 Donek；本次不新增或删除商品。发布记录与备份位置见[商品图片存储与加速](docs/product-image-storage.md)。

2026-10-15 本地种子、生产目录 API 与本地前台快照只读对账结果见[目录对齐审计](docs/目录对齐审计-2026-10-15.md)。当前生产目录 317 款、本地已发布种子 322 款、本地快照 323 款；待补商品和规格字段校验阻塞已列出，本次没有写线上数据库。

默认启动 PostgreSQL + Redis 即可完成基础开发；Elasticsearch 只用于增强搜索和分面，不是 API 可用的必需依赖。
健康检查 `http://localhost:3001/api/health` 会返回 `db`、`redis`、`es` 三项状态，其中 `es=false` 不代表 API 不可用。

后台现在以已有账号体系登录为主：在 `http://localhost:3002` 使用邮箱和密码登录，账号必须是 `active` 状态且角色为
`editor` 或 `admin`。`ADMIN_TOKEN` 仍是迁移期间的旧令牌入口，配置为至少 16 位随机值即可；不配置时不会影响账号登录。
旧令牌只作为兼容入口，不应作为生产环境的长期登录方式。

首次把账号纳入后台时，可先用旧令牌进入后台，或在 PostgreSQL 中执行以下最小初始化（把邮箱替换成实际账号）：

```sql
UPDATE account SET role = 'admin', status = 'active' WHERE email = 'your-admin@example.com';
```

之后使用账号登录；管理员可以在“账号管理”中调整角色和状态。系统不允许停用或降级最后一个启用中的管理员。

| 服务 | 地址 |
|---|---|
| 站点 | http://localhost:3000 |
| API 健康检查 | http://localhost:3001/api/health（db / redis / es 状态） |
| Umami 流量分析 | http://localhost:3005（`infra:up:full` 才启动；默认 admin / umami） |

## 线上（内测站）

- **IP 内测入口**：<http://115.190.156.88/youpu/>；管理台：<http://115.190.156.88/youpu/admin/>。
- 2026-10-14 双板数据同步记录与回滚备份位置见 [`deploy/ski-content-20261014.md`](deploy/ski-content-20261014.md)。
- **正式域名**：<https://youpu.asia> 已配置 DNS 和 HTTPS；公网访问仍受火山引擎接入备案限制。服务器本机按正式 Host/SNI 检查通过，不等于公网已开放。
- **站点共存**：IP 根路径的点单应用保留；有谱运行在独立 `/youpu/` 前缀，域名站点使用独立 Next.js 服务。API、PostgreSQL 和 Redis 由服务器服务运行。
- **生产目录**：服务器源码位于 `/opt/youpu`；当前服务、域名与回滚记录见 [deploy/README.md](deploy/README.md) 和 [youpu.asia 部署说明](deploy/youpu.asia.md)。

## 日常命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` / `dev:web` / `dev:admin` | 起 web + api / 只起 web / 启动 M2 管理端 |
| `pnpm infra:up` / `infra:down` | 基础设施容器（默认 PG + Redis） |
| `pnpm infra:up:full` | 追加 ES + Umami（内存吃紧的机器别开） |
| `pnpm db:migrate` | 应用迁移（`prisma/migrations` 下的手写 SQL 为准） |
| `pnpm seed` | 重新导入 `data/` 数据（幂等） |
| `pnpm --filter @youpu/api validate:data` | 只校验 data/ 数据、不连库（CI 可用） |
| `pnpm --filter @youpu/api seed:category-schema -- --category snowboard-binding` | 仅将指定类目的 data/categories.yaml 规格模板同步到本地 API，不重导全部商品 |
| `pnpm --filter @youpu/web export:seed` | 原型内容包 → seed YAML（一次性迁移工具） |
| `pnpm --filter @youpu/web export:catalog` | API 目录 → 前台云端快照（静态构建前运行） |
| `pnpm --filter @youpu/web audit:catalog` | 比较种子、本地 API 与前台快照，列出数量和商品差异 |
| `pnpm --filter @youpu/api seed:export-missing -- --category snowboard-binding` | 预览本地数据库中缺少的固定器种子；追加 `--apply` 只新建缺失文件 |
| `pnpm es:reindex` | ES 全量重建 |
| `pnpm typecheck` / `pnpm build` | 全仓类型检查 / 构建 |

Web 开发服务使用 `.next-dev`，生产构建使用 `.next`，两者构建缓存相互隔离。

## 前端页面（apps/web）

按 `原型/` 的设计稿实现，瑞士数据风（Tailwind v4 + oklch 单强调色 token，见 `app/globals.css`）。

| 路由 | 页面 |
|---|---|
| `/` | 首页：封面 / 品类入口 / 本期新入库 / 综合榜 / 社区实测 / 问卷入口 |
| `/browse/[slug]` | 档案库：场景·板型族·硬度·价格·品牌·年份筛选 + 四种排序 + 卡片网格 |
| `/gear/[id]` | 详情：图集 / 关键数据 / 客观分析 / 完整参数（分组手风琴）/ 六维雷达 / 实测评论 / 同场景对照 |
| `/compare` | 对比：叠放雷达 + 差异判定 + 胜出方标注 + 完整参数横表 |
| `/quiz` | 6 题选装备问卷 → 带计分理由的 Top3 |
| `/rankings` | 雪季榜单：6 个分榜 + 领奖台 + 社区投票（每人一票、可改投一次） |
| `/auth` `/me` | 登录注册（本机账号）/ 收藏·对比历史·我的评论·问卷·通知·资料 |
| `/search` | 全局搜索：关键词、类目、品牌、年份、价格、排序与分页 |
| `/soon/[slug]` | 未开档品类占位页 |

**数据来源**：商品事实与编辑分析来自 `src/data/` 内容包或目录 API；冷启动评分、评论和榜单基础票数在代码内容包中单独维护，不写入用户评分表。账号提交的评分、评论、回复和投票经 API 独立保存。设置 `NEXT_PUBLIC_CONTENT_SOURCE=api` 后，档案库列表和详情优先读取 API，失败时回退内容包；API 返回的真实聚合评分优先于冷启动评分。

**冷启动内容切换**：默认 `NEXT_PUBLIC_CURATED_BASELINE=true`（未设置时也启用），用于本地和初期展示已有的评分分布、评论内容及榜单基础票数。准备只展示真实用户数据时，在 `apps/web/.env.local` 设置 `NEXT_PUBLIC_CURATED_BASELINE=false` 并重启开发服务，或在生产构建环境中设置后重新构建发布。关闭只隐藏内容包中的冷启动数据，不删除 API 数据，也不影响真实账号产生的评分、评论、回复、帮助数和投票；因此可通过切换一个环境变量完成替换，无需改库或迁移用户数据。
用户资产存 localStorage；埋点链路为 `track()` → `POST /api/events`。

**与原型的两处差异**（有意为之，均记录在案）：
- 修复了原型的一处逻辑 bug：多选题原本点第一项就自动跳题，导致「可多选」实际只能选一项；现改为多选停在本题、由「下一题」推进。
- 导航与首页 hero 做了品类中立化（品类入口统一走「全部品类」面板，由配置驱动）——单板只是 运动 → 滑雪 下的一个叶子品类。

**已知取舍**：卡片底部的悬浮操作按钮贴近视口底部时会被常驻对比坞遮挡，需滚动后点击（原型同款行为，未擅自改交互）。

## SEO 技术件（技术方案 §14.2）

已落地（`apps/web/src/lib/seo.ts` + 各页 server 壳）：

| 项 | 实现 |
|---|---|
| 标题/描述模板 | 全部从结构化数据生成：详情页 `{model} {year} 参数 · 实测评分 · 尺寸怎么选 - {brand} \| 有谱`；列表页 `{类目}怎么选 · 全参数对比与实测评分` |
| canonical 纪律 | 筛选/排序参数 URL（`?sort=` `?q=`）一律 `noindex, follow`，只让干净路径进索引；分页走 self-canonical |
| JSON-LD | 详情页 `Product + AggregateRating + Offer`（有评分才输出聚合评分）+ `BreadcrumbList`；榜单页 `ItemList` |
| sitemap | `/sitemap.xml` 自动生成（首页 / 开档类目 / 详情 / 榜单 / 问卷 / 对比，共 20 条），数据上千后改用 `generateSitemaps` 分组 |
| robots | `/robots.txt` 放行全站、挡 `/me` `/auth` `/api/`，声明 sitemap |
| noindex 白名单 | 个人中心、登录页 |
| 渲染形态 | 详情页 15 个档案 `generateStaticParams` 静态预渲染 |

静态发布构建必须同时设置 `NEXT_PUBLIC_SITE_URL`、`NEXT_PUBLIC_API_BASE`、`CONTENT_EXPORT_API_BASE` 为正式 HTTPS 地址；构建会自动拒绝缺失或 localhost 配置并刷新线上目录快照。2026-09-30 已按 [部署说明](deploy/README.md) 发布生产构建，并复核 canonical、robots、sitemap、前端资源与 API 健康状态。
待办：`FAQPage` 结构化数据等 M3 客观分析产出问答形态后再加。

## 架构要点

- **spec_schema 是唯一契约**（技术方案 §5）：`packages/schema` 一份 zod 定义，被 seed 导入校验、API 列表/详情渲染、
  未来后台动态表单共用。权威定义在 `data/categories.yaml`（19 字段 / 5 分组，含对比胜负方向、差异阈值、评分维度权重）。
- **数据质量闸门**：`pnpm seed` 中 specs 与编辑评分必须通过类目 spec_schema 校验，不通过则该条不导入并以非零码退出。
- **outbox 事件管线**（数据库设计 §7.2）：业务写 PG 的同事务内发 outbox 事件 → worker 消费 →
  评分聚合回写 / ES 同步 / 通知。已注册 `product.updated`、`rating.changed`、`favorite.changed`、`config.changed`。
- **埋点链路**（技术方案 §12）：前端 `track()` → 批量 `POST /api/events`（zod 白名单裁剪 props）→
  Redis Stream → worker 批量落 PG `event` 表（按月分区，启动时自动补齐当月分区）。
- **列表页防爬**：列表接口只返回非 nested 的标量参数，全量 specs 仅详情页返回（§13 最小返回原则）。
- **SSR 水合**：本机数据一律经 `usePersisted()/useCurrentUser()` 读取（挂载前返回确定性游客态），
  服务端 HTML 与首帧客户端渲染一致（Chrome 实测无 hydration 报错）。

## 里程碑（技术方案 §10）

| 阶段 | 内容 | 状态 |
|---|---|---|
| M1 脚手架 | monorepo、类目 schema、seed 管线、compose、埋点 SDK + Umami | ✅ 已完成（迁移 / 分区表 / ltree 已在生产 PG 实测） |
| M2 图鉴流 + 后台基础 | 列表/详情/对比/榜单、全局搜索与筛选、SEO 技术包、后台基础版 | 🚧 内容 API、搜索筛选、后台基础版及生产部署已落地；上线验收待完成 |
| M3 社区流 + 审核配置 | 登录/评分评论/收藏/通知、客观分析引擎、问卷版推荐、后台审核队列 | 🚧 认证、问卷、评分评论收藏通知和举报审核闭环已落地；客观分析与运营扩展待续 |
| M4 运营 | 分享卡图、赛季榜单、AI 对话式推荐 | ⏳ |

## 文档

2026-10-15 为 KAILAS 女款 BM45 PLUS（KG2541241）补入凯乐石微商城精确货号商品页的完整 5 张商品轮播图，图片地址均返回 `200 image/jpeg`；图片展示授权仍待核。再查到拼多多新加坡地区精确货号页面，但其 SGD 983.79 与括号人民币折算均不作为中国售价；京东仍只有闪电紫 S 单码线索。该商品继续保持草稿，未根据同系列页面补写完整尺码、雪季或技术参数。详见[商品种子](data/skiing-apparel/kailas-bm45-plus-womens-insulated-ski-jacket-2026.yaml)、[来源审计](data/raw/skiing-apparel/kailas-bm45-plus-womens-insulated-ski-jacket-2026-10-15.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 复核 Rossignol Soul 102（RAPMR03000）重量口径：西班牙官方页 180 cm 单码参考写作 2.05 kg/半双，但同页逐码表标注 kg/双、列 1.75–2.15。第三方托管的 26/27 Specialist Workbook 中，同平台候选 Savage Free（RAPMR04）列出对应整双重量 3.5–4.3 kg；发布方身份与货号映射未核实，因此只留作线索，不映射到 Soul 102。重量暂不填入种子，等待精确货号整双规格或品牌澄清。详见[重量审计](data/raw/skis/rossignol/soul-102-2026-27.json)与[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 Jones Mercury FASE 2026 固定器补入美国官方 USD 379.95 折算参考 CNY 2,542.90；官方 SKU 为 J.26，旧 CHF 359.95 证据的 SKU 为 J.27，已按错季排除。折算不是中国售价，页面采集时所选变体售罄。详情见[价格与错季审计](data/raw/snowboard-binding/jones-mercury-fase-binding-2026-price-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Jones Orion 2026 固定器补入美国官方 USD 319.95 折算参考 CNY 2,141.34；加拿大 CAD 379.99 作为独立地区报价保留。官方商品 SKU 为 J.26；折算不是中国售价。详情见[Orion 价格审计](data/raw/snowboard-binding/jones-orion-binding-2026-price-2026-10-15.json)。

Flow Fenix 2027、Nexus 2027、Fuse 与 Fuse Hybrid 2026 补入 Nidecker 官方美国店人民币折算参考，分别为 CNY 1,806.70、1,472.06、2,141.34、2,141.34；Fenix/Nexus 由 N.27 SKU 确认 2027 款。均非中国售价，Fuse 页面核对时显示售罄。见[Flow 官方报价证据](data/raw/snowboard-binding/flow-bindings-official-prices-2026-10-15.json)与[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Nidecker OG Supermatic、LT Supermatic 2026 补入美国官方价折算参考 CNY 2,877.53、3,212.17；OG 的欧盟 EUR 399.95 作为独立地区交叉价保留。均非中国售价。见[Supermatic 价格证据](data/raw/snowboard-binding/nidecker-supermatic-official-prices-2026-10-15.json)。

Nidecker Kaon Plus 2026 按欧盟官网 CHF 279.95 折算为 CNY 2,248.15，使用 ECB 2026-10-14 汇率；货号 N.26 对应雪季。不是中国售价，核验时库存有限。见[价格证据](data/raw/snowboard-binding/nidecker-kaon-plus-2026-price-2026-10-15.json)。

Rome 8 款 2026/27 固定器按美国官方挂牌价补入人民币折算参考，范围 CNY 2,208.26–3,145.24；具体型号、美元报价、换算汇率与限制见[Rome 报价审计](data/raw/snowboard-binding/rome-bindings-us-prices-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。均非中国售价。

### 滑雪数据现状（2026-10-15）

滑雪装备种子共 240 款文件，其中 234 款已发布、6 款为草稿；包含单板、固定器、雪鞋、双板、10 款滑雪服装与软装备及 6 款滑雪护具。下表尺码覆盖按种子文件统计，尺码行数是结构化规格行数，不代表所有型号的所有可选长度都已有逐码参数。公开目录快照不包含草稿。

| 品类 | 商品数 | 有结构化尺码表 | 尺码行数 | 当前主要缺口 |
|---|---:|---:|---:|---|
| 单板 | 77 | 77 | 587 | 部分尺码数据来自零售商复录的厂商资料；型号雪季和中国人民币报价仍需逐项核验 |
| 固定器 | 63 | 62 | 199 | COSONE Step On 缺型号级尺码和接口依据；官网首页 ¥2,599 无商品详情页，保持草稿 |
| 雪鞋 | 40 | 40 | 704 | 缺跨型号脚宽/鞋楦绝对宽度数据；K2 Maysis Wide 有原厂 7 mm 相对差，其余 Wide 款多为定性结构描述 |
| 双板 | 44 | 44 | 199 | HEAD Easy Joy R 143 cm 采用未显示 HEAD 货号的专业零售商补充值；Shape V2 R 仍有三个逐码缺口，详见快照 |
| 滑雪服装与软装备 | 10 | 2 | 6 | 8 款服装缺型号级成衣测量表；KAILAS 袜子与手套有品牌通用尺码表，非该款专属版型数据 |
| 滑雪护具 | 6 | 6 | 26 | DBCK 500/900 部分尺码建议围度范围重叠，且商品卖点与尺码表档数不一致；两款头盔雪季、中国价格及图片授权待核 |

分类文件数、发布/草稿数、尺码表行数和逐尺码缺项明细见[当前数据缺口快照](docs/滑雪数据缺口-2026-10-15.json)。COSONE Step On 目前仍是草稿：官网首页再次显示商品卡和 ¥2,599 标价，但没有商品详情、型号级尺码表或接口认证；不套用 Burton Step On 尺码表。

2026-10-15 封面图巡检覆盖 240 个种子：239 张已有封面返回 HTTP 200 和 `image/*`，唯一空图是仍保持草稿的 COSONE Step On 固定器。HEAD 状态只表示该次 URL 可访问，不证明图片授权、后续可用性或其他图库图片状态。见[封面图 HTTP 审计](data/raw/cover-image-http-audit-2026-10-15.json)。

GRAY DESPERADO micro/mini（2023/24）已核实官方两档规格和日本含税挂牌价 JPY 108,900，按 ECB 2026-10-14 汇率折算为 CNY 4,599.66；修正为官方归档页的完整图片链接。该价为旧季日本参考、非中国售价；图片授权待核，商品仍为草稿。见[数据补充](docs/滑雪数据补充-2026-10-15.md)和[原始证据](data/raw/snowboard/gray/desperado-micro-mini-2023-24.json)。

HEAD EASY JOY R 2025/26 已确认货号 316485，163 cm 官方参考几何为 117/70/103 mm、R13.3；同货号来源另有 158 cm 完整几何及韩国零售页 148/153 cm 半径 R9.3/R10.1（未给这两码板型三围）。Snowleader 专业零售商逐码表新增 143 cm 的 117/70/103 mm、R9.6；其型号、长度和 163 cm 参考数据与官方款匹配，但未显示 HEAD article number，故仅作为零售商补充值，并保留映射限制。波兰精确组合页的 163 cm 半径 13.1 m 与官方 13.3 m 冲突，不用于几何。欧洲套装主参考折算 CNY 1,947.98；各地区价均不是中国售价，中国精确货号在售价仍待核，图片展示授权待核。详见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)和[货号证据](data/raw/skis/head/easy-joy-r-2025-26.json)。

HEAD Shape V2 R（316225）的 Esqui Outlet 西班牙报价 EUR 279.99 是 316225 + PR 10 GW 114528 套装，折合 CNY 2,097.83；由于 HEAD 目录对应的 PR 11 配置有精确波兰组合 `316225#114517`，西班牙价现只作不同绑定配置的地区旁证。主参考已更新为波兰 142 cm 套装 CNY 2,229.30。142、149、177 cm 逐码几何未核实，170 cm 半径 12.4/12.5 m 冲突继续保留。来源见[Shape V2 R 证据](data/raw/skis/head/shape-v2-r-2025-26.json)。

Shape V2 R（HEAD 316225）后续复核找到 315285/未列货号的同季 Shape V2 六尺码半径表，但其中 156/163 cm 数据与 316225 精确货号来源不一致，因此未借用其 142/149/177 cm 数值。另发现 25/26 Rental Handbook 对该租赁配置只列 142–170 cm 五档，而 Hardgoods Workbook 列至 177 cm 六档；现将此作为目录与租赁配置差异记录。复核过程和排除理由见[2026-10-15 数据补充](docs/滑雪数据补充-2026-10-15.md)及[原始证据](data/raw/skis/head/shape-v2-r-2025-26.json)。

2026-10-15 再查 HEAD Shape V2 R（316225）缺尺码：官方索引页只列六个长度，直访返回 404；INTERSPORT 精确型号页只有 170 cm 参考几何；MikeSport 的 142 cm 变体无逐码几何且缺货。142、149、177 cm 仍不填推算值，170 cm 的 12.4/12.5 m 来源差异保留。详见[数据补充](docs/滑雪数据补充-2026-10-15.md)、[HEAD 原始证据](data/raw/skis/head/shape-v2-r-2025-26.json)和[缺口快照](docs/滑雪数据缺口-2026-10-15.json)。
HEAD Shape V2 R 2025/26（316225）现补入 HEAD Workbook 标注的 Allride Rocker、Synthetic Core、LYT Tech、Power Fiber Jacket、ERA 3.0 与 UHM C Base。142/149/177 cm 逐码几何仍未核实，170 cm 半径冲突保留；见[商品种子](data/skis/head-shape-v2-r-2026.yaml)及[原厂特征审计](data/raw/skis/head/shape-v2-r-2025-26.json)。

HEAD Worldcup Rebels e-SL Pro 已按 HEAD 官方目录拆分雪季：2025/26 article 313235 补齐五档逐码几何并加入货号匹配的 HEAD 官方图片，2026/27 article 313236 现也补齐五档几何，使用独立图片与规格，不跨季混用。HEAD 26/27 官方商品页还确认 Expert、On Piste、Superfast、Short Radius、Rebel Camber、Graphene、Titanal 与 EMC；100% camber/0% tip-tail rocker 仅按页面选中的 150 cm 记录。26/27 的 165/170 cm 半径在少数零售资料间有 12.8/12.9 m 与 13.6/13.7 m 差异，已保留来源冲突说明。25/26 美国裸板 MSRP USD 1,125 折算 CNY 7,529.31；加拿大含 FREEFLEX 14 GW 套装 CAD 1,359 折算 CNY 6,396.73（查询时缺货）；26/27 摩纳哥官方裸板报价 EUR 1,310 折算 CNY 9,815.18。均为地区参考而非中国售价，套装与裸板价格分开。详见[数据补充](docs/滑雪数据补充-2026-10-15.md)、[25/26 原始证据](data/raw/skis/head/e-sl-pro-313235-2025-26.json)与[26/27 规格证据](data/raw/skis/head/e-sl-pro-313236-product-page-2026-10-15.json)。

单板尺码表优先使用该型号对应雪季的官方资料；无法取得厂商原页时，明确标注复录厂商数据的零售商来源。已补入 Jones Hovercraft 2.0 2026/27 六档规格及对应雪季的官方代理商图片；Hasco 官方订单表确认日本代理商品番 69126021、六个尺码和含税建议零售价 127,600 日元，Jones 全球页面显示的 J.26 SKU 与该品番暂无直接映射证据。双板新增 HEAD Easy Joy 2026/27（315656）五档规格和官方图片，不与 25/26 EASY JOY R 租赁款（316485）混用。HEAD Easy Joy R 25/26 已确认 316485，163 cm 为官方参考几何、158 cm 有同货号零售几何，韩国同货号页面补充 148/153 cm 半径；Snowleader 零售表另补 143 cm 117/70/103 mm、R9.6，但未直显 HEAD article，作为补充数据保留来源限制。Salomon QST 92（L47232400）和 QST 98（L47232300）现以 2023/24 历史档案发布，尺码表来自 Salomon 编制的该季日本目录；价格分别标注为日本零售挂牌和停售后的官网历史参考，不代表在售状态或中国售价。HEAD Shape V2 2025/26（315285）增加 Tanabe Sports 中文页折算参考价 CNY 1,880.39，原促销价 JPY 44,500；各尺码库存和跨境费用需另核，非中国售价。HEAD Shape V2 R 2025/26（316225）已核 156/163 cm 零售规格及 170 cm 官方参考值，170 cm 半径 12.4/12.5 m 冲突继续保留；142/149/177 cm 仍无同货号逐码证据。完整覆盖、来源限制和后续工作见 [滑雪数据深化记录](docs/滑雪数据深化-2026-10-14.md)、[Easy Joy R 25/26 证据](data/raw/skis/head/easy-joy-r-2025-26.json)、[Shape V2 R 25/26 证据](data/raw/skis/head/shape-v2-r-2025-26.json)、[Shape V2 25/26 价格证据](data/raw/skis/head/shape-v2-2025-26-price.json)、[QST 92/98 旧季证据](data/raw/skis/salomon/qst-92-and-98-2023-24.json)、[Hovercraft 2.0 26/27 证据](data/raw/snowboard/jones/hovercraft-2-0-2026-27.json)、[单板尺码补充清单](data/raw/snowboard/completion-2026-10-14/verified-size-tables.json)、[Mountain Twin J.26 尺码证据](data/raw/snowboard/jones/mountain-twin-2025-26.json) 与 [HEAD Easy Joy 26/27 证据](data/raw/skis/head/easy-joy-2026-27.json)。

HEAD Easy Joy R 25/26 已确认货号 316485，HEAD 手册给出 163 cm 参考几何 117/70/103 mm、R13.3；同货号零售页另列 158 cm 为 124/69/105 mm、R10.7，韩国零售页列出 148/153 cm 的 R9.3/R10.1（未给这两码板型三围）。Winter Sports 新西兰页面进一步确认 316485 包含 143 cm 选项，但未列该码几何；Snowleader 的 143 cm 117/70/103 mm、R9.6 仍作为零售商补充值，不当成原厂逐码确认。Winter Sports 页面价格币种未核实，不作折算。标准零售版 Easy Joy 31565501 不映射至租赁款。价格参考与来源限制见 [Easy Joy R 25/26 证据](data/raw/skis/head/easy-joy-r-2025-26.json)。

双板 Salomon QST 92、QST 98 已按匹配 SKU 归档为 2023/24 旧款，各补入四个长度的几何、半径和单只重量；不能用作新季同名型号的规格。目录来源可用性和 SKU 判断见 [QST 92/98 旧季证据](data/raw/skis/salomon/qst-92-and-98-2023-24.json)。

Salomon QST 94 的德国官方逐码表确认 156–188 cm 全部规格及整双净重；Tanabe 试乘页的 188 cm 单只重量与官方整双重量冲突，已排除。美国/德国官方页对适用水平分别标“中级”与“进阶”。美国官方裸板折算 CNY 5,019.21；德国官方裸板 EUR 550 折算 CNY 4,120.88。2026/27 雪季依据来自型号货号与标注 2027 的区域零售页交叉核验，官方商品页本身未标雪季。详见[规格、地区价格与雪季审计](data/raw/skis/salomon/qst-94-2026-27.json)及[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

QST 92/98 已补入 Salomon 官方 CDN 的货号匹配商品图。QST 92 另按 Alpen 日本零售页 176 cm 单板挂牌价 ¥59,900 折算 CNY 2,530.02；该页有库存取消限制，非中国售价。QST 98 的 Tanabe 日本促销页当前缺货，仅作旁证，种子保留官方历史价。图片授权与报价限制见[原始证据](data/raw/skis/salomon/qst-92-and-98-2023-24.json)。

Atomic Bent Chetler 120 2025/26 的自由地带雪具连锁商品页挂牌价已于 2026-10-15 复核为 CNY 7,998，另列 CNY 100 运费；固定器是否包含、库存与实际成交仍待商家确认。详见[价格复核记录](docs/滑雪数据补充-2026-10-15.md)与[原始来源证据](data/raw/skis/atomic/bent-chetler-120-2025-26.json)。

HEAD Shape e-V5 2025/26（315255）补入 Tanabe Sports 中文页折算参考价 CNY 2,480.43，原促销价 JPY 58,700；库存、汇率和跨境配送费用需另核，非中国国内售价。见 [Shape e-V5 25/26 价格证据](data/raw/skis/head/shape-e-v5-2025-26-price.json)。

Jones Mercury 固定器 2025/26 增加日本官方代理商 Hasco 含税建议零售价折算参考 CNY 2,700.80（JPY 63,800；ECB 2026-10-13 参考汇率）。不是中国现售价格；跨境成本未计。见 [固定器价格证据](data/raw/snowboard-binding/jones-mercury-binding-2025-26-price.json) 和 [固定器尺码与价格记录](docs/固定器尺码深化-2026-10-14.md)。

Burton Freestyle、Cartel、Cartel X 与 Genesis Re:Flex 固定器 2026/27 新增日本官方店标价折算参考，分别为 CNY 1,022.15、1,951.37、2,230.14、2,787.67（ECB 2026-10-14 汇率）。均非中国售价，税费和跨境成本需另核。Cartel Re:Flex 在京东可检索到商品名和 105391 货号，但当前可读取页面没有显示人民币金额；不能把日本店 JPY 46,200 误标为中国售价。型号码及分款证据见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)。

CAPiTA D.O.A. 2025/26 的价格复核找到日本零售商 25/26 价目 PDF：16 个常规与宽版尺码均列 JPY 81,000，标注为未税建议价且文件在 2025-01-15 更新。它是日本历史参考，不能替代中国售价，也不能验证种子现有 CNY 5,299；该人民币价格继续标记为来源与日期未核。详见[价格审计记录](data/raw/snowboard/capita-doa-2025-26-japan-price-2026-10-14.json)。

CAPiTA D.O.A. 2026/27 已按日本官方店 JPY 89,100 更新人民币折算参考为 CNY 3,763.36（ECB 2026-10-14 汇率）；页面列出 16 个标准与宽版尺码。税费口径未明，跨境运输与进口费用未计；该值不是中国售价。见[价格证据](data/raw/snowboard/capita-doa-2026-27-japan-price-2026-10-14.json)。

CAPiTA Aeronaut 2026/27 原人民币参考价 CNY 4,896 无可回查来源，已于 2026-10-15 按美国官方 USD 679.95 与 ECB 10 月 14 日汇率修正为 CNY 4,550.71；日本 Murasaki Sports 同型号 JPY 107,800 含税价折算约 CNY 4,553.20，作为交叉核对。两者都是海外价格参考，不是中国售价。见[Aeronaut 价格审计](data/raw/snowboard/capita-aeronaut-2026-27-price-2026-10-15.json)和[本轮数据补充](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA Kazu Kokubo Pro 2026/27 原人民币参考价 CNY 4,896 无可回查来源，已按美国官网 USD 679.95 和 ECB 2026-10-14 汇率修正为 CNY 4,550.71；日本 Moriyama Sports 同款 JPY 107,800 含税折算约 CNY 4,553.20，作交叉核对。以上为海外价格参考，不是中国售价。详见[Kazu Kokubo Pro 价格审计](data/raw/snowboard/capita-kazu-kokubo-pro-2026-27-price-2026-10-15.json)及[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA Mega Death 2026/27 原 CNY 8,640 缺少可回查依据，已用 CAPiTA 日本官方 JPY 165,000 折算参考 CNY 6,969.18；美国官网同款折算 CNY 8,030.93，地区价差单独记录。两者均非中国售价。详见[Mega Death 价格审计](data/raw/snowboard/capita-mega-death-2026-27-price-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA Mega Merc 2026/27 原 CNY 7,200 无可回查依据，已按 CAPiTA 日本官网 JPY 154,000 折算为 CNY 6,504.57；美国官网折算 CNY 6,692.39，作为独立地区对照。均非中国售价。详见[Mega Merc 价格审计](data/raw/snowboard/capita-mega-merc-2026-27-price-2026-10-15.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA Super D.O.A. 2026/27 原 CNY 5,760 无可回查依据，已按日本官网 JPY 132,000 折算为 CNY 5,575.34；美国官网 USD 799.95 折算为 CNY 5,353.84，作为地区对照。均非中国售价。详见[Super D.O.A. 价格审计](data/raw/snowboard/capita-super-doa-2026-27-price-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA The Black Snowboard of Death 2026/27 原 CNY 5,400 无可回查依据，已按日本官网 JPY 117,700 折算为 CNY 4,971.35；美国官网折算 CNY 5,019.21，作为地区对照。均非中国售价。详见[价格审计](data/raw/snowboard/capita-the-black-snowboard-of-death-2026-27-price-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA The Matriarch 2026/27 原 CNY 5,256 无可回查依据，已按日本官网 JPY 108,900 折算为 CNY 4,599.66；美国官网同款折算 CNY 4,885.35，地区价差单独记录。均非中国售价。详见[The Matriarch 价格审计](data/raw/snowboard/capita-the-matriarch-2026-27-price-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Burton Mission、Step On 与 Step On Genesis Re:Flex 固定器 2026/27 新增日本官方店人民币折算参考，分别为 CNY 1,626.14、1,811.99、2,787.67（ECB 2026-10-14 汇率）。Step On 两款仅兼容 Burton Step On 雪鞋；均非中国售价。型号码、尺码库存快照及证据链接见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)。

Burton 女款 Step On Re:Flex 2026/27（172841）使用独立女款尺码表，不能套用男款范围。日本官方店 JPY 42,900 折算 CNY 1,811.99；Murasaki Sports 对 Black/S 的 26-27 预售页同价，预计 2026 年 11 月至 12 月下旬到货，按预订而非现货记录。虎窝淘另有 CNY 2,598 国内候选价，但购买跳转未能抵达原始天猫页；最新索引还显示原售价 CNY 0、年销量字段 10（此前快照为 12），因此优惠幅度、变体价格和结账金额都未核。京东索引出现同款 SKU 1728416FBJRG 的 S/M 变体快照，但价格与库存不可读。以上都不标作已确认中国售价。见[女款价格与尺码证据](data/raw/snowboard-binding/burton-step-on-re-flex-womens-2027-japan-price.json)及[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

Burton Lexa X EST 女款固定器 2026/27（222331）新增日本官方店 JPY 52,800 折算参考 CNY 2,230.14（ECB 2026-10-14）；S、L 码核验时售罄。EST 仅适用于 Burton The Channel；该价格不是中国售价，跨境费用另计。见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)。

Union Force、Atlas、Atlas Pro 与女款 Ultra 2026/27 新增 Union 日本官方商店含税标价折算参考，分别为 CNY 1,951.37、2,276.60、2,927.05、1,997.83（ECB 2026-10-14）。官方页面核验时均显示售罄；均非中国售价，运费结账计算，跨境费用未计。见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)。

Union Force Classic、Legacy 与女款 Trilogy 2026/27 新增日本官方商店含税标价折算参考，分别为 JPY 41,800 / CNY 1,765.53、JPY 42,900 / CNY 1,811.99、JPY 46,200 / CNY 1,951.37（ECB 2026-10-14）。页面核验时均显示售罄；均非中国售价，跨境运输与进口费用未计。价格证据及库存快照见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)。

Nitro 9 款 2027 固定器补入欧洲官方归档报价的人民币折算参考；EUR/CNY 7.4890（ECB 2026-10-13），官方当前页重查时未显示价格且归档变体售罄，不能视作中国现价。逐款来源和换算限制见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)及[价格证据索引](data/raw/snowboard-binding/nitro-eur-price-conversions-2026-10-14.json)。FLUX DS、GS、XF、XV 补入历史官方 CNY Offer 区间，同时保留当前日本店日元挂牌/促销价与雪季标注；两套币种的地区切换关系未获官网说明，CNY 价格是历史官方报价快照，不代表中国现价。详见[固定器数据记录](docs/固定器尺码深化-2026-10-14.md)和[FLUX 价格核对记录](data/raw/snowboard-binding/flux-price-market-reconciliation-2026-10-14.json)。

Burton Custom Camber、Good Company Camber 与女款 Talent Scout 2026/27 补入 Burton 日本官方店挂牌价折算参考，分别为 JPY 107,800 / CNY 4,553.20、JPY 66,000 / CNY 2,787.67、JPY 74,800 / CNY 3,159.36。型号代码均对应 27WIN；页面未明确税费口径，个别尺码显示售罄。折算值非中国售价，跨境费用未计。证据：[Custom Camber](data/raw/snowboard/burton-custom-camber-2027-japan-price.json)、[Good Company](data/raw/snowboard/burton-good-company-camber-2027-japan-price.json)、[Talent Scout](data/raw/snowboard/burton-talent-scout-2027-japan-price.json)。

Burton Custom Camber 2026/27 出现一条国内 CNY 5,998 价格候选，虎窝淘称其来源为天猫 BURTON 官方旗舰店；但商品标题把 106881 Camber 与 107071 Flying V 并列，且没有原始天猫变体页，故尚不录为中国售价。种子仍显示日本官方价折算参考 CNY 4,553.20。详见[中国价格审计](data/raw/snowboard/burton-custom-camber-2027-china-price-audit.json)和[价格缺口快照](docs/滑雪数据缺口-2026-10-15.json)。

Burton Custom Camber 2026/27 由日本官方页及 MOVE Select 的精确款号零售页交叉核实为 JPY 107,800；MOVE 页面当日显示 150/156 cm 余量少、154/158/162 cm 缺货。此为日本地区参考，国内京东详情仍无可读人民币价格；授权和后续库存均未独立核实。见[审计记录](data/raw/snowboard/burton-custom-camber-2027-china-price-audit.json)。

Atomic Redster Q7、Q7.8、Q9、Q9.8 2026/27 按日本官方店对应货号补入含税挂牌价折算参考：Q7/Q7.8 为 JPY 142,890 / CNY 6,035.31，Q9/Q9.8 为 JPY 199,980 / CNY 8,446.64（ECB 2026-10-14）。页面均显示线上不可购买、需查询线下门店；折算不是中国售价，跨境费用未计。官网商品页没有直接标注雪季，2026/27 年份通过相同型号和货号的多家零售商品页交叉核对。各款价格及雪季证据见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)。

Atomic Redster Q7 Revoshock C 2026/27（AASS03788）另补入美国官网同货号价格对照：选中 160 cm 时为 USD 1,030（未税），按 ECB 2026-10-14 汇率折合 CNY 6,893.50。该页当时显示余 2 件且不支持国际配送；仅作美国地区参考，日本含税价仍为主参考，均非中国售价。详见[美国价格审计](data/raw/skis/atomic/redster-q7-2026-27-us-price.json)。

Nordica 6 款 2026/27 双板补入美国零售挂牌价人民币折算参考：Enforcer 89/94/99/104、Santa Ana 102、Unleashed 98，折算 CNY 5,019.47–6,023.38，按 ECB 2026-10-14 USD/CNY 交叉汇率约 6.69272。价格来自 SkiEssentials/evo 零售页，不是品牌 MSRP 或中国售价；Unleashed 98 现已发布，目录和官网交互页半径差异已记录。逐款价格、货号及来源见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)和[Nordica 价格证据](data/raw/skis/nordica-2026-27-us-prices-2026-10-14.json)。

Salomon 8 款双板补入官网价格折算参考：6 款官网列价型号为 CNY 5,019.21–6,023.11；QST 92、QST 98 已作为匹配货号的 2023/24 历史档案发布，停售状态和历史价格限制均有标明；Stance 84 R 的季节仍未确认，继续保留 draft。详见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)、[Salomon 价格证据](data/raw/skis/salomon-official-prices-2026-10-14.json)和[QST 92/98 旧季证据](data/raw/skis/salomon/qst-92-and-98-2023-24.json)。

Atomic 5 款 Redster 2025/26 固定器套装与 Bent 100、HEAD 3 款双板补入地区价格折算参考。Atomic Redster 价格依货号记录零售 UVP/挂牌参考；Bent 100 与 Supershape e-Magnum 的页面未确认雪季，保留现有年份限制；e.SLR 采用 article 313365 同季零售报价。e-SL Pro 已根据 HEAD 目录修正 313235/313236 的雪季对应。明细见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)和[Atomic/HEAD 价格证据](data/raw/skis/atomic-head-price-evidence-2026-10-14.json)。

Atomic Redster Q7 2025/26（AASS03668）以及 Q7.8（AASS03666）、Q9（AASS03664）、Q9.8（AASS03662）已更换为同季、同货号的零售页图片并纳入本地公开目录；所有图片展示授权仍待确认。四款图片来源和错季图货号记录见[Q7 图片核对](data/raw/skis/atomic/redster-q7-2025-26-image-audit.json)及[Q 系列图片核对](data/raw/skis/atomic/redster-q-series-2025-26-image-audit.json)。

Rossignol Soul 102、Hero Master LT R22、Hero Elite LT TI 与 Forza 60 TI KONECT 补入美国官网价格折算参考，分别为 CNY 5,353.84、9,570.25、9,034.84、6,692.39。前三款页面标注 FW2627；Forza 60 的雪季后由 Rossignol 斯洛伐克官方商城 RAOPS01 26/27 套装条目补证。另补 Experience 76 Xpress（RAMFT04000）美国官网 USD 479.95，按 ECB 汇率折算 CNY 3,212.17；页面未标雪季，且固定器选项需以结账配置为准。裸板与系统板配置及境外价格边界分开记录，均非中国售价。详见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)、[Forza 60 TI 来源与地区价格审计](data/raw/skis/rossignol/forza-60-ti-2026-27.json)和[Rossignol 美国官网价格审计](data/raw/skis/rossignol-us-prices-2026-10-14.json)。

2026-10-15 雪季复核后，将 Rossignol Forza 60° TI KONECT（RAOPS01000）和 Salomon Stance 84 R（L45457300+）从草稿发布到本地目录。Forza 先由年度测试及同型号零售页交叉确认，后又找到 Rossignol 斯洛伐克官方商城同款系 RAOPS01 + NX 12 的 26/27 条目；现同时记录美国无固定器参考价和欧洲含固定器套装价。Stance 84 R 由 2027 延续款测试和同名套装零售页交叉确认。随后纠正 Atomic Bent 100 的 SKU 年款冲突，将 AA0030952 改归 2026/27 并发布；HEAD EASY JOY R 仍因缺少四档逐码规格而保留草稿。本地快照当前共 292 款，其中双板 39 款。此更新没有部署线上。见[本轮数据补充记录](docs/滑雪数据补充-2026-10-15.md)、[Forza 60 TI 雪季与价格证据](data/raw/skis/rossignol/forza-60-ti-2026-27.json)、[Stance 84 R 年款核验](data/raw/skis/salomon/stance-84-r-current-page-audit-2026-10-14.json)与[Atomic Bent 100 26/27 证据](data/raw/skis/atomic/bent-100-2026-27.json)。

同日复核发现 Atomic Bent 100 的旧档案把 26/27 货号 AA0030952 与 25/26 标题混用；25/26 对应货号是 AA0030694。现已将 AA0030952 记录归正为 2026/27，并保留官方商品页未直接标雪季、美国未税价与其他地区价不同等限制。HEAD EASY JOY R（316485）已更正货号与参考几何；未用相近货号补齐其余尺码。见[Atomic Bent 100 26/27 证据](data/raw/skis/atomic/bent-100-2026-27.json)和[本轮数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

后续货号核查将 HEAD Supershape e-Magnum 从误标的 2025/26 更正为 2026/27：当前规格与官方图片为 article 313306.SET，HEAD 26/27 手册列 article 313306；25/26 对应 313305。补齐 149/156/163/170/177 cm 五档三围与半径，170 cm 与 HEAD 手册参考值一致。后续按 HEAD 官方页补入 Advanced、On Piste、Fast、Medium Radius、Speedrocker 和 Crossforce Carbon；149 cm 页面读数为 6% tip rocker / 94% camber / 0% tail rocker。地区商品页的绑定图片/选项不同，不能假设固定器配置全球一致；2307 g 的重量口径仍待核。当前本地快照总数仍为 292 款、双板 39 款；未部署线上。见[HEAD e-Magnum 26/27 证据](data/raw/skis/head/supershape-e-magnum-2026-27.json)。

Rossignol Forza 40° CA Xpress 按德国官方 FW2627 裸板 EUR 540 折算为 CNY 4,045.95；Forza 50° CAM KONECT 按美国官方 USD 899.95 折算为 CNY 6,023.11。Forza 50 页面未标雪季，价格不用于确认档案年份。双板人民币参考价覆盖 40/40 款；HEAD Easy Joy R（316485）记录海外挂牌折算 CNY 2,240.76，页面不可购买且非中国售价。逐款配置、来源与限制见[双板数据记录](docs/滑雪数据深化-2026-10-14.md)和[Forza 价格证据](data/raw/skis/rossignol-forza-price-evidence-2026-10-14.json)。

Burton Photon BOA 雪鞋 2026/27（150861）曾以 Burton 日本官方店 JPY 69,300 折算 CNY 2,933.63，使用 ECB 2026-10-13 参考汇率；此值现保留为日本地区对照，不是中国售价。当前中国零售挂牌参考见下方更新记录；完整对照见 [Photon BOA 价格证据](data/raw/snowboard-boot/burton-photon-boa-2027-japan-price.json)。

Burton Photon BOA 2027 日本官方页以 `27WIN-150861` 确认 Wide 选项；Burton 官方宽版指南明确把“同尺码 Regular 外壳 + 前掌/中足连接处弹性氯丁橡胶鞋胆面板”作为所有 Burton Wide 雪鞋的通用结构规则。日本零售页又以 26/27、Wide、Chinchilla Gray 和型号 `150861` 列出该变体的 JPY 69,300 价格及单店尺码库存快照；这不是中国价格或品牌全球尺码表。Photon 专属鞋楦宽度和脚背容积仍未公布。选码建议按脚测量、充分试穿并检查锁跟。见[Photon 宽版适配审计](data/raw/snowboard-boot/burton-photon-boa-2027-width-audit-2026-10-15.json)、[价格与零售变体记录](data/raw/snowboard-boot/burton-photon-boa-2027-japan-price.json)和[雪鞋种子](data/snowboard-boot/burton-photon-boa-2027.yaml)。

Nitro Team TLS 2027 与 Team TLS Wide 2027 逐款关联到原厂常规版/宽版商品页；德国官方 26/27 页面称 Wide 版贴合比标准版宽 4 mm，但未说明测量部位、方法或尺码差异，因此不作为逐码鞋楦、鞋壳或鞋胆实测值。脚背容积仍未公布。见[原厂脚型审计](data/raw/snowboard-boot/nitro-team-tls-wide-2027-fit-audit-2026-10-15.json)、[Team TLS](data/snowboard-boot/nitro-team-tls-2027.yaml)及[Team TLS Wide](data/snowboard-boot/nitro-team-tls-wide-2027.yaml)。

Nitro Team Pro 2027 固定器官方尺码区间复核后，S/M 与 M 均覆盖 US 男 7–10，尺码表不是唯一映射或试装保证。Nitro 同页给出品牌响应 8/10、舒适 9/10，并建议中级至职业滑手用于公园、跳台、技术动作、全山自由式和比赛；这是厂商自评与定位，不是独立实测。建议按实际雪鞋试装检查底盘承托、鞋头/后跟居中、绑带与梯带余量；当前各尺码库存未确认。见[固定器种子](data/snowboard-binding/nitro-team-pro-binding-2027.yaml)与[尺码适配审计](data/raw/snowboard-binding/nitro-team-pro-binding-2027-fit-audit-2026-10-15.json)。

Nitro Phantom+ 与 Team 2027 补入官方响应/舒适评分及使用场景：Phantom+ 为 9/10、10/10，品牌面向中级至专家级并强调刻滑、技术地形和高速自由滑；Team 为 7/10、9/10，面向中高级并列出刻滑、自由式、粉雪与雪场日常滑行。均为品牌自评，不是独立实测，评分没有公开测试口径。详见[产品种子](data/snowboard-binding/nitro-phantom-plus-binding-2027.yaml)、[Team 种子](data/snowboard-binding/nitro-team-binding-2027.yaml)和[官方评分审计](data/raw/snowboard-binding/nitro-binding-brand-scores-2027-2026-10-15.json)。

Burton 2027 九款固定器补录原厂地形定位：Cartel、Genesis、Mission 与三款 Step On 归为全山地；Cartel X 记录全山地/自由式/自由滑，Freestyle 记录全山地/自由式/自然地形，Lexa X 对应刻滑/自由滑。标签依商品描述归一化；原厂只提供“Happy Medium”或“Stiff & Aggressive”等定性脚感，没有统一数字评分，因此没有换算成数值。详情见[固定器种子目录](data/snowboard-binding)、[Burton 原厂用途审计](data/raw/snowboard-binding/burton-bindings-use-case-audit-2026-10-15.json)及[原厂商品页](https://www.burton.com/en-us/products/mens-burton-cartel-x-re-flex-snowboard-bindings-222301)。

Burton 2027 固定器尺码边界复核：普通 Re:Flex 男靴 US 8 重叠 S/M、US 10–11 重叠 M/L；女靴 US 9 和 11 也分别重叠相邻码。Lexa X EST 女靴 US 6、8 及男靴 US 7 落在重叠区。男女 Step On 表不重叠，但必须配对应性别的 Step On 雪鞋；Burton 与 Nitro 女款 Step On 鞋靴已按原厂资料建档，购买时仍需按固定器尺码表核验。见[固定器尺码审计](data/raw/snowboard-binding/burton-binding-size-overlap-audit-2026-10-15.json)、[缺口记录](docs/滑雪数据缺口-2026-10-15.json)和[Burton 女款 Step On 官方页](https://www.burton.com/en-us/products/womens-burton-step-on-re-flex-snowboard-bindings-172841)。

Nitro Venture Pro TLS Wide 2027 作为独立宽版型号加入雪鞋目录：官方称其前掌额外空间，同时保留中等硬度、全山地支撑与响应；尺码范围 US 男 7–14。Nitro 欧洲官方 EUR 399.90 按 ECB 2026-10-14 汇率折合 CNY 2,996.25，非中国售价。官方未提供毫米楦宽差，商品尺码选项也不代表实时库存。见[雪鞋种子](data/snowboard-boot/nitro-venture-pro-tls-wide-2027.yaml)与[来源审计](data/raw/snowboard-boot/nitro-venture-pro-tls-wide-2027-audit-2026-10-15.json)。

Salomon Dialogue Dual BOA 2027 与 Wide 款补充官方宽度交叉核验：常规款标 Regular，Wide 款标 Wide 并称采用适应宽脚的解剖结构；两者均为中等硬度的全地形/自由式型号。FW2026/27 官方日本目录按货号把黑色 Wide 款 L45448100 单列为 Mondopoint 25–30.5 cm，普通颜色列 25–29.5 cm，并列日本含税建议价 JPY 64,900。Salomon 尺码指南的 107 mm 指滑手本人脚宽，不是 Dialogue 男款楦宽或型号阈值；目录也不证明实时库存或鞋楦毫米差。见[脚型审计](data/raw/snowboard-boot/salomon-dialogue-dual-boa-wide-2027-fit-audit-2026-10-15.json)、[常规款](data/snowboard-boot/salomon-dialogue-dual-boa-2027.yaml)和[Wide 款](data/snowboard-boot/salomon-dialogue-dual-boa-wide-2027.yaml)。

Burton Moto BOA 雪鞋 2026/27（131761）补入日本官方店 JPY 35,200 的人民币折算参考 CNY 1,486.76，按 ECB 2026-10-14 参考汇率换算；不是中国售价，税费和跨境费用需另核。见 [Moto BOA 日本价格证据](data/raw/snowboard-boot/burton-moto-boa-2027-japan-price.json)。

Burton Ion BOA 与 Ion Step On 雪鞋 2026/27 分别补入日本官方店 JPY 91,300、JPY 89,100 的人民币折算参考 CNY 3,856.28、CNY 3,763.36（ECB 2026-10-14）；均非中国售价，跨境及税费成本另核。Step On 雪鞋只兼容 Burton Step On 固定器。证据：[Ion BOA](data/raw/snowboard-boot/burton-ion-boa-2027-japan-price.json)、[Ion Step On](data/raw/snowboard-boot/burton-ion-step-on-2027-japan-price.json)。

Salomon Faction BOA、Echo Dual BOA、Malamute Dual BOA 补入美国官方商店折算参考，分别为 USD 279.95 / CNY 1,873.92、USD 469.95 / CNY 3,145.74、USD 499.95 / CNY 3,346.55；按 ECB 2026-10-13 EUR/USD 1.1188、EUR/CNY 7.4890 计算。均不是中国售价，且官方商品页未直接确认档案所标雪季；价格、季节和跨境成本说明见 [Salomon 雪鞋价格证据](data/raw/snowboard-boot/) 与 [本轮滑雪数据记录](docs/滑雪数据深化-2026-10-14.md)。

K2 Maysis、Boundary、Raider、Taro Tamai Snowsurfer RS 的 2027 款官方美国目录价分别为 USD 379.95、349.95、279.95、669.95；按 ECB 2026-10-13 参考汇率折算为 CNY 2,543.30、2,342.49、1,873.92、4,484.50。K2 美国目录明确显示型号年份和价格；人民币值仍只是美国官方商店折算参考，不代表中国售价。对应证据见 `data/raw/snowboard-boot/k2-*-2027-us-price.json`。

Nitro 12 款雪鞋依据官方欧元变体报价补入人民币换算参考，ECB 2026-10-13 EUR/CNY 为 7.4890。Nitro 官方 2026/27 雪鞋目录（2026-10-15 复核）列有全部 4 款 Venture 系列，已据目录上下文确认归档为 2026/27（2027）；其余型号按各自官方商品页/目录证据核验。所有价格仅为欧洲官方商店折算，不是中国售价；代表变体采集时缺货不代表所有尺码库存。逐款及原始变体快照见 [Nitro 价格换算证据](data/raw/snowboard-boot/nitro-eur-price-conversions-2026-10-14.json)和[Nitro Venture 雪季审计](data/raw/snowboard-boot/nitro-venture-boots-2027-season-audit-2026-10-15.json)。

Salomon 雪鞋 7 款补齐美国官方美元报价的人民币折算参考；当前 30 款雪鞋均有目录人民币价格字段。换算使用 ECB 2026-10-13 USD、CNY 参考汇率，不能视作中国售价；Salomon 官方页未直接确认档案雪季。明细、货号和原始快照见 [Salomon 价格换算证据](data/raw/snowboard-boot/salomon-us-price-conversions-2026-10-14.json)。

滑雪服装 6 款完成首轮规格/价格审计。5 款 KAILAS 服装与 1 款 Decathlon 夹克均补上人民币目录参考价及来源；KAILAS/Decathlon 商品页未提供可核实的服装围度表，尺码选项只记录为可选字母码。KAILAS 商品页未确认档案雪季；Decathlon 夹克口袋数量在页面不同区块冲突。明细和限制见 [服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json) 与 [滑雪数据深化记录](docs/滑雪数据深化-2026-10-14.md)。

2026-10-15 复核 KAILAS 官方尺码指南：页面只有鞋、手套和袜子尺码表，没有服装围度表；未把第三方通用 Kailas 外套尺码页套用到 BM45 具体款号。详情见[尺码表来源复核](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

2026-10-15 补齐 8 款 Rome 2026/27 固定器和 8 款 Salomon 固定器的美国官方价格人民币折算参考，并同步种子与前台快照。Salomon 当前型号页未标雪季，价格不用于证明 2026 年款；所有海外折算价均非中国售价。明细、汇率与限制见[Rome 价格证据](data/raw/snowboard-binding/rome-bindings-us-prices-2026-10-15.json)、[Salomon 价格证据](data/raw/snowboard-binding/salomon-us-current-prices-2026-10-15.json)和[本轮滑雪记录](docs/滑雪数据补充-2026-10-15.md)。

Nidecker Orbit 2027 新增美国官网价 USD 279.95 的人民币折算参考 CNY 1,873.63；官网 SKU 为 N.27.BNU.OBS.744.3M.1。价格证据与地区限制见[Orbit 原始记录](data/raw/snowboard-binding/nidecker-orbit-us-price-2026-10-15.json)。

Flow NX2 Hybrid 2027 新增 Nidecker 美国官网价 USD 379.95 的人民币折算参考 CNY 2,542.90；官网 SKU 前缀为 N.27。价格证据与地区限制见[NX2 Hybrid 原始记录](data/raw/snowboard-binding/flow-nx2-hybrid-us-price-2026-10-15.json)。

2026-10-15 补录 FLUX CV 26/27 日本官网含税价折算 CNY 2,323.06、Decathlon SNB 500 加拿大官网当前价折算 CNY 800.18，以及 COSONE 官网首页商品卡价 CNY 2,599。跨境价格均注明地区和汇率；COSONE 详情页/库存未核实，仍保留草稿状态。明细见[三款固定器价格证据](data/raw/snowboard-binding/cosone-decathlon-flux-price-evidence-2026-10-15.json)。

本轮数据缺口盘点：固定器缺价已补至 0；HEAD Easy Joy R 316485 已有海外精确货号挂牌折算参考，但中国人民币售价仍待核。Flow NX2 Carbon 2027 按 Montaz 2026/27 页面促销价折算参考 CNY 2,697.23，并用 Ski West 2027 商品页交叉核对。Jones Mountain Twin 2026 已补入可对应 J.26 的零售商商品图，图片展示权待核；没有用 2027 图替代。详情见[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)、[Flow NX2 Carbon 价格证据](data/raw/snowboard-binding/flow-nx2-carbon-2027-price-2026-10-15.json)及[Mountain Twin 图片来源证据](data/raw/snowboard/jones/mountain-twin-2025-26-image-source.json)。

公开单板的 Jones Mountain Twin 与 Korua Cafe Racer 种子已补 `data_source.origin_url`，并从原型导出链路生成，便于后台来源回溯；Korua 为 carry-over 当前商品页，不据此确认 2026 雪季。

2026-10-15 复核：Korua Cafe Racer 导出后已恢复官方商品图，并保留人民币参考价缺少中国报价的状态；图片展示授权待核。公开滑雪种子共 200 款，单板、固定器、雪鞋、双板、服装的价格、图片和来源字段均有值。自动目录审计因本地 API 不可达未运行；字段盘点依据各类 YAML 种子，尺码表的逐项准确度仍需逐品核验。

同轮核对修正了 4 个价格币种标记：Nitro Banker 2027 由 USD 原值改为日本预售 JPY 123,200 的 CNY 折算参考；Union Force Classic、Legacy、Trilogy 补齐 CNY 标记。地区价与汇率限制记录在各自价格证据中。

KAILAS BM45 PRO 背带裤 KG2541314 已在京东找到同货号商品条目，但可读列表和详情页均未显示人民币价格；拼多多搜索结果使用马来西亚地区货币，不能作为中国售价。继续保留美国官方 USD 580 折算 CNY 3,882.39，并标明非中国报价。见[国内渠道核价记录](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

各品类的选码限制、价格核验口径和本轮变更详见 [滑雪数据深化记录](docs/滑雪数据深化-2026-10-14.md)、[单板三件套内容记录](docs/单板三件套内容完善-2026-10-12.md) 和 [固定器尺码记录](docs/固定器尺码深化-2026-10-14.md)。人民币参考价不自动等同于中国现售报价；购买决策仍应核对销售地区、报价日期与库存。

HEAD Easy Joy R 2025/26 已确认货号 316485，163 cm 参考几何为 117/70/103 mm、R13.3，配置表列 JOY 9 GW SLR 与 78 mm 制动器。标准零售 Easy Joy 31565501 不映射到此租赁 SKU。Catti Sport 对精确货号本轮列价 EUR 249，折算 CNY 1,865.63；线上与店内库存提示不一致，非中国售价。来源见 [Easy Joy R 证据](data/raw/skis/head/easy-joy-r-2025-26.json)。

### 线上同步（2026-10-15）

已将滑雪类目资料同步到生产数据库：更新 210 款现有装备的价格、规格、编辑评分、状态与图片，新增 3 款双板（Atomic Bent 100 2026/27、HEAD Easy Joy 2026/27、HEAD Supershape e-Magnum 2026/27）；Burton 女款 Step On 草稿未创建。社区评分、评论、收藏和用户资料未改。旧数据库中两个已撤下种子的商品记录保留，未执行删除。IP 内测站与域名站均已切换到新构建；生产备份、预览与核对记录见[本次发布记录](deploy/snow-data-sync-20261015.md)。

2026-10-15 随后完成本地数据契约整理：滑雪 5 个类目中的价格来源、汇率审计、雪季依据和服装尺码等字段已加入 `spec_schema`；纯核验字段通过 `display: false` 留在数据与后台审计中，并从 API 参数响应及种子生成的离线目录快照中过滤。最新全量校验为类目 130、品牌 59、产品 302，全部通过；`pnpm --filter @youpu/api audit:spec-fields` 审计 302 款，未发现未声明规格字段。生产数据库的类目模板尚未同步这次契约修复；用户未要求本轮部署，因此线上仍是此前发布的版本。线上公网域名仍受火山引擎备案接入限制，服务器本机 HTTPS 验证不代表公网可访问。

后续按精确款号复核 KAILAS 女款 BM45 MAX KG2531244 的凯乐石微商城人民币标价 CNY 6,200，将其设为主人民币参考；美国官方 USD 920 折算 CNY 6,158.28 仅保留为地区价格对照。Decathlon 通用男装围度表未被误套为 SNB 500 的款号级尺码数据。详情见[本轮补充记录](docs/滑雪数据补充-2026-10-15.md)及[服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

2026-10-15 继续复查 KAILAS BM45 MAX 男款 KG2531144、KG2531143 与 BM45 PRO 背带裤 KG2541314 的中国人民币价格：目前官方店可读页面没有精确款号对应的可核金额，三款仍只列美国官网折算参考，明确不标作中国售价。细节见[服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

Jones Mountain Twin J.26 原人民币数值 CNY 5,899 缺少可回查来源。现采用 Jones 日本官方站 HASCO 25/26 商品页含税挂牌 JPY 107,800，按 ECB 2026-10-14 汇率折算 CNY 4,553.20；这是日本地区参考价，不是中国售价，且网页未证明具体尺码有货。较早瑞士官方 CHF 579.95 报价及 CNY 4,703.79 折算保留为历史对照。详见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)与[Mountain Twin 原始审计](data/raw/snowboard/jones/mountain-twin-2025-26.json)。

2026-10-15 依据 Nitro 官方 2026/27 雪鞋目录确认 Venture Step On TLS 对应 2026/27（2027）目录款；该型号亦见于 2025/26 经销商手册，不能称为首次上市款。其 CNY 3,668.86 仍是欧洲 EUR 489.90 按 ECB 汇率换算的地区参考价。详见[Nitro 雪季审计](data/raw/snowboard-boot/nitro-venture-step-on-tls-2027-season-audit-2026-10-15.json)。

2026-10-15 复核 Salomon 10 款单板雪鞋：官方 FW2026/27 日本目录与具体货号/配色匹配，确认档案所标 2027 雪季，并补入型号级 Mondopoint 范围及日版建议零售价（含税与未税）。美国官方价折算的人民币主参考保留为美国市场价；日版 JPY 为额外地区报价，不是中国售价。Dialogue Dual BOA Team 是目录中的 Team Grey 配色记录，不当作独立结构型号。详见[Salomon 雪鞋目录审计](data/raw/snowboard-boot/salomon-snowboard-boots-fw2026-27-audit-2026-10-15.json)及[雪季产品目录](https://salomon.jp/pages/snowboard-catalog)。

2026-10-15 更正 OGASAKA CT、FC、SHIN 三款价格状态：产品页已确认日本含税挂牌价；CT 156、FC 157、SHIN 160 的 CNY 4,856 / 5,370 / 5,137 为 2026-10-02 历史汇率估值。它们不是中国售价，也没有据此推断当前库存。详见[价格换算审计](data/raw/snowboard/ogasaka/official-japan-prices-2025-26-2026-10-15.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

- [docs/有谱-技术设计方案.md](docs/有谱-技术设计方案.md) —— 架构、选型、数据模型、推荐引擎、埋点、安全、SEO
- [docs/有谱-数据库表结构设计.md](docs/有谱-数据库表结构设计.md) —— 全量表结构与索引设计
- [docs/M2-内容层接API准备.md](docs/M2-内容层接API准备.md) —— 字段映射表、缺口清单、逐页接入步骤、已决策记录
- `原型/` —— 前端设计原型（视觉与交互的对照基准）

## 当前状态

- ✅ **M1 脚手架**：pnpm monorepo / 22 张表建表迁移（含 ltree、分区表、部分索引）/ seed 管线（数据质量闸门）/
  埋点全链路 / outbox worker（4 类事件消费者）/ 健康检查
- ✅ **前端**：原型全部页面与交互落地，typecheck + 生产构建 + Chrome 端到端检查通过（无 hydration 报错）
- ✅ **SEO 技术包**（§14.2）：标题/描述模板、canonical 纪律、JSON-LD（Product/AggregateRating/BreadcrumbList/ItemList）、
  sitemap.xml、robots.txt、noindex 白名单，详情页静态预渲染
- ✅ **生产前台与 API 已部署**：2026-09-30 发布静态前台；域名、`/admin/`、`/api/health` 返回 200，API 健康状态为 DB/Redis 正常、ES 未启用。迁移已全部应用。
- ✅ **备份恢复演练**：已创建生产 PostgreSQL 自定义格式备份并在隔离数据库完成恢复验证；服务器自动/异地备份尚未配置。
- ✅ **M2 准备**：spec_schema 对齐原型字段集、15 款原型内容可一键导出为 seed，另有 3 款通过采集器自动通过并通过校验、
  API 响应契约进 `packages/schema`、四项产品决策落地（板型族枚举、编辑评分独立列 `product.editorial_scores`、
  综合指数实时计算、价格区间实时算分位）
- ✅ **当前分支已落地**：认证、前台 API 内容模式、全局搜索筛选、问卷推荐、社区评价闭环和后台审核
- ✅ **社区评价与审核闭环**：评分、评论回复、收藏、帮助反馈、站内通知、举报处理已接入；后台支持风险原因中文展示、非空审核处理人、评分/回复状态审核，以及审核与审计事件的事务一致性
- ✅ **后台管理**：`apps/admin` 已提供数据分析总览、产品 / 品牌 / 类目 CRUD、草稿 / 发布、`spec_schema` 驱动参数表单、
  内容审核、社区评论举报审核、采集资料待审核队列、操作审计和多账号权限；账号登录支持访问令牌自动续期，旧 Bearer 令牌仍可作为迁移入口。采集 YAML 支持批量上传、来源与规格校验；新增商品确认后先入草稿，已有商品只应用审核通过的规格差异。
- ✅ **后台数据分析增强**：总览与数据分析页已提供访客趋势、产品浏览漏斗、搜索 / 推荐 / 社区参与度指标、路径和热门产品分析；热门产品同时支持 UUID 与 slug 关联
- ✅ **全局搜索与筛选**：`/search` 页面、`GET /api/search`、PostgreSQL 搜索兜底、可选 Elasticsearch 中文分词、URL 筛选状态和内容包回退已完成
- ✅ **2026-09-18 本地验收基线**：在 `codex/admin-information-architecture` 分支的 `fee8f19` 基线上，API 健康测试 3/3、前端聚焦测试 20/20、全工作区类型检查和 schema/API/web/admin 生产构建均通过；本地 3000/3001/3002 服务均返回 200
- ✅ **本地全栈验收**：Docker 基础设施、迁移、seed、API / 用户端 / 后台三服务联调已完成；Elasticsearch 仍为可选增强依赖。
- ⏳ **正式开放前**：指定并验证首个管理员账号；用真实浏览器走通注册/登录、搜索、评论与后台审核；配置自动且异地保存的数据库备份；向站长平台提交 sitemap。ES 未启用是当前资源约束下的已知取舍；客观分析和 M4 运营功能属于后续迭代。

## 滑雪数据持续核验

2026-10-15 Rossignol Forza 50° CAM KONECT 补入 25/26 目录与 26/27 官方延续销售依据；美国官网逐码重量与目录无固定器双只重量明显冲突，因此重量继续待核、未录入参数。详见[Forza 50 逐码审计](data/raw/skis/rossignol/forza-50-cam-2025-26.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 Rossignol Forza 40° CA Xpress 2026/27 补入五档双只重量零售表，逐行注明与官方重量字段的冲突及固定器口径未明；未将其标成裸板重量。详见[Forza 40 重量审计](data/raw/skis/rossignol/forza-40-ca-xpress-2026-27-weight-audit.json)。

迪卡侬 SNB 100、All Road 900、Park & Ride 500 的海外价格折算与中国市场核验记录见[迪卡侬单板价格核验](./docs/迪卡侬单板价格核验-2026-10-15.md)。折算人民币仅为海外报价参考，不代表中国售价。

HEAD Easy Joy R 2025/26 新增精确货号 316485 的 158 cm 规格和欧洲零售价格折算参考；其他缺失尺码仍待准确来源。见[双板尺码补充](./docs/HEAD双板尺码补充-2026-10-15.md)。

2026-10-15 后续复核：Easy Joy R 316485 新增韩国零售页的 148 cm R9.3、153 cm R10.1 半径，以及 KRW 547,000 套装价折算参考 CNY 2,738.58；未提供这两码的板型三围，143 cm 仍待核。Shape V2 R（316225）仍缺 142/149/177 cm 的精确逐码数据。迪卡侬 All Road 900 与 SNB 100 找到京东国内零售线索，但公开页没有当前人民币价格，未用于修改种子价格。详见[本轮补充记录](docs/滑雪数据补充-2026-10-15.md)、[迪卡侬价格审计](data/raw/snowboard/decathlon/price-audit-2026-10-15.json)及 HEAD 两款[Easy Joy R](data/raw/skis/head/easy-joy-r-2025-26.json)/[Shape V2 R](data/raw/skis/head/shape-v2-r-2025-26.json)原始证据。

2026-10-15 继续核对 HEAD 国内报价：京东列表出现带货号 316225 的 Shape V2 R + 604357 雪鞋套装，但未展示可核实的当前人民币价格或库存；HEAD 官方旗舰店另有 142 cm 的 V2R/EASY JOY V2 R 混合标题条目，无法确认货号且详情页不可读。Easy Joy R 的相近条目也未能确认 316485。均只记作渠道线索，不据此更新价格。详见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)和 HEAD [Shape V2 R](data/raw/skis/head/shape-v2-r-2025-26.json)/[Easy Joy R](data/raw/skis/head/easy-joy-r-2025-26.json)证据。

迪卡侬 All Road 900 官方页逐尺码列出 154/160/166 cm 的几何、半径、推荐站距、体重范围及单板重量。复核时还确认同页对后移量有 50 mm 与 35 mm 两种说法；种子保留逐尺码表的 50 mm，原始审计记录冲突，未视为已解决。官方页面未标雪季，档案中的 2026 仍是采集快照标签。见[规格与来源核验](data/raw/snowboard/decathlon/all-road-900-current.json)。

迪卡侬 Park & Ride 500 以英国官网 SKU 8938817 核对，四个尺寸的板宽、侧切、建议站距、推荐身高和标称重量现已录入。SNB 100 与 All Road 900 的逐尺码表也补入官方身高范围，并将已核实的各尺寸重量放入参数表；单板尺码行新增“建议身高”字段。三款商品页均未明确生产雪季，档案年份仍代表采集快照，详细证据与限制见[Park & Ride 500 审计](data/raw/snowboard/decathlon/park-and-ride-500-current.json)、[SNB 100 审计](data/raw/snowboard/decathlon/snb-100-current.json)和[All Road 900 审计](data/raw/snowboard/decathlon/all-road-900-current.json)。

HEAD Shape V2 R 316225 新增 Bottero Ski 的 Winter 2026 精确参考号 316225 252 缺货价 EUR 190，按 ECB 2026-10-14 汇率折合 CNY 1,423.58；页面未列固定器货号和尺码，仅作历史地区旁证，不覆盖当前西班牙套装主参考 CNY 2,097.83。142/149/177 cm 逐码几何仍缺。见[Shape V2 R 原始证据](data/raw/skis/head/shape-v2-r-2025-26.json)。

2026-10-15 再查 HEAD Shape V2 R 316225 的逐码规格：Tocik 与 Winter Sports 商品页都列六个长度，但只给 170 cm 的 128/70/108 mm、R12.5 参考值；参数文案相同，不作为两份独立的逐尺码来源。142/149/177 cm 几何缺口不变，未作外推。见[原始证据审计](data/raw/skis/head/shape-v2-r-2025-26.json)。

2026-10-15 新增 HEAD Easy Joy R 316485 俄罗斯零售交叉记录：DFS 页面列 25/26 板货号 316485 + 固定器货号 100953 套装、RUB 33,990、143/148/153/158 cm 变体和分门店库存。页面所列 R9.6 未标对应尺码，未用来补逐码几何；地区报价不是中国价，也未覆盖人民币种子参考。详见[原始核验记录](data/raw/skis/head/easy-joy-r-2025-26.json)和[数据补充文档](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 复查 KAILAS BM45 GTX 滑雪裤 KG2541316：Poizon 精确货号页面的尺码助手在 S 与 L 选中项下显示腰围/臀围建议，但页面未说明测量对象且没有完整尺码表，故只记为待官方确认线索，不录入产品选码参数。六款滑雪服装仍没有可确认的款号级成衣围度表；明细见[服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)和[补充记录](docs/滑雪数据补充-2026-10-15.md)。

KAILAS BM45 全指滑雪手套（KM2562001）补入国内价格参考：天猫官方旗舰店聚合快照正文显示 CNY 1,100 标价、CNY 990 活动价（2026-10-07 至 10-31），但同页元数据仍列 CNY 1,100，保留为 CNY 990–1,100 参考区间。该来源不是天猫原始商品页，活动价、颜色尺码可售性和结账金额仍待直接核实。见[商品种子](data/skiing-apparel/kailas-bm45-full-finger-ski-gloves-2026.yaml)、[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)、[聚合快照](https://tao.hooos.com/goods_kavWQKZSYtaxo82KARtGG5CPtJ-zzQnnasovJRDw5RsJ.html)。

2026-10-15 复核 KAILAS BM45 全指手套官方商品图库，将不同角度图片从 1 张补至 5 张；新增的 4 个官方图库图片地址均通过 HTTP 200 和图片 MIME 检查。来源可追溯，前台展示授权仍待核实。详见[商品种子](data/skiing-apparel/kailas-bm45-full-finger-ski-gloves-2026.yaml)和[图片来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

2026-10-15 复核 KAILAS BM45 高筒滑雪袜官方商品图库，种子图片从 1 张补至 5 张；新增 4 个官方图片 URL 均返回 HTTP 200 和图片 MIME。前台展示授权仍待核实。详见[商品种子](data/skiing-apparel/kailas-bm45-high-cut-ski-socks-2026.yaml)和[图片来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

2026-10-15 扩充 KAILAS BM45 男款 95g 羽绒服（KG2531144）和 BM45 PRO 背带裤（KG2541314）的官方商品图库，分别收录 10 张与 15 张图片。两款共 25 个不同原图地址均返回 HTTP 200、`image/jpeg`；图片展示授权仍待核实。详见[羽绒服种子](data/skiing-apparel/kailas-bm45-max-mens-down-jacket-95g-2026.yaml)、[背带裤种子](data/skiing-apparel/kailas-bm45-pro-ski-bibs-unisex-2026.yaml)及[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

2026-10-15 补齐 KAILAS BM45 MAX 男款 100g 加长羽绒服（KG2531143）和女款 95g 羽绒服（KG2531244）的官方图库，均由 1 张增至 10 张；两款新增 18 个图链全部返回 HTTP 200、`image/jpeg`。同时复核女款凯乐石微商城精确货号 CNY 6,200 标价。男款 100g 仍没有可对应精确款号的中国人民币报价，保留美国 USD 990 折算价作地区参考。图片展示授权待核。详见[男款 100g 种子](data/skiing-apparel/kailas-bm45-max-mens-down-jacket-100g-2026.yaml)、[女款 95g 种子](data/skiing-apparel/kailas-bm45-max-womens-down-jacket-95g-2026.yaml)、[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)和[缺口清单](docs/滑雪数据缺口-2026-10-15.json)。

补充一条 BM45 系列试穿反馈：作者报告身高 165 cm、穿 XS，称 BM45 雪服与雪裤合身；未提供体重、围度、内搭层数或裤款货号。此信息与美国官方裤款 KG2541316 的 S/M/L/XL 选项不一致，仅作为系列级参考，不推导具体 SKU 的尺码建议。来源及限制见[服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)与[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Burton Photon BOA 2027 新增中国零售商 SPADERS 的 CNY 3,998 挂牌参考，型号、雪季与颜色由 Burton 官方 150861 商品页交叉核对；零售页缺货号、尺码和库存信息，故不标为官方价或成交价。京东索引另见 26/27 款号 `1508616E7MWD` 的多个尺码标题，但没有可读人民币价格，不能证明实际可选尺码或库存。原日本官方价折算 CNY 2,933.63 保留为地区对照。详见[雪鞋价格记录](docs/滑雪数据补充-2026-10-15.md)与[原始来源审计](data/raw/snowboard-boot/burton-photon-boa-2027-japan-price.json)。

K2 Maysis 2027 增加日本 Murasaki Sports 的地区零售价交叉参考：含税 JPY 64,900，按 ECB 2026-10-14 汇率折合 CNY 2,741.21；因未列 K2 厂商货号且不能证明可发往中国，仍保留 K2 美国官方折算价 CNY 2,543.30 为主参考。尺码选项不等同于现货。详见[雪鞋价格记录](docs/滑雪数据补充-2026-10-15.md)和[原始来源审计](data/raw/snowboard-boot/k2-maysis-2027-us-price.json)。

K2 Maysis Wide 2027（KB261664）作为独立宽版型号加入目录：K2 官方称鞋壳和鞋胆均比常规 Maysis 宽 7 mm，并列出 US 6–13 尺码及 Freeride、Big Mountain、Freestyle、Powder 用途。7 mm 是同型号相对差值，不是绝对楦宽或跨品牌标准；美国官价 USD 379.95 折算 CNY 2,543.30，非中国售价。来源见[种子](data/snowboard-boot/k2-maysis-wide-2027.yaml)和[原厂适配审计](data/raw/snowboard-boot/k2-maysis-wide-2027-fit-audit-2026-10-15.json)。

2026-10-15 新增 Nordica Unleashed 98 CA 2026/27 双板六尺码规格，目录半径精度、零售双只重量与美国价格折算边界均已记录。详情见[本轮滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)、[种子](data/skis/nordica-unleashed-98-ca-2027.yaml)和[原始审计](data/raw/skis/nordica/unleashed-98-ca-2026-27.json)。

2026-10-15 HEAD Shape V2 R 316225 尺码复核排除了另一份相似款完整几何表：HEAD 俄语区页面的商品货号是 31528501，且 163 cm 尾宽与目标货号来源不同。142/149/177 cm 仍待精确来源，审计记录见[data/raw/skis/head/shape-v2-r-2025-26.json](data/raw/skis/head/shape-v2-r-2025-26.json)。

HEAD Shape V2 R 316225 后续复核在京东发现 25/26 V2 R 149 cm 板+固定器商品线索，但详情页未显示价格、货号或库存；HEAD 旧季 V2 R 租赁手册的 article 为 316223 / 31622402，不能补录到 316225。缺失尺码及来源排除依据见[原始审计](data/raw/skis/head/shape-v2-r-2025-26.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 HEAD Easy Joy 2026/27 的 143 cm 几何已由国际货号 315656.SET 的 HEAD 官方页直接确认；148/153/158 cm 仍依赖地区零售 SKU 31655507，未将两者视为已证实相同。官方页显示 1698 g，但未说明单只或一对重量，故不录入。见[Easy Joy 种子](data/skis/head-easy-joy-2027.yaml)及[原始审计](data/raw/skis/head/easy-joy-2026-27.json)。

2026-10-15 雪鞋图片巡检修复 Salomon Trek 2027 失效封面：旧图片 URL 返回 404，已换成官方图库中货号 `L47033600` 的主图（HTTP 200）。见[种子](data/snowboard-boot/salomon-trek-2027.yaml)和[图片审计](data/raw/snowboard-boot/salomon-snowboard-boots-fw2026-27-audit-2026-10-15.json)。

2026-10-15 图片巡检另修复 Salomon Faction BOA 2027（L49270000）封面：旧图 404，已换成官方精确货号图库的可访问图（200）。见[种子](data/snowboard-boot/salomon-faction-boa-2027.yaml)与[审计记录](data/raw/snowboard-boot/salomon-snowboard-boots-fw2026-27-audit-2026-10-15.json)。

2026-10-15 Jones Mountain Twin 2025/26 以 Jones 日本官方站 HASCO 含税 JPY 107,800 挂牌价，按 ECB 汇率折算 CNY 4,553.20，作为可回查的日本地区价格参考（非中国售价）；原瑞士官方历史价仍保留。见[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)、[商品种子](data/snowboard/jones-mountain-twin-2026.yaml)与[原始审计](data/raw/snowboard/jones/mountain-twin-2025-26.json)。

HEAD Worldcup Rebels e.SLR 2025/26（313365）本轮复核了四档尺寸规格，并记录京东同货号板+固定器六件套的国内价格线索；因商品页不可读且套装含雪鞋配件，不混入雪板+固定器价格。地区价和来源边界见[数据补充](docs/滑雪数据补充-2026-10-15.md)、[e.SLR 种子](data/skis/head-e-slr-2026.yaml)及[原始审计](data/raw/skis/head/e-slr-2025-26.json)。

HEAD Worldcup Rebels e.SLR 2026/27 以新货号 313366 独立建档，核对四档几何、HEAD 官方套装价、韩国预览挂牌参考及对应商品图；与 25/26 的 313365 分季保留。另按 HEAD 官方页补入全木芯、金属、Graphene/Titanal、EMC、Fast 与 Short Radius 等字段；100% camber 和 0% tip/tail rocker 仅对应页面所选 149 cm。官方页面显示的 1995 g 仍因重量口径不明而不作为可比较重量。韩国价格未确认可即时购买，不作为主参考。详情见[数据补充](docs/滑雪数据补充-2026-10-15.md)、[2026/27 种子](data/skis/head-e-slr-2027.yaml)及[原始审计](data/raw/skis/head/e-slr-313366-2026-27.json)。

HEAD Easy Joy R 2026/27 以新货号 `316486` 独立建档，与 25/26 的 `316485` 分季保留。当前仅录入经目录与同季零售页交叉确认的 163 cm 参考几何；其余尺码逐码数据待补。欧洲含固定器套装价按 ECB 汇率折算为人民币地区参考，不代表中国售价。详见[种子](data/skis/head-easy-joy-r-2027.yaml)、[原始审计](data/raw/skis/head/easy-joy-r-2026-27.json)与[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

HEAD Russia 同季页面虽列出 Easy Joy 五档几何，但商品货号是 `31655507`，不是目标 `EASY JOY R` 的 `316486`，目前无货号映射依据，因此没有移植尺码。标注 2026 的另一零售页还在 163 cm 报 R13.1，与 26/27 精确参考 R13.3 冲突。逐码缺口和排除理由见[原始审计](data/raw/skis/head/easy-joy-r-2026-27.json)。

2026-10-15 追加重查 HEAD EASY JOY R 316486 的五个长度几何：原厂目录与同季精确套装页仍只提供 163 cm 参考值；143/148/153/158 cm 无新逐码来源。HEAD 地区页 31655507 的相似数据继续排除，不按相邻尺码推算。见[本次尺码复核](data/raw/skis/head/easy-joy-r-2026-27.json)。

2026-10-15 为 CAPiTA Mega Death 补入 `seasonEvidence`：北美、日本官方商品页均标注 2027，日本官方挂牌价与公开的 26/27 价目表含税换算一致；商品页未直接写明完整雪季日期。价格与季节依据见[商品种子](data/snowboard/capita-mega-death-2027.yaml)、[来源审计](data/raw/snowboard/capita-mega-death-2026-27-price-2026-10-15.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA D.O.A. 2027 补入日本官方人民币折算的直接价格来源、ECB 汇率来源与雪季依据：JPY 89,100 折合 CNY 3,763.36，页面税费口径未明，且 2027 年份归入 2026/27；不代表中国售价。详情见[商品种子](data/snowboard/capita-defenders-of-awesome-2027.yaml)、[原始价格审计](data/raw/snowboard/capita-doa-2026-27-japan-price-2026-10-14.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

CAPiTA Super D.O.A.、The Black Snowboard of Death 与 The Matriarch 补入 2026/27 雪季依据：官方价目表的 26/27 型号与税前价格经加税后匹配日本官方商品页；其中 The Matriarch 商品页标题本身未注明年份，故保留价目表交叉核对依据。日本官方价折算分别为 CNY 5,575.34、CNY 4,971.35、CNY 4,599.66，均非中国售价。来源见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)及三款的[商品种子](data/snowboard/)和原始审计。

CAPiTA Aeronaut、Kazu Kokubo Pro 与 Mega Merc 的种子补入 2027 款依据并归档至 2026/27；官方页面没有直接写明雪季日期。Aeronaut 与 Kazu Kokubo Pro 的美国官方价各折合 CNY 4,550.71，Mega Merc 日本官方价折合 CNY 6,504.57；均为地区参考，不是中国售价。逐款依据见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)和对应商品种子及价格审计。

Burton Custom Camber、Good Company Camber 与 Talent Scout 2027 补入 2026/27 雪季依据：美国官方商品页标题标注 2027，日本官方款色代码带 `27WIN`；页面未直接给出完整雪季日期。日本官方价折算参考均不是中国售价。详情见[数据补充记录](docs/滑雪数据补充-2026-10-15.md)、对应[商品种子](data/snowboard/)及价格审计。

Burton Custom Camber 与 Process Camber 2026 旧档补入 2025/26 年款证据：日本官方页面/官方 W26 资料含 `26WIN` 款色代码。Custom 现有一条人民币店铺挂牌参考；Process 的本地线索仍无法区分 Camber 与 Flying V，价格限制见后续条目和审计。

Burton Custom Camber 2025/26 的人民币主参考更新为中国 SPADERS 店铺所列 CNY 5,998（Custom Glow 与 M Custom Jungle 同价）；页面未公开货号、尺码与库存，按零售挂牌参考记录。Process 同店 CNY 4,998 页面未区分 Camber/Flying V，因此不覆盖 Camber 主价。限制及京东未公开价格的匹配线索见[本轮数据记录](docs/滑雪数据补充-2026-10-15.md)和两款原始审计。

KAILAS BM45 MAX 男款 95g 版 `KG2531144` 的美国官网尺码为 S/M/L，推荐雪道滑行与极寒保暖，未公开款号级尺码表或成衣测量；京东公开索引另有同款号 XXS 变体，未显示对应尺寸或库存，不与美国码换算。详见[本款尺码核验](data/raw/skiing-apparel/kailas-bm45-max-mens-95g-size-audit-2026-10-15.json)、[服装来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)与[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Burton Ion BOA、Ion Step On、Moto BOA、Photon BOA 四款雪鞋补入官方 2027/26-27 雪季依据：商品页标题标注 2027，款号变体带 `27WIN`。Ion Step On 另明确限定配 Step On 固定器。逐款来源与证据边界见[雪鞋雪季审计](data/raw/snowboard-boot/burton-boot-season-crosscheck-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Burton 女款 Step On 雪鞋补齐 Felix、Highshot、Highshot X 三款 2026/27 种子，加入官方女款 US/EU/UK/Mondo 转换和与 Step On 固定器 S/M/L 的逐码匹配。Nitro 官方明确其 Step On 固定器兼容 Step On 雪鞋，同时要求按性别和尺码配套；已据此补正跨品牌说明。地区价格折算不是中国售价；实时库存及商品图片展示授权仍待核。详情见[补充记录](docs/滑雪数据补充-2026-10-15.md)与[数据审计](data/raw/snowboard-boot/burton-womens-step-on-2027-audit-2026-10-15.json)。

Nitro Step On 男/女固定器 2026/27 已建档，补齐四档男款与三档女款官方靴码表、Re:Flex 安装孔位、三点连接与 Nitro 跨品牌 Step On 配套规则。欧洲官方挂牌折算为人民币地区参考，不是中国售价；见[雪具数据补充](docs/滑雪数据补充-2026-10-15.md)和[原始审计](data/raw/snowboard-binding/nitro-step-on-bindings-2027-audit-2026-10-15.json)。

Nitro Step On 雪鞋 2026/27 全系列已覆盖女款 Fate、Monarch、Scala 与男款 Team、Sentinel、Venture；本轮补录五款新种子，并清理 Venture 超出型号范围的尺码行。录入官网尺码选项、评分、结构、男女固定器尺码对应关系及 EUR→CNY 地区价。Monarch 页面文字范围与选择器有冲突，已披露；价格不是中国售价，选择器不是库存承诺，图片展示授权待核。证据见[原始审计](data/raw/snowboard-boot/nitro-step-on-boots-2027-audit-2026-10-15.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

滑雪资料缺口快照已按当前种子刷新：双板 44 款、199 条结构化尺码行；HEAD Shape V2 R 的 142/149/177 cm 及 Easy Joy R 2026/27 的 143/148/153/158 cm 仍缺逐码几何。Easy Joy R 25/26 的 143 cm 采用未显示 HEAD article 的专业零售商补充数据；服装仍有 6 款缺款号级尺码表。详见[滑雪数据缺口快照](docs/滑雪数据缺口-2026-10-15.json)。

HEAD Shape V2 R（316225）补入 Emmecisport 意大利店 EUR 299 套装价快照，折合 CNY 2,240.26；页面无下单、尺码和库存控件，不替代主价格或中国售价。来源与限制见[价格及规格审计](data/raw/skis/head/shape-v2-r-2025-26.json)。

QUECHUA FS 300 头盔 `8524785` 增补同货号英国、德国、西班牙、斯洛伐克、瑞士、加拿大和以色列官方挂牌价对照，折合约 CNY 282.37–500.11；仅代表地区汇率参考，国内人民币售价仍未核实。详见[价格审计](data/raw/ski-protection/quechua-fs-300-helmet-2026-10-15.json)。

新增 DREAMSCAPE DBCK 500 男款滑雪护背及「滑雪护具」目录：记录官方胸围/身高建议与 ZIPROTEC 外套组合信息。官方商品描述写 EN 1621-2 Level 1、测试区块写 EN 1621-1 Level 1；2025 符合性声明则列 VPSki-009 与 VêtProVTT-008，未找到三组标准的官方映射，数据不发布单一防护等级。官方 M 码胸围范围与 S/L 重叠；德国同货号 Ref 8494020 页面列 XS–2XL 六码，但 XS 没有对应人体尺寸建议，页面所称“四码”也与选项和表格不符。已从英国官方图库补入 21 张可访问图片，另 1 张返回 HTTP 410；展示授权待核。法国 EUR 59.99（折算 CNY 449.48）与德国 EUR 39.99（折算 CNY 299.63）分开记录，均为地区参考、非中国售价。详见[商品种子](data/ski-protection/decathlon-dbck-500-m-2026.yaml)、[原始审计](data/raw/ski-protection/decathlon-dbck-500-m-2026.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

补入 DREAMSCAPE DBCK 900 男款护背：商品页确认五个可选尺码、EN 1621-2 Level 1 与 SNB 500/900 外套的 ZIPROTEC 兼容。M 码胸围区间异常重叠，且官网尺码数量说明互相矛盾，种子保留原文并标注待核。英国官网 GBP 79.99 折算 CNY 710.23 作为地区促销参考，非中国售价。详见[商品种子](data/ski-protection/decathlon-dbck-900-m-2026.yaml)、[来源审计](data/raw/ski-protection/decathlon-dbck-900-m-2026.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

新增 DREAMSCAPE DBCK 500 女款护背：补入 XS–XL 尺码、官方胸围/身高建议、500–600 g 重量和 ZIPROTEC 兼容信息。商品页描述写 EN 1621-2 Level 1、测试区块写 EN 1621-1 Level 1；2025 符合性声明列 VPSki-009 与 VêtProVTT-008，未找到三组标准的官方映射，数据不发布单一防护等级。英法官方尺码表相互吻合；官方卖点称四码、选项和尺码表列五码，已保留说明。已录入英国官方图库中可提取并验证的 7 张图片；商品页标示 8 张，另 1 张图链未能提取；展示授权待核。英国 GBP 49.99 折算 CNY 443.86 是地区促销参考，法国 EUR 59.99 折算 CNY 449.48 是另一地区常规价，均非中国售价。详见[商品种子](data/ski-protection/decathlon-dbck-500-w-2026.yaml)、[来源审计](data/raw/ski-protection/decathlon-dbck-500-w-2026.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

新增 DREAMSCAPE DBCK 500 Junior 儿童背护：记录五档年龄/身高建议、胸围参考，并将 ZIPROTEC 兼容范围限定到 Teen SNB 500 Boy/Girl 外套货号。官方商品描述写 EN 1621-2 Level 1、测试区块写 EN 1621-1 Level 1；暂未找到儿童款符合性声明，等级待核。已录入英国官方图库中可提取并验证的 6 张图片；商品页标示 7 张，另 1 张图链未能提取；展示授权待核。英国 GBP 44.99 折算 CNY 399.46、法国橙色变体 EUR 54.99 折算 CNY 412.01，均为地区价格参考；官网“四个尺码”文案与五档选项不一致。详见[商品种子](data/ski-protection/decathlon-dbck-500-junior-2026.yaml)、[来源审计](data/raw/ski-protection/decathlon-dbck-500-junior-2026.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

复核 DREAMSCAPE SNB 500 Ziprotect 男款夹克：官方明确适配 DBCK 500 M/DBCK 900 M 背护，定位为全水平、常规频率、寒冷天气使用；确认长款宽松版型及全压胶。补录迪卡侬英国通用男装身体胸围表（S–2XL），仅作人体尺寸参考，不代表该夹克的成衣尺寸或试穿松量；成衣尺寸和雪季仍未核实。口袋数量存在 5 与 7 的冲突；同一商品 ID 的英国页列 10,000 mm，捷克与葡萄牙亮点列 15,000 mm，而捷克技术参数栏仍列 10,000 mm。种子暂保留英国页两处一致的 10,000 mm，并注明地区页冲突待品牌澄清。详见[夹克尺码审计](data/raw/skiing-apparel/decathlon-snb-500-ziprotect-jacket-size-audit-2026-10-15.json)、[夹克来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

2026-10-15 复核该夹克英国官方商品图库：页面列 15 张图，14 条图片直链返回 HTTP 200、`image/jpeg` 并录入种子，另 1 条返回 HTTP 410 未录入；图片展示授权仍待确认。再次检索迪卡侬中国站与精确商品 ID `8881806`，未找到可核实的中国人民币报价；英镑折算继续标为英国地区参考，不当作中国售价。成衣尺寸、雪季、口袋数和地区防水数值冲突仍待解决。详见[商品种子](data/skiing-apparel/decathlon-snb-500-ziprotect-jacket-2026.yaml)、[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)与[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

KAILAS BM45 PRO 背带裤 `KG2541314` 中国渠道复核：京东列表再次精确匹配商品、配色和 S 码，但未显示人民币价格，详情页仍不可读；另一个京东自营同系列列表没有款号映射和售价，暂不绑定该款；拼多多同款检索结果属于新加坡地区报价，已排除。天猫导购的“4000低价”没有款号映射或可复核实时成交价。CNY 3,882.39 仍是美国 USD 580 官方价的汇率折算，不作为中国售价。详见[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

BM45 PRO 官方尺码页复核：品牌当前尺码指南仍只提供鞋、手套和袜子数据，没有裤装人体围度或成衣尺寸；该型号继续只列官方 S/M/L 和 Relaxed 版型，不推算腰围、臀围或裤长。详见[尺码审计](data/raw/skiing-apparel/kailas-bm45-pro-ski-bibs-size-audit-2026-10-15.json)。

WEDZE H-FR 900 MIPS 头盔英国官网价更新为 GBP 99.99（原价 GBP 109.99），按 ECB 2026-10-14 汇率折合 CNY 887.81；先前 CNY 976.60 已是页面原价对应折算。新增官方“进阶水平/高频使用”定位标签，不将其解释为防护等级或使用限制。尺码复核发现英国同款页只列 S/M，比利时迪卡侬同货号 `8773682` 页面列出 S/M/L 及 52–55/55–59/59–62 cm 头围；地区尺码库存和价格不可互推。英国价不是中国售价，具体雪季和图片展示授权仍待确认。见[头盔种子](data/ski-protection/wedze-h-fr-900-mips-helmet-2026.yaml)、[来源审计](data/raw/ski-protection/wedze-h-fr-900-mips-helmet-2026-10-15.json)和[滑雪数据补充](docs/滑雪数据补充-2026-10-15.md)。

Nitro 官方 26/27 固定器集合页将 Fate、One、Phantom、Phantom+、Poison、Rambler、Talent、Team、Team Pro 列入 2026/27 目录，9 款种子已补雪季依据。此证据不代表首次上市时间或当前库存；价格仍是欧洲官方挂牌价折算参考，不是中国售价。见[Nitro 雪季审计](data/raw/snowboard-binding/nitro-bindings-2027-season-audit-2026-10-15.json)与[官方集合页](https://www.nitrosnowboards.com/collections/bindings-26-27)。

Jones 2027 单板已有 11 款补入官方 `J.27.` 货号雪季依据，并归档为 2026/27；该代码不表示首次上市时间或实时库存。Howler 使用保存的官方页面快照，Hovercraft 2.0 因 Hasco 与全球货号映射未核暂缓补录。详见[Jones 雪季审计](data/raw/snowboard/jones-2027-season-audit-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

滑雪类目已补齐产品种子中实际使用的价格、尺码、图片和规格证据字段契约；纯数字商品货号按文本保存。`pnpm --filter @youpu/api validate:data` 当前验证 131 个类目、61 个品牌、312 款产品全部通过。校验通过不代表来源授权、当前库存或中国成交价已经确认。

CAPiTA 2027 单板的官方年款依据已为 7 款补录，按 2026/27 归档；官方商品页未直接标注完整雪季日期。Sidewinder 当前官方页标题未显示 2027，暂不单凭 URL 年份补录。详见[CAPiTA 雪季审计](data/raw/snowboard/capita-2027-season-audit-2026-10-15.json)与[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

Burton 2027 单板固定器八款补入 2026/27 年款依据：日本官方商品页标题标注 2027，并展示各自 `27WIN` 色款代码；页面未直接注明完整雪季日期，不代表首次上市时间或实时库存。逐款商品 ID、来源与代码见[Burton 固定器雪季审计](data/raw/snowboard-binding/burton-bindings-2027-season-audit-2026-10-15.json)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

HEAD Easy Joy R 2025/26（316485）复核发现，OneEight 精确货号页面与 Snowleader 同名同季逐码表对 148/153 cm 半径有冲突；现已从种子展示值中撤下这两项争议半径，双方记录保留在原始审计，待精确原厂数据裁决。详见[审计记录](data/raw/skis/head/easy-joy-r-2025-26.json)和[数据补充说明](docs/滑雪数据补充-2026-10-15.md)。

KAILAS 官方尺码指南复核确认目前没有服装测量表，仅提供鞋、手套、袜子尺码；品牌建议按实际测量和适用图表选码，并提示地区尺码标准可能不同。BM45 MAX 男款 KG2531144 因缺少服装图表，继续只记录美国站 S/M/L 与京东索引 XXS/S 线索，不推算胸围、衣长或中外尺码换算。详见[尺码审计](data/raw/skiing-apparel/kailas-bm45-max-mens-95g-size-audit-2026-10-15.json)和[官方尺码指南](https://kailasgear.com/pages/size-chart)。

KAILAS GTX 三指滑雪手套 `KM2562002` 的京东索引可精确对应玄青黑 S/M：S 条目标为京东自营，M 条目的卖家未标明；详情页均无法读取价格或库存。凯乐石微商城 CNY 1,100 仍是国内人民币挂牌参考，不据京东索引推断成交价或完整尺码范围。见[商品审计](data/raw/skiing-apparel/kailas-gtx-3-finger-ski-gloves-2026.json)、[商品草稿](data/skiing-apparel/kailas-gtx-3-finger-ski-gloves-2026.yaml)和[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

KAILAS GTX 三指滑雪手套 `KM2562002` 已补入品牌微商城同款页面公开的 5 张商品轮播图，图片链接复核均为 `200 image/jpeg`；本站展示授权仍待核，商品保持草稿。

Salomon QST 106 2026/27（`L47774500+`）新增日本零售商 WebSports 同型号规格交叉核验：页面列五个长度的三围、半径和单支重量，均与官方目录一致；税入 JPY 112,000 预约挂牌价仅为同型号候选，因为零售页未列制造商货号，且 BLACK PINK 色名与官方 ALMOND MILK 不同，不并入精确 SKU 售价。京东另有 165 cm「奶白蓝 Almond Milk / Race」候选商品 ID `10235095268777`，但详情不提供价格、厂家货号或雪季，不能作为该款中国售价。海外价格不作中国售价。见[价格审计](data/raw/skis/salomon/qst-106-japan-price-2026-10-15.json)、[种子](data/skis/salomon-qst-106-2027.yaml)和[补充记录](docs/滑雪数据补充-2026-10-15.md)。

京东复核找到 KAILAS BM45 MAX 男款 95g（KG2531144）赤缇红 S 的精确商品条目，商品 ID `10221071731160`；详情页未返回可读价格或购买状态，国内人民币价仍未核实。美国 USD 920 折算 CNY 6,158.28 继续仅作地区参考。见[京东列表](https://www.jd.com/jiage/1318f691f28ac7d51eb0.html?catID=17343&electedExtAttrSet=&extAttrValue=expand_name%2C&sort_type=sort_default)、[商品审计](data/raw/skiing-apparel/kailas-bm45-max-mens-95g-size-audit-2026-10-15.json)和[数据补充文档](docs/滑雪数据补充-2026-10-15.md)。

Rossignol Soul 102（RAPMR03000）另补加拿大官方裸板挂牌 CAD 899.95，按 ECB 2026-10-14 EUR/CAD 1.5918、EUR/CNY 7.4925 折合 CNY 4,236.01，作为加拿大地区参考。该价格不是中国售价，尺码选项不证明库存或结账可售。详见[价格与重量审计](data/raw/skis/rossignol/soul-102-2026-27.json)及[滑雪数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

HEAD Easy Joy 2026/27（315656）的五档几何现由 HEAD 俄语区官方商店同根货号 `31565601` 页面核对；此前不同货号 `31655507` 不再作为依据。俄罗斯页面 RUB 52,590 保留原币审计，不折算成人民币售价；加拿大官方页显示的 1698 g 因重量口径不明而未录入。详见[种子](data/skis/head-easy-joy-2027.yaml)与[原始审计](data/raw/skis/head/easy-joy-2026-27.json)。

HEAD Shape V2 R（316225）价格主参考更新为 Trojan Sport 波兰的 `316225#114517`、PR 11 GW、142 cm 含税套装价 PLN 1,298.99，按 ECB 2026-10-14 汇率折合 CNY 2,229.30。此前西班牙 PR 10 GW 套装作为不同绑定配置的旁证保留。142/149/177 cm 几何仍缺精确逐码来源，未外推。见[种子](data/skis/head-shape-v2-r-2026.yaml)、[原始审计](data/raw/skis/head/shape-v2-r-2025-26.json)与[Trojan Sport 商品页](https://trojansport.pl/narty-head-shape-v2-r-2026-pr-11-gw.html)。

COSONE Step On 固定器复核（2026-10-15）：官网首页图 `product-2.jpg` 再次返回 404，且没有型号详情或可核对的替代图。产品种子继续空图、保持草稿，不借用其他型号图片。详见[复核证据](data/raw/snowboard-binding/cosone-step-on-binding-2026.json)和[当前缺口快照](docs/滑雪数据缺口-2026-10-15.json)。

KAILAS BM45 GTX 滑雪裤 `KG2541316` 已补入品牌官方推荐用途（大山、野雪、非雪道）与关键结构信息，包括 RECCO、三点可拆背带、侧向通风拉链和立体膝部剪裁。该型号的 S–XL 仍缺款号级裤装尺寸表，不能据字母码推断腰围或臀围。详见[商品种子](data/skiing-apparel/kailas-bm45-gtx-ski-pants-2026.yaml)、[来源审计](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。

KAILAS BM45 GTX 滑雪裤（KG2541316）已补入凯乐石微商城精确款号页面的五张商品轮播图，链接复测均为 `200 image/jpeg`；图片展示授权仍待核，尺码测量表仍缺。详见[商品种子](data/skiing-apparel/kailas-bm45-gtx-ski-pants-2026.yaml)和[图片复核记录](data/raw/skiing-apparel/apparel-source-audit-2026-10-14.json)。

DREAMSCAPE DBCK 900 男款护背（Decathlon ID 8738342）补入官方使用说明中的腰到肩测量、保护区域覆盖检查、活动后稳定性检查及护具/雪服同尺码要求。迪卡侬 2024 欧盟符合性声明将设计码 8738342 对应至 DBCK900 M，并列 EU PPE Regulation 2016/425、VPski-009 / VêtProVTT-008；声明未给 EN 1621 或 Level 等级。商品页仍出现 EN 1621-2 Level 1、EN 1621-1 Level 1 两种说法，说明书出现 Level 2；种子不发布单一等级结论。官网图库前五张图均复测为 `200 image/jpeg`，展示授权待核；英、希、瑞、马四地页面重复同一胸围尺码表，M 码重叠问题仍待官方更正。见[商品种子](data/ski-protection/decathlon-dbck-900-m-2026.yaml)、[原始审计](data/raw/ski-protection/decathlon-dbck-900-m-2026.json)、[官方符合性声明页面](https://support.decathlon.es/chaleco-dorsal-esqui-snowboard-dreamscape-dbck900-declaracion-de-conf)和[商品页](https://www.decathlon.co.uk/p/mens-mtb-skiing-and-snowboarding-back-protector-vest-dbck-900-black/339069/c382m8738342)。

QUECHUA FS 300 头盔（8524785）本轮复核未找到可读取的中国人民币精确货号售价，英国官方 GBP 39.99 折算价继续仅作地区参考。迪卡侬官方售后页将该货号列入 H-FS 300 型号组，并提供 2020–2025 年合规声明入口；这些年份不能确认具体雪季或零售年款。检索未命中也不代表中国无售。详见[商品种子](data/ski-protection/quechua-fs-300-ski-snowboard-helmet-2026.yaml)、[来源审计](data/raw/ski-protection/quechua-fs-300-helmet-2026-10-15.json)和[数据补充记录](docs/滑雪数据补充-2026-10-15.md)。
