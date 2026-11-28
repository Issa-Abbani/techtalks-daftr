/*
 * The languages the site supports.
 *
 * This file has no imports on purpose: proxy.ts uses it too, and that runs
 * on every request, so it should stay small.
 */

/** Every supported language. The first part of each URL is one of these (/en, /ar). */
export const locales = ["en", "ar"] as const;

/** A supported language code: "en" or "ar". */
export type Locale = (typeof locales)[number];

/** Used when we can't tell which language a visitor prefers. */
export const defaultLocale: Locale = "en";

/** Each language's name written in that language, for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

/** Languages written right to left. */
const rightToLeftLocales: Locale[] = ["ar"];

/**
 * Checks whether a string from the URL is a language we support.
 * TypeScript then treats it as a `Locale` inside an `if (hasLocale(x))` block.
 */
export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** "rtl" for Arabic, "ltr" for everything else. Used for the `dir` attribute on <html>. */
export function getDirection(locale: Locale): "ltr" | "rtl" {
  return rightToLeftLocales.includes(locale) ? "rtl" : "ltr";
}
