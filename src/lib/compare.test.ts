import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { COMPARISONS } from "../content/comparisons.ts";
import {
  COMPARE_INDEX_HREF,
  REQUIRED_COMPARE_LINKS,
  bestRate,
  compareContext,
  compareHref,
  comparisonsForLender,
  formatPct,
  getComparison,
  lenderComparisons,
  lenderSnapshot,
  liveSummary,
  productComparisons,
  ratePhrase,
  seoDescription,
  type MortgageRate,
} from "./compare.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const rates = JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")) as MortgageRate[];
const lenderSlugs = new Set(rates.map((rate) => rate.lender_slug));
const inventedCurrentRate = /\d+\.\d{2}\s*%/;

const STATIC_COPY_KEYS = ["intro", "seoDescription", "h1", "title"] as const;

describe("comparison pages", () => {
  it("uses the /compare/ URL pattern with trailing slashes", () => {
    assert.equal(COMPARE_INDEX_HREF, "/compare/");
    for (const page of COMPARISONS) {
      assert.match(compareHref(page.slug), /^\/compare\/[a-z0-9-]+\/$/);
      assert.doesNotMatch(page.slug, /[A-Z]/);
    }
  });

  it("includes product pages plus at least three lender pairs", () => {
    assert.ok(getComparison("fixed-vs-variable"));
    assert.ok(getComparison("insured-vs-uninsured"));
    assert.equal(productComparisons().length, 2);
    assert.ok(lenderComparisons().length >= 3);
  });

  it("grounds lender comparisons in real rate-feed slugs", () => {
    for (const page of lenderComparisons()) {
      assert.ok(page.left.lenderSlug, `${page.slug} missing left slug`);
      assert.ok(page.right.lenderSlug, `${page.slug} missing right slug`);
      assert.ok(lenderSlugs.has(page.left.lenderSlug!), `unknown slug ${page.left.lenderSlug}`);
      assert.ok(lenderSlugs.has(page.right.lenderSlug!), `unknown slug ${page.right.lenderSlug}`);
      assert.match(page.left.href, /\/lenders\/[a-z0-9-]+\/$/);
      assert.match(page.right.href, /\/lenders\/[a-z0-9-]+\/$/);
    }
  });

  it("keeps unique slugs, SEO titles, and 5–8 FAQs", () => {
    const slugs = COMPARISONS.map((page) => page.slug);
    assert.equal(new Set(slugs).size, slugs.length);
    for (const page of COMPARISONS) {
      assert.ok(page.title.length <= 60, `${page.slug} title too long: ${page.title.length}`);
      assert.ok(page.h1.length > 10);
      const faqs = page.faqs(compareContext(rates, page));
      assert.ok(faqs.length >= 5 && faqs.length <= 8, `${page.slug} has ${faqs.length} FAQs`);
    }
  });

  it("does not invent current xx.xx% rates in static copy", () => {
    for (const page of COMPARISONS) {
      for (const key of STATIC_COPY_KEYS) {
        assert.doesNotMatch(String(page[key]), inventedCurrentRate, `${page.slug} ${key}`);
      }
      for (const side of [page.left, page.right]) {
        assert.doesNotMatch(side.summary, inventedCurrentRate, `${page.slug} ${side.name} summary`);
        for (const line of [...side.whenToChoose, ...side.pros, ...side.cons]) {
          assert.doesNotMatch(line, inventedCurrentRate, line);
        }
      }
      for (const step of page.framework) {
        assert.doesNotMatch(step.body, inventedCurrentRate, step.heading);
      }
    }
  });

  it("never emits fake review markup", () => {
    const blob = JSON.stringify(COMPARISONS.map((page) => ({ ...page, faqs: undefined })));
    assert.doesNotMatch(blob, /AggregateRating/);
    assert.doesNotMatch(blob, /ratingValue/);
    assert.doesNotMatch(blob, /reviewCount/);
  });

  it("formats missing rates as N/A instead of inventing percentages", () => {
    assert.equal(formatPct(null), "N/A");
    assert.equal(ratePhrase(null), "not currently listed in our daily feed");
    const none = bestRate(rates, { lenderSlug: "definitely-not-a-lender" });
    assert.equal(none, null);
    const ws = lenderSnapshot(rates, "wealthsimple");
    assert.equal(ws.slug, "wealthsimple");
    assert.ok(ws.fixed5Insured || ws.variable5Insured || ws.lowest);
  });

  it("builds live SEO descriptions from the feed", () => {
    const page = getComparison("wealthsimple-vs-td")!;
    const ctx = compareContext(rates, page);
    const desc = seoDescription(page, ctx);
    assert.ok(desc.length > 40 && desc.length <= 160);
    const summary = liveSummary(page, ctx);
    if (ctx.leftLender?.fixed5Insured) {
      assert.match(summary, /Wealthsimple/);
    }
  });
});

describe("comparison routes and layout", () => {
  it("registers Astro pages for the index and slug routes", () => {
    assert.equal(existsSync(join(root, "src/pages/compare/index.astro")), true);
    assert.equal(existsSync(join(root, "src/pages/compare/[slug].astro")), true);
    const slugPage = readFileSync(join(root, "src/pages/compare/[slug].astro"), "utf8");
    assert.match(slugPage, /getStaticPaths/);
    assert.match(slugPage, /trailingSlash|compare\/\$\{slug\}\//);
  });

  it("keeps required internal links on the shared ComparePage layout", () => {
    const source = readFileSync(join(root, "src/views/compare/ComparePage.tsx"), "utf8");
    for (const href of REQUIRED_COMPARE_LINKS) {
      assert.ok(source.includes(href), `ComparePage missing ${href}`);
    }
    assert.match(source, /from ["']@\/components\/GuideCTA["']/);
    assert.match(source, /<GuideCTA variant="compact"/);
    assert.match(source, /from ["']@\/components\/AdUnit["']/);
    assert.match(source, /<AdUnit format="display"/);
    assert.doesNotMatch(source, /AggregateRating/);
  });

  it("lists every comparison on the index view", () => {
    const source = readFileSync(join(root, "src/views/compare/CompareIndex.tsx"), "utf8");
    assert.match(source, /productComparisons/);
    assert.match(source, /lenderComparisons/);
    assert.match(source, /GuideCTA/);
    assert.match(source, /AdUnit/);
  });

  it("returns lender head-to-heads for Wealthsimple and TD", () => {
    const ws = comparisonsForLender("wealthsimple").map((page) => page.slug);
    const td = comparisonsForLender("td").map((page) => page.slug);
    assert.ok(ws.includes("wealthsimple-vs-td"));
    assert.ok(ws.includes("nesto-vs-wealthsimple"));
    assert.ok(td.includes("wealthsimple-vs-td"));
    assert.ok(td.includes("td-vs-rbc"));
  });
});
