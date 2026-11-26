import Link from "next/link";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localeNames, locales, type Locale } from "@/lib/i18n-config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  lang: Locale;
  label: string;
  className?: string;
};

export function LanguageSwitcher({ lang, label, className }: LanguageSwitcherProps) {
  const target = locales.find((locale) => locale !== lang) ?? lang;

  return (
    <Button
      variant="ghost"
      size="lg"
      className={cn("h-11 gap-2 px-3", className)}
      asChild
    >
      <Link
        href={`/${target}`}
        hrefLang={target}
        lang={target}
        aria-label={label}
        title={label}
        data-testid="language-switcher"
      >
        <Languages />
        {/* Shown in its own language on purpose, so it is excluded from translation checks. */}
        <span data-i18n-ignore>{localeNames[target]}</span>
      </Link>
    </Button>
  );
}
