# Web 内容层 API 优先接入设计

## 目标

让 Web 的档案库列表页和装备详情页支持「API 优先、本地内容包回退」，在 API 尚未启动、数据库不可用或接口返回不完整时仍保留当前可浏览体验。

## 范围

本阶段只接入两个页面：

- `apps/web/src/app/browse/[slug]`：按类目读取产品列表；筛选和排序继续在客户端执行。
- `apps/web/src/app/gear/[id]`：读取单件产品详情；现有评论、对比坞、推荐和本地交互继续复用已有客户端逻辑。

本阶段不改首页、对比页、问卷、登录和个人中心，也不把本地评论/收藏迁移到 API。

## 内容来源开关

新增 `NEXT_PUBLIC_CONTENT_SOURCE`：

- `pack`：默认值，完全沿用 `apps/web/src/data`。
- `api`：请求 `NEXT_PUBLIC_API_BASE` 的目录接口；任何网络错误、非 2xx 响应或契约解析失败都回退到内容包。

回退发生在服务端内容层，不在每个页面重复实现。这样开发环境不依赖 Docker，生产环境可以通过环境变量逐步切换。

## 组件边界

### `apps/web/src/lib/content.ts`

提供页面使用的内容读取函数：

```ts
export type ContentSource = "pack" | "api";

export async function getCategoryProducts(slug: string): Promise<GearItem[]>;
export async function getProductDetail(id: string): Promise<GearItem | undefined>;
```

该模块负责：

1. 根据环境变量选择内容源。
2. 请求 `/api/products` 和 `/api/products/:slug`。
3. 用 `productListResponseSchema` / `productDetailSchema` 做运行时校验。
4. 把传输 DTO 映射成当前组件使用的 `GearItem`。
5. 使用同 slug 的本地 `GearItem` 补齐 API 尚未覆盖的过渡字段，例如 `analysis`、`whoFor`、`hardcore`、`ratingDist` 和评论种子数据所需的本地标识。
6. 对 API 图片 URL 复用开发环境图片代理处理。

### 页面与客户端组件

- `browse/[slug]/page.tsx` 在服务端调用 `getCategoryProducts()`，把结果通过 props 传给 `BrowseClient`。
- `BrowseClient` 优先使用服务端传入的产品池；没有传入时保留现有本地读取作为开发回退。
- `gear/[id]/page.tsx` 在服务端调用 `getProductDetail()`，把结果传给 `GearDetailPage`，并用结果生成 metadata/JSON-LD。
- `GearDetailPage` 和 `InfoCard` 使用传入的 `GearItem`，本地 `gearById()` 只作为兼容回退。

API DTO 到 `GearItem` 的映射规则：

| `ProductListItem` / `ProductDetail` | `GearItem` |
|---|---|
| `slug` / `id` | `id`，优先使用本地同 slug 的 id |
| `brand.name` | `brand` |
| `model` | `model` |
| `year` | `year` |
| `priceMin` 或 `priceMax` | `price`，取可用价格的中位或单值 |
| `coverUrl`、`images` | `hero`、`gallery`，开发环境经过图片 URL 解析 |
| `specs` | `specs` |
| `editorialScores` | `scores` |
| `composite` | `composite` |
| `specs.scenes`、`specs.flex`、`specs.profileFamily` | 场景/硬度相关展示字段 |
| 本地同 slug 内容 | API 缺失的过渡展示字段 |

没有本地匹配项时使用明确的安全默认值：空分析文案、空评论分布、空场景、`0` 热度和由规格推导的最小展示值；不得伪造用户评分或评论数量。

## 错误与缓存策略

- API 请求设置有限超时，避免页面永久等待。
- API 返回 404 时详情页回退到本地同 id；两边都不存在时保持现有 NOT FOUND 空态。
- API 返回字段不符合 schema 时视为 API 不可用并回退，不把未经校验的数据传入组件。
- 本阶段不添加浏览器端 SWR 或全局缓存；Next 服务端 fetch 使用默认开发行为，后续再按 SEO/缓存需求单独决策。

## 测试与验收

- 为 API URL、内容源开关、列表/详情 DTO 映射和回退行为新增 Node 测试。
- `NEXT_PUBLIC_CONTENT_SOURCE=pack` 下现有主站页面保持可访问。
- API 不可用时，详情页和档案库仍渲染本地内容。
- API 代理返回符合契约的列表/详情时，页面能显示 API 的价格、品牌、图片、规格和评分，同时保留已有本地交互。
- `pnpm --filter @youpu/web typecheck` 和新增测试通过。
- Docker/API 联调作为后续环境验证，不作为本阶段代码测试的前置条件。

## 非目标

- 不修改 NestJS 目录接口和数据库 schema。
- 不在本阶段迁移评论、收藏、榜单票数或问卷结果。
- 不删除现有本地内容包。
- 不把开发图片代理用于静态导出生产环境；生产 CDN 方案另行处理。
