import Link from 'next/link';
import { GEAR } from '@/data/boards';
import { SNOWBOARD_SETUPS } from '@/data/snowboard-setups';
import products from '@/data/snowboard-setup-products.json';
import { simpleMetadata } from '@/lib/seo';

export const metadata = simpleMetadata({
  title: '单板、固定器、雪鞋三件套选配指南',
  description: '先试雪鞋，再核对固定器接口与尺码，最后按体重和靴宽选雪板；五种玩法的搭配思路、价格依据与适用边界。',
  path: '/guides/snowboard-setup',
});

function referenceBudget(slugs: readonly string[]) {
  const rows = slugs.map(slug => products.find(p => p.slug === slug));
  if (rows.some(p => !p?.quote)) return '预算待核：尚未取得三件装备完整的官方原币报价，不估算人民币总价。';
  const quotes = rows.map(p => /^([A-Z]{3}) ([\d.]+)(?:–([\d.]+))?$/.exec(p!.quote));
  if (quotes.some(q => !q) || new Set(quotes.map(q => q![1])).size !== 1) return '来源报价币种不同，暂不合计；请按购买地区和实际可售尺码询价。';
  const low = quotes.reduce((sum, q) => sum + Number(q![2]), 0);
  const high = quotes.reduce((sum, q) => sum + Number(q![3] ?? q![2]), 0);
  return `原币挂牌价合计参考：${quotes[0]![1]} ${low.toFixed(2)}${low === high ? '' : `–${high.toFixed(2)}`}。包含不同变体或促销价，尚未核对税费、运费和同地区库存；不是中国购买预算。`;
}

export default function SnowboardSetupPage() {
  return (
    <main className="mx-auto max-w-[1080px] px-5 py-10 md:px-8">
      <p className="mono-label text-muted-foreground">FIELD NOTES · 选配指南</p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl">从合脚的雪鞋开始。</h1>
      <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground">雪鞋、固定器、雪板一起决定站姿和控制感。以下是本站基于官方资料整理的编辑候选，尚未经实物组合试装；不是厂商认证套装，也不是销量或实测排名。</p>

      <section className="mt-9 border-y border-foreground py-5">
        <h2 className="text-lg font-medium">选配顺序</h2>
        <ol className="mt-4 grid gap-5 text-sm leading-6 md:grid-cols-3">
          <li><span className="mono-label text-primary">01 · 雪鞋</span><p className="mt-2">量双脚足长，带滑雪袜试穿。屈膝时脚跟应稳定，不能靠一味缩码解决后跟浮动。脚宽、脚背和左右脚差异都要记录；品牌换算表不等于本型号内部尺寸。</p></li>
          <li><span className="mono-label text-primary">02 · 固定器</span><p className="mt-2">按实际靴码及鞋底外形试装，检查鞋跟杯、绑带长度和前后居中。Step On 需要认证专用靴；EST 仅适用于 Channel；Mini Disk 与普通圆盘的孔位范围分别核对。</p></li>
          <li><span className="mono-label text-primary">03 · 雪板</span><p className="mt-2">先查本型号的体重区间，再核对板宽、靴码和站距。标准版、W、MW、N 等标记不能混用；代表尺码参数不能覆盖整条产品线。</p></li>
        </ol>
      </section>

      <nav className="my-7 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground" aria-label="搭配场景">
        {SNOWBOARD_SETUPS.map((setup, index) => <a key={setup.id} href={`#${setup.id}`} className="underline underline-offset-4">0{index + 1} {setup.title.split('：')[0]}</a>)}
      </nav>

      {SNOWBOARD_SETUPS.map((setup, index) => (
        <section id={setup.id} key={setup.id} className="scroll-mt-24 border-t border-border py-8">
          <p className="mono-label text-primary">搭配思路 0{index + 1}</p>
          <h2 className="mt-2 text-xl font-medium md:text-2xl">{setup.title}</h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">{setup.audience}</p>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {setup.products.map((slug, position) => {
              const product = products.find(p => p.slug === slug)!;
              const gear = GEAR.find(g => g.model === product.model && g.year === product.year && g.categorySlug === product.category);
              return <div key={slug} className="border-l-2 border-primary pl-4">
                <p className="mono-label text-muted-foreground">{['雪板', '固定器', '雪鞋'][position]}</p>
                <Link href={`/gear/${gear?.id ?? slug}`} className="mt-2 block text-sm font-medium hover:underline">{product.title} →</Link>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{product.quote ? `官方原币参考：${product.quote}` : '官方价格待核'} · 核查日期 {product.checkedAt}</p>
                {product.priceNote ? <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{product.priceNote}</p> : null}
                {product.source ? <a href={product.source} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-xs text-muted-foreground underline underline-offset-4">官方资料</a> : null}
              </div>;
            })}
          </div>
          <dl className="mt-5 space-y-3 text-sm leading-6">
            <div><dt className="font-medium">搭配理由</dt><dd className="text-muted-foreground">{setup.reason}</dd></div>
            <div><dt className="font-medium">需要取舍</dt><dd className="text-muted-foreground">{setup.tradeoff}</dd></div>
            <div><dt className="font-medium">尺寸与接口检查</dt><dd className="text-muted-foreground">{setup.checks}</dd></div>
            <div><dt className="font-medium">价格与预算</dt><dd className="text-muted-foreground">{referenceBudget(setup.products)}</dd></div>
          </dl>
        </section>
      ))}

      <footer className="border-t border-foreground pt-5 text-xs leading-6 text-muted-foreground">
        <p>硬度数字是各品牌自己的尺度，不能直接跨品牌等同。热塑须依据本型号说明和店员操作，不能套用统一温度或时间。</p>
        <p className="mt-2">尺寸参考：<a className="underline" href="https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide" target="_blank" rel="noopener noreferrer">Nitro 雪鞋试穿指南</a> · <a className="underline" href="https://www.burton.com/en-us/pages/size-charts" target="_blank" rel="noopener noreferrer">Burton 尺码表</a> · <a className="underline" href="https://eu.unionbindingcompany.com/pages/disk-guide" target="_blank" rel="noopener noreferrer">Union 安装圆盘指南</a></p>
        <p className="mt-2">更新：2026-10-12。官方当前同名页面不一定属于档案标记年份，具体赛季确认情况见各产品价格依据。</p>
      </footer>
    </main>
  );
}
