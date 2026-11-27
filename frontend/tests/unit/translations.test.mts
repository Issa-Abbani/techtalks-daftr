import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import ts from "typescript";

import en from "../../locales/en.json" with { type: "json" };
import ar from "../../locales/ar.json" with { type: "json" };

type Leaf = { path: string; value: unknown };

function leaves(node: unknown, path = ""): Leaf[] {
  if (Array.isArray(node)) return node.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([k, v]) => leaves(v, path ? `${path}.${k}` : k));
  }
  return [{ path, value: node }];
}

const enLeaves = leaves(en);
const arLeaves = leaves(ar);
const enMap = new Map(enLeaves.map((l) => [l.path, l.value]));
const arMap = new Map(arLeaves.map((l) => [l.path, l.value]));

const ARABIC = /[؀-ۿ]/;
const LATIN = /[A-Za-z]/;

// Values that are legitimately the same in every language (addresses, prices, numbers).
const LANGUAGE_NEUTRAL = new Set([
  "hero.preview.url",
  "hero.preview.stockValueAmount",
  "contact.details.email.value",
  "contact.details.phone.value",
  "contact.form.emailPlaceholder",
  "auth.fields.emailPlaceholder",
  "pricing.plans[0].price",
  "pricing.plans[1].price",
  "pricing.plans[2].price",
]);

describe("locale files", () => {
  it("English and Arabic have exactly the same keys and array lengths", () => {
    const missingInAr = enLeaves.filter((l) => !arMap.has(l.path)).map((l) => l.path);
    const extraInAr = arLeaves.filter((l) => !enMap.has(l.path)).map((l) => l.path);
    assert.deepEqual(missingInAr, [], "keys missing from ar.json");
    assert.deepEqual(extraInAr, [], "keys in ar.json that are not in en.json");
  });

  it("every value is a non-empty string", () => {
    const bad = [...enLeaves.map((l) => ({ ...l, file: "en" })), ...arLeaves.map((l) => ({ ...l, file: "ar" }))]
      .filter((l) => typeof l.value !== "string" || l.value.trim() === "")
      .map((l) => `${l.file}:${l.path}`);
    assert.deepEqual(bad, [], "empty or non-string values");
  });

  it("every Arabic value is actually translated", () => {
    const untranslated = arLeaves
      .filter((l) => !LANGUAGE_NEUTRAL.has(l.path))
      .filter((l) => {
        const v = String(l.value);
        return !ARABIC.test(v) || LATIN.test(v) || v === enMap.get(l.path);
      })
      .map((l) => `${l.path}: "${l.value}"`);
    assert.deepEqual(untranslated, [], "Arabic values that are missing Arabic text or still contain English");
  });

  it("no English value contains Arabic text", () => {
    const mixed = enLeaves.filter((l) => ARABIC.test(String(l.value))).map((l) => l.path);
    assert.deepEqual(mixed, [], "English values containing Arabic");
  });

  it("language-neutral values are identical in both files", () => {
    for (const path of LANGUAGE_NEUTRAL) {
      assert.equal(arMap.get(path), enMap.get(path), path);
    }
  });
});

// Source scan: any user-visible text written directly in JSX bypasses the locale files.
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCANNED_DIRS = ["app", "components/home", "components/auth"];
const TRANSLATABLE_ATTRS = new Set(["aria-label", "placeholder", "title", "alt"]);

function tsxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return tsxFiles(full);
    return entry.name.endsWith(".tsx") ? [full] : [];
  });
}

function hardcodedStrings(file: string): string[] {
  const source = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const where = (node: ts.Node) => {
    const { line } = source.getLineAndCharacterOfPosition(node.getStart());
    return `${relative(ROOT, file)}:${line + 1}`;
  };

  const visit = (node: ts.Node) => {
    if (ts.isJsxText(node)) {
      const text = node.getText().trim();
      if (/\p{L}/u.test(text)) found.push(`${where(node)} text "${text}"`);
    }
    if (ts.isJsxAttribute(node) && TRANSLATABLE_ATTRS.has(node.name.getText())) {
      const init = node.initializer;
      if (init && ts.isStringLiteral(init) && /\p{L}/u.test(init.text)) {
        found.push(`${where(node)} ${node.name.getText()}="${init.text}"`);
      }
    }
    // String literals rendered as JSX children, e.g. {"Sign in"}.
    if (ts.isJsxExpression(node) && node.expression && ts.isStringLiteral(node.expression)) {
      if (ts.isJsxElement(node.parent) && /\p{L}/u.test(node.expression.text)) {
        found.push(`${where(node)} literal "${node.expression.text}"`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(source);
  return found;
}

describe("components", () => {
  it("contain no hardcoded user-visible text", () => {
    const files = SCANNED_DIRS.flatMap((d) => tsxFiles(join(ROOT, d)));
    assert.ok(files.length > 0, "no component files found to scan");
    assert.deepEqual(files.flatMap(hardcodedStrings), [], "hardcoded strings found");
  });
});
