import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { october2026Report } from "./communityReportCopy.ts";
import {
  CHART_MIN_N,
  PUBLIC_MIN_N,
  buildFaqs,
  buildTakeaways,
  chartLenderProducts,
  chartProducts,
  communityRates,
  distributionFor,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderBySlug,
  nearestRank,
  negotiationTips,
  percentBetterThan,
  percentileAtOrBelow,
  publicLenderProducts,
  publicProducts,
  roundToNickel,
  scoreOffer,
} from "./communityRates.ts";

const FORBIDDEN = /reddit|redflag|red flag|\brfd\b|twitter|subreddit|username/i;

describe("community rate rounding", () => {
  it("rounds half-up to the nearest 0.05", () => {
    assert.equal(roundToNickel(3.595), 3.6);
    assert.equal(roundToNickel(4.99), 5);
    assert.equal(roundToNickel(4.815), 4.8);
    assert.equal(roundToNickel(4.29), 4.3);
    assert.equal(formatRate(3.595), "3.60%");
    assert.equal(formatRate(4.99), "5.00%");
    assert.equal(formatRate(4.815), "4.80%");
    assert.equal(formatRate(null), "—");
  });

  it("describes a positive spread as below posted", () => {
    assert.equal(formatSpread(0.7), "0.70 pts below");
    assert.equal(formatSpread(-0.3), "0.30 pts above");
    assert.equal(formatSpread(0.01), "in line with");
  });
});

describe("community rate publication rules", () => {
  it("publishes a cell only when N is at least 10 and keeps raw medians", () => {
    const published = publicProducts("30d");
    assert.ok(published.length > 0);
    assert.ok(published.every((product) => product.n >= PUBLIC_MIN_N));
    const variable = published.find(
      (product) => product.termMonths === 60 && product.rateType === "variable" && product.insured === "uninsured",
    );
    assert.ok(variable);
    assert.equal(variable.n, 38);
    assert.equal(variable.median, 3.595);
    assert.equal(formatRate(variable.median), "3.60%");
  });

  it("allows N of at least 5 on chart series only", () => {
    const chart = chartProducts("30d");
    assert.ok(chart.every((product) => product.n >= CHART_MIN_N));
    assert.ok(chart.some((product) => product.n < PUBLIC_MIN_N));
    assert.ok(chart.every((product) => product.insured === "insured" || product.insured === "uninsured"));
    const small = chart.find(
      (product) => product.termMonths === 60 && product.rateType === "fixed" && product.insured === "insured",
    );
    assert.ok(small);
    assert.equal(small.n, 7);
  });

  it("always exposes the as-of date, prime, and attribution", () => {
    assert.equal(communityRates.asOf, "2026-10-03");
    assert.equal(formatAsOf(), "October 3, 2026");
    assert.equal(communityRates.prime, 4.45);
    assert.equal(communityRates.attribution, "self-reported by Canadian borrowers online");
    assert.match(communityRates.disclaimer, /unverified/i);
    assert.match(communityRates.disclaimer, /not a mortgage offer/i);
  });

  it("hides a bank comparison when the posted rate or sample is missing", () => {
    const td = lenderBySlug("td");
    const cibc = lenderBySlug("cibc");
    const bmo = lenderBySlug("bmo");
    assert.ok(td && cibc && bmo);
    assert.ok(publicLenderProducts(td).some((product) => product.termMonths === 60 && product.rateType === "variable"));
    assert.equal(chartLenderProducts(cibc).length, 0);
    assert.equal(chartLenderProducts(bmo).length, 0);
    assert.equal(publicLenderProducts(td).every((product) => product.n >= PUBLIC_MIN_N && product.postedRate != null), true);
  });
});

describe("offer scoring", () => {
  it("ranks an offer against the sorted reports", () => {
    const fixed = distributionFor(60, "fixed", "all");
    assert.ok(fixed);
    assert.equal(fixed.n, 62);
    assert.equal(nearestRank(fixed.rates, 25), fixed.p25);
    assert.ok(fixed.p25 <= fixed.median);
    assert.ok(fixed.median <= fixed.p75);
    const atMedian = percentileAtOrBelow(fixed.rates, fixed.median);
    assert.ok(atMedian >= 40 && atMedian <= 60);
    assert.ok(percentBetterThan(fixed.rates, fixed.min) > 90);
  });

  it("calls a rate at or under the 25th percentile a great offer", () => {
    const dist = distributionFor(60, "variable", "uninsured");
    assert.ok(dist);
    const great = scoreOffer({
      lenderSlug: null,
      termMonths: 60,
      rateType: "variable",
      insured: "uninsured",
      offerRate: dist.p25,
    });
    assert.equal(great.verdict, "great");
    assert.equal(great.sample, "exact");
    assert.equal(great.n, dist.n);

    const negotiate = scoreOffer({
      lenderSlug: null,
      termMonths: 60,
      rateType: "variable",
      insured: "uninsured",
      offerRate: dist.max,
    });
    assert.equal(negotiate.verdict, "negotiate");
    assert.ok((negotiate.percentBeating ?? 100) < 5);
  });

  it("falls back to all insured statuses when the exact cell is under 10", () => {
    const score = scoreOffer({
      lenderSlug: null,
      termMonths: 60,
      rateType: "fixed",
      insured: "insured",
      offerRate: 4.14,
    });
    assert.equal(score.sample, "all-statuses");
    assert.notEqual(score.verdict, "insufficient");
    assert.ok((score.marketN ?? 0) >= PUBLIC_MIN_N);
  });

  it("uses the bank's own reports when that cell has at least 10", () => {
    const score = scoreOffer({
      lenderSlug: "td",
      termMonths: 60,
      rateType: "variable",
      insured: "all",
      offerRate: 3.6,
    });
    assert.equal(score.sample, "bank");
    assert.equal(score.n, 31);
    assert.equal(score.bankPosted, 4.24);
    assert.notEqual(score.verdict, "insufficient");
  });

  it("refuses a percentile when no cell reaches N of 10", () => {
    const score = scoreOffer({
      lenderSlug: "bmo",
      termMonths: 12,
      rateType: "fixed",
      insured: "insured",
      offerRate: 4.5,
    });
    assert.equal(score.verdict, "insufficient");
    assert.equal(score.percentile, null);
    const tips = negotiationTips(score, {
      lenderSlug: "bmo",
      termMonths: 12,
      rateType: "fixed",
      insured: "insured",
      offerRate: 4.5,
    });
    assert.ok(tips.length > 0);
    assert.equal(FORBIDDEN.test(tips.join(" ")), false);
  });
});

describe("generated copy", () => {
  it("builds takeaways and FAQs only from the file", () => {
    const lines = buildTakeaways();
    assert.ok(lines.length >= 3);
    for (const line of lines) {
      assert.match(line, /N = \d+/);
      assert.equal(FORBIDDEN.test(line), false);
      assert.equal(line.includes("NaN"), false);
    }
    const faqs = buildFaqs();
    assert.ok(faqs.length >= 4);
    for (const faq of faqs) {
      assert.ok(faq.question.length > 10);
      assert.ok(faq.answer.length > 40);
      assert.equal(FORBIDDEN.test(`${faq.question} ${faq.answer}`), false);
    }
  });

  it("keeps the October report on Andrew and off named communities", () => {
    const post = october2026Report();
    assert.equal(post.author, "Andrew");
    assert.equal(post.slug, "below-the-line-mortgage-rate-report-october-2026");
    assert.match(post.content, /self-reported by Canadian borrowers online/);
    assert.match(post.content, /<!--COMMUNITY_CHARTS-->/);
    assert.equal(FORBIDDEN.test(`${post.title} ${post.excerpt} ${post.content}`), false);
    assert.match(post.excerpt, /N = \d+/);
  });

  it("does not name a source community in the data file", () => {
    const path = fileURLToPath(new URL("../data/community-rates.json", import.meta.url));
    const text = readFileSync(path, "utf8");
    assert.equal(FORBIDDEN.test(text), false);
    assert.match(text, /self-reported by Canadian borrowers online/);
  });
});
