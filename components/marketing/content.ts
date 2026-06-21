import { HeartHandshake, LockKeyhole, MessageCircleHeart, RefreshCw, ShieldCheck, Sparkles, Sprout, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type Challenge = { title: string; slug: string; image: string; benefit: string; time: string; category: string };
export const challenges: Challenge[] = [
  { title: "Pulse Check", slug: "pulse-check", image: "/daily-quests/spark/pulse-check.png", benefit: "Understand how your partner is feeling before assumptions take over.", time: "3–5 min", category: "Connect" },
  { title: "Guess Your Partner", slug: "guess-your-partner", image: "/daily-quests/anchor/guess-your-partner.png", benefit: "Discover how accurately you understand each other.", time: "3–5 min", category: "Understand" },
  { title: "Appreciation Drop", slug: "appreciation-drop", image: "/daily-quests/harmony/appreciation-drop.png", benefit: "Turn small moments of gratitude into a daily habit.", time: "3–5 min", category: "Appreciate" },
  { title: "Memory Quest", slug: "memory-quest", image: "/daily-quests/explorer/memory-quest.png", benefit: "Reconnect through the memories that shaped your relationship.", time: "4–6 min", category: "Remember" },
  { title: "Repair Mission", slug: "repair-mission", image: "/daily-quests/sentinel/repair-mission.png", benefit: "Move from tension toward a constructive conversation.", time: "5 min", category: "Repair" },
  { title: "Future Forge", slug: "future-forge", image: "/daily-quests/spark/future-forge.png", benefit: "Build shared plans and discover where your visions align.", time: "4–6 min", category: "Dream" },
];

export const credibilityItems = ["Built for meaningful daily connection", "Private couple experiences", "Personalized emotional archetypes", "Five-minute relationship challenges"];

export const workSteps = [
  { icon: Sparkles, title: "Discover your emotional style", body: "Take the onboarding quiz and meet your Emome archetype.", image: "/1discover.png" },
  { icon: UsersRound, title: "Invite your partner", body: "Connect both accounts securely using a private invite.", image: "/3invite.png" },
  { icon: HeartHandshake, title: "Play one short challenge", body: "Complete a meaningful relationship activity in approximately five minutes.", image: "/daily-quests/anchor/pulse-check.png" },
  { icon: Sprout, title: "Grow together", body: "Build streaks and notice patterns in communication, appreciation, trust, fun, and repair.", image: "/4growtogether.png" },
];

export const benefits: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: MessageCircleHeart, title: "Understand each other", body: "Discover what your partner feels, needs, and values." },
  { icon: ShieldCheck, title: "Communicate before conflict grows", body: "Create a regular space for conversations that are usually postponed." },
  { icon: RefreshCw, title: "Repair with more clarity", body: "Use guided challenges to move from tension toward understanding." },
  { icon: HeartHandshake, title: "Build a relationship habit", body: "Turn consistency into shared streaks, milestones, and progress." },
];

export const privacyPoints = [
  { icon: LockKeyhole, title: "Private by default", body: "Your couple experience is designed for the two of you, not an audience." },
  { icon: ShieldCheck, title: "You control sharing", body: "No public sharing is shown without explicit consent." },
  { icon: UsersRound, title: "Secure account access", body: "Existing authentication routes protect sign-in, sign-up, and partner connection." },
];
