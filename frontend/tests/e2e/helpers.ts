import type { Page } from "@playwright/test";

/** Scrolls top to bottom in viewport steps so every scroll-reveal element triggers, then waits for transitions. */
export async function scrollThroughPage(page: Page) {
  await page.evaluate(async () => {
    // The page uses smooth scrolling; jump instantly so each step actually lands.
    const step = window.innerHeight * 0.6;
    for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(1500);
}

/** Waits until smooth scrolling has come to rest. */
export async function waitForScrollEnd(page: Page) {
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const y = window.scrollY;
        setTimeout(() => resolve(window.scrollY === y), 150);
      }),
    undefined,
    { timeout: 5000 }
  );
}

export type AuditOptions = {
  /** Minimum tap target in CSS px: 44 (Ledger `tap-min`) on touch screens, 24 (WCAG 2.5.8) elsewhere. */
  minTarget: number;
  /** Limit the checks to this element (defaults to the whole body). */
  scope?: string;
};

export type AuditResult = {
  pageOverflow: { scrollWidth: number; clientWidth: number };
  leaking: string[];
  overflowingText: string[];
  smallTargets: string[];
  smallText: string[];
  smallInputs: string[];
};

/**
 * One pass over the rendered page collecting every responsiveness problem we test for.
 * Each list holds human-readable descriptions so a failure says exactly what to fix.
 */
export async function auditLayout(page: Page, options: AuditOptions): Promise<AuditResult> {
  return page.evaluate(({ minTarget, scope }) => {
    const root = scope ? document.querySelector(scope)! : document.body;
    const vw = document.documentElement.clientWidth;
    const describe = (el: Element) => {
      const text = (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 40);
      const cls = String(el.getAttribute("class") ?? "").split(" ").slice(0, 4).join(".");
      return `<${el.tagName.toLowerCase()}${cls ? "." + cls : ""}> "${text}"`;
    };
    const visible = (el: Element) => {
      const r = el.getBoundingClientRect();
      const s = getComputedStyle(el);
      return r.width > 1 && r.height > 1 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.01;
    };
    // Decorative (aria-hidden) and screen-reader-only content is not judged on text or targets.
    const decorative = (el: Element) => !!el.closest('[aria-hidden="true"], .sr-only');
    const insideScroller = (el: Element) => {
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
        if (getComputedStyle(p).overflowX !== "visible") return true;
      }
      return false;
    };
    const all = [...root.querySelectorAll("*")];

    const leaking = all
      .filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.width <= 1 || r.height <= 1) return false;
        if (r.left >= -1 && r.right <= vw + 1) return false;
        return !insideScroller(el);
      })
      .map((el) => `${describe(el)} spans ${Math.round(el.getBoundingClientRect().left)}..${Math.round(el.getBoundingClientRect().right)} of ${vw}px`);

    // Text wider than its own box: long words spilling out, or content clipped by overflow:hidden.
    // Intentional single-line truncation (`.truncate`) and real scroll containers are allowed.
    const overflowingText = all
      .filter((el) => {
        if (decorative(el) || !visible(el)) return false;
        const s = getComputedStyle(el);
        if (s.display === "inline" || el.matches("input, textarea, svg, svg *, .truncate")) return false;
        if (["auto", "scroll"].includes(s.overflowX)) return false;
        const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim());
        return hasText && el.scrollWidth > el.clientWidth + 1;
      })
      .map((el) => `${describe(el)} content ${el.scrollWidth}px in a ${el.clientWidth}px box`);

    const smallTargets = [...root.querySelectorAll("a[href], button, input, textarea, select, [role='button']")]
      .filter((el) => visible(el) && !decorative(el))
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return Math.round(r.height) < minTarget || Math.round(r.width) < minTarget;
      })
      .map((el) => {
        const r = el.getBoundingClientRect();
        return `${describe(el)} is ${Math.round(r.width)}x${Math.round(r.height)}px (min ${minTarget})`;
      });

    const smallText = all
      .filter((el) => !decorative(el) && visible(el))
      .filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent!.trim()))
      .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12)
      .map((el) => `${describe(el)} is ${getComputedStyle(el).fontSize}`);

    // iOS Safari zooms the whole page when a focused field is under 16px.
    const smallInputs = [...root.querySelectorAll("input, textarea, select")]
      .filter((el) => visible(el) && parseFloat(getComputedStyle(el).fontSize) < 16)
      .map((el) => `${describe(el)}#${el.id} is ${getComputedStyle(el).fontSize}`);

    return {
      pageOverflow: { scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth },
      leaking,
      overflowingText,
      smallTargets,
      smallText,
      smallInputs,
    };
  }, options);
}

/** Number of columns a set of grid items is laid out in (items sharing the first row's top). */
export async function columnsOf(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((els) => {
    const tops = els.map((e) => (e as HTMLElement).offsetTop);
    return tops.filter((t) => t === tops[0]).length;
  });
}
