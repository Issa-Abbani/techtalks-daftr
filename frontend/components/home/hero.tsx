import { CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DashboardPreview } from "@/components/home/dashboard-preview";
import { ForwardArrow } from "@/components/home/forward-arrow";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

type HeroProps = {
  dict: Dictionary;
};

/**
 * The first thing visitors see: the headline, the two main buttons and a
 * picture of the product (the dashboard preview).
 *
 * Each block fades in a little after the one above it (see `revealDelay`).
 */
export function Hero({ dict }: HeroProps) {
  const content = dict.hero;

  return (
    <section className="relative overflow-hidden">
      <div className="shell pt-20 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div data-reveal style={revealDelay(0)}>
            <Badge
              variant="outline"
              className="h-auto max-w-full rounded-full bg-surface px-4 py-1.5 text-center text-sm font-medium whitespace-normal text-muted-foreground"
            >
              {content.badge}
            </Badge>
          </div>

          <h1
            data-reveal
            style={revealDelay(100)}
            className="mt-7 font-heading text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {content.titleLead} <span className="text-primary">{content.titleAccent}</span>
          </h1>

          <p
            data-reveal
            style={revealDelay(200)}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl"
          >
            {content.subtitle}
          </p>

          <div
            data-reveal
            style={revealDelay(300)}
            className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="h-12 px-7 text-base">
              {content.primaryCta}
              <ForwardArrow />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-7 text-base" asChild>
              <a href="#pricing">{content.secondaryCta}</a>
            </Button>
          </div>

          <ul
            data-reveal
            style={revealDelay(400)}
            className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3"
          >
            {content.highlights.map((highlight) => (
              <li key={highlight} className="flex items-center gap-2 text-base text-muted-foreground">
                <CheckCircle2 className="size-[18px] text-primary" />
                {highlight}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative mt-16 sm:mt-20">
        {/* A plain band behind the lower part of the preview, so it sits on something instead of floating. */}
        <div className="absolute inset-x-0 top-[38%] bottom-0 border-t bg-surface" aria-hidden />

        <div className="shell relative pb-16 sm:pb-24">
          <DashboardPreview dict={dict} />
        </div>
      </div>
    </section>
  );
}
