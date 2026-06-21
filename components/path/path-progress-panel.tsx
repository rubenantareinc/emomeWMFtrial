import { Flame, Heart, Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function PathProgressPanel({
  currentSection,
  currentUnit,
  level,
  totalXp,
  sparks,
  flame,
  hearts,
  nextMilestone,
  xpIntoLevel,
  xpForLevel
}: {
  currentSection: string;
  currentUnit: string;
  level: number;
  totalXp: number;
  sparks: number;
  flame: number;
  hearts: number;
  nextMilestone: string;
  xpIntoLevel: number;
  xpForLevel: number;
}) {
  return (
    <div className="space-y-3 opacity-95">
      <Card className="rounded-3xl border-zinc-200 bg-zinc-50/70">
        <CardContent className="space-y-3 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Current focus</p>
          <div>
            <p className="text-base font-black text-zinc-900">{currentSection}</p>
            <p className="text-sm text-zinc-500">{currentUnit}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold text-zinc-600">Level {level}</p>
            <Progress value={(xpIntoLevel / xpForLevel) * 100} />
            <p className="mt-1 text-xs text-zinc-500">{xpIntoLevel}/{xpForLevel} XP</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-zinc-200 bg-white">
        <CardContent className="grid grid-cols-2 gap-2 p-4 text-xs">
          <div className="rounded-xl bg-zinc-100 p-2"><Flame className="mb-1 size-3.5 text-orange-500" />{flame} Flame</div>
          <div className="rounded-xl bg-zinc-100 p-2"><Sparkles className="mb-1 size-3.5 text-pink-500" />{sparks} Sparks</div>
          <div className="rounded-xl bg-zinc-100 p-2"><Heart className="mb-1 size-3.5 text-rose-500" />{hearts} Hearts</div>
          <div className="rounded-xl bg-zinc-100 p-2"><Target className="mb-1 size-3.5 text-indigo-500" />{totalXp} XP</div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-zinc-200 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50">
        <CardContent className="p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Next milestone</p>
          <p className="mt-1 text-sm font-bold text-zinc-900">{nextMilestone}</p>
          <p className="text-xs text-zinc-500">Complete the highlighted node to unlock this.</p>
        </CardContent>
      </Card>
    </div>
  );
}
