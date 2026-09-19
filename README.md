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
| 图片 / 部署 | 腾讯云 COS + CDN / Docker Compose + Nginx + GitHub Actions |
| 契约 | `packages/schema`：zod 定义 spec_schema、事件字典、API 响应类型，前后端共用 |

## 仓库结构

```
youpu/
├── apps/
│   ├── web/              # Next.js 用户侧（SSR）
│   │   ├── src/data/     # 内容包回退数据（API 模式不可用时继续保证浏览）
│   │   └── scripts/      # export-seed-yaml.ts：内容包 → seed YAML 迁移工具
│   ├── admin/            # M2 管理端（产品 / 品牌 / 类目 schema 工作台，端口 3002）
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
pnpm dev:admin      # http://localhost:3002（需先启动 API，并配置 ADMIN_TOKEN）
```

页面默认使用 `apps/web/src/data/` 内容包，账号/收藏/对比/评论存本机 localStorage —— **全站可完整浏览**。
唯一会失败的是埋点上报（`POST /api/events` 连不上，静默丢弃，不影响使用）。

需要联调目录 API 时，在 `apps/web/.env.local` 设置 `NEXT_PUBLIC_CONTENT_SOURCE=api`。
档案库列表和详情页会优先请求 API，接口不可用、超时或响应不符合共享契约时自动回退内容包；API 恢复后无需改页面代码即可继续使用 API 数据。
API 模式使用 Next 服务端渲染；静态导出模式仍使用内容包，构建配置会拒绝两者同时开启。当前 M2 的详情页仅对本地已配置的 live 类目提供完整评分、参数模板与同场景推荐，未知类目会安全回退或显示空态，避免误用单板配置。

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
pnpm seed          # 导入类目 / 品牌 / 当前 18 款单板 seed
pnpm dev           # web:3000 + api:3001
pnpm dev:admin     # 另开终端启动后台：3002
```

默认启动 PostgreSQL + Redis 即可完成基础开发；Elasticsearch 只用于增强搜索和分面，不是 API 可用的必需依赖。
健康检查 `http://localhost:3001/api/health` 会返回 `db`、`redis`、`es` 三项状态，其中 `es=false` 不代表 API 不可用。

启动后台前，请编辑 `apps/api/.env`，把 `ADMIN_TOKEN` 替换为至少 16 位的随机令牌；后台 M2 使用单一 Bearer 令牌，
并不等同于完整的多账号登录系统。

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
| `pnpm es:reindex` | ES 全量重建 |
| `pnpm typecheck` / `pnpm build` | 全仓类型检查 / 构建 |

> ⚠️ `next dev` 运行期间不要跑 `pnpm build`：两者共用 `.next` 目录会互相破坏（页面会 500）。

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
| M3 社区流 + 审核配置 | 登录/评分评论/收藏/通知、客观分析引擎、问卷版推荐、后台审核队列 | 🚧 认证、问卷和后台审核基础已落地；社区扩展与客观分析等后续功能待续 |
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
- ✅ **当前分支已落地**：认证、前台 API 内容模式、全局搜索筛选、问卷推荐和后台审核基础
- ✅ **后台 M2 基础版**：`apps/admin` 已提供单一 Bearer 管理令牌登录、产品 / 品牌 / 类目 CRUD、草稿 / 发布、
  `spec_schema` 驱动参数表单与来源 URL 留痕；图片上传、批量文件导入、细粒度账号权限与审计留到后续版本
- ✅ **后台数据分析增强**：总览与数据分析页已提供访客趋势、产品浏览漏斗、搜索 / 推荐 / 社区参与度指标、路径和热门产品分析；热门产品同时支持 UUID 与 slug 关联
- ✅ **全局搜索与筛选**：`/search` 页面、`GET /api/search`、PostgreSQL 搜索兜底、可选 Elasticsearch 中文分词、URL 筛选状态和内容包回退已完成
- ✅ **2026-09-18 本地验收基线**：在 `codex/admin-information-architecture` 分支的 `fee8f19` 基线上，API 健康测试 3/3、前端聚焦测试 20/20、全工作区类型检查和 schema/API/web/admin 生产构建均通过；本地 3000/3001/3002 服务均返回 200
- ✅ **本地全栈验收**：Docker 基础设施、迁移、seed、API / 用户端 / 后台三服务联调已完成；Elasticsearch 仍为可选增强依赖。
- ⏳ **下一步**：线上 API systemd 部署 → 生产域名与埋点接入 → 完成线上内容 API 接入；上线后设 `NEXT_PUBLIC_SITE_URL` 并注册各站长平台（Bing/搜狗/百度）。社区扩展和 M4 运营功能仍未完成。
