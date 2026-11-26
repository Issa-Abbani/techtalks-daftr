import {
  FileSpreadsheet,
  LayoutDashboard,
  Lock,
  PackageSearch,
} from "lucide-react";

import { SectionHeader } from "@/components/home/section-header";
import type { Dictionary } from "@/lib/i18n";
import { reveal } from "@/lib/motion";

const icons = [Lock, FileSpreadsheet, PackageSearch, LayoutDashboard];

export function Features({ dict }: { dict: Dictionary }) {
  const t = dict.features;

  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="shell">
        <SectionHeader eyebrow={t.eyebrow} title={t.title} description={t.description} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {t.items.map((item, i) => {
            const Icon = icons[i];
            return (
              <article
                key={item.title}
                data-reveal
                style={reveal((i % 2) * 100)}
                className="lift group rounded-xl border bg-card p-7 hover:border-primary/40 sm:p-9"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-secondary text-primary ring-1 ring-primary/15 transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-7 text-xl font-semibold tracking-tight sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-[17px] leading-relaxed text-pretty text-muted-foreground sm:text-lg">
                  {item.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
