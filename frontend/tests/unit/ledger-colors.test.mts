import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

// Ledger Clean rule: "Every colour is a token." Components never contain hex values,
// arbitrary colours or Tailwind's default palette, so the whole product follows the
// tokens in app/globals.css (copied from ledger/tokens.css).
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const SCANNED_DIRS = ["components/home", "app/[lang]"];

const PALETTE = "slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose";
const RULES: [string, RegExp][] = [
  ["hex colour", /#[0-9a-fA-F]{3,8}\b/],
  ["rgb()/hsl()/oklch() colour", /\b(?:rgba?|hsla?|oklch)\(/],
  ["arbitrary colour class", /\b(?:bg|text|border|ring|fill|stroke|from|to|via)-\[(?:#|rgb|hsl|oklch|var\()/],
  ["literal white/black", /\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\b/],
  ["Tailwind default palette", new RegExp(`\\b(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:${PALETTE})-\\d{2,3}\\b`)],
];

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) return files(full);
    return /\.(tsx?|css)$/.test(entry.name) ? [full] : [];
  });
}

describe("Ledger colour tokens", () => {
  it("homepage components use only colour tokens", () => {
    const found: string[] = [];
    for (const file of SCANNED_DIRS.flatMap((d) => files(join(ROOT, d)))) {
      readFileSync(file, "utf8").split("\n").forEach((line, i) => {
        if (/^\s*(\/\/|\*|\/\*)/.test(line)) return;
        for (const [rule, pattern] of RULES) {
          const match = line.match(pattern);
          if (match) found.push(`${relative(ROOT, file)}:${i + 1} ${rule}: ${match[0]}`);
        }
      });
    }
    assert.deepEqual(found, [], "replace these with Ledger tokens (bg-primary, text-ink, bg-warning-soft, ...)");
  });

  it("globals.css carries the Ledger values for both themes", () => {
    const css = readFileSync(join(ROOT, "app/globals.css"), "utf8");
    const tokens = readFileSync(join(ROOT, "ledger/tokens.css"), "utf8");
    const block = (source: string, selector: RegExp) => source.slice(source.search(selector)).split("}")[0];
    const values = (source: string) =>
      Object.fromEntries([...source.matchAll(/--(?:l-)?([a-z0-9-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2].toLowerCase()]));

    const ledgerLight = values(block(tokens, /:root, \[data-theme="light"\]/));
    const ledgerDark = values(block(tokens, /\[data-theme="dark"\]/));
    const appLight = values(block(css, /:root \{\s*color-scheme: light;/));
    const appDark = values(block(css, /\.dark \{/));

    assert.ok(Object.keys(ledgerLight).length >= 20, "could not read ledger/tokens.css");
    for (const [name, value] of Object.entries(ledgerLight)) assert.equal(appLight[name], value, `light --${name}`);
    for (const [name, value] of Object.entries(ledgerDark)) assert.equal(appDark[name], value, `dark --${name}`);
  });
});
