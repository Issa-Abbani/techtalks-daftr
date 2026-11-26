# Logo

The Daftr lockup: a notebook mark in a `primary` tile next to the word "Daftr" in Inter 600, -0.02em tracking, `ink`.

**Use it** at the start of the top bar (32px mark) and above the auth form (40px mark). Link it to the home page with `aria-label="Daftr home"`.

| Version | Mark | Word | Where |
|---|---|---|---|
| Default | `primary` tile, `on-primary` notebook | `ink` | Nav, auth, emails |
| One ink | `ink` outline tile and notebook | `ink` | Receipts, stamps, print |
| Mark alone | `primary` tile | (none) | Favicon, app icon (48px+), tight spaces |

**Rules.** Clear space around the lockup is half the tile (16px at 32px). Smallest mark: 24px. The tile corner is `radius-control`. In dark, the tile follows `primary` (light teal) and the notebook follows `on-primary` (deep teal), so it stays legible without a separate dark logo in code. The SVG files under Assets have fixed colours for places CSS can't reach (favicon, email): use `daftr-mark.svg` on light backgrounds and `daftr-mark-dark.svg` on dark.

| Do | Don't |
|---|---|
| Set the word as live text in Inter | Turn the word into an image |
| Keep the tile square | Stretch, rotate, outline or recolour the tile |
| Use the mark alone for the favicon | Put the full lockup at 16px |
| Use the one-ink version on photos or print | Place the colour tile on a busy photo |

**Build it**

```tsx
import Link from "next/link";

export function Logo({ size = 32 }: { size?: 32 | 40 }) {
  const icon = size === 40 ? 22 : 18;
  return (
    <Link href="/" aria-label="Daftr home" className="inline-flex min-h-tap items-center gap-2.5 text-ink">
      <span className="grid place-items-center rounded-control bg-primary text-on-primary" style={{ width: size, height: size }}>
        <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6z" /><path d="M10 8h5M10 12h5M10 16h3" />
        </svg>
      </span>
      <span className={size === 40 ? "text-[26px] font-semibold tracking-tight" : "text-[22px] font-semibold tracking-tight"}>Daftr</span>
    </Link>
  );
}
```
