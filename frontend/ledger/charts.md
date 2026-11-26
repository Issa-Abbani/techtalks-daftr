# Charts

How the dashboard shows numbers. Ask first whether a number or a list does the job; for a shop owner it usually does. Use a chart only when a comparison has to be seen at a glance.

## The four dashboard items from the brief

| Item | Form | Why |
|---|---|---|
| Total stock value | StatCard | One number the owner needs at once. Add scope and as-of time: "Across 3 products, as of 24 Nov, 10:42". |
| Low-stock items | A list of product rows with StatusBadge, most urgent first | Owners act on names, not shapes. A chart would hide which product to reorder. |
| Top sellers | Horizontal bars, one series (`chart-1`), top 5, sorted, value at the end of each bar | A ranking reads best as sorted bars. Measure in sales ($) or units sold of one product, never mixed units across products. |
| Sales vs stock | **Days of stock left** per product (Chart component) | See below. |

**Sales vs stock: the question behind it.** Plotting sales and stock on one chart needs two axes (units sold per week and units on the shelf), and dual-axis charts mislead. Products also have different units (kg, cartons, pcs), so their bars can't share a scale. The owner's real question is "when will I run out?". Divide stock by average daily sales and show **days of stock left** for each product: one number, one unit, one axis, sorted soonest first. If the team still wants both measures, show two small charts side by side, each with its own heading and an axis starting at 0.

## Data colours

Three series at most, always in this order. They are separate from `primary` (too dark to read as a data colour) and from the status colours (reserved for Healthy, Low stock, Out of stock, Expired).

| Token | Light | Dark | Use |
|---|---|---|---|
| `chart-1` | #00917F teal | #20A393 | The first or only series |
| `chart-2` | #E8710A orange | #D9752A | Second series |
| `chart-3` | #6A5AD8 violet | #9085E9 | Third series |

Validated with the dataviz palette checker against `surface` in each theme, all pairs: light passes every check (worst colour-blind separation ΔE 11.4, normal vision 23.9, all three ≥ 3:1 on white); dark passes every check (worst ΔE 13.0 / 20.4, all ≥ 3:1 on `#161A20`). A fourth series is not allowed: fold it into "Other" or split the chart.

## Rules

- The heading asks the owner's question ("When will each product run out?"), never names the chart type.
- One sentence under the heading gives the period, the as-of time and the main finding. Screen readers get it as the chart's description.
- Bar and area axes start at 0, with even steps and the unit named. No dual axes.
- Values and labels are `ink` or `muted`. Only the marks use `chart-*`.
- Status never colours a bar. A low product shows `TriangleAlert` + "Low stock" next to its name.
- Every chart has loading, empty, error and a table view ("Show as table").
- Bars are keyboard-focusable; the tooltip appears on hover and on focus and repeats what's visible.
- At 375px show key figures and the table first; keep the chart only if it fits without horizontal scrolling.
- No animation on load.
- A category keeps the same colour on every chart and every page.
