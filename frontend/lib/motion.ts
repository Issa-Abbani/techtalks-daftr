import type { CSSProperties } from "react";

/** Inline style that delays a `[data-reveal]` element's entrance, for staggering. */
export function reveal(delayMs: number): CSSProperties {
  return { "--reveal-delay": `${delayMs}ms` } as CSSProperties;
}

/** Inline style giving an animated child its position in a staggered sequence. */
export function stagger(index: number, extra?: CSSProperties): CSSProperties {
  return { "--i": index, ...extra } as CSSProperties;
}
