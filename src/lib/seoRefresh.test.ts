import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { blogPosts } from "../content/blog.ts";
import { stressTestGuide } from "../content/guides/stressTestGuide.ts";
import {
  affordabilityGuide,
  closingProvinceGuide,
  cmhcExtra,
  penaltyGuide,
  refinanceGuide,
  renewalCalculatorGuide,
  rentVsBuyExtra,
  sectionWordCount,
} from "../content/toolExplainers.ts";
import { publishedRates } from "./publishedRates.ts";
import { buildRateSnapshot } from "./rateSnapshot.ts";
import { ontarioFirstTimeRebates, ontarioProvincialLandTransferTax, peiTransferTax } from "./mortgageMath.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

function read(path: string): string {
  return readFileSync(join(root, path), "utf8");
}

describe("SEO refresh", () => {
  it("sets the closing-cost and mortgage calculator titles", () => {
    const closing = read("src/pages/tools/closing-costs-calculator/index.astro");
    const mortgage = read("src/pages/tools/mortgage-calculator/index.astro");
    assert.match(closing, /Closing Costs Calculator Canada \(2026\): By Province/);
    assert.match(mortgage, /Mortgage Calculator Canada: Payments with Semi-Annual Compounding/);
    assert.match(read("src/content/guides/stressTestGuide.ts"), /Mortgage Stress Test 2026/);
    assert.match(stressTestGuide.metaTitle, /Mortgage Stress Test 2026/);
  });

  it("redirects the thin first-time buyer post and drops it from the blog", () => {
    const htaccess = read("public/.htaccess");
    assert.match(
      htaccess,
      /RewriteRule \^blog\/first-time-buyer-guide-2026\/\?\$ \/guides\/first-time-home-buyer-programs-canada\/ \[R=301,L\]/
    );
    assert.match(
      htaccess,
      /RewriteRule \^blog\/first-time-buyer-guide-2025\/\?\$ \/guides\/first-time-home-buyer-programs-canada\/ \[R=301,L\]/
    );
    assert.equal(
      blogPosts.some((post) => post.slug === "first-time-buyer-guide-2026"),
      false
    );
    assert.doesNotMatch(read("src/content/blog.ts"), /first-time-buyer-guide-2026/);
  });

  it("builds the rate answer from posted rates and reported medians separately", () => {
    const snap = buildRateSnapshot();
    const fixedRows = publishedRates.filter((row) => row.term_months === 60 && row.rate_type === "fixed");
    const lowest = Math.min(...fixedRows.map((row) => row.rate));
    assert.equal(snap.fixed.lowest?.rate, lowest);
    assert.ok(snap.fixed.reported && snap.fixed.reported.n >= 10);
    assert.ok(snap.variable.reported && snap.variable.reported.n >= 10);
    assert.equal(snap.attribution, "self-reported by Canadian borrowers online");
    assert.ok(snap.fixed.big5Posted);
    for (const bank of snap.fixed.big5Posted.banks) {
      assert.equal(typeof bank.posted, "number");
      assert.ok(bank.posted > 0);
    }
    assert.deepEqual(
      snap.fixed.big5Posted.banks.map((bank) => bank.slug).sort(),
      ["bmo", "cibc", "rbc", "scotiabank", "td"],
    );
    assert.equal(snap.fixed.big5Posted.missing.length, 0);
    const answer = read("src/components/RateAnswer.tsx");
    assert.match(answer, /\/cities\/vancouver\//);
    assert.match(answer, /\/cities\/victoria\//);
  });

  it("gives the thin calculators at least 400 words of explanation", () => {
    const counts = {
      penalty: sectionWordCount(penaltyGuide()),
      affordability: sectionWordCount(affordabilityGuide()),
      rent: sectionWordCount(rentVsBuyExtra()),
      refinance: sectionWordCount(refinanceGuide()),
      cmhc: sectionWordCount(cmhcExtra()),
      renewal: sectionWordCount(renewalCalculatorGuide()),
      closingProvinces: sectionWordCount(closingProvinceGuide()),
    };
    for (const [name, words] of Object.entries(counts)) {
      assert.ok(words >= 400, `${name} is ${words} words`);
    }
  });

  it("keeps Toronto rebates separate and waives P.E.I. with no price cap", () => {
    const provincial = ontarioProvincialLandTransferTax(600_000);
    const rebates = ontarioFirstTimeRebates(provincial, provincial);
    assert.equal(rebates.provincial, 4_000);
    assert.equal(rebates.municipal, 4_475);
    assert.equal(rebates.total, 8_475);
    assert.ok(peiTransferTax(600_000) > 2_000);
    const closing = read("src/components/ClosingCostsCalculator.tsx");
    assert.doesNotMatch(closing, /price <= 200000/);
    assert.match(read("src/views/guides/NegotiateGuidePage.tsx"), /Discount below each bank/);
    assert.match(read("src/content/guides/prepaymentPenalties.ts"), /negotiate-mortgage-rate/);
    assert.match(read("src/content/guides/renewalVsRefinance.ts"), /negotiate-mortgage-rate/);
  });

  it("does not name Reddit or the excluded surname in the new copy", () => {
    const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i;
    for (const file of [
      "src/content/toolExplainers.ts",
      "src/components/RateAnswer.tsx",
      "src/lib/rateSnapshot.ts",
      "src/views/compare/ComparePage.tsx",
      "src/views/guides/NegotiateGuidePage.tsx",
    ]) {
      assert.equal(forbidden.test(read(file)), false, file);
    }
  });
});
