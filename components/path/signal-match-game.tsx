"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Hand, Sparkles, Star } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  createSignalMatchSession,
  pickSignalMatchPrompts,
  saveSignalMatchSession,
  scoreSignalMatchRound,
  type PromptAnswerValue,
  type SignalMatchPrompt,
  type SignalMatchRound,
  type SignalMatchSession
} from "@/lib/signal-match";

type Stage = "intro" | "private" | "handover" | "guess" | "reveal" | "summary";

function insightCopy(score: number) {
  if (score >= 90) return "Strong read";
  if (score >= 60) return "Small mismatch";
  return "You’re slightly out of sync here";
}

function AnswerInput({
  prompt,
  value,
  onChange,
  submitLabel
}: {
  prompt: SignalMatchPrompt;
  value: PromptAnswerValue | null;
  onChange: (value: PromptAnswerValue) => void;
  submitLabel: string;
}) {
  const options = prompt.options ?? [];
  const isReady = value !== null && value !== undefined && (!(Array.isArray(value)) || value.length > 0);

  const toggleMulti = (option: string) => {
    const base = Array.isArray(value) ? value.map(String) : [];
    if (base.includes(option)) {
      onChange(base.filter((item) => item !== option));
      return;
    }
    onChange([...base, option]);
  };

  return (
    <div className="space-y-4">
      {prompt.answerType === "scale" ? (
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 5 }, (_, index) => index + 1).map((option) => (
            <Button
              key={option}
              type="button"
              variant={value === option ? "default" : "outline"}
              className={value === option ? "bg-rose-500 text-white hover:bg-rose-600" : ""}
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : null}

      {(prompt.answerType === "single_choice" || prompt.answerType === "ranking") ? (
        <div className="grid gap-2">
          {options.map((option) => (
            <Button
              key={option}
              type="button"
              variant={value === option ? "default" : "outline"}
              className={value === option ? "justify-start bg-rose-500 text-left text-white hover:bg-rose-600" : "justify-start text-left"}
              onClick={() => onChange(option)}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : null}

      {prompt.answerType === "multi_choice" ? (
        <div className="grid gap-2">
          {options.map((option) => {
            const checked = Array.isArray(value) && value.includes(option);
            return (
              <Button
                key={option}
                type="button"
                variant={checked ? "default" : "outline"}
                className={checked ? "justify-start bg-rose-500 text-left text-white hover:bg-rose-600" : "justify-start text-left"}
                onClick={() => toggleMulti(option)}
              >
                {option}
              </Button>
            );
          })}
        </div>
      ) : null}

      <p className="text-xs text-zinc-500">{submitLabel}</p>
      {!isReady ? <p className="text-xs text-rose-500">Select an answer to continue.</p> : null}
    </div>
  );
}

export function SignalMatchGame({
  open,
  onOpenChange,
  xpReward,
  sparkReward,
  onFinished
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  xpReward: number;
  sparkReward?: number;
  onFinished: (session: SignalMatchSession) => void;
}) {
  const prompts = useMemo(() => pickSignalMatchPrompts(4), []);
  const [stage, setStage] = useState<Stage>("intro");
  const [roundIndex, setRoundIndex] = useState(0);
  const [answer, setAnswer] = useState<PromptAnswerValue | null>(null);
  const [guess, setGuess] = useState<PromptAnswerValue | null>(null);
  const [ownAnswer, setOwnAnswer] = useState<PromptAnswerValue | null>(null);
  const [captureOwnAnswer, setCaptureOwnAnswer] = useState(false);
  const [rounds, setRounds] = useState<SignalMatchRound[]>([]);
  const [completedSession, setCompletedSession] = useState<SignalMatchSession | null>(null);

  const prompt = prompts[roundIndex];
  const reverseRoles = roundIndex % 2 === 1;
  const answererLabel = reverseRoles ? "Player B" : "Player A";
  const guesserLabel = reverseRoles ? "Player A" : "Player B";

  const lastRound = rounds[rounds.length - 1];

  function resetRoundState() {
    setAnswer(null);
    setGuess(null);
    setOwnAnswer(null);
    setCaptureOwnAnswer(false);
  }

  function nextRoundOrSummary(newRounds: SignalMatchRound[]) {
    const enrichedRounds = captureOwnAnswer && ownAnswer !== null
      ? newRounds.map((round, index) => (index === newRounds.length - 1 ? { ...round, playerBOwnAnswer: ownAnswer } : round))
      : newRounds;

    if (enrichedRounds.length >= prompts.length) {
      const session = createSignalMatchSession(enrichedRounds);
      saveSignalMatchSession(session);
      setRounds(enrichedRounds);
      setCompletedSession(session);
      setStage("summary");
      onFinished(session);
      return;
    }

    setRounds(enrichedRounds);
    setRoundIndex((prev) => prev + 1);
    resetRoundState();
    setStage("private");
  }

  function submitRound() {
    if (!prompt || answer === null || guess === null) return;

    const score = scoreSignalMatchRound(prompt.answerType, answer, guess, prompt.scaleMax ?? 5);
    const round: SignalMatchRound = {
      roundId: `${prompt.id}-${Date.now()}`,
      promptId: prompt.id,
      dimension: prompt.dimension,
      promptText: prompt.promptText,
      answerType: prompt.answerType,
      playerAAnswer: answer,
      playerBGuess: guess,
      playerBOwnAnswer: captureOwnAnswer ? ownAnswer ?? undefined : undefined,
      matchScore: score.matchScore,
      mismatchDistance: score.mismatchDistance,
      completedAt: new Date().toISOString()
    };

    const nextRounds = [...rounds, round];
    setRounds(nextRounds);
    setStage("reveal");
  }

  const sessionPreview = completedSession ?? (rounds.length ? createSignalMatchSession(rounds) : null);
  const sparkBonus = (sessionPreview?.averageMatchScore ?? 0) >= 75 ? 20 : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[92vh] max-w-3xl overflow-y-auto rounded-3xl p-0 sm:h-[88vh]">
        <div className="flex h-full flex-col bg-gradient-to-br from-white via-rose-50/40 to-orange-50/50">
          <div className="border-b border-zinc-200 px-6 py-4">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Relationship game</p>
            <h2 className="text-xl font-black text-zinc-900">Signal Match</h2>
          </div>

          <div className="flex-1 px-6 py-5">
            {stage === "intro" ? (
              <div className="space-y-5">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-black">Signal Match</DialogTitle>
                  <DialogDescription className="text-base text-zinc-600">
                    Answer privately. Then see how well your partner reads you.
                  </DialogDescription>
                </DialogHeader>
                <div className="rounded-2xl bg-white p-4 text-sm text-zinc-700 shadow-sm">
                  Take turns on one phone. One person answers. The other guesses. Then switch.
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-2xl bg-white p-3 shadow-sm">4 rounds • structured prompts</div>
                  <div className="rounded-2xl bg-white p-3 shadow-sm">Dimensions: connection, communication, appreciation, conflict, future</div>
                </div>
                <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => setStage("private")}>Start game</Button>
              </div>
            ) : null}

            {stage === "private" && prompt ? (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Round {roundIndex + 1} of {prompts.length} • {prompt.dimension}</p>
                <h3 className="text-lg font-black text-zinc-900">{answererLabel}, answer privately</h3>
                <p className="text-zinc-700">{prompt.promptText}</p>
                <AnswerInput prompt={prompt} value={answer} onChange={setAnswer} submitLabel="Keep this private from your partner." />
                <Button disabled={answer === null || (Array.isArray(answer) && answer.length === 0)} className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => setStage("handover")}>Lock answer</Button>
              </div>
            ) : null}

            {stage === "handover" ? (
              <div className="grid h-full place-items-center">
                <div className="max-w-md space-y-4 text-center">
                  <Hand className="mx-auto size-10 text-rose-500" />
                  <h3 className="text-2xl font-black text-zinc-900">Pass the phone to your partner</h3>
                  <p className="text-zinc-600">Now {guesserLabel} will guess the answer.</p>
                  <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => setStage("guess")}>Ready to guess</Button>
                </div>
              </div>
            ) : null}

            {stage === "guess" && prompt ? (
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">Round {roundIndex + 1} of {prompts.length} • Guess phase</p>
                <h3 className="text-lg font-black text-zinc-900">{guesserLabel}, what do you think they picked?</h3>
                <p className="text-zinc-700">{prompt.promptText}</p>
                <AnswerInput prompt={prompt} value={guess} onChange={setGuess} submitLabel="Choose your best read." />
                <Button disabled={guess === null || (Array.isArray(guess) && guess.length === 0)} className="bg-rose-500 text-white hover:bg-rose-600" onClick={submitRound}>Reveal result</Button>
              </div>
            ) : null}

            {stage === "reveal" && lastRound ? (
              <div className="space-y-4">
                <h3 className="text-xl font-black text-zinc-900">Reveal</h3>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-zinc-500">Prompt</p>
                  <p className="font-semibold text-zinc-900">{lastRound.promptText}</p>
                  <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-100 p-3">
                      <p className="text-zinc-500">Actual answer</p>
                      <p className="font-semibold text-zinc-900">{Array.isArray(lastRound.playerAAnswer) ? lastRound.playerAAnswer.join(", ") : String(lastRound.playerAAnswer)}</p>
                    </div>
                    <div className="rounded-xl bg-zinc-100 p-3">
                      <p className="text-zinc-500">Guessed answer</p>
                      <p className="font-semibold text-zinc-900">{Array.isArray(lastRound.playerBGuess) ? lastRound.playerBGuess.join(", ") : String(lastRound.playerBGuess)}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                    <CheckCircle2 className="size-4" /> {insightCopy(lastRound.matchScore)} • Match {lastRound.matchScore}%
                  </div>
                </div>

                {prompt ? (
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <p className="font-semibold text-zinc-900">Optional: {guesserLabel}, add your own answer too</p>
                      <Button variant="outline" size="sm" onClick={() => setCaptureOwnAnswer((prev) => !prev)}>
                        {captureOwnAnswer ? "Skip" : "Add"}
                      </Button>
                    </div>
                    {captureOwnAnswer ? <AnswerInput prompt={prompt} value={ownAnswer} onChange={setOwnAnswer} submitLabel="Optional personal answer for richer analytics." /> : null}
                  </div>
                ) : null}

                <Button className="bg-rose-500 text-white hover:bg-rose-600" onClick={() => nextRoundOrSummary(rounds)}>
                  {rounds.length >= prompts.length ? "View summary" : "Next round"}
                </Button>
              </div>
            ) : null}

            {stage === "summary" && sessionPreview ? (
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-zinc-900">Game summary</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Total match score</p>
                    <p className="text-3xl font-black text-zinc-900">{sessionPreview.totalMatchScore}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Average round match</p>
                    <p className="text-3xl font-black text-zinc-900">{sessionPreview.averageMatchScore}%</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white p-4 shadow-sm">
                  <p className="mb-2 text-sm font-semibold text-zinc-900">Per-dimension breakdown</p>
                  <div className="grid gap-2 text-sm sm:grid-cols-2">
                    <p>Connection: {sessionPreview.analytics.connectionScore}</p>
                    <p>Communication: {sessionPreview.analytics.communicationScore}</p>
                    <p>Appreciation: {sessionPreview.analytics.appreciationScore}</p>
                    <p>Conflict: {sessionPreview.analytics.conflictScore}</p>
                    <p>Future alignment: {sessionPreview.analytics.futureScore}</p>
                  </div>
                </div>
                <div className="rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-orange-400 p-4 text-white shadow-sm">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">Rewards</p>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-sm font-semibold">
                    <span>+{xpReward} XP</span>
                    <span>{sparkReward ? `+${sparkReward} Sparks` : "No Sparks base reward"}</span>
                    {sparkBonus > 0 ? <span className="inline-flex items-center gap-1"><Sparkles className="size-4" /> +{sparkBonus} Sparks bonus</span> : null}
                  </div>
                  <p className="mt-1 text-xs text-white/90">Hit 75%+ average match to trigger the Sparks bonus.</p>
                </div>

                <Button className="bg-zinc-900 text-white hover:bg-zinc-800" onClick={() => onOpenChange(false)}>
                  <Star className="mr-2 size-4" /> Finish game
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
