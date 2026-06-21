import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-2xl border border-border bg-white px-4 py-2 text-sm outline-none transition placeholder:text-muted-foreground focus:border-pink-400 focus:ring-2 focus:ring-pink-200",
      className
    )}
    {...props}
  />
));

Input.displayName = "Input";
