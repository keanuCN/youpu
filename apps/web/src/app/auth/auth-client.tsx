"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import {
  cloudLogin,
  cloudRegister,
  cloudRequestEmailCode,
  cloudResetPassword,
  saveCloudSession,
} from "@/lib/api";
import { syncCloudSession } from "@/lib/cloud-sync";
import { applyCloudAccount, mergeGuestDock, useCurrentUser } from "@/lib/store";
import { cn } from "@/lib/utils";

type EmailMode = "login" | "register" | "forgot";

const COPY: Record<EmailMode, { title: string; en: string; desc: string; cta: string }> = {
  login: { title: "登录档案库", en: "Sign In", desc: "登录后收藏、对比记录、评论与投票会绑定到你的账号。", cta: "登录" },
  register: {
    title: "创建档案账号",
    en: "Create Account",
    desc: "使用邮箱验证码完成验证，再设置密码。游客期的对比坞会在登录后自动合并。",
    cta: "创建账号并登录",
  },
  forgot: {
    title: "重置密码",
    en: "Reset Password",
    desc: "验证码会发送到注册邮箱，验证通过后即可设置新密码。",
    cta: "重置密码",
  },
};

export default function AuthPage() {
  const router = useRouter();
  const me = useCurrentUser();
  const [emailMode, setEmailMode] = useState<EmailMode>("login");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailCooldown, setEmailCooldown] = useState(0);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (emailCooldown <= 0) return;
    const timer = window.setInterval(() => setEmailCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [emailCooldown]);

  const clearEmailCode = () => {
    setCode("");
    setEmailCodeSent(false);
    setEmailCooldown(0);
  };

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

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const requiresCode = emailMode !== "login";
    if (requiresCode && !emailCodeSent) {
      return toast.error("请先获取邮箱验证码");
    }
    setBusy(true);

    if (emailMode === "register") {
      try {
        const session = await cloudRegister(email, password, code, username);
        saveCloudSession(session);
        applyCloudAccount(session.account);
        if ((await syncCloudSession()) === "invalid") {
          setBusy(false);
          return toast.error("登录状态已失效，请重新尝试");
        }
      } catch (error) {
        setBusy(false);
        return toast.error(errorMessage(error));
      }
      mergeGuestDock();
      toast.success("账号已创建");
      router.push("/me");
      return;
    }

    if (emailMode === "forgot") {
      try {
        await cloudResetPassword(email, password, code);
      } catch (error) {
        setBusy(false);
        return toast.error(errorMessage(error));
      }
      toast.success("密码已重置，请登录");
      setEmailMode("login");
      setPassword("");
      clearEmailCode();
      setBusy(false);
      return;
    }

    try {
      const session = await cloudLogin(email, password);
      saveCloudSession(session);
      applyCloudAccount(session.account);
      if ((await syncCloudSession()) === "invalid") {
        setBusy(false);
        return toast.error("登录状态已失效，请重新尝试");
      }
    } catch (error) {
      setBusy(false);
      return toast.error(errorMessage(error));
    }
    mergeGuestDock();
    toast.success("登录成功");
    router.push("/me");
  };

  const sendEmailCode = async () => {
    if (busy || emailCooldown > 0) return;
    const purpose = emailMode === "register" ? "register" : "reset-password";
    setBusy(true);
    try {
      await cloudRequestEmailCode(email, purpose);
      setEmailCodeSent(true);
      setEmailCooldown(60);
      toast.success("验证码已发送，请查收邮箱");
    } catch (error) {
      setBusy(false);
      return toast.error(errorMessage(error));
    }
    setBusy(false);
  };

  const c = COPY[emailMode];

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
          {(["login", "register", "forgot"] as EmailMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setEmailMode(m);
                setPassword("");
                clearEmailCode();
              }}
              className={cn(
                "mono-label flex-1 py-3 transition-colors",
                emailMode === m ? "bg-foreground text-background" : "hover:bg-accent",
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
              onChange={(e) => {
                setEmail(e.target.value);
                clearEmailCode();
              }}
              placeholder="you@example.com"
              className="h-9 rounded-none border-border text-[13px]"
            />
          </div>

          {emailMode !== "login" ? (
            <div className="space-y-1.5">
              <Label htmlFor="email-code" className="mono-label">
                邮箱验证码
              </Label>
              <div className="flex gap-2">
                <Input
                  id="email-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入 6 位验证码"
                  className="h-9 min-w-0 flex-1 rounded-none border-border text-[13px] tracking-[0.2em]"
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={busy || emailCooldown > 0}
                  onClick={sendEmailCode}
                  className="h-9 shrink-0 rounded-none px-3 text-[12px]"
                >
                  {emailCooldown > 0 ? "重新获取 " + emailCooldown + "s" : emailCodeSent ? "重新发送" : "获取验证码"}
                </Button>
              </div>
              <p className="mono-label border border-dashed border-border p-3 leading-relaxed">
                验证码 10 分钟有效。开发和生产环境都必须配置真实邮件服务。
              </p>
            </div>
          ) : null}

          {emailMode === "register" ? (
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
              {emailMode === "forgot" ? "新密码" : "密码"}
            </Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              autoComplete={emailMode === "login" ? "current-password" : "new-password"}
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
                  setEmailMode("login");
                  setEmail(BRAND.demoEmail);
                  setPassword(BRAND.demoPassword);
                  clearEmailCode();
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

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "请求失败，请稍后重试";
}
