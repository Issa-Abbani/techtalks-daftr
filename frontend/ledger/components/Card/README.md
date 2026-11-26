# Card

A `surface` box that groups related content: a list of products, a form, a chart. Edged by 1px `border`, `radius-card`, no shadow.

**Anatomy.** Optional header (title in `text-title` + one trailing item: a tag, a link or a 44px icon button) · content. Padding `space-4` on phones, `space-6` from 640px. Rows inside are at least 60px tall, separated by 1px `border` lines.

**Empty state.** When a card has nothing to show, keep the card and its title, and replace the content with: a 48px `primary-soft` tile holding a Lucide icon, a bold line saying what's missing, one `muted` line saying how to start, and at most one primary button. See **Copy** for each empty state.

**Loading.** Show skeleton bars (`border` colour, gentle pulse) the same size as the content that will arrive. No spinners in cards.

**Error.** If a card's data fails to load, keep the card and its title and put a `CircleAlert` line in `danger-solid` with a secondary "Reload" button where the content would be: "Couldn't load stock levels. Check your connection." The rest of the page stays as it is.

Every card defines four states: loading, empty, ready and error.

**What you provide.** Optional `title` (also used for `aria-labelledby`), optional header `action`, `children`.

| Do | Don't |
|---|---|
| One topic per card | Cards inside cards |
| Rows separated by hairlines | Zebra stripes or coloured row fills |
| Whole card is not clickable; put a link inside | Make the card a giant link with a faint `border` edge |
| Keep the card and title when empty | Hide the card when there's no data |

**Build it**

```tsx
export function Card({ title, action, children }: { title?: string; action?: React.ReactNode; children: React.ReactNode }) {
  const id = title ? title.toLowerCase().replace(/\W+/g, "-") : undefined;
  return (
    <section aria-labelledby={id} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 shadow-card sm:p-6">
      {title && (
        <div className="flex items-center justify-between gap-3">
          <h2 id={id} className="text-title">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function ProductRow({ name, meta, status }: { name: string; meta: string; status: React.ReactNode }) {
  return (
    <div className="flex min-h-15 items-center justify-between gap-3 border-t border-border py-2">
      <div className="min-w-0">
        <p className="truncate font-medium">{name}</p>
        <p className="text-small tabular-nums text-muted">{meta}</p>
      </div>
      {status}
    </div>
  );
}
```
