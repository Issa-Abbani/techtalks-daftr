import en from "@/locales/en.json";
import arJson from "@/locales/ar.json";

import type { Locale } from "@/lib/i18n-config";

export type Dictionary = typeof en;

// Typing Arabic against the English shape makes a missing or misnamed key a compile error.
const ar: Dictionary = arJson;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
