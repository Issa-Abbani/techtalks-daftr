# Next.js + Tailwind handoff

For the front-end team. Stack: Next.js App Router, TypeScript, Tailwind CSS v4, Lucide React. Everything below drops into `app/globals.css` and `app/layout.tsx`.

## 1. `app/globals.css`

```css
@import "tailwindcss";

/* Font comes from next/font (step 2); `inline` because it points at another variable. */
@theme inline {
  --font-sans: var(--font-inter), "Noto Sans Arabic", system-ui, sans-serif;
}

@theme {
  /* Remove Tailwind's default palette so nobody can write bg-teal-700 or text-white. */
  --color-*: initial;

  /* Light theme (values from the brief). */
  --color-primary:       #0B6B63;
  --color-primary-hover: #084E48;
  --color-primary-soft:  #E3F1EF;
  --color-on-primary:    #FFFFFF;
  --color-canvas:        #F6F7F8;
  --color-surface:       #FFFFFF;
  --color-border:        #E3E6EA;
  --color-border-strong: #7B8696;
  --color-disabled:      var(--color-border);
  --color-ink:           #14181F;
  --color-muted:         #4A5361;
  --color-success:       #14532D;
  --color-success-soft:  #DCFCE7;
  --color-warning:       #7A3E06;
  --color-warning-soft:  #FEF3C7;
  --color-danger:        #7F1D1D;
  --color-danger-soft:   #FEE2E2;
  --color-danger-solid:  #B91C1C;
  --color-on-danger:     #FFFFFF;
  --color-chart-1:       #00917F;
  --color-chart-2:       #E8710A;
  --color-chart-3:       #6A5AD8;

  --radius-control: 8px;
  --radius-card: 12px;
  --radius-button: 8px;
  --radius-pill: 999px;

  /* Added beyond the brief's template: */
  --shadow-card: none;
  --spacing-control: 52px;  /* h-control: every button and input */
  --spacing-tap: 44px;      /* min-h-tap min-w-tap: smallest tap target */
  --text-display: 2.5rem; --text-display--line-height: 3rem; --text-display--font-weight: 600; --text-display--letter-spacing: -0.02em;
  --text-heading: 1.875rem; --text-heading--line-height: 2.25rem; --text-heading--font-weight: 600; --text-heading--letter-spacing: -0.02em;
  --text-title: 1.25rem; --text-title--line-height: 1.75rem; --text-title--font-weight: 600;
  --text-body: 1rem; --text-body--line-height: 1.5rem; --text-body--font-weight: 400;
  --text-small: 0.875rem; --text-small--line-height: 1.25rem; --text-small--font-weight: 400;
  --text-caption: 0.8125rem; --text-caption--line-height: 1.125rem; --text-caption--font-weight: 500;
  --text-label: 0.875rem; --text-label--line-height: 1.25rem; --text-label--font-weight: 500;
}

/* Dark theme: same names, new values. Follows the phone's setting. */
@layer base {
  :root { color-scheme: light dark; }
  @media (prefers-color-scheme: dark) {
    :root {
    --color-primary:       #4FC1B4;
    --color-primary-hover: #7AD3C9;
    --color-primary-soft:  #123532;
    --color-on-primary:    #062420;
    --color-canvas:        #0E1115;
    --color-surface:       #161A20;
    --color-border:        #272D35;
    --color-border-strong: #6E7A8A;
    --color-ink:           #E9EDF1;
    --color-muted:         #A6B0BC;
    --color-success:       #86E0A6;
    --color-success-soft:  #11301F;
    --color-warning:       #F5C566;
    --color-warning-soft:  #3A2B0C;
    --color-danger:        #FCA5A5;
    --color-danger-soft:   #3D1717;
    --color-danger-solid:  #F27A7A;
    --color-on-danger:     #2A0909;
    --color-chart-1:       #20A393;
    --color-chart-2:       #D9752A;
    --color-chart-3:       #9085E9;
    }
  }

  *, ::before, ::after { border-color: var(--color-border); }

  body { @apply bg-canvas text-ink font-sans text-body antialiased; }

  /* One focus ring for everything you can tap. */
  :where(a, button, input, select, textarea, summary, [tabindex]):focus-visible {
    outline: 3px solid var(--color-primary);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, ::before, ::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  }
}
```

The brief's template (colors plus `--radius-control` and `--radius-card`) is all there; the extra lines are marked. Spacing needs no tokens: Tailwind v4's default `--spacing` is 4px, so `p-1` = 4, `p-2` = 8, `p-3` = 12, `p-4` = 16, `p-6` = 24, `p-8` = 32, `p-12` = 48, `p-16` = 64 already match `space-1` … `space-16`. Use only those steps.

**Dark mode needs no `dark:` classes.** The tokens change value, so `bg-surface` turns from white to `#161A20` on its own. If you ever write `dark:bg-…` for a colour, something is missing from the tokens; add a token instead. Version 1 follows the phone's setting only. When someone builds a theme switch, add `@custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));`, put the dark block under `:root[data-theme="dark"]` as well, and set `data-theme` on `<html>` from a cookie on the server so the page doesn't flash.

## 2. `app/layout.tsx`

```tsx
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" className={inter.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
```

`next/font` self-hosts Inter at build time: no request to Google from the user's phone. Don't load Noto Sans Arabic until Arabic is confirmed; when it is, add it with `subsets: ["arabic"]` and `preload: false`, and switch `dir` to `"rtl"` for Arabic.

## 3. Token to class

| Token | Class | Use |
|---|---|---|
| `canvas` | `bg-canvas` | Page background (set on `body`) |
| `surface` | `bg-surface` | Cards, inputs, nav |
| `ink` / `muted` | `text-ink` / `text-muted` | Main / secondary text |
| `primary` | `bg-primary`, `text-primary`, `outline-primary` | Main button, links, focus |
| `primary-hover` | `hover:bg-primary-hover` | Hover/pressed of primary fills |
| `primary-soft` | `bg-primary-soft`, `hover:bg-primary-soft` | Selected rows, info alerts, ghost hover |
| `on-primary` | `text-on-primary` | Text on primary (never `text-white`) |
| `border` / `border-strong` | `border-border` / `border-border-strong` | Dividers / inputs and secondary buttons |
| `disabled` | `disabled:bg-disabled disabled:text-muted` | Disabled buttons |
| `success`, `warning`, `danger` + `-soft` | `bg-warning-soft text-warning` | Status badges and messages |
| `danger-solid` / `on-danger` | `bg-danger-solid text-on-danger`, `text-danger-solid`, `border-danger-solid` | Destructive buttons, field errors |
| `chart-1` … `chart-3` | `bg-chart-1`, `stroke-chart-1`, `fill-chart-2` | Data series in charts only (see Charts) |
| `radius-control` / `radius-button` / `radius-card` / `radius-pill` | `rounded-control` / `rounded-button` / `rounded-card` / `rounded-pill` | Inputs / buttons / cards / badges |
| `control-height` / `tap-min` | `h-control` / `min-h-tap min-w-tap` | Buttons and inputs / icon buttons and links |
| `shadow-card` | `shadow-card` | (none today) |
| type styles | `text-display`, `text-heading`, `text-title`, `text-body`, `text-small`, `text-caption`, `text-label` | Sets size, line height, weight and tracking |

## 4. Rules for pull requests

- No hex, `rgb()`, arbitrary colour (`bg-[#…]`) or default-palette class in components. A lint rule or a grep for `#[0-9a-fA-F]{3,6}` in `components/` keeps this honest.
- Logical properties only: `ms-* me-* ps-* pe-* start-* end-* text-start text-end border-s border-e rounded-s rounded-e`. Never `ml- mr- pl- pr- left- right- text-left text-right`.
- Directional icons get `rtl:-scale-x-100`.
- Every interactive element is at least `min-h-tap`. Buttons and inputs are `h-control`.
- Inputs are `text-base` (16px) or larger.
- Check each screen at 390px in both light and dark before review.
- Full-height screens use `min-h-dvh`, never `h-screen`.

## 5. Component skeletons

Each component page in this system has a "Build it" snippet. They share these class strings:

```ts
export const btn = {
  base: "inline-flex h-control items-center justify-center gap-2 rounded-button px-6 text-base font-semibold transition-transform duration-100 active:scale-[.98] disabled:cursor-not-allowed disabled:bg-disabled disabled:text-muted disabled:active:scale-100",
  primary: "bg-primary text-on-primary hover:bg-primary-hover",
  secondary: "border border-border-strong bg-surface text-ink hover:bg-primary-soft",
  danger: "bg-danger-solid text-on-danger hover:bg-danger",
};

export const input =
  "h-control w-full rounded-control border border-border-strong bg-surface px-4 text-base text-ink placeholder:text-muted hover:border-ink focus-visible:border-primary aria-invalid:border-danger-solid aria-invalid:ring-1 aria-invalid:ring-inset aria-invalid:ring-danger-solid disabled:border-border disabled:bg-canvas disabled:text-muted";
```

## 6. Edge cases to build for

- **Slow or no connection.** Keep the form filled when a request fails; show the "No connection" FormMessage; never clear what the owner typed.
- **Long names.** Product names wrap to two lines then truncate with an ellipsis; numbers never truncate.
- **Big numbers.** Stat values up to 10 characters ("$1,284,560") still fit at 390px in `text-display`; above that, step down to `text-heading`.
- **No reorder level set.** Show Healthy unless quantity is 0; prompt to set a level from the product screen.
- **Status precedence.** Expired, then Out of stock, then Low stock (quantity ≤ reorder level), then Healthy.
- **Currency.** Sample data uses USD. Confirm whether shops price in USD, LBP or both before building money fields.
