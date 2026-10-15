import { SnowboardStanceSimulator } from './snowboard-stance-simulator';

const angleExamples = [
  {
    angles: '+0° / −0°',
    style: '双零（中立站姿）',
    use: '前后脚都横过板面，作为中立角度参考或对比起点。+0° 与 −0° 都等于 0°，脚尖方向没有正负区别。',
  },
  {
    angles: '+15° / 0°',
    style: '前正后零',
    use: '第一次装板、全山练习的稳妥起点。后脚横放，通常比较容易适应。',
  },
  {
    angles: '+15° / -6°',
    style: '轻微八字',
    use: '兼顾正滑和少量反脚；Burton 的安装示例把它作为多数骑手的起点之一。',
  },
  {
    angles: '+15° / -15° 或 +18° / -18°',
    style: '对称八字',
    use: '前后脚开角接近，常见于公园、平花和经常反脚滑行。角度越大，髋部打开越多；不舒服就减小。',
  },
  {
    angles: '+18° / -9°',
    style: '不对称八字',
    use: '前脚更朝板头，后脚仍能兼顾反脚；可作为从对称八字转向定向站姿的尝试。',
  },
  {
    angles: '+18° / +9°',
    style: '轻度一顺（正正角）',
    use: '两脚都朝板头，适合更偏定向的雪道和刻滑尝试；反脚会比八字站姿别扭。',
  },
  {
    angles: '+27° / +18°',
    style: '较激进的一顺',
    use: '明显偏向定向刻滑，先确认脚踝、膝盖和髋部活动自然；不是进阶的必经设置。',
  },
  {
    angles: '+36° / +27° 或 +42° / +27°',
    style: '极大正正角',
    use: '若你指的是前脚 / 后脚各自的角度，这已超出常见软靴站姿范围。许多圆盘刻度到不了 36° 或 42°；只有在固定器、靴子和玩法都明确适配时才考虑。',
  },
];

export function SnowboardStanceGuide() {
  return (
    <section id="stance-guide" className="scroll-mt-32 border-y border-foreground/80 py-9 md:py-12">
      <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:gap-12">
        <div>
          <p className="mono-label text-primary">单板基础</p>
          <h2 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">站姿与固定器角度</h2>
          <p className="mt-4 text-[14px] leading-7 text-muted-foreground">
            角度没有一套适合所有人的标准答案。先从雪板的参考站位和舒服的角度开始，每次只改一项，再用实际滑行感受决定要不要保留。
          </p>

          <div className="mt-6 border-l-2 border-primary pl-4 text-sm leading-6">
            <p><strong>读法：前脚 / 后脚。</strong>例如 +15° / -6°。</p>
            <p className="mt-2">0° 表示脚横过板面；正角朝板头，负角朝板尾。Regular 或 Goofy 只决定哪只脚在前，不改变正负号的意思。</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
            <div className="border-t-2 border-primary bg-secondary/60 p-4">
              <p className="font-mono text-2xl font-medium tracking-tight text-primary">+ / −</p>
              <p className="mt-2 font-medium">八字</p>
              <p className="mt-1 leading-5 text-muted-foreground">前脚朝板头、后脚朝板尾；反脚和双向动作更自然。</p>
            </div>
            <div className="border-t-2 border-foreground/70 bg-secondary/60 p-4">
              <p className="font-mono text-2xl font-medium tracking-tight">+ / +</p>
              <p className="mt-2 font-medium">一顺</p>
              <p className="mt-1 leading-5 text-muted-foreground">前后脚都朝板头；偏定向滑行，反脚会更受限。</p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
            <div>
              <p className="mono-label text-primary">角度参考</p>
              <h3 id="stance-angles" className="scroll-mt-32 mt-2 text-xl font-medium">常见角度怎么选</h3>
            </div>
            <span className="text-xs text-muted-foreground">前脚 / 后脚</span>
          </div>
          <div className="space-y-2 md:hidden">
            {angleExamples.map((row) => (
              <article key={row.angles} className="border-l-2 border-border bg-secondary/50 px-4 py-3">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h4 className="font-mono text-base font-medium tabular-nums text-primary">{row.angles}</h4>
                  <p className="text-xs font-medium">{row.style}</p>
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{row.use}</p>
              </article>
            ))}
          </div>
          <div className="hidden overflow-x-auto border-y border-border md:block">
            <table className="w-full min-w-[560px] text-left text-[13px] leading-6">
              <thead>
                <tr className="border-b border-foreground/30 text-xs text-muted-foreground">
                  <th className="py-3 pr-4 font-normal">前脚 / 后脚</th>
                  <th className="py-3 pr-4 font-normal">站姿方向</th>
                  <th className="py-3 font-normal">适用感受与提醒</th>
                </tr>
              </thead>
              <tbody>
                {angleExamples.map((row) => (
                  <tr key={row.angles} className="border-b border-border/70 align-top last:border-b-0">
                    <th className="py-3 pr-4 font-mono text-sm font-medium whitespace-nowrap tabular-nums text-primary">{row.angles}</th>
                    <td className="py-3 pr-4 whitespace-nowrap">{row.style}</td>
                    <td className="py-3 text-muted-foreground">{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 border-l border-border pl-3 text-xs leading-5 text-muted-foreground">
            Burton 常见参考包含 +15° / 0° 和 +15° / -6°；Jones 指南展示的常见固定器刻度为 0°–30°。若你说的 36°、42°是单脚角度，它们可能超出圆盘刻度；先核对固定器说明。上表是试滑起点，不是强制标准。
          </p>
        </div>
      </div>

      <SnowboardStanceSimulator />

      <section id="regular-goofy" className="scroll-mt-32 mt-10 border-t border-border pt-8 md:mt-12 md:pt-10">
        <p className="mono-label text-primary">正脚与反脚</p>
        <h3 className="mt-2 text-2xl font-medium tracking-tight md:text-3xl">Regular / Goofy 怎么选？</h3>
        <p className="mt-3 max-w-3xl text-[14px] leading-7 text-muted-foreground">
          面向板头（nose）滑行时，左脚在前叫 Regular，右脚在前叫 Goofy；两种都正常，没有“正确脚”。惯用手、踢球脚或哪条腿更有力，都不能单独决定雪板站姿。
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-2 md:gap-6">
          <div className="border-t-2 border-primary bg-secondary/40 p-5 md:p-6">
            <p className="mono-label text-primary">01 · 找线索</p>
            <h4 className="mt-2 text-base font-medium">先观察日常动作</h4>
            <ul className="mt-4 space-y-3 text-[13px] leading-6 text-muted-foreground">
              <li><strong className="text-foreground">有板类经验：</strong>回想滑板、冲浪或陆地板上哪只脚自然放前面，可作为起点，但不保证雪板一定相同。</li>
              <li><strong className="text-foreground">没有经验：</strong>可以在安全、无障碍的平地观察自然滑步或上下台阶时的领先脚；推背和穿袜滑行测试也有人使用，但结果容易受情境影响，只作参考。不要在湿滑地面或楼梯上做危险测试。</li>
              <li><strong className="text-foreground">记住限制：</strong>球踢哪只脚、惯用手、单脚站哪边都不是可靠的判定器；如果线索互相矛盾，先记下两种可能。</li>
            </ul>
          </div>

          <div className="border-t-2 border-foreground/70 bg-secondary/40 p-5 md:p-6">
            <p className="mono-label text-primary">02 · 安全确认</p>
            <h4 className="mt-2 text-base font-medium">再由教练带着试滑</h4>
            <ol className="mt-4 space-y-3 text-[13px] leading-6 text-muted-foreground">
              <li><strong className="text-foreground">1.</strong> 初学者在缓坡、平整的初级道，由教练和雪具店员协助确认站姿、装板与安全。</li>
              <li><strong className="text-foreground">2.</strong> 若干地线索不明确，可在教练指导下用相同雪道、相同板和对称站距，分别做短距离基础滑行体验；不要一次同时改角度、站距和装备。</li>
              <li><strong className="text-foreground">3.</strong> 比较两边哪种更容易保持放松平衡、看向行进方向、控制速度和完成基础转向，并留意膝髋是否不适。由教练结合动作表现判断；别用一次摔倒或某个“测脚法”下结论。</li>
            </ol>
          </div>
        </div>

        <p className="mt-5 border-l-2 border-primary bg-secondary/60 p-5 text-[13px] leading-6 text-muted-foreground md:p-6">
          <strong className="text-foreground">证据说明：</strong>目前没有被验证为适用于所有新手的单一正反脚测试。一项对 100 名已有滑行经验者的研究没有发现站姿偏好与惯用手、踢球脚或优势眼之间存在显著关系；研究者也指出新手仍需专门研究。因此，干地测试只能提供线索，安全缓坡上的教练观察和重复体验更适合做最终确认。
          <span className="mt-3 block">资料：<a className="underline underline-offset-4 hover:text-primary" href="https://doi.org/10.1515/humo-2016-0015" target="_blank" rel="noopener noreferrer">Staniszewski 等，Evaluation of Laterality in the Snowboard Basic Position（2016）</a> · <a className="underline underline-offset-4 hover:text-primary" href="https://www.burton.com/en-us/blogs/the-burton-blog/goofy-vs-regular" target="_blank" rel="noopener noreferrer">Burton：Regular 与 Goofy 站姿说明</a></span>
        </p>
      </section>

      <div className="mt-9 grid gap-0 border-y border-border md:grid-cols-3">
        <article>
          <div className="h-full py-5 md:pr-5 md:py-6">
          <p className="font-mono text-2xl font-light tabular-nums text-primary">01</p>
          <h3 id="stance-adjust" className="mt-2 scroll-mt-32 text-base font-medium">转圆盘，再按刻度复核</h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            先认准板头和前脚；把固定器圆盘转到目标角度刻度，再按雪板参考孔位设置站距。装入雪鞋后检查鞋头、鞋跟是否居中，确认左右脚空间合适，再拧紧螺丝。
          </p>
          </div>
        </article>
        <article className="border-t border-border md:border-l md:border-t-0">
          <div className="h-full py-5 md:px-5 md:py-6">
          <p className="font-mono text-2xl font-light tabular-nums text-primary">02</p>
          <h3 id="stance-width" className="mt-2 scroll-mt-32 text-base font-medium">站距和 Setback 一起看</h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            站距先用雪板标注的参考站距。公园和反脚练习通常保留居中感；粉雪时可按板型设计和雪况适度后移，不要把所有固定器只往后挪一格当成通用做法。
          </p>
          </div>
        </article>
        <article className="border-t border-border md:border-l md:border-t-0">
          <div className="h-full py-5 md:pl-5 md:py-6">
          <p className="font-mono text-2xl font-light tabular-nums text-primary">03</p>
          <h3 id="stance-test" className="mt-2 scroll-mt-32 text-base font-medium">一次只改一个变量</h3>
          <p className="mt-2 text-[13px] leading-6 text-muted-foreground">
            每次可先按圆盘一个刻度小幅调整（很多 Burton 圆盘每格 3°，以你的固定器刻度为准），在缓坡试滑。若膝盖或髋部不舒服，停止加角度并调回自然位置；首趟后复查螺丝。
          </p>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted-foreground">
        <a href="https://www.burton.com/en-us/blogs/the-burton-blog/goofy-vs-regular" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">Burton 站姿角度说明</a>
        <a href="https://www.burton.com/en-us/blogs/the-burton-blog/how-to-mount-snowboard-bindings" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">Burton 固定器安装步骤</a>
        <a href="https://ca.jonessnowboards.com/pages/a-guide-on-how-to-find-your-snowboard-riding-stance" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">Jones 站距与角度指南</a>
      </div>
    </section>
  );
}
