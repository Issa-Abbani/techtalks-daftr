# StatCard

One headline number with its label, for the dashboard: Total stock value, Products running low, Sold this week.

**Anatomy.** Label (`text-label`, `muted`) with an optional `Sample data` tag at the end · value (`text-display`, `ink`, tabular figures) · one context line (`text-small`, `muted`) with the scope and the as-of time: "Across 3 products, as of 24 Nov, 10:42". A number without a time is a number nobody can trust. Card styling as Card.

**Tap.** On the dashboard the whole stat card links to the list behind the number (Total stock value opens the product list). Give it a visible "View products" link rather than relying on the card edge.

**Sample data.** Until the owner has real data, every invented number carries the `Sample data` tag (`radius-pill`, `border-strong` edge, `muted` 12px text). The Buzzy Beans figure "$1,284" is sample data.

**Loading.** Skeleton bars sized like the value (150 × 44) and the context line; `aria-busy="true"` and `aria-label="Total stock value, loading"`.

**Layout.** Full width and stacked on phones; two per row from 640px, up to four from 1024px. Never more than four.

**What you provide.** `label`, `value` (already formatted: "$1,284"), optional `note`, optional `sample` flag, optional `loading`.

| Do | Don't |
|---|---|
| One number per card | Three numbers squeezed into one card |
| Format numbers before passing them in | Show "1284.5" raw |
| Context in words and time: "Across 3 products, as of 24 Nov, 10:42" | Unexplained arrows or percentages |
| Step down to `text-heading` past 10 characters | Let the number wrap or truncate |

**Build it**

```tsx
export function StatCard({ label, value, note, sample, loading }: {
  label: string; value: string; note?: string; sample?: boolean; loading?: boolean;
}) {
  return (
    <section aria-busy={loading || undefined} aria-label={loading ? `${label}, loading` : undefined}
      className="flex flex-col gap-1 rounded-card border border-border bg-surface p-4 shadow-card sm:p-6">
      <div className="flex items-center justify-between gap-2 text-label text-muted">
        <span>{label}</span>
        {sample && <span className="inline-flex min-h-6 items-center rounded-pill border border-border-strong bg-surface px-2.5 text-xs font-medium text-muted">Sample data</span>}
      </div>
      {loading ? (
        <>
          <span className="my-0.5 block h-11 w-[150px] animate-pulse rounded-md bg-border" />
          <span className="mt-1.5 block h-3.5 w-[120px] animate-pulse rounded-md bg-border" />
        </>
      ) : (
        <>
          <span className={`${value.length > 10 ? "text-heading" : "text-display"} tabular-nums`}>{value}</span>
          {note && <span className="text-small text-muted">{note}</span>}
        </>
      )}
    </section>
  );
}
```
