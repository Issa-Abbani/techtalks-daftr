import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/** Which plan in `pricing.plans` gets the "Most popular" badge and the highlighted outline. */
const POPULAR_PLAN_INDEX = 1;

type Plan = Dictionary["pricing"]["plans"][number];

/** "Pricing" section: three plan cards. Stacked on phones and tablets, side by side on desktop. */
export function Pricing({ dict }: { dict: Dictionary }) {
  const content = dict.pricing;

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell">
        <SectionHeader
          eyebrow={content.eyebrow}
          title={content.title}
          description={content.description}
          align="center"
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {content.plans.map((plan, index) => (
            <PricingCard
              key={plan.name}
              plan={plan}
              popularLabel={content.popular}
              isPopular={index === POPULAR_PLAN_INDEX}
              revealAfter={index * 120}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type PricingCardProps = {
  plan: Plan;
  popularLabel: string;
  isPopular: boolean;
  /** How long to wait (ms) before the card fades in, so the cards appear one by one. */
  revealAfter: number;
};

function PricingCard({ plan, popularLabel, isPopular, revealAfter }: PricingCardProps) {
  return (
    <div
      data-testid="pricing-card"
      data-reveal
      style={revealDelay(revealAfter)}
      className={cn(
        "lift relative flex flex-col rounded-xl border bg-card p-6 sm:p-9",
        isPopular && "border-primary ring-1 ring-primary"
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-xl font-semibold">{plan.name}</h3>
        {isPopular && <Badge className="h-6 rounded-full px-2.5 text-sm">{popularLabel}</Badge>}
      </div>
      <p className="mt-2 text-base text-muted-foreground">{plan.description}</p>

      <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
        {/* Prices keep their left-to-right order on the Arabic page ($9, not 9$). */}
        <span className="text-5xl font-semibold tracking-tight" dir="ltr">
          {plan.price}
        </span>
        <span className="text-base text-muted-foreground">{plan.period}</span>
      </p>

      {/* `whitespace-normal` lets long button text wrap on very narrow phones instead of spilling out. */}
      <Button
        size="lg"
        variant={isPopular ? "default" : "outline"}
        className="mt-7 h-auto min-h-12 w-full py-2 text-base whitespace-normal"
      >
        {plan.cta}
      </Button>

      <ul className="mt-8 space-y-3.5 border-t pt-7">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-base">
            <Check className="mt-1 size-[18px] shrink-0 text-primary" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
