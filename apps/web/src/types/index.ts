// 领域模型：品类模板驱动，新增品类只加配置与内容，不改页面代码

export type CategoryStatus = "live" | "coming_soon";

export type SpecValueType = "number" | "text";
/** 优劣方向：用于对比页「胜出」标记 */
export type SpecDirection = "higher" | "lower" | null;

export interface SpecField {
  key: string;
  label: string;
  unit?: string;
  type: SpecValueType;
  direction?: SpecDirection;
  /** 数值型差异判定阈值（相对差），默认 0.05 */
  diffThreshold?: number;
}

export interface SpecGroup {
  group: string;
  fields: SpecField[];
}

export interface FilterOption {
  value: string;
  label: string;
}

export type FilterControl = "multi" | "price" | "flex";

export interface FilterDef {
  key: string;
  label: string;
  control: FilterControl;
  options?: FilterOption[];
  min?: number;
  max?: number;
  step?: number;
}

export interface ScoreDim {
  key: string;
  label: string;
  weight: number;
}

export interface RankCategory {
  key: string;
  label: string;
  /** 限定参与该榜的场景标签，为空表示全品类 */
  scenes?: string[];
}

export interface QuizOption {
  value: string;
  label: string;
  desc?: string;
}

export interface QuizQuestion {
  key: string;
  question: string;
  hint?: string;
  multi?: boolean;
  options: QuizOption[];
}

export interface CategoryNode {
  slug: string;
  name: string;
  nameEn: string;
  /** 面包屑路径，如 运动 / 滑雪 */
  path: string[];
  status: CategoryStatus;
  children?: CategoryNode[];
}

export interface Category extends CategoryNode {
  issue: string;
  /** 价格筛选和展示使用的参考币种，未配置时默认 CNY。 */
  priceCurrency?: string;
  specTemplate: SpecGroup[];
  filterTemplate: FilterDef[];
  scoreDims: ScoreDim[];
  rankCategories: RankCategory[];
  quizTemplate: QuizQuestion[];
  /** 进阶指数计算权重（按 spec key） */
  hardcoreWeights: Record<string, number>;
}

export interface GalleryShot {
  url: string;
  label: string;
}

/** 官方尺码/几何表，用于需要按尺码做选择的装备。 */
export interface FitGuideRow {
  size: string;
  height?: string;
  stack?: number;
  reach?: number;
  wheelbase?: number;
  headAngle?: string;
  seatAngle?: string;
  wheelSize?: string;
}

export interface FitGuide {
  rows: FitGuideRow[];
  note?: string;
}

export interface GearAnalysis {
  verdict: string;
  strengths: string[];
  weaknesses: string[];
  fits: string[];
  notFits: string[];
}

export type GearSizeSpecValue =
  | number
  | string
  | boolean
  | null
  | GearSizeSpecValue[]
  | { [key: string]: GearSizeSpecValue };

export type GearSizeSpec = Record<string, GearSizeSpecValue>;

export interface GearItem {
  id: string;
  categorySlug: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  /** 官方价格的币种；旧内容包缺省按 CNY 兼容。 */
  priceCurrency?: string;
  scenes: string[];
  flexValue: number;
  flexLabel: string;
  hero: string;
  gallery: GalleryShot[];
  specs: Record<string, number | string | null>;
  /** Verified size-specific rows preserved for catalog detail and seed export. */
  sizeSpecs?: GearSizeSpec[];
  fitGuide?: FitGuide;
  scores: Record<string, number>;
  composite: number;
  hardcore: number;
  heat: number;
  whoFor: string[];
  analysis: GearAnalysis;
  priceBand: { min: number; max: number };
  ratingDist: Record<"1" | "2" | "3" | "4" | "5", number>;
  isNew: boolean;
  addedAt: string;
}

export interface ReviewerMeta {
  years: number;
  heightCm: number;
  weightKg?: number;
  level: string;
  resort: string;
}

export interface Review {
  id: string;
  gearId: string;
  /** 游客/种子内容为 null */
  userKey: string | null;
  authorName: string;
  authorMeta: ReviewerMeta;
  rating: number;
  content: string;
  images: string[];
  parentId: string | null;
  createdAt: string;
  /** 种子内容自带的初始有帮助数 */
  seedHelpful?: number;
}

export type NotificationType = "reply" | "helpful" | "new_review" | "ranking";

export interface AppNotification {
  id: string;
  userKey: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  createdAt: string;
}

export interface CompareRecord {
  id: string;
  userKey: string;
  categorySlug: string;
  gearIds: string[];
  createdAt: string;
}

export interface QuizResult {
  id: string;
  userKey: string;
  categorySlug: string;
  answers: Record<string, string | string[]>;
  picks: { gearId: string; match: number; reasons: string[]; fallback?: boolean }[];
  createdAt: string;
}

export interface VoteRecord {
  categorySlug: string;
  rankKey: string;
  season: string;
  gearId: string;
  changed: boolean;
}

export interface Profile {
  userKey: string;
  username: string;
  email: string;
  avatarSeed: string;
  years: number;
  heightCm: number;
  weightKg: number;
  level: string;
  resort: string;
}

export interface Account extends Profile {
  /** 原型模拟凭据，非真实安全存储 */
  secret: string;
  createdAt: string;
  /** 接入本地 API 后的数据库账号标识；本地原型账号没有该字段。 */
  remoteId?: string;
  cloud?: boolean;
}

export type SortKey = "heat" | "new" | "score" | "hardcore";
