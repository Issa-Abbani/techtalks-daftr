import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ForwardArrow } from "@/components/home/forward-arrow";
import { LanguageSwitcher } from "@/components/home/language-switcher";
import { Logo } from "@/components/home/logo";
import { MobileMenu } from "@/components/home/mobile-menu";
import { getSectionLinks } from "@/components/home/section-links";
import { ThemeToggle } from "@/components/home/theme-toggle";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n-config";

type NavbarProps = {
  dict: Dictionary;
  lang: Locale;
};

/**
 * The bar at the top of the page. It sticks to the top while you scroll.
 *
 * What shows depends on the screen width:
 * - phones:          logo, theme toggle, menu button
 * - tablets (md):    + language switcher, Sign in and Get started
 * - desktops (lg):   + the section links, and the menu button goes away
 */
export function Navbar({ dict, lang }: NavbarProps) {
  const text = dict.nav;
  const sectionLinks = getSectionLinks(dict);

  return (
    <header className="sticky top-0 z-50 border-b bg-surface/90 backdrop-blur-xl motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-top-2 motion-safe:duration-500">
      {/* `flex-wrap` only kicks in when text is zoomed very large; normally everything fits on one row. */}
      <nav
        aria-label={text.primaryNav}
        className="shell flex min-h-16 flex-wrap items-center justify-between gap-x-4 py-2.5"
      >
        <Logo name={dict.brand} href={`/${lang}`} />

        <ul className="hidden items-center gap-1 lg:flex" data-testid="desktop-links">
          {sectionLinks.map((link) => (
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
          <LanguageSwitcher lang={lang} label={text.switchLanguage} className="hidden md:inline-flex" />
          <ThemeToggle label={text.toggleTheme} />

          <div className="ms-2 hidden items-center gap-2 md:flex">
            <Button variant="outline" size="lg" className="h-11 px-4 text-[15px]">
              {text.signIn}
            </Button>
            <Button size="lg" className="h-11 px-4 text-[15px]">
              {text.signUp}
              <ForwardArrow />
            </Button>
          </div>

          <MobileMenu dict={dict} lang={lang} />
        </div>
      </nav>
    </header>
  );
}
