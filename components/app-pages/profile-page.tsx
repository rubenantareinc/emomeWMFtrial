"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Flame, Gem, Heart } from "lucide-react";
import { archetypeMap } from "@/data/archetypes";
import { SectionHeading } from "@/components/section-heading";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCoupleStore } from "@/lib/domain/couple-store";
import type { ArchetypeKey } from "@/types";

type ProfilePageContentProps = {
  profile: {
    name: string;
    preferredName: string | null;
    username: string;
    archetypeKey: ArchetypeKey | null;
    personalityScores: Record<ArchetypeKey, number> | null;
  };
};

const characterBackgrounds: Record<ArchetypeKey, string> = {
  anchor: "from-cyan-100 via-sky-50 to-teal-100",
  sentinel: "from-zinc-200 via-violet-100 to-slate-200",
  spark: "from-yellow-100 via-orange-100 to-sky-100",
  explorer: "from-amber-100 via-yellow-50 to-blue-100",
  harmonizer: "from-violet-100 via-fuchsia-50 to-indigo-100"
};

export function ProfilePageContent({ profile }: ProfilePageContentProps) {
  const state = useCoupleStore();
  const router = useRouter();
  const [preferredName, setPreferredName] = useState(profile.preferredName ?? profile.name);
  const [nameMessage, setNameMessage] = useState("");
  const [nameError, setNameError] = useState("");
  const [savingName, setSavingName] = useState(false);

  async function savePreferredName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = preferredName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      setNameError(trimmed.length < 2 ? "Please enter at least 2 characters." : "Please enter 30 characters or fewer.");
      return;
    }
    setSavingName(true);
    setNameError("");
    setNameMessage("");
    const response = await fetch("/api/profile/preferred-name", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ preferredName: trimmed })
    });
    const data = (await response.json()) as { error?: string };
    setSavingName(false);
    if (!response.ok) {
      setNameError(data.error ?? "Could not save your name.");
      return;
    }
    setNameMessage("Preferred name updated.");
    router.refresh();
  }
  const strongest = Object.entries(state.shared.dimensions).sort((a, b) => b[1] - a[1])[0];
  const archetypeKey = profile.archetypeKey ?? "anchor";
  const archetype = archetypeMap[archetypeKey];
  const personalityScore = profile.personalityScores?.[archetypeKey];

  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="Profile"
        title={profile.name}
        description={`@${profile.username} • Shared with ${state.partner.name}`}
      />

      <section
        className={`relative min-h-[250px] overflow-hidden rounded-[28px] border border-zinc-200 bg-gradient-to-br ${characterBackgrounds[archetypeKey]} shadow-sm`}
        aria-label={`${archetype.name} personality profile`}
      >
        <div className="relative z-10 max-w-xl p-7 sm:p-9">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-zinc-600">Your personality</p>
          <h2 className="mt-3 text-4xl font-black tracking-tight text-zinc-950">The {archetype.name}</h2>
          <p className="mt-3 max-w-sm text-sm font-medium leading-6 text-zinc-700">{archetype.tagline}</p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/80 bg-white/75 px-4 py-2 text-sm font-bold text-zinc-800 shadow-sm backdrop-blur">
            <span>{archetype.icon}</span>
            <span>{personalityScore != null ? `${Math.round(personalityScore)}% match` : "Primary personality"}</span>
          </div>
        </div>

        <div className="relative h-[290px] w-full sm:absolute sm:bottom-0 sm:right-4 sm:h-[250px] sm:w-[42%] lg:right-10 lg:w-[38%]">
          <Image
            src={`/${archetypeKey}.png`}
            alt={`${archetype.name} personality character`}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 38vw"
            className="object-contain object-bottom drop-shadow-[0_18px_18px_rgba(24,24,27,0.18)]"
          />
        </div>
      </section>

      <div className="grid gap-5 md:grid-cols-3">
        <StatCard
          label="Level"
          value={state.shared.level}
          icon={<Gem className="size-4 text-pink-500" />}
          helper={`${state.shared.xp} XP`}
        />
        <StatCard
          label="Shared streak"
          value={`${state.shared.streak} days`}
          icon={<Flame className="size-4 text-orange-500" />}
          helper={`Pulse ${state.shared.weeklyConnectionPulse}%`}
        />
        <StatCard
          label="Hearts"
          value={state.shared.hearts}
          icon={<Heart className="size-4 text-rose-500" />}
          helper={`${state.shared.embers} embers`}
        />
      </div>


      <Card>
        <CardContent className="p-5">
          <form className="space-y-3" onSubmit={savePreferredName}>
            <div>
              <label htmlFor="preferredName" className="text-sm font-bold text-zinc-900">What should Emome call you?</label>
              <p className="mt-1 text-sm text-zinc-600">This is the name your linked partner sees in Emome.</p>
              <Input id="preferredName" className="mt-3 max-w-sm" value={preferredName} onChange={(event) => setPreferredName(event.target.value)} maxLength={30} aria-invalid={Boolean(nameError)} aria-describedby={nameError ? "preferredName-error" : nameMessage ? "preferredName-message" : undefined} />
              {nameError ? <p id="preferredName-error" role="alert" className="mt-2 text-sm font-semibold text-rose-600">{nameError}</p> : null}
              {nameMessage ? <p id="preferredName-message" className="mt-2 text-sm font-semibold text-emerald-600">{nameMessage}</p> : null}
            </div>
            <Button type="submit" disabled={savingName}>{savingName ? "Saving…" : "Save name"}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-5 text-sm">
          <p className="font-bold">Relationship style snapshot</p>
          <p className="mt-2 text-zinc-600">
            Strongest dimension: <span className="font-semibold">{strongest?.[0]}</span> ({strongest?.[1]}%).
          </p>
          <p className="mt-1 text-zinc-600">Growth edge: conflict repair + consistency unlock faster momentum.</p>
        </CardContent>
      </Card>
    </div>
  );
}
