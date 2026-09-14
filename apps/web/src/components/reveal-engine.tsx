"use client";

import { useEffect } from "react";
import { initRevealEngine } from "@/lib/reveal-engine";

/** 全局滚动渐入引擎挂载点（业务元素加 class="reveal" 即可，详见 lib/reveal-engine.ts） */
export function RevealEngine() {
  useEffect(() => {
    initRevealEngine();
  }, []);
  return null;
}
