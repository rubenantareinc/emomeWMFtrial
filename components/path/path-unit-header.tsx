import { cn } from "@/lib/utils";
import type { PathUnit } from "@/lib/relationship-path";

export function PathUnitHeader({ unit }: { unit: PathUnit }) {
  return (
    <div className={cn("rounded-2xl border px-4 py-3", unit.locked ? "border-zinc-200 bg-zinc-50" : unit.completed ? "border-emerald-200 bg-emerald-50" : "border-pink-200 bg-white")}> 
      <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Unit {unit.order}</p>
      <h3 className="text-base font-black text-zinc-900">{unit.title}</h3>
      <p className="text-xs text-zinc-600">{unit.subtitle}</p>
    </div>
  );
}
