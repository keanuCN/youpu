'use client';

import {
  adminBrandInputSchema,
  adminCategoryInputSchema,
  adminProductInputSchema,
  safeParseSpecSchema,
  type AdminBrandInput,
  type AdminCategoryInput,
  type AdminProductImage,
  type AdminProductInput,
  type SpecField,
  type SpecSchema,
} from '@youpu/schema';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  adminFetch,
  adminLogin,
  adminLogout,
  adminRefresh,
  AdminApiError,
  API_BASE,
  buildProductQuery,
  type AdminBrandRecord,
  type AdminAccount,
  type AdminAccountRole,
  type AdminAccountStatus,
  type AdminCategoryRecord,
  type AdminAnalytics,
  type AdminAuditLogResponse,
  type AdminDashboard,
  type AdminProductDetail,
  type AdminProductListResponse,
  type AdminProductSummary,
  type AdminReport,
  type AdminModerationRating,
} from '../lib/api';
import { visibleAdminSections, type AdminSection } from '../lib/admin-navigation';
import {
  clearAdminSession,
  loadAdminSession,
  saveAdminSession,
  type AdminAccountSession,
  type AdminSession,
} from '../lib/admin-session';
import { formatModerationReasons } from '../lib/moderation';

type Section = AdminSection;
type NoticeKind = 'success' | 'error' | 'info';
type ImageKind = AdminProductInput['images'][number]['kind'];
type DataSourceKind = NonNullable<AdminProductInput['dataSource']>['kind'];

interface Notice {
  kind: NoticeKind;
  text: string;
}

interface ProductFilters {
  search: string;
  status: '' | 'draft' | 'published';
  categorySlug: string;
  missing: '' | 'image' | 'price' | 'source' | 'scores';
}

interface AuditFilters {
  entity: '' | 'product' | 'brand' | 'category' | 'report' | 'rating';
  action: '' | 'create' | 'update' | 'publish' | 'hide' | 'moderate';
}

interface ImageDraft {
  id?: string;
  url: string;
  kind: ImageKind;
  alt: string;
  source: string;
  sortOrder: string;
}

interface ProductFormState {
  id?: string;
  slug: string;
  categorySlug: string;
  brandSlug: string;
  model: string;
  year: string;
  title: string;
  oneLiner: string;
  priceMin: string;
  priceMax: string;
  priceCurrency: string;
  coverUrl: string;
  status: 'draft' | 'published';
  sourceKind: DataSourceKind;
  sourceUrl: string;
  snapshotUrl: string;
  specs: Record<string, unknown>;
  editorialScores: Record<string, string>;
  images: ImageDraft[];
}

interface BrandFormState {
  id?: string;
  slug: string;
  name: string;
  nameCn: string;
  country: string;
  logoUrl: string;
  officialUrl: string;
  description: string;
  status: 'active' | 'inactive';
}

interface CategoryFormState {
  id?: string;
  slug: string;
  name: string;
  parentId: string;
  sortOrder: string;
  coverUrl: string;
  status: 'active' | 'inactive';
  specSchemaText: string;
  recommendConfigText: string;
}

type NavGroup = '核心监控' | '内容与装备中台' | '决策数据洞察' | '系统底座';

const navItems: Array<{ id: Section; index: string; label: string; group: NavGroup; icon: string }> = [
  { id: 'dashboard', index: '00', label: '运行总览', group: '核心监控', icon: '▦' },
  { id: 'products', index: '01', label: '装备与品类中心', group: '内容与装备中台', icon: '▣' },
  { id: 'brands', index: '02', label: '品牌资料', group: '内容与装备中台', icon: '◇' },
  { id: 'categories', index: '03', label: '参数详情与比对', group: '内容与装备中台', icon: '⇄' },
  { id: 'import', index: '04', label: '采集任务', group: '内容与装备中台', icon: '↥' },
  { id: 'analytics', index: '05', label: '决策与埋点分析', group: '决策数据洞察', icon: '⌁' },
  { id: 'moderation', index: '06', label: '内容审核', group: '系统底座', icon: '✓' },
  { id: 'audit', index: '07', label: '操作审计', group: '系统底座', icon: '◷' },
  { id: 'accounts', index: '08', label: '系统监控与运维', group: '系统底座', icon: '◎' },
];

const imageKinds: ImageKind[] = ['base', 'face', 'side', 'shape', 'field', 'card3x4'];
const imageKindLabels: Record<ImageKind, string> = {
  base: '基础图',
  face: '正面图',
  side: '侧面图',
  shape: '轮廓图',
  field: '场景图',
  card3x4: '卡片图',
};

function makeProductForm(categorySlug = '', brandSlug = ''): ProductFormState {
  return {
    slug: '',
    categorySlug,
    brandSlug,
    model: '',
    year: String(new Date().getFullYear()),
    title: '',
    oneLiner: '',
    priceMin: '',
    priceMax: '',
    priceCurrency: 'CNY',
    coverUrl: '',
    status: 'draft',
    sourceKind: 'manual',
    sourceUrl: '',
    snapshotUrl: '',
    specs: {},
    editorialScores: {},
    images: [],
  };
}

function productFormFromDetail(product: AdminProductDetail): ProductFormState {
  return {
    id: product.id,
    slug: product.slug,
    categorySlug: product.category.slug,
    brandSlug: product.brand.slug,
    model: product.model,
    year: String(product.year),
    title: product.title,
    oneLiner: product.oneLiner ?? '',
    priceMin: product.priceMin === null ? '' : String(product.priceMin),
    priceMax: product.priceMax === null ? '' : String(product.priceMax),
    priceCurrency: 'CNY',
    coverUrl: product.coverUrl ?? '',
    status: product.status,
    sourceKind: 'manual',
    sourceUrl: '',
    snapshotUrl: '',
    specs: { ...product.specs },
    editorialScores: Object.fromEntries(
      Object.entries(product.editorialScores ?? {}).map(([key, value]) => [key, String(value)]),
    ),
    images: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      kind: image.kind as ImageKind,
      alt: image.alt ?? '',
      source: image.source ?? '',
      sortOrder: String(image.sortOrder),
    })),
  };
}

function makeBrandForm(): BrandFormState {
  return {
    slug: '',
    name: '',
    nameCn: '',
    country: '',
    logoUrl: '',
    officialUrl: '',
    description: '',
    status: 'active',
  };
}

function brandFormFromRecord(brand: AdminBrandRecord): BrandFormState {
  return {
    id: brand.id,
    slug: brand.slug,
    name: brand.name,
    nameCn: brand.nameCn ?? '',
    country: brand.country ?? '',
    logoUrl: brand.logoUrl ?? '',
    officialUrl: brand.officialUrl ?? '',
    description: brand.description ?? '',
    status: brand.status,
  };
}

function makeCategoryForm(): CategoryFormState {
  return {
    slug: '',
    name: '',
    parentId: '',
    sortOrder: '0',
    coverUrl: '',
    status: 'active',
    specSchemaText: '',
    recommendConfigText: '',
  };
}

function categoryFormFromRecord(category: AdminCategoryRecord): CategoryFormState {
  return {
    id: category.id,
    slug: category.slug,
    name: category.name,
    parentId: category.parentId ?? '',
    sortOrder: String(category.sortOrder),
    coverUrl: category.coverUrl ?? '',
    status: category.status,
    specSchemaText: stringifyJson(category.specSchema),
    recommendConfigText: stringifyJson(category.recommendConfig),
  };
}

function stringifyJson(value: unknown): string {
  if (value === null || value === undefined) return '';
  return JSON.stringify(value, null, 2);
}

function parseNullableNumber(label: string, value: string): number | null {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) throw new Error(`${label} 必须是数字`);
  return parsed;
}

function parseRequiredNumber(label: string, value: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed)) throw new Error(`${label} 必须是整数`);
  return parsed;
}

function parseJsonText(label: string, value: string): unknown | null {
  if (!value.trim()) return null;
  try {
    return JSON.parse(value);
  } catch {
    throw new Error(`${label} 不是有效 JSON`);
  }
}

function normalizeSpecs(specs: Record<string, unknown>, schema: SpecSchema | null): Record<string, unknown> {
  const result = { ...specs };
  for (const field of schema?.fields ?? []) {
    const value = result[field.key];
    if (field.type === 'nested' && typeof value === 'string') {
      result[field.key] = parseJsonText(field.label, value) ?? [];
    }
  }
  return result;
}

export function buildProductPayload(form: ProductFormState, schema: SpecSchema | null): AdminProductInput {
  const editorialScores = Object.fromEntries(
    Object.entries(form.editorialScores)
      .filter(([, value]) => value.trim() !== '')
      .map(([key, value]) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) throw new Error(`评分 ${key} 必须是数字`);
        return [key, parsed];
      }),
  );
  const sourceUrl = form.sourceUrl.trim();
  const snapshotUrl = form.snapshotUrl.trim();
  const dataSource =
    sourceUrl || snapshotUrl
      ? {
          kind: form.sourceKind,
          ...(sourceUrl ? { originUrl: sourceUrl } : {}),
          ...(snapshotUrl ? { snapshotUrl } : {}),
        }
      : undefined;
  const candidate = {
    slug: form.slug.trim(),
    categorySlug: form.categorySlug,
    brandSlug: form.brandSlug,
    model: form.model.trim(),
    year: parseRequiredNumber('年份', form.year),
    title: form.title.trim(),
    oneLiner: form.oneLiner.trim() || null,
    priceMin: parseNullableNumber('最低价', form.priceMin),
    priceMax: parseNullableNumber('最高价', form.priceMax),
    priceCurrency: 'CNY',
    coverUrl: form.coverUrl.trim() || null,
    specs: normalizeSpecs(form.specs, schema),
    editorialScores: Object.keys(editorialScores).length > 0 ? editorialScores : null,
    images: form.images
      .filter((image) => image.url.trim())
      .map((image, index) => ({
        url: image.url.trim(),
        kind: image.kind,
        alt: image.alt.trim() || null,
        source: image.source.trim() || null,
        sortOrder: image.sortOrder.trim() ? Number(image.sortOrder) : index,
      })),
    dataSource,
    status: form.status,
  };
  const parsed = adminProductInputSchema.safeParse(candidate);
  if (!parsed.success) throw new Error(parsed.error.issues.map((issue) => issue.message).join('；'));
  return parsed.data;
}

function buildBrandPayload(form: BrandFormState): AdminBrandInput {
  const candidate = {
    slug: form.slug.trim(),
    name: form.name.trim(),
    nameCn: form.nameCn.trim() || null,
    country: form.country.trim() || null,
    logoUrl: form.logoUrl.trim() || null,
    officialUrl: form.officialUrl.trim() || null,
    description: form.description.trim() || null,
    status: form.status,
  };
  const parsed = adminBrandInputSchema.safeParse(candidate);
  if (!parsed.success) throw new Error(parsed.error.issues.map((issue) => issue.message).join('；'));
  return parsed.data;
}

function buildCategoryPayload(form: CategoryFormState): AdminCategoryInput {
  const candidate = {
    slug: form.slug.trim(),
    name: form.name.trim(),
    parentId: form.parentId || null,
    sortOrder: parseRequiredNumber('排序值', form.sortOrder),
    coverUrl: form.coverUrl.trim() || null,
    status: form.status,
    specSchema: parseJsonText('参数 schema', form.specSchemaText),
    recommendConfig: parseJsonText('推荐配置', form.recommendConfigText),
  };
  const parsed = adminCategoryInputSchema.safeParse(candidate);
  if (!parsed.success) throw new Error(parsed.error.issues.map((issue) => issue.message).join('；'));
  return parsed.data;
}

function getErrorText(error: unknown): string {
  if (error instanceof AdminApiError) return error.message;
  if (error instanceof Error) return error.message;
  return '操作失败，请检查 API 日志';
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function formatPrice(product: AdminProductSummary): string {
  if (product.priceMin === null && product.priceMax === null) return '未定价';
  const formatCny = (value: number) => `¥${new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 0 }).format(value)}`;
  const min = product.priceMin === null ? '' : formatCny(product.priceMin);
  const max = product.priceMax === null ? '' : formatCny(product.priceMax);
  return min && max && min !== max ? `${min}–${max}` : min || max;
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}

function formatRate(value: number | null | undefined): string {
  return value === null || value === undefined ? '—' : `${value}%`;
}

function formatShortDate(value: string): string {
  const parts = value.split('-');
  return parts.length === 3 ? `${Number(parts[1])}/${Number(parts[2])}` : value;
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days} 天 ${hours} 小时`;
  if (hours > 0) return `${hours} 小时 ${minutes} 分钟`;
  return `${minutes} 分钟`;
}

const eventLabels: Record<string, string> = {
  expose: '内容曝光',
  card_click: '卡片点击',
  detail_view: '产品详情',
  compare_add: '加入对比',
  compare_open: '打开对比',
  recommend_start: '开始推荐',
  recommend_complete: '完成推荐',
  search: '搜索',
  favorite_add: '收藏产品',
  rating_submit: '提交评分',
  reply_submit: '提交回复',
  signup: '注册',
  email_verify: '验证邮箱',
  share_card_download: '下载分享卡',
  outbound_click: '跳转官网',
};

function eventLabel(name: string): string {
  return eventLabels[name] ?? name;
}

const auditEntityLabels: Record<string, string> = {
  product: '产品',
  brand: '品牌',
  category: '类目',
  report: '举报',
  rating: '评论',
};

const auditActionLabels: Record<string, string> = {
  create: '创建',
  update: '更新',
  publish: '发布',
  hide: '下线',
  moderate: '审核',
};

function auditEntityLabel(value: string): string {
  return auditEntityLabels[value] ?? value;
}

function auditActionLabel(value: string): string {
  return auditActionLabels[value] ?? value;
}

const moderationTargetLabels: Record<string, string> = {
  rating: '评论',
  reply: '回复',
  product: '产品',
  account: '账号',
};

function moderationTargetLabel(value: string): string {
  return moderationTargetLabels[value] ?? '其他对象';
}

type ModerationTargetStatus = 'published' | 'hidden' | 'rejected';

function buildReportActionPayload(
  status: 'open' | 'resolved' | 'dismissed',
  targetStatus?: ModerationTargetStatus,
): { status: 'open' | 'resolved' | 'dismissed'; targetStatus?: ModerationTargetStatus } {
  return targetStatus ? { status, targetStatus } : { status };
}

function formatModerationRisk(risk: string): string {
  return risk === 'watch' ? '需关注' : risk === 'clear' ? '低风险' : risk;
}

const riderLevelLabels: Record<string, string> = {
  beginner: '新手',
  intermediate: '中级',
  advanced: '进阶',
  expert: '高阶',
};

function formatRiderProfile(profile: Record<string, unknown>): string {
  const fields: string[] = [];
  if (typeof profile.years === 'number') fields.push(`雪龄 ${profile.years} 年`);
  if (typeof profile.height === 'number') fields.push(`身高 ${profile.height} cm`);
  if (typeof profile.weight === 'number') fields.push(`体重 ${profile.weight} kg`);
  if (typeof profile.level === 'string') fields.push(`水平 ${riderLevelLabels[profile.level] ?? profile.level}`);
  if (typeof profile.boot_size === 'number') fields.push(`鞋码 ${profile.boot_size}`);
  if (typeof profile.home_resort === 'string' && profile.home_resort) fields.push(`常去雪场 ${profile.home_resort}`);
  return fields.join(' · ') || '未填写画像';
}

const qualityFieldLabels: Record<string, string> = {
  image: '缺图片',
  price: '缺价格',
  source: '缺来源',
  scores: '缺评分',
};

function qualityFieldLabel(value: string): string {
  return qualityFieldLabels[value] ?? value;
}

function formatAuditSnapshot(value: unknown): string {
  if (value === null || value === undefined) return '—';
  try {
    return JSON.stringify(value, null, 2) ?? '—';
  } catch {
    return String(value);
  }
}

function schemaForCategory(category: AdminCategoryRecord | undefined): SpecSchema | null {
  if (!category?.specSchema) return null;
  const parsed = safeParseSpecSchema(category.specSchema);
  return parsed.success ? parsed.data : null;
}

function schemaFieldCount(value: unknown): string {
  const parsed = safeParseSpecSchema(value);
  return parsed.success ? `${parsed.data.fields.length} 个字段` : '未配置 / 无效';
}

function fieldsByGroup(schema: SpecSchema): Array<[string, SpecField[]]> {
  const groups = new Map<string, SpecField[]>();
  for (const field of schema.fields) {
    const list = groups.get(field.group) ?? [];
    list.push(field);
    groups.set(field.group, list);
  }
  return [...groups.entries()];
}

function statusText(status: string): string {
  const labels: Record<string, string> = {
    published: '已发布',
    draft: '草稿',
    active: '启用',
    inactive: '停用',
    open: '待处理',
    resolved: '已处理',
    dismissed: '已驳回',
    hidden: '已隐藏',
    rejected: '已拒绝',
    clear: '低风险',
    watch: '需关注',
  };
  return labels[status] ?? status;
}

export function AdminApp() {
  const [hydrated, setHydrated] = useState(false);
  const [session, setSession] = useState<AdminSession | null>(null);
  const [token, setToken] = useState('');
  const [loginMode, setLoginMode] = useState<'account' | 'legacy-token'>('account');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginToken, setLoginToken] = useState('');
  const [sessionState, setSessionState] = useState<'checking' | 'signed-out' | 'signed-in'>('checking');
  const [role, setRole] = useState('');
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [notice, setNotice] = useState<Notice | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);
  const [dashboard, setDashboard] = useState<AdminDashboard | null>(null);
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [analyticsDays, setAnalyticsDays] = useState<7 | 14 | 30>(14);
  const [analyticsBusy, setAnalyticsBusy] = useState(false);
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [moderationRatings, setModerationRatings] = useState<AdminModerationRating[]>([]);
  const [moderationBusy, setModerationBusy] = useState(false);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogResponse | null>(null);
  const [auditFilters, setAuditFilters] = useState<AuditFilters>({ entity: '', action: '' });
  const [auditBusy, setAuditBusy] = useState(false);
  const [products, setProducts] = useState<AdminProductListResponse | null>(null);
  const [brands, setBrands] = useState<AdminBrandRecord[]>([]);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [accountsBusy, setAccountsBusy] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({ search: '', status: '', categorySlug: '', missing: '' });
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({ search: '', status: '', categorySlug: '', missing: '' });
  const [categoryQuery, setCategoryQuery] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [productForm, setProductForm] = useState<ProductFormState | null>(null);
  const [brandForm, setBrandForm] = useState<BrandFormState | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState | null>(null);
  const hasOpenEditor = productForm !== null || brandForm !== null || categoryForm !== null;
  const visibleSections = useMemo(() => new Set(visibleAdminSections(role)), [role]);
  let refreshPromise: Promise<AdminAccountSession> | null = null;

  async function refreshAccountSession(currentSession: AdminAccountSession): Promise<AdminAccountSession> {
    if (!refreshPromise) {
      refreshPromise = adminRefresh(currentSession.refreshToken)
        .then((response) => {
          const nextSession: AdminAccountSession = { kind: 'account', ...response };
          saveAdminSession(window.localStorage, nextSession);
          setSession(nextSession);
          setToken(nextSession.accessToken);
          setRole(nextSession.account.role);
          return nextSession;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }
    return refreshPromise;
  }

  async function callAdmin<T>(path: string, options: Parameters<typeof adminFetch>[2] = {}): Promise<T> {
    const currentSession = session;
    if (!currentSession) throw new AdminApiError('后台会话不存在', 401);
    const currentToken = currentSession.kind === 'account' ? currentSession.accessToken : currentSession.token;
    try {
      return await adminFetch<T>(currentToken, path, options);
    } catch (error) {
      if (!(error instanceof AdminApiError) || error.status !== 401 || currentSession.kind !== 'account') {
        throw error;
      }
      const nextSession = await refreshAccountSession(currentSession);
      return adminFetch<T>(nextSession.accessToken, path, options);
    }
  }

  useEffect(() => {
    if (!hasOpenEditor) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenEditor]);

  useEffect(() => {
    const savedSession = loadAdminSession(window.localStorage);
    setSession(savedSession);
    if (savedSession) {
      setToken(savedSession.kind === 'account' ? savedSession.accessToken : savedSession.token);
      setRole(savedSession.kind === 'account' ? savedSession.account.role : '');
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token || !session) {
      setSessionState('signed-out');
      return;
    }

    let alive = true;
    setSessionState('checking');
    (async () => {
      try {
        const identity = await callAdmin<{ authenticated: boolean; role: string }>('/auth/me');
        if (!alive) return;
        setRole(identity.role);
        const [nextDashboard, nextBrands, nextCategories] = await Promise.all([
          callAdmin<AdminDashboard>('/dashboard'),
          callAdmin<AdminBrandRecord[]>('/brands'),
          callAdmin<AdminCategoryRecord[]>('/categories'),
        ]);
        if (!alive) return;
        setDashboard(nextDashboard);
        setBrands(nextBrands);
        setCategories(nextCategories);
        setSessionState('signed-in');
      } catch (error) {
        if (!alive) return;
        if (error instanceof AdminApiError && (error.status === 401 || error.status === 403)) {
          clearAdminSession(window.localStorage);
          setSession(null);
          setToken('');
          setRole('');
          setSessionState('signed-out');
          setNotice({ kind: 'error', text: '管理令牌无效或已失效，请重新登录' });
          return;
        }
        setSessionState('signed-in');
        setNotice({ kind: 'error', text: getErrorText(error) });
      }
    })();
    return () => {
      alive = false;
    };
  }, [hydrated, token, session]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token) return;
    let alive = true;
    (async () => {
      try {
        const response = await callAdmin<AdminProductListResponse>(
          `/products${buildProductQuery({
            search: appliedFilters.search.trim(),
            status: appliedFilters.status,
            categorySlug: appliedFilters.categorySlug,
            missing: appliedFilters.missing,
            page: 1,
            pageSize: 50,
          })}`,
        );
        if (alive) setProducts(response);
      } catch (error) {
        if (alive) setNotice({ kind: 'error', text: getErrorText(error) });
      }
    })();
    return () => {
      alive = false;
    };
  }, [appliedFilters, sessionState, token]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token) return;
    let alive = true;
    setAnalyticsBusy(true);
    callAdmin<AdminAnalytics>(`/analytics?days=${analyticsDays}`)
      .then((response) => {
        if (alive) setAnalytics(response);
      })
      .catch((error) => {
        if (alive) setNotice({ kind: 'error', text: getErrorText(error) });
      })
      .finally(() => {
        if (alive) setAnalyticsBusy(false);
      });
    return () => {
      alive = false;
    };
  }, [analyticsDays, sessionState, token]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token || activeSection !== 'moderation') return;
    void refreshModeration();
    // 只在进入审核页时读取，避免后台页面无意义地轮询社区数据。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, sessionState, token]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token || activeSection !== 'audit') return;
    void refreshAuditLogs();
    // 只在进入审计页或筛选条件变化时读取。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, auditFilters, sessionState, token]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token || activeSection !== 'accounts' || role !== 'admin') return;
    void refreshAccounts();
    // 账号页只在进入页面时读取，修改后由操作函数主动刷新。
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, role, sessionState, token]);

  async function refreshWorkspace() {
    if (!session) return;
    const [nextDashboard, nextProducts, nextBrands, nextCategories] = await Promise.all([
      callAdmin<AdminDashboard>('/dashboard'),
      callAdmin<AdminProductListResponse>(
        `/products${buildProductQuery({
          search: appliedFilters.search.trim(),
          status: appliedFilters.status,
          categorySlug: appliedFilters.categorySlug,
          missing: appliedFilters.missing,
          page: 1,
          pageSize: 50,
        })}`,
      ),
      callAdmin<AdminBrandRecord[]>('/brands'),
      callAdmin<AdminCategoryRecord[]>('/categories'),
    ]);
    setDashboard(nextDashboard);
    setProducts(nextProducts);
    setBrands(nextBrands);
    setCategories(nextCategories);
  }

  async function refreshAnalytics() {
    if (!token) return;
    setAnalyticsBusy(true);
    try {
      setAnalytics(await callAdmin<AdminAnalytics>(`/analytics?days=${analyticsDays}`));
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setAnalyticsBusy(false);
    }
  }

  async function refreshOverview() {
    await Promise.all([
      refreshWorkspace(),
      refreshAnalytics(),
    ]);
  }

  async function refreshModeration() {
    if (!token) return;
    setModerationBusy(true);
    try {
      const [nextReports, nextRatings] = await Promise.all([
        callAdmin<AdminReport[]>('/moderation/reports'),
        callAdmin<AdminModerationRating[]>('/moderation/ratings'),
      ]);
      setReports(nextReports);
      setModerationRatings(nextRatings);
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setModerationBusy(false);
    }
  }

  async function refreshAuditLogs() {
    if (!token) return;
    setAuditBusy(true);
    try {
      const query = new URLSearchParams();
      if (auditFilters.entity) query.set('entity', auditFilters.entity);
      if (auditFilters.action) query.set('action', auditFilters.action);
      query.set('page', '1');
      query.set('pageSize', '50');
      const suffix = query.toString();
      setAuditLogs(await callAdmin<AdminAuditLogResponse>(`/audit-logs?${suffix}`));
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setAuditBusy(false);
    }
  }

  async function refreshAccounts() {
    if (!token || role !== 'admin') return;
    setAccountsBusy(true);
    try {
      setAccounts(await callAdmin<AdminAccount[]>('/accounts'));
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setAccountsBusy(false);
    }
  }

  async function updateAccountAccess(id: string, patch: { role?: AdminAccountRole; status?: AdminAccountStatus }) {
    if (!token || role !== 'admin') return;
    setBusyAction(`account-${id}`);
    try {
      await callAdmin<AdminAccount>(`/accounts/${id}`, { method: 'PATCH', body: patch });
      await refreshAccounts();
      setNotice({ kind: 'success', text: '账号权限已更新' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function updateReportStatus(id: string, status: 'open' | 'resolved' | 'dismissed', targetStatus?: ModerationTargetStatus) {
    if (!token) return;
    setBusyAction(`report-${id}`);
    try {
      await callAdmin(`/moderation/reports/${id}`, {
        method: 'PATCH',
        body: buildReportActionPayload(status, targetStatus),
      });
      await refreshModeration();
      setNotice({ kind: 'success', text: '举报状态已更新' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function updateRatingStatus(id: string, status: 'published' | 'hidden' | 'rejected') {
    if (!token) return;
    setBusyAction(`rating-${id}`);
    try {
      await callAdmin(`/moderation/ratings/${id}`, { method: 'PATCH', body: { status } });
      await refreshModeration();
      setNotice({ kind: 'success', text: '评论状态已更新，产品聚合会异步重算' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusyAction('login');
    setNotice(null);
    try {
      if (loginMode === 'account') {
        const email = loginEmail.trim();
        if (!email || !loginPassword) {
          setNotice({ kind: 'error', text: '请输入邮箱和密码' });
          return;
        }
        const response = await adminLogin(email, loginPassword);
        const nextSession: AdminAccountSession = { kind: 'account', ...response };
        saveAdminSession(window.localStorage, nextSession);
        setSession(nextSession);
        setRole(nextSession.account.role);
        setToken(nextSession.accessToken);
        setLoginPassword('');
        setNotice({ kind: 'success', text: '登录成功' });
      } else {
        const value = loginToken.trim();
        if (value.length < 16) {
          setNotice({ kind: 'error', text: '管理令牌至少需要 16 个字符' });
          return;
        }
        const identity = await adminFetch<{ authenticated: boolean; role: string }>(value, '/auth/me');
        const nextSession: AdminSession = { kind: 'legacy-token', token: value };
        saveAdminSession(window.localStorage, nextSession);
        setSession(nextSession);
        setRole(identity.role);
        setToken(value);
        setNotice({ kind: 'success', text: '管理令牌验证通过' });
      }
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function logout() {
    const currentSession = session;
    if (currentSession?.kind === 'account') {
      try {
        await adminLogout(currentSession.refreshToken);
      } catch {
        // 即使退出接口不可用，也要清除本地会话。
      }
    }
    clearAdminSession(window.localStorage);
    setSession(null);
    setToken('');
    setLoginEmail('');
    setLoginPassword('');
    setLoginToken('');
    setRole('');
    setProductForm(null);
    setBrandForm(null);
    setCategoryForm(null);
    setNotice({ kind: 'info', text: '已退出后台' });
  }

  function openNewProduct() {
    setProductForm(makeProductForm(categories[0]?.slug, brands[0]?.slug));
    setActiveSection('products');
    setNotice(null);
  }

  async function openProduct(product: AdminProductSummary) {
    setBusyAction(`product:${product.id}`);
    setNotice(null);
    try {
      const detail = await callAdmin<AdminProductDetail>(`/products/${product.id}`);
      setProductForm(productFormFromDetail(detail));
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleProductSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!productForm) return;
    setBusyAction('product-save');
    setNotice(null);
    try {
      const selectedCategory = categories.find((category) => category.slug === productForm.categorySlug);
      const payload = buildProductPayload(productForm, schemaForCategory(selectedCategory));
      if (productForm.id) {
        await callAdmin(`/products/${productForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await callAdmin('/products', { method: 'POST', body: payload });
      }
      setProductForm(null);
      await refreshWorkspace();
      setNotice({ kind: 'success', text: productForm.id ? '产品资料已更新' : '产品草稿已创建' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleBrandSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!brandForm) return;
    setBusyAction('brand-save');
    setNotice(null);
    try {
      const payload = buildBrandPayload(brandForm);
      if (brandForm.id) {
        await callAdmin(`/brands/${brandForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await callAdmin('/brands', { method: 'POST', body: payload });
      }
      setBrandForm(null);
      await refreshWorkspace();
      setNotice({ kind: 'success', text: brandForm.id ? '品牌资料已更新' : '品牌已创建' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  async function handleCategorySubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!categoryForm) return;
    setBusyAction('category-save');
    setNotice(null);
    try {
      const payload = buildCategoryPayload(categoryForm);
      if (categoryForm.id) {
        await callAdmin(`/categories/${categoryForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await callAdmin('/categories', { method: 'POST', body: payload });
      }
      setCategoryForm(null);
      await refreshWorkspace();
      setNotice({ kind: 'success', text: categoryForm.id ? '类目已更新' : '类目已创建' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  function updateSpecValue(key: string, value: unknown) {
    setProductForm((current) => {
      if (!current) return current;
      const specs = { ...current.specs };
      if (value === undefined || value === '') delete specs[key];
      else specs[key] = value;
      return { ...current, specs };
    });
  }

  function updateImage(index: number, key: keyof ImageDraft, value: string) {
    setProductForm((current) => {
      if (!current) return current;
      const images = current.images.map((image, imageIndex) =>
        imageIndex === index ? { ...image, [key]: value } : image,
      );
      return { ...current, images };
    });
  }

  const editorCategory = productForm
    ? categories.find((category) => category.slug === productForm.categorySlug)
    : undefined;
  const editorSchema = schemaForCategory(editorCategory);

  if (!hydrated || sessionState === 'checking') {
    return <div className="boot-screen"><span className="boot-mark">有谱</span><span>正在校验工作台连接……</span></div>;
  }

  if (sessionState === 'signed-out' || !token) {
    return (
      <main className="login-screen">
        <div className="login-grid-mark" aria-hidden="true">+</div>
        <section className="login-card">
          <p className="eyebrow">有谱 / 后台管理 / 第二阶段</p>
          <h1>有谱<br /><em>资料工作台</em></h1>
          <p className="login-copy">产品资料、类目参数与采集状态的单一操作入口。</p>
          <div className="login-mode-switch" role="tablist" aria-label="登录方式">
            <button className={loginMode === 'account' ? 'login-mode is-active' : 'login-mode'} type="button" onClick={() => setLoginMode('account')}>账号登录</button>
            <button className={loginMode === 'legacy-token' ? 'login-mode is-active' : 'login-mode'} type="button" onClick={() => setLoginMode('legacy-token')}>旧令牌登录</button>
          </div>
          <form onSubmit={handleLogin} className="login-form">
            {loginMode === 'account' ? <>
              <label className="field">
                <span>邮箱</span>
                <input value={loginEmail} onChange={(event) => setLoginEmail(event.target.value)} type="email" autoComplete="username" placeholder="输入后台账号邮箱" />
              </label>
              <label className="field">
                <span>密码</span>
                <input value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} type="password" autoComplete="current-password" placeholder="输入密码" />
              </label>
            </> : <label className="field">
              <span>管理令牌</span>
              <input value={loginToken} onChange={(event) => setLoginToken(event.target.value)} type="password" autoComplete="current-password" placeholder="输入管理令牌" />
            </label>}
            <button className="button button-primary button-block" type="submit" disabled={busyAction === 'login'}>
              {busyAction === 'login' ? '登录中……' : '进入工作台  →'}
            </button>
          </form>
          <div className="login-footnote">
            <span>{loginMode === 'account' ? '账号会话自动续期' : '兼容旧版管理令牌'}</span>
            <span>仅限本地使用</span>
          </div>
          {notice && <Notice notice={notice} />}
        </section>
      </main>
    );
  }

  function openMissingProducts(missing: Exclude<ProductFilters['missing'], ''>) {
    const nextFilters: ProductFilters = { search: '', status: '', categorySlug: '', missing };
    setFilters(nextFilters);
    setAppliedFilters(nextFilters);
    setSelectedProductIds([]);
    setActiveSection('products');
    setNotice(null);
  }

  function renderDashboard() {
    const metrics = dashboard?.metrics;
    const summary = analytics?.summary;
    const missingTotal = metrics
      ? metrics.dataQuality.noVisualAsset + metrics.dataQuality.noPrice + metrics.dataQuality.noSource + metrics.dataQuality.noEditorialScores
      : '—';
    return (
      <div className="dashboard-page">
        <section className="dashboard-hero">
          <div className="dashboard-hero-copy">
            <div className="dashboard-live"><span className="status-dot status-dot-good" /> <strong>REALTIME AGGREGATION</strong><span>数据同步状态：{analyticsBusy ? '读取中' : '已连接'}</span></div>
            <h1>欢迎回来，管理员</h1>
            <p>当前有 <strong>{metrics?.drafts ?? '—'}</strong> 项内容待处理，<strong className="dashboard-alert-text">{missingTotal}</strong> 条资料缺口待补齐。</p>
          </div>
          <div className="dashboard-hero-actions">
            <label className="range-select"><span>统计范围</span><select value={analyticsDays} onChange={(event) => setAnalyticsDays(Number(event.target.value) as 7 | 14 | 30)}><option value="7">最近 7 天</option><option value="14">最近 14 天</option><option value="30">最近 30 天</option></select></label>
            <button className="button" type="button" onClick={() => void refreshOverview().catch((error) => setNotice({ kind: 'error', text: getErrorText(error) }))} disabled={analyticsBusy}>{analyticsBusy ? '读取中……' : '刷新数据'}</button>
          </div>
        </section>
        <div className="metric-grid dashboard-metric-grid">
          <Metric label="装备库收录总数" value={metrics?.products ?? '—'} detail="产品记录" accent />
          <Metric label="覆盖品牌 / 细分类" value={`${metrics?.brands ?? '—'} / ${metrics?.categories ?? '—'}`} detail="品牌 / 类目" />
          <Metric label="待处理内容流" value={metrics?.drafts ?? '—'} detail="草稿队列" />
          <Metric label="独立访客（UV）" value={summary?.uniqueVisitors ?? '—'} detail={`最近 ${analyticsDays} 天`} />
          <Metric label="决策事件总数" value={summary?.events ?? '—'} detail="埋点事件" />
        </div>
        {renderAnalyticsOverview()}
        <section className="data-panel quality-overview-panel">
          <PanelHeader eyebrow="数据质量" title="内容补齐队列" meta="目录质量" />
          <div className="quality-overview-grid">
            <button type="button" className="quality-overview-item" onClick={() => openMissingProducts('image')}>
              <span>缺图片</span>
              <strong>{metrics?.dataQuality.noVisualAsset ?? '—'}</strong>
              <small>没有封面或产品图</small>
            </button>
            <button type="button" className="quality-overview-item" onClick={() => openMissingProducts('price')}>
              <span>缺价格</span>
              <strong>{metrics?.dataQuality.noPrice ?? '—'}</strong>
              <small>最低价和最高价都为空</small>
            </button>
            <button type="button" className="quality-overview-item" onClick={() => openMissingProducts('source')}>
              <span>缺来源</span>
              <strong>{metrics?.dataQuality.noSource ?? '—'}</strong>
              <small>没有来源留痕</small>
            </button>
            <button type="button" className="quality-overview-item" onClick={() => openMissingProducts('scores')}>
              <span>缺编辑评分</span>
              <strong>{metrics?.dataQuality.noEditorialScores ?? '—'}</strong>
              <small>没有编辑分项评分</small>
            </button>
          </div>
          <p className="quality-overview-note">点击任一项进入产品资料并筛选待补记录；“缺图片”只统计没有封面和产品图的产品。</p>
        </section>
        <div className="dashboard-grid">
          <section className="data-panel">
            <PanelHeader eyebrow="最近活动" title="最近更新" meta="最近 5 条" />
            {dashboard?.recentProducts?.length ? (
              <div className="activity-list">
                {dashboard.recentProducts.map((product) => (
                  <button key={product.id} className="activity-row" onClick={() => {
                    setActiveSection('products');
                    void openProduct({
                      ...product,
                      oneLiner: null,
                      priceMin: null,
                      priceMax: null,
                      priceCurrency: 'CNY',
                      coverUrl: null,
                      specs: {},
                      editorialScores: null,
                      dataSource: null,
                      publishedAt: null,
                      createdAt: product.updatedAt,
                      imageCount: 0,
                      coverImage: null,
                      quality: { missing: [] },
                    });
                  }}>
                    <span className="activity-code">{product.status === 'published' ? '已发布' : '草稿'}</span>
                    <span className="activity-main"><strong>{product.title}</strong><small>{product.brand.nameCn || product.brand.name} / {product.category.name}</small></span>
                    <time>{formatDate(product.updatedAt)}</time>
                  </button>
                ))}
              </div>
            ) : (
              <EmptyState title="暂无更新记录" detail="数据库接通后，最近修改会显示在这里。" />
            )}
          </section>
          <section className="data-panel boundary-panel">
            <PanelHeader eyebrow="当前工作边界" title="当前工作边界" meta="版本 0.1" />
            <div className="boundary-list">
              <BoundaryItem state="现在" title="产品 / 品牌 / 类目 CRUD" detail="共享 schema 校验，产品支持草稿与发布状态。" />
              <BoundaryItem state="现在" title="动态参数表单" detail="字段来自类目的 spec_schema，不重复维护字段定义。" />
              <BoundaryItem state="手工处理" title="图片上传" detail="当前录入图片 URL；质量筛选已可用，COS 上传与裁切留到后续版本。" />
              <BoundaryItem state="现在" title="操作审计基础版" detail="后台变更会留下操作人、动作和前后快照；多账号权限属于后续版本。" />
            </div>
          </section>
        </div>
      </div>
    );
  }

  function renderProducts() {
    const categorySearch = categoryQuery.trim().toLowerCase();
    const categoryRoots = categories
      .filter((category) => !category.parentId)
      .filter((category) => !categorySearch || category.name.toLowerCase().includes(categorySearch) || category.slug.toLowerCase().includes(categorySearch))
      .sort((left, right) => left.sortOrder - right.sortOrder);
    const selectedOnPage = products?.items.filter((product) => selectedProductIds.includes(product.id)) ?? [];
    const allVisibleSelected = Boolean(products?.items.length) && selectedOnPage.length === products?.items.length;
    const setCategoryFilter = (categorySlug: string) => {
      const nextFilters = { ...filters, categorySlug };
      setFilters(nextFilters);
      setAppliedFilters(nextFilters);
      setSelectedProductIds([]);
    };
    const toggleProductSelection = (productId: string) => {
      setSelectedProductIds((current) => current.includes(productId) ? current.filter((id) => id !== productId) : [...current, productId]);
    };
    const togglePageSelection = () => {
      if (!products?.items.length) return;
      setSelectedProductIds(allVisibleSelected ? [] : products.items.map((product) => product.id));
    };
    const showBulkNotice = (action: string) => {
      setNotice({ kind: 'info', text: `${action}已记录为待接入动作，当前版本不会直接改写产品数据。` });
    };

    return (
      <>
        <section className="product-workspace-heading">
          <div className="product-breadcrumb"><span>中台工作区</span><b>›</b><span>装备与品类中心</span>{filters.categorySlug ? <><b>›</b><strong>{categories.find((category) => category.slug === filters.categorySlug)?.name ?? filters.categorySlug}</strong></> : null}</div>
          <div className="product-heading-row">
            <div>
              <div className="product-heading-title-row"><h1>装备与品类中心</h1><span className="product-schema-badge">SCHEMA / 动态参数</span><span className="product-live-state"><i />实时同步活跃</span></div>
              <p>按品类、品牌和资料完整度管理装备目录；产品参数由类目 schema 约束。</p>
            </div>
            <div className="product-stat-strip">
              <div><span>当前产品</span><strong>{products?.total ?? '—'}</strong><small>条记录</small></div>
              <div><span>当前页资料完整</span><strong>{products ? `${products.items.filter((product) => product.quality.missing.length === 0).length}` : '—'}</strong><small>/ {products?.items.length ?? '—'}</small></div>
              <div className="product-stat-alert"><span>待补资料</span><strong>{products ? products.items.filter((product) => product.quality.missing.length > 0).length : '—'}</strong><small>当前页</small></div>
            </div>
          </div>
        </section>

        <div className="product-workspace">
          <aside className="category-rail">
            <div className="category-rail-head"><div><p className="eyebrow">目录导航</p><h2>品类层级树</h2></div><button className="icon-button" type="button" aria-label="刷新目录" onClick={() => void refreshWorkspace()}>⟳</button></div>
            <label className="category-search"><span aria-hidden="true">⌕</span><input value={categoryQuery} onChange={(event) => setCategoryQuery(event.target.value)} placeholder="过滤品类名称、代码…" /></label>
            <div className="category-tree">
              <button className={!filters.categorySlug ? 'category-tree-item is-active' : 'category-tree-item'} type="button" onClick={() => setCategoryFilter('')}><span>▦</span><strong>全部装备</strong><small>{products?.total ?? '—'}</small></button>
              {categoryRoots.map((root) => {
                const children = categories.filter((category) => category.parentId === root.id).sort((left, right) => left.sortOrder - right.sortOrder);
                return <div className="category-tree-group" key={root.id}><button className={filters.categorySlug === root.slug ? 'category-tree-item is-active' : 'category-tree-item'} type="button" onClick={() => setCategoryFilter(root.slug)}><span>⌄</span><strong>{root.name}</strong><small>{root.productCount}</small></button>{children.map((child) => <button className={filters.categorySlug === child.slug ? 'category-tree-child is-active' : 'category-tree-child'} type="button" key={child.id} onClick={() => setCategoryFilter(child.slug)}><span>•</span><strong>{child.name}</strong><small>{child.productCount}</small></button>)}</div>;
              })}
              {!categoryRoots.length ? <div className="category-tree-empty">目录加载后会显示层级和产品数量。</div> : null}
            </div>
            <div className="category-rail-actions"><button className="category-action-button" type="button" onClick={() => { setActiveSection('categories'); setNotice(null); }}>⊕ 新增子品类节点</button><button className="category-action-button is-muted" type="button" onClick={() => { setActiveSection('categories'); setNotice({ kind: 'info', text: '类目映射规则将在类目参数页维护。' }); }}>⌘ 类目映射与同义词规则</button></div>
          </aside>

          <section className="product-list-pane">
            <form className="product-query-panel" onSubmit={(event) => { event.preventDefault(); setAppliedFilters({ ...filters }); setSelectedProductIds([]); }}>
              <div className="product-query-row"><label className="product-query-input"><span aria-hidden="true">⌕</span><input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="冲锋衣 GORE-TEX / 型号 / SKU" /><kbd>⌘K</kbd></label><button className="button button-primary" type="submit">⌕ 执行查询</button><button className="button icon-button" type="button" aria-label="重置筛选" onClick={() => { const nextFilters: ProductFilters = { search: '', status: '', categorySlug: '', missing: '' }; setFilters(nextFilters); setAppliedFilters(nextFilters); setCategoryQuery(''); setSelectedProductIds([]); }}>⟳</button></div>
              <div className="product-filter-row"><span className="product-filter-label">发布状态：</span>{([['', '全部'], ['published', '已发布'], ['draft', '草稿']] as const).map(([value, label]) => <button className={filters.status === value ? 'filter-pill is-active' : 'filter-pill'} type="button" key={value} onClick={() => { const nextFilters = { ...filters, status: value }; setFilters(nextFilters); setAppliedFilters(nextFilters); }}>{label}{value === '' && products ? ` ${products.total}` : ''}</button>)}<label className="product-data-filter"><span>资料</span><select value={filters.missing} onChange={(event) => setFilters((current) => ({ ...current, missing: event.target.value as ProductFilters['missing'] }))}><option value="">全部资料</option><option value="image">缺图片</option><option value="price">缺价格</option><option value="source">缺来源</option><option value="scores">缺编辑评分</option></select></label></div>
            </form>

            <div className="product-bulk-bar"><label className="bulk-selection"><input type="checkbox" checked={allVisibleSelected} onChange={togglePageSelection} />已勾选 <strong>{selectedOnPage.length}</strong> 项装备</label><div className="bulk-actions"><button className="button button-primary" type="button" disabled={!selectedOnPage.length} onClick={() => showBulkNotice('批量发布')}>↥ 批量发布</button><button className="button" type="button" disabled={!selectedOnPage.length} onClick={() => showBulkNotice('批量重新采集')}>⟳ 批量重新采集</button><button className="button" type="button" disabled={!selectedOnPage.length} onClick={() => showBulkNotice('分配审核人')}>♙ 分配审核人</button><button className="button button-danger" type="button" disabled={!selectedOnPage.length} onClick={() => showBulkNotice('批量下架')}>⊟ 批量下架</button></div><button className="text-button bulk-export" type="button" onClick={() => showBulkNotice('导出结构化数据')}>⇩ 导出 JSON / CSV</button></div>

            <section className="data-panel table-panel product-workspace-panel"><div className="product-table-heading"><div><p className="eyebrow">产品记录</p><h2>装备清单</h2></div><span>{products ? `${products.items.length} 条已加载` : '读取中……'}</span></div><div className="table-wrap"><table className="data-table product-workspace-table"><thead><tr><th className="selection-column"><input type="checkbox" aria-label="选择当前页" checked={allVisibleSelected} onChange={togglePageSelection} /></th><th>商品基本信息 / 型号规格</th><th>品牌与细分类</th><th>参考价与采价渠道</th><th>资料状态</th><th /></tr></thead><tbody>{products?.items?.map((product) => { const checked = selectedProductIds.includes(product.id); return <tr key={product.id} className={checked ? 'is-selected' : ''}><td className="selection-column"><input type="checkbox" aria-label={`选择${product.title}`} checked={checked} onChange={() => toggleProductSelection(product.id)} /></td><td><div className="workspace-product-cell"><div className="product-thumb">{product.coverImage?.url ? <img src={product.coverImage.url} alt="" /> : <span>暂无图</span>}</div><div><span className="product-code">{product.model || product.slug}</span><button className="workspace-product-title" type="button" onClick={() => void openProduct(product)}>{product.title}</button><small>SKU：{product.id.slice(0, 8)} · 图片 {product.imageCount} 张</small></div></div></td><td><strong>{product.brand.nameCn || product.brand.name}</strong><small className="table-sub">{product.category.name}</small></td><td><data>{formatPrice(product)}</data><small className="table-sub">{product.dataSource || '来源待补'}</small></td><td>{product.quality.missing.length ? <div className="quality-tags">{product.quality.missing.map((field) => <span className="quality-tag" key={field}>{qualityFieldLabel(field)}</span>)}</div> : <span className="quality-ok">资料完整</span>}<small className="table-sub"><StatusBadge status={product.status} /></small></td><td><button className="text-button" type="button" onClick={() => void openProduct(product)} disabled={busyAction === `product:${product.id}`}>{busyAction === `product:${product.id}` ? '读取中' : '编辑 →'}</button></td></tr>; })}</tbody></table></div>{!products?.items?.length && <EmptyState title="没有匹配的产品" detail="调整筛选条件，或先创建一条产品草稿。" />}<div className="product-pagination"><span>显示当前页 <strong>{products?.items.length ?? 0}</strong> 条，共 <strong>{products?.total ?? '—'}</strong> 条装备</span><div><button className="pagination-button" type="button" disabled>‹</button><button className="pagination-button is-active" type="button">1</button><button className="pagination-button" type="button" disabled>›</button></div></div></section>
            <div className="ingest-status-bar"><code>INGEST WORKSPACE</code><span>采集任务、来源快照和增量更新在采集任务页统一查看。</span><button className="text-button" type="button" onClick={() => { setActiveSection('import'); setNotice(null); }}>查看采集任务 →</button></div>
          </section>
        </div>
        {productForm && renderProductEditor()}
      </>
    );
  }

  function renderProductEditor() {
    if (!productForm) return null;
    return (
      <div className="drawer-layer" role="presentation">
        <button className="drawer-backdrop" aria-label="关闭编辑器" onClick={() => setProductForm(null)} />
        <aside className="drawer" role="dialog" aria-modal="true" aria-label="产品编辑器">
          <div className="drawer-head"><div><p className="eyebrow">产品表单 / {productForm.id ? '编辑' : '新建'}</p><h2>{productForm.id ? '编辑产品' : '新建产品'}</h2></div><button className="close-button" type="button" onClick={() => setProductForm(null)}>×</button></div>
          <form className="drawer-form" onSubmit={handleProductSubmit}>
            <div className="form-section"><div className="form-section-head"><span>01</span><h3>基础识别</h3></div><div className="form-grid">
              <Field label="标题" required><input required value={productForm.title} onChange={(event) => setProductForm((current) => current && ({ ...current, title: event.target.value }))} placeholder="例如：Burton Custom Camber" /></Field>
              <Field label="型号" required><input required value={productForm.model} onChange={(event) => setProductForm((current) => current && ({ ...current, model: event.target.value }))} placeholder="Custom Camber" /></Field>
              <Field label="路径标识（slug）" required hint="小写短横线格式"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={productForm.slug} onChange={(event) => setProductForm((current) => current && ({ ...current, slug: event.target.value }))} placeholder="burton-custom-camber-2025" /></Field>
              <Field label="年份" required><input required type="number" min="2000" max="2100" step="1" value={productForm.year} onChange={(event) => setProductForm((current) => current && ({ ...current, year: event.target.value }))} /></Field>
              <Field label="品牌" required><select required value={productForm.brandSlug} onChange={(event) => setProductForm((current) => current && ({ ...current, brandSlug: event.target.value }))}><option value="">选择品牌</option>{brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.nameCn || brand.name} / {brand.slug}</option>)}</select></Field>
              <Field label="类目" required hint={editorSchema ? `${editorSchema.fields.length} 个参数字段` : '类目需配置 schema'}><select required value={productForm.categorySlug} onChange={(event) => setProductForm((current) => current && ({ ...current, categorySlug: event.target.value }))}><option value="">选择类目</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name} / {category.slug}</option>)}</select></Field>
              <Field label="一句话点评" wide><textarea rows={2} maxLength={200} value={productForm.oneLiner} onChange={(event) => setProductForm((current) => current && ({ ...current, oneLiner: event.target.value }))} placeholder="面向谁、解决什么问题，控制在 200 字以内" /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>02</span><h3>价格与状态</h3></div><div className="form-grid">
              <Field label="最低价"><input type="number" min="0" step="0.01" value={productForm.priceMin} onChange={(event) => setProductForm((current) => current && ({ ...current, priceMin: event.target.value }))} placeholder="—" /></Field>
              <Field label="最高价"><input type="number" min="0" step="0.01" value={productForm.priceMax} onChange={(event) => setProductForm((current) => current && ({ ...current, priceMax: event.target.value }))} placeholder="—" /></Field>
              <Field label="货币"><input readOnly aria-label="货币" value="人民币（CNY）" /></Field>
              <Field label="发布状态"><select value={productForm.status} onChange={(event) => setProductForm((current) => current && ({ ...current, status: event.target.value as ProductFormState['status'] }))}><option value="draft">草稿</option><option value="published">已发布</option></select></Field>
              <Field label="封面 URL" wide><input type="url" value={productForm.coverUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, coverUrl: event.target.value }))} placeholder="https://..." /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>03</span><h3>动态参数</h3><span className="section-side">{editorSchema ? '已关联类目' : '未配置类目'}</span></div>
              {editorSchema ? <div className="spec-groups">{fieldsByGroup(editorSchema).map(([group, fields]) => <div className="spec-group" key={group}><div className="spec-group-title">{group}</div><div className="form-grid">{fields.map((field) => renderSpecField(field))}</div></div>)}</div> : <div className="inline-warning">当前类目没有有效 spec_schema，产品无法通过后端参数校验。请先到「类目与参数」配置字段。</div>}
            </div>
            {editorSchema?.rating_dimensions?.length ? <div className="form-section"><div className="form-section-head"><span>04</span><h3>编辑评分</h3><span className="section-side">0–10 / 加权</span></div><div className="form-grid">{editorSchema.rating_dimensions.map((dimension) => <Field key={dimension.key} label={dimension.label} hint={dimension.key}><input type="number" min="0" max="10" step="0.1" value={productForm.editorialScores[dimension.key] ?? ''} onChange={(event) => setProductForm((current) => current && ({ ...current, editorialScores: { ...current.editorialScores, [dimension.key]: event.target.value } }))} /></Field>)}</div></div> : null}
            <div className="form-section"><div className="form-section-head"><span>{editorSchema?.rating_dimensions?.length ? '05' : '04'}</span><h3>来源留痕</h3><span className="section-side">来源留痕</span></div><div className="form-grid">
              <Field label="来源类型"><select value={productForm.sourceKind} onChange={(event) => setProductForm((current) => current && ({ ...current, sourceKind: event.target.value as DataSourceKind }))}><option value="manual">人工录入</option><option value="official">官方资料</option><option value="crawl">自动采集</option></select></Field>
              <Field label="来源 URL"><input type="url" value={productForm.sourceUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, sourceUrl: event.target.value }))} placeholder="https://..." /></Field>
              <Field label="快照 URL"><input type="url" value={productForm.snapshotUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, snapshotUrl: event.target.value }))} placeholder="https://..." /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>{editorSchema?.rating_dimensions?.length ? '06' : '05'}</span><h3>图片 URL</h3><span className="section-side">{productForm.images.length} 张图片</span></div><div className="image-list">{productForm.images.map((image, index) => <div className="image-row" key={image.id ?? index}><input type="url" aria-label="图片 URL" value={image.url} onChange={(event) => updateImage(index, 'url', event.target.value)} placeholder="https://..." /><select aria-label="图片类型" value={image.kind} onChange={(event) => updateImage(index, 'kind', event.target.value)}>{imageKinds.map((kind) => <option key={kind} value={kind}>{imageKindLabels[kind]}</option>)}</select><input aria-label="图片来源" value={image.source} onChange={(event) => updateImage(index, 'source', event.target.value)} placeholder="版权 / 来源" /><button className="icon-button" type="button" onClick={() => setProductForm((current) => current && ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}>−</button></div>)}<button className="text-button" type="button" onClick={() => setProductForm((current) => current && ({ ...current, images: [...current.images, { url: '', kind: 'base', alt: '', source: '', sortOrder: String(current.images.length) }] }))}>+ 添加一行图片</button></div></div>
            <div className="drawer-actions"><button className="button" type="button" onClick={() => setProductForm(null)}>取消</button><button className="button button-primary" type="submit" disabled={busyAction === 'product-save'}>{busyAction === 'product-save' ? '保存中……' : productForm.status === 'published' ? '保存并发布  →' : '保存草稿  →'}</button></div>
          </form>
        </aside>
      </div>
    );
  }

  function renderSpecField(field: SpecField) {
    if (!productForm) return null;
    const value = productForm.specs[field.key];
    const label = `${field.label}${field.required ? ' *' : ''}`;
    const inputValue = value === undefined || value === null ? '' : String(value);
    if (field.type === 'bool') {
      return <label className="field field-check" key={field.key}><input type="checkbox" checked={value === true} onChange={(event) => updateSpecValue(field.key, event.target.checked)} /><span>{label}</span>{field.help && <small>{field.help}</small>}</label>;
    }
    if (field.type === 'enum') {
      return <Field key={field.key} label={label} hint={field.help}><select value={inputValue} onChange={(event) => updateSpecValue(field.key, event.target.value)}><option value="">未填写</option>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>;
    }
    if (field.type === 'enum[]') {
      const selected = Array.isArray(value) ? value.map(String) : [];
      return <Field key={field.key} label={label} hint={field.help ?? '按住 Ctrl / ⌘ 可多选'}><select multiple value={selected} onChange={(event) => updateSpecValue(field.key, Array.from(event.currentTarget.selectedOptions).map((option) => option.value))}>{field.options?.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></Field>;
    }
    if (field.type === 'nested') {
      return <Field key={field.key} label={label} hint={field.help ?? '使用 JSON 数组，例如 [{"key": "value"}]'} wide><textarea rows={5} value={typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 2)} onChange={(event) => updateSpecValue(field.key, event.target.value)} /></Field>;
    }
    if (field.type === 'text') {
      return <Field key={field.key} label={label} hint={field.help}><input value={inputValue} onChange={(event) => updateSpecValue(field.key, event.target.value)} /></Field>;
    }
    return <Field key={field.key} label={label} hint={field.help ?? field.unit}><input type="number" min={field.min} max={field.max} step={field.type === 'int' ? 1 : field.step ?? 'any'} value={inputValue} onChange={(event) => updateSpecValue(field.key, event.target.value === '' ? undefined : Number(event.target.value))} /></Field>;
  }

  function renderBrands() {
    return (
      <>
        <SectionHeader index="03" title="品牌资料" description="品牌是产品的稳定引用；slug 修改会影响后续录入，请先确认外部来源与中文名。" action={<button className="button button-primary" onClick={() => setBrandForm(makeBrandForm())}>+ 新增品牌</button>} />
        {brandForm && <BrandEditor form={brandForm} setForm={setBrandForm} onSubmit={handleBrandSubmit} onCancel={() => setBrandForm(null)} busy={busyAction === 'brand-save'} />}
        <section className="data-panel table-panel"><PanelHeader eyebrow="品牌" title="品牌清单" meta={`${brands.length} 条记录`} /><div className="table-wrap"><table className="data-table"><thead><tr><th>品牌</th><th>国家 / 地区</th><th>产品数</th><th>状态</th><th /></tr></thead><tbody>{brands.map((brand) => <tr key={brand.id}><td><div className="record-title"><span className="record-mark">牌</span><span><strong>{brand.nameCn || brand.name}</strong><small>{brand.name} · {brand.slug}</small></span></div></td><td>{brand.country || '—'}</td><td><data>{brand.productCount ?? 0}</data></td><td><StatusBadge status={brand.status} /></td><td><button className="text-button" onClick={() => setBrandForm(brandFormFromRecord(brand))}>编辑 →</button></td></tr>)}</tbody></table></div>{!brands.length && <EmptyState title="暂无品牌" detail="先创建品牌，再录入产品资料。" />}</section>
      </>
    );
  }

  function renderCategories() {
    return (
      <>
        <SectionHeader index="04" title="类目与参数" description="这里维护前台筛选、对比与后台产品表单共同使用的 spec_schema。" action={<button className="button button-primary" onClick={() => setCategoryForm(makeCategoryForm())}>+ 新增类目</button>} />
        {categoryForm && <CategoryEditor form={categoryForm} categories={categories} setForm={setCategoryForm} onSubmit={handleCategorySubmit} onCancel={() => setCategoryForm(null)} busy={busyAction === 'category-save'} />}
        <section className="data-panel table-panel"><PanelHeader eyebrow="类目" title="类目清单" meta={`${categories.length} 条记录`} /><div className="table-wrap"><table className="data-table"><thead><tr><th>类目</th><th>层级</th><th>参数 schema</th><th>产品 / 子类目</th><th>状态</th><th /></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><div className="record-title"><span className="record-mark">级{category.level}</span><span><strong>{category.name}</strong><small>{category.slug}{category.parent ? ` · 父级 ${category.parent.name}` : ' · 顶层类目'}</small></span></div></td><td><data>第 {category.level} 级</data></td><td>{schemaFieldCount(category.specSchema)}</td><td><span>{category.productCount} 产品</span><small className="table-sub">{category.childCount} 个子类目</small></td><td><StatusBadge status={category.status} /></td><td><button className="text-button" onClick={() => setCategoryForm(categoryFormFromRecord(category))}>编辑 →</button></td></tr>)}</tbody></table></div>{!categories.length && <EmptyState title="暂无类目" detail="类目 schema 是产品参数录入的前置条件。" />}</section>
      </>
    );
  }

  function renderAnalyticsOverview() {
    const summary = analytics?.summary;
    const funnel = analytics?.funnel;
    const engagement = analytics?.engagement;
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
        <div className="analytics-grid analytics-decision-grid">
          <section className="data-panel">
            <PanelHeader eyebrow="浏览转化" title="产品浏览漏斗" meta="访客去重" />
            {funnel ? (
              <div className="funnel-steps">
                <FunnelStep label="曝光访客" count={funnel.exposedVisitors} progress={100} detail="看到产品卡片" />
                <FunnelStep label="点击访客" count={funnel.clickedVisitors} progress={funnel.exposedVisitors ? (funnel.clickedVisitors / funnel.exposedVisitors) * 100 : 0} rate={funnel.clickRate} detail="点击产品卡片" />
                <FunnelStep label="详情访客" count={funnel.viewedVisitors} progress={funnel.exposedVisitors ? (funnel.viewedVisitors / funnel.exposedVisitors) * 100 : 0} rate={funnel.viewRate} detail="打开产品详情" />
                <FunnelStep label="意向访客" count={funnel.intentVisitors} progress={funnel.exposedVisitors ? (funnel.intentVisitors / funnel.exposedVisitors) * 100 : 0} rate={funnel.intentRate} detail="收藏或跳转官网" />
              </div>
            ) : <EmptyState title="正在读取漏斗" detail="统计数据加载完成后会显示各阶段访客转化。" />}
          </section>
          <section className="data-panel">
            <PanelHeader eyebrow="用户参与" title="关键行为" meta="事件次数" />
            <div className="engagement-grid">
              <Metric label="搜索" value={engagement?.searches ?? '—'} detail="搜索行为" />
              <Metric label="推荐完成率" value={formatRate(engagement?.recommendCompletionRate)} detail={engagement ? `${engagement.recommendCompletions} / ${engagement.recommendStarts} 次` : '推荐流程'} accent />
              <Metric label="注册" value={engagement?.signups ?? '—'} detail="注册事件" />
              <Metric label="评分" value={engagement?.ratings ?? '—'} detail="提交评分" />
              <Metric label="回复" value={engagement?.replies ?? '—'} detail="提交回复" />
              <Metric label="推荐开始" value={engagement?.recommendStarts ?? '—'} detail="启动推荐流程" />
            </div>
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

  function renderAnalytics() {
    const system = analytics?.system;
    const services = system?.services;
    const queue = system?.queue;
    return (
      <div className="analytics-page">
        <section className="analytics-workspace-heading">
          <div className="analytics-heading-copy"><p className="analytics-kicker">TELEMETRY &amp; DECISIONS <span>• v0.2.0 stream</span></p><h1>用户决策与埋点行为分析</h1><p>全链路横向 PK 决策、参数展开与电商跳转转化的埋点监控。</p></div>
          <div className="analytics-workspace-tools"><label className="range-select"><span>统计窗口</span><select value={analyticsDays} onChange={(event) => setAnalyticsDays(Number(event.target.value) as 7 | 14 | 30)}><option value="7">最近 7 天</option><option value="14">最近 14 天</option><option value="30">最近 30 天</option></select></label><label className="analytics-event-filter"><span>核心决策事件</span><select defaultValue="all"><option value="all">全部事件（浏览、参数、购买、收藏）</option><option value="view">产品详情浏览</option><option value="compare">横向 PK 对比</option><option value="outbound">官网跳转</option></select></label><div className="analytics-tool-actions"><button className="button" type="button" onClick={() => void refreshAnalytics()} disabled={analyticsBusy}>{analyticsBusy ? '读取中……' : '刷新统计'}</button><button className="button button-primary" type="button" onClick={() => setNotice({ kind: 'info', text: '原始 CSV 导出将在埋点归档接口接入后开放。' })}>⇧ 导出原始 CSV 日志</button></div></div>
        </section>
        {renderAnalyticsOverview()}
        <section className="data-panel table-panel analytics-events-panel">
          <PanelHeader eyebrow="最近埋点" title="最近埋点" meta={analytics?.recentEvents.length ? `${analytics.recentEvents.length} 条已加载` : '暂无事件'} />
          {analytics?.recentEvents.length ? (
            <div className="table-wrap"><table className="data-table analytics-events-table"><thead><tr><th>事件</th><th>访客</th><th>路径</th><th>产品</th><th>时间</th></tr></thead><tbody>{analytics.recentEvents.map((item, index) => <tr key={`${item.createdAt}-${item.name}-${index}`}><td><strong>{eventLabel(item.name)}</strong><small className="table-sub">{item.name}</small></td><td><code className="visitor-code">{item.visitor}</code></td><td className="path-cell">{item.path ?? '未记录路径'}</td><td>{item.productId ?? '—'}</td><td><time className="table-sub">{formatDate(item.createdAt)}</time></td></tr>)}</tbody></table></div>
          ) : <EmptyState title="暂无埋点记录" detail="当前时间窗口内还没有可展示的用户行为事件。" />}
        </section>
        <section className="data-panel system-status-panel">
          <PanelHeader eyebrow="系统状态" title="服务器状态" meta={system ? (system.status === 'ok' ? '运行正常' : '需要检查') : '读取中'} />
          <div className="system-status-layout">
            <div className="service-grid">
              <ServiceStatus label="API 服务" value={services?.api} />
              <ServiceStatus label="数据库" value={services?.database} />
              <ServiceStatus label="Redis 队列" value={services?.redis} />
              <ServiceStatus label="搜索服务" value={services?.elasticsearch} disabled={services ? !services.elasticsearchEnabled : false} />
            </div>
            <div className="system-facts">
              <div><span>进程运行</span><strong>{system ? formatUptime(system.uptimeSeconds) : '—'}</strong></div>
              <div><span>内存占用</span><strong>{system ? `${system.memory.rssMb} MB` : '—'}</strong></div>
              <div><span>待处理 outbox</span><strong>{queue?.outboxPending === null ? '—' : formatCompactNumber(queue?.outboxPending ?? 0)}</strong></div>
              <div><span>埋点流积压</span><strong>{queue?.eventStreamLength === null ? '—' : formatCompactNumber(queue?.eventStreamLength ?? 0)}</strong></div>
              <div><span>Node.js</span><strong>{system?.nodeVersion ?? '—'}</strong></div>
              <div><span>检查时间</span><strong>{system ? formatDate(system.checkedAt) : '—'}</strong></div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  function renderImport() {
    return (
      <>
        <SectionHeader index="05" title="采集与导入" description="采集器与后台共用同一份 seed 契约；此页先提供状态边界，避免在没有文件上传与对象存储时制造假导入。" />
        <div className="import-grid">
          <section className="data-panel"><PanelHeader eyebrow="自动采集" title="自动采集状态" meta="数据依据" /><div className="import-status"><span className="status-dot status-dot-good" /><div><strong>文件层自动通过</strong><p>当前采集结果会先落到 data/，并由共享 schema 校验。自动采集暂不进入人工审核队列。</p></div></div><div className="command-block"><span>校验 / 18 条种子记录</span><code>pnpm --filter @youpu/api validate:data</code></div></section>
          <section className="data-panel"><PanelHeader eyebrow="阶段二操作" title="导入边界" meta="人工关卡" /><div className="boundary-list"><BoundaryItem state="当前可用" title="手工产品 CRUD" detail="可从产品页补录、修正并发布单条产品。" /><BoundaryItem state="现在" title="seed 校验命令" detail="用于提交前检查 slug、schema 和来源字段。" /><BoundaryItem state="后续处理" title="批量文件上传" detail="上传、快照、COS 归档与批量冲突处理留到下一阶段。" /></div></section>
        </div>
      </>
    );
  }

  function renderModeration() {
    return (
      <>
        <SectionHeader index="06" title="内容审核" description="查看用户举报与实测评论状态；本地第三阶段先提供最小审核闭环，后续再补角色权限、审核记录与批量操作。" action={<button className="button" type="button" onClick={() => void refreshModeration()} disabled={moderationBusy}>{moderationBusy ? '读取中……' : '刷新审核队列'}</button>} />
        <div className="analytics-grid analytics-grid-secondary">
          <section className="data-panel table-panel">
            <PanelHeader eyebrow="举报队列" title="举报记录" meta={`${reports.length} 条已加载`} />
            {reports.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>目标</th><th>原因</th><th>举报人</th><th>状态</th><th>时间</th><th /></tr></thead><tbody>{reports.map((report) => <tr key={report.id}><td><strong>{moderationTargetLabel(report.targetType)}</strong><small className="table-sub">{report.targetId}</small></td><td><strong>{report.reason}</strong>{report.note ? <small className="table-sub">{report.note}</small> : null}</td><td>{report.reporter.nickname}<small className="table-sub">{report.reporter.email || report.reporter.id}</small></td><td><StatusBadge status={report.status} />{report.handler ? <small className="table-sub">处理人：{report.handler.nickname}<br />处理时间：{formatDate(report.handledAt)}</small> : null}</td><td><time className="table-sub">{formatDate(report.createdAt)}</time></td><td>{report.status === 'open' ? <div className="inline-actions"><button className="text-button" disabled={busyAction === `report-${report.id}`} onClick={() => void updateReportStatus(report.id, 'resolved')}>保留并处理</button><button className="text-button" disabled={busyAction === `report-${report.id}`} onClick={() => void updateReportStatus(report.id, 'resolved', 'hidden')}>隐藏内容</button><button className="text-button" disabled={busyAction === `report-${report.id}`} onClick={() => void updateReportStatus(report.id, 'resolved', 'rejected')}>拒绝内容</button><button className="text-button" disabled={busyAction === `report-${report.id}`} onClick={() => void updateReportStatus(report.id, 'dismissed')}>驳回举报</button></div> : <button className="text-button" disabled={busyAction === `report-${report.id}`} onClick={() => void updateReportStatus(report.id, 'open')}>重新打开</button>}</td></tr>)}</tbody></table></div> : <EmptyState title="暂无举报" detail="用户举报内容后会出现在这里。" />}
          </section>
          <section className="data-panel table-panel">
            <PanelHeader eyebrow="评论队列" title="评论状态" meta={`${moderationRatings.length} 条已加载`} />
            {moderationRatings.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>产品</th><th>作者</th><th>评分 / 内容</th><th>风险与状态</th><th /></tr></thead><tbody>{moderationRatings.map((rating) => <tr key={rating.id}><td><strong>{rating.product.title}</strong><small className="table-sub">{rating.product.slug}</small></td><td>{rating.account.nickname}<small className="table-sub">{rating.account.email || rating.account.id}</small><small className="table-sub">画像：{formatRiderProfile(rating.riderProfile)}</small></td><td><strong>{rating.overall.toFixed(1)} 分</strong><small className="table-sub">{rating.content || '无文字内容'} · {rating.helpfulCount} 有帮助</small></td><td><StatusBadge status={rating.status} /><small className="table-sub">风险：{formatModerationRisk(rating.moderationRisk)}</small><small className="table-sub">原因：{rating.moderationReasons.length ? formatModerationReasons(rating.moderationReasons).join('、') : '无'}</small></td><td><div className="inline-actions">{rating.status !== 'published' && <button className="text-button" disabled={busyAction === `rating-${rating.id}`} onClick={() => void updateRatingStatus(rating.id, 'published')}>发布</button>}{rating.status === 'published' && <button className="text-button" disabled={busyAction === `rating-${rating.id}`} onClick={() => void updateRatingStatus(rating.id, 'hidden')}>隐藏</button>}<button className="text-button" disabled={busyAction === `rating-${rating.id}`} onClick={() => void updateRatingStatus(rating.id, 'rejected')}>拒绝</button></div></td></tr>)}</tbody></table></div> : <EmptyState title="暂无评论" detail="用户发布实测后会出现在这里。" />}
          </section>
        </div>
      </>
    );
  }

  function renderAuditLogs() {
    const logs = auditLogs?.items ?? [];
    return (
      <>
        <SectionHeader
          index="07"
          title="操作审计"
          description="记录后台资料变更的操作人、时间、对象和前后快照；用于回溯误改，不记录登录令牌等敏感信息。"
          action={<button className="button" type="button" onClick={() => void refreshAuditLogs()} disabled={auditBusy}>{auditBusy ? '读取中……' : '刷新日志'}</button>}
        />
        <div className="filter-bar audit-filter-bar">
          <label className="filter-select"><span>对象</span><select value={auditFilters.entity} onChange={(event) => setAuditFilters((current) => ({ ...current, entity: event.target.value as AuditFilters['entity'] }))}><option value="">全部对象</option><option value="product">产品</option><option value="brand">品牌</option><option value="category">类目</option><option value="report">举报</option><option value="rating">评论</option></select></label>
          <label className="filter-select"><span>动作</span><select value={auditFilters.action} onChange={(event) => setAuditFilters((current) => ({ ...current, action: event.target.value as AuditFilters['action'] }))}><option value="">全部动作</option><option value="create">创建</option><option value="update">更新</option><option value="publish">发布</option><option value="hide">下线</option><option value="moderate">审核</option></select></label>
          <span className="filter-meta">{auditLogs ? `共 ${auditLogs.total} 条 / 当前 ${logs.length} 条` : '读取中……'}</span>
        </div>
        <section className="data-panel table-panel">
          <PanelHeader eyebrow="操作审计" title="后台操作记录" meta={auditLogs ? `${logs.length} 条记录` : '读取中'} />
          {logs.length ? <div className="table-wrap"><table className="data-table audit-table"><thead><tr><th>时间</th><th>操作人</th><th>对象</th><th>动作</th><th>前后快照</th></tr></thead><tbody>{logs.map((log) => <tr key={log.id}><td><time className="table-sub audit-time">{formatDate(log.createdAt)}</time><small className="table-sub">#{log.id}</small></td><td><strong>{log.actor.nickname}</strong><small className="table-sub">{log.actor.email || log.actor.id}</small></td><td><strong>{auditEntityLabel(log.entity)}</strong><small className="table-sub">{log.entityId || '全局操作'}</small></td><td><strong>{auditActionLabel(log.action)}</strong><small className="table-sub">{log.action}</small></td><td><details className="audit-details"><summary>查看快照</summary><div className="audit-snapshots"><div><span>修改前</span><pre>{formatAuditSnapshot(log.before)}</pre></div><div><span>修改后</span><pre>{formatAuditSnapshot(log.after)}</pre></div></div></details></td></tr>)}</tbody></table></div> : <EmptyState title="暂无审计记录" detail="后台发生产品、品牌、类目或审核状态变更后，会在这里留下记录。" />}
        </section>
      </>
    );
  }

  function renderAccounts() {
    return (
      <>
        <SectionHeader
          index="08"
          title="账号管理"
          description="管理后台账号的角色和状态。为避免锁死后台，最后一个启用中的管理员不能被降级或停用。"
          action={<button className="button" type="button" onClick={() => void refreshAccounts()} disabled={accountsBusy}>{accountsBusy ? '读取中……' : '刷新账号'}</button>}
        />
        <section className="data-panel table-panel">
          <PanelHeader eyebrow="访问权限" title="后台账号" meta={`${accounts.length} 条记录`} />
          {accounts.length ? <div className="table-wrap"><table className="data-table accounts-table"><thead><tr><th>账号</th><th>角色</th><th>状态</th><th>创建时间</th></tr></thead><tbody>{accounts.map((account) => {
            const busy = busyAction === `account-${account.id}`;
            return <tr key={account.id}>
              <td><div className="record-title"><span className="record-mark">员</span><span><strong>{account.nickname}</strong><small>{account.email || account.id}</small></span></div></td>
              <td><select aria-label={`${account.nickname}角色`} value={account.role} disabled={busy} onChange={(event) => void updateAccountAccess(account.id, { role: event.target.value as AdminAccountRole })}><option value="user">普通用户</option><option value="editor">编辑</option><option value="admin">管理员</option></select></td>
              <td><select aria-label={`${account.nickname}状态`} value={account.status} disabled={busy} onChange={(event) => void updateAccountAccess(account.id, { status: event.target.value as AdminAccountStatus })}><option value="active">启用</option><option value="pending">待启用</option><option value="disabled">停用</option></select></td>
              <td><time className="table-sub">{formatDate(account.createdAt)}</time></td>
            </tr>;
          })}</tbody></table></div> : <EmptyState title="暂无账号" detail="数据库接通后，注册账号会显示在这里。" />}
        </section>
      </>
    );
  }

  function renderContent() {
    if (activeSection === 'products') return renderProducts();
    if (activeSection === 'brands') return renderBrands();
    if (activeSection === 'categories') return renderCategories();
    if (activeSection === 'import') return renderImport();
    if (activeSection === 'analytics') return renderAnalytics();
    if (activeSection === 'moderation') return renderModeration();
    if (activeSection === 'audit') return renderAuditLogs();
    if (activeSection === 'accounts') return renderAccounts();
    return renderDashboard();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-lockup"><div className="brand-mark-large">有谱</div><div><strong>有谱</strong><small>DECISION ENGINE ADMIN</small></div></div>
        <div className="sidebar-rule" />
        <p className="sidebar-label">操作模块</p>
        <nav className="sidebar-nav" aria-label="后台模块">{(['核心监控', '内容与装备中台', '决策数据洞察', '系统底座'] as NavGroup[]).map((group) => <div className="sidebar-group" key={group}><p className="sidebar-group-label">{group}</p>{navItems.filter((item) => item.group === group && visibleSections.has(item.id)).map((item) => <button key={item.id} className={activeSection === item.id ? 'nav-item is-active' : 'nav-item'} onClick={() => { setActiveSection(item.id); setNotice(null); }}><span className="nav-icon" aria-hidden="true">{item.icon}</span><strong>{item.label}</strong><small>{item.index}</small></button>)}</div>)}</nav>
        <div className="sidebar-bottom"><div className="cluster-status"><div><code>PROD-Cluster-SH01</code><strong><span className="status-dot status-dot-good" />99.98%</strong></div><small>All systems normal · Alpine Core Engine</small></div><div className="system-readout"><span className="status-dot status-dot-good" /><span>API 会话 / 权限：{role || 'admin'}</span></div><button className="logout-button" onClick={logout}>退出工作台 <span>↗</span></button></div>
      </aside>
      <main className="admin-main">
        <header className="topbar">
          <div className="topbar-context"><span className="topbar-code">有谱后台</span><span className="topbar-slash">/</span><span>{navItems.find((item) => item.id === activeSection)?.label}</span></div>
          <form className="topbar-search" role="search" onSubmit={(event) => { event.preventDefault(); setActiveSection('products'); setAppliedFilters({ ...filters }); setNotice(null); }}>
            <span className="topbar-search-icon" aria-hidden="true">⌕</span>
            <input aria-label="搜索产品、品牌或参数" value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="搜索装备、品牌、参数 Schema…" />
          </form>
          <div className="topbar-actions">
            <button className="button button-primary topbar-create" type="button" onClick={openNewProduct}>＋ 新建商品</button>
            <button className="button topbar-import" type="button" onClick={() => { setActiveSection('import'); setNotice(null); }}>↥ 拉取采集任务</button>
            <button className="button topbar-alert" type="button" onClick={() => { setActiveSection('moderation'); setNotice(null); }}>⚠ 异常警报</button>
            <div className="topbar-utilities">
              <button className="topbar-utility-button" type="button" onClick={() => setNotice({ kind: 'info', text: '后台说明暂未接入独立文档页，当前功能以左侧导航和页面说明为准。' })}>？<span>文档</span></button>
              <button className="topbar-utility-button topbar-notification" type="button" aria-label="打开通知" onClick={() => { setActiveSection('moderation'); setNotice(null); }}>♧<i aria-hidden="true" /></button>
            </div>
            <div className="topbar-user"><span className="topbar-user-avatar">{(role || 'A').slice(0, 1).toUpperCase()}</span><span><strong>{role || 'admin'}</strong><small>已连接</small></span><span className="topbar-user-chevron" aria-hidden="true">⌄</span></div>
          </div>
          <div className="topbar-right"><span className="api-origin">API {getApiHost()}</span><span className="revision">版本 3.01</span></div>
        </header>
        {notice && <Notice notice={notice} />}
        <div className="content-wrap">{renderContent()}</div>
        <footer className="admin-footer"><span>有谱 / 产品资料工作台</span><span>本地管理控制台 · {new Date().getFullYear()}</span></footer>
      </main>
    </div>
  );
}

function getApiHost(): string {
  try {
    return new URL(API_BASE).host;
  } catch {
    return API_BASE;
  }
}

function SectionHeader({ index, title, description, action }: { index: string; title: string; description: string; action?: React.ReactNode }) {
  return <div className="section-header"><div><p className="eyebrow">{index}</p><h1>{title}</h1><p className="section-description">{description}</p></div>{action && <div className="section-action">{action}</div>}</div>;
}

function PanelHeader({ eyebrow, title, meta }: { eyebrow: string; title: string; meta?: string }) {
  return <div className="panel-header"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div>{meta && <span className="panel-meta">{meta}</span>}</div>;
}

function Metric({ label, value, detail, accent = false }: { label: string; value: number | string; detail: string; accent?: boolean }) {
  return <article className={accent ? 'metric-card metric-card-accent' : 'metric-card'}><span className="metric-label">{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function FunnelStep({ label, count, progress, rate, detail }: { label: string; count: number; progress: number; rate?: number | null; detail: string }) {
  return <div className="funnel-step"><div className="funnel-step-head"><span>{label}</span><strong>{formatCompactNumber(count)}</strong></div><div className="funnel-step-track"><i style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} /></div><small>{rate === undefined ? detail : `${detail} · 较上一步 ${formatRate(rate)}`}</small></div>;
}

function BoundaryItem({ state, title, detail }: { state: string; title: string; detail: string }) {
  return <div className="boundary-item"><span className={state === '现在' || state === '当前可用' ? 'boundary-state boundary-state-ready' : 'boundary-state'}>{state}</span><div><strong>{title}</strong><p>{detail}</p></div></div>;
}

function StatusBadge({ status }: { status: string }) {
  return <span className={`status-badge status-${status}`}>{statusText(status)}</span>;
}

function EmptyState({ title, detail }: { title: string; detail: string }) {
  return <div className="empty-state"><span>∅</span><strong>{title}</strong><p>{detail}</p></div>;
}

function TrafficChart({ data }: { data: AdminAnalytics['daily'] }) {
  const hasActivity = data.some((item) => item.visitors > 0 || item.events > 0);
  if (!data.length || !hasActivity) {
    return <div className="chart-empty"><span>∅</span><strong>暂无趋势数据</strong><p>有用户行为上报后，这里会绘制访客与埋点事件趋势。</p></div>;
  }

  const width = 720;
  const height = 240;
  const left = 42;
  const right = 14;
  const top = 16;
  const bottom = 38;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;
  const maxVisitors = Math.max(1, ...data.map((item) => item.visitors));
  const maxEvents = Math.max(1, ...data.map((item) => item.events));
  const xFor = (index: number) => left + (data.length === 1 ? plotWidth / 2 : (plotWidth * index) / (data.length - 1));
  const yForVisitors = (value: number) => top + plotHeight - (value / maxVisitors) * plotHeight;
  const barStep = plotWidth / Math.max(data.length, 1);
  const barWidth = Math.max(6, Math.min(24, barStep * 0.58));
  const visitorPoints = data.map((item, index) => `${xFor(index)},${yForVisitors(item.visitors)}`).join(' ');
  const labelIndexes = new Set([0, Math.floor((data.length - 1) / 2), data.length - 1]);

  return (
    <div className="traffic-chart-wrap">
      <div className="chart-legend"><span><i className="legend-line" />独立访客</span><span><i className="legend-bar" />埋点事件</span></div>
      <svg className="traffic-chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="访客与埋点事件趋势图">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = top + plotHeight - ratio * plotHeight;
          const axisLabel = ratio === 0 ? '0' : ratio === 1 || maxVisitors >= 4 ? formatCompactNumber(Math.round(maxVisitors * ratio)) : '';
          return <g key={ratio}><line className="chart-grid-line" x1={left} x2={width - right} y1={y} y2={y} /><text className="chart-axis-label" x={left - 10} y={y + 4} textAnchor="end">{axisLabel}</text></g>;
        })}
        {data.map((item, index) => {
          const barHeight = (item.events / maxEvents) * plotHeight;
          return <rect className="chart-event-bar" key={`bar-${item.date}`} x={xFor(index) - barWidth / 2} y={top + plotHeight - barHeight} width={barWidth} height={barHeight} rx="2" />;
        })}
        <polyline className="chart-visitor-line" points={visitorPoints} />
        {data.map((item, index) => <circle className="chart-visitor-dot" key={`dot-${item.date}`} cx={xFor(index)} cy={yForVisitors(item.visitors)} r="3.5" />)}
        {data.map((item, index) => labelIndexes.has(index) ? <text className="chart-date-label" key={`label-${item.date}`} x={xFor(index)} y={height - 12} textAnchor={index === 0 ? 'start' : index === data.length - 1 ? 'end' : 'middle'}>{formatShortDate(item.date)}</text> : null)}
      </svg>
    </div>
  );
}

function EventBreakdown({ items }: { items: AdminAnalytics['eventBreakdown'] }) {
  if (!items.length) return <div className="breakdown-empty"><EmptyState title="暂无事件数据" detail="埋点事件进入数据库后，会按类型汇总。" /></div>;
  const max = Math.max(1, ...items.map((item) => item.count));
  return <div className="event-bars">{items.slice(0, 8).map((item) => <div className="event-bar-row" key={item.name}><div className="event-bar-head"><span>{eventLabel(item.name)}</span><strong>{formatCompactNumber(item.count)}</strong></div><div className="event-bar-track"><i style={{ width: `${Math.max(2, (item.count / max) * 100)}%` }} /></div><small>{item.name}</small></div>)}</div>;
}

function ServiceStatus({ label, value, disabled = false }: { label: string; value: boolean | undefined; disabled?: boolean }) {
  const state = disabled ? 'disabled' : value === undefined ? 'unknown' : value ? 'good' : 'bad';
  const text = disabled ? '未启用' : value === undefined ? '读取中' : value ? '正常' : '异常';
  return <div className={`service-status service-status-${state}`}><span className="status-dot" /><div><strong>{label}</strong><small>{text}</small></div></div>;
}

function Notice({ notice }: { notice: Notice }) {
  return <div className={`notice notice-${notice.kind}`} role="status"><span>{notice.kind === 'success' ? '成功' : notice.kind === 'error' ? '错误' : '提示'}</span><p>{notice.text}</p></div>;
}

function Field({ label, hint, required = false, wide = false, children }: { label: string; hint?: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? 'field field-wide' : 'field'}><span>{label}{required ? ' *' : ''}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function BrandEditor({ form, setForm, onSubmit, onCancel, busy }: { form: BrandFormState; setForm: React.Dispatch<React.SetStateAction<BrandFormState | null>>; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; busy: boolean }) {
  return <section className="data-panel editor-panel"><PanelHeader eyebrow={form.id ? '编辑品牌' : '新增品牌'} title={form.id ? '编辑品牌' : '新增品牌'} meta="品牌记录" /><form className="form-grid" onSubmit={onSubmit}><Field label="品牌名" required><input required value={form.name} onChange={(event) => setForm((current) => current && ({ ...current, name: event.target.value }))} /></Field><Field label="中文名"><input value={form.nameCn} onChange={(event) => setForm((current) => current && ({ ...current, nameCn: event.target.value }))} /></Field><Field label="路径标识（slug）" required hint="小写短横线格式"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => current && ({ ...current, slug: event.target.value }))} /></Field><Field label="国家 / 地区"><input maxLength={8} value={form.country} onChange={(event) => setForm((current) => current && ({ ...current, country: event.target.value }))} /></Field><Field label="官网 URL"><input type="url" value={form.officialUrl} onChange={(event) => setForm((current) => current && ({ ...current, officialUrl: event.target.value }))} /></Field><Field label="标志 URL"><input type="url" value={form.logoUrl} onChange={(event) => setForm((current) => current && ({ ...current, logoUrl: event.target.value }))} /></Field><Field label="状态"><select value={form.status} onChange={(event) => setForm((current) => current && ({ ...current, status: event.target.value as BrandFormState['status'] }))}><option value="active">启用</option><option value="inactive">停用</option></select></Field><Field label="描述" wide><textarea rows={3} value={form.description} onChange={(event) => setForm((current) => current && ({ ...current, description: event.target.value }))} /></Field><div className="inline-actions"><button className="button" type="button" onClick={onCancel}>取消</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? '保存中……' : '保存品牌  →'}</button></div></form></section>;
}

function CategoryEditor({ form, categories, setForm, onSubmit, onCancel, busy }: { form: CategoryFormState; categories: AdminCategoryRecord[]; setForm: React.Dispatch<React.SetStateAction<CategoryFormState | null>>; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; busy: boolean }) {
  return <section className="data-panel editor-panel"><PanelHeader eyebrow={form.id ? '编辑类目' : '新增类目'} title={form.id ? '编辑类目' : '新增类目'} meta="类目记录" /><form className="form-grid" onSubmit={onSubmit}><Field label="类目名" required><input required value={form.name} onChange={(event) => setForm((current) => current && ({ ...current, name: event.target.value }))} /></Field><Field label="路径标识（slug）" required hint="小写短横线格式"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => current && ({ ...current, slug: event.target.value }))} /></Field><Field label="父类目"><select value={form.parentId} onChange={(event) => setForm((current) => current && ({ ...current, parentId: event.target.value }))}><option value="">顶层类目</option>{categories.filter((category) => category.id !== form.id).map((category) => <option key={category.id} value={category.id}>{'　'.repeat(category.level - 1)}{category.name}</option>)}</select></Field><Field label="排序值"><input type="number" step="1" value={form.sortOrder} onChange={(event) => setForm((current) => current && ({ ...current, sortOrder: event.target.value }))} /></Field><Field label="封面 URL"><input type="url" value={form.coverUrl} onChange={(event) => setForm((current) => current && ({ ...current, coverUrl: event.target.value }))} /></Field><Field label="状态"><select value={form.status} onChange={(event) => setForm((current) => current && ({ ...current, status: event.target.value as CategoryFormState['status'] }))}><option value="active">启用</option><option value="inactive">停用</option></select></Field><Field label="参数定义（spec_schema JSON）" hint="fields 至少一个；保存时会由共享契约再次校验" wide><textarea className="json-editor" rows={12} value={form.specSchemaText} onChange={(event) => setForm((current) => current && ({ ...current, specSchemaText: event.target.value }))} placeholder={'{\n  "fields": []\n}'} /></Field><Field label="推荐配置（recommend_config JSON）" hint="可留空" wide><textarea className="json-editor" rows={6} value={form.recommendConfigText} onChange={(event) => setForm((current) => current && ({ ...current, recommendConfigText: event.target.value }))} /></Field><div className="inline-actions"><button className="button" type="button" onClick={onCancel}>取消</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? '保存中……' : '保存类目  →'}</button></div></form></section>;
}
