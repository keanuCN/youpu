"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Scale, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { getGear } from "@/data/boards";
import { getCompareProducts, resolveContentSource } from "@/lib/content";
import { DOCK_MAX, clearDock, removeFromDock, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import type { GearItem } from "@/types";

/** 常驻对比坞：跨页面保留，最多 4 件 */
export function CompareDock() {
  const router = useRouter();
  const me = useCurrentUser();
  const ids = me.dockIds;
  const idsKey = ids.join("|");
  const [shake, setShake] = useState(0);
  const [items, setItems] = useState<GearItem[]>(() => ids.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g));
  const [loading, setLoading] = useState(false);
  const prevLen = useRef(ids.length);

  useEffect(() => {
    if (ids.length > prevLen.current && ids.length >= DOCK_MAX) setShake((s) => s + 1);
    prevLen.current = ids.length;
  }, [ids.length]);

  useEffect(() => {
    let active = true;
    const localItems = ids.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g);
    setItems(localItems);
    if (!ids.length) {
      setItems([]);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    if (resolveContentSource() === "pack") {
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    void getCompareProducts(ids, { source: "api" }).then((next) => {
      if (!active) return;
      setItems(next);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [idsKey]);

  if (!ids.length) return null;

  const start = () => {
    if (loading) {
      toast("正在读取对比数据");
      return;
    }
    if (items.length < 2) {
      setShake((s) => s + 1);
      toast.error("至少选择 2 件装备才能开始对比");
      return;
    }
    track("compare_open", { product_ids: items.map((i) => i.id), source: "compare" });
    router.push("/compare");
  };

  return (
    <div
      key={shake}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 border-t border-foreground bg-background/97 backdrop-blur",
        shake ? "animate-dock-shake" : "animate-dock-rise",
      )}
    >
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-8">
        <div className="hidden shrink-0 flex-col sm:flex">
          <span className="mono-label flex items-center gap-1.5 text-foreground">
            <Scale size={13} strokeWidth={1.6} />
            对比坞
          </span>
          <span className="mono-data mt-1 text-[12px] text-muted-foreground tnum">
            {items.length} / {DOCK_MAX}
          </span>
        </div>

        <div className="thin-scroll flex flex-1 items-center gap-2 overflow-x-auto">
          {items.map((g) => (
            <div key={g.id} className="group relative flex shrink-0 items-center gap-2 border border-border bg-card py-1.5 pr-6 pl-1.5">
              <Link href={`/gear/${g.id}`} className="flex items-center gap-2">
                <img src={g.hero} alt="" className="h-9 w-9 object-cover" loading="lazy" />
                <span className="max-w-28 sm:max-w-40">
                  <span className="mono-label block truncate">{g.brand}</span>
                  <span className="mono-data block truncate text-[12px]">{g.model}</span>
                </span>
              </Link>
              <button
                type="button"
                onClick={() => removeFromDock(g.id)}
                aria-label={`移出 ${g.model}`}
                className="absolute top-0 right-0 p-1 text-muted-foreground hover:text-destructive"
              >
                <X size={12} strokeWidth={1.8} />
              </button>
            </div>
          ))}
          {Array.from({ length: Math.max(0, DOCK_MAX - items.length) }, (_, i) => (
            <div
              key={`slot-${i}`}
              className="hidden h-12 w-24 shrink-0 border border-dashed border-border sm:block"
              aria-hidden
            />
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => {
              clearDock();
              toast("对比坞已清空");
            }}
            aria-label="清空对比坞"
            className="hidden border border-border p-2 text-muted-foreground transition-colors hover:border-foreground hover:text-foreground sm:block"
          >
            <Trash2 size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            onClick={start}
            className="mono-label bg-foreground px-4 py-2.5 text-background transition-colors hover:bg-primary"
          >
            开始对比
          </button>
        </div>
      </div>
      <span className="sr-only">{me.sessionKey ? "已登录" : "游客模式"}</span>
    </div>
  );
}
