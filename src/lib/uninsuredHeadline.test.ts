import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { compareContext, lenderSnapshot, type MortgageRate } from "./compare.ts";
import { countsTowardUninsuredHeadline } from "./uninsuredHeadline.ts";

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
  it("treats RFA fallback rows as not true uninsured offers", () => {
    const rfa = rates.filter((rate) => rate.lender_slug === "rfa");
    assert.ok(rfa.length > 0);
    for (const rate of rfa) {
      assert.equal(rate.mortgage_type, "uninsured");
      assert.match(rate.raw_data?.source ?? "", /rfa_fallback/);
      assert.doesNotMatch(rate.raw_data?.product ?? "", /uninsured|uninsurable/i);
      assert.equal(countsTowardUninsuredHeadline(rate), false);
    }
    const atb = rates.find((rate) => rate.lender_slug === "atb" && rate.mortgage_type === "uninsured");
    assert.equal(countsTowardUninsuredHeadline(atb!), true);
  });

  it("picks ATB at 4.59% as the lowest 5-year fixed uninsured headline", () => {
    const best = lowestUninsured(60, "fixed");
    assert.equal(best?.lender_slug, "atb");
    assert.equal(best?.lender_name, "ATB Financial");
    assert.equal(best?.rate, 4.59);
    const ctx = compareContext(rates);
    assert.equal(ctx.bestFixed5Uninsured?.lender_slug, "atb");
    assert.equal(ctx.bestFixed5Uninsured?.rate, 4.59);
  });

  it("keeps RFA in the full uninsured list and on RFA's own sheet", () => {
    const labeled = rates.filter(
      (rate) => rate.term_months === 60 && rate.rate_type === "fixed" && rate.mortgage_type === "uninsured"
    );
    const rfa = labeled.find((rate) => rate.lender_slug === "rfa");
    assert.equal(rfa?.rate, 4.29);
    const sheet = lenderSnapshot(rates, "rfa");
    assert.equal(sheet.fixed5Uninsured?.rate, 4.29);
    assert.equal(sheet.fixed5Uninsured?.lender_slug, "rfa");
  });
});
