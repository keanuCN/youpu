import { Suspense } from "react";
import { SEASON } from "@/data/categories";
import { rankRows } from "@/lib/domain";
import { guestState } from "@/lib/persisted";
import { itemListJsonLd, jsonLdProps, simpleMetadata } from "@/lib/seo";
import RankingsClient from "./rankings-client";

export const metadata = simpleMetadata({
  title: `${SEASON} 装备榜单 · 数据分 70% + 社区投票 30%`,
  description: `有谱装备榜单：单板、羽毛球拍与路亚竿按品类查看综合榜、性能榜和性价比榜，数据分与社区投票加权排名。`,
  path: "/rankings",
});

export default function Page() {
  // 结构化数据用确定性游客态排名（服务端），与页面首屏一致
  const top = rankRows(guestState(), "overall").slice(0, 10);
  return (
    <>
      <script
        {...jsonLdProps(
          itemListJsonLd(
            `${SEASON} 装备综合榜`,
            top.map((row) => ({ name: `${row.gear.brand} ${row.gear.model}`, path: `/gear/${row.gear.id}` })),
          ),
        )}
      />
      <Suspense fallback={null}>
        <RankingsClient />
      </Suspense>
    </>
  );
}
