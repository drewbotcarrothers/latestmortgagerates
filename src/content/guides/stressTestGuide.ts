import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO,
  INSURED_EXAMPLE as ins,
  REPORTED,
  SOURCES,
  STRESS as s,
  cad,
  pct,
} from "./shared";

function caseParagraphs(): string[] {
  return s.cases.map((row) => {
    const verdict = row.passes
      ? "Both ratios clear the 39% and 44% ceilings in this illustration."
      : "The file misses those ceilings. The contract payment is not the payment the test uses.";
    return `At ${cad(row.income)} a year (${cad(row.income / 12)} a month), GDS is ${row.gds.toFixed(1)}% and TDS is ${row.tds.toFixed(1)}%. ${verdict} ${row.binding} is the tighter cap: about ${cad(row.maxPayment)} a month of room, or a mortgage near ${cad(row.maxMortgage)} at ${pct(s.qualifying)} over ${s.years} years with this tax and heat.`;
  });
}

export const stressTestGuide: InDepthGuide = {
  slug: "mortgage-stress-test",
  path: "/guides/mortgage-stress-test/",
  metaTitle: "Mortgage Stress Test 2026: Qualifying Rate, GDS and TDS",
  description:
    "How Canada's mortgage stress test works in 2026: the minimum qualifying rate, GDS and TDS, worked examples at three incomes, and the renewals and switches that skip it.",
  keywords:
    "mortgage stress test Canada, minimum qualifying rate, GDS TDS, OSFI B-20, insured mortgage stress test",
  cardTitle: "Mortgage stress test, explained",
  cardDescription:
    "The qualifying rate, the 39% and 44% debt ratios, worked files at three incomes, and the renewals that do not re-run the test.",
  h1: "The mortgage stress test, explained",
  dek: "You pay the contract rate. The lender qualifies you at a higher one, then checks whether housing costs and other debts fit your gross income. Here is the 2026 version of that test, with the dollars written out.",
  sourcesLine:
    "Sources: OSFI, FCAC, CMHC, the Department of Finance, the CRA, and the Income Tax Act. Lender ratio caps on an uninsured file can differ.",
  reviewedIso: GUIDE_REVIEWED_ISO,
  sections: [
    {
      id: "what",
      heading: "What the test is for",
      paragraphs: [
        "Canada's mortgage stress test asks whether the payment would still fit if the rate were higher than the one on your offer. The higher rate is used only to calculate the payment that goes into your debt ratios. The payment you actually make is the contract rate. <a href=\"" + SOURCES.fcacPrepare + "\">FCAC</a> tells borrowers that federally regulated lenders qualify them at the higher of 5.25% and the contract rate plus 2 percentage points, for insured and uninsured mortgages. A lender that is not federally regulated may use a similar test. It does not have to.",
        "The test is aimed at a shock: a lower income, a higher bill, or a higher rate at renewal. It is not the Bank of Canada overnight rate. Prime moves when that rate moves. The 5.25% floor does not. <a href=\"" + SOURCES.osfiMqr + "\">OSFI</a> sets the uninsured test for federally regulated lenders and reviews the buffer and the floor at least annually. The Minister of Finance sets the insured rule. FCAC's public guidance currently states the same greater-of test for both. In the reported-rate file dated " + REPORTED.asOf + ", the rounded 5-year fixed median is " + REPORTED.fixedMedian + " (N = " + REPORTED.fixedN + ") and the rounded 5-year variable median is " + REPORTED.variableMedian + " (N = " + REPORTED.variableN + "), insured status not stated. Those figures are self-reported by Canadian borrowers online. See <a href=\"/real-mortgage-rates/\">real mortgage rates</a>.",
      ],
    },
    {
      id: "mqr",
      heading: "When the floor binds, and when the buffer does",
      paragraphs: [
        `The qualifying rate is the greater of the two numbers. The floor binds only when the contract rate plus 2 points is still below 5.25%, which means a contract rate under ${pct(s.floorBindsBelow)}. At the rounded reported 5-year fixed median of ${pct(s.contract)}, the qualifying rate is ${pct(s.contract)} + 2 = ${pct(s.qualifying)}. The floor does nothing in that file. At the rounded reported 5-year variable median of ${pct(s.variableContract)}, the qualifying rate is ${pct(s.variableQualifying)}, which is also above the floor. A contract at ${pct(s.lowContract)} qualifies at ${pct(s.lowQualifying)}, because ${pct(s.lowContract + 2)} loses to the floor. In 2026, with reported five-year rates in the file above that line, most new fixed and variable contracts are qualified on contract-plus-two, not on 5.25%.`,
        `The <a href="/tools/stress-test-qualifier/">stress test qualifier</a> on this site uses that same greater-of rule and a 5.25% floor. Payments in the examples below use the site's formula, annual rate divided by 12, which is what the <a href="/tools/mortgage-calculator/">mortgage calculator</a> uses. A lender disclosure usually compounds semi-annually, so the payment can differ by a few dollars. Ratios are the point of the example.`,
      ],
    },
    {
      id: "ratios",
      heading: "GDS and TDS",
      paragraphs: [
        "Two ratios do the rest of the work. Gross debt service (GDS) is housing cost divided by gross income. Total debt service (TDS) adds the other debts. <a href=\"" + SOURCES.cmhcQualify + "\">CMHC's homeowner insurance requirements</a> cap GDS at 39% of gross household income and TDS at 44%. Housing cost for that test is principal and interest at the qualifying rate, property tax, heat, any site lease, and 50% of condominium fees. <a href=\"" + SOURCES.cmhcGds + "\">CMHC's GDS and TDS note</a> says the same 39 and 44, and it says the payment includes the insurance premium in the loan. Heat should be the real bill when you have one, and a reasonable estimate when you do not.",
        "FCAC uses 39% and 44% as the figures to stay under, and notes a lender may still approve a file slightly over. On an uninsured bank mortgage, OSFI requires the qualifying rate. It does not publish 39 and 44 as a universal cap. The bank's own policy is the cap. The qualifier on this site counts the full condominium fee, not the half CMHC counts, so a condo can look slightly harder on the tool. Child support, a car lease, a student loan, and a credit-card minimum count as debt. A line of credit is counted at the required payment.",
      ],
    },
    {
      id: "worked",
      heading: "The same mortgage at three incomes",
      paragraphs: [
        `One mortgage, three households. Price is already decided: a ${cad(s.mortgage)} loan, ${s.years}-year amortization, no condo fee. Contract rate ${pct(s.contract)}, the rounded reported 5-year fixed median, used here as the offer. Qualifying rate ${pct(s.qualifying)}. Property tax ${cad(s.tax)} a month. Heat ${cad(s.heat)} a month. Other debts ${cad(s.other)} a month, a car payment in this story. The qualifying payment is ${cad(s.cases[0].payment)}. The payment you would actually make, at ${pct(s.contract)}, is ${cad(s.cases[0].contractPayment)}. The test ignores that second number.`,
        ...caseParagraphs(),
        `The household at ${cad(s.cases[1].income)} is the instructive one: the contract payment looks manageable, and the qualifying payment still misses the ceilings. The household at ${cad(s.cases[2].income)} clears both. A co-borrower's gross income counts when that person is on the application. A raise that has not started does not.`,
        `Drop the contract to ${pct(s.lowContract)} on the ${cad(s.cases[1].income)} household and the floor binds. The qualifying rate is ${pct(s.lowQualifying)}, not ${pct(s.lowContract + 2)}. The qualifying payment is ${cad(s.lowPayment)}. GDS is ${s.lowGds.toFixed(1)}% and TDS is ${s.lowTds.toFixed(1)}%. ${s.lowPasses ? "Those ratios clear 39 and 44." : "Those ratios still miss 39 and 44."} A slightly lower contract rate will not rescue a file that fails by a wide margin, because the floor catches the qualifying rate. A larger down payment, a cheaper house, or a smaller car payment will.`,
      ],
    },
    {
      id: "insured",
      heading: "Down payment, the insured cap, and 30-year amortizations",
      paragraphs: [
        `Default insurance is what lets a federally regulated lender fund a mortgage with less than 20% down. <a href="${SOURCES.cmhcQualify}">CMHC</a> requires the purchase price or lending value of a homeowner loan to be below $1,500,000. At $1,500,000 or above, the loan is not insurable and the down payment is at least 20%. Small rental loans stay below $1,000,000 on that same page. The <a href="${SOURCES.financeReforms}">Department of Finance announcement of September 16, 2024</a> is the decision that raised the insured cap from $1 million to $1.5 million, effective December 15, 2024. The minimum down payment is 5% on the first $500,000 and 10% on the rest.`,
        `Worked down payment on a ${cad(ins.price)} home. Five percent of $500,000 is $25,000. Ten percent of the remaining ${cad(ins.price - 500_000)} is ${cad(ins.down - 25_000)}. Minimum down payment ${cad(ins.down)}, which is ${(ins.down / ins.price * 100).toFixed(2)}% of the price, not 5%. The loan before insurance is ${cad(ins.base)}, loan-to-value ${ins.ltv.toFixed(2)}%. That sits in CMHC's 90.01% to 95% band. <a href="${SOURCES.cmhcPremiums}">CMHC's premium schedule</a> charges 4.00% of the loan on that band for a traditional down payment, or ${cad(ins.premium)}. Added to the mortgage, the balance is ${cad(ins.total)}. You repay the premium, with interest, over the amortization. Ontario, Quebec, and Saskatchewan charge provincial sales tax on the premium, and CMHC says that tax cannot be added to the loan. A non-traditional down payment, such as borrowed funds, is 4.50% in that same high-ratio band.`,
        `Insured 30-year amortizations are for first-time buyers and for buyers of new builds, effective December 15, 2024. That widened an August 1, 2024 rule limited to first-time buyers of new builds. A repeat buyer of a resale home stays at 25 years if the mortgage is insured. <a href="${SOURCES.cmhcPremiumCalculator}">CMHC's calculator</a> says the same. An amortization beyond 25 years adds 0.20 points to the premium. On the example, 4.20% is ${cad(ins.surchargePremium)} and a balance of ${cad(ins.surchargeTotal)}. The longer amortization lowers the GDS payment. The surcharge raises the balance. Uninsured mortgages, 20% down or more, are outside this program. Lenders commonly offer 30 years on those files. The stress test still applies to a new uninsured loan at a federally regulated lender.`,
        "The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> uses those traditional 25-year bands and treats a price of $1,500,000 or more as outside default insurance. It does not add the 0.20 point surcharge or provincial sales tax. The <a href=\"/guides/cmhc-mortgage-insurance-canada/\">CMHC insurance guide</a> is the longer walk-through. Compare contract rates on the <a href=\"/rates/insured/\">insured</a> and <a href=\"/rates/uninsured/\">uninsured</a> pages. Closing costs are not in GDS. CMHC suggests planning for about 1.5% to 4% of the price. The <a href=\"/tools/closing-costs-calculator/\">closing costs</a> and <a href=\"/tools/land-transfer-tax-calculator/\">land transfer tax</a> calculators cover that cash.",
      ],
    },
    {
      id: "fhsa",
      heading: "FHSA room, and what it does not change",
      paragraphs: [
        `A First Home Savings Account can fund the down payment. It does not change the qualifying rate. <a href="${SOURCES.fhsa}">The CRA</a> describes the FHSA as a registered plan for a first-time buyer. In the year you open your first one, participation room is $8,000. Contributions and transfers from an RRSP share that room. A transfer is not deductible a second time. The lifetime limit is $40,000. Unused room carries forward, and the carryforward is capped so that a later year can be as high as $16,000 if you contributed nothing the year before. Five years of the full $8,000 uses up the lifetime limit. Income inside the account does not consume room. A qualifying withdrawal to buy or build a first home is not taxed and is not repaid.`,
        `The <a href="${SOURCES.fhsaAct}">Income Tax Act, section 146.6</a>, ends the maximum participation period at the end of the year after the earliest of the 14th anniversary of opening, the year you turn 70, or the first qualifying withdrawal. Check the date in your CRA account. The <a href="${SOURCES.fhsaRoom}">participation-room page</a> warns that two accounts do not double the $8,000. Forty thousand dollars from an FHSA can change the insurance band or clear 20% down. It does not change the qualifying rate, and it is not income. The Home Buyers' Plan, which Budget 2024 raised to $60,000, has to be repaid. An FHSA qualifying withdrawal does not.`,
      ],
    },
    {
      id: "skip",
      heading: "When the test does not apply",
      paragraphs: [
        `A renewal that stays with your current lender, with the same balance and no longer amortization, is not a new loan. Lenders generally do not run the minimum qualifying rate again. Since November 21, 2024, OSFI also does not require the set minimum qualifying rate on an uninsured straight switch to a different federally regulated lender at renewal, if the loan amount and the amortization do not increase. <a href="${SOURCES.osfiSwitch}">The backgrounder</a> is explicit. Insured borrowers can switch lenders at renewal without another stress test under the Canadian Mortgage Charter, as the <a href="${SOURCES.financeReforms}">Department of Finance</a> described it in September 2024. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is the page for that process.`,
        "The test comes back when you refinance, take a home-equity line of credit, increase the loan, or lengthen the amortization. FCAC lists the refinance and the home-equity line specifically. Paying a break fee by adding it to the new loan is new money. So is rolling a car loan into the mortgage. A purchase is always new underwriting, at the qualifying rate, for a federally regulated lender.",
        "OSFI's guideline binds federally regulated lenders. A provincially regulated credit union is outside it, though an insured file still has to meet the insurer's qualifying rate. A decline at a bank is not a promise that a credit union will skip the buffer. Ask which rate they will use. The <a href=\"/guides/banks-vs-monoline-lenders-vs-credit-unions/\">lender guide</a> separates the regulators. OSFI's loan-to-income limits constrain a lender's uninsured book. They are not a ratio you calculate at the kitchen table.",
      ],
    },
    {
      id: "tools",
      heading: "Run a file before you waive a condition",
      paragraphs: [
        "Start with the <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> and the <a href=\"/tools/affordability-calculator/\">affordability calculator</a>. Use the <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a> for the payment you will actually make, and the <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> only as a cross-check against the official premium schedule. If the decision is a renewal rather than a purchase, the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> and <a href=\"/real-mortgage-rates/\">real mortgage rates</a> are the relevant pages, and the stress test often is not. Posted context is on the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> and <a href=\"/rates/variable/\">variable</a> pages. The <a href=\"/disclaimer/\">disclaimer</a> applies: a ratio on this site is not an approval.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Rules change. The figures on this page were checked against the public pages below.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a> and the <a href="${SOURCES.osfiSwitch}">November 21, 2024 backgrounder</a>.`,
        `<a href="${SOURCES.fcacPrepare}">FCAC, preparing to get a mortgage</a>. Greater of 5.25% and the contract rate plus 2%.`,
        `<a href="${SOURCES.cmhcQualify}">CMHC, homeowner requirements</a> and <a href="${SOURCES.cmhcGds}">GDS and TDS</a>. Price below $1,500,000. GDS 39%. TDS 44%.`,
        `<a href="${SOURCES.cmhcPremiums}">CMHC, premium schedule</a>. 0.60% to 4.00%, plus 0.20% past 25 years.`,
        `<a href="${SOURCES.financeReforms}">Department of Finance Canada, September 16, 2024</a>. Insured cap, 30-year eligibility, Mortgage Charter.`,
        `<a href="${SOURCES.fhsa}">CRA, FHSA</a>, <a href="${SOURCES.fhsaRoom}">participation room</a>, and <a href="${SOURCES.fhsaAct}">Income Tax Act section 146.6</a>.`,
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. The stress-test floor is not the overnight rate.`,
      ],
    },
  ],
  faqs: [
    {
      question: "What rate do I have to qualify at in 2026?",
      answer:
        "For a new mortgage at a federally regulated lender, qualify at the greater of the contract rate plus 2 percentage points and 5.25%. OSFI sets that for uninsured mortgages. FCAC states the same test for insured mortgages. You pay the contract rate. With reported five-year rates above 3.25%, contract-plus-two is the binding number.",
    },
    {
      question: "What are the GDS and TDS limits?",
      answer:
        "CMHC caps insured mortgages at 39% GDS and 44% TDS. GDS is the qualifying payment, property tax, heat, and 50% of condo fees. TDS adds other debts. An uninsured bank sets its own ratio cap and still uses OSFI's qualifying rate. This site's qualifier uses 39% and 44% and counts the full condo fee.",
    },
    {
      question: "Does the stress test apply when I renew or switch lenders?",
      answer:
        "A straight renewal with your current lender generally does not. An uninsured straight switch to another federally regulated lender, without more money and without a longer amortization, has been outside OSFI's set minimum qualifying rate since November 21, 2024. Insured switches at renewal were already covered by the Mortgage Charter. A refinance, a larger loan, a longer amortization, or a new home-equity line of credit is tested.",
    },
    {
      question: "Can I get a 30-year amortization?",
      answer:
        "On an insured mortgage, 30 years is available to first-time buyers and to buyers of new builds, under the rules that took effect December 15, 2024. A repeat buyer of a resale home is limited to 25 years if the mortgage is insured. CMHC adds 0.20 percentage points to the premium when the amortization is longer than 25 years. Uninsured mortgages are a lender's own product choice, and 30 years is commonly offered. The stress test still applies to a new uninsured loan at a bank.",
    },
    {
      question: "Does FHSA money help me pass the stress test?",
      answer:
        "It helps the down payment. A larger down payment can lower the loan, the insurance premium, and the qualifying payment. It does not change the qualifying rate, and a withdrawal is not income. The annual participation room is $8,000 in the year you open the account, the lifetime limit is $40,000, and unused room carries forward within CRA's cap. A qualifying withdrawal is tax-free. Confirm your room in your CRA account.",
    },
  ],
};
