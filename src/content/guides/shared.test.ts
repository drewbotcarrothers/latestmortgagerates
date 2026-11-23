import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { fixedVsVariable } from "./fixedVsVariable.ts";
import { communityRates, formatAsOf, type WeekPoint } from "../../lib/communityRates.ts";
import {
  postedSnapshotBridge,
  scrapedSpecial,
  selectWeeklyComparison,
  weeklyComparisonSentence,
  weeksWithBothMedians,
} from "./shared.ts";

const ABSENT_ANCHOR = "2026-09-14";

const fallback = {
  lender_slug: "cibc",
  lender_name: "Canadian Imperial Bank of Commerce",
  term_months: 60,
  rate_type: "fixed",
  rate: 4.94,
  mortgage_type: "uninsured",
  posted_rate: 6.49,
  raw_data: {
    source: "cibc_fallback_2026-09-14",
    product: "5-Year Fixed Special",
    featured: true,
    last_verified: "2026-09-14",
  },
};

describe("scrapedSpecial", () => {
  it("accepts a fallback special that omitted section", () => {
    const row = scrapedSpecial("cibc", 60, "fixed", "uninsured", [fallback]);
    assert.equal(row.rate, 4.94);
    assert.equal(row.raw_data?.source, "cibc_fallback_2026-09-14");
  });

  it("accepts a fallback source when the product name does not say Special", () => {
    const row = scrapedSpecial("simplii", 60, "fixed", "uninsured", [{
      ...fallback,
      lender_slug: "simplii",
      raw_data: {
        source: "simplii_fallback_2026-09-14",
        product: "5-Year Fixed",
      },
    }]);
    assert.equal(row.rate, 4.94);
  });

  it("still matches an explicit special section", () => {
    const row = scrapedSpecial("cibc", 60, "fixed", "uninsured", [{
      ...fallback,
      raw_data: { section: "special", product: "Fixed closed", source: "cibc_live_scrape" },
    }]);
    assert.equal(row.rate, 4.94);
  });

  it("throws when no matching special row exists", () => {
    assert.throws(
      () => scrapedSpecial("cibc", 60, "fixed", "uninsured", []),
      /Rate file is missing cibc 60 fixed uninsured/,
    );
    assert.throws(
      () => scrapedSpecial("cibc", 60, "fixed", "uninsured", [{
        ...fallback,
        raw_data: { section: "posted", product: "Fixed closed", source: "cibc_live_scrape" },
      }]),
      /Rate file is missing cibc 60 fixed uninsured/,
    );
    assert.throws(
      () => scrapedSpecial("cibc", 60, "fixed", "uninsured", [{
        ...fallback,
        raw_data: {
          section: "posted",
          product: "5-Year Fixed Posted Closed",
          source: "bmo_fallback_2026-09-14",
        },
      }]),
      /Rate file is missing cibc 60 fixed uninsured/,
    );
  });

  it("reads the CIBC 5-year fixed uninsured special from the rate file", () => {
    const row = scrapedSpecial("cibc", 60, "fixed", "uninsured");
    assert.equal(typeof row.rate, "number");
    assert.ok(row.rate > 0);
  });
});

function week(
  weekStarting: string,
  fixed: { n: number; median: number | null },
  variable: { n: number; median: number | null },
): WeekPoint {
  return { weekStarting, fixed, variable };
}

describe("weekly comparison", () => {
  it("uses the earliest week with both medians when 2026-09-14 is absent", () => {
    const weeks = [
      week("2026-10-12", { n: 28, median: 4.39 }, { n: 53, median: 3.55 }),
      week("2026-09-28", { n: 17, median: 4.27 }, { n: 58, median: null }),
      week("2026-09-21", { n: 7, median: 4.34 }, { n: 39, median: 3.5 }),
      week("2026-11-02", { n: 13, median: 4.48 }, { n: 74, median: 3.9 }),
    ];
    assert.equal(weeks.some((item) => item.weekStarting === ABSENT_ANCHOR), false);

    const comparison = selectWeeklyComparison(weeks);
    assert.ok(comparison);
    assert.equal(comparison.early.weekStarting, "2026-09-21");
    assert.equal(comparison.early.fixed, 4.34);
    assert.equal(comparison.early.variableN, 39);
    assert.equal(comparison.late.weekStarting, "2026-11-02");

    const sentence = weeklyComparisonSentence(comparison);
    assert.match(sentence, /week of September 21, 2026/);
    assert.match(sentence, /week of November 2, 2026/);
    assert.match(sentence, /4\.34%/);
    assert.match(sentence, /N = 7/);
    assert.match(sentence, /variable row moves from 3\.50% to 3\.90%/);
    assert.match(sentence, /fixed row is higher in November/);
    assert.doesNotMatch(sentence, /September 14/);
    assert.doesNotMatch(sentence, /October 12/);
    assert.equal(/reddit|redflagdeals|red flag deals|\brfd\b/i.test(sentence), false);
  });

  it("omits the comparison sentence when fewer than two weeks have both medians", () => {
    const onlyOne = [
      week(ABSENT_ANCHOR, { n: 0, median: null }, { n: 0, median: null }),
      week("2026-11-16", { n: 17, median: 4.54 }, { n: 38, median: 3.89 }),
      week("2026-11-23", { n: 1, median: 5.11 }, { n: 1, median: null }),
    ];
    assert.equal(selectWeeklyComparison(onlyOne), null);
    assert.equal(weeklyComparisonSentence(null), "");
    assert.match(postedSnapshotBridge(null), /posted snapshot is read from lender pages/);
    assert.doesNotMatch(postedSnapshotBridge(null), /same story/);

    const absentAnchor = [
      week("2026-11-23", { n: 1, median: 5.11 }, { n: 1, median: null }),
    ];
    assert.equal(absentAnchor.some((item) => item.weekStarting === ABSENT_ANCHOR), false);
    assert.equal(selectWeeklyComparison(absentAnchor), null);
    assert.equal(weeklyComparisonSentence(selectWeeklyComparison(absentAnchor)), "");
    assert.equal(selectWeeklyComparison([]), null);
  });

  it("skips a week that is missing one median and ignores a duplicate start", () => {
    const weeks = [
      week("2026-10-05", { n: 16, median: 4.315 }, { n: 41, median: 3.55 }),
      week("2026-10-05", { n: 99, median: 9.99 }, { n: 99, median: 9.99 }),
      week("2026-10-12", { n: 28, median: Number.NaN }, { n: 53, median: 3.55 }),
      week("2026-10-19", { n: 18, median: 4.32 }, { n: 55, median: 3.55 }),
    ];
    const usable = weeksWithBothMedians(weeks);
    assert.deepEqual(usable.map((item) => item.weekStarting), ["2026-10-05", "2026-10-19"]);
    const comparison = selectWeeklyComparison(weeks);
    assert.ok(comparison);
    assert.equal(comparison.early.fixedN, 16);
    assert.match(weeklyComparisonSentence(comparison), /variable row is 3\.55% at both ends/);
    assert.match(postedSnapshotBridge(comparison), /tells the same story from lender pages/);
  });

  it("says when the later fixed median is lower", () => {
    const comparison = selectWeeklyComparison([
      week("2026-10-19", { n: 18, median: 4.5 }, { n: 10, median: 3.6 }),
      week("2026-10-26", { n: 23, median: 4.2 }, { n: 12, median: 3.7 }),
    ]);
    assert.ok(comparison);
    assert.match(weeklyComparisonSentence(comparison), /fixed row is lower in October/);
    assert.match(postedSnapshotBridge(comparison), /posted snapshot is read from lender pages/);
  });

  it("builds the live guide from the file without the old anchor week", () => {
    const weeks = communityRates.weekly.weeks;
    assert.equal(weeks.some((item) => item.weekStarting === ABSENT_ANCHOR), false);
    const comparison = selectWeeklyComparison(weeks);
    assert.ok(comparison);
    const usable = weeksWithBothMedians(weeks);
    assert.equal(comparison.early.weekStarting, usable[0].weekStarting);
    assert.equal(comparison.late.weekStarting, usable[usable.length - 1].weekStarting);
    assert.notEqual(comparison.early.weekStarting, ABSENT_ANCHOR);

    const section = fixedVsVariable.sections.find((item) => item.id === "file");
    assert.ok(section);
    const paragraph = section.paragraphs.join(" ");
    const sentence = weeklyComparisonSentence(comparison);
    assert.ok(paragraph.includes(sentence));
    assert.ok(paragraph.includes(formatAsOf(comparison.early.weekStarting)));
    assert.ok(paragraph.includes(formatAsOf(comparison.late.weekStarting)));
    assert.equal(paragraph.includes("September 14"), false);
    assert.equal(/reddit|redflagdeals|red flag deals|\brfd\b/i.test(paragraph), false);
  });
});
