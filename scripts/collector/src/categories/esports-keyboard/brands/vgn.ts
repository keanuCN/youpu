import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const vgnEsportsKeyboardAdapter = {
  name: 'esports-keyboard/vgn',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'esports-keyboard' && target.brand === 'vgn' && /(?:V98\s*Pro\s*V4|V87\s*V2|N75\s*V2|Neon\s*68|霓虹\s*68)/i.test(target.model);
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const isV87V2 = /V87\s*V2/i.test(`${target.model} ${snapshot.title}`);
    const isN75V2 = /N75\s*V2/i.test(`${target.model} ${snapshot.title}`);
    const isNeon68 = /(?:Neon\s*68|霓虹\s*68)/i.test(`${target.model} ${snapshot.title}`);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = [`找到 VGN 官方 ${target.model} 产品页的型号和结构规格。`];

    if (isNeon68 && /Magnetic Switch|磁轴/i.test(evidence)) normalizedSpecs.keyboardType = 'magnetic';
    else if (/Mechanical(?:\s+Gaming)?\s+Keyboard/i.test(evidence)) normalizedSpecs.keyboardType = 'mechanical';
    if (isNeon68) {
      if (/Layout[:：]\s*68%/i.test(evidence)) normalizedSpecs.layout = '68%（67键）';
    } else if (isN75V2) {
      if (/Layout[:：]\s*75%/i.test(evidence)) normalizedSpecs.layout = '75%';
    } else if (isV87V2) {
      if (/Layout[:：]\s*80%\s*\|\s*TKL|TKL\s*Layout/i.test(evidence)) normalizedSpecs.layout = 'TKL（87键）';
    } else if (/98%\s*layout|Layout[:：]\s*98%/i.test(evidence)) {
      normalizedSpecs.layout = '98%';
    }
    if (/Construction[:：]\s*Gasket|Gasket structure/i.test(evidence)) normalizedSpecs.mounting = 'Gasket';

    const connections: string[] = [];
    if (/Wired/i.test(evidence)) connections.push('wired');
    if (/2\.4\s*GHz/i.test(evidence)) connections.push('2.4g');
    if (/Bluetooth/i.test(evidence)) connections.push('bluetooth');
    if (connections.length > 0) normalizedSpecs.connection = [...new Set(connections)];

    if (/Backlighting[:：]\s*RGB|Full-color dynamic RGB/i.test(evidence)) normalizedSpecs.backlight = 'RGB 背光';
    if (/Hot-swappable[:：]\s*YES/i.test(evidence)) normalizedSpecs.hotSwap = true;
    if (/Battery Capacity[:：]\s*(\d+)mAh/i.test(evidence)) {
      normalizedSpecs.batteryCapacity = Number(evidence.match(/Battery Capacity[:：]\s*(\d+)mAh/i)?.[1]);
    }
    if (/V-Display mood screen|V-Display Smart Display/i.test(evidence)) normalizedSpecs.customScreen = true;
    if (/In-house dual-platform VHUB driver|Driver[:：]\s*Windows Software/i.test(evidence)) {
      normalizedSpecs.driver = 'V HUB';
    } else if (isNeon68 && /Web-based Configuration/i.test(evidence)) {
      normalizedSpecs.driver = 'V HUB 网页驱动';
    }
    if (isV87V2 && /Keycaps are made of PBT material/i.test(evidence)) normalizedSpecs.keycapMaterial = 'PBT';
    if (isNeon68) {
      const pollingRate = evidence.match(/Polling Rate[:：]\s*(\d+)/i);
      if (pollingRate?.[1]) normalizedSpecs.pollingRate = Number(pollingRate[1]);
      const rapidTriggerPrecision = evidence.match(/RT Precision[:：]\s*([\d.]+)\s*mm/i);
      if (rapidTriggerPrecision?.[1]) normalizedSpecs.rapidTriggerPrecision = Number(rapidTriggerPrecision[1]);
    }

    const missing = [
      'keyboardType',
      'switchType',
      'mounting',
      'caseMaterial',
      'layout',
      'connection',
      'pollingRate',
      'scanRate',
      'rapidTriggerPrecision',
      'actuationRange',
      'backlight',
      'driver',
      'hotSwap',
      'quickRelease',
      'batteryCapacity',
      'keycapMaterial',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从官方公开页确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      isNeon68
        ? '霓虹68 页面含超竞版/超竞版+及多个磁轴选项；按国内官方 SKU 选择超竞版+天霸轴黑武士，型号级数据不将可选轴体合并。页面列出 256K 全键扫描率，但当前类目字段上限为 100000 Hz，因此仅保留原始快照，不写入超范围规格。'
        : isN75V2
        ? '官方页面列出不同配色和轴体选项；采用国内热度对应的 N75 V2 三模型号，不将可选轴体写成全系列唯一配置。'
        : isV87V2
        ? '官方页面列出多个配色和轴体版本；型号级规格不指定单一轴体，国内热度依据只用于目标筛选，不混入规格。'
        : '同型号页面列出多款轴体和不同回报率版本；未锁定具体国内 SKU，因此不把轴体或回报率写入型号级规格。',
    );
    sourceNotes.push('官方海外页面价格为美元，不换算为人民币，seed 价格保持缺省。');

    return { normalizedSpecs, sourceNotes };
  },
};

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
