"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCoupleStore } from "@/lib/domain/couple-store";

export function ShopPageContent() {
  const state = useCoupleStore();
  const [msg, setMsg] = useState("");
  const buy = (cost: number, reward: "hearts" | "streakShield") => {
    const ok = state.spendEmbers(cost, reward);
    setMsg(ok ? `Purchased ${reward === "hearts" ? "heart refill" : "streak shield"}.` : "Not enough embers.");
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-pink-500">Shop</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-zinc-900">Shop & upgrades</h1>
        <p className="text-sm text-zinc-600">Economy tied to real activity rewards.</p>
      </div>
      <Card><CardHeader><CardTitle>Balance</CardTitle></CardHeader><CardContent className="text-sm">{state.shared.embers} embers • {state.shared.hearts} hearts • {state.streakShield} streak shields</CardContent></Card>
      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader><CardTitle>Refill Hearts</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p>+1 heart (up to 5).</p><Button onClick={() => buy(120, "hearts")}>Buy for 120 embers</Button></CardContent></Card>
        <Card><CardHeader><CardTitle>Streak Shield</CardTitle></CardHeader><CardContent className="space-y-3 text-sm"><p>Protect one missed day.</p><Button onClick={() => buy(210, "streakShield")}>Buy for 210 embers</Button></CardContent></Card>
      </div>
      {msg ? <p className="text-sm font-medium text-rose-600">{msg}</p> : null}
    </div>
  );
}
