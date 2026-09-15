import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { RATE_HUBS, TOOL_LINKS, TOOLS_INDEX_HREF } from "./siteLinks.ts";

const SRC = fileURLToPath(new URL("..", import.meta.url));

const KNOWN_TOOLS = [
  "/tools/",
  "/tools/mortgage-calculator/",
  "/tools/affordability-calculator/",
  "/tools/land-transfer-tax-calculator/",
  "/tools/cmhc-insurance-calculator/",
  "/tools/closing-costs-calculator/",
  "/tools/rent-vs-buy-calculator/",
  "/tools/mortgage-penalty-calculator/",
  "/tools/mortgage-renewal-calculator/",
  "/tools/refinance-calculator/",
  "/tools/stress-test-qualifier/",
];

const KNOWN_HUBS = [
  "/rates/5-year-fixed/",
  "/rates/variable/",
  "/rates/insured/",
  "/rates/uninsured/",
];

describe("siteLinks", () => {
  it("uses trailing slashes on every tool and rate hub URL", () => {
    for (const link of [...TOOL_LINKS, ...RATE_HUBS]) {
      assert.match(link.href, /\/$/, `${link.title} missing trailing slash: ${link.href}`);
    }
    assert.equal(TOOLS_INDEX_HREF, "/tools/");
  });

  it("only lists calculators and hubs that exist as pages", () => {
    assert.deepEqual(
      TOOL_LINKS.map((t) => t.href).sort(),
      KNOWN_TOOLS.filter((p) => p !== "/tools/").sort()
    );
    assert.deepEqual(
      RATE_HUBS.map((h) => h.href).sort(),
      [...KNOWN_HUBS].sort()
    );
  });
});

function walk(dir: string, files: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, files);
    else if ([".ts", ".tsx", ".astro"].includes(extname(full))) files.push(full);
  }
  return files;
}

const ATTR = /(?:href|canonical|url)\s*=\s*["']([^"']+)["']/g;
const OBJ = /href:\s*["'](\/[^"']+)["']/g;
const TPL = /href=\{`(\/[^`$]*\$\{[^}]+\}[^`]*)`\}/g;

function needsSlash(href: string): boolean {
  if (!href.startsWith("/")) return false;
  if (href.startsWith("//")) return false;
  if (href.startsWith("/api/")) return false;
  if (href.startsWith("/#")) return false;
  const pathOnly = href.split("#")[0].split("?")[0];
  if (pathOnly === "/" || pathOnly === "") return false;
  const last = pathOnly.split("/").filter(Boolean).pop() ?? "";
  if (last.includes(".") && /\.[a-zA-Z0-9]{1,8}$/.test(last)) return false;
  return !pathOnly.endsWith("/");
}

describe("internal hrefs", () => {
  it("uses trailing slashes on internal page links", () => {
    const violations: string[] = [];
    for (const file of walk(SRC)) {
      const text = readFileSync(file, "utf8");
      for (const re of [ATTR, OBJ]) {
        re.lastIndex = 0;
        let match: RegExpExecArray | null;
        while ((match = re.exec(text))) {
          const href = match[1];
          if (href.startsWith("http") && !href.includes("latestmortgagerates.ca")) continue;
          const path = href.startsWith("http")
            ? href.replace(/^https?:\/\/latestmortgagerates\.ca/, "") || "/"
            : href;
          if (needsSlash(path)) {
            violations.push(`${file.replace(SRC, "src")}: ${href}`);
          }
        }
      }
      TPL.lastIndex = 0;
      let tpl: RegExpExecArray | null;
      while ((tpl = TPL.exec(text))) {
        const raw = tpl[1];
        if (!raw.endsWith("/") && !raw.endsWith("}/")) {
          // Allow `${slug}/` form; flag `/glossary/${slug}` without slash.
          if (!raw.endsWith("}/") && !raw.endsWith("/")) {
            violations.push(`${file.replace(SRC, "src")}: \`${raw}\``);
          }
        }
      }
    }
  it("does not point city hrefs at missing city pages", () => {
    const existing = new Set(readdirSync(join(SRC, "pages/cities")));
    const cityHref = /\/cities\/([a-z0-9-]+)\/?/g;
    const missing: string[] = [];
    for (const file of walk(SRC)) {
      const text = readFileSync(file, "utf8");
      cityHref.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = cityHref.exec(text))) {
        const slug = match[1];
        if (!existing.has(slug)) {
          missing.push(`${file.replace(SRC, "src")}: /cities/${slug}/`);
        }
      }
    }
    assert.equal(missing.length, 0, `unknown city links:\n${missing.join("\n")}`);
  });
});
