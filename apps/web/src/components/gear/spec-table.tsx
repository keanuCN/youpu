import { useState } from "react";
import { ChevronDown, CircleHelp } from "lucide-react";
import { formatSpecValue } from "@/lib/domain";
import { fmtPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { GearItem, SpecGroup } from "@/types";

const SNOWBOARD_SPEC_HELP: Record<string, string> = {
  effectiveEdge: "有效边刃是滑行时通常能压住雪面的钢刃长度。数值较长通常能提升抓刃和稳定感，但灵活性也会受板型、形状等因素影响。",
  sidecut: "侧切半径描述板刃从板腰到板头、板尾的弧线尺度。半径较小通常更容易做短弯，半径较大通常更适合拉长弯线；实际转弯还取决于速度、板型和滑手施力。",
  waistWidth: "板腰宽是雪板最窄处的宽度。它需要与鞋码和站姿匹配：太窄可能拖靴，太宽则可能更难快速换刃。",
  stanceSetback: "站位后移表示固定器中心相对雪板中心向板尾偏移的距离。后移站姿通常有助于浮雪和方向性滑行。",
  profile: "板型描述雪板沿长度方向的弧度，例如 Camber（正拱）、Rocker（反拱）或两者组合；它会影响抓刃、浮力、弹性与容错感。品牌对混合板型的命名可能不同。",
  shape: "形状描述板头、板尾和固定器位置的整体布局，例如双向、方向性双向或方向性。它反映雪板更偏向双向滑行、自由式还是单方向滑行。",
  flex: "硬度表示雪板弯曲和扭转时的阻力。不同品牌的评分标尺并不统一，因此更适合参考同品牌、同系列内的相对软硬。",
  damping: "减震描述雪板过滤震动、抑制高速抖动的能力。这里的评分用于概括参数或评测取向，不是跨品牌统一标准。",
  pop: "弹性描述雪板受压后回弹、提供起跳助力的特性。通常与板芯、结构和硬度有关，评分口径可能因品牌或评测来源而异。",
  turnRadiusFeel: "转向手感概括雪板起弯和改变弯线时给人的感觉，例如灵活、稳定或需要较大力量。它是文字描述，不是统一量化标准。",
  core: "板芯是雪板内部的主要承力结构，常由木材或复合材料组成，会影响重量、弹性、回弹和脚下感觉。",
  fiberglass: "玻纤层是板芯上下方的增强材料。纤维铺设方式和层数会改变雪板的扭转支撑、回弹和整体硬度。",
  base: "底面材质指雪板与雪面接触的滑行底板。常见烧结底面和挤压底面在吸蜡、维护和耐磨表现上有所区别。",
};

function SpecLabel({ label, fieldKey }: { label: string; fieldKey: string }) {
  const help = SNOWBOARD_SPEC_HELP[fieldKey];
  return (
    <dt className="mono-label flex shrink-0 items-center gap-1.5">
      {label}
      {help ? (
        <span className="group/spec-help relative inline-flex">
          <button
            type="button"
            aria-label={`${label}：查看术语解释`}
            className="inline-flex size-4 items-center justify-center rounded-full text-muted-foreground/70 outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
          >
            <CircleHelp size={13} strokeWidth={1.7} aria-hidden="true" />
          </button>
          <span
            role="tooltip"
            className="pointer-events-none invisible absolute left-0 top-full z-20 mt-2 w-64 border border-border bg-popover p-3 text-left font-sans text-[12px] leading-5 text-popover-foreground opacity-0 shadow-md transition-opacity group-hover/spec-help:visible group-hover/spec-help:opacity-100 group-focus-within/spec-help:visible group-focus-within/spec-help:opacity-100 sm:left-1/2 sm:-translate-x-1/2"
          >
            {help}
          </span>
        </span>
      ) : null}
    </dt>
  );
}

/** 参数表：按品类的 specTemplate 分组渲染，值缺失显示 — */
export function SpecTable({ gear, groups }: { gear: GearItem; groups: SpecGroup[] }) {
  const [open, setOpen] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((g, i) => [g.group, i < 2])),
  );

  return (
    <div className="border-t border-foreground">
      {groups.map((g) => {
        const expanded = open[g.group] ?? false;
        return (
          <section key={g.group} className="border-b border-border">
            <button
              type="button"
              onClick={() => setOpen((o) => ({ ...o, [g.group]: !expanded }))}
              className="flex w-full items-center justify-between gap-3 py-3 text-left transition-colors hover:text-primary"
              aria-expanded={expanded}
            >
              <span className="flex items-baseline gap-3">
                <span className="mono-label">{String(groups.indexOf(g) + 1).padStart(2, "0")}</span>
                <span className="text-[14px] font-medium">{g.group}</span>
                <span className="mono-label">{g.fields.length} 项</span>
              </span>
              <ChevronDown
                size={15}
                strokeWidth={1.5}
                className={cn("shrink-0 transition-transform duration-300", expanded && "rotate-180")}
              />
            </button>
            {expanded ? (
              <dl className="grid gap-x-8 pb-4 sm:grid-cols-2">
                {g.fields.map((f) => {
                  const raw = gear.specs[f.key];
                  const empty = raw === null || raw === undefined || raw === "";
                  return (
                    <div
                      key={f.key}
                      className="flex items-baseline justify-between gap-4 border-b border-border/70 py-[7px] last:border-0"
                    >
                      <SpecLabel label={f.label} fieldKey={f.key} />
                      <dd className="mono-data text-right text-[13px] tnum">
                        {empty ? (
                          <span className="text-muted-foreground/45">—</span>
                        ) : (
                          <>
                            {f.key === "price" && typeof raw === "number" ? fmtPrice(raw, gear.priceCurrency) : formatSpecValue(raw)}
                            {f.unit ? <span className="ml-[3px] text-[11px] text-muted-foreground">{f.unit}</span> : null}
                          </>
                        )}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
