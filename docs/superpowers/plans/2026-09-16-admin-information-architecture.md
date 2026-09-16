# 后台管理信息架构 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将后台管理端改为中文优先的信息架构，让数据分析成为总览首页的首要内容，并将产品、品牌、类目和采集导入集中到独立的“资料库”分组。

**Architecture:** 继续使用 `AdminApp` 的单页分区状态，不改变现有 `Section` ID、API 和数据类型。把当前分析页中可复用的摘要、图表、路径和热门产品区抽成总览分析区；总览和完整分析页共享 `AdminAnalytics`、日期范围和刷新逻辑。侧边栏导航项增加分组字段，桌面端显示分组标题，移动端保持横向可滚动导航。

**Tech Stack:** Next.js 14、React 18、TypeScript、现有 CSS token 与响应式媒体查询、NestJS Admin API（只复用现有接口）。

## Global Constraints

- 后台操作语言统一为中文，移除仅用于装饰的英文导航、眉题、状态、数量后缀和 footer 文案。
- 品牌英文名、产品型号、`slug`、来源 URL、事件代码、JSON 字段名和 API 地址属于真实数据或技术值，保持原样。
- 不新增 API、数据库字段或鉴权逻辑；继续复用 `AdminAnalytics`、`refreshAnalytics` 和 `analyticsDays`。
- 不改变 `Section` ID：`dashboard`、`analytics`、`products`、`brands`、`categories`、`import`、`moderation`、`audit`。
- 总览分析请求失败时，不阻塞资料库和内容质量区域；分析区域使用现有空态和错误提示机制。
- 桌面和窄屏布局均不得出现横向溢出，按钮和导航必须保留可访问的中文名称。

---

### Task 1: 重组后台导航并移除装饰性英文

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx:111-120`（导航数据）
- Modify: `apps/admin/src/components/admin-app.tsx:1298-1312`（侧边栏、顶部栏和 footer）

**Interfaces:**
- Consumes: 现有 `Section` 联合类型、`activeSection` 和 `navItems`。
- Produces: 带 `group` 字段的导航项；顶部栏通过 `label` 显示当前中文页面名。

- [ ] **Step 1: 将导航数据改成三组中文条目**

将现有导航项类型改为：

```tsx
type NavGroup = '工作台' | '资料库' | '内容运营';

const navItems: Array<{ id: Section; index: string; label: string; group: NavGroup }> = [
  { id: 'dashboard', index: '00', label: '总览', group: '工作台' },
  { id: 'analytics', index: '01', label: '数据分析', group: '工作台' },
  { id: 'products', index: '02', label: '产品资料', group: '资料库' },
  { id: 'brands', index: '03', label: '品牌', group: '资料库' },
  { id: 'categories', index: '04', label: '类目与参数', group: '资料库' },
  { id: 'import', index: '05', label: '采集与导入', group: '资料库' },
  { id: 'moderation', index: '06', label: '内容审核', group: '内容运营' },
  { id: 'audit', index: '07', label: '操作审计', group: '内容运营' },
];
```

保留现有 `Section` ID，只调整显示顺序和编号；删除 `note` 字段，避免英文副标题继续进入页面。

- [ ] **Step 2: 按分组渲染侧边栏**

将当前单层 `navItems.map` 替换为分组渲染。分组顺序必须固定为“工作台、资料库、内容运营”，每组只渲染自己的条目：

```tsx
<nav className="sidebar-nav" aria-label="后台模块">
  {(['工作台', '资料库', '内容运营'] as NavGroup[]).map((group) => (
    <div className="sidebar-group" key={group}>
      <p className="sidebar-group-label">{group}</p>
      {navItems.filter((item) => item.group === group).map((item) => (
        <button
          key={item.id}
          className={activeSection === item.id ? 'nav-item is-active' : 'nav-item'}
          onClick={() => { setActiveSection(item.id); setNotice(null); }}
        >
          <span>{item.index}</span>
          <strong>{item.label}</strong>
        </button>
      ))}
    </div>
  ))}
</nav>
```

给导航增加 `aria-label`，保留已有点击行为和激活样式。

- [ ] **Step 3: 清理品牌区、顶部栏和底部的英文展示**

替换这些固定文案：

```tsx
<div><strong>后台管理</strong><small>本地环境</small></div>
<p className="sidebar-label">操作模块</p>
<div><span className="topbar-code">有谱后台</span><span className="topbar-slash">/</span><span>{navItems.find((item) => item.id === activeSection)?.label}</span></div>
<div className="system-readout"><span className="status-dot status-dot-good" /><span>API 会话 / 权限：{role || 'admin'}</span></div>
<footer className="admin-footer"><span>有谱 / 产品资料工作台</span><span>本地管理控制台 · {new Date().getFullYear()}</span></footer>
```

`role` 是权限技术值，保留大写显示；`admin` 不作为装饰性英文标题处理。

- [ ] **Step 4: 清除导航和布局层的英文引用**

将顶部栏从 `navItems.find((item) => item.id === activeSection)?.note` 改为 `navItems.find((item) => item.id === activeSection)?.label`，并删除所有对 `item.note` 的引用。通过以下命令确认没有残留导航副标题：

```powershell
rg -n "note:|item\.note|CONTROL DESK|PRODUCT PIM|BRAND INDEX|SCHEMA FAMILY|INGEST STATUS|ANALYTICS|COMMUNITY MODERATION|AUDIT TRAIL" apps/admin/src/components/admin-app.tsx
```

Expected: no matches。

- [ ] **Step 5: 运行管理端类型检查**

Run: `pnpm --filter @youpu/admin typecheck`  
Expected: exit code 0。

- [ ] **Step 6: Commit**

```bash
git add apps/admin/src/components/admin-app.tsx
git commit -m "feat: regroup admin navigation in Chinese"
```

### Task 2: 把数据分析摘要提升到总览首页

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx:923-1010`（总览）
- Modify: `apps/admin/src/components/admin-app.tsx:1144-1235`（分析页）
- Modify: `apps/admin/src/components/admin-app.tsx:605-618`（分析加载与刷新复用）

**Interfaces:**
- Consumes: `AdminAnalytics`, `analyticsDays`, `analyticsBusy`、`refreshAnalytics`、`TrafficChart`、`EventBreakdown`。
- Produces: `renderAnalyticsOverview()`，在总览显示分析摘要，在完整分析页显示相同摘要后继续显示最近埋点和系统状态。

- [ ] **Step 1: 先固定总览的分析数据入口**

保留当前分析 `useEffect` 的触发条件 `sessionState === 'signed-in' && token`，不要增加 `activeSection` 条件，确保登录后进入总览时已经读取 `/analytics?days=14`。在 `AdminApp` 内新增组合刷新函数：

```tsx
async function refreshOverview() {
  await Promise.all([
    refreshWorkspace(),
    refreshAnalytics(),
  ]);
}
```

总览刷新按钮改为调用 `refreshOverview()`；如果其中一个请求失败，沿用现有 `renderDashboard` 的 `setNotice`，并保留另一部分已加载数据。

- [ ] **Step 2: 抽取共享分析摘要渲染函数**

在 `renderAnalytics` 前新增 `renderAnalyticsOverview()`，返回以下固定结构：

```tsx
function renderAnalyticsOverview() {
  const summary = analytics?.summary;
  return (
    <>
      <div className="analytics-note">当前统计窗口：{analytics ? `${formatDate(analytics.from)} — ${formatDate(analytics.to)}` : '读取中……'}</div>
      <div className="metric-grid analytics-summary-grid">
        <Metric label="独立访客" value={summary?.uniqueVisitors ?? '—'} detail={`最近 ${analyticsDays} 天`} accent />
        <Metric label="埋点事件" value={summary?.events ?? '—'} detail="全部事件" />
        <Metric label="产品浏览" value={summary?.productViews ?? '—'} detail="详情页浏览" />
        <Metric label="活跃账号" value={summary?.activeAccounts ?? '—'} detail="登录用户" />
      </div>
      <div className="analytics-grid">
        <section className="data-panel chart-panel analytics-traffic-panel">
          <PanelHeader eyebrow="访问趋势" title="访客与事件趋势" meta={analyticsBusy ? '读取中' : `最近 ${analyticsDays} 天`} />
          <TrafficChart data={analytics?.daily ?? []} />
        </section>
        <section className="data-panel chart-panel">
          <PanelHeader eyebrow="事件分布" title="埋点事件分布" meta="主要事件" />
          <EventBreakdown items={analytics?.eventBreakdown ?? []} />
        </section>
      </div>
      <div className="analytics-grid analytics-grid-secondary">
        <section className="data-panel">
          <PanelHeader eyebrow="访问路径" title="访问路径" meta="事件来源" />
          {analytics?.topPaths.length ? (
            <div className="rank-list">{analytics.topPaths.map((item, index) => (
              <div className="rank-row" key={item.path}>
                <span className="rank-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="rank-main"><strong title={item.path}>{item.path}</strong><small>上报事件路径</small></div>
                <b>{formatCompactNumber(item.count)}</b>
              </div>
            ))}</div>
          ) : <EmptyState title="暂无路径数据" detail="有用户行为上报后，这里会显示访问来源。" />}
        </section>
        <section className="data-panel">
          <PanelHeader eyebrow="热门产品互动" title="热门产品互动" meta="热门产品" />
          {analytics?.topProducts.length ? (
            <div className="rank-list">{analytics.topProducts.map((item, index) => (
              <div className="rank-row" key={item.productId}>
                <span className="rank-index">{String(index + 1).padStart(2, '0')}</span>
                <div className="rank-main"><strong title={item.productId}>{item.title || item.productId}</strong><small>{item.brand || item.productId}</small></div>
                <b>{formatCompactNumber(item.count)}</b>
              </div>
            ))}</div>
          ) : <EmptyState title="暂无产品互动" detail="曝光、点击或详情浏览产生后，这里会显示产品热度。" />}
        </section>
      </div>
    </>
  );
}
```

将当前 `renderAnalytics` 中对应的指标、趋势、事件分布、访问路径和热门产品 JSX 迁移到此函数，删除英文眉题和数量后缀，保留现有数据映射、空态和格式化函数。完整分析页删除这五段重复 JSX，改为调用此函数。

- [ ] **Step 3: 调整总览内容顺序**

将 `renderDashboard` 的标题和操作改为：

```tsx
<SectionHeader
  index="00"
  title="数据总览"
  description="先看用户行为和内容质量，再进入资料库维护具体记录。"
  action={(
    <div className="analytics-toolbar">
      <label className="range-select"><span>统计范围</span><select value={analyticsDays} onChange={(event) => setAnalyticsDays(Number(event.target.value) as 7 | 14 | 30)}><option value="7">最近 7 天</option><option value="14">最近 14 天</option><option value="30">最近 30 天</option></select></label>
      <button className="button" type="button" onClick={() => void refreshOverview().catch((error) => setNotice({ kind: 'error', text: getErrorText(error) }))} disabled={analyticsBusy}>刷新总览</button>
    </div>
  )}
/> 
{renderAnalyticsOverview()}
```

分析摘要必须出现在内容质量、最近更新和工作边界之前。原有产品数量指标、内容质量队列、最近更新和边界面板保留，但产品数量指标不再作为首页第一个指标区。

- [ ] **Step 4: 保持完整分析页独立可用**

`renderAnalytics` 保留“数据分析”标题、日期选择和刷新按钮，调用 `renderAnalyticsOverview()` 后继续渲染最近埋点表和服务器状态。完整分析页不再重复维护摘要 JSX。页面顺序固定为：分析摘要、最近埋点、服务器状态。

- [ ] **Step 5: 翻译分析页固定文案**

至少完成以下替换：

| 原文 | 新文案 |
|---|---|
| `05 / ANALYTICS` | `01` |
| `TRAFFIC TREND` | `访问趋势` |
| `EVENT MIX` | `事件分布` |
| `TOP PATHS` | `访问路径` |
| `PRODUCT INTERACTIONS` | `热门产品互动` |
| `RECENT TRACKING` | `最近埋点` |
| `SYSTEM STATUS` | `系统状态` |
| `ALL SYSTEMS NOMINAL` | `运行正常` |
| `CHECK REQUIRED` | `需要检查` |
| `LOADING` / `NO EVENTS` / `LOADED` | `读取中` / `暂无事件` / `已加载` |
| `TOP EVENTS` / `EVENT SOURCES` / `TOP PRODUCTS` | `主要事件` / `事件来源` / `热门产品` |

实际事件代码 `item.name`、访客 ID、产品 ID 和 Node.js 版本继续显示为技术值。

- [ ] **Step 6: 运行管理端构建**

Run: `pnpm --filter @youpu/admin build`  
Expected: Next.js production build exits with code 0。

- [ ] **Step 7: Commit**

```bash
git add apps/admin/src/components/admin-app.tsx
git commit -m "feat: prioritize analytics on admin overview"
```

### Task 3: 为资料库分组增加桌面与移动端样式

**Files:**
- Modify: `apps/admin/src/app/globals.css:287-338`（侧边栏基础样式）
- Modify: `apps/admin/src/app/globals.css:2188-2255`（移动端导航覆盖）

**Interfaces:**
- Consumes: Task 1 输出的 `.sidebar-group`、`.sidebar-group-label` 和无 `small` 副标题的 `.nav-item`。
- Produces: 桌面端可辨识分组、移动端可横向滚动且不产生横向溢出的导航。

- [ ] **Step 1: 添加桌面端分组样式**

在侧边栏样式附近加入：

```css
.sidebar-nav {
  display: grid;
  gap: 18px;
}

.sidebar-group {
  display: grid;
  gap: 4px;
}

.sidebar-group-label {
  margin: 0 8px 5px;
  color: var(--sidebar-muted);
  font-size: 11px;
  font-weight: 700;
}

.nav-item {
  grid-template-columns: 30px 1fr;
}

.nav-item strong {
  grid-column: 2;
}
```

保留现有 `.nav-item` 激活状态、红色左边框和键盘焦点样式。

- [ ] **Step 2: 调整移动端分组而不产生溢出**

在 `@media (max-width: 900px)` 中加入：

```css
.sidebar-nav {
  display: flex;
  align-items: stretch;
  gap: 10px;
  overflow-x: auto;
}

.sidebar-group {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  gap: 5px;
  padding-right: 10px;
  border-right: 1px solid var(--sidebar-line);
}

.sidebar-group:last-child {
  padding-right: 0;
  border-right: 0;
}

.sidebar-group-label {
  margin: 0 2px 0 0;
  color: var(--sidebar-muted);
  font-size: 10px;
  white-space: nowrap;
}

.nav-item {
  flex: 0 0 auto;
}
```

保留现有 `.sidebar-nav::-webkit-scrollbar` 隐藏规则和底部激活线。

- [ ] **Step 3: 运行 CSS 变更检查**

Run: `git diff --check`  
Expected: no whitespace errors。

- [ ] **Step 4: Commit**

```bash
git add apps/admin/src/app/globals.css
git commit -m "style: clarify admin navigation groups"
```

### Task 4: 完成全后台中文文案清理

**Files:**
- Modify: `apps/admin/src/components/admin-app.tsx`（所有固定 UI 文案）

**Interfaces:**
- Consumes: Task 1-3 的中文导航和分析摘要。
- Produces: 所有固定 UI 文案为中文；真实数据和技术值保持不变。

- [ ] **Step 1: 扫描固定英文文案**

Run:

```powershell
rg -n "[A-Z]{3,}|PRODUCT|BRAND|SCHEMA|SOURCE|IMAGE|ITEMS|RECORDS|STATUS|QUEUE|FORM|EDIT|NEW|READY|NOW|LATER|MANUAL|WEIGHTED|M2|M3|REV" apps/admin/src/components/admin-app.tsx
```

逐项判断：固定装饰文案翻译为中文；`slug`、URL、事件代码、产品型号、品牌英文名、Node.js 版本和 JSON 字段保留。

- [ ] **Step 2: 翻译各资料库页面的眉题与数量后缀**

将产品、品牌、类目、采集页面中的固定文案按以下规则处理：

| 区域 | 中文结果 |
|---|---|
| 产品清单眉题和加载状态 | `产品记录`、`读取中`、`已加载` |
| 产品编辑器眉题和状态 | `产品表单`、`编辑`、`新建`、`关联类目`、`未配置类目` |
| 品牌清单眉题和数量 | `品牌清单`、`条记录` |
| 类目清单眉题和数量 | `类目清单`、`个字段`、`个产品`、`个子类目` |
| 采集与导入状态 | `自动采集`、`来源依据`、`当前操作`、`手工操作`、`阶段二操作` |
| 内容审核和操作审计 | `举报队列`、`评论队列`、`审计记录`、`读取中` |

`spec_schema`、`slug`、JSON、URL、COS、API、Redis、Node.js 等技术值保留，但每个值旁边必须有中文字段名。

- [ ] **Step 3: 翻译状态值和 footer**

把 `BoundaryItem` 的 `READY`、`NOW`、`MANUAL`、`LATER` 改为中文传入值，例如 `已完成`、`当前可用`、`手工处理`、`后续处理`；把 `StatusBadge` 的状态继续通过 `statusText` 输出中文。固定 footer、版本、系统状态和登录页辅助文案全部使用中文。

- [ ] **Step 4: 再次扫描并保留明确例外**

Run:

```powershell
rg -n "CONTROL DESK|PRODUCT PIM|BRAND INDEX|SCHEMA FAMILY|INGEST STATUS|ANALYTICS|COMMUNITY MODERATION|AUDIT TRAIL|DATA QUALITY|RECENT ACTIVITY|PRODUCT RECORDS|SYSTEM STATUS|LOADING|LOADED|READY|LATER|MANUAL|WEIGHTED" apps/admin/src/components/admin-app.tsx
```

Expected: no matches。若输出来自实际数据、技术字段或 API 值，保持该值并确认旁边有中文字段说明。

- [ ] **Step 5: Commit**

```bash
git add apps/admin/src/components/admin-app.tsx
git commit -m "fix: remove decorative English from admin"
```

### Task 5: 集成验证与交付

**Files:**
- Verify: `apps/admin/src/components/admin-app.tsx`
- Verify: `apps/admin/src/app/globals.css`
- Verify: `docs/superpowers/specs/2026-09-16-admin-information-architecture-design.md`

**Interfaces:**
- Consumes: Tasks 1-4 的导航、首页分析摘要和中文文案。
- Produces: 可启动、可构建、无横向溢出的后台管理端。

- [ ] **Step 1: 检查工作区和差异**

Run:

```powershell
git status --short
git diff --check
git diff --stat
```

Expected: 只包含本计划涉及的后台文件和已提交的设计/计划文档，不包含 `.env`、`node_modules`、`.next` 或其他生成目录。

- [ ] **Step 2: 运行类型检查和生产构建**

Run:

```powershell
pnpm --filter @youpu/admin typecheck
pnpm --filter @youpu/admin build
```

Expected: 两条命令均以 exit code 0 完成。

- [ ] **Step 3: 启动后做页面级检查**

确保 API、Web 和 Admin 已启动后，访问 `http://localhost:3002`，使用本地管理令牌登录，检查：

1. 默认进入“总览”，标题为“数据总览”，分析指标在产品数量和内容质量之前。
2. 侧边栏显示“工作台 / 资料库 / 内容运营”，资料库下包含四个资料维护入口。
3. 点击“数据分析”仍能看到完整分析页；点击“产品资料、品牌、类目与参数、采集与导入”均能正常切换。
4. 浏览器缩窄到移动宽度后，分组导航可横向滚动，页面没有横向滚动条扩散到主体内容。
5. 页面中没有仅用于装饰的英文眉题、状态或 footer 文案；品牌名、型号、slug、URL 和事件代码等真实值可见且未被翻译。

- [ ] **Step 4: 提交集成变更**

```bash
git add apps/admin/src/components/admin-app.tsx apps/admin/src/app/globals.css
git commit -m "feat: reorganize admin dashboard around analytics"
```

- [ ] **Step 5: 最终报告**

报告以下事实：导航已分组、总览已优先展示分析、资料库已独立、固定英文已清理、类型检查/构建结果和本地访问地址。若页面级检查发现后端数据为空，只报告空态，不把空态误报为功能失败。
