import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ReconstructedPathSection, PathUnitWithProgress } from "@/types/domain";

export function PathSectionMarker({ section, unit }: { section: ReconstructedPathSection; unit?: PathUnitWithProgress }) {
  return (
    <div className="flex justify-center px-2">
      <div
        className={cn(
          "w-full max-w-md rounded-3xl border px-5 py-4 text-center shadow-sm backdrop-blur",
          section.locked
            ? "border-zinc-200 bg-white/85"
            : "border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50"
        )}
      >
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">Section {section.order}</p>
        <h2 className="mt-1 text-xl font-black text-zinc-900">{section.title.replace(/^Section\s\d+\s—\s/, "")}</h2>
        <p className="mt-1 text-xs text-zinc-600">{section.subtitle}</p>
        {unit ? <p className="mt-2 text-xs font-semibold text-zinc-500">Now entering Unit {unit.order}: {unit.title}</p> : null}
        {section.locked ? <Lock className="mx-auto mt-2 size-4 text-zinc-400" /> : null}
      </div>
    </div>
  );
}
