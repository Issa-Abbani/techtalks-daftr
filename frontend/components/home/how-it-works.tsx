import { ChartNoAxesColumn, FileUp, UserPlus } from "lucide-react";

import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";

const icons = [UserPlus, FileUp, ChartNoAxesColumn];

export function HowItWorks({ dict }: { dict: Dictionary }) {
  const t = dict.howItWorks;

  return (
    <section id="how-it-works" className="scroll-mt-20 border-y bg-surface py-20 sm:py-28">
      <div className="shell">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
          align="center"
        />

        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6">
          {t.steps.map((step, i) => {
            const Icon = icons[i];
            return (
              <li key={step.title} className="relative text-center" data-reveal style={reveal(i * 150)}>
                {i < t.steps.length - 1 && (
                  // Runs from this icon's edge to the next centred icon: half the icon (1.5rem) plus a
                  // 0.5rem gap on each side, across the 1.5rem column gap.
                  <span
                    className="absolute start-[calc(50%+2rem)] top-6 hidden h-px w-[calc(100%-2.5rem)] bg-border md:block"
                    aria-hidden
                  />
                )}
                <span className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <p className="mt-6 text-sm font-medium tracking-wider text-muted-foreground uppercase">
                  {t.stepLabel} {i + 1}
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
