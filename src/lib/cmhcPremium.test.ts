import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { cmhcInsuranceFaqs, cmhcInsuranceGuide } from "../content/calculatorGuides.ts";
import {
  calculateCmhcPremium,
  INSURED_PRICE_LIMIT,
  minimumDownPayment,
  premiumRateForLtv,
} from "./cmhcPremium.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

function cents(amount: number): number {
  return Math.round(amount * 100);
}

describe("CMHC minimum down payment and insured cap", () => {
  it("charges 5% on a price up to $500,000", () => {
    assert.equal(minimumDownPayment(400_000), 20_000);
    assert.equal(minimumDownPayment(500_000), 25_000);
  });

  it("uses 5% then 10% just under $1,000,000, at $1,000,000, and just over $1,000,000", () => {
    assert.equal(cents(minimumDownPayment(999_999)), cents(25_000 + 499_999 * 0.1));
    assert.equal(minimumDownPayment(1_000_000), 75_000);
    assert.equal(cents(minimumDownPayment(1_000_001)), cents(25_000 + 500_001 * 0.1));
    const under = calculateCmhcPremium(999_999, minimumDownPayment(999_999));
    const at = calculateCmhcPremium(1_000_000, 75_000);
    const over = calculateCmhcPremium(1_000_001, minimumDownPayment(1_000_001));
    for (const result of [under, at, over]) {
      assert.equal(result.aboveInsuredCap, false);
      assert.equal(result.isRequired, true);
      assert.equal(result.premiumRate, 4);
    }
    assert.equal(at.premiumAmount, 37_000);
    assert.equal(at.ltv, 92.5);
  });

  it("keeps a price just under $1,500,000 insurable and stops at the cap", () => {
    assert.equal(INSURED_PRICE_LIMIT, 1_500_000);
    const justUnderPrice = 1_499_999;
    const justUnderDown = minimumDownPayment(justUnderPrice);
    assert.equal(cents(justUnderDown), cents(25_000 + 999_999 * 0.1));
    const justUnder = calculateCmhcPremium(justUnderPrice, justUnderDown);
    assert.equal(justUnder.aboveInsuredCap, false);
    assert.equal(justUnder.isRequired, true);
    assert.equal(justUnder.premiumRate, 4);

    const atCap = calculateCmhcPremium(1_500_000, 150_000);
    assert.equal(minimumDownPayment(1_500_000), 300_000);
    assert.equal(atCap.aboveInsuredCap, true);
    assert.equal(atCap.isRequired, false);
    assert.equal(atCap.premiumRate, 0);
    assert.equal(atCap.premiumAmount, 0);

    const overCap = calculateCmhcPremium(1_500_001, 150_000);
    assert.equal(minimumDownPayment(1_500_001), 1_500_001 * 0.2);
    assert.equal(overCap.aboveInsuredCap, true);
    assert.equal(overCap.isRequired, false);
    assert.equal(overCap.premiumAmount, 0);
  });

  it("uses CMHC's traditional 25-year bands, including the 90% boundary", () => {
    assert.equal(premiumRateForLtv(65), 0.6);
    assert.equal(premiumRateForLtv(65.01), 1.7);
    assert.equal(premiumRateForLtv(80), 2.4);
    assert.equal(premiumRateForLtv(85), 2.8);
    assert.equal(premiumRateForLtv(90), 3.1);
    assert.equal(premiumRateForLtv(90.01), 4);
    assert.equal(premiumRateForLtv(95), 4);
    assert.equal(premiumRateForLtv(95.01), 0);

    const boundary = calculateCmhcPremium(600_000, 60_000);
    assert.equal(boundary.ltv, 90);
    assert.equal(boundary.premiumRate, 3.1);
    assert.equal(boundary.premiumAmount, 16_740);
    assert.equal(boundary.isRequired, true);

    const conventional = calculateCmhcPremium(1_200_000, 240_000);
    assert.equal(conventional.isRequired, false);
    assert.equal(conventional.aboveInsuredCap, false);
    assert.ok(conventional.premiumRate > 0);
  });

  it("describes the cap and the current bands in the calculator copy", () => {
    const guide = cmhcInsuranceGuide().flatMap((section) => section.paragraphs).join(" ");
    const faqs = cmhcInsuranceFaqs().map((faq) => faq.answer).join(" ");
    const copy = `${guide} ${faqs}`;
    assert.match(copy, /\$1,500,000/);
    assert.doesNotMatch(copy, /above \$1,000,000/);
    assert.doesNotMatch(copy, /Manitoba/);
    assert.match(copy, /Saskatchewan/);
    const ui = readFileSync(join(root, "src/components/CMHCCalculator.tsx"), "utf8");
    assert.match(ui, /1,500,000/);
    assert.doesNotMatch(ui, /6\.75/);
    assert.doesNotMatch(ui, /5\.65/);
  });
});
