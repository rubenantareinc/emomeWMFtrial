import type React from "react";
import type { Route } from "next";
import Link from "next/link";
import { Bell, CreditCard, Download, Lock, Settings, Shield, Trash2, UserRound } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SimulatedPartnerPanel } from "@/components/dev/simulated-partner-panel";

type MoreCard = {
  title: string;
  description: string;
  href?: Route;
  icon: React.ComponentType<{ className?: string }>;
};

const cards: MoreCard[] = [
  { title: "Settings", description: "Profile and app preferences.", href: "/settings", icon: Settings },
  { title: "Billing", description: "Manage plans and invoices.", href: "/premium", icon: CreditCard },
  { title: "Notifications", description: "Daily nudges and streak alerts.", icon: Bell },
  { title: "Privacy", description: "Visibility and account controls.", icon: Shield },
  { title: "Export data", description: "Download your activity history.", icon: Download },
  { title: "Delete data", description: "Permanently clear profile and app data.", icon: Trash2 },
  { title: "Account", description: "Email and security settings.", icon: Lock },
  { title: "Partner profile", description: "View and edit linked couple details.", href: "/couple", icon: UserRound }
];

export function MorePageContent() {
  return (
    <div className="space-y-6">
      <SectionHeading
        kicker="More"
        title="More actions"
        description="Secondary actions for settings, billing, exports, and account controls."
      />
      <div className="grid gap-5 lg:grid-cols-2">
        {cards.map(({ title, description, href, icon: Icon }) => (
          <Card key={title}>
            <CardContent className="p-6">
              <div className="mb-4 inline-flex rounded-2xl bg-pink-50 p-3">
                <Icon className="size-5 text-pink-500" />
              </div>
              <h2 className="text-xl font-black tracking-tight text-zinc-950">{title}</h2>
              <p className="mt-2 text-sm text-zinc-600">{description}</p>
              <div className="mt-4">{href ? <Link className="text-sm font-semibold text-pink-600 hover:text-pink-700" href={href}>Open</Link> : <Input placeholder={`${title} placeholder`} />}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <SimulatedPartnerPanel />
    </div>
  );
}
