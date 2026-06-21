"use client";

import { motion } from "framer-motion";

export function HeroOrb() {
  return (
    <div className="relative mx-auto flex aspect-square w-full max-w-[420px] items-center justify-center">
      <motion.div
        className="absolute inset-0 rounded-full bg-emome-gradient opacity-80 blur-3xl"
        animate={{ scale: [1, 1.07, 1], rotate: [0, 4, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="relative flex h-[300px] w-[300px] items-center justify-center rounded-full border border-white/60 bg-white/70 shadow-glow backdrop-blur"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="absolute inset-4 rounded-full border border-pink-200/70" />
        <div className="absolute inset-12 rounded-full border border-rose-200/70" />
        <div className="rounded-full bg-zinc-950 px-5 py-3 text-center text-white shadow-soft">
          <div className="text-xs uppercase tracking-[0.24em] text-pink-300">Relationship Pulse</div>
          <div className="mt-2 text-4xl font-black">86</div>
          <div className="text-sm text-zinc-300">Blooming this week</div>
        </div>
      </motion.div>
    </div>
  );
}
