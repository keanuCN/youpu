import Image from 'next/image';
import { simpleMetadata } from '@/lib/seo';

export const metadata = simpleMetadata({
  title: '双板科普 · 类型、参数与选购',
  description: '认识双板滑行风格、板型和核心参数，了解长度选择、雪鞋固定器兼容及安全调校。',
  path: '/guides/alpine-ski',
});

const chapters = [
  ['ski-styles', '先按滑行地形认识板型'],
  ['ski-shape', '读懂板型与参数'],
  ['ski-length', '怎么选长度与硬度'],
  ['ski-boots-bindings', '雪鞋、固定器与安全'],
];

const skiStyles = [
  {
    title: '道内卡宾 / Piste Carving',
    image: '/images/education/skis/piste-carving.webp',
    alt: '双板滑手在压雪道上立刃刻出弧线',
    description: '主要在压雪道滑行，重视换刃响应、刃上支撑和弧线控制。常见选择有偏短弯的 SL 风格、偏长弯的 GS 风格，以及面向日常巡航的道内板。竞技赛项有专门规则和器材标准，休闲款名称相似不代表等同竞赛板。',
  },
  {
    title: '全山 / All-Mountain',
    image: '/images/education/skis/all-mountain.webp',
    alt: '双板滑手从压雪道转入松软雪况',
    description: '希望在整备雪道、雪道边和变化雪况间切换。选更窄、更偏道内的型号，通常更重视硬雪换刃；往更宽的型号走，会增加软雪浮力，也可能牺牲快速换刃和重量。具体体验须看板型、板长与结构，不能只按腰宽推断。',
  },
  {
    title: '野雪 / Freeride',
    image: '/images/education/skis/freeride.webp',
    alt: '双板滑手在自然软雪坡面上转弯',
    description: '正式赛事或新闻语境可称“高山自由滑雪”，雪圈日常更常说“野雪”或“滑野雪”。核心是自然地形中的自由滑行，重视软雪、线路与雪况判断；更宽的平台与摇臂轮廓常用于增加浮力和转向灵活度。宽板并不自动更安全，也不能替代雪崩知识、救援装备和结伴决策。',
  },
  {
    title: '自由式 / Freestyle',
    image: '/images/education/skis/freestyle-park.webp',
    alt: '自由式双板滑手完成低高度跳台动作',
    description: '在公园、跳台和道具区练习动作。双向板型、较对称的站位和板头板尾摇臂可能方便反脚滑行与落地；但公园板不是防摔装备，先从开放的小型设施开始，遵守雪场线路和头盔要求。',
  },
  {
    title: '登山滑雪 / Touring',
    image: '/images/education/skis/ski-touring.webp',
    alt: '登山滑雪者贴着爬升皮带向山坡上行',
    description: '装备需配合上升模式、皮带、雪鞋和专用固定器，重量与下滑性能之间需要取舍。进入雪场开放边界外前，应完成相应训练，了解当地雪崩预报、路线风险和救援流程；轻量装备不能代替技能与判断。',
  },
];

function QuickNav() {
  return (
    <nav aria-label="双板科普章节" className="border-y border-border py-4 lg:sticky lg:top-24 lg:border-y-0 lg:py-0">
      <p className="mono-label mb-3 text-primary">本页章节</p>
      <ul className="grid gap-1 text-[13px] leading-6 sm:grid-cols-2 lg:grid-cols-1">
        {chapters.map(([id, title]) => (
          <li key={id}><a href={`#${id}`} className="block border-l-2 border-transparent py-1 pl-3 transition-colors hover:border-primary hover:text-primary">{title}</a></li>
        ))}
      </ul>
    </nav>
  );
}

function SkiDimensionsIllustration() {
  return (
    <svg viewBox="0 0 640 190" role="img" aria-labelledby="ski-dimensions-title" className="h-auto w-full">
      <title id="ski-dimensions-title">双板板头、板腰、板尾宽度示意图</title>
      <path d="M90 35 C120 20 164 28 200 39 L430 62 C490 68 536 71 566 72 C536 73 490 76 430 82 L200 105 C164 116 120 124 90 109 C75 100 74 44 90 35Z" fill="currentColor" opacity="0.1" />
      <path d="M90 35 C120 20 164 28 200 39 L430 62 C490 68 536 71 566 72 C536 73 490 76 430 82 L200 105 C164 116 120 124 90 109 C75 100 74 44 90 35Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M156 32 V112 M320 50 V94 M500 68 V76" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" />
      <text x="156" y="150" textAnchor="middle" fontSize="14" fill="currentColor">板头宽</text>
      <text x="320" y="150" textAnchor="middle" fontSize="14" fill="currentColor">板腰宽</text>
      <text x="500" y="150" textAnchor="middle" fontSize="14" fill="currentColor">板尾宽</text>
      <text x="320" y="178" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.65">规格常写作：板头 / 板腰 / 板尾（毫米）</text>
    </svg>
  );
}

function SkiProfileIllustration() {
  return (
    <svg viewBox="0 0 640 210" role="img" aria-labelledby="ski-profile-title" className="h-auto w-full">
      <title id="ski-profile-title">双板拱形与摇臂侧面示意图</title>
      <path d="M52 82 H588 M52 164 H588" stroke="currentColor" strokeWidth="1" strokeDasharray="5 5" opacity="0.3" />
      <path d="M72 74 C180 74 216 32 320 32 C424 32 460 74 568 74" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M72 146 C116 146 126 104 174 104 C240 104 254 146 320 146 C386 146 400 104 466 104 C514 104 524 146 568 146" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <text x="320" y="18" textAnchor="middle" fontSize="14" fill="currentColor">传统拱形：中段抬起，受压后形成支撑与回弹</text>
      <text x="320" y="192" textAnchor="middle" fontSize="14" fill="currentColor">摇臂：板头 / 板尾更早翘起；常与脚下拱形组合</text>
    </svg>
  );
}

export default function AlpineSkiGuidePage() {
  return (
    <main className="mx-auto max-w-[1280px] px-4 py-8 sm:px-6 md:px-8 md:py-12 lg:px-10">
      <header className="border-b border-foreground/80 pb-9 md:pb-12">
        <p className="mono-label text-primary">双板科普 · 类型与选配</p>
        <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl md:text-6xl">先想清楚你常滑的雪况。</h1>
        <p className="mt-5 max-w-2xl text-[15px] leading-7 text-muted-foreground md:text-base">
          双板没有一块“什么都最强”的万能答案。道内卡宾（Carving）看抓边和换刃，全山看雪况覆盖，自由式看双向滑行与落地，野雪和登山则要考虑浮力、重量及风险管理。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href="#ski-styles" className="inline-flex min-h-11 items-center bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-foreground">认识双板类型</a>
          <a href="#ski-shape" className="inline-flex min-h-11 items-center border border-foreground/30 px-5 text-sm font-medium transition-colors hover:border-primary hover:text-primary">读懂板型参数</a>
        </div>
        <p className="mt-5 max-w-2xl border-l-2 border-primary pl-4 text-xs leading-5 text-muted-foreground">
          本页讲的是休闲装备选择常识，不是竞赛器材规范或个性化处方。型号尺寸、雪况、滑手体重与技术都会改变实际表现；购买前以当季厂商规格和专业店试滑建议为准。
        </p>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-start lg:gap-12">
        <QuickNav />
        <article className="min-w-0">
          <section id="ski-styles" className="scroll-mt-32 border-y-2 border-foreground/80 py-8 md:py-10">
            <p className="mono-label text-primary">01 · 玩法与地形</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">板型先跟着雪况走。</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">同一系列不同宽度、长度和结构的滑感也会有差别。以下是常见用途，不是严格统一的行业分类；腰宽分界会因品牌、地区雪况与型号定位而变化。</p>

            <div className="mt-6 grid items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {skiStyles.map((style, index) => (
                <article key={style.title} className="flex h-full flex-col border border-border bg-background">
                  <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-secondary">
                    <Image
                      src={style.image}
                      alt={style.alt}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4 md:p-5">
                    <p className="mono-label text-primary">玩法 0{index + 1}</p>
                    <h3 className="mt-2 text-base font-medium">{style.title}</h3>
                    <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{style.description}</p>
                  </div>
                </article>
              ))}
            </div>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">竞速项目名称参考 <a className="underline underline-offset-4 hover:text-primary" href="https://assets.fis-ski.com/f/252177/x/432235f454/al_wc-rules-2425_29-07-2024_final.pdf" target="_blank" rel="noopener noreferrer">FIS 高山滑雪世界杯规则</a>：Downhill、Super-G、Giant Slalom 和 Slalom 是不同竞赛项目；零售板的“SL / GS 风格”描述不要直接当作竞赛器材认证。</p>
          </section>

          <section id="ski-shape" className="scroll-mt-32 border-b-2 border-foreground/80 py-8 md:py-10">
            <p className="mono-label text-primary">02 · 读懂形状</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">参数告诉你倾向，不替你做决定。</h2>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div className="border border-border p-4 md:p-5">
                <SkiDimensionsIllustration />
                <h3 className="mt-3 text-base font-medium">板头 / 板腰 / 板尾</h3>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">规格常以毫米呈现，例如 130 / 90 / 116。板腰是脚下最窄处；通常腰越窄，硬雪上从一条刃切到另一条刃会更快，宽腰则提供更大的软雪承托面。板头、板尾形状和雪板整体结构也会影响起弯与收弯，不能只看中间数字。</p>
              </div>
              <div className="border border-border p-4 md:p-5">
                <SkiProfileIllustration />
                <h3 className="mt-3 text-base font-medium">拱形 / Camber 与摇臂 / Rocker</h3>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">脚下拱形受压时提供刃上接触和回弹感；板头或板尾摇臂让雪板更早翘起，常用于提升软雪浮力、转向和释放的轻松感。许多现代板会混合两种轮廓。图示只表达概念，不代表某一型号的真实侧面。</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 border-y border-border py-5 sm:grid-cols-2">
              <div><h3 className="font-medium">转弯半径</h3><p className="mt-1 text-[13px] leading-6 text-muted-foreground">由板头、板腰、板尾的侧切形状推算，规格通常以米标注。较小半径表示更偏向短弯的几何倾向，较大半径偏向长弯；滑手仍可通过速度、刃角与压力控制改变实际弯形。</p></div>
              <div><h3 className="font-medium">硬度与结构</h3><p className="mt-1 text-[13px] leading-6 text-muted-foreground">木芯、金属层、碳纤维等结构会影响重量、阻尼、扭转支撑和反馈。厂商的硬度数字不是跨品牌统一量表；“更硬”不等于更适合所有人，也可能更难在低速时弯曲和操控。</p></div>
            </div>
          </section>

          <section id="ski-length" className="scroll-mt-32 border-b-2 border-foreground/80 py-8 md:py-10">
            <p className="mono-label text-primary">03 · 长度与硬度</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">身高只是起点，先查具体型号尺码表。</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">选长短时综合看体重、技术水平、常滑地形、速度与板型。较短的板通常更容易转向；较长的板可能提供更长的有效刃和软雪浮力，但要有能力主动控制。摇臂长度、板尾形状和厂商的推荐体重区间都会影响适合的长度。</p>
            <ol className="mt-6 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
              <li className="py-5 md:pr-5"><span className="mono-label text-primary">01 / 先看官方尺码</span><p className="mt-2 text-[13px] leading-6 text-muted-foreground">查你所选的年份、型号和长度对应的推荐体重与板长表，不要把同系列其他宽度或其他年份的数据直接套用。</p></li>
              <li className="border-t border-border py-5 md:border-t-0 md:px-5"><span className="mono-label text-primary">02 / 对照你的滑法</span><p className="mt-2 text-[13px] leading-6 text-muted-foreground">主要滑整备雪道、偏短弯还是高速长弯；是否常滑软雪、树林或公园。不同目标会改变对长度、腰宽和板型的取舍。</p></li>
              <li className="border-t border-border py-5 md:border-t-0 md:pl-5"><span className="mono-label text-primary">03 / 评估控制能力</span><p className="mt-2 text-[13px] leading-6 text-muted-foreground">若还在学习基础转弯与控速，优先选容易主动弯曲、可控的型号；不要只为“以后进阶”购买超出当前能力的长而硬雪板。</p></li>
            </ol>
            <p className="mt-4 text-xs leading-5 text-muted-foreground">厂商尺码建议示例：<a className="underline underline-offset-4 hover:text-primary" href="https://www.rossignol.com/us-en/rossignol-forza-50-cam-skis-konect-RAOPX01000.html" target="_blank" rel="noopener noreferrer">Rossignol Forza 官方产品页</a>将体重、身体能力、身高和滑行风格共同纳入长度选择，并提示不同水平和激进程度对应不同建议。</p>
          </section>

          <section id="ski-boots-bindings" className="scroll-mt-32 border-b-2 border-foreground/80 py-8 md:py-10">
            <p className="mono-label text-primary">04 · 雪鞋与固定器</p>
            <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">脚底接口匹配，释放值交给专业店。</h2>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <article className="border-l-2 border-primary pl-4">
                <h3 className="font-medium">先试雪鞋</h3>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">双板雪鞋需要包裹并支撑脚踝和脚跟。试穿应结合脚长、脚宽、脚背、脚型和滑行姿势；尺码数字不能替代实际贴合检查。试穿或热塑按雪鞋型号说明及授权店流程进行。</p>
              </article>
              <article className="border-l-2 border-primary pl-4">
                <h3 className="font-medium">核对鞋底标准</h3>
                <p className="mt-2 text-[13px] leading-6 text-muted-foreground">Alpine ISO 5355、GripWalk ISO 23223 和 Touring ISO 9523 并非看到“能踩进去”就代表兼容。逐项核对雪鞋鞋底标识与固定器标识、厂商兼容表；不同代际和儿童规格也可能不同。</p>
              </article>
            </div>
            <aside className="mt-5 border border-primary/40 bg-primary/5 p-4 md:p-5">
              <p className="mono-label text-primary">安全提醒</p>
              <p className="mt-2 text-sm leading-6">固定器的释放与保持设置需要根据滑手信息、雪鞋底长及设备状态按规范调整，并由合格的专业人员检查测试。不要照搬朋友的 DIN 数字，也不要自行猜测或修改释放设定。</p>
              <a className="mt-3 inline-block text-xs underline underline-offset-4 hover:text-primary" href="https://www.grip-walk.com/faq/" target="_blank" rel="noopener noreferrer">GripWalk 官方兼容说明与授权店提示 ↗</a>
            </aside>
          </section>

          <footer className="border-t border-foreground/80 pt-5 text-xs leading-6 text-muted-foreground">
            <p>参考资料：</p>
            <ul className="mt-2 space-y-1">
              <li><a className="underline underline-offset-4 hover:text-primary" href="https://www.fis-ski.com/inside-fis/document-library/alpine-documents" target="_blank" rel="noopener noreferrer">国际滑雪和单板滑雪联合会（FIS）高山滑雪规则与文件</a></li>
              <li><a className="underline underline-offset-4 hover:text-primary" href="https://www.salomon.com/en-us/sg/a/how-to-choose-the-right-type-of-skis" target="_blank" rel="noopener noreferrer">Salomon：如何选择双板类型</a></li>
              <li><a className="underline underline-offset-4 hover:text-primary" href="https://www.rei.com/learn/expert-advice/downhill-skis.html" target="_blank" rel="noopener noreferrer">REI：双板结构、类型与参数入门</a></li>
              <li><a className="underline underline-offset-4 hover:text-primary" href="https://www.grip-walk.com/faq/" target="_blank" rel="noopener noreferrer">GripWalk：雪鞋鞋底与固定器兼容 FAQ</a></li>
            </ul>
          </footer>
        </article>
      </div>
    </main>
  );
}
