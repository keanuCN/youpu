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
    if (maxVideo?.[1]) normalizedSpecs.maxVideo = maxVideo[1].replace(/\s+/g, ' ');

    const transmissionRange = evidence.match(/(\d+(?:\.\d+)?)\s*(?:公里|km)[^。；,，]{0,20}(?:图传|transmission)/i);
    if (transmissionRange?.[1]) normalizedSpecs.transmissionRange = Number(transmissionRange[1]);

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
      '官方技术参数页的详细规格表在当前 Cheerio 快照中由前端动态渲染，未根据搜索摘要或页面标题补写未出现的传感器、续航和电池参数。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function pageEvidence(snapshot: PageSnapshot): string {
  return [
    snapshot.title,
    snapshot.description,
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
