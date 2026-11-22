import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { scrapedSpecial } from "./shared.ts";

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
