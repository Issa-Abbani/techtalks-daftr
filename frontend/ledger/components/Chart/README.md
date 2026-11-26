# Chart

A bar chart that answers one question in its heading. Use it on the dashboard only when a key figure or a list isn't enough.

**Anatomy.** Heading as a question in `text-title` ("When will each product run out?") · `Sample data` tag while data is invented · one-sentence summary in `text-small` `muted` with the period, the as-of time and the main finding · bars · axis · "Show as table".

**Marks.** Horizontal bars, 16px thick, `chart-1`, square at the baseline and 4px round at the data end. The axis starts at 0, has even steps and names its unit ("days"). The value sits after each bar in `ink`, never in the bar colour. One series needs no legend; the heading names it.

**Status in a chart.** Bars never turn amber or red. A product that is low gets the `TriangleAlert` icon and "Low stock" in `warning` next to its name, the same words as StatusBadge.

**States.** Ready, loading (skeleton bars the size of the chart), empty ("No sales yet. This chart fills in after a week of sales."), error (message + Reload where the chart would be; the rest of the page stays).

**Interaction.** Each bar is focusable; hover or keyboard focus shows a tooltip with name, value and unit. The tooltip repeats what's visible; it never holds the only copy of a number. "Show as table" opens the same numbers as a table.

**Colour.** Up to three series in fixed order: `chart-1` teal, `chart-2` orange, `chart-3` violet. A category keeps its colour on every chart. A fourth series folds into "Other" or the chart splits in two.

**What you provide.** `title` (a question), `summary`, `unit`, `data` ({ label, value, status? }[]), `asOf`, optional `sample`.

| Do | Don't |
|---|---|
| Ask the owner's question in the heading | Title a chart "Bar chart" or "Analytics" |
| Start bars at 0 | Crop the axis to make small changes look big |
| Sort bars by the answer (soonest to run out first) | Sort alphabetically |
| Show the table on request | Leave numbers only in the picture |
| Two charts for two measures | A dual-axis chart |

**Build it**

```tsx
import { TriangleAlert } from "lucide-react";

export function BarChart({ title, summary, unit, max, data }: {
  title: string; summary: string; unit: string; max: number;
  data: { label: string; value: number; low?: boolean }[];
}) {
  return (
    <section aria-label={title} className="flex flex-col gap-3 rounded-card border border-border bg-surface p-4 sm:p-6">
      <h2 className="text-title">{title}</h2>
      <p className="text-small text-muted">{summary}</p>
      {data.map((d) => (
        <div key={d.label} className="flex flex-col gap-1">
          <span className="flex items-center gap-2 text-[15px] font-medium">
            {d.label}
            {d.low && <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-warning"><TriangleAlert className="size-4" aria-hidden />Low stock</span>}
          </span>
          <span tabIndex={0} aria-label={`${d.label}: ${d.value} ${unit}`} className="group relative flex min-h-7 items-center gap-2">
            <span className="flex-1"><span className="block h-4 rounded-e bg-chart-1" style={{ width: `${(d.value / max) * 100}%` }} /></span>
            <span className="w-15 text-sm tabular-nums">{d.value} {unit}</span>
          </span>
        </div>
      ))}
    </section>
  );
}
```
