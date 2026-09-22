import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const djiVideoCameraAdapter = {
  name: 'video-camera/dji',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'video-camera' && target.brand === 'dji';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 DJI 官方摄像机产品页标题、描述或规格摘要证据。'];

    const sensor = evidence.match(/((?:1|一)\s*(?:英寸|inch)\s*(?:CMOS|传感器))/i);
    if (sensor?.[1]) normalizedSpecs.cameraSensor = sensor[1].replace(/\s+/g, ' ').trim();

    const maxVideo = evidence.match(/(4K\s*\/\s*120fps|4K\s*\/\s*60fps)/i);
    if (maxVideo?.[1]) normalizedSpecs.maxVideo = maxVideo[1].replace(/\s+/g, '');

    const screenSize = evidence.match(/(\d+(?:\.\d+)?)\s*(?:英寸|inch)[^。；,，]{0,12}(?:屏|screen)/i);
    if (screenSize?.[1]) normalizedSpecs.screenSize = Number(screenSize[1]);

    if (/三轴云台机械增稳|三轴机械增稳|three-axis mechanical stabilization/i.test(evidence)) {
      normalizedSpecs.stabilization = '三轴机械云台增稳';
    }

    const batteryLife = evidence.match(/(\d+)\s*分钟(?:续航|的续航)/i);
    if (batteryLife?.[1]) normalizedSpecs.batteryLife = Number(batteryLife[1]);

    const weight = evidence.match(/(?:重量|weight)[^0-9]{0,16}(\d+)\s*g/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    if (/横竖拍|竖拍|vertical(?:\s|-)?shooting/i.test(evidence)) normalizedSpecs.verticalShooting = true;
    if (/立体声收音|stereo recording/i.test(evidence)) normalizedSpecs.audio = '立体声收音';

    const missing = [
      'cameraSensor',
      'maxVideo',
      'screenSize',
      'stabilization',
      'batteryLife',
      'weight',
      'verticalShooting',
      'audio',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前静态页面确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('未根据图片文字、搜索摘要或动态页面未展开的规格表补写字段。');

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
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
