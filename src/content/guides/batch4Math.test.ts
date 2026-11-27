import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { resolveCitedPair } from "./batch4Math.ts";

const rbcVariable = {
  lender_slug: "rbc",
  lender_name: "Royal Bank of Canada",
  term_months: 60,
  rate_type: "variable",
  rate: 4.4,
  mortgage_type: "uninsured",
  posted_rate: 4.73,
  scraped_at: "2026-11-27T10:51:00.000000",
  raw_data: { section: "special" },
};

describe("resolveCitedPair", () => {
  it("keeps a prior RBC 5-year fixed special when that row is omitted", () => {
    const pair = resolveCitedPair([rbcVariable], "rbc", "uninsured");
    assert.equal(pair.stale, true);
    assert.equal(pair.fixed, 5.14);
    assert.equal(pair.variable, 4.4);
    assert.equal(pair.scraped, "2026-11-26");
    assert.equal(pair.fixedPosted, 6.19);
  });

  it("does not mark a complete live pair stale", () => {
    const pair = resolveCitedPair([
      rbcVariable,
      {
        ...rbcVariable,
        rate_type: "fixed",
        rate: 5.2,
        posted_rate: 6.2,
        scraped_at: "2026-11-27T10:51:00.000000",
      },
    ], "rbc", "uninsured");
    assert.equal(pair.stale, false);
    assert.equal(pair.fixed, 5.2);
    assert.equal(pair.variable, 4.4);
    assert.equal(pair.scraped, "2026-11-27");
  });
});
