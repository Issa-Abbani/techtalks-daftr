"use client";

import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element the first time it scrolls into view.
 * Elements opt in with the attribute and can stagger with an inline `--reveal-delay`.
 * The hidden starting state lives in CSS behind `html.js`, so without JavaScript
 * (or with reduced motion) content is simply shown.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const reveal = (el: Element) => el.setAttribute("data-revealed", "");

    if (!("IntersectionObserver" in window)) {
      elements.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          reveal(entry.target);
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
