"use client";

import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import {
  applyCloudAccount,
  mergeGuestDock,
} from "@/lib/store";
import { syncCloudSession } from "@/lib/cloud-sync";
import { cn } from "@/lib/utils";

type EmailMode = "login" | "register" | "forgot";

const MODE_TITLE: Record<EmailMode, string> = {
  login: "登录档案库",
  register: "创建档案账号",
  forgot: "重置密码",
};

/**
 * 登录 / 注册弹窗：仅支持邮箱密码；注册和找回密码需要邮箱验证码。
 * 所有账号操作都通过 API，验证码必须由真实邮件服务投递。
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

  useEffect(() => {
    if (open) {
      setEmailMode("login");
      setCode("");
      setEmailCodeSent(false);
      setEmailCooldown(0);
      setPassword("");
      setBusy(false);
    }
  }, [open]);

  const clearEmailCode = () => {
    setCode("");
    setEmailCodeSent(false);
    setEmailCooldown(0);
  };

  const changeMode = (mode: EmailMode) => {
    setEmailMode(mode);
    setPassword("");
    clearEmailCode();
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const requiresCode = emailMode !== "login";
    if (requiresCode && !emailCodeSent) {
      toast.error("请先获取邮箱验证码");
      return;
    }
    setBusy(true);

    if (emailMode === "register") {
      try {
        const session = await cloudRegister(email, password, code, username);
        saveCloudSession(session);
        applyCloudAccount(session.account);
        void syncCloudSession();
      } catch (error) {
        toast.error(errorMessage(error));
        setBusy(false);
        return;
      }
      mergeGuestDock();
      toast.success("账号已创建，游客期的对比坞已合并");
      onAuthed();
      return;
    }

    if (emailMode === "forgot") {
      try {
        await cloudResetPassword(email, password, code);
      } catch (error) {
        toast.error(errorMessage(error));
        setBusy(false);
        return;
      }
      toast.success("密码已重置，请用新密码登录");
      changeMode("login");
      setBusy(false);
      return;
    }

    try {
      const session = await cloudLogin(email, password);
      saveCloudSession(session);
      applyCloudAccount(session.account);
      void syncCloudSession();
    } catch (error) {
      toast.error(errorMessage(error));
      setBusy(false);
      return;
    }
    mergeGuestDock();
    toast.success("登录成功");
    onAuthed();
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
      toast.error(errorMessage(error));
      setBusy(false);
      return;
    }
    setBusy(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-0 overflow-hidden rounded-none border-foreground p-0">
        <div className="border-b border-foreground bg-secondary/50 px-6 py-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[20px] tracking-tight">{MODE_TITLE[emailMode]}</DialogTitle>
            <DialogDescription className="mono-label pt-1">
              {reason || BRAND.nameEn.toUpperCase() + " · EMAIL ACCOUNT"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="flex border-b border-foreground">
          {(["login", "register", "forgot"] as EmailMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => changeMode(m)}
              className={cn(
                "mono-label flex-1 py-3 transition-colors",
                emailMode === m ? "bg-foreground text-background" : "hover:bg-accent",
              )}
            >
              {m === "login" ? "登录" : m === "register" ? "注册" : "找回密码"}
            </button>
          ))}
        </div>

        <form onSubmit={submit} className="space-y-4 px-6 py-5">
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
              <Label htmlFor="auth-email-code" className="mono-label">
                邮箱验证码
              </Label>
              <div className="flex gap-2">
                <Input
                  id="auth-email-code"
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

          <Button
            type="submit"
            disabled={busy}
            className="h-10 w-full rounded-none bg-foreground text-[13px] font-medium tracking-wide hover:bg-primary"
          >
            {emailMode === "login" ? "登录" : emailMode === "register" ? "创建账号并登录" : "重置密码"}
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {emailMode === "login" ? (
              <>
                <button type="button" onClick={() => changeMode("register")} className="mono-label story-link hover:text-primary">
                  没有账号？注册
                </button>
                <button type="button" onClick={() => changeMode("forgot")} className="mono-label story-link hover:text-primary">
                  忘记密码
                </button>
              </>
            ) : (
              <button type="button" onClick={() => changeMode("login")} className="mono-label story-link hover:text-primary">
                返回登录
              </button>
            )}
          </div>

        </form>
      </DialogContent>
    </Dialog>
  );
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "请求失败，请稍后重试";
}
