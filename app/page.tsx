"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
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

const LOADING_MESSAGES = ["Reading your emotional energy…", "Finding your Emome character…", "Your character is ready…"];

export default function Home() {
  const [stage, setStage] = useState<Stage>("landing");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<OceanAnswerMap>>({});
  const [resultTrait, setResultTrait] = useState<OceanTrait | null>(null);
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const progress = stage === "result" ? 100 : Math.round((Object.keys(answers).length / OCEAN_QUESTIONS.length) * 100);
  const question = OCEAN_QUESTIONS[questionIndex];
  const character = resultTrait ? CHARACTERS_BY_TRAIT[resultTrait] : null;

  useEffect(() => {
    for (const path of CHARACTER_IMAGE_PATHS) {
      const img = new window.Image();
      img.src = path;
    }
  }, []);

  useEffect(() => {
    if (stage !== "loading") return;
    const timer = window.setTimeout(() => setStage("result"), 950);
    return () => window.clearTimeout(timer);
  }, [stage]);

  const loadingMessage = useMemo(() => LOADING_MESSAGES[Math.min(Math.floor(Math.random() * LOADING_MESSAGES.length), LOADING_MESSAGES.length - 1)], [stage]);

  function startQuiz() {
    setStage("quiz");
    setQuestionIndex(0);
    setShareStatus(null);
  }

  function selectAnswer(value: number) {
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    window.setTimeout(() => {
      if (questionIndex < OCEAN_QUESTIONS.length - 1) {
        setQuestionIndex((current) => current + 1);
        return;
      }

      const completedAnswers = nextAnswers as OceanAnswerMap;
      const score = scoreOcean(completedAnswers);
      setResultTrait(score.primaryTrait);
      setStage("loading");
    }, 180);
  }

  function goBack() {
    if (questionIndex === 0) {
      setStage("landing");
      return;
    }
    setQuestionIndex((current) => current - 1);
  }

  function tryAgain() {
    setAnswers({});
    setQuestionIndex(0);
    setResultTrait(null);
    setShareStatus(null);
    setStage("landing");
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
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareStatus("Copied your result and quiz link.");
    } catch {
      setShareStatus("Sharing is unavailable right now — you can screenshot this card instead.");
    }
  }

  return (
    <main className="relative min-h-[100svh] overflow-hidden bg-[#fff7ef] text-[#241816]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,134,92,0.28),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(130,94,255,0.18),transparent_26%),linear-gradient(180deg,#fffaf5_0%,#fff0e5_100%)]" />
      <div className="absolute -left-20 top-32 h-48 w-48 rounded-full bg-rose-200/40 blur-3xl" />
      <div className="absolute -right-24 bottom-10 h-56 w-56 rounded-full bg-orange-200/60 blur-3xl" />

      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-6xl flex-col px-4 py-5 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between" aria-label="Emome WMF quiz">
          <Image src="/emome-wordmark.png" alt="Emome" width={168} height={53} priority className="h-12 w-auto object-contain" />
          <div className="rounded-full border border-[#241816]/10 bg-white/60 px-3 py-1 text-xs font-semibold text-[#5f4b45] shadow-sm backdrop-blur">WMF 2026</div>
        </header>

        {stage === "landing" && <LandingScreen onStart={startQuiz} />}
        {stage === "quiz" && <QuizScreen answers={answers} goBack={goBack} progress={progress} questionIndex={questionIndex} selectAnswer={selectAnswer} />}
        {stage === "loading" && <LoadingScreen message={loadingMessage} />}
        {stage === "result" && character && <ResultScreen character={character} onShare={() => void shareResult(character)} onTryAgain={tryAgain} shareStatus={shareStatus} />}
      </div>
    </main>
  );
}

function LandingScreen({ onStart }: { onStart: () => void }) {
  return (
    <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
      <div className="max-w-xl space-y-6">
        <div className="inline-flex rounded-full border border-orange-200 bg-white/70 px-4 py-2 text-sm font-bold text-[#8c4433] shadow-sm backdrop-blur">Personality • relationships • emotional intelligence</div>
        <div className="space-y-4">
          <h1 className="text-5xl font-black leading-[0.94] tracking-[-0.055em] text-[#231715] sm:text-6xl lg:text-7xl">Which Emome character are you?</h1>
          <p className="max-w-lg text-xl leading-8 text-[#6b5650]">Discover how you naturally show up in relationships.</p>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Quiz details">
          {["10 questions", "Less than one minute", "Private and instant"].map((item) => (
            <span key={item} className="rounded-full bg-white/75 px-4 py-2 text-sm font-bold text-[#4f3d38] shadow-sm ring-1 ring-black/5">{item}</span>
          ))}
        </div>
        <button onClick={onStart} className="w-full rounded-3xl bg-[#241816] px-7 py-5 text-lg font-black text-white shadow-xl shadow-orange-900/20 transition hover:-translate-y-0.5 hover:bg-[#3a2420] focus:outline-none focus:ring-4 focus:ring-orange-300 sm:w-auto">Discover my character</button>
        <p className="text-sm font-semibold text-[#806860]">Created by Emome — emotional intelligence for relationships.</p>
      </div>
      <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4" aria-hidden="true">
        {Object.values(CHARACTERS_BY_TRAIT).map((character, index) => (
          <div key={character.name} className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br ${character.accent} p-3 ${index === 4 ? "col-span-2 mx-auto w-1/2 min-w-40" : ""}`}>
            <Image src={character.imagePath} alt="" width={260} height={260} priority={index < 2} className="aspect-square w-full object-contain drop-shadow-2xl" />
          </div>
        ))}
      </div>
    </section>
  );
}

function QuizScreen({ answers, goBack, progress, questionIndex, selectAnswer }: { answers: Partial<OceanAnswerMap>; goBack: () => void; progress: number; questionIndex: number; selectAnswer: (value: number) => void }) {
  const question = OCEAN_QUESTIONS[questionIndex];
  const selected = answers[question.id];
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-5 py-5">
      <div>
        <div className="mb-3 flex items-center justify-between text-sm font-bold text-[#6f5851]">
          <button onClick={goBack} className="rounded-full bg-white/75 px-4 py-2 shadow-sm ring-1 ring-black/5 transition hover:bg-white focus:outline-none focus:ring-4 focus:ring-orange-300">Back</button>
          <span aria-live="polite">{questionIndex + 1} of {OCEAN_QUESTIONS.length}</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/70 shadow-inner" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Quiz progress">
          <div className="h-full rounded-full bg-gradient-to-r from-orange-400 via-rose-400 to-violet-400 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <div key={question.id} className="rounded-[2rem] border border-white/80 bg-white/78 p-5 shadow-2xl shadow-orange-900/10 backdrop-blur animate-[fadeIn_.22s_ease-out] sm:p-8">
        <p className="mb-3 text-sm font-black uppercase tracking-[0.2em] text-[#b65f41]">Tune into yourself</p>
        <h2 className="text-3xl font-black leading-tight tracking-[-0.04em] sm:text-4xl">{question.prompt}</h2>
        <div className="mt-7 grid gap-3">
          {ANSWERS.map((answer) => (
            <button key={answer.value} onClick={() => selectAnswer(answer.value)} className={`flex min-h-14 items-center justify-between rounded-2xl px-5 py-4 text-left text-base font-extrabold shadow-sm ring-1 transition focus:outline-none focus:ring-4 focus:ring-orange-300 ${selected === answer.value ? "bg-[#241816] text-white ring-[#241816]" : "bg-white/90 text-[#3d2b27] ring-black/5 hover:-translate-y-0.5 hover:bg-white"}`}>
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

function ResultScreen({ character, onShare, onTryAgain, shareStatus }: { character: EmomeCharacter; onShare: () => void; onTryAgain: () => void; shareStatus: string | null }) {
  return (
    <section className="flex flex-1 items-center justify-center py-6">
      <div className={`grid w-full max-w-5xl overflow-hidden rounded-[2.2rem] bg-white/82 shadow-2xl ${character.glow} ring-1 ring-white/90 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]`}>
        <div className={`relative flex items-center justify-center bg-gradient-to-br ${character.accent} p-6 sm:p-8`}>
          <Image src={character.imagePath} alt={`${character.name}, ${character.title} character artwork`} width={520} height={520} priority className="w-full max-w-sm object-contain drop-shadow-2xl animate-[reveal_.45s_ease-out]" />
        </div>
        <div className="space-y-5 p-6 sm:p-8 lg:p-10">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#a7543a]">You are the…</p>
            <h1 className="mt-1 text-5xl font-black tracking-[-0.06em] sm:text-6xl">{character.name}</h1>
            <p className="text-xl font-black text-[#6a4e47]">{character.title}</p>
          </div>
          <p className="text-lg leading-8 text-[#54403b]">{character.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoBlock title="Relationship superpower" body={character.superpower} />
            <InfoBlock title="Possible blind spot" body={character.blindSpot} />
          </div>
          <blockquote className="rounded-3xl bg-[#241816] p-5 text-xl font-black leading-8 text-white">“{character.quote}”</blockquote>
          <p className="text-xs font-semibold text-[#806860]">A playful snapshot for self-reflection, not a clinical assessment.</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <button onClick={onShare} className="rounded-2xl bg-[#241816] px-5 py-4 font-black text-white shadow-lg transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Share my result</button>
            <a href={EMOME_WEBSITE_URL} target="_blank" rel="noreferrer" className="rounded-2xl bg-white px-5 py-4 text-center font-black text-[#241816] shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Discover Emome</a>
            <button onClick={onTryAgain} className="rounded-2xl bg-white/70 px-5 py-4 font-black text-[#241816] shadow-sm ring-1 ring-black/10 transition hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-orange-300">Try again</button>
          </div>
          {shareStatus && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800" role="status">{shareStatus}</p>}
        </div>
      </div>
      <style jsx>{`@keyframes reveal{from{opacity:0;transform:scale(.96) translateY(10px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
    </section>
  );
}

function InfoBlock({ title, body }: { title: string; body: string }) {
  return <div className="rounded-3xl bg-[#fff7ef] p-4 ring-1 ring-orange-100"><h3 className="mb-2 text-sm font-black uppercase tracking-[0.12em] text-[#a7543a]">{title}</h3><p className="font-semibold leading-6 text-[#5a4540]">{body}</p></div>;
}
