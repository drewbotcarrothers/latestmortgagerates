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
  chartProducts,
  communityRates,
  distributionFor,
  formatAsOf,
  formatRate,
  formatSpread,
  nearestRank,
  negotiationTips,
  percentBetterThan,
  percentileAtOrBelow,
  publicProducts,
  roundToNickel,
  scoreOffer,
  selectChartLenderProducts,
  selectChartProducts,
  selectPublicLenderProducts,
  selectPublicProducts,
  type Distribution,
  type LenderBlock,
  type LenderProduct,
  type OfferBook,
  type ProductCell,
  type RateType,
} from "./communityRates.ts";

const FORBIDDEN = /reddit|redflag|red flag|\brfd\b|twitter|subreddit|username/i;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function assertIsoDate(value: string, label: string) {
  assert.match(value, ISO_DATE, label);
  const [year, month, day] = value.split("-").map(Number);
  assert.ok(month >= 1 && month <= 12, label);
  const date = new Date(Date.UTC(year, month - 1, day));
  assert.equal(date.getUTCFullYear(), year, label);
  assert.equal(date.getUTCMonth(), month - 1, label);
  assert.equal(date.getUTCDate(), day, label);
}

function expectedLongDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return `${MONTHS[month - 1]} ${day}, ${year}`;
}

function cell(
  partial: Pick<ProductCell, "termMonths" | "rateType" | "insured" | "n"> & Partial<ProductCell>,
): ProductCell {
  return {
    median: 4,
    min: 3.5,
    p25: 3.8,
    medianPrimeDiscount: null,
    lowestPosted: 4.5,
    lowestPostedLender: "atb",
    big5PostedMedian: 5,
    big5PostedMin: 4.8,
    spreadVsLowestPosted: 0.5,
    spreadVsBig5Median: 1,
    ...partial,
  };
}

function lenderProduct(
  partial: Pick<LenderProduct, "termMonths" | "rateType" | "n"> & Partial<LenderProduct>,
): LenderProduct {
  const rates = partial.rates ?? Array.from({ length: partial.n }, () => partial.reportedMedian ?? 4);
  return {
    reportedMedian: 4,
    postedRate: 5,
    spreadVsPosted: 1,
    rates,
    ...partial,
    n: partial.n,
  };
}

function distribution(
  partial: Pick<Distribution, "termMonths" | "rateType" | "insured" | "rates"> & Partial<Distribution>,
): Distribution {
  const rates = [...partial.rates];
  return {
    n: rates.length,
    median: rates[Math.floor(rates.length / 2)] ?? 0,
    p25: rates[0] ?? 0,
    p75: rates[rates.length - 1] ?? 0,
    min: rates.length ? Math.min(...rates) : 0,
    max: rates.length ? Math.max(...rates) : 0,
    big5PostedMedian: 5,
    lowestPosted: 4.2,
    lowestPostedLender: "atb",
    shareBelowBig5: 0.5,
    ...partial,
    rates,
    n: rates.length,
  };
}

const EXACT_RATES = [3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4.2];

function book(distributions: Distribution[], lenders: LenderBlock[] = []): OfferBook {
  return { distributions, lenders };
}

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
    assert.equal(formatRate(undefined), "—");
    assert.equal(formatRate(Number.NaN), "—");
  });

  it("describes a positive spread as below posted", () => {
    assert.equal(formatSpread(0.7), "0.70 pts below");
    assert.equal(formatSpread(-0.3), "0.30 pts above");
    assert.equal(formatSpread(0.01), "in line with");
    assert.equal(formatSpread(0), "in line with");
    assert.equal(formatSpread(null), "—");
  });

  it("formats a fixed as-of date without reading the snapshot", () => {
    assert.equal(formatAsOf("2026-10-04"), "October 4, 2026");
    assert.equal(formatAsOf("2026-01-01"), "January 1, 2026");
    assert.equal(formatAsOf("2026-12-31"), "December 31, 2026");
  });
});

describe("community rate publication rules", () => {
  it("publishes N of 10 and charts N of 5 to 9 only for insured or uninsured", () => {
    const products = [
      cell({ termMonths: 60, rateType: "fixed", insured: "insured", n: CHART_MIN_N - 1 }),
      cell({ termMonths: 60, rateType: "fixed", insured: "uninsured", n: CHART_MIN_N }),
      cell({ termMonths: 60, rateType: "fixed", insured: "insured", n: 7 }),
      cell({ termMonths: 36, rateType: "variable", insured: "uninsured", n: PUBLIC_MIN_N - 1 }),
      cell({ termMonths: 60, rateType: "variable", insured: "unknown", n: PUBLIC_MIN_N }),
      cell({ termMonths: 36, rateType: "fixed", insured: "insurable", n: 20 }),
      cell({ termMonths: 36, rateType: "fixed", insured: "uninsured", n: PUBLIC_MIN_N }),
      cell({ termMonths: 24, rateType: "fixed", insured: "insured", n: 0 }),
    ];

    const published = selectPublicProducts(products);
    const chart = selectChartProducts(products);

    assert.deepEqual(
      published.map((product) => [product.termMonths, product.rateType, product.insured, product.n]),
      [
        [60, "variable", "unknown", PUBLIC_MIN_N],
        [36, "fixed", "uninsured", PUBLIC_MIN_N],
        [36, "fixed", "insurable", 20],
      ],
    );
    assert.deepEqual(
      chart.map((product) => [product.termMonths, product.rateType, product.insured, product.n]),
      [
        [60, "fixed", "uninsured", CHART_MIN_N],
        [60, "fixed", "insured", 7],
        [36, "fixed", "uninsured", PUBLIC_MIN_N],
        [36, "variable", "uninsured", PUBLIC_MIN_N - 1],
      ],
    );
    assert.ok(chart.every((product) => product.n >= CHART_MIN_N));
    assert.ok(chart.some((product) => product.n < PUBLIC_MIN_N));
    assert.ok(published.every((product) => product.n >= PUBLIC_MIN_N));
    assert.equal(
      published.find((product) => product.n === 7),
      undefined,
    );
  });

  it("hides a bank row when the posted rate is missing or N is small", () => {
    const products = [
      lenderProduct({ termMonths: 60, rateType: "fixed", n: CHART_MIN_N - 1, postedRate: 5.1 }),
      lenderProduct({ termMonths: 60, rateType: "variable", n: 7, postedRate: 4.24 }),
      lenderProduct({ termMonths: 36, rateType: "fixed", n: PUBLIC_MIN_N, postedRate: null }),
      lenderProduct({ termMonths: 36, rateType: "variable", n: PUBLIC_MIN_N, postedRate: 4.5 }),
      lenderProduct({ termMonths: 24, rateType: "fixed", n: 3, postedRate: null }),
    ];
    const chart = selectChartLenderProducts(products);
    const table = selectPublicLenderProducts(products);

    assert.deepEqual(
      chart.map((product) => [product.termMonths, product.rateType, product.n]),
      [
        [60, "variable", 7],
        [36, "variable", PUBLIC_MIN_N],
      ],
    );
    assert.deepEqual(
      table.map((product) => [product.termMonths, product.rateType, product.n]),
      [[36, "variable", PUBLIC_MIN_N]],
    );
    assert.ok(table.every((product) => chart.some((item) => item.termMonths === product.termMonths && item.rateType === product.rateType)));
  });

  it("applies the same N gates to whatever the current file contains", () => {
    for (const windowKey of ["7d", "30d"] as const) {
      const source = communityRates.windows[windowKey].products;
      const published = publicProducts(windowKey);
      const chart = chartProducts(windowKey);
      assert.ok(source.length > 0, windowKey);

      for (const product of source) {
        const shown = published.find(
          (item) => item.termMonths === product.termMonths && item.rateType === product.rateType && item.insured === product.insured,
        );
        const onChart = chart.find(
          (item) => item.termMonths === product.termMonths && item.rateType === product.rateType && item.insured === product.insured,
        );
        assert.equal(shown !== undefined, product.n >= PUBLIC_MIN_N);
        assert.equal(
          onChart !== undefined,
          product.n >= CHART_MIN_N && (product.insured === "insured" || product.insured === "uninsured"),
        );
        if (shown) {
          assert.equal(shown.n, product.n);
          assert.equal(shown.median, product.median);
          assert.equal(formatRate(shown.median), formatRate(roundToNickel(shown.median)));
        }
      }

      assert.ok(published.every((product) => product.n >= PUBLIC_MIN_N));
      assert.ok(chart.every((product) => product.n >= CHART_MIN_N));
      assert.ok(chart.every((product) => product.insured === "insured" || product.insured === "uninsured"));
    }

    assert.ok(publicProducts("30d").length > 0);
  });

  it("keeps a valid as-of date, prime, thresholds, and attribution", () => {
    assertIsoDate(communityRates.asOf, "asOf");
    assert.equal(formatAsOf(), formatAsOf(communityRates.asOf));
    assert.equal(formatAsOf(), expectedLongDate(communityRates.asOf));
    assert.ok(Number.isFinite(communityRates.prime));
    assert.ok(communityRates.prime > 0 && communityRates.prime < 25);
    assert.equal(communityRates.thresholds.publicMinN, PUBLIC_MIN_N);
    assert.equal(communityRates.thresholds.chartMinN, CHART_MIN_N);
    assert.equal(communityRates.attribution, "self-reported by Canadian borrowers online");
    assert.equal(FORBIDDEN.test(communityRates.attribution), false);
    assert.match(communityRates.disclaimer, /unverified/i);
    assert.match(communityRates.disclaimer, /not a mortgage offer/i);
    assert.equal(FORBIDDEN.test(communityRates.disclaimer), false);
    assert.match(communityRates.generated, /^\d{4}-\d{2}-\d{2}T/);
  });

  it("keeps window, distribution, weekly, and lender structure consistent", () => {
    assert.ok(communityRates.lenders.length > 0);
    assert.equal(typeof communityRates.lenderNames, "object");

    for (const windowKey of ["7d", "30d"] as const) {
      const window = communityRates.windows[windowKey];
      assertIsoDate(window.from, `${windowKey}.from`);
      assertIsoDate(window.to, `${windowKey}.to`);
      assert.ok(window.from <= window.to);
      assert.ok(window.to <= communityRates.asOf);
      assert.equal(typeof window.usableRecords, "number");
      const keys = new Set<string>();
      for (const product of window.products) {
        assert.ok(product.n > 0);
        assert.ok(Number.isFinite(product.median));
        assert.ok(product.rateType === "fixed" || product.rateType === "variable");
        const key = `${product.termMonths}:${product.rateType}:${product.insured}`;
        assert.equal(keys.has(key), false, key);
        keys.add(key);
      }
    }

    for (const distribution of communityRates.distributions) {
      assert.equal(distribution.n, distribution.rates.length);
      assert.ok(distribution.n > 0);
      assert.ok(distribution.rates.every((rate) => Number.isFinite(rate)));
      assert.ok(distribution.min <= distribution.p25);
      assert.ok(distribution.p25 <= distribution.median);
      assert.ok(distribution.median <= distribution.p75);
      assert.ok(distribution.p75 <= distribution.max);
      assert.equal(nearestRank(distribution.rates, 25), distribution.p25);
      assert.equal(nearestRank(distribution.rates, 75), distribution.p75);
    }

    assertIsoDate(communityRates.weekly.from, "weekly.from");
    assertIsoDate(communityRates.weekly.to, "weekly.to");
    assert.ok(communityRates.weekly.from <= communityRates.weekly.to);
    assert.equal(communityRates.weekly.termMonths, 60);
    for (const week of communityRates.weekly.weeks) {
      assertIsoDate(week.weekStarting, "weekStarting");
      for (const series of [week.fixed, week.variable]) {
        assert.ok(series.n >= 0);
        assert.ok(series.median == null || Number.isFinite(series.median));
      }
    }

    let lendersWithChart = 0;
    for (const lender of communityRates.lenders) {
      assert.ok(lender.slug.length > 0);
      assert.equal(FORBIDDEN.test(lender.slug), false);
      const chart = selectChartLenderProducts(lender.products);
      const published = selectPublicLenderProducts(lender.products);
      if (chart.length > 0) lendersWithChart += 1;
      for (const product of lender.products) {
        assert.equal(product.n, product.rates.length);
        assert.equal(
          chart.some((item) => item.termMonths === product.termMonths && item.rateType === product.rateType),
          product.n >= CHART_MIN_N && product.postedRate != null,
        );
        assert.equal(
          published.some((item) => item.termMonths === product.termMonths && item.rateType === product.rateType),
          product.n >= PUBLIC_MIN_N && product.postedRate != null,
        );
      }
    }
    assert.ok(lendersWithChart > 0);
  });
});

describe("offer scoring", () => {
  it("ranks an offer against a fixed list of reports", () => {
    assert.equal(nearestRank(EXACT_RATES, 25), 3.3);
    assert.equal(nearestRank(EXACT_RATES, 50), 3.5);
    assert.equal(nearestRank(EXACT_RATES, 75), 3.8);
    assert.equal(nearestRank([], 50), null);
    assert.equal(percentileAtOrBelow(EXACT_RATES, 3.5), 50);
    assert.equal(percentileAtOrBelow([], 3.5), 0);
    assert.equal(percentBetterThan(EXACT_RATES, EXACT_RATES[0]), 90);
    assert.equal(percentBetterThan(EXACT_RATES, EXACT_RATES[EXACT_RATES.length - 1]), 0);
    assert.equal(percentBetterThan([], 3), 0);

    const fixed = distribution({
      termMonths: 60,
      rateType: "fixed",
      insured: "all",
      rates: EXACT_RATES,
      median: 3.55,
      p25: 3.3,
      p75: 3.8,
    });
    assert.equal(nearestRank(fixed.rates, 25), 3.3);
    assert.ok(fixed.p25 <= fixed.median);
    assert.ok(fixed.median <= fixed.p75);
  });

  it("calls a rate at or under the 25th percentile a great offer", () => {
    const dist = distribution({
      termMonths: 60,
      rateType: "variable",
      insured: "uninsured",
      rates: EXACT_RATES,
      median: 3.55,
    });
    const fixture = book([dist]);
    const input = {
      lenderSlug: null,
      termMonths: 60 as const,
      rateType: "variable" as const,
      insured: "uninsured" as const,
    };

    const great = scoreOffer({ ...input, offerRate: 3.3 }, fixture);
    assert.equal(great.verdict, "great");
    assert.equal(great.sample, "exact");
    assert.equal(great.n, EXACT_RATES.length);
    assert.equal(great.p25, 3.3);
    assert.equal(great.percentile, 30);
    assert.equal(great.vsMedianPts, 3.3 - 3.55);

    const fair = scoreOffer({ ...input, offerRate: 3.5 }, fixture);
    assert.equal(fair.verdict, "fair");
    assert.equal(fair.sample, "exact");

    const negotiate = scoreOffer({ ...input, offerRate: 4.2 }, fixture);
    assert.equal(negotiate.verdict, "negotiate");
    assert.equal(negotiate.percentBeating, 0);
    assert.ok((negotiate.percentBeating ?? 100) < 5);
  });

  it("falls back to all insured statuses when the exact cell is under 10", () => {
    const exact = distribution({
      termMonths: 60,
      rateType: "fixed",
      insured: "insured",
      rates: [4.1, 4.14, 4.2, 4.3, 4.4],
      median: 4.2,
    });
    const all = distribution({
      termMonths: 60,
      rateType: "fixed",
      insured: "all",
      rates: EXACT_RATES,
      median: 3.55,
    });
    assert.ok(exact.n < PUBLIC_MIN_N);
    assert.ok(all.n >= PUBLIC_MIN_N);

    const score = scoreOffer(
      {
        lenderSlug: null,
        termMonths: 60,
        rateType: "fixed",
        insured: "insured",
        offerRate: 4.14,
      },
      book([exact, all]),
    );
    assert.equal(score.sample, "all-statuses");
    assert.notEqual(score.verdict, "insufficient");
    assert.equal(score.n, all.n);
    assert.ok((score.marketN ?? 0) >= PUBLIC_MIN_N);
    assert.equal(score.median, all.median);
  });

  it("uses the bank's own reports when that cell has at least 10", () => {
    const bankRates = [3.4, 3.45, 3.5, 3.55, 3.6, 3.6, 3.65, 3.7, 3.75, 3.8, 3.9, 4.0];
    const lender: LenderBlock = {
      slug: "td",
      matchedN: bankRates.length,
      medianSpreadVsOwnPosted: 0.64,
      products: [
        lenderProduct({
          termMonths: 60,
          rateType: "variable",
          n: bankRates.length,
          reportedMedian: 3.6,
          postedRate: 4.24,
          spreadVsPosted: 0.64,
          rates: bankRates,
        }),
      ],
    };
    const market = distribution({
      termMonths: 60,
      rateType: "variable",
      insured: "all",
      rates: EXACT_RATES,
      median: 3.55,
    });
    const score = scoreOffer(
      {
        lenderSlug: "td",
        termMonths: 60,
        rateType: "variable",
        insured: "all",
        offerRate: 3.6,
      },
      book([market], [lender]),
    );
    assert.equal(score.sample, "bank");
    assert.equal(score.n, 12);
    assert.equal(score.bankPosted, 4.24);
    assert.equal(score.bankN, 12);
    assert.equal(score.bankMedian, 3.6);
    assert.notEqual(score.verdict, "insufficient");
    assert.equal(score.vsBankPostedPts, 3.6 - 4.24);
  });

  it("refuses a percentile when no cell reaches N of 10", () => {
    const exact = distribution({
      termMonths: 12,
      rateType: "fixed",
      insured: "insured",
      rates: [4.4, 4.5, 4.6],
    });
    const all = distribution({
      termMonths: 12,
      rateType: "fixed",
      insured: "all",
      rates: [4.4, 4.5, 4.6, 4.7],
    });
    const lender: LenderBlock = {
      slug: "bmo",
      matchedN: 2,
      medianSpreadVsOwnPosted: null,
      products: [lenderProduct({ termMonths: 12, rateType: "fixed", n: 2, postedRate: 5, rates: [4.5, 4.6] })],
    };
    const input = {
      lenderSlug: "bmo",
      termMonths: 12 as const,
      rateType: "fixed" as const,
      insured: "insured" as const,
      offerRate: 4.5,
    };
    const score = scoreOffer(input, book([exact, all], [lender]));
    assert.equal(score.verdict, "insufficient");
    assert.equal(score.percentile, null);
    assert.equal(score.percentBeating, null);
    const tips = negotiationTips(score, input);
    assert.ok(tips.length > 0);
    assert.match(tips.join(" "), new RegExp(`${PUBLIC_MIN_N} reports`));
    assert.equal(FORBIDDEN.test(tips.join(" ")), false);
  });

  it("follows the same scoring rules on the current file", () => {
    for (const row of communityRates.distributions) {
      if (row.insured !== "insured" && row.insured !== "uninsured" && row.insured !== "all") continue;
      if (row.n < PUBLIC_MIN_N) {
        const all = distributionFor(row.termMonths, row.rateType, "all");
        if (row.insured !== "all" && all && all.n >= PUBLIC_MIN_N) {
          const score = scoreOffer({
            lenderSlug: null,
            termMonths: row.termMonths,
            rateType: row.rateType,
            insured: row.insured,
            offerRate: row.median,
          });
          assert.equal(score.sample, "all-statuses");
          assert.notEqual(score.verdict, "insufficient");
        }
        continue;
      }
      const atP25 = scoreOffer({
        lenderSlug: null,
        termMonths: row.termMonths,
        rateType: row.rateType as RateType,
        insured: row.insured,
        offerRate: nearestRank(row.rates, 25) ?? row.p25,
      });
      assert.equal(atP25.verdict, "great");
      assert.equal(atP25.sample, "exact");
      assert.equal(atP25.n, row.n);
    }

    for (const lender of communityRates.lenders) {
      for (const product of lender.products) {
        if (product.n < PUBLIC_MIN_N) continue;
        const score = scoreOffer({
          lenderSlug: lender.slug,
          termMonths: product.termMonths,
          rateType: product.rateType,
          insured: "all",
          offerRate: product.reportedMedian,
        });
        assert.equal(score.sample, "bank");
        assert.equal(score.n, product.n);
        assert.equal(score.bankPosted, product.postedRate);
        assert.notEqual(score.verdict, "insufficient");
      }
    }
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
    assert.ok(post.excerpt.includes(expectedLongDate(communityRates.asOf)));
  });

  it("does not name a source community in the data file", () => {
    const path = fileURLToPath(new URL("../data/community-rates.json", import.meta.url));
    const text = readFileSync(path, "utf8");
    assert.equal(FORBIDDEN.test(text), false);
    assert.match(text, /self-reported by Canadian borrowers online/);
    const parsed = JSON.parse(text) as { asOf: string };
    assert.equal(parsed.asOf, communityRates.asOf);
  });
});
