"use client";

import Link from "next/link";
import { useState } from "react";
import { EmomeLogo } from "@/components/emome-logo";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type GoogleAuthCardProps = {
  mode: "sign-in" | "sign-up";
};

function GoogleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="size-5">
      <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.4-.18-2.07H12v3.91h5.38a4.6 4.6 0 0 1-2 3.02v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.37Z" />
      <path fill="#34A853" d="M12 22c2.7 0 4.97-.9 6.63-2.4l-3.24-2.51c-.9.6-2.05.96-3.39.96-2.61 0-4.82-1.76-5.61-4.13H3.04v2.59A10 10 0 0 0 12 22Z" />
      <path fill="#FBBC05" d="M6.39 13.92A6.02 6.02 0 0 1 6.07 12c0-.67.12-1.32.32-1.92V7.49H3.04A10 10 0 0 0 2 12c0 1.61.39 3.13 1.04 4.51l3.35-2.59Z" />
      <path fill="#EA4335" d="M12 5.95c1.47 0 2.79.51 3.83 1.5l2.87-2.87A9.65 9.65 0 0 0 12 2 10 10 0 0 0 3.04 7.49l3.35 2.59C7.18 7.71 9.39 5.95 12 5.95Z" />
    </svg>
  );
}

export function GoogleAuthCard({ mode }: GoogleAuthCardProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSignUp = mode === "sign-up";

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    if (!supabase) {
      setError("Authentication is not configured yet. Please try again shortly.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/app`
      }
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#fff8f7] px-4 py-10">
      <div className="pointer-events-none absolute -left-24 top-20 size-72 rounded-full bg-rose-200/55 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 size-80 rounded-full bg-orange-200/50 blur-3xl" />

      <section className="relative w-full max-w-md rounded-[32px] border border-white/80 bg-white/90 p-7 shadow-[0_24px_80px_rgba(244,63,94,0.14)] backdrop-blur md:p-9">
        <Link
          href="/"
          aria-label="Back to Emome home"
          className="mx-auto flex w-fit items-center justify-center"
        >
          <EmomeLogo className="block" />
        </Link>

        <div className="mt-3 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-500">Emome account</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-zinc-950">
            {isSignUp ? "Start your journey" : "Welcome back"}
          </h1>
          <p className="mt-2 text-sm leading-6 text-zinc-600">
            {isSignUp
              ? "Create your private relationship space and discover your emotional archetype."
              : "Sign in to continue your relationship journey and saved progress."}
          </p>
        </div>

        <Button
          type="button"
          variant="secondary"
          className="mt-7 w-full gap-3 border-zinc-200 bg-white text-zinc-900 shadow-sm"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          <GoogleIcon />
          {loading ? "Connecting…" : "Continue with Google"}
        </Button>

        {error ? (
          <p role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </p>
        ) : null}

        <p className="mt-6 text-center text-xs leading-5 text-zinc-500">
          By continuing, you agree to Emome&apos;s terms and privacy policy. Your relationship data remains private by default.
        </p>

        <p className="mt-5 text-center text-sm text-zinc-600">
          {isSignUp ? "Already have an account?" : "New to Emome?"}{" "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-bold text-rose-600 hover:text-rose-700">
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  );
}
