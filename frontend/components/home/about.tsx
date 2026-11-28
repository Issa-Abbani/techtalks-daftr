import { BadgeDollarSign, Feather, MousePointerClick, Smartphone } from "lucide-react";

import { ComparisonTable } from "@/components/home/comparison-table";
import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

/** One icon per value, in the same order as `about.values` in the locale files. */
const VALUE_ICONS = [MousePointerClick, BadgeDollarSign, Smartphone, Feather];

/**
 * "About us" section: why Daftr exists, the four things it cares about, and a
 * table comparing it with paper, Excel and big business software.
 * Text and table sit side by side on desktop and stack on smaller screens.
 */
export function About({ dict }: { dict: Dictionary }) {
  const content = dict.about;

  return (
    <section id="about" className="scroll-mt-20 border-t bg-surface py-20 sm:py-28">
      <div className="shell grid gap-14 lg:grid-cols-2 lg:gap-16">
        {/* `min-w-0` lets this grid column shrink below its content's width instead of pushing the page wider. */}
        <div className="min-w-0">
          <SectionHeader eyebrow={content.eyebrow} title={content.title} />

          <div
            data-reveal
            className="mt-7 space-y-5 text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl"
          >
            {content.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            {content.values.map((value, index) => {
              const Icon = VALUE_ICONS[index];
              return (
                <div key={value.title} className="flex gap-4" data-reveal style={revealDelay(index * 90)}>
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

        <ComparisonTable text={content.comparison} />
      </div>
    </section>
  );
}
