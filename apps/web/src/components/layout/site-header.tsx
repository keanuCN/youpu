"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, ChevronDown, LayoutGrid, Menu, Search, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { GEAR } from "@/data/boards";
import { BRAND } from "@/lib/brand";
import { DEFAULT_FILTERS, applyFilters } from "@/lib/domain";
import { fmtCompact, timeAgo } from "@/lib/format";
import { logout, markAllRead, markNotificationRead, useCurrentUser } from "@/lib/store";
import { track } from "@/lib/track";
import { cn } from "@/lib/utils";
import { CategoryPanel } from "./category-panel";

/**
 * 主导航只放全站级工具，不放具体品类 —— 品类入口统一走「全部品类」下拉
 * （面板由 CATEGORY_TREE 配置驱动，新增品类自动出现，无需改导航）。
 */
const NAV = [
  { label: "榜单", href: "/rankings" },
  { label: "参数对比", href: "/compare" },
  { label: "选装备问卷", href: "/quiz" },
] as const;

export function SiteHeader() {
  const router = useRouter();
  const me = useCurrentUser();
  const profile = me.profile;
  const [q, setQ] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const unread = me.notifications.filter((n) => !n.read).length;

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = () => {
    const query = q.trim();
    if (query) {
      const hits = applyFilters(GEAR, { ...DEFAULT_FILTERS, q: query }).length;
      track("search", { query, hits });
    }
    // TODO(M2)：全局搜索页（GET /api/search）上线前，搜索先落在当前唯一开档品类的档案库
    router.push(`/browse/snowboard${query ? `?q=${encodeURIComponent(query)}` : ""}`);
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-foreground bg-background/95 backdrop-blur-sm">
      {/* 顶部细条 */}
      <div className="hidden border-b border-border lg:block">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-8 py-1.5">
          <p className="mono-label">
            {BRAND.archive} · {BRAND.archiveEn.toUpperCase()}
          </p>
          <p className="mono-label">ISSUE No.42 · 数据更新于本机</p>
        </div>
      </div>

      <div className="mx-auto flex h-14 max-w-[1400px] items-center gap-4 px-5 sm:px-8">
        {/* 移动端菜单 */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="打开菜单">
              <Menu size={18} strokeWidth={1.5} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[86vw] max-w-sm gap-0 overflow-y-auto p-0 sm:max-w-sm">
            <SheetTitle className="sr-only">导航</SheetTitle>
            <div className="border-b border-foreground px-5 py-4">
              <Link href="/" className="serif-display text-2xl">
                {BRAND.name}
              </Link>
            </div>
            <nav className="flex flex-col border-b border-border">
              {NAV.map((n) => (
                <Link
                  key={n.label}
                  href={n.href}
                  className="border-b border-border py-3.5 pl-5 text-[14px] font-medium last:border-0 hover:bg-accent"
                >
                  {n.label}
                </Link>
              ))}
              <Link href="/me" className="border-b border-border py-3.5 pl-5 text-[14px] font-medium hover:bg-accent">
                个人中心
              </Link>
            </nav>
            <CategoryPanel />
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-baseline gap-2">
          <span className="serif-display text-[26px] leading-none">{BRAND.name}</span>
          <span className="mono-label hidden sm:inline">{BRAND.nameEn}</span>
        </Link>

        {/* 桌面导航 */}
        <nav className="ml-2 hidden items-center gap-1 lg:flex">
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 px-3 py-2 text-[13px] font-medium transition-colors hover:text-primary"
              >
                <LayoutGrid size={14} strokeWidth={1.6} />
                全部品类
                <ChevronDown size={13} strokeWidth={1.6} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[min(92vw,860px)] rounded-none border-foreground p-0">
              <CategoryPanel />
            </PopoverContent>
          </Popover>
          {NAV.map((n) => (
            <Link key={n.label} href={n.href} className="story-link px-3 py-2 text-[13px] font-medium">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex-1" />

        {/* 搜索 */}
        <div className="hidden items-center md:flex">
          {searchOpen ? (
            <div className="flex items-center border border-foreground">
              <input
                ref={searchRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") submitSearch();
                  if (e.key === "Escape") setSearchOpen(false);
                }}
                placeholder="搜索品牌 / 型号 / 年款"
                className="mono-data h-8 w-52 bg-transparent px-2.5 text-[12px] outline-none placeholder:text-muted-foreground/60"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="px-2 hover:text-primary" aria-label="关闭搜索">
                <X size={13} strokeWidth={1.6} />
              </button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" className="h-8 w-8" aria-label="搜索" onClick={() => setSearchOpen(true)}>
              <Search size={16} strokeWidth={1.5} />
            </Button>
          )}
        </div>

        {/* 通知 */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="通知">
              <Bell size={16} strokeWidth={1.5} />
              {unread > 0 ? (
                <span className="mono-data absolute top-0.5 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center bg-primary px-[3px] text-[9px] text-primary-foreground tnum">
                  {unread}
                </span>
              ) : null}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-[min(92vw,360px)] rounded-none border-foreground p-0">
            <NotificationList />
          </PopoverContent>
        </Popover>

        {/* 账号 */}
        {profile ? (
          <Popover>
            <PopoverTrigger asChild>
              <button type="button" className="flex items-center gap-2 border border-border px-2 py-1 hover:border-foreground">
                <Avatar seed={profile.avatarSeed} name={profile.username} />
                <span className="mono-label hidden max-w-24 truncate sm:inline">{profile.username}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-56 rounded-none border-foreground p-0">
              <div className="border-b border-border p-3">
                <p className="text-[13px] font-medium">{profile.username}</p>
                <p className="mono-label mt-1">{profile.email}</p>
                <p className="mono-label mt-2 text-foreground/70">
                  {profile.level} · {profile.years} 年雪龄
                </p>
              </div>
              <Link href="/me" className="block border-b border-border px-3 py-2.5 text-[13px] hover:bg-accent">
                个人中心
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="block w-full px-3 py-2.5 text-left text-[13px] hover:bg-accent"
              >
                退出登录
              </button>
            </PopoverContent>
          </Popover>
        ) : (
          <Link
            href="/auth"
            className="mono-label flex items-center gap-1.5 border border-foreground bg-foreground px-3 py-2 text-background transition-colors hover:border-primary hover:bg-primary"
          >
            <User size={13} strokeWidth={1.6} />
            登录
          </Link>
        )}
      </div>

      {/* 移动端搜索条 */}
      <div className="border-t border-border px-5 py-2 md:hidden">
        <div className="flex items-center gap-2 border border-border px-2.5">
          <Search size={14} strokeWidth={1.5} className="text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="搜索品牌 / 型号"
            className="mono-data h-8 flex-1 bg-transparent text-[12px] outline-none placeholder:text-muted-foreground/60"
          />
        </div>
      </div>
    </header>
  );
}

function NotificationList() {
  const me = useCurrentUser();
  const list = [...me.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  if (!me.sessionKey) {
    return (
      <div className="p-5 text-center">
        <p className="text-[13px]">登录后查看回复、有帮助提醒与榜单更新</p>
        <Link href="/auth" className="mono-label mt-3 inline-block border border-foreground px-3 py-1.5 hover:bg-foreground hover:text-background">
          去登录
        </Link>
      </div>
    );
  }

  if (!list.length) {
    return <p className="p-5 text-center text-[13px] text-muted-foreground">暂无通知</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="mono-label">通知 · {list.filter((n) => !n.read).length} 条未读</span>
        <button type="button" onClick={markAllRead} className="mono-label hover:text-primary">
          全部已读
        </button>
      </div>
      <ul className="thin-scroll max-h-80 overflow-y-auto">
        {list.map((n) => (
          <li key={n.id}>
            <Link
              href={n.link}
              onClick={() => markNotificationRead(n.id)}
              className={cn("block border-b border-border px-3 py-2.5 hover:bg-accent", !n.read && "bg-primary/[0.04]")}
            >
              <div className="flex items-center gap-2">
                {!n.read ? <span className="h-1.5 w-1.5 shrink-0 bg-primary" /> : null}
                <p className="flex-1 truncate text-[12.5px] font-medium">{n.title}</p>
                <span className="mono-label shrink-0">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-muted-foreground">{n.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Avatar({ seed, name, size = 24 }: { seed: string; name: string; size?: number }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const hue = h % 360;
  return (
    <span
      className="mono-data flex shrink-0 items-center justify-center font-medium text-background"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.44,
        background: `oklch(0.45 0.09 ${hue})`,
      }}
      aria-hidden
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export { fmtCompact };
