# AppNav

Navigation inside the signed-in app: a one-row top bar and a bottom tab bar on phones, a side rail from 1024px. The public site uses TopNav instead.

**Top bar (phones).** 56px, `surface`, 1px `border` bottom. Shop name (17px semibold, truncates) with today's date under it in `muted`, and one 44px account button at the end. No logo, no slogan: the owner already knows where they are, so the first row of content starts right under it.

**Bottom tabs (phones).** Four destinations, never more: Home, Products, Sales, More. Each tab is 60px tall with a 24px Lucide icon over a 12px label; icons never appear without labels. The current tab gets `primary` text and a `primary-soft` pill behind its icon, plus `aria-current="page"`. Add `env(safe-area-inset-bottom)` padding so the bar clears the phone's gesture area, and give the scrolling content matching bottom padding so the last card isn't hidden.

**Side rail (1024px and up).** 232px, `surface`, `border` on its end edge, logo at the top, then the same destinations as 44px rows with 20px icons, and Account last. The current item uses the same `primary-soft` fill.

**What you provide.** `items` ({ label, href, icon }[], at most four), `current` (the active href), the shop name and date for the top bar.

| Do | Don't |
|---|---|
| Keep the same four tabs on every screen | Hide or reorder tabs per page |
| Label every icon | Icon-only tabs |
| Put "Settings", "Help" and "Log out" under More | Add a fifth tab |
| Use `ms-`/`me-` and `border-e` so the rail flips in Arabic | `ml-`, `border-r` |

**Build it**

```tsx
"use client";
import { ChartColumn, Ellipsis, House, Package } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/app", label: "Home", Icon: House },
  { href: "/app/products", label: "Products", Icon: Package },
  { href: "/app/sales", label: "Sales", Icon: ChartColumn },
  { href: "/app/more", label: "More", Icon: Ellipsis },
];

export function TabBar() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 grid grid-cols-4 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] lg:hidden">
      {tabs.map(({ href, label, Icon }) => {
        const current = path === href;
        return (
          <Link key={href} href={href} aria-current={current ? "page" : undefined}
            className={`flex min-h-15 flex-col items-center justify-center gap-0.5 text-xs ${current ? "font-semibold text-primary" : "font-medium text-muted"}`}>
            <span className={`grid h-[30px] w-14 place-items-center rounded-pill ${current ? "bg-primary-soft" : ""}`}><Icon className="size-6" aria-hidden /></span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
```
