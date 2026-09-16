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
  AdminApiError,
  API_BASE,
  buildProductQuery,
  type AdminBrandRecord,
  type AdminCategoryRecord,
  type AdminAnalytics,
  type AdminDashboard,
  type AdminProductDetail,
  type AdminProductListResponse,
  type AdminProductSummary,
} from '../lib/api';

type Section = 'dashboard' | 'products' | 'brands' | 'categories' | 'import' | 'analytics';
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

const STORAGE_KEY = 'youpu.admin.token';

const navItems: Array<{ id: Section; index: string; label: string; note: string }> = [
  { id: 'dashboard', index: '00', label: '总览', note: 'CONTROL DESK' },
  { id: 'products', index: '01', label: '产品资料', note: 'PRODUCT PIM' },
  { id: 'brands', index: '02', label: '品牌', note: 'BRAND INDEX' },
  { id: 'categories', index: '03', label: '类目与参数', note: 'SCHEMA FAMILY' },
  { id: 'import', index: '04', label: '采集与导入', note: 'INGEST STATUS' },
  { id: 'analytics', index: '05', label: '数据分析', note: 'ANALYTICS' },
];

const imageKinds: ImageKind[] = ['base', 'face', 'side', 'shape', 'field', 'card3x4'];

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
    priceCurrency: product.priceCurrency,
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

function buildProductPayload(form: ProductFormState, schema: SpecSchema | null): AdminProductInput {
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
    priceCurrency: form.priceCurrency.trim().toUpperCase(),
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
  const min = product.priceMin === null ? '' : String(product.priceMin);
  const max = product.priceMax === null ? '' : String(product.priceMax);
  return min && max && min !== max ? `${min}–${max} ${product.priceCurrency}` : `${min || max} ${product.priceCurrency}`;
}

function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat('zh-CN', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
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
  return status === 'published' ? '已发布' : status === 'draft' ? '草稿' : status === 'active' ? '启用' : '停用';
}

export function AdminApp() {
  const [hydrated, setHydrated] = useState(false);
  const [token, setToken] = useState('');
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
  const [products, setProducts] = useState<AdminProductListResponse | null>(null);
  const [brands, setBrands] = useState<AdminBrandRecord[]>([]);
  const [categories, setCategories] = useState<AdminCategoryRecord[]>([]);
  const [filters, setFilters] = useState<ProductFilters>({ search: '', status: '' });
  const [appliedFilters, setAppliedFilters] = useState<ProductFilters>({ search: '', status: '' });
  const [productForm, setProductForm] = useState<ProductFormState | null>(null);
  const [brandForm, setBrandForm] = useState<BrandFormState | null>(null);
  const [categoryForm, setCategoryForm] = useState<CategoryFormState | null>(null);
  const hasOpenEditor = productForm !== null || brandForm !== null || categoryForm !== null;

  useEffect(() => {
    if (!hasOpenEditor) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenEditor]);

  useEffect(() => {
    const savedToken = window.localStorage.getItem(STORAGE_KEY) ?? '';
    setToken(savedToken);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setSessionState('signed-out');
      return;
    }

    let alive = true;
    setSessionState('checking');
    (async () => {
      try {
        const identity = await adminFetch<{ authenticated: boolean; role: string }>(token, '/auth/me');
        if (!alive) return;
        setRole(identity.role);
        const [nextDashboard, nextBrands, nextCategories] = await Promise.all([
          adminFetch<AdminDashboard>(token, '/dashboard'),
          adminFetch<AdminBrandRecord[]>(token, '/brands'),
          adminFetch<AdminCategoryRecord[]>(token, '/categories'),
        ]);
        if (!alive) return;
        setDashboard(nextDashboard);
        setBrands(nextBrands);
        setCategories(nextCategories);
        setSessionState('signed-in');
      } catch (error) {
        if (!alive) return;
        if (error instanceof AdminApiError && (error.status === 401 || error.status === 403)) {
          window.localStorage.removeItem(STORAGE_KEY);
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
  }, [hydrated, token]);

  useEffect(() => {
    if (sessionState !== 'signed-in' || !token) return;
    let alive = true;
    (async () => {
      try {
        const response = await adminFetch<AdminProductListResponse>(
          token,
          `/products${buildProductQuery({
            search: appliedFilters.search.trim(),
            status: appliedFilters.status,
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
    adminFetch<AdminAnalytics>(token, `/analytics?days=${analyticsDays}`)
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

  async function refreshWorkspace(currentToken = token) {
    if (!currentToken) return;
    const [nextDashboard, nextProducts, nextBrands, nextCategories] = await Promise.all([
      adminFetch<AdminDashboard>(currentToken, '/dashboard'),
      adminFetch<AdminProductListResponse>(
        currentToken,
        `/products${buildProductQuery({
          search: appliedFilters.search.trim(),
          status: appliedFilters.status,
          page: 1,
          pageSize: 50,
        })}`,
      ),
      adminFetch<AdminBrandRecord[]>(currentToken, '/brands'),
      adminFetch<AdminCategoryRecord[]>(currentToken, '/categories'),
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
      setAnalytics(await adminFetch<AdminAnalytics>(token, `/analytics?days=${analyticsDays}`));
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setAnalyticsBusy(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = loginToken.trim();
    if (value.length < 16) {
      setNotice({ kind: 'error', text: '管理令牌至少需要 16 个字符' });
      return;
    }
    setBusyAction('login');
    setNotice(null);
    try {
      const identity = await adminFetch<{ authenticated: boolean; role: string }>(value, '/auth/me');
      window.localStorage.setItem(STORAGE_KEY, value);
      setRole(identity.role);
      setToken(value);
      setNotice({ kind: 'success', text: '管理令牌验证通过' });
    } catch (error) {
      setNotice({ kind: 'error', text: getErrorText(error) });
    } finally {
      setBusyAction(null);
    }
  }

  function logout() {
    window.localStorage.removeItem(STORAGE_KEY);
    setToken('');
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
      const detail = await adminFetch<AdminProductDetail>(token, `/products/${product.id}`);
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
        await adminFetch(token, `/products/${productForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await adminFetch(token, '/products', { method: 'POST', body: payload });
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
        await adminFetch(token, `/brands/${brandForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await adminFetch(token, '/brands', { method: 'POST', body: payload });
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
        await adminFetch(token, `/categories/${categoryForm.id}`, { method: 'PATCH', body: payload });
      } else {
        await adminFetch(token, '/categories', { method: 'POST', body: payload });
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
          <p className="eyebrow">YOUPU / ADMIN M2</p>
          <h1>有谱<br /><em>资料工作台</em></h1>
          <p className="login-copy">产品资料、类目参数与采集状态的单一操作入口。</p>
          <form onSubmit={handleLogin} className="login-form">
            <input className="visually-hidden" name="username" autoComplete="username" value="admin" readOnly tabIndex={-1} aria-hidden="true" />
            <label className="field">
              <span>管理令牌</span>
              <input
                value={loginToken}
                onChange={(event) => setLoginToken(event.target.value)}
                type="password"
                autoComplete="current-password"
                placeholder="输入 API ADMIN_TOKEN"
              />
            </label>
            <button className="button button-primary button-block" type="submit" disabled={busyAction === 'login'}>
              {busyAction === 'login' ? '验证中……' : '进入工作台  →'}
            </button>
          </form>
          <div className="login-footnote">
            <span>AUTH / BEARER</span>
            <span>LOCAL SESSION ONLY</span>
          </div>
          {notice && <Notice notice={notice} />}
        </section>
      </main>
    );
  }

  function renderDashboard() {
    const metrics = dashboard?.metrics;
    return (
      <>
        <SectionHeader
          index="00 / CONTROL DESK"
          title="资料库总览"
          description="先看数据是否可用，再进入产品与 schema 的维护。所有发布动作都会写入 API outbox。"
          action={<button className="button" onClick={() => refreshWorkspace().catch((error) => setNotice({ kind: 'error', text: getErrorText(error) }))}>刷新数据</button>}
        />
        <div className="metric-grid">
          <Metric label="产品总数" value={metrics?.products ?? '—'} detail="PRODUCT RECORDS" accent />
          <Metric label="已发布" value={metrics?.publishedProducts ?? '—'} detail="PUBLIC CATALOG" />
          <Metric label="待处理草稿" value={metrics?.drafts ?? '—'} detail="DRAFT QUEUE" />
          <Metric label="启用品牌" value={metrics?.brands ?? '—'} detail="BRAND INDEX" />
          <Metric label="启用类目" value={metrics?.categories ?? '—'} detail="SCHEMA FAMILIES" />
        </div>
        <div className="dashboard-grid">
          <section className="data-panel">
            <PanelHeader eyebrow="RECENT ACTIVITY" title="最近更新" meta="TOP 5" />
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
                    });
                  }}>
                    <span className="activity-code">{product.status === 'published' ? 'PUB' : 'DRF'}</span>
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
            <PanelHeader eyebrow="M2 BOUNDARY" title="当前工作边界" meta="REV 0.1" />
            <div className="boundary-list">
              <BoundaryItem state="READY" title="产品 / 品牌 / 类目 CRUD" detail="共享 schema 校验，产品支持草稿与发布状态。" />
              <BoundaryItem state="READY" title="动态参数表单" detail="字段来自类目的 spec_schema，不重复维护字段定义。" />
              <BoundaryItem state="MANUAL" title="图片上传" detail="当前录入图片 URL；COS 上传与裁切留到后续版本。" />
              <BoundaryItem state="NEXT" title="账号与细粒度审计" detail="M2 使用单一 Bearer 管理令牌，多账号权限属于后续版本。" />
            </div>
          </section>
        </div>
      </>
    );
  }

  function renderProducts() {
    return (
      <>
        <SectionHeader
          index="01 / PRODUCT PIM"
          title="产品资料"
          description="产品参数由类目 schema 约束；保存为草稿或发布，后端会同步写入产品更新事件。"
          action={<button className="button button-primary" onClick={openNewProduct}>+ 新增产品</button>}
        />
        <form className="filter-bar" onSubmit={(event) => { event.preventDefault(); setAppliedFilters({ ...filters }); }}>
          <label className="filter-search"><span>检索</span><input value={filters.search} onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))} placeholder="按标题、型号或 slug 搜索" /></label>
          <label className="filter-select"><span>状态</span><select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value as ProductFilters['status'] }))}><option value="">全部状态</option><option value="draft">草稿</option><option value="published">已发布</option></select></label>
          <button className="button" type="submit">应用筛选</button>
          <span className="filter-meta">{products ? `共 ${products.total} 条 / 第 ${products.page} 页` : '读取中……'}</span>
        </form>
        <section className="data-panel table-panel">
          <PanelHeader eyebrow="PRODUCT RECORDS" title="产品清单" meta={products ? `${products.items?.length ?? 0} LOADED` : 'LOADING'} />
          <div className="table-wrap">
            <table className="data-table product-table">
              <thead><tr><th>产品</th><th>品牌</th><th>类目</th><th>价格</th><th>状态</th><th>更新</th><th /></tr></thead>
              <tbody>
                {products?.items?.map((product) => (
                  <tr key={product.id}>
                    <td><div className="record-title"><span className="record-mark">{product.coverImage ? 'IMG' : '—'}</span><span><strong>{product.title}</strong><small>{product.model} · {product.slug}</small></span></div></td>
                    <td>{product.brand.nameCn || product.brand.name}<small className="table-sub">{product.brand.slug}</small></td>
                    <td>{product.category.name}<small className="table-sub">{product.category.slug}</small></td>
                    <td><data>{formatPrice(product)}</data></td>
                    <td><StatusBadge status={product.status} /></td>
                    <td><time className="table-sub">{formatDate(product.updatedAt)}</time></td>
                    <td><button className="text-button" onClick={() => void openProduct(product)} disabled={busyAction === `product:${product.id}`}>{busyAction === `product:${product.id}` ? '读取中' : '编辑 →'}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!products?.items?.length && <EmptyState title="没有匹配的产品" detail="调整筛选条件，或先创建一条产品草稿。" />}
        </section>
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
          <div className="drawer-head"><div><p className="eyebrow">PRODUCT FORM / {productForm.id ? 'EDIT' : 'NEW'}</p><h2>{productForm.id ? '编辑产品' : '新建产品'}</h2></div><button className="close-button" type="button" onClick={() => setProductForm(null)}>×</button></div>
          <form className="drawer-form" onSubmit={handleProductSubmit}>
            <div className="form-section"><div className="form-section-head"><span>01</span><h3>基础识别</h3></div><div className="form-grid">
              <Field label="标题" required><input required value={productForm.title} onChange={(event) => setProductForm((current) => current && ({ ...current, title: event.target.value }))} placeholder="例如：Burton Custom Camber" /></Field>
              <Field label="型号" required><input required value={productForm.model} onChange={(event) => setProductForm((current) => current && ({ ...current, model: event.target.value }))} placeholder="Custom Camber" /></Field>
              <Field label="slug" required hint="kebab-case"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={productForm.slug} onChange={(event) => setProductForm((current) => current && ({ ...current, slug: event.target.value }))} placeholder="burton-custom-camber-2025" /></Field>
              <Field label="年份" required><input required type="number" min="2000" max="2100" step="1" value={productForm.year} onChange={(event) => setProductForm((current) => current && ({ ...current, year: event.target.value }))} /></Field>
              <Field label="品牌" required><select required value={productForm.brandSlug} onChange={(event) => setProductForm((current) => current && ({ ...current, brandSlug: event.target.value }))}><option value="">选择品牌</option>{brands.map((brand) => <option key={brand.id} value={brand.slug}>{brand.nameCn || brand.name} / {brand.slug}</option>)}</select></Field>
              <Field label="类目" required hint={editorSchema ? `${editorSchema.fields.length} 个参数字段` : '类目需配置 schema'}><select required value={productForm.categorySlug} onChange={(event) => setProductForm((current) => current && ({ ...current, categorySlug: event.target.value }))}><option value="">选择类目</option>{categories.map((category) => <option key={category.id} value={category.slug}>{category.name} / {category.slug}</option>)}</select></Field>
              <Field label="一句话点评" wide><textarea rows={2} maxLength={200} value={productForm.oneLiner} onChange={(event) => setProductForm((current) => current && ({ ...current, oneLiner: event.target.value }))} placeholder="面向谁、解决什么问题，控制在 200 字以内" /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>02</span><h3>价格与状态</h3></div><div className="form-grid">
              <Field label="最低价"><input type="number" min="0" step="0.01" value={productForm.priceMin} onChange={(event) => setProductForm((current) => current && ({ ...current, priceMin: event.target.value }))} placeholder="—" /></Field>
              <Field label="最高价"><input type="number" min="0" step="0.01" value={productForm.priceMax} onChange={(event) => setProductForm((current) => current && ({ ...current, priceMax: event.target.value }))} placeholder="—" /></Field>
              <Field label="货币"><input maxLength={3} value={productForm.priceCurrency} onChange={(event) => setProductForm((current) => current && ({ ...current, priceCurrency: event.target.value.toUpperCase() }))} /></Field>
              <Field label="发布状态"><select value={productForm.status} onChange={(event) => setProductForm((current) => current && ({ ...current, status: event.target.value as ProductFormState['status'] }))}><option value="draft">草稿</option><option value="published">已发布</option></select></Field>
              <Field label="封面 URL" wide><input type="url" value={productForm.coverUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, coverUrl: event.target.value }))} placeholder="https://..." /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>03</span><h3>动态参数</h3><span className="section-side">{editorSchema ? 'SCHEMA LINKED' : 'SCHEMA MISSING'}</span></div>
              {editorSchema ? <div className="spec-groups">{fieldsByGroup(editorSchema).map(([group, fields]) => <div className="spec-group" key={group}><div className="spec-group-title">{group}</div><div className="form-grid">{fields.map((field) => renderSpecField(field))}</div></div>)}</div> : <div className="inline-warning">当前类目没有有效 spec_schema，产品无法通过后端参数校验。请先到「类目与参数」配置字段。</div>}
            </div>
            {editorSchema?.rating_dimensions?.length ? <div className="form-section"><div className="form-section-head"><span>04</span><h3>编辑评分</h3><span className="section-side">0–10 / WEIGHTED</span></div><div className="form-grid">{editorSchema.rating_dimensions.map((dimension) => <Field key={dimension.key} label={dimension.label} hint={dimension.key}><input type="number" min="0" max="10" step="0.1" value={productForm.editorialScores[dimension.key] ?? ''} onChange={(event) => setProductForm((current) => current && ({ ...current, editorialScores: { ...current.editorialScores, [dimension.key]: event.target.value } }))} /></Field>)}</div></div> : null}
            <div className="form-section"><div className="form-section-head"><span>{editorSchema?.rating_dimensions?.length ? '05' : '04'}</span><h3>来源留痕</h3><span className="section-side">SOURCE TRACE</span></div><div className="form-grid">
              <Field label="来源类型"><select value={productForm.sourceKind} onChange={(event) => setProductForm((current) => current && ({ ...current, sourceKind: event.target.value as DataSourceKind }))}><option value="manual">人工录入</option><option value="official">官方资料</option><option value="crawl">自动采集</option></select></Field>
              <Field label="来源 URL"><input type="url" value={productForm.sourceUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, sourceUrl: event.target.value }))} placeholder="https://..." /></Field>
              <Field label="快照 URL"><input type="url" value={productForm.snapshotUrl} onChange={(event) => setProductForm((current) => current && ({ ...current, snapshotUrl: event.target.value }))} placeholder="https://..." /></Field>
            </div></div>
            <div className="form-section"><div className="form-section-head"><span>{editorSchema?.rating_dimensions?.length ? '06' : '05'}</span><h3>图片 URL</h3><span className="section-side">{productForm.images.length} ITEMS</span></div><div className="image-list">{productForm.images.map((image, index) => <div className="image-row" key={image.id ?? index}><input type="url" aria-label="图片 URL" value={image.url} onChange={(event) => updateImage(index, 'url', event.target.value)} placeholder="https://..." /><select aria-label="图片类型" value={image.kind} onChange={(event) => updateImage(index, 'kind', event.target.value)}>{imageKinds.map((kind) => <option key={kind} value={kind}>{kind}</option>)}</select><input aria-label="图片来源" value={image.source} onChange={(event) => updateImage(index, 'source', event.target.value)} placeholder="版权 / 来源" /><button className="icon-button" type="button" onClick={() => setProductForm((current) => current && ({ ...current, images: current.images.filter((_, imageIndex) => imageIndex !== index) }))}>−</button></div>)}<button className="text-button" type="button" onClick={() => setProductForm((current) => current && ({ ...current, images: [...current.images, { url: '', kind: 'base', alt: '', source: '', sortOrder: String(current.images.length) }] }))}>+ 添加一行图片</button></div></div>
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
        <SectionHeader index="02 / BRAND INDEX" title="品牌资料" description="品牌是产品的稳定引用；slug 修改会影响后续录入，请先确认外部来源与中文名。" action={<button className="button button-primary" onClick={() => setBrandForm(makeBrandForm())}>+ 新增品牌</button>} />
        {brandForm && <BrandEditor form={brandForm} setForm={setBrandForm} onSubmit={handleBrandSubmit} onCancel={() => setBrandForm(null)} busy={busyAction === 'brand-save'} />}
        <section className="data-panel table-panel"><PanelHeader eyebrow="BRAND INDEX" title="品牌清单" meta={`${brands.length} RECORDS`} /><div className="table-wrap"><table className="data-table"><thead><tr><th>品牌</th><th>国家 / 地区</th><th>产品数</th><th>状态</th><th /></tr></thead><tbody>{brands.map((brand) => <tr key={brand.id}><td><div className="record-title"><span className="record-mark">BR</span><span><strong>{brand.nameCn || brand.name}</strong><small>{brand.name} · {brand.slug}</small></span></div></td><td>{brand.country || '—'}</td><td><data>{brand.productCount ?? 0}</data></td><td><StatusBadge status={brand.status} /></td><td><button className="text-button" onClick={() => setBrandForm(brandFormFromRecord(brand))}>编辑 →</button></td></tr>)}</tbody></table></div>{!brands.length && <EmptyState title="暂无品牌" detail="先创建品牌，再录入产品资料。" />}</section>
      </>
    );
  }

  function renderCategories() {
    return (
      <>
        <SectionHeader index="03 / SCHEMA FAMILY" title="类目与参数" description="这里维护前台筛选、对比与后台产品表单共同使用的 spec_schema。" action={<button className="button button-primary" onClick={() => setCategoryForm(makeCategoryForm())}>+ 新增类目</button>} />
        {categoryForm && <CategoryEditor form={categoryForm} categories={categories} setForm={setCategoryForm} onSubmit={handleCategorySubmit} onCancel={() => setCategoryForm(null)} busy={busyAction === 'category-save'} />}
        <section className="data-panel table-panel"><PanelHeader eyebrow="SCHEMA FAMILIES" title="类目清单" meta={`${categories.length} RECORDS`} /><div className="table-wrap"><table className="data-table"><thead><tr><th>类目</th><th>层级</th><th>schema</th><th>产品 / 子类目</th><th>状态</th><th /></tr></thead><tbody>{categories.map((category) => <tr key={category.id}><td><div className="record-title"><span className="record-mark">L{category.level}</span><span><strong>{category.name}</strong><small>{category.slug}{category.parent ? ` · 父级 ${category.parent.name}` : ' · 顶层类目'}</small></span></div></td><td><data>LV.{category.level}</data></td><td>{schemaFieldCount(category.specSchema)}</td><td><span>{category.productCount} 产品</span><small className="table-sub">{category.childCount} 个子类目</small></td><td><StatusBadge status={category.status} /></td><td><button className="text-button" onClick={() => setCategoryForm(categoryFormFromRecord(category))}>编辑 →</button></td></tr>)}</tbody></table></div>{!categories.length && <EmptyState title="暂无类目" detail="类目 schema 是产品参数录入的前置条件。" />}</section>
      </>
    );
  }

  function renderAnalytics() {
    const summary = analytics?.summary;
    const system = analytics?.system;
    const services = system?.services;
    const queue = system?.queue;
    return (
      <>
        <SectionHeader
          index="05 / ANALYTICS"
          title="数据分析"
          description="查看访客行为、埋点分布与运行状态。访客按匿名 ID 去重，统计只覆盖已经成功上报的事件。"
          action={(
            <div className="analytics-toolbar">
              <label className="range-select"><span>统计范围</span><select value={analyticsDays} onChange={(event) => setAnalyticsDays(Number(event.target.value) as 7 | 14 | 30)}><option value="7">最近 7 天</option><option value="14">最近 14 天</option><option value="30">最近 30 天</option></select></label>
              <button className="button" type="button" onClick={() => void refreshAnalytics()} disabled={analyticsBusy}>{analyticsBusy ? '读取中……' : '刷新统计'}</button>
            </div>
          )}
        />
        <div className="analytics-note"><span className="status-dot status-dot-good" /><span>当前统计窗口：{analytics ? `${formatDate(analytics.from)} — ${formatDate(analytics.to)}` : '读取中……'}；历史事件未记录路径时会显示“未记录路径”。</span></div>
        <div className="metric-grid analytics-summary-grid">
          <Metric label="独立访客" value={summary?.uniqueVisitors ?? '—'} detail={`${analyticsDays}D UNIQUE VISITORS`} accent />
          <Metric label="埋点事件" value={summary?.events ?? '—'} detail="ALL TRACKED EVENTS" />
          <Metric label="产品浏览" value={summary?.productViews ?? '—'} detail="DETAIL VIEW EVENTS" />
          <Metric label="活跃账号" value={summary?.activeAccounts ?? '—'} detail="SIGNED-IN VISITORS" />
        </div>
        <div className="analytics-grid">
          <section className="data-panel chart-panel analytics-traffic-panel">
            <PanelHeader eyebrow="TRAFFIC TREND" title="访客与事件趋势" meta={analyticsBusy ? 'LOADING' : `LAST ${analyticsDays} DAYS`} />
            <TrafficChart data={analytics?.daily ?? []} />
          </section>
          <section className="data-panel chart-panel">
            <PanelHeader eyebrow="EVENT MIX" title="埋点事件分布" meta="TOP EVENTS" />
            <EventBreakdown items={analytics?.eventBreakdown ?? []} />
          </section>
        </div>
        <div className="analytics-grid analytics-grid-secondary">
          <section className="data-panel">
            <PanelHeader eyebrow="TOP PATHS" title="访问路径" meta="EVENT SOURCES" />
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
            <PanelHeader eyebrow="PRODUCT INTERACTIONS" title="热门产品互动" meta="TOP PRODUCTS" />
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
        <section className="data-panel table-panel analytics-events-panel">
          <PanelHeader eyebrow="RECENT TRACKING" title="最近埋点" meta={analytics?.recentEvents.length ? `${analytics.recentEvents.length} LOADED` : 'NO EVENTS'} />
          {analytics?.recentEvents.length ? (
            <div className="table-wrap"><table className="data-table analytics-events-table"><thead><tr><th>事件</th><th>访客</th><th>路径</th><th>产品</th><th>时间</th></tr></thead><tbody>{analytics.recentEvents.map((item, index) => <tr key={`${item.createdAt}-${item.name}-${index}`}><td><strong>{eventLabel(item.name)}</strong><small className="table-sub">{item.name}</small></td><td><code className="visitor-code">{item.visitor}</code></td><td className="path-cell">{item.path ?? '未记录路径'}</td><td>{item.productId ?? '—'}</td><td><time className="table-sub">{formatDate(item.createdAt)}</time></td></tr>)}</tbody></table></div>
          ) : <EmptyState title="暂无埋点记录" detail="当前时间窗口内还没有可展示的用户行为事件。" />}
        </section>
        <section className="data-panel system-status-panel">
          <PanelHeader eyebrow="SYSTEM STATUS" title="服务器状态" meta={system ? (system.status === 'ok' ? 'ALL SYSTEMS NOMINAL' : 'CHECK REQUIRED') : 'LOADING'} />
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
      </>
    );
  }

  function renderImport() {
    return (
      <>
        <SectionHeader index="04 / INGEST STATUS" title="采集与导入" description="采集器与后台共用同一份 seed 契约；此页先提供状态边界，避免在没有文件上传与对象存储时制造假导入。" />
        <div className="import-grid">
          <section className="data-panel"><PanelHeader eyebrow="AUTOMATED COLLECTION" title="自动采集状态" meta="SOURCE OF TRUTH" /><div className="import-status"><span className="status-dot status-dot-good" /><div><strong>文件层自动通过</strong><p>当前采集结果会先落到 data/，并由共享 schema 校验。自动采集暂不进入人工审核队列。</p></div></div><div className="command-block"><span>VALIDATE / 18 SEED RECORDS</span><code>pnpm --filter @youpu/api validate:data</code></div></section>
          <section className="data-panel"><PanelHeader eyebrow="M2 OPERATIONS" title="导入边界" meta="MANUAL GATE" /><div className="boundary-list"><BoundaryItem state="NOW" title="手工产品 CRUD" detail="可从产品页补录、修正并发布单条产品。" /><BoundaryItem state="NOW" title="seed 校验命令" detail="用于提交前检查 slug、schema 和来源字段。" /><BoundaryItem state="LATER" title="批量文件上传" detail="上传、快照、COS 归档与批量冲突处理留到下一阶段。" /></div></section>
        </div>
      </>
    );
  }

  function renderContent() {
    if (activeSection === 'products') return renderProducts();
    if (activeSection === 'brands') return renderBrands();
    if (activeSection === 'categories') return renderCategories();
    if (activeSection === 'import') return renderImport();
    if (activeSection === 'analytics') return renderAnalytics();
    return renderDashboard();
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand-lockup"><div className="brand-mark-large">有谱</div><div><strong>DATA WORKBENCH</strong><small>M2 / INTERNAL</small></div></div>
        <div className="sidebar-rule" />
        <p className="sidebar-label">操作模块 / MODULES</p>
        <nav className="sidebar-nav">{navItems.map((item) => <button key={item.id} className={activeSection === item.id ? 'nav-item is-active' : 'nav-item'} onClick={() => { setActiveSection(item.id); setNotice(null); }}><span>{item.index}</span><strong>{item.label}</strong><small>{item.note}</small></button>)}</nav>
        <div className="sidebar-bottom"><div className="system-readout"><span className="status-dot status-dot-good" /><span>API SESSION / {(role || 'admin').toUpperCase()}</span></div><button className="logout-button" onClick={logout}>退出工作台 <span>↗</span></button></div>
      </aside>
      <main className="admin-main">
        <header className="topbar"><div><span className="topbar-code">YOUPU / ADMIN</span><span className="topbar-slash">/</span><span>{navItems.find((item) => item.id === activeSection)?.note}</span></div><div className="topbar-right"><span className="api-origin">API {getApiHost()}</span><span className="revision">REV M2.01</span></div></header>
        {notice && <Notice notice={notice} />}
        <div className="content-wrap">{renderContent()}</div>
        <footer className="admin-footer"><span>有谱 / PRODUCT INTELLIGENCE</span><span>LOCAL ADMIN CONSOLE · {new Date().getFullYear()}</span></footer>
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

function BoundaryItem({ state, title, detail }: { state: string; title: string; detail: string }) {
  return <div className="boundary-item"><span className={state === 'READY' || state === 'NOW' ? 'boundary-state boundary-state-ready' : 'boundary-state'}>{state}</span><div><strong>{title}</strong><p>{detail}</p></div></div>;
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
  return <div className={`notice notice-${notice.kind}`} role="status"><span>{notice.kind === 'success' ? 'OK' : notice.kind === 'error' ? 'ERR' : 'INFO'}</span><p>{notice.text}</p></div>;
}

function Field({ label, hint, required = false, wide = false, children }: { label: string; hint?: string; required?: boolean; wide?: boolean; children: React.ReactNode }) {
  return <label className={wide ? 'field field-wide' : 'field'}><span>{label}{required ? ' *' : ''}</span>{children}{hint && <small>{hint}</small>}</label>;
}

function BrandEditor({ form, setForm, onSubmit, onCancel, busy }: { form: BrandFormState; setForm: React.Dispatch<React.SetStateAction<BrandFormState | null>>; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; busy: boolean }) {
  return <section className="data-panel editor-panel"><PanelHeader eyebrow={form.id ? 'EDIT BRAND' : 'NEW BRAND'} title={form.id ? '编辑品牌' : '新增品牌'} meta="BRAND RECORD" /><form className="form-grid" onSubmit={onSubmit}><Field label="品牌名" required><input required value={form.name} onChange={(event) => setForm((current) => current && ({ ...current, name: event.target.value }))} /></Field><Field label="中文名"><input value={form.nameCn} onChange={(event) => setForm((current) => current && ({ ...current, nameCn: event.target.value }))} /></Field><Field label="slug" required hint="kebab-case"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => current && ({ ...current, slug: event.target.value }))} /></Field><Field label="国家 / 地区"><input maxLength={8} value={form.country} onChange={(event) => setForm((current) => current && ({ ...current, country: event.target.value }))} /></Field><Field label="官网 URL"><input type="url" value={form.officialUrl} onChange={(event) => setForm((current) => current && ({ ...current, officialUrl: event.target.value }))} /></Field><Field label="Logo URL"><input type="url" value={form.logoUrl} onChange={(event) => setForm((current) => current && ({ ...current, logoUrl: event.target.value }))} /></Field><Field label="状态"><select value={form.status} onChange={(event) => setForm((current) => current && ({ ...current, status: event.target.value as BrandFormState['status'] }))}><option value="active">启用</option><option value="inactive">停用</option></select></Field><Field label="描述" wide><textarea rows={3} value={form.description} onChange={(event) => setForm((current) => current && ({ ...current, description: event.target.value }))} /></Field><div className="inline-actions"><button className="button" type="button" onClick={onCancel}>取消</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? '保存中……' : '保存品牌  →'}</button></div></form></section>;
}

function CategoryEditor({ form, categories, setForm, onSubmit, onCancel, busy }: { form: CategoryFormState; categories: AdminCategoryRecord[]; setForm: React.Dispatch<React.SetStateAction<CategoryFormState | null>>; onSubmit: (event: FormEvent<HTMLFormElement>) => void; onCancel: () => void; busy: boolean }) {
  return <section className="data-panel editor-panel"><PanelHeader eyebrow={form.id ? 'EDIT SCHEMA FAMILY' : 'NEW SCHEMA FAMILY'} title={form.id ? '编辑类目' : '新增类目'} meta="SCHEMA RECORD" /><form className="form-grid" onSubmit={onSubmit}><Field label="类目名" required><input required value={form.name} onChange={(event) => setForm((current) => current && ({ ...current, name: event.target.value }))} /></Field><Field label="slug" required hint="kebab-case"><input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => setForm((current) => current && ({ ...current, slug: event.target.value }))} /></Field><Field label="父类目"><select value={form.parentId} onChange={(event) => setForm((current) => current && ({ ...current, parentId: event.target.value }))}><option value="">顶层类目</option>{categories.filter((category) => category.id !== form.id).map((category) => <option key={category.id} value={category.id}>{'　'.repeat(category.level - 1)}{category.name}</option>)}</select></Field><Field label="排序值"><input type="number" step="1" value={form.sortOrder} onChange={(event) => setForm((current) => current && ({ ...current, sortOrder: event.target.value }))} /></Field><Field label="封面 URL"><input type="url" value={form.coverUrl} onChange={(event) => setForm((current) => current && ({ ...current, coverUrl: event.target.value }))} /></Field><Field label="状态"><select value={form.status} onChange={(event) => setForm((current) => current && ({ ...current, status: event.target.value as CategoryFormState['status'] }))}><option value="active">启用</option><option value="inactive">停用</option></select></Field><Field label="spec_schema JSON" hint="fields 至少一个；保存时会由共享契约再次校验" wide><textarea className="json-editor" rows={12} value={form.specSchemaText} onChange={(event) => setForm((current) => current && ({ ...current, specSchemaText: event.target.value }))} placeholder={'{\n  "fields": []\n}'} /></Field><Field label="recommend_config JSON" hint="可留空" wide><textarea className="json-editor" rows={6} value={form.recommendConfigText} onChange={(event) => setForm((current) => current && ({ ...current, recommendConfigText: event.target.value }))} /></Field><div className="inline-actions"><button className="button" type="button" onClick={onCancel}>取消</button><button className="button button-primary" type="submit" disabled={busy}>{busy ? '保存中……' : '保存类目  →'}</button></div></form></section>;
}
