"use client";

import { useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { PathNode } from "@/types/domain";

type Props = {
  open: boolean;
  node: PathNode | null;
  onOpenChange: (open: boolean) => void;
  onComplete: (responses: Record<string, any>) => void;
};

const emotions = ["Calm", "Connected", "Overloaded", "Hopeful", "Playful", "Tense"];

export function ActivityEngineModal({ open, node, onOpenChange, onComplete }: Props) {
  const [step, setStep] = useState(0);
  const [start] = useState(() => Date.now());
  const [vals, setVals] = useState<Record<string, string | number | string[] | boolean | null>>({});

  const totalSteps = useMemo(() => {
    switch (node?.type) {
      case "reflect": return 5;
      case "check_in": return 3;
      case "appreciation": return 2;
      case "partner_guess": return 3;
      case "repair_exercise": return 2;
      case "future_alignment":
      case "future": return 2;
      default: return 1;
    }
  }, [node?.type]);

  if (!node) return null;

  const finish = () => {
    onComplete(vals);
    onOpenChange(false);
    setStep(0);
    setVals({});
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-rose-500">{node.type.replaceAll("_", " ")}</p>
          <DialogTitle className="text-2xl">{node.title}</DialogTitle>
          <Progress value={((step + 1) / totalSteps) * 100} className="mt-2 h-2" />
        </DialogHeader>

        <div className="space-y-4">
          {node.type === "reflect" && (
            <>
              {step === 0 && <Range label="Relationship energy today" value={Number(vals.energy ?? 3)} onChange={(v) => setVals((s) => ({ ...s, energy: v }))} max={5} />}
              {step === 1 && <Range label="Emotional closeness today" value={Number(vals.closeness ?? 6)} onChange={(v) => setVals((s) => ({ ...s, closeness: v }))} max={10} />}
              {step === 2 && <Range label="Stress affecting connection" value={Number(vals.stress ?? 4)} onChange={(v) => setVals((s) => ({ ...s, stress: v }))} max={10} />}
              {step === 3 && <ChipPick title="One-word state" options={emotions} value={String(vals.emotion ?? emotions[0])} onPick={(v) => setVals((s) => ({ ...s, emotion: v }))} />}
              {step === 4 && <textarea className="w-full rounded-xl border p-3 text-sm" placeholder="What helped most today? (optional)" value={String(vals.note ?? "")} onChange={(e) => setVals((s) => ({ ...s, note: e.target.value.slice(0, 120) }))} />}
            </>
          )}

          {node.type === "check_in" && (
            <>
              {step === 0 && <Range label="How supported do you feel right now?" value={Number(vals.support ?? 6)} onChange={(v) => setVals((s) => ({ ...s, support: v }))} max={10} />}
              {step === 1 && <ChipPick title="Today I need" options={["Reassurance", "Space", "Affection", "Fun", "Clarity"]} value={String(vals.need ?? "Reassurance")} onPick={(v) => setVals((s) => ({ ...s, need: v }))} />}
              {step === 2 && <ChipPick title="Connection mode" options={["Quick hug", "10-min talk", "Play", "Plan tomorrow"]} value={String(vals.mode ?? "Quick hug")} onPick={(v) => setVals((s) => ({ ...s, mode: v }))} />}
            </>
          )}

          {node.type === "appreciation" && (
            <>
              {step === 0 && <ChipPick title="What are you appreciating?" options={["Effort", "Kindness", "Patience", "Humor", "Care"]} value={String(vals.category ?? "Effort")} onPick={(v) => setVals((s) => ({ ...s, category: v }))} />}
              {step === 1 && <textarea className="w-full rounded-xl border p-3 text-sm" placeholder="One specific appreciation" value={String(vals.note ?? "")} onChange={(e) => setVals((s) => ({ ...s, note: e.target.value.slice(0, 120) }))} />}
            </>
          )}

          {node.type === "partner_guess" && (
            <>
              {step === 0 && <ChipPick title="Your answer" options={["Talk it out", "Take space", "Do something fun", "Give affection"]} value={String(vals.actual ?? "Talk it out")} onPick={(v) => setVals((s) => ({ ...s, actual: v }))} />}
              {step === 1 && <ChipPick title="How your partner would answer" options={["Talk it out", "Take space", "Do something fun", "Give affection"]} value={String(vals.guess ?? "Talk it out")} onPick={(v) => setVals((s) => ({ ...s, guess: v }))} />}
              {step === 2 && <button className="w-full rounded-xl border bg-rose-50 p-4 text-left" onClick={() => setVals((s) => ({ ...s, match: vals.actual === vals.guess ? 92 : 58 }))}>Reveal match score: {vals.actual === vals.guess ? "High" : "Partial"}</button>}
            </>
          )}

          {node.type === "repair_exercise" && (
            <>
              {step === 0 && <ChipPick title="When tension appears, choose a repair move" options={["Pause + soften tone", "Own my part", "Ask what they need", "Reset later"]} value={String(vals.repair ?? "Pause + soften tone")} onPick={(v) => setVals((s) => ({ ...s, repair: v }))} />}
              {step === 1 && <ChipPick title="How likely are you to use it today?" options={["Very likely", "Likely", "Maybe"]} value={String(vals.likelihood ?? "Likely")} onPick={(v) => setVals((s) => ({ ...s, likelihood: v }))} />}
            </>
          )}

          {(node.type === "future_alignment" || node.type === "future") && (
            <>
              {step === 0 && <ChipPick title="This week's shared priority" options={["Quality time", "Finance plan", "Health rhythm", "Fun date"]} value={String(vals.priority ?? "Quality time")} onPick={(v) => setVals((s) => ({ ...s, priority: v }))} />}
              {step === 1 && <ChipPick title="When will we do it?" options={["Tonight", "Tomorrow", "This weekend"]} value={String(vals.when ?? "Tomorrow")} onPick={(v) => setVals((s) => ({ ...s, when: v }))} />}
            </>
          )}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          {step >= totalSteps - 1 ? (
            <Button onClick={finish}>Complete +{node.xpReward} XP</Button>
          ) : (
            <Button onClick={() => setStep((s) => s + 1)}>Continue</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Range({ label, value, max, onChange }: { label: string; value: number; max: number; onChange: (v: number) => void }) {
  return <div><p className="mb-2 text-sm font-medium">{label}</p><input type="range" min={1} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-rose-500" /><p className="mt-1 text-xs text-zinc-500">{value}/{max}</p></div>;
}
function ChipPick({ title, options, value, onPick }: { title: string; options: string[]; value: string; onPick: (v: string) => void }) {
  return <div><p className="mb-2 text-sm font-medium">{title}</p><div className="grid grid-cols-2 gap-2">{options.map((opt) => <button key={opt} onClick={() => onPick(opt)} className={`rounded-xl border px-3 py-2 text-left text-sm ${value === opt ? "border-rose-500 bg-rose-50" : "border-zinc-200"}`}>{opt}</button>)}</div></div>;
}
