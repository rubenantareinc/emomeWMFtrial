import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-28 w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-pink-400 focus:ring-2 focus:ring-pink-200",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
