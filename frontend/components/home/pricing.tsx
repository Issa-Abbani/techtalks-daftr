import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";
import { cn } from "@/lib/utils";

const POPULAR_INDEX = 1;

export function Pricing({ dict }: { dict: Dictionary }) {
  const t = dict.pricing;

  return (
    <section id="pricing" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell">
        <SectionHeader
          eyebrow={t.eyebrow}
          title={t.title}
          description={t.description}
          align="center"
        />

        <div className="mt-14 grid items-stretch gap-6 lg:grid-cols-3">
          {t.plans.map((plan, i) => {
            const popular = i === POPULAR_INDEX;
            return (
              <div
                key={plan.name}
                data-testid="pricing-card"
                data-reveal
                style={reveal(i * 120)}
                className={cn(
                  "lift relative flex flex-col rounded-xl border bg-card p-6 sm:p-9",
                  popular && "border-primary ring-1 ring-primary"
                )}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  {popular && <Badge className="h-6 rounded-full px-2.5 text-sm">{t.popular}</Badge>}
                </div>
                <p className="mt-2 text-base text-muted-foreground">{plan.description}</p>
                <p className="mt-6 flex flex-wrap items-baseline gap-x-2">
                  <span className="text-5xl font-semibold tracking-tight" dir="ltr">
                    {plan.price}
                  </span>
                  <span className="text-base text-muted-foreground">{plan.period}</span>
                </p>

                <Button
                  size="lg"
                  variant={popular ? "default" : "outline"}
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
          })}
        </div>
      </div>
    </section>
  );
}
