"use client";

import Link from "next/link";
import { useState } from "react";
import { Bell, Heart, Scale, Star, User } from "lucide-react";
import { toast } from "sonner";
import { GearRow } from "@/components/gear/gear-card";
import { ScoreMark, Stars } from "@/components/gear/primitives";
import { Avatar } from "@/components/layout/site-header";
import { PageHead } from "@/components/layout/section-head";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getGear } from "@/data/boards";
import { cloudLogout, cloudUpdateMe, hasCloudSession } from "@/lib/api";
import { SEASON } from "@/data/categories";
import { helpfulOf, reviewsByUser } from "@/lib/domain";
import { fmtDate, timeAgo } from "@/lib/format";
import {
  deleteNotification,
  deleteReview,
  isStorageAvailable,
  logout,
  markAllRead,
  markNotificationRead,
  setDock,
  updateProfile,
  useCurrentUser,
  usePersisted,
} from "@/lib/store";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "fav", label: "我的收藏", icon: Heart },
  { key: "cmp", label: "对比记录", icon: Scale },
  { key: "rev", label: "我的评论", icon: Star },
  { key: "quiz", label: "我的问卷", icon: User },
  { key: "note", label: "通知", icon: Bell },
  { key: "profile", label: "资料设置", icon: User },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MePage() {
  const persisted = usePersisted();
  const me = useCurrentUser();
  const profile = me.profile;
  const [tab, setTab] = useState<TabKey>("fav");

  if (!profile) {
    return (
      <div className="mx-auto max-w-[720px] px-5 py-16 text-center sm:px-8">
        <p className="mono-label text-primary">ACCOUNT REQUIRED</p>
        <h1 className="mt-4 text-[32px] leading-tight font-medium tracking-tight">个人中心需要登录</h1>
        <p className="mx-auto mt-4 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          收藏、对比记录、我的评论与通知都绑定在账号上。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/auth" className="mono-label bg-foreground px-6 py-3 text-background hover:bg-primary">
            登录 / 注册
          </Link>
          <Link href="/browse/snowboard" className="mono-label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background">
            先随便看看
          </Link>
        </div>
        <div className="mt-12 border border-dashed border-border p-5 text-left">
          <p className="mono-label mb-2">游客模式下你依然可以</p>
          <ul className="mono-label space-y-1.5 text-foreground/70">
            <li>· 使用对比坞（最多 4 件）</li>
            <li>· 浏览全部档案、参数表、雷达图与社区实测</li>
            <li>· 做选装备问卷并查看匹配结果</li>
          </ul>
        </div>
      </div>
    );
  }

  const favIds = me.favoriteIds;
  const favs = favIds.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g);
  const history = persisted.history.filter((h) => h.userKey === profile.userKey);
  const myReviews = reviewsByUser(persisted, profile.userKey);
  const myQuiz = persisted.quiz.filter((q) => q.userKey === profile.userKey);
  const notes = [...me.notifications].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const votes = me.votes;

  const counts: Record<TabKey, number> = {
    fav: favs.length,
    cmp: history.length,
    rev: myReviews.length,
    quiz: myQuiz.length,
    note: notes.filter((n) => !n.read).length,
    profile: 0,
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10 sm:px-8">
      <PageHead
        kicker={`MEMBER SINCE ${fmtDate(persisted.accounts.find((a) => a.userKey === profile.userKey)?.createdAt ?? new Date().toISOString())}`}
        title={profile.username}
        titleEn="Personal Archive"
        desc={`${profile.level} · ${profile.years} 年雪龄 · ${profile.heightCm}cm / ${profile.weightKg}kg${profile.resort ? ` · 常滑 ${profile.resort}` : ""}`}
        aside={
          <div className="flex items-center gap-4">
            <Avatar seed={profile.avatarSeed} name={profile.username} size={56} />
            <div className="text-right">
              <p className="mono-data text-[26px] leading-none tnum">{favIds.length + myReviews.length + votes.length}</p>
              <p className="mono-label mt-1.5">条本地记录</p>
            </div>
          </div>
        }
      />

      {!isStorageAvailable() ? (
        <p className="mono-label mt-6 border border-destructive px-4 py-3 text-destructive">
          浏览器存储不可用（可能是隐私模式），本次操作不会被保存。
        </p>
      ) : null}

      <div className="thin-scroll mt-8 flex gap-1.5 overflow-x-auto border-b border-foreground pb-3">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cn(
                "mono-label flex shrink-0 items-center gap-1.5 border px-3.5 py-2 transition-colors",
                tab === t.key ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground",
              )}
            >
              <Icon size={13} strokeWidth={1.6} />
              {t.label}
              {counts[t.key] ? <span className="mono-data tnum">· {counts[t.key]}</span> : null}
            </button>
          );
        })}
      </div>

      <div className="mt-8">
        {tab === "fav" ? (
          favs.length ? (
            <div className="border border-border px-4">
              {favs.map((g) => (
                <GearRow key={g.id} gear={g} from="list" />
              ))}
            </div>
          ) : (
            <Empty text="还没有收藏。在任意装备卡上点心形即可加入收藏。" cta={{ label: "去档案库", href: "/browse/snowboard" }} />
          )
        ) : null}

        {tab === "cmp" ? (
          history.length ? (
            <ul className="space-y-3">
              {history.map((h) => {
                const items = h.gearIds.map((id) => getGear(id)).filter((g): g is NonNullable<typeof g> => !!g);
                return (
                  <li key={h.id} className="border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <p className="mono-label">
                        {timeAgo(h.createdAt)} · {items.length} 件对比
                      </p>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDock(h.gearIds);
                            toast.success("已载入对比坞");
                          }}
                          className="mono-label border border-border px-3 py-1.5 hover:border-foreground"
                        >
                          载入对比坞
                        </button>
                        <Link href="/compare" className="mono-label bg-foreground px-3 py-1.5 text-background hover:bg-primary">
                          重新对比
                        </Link>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {items.map((g) => (
                        <Link
                          key={g.id}
                          href={`/gear/${g.id}`}
                          className="flex items-center gap-2 border border-border p-1.5 pr-3 hover:border-foreground"
                        >
                          <img src={g.hero} alt="" className="h-9 w-9 object-cover grayscale" loading="lazy" />
                          <span className="min-w-0">
                            <span className="mono-label block truncate">{g.brand}</span>
                            <span className="mono-data block max-w-32 truncate text-[12px]">{g.model}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty text="还没有对比记录。把 2 件以上装备加入对比坞并开始对比后会自动存档。" cta={{ label: "去档案库", href: "/browse/snowboard" }} />
          )
        ) : null}

        {tab === "rev" ? (
          myReviews.length ? (
            <ul className="space-y-3">
              {myReviews.map((r) => {
                const g = getGear(r.gearId);
                return (
                  <li key={r.id} className="border border-border p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <Stars value={r.rating} size={12} />
                        <Link href={`/gear/${r.gearId}`} className="mono-label story-link text-primary">
                          {g ? `${g.brand} ${g.model}` : r.gearId}
                        </Link>
                        {r.parentId ? <span className="mono-label">回复</span> : null}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono-label">
                          {timeAgo(r.createdAt)} · {helpfulOf(persisted, r)} 有帮助
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            deleteReview(r.id);
                            toast("评论已删除");
                          }}
                          className="mono-label text-muted-foreground hover:text-destructive"
                        >
                          删除
                        </button>
                      </div>
                    </div>
                    <p className="mt-2.5 line-clamp-3 text-[13px] leading-relaxed">{r.content}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <Empty text="还没有发布过实测评论。" cta={{ label: "去找一件装备评价", href: "/browse/snowboard" }} />
          )
        ) : null}

        {tab === "quiz" ? (
          myQuiz.length ? (
            <ul className="space-y-4">
              {myQuiz.map((q) => (
                <li key={q.id} className="border border-border p-4">
                  <p className="mono-label">
                    {timeAgo(q.createdAt)} · {q.categorySlug}
                  </p>
                  <ul className="mt-3 space-y-2">
                    {q.picks.map((p, i) => {
                      const g = getGear(p.gearId);
                      if (!g) return null;
                      return (
                        <li key={p.gearId} className="flex items-center gap-3 border-b border-border pb-2 last:border-0">
                          <span className={cn("mono-data w-6 text-[18px] tnum", i === 0 ? "text-primary" : "text-muted-foreground/40")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <img src={g.hero} alt="" className="h-10 w-10 object-cover grayscale" loading="lazy" />
                          <span className="min-w-0 flex-1">
                            <span className="mono-label block truncate">{g.brand}</span>
                            <Link href={`/gear/${g.id}`} className="block truncate text-[13.5px] font-medium hover:text-primary">
                              {g.model}
                            </Link>
                          </span>
                          <span className="mono-data shrink-0 text-[13px] text-primary tnum">{p.match}%</span>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>
          ) : (
            <Empty text="还没有做过选装备问卷。" cta={{ label: "开始 60 秒问卷", href: "/quiz" }} />
          )
        ) : null}

        {tab === "note" ? (
          notes.length ? (
            <div className="border border-border">
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="mono-label">{notes.filter((n) => !n.read).length} 条未读</span>
                <button type="button" onClick={markAllRead} className="mono-label hover:text-primary">
                  全部标为已读
                </button>
              </div>
              <ul>
                {notes.map((n) => (
                  <li
                    key={n.id}
                    className={cn("flex items-start gap-3 border-b border-border px-4 py-3 last:border-0", !n.read && "bg-primary/[0.04]")}
                  >
                    {!n.read ? <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-primary" /> : <span className="mt-2 h-1.5 w-1.5 shrink-0" />}
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-medium">{n.title}</p>
                      <p className="mt-1 text-[12.5px] leading-relaxed text-muted-foreground">{n.body}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <Link href={n.link} onClick={() => markNotificationRead(n.id)} className="mono-label story-link text-primary">
                          查看
                        </Link>
                        <span className="mono-label">{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteNotification(n.id)}
                      aria-label="删除通知"
                      className="mono-label shrink-0 text-muted-foreground hover:text-destructive"
                    >
                      删除
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Empty text="暂无通知。" />
          )
        ) : null}

        {tab === "profile" ? <ProfileForm /> : null}
      </div>

      <section className="mt-14 border-t border-border pt-6">
        <p className="mono-label mb-3">我的投票 · {SEASON} 雪季</p>
        {votes.length ? (
          <ul className="grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {votes.map((v) => {
              const g = getGear(v.gearId);
              return (
                <li key={`${v.rankKey}-${v.gearId}`} className="flex items-center gap-3 bg-background p-4">
                  <div className="min-w-0 flex-1">
                    <p className="mono-label">{v.rankKey} 榜</p>
                    <p className="mt-1 truncate text-[13.5px] font-medium">{g ? `${g.brand} ${g.model}` : v.gearId}</p>
                  </div>
                  {g ? <ScoreMark value={g.composite} size="sm" /> : null}
                  <span className="mono-label shrink-0">{v.changed ? "已改投" : "首投"}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[13px] text-muted-foreground">
            还没有投票。
            <Link href="/rankings" className="story-link text-primary">
              去榜单投一票
            </Link>
          </p>
        )}
      </section>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-6">
        <p className="mono-label">{me.sessionKey}</p>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            if (hasCloudSession()) void cloudLogout();
            toast("已退出登录");
          }}
          className="mono-label h-8 rounded-none border-border px-4 text-[12px]"
        >
          退出登录
        </Button>
      </div>
    </div>
  );
}

function ProfileForm() {
  const me = useCurrentUser();
  const profile = me.profile;
  const [form, setForm] = useState({
    username: profile?.username ?? "",
    years: profile?.years ?? 1,
    heightCm: profile?.heightCm ?? 175,
    weightKg: profile?.weightKg ?? 70,
    level: profile?.level ?? "中级",
    resort: profile?.resort ?? "",
  });
  if (!profile) return null;

  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div className="space-y-1.5">
      <Label className="mono-label">{label}</Label>
      <Input
        type={type}
        value={String(form[key])}
        onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
        className="h-9 rounded-none border-border text-[13px]"
      />
    </div>
  );

  return (
    <div className="max-w-2xl border border-border p-5">
      <p className="mono-label mb-4 border-b border-border pb-2.5">档案资料 / PROFILE</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {field("username", "昵称")}
        {field("resort", "常滑场地")}
        {field("years", "雪龄（年）", "number")}
        {field("heightCm", "身高 cm", "number")}
        {field("weightKg", "体重 kg", "number")}
        <div className="space-y-1.5">
          <Label className="mono-label">水平</Label>
          <select
            value={form.level}
            onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
            className="h-9 w-full rounded-none border border-border bg-transparent px-2 text-[13px] outline-none focus:border-foreground"
          >
            {["新手", "中级", "进阶", "高阶"].map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>
      </div>
      <p className="mono-label mt-4">登录账号（不可修改）：{profile.phone || profile.email || "未设置"}</p>
      <div className="mt-5 flex gap-2 border-t border-border pt-4">
        <Button
          onClick={async () => {
            updateProfile(form);
            if (hasCloudSession()) {
              try {
                await cloudUpdateMe({
                  nickname: form.username.trim(),
                  riderProfile: {
                    years: Number(form.years) || 1,
                    height: Number(form.heightCm) || 175,
                    weight: Number(form.weightKg) || 70,
                    level: profileLevelToApi(form.level),
                    home_resort: form.resort.trim() || undefined,
                  },
                });
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "云端资料保存失败");
                return;
              }
            }
            toast.success("资料已保存，发布评论时会自动带上这些条件");
          }}
          className="mono-label h-9 rounded-none bg-foreground px-5 text-[12px] hover:bg-primary"
        >
          保存资料
        </Button>
        <p className="mono-label flex items-center text-muted-foreground">这些条件会作为你评论的「使用条件」标注</p>
      </div>
    </div>
  );
}

function profileLevelToApi(level: string): "beginner" | "intermediate" | "advanced" | "expert" {
  if (level === "新手") return "beginner";
  if (level === "进阶") return "advanced";
  if (level === "高阶") return "expert";
  return "intermediate";
}

function Empty({ text, cta }: { text: string; cta?: { label: string; href: string } }) {
  return (
    <div className="border border-dashed border-border py-16 text-center">
      <p className="text-[13.5px] text-muted-foreground">{text}</p>
      {cta ? (
        <Link href={cta.href} className="mono-label mt-5 inline-block bg-foreground px-5 py-2.5 text-background hover:bg-primary">
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}
