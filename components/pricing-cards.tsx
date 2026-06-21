"use client";

import { Check, Crown } from "lucide-react";
import { pricingPlans } from "@/data/shop";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export function PricingCards() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {pricingPlans.map((plan) => (
        <Card key={plan.id} className={plan.highlighted ? "border-pink-200 bg-pink-50" : "border-zinc-200 bg-white"}>
          <CardContent className="flex h-full flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-pink-500">{plan.name}</div>
                <div className="mt-2 text-3xl font-black tracking-tight text-zinc-950">{plan.priceLabel}</div>
              </div>
              {plan.highlighted ? <Crown className="size-5 text-pink-500" /> : null}
            </div>
            <p className="mb-5 text-sm text-zinc-600">{plan.description}</p>
            <div className="space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className="flex gap-3 text-sm text-zinc-700">
                  <Check className="mt-0.5 size-4 text-pink-500" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
            <Button className="mt-6 w-full">{plan.cta}</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
