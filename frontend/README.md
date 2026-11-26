# Daftr frontend

Next.js (App Router) + Tailwind CSS v4 + shadcn/ui. The homepage is available in English and Arabic, with light and dark themes.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You are redirected to `/en` or `/ar` based on your browser language.

## Where things live

| Path | What |
| --- | --- |
| `app/[lang]/` | Root layout and homepage, one route per locale (`/en`, `/ar`) |
| `proxy.ts` | Redirects `/` to the visitor's preferred locale |
| `components/home/` | Homepage sections (navbar, hero, features, how it works, pricing, about, contact, footer) |
| `components/ui/` | shadcn/ui components |
| `locales/en.json`, `locales/ar.json` | Every user-visible string. Arabic is type-checked against English, so a missing key fails the build |
| `lib/i18n.ts`, `lib/i18n-config.ts` | Dictionary loading, supported locales, text direction |
| `app/globals.css` | Colour tokens, typography and motion |
| `ledger/` | The Ledger Clean design system. Colours in `globals.css` must match `ledger/tokens.css` |

## Rules

- **No hardcoded text.** Add strings to both locale files and read them from the dictionary.
- **No hardcoded colours.** Use token classes (`bg-primary`, `text-ink`, `bg-warning-soft`, ...), never hex values, `bg-white` or Tailwind's default palette.
- **Right-to-left ready.** Use logical classes (`ms-`, `pe-`, `start-`, `text-start`) and flip directional icons with `rtl:-scale-x-100`.
- **Touch friendly.** Tap targets are at least 44px on touch screens; form fields are at least 16px.

## Tests

```bash
npm test             # unit: translations complete, no hardcoded text, Ledger colour tokens
npm run build        # the browser tests run against the production build
npm run test:e2e     # Playwright: i18n, theme, animations, responsiveness
```

The browser tests use your installed Google Chrome, so no browser download is needed. The responsiveness suite covers 14 screen sizes in both languages, six emulated devices, rotation and 200% text, and saves screenshots to `test-results/` for visual review.
