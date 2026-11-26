Daftr is a stock notebook for small shops in Lebanon: minimarkets, supermarkets, cafés, snack shacks and barber shops. It replaces the paper ledger and the Excel file. The owner runs it on a phone, often a cheap one, often between customers. Ledger Clean is the chosen direction: calm, plain and precise, like a well-kept ledger. It has a light and a dark theme with the same token names.

The name means "notebook" (دفتر). The mark is a notebook. Keep everything else that plain.

Further sections: **Copy** (every label and message), **Accessibility** (the contrast audit and rules), **Charts** (how the dashboard shows numbers), **Research** (the test plan with real shop owners), **Next.js + Tailwind handoff** (the `@theme` block and how to use it).

## Principles

1. **Shop owner first.** Write and design for someone who has never used inventory software. If a screen needs a tutorial, the screen is wrong.
2. **Phone first, thumb first.** Design at 390px. Every tap target is at least `tap-min` (44px); buttons and inputs are `control-height` (52px). Primary actions are full width on phones.
3. **Feels like a notebook.** One task per screen, one primary button per screen, no dense menus, no tab bars with more than four items, no settings sprawl.
4. **Status in words.** Stock status is always an icon plus a word (Healthy, Low stock, Out of stock, Expired). Colour only reinforces.
5. **Light and fast.** No photos in the product UI, no gradients, no shadows, no decorative animation. A screen should be usable on a slow 3G connection after a power cut.
6. **Every colour is a token.** Components never contain hex values, so a business can later set its own `primary` and the whole product follows.

## Content fundamentals

- Speak to the owner as "you" and about their business as "your shop". Daftr never says "I" or "we" except in messages about Daftr itself ("We sent a code").
- Sentence case everywhere: "Create account", not "Create Account". No exclamation marks, no emoji.
- Use shop words: product, stock, shelf, reorder, sold. Avoid software words: SKU, inventory valuation, organization, tenant, workspace, dashboard widget, sync.
- Buttons start with a verb and say what happens: "Create account", "Send reset link", "Verify email", "Add product". Never "Submit", "OK" or "Continue" alone.
- Errors say what happened and how to fix it, in one or two short sentences, without blame: "That code doesn't match. Check the latest email from Daftr and try again."
- Numbers carry their unit and a thousands separator: "12 kg", "3 cartons", "200 pcs", "$1,284". Set them with tabular figures (`font-variant-numeric: tabular-nums`) so columns line up.
- Mark invented numbers. Any figure that is not the owner's own data carries the `Sample data` tag.
- Leave room for Arabic: labels can grow about 30%. Never build a sentence by gluing strings together; never put text inside images.

The full copy library is in the **Copy** section.

## Visual foundations

**Colour.** The page is `canvas`; cards, inputs and the nav bar are `surface`. Text is `ink`; secondary text is `muted`. `primary` (deep teal) is for the one main action, links and the focus ring. Text or icons on a `primary` fill use `on-primary` (white in light, deep teal in dark), never a literal white. Status colours come in pairs: text and icon in `success` / `warning` / `danger`, fill in the matching `-soft` token. `danger-solid` is for destructive buttons and field errors only. `chart-1` to `chart-3` colour data series in charts and nothing else; status colours never colour a chart series. `border` is decorative (dividers, card edges); anything you type into or tap gets `border-strong`. Disabled buttons use the `disabled` fill with `muted` text.

**Light and dark.** Both themes use the same token names; only the values change. Never write a colour that only works in one theme (no `text-white`, no `bg-black`). Dark mode follows the phone's setting by default. Dark values are a proposal from this system, not from the brief: they keep every pair at the same contrast as light or better (see Accessibility).

**Type.** One family, Inter at 400, 500 and 600, with Noto Sans Arabic as the Arabic fallback. Use the scale as named: `text-display` 40/48 for the landing hero and the big stat number, `text-heading` 30/36 for screen titles, `text-title` 20/28 for card titles, `text-body` 16/24 for reading, `text-small` 14/20 for hints, `text-caption` 13/18 for badges and tags, `text-label` 14/20 medium for form labels. Inputs are never below 16px (iOS zooms the page). Display and heading get -0.02em tracking; nothing else does.

**Spacing.** 4px steps: `space-1` 4, `space-2` 8, `space-3` 12, `space-4` 16, `space-6` 24, `space-8` 32, plus `space-12` 48 and `space-16` 64 for landing-page sections. Label to input is `space-2`; field to field is `space-4`; card padding is `space-4` on phones and `space-6` from 640px; page side padding is `space-4` on phones.

**Radius.** `radius-control` 8px for inputs, code boxes, alerts and form messages; `radius-button` 8px for buttons; `radius-card` 12px for cards; `radius-pill` for status badges and tags. Nothing else gets a radius.

**Borders, not shadows.** Cards are edged by 1px `border`. `shadow-card` is `none` in both themes and stays a token only so code can reference it. In dark, `surface` sits one step above `canvas` so cards still separate.

**States.** Every interactive element gets the same focus ring: 3px solid `primary`, 2px offset. Hover on a filled button switches to `primary-hover`; hover on a secondary button or icon button fills `primary-soft`. Pressed shrinks to 98% and takes the hover colour, because phones have no hover. Errors add a 2px `danger-solid` edge plus an icon and a message.

**Motion.** Only `transform` and `opacity` animate: a 100ms press to 98%. Hover colours change at once. Spinners only inside a loading button; content that is loading shows a skeleton the size of what will arrive. Nothing loops or moves on its own, and `prefers-reduced-motion` turns transitions off. Framer Motion is allowed but not needed for anything here.

**Layout.** Mobile first at 390px, single column, side padding 16px. The landing page sits in a 1152px container and goes to a 12-column grid at 1024px with the hero copy in columns 1–6 and the example ledger card in 8–12. Auth screens are a single 400px column, a bordered card from 640px. Full-height screens use `min-h-dvh`, never `h-screen`. Use logical properties throughout (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`) so right-to-left only needs `dir="rtl"`.

## Iconography

Use Lucide React, stroke width 2, at three sizes: `icon-sm` 16px in badges and chart flags, `icon-md` 20px in buttons, alerts and fields, `icon-lg` 24px for the menu toggle, app tabs and empty states. Icons are `currentColor` so they take the text colour. Never use emoji in the UI. Fixed meanings: `CircleCheck` = Healthy / success, `TriangleAlert` = Low stock / warning, `CircleX` = Out of stock, `CalendarX` = Expired, `CircleAlert` = error, `Info` = information, `Eye` / `EyeOff` = Show / Hide password, `Menu` / `X` = open / close menu, `LoaderCircle` = loading. Arrows (`ArrowRight`, chevrons) flip in right-to-left with `rtl:-scale-x-100`; status icons never flip.

## When to use each component

| Need | Use | Not this |
|---|---|---|
| The one main action on a screen | Button, primary | Two primary buttons side by side |
| Another action next to it | Button, secondary, or a text link | A second primary |
| Deleting something for good | Button, danger, after a confirm | Danger for "Cancel" |
| Typing an email, name, quantity | TextField | A placeholder with no label |
| The 6-digit email code | CodeInput | One long text field |
| The result of submitting a form | FormMessage at the top of the form | An alert banner |
| A problem with one field | TextField error | A FormMessage |
| News about the page or the shop | Alert | A FormMessage |
| Stock status of a product | StatusBadge | A coloured dot or coloured text |
| A group of related rows | Card | Nested cards |
| One headline number | StatCard | A card with three numbers |
| Brand in the header | Logo | A redrawn mark |
| Moving between app screens when signed in | AppNav (top bar + four bottom tabs; side rail from 1024px) | TopNav, a hamburger menu, or more than four tabs |
| A comparison over products | Chart (one question, one series) | A dual-axis chart or a pie |

## Do and don't

| Do | Don't |
|---|---|
| Use token utilities: `bg-primary`, `text-ink`, `border-border-strong` | Write `#0B6B63`, `bg-[#…]` or Tailwind's default palette (`bg-teal-700`) |
| Pair every status colour with its icon and word | Show stock status by colour alone |
| Keep one primary button per screen | Fill a screen with teal buttons |
| Put the label above the input, the error below it | Use placeholder text as the label |
| Use `ms-`, `pe-`, `start-`, `text-start` | Use `ml-`, `pr-`, `left-`, `text-left` |
| Test both themes and at 390px before merging | Design at 1440 and squeeze down |
| Mark invented figures with `Sample data` | Ship demo numbers that look real |
| Use 1px borders to separate | Add shadows, gradients or glass effects |

## Per-business colour (later)

Each business may set its own `primary`. Because components only use tokens, overriding `--color-primary`, `--color-primary-hover`, `--color-primary-soft` and `--color-on-primary` on `<html>` re-brands the product. Check the chosen colour before saving it: `on-primary` must reach 4.5:1 on it and `primary` must reach 3:1 on `canvas` and `surface` in both themes. If a colour fails, flip `on-primary` to `ink` or offer a darker shade; never let a business pick a colour that hides its own buttons.

## Using this system on a Design canvas

Load the compiled `tokens.css` first, then `components/bundle.css`. The `dz-` classes in the bundle (for example `dz-btn dz-btn--primary`, `dz-input`, `dz-badge dz-badge--low`, `dz-card`, `dz-tabbar`) match the component previews, and every colour inside them is a token. Put `data-theme="dark"` on a wrapper to show any screen in the dark theme.
