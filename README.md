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

## 首发模拟数据与真实评价

首发阶段可以使用仓库内的本地模拟数据（包括参考分项、示例评价等）填充页面，避免内容和交互为空。模拟内容必须与品牌官方参数、官方评分及真实用户评价明确区分，不得将推演值表述为品牌结论或社区实测。

真实用户评价、评分及其使用条件以 API / PostgreSQL 中的社区数据为准，和本地模拟内容分开存储；本地 seed 或内容包更新不得覆盖真实用户数据。展示时真实数据优先，样本不足时可回退模拟数据。达到切换条件后，通过单一配置开关关闭模拟数据并统一改用真实数据，不删除原始模拟数据，便于回滚。切换前需确认详情页、列表、榜单和统计图均不再混入模拟值。

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

页面默认使用 `apps/web/src/data/` 内容包，账号/收藏/对比/评论存本机 localStorage —— **全站可完整浏览**。
唯一会失败的是埋点上报（`POST /api/events` 连不上，静默丢弃，不影响使用）。

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
pnpm seed          # 导入类目 / 品牌 / 当前 50 条产品 seed（40 单板 + 5 羽毛球拍 + 5 路亚竿）
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

前台外链图片的缩略图尺寸、加载优先级和实测限制见[图片加载性能优化记录](docs/图片加载性能优化记录.md)。

已有 seed 图片需要迁移时，先生成仅供审核的清单；默认不会下载、上传或改写商品资料：

```bash
pnpm --filter @youpu/api tos:images:plan -- --out ../../data/tmp/tos-image-migration.json
```

逐项核实图片使用权后，只将确认可迁移的条目设为 `"approved": true`，再小批执行：

```bash
pnpm --filter @youpu/api tos:images:apply -- --manifest ../../data/tmp/tos-image-migration.json --apply
```

迁移会拒绝非 HTTPS、重定向、非 JPEG/PNG/WebP 或大于 10 MiB 的来源；只更新仍与审核清单一致的 YAML 图片地址，原始 URL 和来源备注保存在结果清单中。失败条目可修复后重试，已完成条目不会重复上传；上传成功后会先保存可续跑检查点，再更新 YAML。新生成的审核清单不会覆盖同名旧清单，请使用新的输出文件名以保留审核记录。迁移清单位于 Git 忽略的 `data/tmp/`，需要长期留档时请自行归档。迁移只改 seed YAML；要同步数据库时，先运行 `pnpm --filter @youpu/api validate:data`，再对清单里每个已迁移的商品文件执行单品同步：

```bash
pnpm --filter @youpu/api seed:product -- ../../data/<类目目录>/<商品文件>.yaml --update-existing
```

并行迁移会通过 `data/tmp/` 锁文件串行保护同一审核清单和商品文件。若进程被强制结束，可能遗留 `.lock` 文件；先确认没有图片迁移进程运行，再删除对应锁文件后重试。

单品同步会按 YAML 更新该商品的其他字段，因此执行前请确认这份 seed 是该商品的最新正式资料。

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

**http://111.229.87.101/**（腾讯云 CVM · 上海 · 2核1G · 宝塔 nginx）

- **前端**：Next.js **静态导出**产物由 nginx 直接托管（纯 HTML/CSS/JS，零 Node 运行时）——
  前端是「内容包 + localStorage」架构，正好适配这台小机器
- **数据层**：Docker 跑 PG16 + Redis（端口只绑 127.0.0.1），23 张表的迁移已执行并实测通过
  （ltree / 按月分区 / 部分索引 / 触发器）；**ES 与 Umami 暂缓**（内存受限，搜索先用 PG，ES 可从 PG 完全重建）
- **API**：待部署（用 systemd 直跑 Node，不进 Docker——1G 内存下容器构建有 OOM 风险）

完整服务器现状、待续步骤与回滚方式见 [deploy/README.md](deploy/README.md)。

## 日常命令

| 命令 | 说明 |
|---|---|
| `pnpm dev` / `dev:web` / `dev:admin` | 起 web + api / 只起 web / 启动 M2 管理端 |
| `pnpm infra:up` / `infra:down` | 基础设施容器（默认 PG + Redis） |
| `pnpm infra:up:full` | 追加 ES + Umami（内存吃紧的机器别开） |
| `pnpm db:migrate` | 应用迁移（`prisma/migrations` 下的手写 SQL 为准） |
| `pnpm seed` | 重新导入 `data/` 数据（幂等） |
| `pnpm --filter @youpu/api validate:data` | 只校验 data/ 数据、不连库（CI 可用） |
| `pnpm --filter @youpu/web export:seed` | 原型内容包 → seed YAML（一次性迁移工具） |
| `pnpm --filter @youpu/web export:catalog` | API 目录 → 前台云端快照（静态构建前运行） |
| `pnpm es:reindex` | ES 全量重建 |
| `pnpm typecheck` / `pnpm build` | 全仓类型检查 / 构建 |

> Web 开发模式使用独立的 `apps/web/.next-dev`，生产构建使用 `apps/web/.next`，二者不会覆盖彼此的 CSS/静态资源。

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

**数据来源**：默认页面使用 `src/data/` 内容包（15 款板 + 六维评分 + 编辑结论 + 种子评论 + 榜单票数），
设置 `NEXT_PUBLIC_CONTENT_SOURCE=api` 后，档案库列表和详情优先读取 API，失败时回退内容包；全局搜索独立通过 `/api/search` 获取结果，API 失败时同样回退本地数据。
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

上线前必做：在 `apps/web/.env.local` 设 `NEXT_PUBLIC_SITE_URL=https://正式域名`（canonical / sitemap / 结构化数据都用它，现在是 localhost）。
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
| M2 图鉴流 + 后台基础 | 列表/详情/对比/榜单、全局搜索与筛选、SEO 技术包、后台基础版 | 🚧 内容 API、搜索筛选与后台基础版已落地；本地全栈联调与线上部署待续 |
| M3 社区流 + 审核配置 | 登录/评分评论/收藏/通知、客观分析引擎、问卷版推荐、后台审核队列 | 🚧 认证、问卷、评分评论收藏通知和举报审核闭环已落地；客观分析与运营扩展待续 |
| M4 运营 | 分享卡图、赛季榜单、AI 对话式推荐 | ⏳ |

## 文档

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
- ✅ **内测站已上线**（静态导出托管于 nginx，http://111.229.87.101/ ）；已备案（津ICP备2026009482号，页脚展示），
  域名 `xiaopang.club` 待加 A 记录后即可用域名访问
- 🚧 **线上后端进行中**：服务器已装 Docker 并跑起 PG16 + Redis，23 张表迁移实测通过（含分区表写入验证）；
  下一步是 API 部署（systemd）与静态站埋点接入 —— 见 [deploy/README.md](deploy/README.md) 的「待续」
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
- ⏳ **下一步**：线上 API systemd 部署 → 生产域名与埋点接入 → 完成线上内容 API 接入；上线后设 `NEXT_PUBLIC_SITE_URL` 并注册各站长平台（Bing/搜狗/百度）。采集原始快照归档 / COS 图片管理、正式密钥管理、客观分析和 M4 运营功能仍未完成。
