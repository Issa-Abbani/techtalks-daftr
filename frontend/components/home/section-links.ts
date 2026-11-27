import type { Dictionary } from "@/lib/i18n";

/**
 * The page sections people can jump to from the navigation bar and the mobile menu.
 *
 * Each `href` points at the `id` of a <section> on the homepage, so if you rename
 * a section's id, update it here too.
 */
export function getSectionLinks(dict: Dictionary) {
  return [
    { href: "#features", label: dict.nav.features },
    { href: "#how-it-works", label: dict.nav.howItWorks },
    { href: "#pricing", label: dict.nav.pricing },
    { href: "#about", label: dict.nav.about },
    { href: "#contact", label: dict.nav.contact },
  ];
}
