/*
 * Scroll-in animations: content below the fold waits until it's scrolled to,
 * nothing stays hidden, and visitors with reduced motion or without JavaScript
 * see everything straight away.
 */

import { expect, test, type Page } from "@playwright/test";

import { scrollThroughPage } from "./helpers";

const opacityOf = (page: Page, selector: string) =>
  page.locator(selector).first().evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe("scroll reveal animations", () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test("hero content animates in on load", async ({ page }) => {
    await page.goto("/en");
    await expect(page.locator("h1")).toHaveAttribute("data-revealed", "");
    await expect.poll(() => opacityOf(page, "h1")).toBe(1);
  });

  test("sections below the fold stay hidden until scrolled into view", async ({ page }) => {
    await page.goto("/en");
    const header = page.locator("#pricing [data-reveal]").first();
    await expect(header).not.toHaveAttribute("data-revealed");
    expect(await opacityOf(page, "#pricing [data-reveal]")).toBe(0);

    await header.scrollIntoViewIfNeeded();
    await expect(header).toHaveAttribute("data-revealed", "");
    await expect.poll(() => opacityOf(page, "#pricing [data-reveal]")).toBe(1);
  });

  test("every animated element is visible after scrolling the whole page", async ({ page }) => {
    await page.goto("/ar");
    await scrollThroughPage(page);
    const hidden = await page.locator("[data-reveal]:not([data-revealed])").count();
    expect(hidden).toBe(0);
  });
});

test("reduced motion shows all content immediately", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/en");
  expect(await opacityOf(page, "#contact [data-reveal]")).toBe(1);
  expect(await opacityOf(page, "footer [data-reveal]")).toBe(1);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("all content is visible", async ({ page }) => {
    await page.goto("/en");
    expect(await opacityOf(page, "#pricing [data-reveal]")).toBe(1);
    expect(await opacityOf(page, "footer [data-reveal]")).toBe(1);
  });
});
