import Link from "next/link";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/home/language-switcher";
import { Logo } from "@/components/home/logo";
import { getSectionLinks } from "@/components/home/section-links";
import type { Dictionary } from "@/lib/i18n";
import { getDirection, type Locale } from "@/lib/i18n-config";

type MobileMenuProps = {
  dict: Dictionary;
  lang: Locale;
};

/**
 * The menu button for phones and tablets, and the panel it opens.
 * Hidden on desktop (`lg:hidden`), where the links fit in the navbar.
 *
 * The panel slides in from the end of the screen: the right in English,
 * the left in Arabic.
 */
export function MobileMenu({ dict, lang }: MobileMenuProps) {
  const text = dict.nav;
  const slideInFrom = getDirection(lang) === "rtl" ? "left" : "right";

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon-lg"
          className="ms-1 size-11 lg:hidden"
          aria-label={text.openMenu}
          data-testid="mobile-menu-button"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side={slideInFrom} className="w-full max-w-xs" data-testid="mobile-menu">
        <SheetHeader>
          {/* Screen readers announce this title when the menu opens; it isn't shown on screen. */}
          <SheetTitle className="sr-only">{text.menuTitle}</SheetTitle>
          <Logo name={dict.brand} href={`/${lang}`} />
        </SheetHeader>

        <ul className="flex flex-col gap-1 px-4">
          {getSectionLinks(dict).map((link) => (
            <li key={link.href}>
              {/* SheetClose shuts the menu when a link is tapped, so the page isn't left covered. */}
              <SheetClose asChild>
                <Link
                  href={link.href}
                  className="block rounded-md px-3 py-3 text-lg font-medium transition-colors hover:bg-muted"
                >
                  {link.label}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <LanguageSwitcher lang={lang} label={text.switchLanguage} className="justify-start" />
          <Button variant="outline" size="lg" className="h-11">
            {text.signIn}
          </Button>
          <Button size="lg" className="h-11">
            {text.signUp}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
