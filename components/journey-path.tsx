"use client";

import { motion } from "framer-motion";
import { Gift, HeartHandshake, Lock, ShieldCheck, Sparkles, Star } from "lucide-react";
import { JourneyNode } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useDemoStore } from "@/lib/demo-store";

function iconForType(type: JourneyNode["type"]) {
  switch (type) {
    case "daily":
      return HeartHandshake;
    case "quest":
      return Sparkles;
    case "reward":
      return Gift;
    case "premium":
      return Star;
    case "review":
      return ShieldCheck;
    default:
      return Sparkles;
  }
}

export function JourneyPath({ nodes }: { nodes: JourneyNode[] }) {
  const { completeNode, journeyCompletion } = useDemoStore();

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/90 p-5 shadow-soft">
      <div className="absolute bottom-10 left-10 top-10 w-[6px] rounded-full bg-gradient-to-b from-pink-300 via-rose-300 to-orange-200" />
      <div className="space-y-5">
        {nodes.map((node, index) => {
          const Icon = iconForType(node.type);
          const completed = journeyCompletion[node.id] ?? node.completed;
          return (
            <motion.div
              key={node.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              className="relative flex gap-4"
            >
              <div
                className={cn(
                  "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-4 border-white shadow-soft",
                  completed
                    ? "bg-emome-gradient text-white"
                    : node.locked
                      ? "bg-zinc-100 text-zinc-400"
                      : "bg-white text-zinc-900"
                )}
              >
                {node.locked ? <Lock className="size-5" /> : <Icon className="size-5" />}
              </div>
              <div className="flex-1 rounded-[26px] border border-border bg-[#fffaf9] p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-zinc-950">{node.title}</h3>
                      {node.premium ? <span className="rounded-full bg-zinc-950 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white">Premium</span> : null}
                      {node.streakShield ? <span className="rounded-full bg-pink-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-pink-600">Shield</span> : null}
                    </div>
                    <p className="mt-1 text-sm text-zinc-600">{node.subtitle}</p>
                  </div>
                  <div className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-zinc-700">+{node.xp} XP</div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    size="sm"
                    disabled={node.locked || completed}
                    onClick={() => completeNode(node.id, node.xp)}
                  >
                    {completed ? "Completed" : node.locked ? "Locked" : "Complete node"}
                  </Button>
                  <div className="text-xs font-medium text-zinc-500">
                    {completed ? "You cleared this one. Cute." : "One tap in demo mode. Wire this to Supabase responses in production."}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
