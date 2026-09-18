import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[58dvh] max-w-3xl items-center px-5 py-16 sm:px-8">
      <div className="w-full border-y border-foreground py-10 sm:py-14">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-xl">
            <p className="mono-label text-primary">404 / ARCHIVE NOT FOUND</p>
            <h1 className="mt-4 text-[34px] leading-tight font-medium tracking-tight sm:text-[46px]">
              这条装备档案
              <br />
              暂时找不到。
            </h1>
            <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
              链接可能已经变更，或者这件装备还没有进入有谱档案库。你可以回到入口重新选择品类。
            </p>
          </div>
          <p className="mono-data text-[64px] leading-none text-primary/25 tnum" aria-hidden="true">
            404
          </p>
        </div>

        <div className="mt-9 flex flex-wrap gap-3 border-t border-border pt-5">
          <Link
            href="/"
            className="mono-label flex items-center gap-2 bg-foreground px-5 py-3 text-background transition-colors hover:bg-primary"
          >
            回到首页 <ArrowRight size={14} strokeWidth={1.6} />
          </Link>
          <Link
            href="/browse/snowboard"
            className="mono-label flex items-center gap-2 border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            <Compass size={14} strokeWidth={1.6} /> 浏览档案库
          </Link>
        </div>
      </div>
    </main>
  );
}
