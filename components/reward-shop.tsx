import { Sparkles } from "lucide-react";
import { shopItems } from "@/data/shop";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function RewardShop() {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {shopItems.map((item) => (
        <Card key={item.id}>
          <CardContent className="flex h-full flex-col p-5">
            <div className="mb-3 flex items-start justify-between gap-4">
              <div>
                <div className="text-lg font-black tracking-tight text-zinc-950">{item.name}</div>
                <div className="text-sm text-zinc-500">{item.description}</div>
              </div>
              {item.premium ? <Badge variant="dark">premium</Badge> : null}
            </div>
            <div className="mt-auto flex items-center justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-800">
                <Sparkles className="size-4 text-pink-500" />
                {item.price} Embers
              </div>
              <Button size="sm">Unlock</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
