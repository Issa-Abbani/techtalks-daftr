import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ForwardArrow } from "@/components/home/forward-arrow";
import { LanguageSwitcher } from "@/components/home/language-switcher";
import { Logo } from "@/components/home/logo";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n-config";

type FooterProps = {
  dict: Dictionary;
  lang: Locale;
};

/**
 * The bottom of the page: a last "sign up" banner, then the logo, three columns
 * of links, and the copyright line.
 *
 * Links with href "#" are placeholders for pages that don't exist yet
 * (dashboard, privacy policy, terms, sign in, sign up).
 */
export function Footer({ dict, lang }: FooterProps) {
  const content = dict.footer;
  const nav = dict.nav;

  const linkColumns = [
    {
      title: content.columns.product,
      links: [
        { label: nav.features, href: "#features" },
        { label: nav.howItWorks, href: "#how-it-works" },
        { label: nav.pricing, href: "#pricing" },
        { label: content.links.dashboard, href: "#" },
      ],
    },
    {
      title: content.columns.company,
      links: [
        { label: nav.about, href: "#about" },
        { label: nav.contact, href: "#contact" },
        { label: content.links.privacy, href: "#" },
        { label: content.links.terms, href: "#" },
      ],
    },
    {
      title: content.columns.account,
      links: [
        { label: nav.signIn, href: "#" },
        { label: nav.signUp, href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="shell py-16 sm:py-20">
        <SignUpBanner dict={dict} />

        <div data-reveal className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <Logo name={dict.brand} href={`/${lang}`} />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{content.tagline}</p>
          </div>

          {linkColumns.map((column) => (
            <div key={column.title}>
              <h3 className="text-base font-semibold">{column.title}</h3>
              <ul className="mt-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    {/* min-h-11 / min-w-11 make each link a 44px tap target on phones. */}
                    <Link
                      href={link.href}
                      className="inline-flex min-h-11 min-w-11 items-center text-[15px] text-muted-foreground transition-colors hover:text-foreground lg:min-h-9"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t pt-8 text-[15px] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>{content.copyright}</span>
          <div className="flex items-center gap-4">
            <span>{content.madeFor}</span>
            <LanguageSwitcher lang={lang} label={nav.switchLanguage} className="-me-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * The coloured "Close the notebook. Open Daftr." banner.
 *
 * Its buttons are drawn in the reverse of the usual colours (`on-primary` as the
 * fill), so they stand out against the coloured background in both themes.
 */
function SignUpBanner({ dict }: { dict: Dictionary }) {
  const content = dict.footer;

  return (
    <div
      data-reveal="zoom"
      className="relative overflow-hidden rounded-2xl bg-primary px-7 py-14 text-primary-foreground sm:px-14 sm:py-20"
    >
      <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-xl">
          <h2 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
            {content.ctaTitle}
          </h2>
          <p className="mt-4 text-lg text-on-primary sm:text-xl">{content.ctaDescription}</p>
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Button size="lg" className="h-12 bg-on-primary px-7 text-base text-primary hover:bg-primary-soft">
            {content.ctaPrimary}
            <ForwardArrow />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="h-12 border-on-primary/50 bg-transparent px-7 text-base text-on-primary hover:bg-on-primary/10 hover:text-on-primary dark:border-on-primary/50 dark:bg-transparent dark:hover:bg-on-primary/10"
            asChild
          >
            <a href="#contact">{content.ctaSecondary}</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
