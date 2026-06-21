"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Heart, Sparkles } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDemoStore } from "@/lib/demo-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const schema = z.object({
  mood: z.string().min(2),
  energy: z.string().min(2),
  closeness: z.coerce.number().min(1).max(10),
  appreciation: z.string().min(4),
  concern: z.string().optional()
});

type FormInput = z.input<typeof schema>;
type FormValues = z.output<typeof schema>;

const presets = {
  mood: ["calm", "hopeful", "a little overwhelmed", "playful", "soft"],
  energy: ["low", "steady", "high", "social", "gentle"]
};

export function DailyCheckInForm() {
  const [submitting, setSubmitting] = useState(false);
  const saveCheckIn = useDemoStore((state) => state.saveCheckIn);

  const form = useForm<FormInput, undefined, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      mood: "hopeful",
      energy: "steady",
      closeness: 8,
      appreciation: "You made today feel lighter.",
      concern: ""
    }
  });

  async function onSubmit(values: FormValues) {
    setSubmitting(true);
    saveCheckIn(values);
    toast.success("Daily check-in saved", {
      description: "Your streak nudged upward in demo mode."
    });
    setSubmitting(false);
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Mood</label>
              <Input list="mood-preset" {...form.register("mood")} />
              <datalist id="mood-preset">
                {presets.mood.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-zinc-700">Energy</label>
              <Input list="energy-preset" {...form.register("energy")} />
              <datalist id="energy-preset">
                {presets.energy.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Closeness score (1-10)</label>
            <Input type="number" min={1} max={10} {...form.register("closeness", { valueAsNumber: true })} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Appreciation</label>
            <Textarea {...form.register("appreciation")} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-700">Anything tender to watch out for?</label>
            <Textarea {...form.register("concern")} />
          </div>
          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={submitting}>
              <Heart className="mr-2 size-4" />
              Save check-in
            </Button>
            <Button variant="secondary" type="button" onClick={() => form.reset()}>
              <Sparkles className="mr-2 size-4" />
              Reset gently
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
