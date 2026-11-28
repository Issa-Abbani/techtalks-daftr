import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * The arrow at the end of buttons like "Get started".
 *
 * It points right in English and left in Arabic (`rtl:-scale-x-100` mirrors it),
 * and slides forward a little when you hover the button it sits in.
 * The `group/button` class it reacts to comes from our Button component.
 */
export function ForwardArrow({ className }: { className?: string }) {
  return (
    <ArrowRight
      data-icon="inline-end"
      className={cn(
        "transition-transform rtl:-scale-x-100",
        "group-hover/button:translate-x-0.5 rtl:group-hover/button:-translate-x-0.5",
        className
      )}
    />
  );
}
