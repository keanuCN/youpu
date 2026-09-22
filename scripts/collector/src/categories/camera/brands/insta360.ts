import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const insta360CameraAdapter = {
  name: 'camera/insta360',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'camera' && target.brand === 'insta360';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到影石 Insta360 官方相机产品页的明确规格证据。'];

    if (/360\s*(?:°|度)?\s*(?:全景)?(?:相机|camera)|360\s*camera|全景(?:运动)?相机/i.test(evidence)) {
      normalizedSpecs.cameraType = '360°全景相机';
    }

    const cameraSensor = evidence.match(/((?:1\s*\/\s*2|1\/2)\s*(?:英寸|inch|''|"))/i);
    if (cameraSensor?.[1]) {
      normalizedSpecs.cameraSensor = cameraSensor[1].replace(/\s+/g, ' ').replace(/''|"/g, ' 英寸').trim();
    }

    const maxVideo = evidence.match(/(8K\s*(?:\/|@)?\s*30\s*fps(?:\s*\/\s*5\.7K\s*(?:\/|@)?\s*60\s*fps)?)/i);
    if (maxVideo?.[1]) {
      normalizedSpecs.maxVideo = maxVideo[1]
        .replace(/\s+/g, '')
        .replace(/@/g, '/')
        .replace(/([\d.]+K)(\d+fps)/gi, '$1/$2');
    }

    const maxPhoto = evidence.match(/(\d+)\s*MP\b/i) ?? evidence.match(/(\d+)\s*万像素/i);
    if (maxPhoto?.[1]) {
      normalizedSpecs.maxPhoto = maxPhoto[0].includes('万')
        ? `${Number(maxPhoto[1]) / 100}MP`
        : `${maxPhoto[1]}MP`;
    }

    if (/FlowState\s*(?:Stabilization|防抖)|FlowState/i.test(evidence)) {
      normalizedSpecs.stabilization = 'FlowState 防抖';
    }

    const screenSize = evidence.match(/(?:屏幕尺寸|screen\s*size)[^0-9]{0,24}(\d+(?:\.\d+)?)\s*(?:英寸|inch)/i);
    if (screenSize?.[1]) normalizedSpecs.screenSize = Number(screenSize[1]);
    const inlineScreenSize = evidence.match(/(\d+(?:\.\d+)?)\s*(?:英寸|")\s*[^。；,，]{0,12}(?:触摸)?屏/i);
    if (normalizedSpecs.screenSize === undefined && inlineScreenSize?.[1]) {
      normalizedSpecs.screenSize = Number(inlineScreenSize[1]);
    }

    const batteryLife = evidence.match(/(?:续航时间|run\s*time)[^0-9]{0,40}(\d+)\s*(?:分钟|mins?|minutes?)/i);
    if (batteryLife?.[1]) normalizedSpecs.batteryLife = Number(batteryLife[1]);

    const batteryCapacity = evidence.match(/(?:电池容量|battery\s*capacity)[^0-9]{0,30}(\d+)\s*(?:mAh|毫安时)/i);
    if (batteryCapacity?.[1]) normalizedSpecs.batteryCapacity = Number(batteryCapacity[1]);

    const weight = evidence.match(/(?:重量|weight)[^0-9]{0,20}(\d+(?:\.\d+)?)\s*g\b/i);
    if (weight?.[1]) normalizedSpecs.weight = Number(weight[1]);

    const waterproof = evidence.match(/(?:防水能力|waterproof)[^。；,，]{0,80}?(?:裸机\s*)?(\d+)\s*(?:米|m)(?:防水|waterproof)?/i);
    if (waterproof?.[1]) normalizedSpecs.waterproof = `裸机 ${waterproof[1]} m 防水`;

    const missing = [
      'cameraSensor',
      'maxVideo',
      'maxPhoto',
      'stabilization',
      'batteryLife',
      'batteryCapacity',
      'weight',
      'waterproof',
    ].filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从当前页面明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push('仅使用页面标题、正文、规格列表和结构化数据中的明确事实；未根据图片、搜索摘要或相近型号补写字段。');

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
