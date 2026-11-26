import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";

export function Contact({ dict }: { dict: Dictionary }) {
  const t = dict.contact;
  const f = t.form;
  const details = [
    { icon: Mail, ...t.details.email, ltr: true },
    { icon: Phone, ...t.details.phone, ltr: true },
    { icon: MapPin, ...t.details.location, ltr: false },
    { icon: Clock, ...t.details.hours, ltr: false },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {details.map(({ icon: Icon, label, value, ltr }, i) => (
              <div key={label} className="flex items-start gap-4" data-reveal style={reveal(i * 80)}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
                  <Icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[15px] text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 text-lg font-medium break-words">
                    <span dir={ltr ? "ltr" : undefined}>{value}</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal style={reveal(150)} className="rounded-xl border bg-card p-7 sm:p-9">
          <h3 className="text-2xl font-semibold">{f.title}</h3>
          <form className="mt-7 grid gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label className="text-[15px]" htmlFor="name">{f.name}</Label>
                <Input id="name" placeholder={f.namePlaceholder} className="h-12 text-base md:text-base" />
              </div>
              <div className="grid gap-2">
                <Label className="text-[15px]" htmlFor="email">{f.email}</Label>
                <Input id="email" type="email" placeholder={f.emailPlaceholder} className="h-12 text-base md:text-base" />
              </div>
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]" htmlFor="business">{f.business}</Label>
              <Input id="business" placeholder={f.businessPlaceholder} className="h-12 text-base md:text-base" />
            </div>
            <div className="grid gap-2">
              <Label className="text-[15px]" htmlFor="message">{f.message}</Label>
              <Textarea id="message" placeholder={f.messagePlaceholder} className="min-h-36 text-base md:text-base" />
            </div>
            <Button type="button" size="lg" className="h-12 text-base sm:w-fit sm:px-7">
              {f.submit}
              <Send data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
