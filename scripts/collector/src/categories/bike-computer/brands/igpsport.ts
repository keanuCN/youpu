import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const igpsportBikeComputerAdapter = {
  name: 'bike-computer/igpsport',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'bike-computer' && target.brand === 'igpsport';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 iGPSPORT 官方产品页描述和图片替代文本证据。'];

    const screenSize = evidence.match(/(\d+(?:\.\d+)?)\s*(?:英寸|寸)/i);
    if (screenSize?.[1]) normalizedSpecs.screenSize = Number(screenSize[1]);

    if (/全透触控彩屏|全彩触控大屏|全彩大触屏|彩屏触控|touch(?:screen)?/i.test(evidence)) {
      normalizedSpecs.screen = '全透触控彩屏';
      normalizedSpecs.touchScreen = true;
    }

    const batteryLife = evidence.match(/(\d+)\s*\+?\s*小时(?:长续航|超长续航|续航)/i);
    if (batteryLife?.[1]) normalizedSpecs.batteryLife = Number(batteryLife[1]);

    if (/智能导航系统|路书导航|导航/i.test(evidence)) normalizedSpecs.navigation = true;

    if (/离线在线都强大|离线.*在线|online.*offline/i.test(evidence)) {
      normalizedSpecs.mapSupport = '离线 / 在线导航';
    }

    if (/语音播报|外放语音导航/i.test(evidence)) normalizedSpecs.audioPrompt = true;

    if (/全面传感器兼容/i.test(evidence)) {
      normalizedSpecs.sensorCompatibility = '全面传感器兼容';
    }

    const missing = [
      'screenSize',
      'batteryLife',
      'navigation',
      'audioPrompt',
      'weight',
      'connectivity',
      'storage',
      'waterResistance',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面描述或替代文本确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '页面详细参数表未进入当前静态快照；已使用页面描述和官方图片替代文本中的明确文案，未对图片像素做 OCR，也未从营销词推导数值。',
    );

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
    ...snapshot.tables.flatMap((table) => [
      ...table.headers,
      ...table.rows.flat(),
    ]),
    ...snapshot.imageAltTexts,
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
