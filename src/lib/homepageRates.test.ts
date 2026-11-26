import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { communityRates, distributionFor, formatRate, PUBLIC_MIN_N, roundToNickel } from "./communityRates.ts";
import {
  big5GapLabel,
  borrowerCreditLine,
  borrowerMedianForBucket,
  buildPaymentHook,
  buildRangeBars,
  changedFilter,
  DEFAULT_HOMEPAGE_FILTERS,
  filterPublishedRates,
  formatUpdatedEt,
  freshnessLine,
  heroCards,
  INITIAL_PAGE_SIZE,
  markerPercent,
  pageOfRates,
  pointsBelow,
  reportedMedianLine,
  showAllLabel,
  sortByRate,
  tableSummary,
  termAnalyticsValue,
} from "./homepageRates.ts";
import { calculateMonthlyPaymentSemiAnnual } from "./mortgageMath.ts";
import { publishedRates } from "./publishedRates.ts";
import { rateSnapshot } from "./rateSnapshot.ts";

describe("homepage borrower medians and range bars", () => {
  it("rounds each 5-year card median to the nearest nickel from the 30-day file", () => {
    for (const card of heroCards()) {
      const cell = communityRates.windows["30d"].products.find(
        (product) =>
          product.termMonths === 60 &&
          product.rateType === card.rateType &&
          product.insured === card.mortgageType,
      );
      assert.ok(cell, card.key);
      assert.ok(cell.n >= PUBLIC_MIN_N, card.key);
      assert.equal(card.reported?.sample, "exact");
      assert.equal(card.reported?.n, cell.n);
      assert.equal(card.reported?.rate, roundToNickel(cell.median));
      assert.equal(card.reported?.label, formatRate(cell.median));
      assert.equal(card.rows[0].rate <= card.rows[card.rows.length - 1].rate, true);
      assert.ok(card.rows.length > 0);
    }
  });

  it("falls back to all down payments, then a labelled small sample", () => {
    const fallback = borrowerMedianForBucket("fixed", "insured", {
      products: [
        { termMonths: 60, rateType: "fixed", insured: "insured", n: 4, median: 4.11 },
        { termMonths: 60, rateType: "fixed", insured: "uninsured", n: 7, median: 4.22 },
      ],
      distributions: [{ termMonths: 60, rateType: "fixed", insured: "all", n: 40, median: 4.49 }],
    });
    assert.equal(fallback?.sample, "all-statuses");
    assert.equal(fallback?.rate, roundToNickel(4.49));
    assert.equal(fallback?.n, 40);
    assert.match(reportedMedianLine(fallback), /all down payments/);

    const small = borrowerMedianForBucket("variable", "insured", {
      products: [{ termMonths: 60, rateType: "variable", insured: "insured", n: 6, median: 3.84 }],
      distributions: [{ termMonths: 60, rateType: "variable", insured: "all", n: 6, median: 3.91 }],
    });
    assert.equal(small?.sample, "small-sample");
    assert.equal(small?.smallSample, true);
    assert.equal(small?.rate, roundToNickel(3.84));
    assert.match(reportedMedianLine(small), /small sample/);

    assert.equal(
      borrowerMedianForBucket("fixed", "uninsured", {
        products: [{ termMonths: 60, rateType: "fixed", insured: "uninsured", n: 2, median: 4.1 }],
        distributions: [{ termMonths: 60, rateType: "fixed", insured: "all", n: 3, median: 4.2 }],
      }),
      null,
    );
  });

  it("spans lowest published special, 30-day median, and Big Five posted", () => {
    for (const bar of buildRangeBars()) {
      const all = distributionFor(60, bar.rateType, "all");
      const side = bar.rateType === "fixed" ? rateSnapshot.fixed : rateSnapshot.variable;
      assert.ok(all && side.lowest && side.big5Posted);
      assert.equal(bar.reported?.n, all.n);
      assert.equal(bar.reported?.rate, roundToNickel(all.median));
      assert.equal(bar.lowest, side.lowest.rate);
      assert.equal(bar.big5, Number(side.big5Posted.rate.toFixed(2)));
      assert.equal(bar.gap, pointsBelow(bar.big5!, bar.reported!.rate));
      assert.equal(bar.markerPercent, markerPercent(bar.lowest!, bar.reported!.rate, bar.big5!));
      assert.match(big5GapLabel(bar.gap) ?? "", /Big 5 posted/);
    }
    const credit = borrowerCreditLine();
    assert.match(credit, /self-reported by Canadian borrowers online/);
    assert.equal(/reddit|redflagdeals|red flag deals|\brfd\b/i.test(credit), false);
  });
});

describe("homepage default 5-year page", () => {
  it("defaults to 5-year rates and renders only the first page", () => {
    const filtered = sortByRate(filterPublishedRates(publishedRates, DEFAULT_HOMEPAGE_FILTERS));
    assert.equal(DEFAULT_HOMEPAGE_FILTERS.term, "60");
    assert.ok(filtered.length > INITIAL_PAGE_SIZE);
    assert.ok(filtered.every((rate) => rate.term_months === 60));
    const firstPage = pageOfRates(filtered, false);
    assert.equal(firstPage.length, INITIAL_PAGE_SIZE);
    assert.equal(pageOfRates(filtered, true).length, filtered.length);
    assert.equal(firstPage[0].rate <= firstPage[1].rate, true);

    const allTerms = sortByRate(
      filterPublishedRates(publishedRates, { ...DEFAULT_HOMEPAGE_FILTERS, term: "all" }),
    );
    assert.equal(allTerms.length, publishedRates.length);
    assert.equal(pageOfRates(allTerms, false).length, INITIAL_PAGE_SIZE);
    assert.match(tableSummary(INITIAL_PAGE_SIZE, filtered.length, "60"), /five-year|5-year/);
    assert.match(showAllLabel(filtered.length, "60", false) ?? "", /Show all/);
    assert.equal(showAllLabel(filtered.length, "60", true), null);
  });

  it("keeps the initial document to the first page in the homepage view", () => {
    const home = readFileSync(new URL("../views/HomePage.tsx", import.meta.url), "utf8");
    const filters = readFileSync(new URL("../components/RateFilters.tsx", import.meta.url), "utf8");
    assert.match(home, /DEFAULT_HOMEPAGE_FILTERS/);
    assert.match(home, /pageOfRates\(/);
    assert.match(home, /rates=\{visibleRates\}/);
    assert.match(home, /useState\(false\)/);
    assert.doesNotMatch(filters, /Show Filters|Hide Filters/);
    assert.match(filters, /INSURED_SHORT_LABEL/);
    assert.match(filters, /UNINSURED_SHORT_LABEL/);
    assert.doesNotMatch(filters, />20%|&gt;20%/);
  });

  it("names the filter that changed", () => {
    const base = DEFAULT_HOMEPAGE_FILTERS;
    assert.deepEqual(changedFilter(base, { ...base, term: "36" }), {
      filter_type: "term",
      filter_value: "3-year",
    });
    assert.deepEqual(changedFilter(base, { ...base, mortgageType: "uninsured" }), {
      filter_type: "down_payment",
      filter_value: "uninsured",
    });
    assert.deepEqual(changedFilter(base, { ...base, rateType: "fixed" }), {
      filter_type: "rate_type",
      filter_value: "fixed",
    });
    assert.deepEqual(changedFilter(base, { ...base, lenderQuery: "nesto" }), {
      filter_type: "search",
      filter_value: "nesto",
    });
    assert.equal(changedFilter(base, { ...base }), null);
    assert.equal(termAnalyticsValue("6"), "6-month");
    assert.equal(termAnalyticsValue("all"), "all");
  });
});

describe("homepage payment hook and freshness", () => {
  it("uses Canadian semi-annual compounding on the lowest published 5-year fixed", () => {
    assert.equal(Number(calculateMonthlyPaymentSemiAnnual(500_000, 4.34, 25).toFixed(2)), 2723.07);
    const hook = buildPaymentHook();
    assert.ok(hook);
    assert.equal(hook.principal, 500_000);
    assert.equal(hook.years, 25);
    assert.equal(
      hook.monthly,
      Number(calculateMonthlyPaymentSemiAnnual(hook.principal, hook.rate, hook.years).toFixed(2)),
    );
    const lowest = Math.min(
      ...publishedRates
        .filter((rate) => rate.term_months === 60 && rate.rate_type === "fixed")
        .map((rate) => rate.rate),
    );
    assert.equal(hook.rate, lowest);
  });

  it("formats the live update time in Eastern Time", () => {
    assert.equal(formatUpdatedEt("2026-11-25T10:53:26Z"), "Nov 25, 2026, 5:53 AM ET");
    const line = freshnessLine(publishedRates.length, new Set(publishedRates.map((rate) => rate.lender_slug)).size);
    assert.match(line, new RegExp(`${publishedRates.length} rates from`));
    assert.match(line, /ET/);
  });
});

describe("homepage event wiring", () => {
  it("fires the homepage GA4 events from the page, nav, and signup", () => {
    const home = readFileSync(new URL("../views/HomePage.tsx", import.meta.url), "utf8");
    const nav = readFileSync(new URL("../components/Navigation.tsx", import.meta.url), "utf8");
    const blob = `${home}\n${nav}`;
    for (const name of [
      "filter_change",
      "lender_table_click",
      "show_all_rates_click",
      "calculator_cta_click",
      "renewal_checker_cta_click",
      "guide_cta_click",
      "rate_alert_interact",
      "history_trends_click",
    ]) {
      assert.match(blob, new RegExp(name), name);
    }
    assert.match(home, /source: "payment_hook"/);
    assert.match(home, /source: "tools_grid"/);
    assert.match(home, /source: "hero"/);
    assert.match(home, /source: "range_bar"/);
    assert.match(home, /source: "homepage_conversion_strip"/);
    assert.match(nav, /source: "nav"/);
    assert.equal(/reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i.test(home), false);
  });
});
