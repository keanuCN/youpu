import { Check, Minus } from "lucide-react";
import { PendingBlock } from "@/components/gear/data-state";
import { hasNarrative } from "@/lib/gear-state";
import type { GearItem } from "@/types";

/** 客观分析区：结论 + 强项 / 短板 + 适合 / 不适合 */
export function AnalysisBlock({ gear }: { gear: GearItem }) {
  const a = gear.analysis;
  if (!hasNarrative(gear)) {
    return (
      <PendingBlock
        title="编辑分析待补充"
        detail="当前已录入官方规格，结论、强项和适用人群将在本地内容校对完成后补充。"
      />
    );
  }
  return (
    <div className="space-y-8">
      <blockquote className="border-l-2 border-primary pl-5">
        <p className="mono-label mb-2 text-primary">编辑结论 / VERDICT</p>
        <p className="serif-display text-[21px] leading-[1.5] text-balance sm:text-[25px]">{a.verdict}</p>
      </blockquote>

      <div className="grid gap-6 sm:grid-cols-2">
        <List title="强项" titleEn="Strengths" items={a.strengths} tone="plus" />
        <List title="短板" titleEn="Weaknesses" items={a.weaknesses} tone="minus" />
      </div>

      <div className="grid gap-6 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="mono-label mb-3">适合谁 / FITS</p>
          {a.fits.length ? (
            <ul className="space-y-2">
              {a.fits.map((t) => (
                <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed">
                  <Check size={14} strokeWidth={2} className="mt-[3px] shrink-0 text-primary" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mono-label text-muted-foreground/65">待补充</p>
          )}
        </div>
        <div>
          <p className="mono-label mb-3">不适合谁 / NOT FOR</p>
          {a.notFits.length ? (
            <ul className="space-y-2">
              {a.notFits.map((t) => (
                <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed text-muted-foreground">
                  <Minus size={14} strokeWidth={2} className="mt-[3px] shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mono-label text-muted-foreground/65">待补充</p>
          )}
        </div>
      </div>
    </div>
  );
}

function List({ title, titleEn, items, tone }: { title: string; titleEn: string; items: string[]; tone: "plus" | "minus" }) {
  if (items.length === 0) {
    return (
      <div className="border border-border p-4">
        <p className="mono-label mb-3 border-b border-border pb-2">
          {title} <span className="text-muted-foreground/60">/ {titleEn}</span>
        </p>
        <p className="mono-label text-muted-foreground/65">待补充</p>
      </div>
    );
  }
  return (
    <div className="border border-border p-4">
      <p className="mono-label mb-3 border-b border-border pb-2">
        {title} <span className="text-muted-foreground/60">/ {titleEn}</span>
      </p>
      <ul className="space-y-2.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2.5 text-[13px] leading-relaxed">
            <span
              className={
                tone === "plus"
                  ? "mono-data mt-[2px] shrink-0 text-primary"
                  : "mono-data mt-[2px] shrink-0 text-muted-foreground"
              }
            >
              {tone === "plus" ? "+" : "−"}
            </span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** 「适合谁」标签墙 */
export function WhoForTags({ tags }: { tags: string[] }) {
  if (tags.length === 0) return <p className="mono-label text-muted-foreground/65">适用人群待补充</p>;
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <span key={t} className="border border-foreground px-2.5 py-1 text-[12px] transition-colors hover:bg-foreground hover:text-background">
          {t}
        </span>
      ))}
    </div>
  );
}
