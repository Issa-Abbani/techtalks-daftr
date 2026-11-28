import en from "@/locales/en.json";
import arabic from "@/locales/ar.json";

import type { Locale } from "@/lib/i18n-config";

/*
 * Loads the page text for each language.
 *
 * All the words on the site live in locales/en.json and locales/ar.json.
 * Components never contain text directly; they receive the dictionary and read
 * from it, e.g. `dict.nav.signIn`.
 */

/** The shape of a dictionary. It's taken from the English file, so English is the reference. */
export type Dictionary = typeof en;

// Giving the Arabic file the English type means TypeScript reports an error
// if ar.json is missing a key or has one en.json doesn't. Keeps the two in sync.
const ar: Dictionary = arabic;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

/** Returns all the text for one language. */
export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
