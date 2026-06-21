import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PathSection } from "@/lib/relationship-path";

export function PathSectionHeader({ section }: { section: PathSection }) {
  return (
    <Card className={cn("rounded-3xl border", section.locked ? "border-zinc-200 bg-zinc-50" : "border-rose-200 bg-gradient-to-r from-rose-50 via-pink-50 to-orange-50")}> 
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-zinc-500">{section.title}</p>
            <h2 className="mt-1 text-xl font-black text-zinc-900">{section.subtitle}</h2>
            <p className="mt-1 text-sm text-zinc-600">{section.description}</p>
          </div>
          {section.locked ? <Lock className="mt-1 size-4 text-zinc-400" /> : null}
        </div>
      </CardContent>
    </Card>
  );
}
