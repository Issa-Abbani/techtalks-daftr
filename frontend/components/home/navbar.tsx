import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";

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
import { ThemeToggle } from "@/components/home/theme-toggle";
import type { Dictionary } from "@/lib/i18n";
import { getDirection, type Locale } from "@/lib/i18n-config";

type NavbarProps = { dict: Dictionary; lang: Locale };

export function Navbar({ dict, lang }: NavbarProps) {
  const t = dict.nav;
  const links = [
    { href: "#features", label: t.features },
    { href: "#how-it-works", label: t.howItWorks },
    { href: "#pricing", label: t.pricing },
    { href: "#about", label: t.about },
    { href: "#contact", label: t.contact },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-500">
      <nav
        aria-label={t.primaryNav}
        className="shell flex min-h-16 flex-wrap items-center justify-between gap-x-4 py-2.5"
      >
        <Logo name={dict.brand} href={`/${lang}`} />

        <ul className="hidden items-center gap-1 lg:flex" data-testid="desktop-links">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-md px-3 py-2 text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <LanguageSwitcher
            lang={lang}
            label={t.switchLanguage}
            className="hidden md:inline-flex"
          />
          <ThemeToggle label={t.toggleTheme} />
          <div className="ms-2 hidden items-center gap-2 md:flex">
            <Button variant="outline" size="lg" className="h-11 px-4 text-[15px]">
              {t.signIn}
            </Button>
            <Button size="lg" className="h-11 px-4 text-[15px]">
              {t.signUp}
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover/button:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover/button:-translate-x-0.5"
              />
            </Button>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon-lg"
                className="ms-1 size-11 lg:hidden"
                aria-label={t.openMenu}
                data-testid="mobile-menu-button"
              >
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent
              side={getDirection(lang) === "rtl" ? "left" : "right"}
              className="w-full max-w-xs"
              data-testid="mobile-menu"
            >
              <SheetHeader>
                <SheetTitle className="sr-only">{t.menuTitle}</SheetTitle>
                <Logo name={dict.brand} href={`/${lang}`} />
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-4">
                {links.map((link) => (
                  <li key={link.href}>
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
                <LanguageSwitcher
                  lang={lang}
                  label={t.switchLanguage}
                  className="justify-start"
                />
                <Button variant="outline" size="lg" className="h-11">
                  {t.signIn}
                </Button>
                <Button size="lg" className="h-11">
                  {t.signUp}
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
