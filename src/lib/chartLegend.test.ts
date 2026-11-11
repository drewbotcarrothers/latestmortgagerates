import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  diamondPoints,
  dumbbellLegendItems,
  weeklyLegendItems,
  WEEKLY_DASHARRAY,
  WEEKLY_DASHED_WIDTH,
  WEEKLY_SOLID_WIDTH,
} from "./chartLegend.ts";
import { chartProducts, communityRates } from "./communityRates.ts";

describe("weekly chart legend", () => {
  it("lists only the solid medians and dashed benchmarks that the chart draws", () => {
    const items = weeklyLegendItems(communityRates.weekly.weeks, communityRates.weekly.benchmarks);
    assert.deepEqual(
      items.map((item) => ({ id: item.id, style: item.style, color: item.color, label: item.label })),
      [
        { id: "fixed-median", style: "solid", color: "#0f172a", label: "5-year fixed reported median" },
        { id: "variable-median", style: "solid", color: "#0f766e", label: "5-year variable reported median" },
        { id: "big5-fixed", style: "dashed", color: "#0f172a", label: "Big-5 5-yr fixed 4.95%" },
        { id: "lowest-fixed", style: "dashed", color: "#c2410c", label: "Lowest 5-yr fixed 4.15%" },
        { id: "big5-variable", style: "dashed", color: "#0f766e", label: "Big-5 5-yr variable 4.05%" },
        { id: "lowest-variable", style: "dashed", color: "#0e7490", label: "Lowest 5-yr variable 3.25%" },
      ],
    );
    assert.equal(WEEKLY_DASHARRAY, "5 4");
    assert.ok(WEEKLY_SOLID_WIDTH > WEEKLY_DASHED_WIDTH);
  });

  it("omits a median line and a benchmark that are not drawn", () => {
    const items = weeklyLegendItems(
      [
        { weekStarting: "2026-09-28", fixed: { n: 2, median: 4.2 }, variable: { n: 12, median: 3.5 } },
        { weekStarting: "2026-10-05", fixed: { n: 8, median: null }, variable: { n: 4, median: 3.4 } },
      ],
      {
        fixed: { big5PostedMedian: null, lowestPosted: 4.1, lowestPostedLender: "atb" },
        variable: { big5PostedMedian: 4, lowestPosted: null, lowestPostedLender: null },
      },
    );
    assert.deepEqual(
      items.map((item) => item.id),
      ["variable-median", "lowest-fixed", "big5-variable"],
    );
    assert.equal(items.find((item) => item.id === "variable-median")?.style, "solid");
    assert.equal(items.find((item) => item.id === "lowest-fixed")?.style, "dashed");
    assert.equal(items.find((item) => item.id === "lowest-fixed")?.label, "Lowest 5-yr fixed 4.10%");
    assert.equal(items.find((item) => item.id === "big5-variable")?.label, "Big-5 5-yr variable 4.00%");
  });
});

describe("posted comparison legend", () => {
  it("matches the colours, marker shapes, and series names drawn on the chart", () => {
    const items = dumbbellLegendItems(chartProducts("30d"));
    assert.deepEqual(items, [
      { id: "median", label: "Reported median", color: "#0f766e", shape: "circle" },
      { id: "lowest", label: "Lowest posted", color: "#c2410c", shape: "diamond" },
      { id: "big5", label: "Big-5 posted median", color: "#0f172a", shape: "circle" },
    ]);
    assert.equal(diamondPoints(9, 9, 7), "9,2 16,9 9,16 2,9");
  });

  it("leaves off a marker series that no row draws", () => {
    const items = dumbbellLegendItems([{ median: 4.1, lowestPosted: null, big5PostedMedian: 4.8 }]);
    assert.deepEqual(
      items.map((item) => item.id),
      ["median", "big5"],
    );
  });
});
