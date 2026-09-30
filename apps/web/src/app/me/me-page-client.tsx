"use client";

import { useSearchParams } from "next/navigation";
import MeClient from "./me-client";

export default function MePageClient() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") === "profile" ? "profile" : undefined;
  return <MeClient initialTab={initialTab} />;
}
