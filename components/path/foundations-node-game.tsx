"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Sparkles } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { FoundationsNodeKey, FoundationsNodeResponseMap } from "@/lib/foundations-session";

const emotions = ["calm", "excited", "disconnected", "stressed", "grateful", "tired", "affectionate", "annoyed", "hopeful"];

type Props<K extends FoundationsNodeKey> = {
  open: boolean;
  nodeKey: K;
  xpReward: number;
  onOpenChange: (open: boolean) => void;
  onFinished: (nodeKey: K, response: FoundationsNodeResponseMap[K]) => void;
};

function SliderStep({ label, minLabel, maxLabel, value, max = 10, onChange }: { label: string; minLabel: string; maxLabel: string; value: number; max?: number; onChange: (v: number) => void }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-sm">
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      <input className="mt-4 w-full accent-rose-500" type="range" min={1} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} />
      <div className="mt-2 flex items-center justify-between text-xs text-zinc-500"><span>{minLabel}</span><span className="font-bold text-rose-600">{value}</span><span>{maxLabel}</span></div>
    </div>
  );
}

export function FoundationsNodeGame<K extends FoundationsNodeKey>({ open, nodeKey, xpReward, onOpenChange, onFinished }: Props<K>) {
  const startedAtRef = useRef(0);
  useEffect(() => {
    if (open) startedAtRef.current = Date.now();
  }, [open, nodeKey]);
  const [step, setStep] = useState(0);

  const [primaryEmotion, setPrimaryEmotion] = useState("calm");
  const [secondaryEmotion, setSecondaryEmotion] = useState("hopeful");
  const [energyScore, setEnergyScore] = useState(3);
  const [closenessScore, setClosenessScore] = useState(6);
  const [communicationState, setCommunicationState] = useState<"flowing" | "normal" | "distant" | "tense">("normal");
  const [noteShort, setNoteShort] = useState("");

  const [challengeAnswers, setChallengeAnswers] = useState<{ scenarioId: string; selectedOptionId: string; inferredSignals: string[]; responseTimeMs: number }[]>([]);
  const [syncAnswers, setSyncAnswers] = useState<{ dimension: string; selfScore: number; partnerScore: number; syncScore: number }[]>([]);
  const [syncSelfScore, setSyncSelfScore] = useState(3);
  const [syncPartnerScore, setSyncPartnerScore] = useState(3);
  const [syncPairScore, setSyncPairScore] = useState(3);
  const [appreciationCategory, setAppreciationCategory] = useState<"kindness" | "effort" | "humor" | "patience" | "support" | "affection">("kindness");
  const [appreciationText, setAppreciationText] = useState("");
  const [repairAnswers, setRepairAnswers] = useState<{ situationId: string; chosenRepairStyle: string; repairInitiationScore: number; inferredRepairSignals: string[] }[]>([]);
  const [futureAction, setFutureAction] = useState("ask a better question");
  const [futureConfidence, setFutureConfidence] = useState(4);
  const [futureWhen, setFutureWhen] = useState<"tonight" | "tomorrow" | "this week">("tonight");

  const challengeScenarios = [
    { id: "long-day-quiet", prompt: "Your partner had a long day and goes quiet.", options: [{ id: "soft-checkin", label: "Sit close and check in gently", signals: ["reassurance_seeking", "emotional_openness"] }, { id: "give-space", label: "Give space and wait for them", signals: ["avoidance", "conflict_sensitivity"] }, { id: "lighten-mood", label: "Crack a joke to lighten things", signals: ["repair_orientation", "quality_time_preference"] }] },
    { id: "twenty-minutes", prompt: "You have 20 minutes tonight.", options: [{ id: "phones-down", label: "Phones down and talk", signals: ["quality_time_preference", "emotional_openness"] }, { id: "quick-logistics", label: "Handle tomorrow logistics", signals: ["stability", "avoidance"] }, { id: "hug-and-unwind", label: "Hug, snack, and decompress", signals: ["reassurance_seeking", "repair_orientation"] }] },
    { id: "forgot-important", prompt: "They forgot something important.", options: [{ id: "name-impact", label: "Name impact calmly", signals: ["accountability", "emotional_openness"] }, { id: "bury-it", label: "Ignore it and move on", signals: ["avoidance"] }, { id: "sharp-comment", label: "Make a sharp comment", signals: ["conflict_sensitivity", "escalation_risk"] }] },
    { id: "feel-distant", prompt: "You feel distant.", options: [{ id: "send-invite", label: "Send a warm invite to connect", signals: ["repair_orientation", "reassurance_seeking"] }, { id: "wait-them", label: "Wait for them to notice", signals: ["avoidance"] }, { id: "state-blunt", label: "Bluntly state you're disconnected", signals: ["emotional_openness", "conflict_sensitivity"] }] },
    { id: "tone-mismatch", prompt: "A conversation gets tense fast.", options: [{ id: "pause-reset", label: "Pause and reset tone", signals: ["repair_orientation", "conflict_sensitivity"] }, { id: "push-point", label: "Push your point through", signals: ["escalation_risk"] }, { id: "switch-topic", label: "Switch topics immediately", signals: ["avoidance"] }] }
  ];

  const syncDimensions = ["communication", "affection", "attention", "support", "future mindset"];
  const repairSituations = [
    { id: "misunderstanding", prompt: "We had a small misunderstanding.", styles: [{ id: "clarify", label: "Clarify softly", signals: ["accountability", "empathy"] }, { id: "drop-it", label: "Drop it and move on", signals: ["avoidance"] }, { id: "prove", label: "Prove my point", signals: ["escalation_risk"] }] },
    { id: "ignored", prompt: "One of us feels ignored.", styles: [{ id: "repair-invite", label: "Invite a reset talk", signals: ["repair_initiative", "empathy"] }, { id: "defend", label: "Defend myself first", signals: ["accountability"] }, { id: "retreat", label: "Retreat for now", signals: ["avoidance"] }] },
    { id: "snappy", prompt: "We are both tired and snappy.", styles: [{ id: "gentle-timeout", label: "Take a gentle timeout", signals: ["repair_initiative"] }, { id: "keep-going", label: "Keep arguing until resolved", signals: ["escalation_risk"] }, { id: "silent", label: "Go silent", signals: ["avoidance"] }] },
    { id: "awkward-end", prompt: "A conversation ended awkwardly.", styles: [{ id: "followup", label: "Send a warm follow-up", signals: ["repair_initiative", "empathy"] }, { id: "wait", label: "Wait for them to reopen", signals: ["avoidance"] }, { id: "joke-deflect", label: "Deflect with humor", signals: ["empathy"] }] }
  ];

  const challengeDone = challengeAnswers.length >= challengeScenarios.length;
  const syncDone = syncAnswers.length >= syncDimensions.length;
  const repairDone = repairAnswers.length >= repairSituations.length;
  const totalSteps = 6;

  function finish() {
    const completedAt = new Date().toISOString();
    const durationMs = Date.now() - startedAtRef.current;
    if (nodeKey === "reflect") {
      onFinished(nodeKey, { primaryEmotion, secondaryEmotion, energyScore, closenessScore, communicationState, noteShort: noteShort.slice(0, 100) || undefined, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    if (nodeKey === "challenge") {
      const signals = challengeAnswers.flatMap((item) => item.inferredSignals);
      const summaryInsights = [signals.includes("reassurance_seeking") ? "You tend to move toward reassurance." : "You keep things steady under pressure.", signals.includes("repair_orientation") ? "You prioritize calm over escalation." : "You navigate tension with restraint.", signals.includes("emotional_openness") ? "You show strong repair instinct." : "You protect connection even when tired."];
      onFinished(nodeKey, { scenarios: challengeAnswers, summaryInsights, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    if (nodeKey === "sync") {
      onFinished(nodeKey, { dimensions: syncAnswers, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    if (nodeKey === "appreciate") {
      onFinished(nodeKey, { promptId: "appreciation-1", appreciationCategory, textOptional: appreciationText.slice(0, 100) || undefined, positivityFlag: true, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    if (nodeKey === "repair") {
      onFinished(nodeKey, { situations: repairAnswers, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    if (nodeKey === "future") {
      onFinished(nodeKey, { chosenAction: futureAction, confidenceScore: futureConfidence, timeIntent: futureWhen, completedAt, durationMs } as FoundationsNodeResponseMap[K]);
    }
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[90vh] max-w-2xl overflow-hidden rounded-3xl p-0">
        <div className="flex h-full flex-col bg-gradient-to-br from-white via-rose-50/40 to-orange-50/40">
          <div className="border-b border-zinc-200 px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Foundations • {nodeKey}</p>
            <div className="mt-2 flex items-center gap-3">
              <Progress value={(Math.min(step + 1, totalSteps) / totalSteps) * 100} className="h-2" />
              <span className="text-xs font-semibold text-zinc-500">+{xpReward} XP</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div key={`${nodeKey}-${step}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }} className="space-y-4">
                {nodeKey === "reflect" ? (
                  <>
                    {step === 0 ? <div><h3 className="text-2xl font-black text-zinc-900">How are you feeling today?</h3><div className="mt-4 grid grid-cols-3 gap-2">{emotions.map((emotion) => <Button key={emotion} variant={primaryEmotion === emotion ? "default" : "outline"} className={primaryEmotion === emotion ? "bg-rose-500 text-white" : ""} onClick={() => setPrimaryEmotion(emotion)}>{emotion}</Button>)}</div></div> : null}
                    {step === 1 ? <div><p className="mb-3 text-sm font-semibold text-zinc-800">Pick a secondary emotion</p><div className="grid grid-cols-3 gap-2">{emotions.filter((emotion) => emotion !== primaryEmotion).map((emotion) => <Button key={emotion} variant={secondaryEmotion === emotion ? "default" : "outline"} className={secondaryEmotion === emotion ? "bg-rose-500 text-white" : ""} onClick={() => setSecondaryEmotion(emotion)}>{emotion}</Button>)}</div></div> : null}
                    {step === 2 ? <SliderStep label="Relationship energy today" minLabel="Low" maxLabel="High" value={energyScore} max={5} onChange={setEnergyScore} /> : null}
                    {step === 3 ? <SliderStep label="How emotionally close do you feel today?" minLabel="Far" maxLabel="Close" value={closenessScore} onChange={setClosenessScore} /> : null}
                    {step === 4 ? <div><p className="mb-3 text-sm font-semibold text-zinc-800">Communication pulse</p><div className="grid grid-cols-2 gap-2">{(["flowing", "normal", "distant", "tense"] as const).map((state) => <Button key={state} variant={communicationState === state ? "default" : "outline"} className={communicationState === state ? "bg-rose-500 text-white" : ""} onClick={() => setCommunicationState(state)}>{state}</Button>)}</div></div> : null}
                    {step === 5 ? <div className="rounded-2xl bg-white p-4"><p className="text-sm font-semibold text-zinc-900">What shaped your relationship energy today? (optional)</p><textarea maxLength={100} value={noteShort} onChange={(e) => setNoteShort(e.target.value)} className="mt-3 h-24 w-full rounded-xl border border-zinc-200 p-3 text-sm" /><p className="mt-1 text-right text-xs text-zinc-500">{noteShort.length}/100</p></div> : null}
                  </>
                ) : null}

                {nodeKey === "challenge" ? (
                  challengeDone ? <div className="rounded-2xl bg-white p-5 text-center"><Sparkles className="mx-auto size-8 text-rose-500" /><h3 className="mt-2 text-xl font-black">Challenge complete</h3><p className="text-sm text-zinc-600">Fast instincts captured. Your style trends are ready.</p></div> : (() => { const s = challengeScenarios[challengeAnswers.length]; return <div><p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Scenario {challengeAnswers.length + 1}/{challengeScenarios.length}</p><h3 className="mt-2 text-xl font-black">{s.prompt}</h3><div className="mt-4 space-y-2">{s.options.map((opt) => <button type="button" key={opt.id} className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left font-medium transition hover:border-rose-300 hover:shadow-sm" onClick={() => setChallengeAnswers((prev) => [...prev, { scenarioId: s.id, selectedOptionId: opt.id, inferredSignals: opt.signals, responseTimeMs: 1200 + prev.length * 180 }])}>{opt.label}</button>)}</div></div>; })()
                ) : null}

                {nodeKey === "sync" ? (
                  syncDone ? <div className="rounded-2xl bg-white p-5 text-center"><CheckCircle2 className="mx-auto size-8 text-emerald-500" /><h3 className="mt-2 text-xl font-black">Sync captured</h3><p className="text-sm text-zinc-600">You mapped self, partner, and pair alignment.</p></div> : (() => { const d = syncDimensions[syncAnswers.length]; return <div className="space-y-3"><p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Dimension {syncAnswers.length + 1}/{syncDimensions.length}</p><h3 className="text-xl font-black capitalize">{d}</h3><SliderStep label="My effort today" minLabel="Low" maxLabel="High" max={5} value={syncSelfScore} onChange={setSyncSelfScore} /><SliderStep label="Partner effort today" minLabel="Low" maxLabel="High" max={5} value={syncPartnerScore} onChange={setSyncPartnerScore} /><SliderStep label="Our sync today" minLabel="Low" maxLabel="High" max={5} value={syncPairScore} onChange={setSyncPairScore} /><Button className="bg-rose-500 text-white" onClick={() => { setSyncAnswers((prev) => [...prev, { dimension: d, selfScore: syncSelfScore, partnerScore: syncPartnerScore, syncScore: syncPairScore }]); setSyncSelfScore(3); setSyncPartnerScore(3); setSyncPairScore(3); }}>Save dimension</Button></div>; })()
                ) : null}

                {nodeKey === "appreciate" ? (
                  <div className="space-y-4"><h3 className="text-2xl font-black">What made them easy to love today?</h3><div className="grid grid-cols-3 gap-2">{(["kindness", "effort", "humor", "patience", "support", "affection"] as const).map((category) => <Button key={category} variant={appreciationCategory === category ? "default" : "outline"} className={appreciationCategory === category ? "bg-rose-500 text-white" : ""} onClick={() => setAppreciationCategory(category)}>{category}</Button>)}</div><textarea maxLength={100} value={appreciationText} onChange={(e) => setAppreciationText(e.target.value)} className="h-24 w-full rounded-xl border border-zinc-200 p-3 text-sm" placeholder="Optional short note" /></div>
                ) : null}

                {nodeKey === "repair" ? (
                  repairDone ? <div className="rounded-2xl bg-white p-5 text-center"><h3 className="text-xl font-black">Repair style mapped</h3><p className="text-sm text-zinc-600">You captured tactical next moves for tense moments.</p></div> : (() => { const r = repairSituations[repairAnswers.length]; return <div><h3 className="text-xl font-black">{r.prompt}</h3><div className="mt-3 space-y-2">{r.styles.map((style) => <button type="button" key={style.id} className="w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left" onClick={() => setRepairAnswers((prev) => [...prev, { situationId: r.id, chosenRepairStyle: style.id, inferredRepairSignals: style.signals, repairInitiationScore: 4 }])}>{style.label}</button>)}</div></div>; })()
                ) : null}

                {nodeKey === "future" ? (
                  <div className="space-y-4"><h3 className="text-2xl font-black">Pick one micro-commitment</h3><div className="grid gap-2">{["ask a better question", "express appreciation", "plan quality time", "address something gently", "be more present", "initiate affection", "check in intentionally"].map((action) => <Button key={action} variant={futureAction === action ? "default" : "outline"} className={futureAction === action ? "justify-start bg-rose-500 text-left text-white" : "justify-start text-left"} onClick={() => setFutureAction(action)}>{action}</Button>)}</div><SliderStep label="Confidence" minLabel="Low" maxLabel="High" max={5} value={futureConfidence} onChange={setFutureConfidence} /><div className="grid grid-cols-3 gap-2">{(["tonight", "tomorrow", "this week"] as const).map((when) => <Button key={when} variant={futureWhen === when ? "default" : "outline"} className={futureWhen === when ? "bg-rose-500 text-white" : ""} onClick={() => setFutureWhen(when)}>{when}</Button>)}</div></div>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="border-t border-zinc-200 p-4">
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Exit</Button>
              {nodeKey === "challenge" || nodeKey === "sync" || nodeKey === "repair" ? (
                <Button className="bg-zinc-900 text-white" onClick={finish} disabled={(nodeKey === "challenge" && !challengeDone) || (nodeKey === "sync" && !syncDone) || (nodeKey === "repair" && !repairDone)}>Finish +{xpReward} XP</Button>
              ) : step >= totalSteps - 1 ? (
                <Button className="bg-zinc-900 text-white" onClick={finish}>Finish +{xpReward} XP</Button>
              ) : (
                <Button className="bg-rose-500 text-white" onClick={() => setStep((prev) => prev + 1)}>Continue</Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
