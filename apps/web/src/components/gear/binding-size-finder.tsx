'use client';

import Link from 'next/link';
import { useState } from 'react';
import { matchingBindingSizes } from '@/lib/binding-size-fit';
import type { GearSizeSpec } from '@/types';

export interface BindingSizeOption {
  id: string;
  title: string;
  rows: GearSizeSpec[];
  mounting: string;
  bootCompatibility: string;
  source?: string;
  checkedAt?: string;
}

export function BindingSizeFinder({ bindings }: { bindings: BindingSizeOption[] }) {
  const [bindingId, setBindingId] = useState(bindings.find((item) => item.id === 'nitro-team-binding-2027')?.id ?? bindings[0]?.id ?? '');
  const [bootEu, setBootEu] = useState('');
  const binding = bindings.find((item) => item.id === bindingId);
  const eu = Number(bootEu);
  const valid = /^\d{2}(?:\.\d)?$/.test(bootEu) && eu >= 25 && eu <= 55;
  const result = binding && valid ? matchingBindingSizes(binding.rows, eu) : undefined;

  return <section id="binding-size-finder" className="my-9 scroll-mt-24 border-y border-foreground py-6" aria-labelledby="binding-fit-title">
    <p className="mono-label text-primary">尺码核对 / SIZE CHECK</p>
    <h2 id="binding-fit-title" className="mt-2 text-xl font-medium">用雪鞋标签，查固定器尺码。</h2>
    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">输入实际雪鞋标签上的 EU 尺码，再选固定器。这里只核对该型号的官方区间，不能代替鞋底、绑带、后跟杯与安装接口的实装检查。</p>
    <div className="mt-5 grid gap-4 md:grid-cols-[180px_1fr]">
      <label className="text-sm">雪鞋 EU 尺码
        <input type="number" min="25" max="55" step="0.1" inputMode="decimal" placeholder="例如 42.5" value={bootEu}
          onChange={(event) => setBootEu(event.target.value)} className="mt-2 block w-full border border-border bg-background px-3 py-3" />
      </label>
      <label className="text-sm">固定器型号
        <select value={bindingId} onChange={(event) => setBindingId(event.target.value)} className="mt-2 block w-full border border-border bg-background px-3 py-3">
          {bindings.map((item) => <option key={item.id} value={item.id}>{item.title}{item.rows.length ? '' : ' · 尺码表待补'}</option>)}
        </select>
      </label>
    </div>
    <div className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6" role="status" aria-live="polite">
      {!bootEu ? <p>先填雪鞋尺码。US 男码和女码是不同口径，不在这里自动换算。</p>
        : !valid ? <p>请输入 25–55 之间、最多一位小数的 EU 尺码。</p>
        : !result?.known ? <p>该型号尚无可读取的 EU 尺码表，暂不判定适配；请查看型号档案中的原始选码说明。</p>
        : result.matches.length ? <>
          <p className="font-medium">EU {bootEu} 命中的官方尺码：{[...new Set(result.matches.map((row) => String(row.size)))].join(' / ')}</p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[440px] text-left text-xs">
              <thead><tr className="border-b border-border">{['固定器 / 口径', 'EU', 'US 男', 'US 女', 'MP / cm'].map((name) => <th key={name} className="py-2 pr-4 font-medium">{name}</th>)}</tr></thead>
              <tbody>{result.matches.map((row, index) => <tr key={`${String(row.size)}-${index}`} className="border-b border-border">{['size', 'eu', 'usMen', 'usWomen', 'mondo'].map((key) => <td key={key} className="py-2 pr-4">{key === 'size' && row.gender ? `${String(row.size)} · ${String(row.gender)}` : row[key] === undefined ? '未提供' : String(row[key])}</td>)}</tr>)}</tbody>
            </table>
          </div>
          {[...new Set(result.matches.map((row) => String(row.size)))].length > 1 ? <p className="mt-3 text-muted-foreground">处于重叠区间，请用本人的实际雪鞋试装两个尺码，不能只按大小偏好任选。</p> : null}
        </> : <p>EU {bootEu} 未命中已收录的官方区间。请先复核雪鞋标签和型号，勿直接据此认定实物一定不兼容。</p>}
      {result?.unknown ? <p className="mt-2 text-muted-foreground">另有 {result.unknown} 行没有可读取的 EU 范围，结论只覆盖已明确的区间。</p> : null}
    </div>
    {binding ? <div className="mt-5 space-y-2 text-xs leading-6 text-muted-foreground">
      <p>安装接口：{binding.mounting || '待核对型号圆盘与孔位。'}</p>
      <p>雪鞋兼容：{binding.bootCompatibility || '需用实际雪鞋确认，不能只根据尺码认定兼容。'}</p>
      <p className="flex flex-wrap gap-x-4"><Link href={`/gear/${binding.id}`} className="underline underline-offset-4">查看完整档案</Link>
        {binding.source ? <a href={binding.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">官方尺码依据</a> : null}
        {binding.checkedAt ? <span>尺码核查：{binding.checkedAt}</span> : null}</p>
    </div> : null}
  </section>;
}
