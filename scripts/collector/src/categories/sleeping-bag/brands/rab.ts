import type { AdapterResult, CrawlTarget, PageSnapshot, PageTable } from '../../../engine/types';

export const rabSleepingBagAdapter = {
  name: 'sleeping-bag/rab',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'sleeping-bag' && target.brand === 'rab';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Rab 睡袋页面标题、描述和 JSON-LD 证据。'];

    const temperatureLabel = temperatureLabelFrom(snapshot.title);
    if (temperatureLabel) normalizedSpecs.temperatureLabel = temperatureLabel;

    const insulationType = insulationTypeFrom(evidence);
    if (insulationType) normalizedSpecs.insulationType = insulationType;

    const sizeMeasurements = sizeMeasurementsFrom(snapshot.tables);
    if (sizeMeasurements.length > 0) normalizedSpecs.sizeMeasurements = sizeMeasurements;

    const missing = ['temperatureLabel', 'insulationType', 'sizeMeasurements'].filter(
      (key) => normalizedSpecs[key] === undefined,
    );
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('舒适温度、极限温度、重量、填充量和面料等字段未从当前静态快照确认，未根据搜索摘要或型号名称反推。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function temperatureLabelFrom(title: string | undefined): string | undefined {
  const match = title?.match(/\(\s*([^)]*?\d+\s*°?\s*F)[^)]*\)/i);
  return match?.[1]?.replace(/\s+/g, ' ').trim();
}

function insulationTypeFrom(evidence: string): string | undefined {
  const normalized = evidence.toLowerCase();
  if (normalized.includes('synthetic')) return 'synthetic';
  if (normalized.includes('down')) return 'down';
  if (normalized.includes('wool')) return 'wool';
  return undefined;
}

function sizeMeasurementsFrom(tables: PageTable[]): Array<Record<string, unknown>> {
  const table = tables.find((candidate) => {
    const labels = candidate.rows.map((row) => row[0]?.toLowerCase().trim());
    return labels.includes('sleeping bag length') && labels.includes('max user height');
  });
  if (!table) return [];

  const lengthRow = table.rows.find((row) => row[0]?.toLowerCase().trim() === 'sleeping bag length');
  const heightRow = table.rows.find((row) => row[0]?.toLowerCase().trim() === 'max user height');
  if (!lengthRow || !heightRow) return [];

  return table.headers.slice(1).flatMap((size, index) => {
    const lengthCm = centimetersFrom(lengthRow[index + 1]);
    const maxUserHeightCm = centimetersFrom(heightRow[index + 1]);
    if (!size || lengthCm === undefined || maxUserHeightCm === undefined) return [];
    return [{ size, lengthCm, maxUserHeightCm }];
  });
}

function centimetersFrom(value: string | undefined): number | undefined {
  const match = value?.match(/(\d+(?:\.\d+)?)\s*cm/i);
  return match?.[1] ? Number(match[1]) : undefined;
}
