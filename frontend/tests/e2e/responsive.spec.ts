import { devices, expect, test, type Page } from "@playwright/test";

import { auditLayout, columnsOf, scrollThroughPage, waitForScrollEnd } from "./helpers";

/**
 * Full responsiveness suite. Every viewport runs in English (LTR) and Arabic (RTL).
 * Breakpoints match Tailwind: sm 640, md 768, lg 1024.
 */
const viewports = [
  { name: "fold", width: 280, height: 653 },
  { name: "small-phone", width: 320, height: 568 },
  { name: "android", width: 360, height: 740 },
  { name: "iphone-se", width: 375, height: 667 },
  { name: "iphone", width: 390, height: 844 },
  { name: "large-phone", width: 430, height: 932 },
  { name: "phone-landscape-small", width: 568, height: 320 },
  { name: "phone-landscape", width: 844, height: 390 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "tablet-landscape", width: 1024, height: 768 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "desktop", width: 1440, height: 900 },
  { name: "full-hd", width: 1920, height: 1080 },
  { name: "qhd", width: 2560, height: 1440 },
];

const SM = 640;
const MD = 768;
const LG = 1024;
const HEADER_HEIGHT = 64;
const sections = ["features", "how-it-works", "pricing", "about", "contact"];

/** Expected column count of each grid at a given width. */
function expectedColumns(width: number) {
  return {
    "#features article": width >= SM ? 2 : 1,
    "#how-it-works ol > li": width >= MD ? 3 : 1,
    '[data-testid="trust-list"] > li': width >= LG ? 6 : width >= SM ? 3 : 2,
    '[data-testid="pricing-card"]': width >= LG ? 3 : 1,
    "#about > .shell > div": width >= LG ? 2 : 1,
    "#contact > .shell > div": width >= LG ? 2 : 1,
  };
}

const minTargetFor = (width: number) => (width < LG ? 44 : 24);

async function open(page: Page, lang: string) {
  await page.goto(`/${lang}`);
  await scrollThroughPage(page); // reveal every scroll-animated element before measuring
}

for (const lang of ["en", "ar"] as const) {
  for (const vp of viewports) {
    test.describe(`${lang} @ ${vp.name} ${vp.width}x${vp.height}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });

      test("no horizontal scroll and nothing leaks off screen", async ({ page }) => {
        await open(page, lang);
        const audit = await auditLayout(page, { minTarget: minTargetFor(vp.width) });
        expect(audit.pageOverflow.scrollWidth, "page is wider than the viewport").toBeLessThanOrEqual(audit.pageOverflow.clientWidth);
        expect(audit.leaking, "elements outside the viewport").toEqual([]);
      });

      test("text fits its box and stays readable", async ({ page }) => {
        await open(page, lang);
        const audit = await auditLayout(page, { minTarget: minTargetFor(vp.width) });
        expect(audit.overflowingText, "text spilling out of or clipped by its box").toEqual([]);
        expect(audit.smallText, "visible text under 12px").toEqual([]);
        expect(audit.smallInputs, "form fields under 16px (iOS zooms the page)").toEqual([]);
      });

      test(`tap targets are at least ${minTargetFor(vp.width)}px`, async ({ page }) => {
        await open(page, lang);
        const audit = await auditLayout(page, { minTarget: minTargetFor(vp.width) });
        expect(audit.smallTargets).toEqual([]);
      });

      test("header stays one row and shows the right navigation", async ({ page }) => {
        await page.goto(`/${lang}`);
        const header = page.locator("header");
        const box = await header.boundingBox();
        expect(Math.round(box!.height), "header wrapped onto a second row").toBeLessThanOrEqual(HEADER_HEIGHT + 1);

        const desktop = vp.width >= LG;
        await expect(page.getByTestId("desktop-links")).toBeVisible({ visible: desktop });
        await expect(page.getByTestId("mobile-menu-button")).toBeVisible({ visible: !desktop });
        await expect(page.getByTestId("theme-toggle")).toBeVisible();
        const signIn = header.getByRole("button", { name: lang === "en" ? "Sign in" : "تسجيل الدخول" });
        await expect(signIn).toBeVisible({ visible: vp.width >= MD });

        // Logo sits at the start edge: left in English, right in Arabic.
        const logo = await header.getByRole("link").first().boundingBox();
        if (lang === "en") expect(logo!.x).toBeLessThan(vp.width / 2);
        else expect(logo!.x).toBeGreaterThan(vp.width / 2);
      });

      test("every section fits and grids use the right number of columns", async ({ page }) => {
        await page.goto(`/${lang}`);
        for (const id of sections) {
          const box = await page.locator(`#${id}`).boundingBox();
          expect(box, `#${id} missing`).not.toBeNull();
          expect(box!.width, `#${id} wider than the screen`).toBeLessThanOrEqual(vp.width);
        }
        for (const [selector, columns] of Object.entries(expectedColumns(vp.width))) {
          expect(await columnsOf(page, selector), `${selector} at ${vp.width}px`).toBe(columns);
        }
      });

      test("section links land below the sticky header", async ({ page }) => {
        await page.goto(`/${lang}`);
        for (const id of ["pricing", "contact"]) {
          if (vp.width >= LG) {
            await page.getByTestId("desktop-links").locator(`a[href="#${id}"]`).click();
          } else {
            await page.getByTestId("mobile-menu-button").click();
            await page.getByTestId("mobile-menu").locator(`a[href="#${id}"]`).click();
            await expect(page.getByTestId("mobile-menu"), "menu should close after choosing a section").toBeHidden();
          }
          // Smooth scrolling takes a moment: retry until the section has settled just under the header
          // (or the page has hit its end, for sections too close to the bottom to reach the top).
          await expect
            .poll(
              () =>
                page.evaluate((sectionId) => {
                  const headerBottom = document.querySelector("header")!.getBoundingClientRect().bottom;
                  const top = document.getElementById(sectionId)!.getBoundingClientRect().top;
                  const atEnd = Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 1;
                  if (top < headerBottom - 1) return `hidden under the header (top ${Math.round(top)} < ${Math.round(headerBottom)})`;
                  if (!atEnd && top > headerBottom + 40) return `not scrolled to (top ${Math.round(top)})`;
                  return "ok";
                }, id),
              { message: `#${id} after clicking its link`, timeout: 6000 }
            )
            .toBe("ok");
          await waitForScrollEnd(page);
        }
      });

      if (vp.width < LG) {
        test("mobile menu opens from the start side and everything in it is usable", async ({ page }) => {
          await page.goto(`/${lang}`);
          await page.getByTestId("mobile-menu-button").click();
          const menu = page.getByTestId("mobile-menu");
          await expect(menu).toBeVisible();
          await expect(page.getByRole("dialog")).toHaveAccessibleName(lang === "en" ? "Navigation" : "التنقل");

          const box = await menu.boundingBox();
          if (lang === "ar") expect(box!.x).toBeLessThanOrEqual(1);
          else expect(Math.round(box!.x + box!.width)).toBeGreaterThanOrEqual(vp.width - 1);
          expect(box!.width).toBeLessThanOrEqual(vp.width);

          // Every link and button can be scrolled to and fully seen, even on a short landscape screen.
          const controls = menu.locator("a[href], button");
          await expect(controls).toHaveCount(5 + 2 + 2 + 1); // sections, logo + language, sign in/up, close
          for (const control of await controls.all()) {
            await control.scrollIntoViewIfNeeded();
            const r = (await control.boundingBox())!;
            expect(r.y, "control above the screen").toBeGreaterThanOrEqual(0);
            expect(r.y + r.height, "control below the screen").toBeLessThanOrEqual(vp.height + 1);
          }

          const audit = await auditLayout(page, { minTarget: 44, scope: '[data-testid="mobile-menu"]' });
          expect(audit.smallTargets, "menu tap targets").toEqual([]);
          expect(audit.overflowingText, "menu text").toEqual([]);
        });
      }
    });
  }
}

// Real device profiles: touch, mobile viewport meta handling, device pixel ratio and user agent.
const deviceProfiles = ["Pixel 7", "iPhone 13", "iPhone SE", "Galaxy S9+", "iPad Mini", "iPad Pro 11 landscape"] as const;

for (const name of deviceProfiles) {
  // Browser engine is fixed by the config (local Chrome); keep everything else from the profile.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { defaultBrowserType, ...profile } = devices[name];

  test.describe(`device: ${name}`, () => {
    test.use(profile);

    for (const lang of ["en", "ar"] as const) {
      test(`${lang}: fits the screen, menu works by touch, survives rotation`, async ({ page }) => {
        await open(page, lang);
        let audit = await auditLayout(page, { minTarget: 44 });
        expect(audit.pageOverflow.scrollWidth).toBeLessThanOrEqual(audit.pageOverflow.clientWidth);
        expect(audit.leaking).toEqual([]);

        const { width, height } = page.viewportSize()!;
        if (width < LG) {
          await page.getByTestId("mobile-menu-button").tap();
          await expect(page.getByTestId("mobile-menu")).toBeVisible();
          await page.keyboard.press("Escape");
          await expect(page.getByTestId("mobile-menu")).toBeHidden();
        }

        // Rotate the device.
        await page.setViewportSize({ width: height, height: width });
        await page.waitForTimeout(300);
        audit = await auditLayout(page, { minTarget: 44 });
        expect(audit.pageOverflow.scrollWidth, "overflow after rotating").toBeLessThanOrEqual(audit.pageOverflow.clientWidth);
        expect(audit.leaking, "leaks after rotating").toEqual([]);
      });
    }
  });
}

test.describe("text resized to 200% (WCAG 1.4.4)", () => {
  for (const lang of ["en", "ar"] as const) {
    test(`${lang} @ 1280px keeps all content on screen`, async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await open(page, lang);
      await page.evaluate(() => (document.documentElement.style.fontSize = "200%"));
      await page.waitForTimeout(200);
      const audit = await auditLayout(page, { minTarget: 24 });
      expect(audit.pageOverflow.scrollWidth).toBeLessThanOrEqual(audit.pageOverflow.clientWidth);
      expect(audit.leaking).toEqual([]);
      expect(audit.overflowingText).toEqual([]);
    });
  }
});

test.describe("dark mode does not change the layout", () => {
  for (const width of [375, 1440]) {
    test(`${width}px`, async ({ browser }) => {
      const heights: number[] = [];
      for (const colorScheme of ["light", "dark"] as const) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme });
        const page = await context.newPage();
        await open(page, "en");
        heights.push(await page.evaluate(() => document.documentElement.scrollHeight));
        await context.close();
      }
      expect(heights[1]).toBe(heights[0]);
    });
  }
});

test.describe("screenshots for visual review", () => {
  for (const lang of ["en", "ar"] as const) {
    for (const theme of ["light", "dark"] as const) {
      for (const width of [375, 768, 1440]) {
        test(`${lang} ${theme} ${width}px`, async ({ page }, info) => {
          await page.emulateMedia({ colorScheme: theme });
          await page.setViewportSize({ width, height: 900 });
          await open(page, lang);
          await page.screenshot({ path: info.outputPath(`${lang}-${theme}-${width}.png`), fullPage: true });
        });
      }
    }
  }
});
