"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import { LoginDialog } from "@/components/auth/login-dialog";
import { CompareDock } from "@/components/compare/compare-dock";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { syncCloudSession } from "@/lib/cloud-sync";
import { useCurrentUser } from "@/lib/store";

interface GateValue {
  /** 已登录则执行 action 返回 true；未登录则弹出登录框并挂起 action，返回 false */
  requireAuth: (action: () => void, reason?: string) => boolean;
  loggedIn: boolean;
}

const GateContext = createContext<GateValue>({ requireAuth: () => false, loggedIn: false });

export function useAuthGate(): GateValue {
  return useContext(GateContext);
}

export function AppShell({ children }: { children: ReactNode }) {
  const me = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<string>("");
  const pending = useRef<(() => void) | null>(null);

  useEffect(() => {
    void syncCloudSession();
    const handleFocus = () => void syncCloudSession();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const requireAuth = useCallback(
    (action: () => void, why?: string) => {
      if (me.sessionKey) {
        action();
        return true;
      }
      pending.current = action;
      setReason(why ?? "");
      setOpen(true);
      return false;
    },
    [me.sessionKey],
  );

  const value = useMemo<GateValue>(
    () => ({ requireAuth, loggedIn: !!me.sessionKey }),
    [requireAuth, me.sessionKey],
  );

  const onAuthed = useCallback(() => {
    setOpen(false);
    const fn = pending.current;
    pending.current = null;
    if (fn) window.setTimeout(fn, 60);
  }, []);

  return (
    <GateContext.Provider value={value}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <CompareDock />
        <LoginDialog open={open} onOpenChange={setOpen} onAuthed={onAuthed} reason={reason} />
        <Toaster
          position="bottom-center"
          offset={{ bottom: 96 }}
          toastOptions={{
            style: { borderRadius: 0, fontFamily: "var(--font-mono-stack)", fontSize: 12 },
          }}
        />
      </div>
    </GateContext.Provider>
  );
}
