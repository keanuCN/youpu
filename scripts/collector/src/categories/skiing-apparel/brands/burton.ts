import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const burtonSkiingApparelAdapter = {
  name: 'skiing-apparel/burton',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'skiing-apparel' && target.brand === 'burton';
  },

  normalize(target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = [
      snapshot.title,
      snapshot.description,
      snapshot.bodyText,
      ...snapshot.headings,
      ...snapshot.specifications.flatMap(({ label, value }) => [label, value]),
      ...snapshot.tables.flatMap((table) => [...table.headers, ...table.rows.flat()]),
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    const searchable = `${target.model} ${snapshot.title ?? ''} ${snapshot.description ?? ''} ${snapshot.headings.join(' ')}`;
    const normalizedSpecs: Record<string, unknown> = {};

    if (/\b(?:bib|bibs|overall)\b/i.test(searchable)) normalizedSpecs.garmentType = 'bib-pants';
    else if (/\b(?:pants|trousers)\b|パンツ/i.test(searchable)) normalizedSpecs.garmentType = 'pants';
    else if (/\b(?:jacket|anorak)\b|ジャケット/i.test(searchable)) normalizedSpecs.garmentType = 'jacket';

    const construction = evidence.match(/\b([23])\s*[- ]?layer\b|\b([23])\s*L\b|([23])\s*レイヤー/i);
    const constructionValue = construction?.[1] ?? construction?.[2] ?? construction?.[3];
    if (constructionValue) normalizedSpecs.construction = `${constructionValue}L`;

    setNumber(normalizedSpecs, 'waterproofMm', evidence, /(?:\bWaterproof\s+|防水性\s*)([\d,]+)\s*mm\b/i);
    setNumber(normalizedSpecs, 'breathabilityG', evidence, /(?:\bBreathability\s+|透湿性\s*)([\d,]+)\s*G\b/i);

    if (/\bWarmth\s+Shell\b|保温性\s*シェル/i.test(evidence)) normalizedSpecs.insulation = 'shell';
    else {
      const insulation = evidence.match(/(?:\bWarmth\s+|保温性\s*)((?:\d+\s*g\s+)?[\w®™-]+(?:\s+[\w®™-]+){0,2})/i);
      if (insulation?.[1]) normalizedSpecs.insulation = insulation[1].trim();
    }

    const specStart = Math.max(evidence.lastIndexOf('Tech Specs'), evidence.lastIndexOf('スペック'));
    const fitEvidence = specStart >= 0 ? evidence.slice(0, specStart) : evidence;
    const fit = fitEvidence.match(/\b(regular|relaxed|slim|baggy)\s+fit\b/i);
    if (fit?.[1]) normalizedSpecs.fit = fit[1].toLowerCase();
    else if (/レギュラーフィット/.test(fitEvidence)) normalizedSpecs.fit = 'regular';
    else if (/リラックスフィット/.test(fitEvidence)) normalizedSpecs.fit = 'relaxed';
    else if (/スリムフィット/.test(fitEvidence)) normalizedSpecs.fit = 'slim';
    else if (/バギーフィット/.test(fitEvidence)) normalizedSpecs.fit = 'baggy';

    if (/\bFully Taped Seams\b|全ての縫い目にシームテープ加工/i.test(evidence)) normalizedSpecs.seamTaping = 'fully-taped';
    else if (/\bCritically Taped Seams\b|主要な縫い目にシームテープ加工/i.test(evidence)) normalizedSpecs.seamTaping = 'critically-taped';

    if (/\b(?:Pit Zip|thigh|inner thigh)\b[^.]{0,60}\bvent/i.test(evidence) || /\bventing\b[^.]{0,80}\bvent/i.test(evidence)) {
      normalizedSpecs.venting = true;
    }
    if (/脇のベント|腿内側のベント|ベント脇|ベント腿|脇下ベンチレーション/i.test(evidence)) normalizedSpecs.venting = true;
    if (/\bpowder skirt\b|パウダースカート/i.test(evidence)) normalizedSpecs.powderSkirt = true;

    const specEvidence = specStart >= 0 ? evidence.slice(specStart) : evidence;
    const fabric = specEvidence.match(/(?:\bFabric\s+|(?:^|\s)素材\s+)(.+?)(?=\s*(?:Features|特長|Hood|フード|Pockets|ポケット|Venting|ベント|Warranty|保証|Performance|パフォーマンス)|$)/i);
    if (fabric?.[1]) normalizedSpecs.fabric = fabric[1].trim();

    return {
      normalizedSpecs,
      sourceNotes: [
        '仅提取 Burton 官方页面明确出现的款式与技术参数；未由系列名推断缺失数值。',
        '官方页面价格使用日元，未录入商品人民币价格字段。',
      ],
    };
  },
};

function setNumber(target: Record<string, unknown>, key: string, text: string, pattern: RegExp): void {
  const match = text.match(pattern);
  if (match?.[1]) target[key] = Number(match[1].replace(/,/g, ''));
}
