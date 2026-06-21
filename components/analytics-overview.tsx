"use client";

import { useSyncExternalStore } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDateLabel } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight } from "lucide-react";

type Insight = { id: string; title: string; body: string; tone: "positive" | "gentle" | "action" };

type HistoryPoint = {
  date: string;
  connection: number;
  communication: number;
  trust: number;
  fun: number;
};

export function AnalyticsOverview({
  history,
  insights,
  trust,
  communication,
  fun,
  future
}: {
  history: HistoryPoint[];
  insights: Insight[];
  trust: number;
  communication: number;
  fun: number;
  future: number;
}) {
  const chartsReady = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  );

  return (
    <div className="space-y-5">
      <Card className="rounded-3xl border-zinc-200/80 bg-white">
        <CardHeader>
          <CardTitle>Relationship score trend</CardTitle>
          <CardDescription>Your connection pulse from check-ins, games, and reflections.</CardDescription>
        </CardHeader>
        <CardContent className="h-[320px]">
          {chartsReady ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={history}>
                <defs>
                  <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff4d8d" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#ff8f3f" stopOpacity={0.06} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tickFormatter={formatDateLabel} stroke="#71717a" tickLine={false} axisLine={false} />
                <YAxis stroke="#71717a" tickLine={false} axisLine={false} domain={[40, 100]} />
                <Tooltip />
                <Area type="monotone" dataKey="connection" stroke="#ff6a5b" fill="url(#pulseGradient)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          ) : null}
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1fr_0.95fr]">
        <Card className="rounded-3xl border-zinc-200/80 bg-white">
          <CardHeader>
            <CardTitle>Relationship breakdown</CardTitle>
            <CardDescription>The core dimensions shaping your overall momentum.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Communication", value: communication },
              { label: "Trust", value: trust },
              { label: "Fun / Play", value: fun },
              { label: "Future Alignment", value: future }
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-zinc-100 bg-zinc-50/70 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-zinc-800">{item.label}</span>
                  <span className="font-bold text-zinc-700">{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2 bg-zinc-200 [&>div]:bg-gradient-to-r [&>div]:from-rose-400 [&>div]:to-orange-400" />
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-5">
          <Card className="rounded-3xl border-zinc-200/80 bg-white">
            <CardHeader>
              <CardTitle>AI relationship note</CardTitle>
              <CardDescription>Smart pattern spotted from your recent activity.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50 p-4">
                <p className="text-sm font-semibold text-zinc-800">
                  You two tend to connect best when both complete check-ins earlier in the day.
                </p>
                <p className="mt-2 flex items-center gap-1 text-xs font-medium text-rose-500">
                  <ArrowUpRight className="size-3.5" />
                  Communication consistency improved this week.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-3">
            {insights.slice(0, 2).map((insight) => (
              <Card key={insight.id} className="rounded-2xl border-zinc-200/80 bg-white">
                <CardContent className="p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.12em] text-zinc-500">{insight.tone}</div>
                  <div className="mt-1 text-sm font-bold text-zinc-900">{insight.title}</div>
                  <p className="mt-1 text-sm text-zinc-600">{insight.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
