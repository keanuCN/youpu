import { SnowboardStyleIllustration } from "./snowboard-style-illustration";

const styles = [
  {
    id: 'style-all-mountain',
    index: '01',
    name: '全山 / All-Mountain',
    label: '雪道 · 侧坡 · 日常巡航',
    summary: '不把自己限定在单一地形：整备雪道巡航、路边小跳、少量软雪都想尝试。它更像一种日常滑行取向，而不是一套固定动作。',
    entry: '先把换刃、控速和稳定转弯练熟，再逐步加入反脚与小地形。',
    gear: '优先看板长、硬度和板型是否符合你的体重、水平与常滑雪况；“全能”不等于每种玩法都最强。',
    fieldFocus: '记录压雪道、碎雪和软雪分别占多少；板在不同速度下是否容易控速，换刃是否顺手，反脚和小地形是否自然。',
  },
  {
    id: 'style-carving',
    index: '02',
    name: '刻滑 / Carving',
    label: '压雪道 · 立刃 · 连续弧线',
    summary: '通过立刃和板身弯曲走出干净、连续的弧线，尽量减少横向搓雪。核心是重心、压力控制、换刃时机和刃的抓地，不只是把身体压低或把角度调大。',
    entry: '从缓坡上的基础立刃和控速转弯开始，逐步练习更稳定的刃压与弧线；先留出足够空间观察雪道。',
    gear: '刻滑板常见特点是更明确的方向性、有效刃与支撑感；板硬、板窄或大角度都不是新手必备条件。',
    fieldFocus: '注明雪面硬度、坡度和速度区间；观察入弯是否顺、弧线是否连续、是否频繁搓雪，以及不同弯径下板刃能否稳定保持抓地。',
  },
  {
    id: 'style-flatground',
    index: '03',
    name: '平花 / Flatground',
    label: '平整雪面 · 压板 · 旋转',
    summary: '在平整雪面上利用重心移动、板头板尾压板和板身旋转做动作。常见练习包括 Ollie、Nollie、Press、Butter 与低幅度旋转；“平花”是常见玩法称呼，不是统一的竞赛项目分类。',
    entry: '先在低速下练习单脚平衡、弹板和小幅度压板，确认能稳定收回动作并及时停下，再增加旋转幅度。',
    gear: '较易弯曲、好控制的板可能更省力；但过软会降低高速和硬雪支撑。站姿保持舒适即可，不需要为了平花照搬某个固定角度。',
    fieldFocus: '记录动作名称、练习速度和雪面平整度；观察压板能否保持平衡、旋转后能否稳定落回板刃，以及板头或板尾是否容易意外挂刃。',
  },
  {
    id: 'style-park',
    index: '04',
    name: '公园 / Park',
    label: '道具区 · Box · Rail · 跳台',
    summary: '在公园地形上练习自由式动作，可能包含箱体、铁杆、跳台和其他设施。Jib 通常指在箱体、铁杆等道具上的滑行与动作；公园是一组地形与玩法，不是单一动作。',
    entry: '先阅读雪场公园规则，在入口观察线路和落地区；从最小、最简单的设施开始，一次只练一种动作。',
    gear: '双向滑行、稳定落地和可靠固定器状态很重要。不要因为板型写着 Park 就跳过设施检查、头盔和排队规则。',
    fieldFocus: '注明设施类型与难度、当天开放状态和拥挤程度；记录线路选择、起跳或上道是否稳定、落地后能否继续控速。',
  },
  {
    id: 'style-jumps',
    index: '05',
    name: '跳台 / Big Air',
    label: '起跳 · 空中动作 · 落地',
    summary: '跳台玩法围绕起跳速度、离台动作、空中姿态和落地控制。Big Air 竞赛通常围绕大型单一跳台展开；Slopestyle 则沿线路通过多个跳台与道具，二者相关但不是同一个赛项。',
    entry: '先在平地练习弹跳动作和落地姿态，再从小侧坡或初级跳台熟悉路线、速度和落地区。看不清落地、场地拥挤或雪况变差时就不要起跳。',
    gear: '板要适合你的体重、速度与落地能力；正确长度和可控硬度比追求高弹或竞赛型号更重要。跳台会放大失误，循序渐进。',
    fieldFocus: '记录跳台等级、雪面和能见度，不记录或照搬他人的起跳速度；观察起跳是否可控、空中动作是否影响落地姿态、落地后能否安全减速。',
  },
  {
    id: 'style-halfpipe',
    index: '06',
    name: '半管 / Halfpipe',
    label: 'U 形管壁 · 连续腾空',
    summary: '沿 U 形管壁左右穿行，在管壁上缘起跳完成腾空动作，再落回管壁继续下一侧。它需要专门场地、线路判断与空中控制，和普通公园跳台的节奏不同。',
    entry: '先具备稳定的换刃、速度控制和空中落地基础；只在开放、维护合格且允许进入的半管练习，并遵守雪场要求。',
    gear: '装备应匹配身高、体重、速度和管型；不要仅根据半管竞赛板尺寸给自己选板。',
    fieldFocus: '记录半管维护与开放情况、管壁雪面和人流；观察左右壁转换、速度保持、落回管壁的位置与连续滑行稳定性。',
  },
  {
    id: 'style-freeride',
    index: '07',
    name: '自由骑与粉雪 / Freeride',
    label: '自然地形 · 林间 · 新雪',
    summary: '重视地形选择、线路、速度和雪况，可能在雪道边、树林或粉雪中滑行。雪场开放边界外的野雪与回山路线有额外风险，不应把自由骑理解成可以离开雪场管理范围。',
    entry: '先在开放雪道练习不同半径的控速转弯，了解当天雪况并跟随有经验的伙伴；进入雪场管控区以外的地形前，接受雪崩风险与救援装备训练。',
    gear: '定向板和较宽板腰常用于增加方向性或软雪浮力，但宽板并不会自动提升安全性；尺寸仍须结合体重、技术和雪况。',
    fieldFocus: '记录雪深、雪型、坡向、能见度和路线是否位于开放区域；描述浮力、转弯空间与疲劳变化，不以单次顺利滑行推断线路安全。',
  },
];

const fieldReports = [
  {
    style: '刻滑 / 粉雪',
    board: 'Korua Café Racer',
    sourceName: 'The Good Ride · extended demo',
    conditions: '159 cm；10 天以上；硬雪、整备雪道、少量新雪及腰深粉雪；报告列出多位不同身高和鞋码的滑手。',
    finding: '评测者认为它在中高速大弧刻滑时支撑和回弹突出，边刃抓地也不错；低速起弯偏慢，碎乱雪里不如平整雪道轻松。',
    caveat: '页面标注评测覆盖 2020–2024 年款，并在 2024 年更新；不等同于对本站 2026 年档案的当季复测。',
    url: 'https://thegoodride.com/snowboard-reviews/korua-cafe-racer-snowboard-review/',
    link: '查看原始试滑记录',
  },
  {
    style: '跳台 / 自由式',
    board: 'CAPiTA Defenders of Awesome（DOA）',
    sourceName: 'The Good Ride · 试用板评测',
    conditions: '156 cm；2 天；春季雪况；两位评测者分别使用 US 9 和 US 11 雪鞋。',
    finding: '评测把跳台表现列为强项：Ollie 回弹明显，进跳台时板子较好跟线，落地支撑感也受到肯定；硬雪抓边和松软不平雪况是短板。',
    caveat: '试滑时间短，属于评测者样本；文章汇总多个年份，不能当成 2026/27 新款的独立测试结论。',
    url: 'https://thegoodride.com/snowboard-reviews/capita-defenders-of-awesome-snowboard-review/',
    link: '查看原始试滑记录',
  },
  {
    style: '跳台 / 进阶反馈',
    board: 'CAPiTA DOA 20/21 · 单人用户记录',
    sourceName: '热雪 SnowFever · 用户实测',
    conditions: '用户身高 176 cm、体重 85 kg，使用 156 cm；自述一个雪季练习小跳台。',
    finding: '用户表示这块板能胜任小跳台入门；随着动作进阶，开始觉得落地支撑不足，高速稳定性也不够。这个反馈说明体重、动作强度和技术阶段会改变同一块板的主观表现。',
    caveat: '单人体验，且明确对应 20/21 年款；不用于推断其他体重滑手或新年份版本。',
    url: 'https://thesnowfever.com/detail/capita-defenders-of-awesome-snowboard-10252',
    link: '查看原始用户记录',
  },
  {
    style: '平花 / 公园道具',
    board: 'Burton Name Dropper · 单人用户记录',
    sourceName: '热雪 SnowFever · 用户实测',
    conditions: '页面档案标注用户 173 cm、63 kg、使用 151 cm；正文回顾了多个雪季的个人使用经历。',
    finding: '用户认为板子的弹性和容错让箱体道具、平地旋转等玩法比较顺手；同时提到粉雪浮力和高速刻滑支撑有限。',
    caveat: '单人旧款体验。页面档案标注 20/21 款，但正文回顾的使用时间涉及更早雪季，具体年份对应关系不够清楚。',
    url: 'https://thesnowfever.com/detail/burton-name-dropper-snowboard-4555',
    link: '查看原始用户记录',
  },
];

export function SnowboardRidingStyles() {
  return (
    <section id="riding-styles" className="scroll-mt-32 border-y-2 border-foreground/80 py-8 md:py-10">
      <header className="grid gap-4 border-b border-border pb-6 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)] md:items-end">
        <div>
          <p className="mono-label text-primary">单板 · 风格与地形</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">先认清自己想滑什么。</h2>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">这些风格可以交叉。比如全山滑手也能练刻滑和小跳；公园里的 Big Air、Slopestyle 与半管则是规则和场地不同的项目。</p>
      </header>

      <p className="border-b border-border py-4 text-xs leading-5 text-muted-foreground">
        <span className="mono-label mr-2 text-primary">风格说明</span>
        图示用于快速理解地形与线路，不是动作教学；本站没有把观察提纲冒充成已完成的实测。
      </p>

      <div className="grid gap-4 pt-5 md:grid-cols-2 xl:grid-cols-3">
        {styles.map((style) => (
          <article id={style.id} key={style.id} className="scroll-mt-32 min-w-0 border border-border bg-background">
            <div className="aspect-[2/1] overflow-hidden border-b border-border">
              <SnowboardStyleIllustration id={style.id} />
            </div>
            <div className="p-4 md:p-5">
              <p className="mono-label text-primary">风格 {style.index} · {style.label}</p>
              <h3 className="mt-2 text-lg font-medium tracking-tight">{style.name}</h3>
              <p className="mt-2 line-clamp-3 text-[13px] leading-6 text-muted-foreground">{style.summary}</p>
              <details className="group mt-4 border-t border-border pt-3">
                <summary className="cursor-pointer list-none text-xs font-medium marker:hidden hover:text-primary">
                  展开入门与装备建议
                  <span className="float-right text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true">⌄</span>
                </summary>
                <dl className="mt-4 space-y-3 text-xs leading-5">
                  <div><dt className="mono-label text-primary">怎么开始</dt><dd className="mt-1 text-muted-foreground">{style.entry}</dd></div>
                  <div><dt className="mono-label text-primary">装备关注</dt><dd className="mt-1 text-muted-foreground">{style.gear}</dd></div>
                  <div><dt className="mono-label text-primary">实测记录点</dt><dd className="mt-1 text-muted-foreground">{style.fieldFocus}</dd></div>
                </dl>
              </details>
            </div>
          </article>
        ))}
      </div>

      <section id="field-reports" className="scroll-mt-32 border-t-2 border-foreground/80 pt-7 md:pt-8">
        <header className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(240px,0.55fr)] md:items-end">
          <div>
            <p className="mono-label text-primary">实测评价 · 外部公开资料</p>
            <h3 className="mt-2 text-xl font-medium tracking-tight md:text-2xl">先看清测试条件，再读体验结论。</h3>
          </div>
          <p className="text-xs leading-5 text-muted-foreground">以下为第三方评测或用户自述的摘要，不是有谱用户实测，不计入本站评分；年份、样本量和雪况不同，不能直接横向排名。</p>
        </header>

        <div className="mt-5 grid gap-0 border-y border-border md:grid-cols-2 md:divide-x md:divide-border">
          {fieldReports.map((report, index) => (
            <article key={`${report.board}-${index}`} className={`border-b border-border py-5 last:border-b-0 md:px-5 md:py-6 ${index < 2 ? 'md:border-b' : 'md:border-b-0'} ${index % 2 === 0 ? 'md:pl-0 md:pr-5' : 'md:pl-5 md:pr-0'}`}>
              <p className="mono-label text-primary">0{index + 1} · {report.style}</p>
              <h4 className="mt-2 text-base font-medium">{report.board}</h4>
              <p className="mt-1 text-[11px] text-muted-foreground">{report.sourceName}</p>
              <dl className="mt-4 space-y-3 text-[13px] leading-6">
                <div><dt className="mono-label text-muted-foreground">测试条件</dt><dd className="mt-1">{report.conditions}</dd></div>
                <div><dt className="mono-label text-muted-foreground">体验摘要</dt><dd className="mt-1">{report.finding}</dd></div>
                <div><dt className="mono-label text-muted-foreground">样本边界</dt><dd className="mt-1 text-muted-foreground">{report.caveat}</dd></div>
              </dl>
              <a className="mt-4 inline-block text-xs underline underline-offset-4 hover:text-primary" href={report.url} target="_blank" rel="noopener noreferrer">{report.link} ↗</a>
            </article>
          ))}
        </div>
      </section>

      <div className="mt-6 flex flex-col gap-3 border border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div>
          <p className="mono-label text-primary">我的实测记录</p>
          <p className="mt-1 text-sm leading-6">滑过哪款板，就去它的档案写下年份、长度、天数、雪况和玩法。</p>
          <p className="text-xs leading-5 text-muted-foreground">雪龄、体重、水平和常滑场地从个人资料带入。</p>
        </div>
        <a href="/browse/snowboard" className="inline-flex min-h-10 shrink-0 items-center justify-center bg-foreground px-4 text-xs font-medium text-background transition-colors hover:bg-primary">
          找到雪板并写实测 ↗
        </a>
      </div>

      <p className="border-t border-border pt-4 text-xs leading-5 text-muted-foreground">
        竞赛项目名称参考 <a className="underline underline-offset-4 hover:text-primary" href="https://www.fis-ski.com/inside-fis/sbfsfk-documents" target="_blank" rel="noopener noreferrer">国际滑雪和单板滑雪联合会（FIS）单板规则与场地文件</a>。Big Air、Slopestyle 与 Halfpipe 是分别设置的竞赛项目；“平花”则作为日常滑行风格介绍，不等同于 FIS 赛项。
      </p>
    </section>
  );
}
