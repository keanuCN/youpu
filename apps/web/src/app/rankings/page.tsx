"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark } from "@/components/gear/primitives";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { SEASON, SNOWBOARD } from "@/data/categories";
import { rankRows } from "@/lib/domain";
import { fmtCompact } from "@/lib/format";
import { useCurrentUser, usePersisted, vote } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useAuthGate } from "@/store/app-shell";

export default function RankingsPage() {
  const persisted = usePersisted();
  const me = useCurrentUser();
  const { requireAuth } = useAuthGate();
  const [rankKey, setRankKey] = useState(SNOWBOARD.rankCategories[0]?.key ?? "overall");
  const rows = rankRows(persisted, rankKey);
  const mine = me.votes.find(
    (v) => v.categorySlug === "snowboard" && v.rankKey === rankKey && v.season === SEASON,
  );
  const podium = rows.slice(0, 3);
  const rest = rows.slice(3);
  const maxFinal = rows[0]?.final ?? 1;

  const onVote = (gearId: string) => {
    requireAuth(() => {
      const res = vote("snowboard", rankKey, SEASON, gearId);
      if (res.ok) toast.success(mine ? "已改投（改投机会仅一次）" : "投票成功，榜单已实时更新");
      else toast.error(res.message);
    }, "投票需要先登录");
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <PageHead
        kicker={`${SEASON} SEASON RANKINGS`}
        title="雪季榜单"
        titleEn="Rankings"
        desc="最终分 = 数据分 × 70% + 社区票 × 30%。数据分由综合指数、热度、进阶取向与用户评分加权得出；每个榜单每人一票，可改投一次。"
        aside={
          <div className="text-right">
            <p className="mono-data text-[38px] leading-none tnum">{rows.length}</p>
            <p className="mono-label mt-1.5">件参与本榜</p>
          </div>
        }
      />

      <div className="thin-scroll mt-8 flex gap-1.5 overflow-x-auto border-b border-foreground pb-3">
        {SNOWBOARD.rankCategories.map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setRankKey(c.key)}
            className={cn(
              "mono-label shrink-0 border px-3.5 py-2 transition-colors",
              rankKey === c.key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* 领奖台 */}
      <section className="mt-10 grid gap-px border border-border bg-border md:grid-cols-3">
        {podium.map((r, i) => (
          <article
            key={r.gear.id}
            className={cn(
              "group relative flex flex-col bg-background p-5",
              i === 0 && "md:order-2 md:bg-secondary/40",
              i === 1 && "md:order-1",
              i === 2 && "md:order-3",
            )}
          >
            <div className="flex items-start justify-between">
              <span className={cn("mono-data text-[46px] leading-none tnum", i === 0 ? "text-primary" : "text-muted-foreground/40")}>
                {String(r.rank).padStart(2, "0")}
              </span>
              <ScoreMark value={r.gear.composite} size="sm" />
            </div>
            <Link href={`/gear/${r.gear.id}`} className="mt-4 block">
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img src={r.gear.hero} alt="" loading="lazy" className="plate h-full w-full object-cover" />
              </div>
              <p className="mono-label mt-3">{r.gear.brand}</p>
              <h3 className="mt-1 text-[17px] leading-snug font-medium">{r.gear.model}</h3>
            </Link>

            <dl className="mono-data mt-4 space-y-1 border-t border-border pt-3 text-[11.5px] tnum">
              <div className="flex justify-between">
                <dt className="mono-label">数据分</dt>
                <dd>{r.dataScore.toFixed(1)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="mono-label">社区票</dt>
                <dd>{fmtCompact(r.votes)}</dd>
              </div>
              <div className="flex justify-between text-foreground">
                <dt className="mono-label text-foreground">最终分</dt>
                <dd className="font-medium">{r.final.toFixed(1)}</dd>
              </div>
            </dl>

            <div className="mt-3 h-[4px] bg-border">
              <span className="animate-bar-grow block h-full bg-primary" style={{ width: `${(r.final / maxFinal) * 100}%` }} />
            </div>

            <Button
              type="button"
              size="sm"
              variant={mine?.gearId === r.gear.id ? "default" : "outline"}
              onClick={() => onVote(r.gear.id)}
              className={cn(
                "mono-label mt-4 h-8 w-full rounded-none text-[11px]",
                mine?.gearId === r.gear.id ? "bg-primary hover:bg-primary/90" : "border-border",
              )}
            >
              {mine?.gearId === r.gear.id ? "已投它" : mine ? "改投它" : "投它一票"}
            </Button>
          </article>
        ))}
      </section>

      {/* 完整名次 */}
      <section className="mt-12">
        <div className="rule-heavy mb-2 flex flex-wrap items-center justify-between gap-3 pb-2.5">
          <p className="mono-label text-foreground">完整名次 · {rows.length} 件</p>
          <p className="mono-label">
            {mine
              ? `你投了 ${rows.find((r) => r.gear.id === mine.gearId)?.gear.model ?? "已下架装备"}${mine.changed ? " · 改投机会已用完" : " · 还可改投一次"}`
              : `你还没在「${SNOWBOARD.rankCategories.find((c) => c.key === rankKey)?.label}」投票`}
          </p>
        </div>
        <div>
          {rest.map((r) => (
            <div key={r.gear.id} className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <GearRow
                  gear={r.gear}
                  rank={r.rank}
                  note={`数据 ${r.dataScore.toFixed(1)} · 社区 ${fmtCompact(r.votes)} 票 · 最终 ${r.final.toFixed(1)}`}
                />
              </div>
              <button
                type="button"
                onClick={() => onVote(r.gear.id)}
                className={cn(
                  "mono-label mb-3 hidden shrink-0 border px-3 py-1.5 transition-colors sm:block",
                  mine?.gearId === r.gear.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border hover:border-foreground",
                )}
              >
                {mine?.gearId === r.gear.id ? "已投" : "投票"}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-14 border border-border p-6">
        <p className="mono-label mb-3">计票口径 / METHODOLOGY</p>
        <ul className="grid gap-3 text-[13px] leading-relaxed text-muted-foreground sm:grid-cols-2">
          <li>· 数据分 = 综合指数 55% + 热度 20% + 进阶取向 15% + 用户评分 10%（新手榜把进阶取向反向计分）</li>
          <li>· 社区票按本榜最高票数归一化后占最终分 30%</li>
          <li>· 性价比榜只在价格最低的 10 件里排名，避免高价板靠品牌溢价占位</li>
          <li>· 每人每榜每季一票，允许改投一次，改投后锁定</li>
        </ul>
        <p className="mono-label mt-4 border-t border-border pt-3">
          当前为原型演示：票数基数为预置数据，你的投票保存在本机浏览器，不会同步给其他访客。
        </p>
      </section>
    </div>
  );
}
