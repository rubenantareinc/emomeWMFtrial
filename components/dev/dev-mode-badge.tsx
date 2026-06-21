"use client";

import { DEV_MODE, DB_BYPASS, AUTH_BYPASS, STRIPE_BYPASS, SIMULATE_PARTNER } from "@/lib/constants";

export function DevModeBadge() {
  if (!DEV_MODE) return null;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-3 py-1 text-xs font-bold text-fuchsia-800">
      DEV MODE
      <span className="text-[10px] font-semibold text-fuchsia-700/80">
        {AUTH_BYPASS ? "AUTH" : ""} {DB_BYPASS ? "DB" : ""} {STRIPE_BYPASS ? "STRIPE" : ""} {SIMULATE_PARTNER ? "PARTNER" : ""}
      </span>
    </div>
  );
}
