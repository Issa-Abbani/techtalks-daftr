import {
  BadgeDollarSign,
  Check,
  Feather,
  Minus,
  MousePointerClick,
  Smartphone,
} from "lucide-react";

import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const valueIcons = [MousePointerClick, BadgeDollarSign, Smartphone, Feather];

// Rows follow dict.about.comparison.rows; columns: paper, Excel, enterprise software, Daftr.
const matrix = [
  [true, true, false, true],
  [true, false, false, true],
  [false, false, true, true],
  [false, true, true, true],
  [false, false, true, true],
];

export function About({ dict }: { dict: Dictionary }) {
  const t = dict.about;
  const c = t.comparison;
  const daftrCol = c.columns.length - 1;

  return (
    <section id="about" className="scroll-mt-20 border-t bg-surface py-20 sm:py-28">
      <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
        <div className="min-w-0">
          <SectionHeader eyebrow={t.eyebrow} title={t.title} />
          <div data-reveal className="mt-7 space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl">
            {t.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {t.values.map((value, i) => {
              const Icon = valueIcons[i];
              return (
                <div key={value.title} className="flex gap-4" data-reveal style={reveal(i * 90)}>
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary ring-1 ring-primary/15">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <dt className="text-lg font-semibold">{value.title}</dt>
                    <dd className="mt-1 text-base text-muted-foreground">{value.description}</dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </div>

        <div data-reveal style={reveal(150)} className="min-w-0 self-start overflow-hidden rounded-xl border bg-card">
          <h3 className="border-b px-5 py-5 text-lg font-semibold sm:px-6">{c.title}</h3>
          {/* `relative` keeps the absolutely positioned sr-only labels inside the scroller. */}
          <div className="relative overflow-x-auto">
            <table className="w-full min-w-[34rem] text-base lg:min-w-0">
              <thead>
                <tr className="border-b">
                  <th scope="col" className="px-5 py-3.5 text-start text-sm font-medium text-muted-foreground sm:px-6">
                    {c.feature}
                  </th>
                  {c.columns.map((col, i) => (
                    <th
                      key={col}
                      scope="col"
                      className={cn(
                        "px-2 py-3.5 text-center text-sm font-medium text-muted-foreground",
                        i === daftrCol && "bg-secondary text-primary"
                      )}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {c.rows.map((row, r) => (
                  <tr key={row} className="border-b last:border-0">
                    <th scope="row" className="px-5 py-4 text-start font-medium sm:px-6">
                      {row}
                    </th>
                    {matrix[r].map((yes, col) => (
                      <td
                        key={col}
                        className={cn("px-2 py-4 text-center", col === daftrCol && "bg-secondary")}
                      >
                        {yes ? (
                          <Check
                            className={cn(
                              "mx-auto size-4",
                              col === daftrCol ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                        ) : (
                          <Minus className="mx-auto size-4 text-muted-foreground/50" />
                        )}
                        <span className="sr-only">{yes ? c.yes : c.no}</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
