import { expect, test, type Browser, type Page } from "@playwright/test";

import { scrollThroughPage } from "./helpers";

/*
 * Checks that the Arabic page looks as intended, not just that it's translated.
 *
 * The English and Arabic pages are built from the same components, so element
 * number N on /en is the same element as number N on /ar. That lets us compare
 * them one by one: colours and type must match, and left/right spacing must be
 * mirrored. Any other difference means something is styled wrong in Arabic.
 */

type Theme = "light" | "dark";

/** Opens a page in a fresh browser context, scrolled through so every fade-in has finished. */
async function openPage(browser: Browser, lang: "en" | "ar", theme: Theme, width: number) {
  const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme: theme });
  const page = await context.newPage();
  await page.goto(`/${lang}`);
  await scrollThroughPage(page);
  await page.waitForTimeout(800); // let the last card transitions finish
  return { page, close: () => context.close() };
}

/** The computed style properties we compare, for every element on the page. */
async function collectStyles(page: Page) {
  return page.evaluate(() =>
    // Skip non-visual tags: Next.js puts the page data in <script> tags, and Arabic needs more of them.
    [...document.body.querySelectorAll("*:not(script, style, template, link, noscript)")].map((element) => {
      const style = getComputedStyle(element);
      return {
        name: `<${element.tagName.toLowerCase()}> "${(element.textContent ?? "").trim().slice(0, 30)}"`,
        color: style.color,
        background: style.backgroundColor,
        borderTopColor: style.borderTopColor,
        borderBottomColor: style.borderBottomColor,
        borderLeftColor: style.borderLeftColor,
        borderRightColor: style.borderRightColor,
        borderLeftWidth: style.borderLeftWidth,
        borderRightWidth: style.borderRightWidth,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        opacity: style.opacity,
        display: style.display,
        visibility: style.visibility,
        radiusTopLeft: style.borderTopLeftRadius,
        radiusTopRight: style.borderTopRightRadius,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        paddingTop: style.paddingTop,
        paddingBottom: style.paddingBottom,
      };
    })
  );
}

/** In Arabic, left and right swap, so English "left" must equal Arabic "right" and vice versa. */
const MIRRORED: Record<string, string> = {
  borderLeftColor: "borderRightColor",
  borderRightColor: "borderLeftColor",
  borderLeftWidth: "borderRightWidth",
  borderRightWidth: "borderLeftWidth",
  radiusTopLeft: "radiusTopRight",
  radiusTopRight: "radiusTopLeft",
  paddingLeft: "paddingRight",
  paddingRight: "paddingLeft",
};

for (const theme of ["light", "dark"] as const) {
  for (const width of [390, 1280]) {
    test(`${theme} @ ${width}px: Arabic matches English styling, mirrored`, async ({ browser }) => {
      const english = await openPage(browser, "en", theme, width);
      const arabic = await openPage(browser, "ar", theme, width);
      const englishStyles = await collectStyles(english.page);
      const arabicStyles = await collectStyles(arabic.page);
      await english.close();
      await arabic.close();

      expect(arabicStyles.length, "the two pages should have the same elements").toBe(englishStyles.length);

      const differences: string[] = [];
      englishStyles.forEach((englishElement, index) => {
        const arabicElement = arabicStyles[index];
        for (const [property, englishValue] of Object.entries(englishElement)) {
          if (property === "name") continue;
          const arabicProperty = (MIRRORED[property] ?? property) as keyof typeof arabicElement;
          if (arabicElement[arabicProperty] !== englishValue) {
            differences.push(
              `${englishElement.name} / ${arabicElement.name}: ${property} is ${englishValue} in English, ${arabicProperty} is ${arabicElement[arabicProperty]} in Arabic`
            );
          }
        }
      });
      expect(differences).toEqual([]);
    });
  }
}

test.describe("fonts", () => {
  // Elements whose text we check, covering headings, buttons, links, labels and body text.
  const samples = ["h1", "h2", "#features h3", "#pricing button", "#about table th", "#contact label", "footer p"];

  /** Asks Chrome which fonts it actually used to draw an element's text. */
  async function fontsUsedFor(page: Page, selector: string) {
    const session = await page.context().newCDPSession(page);
    await session.send("DOM.enable");
    await session.send("CSS.enable");
    const { root } = await session.send("DOM.getDocument", { depth: -1 });
    const { nodeId } = await session.send("DOM.querySelector", { nodeId: root.nodeId, selector });
    const { fonts } = await session.send("CSS.getPlatformFontsForNode", { nodeId });
    return fonts.map((font) => font.familyName);
  }

  for (const [lang, expectedFont] of [
    ["ar", "IBM Plex Sans Arabic"],
    ["en", "Geist"],
  ] as const) {
    test(`${lang} text is drawn in ${expectedFont}, never a system fallback`, async ({ page }) => {
      await page.goto(`/${lang}`);
      await scrollThroughPage(page);
      await page.evaluate(() => document.fonts.ready);

      for (const selector of samples) {
        const fonts = await fontsUsedFor(page, selector);
        const wrongFonts = fonts.filter((font) => !font.startsWith(expectedFont));
        expect(wrongFonts, `${selector} uses ${fonts.join(", ")}`).toEqual([]);
      }
    });
  }

  test("the Arabic language label on the English page uses the Arabic font", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/en");
    await page.evaluate(() => document.fonts.ready);
    const fonts = await fontsUsedFor(page, '[data-testid="language-switcher"] [data-i18n-ignore]');
    expect(fonts.every((font) => font.startsWith("IBM Plex Sans Arabic")), fonts.join(", ")).toBe(true);
  });
});

for (const theme of ["light", "dark"] as const) {
  for (const lang of ["en", "ar"] as const) {
    test(`${lang} ${theme}: all text meets WCAG AA contrast`, async ({ browser }) => {
      const { page, close } = await openPage(browser, lang, theme, 1280);

      const failures = await page.evaluate(() => {
        // Turn any CSS colour (rgb, oklab, color(), ...) into [r, g, b, a] by painting it on a canvas.
        const canvas = document.createElement("canvas").getContext("2d", { willReadFrequently: true })!;
        const toRgba = (cssColor: string) => {
          canvas.clearRect(0, 0, 1, 1);
          canvas.fillStyle = cssColor;
          canvas.fillRect(0, 0, 1, 1);
          const [r, g, b, a] = canvas.getImageData(0, 0, 1, 1).data;
          return [r, g, b, a / 255];
        };
        const luminance = ([r, g, b]: number[]) => {
          const channel = (value: number) => {
            const v = value / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        };
        // The colour behind an element: the nearest ancestor with a (mostly) solid background.
        const backgroundBehind = (element: Element) => {
          for (let current: Element | null = element; current; current = current.parentElement) {
            const rgba = toRgba(getComputedStyle(current).backgroundColor);
            if (rgba[3] > 0.5) return rgba;
          }
          return toRgba(getComputedStyle(document.body).backgroundColor);
        };

        const problems: string[] = [];
        for (const element of document.body.querySelectorAll("*")) {
          if (element.closest('[aria-hidden="true"], .sr-only')) continue; // decorative or screen-reader only
          const hasOwnText = [...element.childNodes].some((node) => node.nodeType === 3 && node.textContent!.trim());
          if (!hasOwnText) continue;

          const style = getComputedStyle(element);
          if (element.getBoundingClientRect().width < 1 || style.visibility === "hidden") continue;

          const textLuminance = luminance(toRgba(style.color));
          const backgroundLuminance = luminance(backgroundBehind(element));
          const ratio =
            (Math.max(textLuminance, backgroundLuminance) + 0.05) / (Math.min(textLuminance, backgroundLuminance) + 0.05);
          // Large text (24px, or 18.66px bold) only needs 3:1; everything else needs 4.5:1.
          const fontSize = parseFloat(style.fontSize);
          const isLarge = fontSize >= 24 || (fontSize >= 18.66 && Number(style.fontWeight) >= 700);
          if (ratio < (isLarge ? 3 : 4.5)) {
            problems.push(`${ratio.toFixed(2)}:1 "${element.textContent!.trim().slice(0, 30)}" (${style.color})`);
          }
        }
        return problems;
      });

      await close();
      expect(failures).toEqual([]);
    });
  }
}

test.describe("right-to-left layout", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("logo, arrows, dashboard sidebar and comparison table sit on the correct side", async ({ page }) => {
    await page.goto("/ar");
    await scrollThroughPage(page);
    const viewportWidth = 1280;

    // Logo at the right edge of the header.
    const logo = (await page.locator("header a").first().boundingBox())!;
    expect(logo.x, "logo should be on the right").toBeGreaterThan(viewportWidth / 2);

    // Forward arrows point left. Tailwind's `rtl:-scale-x-100` mirrors them with the CSS `scale` property.
    const arrowScales = await page
      .locator("svg.lucide-arrow-right")
      .evaluateAll((arrows) =>
        arrows.map((arrow) => `${arrow.closest("button, a")?.textContent?.trim()}: ${getComputedStyle(arrow).scale}`)
      );
    expect(arrowScales.length).toBeGreaterThan(0);
    const notMirrored = arrowScales.filter((entry) => !/: -1 /.test(entry));
    expect(notMirrored, "arrows still pointing right").toEqual([]);

    // Dashboard preview: sidebar on the right of the main panel.
    const sidebar = (await page.locator("aside").first().boundingBox())!;
    const searchBox = (await page.getByText("ابحث عن منتج").boundingBox())!;
    expect(sidebar.x, "dashboard sidebar should be on the right").toBeGreaterThan(searchBox.x);

    // Comparison table: the highlighted Daftr column is the last one, so it ends up on the left.
    const headerCells = page.locator("#about thead th");
    const firstCell = (await headerCells.first().boundingBox())!;
    const daftrCell = (await headerCells.last().boundingBox())!;
    expect(daftrCell.x, "Daftr column should be on the left").toBeLessThan(firstCell.x);
  });

  test("text in every section runs right to left", async ({ page }) => {
    await page.goto("/ar");
    const leftToRight = await page.locator("section h2, section p, footer p").evaluateAll((elements) =>
      elements
        // Numbers, prices and URLs are deliberately marked dir="ltr"; everything else should be RTL.
        .filter((element) => !element.closest('[dir="ltr"]'))
        .filter((element) => getComputedStyle(element).direction !== "rtl")
        .map((element) => (element.textContent ?? "").trim().slice(0, 40))
    );
    expect(leftToRight).toEqual([]);
  });
});
