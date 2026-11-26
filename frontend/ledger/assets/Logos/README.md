# Logos

- `daftr-mark.svg` — The notebook mark on a `primary` tile (#0B6B63) with a white notebook. For favicons, app icons and emails on light backgrounds. 48px artboard; scales cleanly down to 24px.
- `daftr-mark-dark.svg` — The same mark for dark backgrounds: dark-theme `primary` tile (#4FC1B4) with a deep-teal notebook (#062420).

These files carry fixed colours because `<img>`, favicons and email clients can't read CSS tokens. Inside the app, build the lockup in code (see the Logo component) so it follows the theme and a business's own `primary`. The wordmark is live text in Inter 600; there is no wordmark image on purpose.
