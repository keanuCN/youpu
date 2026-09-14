import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GearItem, SpecGroup } from "@/types";

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
                      <dt className="mono-label shrink-0">{f.label}</dt>
                      <dd className="mono-data text-right text-[13px] tnum">
                        {empty ? (
                          <span className="text-muted-foreground/45">—</span>
                        ) : (
                          <>
                            {f.key === "price" && typeof raw === "number" ? `¥${raw.toLocaleString("zh-CN")}` : String(raw)}
                            {f.unit ? <span className="ml-[3px] text-[10px] text-muted-foreground">{f.unit}</span> : null}
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
