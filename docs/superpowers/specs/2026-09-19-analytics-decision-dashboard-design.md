# 数据分析增强版设计

## 背景

后台已经有基础数据分析：访客、事件、详情浏览、趋势、路径和热门产品。本轮不重做分析页面，而是补齐能直接支持运营判断的转化与参与度指标。

## 目标

- 在首页总览和数据分析页都能看到产品浏览漏斗。
- 区分访客转化和行为次数，避免只看埋点总量。
- 修复热门产品按 slug 记录时无法关联产品标题的问题。
- 保持现有 7/14/30 天筛选、空数据状态和服务状态展示。

## API 方案

`GET /api/admin/analytics` 新增两个字段：

```ts
funnel: {
  exposedVisitors: number;
  clickedVisitors: number;
  viewedVisitors: number;
  intentVisitors: number;
  clickRate: number | null;
  viewRate: number | null;
  intentRate: number | null;
}
engagement: {
  searches: number;
  recommendStarts: number;
  recommendCompletions: number;
  recommendCompletionRate: number | null;
  signups: number;
  ratings: number;
  replies: number;
}
```

- 漏斗人数按 `anon_id` 去重：曝光、卡片点击、详情浏览、收藏或外链点击。
- 漏斗转化率分别以相邻上一步为分母；分母为 0 时返回 `null`。
- 参与度指标按事件次数统计；推荐完成率为完成次数 / 开始次数。
- 热门产品关联同时支持 `product.id` 和 `product.slug`，展示标题优先使用数据库产品资料。

## 后台展示

- 首页“数据总览”保留现有四项核心指标，在趋势图前增加“浏览转化漏斗”和“用户参与度”。
- “数据分析”页复用同一块概览，再展示现有事件、路径、热门产品、最近埋点和系统状态。
- 没有数据时显示 0；没有可计算分母时显示“—”，不伪造 0% 转化率。

## 验收

- API 聚合辅助函数覆盖正常数据、零分母和意向行为合并。
- 管理端类型检查与构建通过。
- API 聚焦测试、全量类型检查和构建通过。
