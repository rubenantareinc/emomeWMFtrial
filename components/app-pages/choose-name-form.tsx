"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function ChooseNameForm({ initialName }: { initialName: string }) {
  const [preferredName, setPreferredName] = useState(initialName);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = preferredName.trim();
    if (trimmed.length < 2 || trimmed.length > 30) {
      setError(trimmed.length < 2 ? "Please enter at least 2 characters." : "Please enter 30 characters or fewer.");
      return;
    }
    if (busy) return;
    setBusy(true);
    setError("");

    let response: Response;
    let data: { error?: string; preferredName?: string; preferredNameConfirmedAt?: string };
    try {
      response = await fetch("/api/profile/preferred-name", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ preferredName: trimmed })
      });
      data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : {};
    } catch {
      setBusy(false);
      setError("Could not save your name. Check your connection and try again.");
      return;
    }

    if (!response.ok || !data.preferredNameConfirmedAt) {
      setBusy(false);
      setError(data.error ?? "Could not save your name.");
      return;
    }

    window.location.replace("/app/play");
  }

  return (
    <form className="mt-7 space-y-4" onSubmit={onSubmit} noValidate>
      <div>
        <label htmlFor="preferredName" className="text-sm font-bold text-zinc-900">Your name</label>
        <Input id="preferredName" value={preferredName} onChange={(event) => setPreferredName(event.target.value)} placeholder="Ruben, John, Emma…" aria-invalid={Boolean(error)} aria-describedby={error ? "preferredName-error" : undefined} className="mt-2 focus-visible:ring-rose-200" maxLength={30} />
        {error ? <p id="preferredName-error" role="alert" className="mt-2 text-sm font-semibold text-rose-600">{error}</p> : null}
      </div>
      <Button type="submit" className="w-full bg-gradient-to-r from-rose-500 to-orange-500 text-white" disabled={busy}>{busy ? "Saving…" : "Continue to Emome"}</Button>
    </form>
  );
}
