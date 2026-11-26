# StatusBadge

The stock status of one product: an icon and a word in a pill. Never colour alone.

| Status | Fill / text | Icon (Lucide) | Rule |
|---|---|---|---|
| Healthy | `success-soft` / `success` | `CircleCheck` | Quantity above the reorder level |
| Low stock | `warning-soft` / `warning` | `TriangleAlert` | Quantity above 0 and at or below the reorder level |
| Out of stock | `danger-soft` / `danger` | `CircleX` | Quantity is 0 |
| Expired | `danger-soft` / `danger` | `CalendarX` | Past its expiry date (wins over every other status) |

Out of stock and Expired share colours on purpose (both mean "you can't sell this"); the icon and word tell them apart.

**Look.** `radius-pill`, 28px tall, padding 8px start / 10px end, icon 16px, gap 6px, `text-caption` semibold (13px). Not interactive, so it doesn't need 44px; if a badge ever filters a list, wrap it in a 44px button.

**Placement.** At the end of a product row (`justify-between`), never in front of the product name. In tables, its own column labelled "Status".

**What you provide.** `status: "healthy" | "low" | "out" | "expired"`. Compute it in one shared function so every screen agrees.

| Do | Don't |
|---|---|
| Exactly these four words | "OK", "Critical", "Warning" |
| Icon + word together | A coloured dot |
| One badge per product | Two badges (Low stock + Expired) |

**Build it**

```tsx
import { CalendarX, CircleCheck, CircleX, TriangleAlert } from "lucide-react";

export type StockStatus = "healthy" | "low" | "out" | "expired";

export function stockStatus(qty: number, reorderAt: number | null, expiresAt?: Date | null): StockStatus {
  if (expiresAt && expiresAt < new Date()) return "expired";
  if (qty <= 0) return "out";
  if (reorderAt != null && qty <= reorderAt) return "low";
  return "healthy";
}

const map = {
  healthy: { label: "Healthy", Icon: CircleCheck, cls: "bg-success-soft text-success" },
  low: { label: "Low stock", Icon: TriangleAlert, cls: "bg-warning-soft text-warning" },
  out: { label: "Out of stock", Icon: CircleX, cls: "bg-danger-soft text-danger" },
  expired: { label: "Expired", Icon: CalendarX, cls: "bg-danger-soft text-danger" },
};

export function StatusBadge({ status }: { status: StockStatus }) {
  const { label, Icon, cls } = map[status];
  return (
    <span className={`inline-flex min-h-7 items-center gap-1.5 whitespace-nowrap rounded-pill ps-2 pe-2.5 text-caption font-semibold ${cls}`}>
      <Icon className="size-4" aria-hidden />{label}
    </span>
  );
}
```
