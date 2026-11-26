import assert from "node:assert/strict";
import { afterEach, describe, it } from "node:test";
import { trackEvent } from "./analytics.ts";

type GtagCall = [string, string, Record<string, string | number | boolean> | undefined];

const previousWindow = globalThis.window;

afterEach(() => {
  if (previousWindow === undefined) {
    delete (globalThis as { window?: unknown }).window;
  } else {
    globalThis.window = previousWindow;
  }
});

describe("GA4 event helper", () => {
  it("no-ops when gtag is not loaded", () => {
    (globalThis as { window?: { gtag?: unknown } }).window = {};
    assert.doesNotThrow(() => trackEvent("filter_change", { filter_type: "term", filter_value: "5-year" }));
  });

  it("no-ops when gtag is not a function", () => {
    (globalThis as { window?: { gtag?: unknown } }).window = { gtag: "loaded" };
    assert.doesNotThrow(() => trackEvent("guide_cta_click", { source: "nav" }));
  });

  it("forwards homepage events and drops empty params", () => {
    const calls: GtagCall[] = [];
    (globalThis as { window?: Window }).window = {
      gtag: ((command, name, params) => {
        calls.push([command, name, params]);
      }) as Window["gtag"],
    } as Window;

    trackEvent("show_all_rates_click", { active_term: "5-year", total_rows: 67, ignored: null });
    trackEvent("calculator_cta_click", { source: "payment_hook" });
    trackEvent("calculator_cta_click", { source: "tools_grid" });
    trackEvent("calculator_cta_click", { source: "hero" });
    trackEvent("renewal_checker_cta_click", { source: "range_bar" });
    trackEvent("rate_alert_interact", { action: "focus" });
    trackEvent("lender_table_click", {
      lender: "ATB Financial",
      term: "5-year",
      rate_type: "fixed",
      down_payment_tier: "insured",
      rate: 4.34,
      source: "hero_card",
    });
    trackEvent("history_trends_click", { destination: "trends", source: "tools_grid" });
    trackEvent("filter_change", { filter_type: "down_payment", filter_value: "insured" });
    trackEvent("filter_change", { filter_type: "rate_type", filter_value: "variable" });
    trackEvent("filter_change", { filter_type: "search", filter_value: "nesto" });

    assert.equal(calls.length, 11);
    assert.deepEqual(calls[0], ["event", "show_all_rates_click", { active_term: "5-year", total_rows: 67 }]);
    assert.equal(calls[1][2]?.source, "payment_hook");
    assert.equal(calls[2][2]?.source, "tools_grid");
    assert.equal(calls[3][2]?.source, "hero");
    assert.equal(calls[4][2]?.source, "range_bar");
    assert.equal(calls[5][2]?.action, "focus");
    assert.equal(calls[6][2]?.lender, "ATB Financial");
    assert.equal(calls[6][2]?.source, "hero_card");
    assert.equal(calls[7][2]?.destination, "trends");
  });

  it("swallows gtag exceptions", () => {
    (globalThis as { window?: Window }).window = {
      gtag: () => {
        throw new Error("blocked");
      },
    } as Window;
    assert.doesNotThrow(() => trackEvent("guide_cta_click", { source: "homepage_conversion_strip" }));
  });
});
