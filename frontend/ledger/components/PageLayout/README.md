# PageLayout

How screens are laid out: the landing page grid and the centered auth column. Designed at 390px first.

**Breakpoints** are Tailwind's defaults: `sm` 640, `md` 768, `lg` 1024, `xl` 1280.

| | Phone (< 640) | 640+ | 768+ | 1024+ |
|---|---|---|---|---|
| Side padding | `px-4` (16) | `sm:px-6` (24) | 24 | `lg:px-8` (32) |
| Landing columns | 1 | 1 | 2 (feature rows) | 12, `gap-6` |
| Section spacing | `py-12` (48) | 48 | `md:py-16` (64) | 64 |
| Auth | Form on `canvas`, no card | 400px bordered card, centered | same | same |

**Page patterns.** Name the pattern before building a screen: the home page is a *marketing landing*; log in, sign up, forgot password and verify email are *single-form pages*; the dashboard will be a *dashboard* (at most four stat cards, most important first, then charts and lists).

**Landing page.** Container `max-w-6xl` (1152px), centered. The hero is left-aligned: `text-display` headline, one `muted` paragraph that names who it's for (max 52ch), primary "Set up your shop" and secondary "Log in". "Set up your shop" lands on the sign-up screen whose heading is "Set up your shop", so the words the owner tapped are the words they see next. No eyebrow label above the headline. On phones both buttons are full width and stacked. From 1024px the copy takes columns 1–6 and the example ledger card (Buzzy Beans, marked Sample data) takes 8–12. Features below are rows with a hairline on top (title + one line), two per row from 768px: not a row of three icon cards. No hero photos.

**Auth pages.** Logo at the top start, then a single column, `max-w-[400px]`, centered horizontally, top-aligned (not vertically centered, so the keyboard doesn't push the form around). Order: heading, line, optional FormMessage, fields `space-4` apart, full-width primary button, text links. From 640px the column becomes a card (`surface`, `border`, `radius-card`, `p-8`) on `canvas`. Screen is `min-h-dvh`.

**What you provide.** `<main>` per page with one `<h1>`. Use `<header>`, `<main>`, `<footer>` landmarks.

| Do | Don't |
|---|---|
| Design the 390px version first | Shrink a desktop design |
| `min-h-dvh` | `h-screen` (jumps on mobile browsers) |
| Grid for columns | Width maths like `w-[calc(33%-1rem)]` |
| Top-align the auth form | Vertically center it on phones |

**Build it**

```tsx
// app/(auth)/layout.tsx
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh px-4 py-8 sm:px-6">
      <div className="mx-auto flex max-w-[400px] flex-col gap-12">
        <Logo size={40} />
        <main className="flex flex-col gap-6 sm:rounded-card sm:border sm:border-border sm:bg-surface sm:p-8">{children}</main>
      </div>
    </div>
  );
}

// app/page.tsx (hero)
<section className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-8">
  <div className="flex flex-col gap-4 lg:col-span-6">…</div>
  <div className="lg:col-span-5 lg:col-start-8">…</div>
</section>
```
