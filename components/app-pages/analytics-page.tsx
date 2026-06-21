"use client";

import { Flame, Heart, MessageCircleHeart, TrendingUp } from "lucide-react";
import { useCoupleStore } from "@/lib/domain/couple-store";
import { AnalyticsOverview } from "@/components/analytics-overview";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";

export function AnalyticsPageContent() {
  const state = useCoupleStore();
  const history = state.snapshots.slice(-14).map((s) => ({ date: s.date, connection: s.relationshipScore, communication: s.dimensions.communication, trust: s.dimensions.emotionalSafety, fun: s.dimensions.sharedFun }));

  return (
    <div className="space-y-6">
      <SectionHeading kicker="Analytics" title="Connection momentum" description="Derived from completed activity events and daily snapshots." />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Relationship score" value={`${state.shared.relationshipScore}%`} icon={<Heart className="size-4 text-rose-500" />} helper="Composite of 8 relationship dimensions" />
        <StatCard label="Current streak" value={`${state.shared.streak} days`} icon={<Flame className="size-4 text-orange-500" />} helper="Shared daily consistency" />
        <StatCard label="Communication" value={`${state.shared.dimensions.communication}%`} icon={<MessageCircleHeart className="size-4 text-pink-500" />} helper="Updated from real node interactions" />
        <StatCard label="Weekly momentum" value={`${state.shared.momentum}%`} icon={<TrendingUp className="size-4 text-emerald-500" />} helper="Quality + participation trend" />
      </div>
      <AnalyticsOverview history={history} insights={state.insights.slice(0, 4).map((body, i) => ({ id: String(i), title: "Generated insight", body, tone: i % 2 ? "action" : "positive" }))} trust={state.shared.dimensions.emotionalSafety} communication={state.shared.dimensions.communication} fun={state.shared.dimensions.sharedFun} future={state.shared.dimensions.futureAlignment} />
    </div>
  );
}
