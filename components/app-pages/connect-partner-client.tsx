"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  initiallyLinked: boolean;
  partnerName?: string | null;
};

export function ConnectPartnerClient({ initiallyLinked, partnerName }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState(searchParams.get("code") ?? "");
  const [inviteCode, setInviteCode] = useState("");
  const [inviteUrl, setInviteUrl] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const pollingRef = useRef(false);

  const navigateAfterLinked = useCallback((preferredNameConfirmed: boolean) => {
    router.replace(preferredNameConfirmed ? "/app/play" : "/choose-name");
    router.refresh();
  }, [router]);

  useEffect(() => {
    if (initiallyLinked) return;
    let stopped = false;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function pollStatus() {
      if (stopped || pollingRef.current) return;
      pollingRef.current = true;
      try {
        const response = await fetch("/api/couple/status", { cache: "no-store" });
        const data = response.headers.get("content-type")?.includes("application/json")
          ? ((await response.json()) as { linked?: boolean; coupleId?: string | null; preferredNameConfirmed?: boolean })
          : null;

        if (!stopped && response.ok && data?.linked === true && data.coupleId) {
          navigateAfterLinked(Boolean(data.preferredNameConfirmed));
          stopped = true;
          return;
        }
      } catch {
        // Keep waiting; the next interval will retry transient network errors.
      } finally {
        pollingRef.current = false;
      }

      if (!stopped) timeoutId = setTimeout(pollStatus, 2000);
    }

    timeoutId = setTimeout(pollStatus, 2000);
    return () => {
      stopped = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [initiallyLinked, navigateAfterLinked]);

  async function createInvite() {
    setBusy(true);
    setError("");
    let response: Response;
    let data: { code?: string; url?: string; error?: string };
    try {
      response = await fetch("/api/partner-invite", { method: "POST" });
      data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : {};
    } catch {
      setBusy(false);
      setError("Could not generate invite. Check your connection and try again.");
      return;
    }
    setBusy(false);

    if (!response.ok) {
      setError(data.error ?? "Could not generate invite");
      return;
    }

    setInviteCode(data.code ?? "");
    setInviteUrl(data.url ?? "");
    setWaitingForPartner(true);
  }

  async function acceptInvite() {
    setBusy(true);
    setError("");

    let response: Response;
    let data: { error?: string; linked?: boolean; coupleId?: string | null; preferredNameConfirmed?: boolean };
    try {
      response = await fetch("/api/partner-link", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ code })
      });
      data = response.headers.get("content-type")?.includes("application/json") ? await response.json() : {};
    } catch {
      setBusy(false);
      setError("Could not link partner. Check your connection and try again.");
      return;
    }
    setBusy(false);

    if (!response.ok) {
      setError(data.error ?? "Could not link partner");
      return;
    }

    if (data.linked !== true || !data.coupleId) {
      setError(data.error ?? "Partner link response was incomplete. Please try again.");
      return;
    }

    router.replace("/choose-name");
    router.refresh();
  }

  if (initiallyLinked) {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-6">
        <h2 className="text-2xl font-black text-emerald-900">You’re linked 💞</h2>
        <p className="mt-2 text-sm text-emerald-800">
          {partnerName ? `You and ${partnerName} are connected.` : "Your shared couple account is active."} Daily games and progression are now shared.
        </p>
        <Button className="mt-4" onClick={() => router.push("/choose-name")}>Open shared journey</Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-2xl font-black text-zinc-950">Invite your partner</h2>
        <p className="mt-2 text-sm text-zinc-600">Create a secure code/link. When your partner accepts, your shared Emome journey unlocks.</p>
        <Button className="mt-4" onClick={createInvite} disabled={busy}>Generate invite</Button>
        {inviteCode ? (
          <div className="mt-4 space-y-2 rounded-2xl bg-zinc-50 p-4 text-sm">
            <div><span className="font-bold">Code:</span> {inviteCode}</div>
            <div className="break-all"><span className="font-bold">Link:</span> {inviteUrl}</div>
            {waitingForPartner ? <div className="font-semibold text-rose-600">Waiting for your partner…</div> : null}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-zinc-200 bg-white p-6">
        <h2 className="text-2xl font-black text-zinc-950">Accept partner invite</h2>
        <p className="mt-2 text-sm text-zinc-600">Paste your partner code to link both profiles securely.</p>
        <div className="mt-4 flex gap-3">
          <Input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="EM-XXXXXX" />
          <Button onClick={acceptInvite} disabled={!code || busy}>Connect</Button>
        </div>
        {error ? <p className="mt-3 text-sm text-rose-600">{error}</p> : null}
      </div>
    </div>
  );
}
