import { ArchetypeKey } from "@/types";
import { archetypeMap } from "@/data/archetypes";
import { cn } from "@/lib/utils";

export function ArchetypeMascot({ archetype, className }: { archetype: ArchetypeKey; className?: string }) {
  const item = archetypeMap[archetype];
  return (
    <div className={cn("relative aspect-square overflow-hidden rounded-[28px] bg-zinc-950 p-5 text-white shadow-glow", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-95", item.gradient)} />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.35),transparent_45%)]" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur">{item.name}</span>
          <span className="text-2xl">{item.icon}</span>
        </div>
        <svg viewBox="0 0 200 200" className="mx-auto h-36 w-36">
          <path
            d="M100 170c-5 0-10-2-14-5C58 145 30 127 30 88c0-22 18-40 40-40 11 0 21 4 30 12 9-8 19-12 30-12 22 0 40 18 40 40 0 39-28 57-56 77-4 3-9 5-14 5z"
            fill="rgba(255,255,255,0.94)"
          />
          <circle cx="78" cy="90" r="6" fill="#ff6a5b" />
          <circle cx="122" cy="90" r="6" fill="#ff6a5b" />
          <path d="M80 118c7 7 13 10 20 10s13-3 20-10" stroke="#ff6a5b" strokeWidth="6" strokeLinecap="round" />
          <path d="M46 42c18 2 33 9 44 20" stroke="rgba(255,255,255,0.65)" strokeWidth="8" strokeLinecap="round" />
        </svg>
        <div className="space-y-1">
          <p className="text-sm font-semibold">{item.tagline}</p>
          <p className="text-xs text-white/85">{item.notificationTone}</p>
        </div>
      </div>
    </div>
  );
}
