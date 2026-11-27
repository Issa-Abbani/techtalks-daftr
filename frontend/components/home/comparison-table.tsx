import { Check, Minus } from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * Which option has which capability.
 *
 * Rows follow `about.comparison.rows` in the locale files, and the four columns
 * follow `about.comparison.columns`: paper ledger, Excel, enterprise software, Daftr.
 * If you add a row to the locale files, add a matching row here.
 */
const HAS_CAPABILITY = [
  // paper, Excel, enterprise, Daftr
  [true, true, false, true], // Affordable
  [true, false, false, true], // Easy to learn
  [false, false, true, true], // Works on a phone
  [false, true, true, true], // Automatic stock totals
  [false, false, true, true], // Low-stock alerts
];

type ComparisonText = Dictionary["about"]["comparison"];

/**
 * The "How Daftr compares" table in the About section.
 *
 * On narrow screens the table is wider than the card, so the card scrolls sideways
 * instead of squashing the columns. The Daftr column (the last one) is highlighted.
 */
export function ComparisonTable({ text }: { text: ComparisonText }) {
  const daftrColumn = text.columns.length - 1;

  return (
    <div
      data-reveal
      style={revealDelay(150)}
      className="min-w-0 self-start overflow-hidden rounded-xl border bg-card"
    >
      <h3 className="border-b px-5 py-5 text-lg font-semibold sm:px-6">{text.title}</h3>

      {/*
        `relative` matters here: the hidden "Yes"/"No" labels for screen readers are
        positioned absolutely, and without it they'd escape the scroll area and make
        the whole page scroll sideways on phones.
      */}
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[34rem] text-base lg:min-w-0">
          <thead>
            <tr className="border-b">
              <th scope="col" className="px-5 py-3.5 text-start text-sm font-medium text-muted-foreground sm:px-6">
                {text.feature}
              </th>
              {text.columns.map((columnName, column) => (
                <th
                  key={columnName}
                  scope="col"
                  className={cn(
                    "px-2 py-3.5 text-center text-sm font-medium text-muted-foreground",
                    column === daftrColumn && "bg-secondary text-primary"
                  )}
                >
                  {columnName}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {text.rows.map((capability, row) => (
              <tr key={capability} className="border-b last:border-0">
                <th scope="row" className="px-5 py-4 text-start font-medium sm:px-6">
                  {capability}
                </th>
                {HAS_CAPABILITY[row].map((hasIt, column) => (
                  <td key={column} className={cn("px-2 py-4 text-center", column === daftrColumn && "bg-secondary")}>
                    {hasIt ? (
                      <Check
                        className={cn(
                          "mx-auto size-4",
                          column === daftrColumn ? "text-primary" : "text-muted-foreground"
                        )}
                      />
                    ) : (
                      <Minus className="mx-auto size-4 text-muted-foreground/50" />
                    )}
                    {/* The icons are decorative; screen readers hear "Yes" or "No" instead. */}
                    <span className="sr-only">{hasIt ? text.yes : text.no}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
