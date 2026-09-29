import fs from 'node:fs';
import path from 'node:path';

// Scores are editorial estimates based on the recorded product positioning,
// entry system, terrain, cushioning/structure notes, and published flex where available.
// The value score is held at a neutral 5 until comparable CNY prices are collected.
const scores: Record<string, [number, number, number, number, number]> = {
  'burton-cartel-re-flex-2027.yaml': [8, 7.5, 9, 6, 5],
  'burton-cartel-x-re-flex-2027.yaml': [9, 7.5, 8.5, 6, 5],
  'burton-freestyle-re-flex-2027.yaml': [5.5, 7, 8, 6, 5],
  'burton-genesis-re-flex-2027.yaml': [8, 9, 8.5, 6, 5],
  'burton-lexa-x-est-2027.yaml': [8, 8, 8, 6, 5],
  'burton-mission-re-flex-2027.yaml': [6.5, 7, 8, 6, 5],
  'burton-step-on-genesis-re-flex-2027.yaml': [8, 9, 8, 9, 5],
  'burton-step-on-re-flex-2027.yaml': [7.5, 7, 8, 9, 5],
  'cosone-step-on-binding-2026.yaml': [5, 5, 5, 8, 5],
  'decathlon-snb-500-binding-2026.yaml': [5, 7, 7.5, 6, 5],
  'flow-fenix-binding-2027.yaml': [6.5, 7.5, 8, 8, 5],
  'flow-fuse-binding-2026.yaml': [8, 7.5, 8, 8.5, 5],
  'flow-fuse-hybrid-binding-2026.yaml': [8, 8, 8.5, 8, 5],
  'flow-nexus-binding-2027.yaml': [5, 8, 7.5, 8.5, 5],
  'flow-nx2-carbon-binding-2027.yaml': [9, 7.5, 8, 8.5, 5],
  'flow-nx2-hybrid-binding-2027.yaml': [8.5, 8, 8, 8, 5],
  'flux-cv-2027.yaml': [8.5, 7.5, 8, 6, 5],
  'flux-ds-2027.yaml': [7.5, 8, 9, 6, 5],
  'flux-gs-2026.yaml': [5.5, 8, 8.5, 6, 5],
  'flux-xf-2026.yaml': [8.5, 7.5, 8.5, 6, 5],
  'flux-xv-2026.yaml': [9.5, 7, 7.5, 6, 5],
  'jones-mercury-binding-2026.yaml': [8, 8, 9, 6, 5],
  'jones-mercury-fase-binding-2026.yaml': [8, 8, 9, 8, 5],
  'jones-orion-binding-2026.yaml': [7, 8, 8.5, 6, 5],
  'nidecker-kaon-plus-2026.yaml': [7.5, 7.5, 8, 6, 5],
  'nidecker-lt-supermatic-2026.yaml': [8.5, 8, 8.5, 9, 5],
  'nidecker-og-supermatic-2026.yaml': [8, 8, 8.5, 9, 5],
  'nidecker-orbit-binding-2027.yaml': [7, 8, 8, 6, 5],
  'nitro-fate-binding-2027.yaml': [6.5, 8, 8.5, 6, 5],
  'nitro-one-binding-2027.yaml': [7.5, 8, 9, 6, 5],
  'nitro-phantom-binding-2027.yaml': [8, 9, 8, 6, 5],
  'nitro-phantom-plus-binding-2027.yaml': [9, 9, 8, 6, 5],
  'nitro-poison-binding-2027.yaml': [7.5, 8, 8.5, 6, 5],
  'nitro-rambler-binding-2027.yaml': [5.5, 7, 8, 6, 5],
  'nitro-talent-binding-2027.yaml': [6.5, 7.5, 8.5, 6, 5],
  'nitro-team-binding-2027.yaml': [7.5, 8, 9, 6, 5],
  'nitro-team-pro-binding-2027.yaml': [8.5, 8, 8.5, 6, 5],
  'rome-390-boss-aw-binding-2027.yaml': [7, 8, 8.5, 6, 5],
  'rome-390-boss-fw-binding-2027.yaml': [8, 8, 8.5, 6, 5],
  'rome-brass-aw-binding-2027.yaml': [6.5, 8, 8.5, 6, 5],
  'rome-katana-aw-binding-2027.yaml': [8.5, 9, 8.5, 6, 5],
  'rome-katana-aw-fase-binding-2027.yaml': [8.5, 9, 8.5, 8, 5],
  'rome-katana-aw-pro-fase-binding-2027.yaml': [9.5, 8.5, 8, 8, 5],
  'rome-katana-fw-pro-binding-2027.yaml': [9, 8, 8, 6, 5],
  'rome-volt-fase-binding-2027.yaml': [6.5, 7.5, 8.5, 8, 5],
  'salomon-district-binding-2026.yaml': [7, 8, 9, 6, 5],
  'salomon-district-pro-binding-2026.yaml': [8.5, 8, 8, 6, 5],
  'salomon-edb-binding-2026.yaml': [6.5, 7.5, 8.5, 6, 5],
  'salomon-edb-prime-binding-2026.yaml': [8, 8, 8.5, 6, 5],
  'salomon-highlander-binding-2026.yaml': [8.5, 8, 8, 6, 5],
  'salomon-hologram-binding-2026.yaml': [7.5, 8.5, 9, 6, 5],
  'salomon-pact-binding-2026.yaml': [5.5, 7.5, 8.5, 6, 5],
  'salomon-rhythm-binding-2026.yaml': [5.5, 8, 8.5, 6, 5],
  'union-atlas-2027.yaml': [8, 8, 8.5, 6, 5],
  'union-atlas-pro-2027.yaml': [9.5, 8.5, 8, 6, 5],
  'union-force-2027.yaml': [8, 8, 9, 6, 5],
  'union-force-classic-2027.yaml': [7, 8, 9, 6, 5],
  'union-legacy-2027.yaml': [6, 9, 8.5, 6, 5],
  'union-trilogy-2027.yaml': [8, 8.5, 9, 6, 5],
  'union-ultra-2027.yaml': [7, 9.5, 8.5, 6, 5],
};

const root = path.resolve(import.meta.dirname, '../..');
const dataDir = path.join(root, 'data/snowboard-binding');
const files = fs.readdirSync(dataDir).filter((name) => name.endsWith('.yaml')).sort();
const unexpected = files.filter((name) => !(name in scores));
const missing = Object.keys(scores).filter((name) => !files.includes(name));
if (unexpected.length || missing.length || files.length !== 60) {
  throw new Error(`固定器数据清单不匹配：实际 ${files.length}，未评分 ${unexpected.join(', ')}，文件缺失 ${missing.join(', ')}`);
}

for (const file of files) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  if (/^editorial_scores:/m.test(content)) throw new Error(`${file} 已存在 editorial_scores，拒绝覆盖`);
  const [response, comfort, versatility, convenience, value] = scores[file]!;
  const block = [
    'editorial_scores:',
    `  response: ${response}`,
    `  comfort: ${comfort}`,
    `  versatility: ${versatility}`,
    `  convenience: ${convenience}`,
    `  value: ${value}`,
    '',
  ].join('\n');
  if (!/^data_source:/m.test(content)) throw new Error(`${file} 缺少 data_source 插入锚点`);
  content = content.replace(/^data_source:/m, `${block}data_source:`);

  const officialFlex: Record<string, number> = {
    'union-atlas-pro-2027.yaml': 9,
    'union-legacy-2027.yaml': 5,
    'union-trilogy-2027.yaml': 7,
    'union-ultra-2027.yaml': 6,
  };
  if (file in officialFlex) {
    content = content.replace(/^(  entrySystem: [^\n]+\n)/m, `$1  flex: ${officialFlex[file]}\n`);
  }
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log(`已为 ${files.length} 款单板固定器补齐五项编辑评分；另补录 4 款 Union 官方硬度。`);
