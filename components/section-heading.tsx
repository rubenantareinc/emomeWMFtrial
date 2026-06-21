import { ReactNode } from "react";

export function SectionHeading({
  kicker,
  title,
  description,
  action
}: {
  kicker?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {kicker ? <div className="text-xs font-bold uppercase tracking-[0.24em] text-pink-500">{kicker}</div> : null}
        <h1 className="text-3xl font-black tracking-tight text-zinc-950 md:text-4xl">{title}</h1>
        {description ? <p className="max-w-2xl text-sm text-zinc-600 md:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}
