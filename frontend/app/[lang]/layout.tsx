import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";

import { BootScript } from "@/components/boot-script";
import { getDictionary } from "@/lib/i18n";
import { getDirection, hasLocale, locales } from "@/lib/i18n-config";
import "../globals.css";

/*
 * The root layout: the <html> and <body> around every page.
 *
 * It lives inside the [lang] folder, so the language is part of the URL
 * (/en or /ar) and this layout knows which language to set up.
 */

/*
 * Fonts are downloaded at build time and served from our own site.
 *
 * English text uses Geist. Arabic text (anything inside lang="ar") uses
 * IBM Plex Sans Arabic, including the Latin bits on the Arabic page like prices
 * and emails, which is why it loads the "latin" subset too. globals.css picks
 * the right one with `:lang(ar)` (see "Fonts" there).
 */
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

// Not preloaded: English visitors mostly never need it, and the browser fetches it as soon as Arabic text appears.
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
  preload: false,
});

/** Build a page for each language ahead of time: /en and /ar. */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

/** The page title and description that show in the browser tab and in search results. */
export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};

  const dict = getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    // Tells search engines the same page exists in the other language.
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;

  // Any language we don't support (like /fr) shows the 404 page.
  if (!hasLocale(lang)) notFound();

  const fontVariables = `${geist.variable} ${geistMono.variable} ${plexArabic.variable}`;

  return (
    // `dir` flips the whole layout for Arabic (right to left).
    // `suppressHydrationWarning` is needed because BootScript adds classes to
    // <html> before React loads, which React would otherwise complain about.
    <html
      lang={lang}
      dir={getDirection(lang)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${fontVariables} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <BootScript />
        {children}
      </body>
    </html>
  );
}
