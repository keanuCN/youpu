import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const lexarMemoryCardAdapter = {
  name: 'memory-card/lexar',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'memory-card' && target.brand === 'lexar';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const structuredDescription = jsonLdDescriptions(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 Lexar 雷克沙官方中文产品页及 JSON-LD 中的存储卡参数证据。'];

    if (/SDXC/i.test(evidence)) normalizedSpecs.cardType = 'SDXC';
    if (/UHS-I/i.test(evidence)) normalizedSpecs.interface = 'UHS-I';

    const capacities = [...new Set([...evidence.matchAll(/\b(?:1TB|512GB|256GB|128GB|64GB)\b/gi)].map((match) => match[0].toUpperCase()))];
    if (capacities.length > 0) {
      const order = ['64GB', '128GB', '256GB', '512GB', '1TB'];
      capacities.sort((left, right) => order.indexOf(left) - order.indexOf(right));
      normalizedSpecs.capacityOptions = capacities.join(' / ');
    }

    const readSpeed = structuredDescription.match(/读取速度高达\s*(\d+)\s*MB\/s/i);
    if (readSpeed?.[1]) normalizedSpecs.readSpeed = Number(readSpeed[1]);

    const writeSpeedByCapacity = extractWriteSpeedByCapacity(structuredDescription);
    if (writeSpeedByCapacity) normalizedSpecs.writeSpeedByCapacity = writeSpeedByCapacity;

    const performanceClass = structuredDescription.match(/性能等级:\s*([\s\S]*?)(?:<br>|;)/i);
    if (performanceClass?.[1]) normalizedSpecs.performanceClass = cleanText(performanceClass[1]);

    if (/全高清和4K超高清视频|4K超高清视频/i.test(evidence)) {
      normalizedSpecs.videoSupport = '全高清 / 4K 超高清视频';
    }

    const dimensions = structuredDescription.match(/尺寸（长x宽x高）:\s*([^;]+?)(?=;)/i);
    if (dimensions?.[1]) normalizedSpecs.dimensions = cleanText(dimensions[1]);

    const operatingTemperature = structuredDescription.match(/工作温度:\s*([^;]+?)(?=;)/i);
    if (operatingTemperature?.[1]) normalizedSpecs.operatingTemperature = cleanText(operatingTemperature[1]);
    const storageTemperature = structuredDescription.match(/存放温度:\s*([^;]+?)(?=;)/i);
    if (storageTemperature?.[1]) normalizedSpecs.storageTemperature = cleanText(storageTemperature[1]);

    if (/抗冲击、抗震和防X射线|抗冲击.*抗震.*防X射线/i.test(evidence)) {
      normalizedSpecs.durability = '抗冲击、抗震、防 X 射线';
    }

    const warranty = structuredDescription.match(/质保期:\s*([^;]+?)(?=;)/i);
    if (warranty?.[1]) normalizedSpecs.warranty = cleanText(warranty[1]);

    const expectedFields = [
      'cardType',
      'interface',
      'capacityOptions',
      'readSpeed',
      'writeSpeedByCapacity',
      'performanceClass',
      'videoSupport',
      'dimensions',
      'operatingTemperature',
      'storageTemperature',
      'durability',
      'warranty',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面或 JSON-LD 明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '读取速度取官方 JSON-LD 中的明确上限；写入速度保留 64GB 与 128GB–1TB 的容量分段，没有把不同容量合并为一个写入速度，也未从兼容性网站或搜索摘要补写。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function extractWriteSpeedByCapacity(description: string): string | undefined {
  const ranges: string[] = [];
  const highCapacity = description.match(/128GB\s*-\s*1TB[\s\S]*?写入速度高达\s*(\d+)\s*MB\/s/i);
  if (highCapacity?.[1]) ranges.push(`128GB–1TB：${highCapacity[1]} MB/s`);
  const smallCapacity = description.match(/64GB[\s\S]*?写入速度高达\s*(\d+)\s*MB\/s/i);
  if (smallCapacity?.[1]) ranges.push(`64GB：${smallCapacity[1]} MB/s`);
  return ranges.length > 0 ? ranges.join('；') : undefined;
}

function jsonLdDescriptions(snapshot: PageSnapshot): string {
  return snapshot.jsonLd
    .flatMap((value) => {
      if (!value || typeof value !== 'object' || !('description' in value)) return [];
      const description = (value as { description?: unknown }).description;
      return typeof description === 'string' ? [description] : [];
    })
    .join(' ');
}

function cleanText(value: string): string {
  return value.replace(/<br\s*\/?>/gi, '；').replace(/\s+/g, ' ').trim();
}

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
    snapshot.bodyText,
    ...snapshot.headings,
    ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
    ...snapshot.tables.flatMap((table) => [...table.headers, ...table.rows.flat()]),
    ...snapshot.imageAltTexts,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
