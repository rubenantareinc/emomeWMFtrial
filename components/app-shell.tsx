"use client";

import type React from "react";
import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, CircleEllipsis, Play, ShoppingBag, Target, Trophy, UserRound, type LucideIcon } from "lucide-react";
import { DevModeBadge } from "@/components/dev/dev-mode-badge";
import { EmomeLogo } from "@/components/emome-logo";
import { cn } from "@/lib/utils";

type NavItem = {
  href: Route;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { href: "/app/play", label: "Play", icon: Play },
  { href: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/app/leaderboards", label: "Leaderboards", icon: Trophy },
  { href: "/app/quests", label: "Quests", icon: Target },
  { href: "/app/shop", label: "Shop", icon: ShoppingBag },
  { href: "/app/profile", label: "Profile", icon: UserRound },
  { href: "/app/more", label: "More", icon: CircleEllipsis }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-zinc-50/40">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-zinc-200 bg-white px-7 py-8 lg:block">
        <EmomeLogo className="mb-10" />
        <nav className="space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 rounded-2xl px-4 py-3.5 text-[17px] font-bold text-zinc-700 transition-colors",
                  active ? "bg-zinc-100 text-zinc-950" : "hover:bg-zinc-100/80 hover:text-zinc-950"
                )}
              >
                <Icon className={cn("size-5", active ? "text-rose-500" : "text-zinc-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="px-4 pb-10 pt-4 lg:ml-72 lg:px-8 lg:pt-8">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 lg:hidden">
          <EmomeLogo variant="icon" />
          <nav className="flex flex-wrap justify-end gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold",
                    active ? "bg-zinc-900 text-white" : "bg-zinc-100 text-zinc-700"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </header>

        <div className="mb-4 flex justify-end">
          <DevModeBadge />
        </div>
        <main className="mx-auto w-full max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
