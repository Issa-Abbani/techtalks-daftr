import Link from "next/link";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

// Ledger text link: primary colour, underline on hover, at least 44px tall to tap.
// Also used for small buttons that should look like links.
export const textLinkClassName =
  "inline-flex min-h-11 items-center text-base font-medium text-primary underline-offset-4 hover:underline";

export function TextLink({ className, ...props }: ComponentProps<typeof Link>) {
  return <Link {...props} className={cn(textLinkClassName, className)} />;
}
