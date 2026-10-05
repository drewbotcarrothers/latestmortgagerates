import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chartLenderProducts, chartProducts, communityRates, formatRate, lenderBySlug } from "./communityRates.ts";
import {
  frameRateChart,
  layoutRateLabels,
  rateLabelBox,
  rateLabelFontSize,
  type RatePointLabel,
} from "./rateChartLabels.ts";

const LAYOUT = { lineY: 52, fontSize: 12, minX: 4, maxX: 636 };

function boxesSeparated(labels: ReturnType<typeof layoutRateLabels>): boolean {
  for (let i = 0; i < labels.length; i++) {
    for (let j = i + 1; j < labels.length; j++) {
      const a = labels[i];
      const b = labels[j];
      if (a.side !== b.side || a.slot !== b.slot) continue;
      const boxA = rateLabelBox(a);
      const boxB = rateLabelBox(b);
      if (boxA.left < boxB.right && boxB.left < boxA.right) return false;
    }
  }
  return true;
}

describe("rate chart labels", () => {
  it("puts posted rates above the line and reported medians below", () => {
    const labels = layoutRateLabels(
      [
        { id: "posted", x: 200, text: "4.84%", color: "#0f172a", side: "above" },
        { id: "median", x: 200, text: "4.30%", color: "#0f766e", side: "below" },
      ],
      LAYOUT,
    );
    const posted = labels.find((label) => label.id === "posted");
    const median = labels.find((label) => label.id === "median");
    assert.ok(posted && median);
    assert.ok(posted.labelY < LAYOUT.lineY);
    assert.ok(median.labelY > LAYOUT.lineY);
    assert.equal(posted.text, "4.84%");
    assert.equal(median.text, "4.30%");
  });

  it("stacks posted labels that share the same point instead of overlapping", () => {
    const labels = layoutRateLabels(
      [
        { id: "big5", x: 320, text: "4.05%", color: "#0f172a", side: "above" },
        { id: "lowest", x: 320, text: "4.05%", color: "#c2410c", side: "above" },
        { id: "median", x: 180, text: "3.65%", color: "#0f766e", side: "below" },
      ],
      LAYOUT,
    );
    const above = labels.filter((label) => label.side === "above");
    assert.equal(above.length, 2);
    assert.notEqual(above[0].labelY, above[1].labelY);
    assert.ok(boxesSeparated(labels));
  });

  it("keeps labels inside the plot and uses a smaller font only when a side is crowded", () => {
    const crowded: RatePointLabel[] = [80, 100, 120].map((x, index) => ({
      id: `p${index}`,
      x,
      text: "4.84%",
      color: "#0f172a",
      side: "above" as const,
    }));
    const labels = layoutRateLabels(crowded, LAYOUT);
    assert.equal(labels.length, 3);
    for (const label of labels) {
      const box = rateLabelBox(label);
      assert.ok(box.left >= LAYOUT.minX - 1);
      assert.ok(box.right <= LAYOUT.maxX + 1);
    }
    assert.ok(boxesSeparated(labels));
    assert.ok(labels.every((label) => label.fontSize < 12));
  });

  it("leaves the preferred font when points have room", () => {
    const labels = layoutRateLabels(
      [
        { id: "a", x: 80, text: "3.45%", color: "#c2410c", side: "above" },
        { id: "b", x: 420, text: "4.85%", color: "#0f172a", side: "above" },
      ],
      LAYOUT,
    );
    assert.ok(labels.every((label) => label.fontSize === 12));
    assert.ok(labels.every((label) => label.slot === 0));
  });

  it("labels every point on the reported-median charts without overlap", () => {
    const products = chartProducts("30d");
    assert.ok(products.length > 0);
    const values = products.flatMap((product) =>
      [product.median, product.lowestPosted, product.big5PostedMedian].filter((value): value is number => value != null),
    );
    const domainMin = Math.floor((Math.min(...values) - 0.2) * 4) / 4;
    const domainMax = Math.ceil((Math.max(...values) + 0.2) * 4) / 4;
    const plotLeft = 42;
    const plotWidth = 556;
    const x = (value: number) => plotLeft + ((value - domainMin) / (domainMax - domainMin)) * plotWidth;

    for (const product of products) {
      const points: RatePointLabel[] = [
        product.big5PostedMedian != null
          ? { id: "big5", x: x(product.big5PostedMedian), text: formatRate(product.big5PostedMedian), color: "#0f172a", side: "above" as const }
          : null,
        product.lowestPosted != null
          ? { id: "lowest", x: x(product.lowestPosted), text: formatRate(product.lowestPosted), color: "#c2410c", side: "above" as const }
          : null,
        { id: "median", x: x(product.median), text: formatRate(product.median), color: "#0f766e", side: "below" as const },
      ].filter((point): point is RatePointLabel => point != null);

      const labels = layoutRateLabels(points, { lineY: 56, fontSize: 13, minX: 6, maxX: 634 });
      assert.equal(labels.length, points.length);
      assert.match(labels.find((label) => label.id === "median")?.text ?? "", /^\d+\.\d{2}%$/);
      assert.ok(boxesSeparated(labels));
      const frame = frameRateChart(labels, 56);
      for (const label of frame.labels) {
        assert.ok(label.labelY - label.fontSize >= 4, `${label.id} clips the top`);
        assert.ok(label.labelY + 4 <= frame.height, `${label.id} clips the bottom`);
      }
    }
  });

  it("keeps about 12px type on narrow charts and the preferred size on wide ones", () => {
    assert.equal(rateLabelFontSize(954, 640), 13);
    assert.equal(rateLabelFontSize(295, 640), 24);
    const tablet = rateLabelFontSize(400, 640);
    assert.ok(tablet > 13 && tablet < 24);
    const css = (tablet * 400) / 640;
    assert.ok(css > 11 && css < 13);
  });

  it("still separates every real point at the narrow-screen font", () => {
    const products = chartProducts("30d");
    const values = products.flatMap((product) =>
      [product.median, product.lowestPosted, product.big5PostedMedian].filter((value): value is number => value != null),
    );
    const domainMin = Math.floor((Math.min(...values) - 0.2) * 4) / 4;
    const domainMax = Math.ceil((Math.max(...values) + 0.2) * 4) / 4;
    const x = (value: number) => 42 + ((value - domainMin) / (domainMax - domainMin)) * 556;
    for (const product of products) {
      const points: RatePointLabel[] = [
        product.big5PostedMedian != null
          ? { id: "big5", x: x(product.big5PostedMedian), text: formatRate(product.big5PostedMedian), color: "#0f172a", side: "above" }
          : null,
        product.lowestPosted != null
          ? { id: "lowest", x: x(product.lowestPosted), text: formatRate(product.lowestPosted), color: "#c2410c", side: "above" }
          : null,
        { id: "median", x: x(product.median), text: formatRate(product.median), color: "#0f766e", side: "below" },
      ].filter((point): point is RatePointLabel => point != null);
      const labels = layoutRateLabels(points, { lineY: 56, fontSize: 24, minX: 6, maxX: 634 });
      assert.equal(labels.length, points.length);
      assert.ok(boxesSeparated(labels));
      assert.ok(labels.every((label) => label.fontSize === 24));
    }
  });

  it("labels every lender comparison the same way", () => {
    const lender = lenderBySlug("td");
    assert.ok(lender);
    const rows = chartLenderProducts(lender);
    assert.ok(rows.length > 0);
    for (const product of rows) {
      const posted = product.postedRate as number;
      const labels = layoutRateLabels(
        [
          { id: "posted", x: 400, text: formatRate(posted), color: "#0f172a", side: "above" },
          { id: "median", x: 220, text: formatRate(product.reportedMedian), color: "#0f766e", side: "below" },
        ],
        { lineY: 44, fontSize: 12, minX: 8, maxX: 592 },
      );
      assert.equal(labels.length, 2);
      assert.ok(labels.every((label) => /^\d+\.\d{2}%$/.test(label.text)));
      assert.ok(labels.find((label) => label.id === "posted")!.labelY < 44);
      assert.ok(labels.find((label) => label.id === "median")!.labelY > 44);
    }
    assert.ok(communityRates.lenders.length > 0);
  });
});
