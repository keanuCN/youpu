"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[58dvh] max-w-3xl items-center px-5 py-16 sm:px-8">
      <div className="w-full border-y border-destructive/60 py-10 sm:py-14">
        <p className="mono-label text-destructive">500 / TEMPORARY ERROR</p>
        <h1 className="mt-4 max-w-xl text-[34px] leading-tight font-medium tracking-tight sm:text-[46px]">
          页面暂时没读出来。
        </h1>
        <p className="mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          这通常是一次临时的网络或服务异常。可以先重新加载当前页面；如果仍然失败，再回到首页继续浏览。
        </p>
        <div className="mt-9 flex flex-wrap gap-3 border-t border-border pt-5">
          <button
            type="button"
            onClick={() => reset()}
            className="mono-label flex items-center gap-2 bg-foreground px-5 py-3 text-background transition-colors hover:bg-primary"
          >
            <RefreshCw size={14} strokeWidth={1.6} /> 重新加载
          </button>
          <Link
            href="/"
            className="mono-label border border-foreground px-5 py-3 transition-colors hover:bg-foreground hover:text-background"
          >
            回到首页
          </Link>
        </div>
      </div>
    </main>
  );
}
