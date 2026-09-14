"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BRAND } from "@/lib/brand";
import { login, mergeGuestDock, register, resetPassword } from "@/lib/store";
import { cn } from "@/lib/utils";

type Mode = "login" | "register" | "forgot";

const MODE_TITLE: Record<Mode, string> = {
  login: "登录档案库",
  register: "创建档案账号",
  forgot: "重置密码",
};

/**
 * 登录 / 注册 / 找回密码弹窗（原型：账号与凭据摘要均保存在本机浏览器，不上传任何服务器）
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
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (open) {
      setMode("login");
      setPassword("");
      setBusy(false);
    }
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    if (mode === "register") {
      const res = register(email, password, username);
      if (!res.ok) {
        toast.error(res.message);
        setBusy(false);
        return;
      }
      mergeGuestDock();
      toast.success("账号已创建，游客期的对比坞已合并");
      onAuthed();
      return;
    }
    if (mode === "forgot") {
      const res = resetPassword(email, password);
      if (!res.ok) {
        toast.error(res.message);
        setBusy(false);
        return;
      }
      toast.success("密码已重置，请用新密码登录");
      setMode("login");
      setPassword("");
      setBusy(false);
      return;
    }
    const res = login(email, password);
    if (!res.ok) {
      toast.error(res.message);
      setBusy(false);
      return;
    }
    mergeGuestDock();
    toast.success("登录成功");
    onAuthed();
  };

  const fillDemo = () => {
    setMode("login");
    setEmail(BRAND.demoEmail);
    setPassword(BRAND.demoPassword);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[420px] gap-0 overflow-hidden rounded-none border-foreground p-0">
        <div className="border-b border-foreground bg-secondary/50 px-6 py-4">
          <DialogHeader className="space-y-1 text-left">
            <DialogTitle className="text-[20px] tracking-tight">{MODE_TITLE[mode]}</DialogTitle>
            <DialogDescription className="mono-label pt-1">
              {reason || `${BRAND.nameEn.toUpperCase()} · LOCAL PROTOTYPE ACCOUNT`}
            </DialogDescription>
          </DialogHeader>
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
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-9 rounded-none border-border text-[13px]"
            />
          </div>

          {mode === "register" ? (
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
              {mode === "forgot" ? "新密码" : "密码"}
            </Label>
            <Input
              id="auth-pwd"
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

          <Button
            type="submit"
            disabled={busy}
            className="h-10 w-full rounded-none bg-foreground text-[13px] font-medium tracking-wide hover:bg-primary"
          >
            {mode === "login" ? "登录" : mode === "register" ? "创建账号并登录" : "重置密码"}
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            {mode === "login" ? (
              <>
                <button type="button" onClick={() => setMode("register")} className="mono-label story-link hover:text-primary">
                  没有账号？注册
                </button>
                <button type="button" onClick={() => setMode("forgot")} className="mono-label story-link hover:text-primary">
                  忘记密码
                </button>
              </>
            ) : (
              <button type="button" onClick={() => setMode("login")} className="mono-label story-link hover:text-primary">
                返回登录
              </button>
            )}
          </div>

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
              账号与收藏保存在本机浏览器，
              <Link href="/me" className="story-link ml-1" onClick={() => onOpenChange(false)}>
                个人中心
              </Link>
              可随时查看。
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
