"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import {
  cloudLogin,
  cloudMe,
  cloudPhoneLogin,
  cloudRegister,
  cloudRequestPhoneCode,
  cloudResetPassword,
  WebApiError,
  saveCloudSession,
} from "@/lib/api";
import {
  applyCloudAccount,
  applyCloudMe,
  login,
  mergeGuestDock,
  phoneLogin,
  register,
  requestPhoneCode,
  resetPassword,
} from "@/lib/store";
import { cn } from "@/lib/utils";

type Method = "phone" | "email";
type EmailMode = "login" | "register" | "forgot";

const MODE_TITLE: Record<EmailMode, string> = {
  login: "登录档案库",
  register: "创建档案账号",
  forgot: "重置密码",
};

/**
 * 登录 / 注册弹窗：支持手机号验证码和邮箱密码；本地 API 不可用时才回退到浏览器原型状态。
 */
export function LoginDialog({
  open,
  onOpenChange,
  onAuthed,
  reason,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onAuthed: () => void;
  reason?: string;
}) {
  const [method, setMethod] = useState<Method>("phone");
  const [emailMode, setEmailMode] = useState<EmailMode>("login");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [phoneCodeSent, setPhoneCodeSent] = useState(false);
  const [phoneCooldown, setPhoneCooldown] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (phoneCooldown <= 0) return;
    const timer = window.setInterval(() => setPhoneCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [phoneCooldown]);

  useEffect(() => {
    if (open) {
      setMethod("phone");
      setEmailMode("login");
      setPhone("");
      setCode("");
      setPhoneCodeSent(false);
      setPhoneCooldown(0);
      setPassword("");
      setBusy(false);
    }
  }, [open]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (method === "phone") {
      if (!phoneCodeSent) {
        toast.error("请先获取短信验证码");
        setBusy(false);
        return;
      }
      try {
        const session = await cloudPhoneLogin(phone, code);
        saveCloudSession(session);
        applyCloudAccount(session.account);
        void cloudMe().then(applyCloudMe).catch(() => undefined);
      } catch (error) {
        if (!isNetworkError(error)) {
          toast.error(errorMessage(error));
          setBusy(false);
          return;
        }
        const res = phoneLogin(phone, code);
        if (!res.ok) {
          toast.error(res.message);
          setBusy(false);
          return;
        }
      }
      mergeGuestDock();
      toast.success("登录成功，游客期的对比坞已合并");
      onAuthed();
      return;
    }

    if (emailMode === "register") {
      try {
        const session = await cloudRegister(email, password, username);
        saveCloudSession(session);
        applyCloudAccount(session.account);
        void cloudMe().then(applyCloudMe).catch(() => undefined);
      } catch (error) {
        if (!isNetworkError(error)) {
          toast.error(errorMessage(error));
          setBusy(false);
          return;
        }
        const res = register(email, password, username);
        if (!res.ok) {
          toast.error(res.message);
          setBusy(false);
          return;
        }
      }
      mergeGuestDock();
      toast.success("账号已创建，游客期的对比坞已合并");
      onAuthed();
      return;
    }
    if (emailMode === "forgot") {
      try {
        await cloudResetPassword(email, password);
      } catch (error) {
        if (!isNetworkError(error)) {
          toast.error(errorMessage(error));
          setBusy(false);
          return;
        }
        const res = resetPassword(email, password);
        if (!res.ok) {
          toast.error(res.message);
          setBusy(false);
          return;
        }
      }
      toast.success("密码已重置，请用新密码登录");
      setEmailMode("login");
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
        toast.error(errorMessage(error));
        setBusy(false);
        return;
      }
      const res = login(email, password);
      if (!res.ok) {
        toast.error(res.message);
        setBusy(false);
        return;
      }
    }
    mergeGuestDock();
    toast.success("登录成功");
    onAuthed();
  };

  const sendPhoneCode = async () => {
    if (busy || phoneCooldown > 0) return;
    setBusy(true);
    try {
      const result = await cloudRequestPhoneCode(phone);
      setCode(result.devCode ?? "");
      setPhoneCodeSent(true);
      setPhoneCooldown(60);
      toast.success(result.devCode ? `本地验证码：${result.devCode}` : "验证码已发送");
    } catch (error) {
      if (!isNetworkError(error)) {
        toast.error(errorMessage(error));
        setBusy(false);
        return;
      }
      const result = requestPhoneCode(phone);
      if (!result.ok) {
        toast.error(result.message);
        setBusy(false);
        return;
      }
      setCode(result.devCode);
      setPhoneCodeSent(true);
      setPhoneCooldown(60);
      toast.success(`本地验证码：${result.devCode}`);
    }
    setBusy(false);
  };

  const fillDemo = () => {
    setMethod("email");
    setEmailMode("login");
    setEmail(BRAND.demoEmail);
    setPassword(BRAND.demoPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-0 overflow-hidden rounded-none border-foreground p-0">
        <div className="border-b border-foreground bg-secondary/50 px-6 py-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[20px] tracking-tight">{method === "phone" ? "手机号登录" : MODE_TITLE[emailMode]}</DialogTitle>
            <DialogDescription className="mono-label pt-1">
              {reason || (method === "phone" ? "验证码登录，首次验证后自动创建账号" : `${BRAND.nameEn.toUpperCase()} · LOCAL ACCOUNT`)}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex border-b border-foreground">
          {(["phone", "email"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => {
                setMethod(m);
                setPassword("");
                setPhoneCodeSent(false);
                setCode("");
                setPhoneCooldown(0);
              }}
              className={cn(
                "mono-label flex-1 py-3 transition-colors",
                method === m ? "bg-foreground text-background" : "hover:bg-accent",
              )}
            >
              {m === "phone" ? "手机号登录" : "邮箱注册 / 登录"}
            </button>
          ))}
        </div>

        {method === "email" ? (
          <div className="flex border-b border-border">
            {(["login", "register", "forgot"] as EmailMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setEmailMode(m);
                  setPassword("");
                }}
                className={cn(
                  "mono-label flex-1 py-2.5 transition-colors",
                  emailMode === m ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {m === "login" ? "登录" : m === "register" ? "注册" : "找回密码"}
              </button>
            ))}
          </div>
        ) : null}

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
          {method === "phone" ? (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="auth-phone" className="mono-label">
                  手机号
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="auth-phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setPhoneCodeSent(false);
                      setCode("");
                    }}
                    placeholder="请输入 11 位手机号"
                    className="h-9 min-w-0 flex-1 rounded-none border-border text-[13px]"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={busy || phoneCooldown > 0}
                    onClick={sendPhoneCode}
                    className="h-9 shrink-0 rounded-none px-3 text-[12px]"
                  >
                    {phoneCooldown > 0 ? `重新获取 ${phoneCooldown}s` : phoneCodeSent ? "重新获取验证码" : "获取验证码"}
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="auth-phone-code" className="mono-label">
                  短信验证码
                </Label>
                <Input
                  id="auth-phone-code"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="请输入 6 位验证码"
                  className="h-9 rounded-none border-border text-[13px] tracking-[0.2em]"
                />
              </div>
              <p className="mono-label border border-dashed border-border p-3 leading-relaxed">
                本地开发环境会自动填入验证码；上线后改由短信服务投递。
              </p>
            </>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="auth-email" className="mono-label">
                  邮箱
                </Label>
                <Input
                  id="auth-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="h-9 rounded-none border-border text-[13px]"
                />
              </div>

              {emailMode === "register" ? (
                <div className="space-y-1.5">
                  <Label htmlFor="auth-name" className="mono-label">
                    昵称（可选）
                  </Label>
                  <Input
                    id="auth-name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="例如：刃上有风"
                    className="h-9 rounded-none border-border text-[13px]"
                  />
                </div>
              ) : null}

              <div className="space-y-1.5">
                <Label htmlFor="auth-pwd" className="mono-label">
                  {emailMode === "forgot" ? "新密码" : "密码"}
                </Label>
                <Input
                  id="auth-pwd"
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
            </>
          )}

          <Button
            type="submit"
            disabled={busy}
            className="h-10 w-full rounded-none bg-foreground text-[13px] font-medium tracking-wide hover:bg-primary"
          >
            {method === "phone" ? "手机号登录" : emailMode === "login" ? "登录" : emailMode === "register" ? "创建账号并登录" : "重置密码"}
          </Button>

          {method === "email" ? (
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              {emailMode === "login" ? (
                <>
                  <button type="button" onClick={() => setEmailMode("register")} className="mono-label story-link hover:text-primary">
                    没有账号？注册
                  </button>
                  <button type="button" onClick={() => setEmailMode("forgot")} className="mono-label story-link hover:text-primary">
                    忘记密码
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setEmailMode("login")} className="mono-label story-link hover:text-primary">
                  返回登录
                </button>
              )}
            </div>
          ) : null}

          {method === "email" ? (
            <div className={cn("border-t border-border pt-4")}>
              <p className="mono-label mb-2">演示账号</p>
              <div className="flex items-center justify-between gap-3 bg-secondary/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="mono-data truncate text-[12px]">{BRAND.demoEmail}</p>
                  <p className="mono-data truncate text-[12px] text-muted-foreground">{BRAND.demoPassword}</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={fillDemo} className="h-7 shrink-0 rounded-none text-[12px]">
                  一键填入
                </Button>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                本地 API 已接入账号与收藏，
                <Link href="/me" className="story-link ml-1" onClick={() => onOpenChange(false)}>
                  个人中心
                </Link>
                可随时查看。
              </p>
            </div>
          ) : null}
        </form>
      </DialogContent>
    </Dialog>
  );
}

function isNetworkError(error: unknown): boolean {
  return error instanceof WebApiError && error.status === 0;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "请求失败，请稍后重试";
}
