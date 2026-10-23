import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import {
  htaccessExactRedirects,
  isLegacyRedirectPath,
  legacyRedirects,
  normalizeRedirectPath,
} from "./legacyRedirects.mjs";
import { isIndexablePath } from "./sitemapFilter.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("legacy redirects", () => {
  it("matches every exact htaccess 301 and does not chain", () => {
    const htaccess = readFileSync(join(root, "public/.htaccess"), "utf8");
    const fromFile = htaccessExactRedirects(htaccess);
    assert.ok(Object.keys(fromFile).length >= 20);
    for (const [source, destination] of Object.entries(fromFile)) {
      assert.equal(legacyRedirects[source], destination, source);
    }
    const sources = new Set(Object.keys(legacyRedirects).map(normalizeRedirectPath));
    for (const [source, destination] of Object.entries(legacyRedirects)) {
      assert.equal(sources.has(normalizeRedirectPath(destination)), false, `${source} -> ${destination}`);
      assert.ok(destination === "/" || destination.endsWith("/"), destination);
    }
    for (const source of Object.keys(legacyRedirects)) {
      if (source.startsWith("/blog/category")) continue;
      assert.equal(fromFile[source], legacyRedirects[source], source);
    }
    assert.match(readFileSync(join(root, "astro.config.mjs"), "utf8"), /redirects:\s*legacyRedirects/);
  });

  it("sends the removed posts and the live 404s straight to their final pages", () => {
    assert.equal(
      legacyRedirects["/blog/first-time-buyer-guide-2026"],
      "/guides/first-time-home-buyer-programs-canada/",
    );
    assert.equal(
      legacyRedirects["/blog/first-time-buyer-guide-2025"],
      "/guides/first-time-home-buyer-programs-canada/",
    );
    assert.equal(
      legacyRedirects["/blog/first-time-home-buyer-guide-canada"],
      "/guides/first-time-home-buyer-programs-canada/",
    );
    assert.equal(legacyRedirects["/blog/spring-2026-outlook"], "/mortgage-rate-forecast-2027/");
    assert.equal(legacyRedirects["/blog/spring-2026-housing-market-outlook"], "/mortgage-rate-forecast-2027/");
    assert.equal(legacyRedirects["/blog/spring-housing-market-2025"], "/mortgage-rate-forecast-2027/");
    assert.equal(legacyRedirects["/blog/best-mortgage-rates-toronto"], "/cities/toronto/");
    assert.equal(legacyRedirects["/blog/renewal-strategy-2025"], "/tools/mortgage-renewal-calculator/");
    assert.equal(legacyRedirects["/rates"], "/");
  });

  it("keeps redirect URLs out of the sitemap", () => {
    for (const source of Object.keys(legacyRedirects)) {
      assert.equal(isLegacyRedirectPath(`${source}/`), true, source);
      assert.equal(isIndexablePath(`${source}/`), false, source);
    }
    assert.equal(isIndexablePath("/guides/first-time-home-buyer-programs-canada/"), true);
    assert.equal(isIndexablePath("/mortgage-rate-forecast-2027/"), true);
    assert.equal(isIndexablePath("/cities/toronto/"), true);
  });
});
