import {
  AlertTriangle,
  ArrowRight,
  Boxes,
  CheckCircle2,
  Coffee,
  Croissant,
  FileUp,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  ShoppingBasket,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Dictionary } from "@/lib/i18n";
import { reveal, stagger } from "@/lib/motion";

export function Hero({ dict }: { dict: Dictionary }) {
  const t = dict.hero;

  return (
    <section className="relative overflow-hidden">
      <div className="shell pt-20 sm:pt-28 lg:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <div data-reveal style={reveal(0)}>
            <Badge
              variant="outline"
              className="h-auto max-w-full rounded-full bg-surface px-4 py-1.5 text-center text-sm font-medium whitespace-normal text-muted-foreground"
            >
              {t.badge}
            </Badge>
          </div>

          <h1
            data-reveal
            style={reveal(100)}
            className="mt-7 font-heading text-[2.6rem] leading-[1.05] font-semibold tracking-tight text-balance sm:text-6xl lg:text-7xl"
          >
            {t.titleLead}{" "}
            <span className="text-primary">{t.titleAccent}</span>
          </h1>

          <p
            data-reveal
            style={reveal(200)}
            className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground sm:text-xl"
          >
            {t.subtitle}
          </p>

          <div
            data-reveal
            style={reveal(300)}
            className="mt-10 flex flex-col justify-center gap-3 sm:flex-row"
          >
            <Button size="lg" className="h-12 px-7 text-base">
              {t.primaryCta}
              <ArrowRight
                data-icon="inline-end"
                className="transition-transform group-hover/button:translate-x-1 rtl:-scale-x-100 rtl:group-hover/button:-translate-x-1"
              />
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-7 text-base" asChild>
              <a href="#pricing">{t.secondaryCta}</a>
            </Button>
          </div>

          <ul
            data-reveal
            style={reveal(400)}
            className="mt-9 flex flex-wrap justify-center gap-x-7 gap-y-3"
          >
            {t.highlights.map((label) => (
              <li key={label} className="flex items-center gap-2 text-base text-muted-foreground">
                <CheckCircle2 className="size-[18px] text-primary" />
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* A solid band behind the lower half of the product preview grounds it on the page. */}
      <div className="relative mt-16 sm:mt-20">
        <div className="absolute inset-x-0 top-[38%] bottom-0 border-t bg-surface" aria-hidden />
        <div className="shell relative pb-16 sm:pb-24">
          <DashboardPreview dict={dict} />
        </div>
      </div>

      <TrustBar dict={dict} />
    </section>
  );
}

const menuIcons = [LayoutDashboard, Package, FileUp, Settings];
const sales = [62, 48, 75, 58, 90, 100, 70];
const topSold = [42, 35, 28, 19];
const lowLeft = [4, 2, 6];

function DashboardPreview({ dict }: { dict: Dictionary }) {
  const p = dict.hero.preview;
  const stats = [
    { label: p.stockValue, value: p.stockValueAmount, note: p.stockValueChange, icon: Wallet, tone: "text-success" },
    { label: p.products, value: "248", note: p.productsChange, icon: Boxes, tone: "text-muted-foreground" },
    { label: p.lowStock, value: "6", note: p.lowStockChange, icon: AlertTriangle, tone: "text-warning" },
  ];

  return (
    <div
      className="relative mx-auto max-w-5xl"
      aria-hidden
      data-reveal="zoom"
      style={reveal(450)}
    >
      <div className="relative overflow-hidden rounded-xl border bg-card">
        <div className="flex items-center gap-3 border-b bg-canvas px-4 py-2.5">
          <div className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
            <span className="size-2.5 rounded-full bg-border" />
          </div>
          <div className="mx-auto truncate rounded-md border bg-surface px-3 py-1 font-mono text-[11px] text-muted-foreground" dir="ltr">
            {p.url}
          </div>
          <div className="w-10" />
        </div>

        <div className="grid md:grid-cols-[200px_1fr]">
          <aside className="hidden border-e bg-canvas p-4 md:block">
            <div className="flex items-center gap-2 px-2 text-sm font-semibold">
              <Store className="size-4 text-primary" />
              {p.shopName}
            </div>
            <ul className="mt-5 space-y-1">
              {p.menu.map((item, i) => {
                const Icon = menuIcons[i];
                return (
                  <li
                    key={item}
                    className={
                      i === 0
                        ? "flex items-center gap-2.5 rounded-md bg-secondary px-2 py-1.5 text-sm font-medium text-secondary-foreground"
                        : "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm text-muted-foreground"
                    }
                  >
                    <Icon className="size-4" />
                    {item}
                  </li>
                );
              })}
            </ul>
            <div className="mt-6 rounded-lg border bg-canvas p-3">
              <p className="text-xs font-medium">{p.lowStockTitle}</p>
              <ul className="mt-2 space-y-1.5">
                {p.lowStockItems.map((item, i) => (
                  <li key={item} className="flex justify-between gap-2 text-[11px] text-muted-foreground">
                    <span className="truncate">{item}</span>
                    <span className="shrink-0 font-medium text-warning">
                      {lowLeft[i]} {p.left}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-sm font-semibold md:hidden">{p.shopName}</p>
              <div className="ms-auto flex h-8 w-full max-w-56 items-center gap-2 rounded-md border bg-surface px-2.5 text-xs text-muted-foreground">
                <Search className="size-3.5 shrink-0" />
                <span className="truncate">{p.search}</span>
              </div>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {stats.map(({ label, value, note, icon: Icon, tone }) => (
                <div key={label} className="rounded-lg border bg-canvas p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span className="truncate">{label}</span>
                    <Icon className={`size-3.5 shrink-0 ${tone}`} />
                  </div>
                  <p className="mt-2 text-2xl font-semibold tracking-tight" dir="ltr">
                    {value}
                  </p>
                  <p className={`mt-1 truncate text-[11px] ${tone}`}>{note}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
              <div className="rounded-lg border bg-canvas p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{p.salesTitle}</p>
                  <TrendingUp className="size-4 shrink-0 text-success" />
                </div>
                <div className="mt-4 grid h-32 grid-cols-7 items-end gap-2">
                  {sales.map((h, i) => (
                    <div key={i} className="flex h-full min-w-0 flex-col justify-end gap-1.5">
                      <div
                        className="bar-grow rounded-sm bg-chart-1"
                        style={stagger(i, { height: `${h}%` })}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-2 grid grid-cols-7 gap-2">
                  {p.days.map((d) => (
                    <span key={d} className="truncate text-center text-[10px] text-muted-foreground">
                      {d}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border bg-canvas p-4">
                <p className="text-sm font-medium">{p.topProductsTitle}</p>
                <ul className="mt-3 space-y-3">
                  {p.items.map((name, i) => (
                    <li key={name}>
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="truncate">{name}</span>
                        <span className="shrink-0 text-muted-foreground">
                          {topSold[i]} {p.sold}
                        </span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="fill-grow h-full rounded-full bg-chart-1"
                          style={stagger(i, { width: `${(topSold[i] / topSold[0]) * 100}%` })}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const businessIcons = [Coffee, ShoppingBasket, Store, Croissant, Boxes, Package];

function TrustBar({ dict }: { dict: Dictionary }) {
  const t = dict.trust;
  return (
    <div className="border-b bg-surface">
      <div className="shell pb-14">
        <p data-reveal className="text-center text-base text-muted-foreground">{t.title}</p>
        <ul data-testid="trust-list" className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
          {t.businesses.map((label, i) => {
            const Icon = businessIcons[i];
            return (
              <li
                key={label}
                data-reveal
                style={reveal(i * 70)}
                className="flex items-center justify-center gap-2 text-base font-medium text-ink"
              >
                <Icon className="size-[18px] text-primary" />
                {label}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
