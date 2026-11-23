import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";
import { glossaryTerms } from "../content/glossary.ts";
import { productLabel } from "./communityRates.ts";
import {
  INSURED_SHORT_LABEL,
  INSURED_UNINSURED_EXPLANATION,
  UNINSURED_SHORT_LABEL,
  applyShortInsuranceLabels,
  mortgageTypeShortLabel,
  productWithMortgageLabel,
} from "./mortgageTypeCopy.ts";

const root = fileURLToPath(new URL("../..", import.meta.url));

describe("insured and uninsured labels", () => {
  it("uses 20%+ for uninsured and under 20% for insured", () => {
    assert.equal(UNINSURED_SHORT_LABEL, "Uninsured (20%+ down)");
    assert.equal(INSURED_SHORT_LABEL, "Insured (<20% down)");
    assert.equal(
      INSURED_UNINSURED_EXPLANATION,
      "Uninsured mortgages are for buyers putting 20% or more down (or refinancing); insured mortgages have under 20% down and require mortgage default insurance.",
    );
    assert.equal(/>20%/.test(UNINSURED_SHORT_LABEL + INSURED_SHORT_LABEL + INSURED_UNINSURED_EXPLANATION), false);
    assert.equal(mortgageTypeShortLabel("insured"), INSURED_SHORT_LABEL);
    assert.equal(mortgageTypeShortLabel("uninsured"), UNINSURED_SHORT_LABEL);
    assert.equal(mortgageTypeShortLabel("insurable"), "Insurable");
    assert.equal(mortgageTypeShortLabel(null), "Not stated");
    assert.equal(productWithMortgageLabel("5-Year Fixed", "uninsured"), "5-Year Fixed · Uninsured (20%+ down)");
  });

  it("puts the short label on community product names", () => {
    assert.equal(
      productLabel({ termMonths: 60, rateType: "fixed", insured: "uninsured" }),
      "5-year fixed · Uninsured (20%+ down)",
    );
    assert.equal(
      productLabel({ termMonths: 60, rateType: "variable", insured: "insured" }),
      "5-year variable · Insured (<20% down)",
    );
    assert.equal(
      productLabel({ termMonths: 60, rateType: "fixed", insured: "all" }),
      "5-year fixed · all insured statuses",
    );
    assert.equal(
      productLabel({ termMonths: 60, rateType: "fixed", insured: "insurable" }),
      "5-year fixed · insurable",
    );
  });

  it("relabels table cells without touching insurable or prose", () => {
    const html = `<td class="p-3">Insured</td><td>Uninsured</td><td>Insurable</td><p>an insured quote</p>`;
    const labeled = applyShortInsuranceLabels(html);
    assert.ok(labeled.includes(`>${INSURED_SHORT_LABEL}<`));
    assert.ok(labeled.includes(`>${UNINSURED_SHORT_LABEL}<`));
    assert.match(labeled, />Insurable</);
    assert.match(labeled, /an insured quote/);
  });

  it("defines both terms in the glossary and keeps exactly 20% on the uninsured side", () => {
    const insured = glossaryTerms.find((term) => term.slug === "insured-mortgage");
    const uninsured = glossaryTerms.find((term) => term.slug === "uninsured-mortgage");
    assert.ok(insured && uninsured);
    assert.match(insured.definition, /under 20% down/);
    assert.match(uninsured.definition, /20% or more down/);
    assert.equal(/>20%/.test(insured.definition + uninsured.definition), false);
    const filters = readFileSync(join(root, "src/components/RateFilters.tsx"), "utf8");
    assert.match(filters, /INSURED_SHORT_LABEL/);
    assert.match(filters, /UNINSURED_SHORT_LABEL/);
    assert.doesNotMatch(filters, /≤20%|>20%|&gt;20%/);
  });
});
