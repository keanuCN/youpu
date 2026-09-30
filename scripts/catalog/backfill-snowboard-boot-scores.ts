import fs from 'node:fs';
import path from 'node:path';

// Editorial estimates based on recorded fit, flex, construction, and closure system.
// Value remains neutral until comparable domestic CNY prices are verified.
const scores: Record<string, [number, number, number, number, number]> = {
  'burton-ion-boa-2027.yaml': [8, 9, 8, 8, 5],
  'burton-ion-step-on-2027.yaml': [8, 9, 8, 9, 5],
  'burton-moto-boa-2027.yaml': [8, 6, 7, 8, 5],
  'burton-photon-boa-2027.yaml': [8, 8, 7.5, 8, 5],
  'k2-boundary-2027.yaml': [8, 8, 7.5, 8, 5],
  'k2-maysis-2027.yaml': [8, 8, 8, 8, 5],
  'k2-raider-2027.yaml': [8, 6, 7, 8, 5],
  'k2-taro-tamai-snowsurfer-rs-2027.yaml': [9, 7, 8, 7, 5],
  'nitro-bianca-tls-plus-2027.yaml': [9, 7, 8, 7, 5],
  'nitro-sentinel-boa-2027.yaml': [7, 5, 6, 8, 5],
  'nitro-sentinel-tls-2027.yaml': [7, 5, 6, 7, 5],
  'nitro-tangent-tls-2027.yaml': [7, 4, 6, 7, 5],
  'nitro-team-boa-2027.yaml': [8, 8, 8, 8, 5],
  'nitro-team-pro-mk-tls-2027.yaml': [8, 9, 8, 7, 5],
  'nitro-team-tls-2027.yaml': [8, 8, 8, 7, 5],
  'nitro-team-tls-wide-2027.yaml': [9, 8, 8, 7, 5],
  'nitro-venture-boa-2027.yaml': [8, 7, 7, 8, 5],
  'nitro-venture-pro-tls-2027.yaml': [8, 8, 8, 7, 5],
  'nitro-venture-step-on-tls-2027.yaml': [8, 7, 7, 9, 5],
  'nitro-venture-tls-2027.yaml': [8, 7, 7, 7, 5],
  'salomon-dialogue-dual-boa-2027.yaml': [8, 8, 8, 8, 5],
  'salomon-dialogue-dual-boa-team-2027.yaml': [8, 8, 8, 8, 5],
  'salomon-dialogue-dual-boa-wide-2027.yaml': [9, 8, 8, 8, 5],
  'salomon-echo-dual-boa-2027.yaml': [8, 9, 8, 8, 5],
  'salomon-faction-boa-2027.yaml': [8, 6, 7, 8, 5],
  'salomon-launch-boa-sj-boa-2027.yaml': [8, 7, 8, 8, 5],
  'salomon-malamute-dual-boa-2027.yaml': [7, 10, 8, 8, 5],
  'salomon-titan-boa-2027.yaml': [8, 6, 7, 8, 5],
  'salomon-trek-2027.yaml': [8, 8, 8, 7, 5],
  'salomon-x-approach-lace-sj-boa-2027.yaml': [8, 8, 8, 8, 5],
};

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'data/snowboard-boot');
const files = fs.readdirSync(dataDir).filter((name) => name.endsWith('.yaml')).sort();
const unexpected = files.filter((name) => !(name in scores));
const missing = Object.keys(scores).filter((name) => !files.includes(name));
if (unexpected.length || missing.length || files.length !== 30) {
  throw new Error(`雪鞋数据清单不匹配：实际 ${files.length}，未评分 ${unexpected.join(', ')}，文件缺失 ${missing.join(', ')}`);
}

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/^editorial_scores:/m.test(content)) throw new Error(`${file} 已存在 editorial_scores，拒绝覆盖`);
  const [fit, support, warmth, convenience, value] = scores[file]!;
  const block = [
    'editorial_scores:',
    `  fit: ${fit}`,
    `  support: ${support}`,
    `  warmth: ${warmth}`,
    `  convenience: ${convenience}`,
    `  value: ${value}`,
    '',
  ].join('\n');
  if (!/^data_source:/m.test(content)) throw new Error(`${file} 缺少 data_source 插入锚点`);
  content = content.replace(/^data_source:/m, `${block}data_source:`);
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`已为 ${files.length} 款单板雪鞋补齐五项编辑评分。`);
