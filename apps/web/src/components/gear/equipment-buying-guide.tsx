import Link from 'next/link';
import { fmtOfficialPriceCny } from '@/lib/format';
import type { GearItem } from '@/types';

const winterCategories = new Set(['snowboard', 'snowboard-binding', 'snowboard-boot', 'skis']);
const columns = [
  ['usMen', 'US 男码'], ['usWomen', 'US 女码'], ['eu', 'EU'],
  ['uk', 'UK'], ['mondo', 'Mondopoint（cm）'], ['footLength', '足长（mm）'], ['notes', '备注'],
] as const;

export function EquipmentBuyingGuide({ gear }: { gear: GearItem }) {
  if (!winterCategories.has(gear.categorySlug)) return null;
  const rows = gear.equipmentSizeChart ?? [];
  const isSki = gear.categorySlug === 'skis';
  const visible = columns.filter(([key]) => rows.some((row) => row[key]));
  const references = `${gear.specs.compatibilitySources ?? ''} ${gear.specs.sizeChartSource ?? ''}`.match(/https:\/\/[^\s；]+/g) ?? [];
  const priceSource = String(gear.specs.priceSource ?? '');
  const textFields = [
    ['selectionNotes', '选码与试装'], ['fitEvidence', '脚型信息'], ['heatMolding', '鞋胆热塑'],
    ['officialPrice', '官方地区参考价'], ['priceMarket', '报价地区'],
    ['priceCheckedAt', '价格核查日期'], ['priceStatus', '价格依据'],
    ['geometryNotes', '长度与几何依据'], ['weightBasis', '重量口径'],
    ['bindingCompatibility', '靴底与固定器'], ['mountingNotes', '安装与调节'],
    ['seasonEvidence', '年款依据'], ['sourceCheckedAt', '资料整理日期'],
    ['sizeChartCheckedAt', '尺码表核查日期'],
  ] as const;
  const facts = textFields.filter(([key]) => gear.specs[key]);

  return (
    <section className="mt-6 border-t border-foreground py-5">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[16px] font-medium">{isSki ? '板长、套装与兼容依据' : '选码、兼容与价格依据'}</h3>
        {!isSki ? <Link href="/guides/snowboard-setup" className="mono-label text-primary hover:underline">查看单板科普与三件套指南 →</Link> : null}
      </div>
      {rows.length ? (
        <details className="mt-4 border-y border-border">
          <summary className="cursor-pointer py-3 text-[13px]">官方逐码参考 · {rows.length} 档</summary>
          <p className="pb-3 text-[12px] text-muted-foreground">品牌换算与尺码边界按原表记录；通用换算表不表示本型号所有尺码均在售。男女 US 码分别对应，实际鞋底外形仍须试装。</p>
          <div className="overflow-x-auto pb-3">
            <table className="w-full min-w-[580px] text-left text-[12px]">
              <thead><tr className="border-b border-border"><th className="py-2 pr-4">尺码</th>{visible.map(([key, label]) => <th key={key} className="py-2 pr-4 font-normal text-muted-foreground">{label}</th>)}</tr></thead>
              <tbody>{rows.map((row, index) => <tr key={index} className="border-b border-border/60"><th className="py-2 pr-4 font-medium">{String(row.size ?? '')}</th>{visible.map(([key]) => <td key={key} className="py-2 pr-4 align-top">{String(row[key] ?? '—')}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </details>
      ) : null}
      {facts.length ? <dl className="mt-4 space-y-3">{facts.map(([key, label]) => <div key={key}><dt className="mono-label mb-1 text-muted-foreground">{label}</dt><dd className="text-[13px] leading-relaxed">{key === 'officialPrice' ? fmtOfficialPriceCny(String(gear.specs[key])) ?? '人民币折算待补' : key === 'priceMarket' ? '官网地区报价，页面金额按人民币折算' : gear.specs[key]}</dd></div>)}</dl> : <p className="mt-3 text-[13px] text-muted-foreground">型号级选码与报价依据待补充，可先查阅三件套选配指南。</p>}
      {gear.specs.officialPrice ? <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">页面价格按 2026-10-14 人民币汇率中间价折算，仅用于参考产品定位，不代表中国零售价。促销、税费、运费和可售尺码以对应地区商店为准。</p> : null}
      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-muted-foreground">
        {[...new Set(references)].map((url, index) => <a key={url} href={url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">官方选码依据 {index + 1}</a>)}
        {/^https:\/\//.test(priceSource) ? <a href={priceSource} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">查看价格来源</a> : null}
      </div>
    </section>
  );
}
