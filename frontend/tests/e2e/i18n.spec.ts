import { expect, test, type Page } from "@playwright/test";

import en from "../../locales/en.json" with { type: "json" };
import ar from "../../locales/ar.json" with { type: "json" };

const dictionaries = { en, ar } as const;

function leaves(node: unknown, path = ""): { path: string; value: string }[] {
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [{ path, value: String(node) }];
}

// Text and translatable attributes the visitor can see or hear, minus elements marked as
// intentionally language-neutral (the language switcher shows the other language's name).
async function renderedText(page: Page) {
  return page.evaluate(() => {
    const clone = document.documentElement.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[data-i18n-ignore], script, style").forEach((el) => el.remove());
    const attrs = [...clone.querySelectorAll("[aria-label],[placeholder],[title],[alt]")].flatMap((el) =>
      ["aria-label", "placeholder", "title", "alt"].map((a) => el.getAttribute(a) ?? "")
    );
    const meta = [...document.querySelectorAll('meta[name="description"]')].map(
      (m) => m.getAttribute("content") ?? ""
    );
    return {
      text: clone.querySelector("body")?.textContent ?? "",
      attrs: attrs.filter(Boolean),
      head: [document.title, ...meta],
    };
  });
}

// Strings that only render once the mobile menu is open; covered by the responsive suite.
const RENDERED_LATER = new Set(["nav.menuTitle"]);
// Sections that render on other pages (log in, sign up), not on the home page.
const OTHER_PAGES = ["auth."];
const LATIN_ALLOWED_IN_AR = ["app.daftr.com/dashboard", "hello@daftr.app", "you@example.com"];

for (const lang of ["en", "ar"] as const) {
  test.describe(`${lang} locale`, () => {
    test("sets lang and text direction on <html>", async ({ page }) => {
      await page.goto(`/${lang}`);
      await expect(page.locator("html")).toHaveAttribute("lang", lang);
      await expect(page.locator("html")).toHaveAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    });

    test("renders every string from its locale file", async ({ page }) => {
      await page.goto(`/${lang}`);
      const { text, attrs, head } = await renderedText(page);
      const haystack = [text, ...attrs, ...head].join("\n").replace(/\s+/g, " ");
      const missing = leaves(dictionaries[lang])
        .filter((l) => !RENDERED_LATER.has(l.path))
        .filter((l) => !OTHER_PAGES.some((prefix) => l.path.startsWith(prefix)))
        .filter((l) => !haystack.includes(l.value.replace(/\s+/g, " ")))
        .map((l) => `${l.path}: "${l.value}"`);
      expect(missing, "dictionary strings that never appear on the page").toEqual([]);
    });

    test("shows no text from the other language", async ({ page }) => {
      await page.goto(`/${lang}`);
      const { text, attrs, head } = await renderedText(page);
      const all = [text, ...attrs, ...head].join("\n");

      if (lang === "en") {
        expect(all.match(/[؀-ۿ]+/g) ?? [], "Arabic text on the English page").toEqual([]);
      } else {
        let stripped = all;
        for (const allowed of LATIN_ALLOWED_IN_AR) stripped = stripped.split(allowed).join("");
        expect(stripped.match(/[A-Za-z]{2,}/g) ?? [], "English words on the Arabic page").toEqual([]);
      }
    });
  });
}

test("root redirects to English by default", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/en$/);
});

test("root redirects to Arabic for Arabic browsers", async ({ browser }) => {
  const context = await browser.newContext({ locale: "ar-LB", extraHTTPHeaders: { "accept-language": "ar-LB,ar;q=0.9" } });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page).toHaveURL(/\/ar$/);
  await context.close();
});

test("unknown locales return 404", async ({ page }) => {
  const response = await page.goto("/fr");
  expect(response?.status()).toBe(404);
});

test("language switcher moves between English and Arabic", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/en");
  await page.getByTestId("language-switcher").first().click();
  await expect(page).toHaveURL(/\/ar$/);
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await page.getByTestId("language-switcher").first().click();
  await expect(page).toHaveURL(/\/en$/);
});
