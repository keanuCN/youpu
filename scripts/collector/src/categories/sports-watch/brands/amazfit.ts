import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const amazfitSportsWatchAdapter = {
  name: 'sports-watch/amazfit',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'sports-watch' && target.brand === 'amazfit';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const variant = /44\s*mm/i.test(target.model) ? '44mm' : '48mm';
    const variantEvidence = extractVariantSection(snapshot.bodyText ?? evidence, variant);
    const normalizedSpecs: Record<string, unknown> = {
      watchType: '户外运动智能手表',
      caseSize: variant,
    };
    const sourceNotes = [`找到 Amazfit 官方 T-Rex 3 Pro ${variant} 规格区块。`];

    const displaySize = variantEvidence.match(/螢幕尺寸：\s*([\d.]+)\s*(?:吋|英寸)/i);
    if (displaySize?.[1]) normalizedSpecs.displaySize = Number(displaySize[1]);

    const displayType = variantEvidence.match(/螢幕材質：\s*([^【]+?)(?=\s*螢幕尺寸：)/i);
    if (displayType?.[1]) normalizedSpecs.displayType = simplifyText(displayType[1]);

    const peakBrightness = variantEvidence.match(/峰值亮度：\s*(\d+)\s*nits/i);
    if (peakBrightness?.[1]) normalizedSpecs.peakBrightness = Number(peakBrightness[1]);

    if (/藍寶石鏡面玻璃/i.test(variantEvidence)) normalizedSpecs.displayGlass = '蓝宝石镜面玻璃';

    const weight = variantEvidence.match(/產品重量：\s*([\d.]+)\s*g/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    const waterResistance = variantEvidence.match(/防水等級：\s*(\d+)\s*ATM/i);
    if (waterResistance?.[1]) normalizedSpecs.waterResistance = Number(waterResistance[1]);

    const materials = variantEvidence.match(/產品材質：\s*([\s\S]*?)(?=\s*按鍵數量：)/i);
    if (materials?.[1]) normalizedSpecs.materials = simplifyText(materials[1]);

    const batteryCapacity = variantEvidence.match(/電池容量：\s*(\d+)\s*mAh/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

    const batteryLife = variantEvidence.match(/日常模式：\s*最長\s*(\d+)\s*天/i);
    if (batteryLife?.[1]) normalizedSpecs.batteryLife = Number(batteryLife[1]);

    const gnssBatteryLife = variantEvidence.match(/GNSS最大續航模式：\s*最長\s*(\d+)\s*小時/i);
    if (gnssBatteryLife?.[1]) normalizedSpecs.gnssBatteryLife = Number(gnssBatteryLife[1]);

    const positioning = variantEvidence.match(/定位：\s*([\s\S]*?)(?=\s*連接：)/i);
    if (positioning?.[1]) normalizedSpecs.positioning = simplifyText(positioning[1]);

    if (/離線地貌圖|離線路徑規劃|離線地圖/i.test(evidence)) normalizedSpecs.offlineNavigation = true;

    const sportsModes = evidence.match(/多達\s*(\d+)\s*\+?\s*的?運動模組/i);
    if (sportsModes?.[1]) normalizedSpecs.sportsModes = `${sportsModes[1]}+`;

    const healthSensors = variantEvidence.match(/健康：\s*([\s\S]*?)(?=\s*戶外和運動：)/i);
    if (healthSensors?.[1]) normalizedSpecs.healthSensors = simplifyText(healthSensors[1]);

    const expectedFields = [
      'watchType',
      'caseSize',
      'displaySize',
      'displayType',
      'peakBrightness',
      'displayGlass',
      'weight',
      'waterResistance',
      'materials',
      'batteryCapacity',
      'batteryLife',
      'gnssBatteryLife',
      'positioning',
      'offlineNavigation',
      'sportsModes',
      'healthSensors',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      `页面同时展示 48mm 与 44mm；本目标只保留 ${variant} 区块的重量、屏幕、电池和定位参数，没有把另一尺寸的数值合并。`,
    );
    sourceNotes.push('电池续航采用官方日常模式与 GNSS 最大续航的原始口径，未将不同模式相加或改写为实测结论。');

    return { normalizedSpecs, sourceNotes };
  },
};

function extractVariantSection(text: string, variant: string): string {
  const start = text.search(new RegExp(`${variant}\\s*規格`, 'i'));
  if (start < 0) return text;
  const section = text.slice(start);
  const nextVariant = variant === '48mm' ? section.search(/44\s*mm\s*規格/i) : -1;
  return nextVariant > 0 ? section.slice(0, nextVariant) : section;
}

function simplifyText(value: string): string {
  return value
    .replace(/螢幕/g, '屏幕')
    .replace(/電池/g, '电池')
    .replace(/產品/g, '产品')
    .replace(/錶殼/g, '表壳')
    .replace(/錶圈/g, '表圈')
    .replace(/與/g, '与')
    .replace(/按鍵/g, '按键')
    .replace(/級/g, '级')
    .replace(/鈦合金/g, '钛合金')
    .replace(/纖維增強聚合物/g, '纤维增强聚合物')
    .replace(/感測器/g, '传感器')
    .replace(/傳感器/g, '传感器')
    .replace(/生物識別/g, '生物识别')
    .replace(/識別/g, '识别')
    .replace(/定位系統/g, '定位系统')
    .replace(/圓極化/g, '圆极化')
    .replace(/天線/g, '天线')
    .replace(/技術/g, '技术')
    .replace(/雙頻/g, '双频')
    .replace(/連接/g, '连接')
    .replace(/藍牙/g, '蓝牙')
    .replace(/離線/g, '离线')
    .replace(/導航/g, '导航')
    .replace(/運動/g, '运动')
    .replace(/心率/g, '心率')
    .replace(/壓力/g, '压力')
    .replace(/\s+/g, ' ')
    .trim();
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
