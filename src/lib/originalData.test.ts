import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { threeMonthInterestOnBalance } from "./mortgageMath.ts";
import {
  BREAK_BALANCE,
  BREAK_MONTHS,
  breakExplanationWords,
  buildBreakExamples,
  postedIrdExample,
} from "./breakCosts.ts";
import { fiveYearFixedBenchmarks, median, spreadOverYield } from "./bondSpread.ts";
import { communityRates, type LenderBlock } from "./communityRates.ts";
import { datasetJsonLd } from "./datasetSchema.ts";
import { discountRows, postedShelfFromRows, quarterLabel, withSnapshotPostedRates } from "./discountByBank.ts";
import { publishedForecasts } from "./forecast2027.ts";
import { latestBondYield, parseBondYieldPayload } from "./marketSeries.mjs";
import { canonicalRates, diffRates, summarizeFiveYearFixed } from "./rateChanges.mjs";

const root = fileURLToPath(new URL("../..", import.meta.url));

describe("posted-rate IRD", () => {
  it("charges three months' interest when the comparison rate is above the contract", () => {
    const example = postedIrdExample({
      balance: BREAK_BALANCE,
      monthsRemaining: BREAK_MONTHS,
      contractRate: 5.39,
      originalPosted: 6.14,
      comparisonPosted: 6.15,
    });
    assert.equal(example.discount, 0.75);
    assert.equal(example.comparisonRate, 5.4);
    assert.equal(example.ird, 0);
    assert.equal(example.threeMonth, 5390);
    assert.equal(example.penalty, 5390);
    assert.equal(example.binding, "three_months");
  });

  it("keeps three months' interest when it is larger than a positive IRD", () => {
    const example = postedIrdExample({
      balance: BREAK_BALANCE,
      monthsRemaining: BREAK_MONTHS,
      contractRate: 5.34,
      originalPosted: 6.49,
      comparisonPosted: 6.14,
    });
    assert.equal(example.discount, 1.15);
    assert.equal(example.comparisonRate, 4.99);
    assert.equal(example.ird, 4200);
    assert.equal(example.threeMonth, 5340);
    assert.equal(example.penalty, 5340);
    assert.equal(example.binding, "three_months");
  });

  it("uses the IRD when the contract sits well above the comparison rate", () => {
    const example = postedIrdExample({
      balance: BREAK_BALANCE,
      monthsRemaining: BREAK_MONTHS,
      contractRate: 6,
      originalPosted: 7,
      comparisonPosted: 4,
    });
    assert.equal(example.discount, 1);
    assert.equal(example.comparisonRate, 3);
    assert.equal(example.ird, 36000);
    assert.equal(example.threeMonth, 6000);
    assert.equal(example.penalty, 36000);
    assert.equal(example.binding, "ird");
  });

  it("leaves the IRD blank when a bank has no posted shelves", () => {
    const examples = buildBreakExamples([
      {
        lender_slug: "rbc",
        lender_name: "RBC",
        term_months: 60,
        rate_type: "fixed",
        mortgage_type: "uninsured",
        rate: 5.14,
        posted_rate: null,
        raw_data: { section: "special", product: "5-Year Fixed" },
      },
    ]);
    const rbc = examples.find((example) => example.slug === "rbc");
    assert.ok(rbc);
    assert.equal(rbc.complete, false);
    assert.equal(rbc.ird, null);
    assert.equal(rbc.threeMonth, Math.round(threeMonthInterestOnBalance(BREAK_BALANCE, 5.14)));
    assert.equal(rbc.penalty, rbc.threeMonth);
  });

  it("explains the method in at least 400 words", () => {
    const words = breakExplanationWords([], "October 23, 2026");
    assert.ok(words >= 400, `explanation is ${words} words`);
  });
});

describe("bond spread", () => {
  it("takes the middle rate, and the average of the two middle rates when the count is even", () => {
    assert.equal(median([5.39, 4.9, 5.14]), 5.14);
    assert.equal(median([1, 2, 3, 4]), 2.5);
    assert.equal(median([]), null);
  });

  it("subtracts the bond yield from the mortgage rate", () => {
    assert.equal(spreadOverYield(5.14, 3.5), 1.64);
    assert.equal(spreadOverYield(4.34, 3.5), 0.84);
  });

  it("uses the lowest closed 5-year fixed and the median Big Five uninsured special", () => {
    const benchmarks = fiveYearFixedBenchmarks([
      { lender_slug: "atb", lender_name: "ATB", term_months: 60, rate_type: "fixed", rate: 4.34, mortgage_type: "insured" },
      { lender_slug: "rbc", lender_name: "RBC", term_months: 60, rate_type: "fixed", rate: 5.14, mortgage_type: "uninsured" },
      { lender_slug: "td", lender_name: "TD", term_months: 60, rate_type: "fixed", rate: 5.39, mortgage_type: "uninsured" },
      { lender_slug: "scotiabank", lender_name: "Scotiabank", term_months: 60, rate_type: "fixed", rate: 4.9, mortgage_type: "uninsured" },
      { lender_slug: "bmo", lender_name: "BMO", term_months: 60, rate_type: "fixed", rate: 5.14, mortgage_type: "uninsured" },
      { lender_slug: "cibc", lender_name: "CIBC", term_months: 60, rate_type: "fixed", rate: 5.34, mortgage_type: "uninsured" },
      { lender_slug: "rbc", lender_name: "RBC", term_months: 60, rate_type: "fixed", rate: 6.5, mortgage_type: "uninsured", raw_data: { is_open: true } },
    ]);
    assert.equal(benchmarks.lowest?.rate, 4.34);
    assert.equal(benchmarks.lowest?.lenderSlug, "atb");
    assert.equal(benchmarks.big5Median, 5.14);
    assert.equal(benchmarks.big5Quotes.length, 5);
  });

  it("reads the latest yield from a Valet payload", () => {
    const series = parseBondYieldPayload({
      seriesDetail: { "BD.CDN.5YR.DQ.YLD": { label: "5-year" } },
      observations: [
        { d: "2026-10-21", "BD.CDN.5YR.DQ.YLD": { v: "3.45" } },
        { d: "2026-10-22", "BD.CDN.5YR.DQ.YLD": { v: "3.50" } },
      ],
    });
    assert.deepEqual(latestBondYield(series), { date: "2026-10-22", yield: 3.5 });
    assert.equal(spreadOverYield(4.34, latestBondYield(series).yield), 0.84);
  });
});

describe("rate-change detection", () => {
  function row(slug: string, rate: number, posted: number | null = null) {
    return {
      lender_slug: slug,
      lender_name: slug.toUpperCase(),
      term_months: 60,
      rate_type: "fixed",
      mortgage_type: "uninsured",
      rate,
      posted_rate: posted,
      raw_data: { section: "special" },
    };
  }

  it("records a price move and ignores a product that is new", () => {
    const changes = diffRates(
      canonicalRates([row("rbc", 5), row("td", 5.1)]),
      canonicalRates([row("rbc", 4.9), row("td", 5.2), row("newbank", 4)]),
      "2026-10-23T12:00:00Z",
    );
    assert.deepEqual(
      changes.map((change) => [change.lender_slug, change.direction, change.previous, change.rate]),
      [
        ["rbc", "cut", 5, 4.9],
        ["td", "hike", 5.1, 5.2],
      ],
    );
  });

  it("does not also record a posted change that is the same number as the advertised rate", () => {
    const changes = diffRates(
      canonicalRates([row("td", 5, 5)]),
      canonicalRates([row("td", 5.1, 5.1)]),
      "2026-10-23T12:00:00Z",
    );
    assert.deepEqual(changes.map((change) => change.field), ["rate"]);
  });

  it("counts a lender by where its 5-year fixed finished, not by a cut that was reversed", () => {
    const changes = [
      { field: "rate", term_months: 60, rate_type: "fixed", date: "2026-09-23", observedAt: "2026-09-23T00:00:00Z", lender_slug: "old", lender_name: "Old", mortgage_type: "uninsured", previous: 5, rate: 4, direction: "cut" },
      { field: "rate", term_months: 60, rate_type: "fixed", date: "2026-10-01", observedAt: "2026-10-01T00:00:00Z", lender_slug: "atb", lender_name: "ATB", mortgage_type: "uninsured", previous: 4.5, rate: 4.4, direction: "cut" },
      { field: "rate", term_months: 60, rate_type: "fixed", date: "2026-10-20", observedAt: "2026-10-20T00:00:00Z", lender_slug: "atb", lender_name: "ATB", mortgage_type: "uninsured", previous: 4.4, rate: 4.8, direction: "hike" },
      { field: "rate", term_months: 60, rate_type: "fixed", date: "2026-10-10", observedAt: "2026-10-10T00:00:00Z", lender_slug: "rbc", lender_name: "RBC", mortgage_type: "insured", previous: 4.2, rate: 4.1, direction: "cut" },
    ];
    const summary = summarizeFiveYearFixed(changes, "2026-10-23");
    assert.equal(summary.from, "2026-09-24");
    assert.equal(summary.to, "2026-10-23");
    assert.equal(summary.events, 3);
    assert.equal(summary.lendersCut, 1);
    assert.equal(summary.lendersHiked, 1);
    assert.equal(summary.lendersWithCutEvent, 2);
    assert.deepEqual(summary.cutLenders, ["rbc"]);
    assert.deepEqual(summary.hikedLenders, ["atb"]);
  });
});

describe("reported discount by bank", () => {
  it("publishes only N of at least 10 with a posted rate, rounded to 0.05", () => {
    const lenders: LenderBlock[] = [
      {
        slug: "td",
        matchedN: 28,
        medianSpreadVsOwnPosted: null,
        products: [
          { termMonths: 60, rateType: "variable", n: 28, reportedMedian: 3.57, postedRate: 4.29, spreadVsPosted: 0.72, rates: [] },
          { termMonths: 60, rateType: "fixed", n: 9, reportedMedian: 4.5, postedRate: 5.5, spreadVsPosted: 1, rates: [] },
        ],
      },
      {
        slug: "scotiabank",
        matchedN: 21,
        medianSpreadVsOwnPosted: null,
        products: [
          { termMonths: 60, rateType: "variable", n: 21, reportedMedian: 3.8, postedRate: null, spreadVsPosted: null, rates: [] },
        ],
      },
    ];
    const rows = discountRows(lenders, { td: "TD", scotiabank: "Scotiabank" });
    const td = rows.find((row) => row.slug === "td");
    const scotia = rows.find((row) => row.slug === "scotiabank");
    assert.equal(td?.variable?.pointsBelow, 0.7);
    assert.equal(td?.variable?.n, 28);
    assert.equal(td?.fixed, null);
    assert.equal(scotia?.variable, null);
    assert.deepEqual(scotia?.omitted, [{ rateType: "variable", n: 21 }]);
  });

  it("uses a rate-file posted shelf when the reported file has none", () => {
    const lenders = withSnapshotPostedRates(
      [
        {
          slug: "scotiabank",
          matchedN: 21,
          medianSpreadVsOwnPosted: null,
          products: [
            {
              termMonths: 60,
              rateType: "variable",
              n: 21,
              reportedMedian: 3.55,
              postedRate: null,
              spreadVsPosted: null,
              rates: [],
            },
          ],
        },
      ],
      [
        {
          lender_slug: "scotiabank",
          term_months: 60,
          rate_type: "variable",
          mortgage_type: "uninsured",
          posted_rate: 5.95,
        },
      ],
    );
    const rows = discountRows(lenders, { scotiabank: "Scotiabank" });
    assert.equal(rows[0]?.variable?.postedRate, 5.95);
    assert.equal(rows[0]?.omitted.length, 0);
    assert.equal(lenders[0]?.products[0]?.spreadVsPosted, 2.4);
    assert.equal(
      postedShelfFromRows(
        [{ lender_slug: "td", term_months: 60, rate_type: "fixed", mortgage_type: "uninsured", posted_rate: null }],
        "td",
        "fixed",
      ),
      null,
    );
  });

  it("labels October 2026 as the fourth quarter", () => {
    assert.equal(quarterLabel("2026-10-18"), "Q4 2026");
  });

  it("does not publish a real-file cell below the sample threshold or without a posted rate", () => {
    for (const row of discountRows(communityRates.lenders, communityRates.lenderNames)) {
      for (const cell of [row.fixed, row.variable]) {
        if (!cell) continue;
        assert.ok(cell.n >= 10);
        assert.equal(typeof cell.postedRate, "number");
      }
    }
  });
});

describe("2027 forecast file", () => {
  it("keeps one cited row for each institution and leaves unstated figures blank", () => {
    const names = publishedForecasts.map((forecast) => forecast.institution);
    assert.deepEqual(names, ["RBC", "TD", "Scotiabank", "BMO", "CIBC", "Desjardins", "National Bank"]);
    const rbc = publishedForecasts.find((forecast) => forecast.institution === "RBC");
    const desjardins = publishedForecasts.find((forecast) => forecast.institution === "Desjardins");
    const scotia = publishedForecasts.find((forecast) => forecast.institution === "Scotiabank");
    assert.equal(rbc?.policyRate, 3.25);
    assert.equal(rbc?.fiveYearYield, 3.55);
    assert.equal(desjardins?.policyRate, null);
    assert.equal(desjardins?.fiveYearYield, null);
    assert.equal(scotia?.fiveYearYield, null);
    for (const forecast of publishedForecasts) {
      assert.match(forecast.url, /^https:\/\//);
      assert.ok(forecast.published.length >= 7);
    }
  });
});

describe("dataset schema", () => {
  it("names Andrew and Latest Mortgage Rates as creators", () => {
    const schema = datasetJsonLd({
      name: "Example",
      description: "Example dataset",
      url: "https://latestmortgagerates.ca/rate-data/",
      temporalCoverage: "2026-10-23",
      dateModified: "2026-10-23",
      variableMeasured: ["Prime rate"],
    });
    assert.equal(schema["@type"], "Dataset");
    assert.deepEqual(
      schema.creator.map((creator) => creator.name),
      ["Andrew", "Latest Mortgage Rates"],
    );
  });
});

describe("original-data copy", () => {
  it("does not name Reddit, RFD, RedFlagDeals, or a surname in the new pages", () => {
    const forbidden = /reddit|redflagdeals|red flag deals|\brfd\b|carrothers/i;
    const files: string[] = [];
    const walk = (dir: string) => {
      for (const name of readdirSync(dir)) {
        const full = join(dir, name);
        if (statSync(full).isDirectory()) walk(full);
        else files.push(full);
      }
    };
    walk(join(root, "src/views/data"));
    walk(join(root, "src/pages/prime-rate"));
    walk(join(root, "src/pages/mortgage-break-costs"));
    walk(join(root, "src/pages/rate-changes"));
    walk(join(root, "src/pages/mortgage-rate-forecast-2027"));
    walk(join(root, "src/pages/rate-data"));
    walk(join(root, "src/pages/reports/discount-by-bank"));
    for (const file of [
      "src/lib/breakCosts.ts",
      "src/lib/bondYieldArticle.ts",
      "src/lib/forecast2027.ts",
      "src/lib/discountByBank.ts",
      "src/lib/primeData.ts",
      "data/rate-forecasts-2027.json",
      "data/boc-announcements.json",
    ]) {
      files.push(join(root, file));
    }
    for (const file of files) {
      assert.equal(forbidden.test(readFileSync(file, "utf8")), false, file);
    }
  });
});
