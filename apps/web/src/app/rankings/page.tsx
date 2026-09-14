import { SEASON } from "@/data/categories";
import { rankRows } from "@/lib/domain";
import { guestState } from "@/lib/persisted";
import { itemListJsonLd, jsonLdProps, simpleMetadata } from "@/lib/seo";
import RankingsClient from "./rankings-client";

export const metadata = simpleMetadata({
  title: `${SEASON} 雪季榜单 · 数据分 70% + 社区投票 30%`,
  description: `单板雪季榜单：综合榜、全山地、自由式、野雪、新手友好与性价比六个分榜，数据分与社区投票加权排名。`,
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
            `${SEASON} 雪季单板综合榜`,
            top.map((row) => ({ name: `${row.gear.brand} ${row.gear.model}`, path: `/gear/${row.gear.id}` })),
          ),
        )}
      />
      <RankingsClient />
    </>
  );
}
