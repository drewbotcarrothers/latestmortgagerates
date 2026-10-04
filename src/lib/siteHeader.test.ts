import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("..", import.meta.url));

function read(path: string): string {
  return readFileSync(join(SRC, path), "utf8");
}

/** Destinations that were top-level links before the header redesign. */
const LEGACY_NAV = [
  "/",
  "/real-mortgage-rates/",
  "/guides/negotiate-mortgage-rate/",
  "/tools/renewal-offer-checker/",
  "/trends/",
  "/blog/",
  "/mortgage-guide/",
  "/experts/",
  "/glossary/",
  "/tools/",
];

describe("site header", () => {
  it("does not use an h1 in the shared header or nav", () => {
    assert.doesNotMatch(read("components/Header.tsx"), /<h1[\s>]/);
    assert.doesNotMatch(read("components/Navigation.tsx"), /<h1[\s>]/);
  });

  it("keeps every previous nav destination and the guide CTA", () => {
    const nav = read("components/Navigation.tsx");
    for (const href of LEGACY_NAV) {
      assert.match(nav, new RegExp(`href:\\s*"${href.replace(/\//g, "\\/")}"`), href);
    }
    assert.match(nav, /aria-expanded/);
    assert.match(nav, /aria-haspopup="true"/);
    assert.match(nav, /aria-controls/);
    assert.match(nav, /aria-label="Primary"/);
  });

  it("aligns the header with the max-w-7xl px-4 container", () => {
    const header = read("components/Header.tsx");
    assert.match(header, /max-w-7xl px-4/);
    assert.doesNotMatch(header, /lg:px-8/);
  });

  it("leaves the homepage with a single h1 outside the header", () => {
    const home = read("views/HomePage.tsx");
    assert.equal((home.match(/<h1[\s>]/g) || []).length, 1);
    assert.match(home, /<Header\b/);
    assert.doesNotMatch(home, /<h1[^>]*>\s*Latest Mortgage Rates Canada\s*<\/h1>/);
  });
});
