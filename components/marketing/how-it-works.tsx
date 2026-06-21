import Image from "next/image";
import { workSteps } from "./content";
import { cn } from "@/lib/utils";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[.24em] text-rose-500">How it works</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">
            A meaningful ritual, not another chore.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workSteps.map((s, n) => {
            const Icon = s.icon;
            const isPulseCheck = s.title === "Play one short challenge";
            const imageClassName = isPulseCheck
              ? "h-[125px] w-[95%] max-w-[260px] object-contain"
              : n === 0
                ? "size-[120px] object-contain md:size-[130px]"
                : n === 1
                  ? "size-[125px] object-contain"
                  : "size-[125px] object-contain md:size-[135px]";

            return (
              <article key={s.title} className="rounded-[2rem] border bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-2xl bg-zinc-950 font-black text-white">
                    {n + 1}
                  </span>
                  <Icon className="size-5 text-rose-500" />
                </div>
                <div className="my-5 grid h-40 place-items-center rounded-[1.5rem] bg-rose-50">
                  <Image
                    src={s.image}
                    alt=""
                    width={isPulseCheck ? 260 : 150}
                    height={isPulseCheck ? 160 : 150}
                    className={cn("mx-auto", imageClassName)}
                  />
                </div>
                <h3 className="text-xl font-black text-zinc-950">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{s.body}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
