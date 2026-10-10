import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import LenderRateOverview from "../components/LenderRateOverview.tsx";
import {
  buildRateOverview,
  labelButlerRatesInsured,
  type LenderRate,
} from "./lenderOverview.ts";
import { publishedRates } from "./publishedRates.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");
const sourceRates = JSON.parse(readFileSync(join(root, "data/rates.json"), "utf8")) as LenderRate[];

function renderOverview(rates: readonly LenderRate[]): string {
  return renderToStaticMarkup(createElement(LenderRateOverview, { rates }));
}

function byLender(rates: readonly LenderRate[]): Map<string, LenderRate[]> {
  const groups = new Map<string, LenderRate[]>();
  for (const rate of rates) {
    const slug = rate.lender_slug || "";
    const rows = groups.get(slug) ?? [];
    rows.push(rate);
    groups.set(slug, rows);
  }
  return groups;
}

describe("lender rate overview", () => {
  it("renders a non-empty overview table for every lender that has rates", () => {
    const groups = byLender(publishedRates);
    assert.ok(groups.size > 0);
    const empty: string[] = [];
    for (const [slug, rates] of groups) {
      assert.ok(rates.length > 0, slug);
      const html = renderOverview(rates);
      assert.match(html, /Rate Overview/, slug);
      const shown = html.match(/data-overview-rate="/g) ?? [];
      if (shown.length === 0) empty.push(slug);
    }
    assert.deepEqual(empty, []);
  });

  it("shows Butler rates in the insured columns", () => {
    const butler = publishedRates.filter((rate) => rate.lender_slug === "butlermortgage");
    assert.equal(butler.length, 9);
    assert.ok(butler.every((rate) => rate.mortgage_type === "insured"));

    const html = renderOverview(butler);
    assert.match(html, /Fixed Insured/);
    assert.match(html, /Variable Insured/);
    assert.doesNotMatch(html, /not stated/i);
    for (const row of butler) {
      const rate = row.rate.toFixed(2);
      assert.match(html, new RegExp(`data-overview-rate="${rate}"`));
      assert.match(html, new RegExp(`data-mortgage-type="insured"[^>]*>[\\s\\S]*?${rate}%`));
    }
    const shown = html.match(/data-overview-rate="/g) ?? [];
    assert.equal(shown.length, 9);
  });

  it("keeps a rate whose mortgage type and posted rate are missing", () => {
    const rates: LenderRate[] = [
      {
        lender_slug: "example",
        lender_name: "Example Lender",
        term_months: 36,
        rate_type: "variable",
        rate: 3.5,
        mortgage_type: null,
        posted_rate: null,
      },
    ];
    const html = renderOverview(rates);
    assert.match(html, /Variable \(not stated\)/);
    assert.match(html, /data-overview-rate="3.50"/);
    assert.match(html, /data-mortgage-type="unstated"/);
    assert.doesNotMatch(html, /line-through/);
    const row = buildRateOverview(rates)[0];
    assert.equal(row.variableUnstated?.rate, 3.5);
    assert.equal(row.variableInsured, undefined);
    assert.equal(row.variableUninsured, undefined);
  });

  it("labels unlabeled Butler rows as insured and leaves an explicit type alone", () => {
    const labeled = labelButlerRatesInsured([
      {
        lender_slug: "butlermortgage",
        term_months: 60,
        rate_type: "variable",
        rate: 3.25,
        mortgage_type: null,
        posted_rate: null,
      },
      {
        lender_slug: "butlermortgage",
        term_months: 24,
        rate_type: "fixed",
        rate: 4.14,
        mortgage_type: "uninsured",
        posted_rate: null,
      },
      {
        lender_slug: "atb",
        term_months: 60,
        rate_type: "fixed",
        rate: 4.1,
        mortgage_type: null,
        posted_rate: null,
      },
    ]);
    assert.equal(labeled[0].mortgage_type, "insured");
    assert.equal(labeled[1].mortgage_type, "uninsured");
    assert.equal(labeled[2].mortgage_type, null);
  });

  it("stores every Butler row in data/rates.json as insured", () => {
    const butler = sourceRates.filter((rate) => rate.lender_slug === "butlermortgage");
    assert.equal(butler.length, 9);
    assert.ok(butler.every((rate) => rate.mortgage_type === "insured"));
    const insured = sourceRates.filter((rate) => rate.mortgage_type === "insured");
    assert.equal(insured.filter((rate) => rate.lender_slug === "butlermortgage").length, 9);
  });
});
