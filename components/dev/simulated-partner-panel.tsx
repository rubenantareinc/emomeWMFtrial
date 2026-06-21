"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { archetypes } from "@/data/archetypes";
import { DEV_MODE } from "@/lib/constants";
import type { ArchetypeKey } from "@/types";

export function SimulatedPartnerPanel() {
  const [partnerName, setPartnerName] = useState("Simulated Partner");
  const [partnerArchetype, setPartnerArchetype] = useState<ArchetypeKey>("harmonizer");
  const [simulatePartner, setSimulatePartner] = useState(true);
  const [simulateBothSides, setSimulateBothSides] = useState(true);

  useEffect(() => {
    if (!DEV_MODE) return;
    fetch("/api/dev/state")
      .then((res) => res.json())
      .then((state) => {
        if (state.partner?.name) setPartnerName(state.partner.name);
        if (state.partner?.archetype) setPartnerArchetype(state.partner.archetype);
        setSimulatePartner(Boolean(state.flags?.simulatePartner));
        setSimulateBothSides(Boolean(state.flags?.simulateBothSides));
      })
      .catch(() => undefined);
  }, []);

  async function save(payload: Record<string, unknown>) {
    await fetch("/api/dev/state", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload)
    });
    window.location.reload();
  }

  if (!DEV_MODE) return null;

  return (
    <div className="rounded-3xl border border-fuchsia-200 bg-fuchsia-50/60 p-5">
      <h3 className="text-lg font-black text-zinc-900">Simulated Couple Mode</h3>
      <p className="mt-1 text-sm text-zinc-600">Dev-only controls for testing shared couple loops on one device.</p>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <Button variant={simulatePartner ? "default" : "outline"} onClick={() => save({ simulatePartner: !simulatePartner })}>
          {simulatePartner ? "Disable simulated partner" : "Enable simulated partner"}
        </Button>
        <Button variant={simulateBothSides ? "default" : "outline"} onClick={() => save({ simulateBothSides: !simulateBothSides })}>
          {simulateBothSides ? "Auto-complete partner on" : "Auto-complete partner off"}
        </Button>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto]">
        <Input value={partnerName} onChange={(event) => setPartnerName(event.target.value)} placeholder="Partner name" />
        <Button onClick={() => save({ partnerName })}>Save name</Button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_auto]">
        <select
          className="h-10 rounded-md border border-zinc-300 bg-white px-3 text-sm"
          value={partnerArchetype}
          onChange={(event) => setPartnerArchetype(event.target.value as ArchetypeKey)}
        >
          {archetypes.map((archetype) => (
            <option key={archetype.key} value={archetype.key}>{archetype.name}</option>
          ))}
        </select>
        <Button onClick={() => save({ partnerArchetype })}>Save archetype</Button>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-3">
        <Button variant="outline" onClick={() => save({ completeWaitingAsPartner: true })}>Complete as partner</Button>
        <Button variant="outline" onClick={() => save({ resetCouple: true })}>Reset couple data</Button>
        <Button variant="outline" onClick={() => save({ resetPreviewState: true })}>Reset preview state</Button>
      </div>
    </div>
  );
}
