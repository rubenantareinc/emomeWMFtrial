"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Flame, Gem, Heart, Info, Lock, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { RelationshipGameModal } from "@/components/activity/relationship-game-modal";
import { useGameStore } from "@/lib/game/game-store";
import { getPathData } from "@/lib/game/path-data";
import { gameByNodeId, GAME_NODE_IDS, type GameResult } from "@/lib/game/games";
import {
  initialRelationshipGameStorage,
  loadRelationshipGameStorage,
  resetRelationshipGameStorage,
  saveRelationshipGameStorage,
  type RelationshipGameStorage,
} from "@/lib/game/relationship-game-storage";
import {
  DAILY_QUEST_PRESENTATION,
  formatDailyQuestCountdown,
  gameById,
  getDailyQuestAssetFolder,
  getDailyQuestImagePath,
  getDailyQuestRemainingMs,
  getNextDailyQuestGameId,
} from "@/lib/game/daily-quest";
import type { ArchetypeKey, PathNode } from "@/types/domain";

type DashboardProgress = {
  totalXp: number;
  level: number;
  pathPosition: number;
};
type DashboardStreak = {
  current: number;
  longest: number;
  lastCompletedDate: string | null;
};
type DashboardGame = {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: number;
  xpReward: number;
  status: string;
  hasViewerAttempted: boolean;
  completionType: string;
  orderIndex: number;
  emoji: string | null;
  promptPayload: Record<string, unknown>;
};

type PlayPageContentProps = {
  viewerUserId: string | null;
  viewerName: string;
  archetypeKey: ArchetypeKey;
  coupleId: string | null;
  partnerName: string | null;
  progress: DashboardProgress | null;
  streak: DashboardStreak | null;
  todaysGames: DashboardGame[];
  demoMode: boolean;
};

export function PlayPageContent({
  viewerUserId,
  viewerName,
  partnerName,
  archetypeKey,
  coupleId,
  progress,
  streak,
  todaysGames,
  demoMode,
}: PlayPageContentProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<PathNode | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [celebration, setCelebration] = useState("");
  const [demoGames, setDemoGames] = useState<RelationshipGameStorage>(() =>
    demoMode && typeof window !== "undefined"
      ? loadRelationshipGameStorage()
      : initialRelationshipGameStorage(),
  );
  const [localTodaysGames, setLocalTodaysGames] = useState(todaysGames);
  const [localProgress, setLocalProgress] = useState(progress);
  const [localStreak, setLocalStreak] = useState(streak);
  const [nowMs, setNowMs] = useState<number | null>(null);
  const completingGameRef = useRef<string | null>(null);

  const {
    progression,
    relationship,
    isLoading,
    initialize,
    startNode,
    completeActivity,
    getInsights,
  } = useGameStore();

  useEffect(() => {
    setLocalTodaysGames(todaysGames);
    setLocalProgress(progress);
    setLocalStreak(streak);
  }, [progress, streak, todaysGames]);

  useEffect(() => {
    if (!coupleId || !viewerUserId) return;
    initialize(coupleId, viewerUserId);
  }, [coupleId, initialize, viewerUserId]);

  useEffect(() => {
    const updateNow = () => setNowMs(Date.now());
    const timeout = window.setTimeout(updateNow, 0);
    const interval = window.setInterval(updateNow, 1000);
    return () => {
      window.clearTimeout(timeout);
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (
      demoMode ||
      !coupleId ||
      !localTodaysGames.some(
        (game) => game.hasViewerAttempted && game.status !== "completed",
      )
    )
      return;
    let stopped = false;
    let inFlight = false;
    let timeoutId: number | undefined;

    const poll = async () => {
      if (stopped || inFlight) return;
      inFlight = true;
      try {
        const response = await fetch("/api/couples/dashboard", {
          cache: "no-store",
        });
        const payload = (await response.json()) as {
          dashboard?: {
            progress: DashboardProgress;
            streak: DashboardStreak;
            todaysGames: DashboardGame[];
          };
        };
        if (!stopped && response.ok && payload.dashboard) {
          setLocalTodaysGames(payload.dashboard.todaysGames);
          setLocalProgress(payload.dashboard.progress);
          setLocalStreak(payload.dashboard.streak);
          if (
            !payload.dashboard.todaysGames.some(
              (game) => game.hasViewerAttempted && game.status !== "completed",
            )
          )
            return;
        }
      } finally {
        inFlight = false;
        if (!stopped) timeoutId = window.setTimeout(poll, 2000);
      }
    };

    timeoutId = window.setTimeout(poll, 2000);
    return () => {
      stopped = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [coupleId, demoMode, localTodaysGames]);

  const firstAvailableSupabaseGame =
    localTodaysGames.find(
      (game) => game.status !== "completed" && !game.hasViewerAttempted,
    ) ??
    localTodaysGames[0] ??
    null;
  const realDailyGameId =
    GAME_NODE_IDS[
      Math.min(
        firstAvailableSupabaseGame?.orderIndex ?? 0,
        GAME_NODE_IDS.length - 1,
      )
    ];
  const realDailyQuestGame = realDailyGameId
    ? gameByNodeId[realDailyGameId]
    : null;
  const dailyQuestGame = demoMode
    ? (gameById[demoGames.dailyQuest.currentGameId] ?? gameById["pulse-check"])
    : (realDailyQuestGame ?? gameById["pulse-check"]);
  const dailyQuestPresentation = DAILY_QUEST_PRESENTATION[dailyQuestGame.id];
  const remainingMs =
    nowMs === null
      ? 0
      : getDailyQuestRemainingMs(demoGames.dailyQuest.nextAvailableAt, nowMs);
  const realGameState =
    !demoMode && firstAvailableSupabaseGame
      ? firstAvailableSupabaseGame.status === "completed"
        ? "completed"
        : firstAvailableSupabaseGame.hasViewerAttempted
          ? "waiting"
          : "available"
      : "available";
  const isDailyQuestLocked = demoMode
    ? remainingMs > 0
    : !firstAvailableSupabaseGame || realGameState !== "available";
  const countdownText = formatDailyQuestCountdown(remainingMs);
  const dailyQuestImagePath = getDailyQuestImagePath(
    archetypeKey,
    dailyQuestGame.id,
  );
  const assetFolder = getDailyQuestAssetFolder(archetypeKey);
  const currentDailyNode = useMemo(
    () =>
      getPathData().nodes.find((node) => node.id === dailyQuestGame.nodeId) ??
      null,
    [dailyQuestGame.nodeId],
  );

  const showBlockedMessage = (message: string) => {
    setCelebration(message);
    setTimeout(() => setCelebration(""), 2500);
  };

  const canOpenDailyQuest = (node: PathNode) => {
    const game = gameByNodeId[node.id];
    if (
      !game ||
      (demoMode && game.id !== demoGames.dailyQuest.currentGameId) ||
      node.id !== dailyQuestGame.nodeId
    ) {
      showBlockedMessage("Only today's Daily Quest is available.");
      return false;
    }
    if (isDailyQuestLocked) {
      showBlockedMessage(
        demoMode
          ? `Your next Daily Quest unlocks in ${countdownText}.`
          : "Today's Daily Quest is already complete.",
      );
      return false;
    }
    return true;
  };

  const handleNodeSelect = (node: PathNode) => {
    if (!canOpenDailyQuest(node)) return;
    setSelected(node);
    startNode(node.id);
  };

  const handleGameComplete = async (result: GameResult) => {
    if (!selected) return;
    const game = gameByNodeId[selected.id];
    if (!game) return;
    if (completingGameRef.current === game.id) return;
    completingGameRef.current = game.id;
    if (!demoMode) {
      if (!firstAvailableSupabaseGame) {
        completingGameRef.current = null;
        return;
      }
      try {
        const response = await fetch(
          `/api/couples/games/${firstAvailableSupabaseGame.id}/attempt`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              submittedPayload: {
                result,
                nodeId: selected.id,
                gameId: game.id,
              },
            }),
          },
        );
        const payload = (await response.json()) as {
          error?: string;
          status?: string;
          xpAwarded?: number;
        };
        if (!response.ok)
          throw new Error(payload.error ?? "Could not submit game");
        setLocalTodaysGames((games) =>
          games.map((item) =>
            item.id === firstAvailableSupabaseGame.id
              ? {
                  ...item,
                  hasViewerAttempted: true,
                  status: payload.status ?? item.status,
                }
              : item,
          ),
        );
        setCelebration(
          payload.status === "waiting_partner"
            ? "Submitted! Waiting for your partner."
            : `Game completed! +${payload.xpAwarded ?? result.xpEarned} XP`,
        );
        setTimeout(() => setCelebration(""), 2500);
        setSelected(null);
        router.refresh();
      } catch (error) {
        showBlockedMessage(
          error instanceof Error ? error.message : "Could not submit game",
        );
      } finally {
        completingGameRef.current = null;
      }
      return;
    }
    const nextIndex = GAME_NODE_IDS.findIndex((id) => id === selected.id) + 1;
    const nextNode = GAME_NODE_IDS[nextIndex];
    const completedAt = Number.isFinite(Date.parse(result.completedAt))
      ? result.completedAt
      : new Date().toISOString();
    const nextAvailableAt = new Date(
      Date.parse(completedAt) + 24 * 60 * 60 * 1000,
    ).toISOString();
    const updated: RelationshipGameStorage = {
      ...demoGames,
      completedGames: demoGames.completedGames.includes(game.id)
        ? demoGames.completedGames
        : [...demoGames.completedGames, game.id],
      results: { ...demoGames.results, [game.id]: result },
      xp: demoGames.xp + result.xpEarned,
      unlockedNodes: Array.from(
        new Set([
          ...demoGames.unlockedNodes,
          selected.id,
          ...(nextNode ? [nextNode] : []),
        ]),
      ),
      dailyQuest: {
        currentGameId: getNextDailyQuestGameId(game.id),
        lastCompletedAt: completedAt,
        nextAvailableAt,
      },
      relationshipSignals: {
        ...demoGames.relationshipSignals,
        ...(result.signal && typeof result.signalValue === "number"
          ? { [result.signal]: result.signalValue }
          : {}),
        consistency: Math.round(
          ((demoGames.completedGames.includes(game.id)
            ? demoGames.completedGames.length
            : demoGames.completedGames.length + 1) /
            GAME_NODE_IDS.length) *
            100,
        ),
      },
      lastSuggestedAction:
        result.suggestedAction || demoGames.lastSuggestedAction,
    };
    saveRelationshipGameStorage(updated);
    setDemoGames(updated);
    await completeActivity({ __gameResult: result, responseTime: 0 });
    setCelebration(`Game completed! +${result.xpEarned} XP`);
    setTimeout(() => setCelebration(""), 2500);
  };

  const handleResetDemo = async () => {
    if (!demoMode) return;
    resetRelationshipGameStorage();
    window.localStorage.removeItem("emome_progression");
    window.localStorage.removeItem("emome_activity_results");
    setDemoGames(initialRelationshipGameStorage());
    completingGameRef.current = null;
    setSelected(null);
    if (coupleId && viewerUserId) await initialize(coupleId, viewerUserId);
    setCelebration("Demo reset. Pulse Check is available now.");
    setTimeout(() => setCelebration(""), 2500);
  };

  if (isLoading || !progression || !relationship) {
    return (
      <div className="flex min-h-[320px] items-center justify-center p-8">
        <div className="rounded-2xl border border-rose-100 bg-white px-5 py-3 text-sm font-bold text-rose-600 shadow-sm">
          Loading your couple dashboard…
        </div>
      </div>
    );
  }

  const pathData = getPathData();
  const completedCount = demoMode
    ? demoGames.completedGames.length
    : localTodaysGames.filter(
        (game) => game.hasViewerAttempted || game.status === "completed",
      ).length;
  const displayXp = demoMode
    ? progression.totalXp
    : (localProgress?.totalXp ?? 0);
  const displayLevel = demoMode
    ? progression.level
    : (localProgress?.level ?? 1);
  const displayStreak = demoMode
    ? progression.streak.current
    : (localStreak?.current ?? 0);
  const progressPct = demoMode
    ? (progression.completedNodes.size / pathData.nodes.length) * 100
    : Math.min(
        100,
        ((localProgress?.pathPosition ?? 0) /
          Math.max(1, pathData.nodes.length)) *
          100,
      );
  const insights = getInsights();

  return (
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_292px] xl:gap-7">
      <div className="min-w-0 space-y-5">
        <section className="w-full rounded-2xl bg-gradient-to-r from-[#ff5b7f] via-[#ff6b6b] to-[#ff8a5b] px-5 py-3 text-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/85">
                Foundations • Core loop
              </p>
              <h1 className="text-xl font-black">
                {viewerName} + {partnerName ?? "Partner"}
              </h1>
            </div>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="inline-flex items-center gap-1 rounded-full border border-white/70 bg-white px-3 py-1.5 text-[11px] font-bold text-rose-600"
            >
              <Info className="size-3.5" /> HOW IT WORKS
            </button>
          </div>
          <Progress
            value={progressPct}
            className="mt-2 h-1.5 bg-white/30 [&>div]:bg-white"
          />
          <p className="mt-1 text-[11px] text-white/85">
            {completedCount}/
            {demoMode
              ? pathData.nodes.length
              : Math.max(localTodaysGames.length, 1)}{" "}
            {demoMode ? "nodes completed" : "daily activities submitted"} •{" "}
            {displayXp} XP • Level {displayLevel}
          </p>
        </section>

        {celebration ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-3 text-sm font-semibold text-emerald-700">
              <Trophy className="mr-1 inline size-4" />
              {celebration}
            </CardContent>
          </Card>
        ) : null}

        <Card className="overflow-hidden rounded-3xl border-zinc-200 bg-white shadow-sm">
          <CardContent className="p-4 sm:p-5">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">
                  Daily Quest
                </p>
                <h2 className="mt-1 text-2xl font-black text-zinc-950">
                  {demoMode
                    ? dailyQuestPresentation.title
                    : (firstAvailableSupabaseGame?.title ??
                      dailyQuestPresentation.title)}
                </h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {demoMode
                    ? `Today’s relationship quest, tuned for your ${assetFolder} path.`
                    : (firstAvailableSupabaseGame?.description ??
                      `Today’s relationship quest, tuned for your ${assetFolder} path.`)}
                </p>
              </div>
              <div className="shrink-0 rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-bold text-zinc-700">
                {demoMode
                  ? isDailyQuestLocked
                    ? `Next daily quest in ${countdownText}`
                    : "Available now"
                  : realGameState === "completed"
                    ? "Completed together"
                    : realGameState === "waiting"
                      ? "Waiting for partner"
                      : "Available now"}
              </div>
            </div>
            <button
              type="button"
              disabled={isDailyQuestLocked}
              onClick={() =>
                currentDailyNode && handleNodeSelect(currentDailyNode)
              }
              className="group relative block w-full overflow-hidden rounded-[1.75rem] border border-zinc-100 bg-zinc-50 text-left shadow-sm outline-none transition enabled:cursor-pointer enabled:hover:-translate-y-0.5 enabled:hover:shadow-lg focus-visible:ring-4 focus-visible:ring-rose-200 disabled:cursor-not-allowed"
              aria-label={`${assetFolder} ${dailyQuestPresentation.title} daily relationship quest`}
            >
              <Image
                src={dailyQuestImagePath}
                alt={`${assetFolder} ${dailyQuestPresentation.title} daily relationship quest`}
                width={1400}
                height={1000}
                priority
                className={`h-auto w-full transition duration-300 ${isDailyQuestLocked ? "opacity-60" : "group-enabled:group-hover:scale-[1.01]"}`}
              />
              {isDailyQuestLocked ? (
                <div className="absolute inset-0 flex items-center justify-center bg-zinc-950/25 p-4 text-center text-white">
                  <div className="rounded-2xl bg-zinc-950/70 px-4 py-3 shadow-lg backdrop-blur-sm">
                    <Lock className="mx-auto mb-2 size-5" />
                    <p className="text-sm font-black">
                      {demoMode
                        ? "Come back when the timer ends"
                        : realGameState === "completed"
                          ? "Completed together"
                          : "Your answer is submitted"}
                    </p>
                    <p className="mt-1 text-xs font-semibold text-white/85">
                      {demoMode
                        ? countdownText
                        : realGameState === "completed"
                          ? "Both partners completed it."
                          : "Waiting for your partner"}
                    </p>
                  </div>
                </div>
              ) : null}
            </button>
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-3 xl:sticky xl:top-6">
        <div className="rounded-2xl border border-zinc-200 bg-white px-3 py-2.5 shadow-sm">
          <div className="flex items-center justify-between gap-2 text-sm font-semibold text-zinc-700">
            <Counter src="/emome-gem-shine.gif" value={displayXp} />
            <Counter src="/emome-flame.gif" value={displayStreak} />
            <Counter src="/emome-heart-beat.gif" value={progression.hearts} />
          </div>
        </div>
        <div className="space-y-3">
          <Stat
            label="Shared streak"
            icon={<Flame className="size-4 text-orange-500" />}
            value={`${displayStreak} days`}
          />
          <Stat
            label="Relationship score"
            icon={<Heart className="size-4 text-rose-500" />}
            value={`${Math.round((relationship.trust + relationship.communication + relationship.intimacy + relationship.fun + relationship.consistency + relationship.emotionalSafety + relationship.futureAlignment) / 7)}%`}
          />
          <Stat
            label="Weekly momentum"
            icon={<Gem className="size-4 text-pink-500" />}
            value={`${Math.round(progressPct)}%`}
          />
          <div className="rounded-2xl border bg-white p-3 text-xs text-zinc-600">
            <p className="font-semibold text-zinc-900">Generated insight</p>
            <p className="mt-1">
              {insights[0] || "Complete more activities to see insights!"}
            </p>
          </div>
          {demoMode ? (
            <button
              onClick={handleResetDemo}
              className="w-full rounded-2xl border border-rose-100 bg-white p-3 text-left text-xs font-bold text-rose-600 shadow-sm hover:bg-rose-50"
            >
              Reset demo
            </button>
          ) : null}
        </div>
      </aside>

      <RelationshipGameModal
        node={selected}
        open={Boolean(selected)}
        partnerName={partnerName ?? "Partner"}
        completed={Boolean(
          selected &&
          gameByNodeId[selected.id] &&
          (demoMode
            ? demoGames.completedGames.includes(gameByNodeId[selected.id]!.id)
            : firstAvailableSupabaseGame?.status === "completed"),
        )}
        signals={demoGames.relationshipSignals}
        allResults={demoGames.results}
        onOpenChange={(o) => !o && setSelected(null)}
        onComplete={handleGameComplete}
        onReset={demoMode ? handleResetDemo : () => undefined}
        onReplay={(nodeId) => {
          const node = pathData.nodes.find((n) => n.id === nodeId);
          if (node) handleNodeSelect(node);
        }}
      />

      <Dialog open={showHowItWorks} onOpenChange={setShowHowItWorks}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>How Emome works</DialogTitle>
          </DialogHeader>
          <ul className="space-y-2 text-sm text-zinc-600">
            <li>
              • Complete short daily nodes to earn XP and progress through
              levels.
            </li>
            <li>
              • Your actions update relationship metrics like trust,
              communication, and intimacy.
            </li>
            <li>
              • Relationship score reflects your overall couple health based on
              completed activities.
            </li>
            <li>
              • Streaks reward consistency - maintain them to unlock bonuses.
            </li>
            <li>
              • Emome uses psychology-informed activities to strengthen
              relationships.
            </li>
          </ul>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Counter({ src, value }: { src: string; value: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <Image src={src} alt="counter" width={18} height={18} unoptimized />
      <span>{value}</span>
    </div>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="flex items-center justify-between p-3 text-sm">
        <span className="text-zinc-600">{label}</span>
        <span className="flex items-center gap-1 font-bold text-zinc-900">
          {icon}
          {value}
        </span>
      </CardContent>
    </Card>
  );
}

export function UnlinkedPlayState() {
  return (
    <div className="flex min-h-[320px] items-center justify-center p-6">
      <Card className="max-w-md rounded-3xl border-rose-100 bg-white shadow-sm">
        <CardContent className="p-6 text-center">
          <h1 className="text-xl font-black text-zinc-950">
            Connect your partner to play
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Your Play dashboard unlocks after both accounts are linked in the
            same active couple.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
