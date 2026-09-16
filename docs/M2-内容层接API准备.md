# M2 准备：内容层接 API

> 目标：前端页面从「读本地内容包（`apps/web/src/data`）」切到「读 API / PG+ES」，
> 且切换后的页面信息密度不下降（原型展示的字段，后端都要有地方放）。
> 本文记录：已完成的准备、字段映射、无归属字段的缺口清单、逐步接入方案、待决策项。
>
> 状态：准备阶段已完成（2026-09-14）。接入本身属于 M2。

---

## 1. 本次已完成的准备

| 项 | 产物 |
|---|---|
| spec_schema 对齐原型字段集 | `data/categories.yaml`：19 个字段分 5 组（尺寸与形状 / 板芯与结构 / 性能取向 / 适用场景 / 价格与年份），带 `compareDirection`（对比胜负方向）、`diffThreshold`（差异阈值）、`rating_dimensions`（六维评分维度与权重） |
| 板型族枚举（决策 2） | 新增 `profileFamily` 字段（camber/rocker/hybrid，参与筛选）；品牌专有技术名保留在文本字段 `profile` |
| 编辑评分独立成列（决策 3） | 迁移 `002_editorial_scores`：`product.editorial_scores jsonb`；维度键与 `rating_dimensions` 对齐，seed 校验会拦住未声明的维度 |
| 综合指数改为计算值 | `computeComposite()`（packages/schema）：Σ(分项 × 权重)/Σ权重 × 10，不落库；API 列表/详情/ES 文档均输出 `composite` |
| 原型内容转 seed 数据 | `apps/web/scripts/export-seed-yaml.ts` → 15 款板 / 12 品牌 YAML，`validate:data` 全绿 |
| API 响应契约进代码 | `packages/schema/src/api.ts`：list/detail/specRow/categoryTree 四组 schema；api 侧 `CatalogService` 按契约标注返回类型 |
| 参数表可分组渲染 | API `specRows` 每行带 `group`，前端可按组折叠（对齐原型参数表交互） |

重跑内容导出（原型数据改了之后）：
```bash
pnpm --filter @youpu/web export:seed   # 原型内容包 → data/snowboard/*.yaml
pnpm --filter @youpu/api validate:data # 契约校验，不连库
```

## 2. 字段映射表（原型 → 后端）

| 原型（GearItem） | 后端归属 | 状态 |
|---|---|---|
| brand / model / year / price | `product` 列 + `brand` 表 | ✅ 已随 seed 导出 |
| specs.*（17 项规格） | `product.specs` jsonb（按 spec_schema 校验） | ✅ |
| scenes（适用场景） | `specs.scenes`（enum[]，筛选字段） | ✅ |
| specs.profile（品牌技术名） | `specs.profile` 文本 + `specs.profileFamily` 枚举 | ✅ |
| scores.*（六维编辑评分） | `product.editorial_scores` jsonb | ✅ 迁移 002 |
| gallery / hero | `product_image`（base/face/side/field）+ `product.cover_url` | ✅ |
| flexLabel（软/中/中硬/硬） | 由 `specs.flex` 派生 | ✅ 计算值 |
| composite（综合指数） | 由 `rating_dimensions` 权重实时计算 | ✅ 计算值，不落库 |
| hardcore（进阶指数） | 由 specs 派生 | ✅ 计算值 |
| heat（热度） | `product_stat.view_7d` | ✅ 运行时统计 |
| ratingDist（评分分布） | `rating` 表聚合 → `product.rating_*` | ⏳ M3 有真实评论后出现 |
| isNew / addedAt | `year` + `product.published_at` 派生 | ✅ |
| priceBand（同类价格区间） | 按类目 + 场景实时算分位（决策 4） | ✅ 不落库 |
| analysis.*（结论文案）/ whoFor | 无列 —— M3 由 AI 统一生成（决策 1） | 见 §3 |

## 3. 缺口清单：原型有、后端不建模的部分

1. **编辑结论文案与 whoFor 标签**（决策 1：后期由 AI 统一生成）
   不新增 `product.analysis` 列。原型的 verdict/强项/短板文案只作前端展示期的过渡内容；
   M3 由客观分析引擎（`spec_schema.insights` + `config_rule`）驱动规则生成、AI 润色，
   产出后如需缓存再评估存储位置（届时优先复用 `product.one_liner` 与洞察规则表）。
2. **榜单基础票数**（`BASE_VOTES`）：属于 `ranking_vote` 表，M2 榜单入库时一并处理。
3. **问卷结果 / 评论 / 通知**：M3 社区流；前端当前用 localStorage 承接，接口设计见技术方案 §6/§8。

## 4. 接入步骤（建议顺序，一次一页）

1. **前端 content layer**：新增 `apps/web/src/lib/content.ts`，把列表 / 详情 / 对比所需的数据读取收口到一处；
   当前实现读内容包，切换时只改这一个模块（`NEXT_PUBLIC_CONTENT_SOURCE=pack|api` 做灰度开关）。
2. **详情页**（收益最大）：`GET /api/products/:slug` → 参数表直接吃 `specRows`（按 `group` 折叠），
   替换掉现在由原型 `specTemplate` 驱动的客户端渲染 —— 这是「新增品类零前端改动」的验证点。
3. **列表页**：先 `GET /api/products?category=&brand=&sort=&page=`（PG 分页）+ 客户端筛选，
   ES 上线后换成带分面的 `/api/products?filters=`（技术方案 §6 的筛选分面全部来自 ES，
   可筛字段 = spec_schema 中 `filter !== false` 的字段，含 `scenes` 与 `profileFamily`）。
4. **首页**：高分榜 / 新品 → `/api/products?sort=rating|new`。
5. **对比页**：`GET /api/products?ids=a,b,c` 已补齐，一次读取最多 4 件已发布产品详情；API 不可用时由前端回退内容包。
6. **SEO 技术包**：✅ 已完成（2026-09-15，不依赖后端）——标题/描述模板、canonical 纪律、
   JSON-LD（Product + AggregateRating + BreadcrumbList + ItemList）、sitemap.xml、robots.txt、
   noindex 白名单（`/me`、`/auth`、筛选参数 URL），详情页 15 个档案静态预渲染。
   实现见 `apps/web/src/lib/seo.ts`；上线前设 `NEXT_PUBLIC_SITE_URL` 后再做 canonical 复核与站长平台注册。

## 5. 已决策（2026-09-14）

| # | 决策 | 落地情况 |
|---|---|---|
| 1 | 客观分析文案**后期由 AI 统一生成** | 不新增分析文案列；原型的 verdict 等文案仅作前端过渡展示，M3 由洞察规则（`spec_schema.insights` / `config_rule`）+ AI 产出 |
| 2 | **板型可枚举** | 新增 `profileFamily`（camber/rocker/hybrid）参与筛选，`profile` 文本保留展示；前端浏览页已有「板型族」筛选（混合拱 10 / 正拱 4 / 反拱 1，实测通过） |
| 3 | **编辑评分独立成列** | 迁移 `002_editorial_scores` → `product.editorial_scores`；综合指数由权重实时计算，不落库 |
| 4 | 同类价格区间（priceBand）**实时算分位** | 不落库；M2 起按「类目 + 场景」计算价格分位 |

### 决策 2 的补充约定

`profileFamily` 的归一化规则只存在一处：`apps/web/src/data/categories.ts` 的 `profileFamilyOf()`，
内容包在构建 GearItem 时派生该字段，seed 导出脚本直接读内容包字段（不再各自实现一遍）。
判定口径：`纯 Camber*` → camber；明确「全反弓」→ rocker；其余含反弓/摇臂的混合结构（含 Rocker-Camber-Rocker）→ hybrid。
导出脚本会打印逐条判定结果供人工过目，随参数校对一并核对。
