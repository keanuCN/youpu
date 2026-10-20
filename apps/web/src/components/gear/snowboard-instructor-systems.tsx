import { resolveImageUrl } from '@/lib/image-url';

const systems: {
  region: string;
  title: string;
  description: string;
  logo?: string;
  logoAlt?: string;
  logoText?: string;
  links: { label: string; href: string }[];
}[] = [
  {
    region: '中国 · 国家职业技能评价',
    title: '单板滑雪社会体育指导员',
    description: '国内职业资格路径，按国家职业技能鉴定要求进行理论与实操考核。报名条件、等级和当期安排以主管部门发布的标准及鉴定通知为准，可通过国家体育总局政务服务平台查询证书。',
    logoText: '国职',
    links: [{ label: '国家体育总局：单板指导员职业技能标准', href: 'https://www.sport.gov.cn/rlzx/n5622/c29398608/part/29398700.pdf' }],
  },
  {
    region: '日本 · JSBA',
    title: '滑行技术测试与教练资格分开',
    description: 'JSBA 的 Badge Test 是个人滑行技术等级，1–5 级中 1 级最高；公认教练资格则分 C、B、A 级。Badge 1 级可作为申请 C 级教练资格的条件之一，但两者不是同一张证书。',
    logo: '/logos/jsba.svg',
    logoAlt: 'JSBA 日本滑雪协会标志',
    links: [
      { label: 'Badge Test', href: 'https://jsba.jp/education/badgetest/' },
      { label: '教练资格手册', href: 'https://www.jsba.jp/education/lisence_manual/' },
    ],
  },
  {
    region: '加拿大 · CASI',
    title: '单板教练认证 Level 1–4',
    description: 'CASI 是加拿大单板教练认证机构，主路径从 Level 1 入门教练逐级进阶到 Level 4；另设 Park Instructor 等专项课程。证书侧重单板教学与示范能力，具体可教范围看对应级别要求。',
    logo: '/logos/casi.svg',
    logoAlt: 'CASI 加拿大单板教练协会标志',
    links: [{ label: 'CASI 官方认证介绍', href: 'https://casi-acms.com/becoming-an-instructor/' }],
  },
  {
    region: '美国 · AASI / PSIA-AASI',
    title: '单板教学认证 Level 1–3',
    description: 'AASI 是美国 Professional Ski Instructors of America and American Association of Snowboard Instructors（PSIA-AASI）中的单板教学体系。认证标准综合考察滑行技术、教学、与学员沟通等能力，并有专项进阶路径。',
    logo: '/logos/psia-aasi.svg',
    logoAlt: 'PSIA-AASI 美国滑雪与单板教练协会标志',
    links: [{ label: 'PSIA-AASI 单板认证', href: 'https://thesnowpros.org/get-certified/snowboard/' }],
  },
  {
    region: '新西兰 · SBINZ / NZSIA',
    title: '单板 Level 1–3 与专项模块',
    description: 'SBINZ 是 NZSIA 下负责单板教学培训与认证的分支，设有 Level 1–3，以及儿童教学、Park & Pipe 和 Trainer 等进阶方向。课程结构与 CASI、JSBA 不同，不能只按数字判断水平相等。',
    logo: '/logos/sbinz.png',
    logoAlt: 'SBINZ 新西兰单板教练体系标志',
    links: [{ label: 'SBINZ 官方体系介绍', href: 'https://www.nzsia.org/SNOWBOARD/' }],
  },
  {
    region: '国际组织 · ISIA',
    title: '成员协会网络与质量标准',
    description: 'ISIA（International Ski Instructors Association）是国际滑雪教练协会，连接各国教练协会并设有质量标准、数据库及 Card / Stamp 等标识；它不是一套可替代各国本地教练资格的统一“国际 Level 1–4 证书”。',
    logo: '/logos/isia.svg',
    logoAlt: 'ISIA 国际滑雪教练协会标志',
    links: [{ label: 'ISIA 官方说明', href: 'https://isia.ski/' }],
  },
];

export function SnowboardInstructorSystems() {
  return (
    <section id="instructor-systems" aria-labelledby="instructor-systems-title" className="scroll-mt-32 mt-10 border-y-2 border-foreground/80 py-9 md:mt-12 md:py-12">
      <header className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(250px,0.65fr)] md:items-end md:gap-10">
        <div>
          <p className="mono-label text-primary">单板科普 · 教练与认证</p>
          <h2 id="instructor-systems-title" className="mt-2 text-3xl font-medium tracking-tight md:text-4xl">单板教练认证体系</h2>
        </div>
        <p className="text-[14px] leading-7 text-muted-foreground">
          JSBA、CASI、AASI 等由不同国家或组织制定，考核内容、教学范围和等级名称并不统一，Level 1 不能直接横向等同。还要区分“教练资格”和“个人滑行技术等级”：通过技术测试，不一定就取得了授课资格。
        </p>
      </header>

      <div className="mt-7 grid gap-x-6 gap-y-5 md:grid-cols-2 xl:grid-cols-3">
        {systems.map(({ region, title, description, logo, logoAlt, logoText, links }) => (
          <article key={region} className="border-t-2 border-border pt-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-28 shrink-0 items-center justify-start">
                {logo ? <img src={resolveImageUrl(logo)} alt={logoAlt ?? ''} loading="lazy" decoding="async" className="max-h-11 max-w-28 object-contain object-left" /> : null}
                {logoText ? <span className="inline-flex h-10 min-w-10 items-center justify-center border border-primary/40 bg-secondary/70 px-2 font-mono text-xs font-semibold tracking-wide text-primary">{logoText}</span> : null}
              </span>
              <p className="mono-label text-primary">{region}</p>
            </div>
            <h3 className="mt-3 text-base font-medium">{title}</h3>
            <p className="mt-2 text-[13px] leading-6 text-muted-foreground">{description}</p>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
              {links.map((link) => (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-primary">
                  {link.label}
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>

      <p className="mt-6 border-l-2 border-primary bg-secondary/50 p-4 text-[13px] leading-6 text-muted-foreground">
        <strong className="text-foreground">名称提醒：</strong>“ASIA”可能是 AASI（美国单板教练体系），也可能是 ISIA（国际滑雪教练协会），两者不是同一个组织。选教练时还应确认板类、证书全称与级别、有效状态、雪场授课授权，以及教练是否熟悉你的目标（入门、刻滑、公园或野雪）。
      </p>
    </section>
  );
}
