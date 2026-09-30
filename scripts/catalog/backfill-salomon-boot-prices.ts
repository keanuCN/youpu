import fs from 'node:fs';
import path from 'node:path';

const prices: Record<string, number> = {
  'salomon-dialogue-dual-boa-2027.yaml': 429.95,
  'salomon-dialogue-dual-boa-team-2027.yaml': 429.95,
  'salomon-dialogue-dual-boa-wide-2027.yaml': 429.95,
  'salomon-echo-dual-boa-2027.yaml': 469.95,
  'salomon-faction-boa-2027.yaml': 279.95,
  'salomon-launch-boa-sj-boa-2027.yaml': 389.95,
  'salomon-malamute-dual-boa-2027.yaml': 499.95,
  'salomon-titan-boa-2027.yaml': 269.95,
  'salomon-trek-2027.yaml': 599.95,
  'salomon-x-approach-lace-sj-boa-2027.yaml': 349.95,
};

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'data/snowboard-boot');
const files = fs.readdirSync(dataDir).filter((file) => file.startsWith('salomon-') && file.endsWith('.yaml')).sort();
const expected = Object.keys(prices).sort();
if (files.length !== expected.length || files.some((file, index) => file !== expected[index])) {
  throw new Error(`Salomon 雪鞋清单不匹配：实际 ${files.join(', ')}`);
}

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/^price:/m.test(content)) throw new Error(`${file} 已有价格，拒绝覆盖`);
  const price = prices[file]!;
  content = content.replace(
    /^specs:\s*$/m,
    `price:\n  min: ${price}\n  max: ${price}\n  currency: USD\nspecs:`,
  );
  if (!/^data_source:\s*$/m.test(content)) throw new Error(`${file} 缺少 data_source`);
  content = content.replace(
    /^(  origin_url: [^\n]+)$/m,
    `$1\n  snapshot_url: https://www.salomon.com/en-us/c/men/winter-equipment/snowboard/boots`,
  );
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`已为 ${files.length} 款 Salomon 单板雪鞋补录美国官网 USD 标价及官方目录来源。`);
