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
  it("publishes twenty guides inside the word-count range", () => {
    const batch3 = new Set([
      "cmhc-mortgage-insurance-canada",
      "30-year-amortization-canada",
      "bank-of-canada-rate-and-your-mortgage",
      "mortgage-renewal-vs-refinance-vs-heloc",
    ]);
    const longform = new Set([
      "porting-mortgage-canada",
      "should-i-lock-in-variable-rate",
      "2027-mortgage-renewal-wave",
      "heloc-rates-canada",
      "closing-costs-canada-by-province",
      "big-5-bank-mortgages-compared",
      "blend-and-extend-mortgage",
      "mortgage-rate-hold-canada",
    ]);
    assert.equal(IN_DEPTH_GUIDES.length, 20);
    for (const guide of IN_DEPTH_GUIDES) {
      const words = guideWordCount(guide);
      const min = batch3.has(guide.slug) || longform.has(guide.slug) ? 2200 : 1800;
      // The Big Five comparison adds a verdict and standalone comparison FAQs on top of the sourced body.
      const max = guide.slug === "big-5-bank-mortgages-compared" ? 3600 : longform.has(guide.slug) ? 2600 : 2500;
      assert.ok(words >= min && words <= max, `${guide.slug} is ${words} words`);
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

  it("keeps the Big Five comparison inside the search-result limits", () => {
    const guide = IN_DEPTH_GUIDES.find((item) => item.slug === "big-5-bank-mortgages-compared");
    assert.ok(guide);
    assert.ok(guide.metaTitle.length <= 60, `${guide.metaTitle} (${guide.metaTitle.length})`);
    assert.ok(guide.description.length <= 155, `${guide.description} (${guide.description.length})`);
    assert.match(guide.metaTitle, /2026/);
    assert.match(guide.description, /2026/);
    assert.equal(guide.sections[0]?.heading, "Quick verdict");
    assert.match(guide.reviewedIso, /^2026-11-09/);
    const questions = guide.faqs.map((faq) => faq.question);
    for (const question of [
      "How does an RBC mortgage compare with CIBC?",
      "How does an RBC mortgage compare with Scotiabank?",
      "How does an RBC mortgage compare with BMO?",
      "Which Big Five rate-hold guarantee is better?",
    ]) {
      assert.ok(questions.includes(question), question);
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
