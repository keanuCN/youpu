import { isIPv4 } from 'node:net';

interface Ip2RegionResult {
  city: number;
  region: string;
}

interface Ip2RegionSearcher {
  btreeSearchSync(ip: string): Ip2RegionResult | null;
}

const Ip2Region = require('node-ip2region') as {
  create(): Ip2RegionSearcher;
};
const searcher = Ip2Region.create();

/** 仅提取省级/国家级标签，不保存原始 IP、运营商、城市或坐标。 */
export function resolveVisitorRegion(ip: string | undefined): string {
  if (!ip) return '未知';
  const normalized = ip.trim().replace(/^::ffff:/i, '').replace(/^\[|\]$/g, '');
  if (!isIPv4(normalized) || normalized === '127.0.0.1') return '未知';

  try {
    const result = searcher.btreeSearchSync(normalized);
    const [country, , province] = result?.region.split('|') ?? [];
    if (country === '中国') return province && province !== '0' ? province : '中国其他地区';
    return country && country !== '0' ? country : '未知';
  } catch {
    return '未知';
  }
}
