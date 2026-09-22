import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const djiDroneAdapter = {
  name: 'drone/dji',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'drone' && target.brand === 'dji';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 DJI 官方技术参数页标题和页面摘要证据。'];

    const weightNote = evidence.match(/轻于\s*249\s*克|under\s*249\s*g/i);
    if (weightNote) normalizedSpecs.weightNote = '轻于 249 g';

    const maxVideo = evidence.match(/(\d{1,4}K\s*\/\s*\d+fps(?:\s+HDR)?)/i);
    if (maxVideo?.[1]) {
      normalizedSpecs.maxVideo = maxVideo[1].replace(/\s+/g, ' ');
    } else {
      const detailedVideo = [...evidence.matchAll(/(\d{1,4}K)[^。；,，]{0,160}/gi)]
        .map((match) => match[0])
        .find((value) => /\d+fps/i.test(value));
      const fpsValues = [...(detailedVideo?.matchAll(/(\d+)fps/gi) ?? [])]
        .map((match) => Number(match[1]))
        .filter((value) => Number.isFinite(value));
      if (detailedVideo && fpsValues.length > 0) normalizedSpecs.maxVideo = `4K/${Math.max(...fpsValues)}fps`;
    }

    const transmissionRange =
      evidence.match(/(?:图传距离|传输距离|max\s+transmission\s+distance|最大信号有效距离)[^0-9]{0,220}(\d+(?:\.\d+)?)\s*(?:公里|km)/i) ??
      evidence.match(/(\d+(?:\.\d+)?)\s*(?:公里|km)[^。；,，]{0,20}(?:图传|transmission)/i);
    if (transmissionRange?.[1]) normalizedSpecs.transmissionRange = Number(transmissionRange[1]);

    const cameraSensor =
      evidence.match(/(?:影像传感器|image\s+sensor)\s*((?:1\/1\.3|1\/2\.3)\s*(?:英寸|inch)?\s*(?:CMOS|影像传感器|image\s+sensor)?)/i) ??
      evidence.match(/((?:1\/1\.3|1\/2\.3)[\s-]*(?:英寸|inch)[^。；,，]{0,12}(?:CMOS|image\s+sensor))/i);
    if (cameraSensor?.[1]) normalizedSpecs.cameraSensor = cameraSensor[1].replace(/\s+/g, ' ').trim();

    const flightTime = evidence.match(/(?:最长飞行时间|max\s+flight\s+time)[^0-9]{0,30}(\d+)\s*(?:分钟|mins?|min)/i);
    if (flightTime?.[1]) normalizedSpecs.flightTime = Number(flightTime[1]);

    const batteryCapacity = evidence.match(/(?:电池容量|battery\s+capacity|capacity)[^0-9]{0,30}(\d+)\s*(?:毫安时|mAh)/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

    if (/全向[^。；,，]{0,12}避障|omnidirectional\s+obstacle/i.test(evidence)) {
      normalizedSpecs.obstacleSensing = 'omnidirectional';
    }

    if (/全向智能跟随|subject\s+tracking|active\s+track/i.test(evidence)) {
      normalizedSpecs.subjectTracking = true;
    }

    if (/竖拍|vertical\s+shooting/i.test(evidence)) normalizedSpecs.verticalShooting = true;

    const missing = [
      'cameraSensor',
      'flightTime',
      'batteryCapacity',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前静态页面摘要确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '仅使用页面正文、标题、结构化数据和规格列表中的明确事实；未根据搜索摘要、图片或相近型号补写字段。',
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
    ...snapshot.jsonLd.map((value) => JSON.stringify(value)),
  ]
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
