"use client";

import { Sparkles, Trophy } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useCoupleStore } from "@/lib/domain/couple-store";

export function QuestsPageContent() {
  const state = useCoupleStore();
  const reflectCount = state.events.filter((e) => e.activityType === "reflect").length;
  const appreciationCount = state.events.filter((e) => e.activityType === "appreciation_drop").length;
  const repairCount = state.events.filter((e) => e.activityType === "repair_prompt").length;
  const quests = [
    { id: "q1", title: "Complete 1 reflection", description: "Daily emotional baseline", progress: Math.min(1, reflectCount), target: 1, rewardXp: 20, rewardEmbers: 8, tier: "daily" },
    { id: "q2", title: "Keep streak alive", description: "Complete any node today", progress: Math.min(1, state.events.length > 0 ? 1 : 0), target: 1, rewardXp: 18, rewardEmbers: 6, tier: "daily" },
    { id: "q3", title: "Repair reps", description: "Complete 2 repair prompts this week", progress: Math.min(2, repairCount), target: 2, rewardXp: 45, rewardEmbers: 20, tier: "weekly" },
    { id: "q4", title: "Appreciation loop", description: "Complete 2 appreciation actions", progress: Math.min(2, appreciationCount), target: 2, rewardXp: 32, rewardEmbers: 12, tier: "weekly" }
  ];
  return <div className="space-y-6"><SectionHeading kicker="Quests" title="Live couple quests" description="Quests are driven by your real activity history." /><div className="grid gap-5 lg:grid-cols-2">{quests.map((quest) => <Card key={quest.id}><CardContent className="p-6"><div className="mb-4 flex items-start justify-between"><div><Badge>{quest.tier}</Badge><h2 className="mt-3 text-2xl font-black">{quest.title}</h2><p className="mt-1 text-sm text-zinc-600">{quest.description}</p></div><div className="rounded-2xl bg-pink-50 p-3">{quest.tier === "weekly" ? <Trophy className="size-5 text-pink-500" /> : <Sparkles className="size-5 text-pink-500" />}</div></div><Progress value={(quest.progress / quest.target) * 100} /><div className="mt-3 flex justify-between text-sm text-zinc-500"><span>{quest.progress}/{quest.target}</span><span>+{quest.rewardXp} XP • +{quest.rewardEmbers} Embers</span></div></CardContent></Card>)}</div></div>;
}
