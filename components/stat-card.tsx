import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  helper,
  className
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  helper?: string;
  className?: string;
}) {
  return (
    <Card className={cn("border-zinc-200 bg-white shadow-sm", className)}>
      <CardContent className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{label}</div>
          {icon}
        </div>
        <div className="text-2xl font-black tracking-tight text-zinc-950">{value}</div>
        {helper ? <div className="mt-2 text-sm text-zinc-500">{helper}</div> : null}
      </CardContent>
    </Card>
  );
}
