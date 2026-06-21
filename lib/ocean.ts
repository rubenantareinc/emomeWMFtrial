export type OceanTrait = "O" | "C" | "E" | "A" | "N";

export type OceanQuestion = {
  id: string;
  trait: OceanTrait;
  prompt: string;
  reverse?: boolean;
};

export type OceanAnswerMap = Record<string, number>;

export type OceanScore = {
  scores: Record<OceanTrait, number>;
  primaryTrait: OceanTrait;
};

export const OCEAN_QUESTIONS: OceanQuestion[] = [
  { id: "o1", trait: "O", prompt: "I enjoy discovering new ideas, places, or perspectives with people I care about." },
  { id: "c1", trait: "C", prompt: "I feel most connected when promises are followed through and plans are clear." },
  { id: "e1", trait: "E", prompt: "I naturally bring energy into conversations and shared moments." },
  { id: "a1", trait: "A", prompt: "I often notice what someone needs emotionally and try to support them." },
  { id: "n1", trait: "N", prompt: "I quickly pick up on subtle shifts in mood, tone, or emotional distance." },
  { id: "o2", trait: "O", prompt: "Trying something unfamiliar together feels exciting rather than uncomfortable." },
  { id: "c2", trait: "C", prompt: "Reliable routines and thoughtful structure help my relationships feel safe." },
  { id: "e2", trait: "E", prompt: "I am usually the person who helps others open up or get the moment moving." },
  { id: "a2", trait: "A", prompt: "Keeping emotional harmony matters deeply to me in close relationships." },
  { id: "n2", trait: "N", prompt: "When something feels off between people, I tend to notice before it is said out loud." },
];

const TRAITS: OceanTrait[] = ["O", "C", "E", "A", "N"];

export function scoreOcean(answers: OceanAnswerMap): OceanScore {
  const totals = Object.fromEntries(TRAITS.map((trait) => [trait, 0])) as Record<OceanTrait, number>;
  const counts = Object.fromEntries(TRAITS.map((trait) => [trait, 0])) as Record<OceanTrait, number>;

  for (const question of OCEAN_QUESTIONS) {
    const answer = answers[question.id];
    if (typeof answer !== "number") {
      throw new Error(`Missing answer for question ${question.id}`);
    }
    const normalized = question.reverse ? 6 - answer : answer;
    totals[question.trait] += normalized;
    counts[question.trait] += 1;
  }

  const scores = Object.fromEntries(
    TRAITS.map((trait) => [trait, Number((totals[trait] / counts[trait]).toFixed(2))]),
  ) as Record<OceanTrait, number>;

  const primaryTrait = TRAITS.reduce((best, trait) => (scores[trait] > scores[best] ? trait : best), "O" as OceanTrait);
  return { scores, primaryTrait };
}
