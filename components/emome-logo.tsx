import Image from "next/image";
import { cn } from "@/lib/utils";

type EmomeLogoProps = {
  className?: string;
  variant?: "full" | "icon";
};

export function EmomeLogo({ className, variant = "full" }: EmomeLogoProps) {
  if (variant === "icon") {
    return (
      <div className={cn("relative h-9 w-9", className)}>
        <Image src="/emome-icon.png" alt="Emome" fill className="object-contain" sizes="36px" priority />
      </div>
    );
  }

  return (
    <div className={cn("relative h-[72px] w-[230px]", className)}>
      <Image
        src="/emome-wordmark.png"
        alt="Emome"
        fill
        className="object-contain object-left"
        sizes="230px"
        priority
      />
    </div>
  );
}
