"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { CHARACTERS_BY_TRAIT, CHARACTER_IMAGE_PATHS, EMOME_WEBSITE_URL, type EmomeCharacter } from "@/lib/characters";
import { OCEAN_QUESTIONS, scoreOcean, type OceanAnswerMap, type OceanTrait } from "@/lib/ocean";

type Stage = "landing" | "quiz" | "loading" | "result";

const ANSWERS = [
  { value: 1, label: "Strongly disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly agree" },
] as const;

const LOADING_MESSAGES: Record<OceanTrait, string> = {
  O: "Reading your emotional energy…",
  C: "Finding your Emome character…",
  E: "Your character is ready…",
  A: "Reading your emotional energy…",
  N: "Finding your Emome character…",
};

const ANSWER_TRANSITION_MS = 180;
const RESULT_REVEAL_MS = 950;
const KIOSK_RESET_SECONDS = 60;

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<OceanAnswerMap>>({});
  const [resultTrait, setResultTrait] = useState<OceanTrait | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES.O);
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);
  const [kioskCountdown, setKioskCountdown] = useState(KIOSK_RESET_SECONDS);
  const advanceTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const revealTimerRef = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const kioskIntervalRef = useRef<ReturnType<typeof window.setInterval> | null>(null);

  const answeredCount = Object.keys(answers).length;
  const currentProgress = stage === "result" || stage === "loading" ? 100 : Math.round((questionIndex / OCEAN_QUESTIONS.length) * 100);
  const question = OCEAN_QUESTIONS[questionIndex];
  const character = resultTrait ? CHARACTERS_BY_TRAIT[resultTrait] : null;

  const clearAdvanceTimer = useCallback(() => {
    if (advanceTimerRef.current) {
      window.clearTimeout(advanceTimerRef.current);
      advanceTimerRef.current = null;
    }
  }, []);

  const clearRevealTimer = useCallback(() => {
    if (revealTimerRef.current) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }, []);

  const resetQuizState = useCallback(() => {
    clearAdvanceTimer();
    clearRevealTimer();
    setAnswers({});
    setQuestionIndex(0);
    setResultTrait(null);
    setLoadingMessage(LOADING_MESSAGES.O);
    setShareStatus(null);
    setIsAdvancing(false);
    setKioskCountdown(KIOSK_RESET_SECONDS);
  }, [clearAdvanceTimer, clearRevealTimer]);

  useEffect(() => {
    for (const path of CHARACTER_IMAGE_PATHS) {
      const img = new window.Image();
      img.src = path;
    }
  }, []);

  useEffect(() => {
    setIsKioskMode(new URLSearchParams(window.location.search).get("kiosk") === "1");
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    clearRevealTimer();
    revealTimerRef.current = window.setTimeout(() => {
      setStage("result");
      revealTimerRef.current = null;
    }, RESULT_REVEAL_MS);
    return clearRevealTimer;
  }, [clearRevealTimer, stage]);

  useEffect(() => {
    return () => {
      clearAdvanceTimer();
      clearRevealTimer();
      if (kioskIntervalRef.current) window.clearInterval(kioskIntervalRef.current);
    };
  }, [clearAdvanceTimer, clearRevealTimer]);

  useEffect(() => {
    if (!isKioskMode || stage !== "result") {
      if (kioskIntervalRef.current) {
        window.clearInterval(kioskIntervalRef.current);
        kioskIntervalRef.current = null;
      }
      setKioskCountdown(KIOSK_RESET_SECONDS);
      return;
    }

    kioskIntervalRef.current = window.setInterval(() => {
      setKioskCountdown((current) => {
        if (current <= 1) {
          resetQuizState();
          setStage("landing");
          return KIOSK_RESET_SECONDS;
        }
        return current - 1;
      });
    }, 1000);

    return () => {
      if (kioskIntervalRef.current) {
        window.clearInterval(kioskIntervalRef.current);
        kioskIntervalRef.current = null;
      }
    };
  }, [isKioskMode, resetQuizState, stage]);

  function startQuiz() {
    resetQuizState();
    setStage("quiz");
  }

  function selectAnswer(value: number) {
    if (isAdvancing || stage !== "quiz") return;

    clearAdvanceTimer();
    setIsAdvancing(true);
    const activeQuestionIndex = questionIndex;
    const activeQuestion = OCEAN_QUESTIONS[activeQuestionIndex];
    const nextAnswers = { ...answers, [activeQuestion.id]: value };
    setAnswers(nextAnswers);

    advanceTimerRef.current = window.setTimeout(() => {
      advanceTimerRef.current = null;
      setIsAdvancing(false);

      if (activeQuestionIndex < OCEAN_QUESTIONS.length - 1) {
        setQuestionIndex(activeQuestionIndex + 1);
        return;
      }

      const completedAnswers = nextAnswers as OceanAnswerMap;
      const score = scoreOcean(completedAnswers);
      setResultTrait(score.primaryTrait);
      setLoadingMessage(LOADING_MESSAGES[score.primaryTrait]);
      setStage("loading");
    }, ANSWER_TRANSITION_MS);
  }

  function goBack() {
    clearAdvanceTimer();
    setIsAdvancing(false);
    if (questionIndex === 0) {
      setStage("landing");
      return;
    }
    setQuestionIndex((current) => Math.max(0, current - 1));
  }

  function tryAgain() {
    resetQuizState();
    setStage("landing");
  }

  async function copyWithFallback(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      return document.execCommand("copy");
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function shareResult(selectedCharacter: EmomeCharacter) {
    const url = window.location.href;
    const text = `I'm the ${selectedCharacter.name} — ${selectedCharacter.title}. Which Emome character are you?`;
    setShareStatus(null);

    try {
      if (navigator.share) {
        await navigator.share({ title: "My Emome character", text, url });
        setShareStatus("Shared successfully.");
        return;
      }
      const copied = await copyWithFallback(`${text} ${url}`);
      setShareStatus(copied ? "Copied your result and quiz link." : "Copy failed — screenshot this card to share it.");
    } catch {
      setShareStatus("Sharing is unavailable right now — you can screenshot this card instead.");
    }
  }

  let stageContent: ReactNode = null;
  if (stage === "landing") {
    stageContent = <LandingScreen onStart={startQuiz} />;
  } else if (stage === "quiz") {
    stageContent = (
      <QuizScreen
        answers={answers}
        answeredCount={answeredCount}
        goBack={goBack}
        isAdvancing={isAdvancing}
        progress={currentProgress}
        questionIndex={questionIndex}
        selectAnswer={selectAnswer}
      />
    );
  } else if (stage === "loading") {
    stageContent = <LoadingScreen message={loadingMessage} />;
  } else if (stage === "result" && character) {
    stageContent = (
      <ResultScreen
        character={character}
        kioskCountdown={isKioskMode ? kioskCountdown : null}
        onShare={() => void shareResult(character)}
        onTryAgain={tryAgain}
        shareStatus={shareStatus}
      />
    );
  }

  return (
    <main className="relative min-h-[100svh] overflow-x-hidden bg-[#fff7ef] text-[#241816]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,134,92,0.28),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(130,94,255,0.18),transparent_26%),linear-gradient(180deg,#fffaf5_0%,#fff0e5_100%)]" />
      <div className="pointer-events-none absolute -left-20 top-32 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-orange-200/60 blur-3xl" />

      <div className="safe-page-padding relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4" aria-label="Emome WMF quiz">
          <Image src="/emome-wordmark.png" alt="Emome" width={168} height={53} priority className="h-auto w-36 object-contain sm:w-[10.5rem]" />
          <div className="rounded-full border border-[#241816]/10 bg-white/70 px-3 py-1 text-xs font-extrabold tracking-wide text-[#5f4b45] shadow-sm backdrop-blur">WMF 2026</div>
        </header>

        {stageContent}
      </div>
    </main>
  );
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex rounded-full border border-orange-200 bg-white/75 px-4 py-2 text-xs font-black tracking-[0.22em] text-[#8c4433] shadow-sm backdrop-blur">EMOME TECHNOLOGIES PRESENTS</div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.055em] text-[#231715] sm:text-6xl lg:text-7xl">Which Emome character are you?</h1>
          <p className="max-w-lg text-xl leading-8 text-[#6b5650]">Discover how you naturally show up in relationships.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Quiz details">
          {["10 questions", "Less than one minute", "Private and instant"].map((item) => (
            <span key={item} className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold text-[#4f3d38] shadow-sm ring-1 ring-black/5">{item}</span>
          ))}
        </div>
        <button onClick={onStart} className="w-full rounded-3xl bg-[#241816] px-7 py-5 text-lg font-black text-white shadow-xl shadow-orange-900/20 transition hover:-translate-y-0.5 hover:bg-[#3a2420] focus:outline-none focus:ring-4 focus:ring-orange-300 sm:w-auto">Discover my character</button>
        <p className="text-sm font-black tracking-wide text-[#806860]">Track your relationships. Protect your emotions.</p>
      </div>
      <div className="relative mx-auto w-full max-w-md" aria-hidden="true">
        <div className="absolute inset-8 rounded-full bg-orange-200/40 blur-3xl" />
        <div className="relative rounded-[2.5rem] border border-white/80 bg-white/[0.54] p-4 shadow-2xl shadow-orange-900/10 backdrop-blur">
          <div className="grid grid-cols-2 gap-3">
            {Object.values(CHARACTERS_BY_TRAIT).map((character, index) => (
              <div key={character.name} className={`relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${character.accent} p-2.5 ${index === 4 ? "col-span-2 mx-auto w-1/2 min-w-40" : ""}`}>
                <Image src={character.imagePath} alt="" width={240} height={240} priority={index < 2} className="aspect-square w-full object-contain drop-shadow-2xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function QuizScreen({ answers, answeredCount, goBack, isAdvancing, progress, questionIndex, selectAnswer }: { answers: Partial<OceanAnswerMap>; answeredCount: number; goBack: () => void; isAdvancing: boolean; progress: number; questionIndex: number; selectAnswer: (value: number) => void }) {
  const question = OCEAN_QUESTIONS[questionIndex];
  const selected = answers[question.id];
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 py-5 sm:py-8">
      <div>
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#6f5851]">
          <button onClick={goBack} disabled={isAdvancing} className="rounded-full bg-white/80 px-4 py-2 shadow-sm ring-1 ring-black/5 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50">Back</button>
          <span aria-live="polite">{questionIndex + 1} of {OCEAN_QUESTIONS.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/70 shadow-inner" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label={`Quiz progress. Question ${questionIndex + 1} of ${OCEAN_QUESTIONS.length}. ${answeredCount} answered.`}>
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div key={question.id} className="relative overflow-hidden rounded-[2rem] border border-white/80 bg-white/[0.78] p-5 shadow-2xl shadow-orange-900/10 backdrop-blur animate-[fadeIn_.22s_ease-out] sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br from-orange-200/80 to-violet-200/60 blur-2xl" />
        <p className="relative mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#b65f41]">Tune into yourself</p>
        <h2 className="relative text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">{question.prompt}</h2>
        <div className="relative mt-7 grid gap-3">
          {ANSWERS.map((answer) => (
            <button key={answer.value} onClick={() => selectAnswer(answer.value)} disabled={isAdvancing} className={`flex min-h-14 items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-extrabold shadow-sm ring-1 transition focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-70 ${selected === answer.value ? "bg-[#241816] text-white ring-[#241816]" : "bg-white/90 text-[#3d2b27] ring-black/5 hover:-translate-y-0.5 hover:bg-white"}`}>
              <span>{answer.label}</span><span aria-hidden="true" className="text-xl">{selected === answer.value ? "●" : "○"}</span>
            </button>
          ))}
        </div>
      </div>
      <style jsx>{`@keyframes fadeIn{from{opacity:.2;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </section>
  );
}

function LoadingScreen({ message }: { message: string }) {
  return (
    <section className="flex flex-1 items-center justify-center py-12" aria-live="polite">
      <div className="text-center">
        <Image src="/emome-heart-beat.gif" alt="Emome heart animation" width={140} height={140} unoptimized className="mx-auto mb-6 rounded-full" />
        <p className="text-2xl font-black tracking-[-0.03em]">{message}</p>
      </div>
    </section>
  );
}

function ResultScreen({ character, kioskCountdown, onShare, onTryAgain, shareStatus }: { character: EmomeCharacter; kioskCountdown: number | null; onShare: () => void; onTryAgain: () => void; shareStatus: string | null }) {
  return (
    <section className="flex flex-1 items-center justify-center py-6 sm:py-8">
      <div className={`grid w-full max-w-5xl overflow-hidden rounded-[2.2rem] bg-white/[0.82] shadow-2xl ${character.glow} ring-1 ring-white/90 backdrop-blur lg:grid-cols-[0.86fr_1.14fr]`}>
        <div className={`relative flex min-h-72 items-center justify-center bg-gradient-to-br ${character.accent} p-6 sm:p-8`}>
          <Image src="/emome-wordmark.png" alt="Emome" width={120} height={38} className="absolute left-5 top-5 h-auto w-24 opacity-80" />
          <Image src={character.imagePath} alt={`${character.name}, ${character.title} character artwork`} width={520} height={520} priority className="w-full max-w-xs object-contain drop-shadow-2xl animate-[reveal_.45s_ease-out] sm:max-w-sm" />
        </div>
        <div className="safe-bottom-padding space-y-4 p-5 sm:p-7 lg:p-9">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-[#a7543a]">You are the…</p>
            <h1 className="mt-1 text-5xl font-black tracking-[-0.06em] sm:text-6xl">{character.name}</h1>
            <p className="text-xl font-black text-[#6a4e47]">{character.title}</p>
          </div>
          <p className="text-base leading-7 text-[#54403b] sm:text-lg">{character.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock title="Relationship superpower" body={character.superpower} />
            <InfoBlock title="Possible blind spot" body={character.blindSpot} />
          </div>
          <blockquote className="rounded-3xl bg-[#241816] p-4 text-lg font-black leading-7 text-white sm:p-5 sm:text-xl sm:leading-8">“{character.quote}”</blockquote>
          <p className="text-xs font-semibold text-[#806860]">A playful snapshot for self-reflection, not a clinical assessment.</p>
          {kioskCountdown !== null && <p className="rounded-2xl bg-orange-50 px-4 py-2 text-xs font-bold text-[#8c4433]" role="status">Booth mode: returning to the start in {kioskCountdown}s.</p>}
          <div className="grid gap-3 sm:grid-cols-3">
            <button onClick={onShare} className="rounded-2xl bg-[#241816] px-5 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Share my result</button>
            <a href={EMOME_WEBSITE_URL} target="_blank" rel="noreferrer" className="rounded-2xl bg-white px-5 py-4 text-center font-black text-[#241816] shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Discover Emome</a>
            <button onClick={onTryAgain} className="rounded-2xl bg-[#fff7ef] px-5 py-4 font-black text-[#241816] shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Try again</button>
          </div>
          {shareStatus && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{shareStatus}</p>}
        </div>
      </div>
      <style jsx>{`@keyframes reveal{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </section>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-3xl bg-[#fff7ef] p-4 ring-1 ring-orange-100">
      <h3 className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#a7543a]">{title}</h3>
      <p className="font-semibold leading-6 text-[#5a4540]">{body}</p>
    </div>
  );
}
