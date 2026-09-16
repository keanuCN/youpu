"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import { cloudLogin, cloudMe, cloudRegister, cloudResetPassword, WebApiError, saveCloudSession } from "@/lib/api";
import { applyCloudAccount, applyCloudMe, login, mergeGuestDock, register, resetPassword, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "forgot";

const COPY: Record<Mode, { title: string; en: string; desc: string; cta: string }> = {
  login: { title: "登录档案库", en: "Sign In", desc: "登录后收藏、对比记录、评论与投票会绑定到你的账号。", cta: "登录" },
  register: { title: "创建档案账号", en: "Create Account", desc: "只需邮箱与密码。游客期的对比坞会在登录后自动合并。", cta: "创建账号并登录" },
  forgot: { title: "重置密码", en: "Reset Password", desc: "输入注册邮箱与新密码即可重置。", cta: "重置密码" },
};

export default function AuthPage() {
  const router = useRouter();
  const me = useCurrentUser();
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  if (me.sessionKey) {
    return (
      <div className="mx-auto max-w-[620px] px-5 py-20 text-center sm:px-8">
        <p className="mono-label text-primary">ALREADY SIGNED IN</p>
        <h1 className="mt-4 text-[30px] font-medium tracking-tight">你已经登录了</h1>
        <p className="mono-label mt-3">{me.sessionKey}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/me" className="mono-label bg-foreground px-6 py-3 text-background hover:bg-primary">
            进入个人中心
          </Link>
          <Link href="/browse/snowboard" className="mono-label border border-foreground px-6 py-3 hover:bg-foreground hover:text-background">
            继续浏览档案库
          </Link>
        </div>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "register") {
      try {
        const session = await cloudRegister(email, password, username);
        saveCloudSession(session);
        applyCloudAccount(session.account);
        void cloudMe().then(applyCloudMe).catch(() => undefined);
      } catch (error) {
        if (!isNetworkError(error)) {
          setBusy(false);
          return toast.error(errorMessage(error));
        }
        const res = register(email, password, username);
        if (!res.ok) {
          setBusy(false);
          return toast.error(res.message);
        }
      }
      mergeGuestDock();
      toast.success("账号已创建");
      router.push("/me");
      return;
    }
    if (mode === "forgot") {
      try {
        await cloudResetPassword(email, password);
      } catch (error) {
        if (!isNetworkError(error)) {
          setBusy(false);
          return toast.error(errorMessage(error));
        }
        const res = resetPassword(email, password);
        if (!res.ok) {
          setBusy(false);
          return toast.error(res.message);
        }
      }
      toast.success("密码已重置，请登录");
      setMode("login");
      setPassword("");
      setBusy(false);
      return;
    }
    try {
      const session = await cloudLogin(email, password);
      saveCloudSession(session);
      applyCloudAccount(session.account);
      void cloudMe().then(applyCloudMe).catch(() => undefined);
    } catch (error) {
      if (!isNetworkError(error) && !(error instanceof WebApiError && error.status === 401 && email.trim().toLowerCase() === BRAND.demoEmail)) {
        setBusy(false);
        return toast.error(errorMessage(error));
      }
      const res = login(email, password);
      if (!res.ok) {
        setBusy(false);
        return toast.error(res.message);
      }
    }
    mergeGuestDock();
    toast.success("登录成功");
    router.push("/me");
  };

  const c = COPY[mode];

  return (
    <div className="mx-auto grid max-w-[1100px] gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_420px]">
      <div>
        <p className="mono-label text-primary">{BRAND.nameEn.toUpperCase()} ACCOUNT</p>
        <h1 className="mt-4 text-[38px] leading-[1.1] font-medium tracking-tight sm:text-[46px]">
          一个账号，
          <br />
          <span className="serif-display text-primary">记住你的每一次对比。</span>
        </h1>
        <p className="mt-5 max-w-md text-[13.5px] leading-relaxed text-muted-foreground">
          收藏、对比历史、实测评论、榜单投票与问卷结果都会绑定到账号。
          未登录也能用对比坞和问卷，登录后游客期的对比坞会自动合并进来。
        </p>

        <ul className="mt-8 space-y-3 border-t border-border pt-6">
          {[
            ["01", "跨页面保留对比坞", "最多 4 件，浏览到哪儿都跟着你"],
            ["02", "评论必须带使用条件", "雪龄 / 体重 / 场地，让评价可被参照"],
            ["03", "榜单每人一票可改投一次", "改投后锁定，避免刷票"],
            ["04", "通知只发与你相关的", "被回复、被标记有帮助、收藏装备有新实测"],
          ].map(([n, t, d]) => (
            <li key={n} className="flex gap-4">
              <span className="mono-data shrink-0 text-[12px] text-primary tnum">{n}</span>
              <span>
                <span className="block text-[13.5px] font-medium">{t}</span>
                <span className="mono-label mt-1 block">{d}</span>
              </span>
            </li>
          ))}
        </ul>

        <p className="mono-label mt-8 border border-dashed border-border p-4 leading-relaxed">
          本地 API 已接入账号与内容数据；清除浏览器令牌后需要重新登录。
        </p>
      </div>

      <div className="border border-foreground">
        <div className="flex border-b border-foreground">
          {(["login", "register", "forgot"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMode(m);
                setPassword("");
              }}
              className={cn(
                "mono-label flex-1 py-3 transition-colors",
                mode === m ? "bg-foreground text-background" : "hover:bg-accent",
              )}
            >
              {m === "login" ? "登录" : m === "register" ? "注册" : "找回密码"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4 p-6">
          <div>
            <h2 className="text-[22px] leading-none font-medium tracking-tight">{c.title}</h2>
            <p className="mono-label mt-2">{c.en}</p>
            <p className="mt-3 text-[12.5px] leading-relaxed text-muted-foreground">{c.desc}</p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="email" className="mono-label">
              邮箱
            </Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9 rounded-none border-border text-[13px]"
            />
          </div>

          {mode === "register" ? (
            <div className="space-y-1.5">
              <Label htmlFor="username" className="mono-label">
                昵称（可选）
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="例如：刃上有风"
                className="h-9 rounded-none border-border text-[13px]"
              />
            </div>
          ) : null}

          <div className="space-y-1.5">
            <Label htmlFor="password" className="mono-label">
              {mode === "forgot" ? "新密码" : "密码"}
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              className="h-9 rounded-none border-border text-[13px]"
            />
          </div>

          <Button type="submit" disabled={busy} className="h-10 w-full rounded-none bg-foreground text-[13px] tracking-wide hover:bg-primary">
            {c.cta}
          </Button>

          <div className="border-t border-border pt-4">
            <p className="mono-label mb-2">演示账号</p>
            <div className="flex items-center justify-between gap-3 bg-secondary/60 px-3 py-2.5">
              <div className="min-w-0">
                <p className="mono-data truncate text-[12px]">{BRAND.demoEmail}</p>
                <p className="mono-data truncate text-[12px] text-muted-foreground">{BRAND.demoPassword}</p>
              </div>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setMode("login");
                  setEmail(BRAND.demoEmail);
                  setPassword(BRAND.demoPassword);
                }}
                className="h-7 shrink-0 rounded-none text-[12px]"
              >
                一键填入
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function isNetworkError(error: unknown): boolean {
  return error instanceof WebApiError && error.status === 0;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "请求失败，请稍后重试";
}
