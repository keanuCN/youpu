"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, Trophy } from "lucide-react";
import { FallbackNotice, GearGridSkeleton, LoadingStatus, RankRowsSkeleton } from "@/components/gear/data-state";
import { GearCard, GearRow } from "@/components/gear/gear-card";
import { SafeImage } from "@/components/gear/safe-image";
import { SectionHead } from "@/components/layout/section-head";
import { Avatar } from "@/components/layout/site-header";
import { Stars } from "@/components/gear/primitives";
import { GEAR, getGear } from "@/data/boards";
import { HERO_IMAGE_POOL } from "@/data/assets";
import { CATEGORY_LEAVES, SEASON, SNOWBOARD, getCategory } from "@/data/categories";
import { hotReviews, rankRows } from "@/lib/domain";
import { getCategoryProducts, resolveContentSource } from "@/lib/content";
import { timeAgo } from "@/lib/format";
import { usePersisted } from "@/lib/store";
import type { GearItem } from "@/types";

export default function HomePage() {
  const snapshot = usePersisted();
  const categoryCounts = useLiveCategoryCounts();
  const liveCategories = CATEGORY_LEAVES.filter((category) => category.status === "live");
  const catalogCount = liveCategories.reduce((sum, category) => sum + (categoryCounts[category.slug] ?? 0), 0);
  const snowboardCount = categoryCounts.snowboard ?? GEAR.length;
  const liveCategoryNames = liveCategories.map((category) => category.name).join("、");
  const [featuredSlug, setFeaturedSlug] = useState("snowboard");
  const [featuredPool, setFeaturedPool] = useState<GearItem[]>(GEAR);
  const [featuredLoading, setFeaturedLoading] = useState(false);
  const [featuredFallback, setFeaturedFallback] = useState(false);
  const [featuredRetry, setFeaturedRetry] = useState(0);
  const featuredCategory = getCategory(featuredSlug) ?? SNOWBOARD;
  const top = rankRows(snapshot, "overall", featuredSlug, featuredPool).slice(0, 5);
  const fresh = (featuredSlug === "snowboard" ? featuredPool.filter((g) => g.isNew) : featuredPool).slice(0, 4);
  const reviews = hotReviews(snapshot, 3);

  useEffect(() => {
    let cancelled = false;
    const localPool = GEAR.filter((gear) => gear.categorySlug === featuredSlug);
    setFeaturedPool(localPool);
    setFeaturedFallback(false);
    if (resolveContentSource() === "pack") {
      setFeaturedLoading(false);
      return () => {
        cancelled = true;
      };
    }

    setFeaturedLoading(true);
    void getCategoryProducts(featuredSlug, {
      source: "api",
      onFallback: () => {
        if (!cancelled) setFeaturedFallback(true);
      },
    }).then((next) => {
      if (cancelled) return;
      setFeaturedPool(next);
      setFeaturedLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [featuredRetry, featuredSlug]);

  return (
    <div>
      <Cover catalogCount={catalogCount} liveCategoryCount={liveCategories.length} liveCategoryNames={liveCategoryNames} />
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8">
        <CategoryEntries categoryCounts={categoryCounts} />

        <section className="reveal reveal-up mt-20">
          <FeaturedCategorySwitch categories={liveCategories} value={featuredSlug} onChange={setFeaturedSlug} />
          <SectionHead
            index="01"
            title={`${featuredCategory.name}${featuredSlug === "snowboard" ? "新入库" : "精选档案"}`}
            titleEn={featuredSlug === "snowboard" ? "New Arrivals" : "Featured Archive"}
            desc={`${featuredCategory.name}按品类参数模板整理，缺失内容会明确标注“待补充”。`}
            action={
              <Link href={`/browse/${featuredSlug}`} className="mono-label story-link flex items-center gap-1.5">
                查看{featuredCategory.name} {featuredPool.length} 件 <ArrowRight size={13} strokeWidth={1.6} />
              </Link>
            }
          />
          {featuredLoading && !featuredPool.length ? (
            <GearGridSkeleton count={4} />
          ) : fresh.length ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {fresh.map((g, i) => (
                <GearCard key={g.id} gear={g} from="home" position={i} sort="new" />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border py-16 text-center">
              <p className="text-[15px] font-medium">{featuredCategory.name}档案待补充</p>
              <p className="mono-label mt-2">当前品类还没有可展示的精选装备。</p>
            </div>
          )}
          {featuredLoading && featuredPool.length ? <LoadingStatus label={`正在同步${featuredCategory.name}档案`} className="mt-3" /> : null}
          {featuredFallback ? <FallbackNotice onRetry={() => setFeaturedRetry((value) => value + 1)} className="mt-3" /> : null}
        </section>

        <section className="reveal reveal-up mt-20 grid min-w-0 gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div className="min-w-0">
            <SectionHead
              index="02"
              title={`${SEASON} ${featuredCategory.name}综合榜`}
              titleEn="Top Rated"
              desc={`${featuredCategory.name}数据分 70% + 社区投票 30%，每票限一件、可改投一次。`}
              action={
                <Link href={featuredSlug === "snowboard" ? "/rankings" : `/rankings?category=${featuredSlug}`} className="mono-label story-link flex items-center gap-1.5">
                  <Trophy size={13} strokeWidth={1.6} /> 完整榜单
                </Link>
              }
            />
            {featuredLoading && !top.length ? (
              <RankRowsSkeleton count={5} className="-mt-2" />
            ) : top.length ? (
              <div className="-mt-2">
                {top.map((r) => (
                  <GearRow key={r.gear.id} gear={r.gear} rank={r.rank} note={`数据 ${r.dataScore} · 社区 ${r.votes} 票`} from="home" />
                ))}
              </div>
            ) : (
              <div className="border border-dashed border-border py-12 text-center">
                <p className="text-[15px] font-medium">榜单数据待补充</p>
                <p className="mono-label mt-2">当前品类还没有足够的装备数据。</p>
              </div>
            )}
            {featuredLoading && top.length ? <LoadingStatus label={`正在同步${featuredCategory.name}榜单`} className="mt-3" /> : null}
          </div>

          <div className="min-w-0">
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

        <QuizBand snowboardCount={snowboardCount} />
      </div>
    </div>
  );
}

function FeaturedCategorySwitch({
  categories,
  value,
  onChange,
}: {
  categories: typeof CATEGORY_LEAVES;
  value: string;
  onChange: (slug: string) => void;
}) {
  return (
    <div className="thin-scroll mb-4 flex gap-1.5 overflow-x-auto" aria-label="首页精选品类">
      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          aria-pressed={value === category.slug}
          onClick={() => onChange(category.slug)}
          className={
            value === category.slug
              ? "mono-label shrink-0 border border-foreground bg-foreground px-3 py-1.5 text-background"
              : "mono-label shrink-0 border border-border px-3 py-1.5 hover:border-foreground"
          }
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}

function Cover({
  catalogCount,
  liveCategoryCount,
  liveCategoryNames,
}: {
  catalogCount: number;
  liveCategoryCount: number;
  liveCategoryNames: string;
}) {
  const [heroImage, setHeroImage] = useState<(typeof HERO_IMAGE_POOL)[number]>(HERO_IMAGE_POOL[0]);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * HERO_IMAGE_POOL.length);
    setHeroImage(HERO_IMAGE_POOL[randomIndex] ?? HERO_IMAGE_POOL[0]);
  }, []);

  return (
    <section className="relative border-b border-foreground">
      <div className="grid lg:grid-cols-[1.15fr_1fr]">
        <div className="relative order-2 min-h-[320px] overflow-hidden lg:order-1 lg:min-h-[560px]">
          <SafeImage
            src={heroImage.src}
            alt={heroImage.alt}
            fallbackLabel="雪场首屏"
            fallbackMode="muted"
            className="plate h-full w-full object-cover"
            style={{ filter: "grayscale(0.85) contrast(1.08)" }}
          />
          <div className="dot-grid pointer-events-none absolute inset-0" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-3 bg-gradient-to-t from-foreground/80 to-transparent p-5 sm:p-8">
            <p className="mono-label text-background/80">FIELD TEST · 崇礼 / 可可托海 / 将军山</p>
            <p className="mono-data text-[12px] text-background/80 tnum">当前在档 {catalogCount} 件装备</p>
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
            {liveCategoryNames || "多个装备品类"}——每个品类都有自己的参数体系与评分维度。
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
              { k: "已开档品类", v: liveCategoryCount, u: "类" },
              { k: "在档装备", v: catalogCount, u: "件" },
              { k: "评分维度", v: SNOWBOARD.scoreDims.length, u: "维" },
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

function useLiveCategoryCounts(): Record<string, number> {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({ snowboard: GEAR.length });

  useEffect(() => {
    let cancelled = false;
    const liveSlugs = CATEGORY_LEAVES.filter((category) => category.status === "live").map((category) => category.slug);
    void Promise.all(
      liveSlugs.map(async (slug) => [slug, (await getCategoryProducts(slug)).length] as const),
    ).then((entries) => {
      if (!cancelled) setCategoryCounts(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return categoryCounts;
}

function CategoryEntries({ categoryCounts }: { categoryCounts: Record<string, number> }) {
  const liveCategories = CATEGORY_LEAVES.filter((category) => category.status === "live");
  const previewCategories = liveCategories.slice(0, 8);
  const remainingCount = CATEGORY_LEAVES.length - previewCategories.length;

  return (
    <section id="categories" className="reveal mt-16 scroll-mt-32">
      <SectionHead index="00" title="品类入口" titleEn="Categories" desc="已开档品类可直接浏览；其余品类共用同一套模板引擎，配置就绪即上线。" />
      <div className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {previewCategories.map((c) => {
          const live = c.status === "live";
          const count = categoryCounts[c.slug];
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
                  {live ? (count === undefined ? "读取中" : `${count} 件在档`) : "配置中"}
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
      {remainingCount > 0 ? (
        <div className="mt-5 flex justify-center">
          <Link
            href="/categories"
            className="mono-label inline-flex items-center gap-2 border border-border px-4 py-2.5 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            更多品类 · {remainingCount}
            <ArrowRight size={14} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}

function QuizBand({ snowboardCount }: { snowboardCount: number }) {
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
            在 {snowboardCount} 件单板档案里做加权匹配，并逐条说明为什么推荐它、为什么没推荐别的。
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
