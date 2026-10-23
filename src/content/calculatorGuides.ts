import { calculateCmhcPremium, minimumDownPayment } from "../lib/cmhcPremium";
import { calculateRentVsBuy } from "../lib/rentVsBuyMath";
import {
  BC_PTT_FTHB_FULL_PROGRAM_FMV,
  BC_PTT_FTHB_MAX_EXEMPTION,
  BC_PTT_FTHB_PHASE_OUT_END_FMV,
  calculateBcFthbExemption,
  calculateBcPropertyTransferTax,
  calculateBcPttPayableAfterFthb,
  calculateMonthlyPayment,
} from "../lib/mortgageMath";
import { OSFI_MQR_BACKGROUNDER_URL, STRAIGHT_SWITCH_STRESS_TEST } from "./osfiStressTest";

export interface GuideSection {
  heading: string;
  paragraphs: string[];
}

export interface GuideFaq {
  question: string;
  answer: string;
}

function cad(amount: number): string {
  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

function pct(rate: number, digits = 2): string {
  return `${rate.toFixed(digits)}%`;
}

/** Ontario land transfer tax brackets used by the closing-costs and land-transfer calculators. */
export function calculateOntarioLandTransferTax(price: number): number {
  if (price <= 0) return 0;
  if (price <= 55_000) return price * 0.005;
  if (price <= 250_000) return 55_000 * 0.005 + (price - 55_000) * 0.01;
  if (price <= 400_000) return 55_000 * 0.005 + 195_000 * 0.01 + (price - 250_000) * 0.015;
  if (price <= 2_000_000) {
    return 55_000 * 0.005 + 195_000 * 0.01 + 150_000 * 0.015 + (price - 400_000) * 0.02;
  }
  return (
    55_000 * 0.005 +
    195_000 * 0.01 +
    150_000 * 0.015 +
    1_600_000 * 0.02 +
    (price - 2_000_000) * 0.025
  );
}

export const ONTARIO_FTB_MAX_REBATE = 4_000;
export const TORONTO_MLTT_MAX_REBATE = 4_475;

function roundPayment(principal: number, annualRate: number, years: number): number {
  return Math.round(calculateMonthlyPayment(principal, annualRate, years));
}

export interface StressExample {
  mortgage: number;
  amortizationYears: number;
  contractRate: number;
  floor: number;
  qualifyingRate: number;
  contractPayment: number;
  qualifyingPayment: number;
  propertyTax: number;
  heating: number;
  otherDebts: number;
  grossIncome: number;
  gds: number;
  tds: number;
  qualifies: boolean;
}

/** Illustration only — the contract rate is an example, not a scraped lender quote. */
export function stressTestExample(): StressExample {
  const mortgage = 480_000;
  const amortizationYears = 25;
  const contractRate = 4.5;
  const floor = 5.25;
  const qualifyingRate = Math.max(floor, contractRate + 2);
  const contractPayment = roundPayment(mortgage, contractRate, amortizationYears);
  const qualifyingPayment = roundPayment(mortgage, qualifyingRate, amortizationYears);
  const propertyTax = 350;
  const heating = 150;
  const otherDebts = 400;
  const grossIncome = 145_000;
  const monthlyIncome = grossIncome / 12;
  const housing = qualifyingPayment + propertyTax + heating;
  const gds = Math.round((housing / monthlyIncome) * 1000) / 10;
  const tds = Math.round(((housing + otherDebts) / monthlyIncome) * 1000) / 10;
  return {
    mortgage,
    amortizationYears,
    contractRate,
    floor,
    qualifyingRate,
    contractPayment,
    qualifyingPayment,
    propertyTax,
    heating,
    otherDebts,
    grossIncome,
    gds,
    tds,
    qualifies: gds <= 39 && tds <= 44,
  };
}

export function guideWordCount(sections: GuideSection[]): number {
  const text = sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function stressTestGuide(): GuideSection[] {
  const example = stressTestExample();
  const pass = example.qualifies ? "passes" : "fails";
  return [
    {
      heading: "How the mortgage stress test works in Canada",
      paragraphs: [
        "Canada’s mortgage stress test checks whether you could still carry the loan if the interest rate were higher than the one on your offer. You make your payments at the contract rate. The higher rate is used only to calculate the payment that goes into your gross debt service (GDS) and total debt service (TDS) ratios.",
        "Federally regulated lenders — the big banks, most other Schedule I banks, and federally regulated trust and loan companies — must apply this test to new mortgages and to refinances. Insured mortgages (generally less than 20% down, covered by CMHC, Sagen, or Canada Guaranty) follow the same qualifying-rate idea through the insurer rules, even when the lender itself is not regulated by OSFI.",
        "Two ratios do the work. GDS is housing costs divided by gross monthly income. This calculator counts the qualifying mortgage payment, property tax, heating, and the full condo fee. Many lender worksheets count only half of condo fees, so a condo can look slightly harder here than on a bank form. TDS adds other monthly obligations: car loans, student loans, lines of credit, and credit-card minimums. The caps in this tool are 39% GDS and 44% TDS, which match the common insured-mortgage guidelines. Uninsured files at a bank are still stress-tested; the exact ratio ceiling is that lender’s policy and is often in the same neighbourhood.",
        `Staying with your current lender at renewal usually does not require a new stress test. ${STRAIGHT_SWITCH_STRESS_TEST} <a href="${OSFI_MQR_BACKGROUNDER_URL}">OSFI’s November 21, 2024 backgrounder</a> states the exemption.`,
      ],
    },
    {
      heading: "The current qualifying-rate rule",
      paragraphs: [
        `The qualifying rate in this calculator is the greater of your contract rate plus 2 percentage points, or ${pct(example.floor)}. That is the minimum qualifying rate (often called the stress test or, informally, the pressure test) that has applied to both insured and uninsured mortgages since the June 2021 change by the Department of Finance and OSFI. It is not the Bank of Canada overnight rate, and it is not your lender’s prime rate. Prime moves when the overnight rate moves; the ${pct(example.floor)} floor does not.`,
        `A contract rate of ${pct(example.contractRate)} is tested at ${pct(example.qualifyingRate)}, because ${pct(example.contractRate)} + 2 is ${pct(example.qualifyingRate)}, which is above the ${pct(example.floor)} floor. A contract rate of 3.10% is tested at ${pct(example.floor)}, because 3.10% + 2 is only 5.10%, and the floor is higher. Variable-rate borrowers are tested the same way: the discount to prime does not lower the qualifying rate.`,
        "If the published benchmark later moves, lenders update the floor they use. This page’s calculator is built with a 5.25% floor. Treat a result that sits within a point or two of 39% or 44% as a warning to confirm income treatment (overtime, bonus, self-employment) with the lender before you waive conditions.",
      ],
    },
    {
      heading: "Worked example with real numbers",
      paragraphs: [
        `This example uses the same monthly payment formula as the calculator above. The ${pct(example.contractRate)} contract rate is an illustration, not a rate from today’s lender scrape.`,
        `Mortgage ${cad(example.mortgage)}, amortized over ${example.amortizationYears} years. At the contract rate the payment would be about ${cad(example.contractPayment)} a month. The qualifying rate is ${pct(example.qualifyingRate)}, so the payment used for GDS and TDS is about ${cad(example.qualifyingPayment)} a month. Add property tax of ${cad(example.propertyTax)} and heating of ${cad(example.heating)}. Housing costs for the test are ${cad(example.qualifyingPayment + example.propertyTax + example.heating)}.`,
        `Gross household income is ${cad(example.grossIncome)} a year, or ${cad(Math.round(example.grossIncome / 12))} a month. Other debts are ${cad(example.otherDebts)} a month. GDS is ${example.gds.toFixed(1)}% and TDS is ${example.tds.toFixed(1)}%. Against the 39% and 44% caps used here, this file ${pass}. Changing the down payment, the price, or the other debts moves the ratios; the contract payment itself does not, because the test ignores it.`,
        "Run the same inputs in the form above if you want to change one assumption at a time. Then compare a real contract rate from the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> or <a href=\"/rates/variable/\">variable</a> tables instead of the 4.50% illustration.",
      ],
    },
    {
      heading: "Province notes",
      paragraphs: [
        "The qualifying-rate math is federal. No province publishes its own stress-test percentage. What changes by province is which lender has to follow OSFI, and which closing costs sit beside the mortgage.",
        "Banks such as TD, RBC, Scotiabank, BMO, CIBC, and National Bank apply the federal test on new purchases and refinances in every province they lend in. Manulife Bank is also federally regulated. Insured mortgages must meet insurer qualifying rules nationwide, including files booked at a credit union.",
        "Provincial credit unions are not OSFI-regulated. Vancity and Coast Capital in British Columbia, Meridian in Ontario, and many smaller credit unions can set their own policy on uninsured mortgages. ATB Financial is owned by the Province of Alberta and is in the same position: insured files still face the insurer test; uninsured files follow ATB’s own rules. Ask which qualifying rate they will actually use, and use this calculator as the conservative check.",
        "Quebec purchases still use the federal test at a bank, and the welcome tax (droits de mutation) is a closing cost rather than a qualification rule. Alberta and Saskatchewan have no provincial land transfer tax, which lowers cash to close but does not change GDS. Ontario and Toronto transfer taxes, and B.C. property transfer tax, belong in the <a href=\"/tools/closing-costs-calculator/\">closing costs calculator</a> and the <a href=\"/tools/land-transfer-tax-calculator/\">land transfer tax calculator</a>, not in the stress-test rate.",
      ],
    },
  ];
}

export const stressTestExtraFaqs: GuideFaq[] = [
  {
    question: "What are the mortgage stress test rules in Canada?",
    answer:
      `For a new mortgage or refinance at a federally regulated lender, you qualify at the greater of your contract rate plus 2 percentage points or 5.25%. Insured mortgages use that same minimum qualifying rate through CMHC, Sagen, or Canada Guaranty. The payment at that rate, plus property tax, heating, and condo fees, must fit GDS, and other debts must fit TDS. This tool uses 39% GDS and 44% TDS. Renewing with the same lender usually skips a new test. ${STRAIGHT_SWITCH_STRESS_TEST} OSFI’s November 21, 2024 backgrounder: ${OSFI_MQR_BACKGROUNDER_URL}`,
  },
  {
    question: "What is a mortgage pressure test?",
    answer:
      "Pressure test is the everyday name for the mortgage stress test. It is the same rule: lenders qualify you at a higher rate than the contract rate so the loan still fits your income if rates rise. You do not pay the pressure-test rate. You pay the contract rate. The higher rate is only for the GDS and TDS calculation.",
  },
  {
    question: "Does the stress test change by province?",
    answer:
      "The qualifying rate itself does not. Banks apply the federal rule in every province. Provincial credit unions and ATB can use a different test on uninsured mortgages. Insured mortgages follow insurer rules in every province. Land transfer tax and legal fees differ by province, but they are closing costs, not part of the qualifying rate.",
  },
];

export interface ClosingExample {
  price: number;
  ontarioTax: number;
  ontarioRebate: number;
  ontarioNet: number;
  bcTax: number;
  bcExemption: number;
  bcNet: number;
}

export function closingCostExample(): ClosingExample {
  const price = 700_000;
  const ontarioTax = Math.round(calculateOntarioLandTransferTax(price));
  const ontarioRebate = Math.min(ONTARIO_FTB_MAX_REBATE, ontarioTax);
  const bcTax = Math.round(calculateBcPropertyTransferTax(price));
  const bcExemption = Math.round(calculateBcFthbExemption(price));
  const bcNet = Math.round(calculateBcPttPayableAfterFthb(price));
  return {
    price,
    ontarioTax,
    ontarioRebate,
    ontarioNet: ontarioTax - ontarioRebate,
    bcTax,
    bcExemption,
    bcNet,
  };
}

export function closingCostsGuide(): GuideSection[] {
  const example = closingCostExample();
  const fullProgram = BC_PTT_FTHB_FULL_PROGRAM_FMV.toLocaleString("en-CA");
  const phaseOut = BC_PTT_FTHB_PHASE_OUT_END_FMV.toLocaleString("en-CA");
  const maxExempt = BC_PTT_FTHB_MAX_EXEMPTION.toLocaleString("en-CA");
  return [
    {
      heading: "How closing costs work in Canada",
      paragraphs: [
        "Closing costs are the cash you need on top of the down payment so title can transfer. The down payment becomes equity and reduces the mortgage. Closing costs are mostly taxes and professional fees, and they are due in cash. Mortgage default insurance, when your down payment is under 20%, is usually added to the mortgage rather than paid as a lump sum; provincial sales tax on that premium can still be a cash item, depending on the province. Land transfer tax cannot be rolled into the mortgage.",
        "The large swing from one city to another is the transfer tax: Ontario land transfer tax, Toronto’s municipal land transfer tax on top of that, British Columbia’s property transfer tax, Quebec’s welcome tax, or a municipal deed-transfer tax in Nova Scotia. Alberta and Saskatchewan do not charge a provincial land transfer tax. Everywhere, you still pay a lawyer or notary, and you should budget a home inspection, an appraisal if the lender orders one, title insurance, and a property-tax adjustment on the statement of adjustments.",
        "A planning range of about 1.5% to 4% of the price, excluding the down payment, is a useful first pass. It is not a quote. A $500,000 purchase can be near the bottom of that range in Calgary and near the top in Toronto. Use the calculator above with your province, then read the province notes below before you treat the total as final.",
      ],
    },
    {
      heading: "Worked example: the same $700,000 home in Ontario and B.C.",
      paragraphs: [
        `Take a ${cad(example.price)} purchase and an eligible first-time buyer. These figures use the same Ontario brackets and the same B.C. property-transfer functions as the calculators on this site. They leave out legal fees, title insurance, and inspection, which you add in the form above.`,
        `Ontario land transfer tax on ${cad(example.price)} is ${cad(example.ontarioTax)}. The brackets are 0.5% on the first $55,000, 1% from $55,000 to $250,000, 1.5% from $250,000 to $400,000, 2% from $400,000 to $2 million, and 2.5% above $2 million. The first-time homebuyer refund is capped at ${cad(ONTARIO_FTB_MAX_REBATE)}, which fully offsets tax only up to roughly $368,000 of price. On this example the refund is ${cad(example.ontarioRebate)}, so provincial tax still due is ${cad(example.ontarioNet)}. Outside Toronto there is no municipal land transfer tax.`,
        `If that same purchase is inside the City of Toronto, you also pay municipal land transfer tax. Eligible first-time buyers can claim a City of Toronto MLTT rebate of up to ${cad(TORONTO_MLTT_MAX_REBATE)} on top of Ontario’s ${cad(ONTARIO_FTB_MAX_REBATE)} refund (up to ${cad(ONTARIO_FTB_MAX_REBATE + TORONTO_MLTT_MAX_REBATE)} combined). The rebate does not wipe tax on a ${cad(example.price)} home. This calculator estimates the Toronto municipal portion by applying a second tax on the provincial brackets; the City’s own MLTT schedule is what your lawyer will collect, and the brackets can be updated.`,
        `British Columbia property transfer tax on a ${cad(example.price)} fair market value is ${cad(example.bcTax)}: 1% on the first $200,000 and 2% on the remainder up to $2 million (3% applies from $2 million to $3 million, and 5% above $3 million). A qualifying first-time buyer at this price is under the $${fullProgram} full-program ceiling, so the exemption is ${cad(example.bcExemption)} (the tax on the first $500,000, capped at $${maxExempt}). Net property transfer tax is ${cad(example.bcNet)}. At $${phaseOut} and above, the first-time exemption is $0.`,
      ],
    },
    {
      heading: "Province notes",
      paragraphs: [
        "Ontario: provincial land transfer tax on the brackets above, first-time refund maximum $4,000. Toronto adds MLTT and a first-time MLTT rebate of up to $4,475. Other Ontario cities, including Mississauga, Ottawa, and Hamilton, do not charge Toronto’s municipal tax.",
        `British Columbia: property transfer tax, not “land transfer tax.” First-time buyers’ exemption for registrations on or after 1 April 2024 exempts the tax on the first $500,000 of value (maximum $${maxExempt}) when fair market value is at or under $${fullProgram}, phases out before $${phaseOut}, and is gone at $${phaseOut}. The home also has to meet the program tests (residential, principal residence, size limits). Foreign-buyer additional tax in specified areas is separate and is not in this calculator.`,
        "Alberta and Saskatchewan: no provincial land transfer tax. Budget land-titles registration, legal fees, and the usual due diligence. Registration is a tariff, not a percentage this page invents.",
        "Quebec: municipalities charge transfer duties (the welcome tax). Base brackets are on the order of 0.5%, 1%, and 1.5%, and Montreal adds higher slices that a notary must confirm. There is no Ontario-style first-time refund. The calculator’s Quebec line is a planning estimate.",
        "Manitoba: provincial land transfer tax with a small exempt slice, then rising rates. No Ontario-style first-time refund. Nova Scotia: municipal deed transfer tax; this calculator uses 1.5% as a planning average because many municipalities, including Halifax, charge 1.5% — confirm the local rate. New Brunswick: 1% of the greater of price and assessed value. Newfoundland and Labrador: a registration-style fee in the calculator, not an Ontario-style bracket tax. Prince Edward Island: provincial tax, with a first-time exemption modelled as a full rebate at or below $200,000.",
        "New construction can add HST, rebates, and a different statement of adjustments. Condo purchases add a status certificate or estoppel fee. None of those replace the transfer-tax line. Confirm the statement of adjustments with your lawyer or notary before you waive conditions.",
      ],
    },
  ];
}

export interface PaymentExample {
  principal: number;
  annualRate: number;
  years: number;
  monthlyCompounded: number;
  semiAnnualCompounded: number;
}

/** Canadian fixed mortgages compound semi-annually. This site's payment calculator uses a simple monthly rate. */
export function paymentExample(): PaymentExample {
  const principal = 400_000;
  const annualRate = 4.5;
  const years = 25;
  const monthlyCompounded = roundPayment(principal, annualRate, years);
  const semi = annualRate / 100 / 2;
  const monthlyRate = Math.pow(1 + semi, 1 / 6) - 1;
  const n = years * 12;
  const factor = Math.pow(1 + monthlyRate, n);
  const semiAnnualCompounded = Math.round((principal * monthlyRate * factor) / (factor - 1));
  return { principal, annualRate, years, monthlyCompounded, semiAnnualCompounded };
}

export function mortgageCalculatorGuide(): GuideSection[] {
  const example = paymentExample();
  return [
    {
      heading: "How a Canadian mortgage payment is calculated",
      paragraphs: [
        "The payment on this page is principal and interest on the amortization, not on the term. The term (often one to five years) is how long the contract rate lasts. The amortization (often 25 years, and up to 30 years on some insured and conventional products) is how long it would take to pay the balance to zero at that payment. At renewal you keep the remaining amortization and pick a new term.",
        `Canadian fixed mortgage rates are quoted with semi-annual compounding, not monthly compounding. The equivalent monthly rate is (1 + annual rate ÷ 2) raised to the power of 1/6, minus 1. The calculator on this page uses a simpler monthly rate (annual rate ÷ 12), which is why its number can differ by a few dollars from a lender’s disclosure on the same rate. Both are shown in the example below so you can see the gap. Interest Act rules are why the semi-annual convention is the one on a standard Canadian mortgage commitment.`,
        `Example, not a live lender quote: ${cad(example.principal)} at ${pct(example.annualRate)} amortized over ${example.years} years. This page’s monthly formula gives about ${cad(example.monthlyCompounded)} a month. The semi-annual compounding convention gives about ${cad(example.semiAnnualCompounded)} a month. Use the calculator to test prepayments and payment frequency; use the lender’s disclosure for the payment you will actually sign.`,
        "Accelerated bi-weekly is half of the monthly payment, taken every two weeks, so you make the equivalent of one extra monthly payment a year. Plain bi-weekly is the monthly payment times 12, divided by 26, and does not shorten the amortization the same way. The term you choose does not change the payment formula; it changes how soon you renegotiate the rate.",
      ],
    },
    {
      heading: "Qualification and province notes",
      paragraphs: [
        "The payment you will write is based on the contract rate. Whether you are allowed to borrow that amount is based on the stress test: the greater of the contract rate plus 2 percentage points or 5.25%, then GDS and TDS. Run the <a href=\"/tools/stress-test-qualifier/\">stress test calculator</a> before you treat a payment you like as a mortgage you qualify for.",
        "The payment formula does not change by province. Closing costs do. Ontario and Toronto land transfer tax, B.C. property transfer tax, and Alberta’s lack of a transfer tax all sit outside this payment. Estimate them with the <a href=\"/tools/closing-costs-calculator/\">closing costs calculator</a>. Insured mortgages (under 20% down) add a default-insurance premium, usually onto the balance, which raises the payment slightly. Compare a contract rate from the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> table rather than a posted bank rate.",
      ],
    },
  ];
}

export const mortgageCalculatorFaqs: GuideFaq[] = [
  {
    question: "How does a Canadian mortgage payment calculator work?",
    answer:
      "It amortizes the principal over the number of years you enter, at the interest rate you enter. You pay principal and interest each period. Early payments are mostly interest. The term is when the rate resets; the amortization is the full payoff schedule. This page’s calculator uses a monthly rate (annual rate divided by 12). A lender commitment that compounds semi-annually will show a slightly different payment.",
  },
  {
    question: "Why is the calculator payment different from my lender’s quote?",
    answer:
      "Canadian mortgages compound interest semi-annually. This tool uses a simple monthly rate, so the payment can differ by a few dollars. Payment frequency, an insurance premium added to the balance, and whether the rate is the contract rate or a posted rate also change the result. Match the lender’s disclosure before you rely on a figure.",
  },
  {
    question: "Does the mortgage payment include property tax or the stress test?",
    answer:
      "No. The payment here is principal and interest only. Property tax, heating, and condo fees are housing costs for the stress test, which qualifies you at the greater of your contract rate plus 2 percentage points or 5.25%. Use the stress test calculator for that step and the closing costs calculator for cash due on closing.",
  },
];

function faqWordCount(faqs: GuideFaq[]): number {
  return guideWordCount(faqs.map((faq) => ({ heading: faq.question, paragraphs: [faq.answer] })));
}

export function explainerWordCount(sections: GuideSection[], faqs: GuideFaq[]): number {
  return guideWordCount(sections) + faqWordCount(faqs);
}

/** $600,000 home with $60,000 down: 10% down, 90% loan-to-value, 85.01–90 band. */
export function cmhcWorkedExample() {
  const price = 600_000;
  const down = 60_000;
  return { price, down, minimum: minimumDownPayment(price), ...calculateCmhcPremium(price, down) };
}

export function cmhcInsuranceGuide(): GuideSection[] {
  const example = cmhcWorkedExample();
  return [
    {
      heading: "How this CMHC insurance calculator works",
      paragraphs: [
        "Default insurance is the premium a lender requires when your down payment is under 20% and the purchase is still eligible. The premium protects the lender, not you. This page estimates it from the price and down payment you type. It does not ask a province, and it does not add provincial sales tax. Ontario, Quebec, and Saskatchewan tax the premium. That tax cannot be added to the loan, and it is not in the figure here.",
        `Loan-to-value is the mortgage divided by the price. The tool uses CMHC's traditional schedule for an amortization of 25 years or less, from 0.60% to 4.00%. At 20% down or more it says insurance is not required. A price of $1,500,000 or more is outside default insurance: the minimum down payment is 20% and the premium is zero. The tool does not add the 0.20 point surcharge CMHC charges past 25 years. The <a href="/guides/cmhc-mortgage-insurance-canada/">CMHC insurance guide</a> covers the tiers, the tax, and insured versus insurable pricing.`,
        "The premium amount is the mortgage before insurance times the band rate. That premium is added to the mortgage, which is why the loan-to-value after the premium is a bit higher than the loan-to-value you started with. You pay it back, with interest, over the amortization. It is not a cheque on closing unless you choose to pay it that way with the lender.",
      ],
    },
    {
      heading: "A worked Canadian example",
      paragraphs: [
        `Take a $${example.price.toLocaleString("en-CA")} purchase with $${example.down.toLocaleString("en-CA")} down. That is ${example.downPaymentPercent.toFixed(1)}% down. The mortgage before insurance is $${example.mortgageAmount.toLocaleString("en-CA")}. Loan-to-value is ${example.ltv.toFixed(1)}%, which lands in the 85.01% to 90% band, so the rate on this tool is ${pct(example.premiumRate)}. The premium is $${Math.round(example.premiumAmount).toLocaleString("en-CA")}. Adding it makes the total mortgage $${Math.round(example.totalMortgage).toLocaleString("en-CA")}, and the loan-to-value including the premium is ${example.newLTV.toFixed(1)}%.`,
        `The minimum down payment this tool uses on that price is $${Math.round(example.minimum).toLocaleString("en-CA")}: 5% of the first $500,000 ($25,000) plus 10% of the next $100,000 ($10,000). The same 5% then 10% schedule runs up to a price just under $1,500,000. The $60,000 down payment is above that minimum and still under 20%, so the premium applies. Put 20% down ($120,000) and the same price shows no premium. Confirm the premium, the tax, and whether the premium is added to the mortgage before you remove a condition.`,
      ],
    },
    {
      heading: "Rules that change the premium",
      paragraphs: [
        "Under 20% down from a federally regulated lender, default insurance is required when the purchase is still eligible. A 30-year amortization, a rental, or a price over the insurable cap can be ineligible even at 5% down. Insured contract rates are often lower than uninsured rates because the lender’s risk is covered. Compare that lower rate on the larger balance with a 20% down quote using the <a href=\"/tools/mortgage-calculator/\">payment calculator</a> and the <a href=\"/rates/insured/\">insured</a> and <a href=\"/rates/uninsured/\">uninsured</a> tables. The stress test still uses the greater of the contract rate plus two points or 5.25%, on the balance that includes the premium.",
      ],
    },
  ];
}

export function cmhcInsuranceFaqs(): GuideFaq[] {
  return [
    {
      question: "Why does the total mortgage go up by the premium?",
      answer:
        "The premium is added to the principal and repaid over the amortization. This tool does not add provincial sales tax.",
    },
    {
      question: "What minimum down payment does the calculator use?",
      answer:
        "Five percent of the first $500,000 and ten percent of the rest, while the price is under $1,500,000. At $1,500,000 or more the minimum is 20% and the tool does not charge a premium. The premium also stops once the down payment reaches 20%.",
    },
    {
      question: "Are these the only CMHC rates in Canada?",
      answer:
        "No. These are the bands this tool applies. Confirm the insurer’s table and any provincial sales tax on the commitment.",
    },
  ];
}

export function renewalOfferGuide(): GuideSection[] {
  return [
    {
      heading: "How the renewal offer checker calculates a verdict",
      paragraphs: [
        "The checker does not quote you a rate. You type the rate a bank already put in front of you, pick the lender, the term (one to five years), fixed or variable, and whether the mortgage is insured, uninsured, or you are not sure. The page then looks up rates self-reported by Canadian borrowers online and compares your number with that group.",
        "It prefers reports from the bank you picked, for that term and fixed or variable, when that cell has at least 10 reports. If the bank cell is smaller than 10, it uses the wider set of reports for the same term and type. If you picked insured or uninsured and that slice is still under 10, it falls back to every insured status together. If no group reaches 10, the verdict is that there are not enough reports.",
        "When the sample is large enough, your rate is placed on the ordered list. At or below the 25th percentile the label is a great offer. Above that and at or below the median, the label is fair. Above the median, the label is negotiate. A lower percentile is a lower rate. The page also shows your rate against that bank’s posted rate, the Big Five posted median, and the lowest posted rate in the snapshot, when those figures exist.",
      ],
    },
    {
      heading: "A worked example, using a made-up sample",
      paragraphs: [
        "Suppose twelve people report a five-year fixed uninsured rate from the same bank, the 25th percentile of those reports is 4.19%, and the median is 4.39%. An offer of 4.09% is at or under 4.19%, so the checker would call it a great offer. An offer of 4.29% is between the 25th percentile and the median, so the label would be fair. An offer of 4.59% is above the median, so the label would be negotiate. Those three rates illustrate the rule. They are not the medians in today’s file.",
        "Switching insured status or clearing the bank changes the group, so the same offer can change labels. Read the sample size before you treat the label as a fact about the whole market. The reports are unverified. Your credit, equity, and the day you ask still change the rate a lender will sign.",
      ],
    },
    {
      heading: "What to do with the label",
      paragraphs: [
        "A negotiate label is a reason to ask, not a promise the bank will match the median. Get the term, fixed or variable, insured status, prepayment, and penalty method in writing. Take a second quote back to the bank. The steps are on the <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a>. Reported medians are rates self-reported by Canadian borrowers online. Posted rates on the homepage are scraped from lender sites. Do not average the two. Price a switch, including any penalty, with the <a href=\"/tools/mortgage-renewal-calculator/\">renewal calculator</a> before you leave over a tenth of a point.",
      ],
    },
  ];
}

export function renewalOfferFaqs(): GuideFaq[] {
  return [
    {
      question: "What do great, fair, and negotiate mean?",
      answer:
        "Great is at or below the 25th percentile. Fair is above that and at or below the median. Negotiate is above the median. Each label needs at least 10 reports.",
    },
    {
      question: "Why does the checker say there are not enough reports?",
      answer:
        "The cutoff is 10 reports. If the bank cell and the wider market are both under 10, the offer is not scored. Try “not sure” for insured status, or use the posted tables.",
    },
    {
      question: "Is a reported median the rate I will be offered?",
      answer:
        "No. Those rates were self-reported by Canadian borrowers online. They are unverified. Confirm the contract with the lender.",
    },
  ];
}

export function rentVsBuyWorkedExample() {
  return calculateRentVsBuy({
    monthlyRent: 2200,
    homePrice: 500_000,
    downPayment: 100_000,
    interestRate: 5,
    propertyTax: 300,
    maintenance: 250,
    homeInsurance: 100,
    monthlyUtilities: 150,
    annualAppreciation: 2,
    investmentReturn: 5,
    years: 5,
  });
}

export function rentVsBuyGuide(): GuideSection[] {
  const example = rentVsBuyWorkedExample();
  const rentMonthlyCosts = 2200;
  const ownMonthly =
    example.monthlyMortgage + 300 + 250 + 100 + 150;
  return [
    {
      heading: "How the rent versus buy calculator works",
      paragraphs: [
        "The calculator compares two piles of wealth after the years you choose. The buyer’s net worth is home value minus the remaining mortgage. That equity does not subtract commission, land transfer tax, or a penalty.",
        "Renting: the down payment is treated as invested cash. Each year, rent is increased by 2.5%. If a year of owning costs more than that year’s rent, the difference is added to the investment. The investment grows at the return you enter. The renter’s net worth on the result is that investment balance. It is not reduced by the rent already paid. The break-even year uses a stricter comparison inside the loop (equity versus investment minus rent paid), so the year it names can disagree with a quick look at the two final balances. Read both numbers, and treat the winner as a worksheet, not a forecast.",
        "The mortgage payment uses a monthly rate, annual rate divided by 12, over a 25-year amortization that stays 25 years no matter how many years you compare. Canadian fixed commitments usually compound semi-annually, so a lender’s payment can differ by a few dollars. Property tax, maintenance, insurance, and utilities are added every month and do not fall as you pay principal. Put tenant insurance into the rent figure yourself if you want it in the comparison.",
      ],
    },
    {
      heading: "A worked Canadian example",
      paragraphs: [
        `A $500,000 home, $100,000 down (20%, so no default-insurance premium), a 5.00% rate, and the 25-year amortization give a principal-and-interest payment of about ${cad(example.monthlyMortgage)} a month on this tool. Add $300 property tax, $250 maintenance, $100 insurance, and $150 utilities and owning costs about ${cad(ownMonthly)} a month before appreciation. Rent starts at ${cad(rentMonthlyCosts)} a month and rises 2.5% a year. Appreciation is 2% a year. The renter’s investment return is 5%. The comparison runs for five years.`,
        `After those five years the worksheet shows a home worth about ${cad(example.homeValue)}, equity of about ${cad(example.equity)}, and a renter investment of about ${cad(example.netWorthRent)}. The buyer’s equity and the renter’s investment differ by about ${cad(example.difference)}, and the page calls the winner ${example.winner}. Rent paid over the five years totals about ${cad(example.rentTotal)}. Change the city by changing the price, the tax, and the rent. A $500,000 home is a plausible price in many Canadian markets and a low one in Toronto or Vancouver. The rate is an example, not a quote from the rate table.`,
      ],
    },
    {
      heading: "Rules and limits",
      paragraphs: [
        "The formula does not know your province, so land transfer tax and rent-control caps are outside it. Under 20% down, add the insurance premium with the <a href=\"/tools/cmhc-insurance-calculator/\">CMHC calculator</a> first. This form does not add that premium. A higher investment return favours renting. A higher appreciation rate favours buying. Selling costs are left out, so a short hold looks kinder to buying than a real move. Price a penalty with the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a>, and start the rate from the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> or <a href=\"/rates/variable/\">variable</a> table when you want a posted quote rather than an example.",
      ],
    },
  ];
}

export function rentVsBuyFaqs(): GuideFaq[] {
  return [
    {
      question: "Does this rent versus buy calculator use semi-annual compounding?",
      answer:
        "No. It divides the annual rate by 12 over 25 years. A semi-annual Canadian disclosure can differ by a few dollars a month.",
    },
    {
      question: "Why can the break-even year disagree with the two final balances?",
      answer:
        "The final renter figure is the investment account. The break-even check subtracts rent already paid. Treat the year as a rough crossing point.",
    },
    {
      question: "Does the example include default insurance or closing costs?",
      answer:
        "No. The example uses 20% down, and the formula never subtracts land transfer tax or commission.",
    },
  ];
}
