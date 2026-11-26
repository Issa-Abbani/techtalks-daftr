# TextField

A labelled text input with optional hint and error. The password version adds a Show/Hide button.

**Anatomy, top to bottom.** Label (`text-label`, `ink`) · `space-2` · input · `space-2` · hint (`text-small`, `muted`) or error (`CircleAlert` 18px + message, `danger-solid`, 14px medium). Fields sit `space-4` apart.

| State | Look |
|---|---|
| Default | `surface` fill, 1px `border-strong`, `radius-control`, 52px tall, 16px text |
| Hover | Border `ink` |
| Focus | Border `primary` + the 3px focus ring |
| Error | 2px `danger-solid` edge + icon + message; `aria-invalid="true"` |
| Disabled | `canvas` fill, `border` edge, `muted` text |

**Password.** The Show/Hide button sits inside the input at the end (`inset-inline-end`), is 44px tall, shows an eye icon and the word ("Show" / "Hide"), and uses `aria-pressed`. The input gets `padding-inline-end: 96px` so text never runs under it.

**What you provide.** `id`, `label`, `type`, `autoComplete` (`email`, `current-password`, `new-password`, `organization`), optional `hint`, optional `error` (string), `inputMode` for numbers (`"decimal"`, `"numeric"`).

**Validation.** Validate on submit and on blur, not on every keystroke. Clear a field's error as soon as the owner edits it. Messages: see **Copy**.

| Do | Don't |
|---|---|
| Label above, always visible | Placeholder as the only label |
| `type="email"` + `inputMode="email"` | `type="text"` for email (wrong keyboard) |
| 16px text or larger | 14px inputs (iOS zooms in) |
| Error text that says how to fix it | "Invalid input" |

**Build it**

```tsx
import { CircleAlert, Eye, EyeOff } from "lucide-react";
import { useId, useState } from "react";
import { input } from "@/lib/ui";

type Props = React.InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string; error?: string };

export function TextField({ label, hint, error, type = "text", ...rest }: Props) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const describedBy = error ? `${id}-err` : hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-label text-ink">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={isPassword && show ? "text" : type}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${input} ${isPassword ? "pe-24" : ""}`}
          {...rest}
        />
        {isPassword && (
          <button type="button" aria-pressed={show} onClick={() => setShow(!show)}
            className="absolute end-1 top-1/2 inline-flex min-h-tap min-w-20 -translate-y-1/2 items-center justify-center gap-1.5 rounded-[4px] px-3 text-[15px] font-medium text-primary hover:bg-primary-soft">
            {show ? <EyeOff className="size-[18px]" aria-hidden /> : <Eye className="size-[18px]" aria-hidden />}
            {show ? "Hide" : "Show"}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${id}-err`} className="flex items-start gap-2 text-sm font-medium text-danger-solid">
          <CircleAlert className="mt-px size-[18px] shrink-0" aria-hidden />{error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-small text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
```
