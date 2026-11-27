import { NextResponse, type NextRequest } from "next/server";

import { defaultLocale, hasLocale, locales, type Locale } from "@/lib/i18n-config";

/*
 * Runs before every page request (Next.js calls this file "proxy"; older
 * versions called it "middleware").
 *
 * Its only job: if someone visits a URL without a language, like "/", send them
 * to the same URL with their language added, like "/en" or "/ar".
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const alreadyHasLanguage = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (alreadyHasLanguage) return;

  const language = pickLanguage(request.headers.get("accept-language"));
  request.nextUrl.pathname = `/${language}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

/**
 * Picks the best language we support from the browser's Accept-Language header.
 *
 * The header lists languages in order of preference, each with an optional
 * weight, for example:  "ar-LB,ar;q=0.9,en;q=0.8"
 * We sort by weight and return the first one we support, or English if none match.
 */
function pickLanguage(acceptLanguageHeader: string | null): Locale {
  if (!acceptLanguageHeader) return defaultLocale;

  const preferences = acceptLanguageHeader.split(",").map((entry) => {
    const [tag, weight] = entry.trim().split(";q=");
    return {
      language: tag.toLowerCase().split("-")[0], // "ar-LB" -> "ar"
      weight: weight ? Number(weight) : 1, // no weight means most preferred
    };
  });

  preferences.sort((a, b) => b.weight - a.weight);

  for (const { language } of preferences) {
    if (hasLocale(language)) return language;
  }
  return defaultLocale;
}

/**
 * Which requests run through the proxy: everything except Next.js internals
 * (`/_next`), API routes and files with an extension (favicon.ico, images, ...).
 */
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
