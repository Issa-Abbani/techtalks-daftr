# Button

Starts an action. One primary per screen; everything else is secondary or a text link.

| Variant | Tokens | Use for |
|---|---|---|
| Primary | `primary` fill, `on-primary` label, `primary-hover` on hover | The action the screen exists for: Log in, Create account, Verify email |
| Secondary | `surface` fill, `border-strong` edge, `ink` label, `primary-soft` on hover | The other choice: Log in (next to Get started), Cancel |
| Danger | `danger-solid` fill, `on-danger` label, `danger` on hover | Deleting for good, after a confirm dialog that names the thing |
| Text link | `primary` text, underline on hover, 44px tall | Low-weight actions: Forgot password?, Send a new code |

| State | Look | Behaviour |
|---|---|---|
| Hover | Fill darkens (primary, danger) or tints (secondary) | Instant colour change; only `transform` animates |
| Pressed | Scales to 98% | 100ms |
| Focus | 3px `primary` outline, 2px offset | Keyboard only |
| Disabled | `disabled` fill, `muted` label | Not clickable; prefer enabling the button and showing errors on submit |
| Loading | Spinner + "-ing…" label ("Logging in…") | `aria-busy="true"`, ignores taps, keeps its width |

**Size.** Height `control-height` (52px), side padding `space-6`, label 16px semibold, gap `space-2` to an icon (20px). Full width on phones for the main form action (`w-full`); natural width from 640px. The compact version in the nav is 44px tall with `space-4` padding.

**What you provide.** `variant`, the label (a verb: "Create account"), optional leading Lucide icon, `loading`, `disabled`, and `type` (`"submit"` inside forms).

**Copy.** Verb first, sentence case, two or three words. Loading labels end in an ellipsis character (…).

| Do | Don't |
|---|---|
| "Create account" | "Submit", "OK", "Continue" |
| Disable only while loading | Disable the submit button until the form is valid (owners can't tell why) |
| Use danger only for permanent loss | Use danger for Cancel or Log out |

**Build it**

```tsx
import { LoaderCircle } from "lucide-react";
import { btn } from "@/lib/ui";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  loadingLabel?: string;
  block?: boolean;
};

export function Button({ variant = "primary", loading, loadingLabel, block, className = "", children, ...rest }: Props) {
  return (
    <button
      {...rest}
      aria-busy={loading || undefined}
      disabled={rest.disabled}
      className={`${btn.base} ${btn[variant]} ${block ? "w-full" : ""} ${loading ? "pointer-events-none" : ""} ${className}`}
    >
      {loading && <LoaderCircle className="size-5 animate-spin" aria-hidden />}
      {loading ? loadingLabel ?? children : children}
    </button>
  );
}
```
