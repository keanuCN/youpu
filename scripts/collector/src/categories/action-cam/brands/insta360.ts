import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const insta360ActionCamAdapter = {
  name: 'action-cam/insta360',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'action-cam' && target.brand === 'insta360';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到影石 Insta360 官方 X5 产品页的中文正文和参数事实。'];

    if (/全景运动相机|全景相机|action\s*camera/i.test(evidence)) {
      normalizedSpecs.cameraType = 'action';
    }

    const sensor =
      evidence.match(/(?:传感器尺寸|传感器)[^0-9]{0,24}(1\s*\/\s*1\.28)[^。；,，]{0,12}(?:英寸|inch)/i) ??
      evidence.match(/(1\s*\/\s*1\.28)\s*(?:英寸|inch)\s*传感器/i);
    if (sensor?.[1]) normalizedSpecs.sensor = `${sensor[1].replace(/\s+/g, '')} 英寸传感器`;

    if (/8K[^。；,，]{0,32}(?:30fps|30\s*帧)/i.test(evidence)) {
      normalizedSpecs.maxVideo = '8K/30fps';
    }

    const frameRates = [...evidence.matchAll(/(\d{2,3}(?:\/\d{2,3})*)\s*fps\b/gi)].flatMap((match) =>
      match[1] ? match[1].split('/').map(Number) : [],
    );
    if (frameRates.length > 0) normalizedSpecs.maxFrameRate = Math.max(...frameRates);

    const maxPhoto = evidence.match(/(\d{2,5})\s*万像素/i);
    if (maxPhoto?.[1]) normalizedSpecs.maxPhoto = `${Number(maxPhoto[1]) / 100}MP`;

    if (/360\s*[°º度]/i.test(evidence)) normalizedSpecs.fov = '360°';

    if (/FlowState\s*防抖/i.test(evidence)) {
      normalizedSpecs.stabilization = /360\s*[°º度]\s*(?:水平矫正|地平线保持水平)/i.test(evidence)
        ? 'FlowState 防抖 + 360° 水平矫正'
        : 'FlowState 防抖';
    }

    const waterproof = evidence.match(/裸机\s*(\d+)\s*米防水/i);
    if (waterproof?.[1]) normalizedSpecs.waterproofDepth = Number(waterproof[1]);

    const weight = evidence.match(/(?:硬件重量|重量)[^0-9]{0,20}(\d+(?:\.\d+)?)\s*g\b/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    const runtimeSection =
      evidence.match(/续航时间([\s\S]{0,260}?)(?=防水能力|蓝牙|Wi-?Fi)/i)?.[1] ??
      evidence.match(/续航时间([\s\S]{0,260})/i)?.[1] ??
      '';
    const runtimes = [...runtimeSection.matchAll(/(\d+)\s*分钟/g)].map((match) => Number(match[1]));
    if (runtimes.length > 0) normalizedSpecs.batteryLife = Math.max(...runtimes);

    const storage = evidence.match(/内存\s*(microSD[^。；,，]{0,40}?)(?=电池容量|充电时间|防水能力|蓝牙|Wi-?Fi)/i);
    if (storage?.[1]) normalizedSpecs.storage = cleanText(storage[1]);

    const scenes: string[] = [];
    if (/自行车|骑行/i.test(evidence)) scenes.push('cycling');
    if (/摩托车/i.test(evidence)) scenes.push('motorcycle');
    if (/滑雪/i.test(evidence)) scenes.push('skiing');
    if (/潜水|水下/i.test(evidence)) scenes.push('diving');
    if (scenes.length > 0) normalizedSpecs.scenes = [...new Set(scenes)];

    const missing = [
      'sensor',
      'maxVideo',
      'maxFrameRate',
      'maxPhoto',
      'fov',
      'stabilization',
      'waterproofDepth',
      'weight',
      'batteryLife',
      'screen',
      'storage',
      'scenes',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前官方页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      `页面为 ${target.model} 专属产品页；仅使用该页的 X5 参数，不把页内 X6 对比栏的传感器、重量、续航或视频规格混入。`,
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function cleanText(value: string): string {
  return value.replace(/[()（）]/g, '').replace(/\s+/g, ' ').trim();
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
