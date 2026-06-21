"use client";

import Image from "next/image";
import { Check } from "lucide-react";
import { useState } from "react";

import { archetypes } from "@/data/archetypes";
import type { ArchetypeKey } from "@/types";

const art: Record<ArchetypeKey, string> = {
  anchor: "/anchor.png",
  sentinel: "/sentinel.png",
  spark: "/spark.png",
  explorer: "/explorer.png",
  harmonizer: "/harmonizer.png"
};

const activeStyles: Record<ArchetypeKey, string> = {
  anchor: "border-cyan-300 bg-cyan-50/45 shadow-[0_18px_50px_rgba(34,211,238,0.24)] ring-1 ring-cyan-200/70",
  sentinel: "border-fuchsia-300 bg-fuchsia-50/45 shadow-[0_18px_50px_rgba(217,70,239,0.24)] ring-1 ring-fuchsia-200/70",
  spark: "border-amber-300 bg-amber-50/50 shadow-[0_18px_50px_rgba(245,158,11,0.26)] ring-1 ring-amber-200/70",
  explorer: "border-orange-300 bg-orange-50/45 shadow-[0_18px_50px_rgba(251,146,60,0.24)] ring-1 ring-orange-200/70",
  harmonizer: "border-emerald-300 bg-emerald-50/45 shadow-[0_18px_50px_rgba(52,211,153,0.24)] ring-1 ring-emerald-200/70"
};

const previewStyles: Record<ArchetypeKey, string> = {
  anchor: "hover:border-cyan-200 hover:bg-cyan-50/25 hover:shadow-[0_14px_36px_rgba(34,211,238,0.16)]",
  sentinel: "hover:border-fuchsia-200 hover:bg-fuchsia-50/25 hover:shadow-[0_14px_36px_rgba(217,70,239,0.16)]",
  spark: "hover:border-amber-200 hover:bg-amber-50/30 hover:shadow-[0_14px_36px_rgba(245,158,11,0.17)]",
  explorer: "hover:border-orange-200 hover:bg-orange-50/25 hover:shadow-[0_14px_36px_rgba(251,146,60,0.16)]",
  harmonizer: "hover:border-emerald-200 hover:bg-emerald-50/25 hover:shadow-[0_14px_36px_rgba(52,211,153,0.16)]"
};

const indicatorStyles: Record<ArchetypeKey, string> = {
  anchor: "bg-cyan-500 text-white",
  sentinel: "bg-fuchsia-500 text-white",
  spark: "bg-amber-500 text-white",
  explorer: "bg-orange-500 text-white",
  harmonizer: "bg-emerald-500 text-white"
};

export function InteractiveArchetypeCards() {
  const [activeArchetype, setActiveArchetype] = useState<ArchetypeKey>("anchor");

  return (
    <div className="mt-10 grid items-stretch gap-5 md:grid-cols-2 lg:grid-cols-5" role="list" aria-label="Emome archetypes">
      {archetypes.map((archetype) => {
        const isActive = activeArchetype === archetype.key;

        return (
          <div key={archetype.key} className="h-full" role="listitem">
            <button
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveArchetype(archetype.key)}
              className={`group relative flex h-full w-full flex-col rounded-[2rem] border p-4 text-left shadow-sm outline-none transition-[background-color,border-color,box-shadow,transform] duration-300 ease-out focus-visible:ring-4 focus-visible:ring-rose-200 motion-reduce:transition-none motion-reduce:hover:transform-none ${
                isActive
                  ? `${activeStyles[archetype.key]} scale-[1.02] -translate-y-1`
                  : `border-zinc-200 bg-white ${previewStyles[archetype.key]} hover:-translate-y-1`
              }`}
            >
              {isActive ? (
                <span
                  className={`absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-black shadow-sm ${indicatorStyles[archetype.key]}`}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                  Selected
                </span>
              ) : null}
              <div className={`relative flex h-48 items-center justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br ${archetype.gradient} p-3 sm:h-56 md:h-64 lg:h-44 xl:h-52`}>
                <Image
                  src={art[archetype.key]}
                  alt={`${archetype.name} archetype character`}
                  width={420}
                  height={420}
                  className="h-full w-full object-contain drop-shadow-2xl"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <h3 className="mt-4 text-2xl font-black text-zinc-950">{archetype.name}</h3>
                <p className="mt-1 text-sm font-semibold text-rose-600">{archetype.tagline}</p>
                <p className="mt-3 text-sm text-zinc-600"><b>Strength:</b> {archetype.strengths[0]}</p>
                <p className="mt-2 text-sm text-zinc-600"><b>Growth:</b> {archetype.growthStyle}</p>
              </div>
            </button>
          </div>
        );
      })}
    </div>
  );
}
