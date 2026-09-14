"use client";

import Link from "next/link";
import { ArrowRight, Compass, Trophy } from "lucide-react";
import { GearCard, GearRow } from "@/components/gear/gear-card";
import { SectionHead } from "@/components/layout/section-head";
import { Avatar } from "@/components/layout/site-header";
import { Stars } from "@/components/gear/primitives";
import { GEAR, getGear } from "@/data/boards";
import { IMG } from "@/data/assets";
import { CATEGORY_TREE, SEASON, SNOWBOARD } from "@/data/categories";
import { hotReviews, rankRows } from "@/lib/domain";
import { timeAgo } from "@/lib/format";
import { usePersisted } from "@/lib/store";

export default function HomePage() {
  const snapshot = usePersisted();
  const top = rankRows(snapshot, "overall").slice(0, 5);
  const fresh = GEAR.filter((g) => g.isNew).slice(0, 4);
  const reviews = hotReviews(snapshot, 3);

  return (
    <div>
      <Cover />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <CategoryEntries />

        <section className="reveal reveal-up mt-20">
          <SectionHead
            index="01"
            title="本期新入库"
            titleEn="New Arrivals"
            desc={`${SEASON} 雪季新增档案，全部按同一套六维评分体系实测录入。`}
            action={
              <Link href="/browse/snowboard" className="mono-label story-link flex items-center gap-1.5">
                查看全部 {GEAR.length} 件 <ArrowRight size={13} strokeWidth={1.6} />
              </Link>
            }
          />
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {fresh.map((g, i) => (
              <GearCard key={g.id} gear={g} from="home" position={i} sort="new" />
            ))}
          </div>
        </section>

        <section className="reveal reveal-up mt-20 grid gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <SectionHead
              index="02"
              title={`${SEASON} 综合榜`}
              titleEn="Top Rated"
              desc="数据分 70% + 社区投票 30%，每票限一件、可改投一次。"
              action={
                <Link href="/rankings" className="mono-label story-link flex items-center gap-1.5">
                  <Trophy size={13} strokeWidth={1.6} /> 完整榜单
                </Link>
              }
            />
            <div className="-mt-2">
              {top.map((r) => (
                <GearRow key={r.gear.id} gear={r.gear} rank={r.rank} note={`数据 ${r.dataScore} · 社区 ${r.votes} 票`} from="home" />
              ))}
            </div>
          </div>

          <div>
            <SectionHead
              index="03"
              title="社区实测"
              titleEn="Field Reports"
              desc="每条评论都带雪龄、体重与常滑场地——你能直接看到和自己条件接近的人怎么说。"
            />
            <ul className="space-y-4">
              {reviews.map((r) => {
                const gear = getGear(r.gearId);
                return (
                  <li key={r.id}>
                    <Link
                      href={`/gear/${r.gearId}`}
                      className="group block border border-border p-4 transition-colors hover:border-foreground"
                    >
                      <div className="flex items-center gap-2.5">
                        <Avatar seed={r.authorName} name={r.authorName} size={28} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[13px] font-medium">{r.authorName}</p>
                          <p className="mono-label truncate">
                            {r.authorMeta.years} 年 · {r.authorMeta.weightKg ?? "—"}kg · {r.authorMeta.resort || "未标注场地"}
                          </p>
                        </div>
                        <Stars value={r.rating} size={11} />
                      </div>
                      <p className="mt-3 line-clamp-3 text-[13px] leading-relaxed">{r.content}</p>
                      <div className="mono-label mt-3 flex items-center justify-between border-t border-border pt-2.5">
                        <span className="truncate text-primary">
                          {gear ? `${gear.brand} ${gear.model}` : r.gearId}
                        </span>
                        <span>
                          {r.seedHelpful ?? 0} 有帮助 · {timeAgo(r.createdAt)}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <QuizBand />
      </div>
    </div>
  );
}

function Cover() {
  return (
    <section className="relative border-b border-foreground">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative order-2 min-h-[320px] overflow-hidden lg:order-1 lg:min-h-[560px]">
          <img
            src={IMG.heroRidge}
            alt="雪脊"
            className="plate h-full w-full object-cover"
            style={{ filter: "grayscale(0.85) contrast(1.08)" }}
          />
          <div className="dot-grid pointer-events-none absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-foreground/80 to-transparent p-5 sm:p-8">
            <p className="mono-label text-background/80">FIELD TEST · 崇礼 / 可可托海 / 将军山</p>
            <p className="mono-data text-[12px] text-background/80 tnum">{GEAR.length} 件在档</p>
          </div>
        </div>

        <div className="relative order-1 flex flex-col justify-center border-r border-border px-5 py-12 sm:px-10 lg:order-2 lg:px-14 lg:py-16">
          <p className="mono-label mb-5 text-primary">ISSUE No.42 / 全品类装备档案</p>
          <h1 className="text-[42px] leading-[1.1] font-medium tracking-tight text-balance sm:text-[58px] lg:text-[64px]">
            把装备拆成
            <br />
            <span className="serif-display text-primary">数据</span>，
            <br />
            再决定买不买。
          </h1>
          <p className="mt-6 max-w-md text-[14px] leading-[1.85] text-muted-foreground">
            单板、跑鞋、镜头、键盘——每个品类都有自己的参数体系与评分维度。
            横向对比、按场景筛选、按自身条件匹配，参数看得懂，选起来才有底。
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="#categories"
              className="mono-label flex items-center gap-2 bg-foreground px-5 py-3 text-background transition-colors hover:bg-primary"
            >
              浏览全部品类 <ArrowRight size={14} strokeWidth={1.6} />
            </Link>
            <Link
              href="/quiz"
              className="mono-label flex items-center gap-2 border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
            >
              <Compass size={14} strokeWidth={1.6} /> 60 秒选装备问卷
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 border-t border-border pt-6">
            {[
              { k: "在档装备", v: GEAR.length, u: "件" },
              { k: "评分维度", v: SNOWBOARD.scoreDims.length, u: "维" },
              { k: "实测评论", v: 24, u: "条" },
            ].map((s) => (
              <div key={s.k}>
                <dt className="mono-label">{s.k}</dt>
                <dd className="mono-data mt-1.5 text-[26px] leading-none tnum">
                  {s.v}
                  <span className="ml-1 text-[12px] text-muted-foreground">{s.u}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

function CategoryEntries() {
  const leaves = CATEGORY_TREE.flatMap((r) => r.children ?? []);
  return (
    <section id="categories" className="reveal mt-16 scroll-mt-32">
      <SectionHead index="00" title="品类入口" titleEn="Categories" desc="单板已开档；其余品类共用同一套模板引擎，配置就绪即上线。" />
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {leaves.map((c) => {
          const live = c.status === "live";
          const count = live ? GEAR.length : 0;
          return (
            <Link
              key={c.slug}
              href={live ? `/browse/${c.slug}` : `/soon/${c.slug}`}
              className="group relative flex min-h-36 flex-col justify-between bg-background p-5 transition-colors hover:bg-foreground hover:text-background"
            >
              <div>
                <p className="mono-label group-hover:text-background/60">{c.path.join(" / ")}</p>
                <p className="mt-2 text-[20px] leading-none font-medium">{c.name}</p>
                <p className="serif-display mt-1.5 text-[15px] opacity-60">{c.nameEn}</p>
              </div>
              <div className="mt-6 flex items-end justify-between">
                <span className="mono-data text-[12px] tnum opacity-70">
                  {live ? `${count} 件在档` : "配置中"}
                </span>
                <span
                  className={
                    live
                      ? "mono-label bg-primary px-2 py-[3px] text-primary-foreground group-hover:bg-background group-hover:text-foreground"
                      : "mono-label border border-current px-2 py-[3px] opacity-60"
                  }
                >
                  {live ? "LIVE" : "SOON"}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

function QuizBand() {
  return (
    <section className="reveal reveal-up mt-20 border border-foreground">
      <div className="grid lg:grid-cols-[1fr_320px]">
        <div className="p-7 sm:p-10">
          <p className="mono-label mb-4 text-primary">RECOMMENDATION ENGINE</p>
          <h2 className="text-[28px] leading-tight font-medium tracking-tight text-balance sm:text-[34px]">
            不知道选哪件？<span className="serif-display text-primary"> 6 个问题</span>给出带理由的三件装备。
          </h2>
          <p className="mt-4 max-w-xl text-[13.5px] leading-relaxed text-muted-foreground">
            问卷会读取你的水平、使用场景、身体条件与预算，
            在 {GEAR.length} 件档案里做加权匹配，并逐条说明为什么推荐它、为什么没推荐别的。
          </p>
          <ul className="mono-label mt-6 flex flex-wrap gap-x-6 gap-y-2">
            {SNOWBOARD.quizTemplate.map((q, i) => (
              <li key={q.key}>
                <span className="text-primary">{String(i + 1).padStart(2, "0")}</span> {q.question}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/quiz"
          className="flex flex-col items-center justify-center gap-3 border-t border-foreground bg-foreground p-8 text-background transition-colors hover:bg-primary lg:border-t-0 lg:border-l"
        >
          <Compass size={28} strokeWidth={1.2} />
          <span className="mono-label text-background/70">开始问卷</span>
          <span className="serif-display text-2xl">60 秒</span>
          <ArrowRight size={18} strokeWidth={1.4} />
        </Link>
      </div>
    </section>
  );
}
