import { Check, Lock, Sparkles, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PathNode } from "@/types/domain";

const OFFSET_PATTERN = ["center", "left", "right", "left", "center", "right", "left"] as const;
type OffsetMode = (typeof OFFSET_PATTERN)[number];

function placementClass(mode: OffsetMode) {
  if (mode === "left") return "-translate-x-12 sm:-translate-x-20";
  if (mode === "right") return "translate-x-12 sm:translate-x-20";
  return "translate-x-0";
}

export function getNodeOffset(index: number): OffsetMode {
  return OFFSET_PATTERN[index % OFFSET_PATTERN.length];
}

// Adapter type to maintain compatibility with existing UI
type PathLessonNode = PathNode & {
  status: "locked" | "available" | "completed" | "waiting_for_partner" | "mastered";
};

export function PathNode({ node, index, isNext, onSelect }: { node: PathLessonNode; index: number; isNext: boolean; onSelect: (node: PathNode) => void }) {
  const mastered = node.status === "mastered";
  const locked = node.status === "locked" || node.status === "waiting_for_partner";
  const completed = node.status === "completed" || mastered;
  const chest = node.type === "chest";
  const available = node.status === "available";
  const sizeClass = chest ? "size-[86px] sm:size-[94px]" : isNext ? "size-[98px] sm:size-[106px]" : "size-[90px] sm:size-[98px]";
  const offset = getNodeOffset(index);

  return (
    <div id={node.id} className="relative flex justify-center py-6 sm:py-7">
      <div className={cn("relative", placementClass(offset))}>
        {isNext ? (
          <span className="absolute -top-7 left-1/2 -translate-x-1/2 rounded-full bg-rose-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-rose-700">
            Next
          </span>
        ) : null}

        <button
          type="button"
          onClick={() => onSelect(node)}
          className={cn(
            "group relative grid place-items-center rounded-full text-white transition-transform duration-200",
            sizeClass,
            !locked && "hover:-translate-y-1 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-rose-200",
            locked && "cursor-not-allowed"
          )}
          aria-label={node.title}
        >
          <span
            className={cn(
              "absolute inset-x-2 -bottom-2 h-8 rounded-full blur-[1px]",
              locked && "bg-zinc-300/70",
              completed && "bg-rose-400/60",
              available && !completed && "bg-rose-500/60"
            )}
          />
          <span
            className={cn(
              "absolute inset-0 translate-y-1 rounded-full",
              locked && "bg-zinc-300",
              completed && "bg-gradient-to-b from-rose-400 to-rose-500",
              available && !completed && !chest && "bg-gradient-to-b from-rose-500 to-red-500",
              chest && !locked && "bg-gradient-to-b from-orange-400 to-amber-500"
            )}
          />
          <span
            className={cn(
              "relative grid size-full place-items-center rounded-full border-2",
              locked && "border-zinc-200 bg-zinc-200 text-zinc-500",
              completed && "border-rose-300 bg-gradient-to-b from-rose-300 via-pink-400 to-rose-500",
              available && !completed && !chest && "border-rose-200 bg-gradient-to-b from-pink-400 via-rose-500 to-red-500",
              chest && !locked && "border-amber-100 bg-gradient-to-b from-amber-300 to-orange-500"
            )}
          >
            {locked ? <Lock className="size-7" /> : null}
            {completed ? <Check className="size-8" /> : null}
            {available && !completed && !chest ? <Star className="size-8" /> : null}
            {chest && !locked ? <Trophy className="size-8" /> : null}
          </span>
        </button>

        <div className="mt-2 text-center">
          <p className="text-xs font-bold text-zinc-700">{node.shortLabel || node.title}</p>
          <p className="text-[11px] text-zinc-500">{locked ? (node.status === "waiting_for_partner" ? "Waiting for partner" : "Locked") : completed ? "Done" : chest ? "Milestone" : `+${node.xpReward} XP`}</p>
        </div>
      </div>
      {node.isMilestone ? <Sparkles className="absolute right-[20%] top-4 size-4 text-rose-300" /> : null}
    </div>
  );
}
