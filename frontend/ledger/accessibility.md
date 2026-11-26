# Accessibility

Target: WCAG 2.1 AA in both themes, on a 390px phone, with a thumb. This is the audit of the tokens and components in this system. It is not a substitute for testing the built screens with TalkBack on an Android phone and VoiceOver on an iPhone.

## Contrast, every pair the components paint

| Pair | Tokens | Needs | Light | Dark |
|---|---|---|---|---|
| Body text | `ink` on `canvas` | 4.5:1 | 16.6:1 | 16.1:1 |
| Body text on cards | `ink` on `surface` | 4.5:1 | 17.8:1 | 14.8:1 |
| Secondary text | `muted` on `canvas` | 4.5:1 | 7.2:1 | 8.6:1 |
| Hints on cards | `muted` on `surface` | 4.5:1 | 7.8:1 | 7.9:1 |
| Links | `primary` on `surface` | 4.5:1 | 6.4:1 | 8.0:1 |
| Links on page | `primary` on `canvas` | 4.5:1 | 5.9:1 | 8.7:1 |
| Primary button label | `on-primary` on `primary` | 4.5:1 | 6.4:1 | 7.5:1 |
| Primary button hover | `on-primary` on `primary-hover` | 4.5:1 | 9.6:1 | 9.4:1 |
| Info alert text | `ink` on `primary-soft` | 4.5:1 | 15.3:1 | 11.3:1 |
| Healthy badge | `success` on `success-soft` | 4.5:1 | 8.3:1 | 9.0:1 |
| Low stock badge | `warning` on `warning-soft` | 4.5:1 | 7.5:1 | 8.5:1 |
| Out of stock / Expired badge | `danger` on `danger-soft` | 4.5:1 | 8.2:1 | 8.3:1 |
| Danger button label | `on-danger` on `danger-solid` | 4.5:1 | 6.5:1 | 6.9:1 |
| Field error text | `danger-solid` on `surface` | 4.5:1 | 6.5:1 | 6.5:1 |
| Field error on page | `danger-solid` on `canvas` | 4.5:1 | 6.0:1 | 7.1:1 |
| Disabled button label | `muted` on `disabled` | 4.5:1 | 6.2:1 | 6.3:1 |
| Input border | `border-strong` on `surface` | 3:1 | 3.7:1 | 4.0:1 |
| Input border on page | `border-strong` on `canvas` | 3:1 | 3.4:1 | 4.3:1 |
| Focus ring on page | `primary` on `canvas` | 3:1 | 5.9:1 | 8.7:1 |
| Focus ring on cards | `primary` on `surface` | 3:1 | 6.4:1 | 8.0:1 |
| Card edge (decorative) | `border` on `surface` | decorative | 1.3:1 | 1.3:1 |

Every pair passes in both themes. Two things to watch:

- `border` is decorative by design (1.3:1). Card edges are faint on purpose, which is fine because cards are not tappable. If a card ever becomes a link, give it `border-strong` or a visible "View" link inside it.
- `border-strong` on `canvas` in light is 3.4:1: it passes, with little margin. Put inputs on `surface` (inside a card) when you can, and never lighten this token.

Chart colours `chart-1` to `chart-3` are at least 3:1 on `surface` in both themes (see Charts); values and labels in charts use `ink` and `muted`, not the series colour.

Destructive-button hover (`on-danger` on `danger`) is 10.0:1 light, 9.7:1 dark.

## Rules every screen follows

1. **Tap targets.** Buttons and inputs are `control-height` (52px). Icon buttons, the Show/Hide button, text links and the menu toggle are at least `tap-min` (44 × 44px). Keep 8px between neighbouring targets.
2. **Focus.** One global rule gives every link, button and input a 3px solid `primary` outline with 2px offset, visible only for keyboard focus (`:focus-visible`). Never remove it; never replace it with a colour change only.
3. **Status never by colour alone.** StatusBadge always shows its icon and its word. Errors always show `CircleAlert` and a sentence. Success messages show `CircleCheck`.
4. **Labels.** Every input has a visible `<label>` above it. Hints and errors are tied to the input with `aria-describedby`; an input in error gets `aria-invalid="true"`.
5. **Announcements.** FormMessage errors use `role="alert"` (read at once); successes use `role="status"`. A loading button sets `aria-busy="true"` and changes its text ("Logging in…") so screen readers hear it.
6. **Code input.** Six boxes in a `<fieldset>` with a `<legend>`; each box has `aria-label="Digit n of 6"`, `inputmode="numeric"`; the first has `autocomplete="one-time-code"` so Android and iOS can fill it from the SMS or email. Pasting 6 digits fills all boxes. The group is always `dir="ltr"`, even in Arabic.
7. **Menu.** The menu toggle is a `<button>` with `aria-expanded` and `aria-controls`; Escape closes the menu and returns focus to the toggle.
8. **Zoom and text size.** Layouts survive 200% zoom and the phone's large-text setting without horizontal scrolling. Sizes are in rem in code.
9. **Motion.** Respect `prefers-reduced-motion`: no spinners rotating, no transitions.
10. **Language and direction.** Set `lang` and `dir` on `<html>`. Use logical properties so `dir="rtl"` mirrors the layout.

## Keyboard map

| Element | Tab | Enter / Space | Escape | Arrows |
|---|---|---|---|---|
| Button, link | Focus | Activate | (none) | (none) |
| Password Show/Hide | Focus after the input | Toggle | (none) | (none) |
| Code boxes | Focus first empty box | Submit form | (none) | Left/Right move between boxes; Backspace on an empty box goes back |
| Menu toggle | Focus | Open / close | Close, focus back on toggle | (none) |
| Alert dismiss | Focus | Dismiss, focus moves to the next heading | (none) | (none) |

## Screen reader names

| Element | Announced as |
|---|---|
| Logo link | "Daftr home, link" |
| Menu toggle | "Open menu, button, collapsed" / "Close menu, button, expanded" |
| Show/Hide | "Show, toggle button, not pressed" |
| Status badge | "Low stock" (icon is hidden) |
| Stat card | "Total stock value, $1,284, across 3 products, sample data" |
| Loading stat card | "Total stock value, loading" |
