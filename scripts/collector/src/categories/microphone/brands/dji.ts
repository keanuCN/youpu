import type { AdapterResult, CrawlTarget, PageSnapshot } from '../../../engine/types';

export const djiMicrophoneAdapter = {
  name: 'microphone/dji',

  canHandle(target: CrawlTarget): boolean {
    return target.category === 'microphone' && target.brand === 'dji';
  },

  normalize(_target: CrawlTarget, snapshot: PageSnapshot): AdapterResult {
    const evidence = pageEvidence(snapshot);
    const transmitter = sectionBetween(evidence, 'DJI Mic Mini 发射器', 'DJI Mic Mini 接收器');
    const receiver = sectionBetween(evidence, 'DJI Mic Mini 接收器', 'DJI Mic Mini 充电盒');
    const chargingCase = sectionBetween(evidence, 'DJI Mic Mini 充电盒', '通用麦克风');
    const general = sectionBetween(evidence, '通用麦克风', 'DJI Mic 系列手机版接收器');
    const normalizedSpecs: Record<string, unknown> = {};
    const sourceNotes = ['找到 DJI 大疆官方 DJI Mic Mini 技术参数页的组件级规格证据。'];

    if (/无线麦克风|wireless\s+microphone/i.test(evidence)) normalizedSpecs.microphoneType = '无线麦克风';

    setNumber(normalizedSpecs, 'transmitterWeight', transmitter, /重量\s*约\s*([\d.]+)\s*克/i);
    setNumber(normalizedSpecs, 'receiverWeight', receiver, /重量\s*约\s*([\d.]+)\s*克/i);
    setNumber(normalizedSpecs, 'chargingCaseWeight', chargingCase, /重量\s*约\s*([\d.]+)\s*克/i);
    setNumber(normalizedSpecs, 'transmitterBatteryCapacity', transmitter, /电池容量\s*([\d.]+)\s*毫安时/i);
    setNumber(normalizedSpecs, 'receiverBatteryCapacity', receiver, /电池容量\s*([\d.]+)\s*毫安时/i);
    setNumber(normalizedSpecs, 'chargingCaseBatteryCapacity', chargingCase, /电池容量\s*([\d.]+)\s*毫安时/i);
    setNumber(normalizedSpecs, 'transmitterChargingTime', transmitter, /充电时间\s*约\s*([\d.]+)\s*分钟/i);
    setNumber(normalizedSpecs, 'receiverChargingTime', receiver, /充电时间\s*约\s*([\d.]+)\s*分钟/i);
    setNumber(normalizedSpecs, 'chargingCaseChargingTime', chargingCase, /充电时间\s*约\s*([\d.]+)\s*小时/i);
    setNumber(normalizedSpecs, 'transmitterWorkingTime', transmitter, /工作时间\s*约\s*([\d.]+)\s*小时/i);
    setNumber(normalizedSpecs, 'receiverWorkingTime', receiver, /工作时间\s*约\s*([\d.]+)\s*小时/i);

    const polarPattern = general?.match(/指向性\s*([^频]+?)频率响应/i);
    if (polarPattern?.[1]) normalizedSpecs.polarPattern = polarPattern[1].trim();

    const frequencyResponse = general?.match(
      /频率响应\s*低切功能关：\s*([\d.]+\s*Hz\s*至\s*[\d.]+\s*kHz)\s*低切功能开：\s*([\d.]+\s*Hz\s*至\s*[\d.]+\s*kHz)/i,
    );
    if (frequencyResponse?.[1] && frequencyResponse[2]) {
      normalizedSpecs.frequencyResponse = `低切关：${normalizeText(frequencyResponse[1])}；低切开：${normalizeText(frequencyResponse[2])}`;
    }

    setNumber(normalizedSpecs, 'maxSPL', general, /最大声压级\s*([\d.]+)\s*dB\s*SPL/i);
    setNumber(normalizedSpecs, 'equivalentNoise', general, /等效噪声\s*([\d.]+)\s*dBA/i);
    setNumber(normalizedSpecs, 'maxTransmissionDistance', general, /最大传输距离\s*([\d.]+)\s*米/i);

    const wirelessMode = transmitter?.match(/无线模式\s*([A-Za-z0-9 ]+?)(?=等效|蓝牙协议|无线模式工作频率|$)/i);
    if (wirelessMode?.[1]) normalizedSpecs.wirelessMode = normalizeText(wirelessMode[1]);
    const bluetoothProtocol = transmitter?.match(/蓝牙协议\s*(蓝牙\s*[\d.]+)/i);
    if (bluetoothProtocol?.[1]) normalizedSpecs.bluetoothProtocol = normalizeText(bluetoothProtocol[1]);

    const expectedFields = [
      'microphoneType',
      'transmitterWeight',
      'receiverWeight',
      'chargingCaseWeight',
      'transmitterBatteryCapacity',
      'receiverBatteryCapacity',
      'chargingCaseBatteryCapacity',
      'transmitterChargingTime',
      'receiverChargingTime',
      'chargingCaseChargingTime',
      'transmitterWorkingTime',
      'receiverWorkingTime',
      'polarPattern',
      'frequencyResponse',
      'maxSPL',
      'equivalentNoise',
      'maxTransmissionDistance',
      'wirelessMode',
      'bluetoothProtocol',
    ];
    const missing = expectedFields.filter((key) => normalizedSpecs[key] === undefined);
    if (missing.length > 0) {
      sourceNotes.push(`以下字段未从对应组件或通用规格块明确确认，保持缺省：${missing.join('、')}。`);
    }
    sourceNotes.push(
      '发射器、接收器和充电盒分别按官方页面区块提取；通用麦克风声学参数单独保存，未把组件重量、电池或续航合并成整套设备的单一数值。',
    );

    return { normalizedSpecs, sourceNotes };
  },
};

function sectionBetween(value: string, startMarker: string, endMarker: string): string | undefined {
  const start = value.indexOf(startMarker);
  if (start < 0) return undefined;
  const end = value.indexOf(endMarker, start + startMarker.length);
  return value.slice(start, end < 0 ? value.length : end);
}

function setNumber(target: Record<string, unknown>, key: string, value: string | undefined, pattern: RegExp): void {
  if (!value) return;
  const match = value.match(pattern);
  if (match?.[1]) target[key] = Number(match[1]);
}

function normalizeText(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
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
