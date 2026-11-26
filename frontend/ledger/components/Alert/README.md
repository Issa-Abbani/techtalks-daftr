# Alert

An inline banner about the page or the shop: something the owner should know or act on, not the result of a form.

| Variant | Fill / text | Icon | Example |
|---|---|---|---|
| Info | `primary-soft` / `ink`, icon `primary` | `Info` | Verify your email |
| Warning | `warning-soft` / `warning` | `TriangleAlert` | Oat Milk is running low |
| Danger | `danger-soft` / `danger` | `CircleAlert` | Changes not saved |
| Success | `success-soft` / `success` | `CircleCheck` | Stock updated |

**Anatomy.** Icon (20px) · title (semibold) · one line of text (15/22) · optional action link (44px tall, underlined on coloured fills) · optional dismiss button (`X`, 44 × 44, `aria-label="Dismiss"`). `radius-card`, padding `space-3` `space-4`. No border, no coloured side stripe.

**Placement.** Top of the content area, under the page heading, full width. At most one alert per screen; the most urgent wins.

**Behaviour.** Info and success may be dismissed; warning and danger stay until the problem is gone. Danger uses `role="alert"`; the others `role="status"`. A success alert that confirms an action can disappear after 6 seconds, but never one with an action link.

**What you provide.** `variant`, `title`, `children` (the line), optional `action` ({ label, href or onClick }), optional `onDismiss`.

| Do | Don't |
|---|---|
| Title says the news; line says the detail | Repeat the title in the line |
| One action, named by its verb: "View product" | Two buttons in a banner |
| Use for news the owner didn't cause | Use for "Wrong password" (that's a FormMessage) |

**Build it**

```tsx
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";

const styles = {
  info: { box: "bg-primary-soft text-ink", icon: "text-primary", Icon: Info },
  warning: { box: "bg-warning-soft text-warning", icon: "", Icon: TriangleAlert },
  danger: { box: "bg-danger-soft text-danger", icon: "", Icon: CircleAlert },
  success: { box: "bg-success-soft text-success", icon: "", Icon: CircleCheck },
};

export function Alert({ variant, title, children, action, onDismiss }: {
  variant: keyof typeof styles; title: string; children?: React.ReactNode;
  action?: { label: string; href: string }; onDismiss?: () => void;
}) {
  const s = styles[variant];
  return (
    <div role={variant === "danger" ? "alert" : "status"} className={`flex items-start gap-3 rounded-card py-3 ps-4 pe-2 ${s.box}`}>
      <s.Icon className={`mt-[3px] size-5 shrink-0 ${s.icon}`} aria-hidden />
      <div className="flex flex-1 flex-col gap-0.5 py-0.5">
        <p className="font-semibold">{title}</p>
        {children && <p className="text-[15px] leading-[22px]">{children}</p>}
        {action && <a href={action.href} className="inline-flex min-h-tap items-center self-start font-medium underline underline-offset-4">{action.label}</a>}
      </div>
      {onDismiss && (
        <button type="button" onClick={onDismiss} aria-label="Dismiss" className="grid min-h-tap min-w-tap place-items-center rounded-control hover:bg-surface/60">
          <X className="size-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
```
