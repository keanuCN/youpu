import Link from 'next/link';
import { GEAR } from '@/data/boards';
import { SNOWBOARD_SETUPS } from '@/data/snowboard-setups';
import products from '@/data/snowboard-setup-products.json';
import { simpleMetadata } from '@/lib/seo';
import { SnowboardStanceGuide } from '@/components/gear/snowboard-stance-guide';
import { SnowboardInstructorSystems } from '@/components/gear/snowboard-instructor-systems';
import { SnowboardRidingStyles } from '@/components/gear/snowboard-riding-styles';
import { fmtOfficialPriceCny, fmtPrice, officialPriceRangeCny } from '@/lib/format';

export const metadata = simpleMetadata({
  title: '单板、固定器、雪鞋三件套选配指南',
  description: '了解单板全山、刻滑、平花、公园、跳台与粉雪等滑行风格，再学习站姿、固定器角度和三件套搭配。',
  path: '/guides/snowboard-setup',
});

function referenceBudget(slugs: readonly string[]) {
  const rows = slugs.map(slug => products.find(p => p.slug === slug));
  if (rows.some(p => !p?.quote)) return '预算待核：尚未取得三件装备完整的官网报价，不估算人民币总价。';
  const ranges = rows.map(p => officialPriceRangeCny(p!.quote));
  if (ranges.some(range => !range)) return '人民币折算待补；请按购买地区和实际可售尺码询价。';
  const low = ranges.reduce((sum, range) => sum + range!.min, 0);
  const high = ranges.reduce((sum, range) => sum + range!.max, 0);
  return `官网地区价合计折合人民币：${fmtPrice(low)}${low === high ? '' : `–${fmtPrice(high)}`}。按 2026-10-14 人民币汇率中间价换算，含不同变体或促销价，尚未核对税费、运费和同地区库存；不是中国购买预算。`;
}

function GuideQuickNav() {
  return (
    <nav aria-label="科普章节快速导航" className="border-y border-border py-4 lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:border-y-0 lg:py-0">
      <p className="mono-label mb-3 text-primary">本页章节</p>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-1 text-[13px] leading-6 sm:grid-cols-3 lg:grid-cols-1">
        <li><a href="#setup-order" className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">选配顺序</a></li>
        <li>
          <a href="#riding-styles" className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">单板滑行风格</a>
          <ul className="ml-3 space-y-0.5 border-l border-border py-1 pl-3 text-muted-foreground lg:ml-4">
            <li><a href="#style-all-mountain" className="transition-colors hover:text-primary">全山</a></li>
            <li><a href="#style-carving" className="transition-colors hover:text-primary">刻滑</a></li>
            <li><a href="#style-flatground" className="transition-colors hover:text-primary">平花</a></li>
            <li><a href="#style-park" className="transition-colors hover:text-primary">公园</a></li>
            <li><a href="#style-jumps" className="transition-colors hover:text-primary">跳台 / Big Air</a></li>
            <li><a href="#style-halfpipe" className="transition-colors hover:text-primary">半管</a></li>
            <li><a href="#style-freeride" className="transition-colors hover:text-primary">自由骑与粉雪</a></li>
            <li><a href="#field-reports" className="transition-colors hover:text-primary">公开实测样本</a></li>
          </ul>
        </li>
        <li>
          <a href="#stance-guide" className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">站姿与固定器角度</a>
          <ul className="ml-3 space-y-0.5 border-l border-border py-1 pl-3 text-muted-foreground lg:ml-4">
            <li><a href="#regular-goofy" className="transition-colors hover:text-primary">Regular / Goofy 怎么选</a></li>
            <li><a href="#stance-angles" className="transition-colors hover:text-primary">常见角度怎么选</a></li>
            <li><a href="#stance-simulator" className="transition-colors hover:text-primary">脚步角度模拟</a></li>
            <li><a href="#stance-adjust" className="transition-colors hover:text-primary">转圆盘，再按刻度复核</a></li>
            <li><a href="#stance-width" className="transition-colors hover:text-primary">站距和 Setback 一起看</a></li>
            <li><a href="#stance-test" className="transition-colors hover:text-primary">一次只改一个变量</a></li>
          </ul>
        </li>
        <li>
          <a href="#setup-recommendations" className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">三件套搭配</a>
          <ul className="ml-3 space-y-0.5 border-l border-border py-1 pl-3 text-muted-foreground lg:ml-4">
            {SNOWBOARD_SETUPS.map((setup) => (
              <li key={setup.id}><a href={`#${setup.id}`} className="transition-colors hover:text-primary">{setup.title.split('：')[0]}</a></li>
            ))}
          </ul>
        </li>
        <li><a href="#instructor-systems" className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">单板教练认证体系</a></li>
      </ul>
    </nav>
  );
}

export default function SnowboardSetupPage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 md:py-12 lg:px-10">
      <header className="border-b border-foreground/80 pb-10 md:pb-12">
        <div>
          <p className="mono-label text-primary">单板科普 · 选购与调校</p>
          <h1 className="mt-4 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">从合脚的雪鞋开始。</h1>
          <p className="mt-5 max-w-xl text-[15px] leading-7 text-muted-foreground md:text-base">
            雪鞋、固定器、雪板一起决定站姿和控制感。先把合脚与接口弄明白，再调角度、选板型。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="#riding-styles" className="inline-flex min-h-11 items-center bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground">认识滑行风格</a>
            <a href="#stance-guide" className="inline-flex min-h-11 items-center border border-foreground/30 px-5 text-sm font-medium transition-colors hover:border-primary hover:text-primary">看站姿与角度</a>
            <a href="#setup-recommendations" className="inline-flex min-h-11 items-center border border-foreground/30 px-5 text-sm font-medium transition-colors hover:border-primary hover:text-primary">看三件套搭配</a>
          </div>
          <p className="mt-5 max-w-xl border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">
            本页内容依据官方资料整理，三件套是编辑候选，尚未经实物组合试装；不代表厂商认证、销量或实测排名。
          </p>
        </div>

      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
      <GuideQuickNav />
      <article className="min-w-0">
      <section id="setup-order" className="scroll-mt-32 border-y border-foreground/80 py-7 md:py-9">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mono-label text-primary">选配顺序</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">先鞋，再固定器，最后选板。</h2>
          </div>
          <p className="max-w-sm text-xs leading-5 text-muted-foreground">每一步都以前一步的真实尺码和试穿结果为依据。</p>
        </div>
        <ol className="mt-7 grid gap-x-6 gap-y-6 md:grid-cols-3">
          <li className="border-t border-border pt-4">
            <span className="font-mono text-3xl font-light tabular-nums text-primary">01</span>
            <h3 className="mt-3 text-base font-medium">先试雪鞋</h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">量双脚足长，带滑雪袜试穿。屈膝时脚跟应稳定，不能靠一味缩码解决后跟浮动。脚宽、脚背和左右脚差异都要记录；品牌换算表不等于本型号内部尺寸。</p>
          </li>
          <li className="border-t border-border pt-4">
            <span className="font-mono text-3xl font-light tabular-nums text-primary">02</span>
            <h3 className="mt-3 text-base font-medium">再配固定器</h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">按实际靴码及鞋底外形试装，检查鞋跟杯、绑带长度和前后居中。Step On 需要认证专用靴；EST 仅适用于 Channel；Mini Disk 与普通圆盘的孔位范围分别核对。</p>
          </li>
          <li className="border-t border-border pt-4">
            <span className="font-mono text-3xl font-light tabular-nums text-primary">03</span>
            <h3 className="mt-3 text-base font-medium">最后选雪板</h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">先查本型号的体重区间，再核对板宽、靴码和站距。标准版、W、MW、N 等标记不能混用；代表尺码参数不能覆盖整条产品线。</p>
          </li>
        </ol>
      </section>

      <SnowboardRidingStyles />

      <SnowboardStanceGuide />

      <div id="setup-recommendations" className="scroll-mt-32">
      {SNOWBOARD_SETUPS.map((setup, index) => (
        <section id={setup.id} key={setup.id} className="scroll-mt-32 border-t-2 border-foreground/80 py-8 md:py-10">
          <div className="grid gap-6">
            <header>
              <p className="mono-label text-primary">玩法方向 · 0{index + 1}</p>
              <h2 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">{setup.title}</h2>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{setup.audience}</p>
            </header>
            <div className="grid min-w-0 gap-5 border-y border-border py-5 sm:py-6 xl:grid-cols-3 xl:gap-6">
            {setup.products.map((slug, position) => {
              const product = products.find(p => p.slug === slug)!;
              const gear = GEAR.find(g => g.model === product.model && g.year === product.year && g.categorySlug === product.category);
              return <div key={slug} className="min-w-0 border-l-2 border-primary pl-4">
                <p className="mono-label text-muted-foreground">{['雪板', '固定器', '雪鞋'][position]}</p>
                <Link href={`/gear/${gear?.id ?? slug}`} className="mt-2 block text-sm font-medium leading-6 hover:text-primary">{product.title} <span aria-hidden="true">↗</span></Link>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{product.quote ? `官网地区价折合人民币：${fmtOfficialPriceCny(product.quote) ?? '人民币折算待补'}` : '官方价格待核'} · {product.checkedAt}</p>
                {product.priceNote ? <p className="mt-2 text-[11px] leading-5 text-muted-foreground">{product.priceNote}</p> : null}
                {product.source ? <a href={product.source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-muted-foreground underline underline-offset-4 hover:text-primary">官方资料</a> : null}
              </div>;
            })}
            </div>
          </div>
          <dl className="mt-6 grid gap-x-8 gap-y-5 text-[13px] leading-6 sm:grid-cols-2">
            <div className="border-l border-border pl-4"><dt className="font-medium">搭配理由</dt><dd className="mt-1 text-muted-foreground">{setup.reason}</dd></div>
            <div className="border-l border-border pl-4"><dt className="font-medium">需要取舍</dt><dd className="mt-1 text-muted-foreground">{setup.tradeoff}</dd></div>
            <div className="border-l border-border pl-4"><dt className="font-medium">尺寸与接口检查</dt><dd className="mt-1 text-muted-foreground">{setup.checks}</dd></div>
            <div className="border-l border-border pl-4"><dt className="font-medium">价格与预算</dt><dd className="mt-1 text-muted-foreground">{referenceBudget(setup.products)}</dd></div>
          </dl>
        </section>
      ))}
      </div>

      <SnowboardInstructorSystems />

      <footer className="border-t border-foreground/80 pt-6 text-xs leading-6 text-muted-foreground">
        <p>硬度数字是各品牌自己的尺度，不能直接跨品牌等同。热塑须依据本型号说明和店员操作，不能套用统一温度或时间。</p>
        <p className="mt-2">尺寸参考：<a className="underline underline-offset-4 hover:text-primary" href="https://www.nitrosnowboards.com/pages/boot-size-and-fit-guide" target="_blank" rel="noopener noreferrer">Nitro 雪鞋试穿指南</a> · <a className="underline underline-offset-4 hover:text-primary" href="https://www.burton.com/en-us/pages/size-charts" target="_blank" rel="noopener noreferrer">Burton 尺码表</a> · <a className="underline underline-offset-4 hover:text-primary" href="https://eu.unionbindingcompany.com/pages/disk-guide" target="_blank" rel="noopener noreferrer">Union 安装圆盘指南</a></p>
        <p className="mt-2">更新：2026-10-14。官方当前同名页面不一定属于档案标记年份，具体赛季确认情况见各产品价格依据。</p>
      </footer>
      </article>
      </div>
    </main>
  );
}
