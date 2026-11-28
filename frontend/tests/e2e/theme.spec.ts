/*
 * Light and dark mode: the page follows the device setting, uses the Ledger
 * colours in each, and the theme toggle's choice survives a reload and a
 * switch to the other language.
 */

import { expect, test } from "@playwright/test";

const bodyBackground = (page: import("@playwright/test").Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

// Ledger Clean tokens (ledger/tokens.css): canvas and primary in each theme.
const LIGHT_BG = "rgb(246, 247, 248)"; // canvas #f6f7f8
const DARK_BG = "rgb(14, 17, 21)"; // canvas #0e1115

test("follows a light system preference: Ledger light canvas and teal primary", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/en");
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(await bodyBackground(page)).toBe(LIGHT_BG);
  const primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--l-primary").trim()
  );
  expect(primary).toBe("#0b6b63");
});

test("follows a dark system preference: Ledger dark canvas and teal primary", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/en");
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await bodyBackground(page)).toBe(DARK_BG);
  const primary = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--l-primary").trim()
  );
  expect(primary).toBe("#4fc1b4");
});

test("toggle switches theme and the choice survives a reload and a language change", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en");

  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  expect(await bodyBackground(page)).toBe(DARK_BG);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.goto("/ar");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.getByTestId("theme-toggle").click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
  expect(await bodyBackground(page)).toBe(LIGHT_BG);
});
