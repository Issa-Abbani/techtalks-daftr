# TopNav

The bar at the top of public pages: logo, a "Get started" button and, on phones, a menu.

| Width | Contents |
|---|---|
| Under 1024px | Logo · Get started (compact primary, 44px) · menu toggle (44 × 44) |
| 1024px and up | Logo · How it works · Help · (gap) · Log in (compact secondary) · Get started |

**Look.** 64px tall, `surface` fill, 1px `border` bottom edge, content in the 1152px container with 16px side padding on phones and 32px from 1024px. Sticky to the top; no shadow, no blur.

**Mobile menu.** The toggle swaps `Menu` / `X` and its label ("Open menu" / "Close menu"). The menu is a sheet under the bar, `surface` fill: links as 52px rows divided by `border`. Get started is not repeated in the sheet because it stays visible in the bar. Escape and tapping a link close it; focus returns to the toggle. Keep it to three links.

**App pages.** Signed-in pages use a different bar (shop name, account). Auth pages (log in, sign up, forgot password, verify) show only the logo, no nav.

**What you provide.** `links` ({ label, href }[], at most three), whether the visitor is signed in (swap Get started for "Open Daftr").

| Do | Don't |
|---|---|
| Get started visible without opening the menu | Hide the main action inside the menu |
| Three links at most | Dropdowns or mega menus |
| `ms-auto` to push actions to the end | `ml-auto` (breaks right-to-left) |

**Build it**

```tsx
"use client";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { btn } from "@/lib/ui";

const links = [{ label: "How it works", href: "/#how" }, { label: "Help", href: "/help" }];

export function TopNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface">
      <div className="mx-auto flex min-h-16 max-w-6xl items-center gap-2 px-4 lg:px-8">
        <Logo />
        <nav aria-label="Main" className="ms-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="inline-flex min-h-tap items-center rounded-control px-3 text-label hover:bg-primary-soft">{l.label}</a>
          ))}
        </nav>
        <div className="ms-auto flex items-center gap-2">
          <a href="/login" className={`${btn.base} ${btn.secondary} hidden h-tap px-4 lg:inline-flex`}>Log in</a>
          <a href="/signup" className={`${btn.base} ${btn.primary} h-tap px-4`}>Get started</a>
          <button type="button" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen(!open)} className="grid min-h-tap min-w-tap place-items-center rounded-control hover:bg-primary-soft lg:hidden">
            {open ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </div>
      <div id="mobile-menu" hidden={!open} className="border-b border-border bg-surface px-4 pb-2 pt-2 lg:hidden">
        <nav aria-label="Main">
          {[...links, { label: "Log in", href: "/login" }].map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="flex min-h-13 items-center border-b border-border px-2 font-medium">{l.label}</a>
          ))}
        </nav>
      </div>
    </header>
  );
}
```
