import Link from "next/link";
import { Languages } from "lucide-react";

import { Button } from "@/components/ui/button";
import { localeNames, locales, type Locale } from "@/lib/i18n-config";
import { cn } from "@/lib/utils";

type LanguageSwitcherProps = {
  /** The language of the page we're on. */
  lang: Locale;
  /** Text for screen readers, e.g. "Switch language". */
  label: string;
  className?: string;
};

/**
 * A link to the same page in the other language.
 * On the English page it says "العربية"; on the Arabic page it says "English".
 */
export function LanguageSwitcher({ lang, label, className }: LanguageSwitcherProps) {
  // We only have two languages, so "the other one" is whichever isn't current.
  const otherLanguage = locales.find((locale) => locale !== lang) ?? lang;

  return (
    <Button variant="ghost" size="lg" className={cn("h-11 gap-2 px-3", className)} asChild>
      <Link
        href={`/${otherLanguage}`}
        hrefLang={otherLanguage}
        lang={otherLanguage}
        aria-label={label}
        title={label}
        data-testid="language-switcher"
      >
        <Languages />
        {/*
          The language name is written in that language on purpose ("العربية", not
          "Arabic"), so people who read it can find it. `data-i18n-ignore` tells our
          translation tests this is expected. `font-sans` makes it pick up the font
          for its own language (the link has lang="ar" or lang="en").
        */}
        <span data-i18n-ignore className="font-sans">
          {localeNames[otherLanguage]}
        </span>
      </Link>
    </Button>
  );
}
