import { ChartNoAxesColumn, FileUp, UserPlus } from "lucide-react";

import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

/** One icon per step, in the same order as `howItWorks.steps` in the locale files. */
const STEP_ICONS = [UserPlus, FileUp, ChartNoAxesColumn];

/**
 * "How it works" section: three numbered steps.
 * Stacked on phones; side by side from tablets up, joined by a thin line.
 */
export function HowItWorks({ dict }: { dict: Dictionary }) {
  const content = dict.howItWorks;

  return (
    <section id="how-it-works" className="scroll-mt-20 border-y bg-surface py-20 sm:py-28">
      <div className="shell">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />

        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {content.steps.map((step, index) => {
            const Icon = STEP_ICONS[index];
            const isLastStep = index === content.steps.length - 1;

            return (
              <li key={step.title} className="relative text-center" data-reveal style={revealDelay(index * 150)}>
                {!isLastStep && <ConnectorLine />}

                <span className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <p className="mt-6 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  {content.stepLabel} {index + 1}
                </p>
                <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-2xl">{step.title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-[17px] leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {step.description}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/**
 * The thin line from one step's icon to the next (tablet and up only).
 *
 * The icons are 3rem wide and centred in their column. The line starts 2rem
 * after the centre (half an icon plus a small gap) and is the column width
 * minus 2.5rem long, which lands it just before the next icon once the 1.5rem
 * gap between columns is counted. `start-` makes it work right to left too.
 */
function ConnectorLine() {
  return (
    <span
      className="absolute start-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-2.5rem)] bg-border md:block"
      aria-hidden
    />
  );
}
