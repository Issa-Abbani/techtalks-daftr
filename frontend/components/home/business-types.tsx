import { Boxes, Coffee, Croissant, Package, ShoppingBasket, Store } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

/** One icon per business type, in the same order as `trust.businesses` in the locale files. */
const BUSINESS_ICONS = [Coffee, ShoppingBasket, Store, Croissant, Boxes, Package];

/**
 * The row of business types under the hero ("Coffee shops", "Mini markets", ...),
 * showing visitors who Daftr is made for.
 *
 * It continues the plain band that starts behind the dashboard preview.
 */
export function BusinessTypes({ dict }: { dict: Dictionary }) {
  const content = dict.trust;

  return (
    <div className="border-b bg-surface">
      <div className="shell pb-14">
        <p data-reveal className="text-center text-base text-muted-foreground">
          {content.title}
        </p>

        <ul
          data-testid="trust-list"
          className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6"
        >
          {content.businesses.map((business, index) => {
            const Icon = BUSINESS_ICONS[index];
            return (
              <li
                key={business}
                data-reveal
                style={revealDelay(index * 70)}
                className="flex items-center justify-center gap-2 text-base font-medium text-ink"
              >
                <Icon className="size-[18px] text-primary" />
                {business}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
