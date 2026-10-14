/** 只读取带明确单位的官方尺码信息；不从板长或鞋码猜测适配。 */
export interface SnowboardFitAnswers {
  weight?: string;
  weightKg?: string;
  bootEu?: string;
}

export interface SnowboardFit {
  sizes: string[];
  excluded: boolean;
  points: number;
  note: string;
}

type Range = [number, number];
const WEIGHT_BUCKETS: Record<string, Range> = {
  lt60: [0, 60], '60to75': [60, 75], '75to90': [75, 90], gt90: [90, Infinity],
};

function unitFieldRange(value: unknown): Range | undefined {
  if (Array.isArray(value) && value.length === 2 && value.every((item) => typeof item === 'number' && Number.isFinite(item)) && value[0] <= value[1]) {
    return [value[0], value[1]];
  }
}

function explicitRange(value: unknown, unit: 'kg' | 'EU'): Range | undefined {
  if (typeof value !== 'string') return;
  const text = value.replace(/[–—−]/g, '-');
  const pattern = unit === 'kg'
    ? /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*kg\b/i
    : /\bEU\s*(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)/i;
  const match = text.match(pattern);
  if (match) {
    const low = Number(match[1]);
    const high = Number(match[2]);
    if (low <= high) return [low, high];
  }
  // 开放上限同样要求明确的 kg / EU 单位。
  const open = unit === 'kg'
    ? text.match(/(\d+(?:\.\d+)?)\s*\+\s*kg\b/i)
    : text.match(/\bEU\s*(\d+(?:\.\d+)?)\s*\+/i);
  if (open) return [Number(open[1]), Infinity];
}

export function snowboardFit(rows: unknown, answers: SnowboardFitAnswers): SnowboardFit {
  const exactWeight = answers.weightKg?.trim() ? Number(answers.weightKg) : undefined;
  const weight: Range | undefined = exactWeight !== undefined && Number.isFinite(exactWeight) && exactWeight >= 20 && exactWeight <= 200
    ? [exactWeight, exactWeight] : WEIGHT_BUCKETS[answers.weight ?? ''];
  const boot = answers.bootEu?.trim() ? Number(answers.bootEu) : undefined;
  const eu = boot !== undefined && Number.isFinite(boot) && boot >= 25 && boot <= 55 ? boot : undefined;
  const table = Array.isArray(rows) ? rows.filter((row): row is Record<string, unknown> => !!row && typeof row === 'object') : [];
  const evaluated = table.map((row) => {
    const kg = explicitRange(row.riderWeight, 'kg') ?? explicitRange(row.riderWeightRange, 'kg')
      ?? unitFieldRange(row.riderWeightKg) ?? unitFieldRange(row.recommendedRiderWeightKg);
    const shoe = explicitRange(row.bootSize, 'EU') ?? unitFieldRange(row.bootEu)
      ?? (typeof row.maxBootSizeEU === 'number' && Number.isFinite(row.maxBootSizeEU) ? [0, row.maxBootSizeEU] as Range : undefined);
    const weightMiss = !!weight && !!kg && (kg[1] < weight[0] || kg[0] > weight[1]);
    const shoeMiss = eu !== undefined && !!shoe && (eu < shoe[0] || eu > shoe[1]);
    const confirmed = !!weight && !!kg && !weightMiss && (eu === undefined || (!!shoe && !shoeMiss));
    return { size: String(row.size ?? ''), miss: weightMiss || shoeMiss, confirmed };
  });
  const sizes = [...new Set(evaluated.filter((row) => row.confirmed && !row.miss && row.size).map((row) => row.size))];
  const excluded = evaluated.length > 0 && evaluated.every((row) => row.miss);
  return {
    sizes, excluded, points: sizes.length ? 12 : 0,
    note: sizes.length
      ? `官方尺码表${exactWeight === undefined ? '与所选体重区间有交集' : '覆盖填写的体重'}：${sizes.join(' / ')}。${eu === undefined ? '雪鞋外形、站姿和板宽仍需核对。' : '已同时核对表内 EU 鞋码范围；仍需用实际雪鞋确认外伸。'}`
      : excluded ? '官方尺码表没有符合所填条件的尺码。'
        : '尺码适配待核：现有资料不足以同时确认体重与鞋码，购买前请核对品牌尺码表及实际雪鞋。',
  };
}

export function hasDecisionPrice(specs: Record<string, unknown>, currency = 'CNY'): boolean {
  return currency === 'CNY' && !specs.priceCheckedAt;
}

export function decisionComposite(scores: Record<string, unknown>, specs: Record<string, unknown>, currency = 'CNY'): number | undefined {
  const values = Object.entries(scores)
    .filter(([key]) => key !== 'value' || hasDecisionPrice(specs, currency))
    .map(([, value]) => Number(value)).filter((value) => Number.isFinite(value) && value > 0);
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length * 10 : undefined;
}
