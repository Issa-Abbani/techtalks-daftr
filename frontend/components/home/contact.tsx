import type { ReactNode } from "react";
import { Clock, Mail, MapPin, Phone, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { revealDelay } from "@/lib/motion";

/*
 * Form fields are 48px tall with 16px text. 16px matters: iPhones zoom the whole
 * page in when you tap a field with smaller text. (`md:text-base` overrides the
 * smaller desktop size the shadcn Input uses by default.)
 */
const FIELD_STYLES = "h-12 text-base md:text-base";

/**
 * "Contact us" section: contact details on one side and a message form on the other.
 *
 * The form doesn't send anything yet. The button is `type="button"` so pressing it
 * doesn't reload the page; hook it up to the backend when that's ready.
 */
export function Contact({ dict }: { dict: Dictionary }) {
  const content = dict.contact;
  const form = content.form;

  // `isLtr` marks values that must read left to right even on the Arabic page (emails, phone numbers).
  const details = [
    { icon: Mail, ...content.details.email, isLtr: true },
    { icon: Phone, ...content.details.phone, isLtr: true },
    { icon: MapPin, ...content.details.location, isLtr: false },
    { icon: Clock, ...content.details.hours, isLtr: false },
  ];

  return (
    <section id="contact" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
        <div>
          <SectionHeader eyebrow={content.eyebrow} title={content.title} description={content.description} />

          <dl className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {details.map((detail, index) => (
              <div key={detail.label} className="flex items-start gap-4" data-reveal style={revealDelay(index * 80)}>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card text-primary">
                  <detail.icon className="size-5" />
                </span>
                <div className="min-w-0">
                  <dt className="text-[15px] text-muted-foreground">{detail.label}</dt>
                  <dd className="mt-0.5 text-lg font-medium break-words">
                    <span dir={detail.isLtr ? "ltr" : undefined}>{detail.value}</span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div data-reveal style={revealDelay(150)} className="rounded-xl border bg-card p-7 sm:p-9">
          <h3 className="text-2xl font-semibold">{form.title}</h3>

          <form className="mt-7 grid gap-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField id="name" label={form.name}>
                <Input id="name" placeholder={form.namePlaceholder} className={FIELD_STYLES} />
              </FormField>
              <FormField id="email" label={form.email}>
                <Input id="email" type="email" placeholder={form.emailPlaceholder} className={FIELD_STYLES} />
              </FormField>
            </div>

            <FormField id="business" label={form.business}>
              <Input id="business" placeholder={form.businessPlaceholder} className={FIELD_STYLES} />
            </FormField>

            <FormField id="message" label={form.message}>
              <Textarea id="message" placeholder={form.messagePlaceholder} className="min-h-36 text-base md:text-base" />
            </FormField>

            <Button type="button" size="lg" className="h-12 text-base sm:w-fit sm:px-7">
              {form.submit}
              <Send data-icon="inline-end" className="rtl:-scale-x-100" />
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}

type FormFieldProps = {
  /** Must match the `id` of the input inside, so clicking the label focuses the input. */
  id: string;
  label: string;
  children: ReactNode;
};

/** A label with its input underneath. */
function FormField({ id, label, children }: FormFieldProps) {
  return (
    <div className="grid gap-2">
      <Label className="text-[15px]" htmlFor={id}>
        {label}
      </Label>
      {children}
    </div>
  );
}
