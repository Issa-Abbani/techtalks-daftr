import type { Metadata } from "next";
import { Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";

import { BootScript } from "@/components/boot-script";
import { getDictionary } from "@/lib/i18n";
import { getDirection, hasLocale, locales } from "@/lib/i18n-config";
import "../globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const plexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-plex-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    alternates: { languages: { en: "/en", ar: "/ar" } },
  };
}

// Runs before first paint so the saved or system theme applies without a flash.
// The `js` class lets scroll-reveal animations hide content only when JavaScript can reveal it again.
const bootScript = `(function(){var r=document.documentElement;r.classList.add('js');try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;r.classList.toggle('dark',d)}catch(e){}})()`;

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={getDirection(lang)}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${geist.variable} ${geistMono.variable} ${plexArabic.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <BootScript code={bootScript} />
        {children}
      </body>
    </html>
  );
}
