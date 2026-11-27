import {
  AlertTriangle,
  Boxes,
  FileUp,
  LayoutDashboard,
  Package,
  Search,
  Settings,
  Store,
  TrendingUp,
  Wallet,
} from "lucide-react";

import type { Dictionary } from "@/lib/i18n";
import { animationOrder, revealDelay } from "@/lib/motion";
import { cn } from "@/lib/utils";

/*
 * A picture of the Daftr dashboard, built from HTML instead of a screenshot so it
 * stays sharp, follows light/dark mode and is translated like the rest of the page.
 *
 * It is only an illustration, so the whole thing is `aria-hidden`: screen readers
 * skip it, and nothing in it can be clicked.
 *
 * The numbers below are made-up sample data. The words come from the locale files
 * (`hero.preview`), and each list here lines up with a list there, item by item.
 */

/** Icons for the sidebar menu, in the same order as `hero.preview.menu`. */
const MENU_ICONS = [LayoutDashboard, Package, FileUp, Settings];

/** Units sold each day, Monday to Sunday, as a percentage of the best day. */
const DAILY_SALES_PERCENT = [62, 48, 75, 58, 90, 100, 70];

/** Units sold for each product in `hero.preview.items`. */
const UNITS_SOLD = [42, 35, 28, 19];

/** Units left for each product in `hero.preview.lowStockItems`. */
const UNITS_LEFT = [4, 2, 6];

type PreviewText = Dictionary["hero"]["preview"];

export function DashboardPreview({ dict }: { dict: Dictionary }) {
  const text = dict.hero.preview;

  return (
    <div
      className="relative mx-auto max-w-5xl"
      aria-hidden
      data-reveal="zoom"
      style={revealDelay(450)}
    >
      <div className="relative overflow-hidden rounded-xl border bg-card">
        <BrowserBar url={text.url} />

        <div className="grid md:grid-cols-[200px_1fr]">
          <Sidebar text={text} />

          <div className="min-w-0 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              {/* On phones the sidebar is hidden, so the shop name moves up here. */}
              <p className="truncate text-sm font-semibold md:hidden">{text.shopName}</p>
              <div className="ms-auto flex h-8 w-full max-w-56 items-center gap-2 rounded-md border bg-surface px-2.5 text-xs text-muted-foreground">
                <Search className="size-3.5 shrink-0" />
                <span className="truncate">{text.search}</span>
              </div>
            </div>

            <StatCards text={text} />

            <div className="mt-3 grid gap-3 lg:grid-cols-[1.35fr_1fr]">
              <SalesChart text={text} />
              <TopProducts text={text} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** The top strip of a browser window: three dots and the address bar. */
function BrowserBar({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-3 border-b bg-canvas px-4 py-2.5">
      <div className="flex gap-1.5">
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
        <span className="size-2.5 rounded-full bg-border" />
      </div>
      {/* URLs always read left to right, even on the Arabic page. */}
      <div
        className="mx-auto truncate rounded-md border bg-surface px-3 py-1 font-mono text-[11px] text-muted-foreground"
        dir="ltr"
      >
        {url}
      </div>
      {/* Empty box the same width as the dots, so the address bar stays centred. */}
      <div className="w-10" />
    </div>
  );
}

/** Shop name, menu and the "running low" list. Only shown from tablet width up. */
function Sidebar({ text }: { text: PreviewText }) {
  return (
    <aside className="hidden border-e bg-canvas p-4 md:block">
      <div className="flex items-center gap-2 px-2 text-sm font-semibold">
        <Store className="size-4 text-primary" />
        {text.shopName}
      </div>

      <ul className="mt-5 space-y-1">
        {text.menu.map((item, index) => {
          const Icon = MENU_ICONS[index];
          const isCurrentPage = index === 0; // "Dashboard" is highlighted as the open page

          return (
            <li
              key={item}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm",
                isCurrentPage ? "bg-secondary font-medium text-secondary-foreground" : "text-muted-foreground"
              )}
            >
              <Icon className="size-4" />
              {item}
            </li>
          );
        })}
      </ul>

      <div className="mt-6 rounded-lg border bg-canvas p-3">
        <p className="text-xs font-medium">{text.lowStockTitle}</p>
        <ul className="mt-2 space-y-1.5">
          {text.lowStockItems.map((item, index) => (
            <li key={item} className="flex justify-between gap-2 text-[11px] text-muted-foreground">
              <span className="truncate">{item}</span>
              <span className="shrink-0 font-medium text-warning">
                {UNITS_LEFT[index]} {text.left}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/** The three headline numbers: stock value, product count and low-stock count. */
function StatCards({ text }: { text: PreviewText }) {
  const stats = [
    { label: text.stockValue, value: text.stockValueAmount, note: text.stockValueChange, icon: Wallet, color: "text-success" },
    { label: text.products, value: "248", note: text.productsChange, icon: Boxes, color: "text-muted-foreground" },
    { label: text.lowStock, value: "6", note: text.lowStockChange, icon: AlertTriangle, color: "text-warning" },
  ];

  return (
    <div className="mt-4 grid gap-3 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-canvas p-4">
          <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
            <span className="truncate">{stat.label}</span>
            <stat.icon className={cn("size-3.5 shrink-0", stat.color)} />
          </div>
          {/* Numbers keep their left-to-right order on the Arabic page ($12,480, not 12,480$). */}
          <p className="mt-2 text-2xl font-semibold tracking-tight" dir="ltr">
            {stat.value}
          </p>
          <p className={cn("mt-1 truncate text-[11px]", stat.color)}>{stat.note}</p>
        </div>
      ))}
    </div>
  );
}

/** A small bar chart of the week's sales. The bars grow in one by one (class `bar-grow`). */
function SalesChart({ text }: { text: PreviewText }) {
  return (
    <div className="rounded-lg border bg-canvas p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="truncate text-sm font-medium">{text.salesTitle}</p>
        <TrendingUp className="size-4 shrink-0 text-success" />
      </div>

      <div className="mt-4 grid h-32 grid-cols-7 items-end gap-2">
        {DAILY_SALES_PERCENT.map((percent, day) => (
          <div key={day} className="flex h-full min-w-0 flex-col justify-end gap-1.5">
            <div
              className="bar-grow rounded-sm bg-chart-1"
              style={animationOrder(day, { height: `${percent}%` })}
            />
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {text.days.map((dayName) => (
          <span key={dayName} className="truncate text-center text-[10px] text-muted-foreground">
            {dayName}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Best sellers with a bar showing each one compared with the top seller. */
function TopProducts({ text }: { text: PreviewText }) {
  const bestSellerUnits = UNITS_SOLD[0];

  return (
    <div className="rounded-lg border bg-canvas p-4">
      <p className="text-sm font-medium">{text.topProductsTitle}</p>
      <ul className="mt-3 space-y-3">
        {text.items.map((productName, index) => {
          const unitsSold = UNITS_SOLD[index];
          const barWidth = (unitsSold / bestSellerUnits) * 100;

          return (
            <li key={productName}>
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="truncate">{productName}</span>
                <span className="shrink-0 text-muted-foreground">
                  {unitsSold} {text.sold}
                </span>
              </div>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-border">
                <div
                  className="fill-grow h-full rounded-full bg-chart-1"
                  style={animationOrder(index, { width: `${barWidth}%` })}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
