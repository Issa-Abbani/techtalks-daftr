# FormMessage

The result of submitting a form, shown at the top of that form: an error that isn't about one field, or a success.

| Variant | Tokens | Icon | Role |
|---|---|---|---|
| Error | `danger-soft` fill, `danger` text | `CircleAlert` | `role="alert"` |
| Success | `success-soft` fill, `success` text | `CircleCheck` | `role="status"` |

**Look.** `radius-control`, padding `space-3` `space-4`, 15/22 text, icon 20px aligned to the first line, `space-3` gap. Full width of the form.

**When to use.** Wrong email or password, no connection, server error, too many attempts, reset link sent, email verified. A problem with one field goes under that field (TextField error), not here. News about the page goes in an Alert.

**Behaviour.** Appears after submit, above the first field; move focus to it on error so screen readers and keyboard users land on it. Clears when the form is submitted again. Not dismissible.

**What you provide.** `variant` and a message of one or two short sentences. Optional bold lead-in for success ("**Email verified.** Your shop is ready.").

| Do | Don't |
|---|---|
| "No connection. Check your internet and try again. Nothing was lost." | "Error 503: Service unavailable" |
| One message at a time | Stack three messages |

**Build it**

```tsx
import { CircleAlert, CircleCheck } from "lucide-react";

export function FormMessage({ variant, children }: { variant: "error" | "success"; children: React.ReactNode }) {
  const Icon = variant === "error" ? CircleAlert : CircleCheck;
  return (
    <div role={variant === "error" ? "alert" : "status"} tabIndex={-1}
      className={`flex items-start gap-3 rounded-control px-4 py-3 text-[15px] leading-[22px] ${variant === "error" ? "bg-danger-soft text-danger" : "bg-success-soft text-success"}`}>
      <Icon className="mt-px size-5 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
```
