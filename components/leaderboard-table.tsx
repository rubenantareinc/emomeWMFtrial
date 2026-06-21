import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export type LeaderboardRow = {
  id: string;
  rank: number;
  label: string;
  archetypePair: string;
  score: number;
  streak: number;
  trend: number;
  metric: string;
};

export function LeaderboardTable({ entries }: { entries: LeaderboardRow[] }) {
  return (
    <Card>
      <CardContent className="overflow-x-auto p-0">
        <table className="min-w-full text-left">
          <thead className="bg-zinc-50 text-xs uppercase tracking-[0.18em] text-zinc-500">
            <tr>
              <th className="px-5 py-4">Rank</th>
              <th className="px-5 py-4">Couple</th>
              <th className="px-5 py-4">Archetype pair</th>
              <th className="px-5 py-4">Score</th>
              <th className="px-5 py-4">Streak</th>
              <th className="px-5 py-4">Trend</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t border-zinc-200">
                <td className="px-5 py-4 text-sm font-black text-zinc-950">#{entry.rank}</td>
                <td className="px-5 py-4">
                  <div className="font-semibold text-zinc-950">{entry.label}</div>
                  <div className="text-sm text-zinc-500">{entry.metric} leaderboard</div>
                </td>
                <td className="px-5 py-4 text-sm text-zinc-600">{entry.archetypePair}</td>
                <td className="px-5 py-4 text-sm font-semibold text-zinc-950">{entry.score.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm text-zinc-600">{entry.streak} days</td>
                <td className="px-5 py-4">
                  <Badge variant={entry.trend > 0 ? "default" : "muted"}>{entry.trend > 0 ? `+${entry.trend}` : entry.trend}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
