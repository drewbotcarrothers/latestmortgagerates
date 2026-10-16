import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { compareContext, lenderSnapshot, type MortgageRate } from "./compare.ts";
import { countsTowardUninsuredHeadline, rfaRowIsUnconfirmed } from "./uninsuredHeadline.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const rates = JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")) as (MortgageRate & {
  raw_data?: { source?: string; product?: string };
})[];

function lowestUninsured(termMonths: number, rateType: string) {
  return rates
    .filter(
      (rate) =>
        rate.term_months === termMonths &&
        rate.rate_type === rateType &&
        countsTowardUninsuredHeadline(rate)
    )
    .sort((a, b) => a.rate - b.rate)[0];
}

describe("lowest uninsured headlines", () => {
  it("drops unconfirmed RFA rows and keeps other uninsured rows", () => {
    const rfa = rates.filter((rate) => rate.lender_slug === "rfa");
    assert.ok(rfa.length > 0);
    for (const rate of rfa) {
      const counts = rate.mortgage_type === "uninsured" && !rfaRowIsUnconfirmed(rate);
      assert.equal(countsTowardUninsuredHeadline(rate), counts);
    }
    const confirmedUninsured = rates.filter(
      (rate) => rate.mortgage_type === "uninsured" && !rfaRowIsUnconfirmed(rate),
    );
    assert.ok(confirmedUninsured.length > 0);
    assert.ok(confirmedUninsured.every((rate) => countsTowardUninsuredHeadline(rate)));
  });

  it("picks the lowest confirmed 5-year fixed uninsured rate", () => {
    const best = lowestUninsured(60, "fixed");
    assert.ok(best);
    assert.equal(countsTowardUninsuredHeadline(best), true);
    assert.equal(best.mortgage_type, "uninsured");
    assert.equal(best.term_months, 60);
    assert.equal(best.rate_type, "fixed");
    const ctx = compareContext(rates);
    assert.equal(ctx.bestFixed5Uninsured?.lender_slug, best.lender_slug);
    assert.equal(ctx.bestFixed5Uninsured?.rate, best.rate);
    const cheaper = rates.filter(
      (rate) =>
        rate.term_months === 60 &&
        rate.rate_type === "fixed" &&
        countsTowardUninsuredHeadline(rate) &&
        rate.rate < best.rate,
    );
    assert.equal(cheaper.length, 0);
  });

  it("counts a live RFA uninsured row and still drops fallback or stale rows", () => {
    const live = {
      lender_slug: "rfa",
      mortgage_type: "uninsured",
      raw_data: {
        source: "rfa_live_scrape",
        last_verified: "2026-10-16",
        product: "5 Year Fixed",
      },
    };
    assert.equal(rfaRowIsUnconfirmed(live), false);
    assert.equal(countsTowardUninsuredHeadline(live), true);
    assert.equal(
      countsTowardUninsuredHeadline({ ...live, mortgage_type: "insured" }),
      false
    );
    assert.equal(
      countsTowardUninsuredHeadline({ ...live, mortgage_type: "insurable" }),
      false
    );

    const fallback = {
      lender_slug: "rfa",
      mortgage_type: "uninsured",
      raw_data: { source: "rfa_fallback_2026-09-14", last_verified: "2026-07-06", product: "5-Year Fixed" },
    };
    assert.equal(countsTowardUninsuredHeadline(fallback), false);

    const stale = {
      lender_slug: "rfa",
      mortgage_type: "uninsured",
      raw_data: { source: "rfa_cached", last_verified: "2020-01-01" },
    };
    assert.equal(countsTowardUninsuredHeadline(stale), false);

    const unlabeled = { lender_slug: "rfa", mortgage_type: "uninsured" };
    assert.equal(countsTowardUninsuredHeadline(unlabeled), false);

    assert.equal(
      countsTowardUninsuredHeadline({
        lender_slug: "atb",
        mortgage_type: "uninsured",
      }),
      true
    );
  });

  it("keeps an RFA uninsured row on RFA's own sheet at the file's rate", () => {
    const labeled = rates.filter(
      (rate) => rate.term_months === 60 && rate.rate_type === "fixed" && rate.mortgage_type === "uninsured"
    );
    const rfa = labeled.find((rate) => rate.lender_slug === "rfa");
    const sheet = lenderSnapshot(rates, "rfa");
    if (!rfa) {
      assert.equal(sheet.fixed5Uninsured, null);
      return;
    }
    assert.equal(sheet.fixed5Uninsured?.rate, rfa.rate);
    assert.equal(sheet.fixed5Uninsured?.lender_slug, "rfa");
    assert.equal(sheet.fixed5Uninsured?.lender_name, rfa.lender_name);
  });
});
