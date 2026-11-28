import { FileSpreadsheet, LayoutDashboard, Lock, PackageSearch } from "lucide-react";

import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

/** One icon per feature, in the same order as `features.items` in the locale files. */
const FEATURE_ICONS = [Lock, FileSpreadsheet, PackageSearch, LayoutDashboard];

/** "Features" section: four cards, one per thing Daftr does. Two columns from small tablets up. */
export function Features({ dict }: { dict: Dictionary }) {
  const content = dict.features;

  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell">
        <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {content.items.map((feature, index) => {
            const Icon = FEATURE_ICONS[index];
            // Cards in the second column appear slightly after the ones in the first.
            const isSecondColumn = index % 2 === 1;

            return (
              <article
                key={feature.title}
                data-reveal
                style={revealDelay(isSecondColumn ? 100 : 0)}
                className="lift group rounded-xl border bg-card p-7 hover:border-primary/40 sm:p-9"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight sm:text-2xl">{feature.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
