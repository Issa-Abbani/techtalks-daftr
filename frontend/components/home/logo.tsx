import Link from "next/link";
import { BookOpenText } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  name: string;
  href: string;
  className?: string;
};

export function Logo({ name, href, className }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group/logo flex min-h-11 items-center gap-2.5 font-heading text-xl font-semibold tracking-tight text-foreground",
        className
      )}
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground transition-transform duration-300 group-hover/logo:-rotate-6">
        <BookOpenText className="size-[18px]" />
      </span>
      {name}
    </Link>
  );
}
