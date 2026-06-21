import { socialGraph } from "@/data/demo";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, TrendingUp, Users } from "lucide-react";

export function NetworkGrid() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {socialGraph.map((couple) => (
        <Card key={couple.id} className="overflow-hidden">
          <div className="h-24 bg-emome-gradient" />
          <CardContent className="space-y-4 p-5">
            <div className="-mt-12 inline-flex rounded-full border-4 border-white bg-white px-4 py-2 text-sm font-black shadow-soft">
              {couple.signal}
            </div>
            <div>
              <div className="text-xl font-black tracking-tight text-zinc-950">{couple.displayName}</div>
              <div className="text-sm text-zinc-500">{couple.archetypePair}</div>
            </div>
            <div className="flex flex-wrap gap-2">
              {couple.badges.map((badge) => (
                <Badge key={badge} variant="outline">
                  {badge}
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-2xl bg-pink-50 p-3">
                <div className="font-black text-zinc-950">{couple.streak}</div>
                <div className="text-zinc-500">streak</div>
              </div>
              <div className="rounded-2xl bg-pink-50 p-3">
                <div className="font-black text-zinc-950">{couple.followers}</div>
                <div className="text-zinc-500">followers</div>
              </div>
              <div className="rounded-2xl bg-pink-50 p-3">
                <div className="font-black text-zinc-950">+{couple.trend}</div>
                <div className="text-zinc-500">trend</div>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              <div className="flex items-center gap-1"><Users className="size-4" /> {couple.city}</div>
              <div className="flex items-center gap-1"><Heart className="size-4" /> {couple.likes}</div>
              <div className="flex items-center gap-1"><TrendingUp className="size-4" /> L{couple.level}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
