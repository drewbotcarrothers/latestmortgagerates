import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { ESSENTIAL_MORTGAGE_TERM_SLUGS, glossaryTerms } from "../content/glossary.ts";
import {
  BC_PTT_FTHB_FULL_PROGRAM_FMV,
  BC_PTT_FTHB_PHASE_OUT_END_FMV,
  calculateBcFthbExemption,
} from "./mortgageMath.ts";
import {
  calculateOntarioLandTransferTax,
  closingCostExample,
  closingCostsGuide,
  guideWordCount,
  mortgageCalculatorFaqs,
  mortgageCalculatorGuide,
  ONTARIO_FTB_MAX_REBATE,
  paymentExample,
  stressTestExample,
  stressTestExtraFaqs,
  stressTestGuide,
  TORONTO_MLTT_MAX_REBATE,
} from "../content/calculatorGuides.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "../..");

describe("calculator explanatory content", () => {
  it("adds 600–1,000 words under the stress test and closing costs calculators", () => {
    const stressWords = guideWordCount(stressTestGuide());
    const closingWords = guideWordCount(closingCostsGuide());
    assert.ok(stressWords >= 600 && stressWords <= 1000, `stress guide is ${stressWords} words`);
    assert.ok(closingWords >= 600 && closingWords <= 1000, `closing guide is ${closingWords} words`);
    const mortgageWords = guideWordCount(mortgageCalculatorGuide());
    assert.ok(mortgageWords >= 250 && mortgageWords < 600, `mortgage guide is ${mortgageWords} words`);
  });

  it("uses the qualifying-rate rule and a payment that matches the calculator formula", () => {
    const example = stressTestExample();
    assert.equal(example.floor, 5.25);
    assert.equal(example.qualifyingRate, 6.5);
    assert.ok(example.qualifyingPayment > example.contractPayment);
    const questions = stressTestExtraFaqs.map((faq) => faq.question.toLowerCase());
    assert.ok(questions.some((question) => question.includes("stress test rules")));
    assert.ok(questions.some((question) => question.includes("pressure test")));
    const page = readFileSync(join(root, "src/views/tools/stress-test-qualifier/Page.tsx"), "utf8");
    assert.match(page, /FAQSection/);
    assert.match(page, /CalculatorGuide/);
  });

  it("keeps Ontario and B.C. first-time figures consistent with the calculators", () => {
    assert.equal(calculateOntarioLandTransferTax(700_000), 10_475);
    assert.equal(ONTARIO_FTB_MAX_REBATE, 4_000);
    assert.equal(TORONTO_MLTT_MAX_REBATE, 4_475);
    assert.equal(BC_PTT_FTHB_FULL_PROGRAM_FMV, 835_000);
    assert.equal(BC_PTT_FTHB_PHASE_OUT_END_FMV, 860_000);
    const example = closingCostExample();
    assert.equal(example.ontarioRebate, 4_000);
    assert.equal(example.bcExemption, calculateBcFthbExemption(example.price));
    assert.equal(example.bcNet, example.bcTax - example.bcExemption);
    const landPage = readFileSync(
      join(root, "src/pages/tools/land-transfer-tax-calculator/index.astro"),
      "utf8"
    );
    assert.match(landPage, /buildYear/);
    assert.match(landPage, /Ontario, Toronto & BC First-Time Buyer Rebates/);
    assert.doesNotMatch(landPage, /2026/);
    const landView = readFileSync(
      join(root, "src/views/tools/land-transfer-tax-calculator/Page.tsx"),
      "utf8"
    );
    assert.match(landView, /Ontario and Toronto first-time buyer rebates/);
    assert.match(landView, /British Columbia first-time buyer property transfer tax/);
    assert.match(landView, /BC_PTT_FTHB_FULL_PROGRAM_FMV/);
  });

  it("explains the Canadian payment with both compounding conventions", () => {
    const example = paymentExample();
    assert.ok(example.monthlyCompounded > 0);
    assert.ok(Math.abs(example.monthlyCompounded - example.semiAnnualCompounded) < 30);
    assert.notEqual(example.monthlyCompounded, example.semiAnnualCompounded);
    const page = readFileSync(join(root, "src/views/tools/mortgage-calculator/Page.tsx"), "utf8");
    assert.match(page, /FAQSection/);
    assert.ok(mortgageCalculatorFaqs.length >= 3);
  });
});

describe("glossary mortgage terms", () => {
  it("features an essential mortgage terms section and a matching title", () => {
    const page = readFileSync(join(root, "src/pages/glossary/index.astro"), "utf8");
    const view = readFileSync(join(root, "src/views/glossary/GlossaryIndex.tsx"), "utf8");
    assert.match(page, /Mortgage Terms/);
    assert.match(view, /Essential mortgage terms/);
    assert.match(view, /<h1[^>]*>\s*Mortgage Terms\s*<\/h1>/);
    const slugs = new Set(glossaryTerms.map((term) => term.slug));
    for (const slug of ESSENTIAL_MORTGAGE_TERM_SLUGS) {
      assert.ok(slugs.has(slug), slug);
    }
  });
});
