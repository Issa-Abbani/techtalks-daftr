"use client";

import { useEffect } from "react";

/**
 * Makes sections fade in as you scroll down to them.
 *
 * How it works:
 * 1. Elements that should animate have a `data-reveal` attribute.
 * 2. CSS (in globals.css, "Motion") starts them invisible and slightly lower.
 * 3. This component watches them, and when one scrolls into view it adds
 *    `data-revealed`, which CSS animates to fully visible.
 *
 * Each element only animates once. This renders nothing itself; it just needs
 * to be on the page once (see app/[lang]/page.tsx).
 *
 * If JavaScript is off, or the visitor asked their device for reduced motion,
 * the CSS never hides anything in the first place, so all content is still shown.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elementsToReveal = document.querySelectorAll("[data-reveal]");

    function reveal(element: Element) {
      element.setAttribute("data-revealed", "");
    }

    // Very old browsers can't watch scrolling this way: just show everything.
    if (!("IntersectionObserver" in window)) {
      elementsToReveal.forEach(reveal);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target); // done with it, it stays visible
          }
        }
      },
      {
        // Wait until an element is a little way onto the screen (12% visible,
        // and above the bottom 8% of the window) so the animation is actually seen.
        threshold: 0.12,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    elementsToReveal.forEach((element) => observer.observe(element));

    // Stop watching if the page is left.
    return () => observer.disconnect();
  }, []);

  return null;
}
