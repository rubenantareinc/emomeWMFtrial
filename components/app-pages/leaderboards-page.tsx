"use client";

import { Crown, Flame, Trophy } from "lucide-react";
import { LeaderboardTable } from "@/components/leaderboard-table";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { useCoupleStore } from "@/lib/domain/couple-store";

export function LeaderboardsPageContent() {
  const state = useCoupleStore();
  const entries = [
    { id: "you", rank: 1, label: `${state.user.name} + ${state.partner.name}`, archetypePair: "Foundations Pair", score: state.shared.relationshipScore, streak: state.shared.streak, trend: Math.round((state.shared.momentum - 50) / 10), metric: "relationship" },
    { id: "seed1", rank: 2, label: "Noah + Lila", archetypePair: "Signal Pair", score: 77, streak: 11, trend: 1, metric: "relationship" },
    { id: "seed2", rank: 3, label: "Jules + Mina", archetypePair: "Explorer Pair", score: 72, streak: 8, trend: 0, metric: "relationship" }
  ];
  return <div className="space-y-6"><SectionHeading kicker="Leaderboards" title="Weekly couple leagues" description="Sorted by real score + streak from the shared model." /><div className="grid gap-4 md:grid-cols-3"><StatCard label="Current placement" value="#1 this week" icon={<Trophy className="size-4 text-pink-500" />} helper="Relationship score league" /><StatCard label="Top streak" value={`${Math.max(...entries.map((e) => e.streak))} days`} icon={<Flame className="size-4 text-pink-500" />} helper="Highest visible couple" /><StatCard label="Best category" value="Most consistent" icon={<Crown className="size-4 text-pink-500" />} helper="Based on shared streak and completion mix" /></div><LeaderboardTable entries={entries} /></div>;
}
