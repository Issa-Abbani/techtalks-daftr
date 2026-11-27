# Daftr frontend

The Daftr homepage, in English and Arabic, with light and dark themes.

Built with Next.js (App Router), Tailwind CSS v4 and shadcn/ui. Icons come from lucide-react.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You're sent to `/en` or `/ar` depending on your browser's language.

## How the page is put together

```
app/
  [lang]/layout.tsx    <html> and <body>: fonts, language, text direction
  [lang]/page.tsx      the homepage: lists the sections from top to bottom
  globals.css          colours, fonts and animations (read the comments at the top)
proxy.ts               sends "/" to "/en" or "/ar"
locales/
  en.json, ar.json     every word on the site
lib/
  i18n-config.ts       supported languages, right-to-left helper
  i18n.ts              loads the words for a language ("the dictionary")
  motion.ts            helpers for the fade-in animations
components/
  home/                one file per part of the homepage (navbar.tsx, hero.tsx, ...)
  ui/                  shadcn/ui building blocks (Button, Input, Sheet, ...)
  boot-script.tsx      sets the theme before the page is drawn
ledger/                the Ledger Clean design system the colours come from
tests/                 unit tests and browser tests (see "Tests" below)
```

`page.tsx` loads the dictionary for the current language and passes it to each section as `dict`. Each section reads its own part, for example `dict.pricing.title`.

### Languages

The language is the first part of the URL (`/en`, `/ar`), which is why the app lives in a folder called `[lang]`. Arabic is written right to left: the layout sets `dir="rtl"` on `<html>`, and the page mirrors automatically as long as components use **start/end** classes instead of left/right:

| Use | Not |
| --- | --- |
| `ms-4`, `me-4`, `ps-4`, `pe-4` | `ml-4`, `mr-4`, `pl-4`, `pr-4` |
| `start-0`, `end-0` | `left-0`, `right-0` |
| `text-start`, `text-end` | `text-left`, `text-right` |

Icons that point somewhere (arrows) need `rtl:-scale-x-100` so they flip. `ForwardArrow` already does this.

Fonts: English uses Geist. Anything in Arabic uses IBM Plex Sans Arabic, chosen in `globals.css` with `:lang(ar)`. See the comment there for why the order matters.

### Colours and dark mode

Colours come from the Ledger design system (`ledger/tokens.css`) and are set up in `app/globals.css`. Use the colour classes, never raw colours:

- Good: `bg-primary`, `text-muted-foreground`, `bg-surface`, `text-warning`
- Not allowed: `#0b6b63`, `bg-[#...]`, `bg-white`, `text-teal-700`

Dark mode works by adding the `dark` class to `<html>`. Every colour has a light and a dark value, so components don't need `dark:` classes for colour. The theme toggle saves the choice, and `boot-script.tsx` applies it before the page is drawn so it doesn't flash.

### Animations

Anything with a `data-reveal` attribute fades in when it's scrolled into view. `components/home/scroll-reveal.tsx` watches for that, and the animation itself is in `globals.css` under "Motion". To make items in a list appear one after another, add a delay:

```tsx
<li data-reveal style={revealDelay(index * 100)}>
```

People who turned on "reduce motion" on their device, or who have JavaScript off, see everything straight away.

## How to...

**Change some text.** Edit it in `locales/en.json` and `locales/ar.json`.

**Add new text.** Add the same key to both locale files, then read it in the component, e.g. `dict.hero.badge`. If the Arabic file is missing the key, the build fails and tells you.

**Add a section.**
1. Create `components/home/my-section.tsx` that takes `{ dict }`. Copy `features.tsx` as a starting point.
2. Add its text under a new key in both locale files.
3. Render it in `app/[lang]/page.tsx`.
4. To link to it from the navbar, give the `<section>` an `id` and add it to `components/home/section-links.ts` (with labels in both locale files).

**Change a colour.** Change it in `ledger/tokens.css` and the same value in `app/globals.css` (section 2). A unit test checks the two match.

## Rules

- **No text in components.** All words come from the locale files.
- **No raw colours.** Use the colour classes above.
- **Right-to-left safe.** Use start/end classes; flip arrows.
- **Touch friendly.** Anything you can tap is at least 44px; form fields use 16px text (smaller makes iPhones zoom in).

The tests check all four.

## Tests

```bash
npm test             # unit tests, no browser needed
npm run build        # the browser tests run against the production build
npm run test:e2e     # browser tests (uses your installed Google Chrome)
```

| Test file | What it checks |
| --- | --- |
| `tests/unit/translations.test.mts` | Both locale files have the same keys; Arabic is really Arabic; no text typed into components |
| `tests/unit/ledger-colors.test.mts` | No raw colours in components; `globals.css` matches `ledger/tokens.css` |
| `tests/e2e/i18n.spec.ts` | Every string shows up on its page; no mixed languages; redirects and the language switcher |
| `tests/e2e/arabic.spec.ts` | Arabic looks like English, mirrored: same colours and type, right fonts, readable contrast, correct sides |
| `tests/e2e/theme.spec.ts` | Light and dark mode, and the theme toggle |
| `tests/e2e/motion.spec.ts` | Fade-in animations, reduced motion, no JavaScript |
| `tests/e2e/responsive.spec.ts` | 14 screen sizes in both languages, 6 devices, rotation and 200% text: nothing overflows, text fits, tap targets are big enough |

Failures name the element and what's wrong with it. Screenshots for checking by eye are saved to `test-results/`.

## Notes

- `components/ui/` is generated by shadcn/ui. It's kept close to the original so updates are easy; the only changes are Ledger colours (button hovers, field backgrounds) and right-to-left and touch fixes (start/end padding on buttons and badges, a bigger close button on the menu).
- Sign in, Sign up, the pricing buttons and the contact form aren't connected to anything yet.
- Prices, contact details and the dashboard numbers are placeholders.
