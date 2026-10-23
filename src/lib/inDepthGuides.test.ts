import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { IN_DEPTH_GUIDES, guideWordCount } from "../content/inDepthGuides.ts";
import { isIndexablePath } from "./sitemapFilter.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));

const REQUIRED_LINKS = [
  "/tools/mortgage-calculator/",
  "/tools/renewal-offer-checker/",
  "/tools/cmhc-insurance-calculator/",
  "/real-mortgage-rates/",
  "/rates/5-year-fixed/",
  "/rates/variable/",
  "/rates/insured/",
  "/rates/uninsured/",
];

describe("in-depth guides", () => {
  it("publishes twelve guides inside the word-count range", () => {
    assert.equal(IN_DEPTH_GUIDES.length, 12);
    const counts = IN_DEPTH_GUIDES.map((guide) => [guide.slug, guideWordCount(guide)] as const);
    for (const [slug, words] of counts) {
      assert.ok(words >= 1800 && words <= 2700, `${slug} is ${words} words`);
    }
    const longform = new Set([
      "closing-costs-canada-by-province",
      "big-5-bank-mortgages-compared",
      "blend-and-extend-mortgage",
      "mortgage-rate-hold-canada",
    ]);
    for (const [slug, words] of counts) {
      if (longform.has(slug)) {
        assert.ok(words >= 2200 && words <= 2600, `${slug} is ${words} words`);
      }
    }
  });

  it("links each guide to the tools, rate pages, and author byline", () => {
    const page = readFileSync(join(root, "src/views/guides/InDepthGuidePage.tsx"), "utf8");
    const byline = readFileSync(join(root, "src/components/EditorialByline.tsx"), "utf8");
    assert.match(page, /EditorialByline/);
    assert.match(byline, /href="\/author\/andrew\/"/);
    assert.match(page, /<h1/);
    assert.equal((page.match(/<h1[\s>]/g) || []).length, 1);
    for (const guide of IN_DEPTH_GUIDES) {
      const body = JSON.stringify(guide.sections) + JSON.stringify(guide.faqs);
      for (const href of REQUIRED_LINKS) {
        assert.ok(body.includes(href), `${guide.slug} missing ${href}`);
      }
      assert.match(body, /self-reported by Canadian borrowers online/);
      assert.equal(/reddit|redflagdeals|red flag deals|\brfd\b/i.test(body), false, guide.slug);
      assert.equal(/Andrew [A-Z]/.test(body), false, guide.slug);
      const astro = readFileSync(join(root, "src/pages/guides", guide.slug, "index.astro"), "utf8");
      assert.match(astro, new RegExp(guide.slug));
      assert.equal(isIndexablePath(guide.path), true, guide.path);
    }
  });

  it("lists every guide on the hub and the author page", () => {
    const hub = readFileSync(join(root, "src/views/guides/GuidesIndex.tsx"), "utf8");
    const author = readFileSync(join(root, "src/views/author/AuthorPage.tsx"), "utf8");
    assert.match(hub, /IN_DEPTH_GUIDES/);
    assert.match(author, /IN_DEPTH_GUIDES/);
    const nav = readFileSync(join(root, "src/components/Navigation.tsx"), "utf8");
    for (const guide of IN_DEPTH_GUIDES) {
      assert.ok(nav.includes(guide.path), guide.path);
    }
  });
});
