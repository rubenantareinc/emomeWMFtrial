import { InteractiveArchetypeCards } from "@/components/marketing/interactive-archetype-cards";

export function ArchetypeShowcase() {
  return (
    <section id="archetypes" className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[.24em] text-rose-500">Archetypes</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950 md:text-5xl">Meet the way you connect.</h2>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
            Your archetype personalizes your challenges, tone, insights, and growth path.
          </p>
        </div>
        <InteractiveArchetypeCards />
      </div>
    </section>
  );
}
