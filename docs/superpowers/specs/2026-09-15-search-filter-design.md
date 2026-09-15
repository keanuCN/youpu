# 全局搜索与筛选设计

## 1. 背景

当前有谱已经有单板档案库内的客户端筛选能力，也有顶部搜索入口，但顶部搜索只是把关键词带到 `/browse/snowboard`，搜索范围局限在本地内容包和当前唯一开档品类。后端已有 PostgreSQL 产品目录接口和 Elasticsearch 索引基础，但还没有统一的公开搜索接口。

本功能把“搜索与筛选”作为下一项独立能力，优先解决用户按品牌、型号或中文关键词找到装备的问题，并为后续多品类和更大数据量保留升级空间。

## 2. 目标

- 提供跨品类的全局搜索入口和 `/search` 结果页。
- 支持品牌、型号、产品标题、年款、slug 和一句话点评搜索。
- 支持类目、品牌、年份、价格区间和排序条件组合筛选。
- PostgreSQL 在没有 Elasticsearch 时也能独立提供可用搜索。
- Elasticsearch 可用时提供中文分词和相关性排序，但不成为 API 启动的硬依赖。
- API、前端和本地内容包回退使用稳定一致的返回结构。
- 搜索条件保存在 URL 中，刷新和分享后结果可复现。

## 3. 非目标

- 本版本不实现输入联想下拉和实时搜索建议。
- 本版本不改造现有 `/browse/[slug]` 的品类筛选实现，只在全局搜索页复用相同的交互原则。
- 本版本不引入登录、个性化搜索历史或收藏权重。
- 本版本不要求 Elasticsearch 才能启动 API。
- 本版本不把后台草稿、发布流程作为本功能的一部分。

## 4. 用户流程

### 4.1 搜索入口

用户在顶部搜索框输入关键词并按 Enter 后跳转到：

```text
/search?q=关键词
```

桌面端和移动端都使用同一 URL 规则。搜索框保留现有样式和站点导航，不增加新的导航层级。

### 4.2 搜索结果页

`/search` 页面包含：

- 当前关键词和结果总数。
- 产品卡片网格，复用现有 `GearCard`。
- 桌面端左侧筛选栏。
- 移动端筛选抽屉。
- 关键词相关性、最新年款、综合评分三种排序。
- 类目、品牌、年份、价格区间筛选。
- 当前条件的可见标签、单项清除和全部重置。
- 无结果提示，建议放宽关键词或筛选条件。

搜索页不改变现有档案库的卡片、对比坞和详情跳转行为。

### 4.3 URL 状态

所有条件由查询参数表达，例如：

```text
/search?q=burton&category=snowboard&brand=burton&year=2026&priceMin=3000&priceMax=7000&sort=relevance&page=1
```

刷新、复制和分享 URL 后，页面恢复相同的搜索条件。带查询参数的搜索页设置 `noindex`，避免生成大量低质量 SEO 页面。

## 5. API 设计

新增公开接口：

```text
GET /api/search
```

查询参数：

| 参数 | 类型 | 说明 |
|---|---|---|
| `q` | string | 搜索关键词，首版至少 1 个字符，最大长度 128 |
| `category` | string | 类目 slug，可选 |
| `brand` | string | 品牌 slug，可选 |
| `year` | number | 年款，可选 |
| `priceMin` | number | 最低价格，可选 |
| `priceMax` | number | 最高价格，可选 |
| `sort` | `relevance\|new\|rating` | 默认 `relevance` |
| `page` | number | 从 1 开始，默认 1 |
| `pageSize` | number | 默认 20，最大 48 |

返回结构与现有产品列表契约保持同一风格：

```ts
{
  query: string;
  total: number;
  page: number;
  pageSize: number;
  items: ProductListItem[];
  facets: {
    categories: Array<{ slug: string; name: string; count: number }>;
    brands: Array<{ slug: string; name: string; nameCn: string | null; count: number }>;
    years: Array<{ value: number; count: number }>;
    price: { min: number | null; max: number | null };
  };
}
```

接口只返回 `status = published` 的产品。列表结果继续遵守最小返回原则，不返回详情页专用的完整 nested specs。

## 6. 搜索实现

### 6.1 统一服务边界

新增搜索服务作为唯一入口：

```text
SearchController
  -> SearchService
       -> Elasticsearch adapter（可选）
       -> PostgreSQL adapter（稳定兜底）
```

前端不感知实际使用哪一种搜索引擎，两种实现必须返回相同的共享契约。

### 6.2 PostgreSQL 搜索

PostgreSQL 作为始终可用的基础实现：

- 只查询已发布产品。
- 对产品标题、型号、slug、一句话点评和品牌名称执行不区分大小写的匹配。
- 使用产品类目、品牌、年份和价格条件进行组合过滤。
- `relevance` 在 PostgreSQL 路径下使用完整字段匹配优先、标题/型号匹配次之的稳定排序；其余排序复用目录服务的年款和评分排序。
- 通过分页查询和限定最大 pageSize 避免一次加载整个目录。

该实现适合当前规模，即使 Elasticsearch 未配置或不可连接，API 也可以正常启动和搜索。

### 6.3 Elasticsearch 搜索

当 `ES_NODE` 已配置且客户端健康时，使用现有 IK 索引基础：

- `title`、`model`、`brandName`、`oneLiner` 参与全文检索。
- 完整型号、品牌 + 型号和精确短语提升权重。
- 类目、品牌、年份、价格和 spec_schema 中允许筛选的字段作为 filter。
- `relevance` 使用 Elasticsearch 相关性分数；`new` 和 `rating` 仍使用显式排序。
- 产品更新沿用现有 outbox `product.updated` 事件同步索引。

如果 ES 查询超时、索引不存在或返回错误，SearchService 记录可诊断日志并转交 PostgreSQL，不向用户暴露基础设施错误。

### 6.4 分面

分面结果只统计当前关键词、过滤条件和已发布数据集中的可用选项。PostgreSQL 和 Elasticsearch 路径都返回相同字段，避免前端出现两套筛选逻辑。

首版只做类目、品牌、年份和价格分面；更细的动态 spec 字段继续由档案库的类目 schema 驱动，等搜索数据量和类目数量增加后再扩展。

## 7. 前端数据策略

- 新增前端搜索数据函数和共享响应解析，优先请求 `/api/search`。
- API 请求失败时，在本地内容包 `GEAR` 上执行同字段的本地搜索和筛选，保证静态站与无 API 开发模式仍可用。
- API 回退不改变结果页 URL 和交互结构。
- API 模式请求使用明确的 `no-store`，搜索条件刷新后获取最新目录结果。
- 搜索结果卡片使用现有图片 URL 解析和图片代理安全策略。

## 8. 错误处理

- 空关键词：显示搜索页引导，不发起无意义的全库查询。
- 超长关键词：截断或返回清晰的参数错误，最大 128 字符。
- 非法页码、价格区间或排序值：API 返回 400，前端回退到默认合法值。
- API 网络错误、5xx 或契约解析失败：前端使用本地内容包搜索。
- ES 不可用：API 内部使用 PostgreSQL，不改变响应状态。
- 无结果：返回 200 和空 `items`，由前端显示正常空态。

## 9. 测试与验收

### 9.1 后端

- 品牌、型号、中文关键词能命中预期产品。
- 草稿和未发布产品永不出现在搜索结果。
- 类目、品牌、年份和价格条件可以组合。
- 分页、总数和 pageSize 上限正确。
- PostgreSQL 路径在 ES 未配置时可用。
- ES 查询失败时能回退 PostgreSQL。
- 两种路径通过同一共享 Zod 契约解析。

### 9.2 前端

- 桌面端和移动端搜索入口都能跳转 `/search`。
- 搜索结果、筛选、排序和分页状态能从 URL 恢复。
- 无结果、空关键词和 API 回退状态可读。
- 现有档案库、详情页、对比坞和图片加载不回归。
- 搜索页的查询 URL 不进入索引。

### 9.3 命令级验证

```powershell
pnpm typecheck
pnpm --filter @youpu/web build
pnpm --filter @youpu/api build
```

Docker 和 API 恢复后，补充真实数据库接口验证，至少覆盖关键词搜索、组合筛选、无结果和 ES 不可用四种路径。

## 10. 交付边界

本次实现包含：共享搜索响应契约、API 搜索接口、PostgreSQL 搜索、可选 Elasticsearch 适配、前端 `/search` 页面、顶部搜索跳转、筛选/排序/分页、内容包回退和测试。

本次不包含：联想下拉、搜索历史、登录个性化、草稿预览、搜索广告位和多语言搜索。
