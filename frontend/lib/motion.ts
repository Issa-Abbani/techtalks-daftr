import type { CSSProperties } from "react";

// Small helpers for the scroll animations defined in app/globals.css (see "Motion" there).

/**
 * Delays an element's fade-in so items in a list appear one after another.
 *
 * Use it on anything with a `data-reveal` attribute:
 *   <li data-reveal style={revealDelay(index * 100)}>
 */
export function revealDelay(milliseconds: number): CSSProperties {
  return { "--reveal-delay": `${milliseconds}ms` } as CSSProperties;
}

/**
 * Gives a chart bar its position in the sequence, so the bars grow one after another.
 * Extra styles (like the bar's height) can be passed in and are merged in.
 */
export function animationOrder(index: number, extraStyles?: CSSProperties): CSSProperties {
  return { "--i": index, ...extraStyles } as CSSProperties;
}
