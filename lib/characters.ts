import type { OceanTrait } from "./ocean";

export const EMOME_WEBSITE_URL = "https://emome.xyz";

export type CharacterName = "Explorer" | "Architect" | "Spark" | "Anchor" | "Sentinel";

export type EmomeCharacter = {
  name: CharacterName;
  trait: OceanTrait;
  title: string;
  description: string;
  superpower: string;
  blindSpot: string;
  quote: string;
  imagePath: string;
  accent: string;
  glow: string;
};

// Character image mapping uses the approved repository artwork in public/.
// Architect intentionally uses the approved harmonizer.png asset while keeping
// the user-facing result label as Architect.
export const CHARACTERS_BY_TRAIT: Record<OceanTrait, EmomeCharacter> = {
  O: {
    name: "Explorer",
    trait: "O",
    title: "The Curious Connector",
    description:
      "You build connection through curiosity, possibility, and shared experiences. You are drawn to new ideas and enjoy discovering new sides of the people around you.",
    superpower: "You keep relationships growing through curiosity and adventure.",
    blindSpot: "You may chase novelty when a relationship needs patience and consistency.",
    quote: "Every person is a world waiting to be explored.",
    imagePath: "/explorer.png",
    accent: "from-amber-300 via-orange-300 to-rose-300",
    glow: "shadow-[0_24px_90px_rgba(245,132,75,0.35)]",
  },
  C: {
    name: "Architect",
    trait: "C",
    title: "The Trust Builder",
    description: "You create strong relationships through consistency, planning, and follow-through. People know they can depend on you.",
    superpower: "You turn intentions into actions and create stability.",
    blindSpot: "You may try to plan or control situations that require flexibility.",
    quote: "Trust is built one promise at a time.",
    imagePath: "/harmonizer.png",
    accent: "from-indigo-300 via-sky-300 to-emerald-200",
    glow: "shadow-[0_24px_90px_rgba(79,132,255,0.28)]",
  },
  E: {
    name: "Spark",
    trait: "E",
    title: "The Energy Giver",
    description: "You bring warmth, momentum, and social energy into relationships. You often make interactions feel lighter and more alive.",
    superpower: "You help people connect, open up, and create memorable moments.",
    blindSpot: "You may move quickly when someone else needs more space or quiet.",
    quote: "Connection begins when someone brings the energy.",
    imagePath: "/spark.png",
    accent: "from-fuchsia-300 via-rose-300 to-orange-200",
    glow: "shadow-[0_24px_90px_rgba(244,80,146,0.34)]",
  },
  A: {
    name: "Anchor",
    trait: "A",
    title: "The Emotional Safe Place",
    description: "You create emotional safety through empathy, patience, and support. People often feel understood and accepted around you.",
    superpower: "You make others feel heard, valued, and protected.",
    blindSpot: "You may prioritize harmony so much that you ignore your own needs.",
    quote: "People remember how safe they felt beside you.",
    imagePath: "/anchor.png",
    accent: "from-teal-200 via-emerald-200 to-lime-200",
    glow: "shadow-[0_24px_90px_rgba(28,183,132,0.28)]",
  },
  N: {
    name: "Sentinel",
    trait: "N",
    title: "The Emotional Guardian",
    description:
      "You notice emotional changes that others may miss. You are attentive, protective, and deeply aware of what could affect the people you care about.",
    superpower: "You detect emotional shifts early and protect what matters.",
    blindSpot: "You may overthink uncertainty or prepare for problems that have not happened.",
    quote: "You notice the signal before anyone hears the alarm.",
    imagePath: "/sentinel.png",
    accent: "from-violet-300 via-purple-300 to-slate-200",
    glow: "shadow-[0_24px_90px_rgba(124,92,255,0.30)]",
  },
};

export const CHARACTER_IMAGE_PATHS = Object.values(CHARACTERS_BY_TRAIT).map((character) => character.imagePath);
