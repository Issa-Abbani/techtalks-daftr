import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/home/language-switcher";
import { Logo } from "@/components/home/logo";
import type { Dictionary } from "@/lib/i18n";
import type { Locale } from "@/lib/i18n-config";

type FooterProps = { dict: Dictionary; lang: Locale };

export function Footer({ dict, lang }: FooterProps) {
  const t = dict.footer;
  const nav = dict.nav;
  const columns = [
    {
      title: t.columns.product,
      links: [
        { label: nav.features, href: "#features" },
        { label: nav.howItWorks, href: "#how-it-works" },
        { label: nav.pricing, href: "#pricing" },
        { label: t.links.dashboard, href: "#" },
      ],
    },
    {
      title: t.columns.company,
      links: [
        { label: nav.about, href: "#about" },
        { label: nav.contact, href: "#contact" },
        { label: t.links.privacy, href: "#" },
        { label: t.links.terms, href: "#" },
      ],
    },
    {
      title: t.columns.account,
      links: [
        { label: nav.signIn, href: "#" },
        { label: nav.signUp, href: "#" },
      ],
    },
  ];

  return (
    <footer className="border-t">
      <div className="shell py-16 sm:py-20">
        <div
          data-reveal="zoom"
          className="relative overflow-hidden rounded-2xl bg-primary px-7 py-14 text-primary-foreground sm:px-14 sm:py-20"
        >
          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-4xl leading-tight font-semibold tracking-tight text-balance sm:text-5xl">
                {t.ctaTitle}
              </h2>
              <p className="mt-4 text-lg text-on-primary sm:text-xl">{t.ctaDescription}</p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Button
                size="lg"
                className="h-12 bg-on-primary px-7 text-base text-primary hover:bg-primary-soft"
              >
                {t.ctaPrimary}
                <ArrowRight data-icon="inline-end" className="rtl:-scale-x-100" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-on-primary/50 bg-transparent px-7 text-base text-on-primary hover:bg-on-primary/10 hover:text-on-primary dark:border-on-primary/50 dark:bg-transparent dark:hover:bg-on-primary/10"
                asChild
              >
                <a href="#contact">{t.ctaSecondary}</a>
              </Button>
            </div>
          </div>
        </div>

        <div data-reveal className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
          <div className="max-w-xs sm:col-span-2 lg:col-span-1">
            <Logo name={dict.brand} href={`/${lang}`} />
            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t.tagline}</p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-base font-semibold">{col.title}</h3>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label}>
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
          <span>{t.copyright}</span>
          <div className="flex items-center gap-4">
            <span>{t.madeFor}</span>
            <LanguageSwitcher lang={lang} label={nav.switchLanguage} className="-me-3" />
          </div>
        </div>
      </div>
    </footer>
  );
}
