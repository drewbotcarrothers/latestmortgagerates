import type { InDepthGuide } from "./shared";
import {
  REPORTED,
  SOURCES,
  albertaRegistrationFee,
  cad,
  ontarioLandTransferTax,
} from "./shared";
import { calculateBcFthbExemption, calculateBcPropertyTransferTax } from "../../lib/mortgageMath";
import { minimumDownPayment } from "../../lib/cmhcPremium";
import { guideTable } from "./guideTable";

const REVIEWED = "2026-10-23T20:00:00Z";

const ON = "https://www.ontario.ca/document/land-transfer-tax/calculating-land-transfer-tax";
const TOR_RATES =
  "https://www.toronto.ca/services-payments/property-taxes-utilities/municipal-land-transfer-tax-mltt/municipal-land-transfer-tax-mltt-rates-and-fees/";
const BC_TAX = "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax";
const BC_EXAMPLES = "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/calculation-examples";
const BC_FOREIGN = "https://www2.gov.bc.ca/gov/content/taxes/property-taxes/property-transfer-tax/additional-property-transfer-tax";
const QC_DUTIES = "https://www.quebec.ca/gouvernement/gestion-municipale/finances-fiscalite-municipales/fiscalite/droits-mutations-immobilieres";
const MTL = "https://montreal.ca/en/articles/how-property-transfer-duties-are-calculated-9279";
const MB = "https://www.gov.mb.ca/finance/other/landtransfertax.html";
const MB_FEES = "https://teranetmanitoba.ca/land-titles/land-titles-fees/";
const SK_PDF = "https://www.saskregistries.ca/hubfs/Land-Title-Fees-Table-04-2026.pdf";
const SK_FEES = "https://www.saskregistries.ca/fees/landtitlesfees";
const NS_LIST = "https://novascotia.ca/sns/pdf/ans-property-dtt-rates.pdf";
const NS_PAGE = "https://www.novascotia.ca/municipal-deed-transfer-and-property-tax";
const HALIFAX = "https://www.halifax.ca/home-property/property-taxes/taxes-halifax";
const NB = "https://laws.gnb.ca/en/document/cs/R-2.1";
const NL = "https://www.assembly.nl.ca/legislation/sr/annualstatutes/2013/1309.chp.htm";
const PEI_RATE = "https://www.princeedwardisland.ca/en/topic/real-property-transfer-tax";
const PEI_GUIDE = "https://www.princeedwardisland.ca/sites/default/files/publications/rpttg_101.pdf";
const CMHC_COST = "https://www.cmhc-schl.gc.ca/consumers/home-buying/mortgage-loan-insurance-for-consumers/cmhc-mortgage-loan-insurance-cost";
const ON_RST = "https://www.ontario.ca/document/retail-sales-tax/insurance-and-benefits-plans";
const QC_INS = "https://www.revenuquebec.ca/en/citizens/consumption-taxes/taxable-zero-rated-or-tax-exempt-goods-and-services/tax-on-insurance-premiums/";
const QC_INS_2027 = "https://www.revenuquebec.ca/en/press-room/tax-news/details/2026-04-09/harmonization-of-the-insurance-premiums-tax-rate-with-the-qst-rate/";
const SK_PST = "https://sets.saskatchewan.ca/rptp/wcm/connect/b9fd728b-b4fc-4a9e-a59e-c542fb87d6f1/PST.073+Insurance+Contracts.pdf?MOD=AJPERES";
const CRA_RATES = "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/gst-hst-businesses/charge-collect-which-rate/calculator.html";
const NS_HST = "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/notice343/nova-scotia-hst-rate-decrease-questions-answers-transitional-rules-housing-other-real-property-situated-nova-scotia.html";
const NEW_HOUSING = "https://www.canada.ca/en/revenue-agency/services/forms-publications/publications/rc4028/gst-hst-new-housing-rebate.html";
const NS_REBATE = "https://www.novascotia.ca/apply-first-time-home-buyers-rebate-newly-built-home";

function cents(amount: number): string {
  const rounded = Math.round(amount * 100);
  const sign = rounded < 0 ? "-" : "";
  const abs = Math.abs(rounded);
  const dollars = Math.floor(abs / 100).toLocaleString("en-CA");
  const rem = abs % 100;
  return rem === 0 ? `${sign}$${dollars}` : `${sign}$${dollars}.${String(rem).padStart(2, "0")}`;
}

function slices(price: number, bands: [number, number][]): number {
  let tax = 0;
  let previous = 0;
  for (const [cap, rate] of bands) {
    const slice = Math.min(price, cap) - previous;
    if (slice > 0) tax += slice * rate;
    if (price <= cap) break;
    previous = cap;
  }
  return tax;
}

function quebecBase(price: number): number {
  return slices(price, [
    [62_900, 0.005],
    [315_000, 0.01],
    [Number.POSITIVE_INFINITY, 0.015],
  ]);
}

function montrealDuties(price: number): number {
  return slices(price, [
    [62_900, 0.005],
    [315_000, 0.01],
    [552_300, 0.015],
    [1_104_700, 0.02],
    [2_136_500, 0.025],
    [3_113_000, 0.035],
    [Number.POSITIVE_INFINITY, 0.04],
  ]);
}

/** 100% of the first $5,000 of duties plus 25% of the next $3,500, then the phase-out above $750,000. */
function quebecCredit(duties: number, basis: number): number {
  const cappedDuties = Math.min(duties, 8_500);
  const gross = cappedDuties <= 5_000 ? cappedDuties : 5_000 + 0.25 * (cappedDuties - 5_000);
  if (basis <= 750_000) return gross;
  if (basis >= 1_000_000) return 0;
  return Math.max(0, gross - 0.0235 * (basis - 750_000));
}

function manitoba(price: number): number {
  return slices(price, [
    [30_000, 0],
    [90_000, 0.005],
    [150_000, 0.01],
    [200_000, 0.015],
    [Number.POSITIVE_INFINITY, 0.02],
  ]);
}

function skTransfer(value: number): number {
  if (value <= 500) return 0;
  if (value <= 6_300) return 25;
  return value * 0.004;
}

function skMortgage(amount: number): number {
  if (amount <= 249_999.99) return 200;
  if (amount <= 500_000) return 275;
  if (amount <= 750_000) return 525;
  if (amount <= 1_000_000) return 775;
  return 1_000;
}

function nlRegistration(value: number): number {
  if (value <= 500) return 100;
  return 100 + Math.ceil((value - 500) / 100) * 0.4;
}

const p500 = 500_000;
const p800 = 800_000;
const on500 = ontarioLandTransferTax(p500);
const on800 = ontarioLandTransferTax(p800);
const onRefund = 4_000;
const torRebate = 4_475;
const bc500 = calculateBcPropertyTransferTax(p500);
const bc800 = calculateBcPropertyTransferTax(p800);
const bcEx800 = calculateBcFthbExemption(p800);
const qc500 = quebecBase(p500);
const qc800 = quebecBase(p800);
const mt500 = montrealDuties(p500);
const mt800 = montrealDuties(p800);
const mt700 = montrealDuties(700_000);
const qcCredit500 = quebecCredit(qc500, p500);
const qcCredit800 = quebecCredit(qc800, p800);
const mb500 = manitoba(p500);
const mb800 = manitoba(p800);
const abT500 = albertaRegistrationFee(p500);
const abT800 = albertaRegistrationFee(p800);
const abM500 = albertaRegistrationFee(p500 * 0.8);
const abM800 = albertaRegistrationFee(p800 * 0.8);
const skT500 = skTransfer(p500);
const skT800 = skTransfer(p800);
const skM500 = skMortgage(p500 * 0.8);
const skM800 = skMortgage(p800 * 0.8);
const hx500 = p500 * 0.015;
const hx800 = p800 * 0.015;
const nb500 = p500 * 0.01;
const nb800 = p800 * 0.01;
const pei500 = p500 * 0.01;
const pei800 = p800 * 0.01;
const nl500 = nlRegistration(p500);
const nl800 = nlRegistration(p800);
const nlM500 = nlRegistration(p500 * 0.8);
const nlM800 = nlRegistration(p800 * 0.8);
const admin = 102.56;
const adminHst = Math.round(admin * 0.13 * 100) / 100;
const taxYear = 4_800;
const daysAfterJune15 = 365 - 166;
const taxAdjustment = (taxYear * daysAfterJune15) / 365;

const loan500 = p500 - minimumDownPayment(p500);
const loan800 = p800 - minimumDownPayment(p800);
const prem500 = loan500 * 0.04;
const prem800 = loan800 * 0.04;

if (ontarioLandTransferTax(400_000) !== 4_475) throw new Error("Ontario $400,000 land transfer tax drifted from the published example.");
if (on500 !== 6_475 || on800 !== 12_475) throw new Error("Ontario worked examples drifted.");
if (bc500 !== 8_000 || bc800 !== 14_000 || bcEx800 !== 8_000) throw new Error("B.C. property transfer tax drifted from the published table.");
if (mt700 !== 9_349) throw new Error("Montreal $700,000 duties drifted from the city's 2026 example.");
if (abT500 !== 550 || abT800 !== 850) throw new Error("Alberta registration fee drifted from the October 2026 schedule.");

const provinceTable = guideTable(
  ["Where the home is", "$500,000", "$800,000", "First-time relief on that tax"],
  [
    ["Ontario, outside Toronto", cad(on500), cad(on800), `Refund up to ${cad(onRefund)}`],
    ["Toronto, both taxes", cad(on500 * 2), cad(on800 * 2), `${cad(onRefund)} provincial plus ${cad(torRebate)} municipal`],
    ["British Columbia", cad(bc500), cad(bc800), `None at $500,000; ${cad(bcEx800)} off at $800,000`],
    ["Quebec baseline", cents(qc500), cents(qc800), "Credit claimed after you pay"],
    ["Montreal", cents(mt500), cents(mt800), "Same credit; higher city bill at $800,000"],
    ["Manitoba", cad(mb500), cad(mb800), "No first-time refund"],
    ["Saskatchewan transfer", cad(skT500), cad(skT800), "No exemption"],
    ["Alberta transfer", cad(abT500), cad(abT800), "No land transfer tax"],
    ["Halifax", cad(hx500), cad(hx800), "Municipal 1.5%, not a provincial rate"],
    ["New Brunswick", cad(nb500), cad(nb800), "No first-time refund in the Act"],
    ["Prince Edward Island", cad(pei500), cad(pei800), "Waiver for an eligible buyer"],
    ["Newfoundland and Labrador", cents(nl500), cents(nl800), "Registration charge, not a rebate tax"],
  ],
);

export const closingCosts: InDepthGuide = {
  slug: "closing-costs-canada-by-province",
  path: "/guides/closing-costs-canada-by-province/",
  metaTitle: "Closing Costs in Canada by Province (2026) | Latest Mortgage Rates",
  description:
    "What a $500,000 and an $800,000 home costs to close in each province in 2026: land transfer tax, Toronto's municipal tax, first-time rebates, Alberta and Saskatchewan land-titles fees, and the GST on a new build.",
  keywords:
    "closing costs Canada by province 2026, land transfer tax Ontario Toronto, BC property transfer tax, Alberta land titles fees, first-time buyer rebate, GST new home",
  cardTitle: "Closing costs by province",
  cardDescription:
    "Land transfer tax, Toronto's municipal tax, and land-titles fees on a $500,000 and an $800,000 home, plus the rebates and the new-build GST.",
  h1: "Closing costs in Canada by province (2026)",
  dek: "The down payment is the number people memorize. The statement of adjustments is the number the lawyer or notary actually asks you to wire. Transfer taxes, not the mortgage rate, are why the same house costs more to close in Toronto than in Calgary.",
  sourcesLine:
    "Sources: provincial and municipal tax pages checked in October 2026, CMHC, and the CRA. Your statement of adjustments controls the wire.",
  reviewedIso: REVIEWED,
  howTo: {
    name: "How to budget Canadian closing costs before you waive conditions",
    description:
      "Price the transfer tax for the province and the city, then add the lawyer's quote, the insurance sales tax if the mortgage is insured, and the adjustments.",
    steps: [
      {
        name: "Pick the province and the city",
        text: "Toronto adds a municipal land transfer tax. Halifax sets its own deed transfer tax. Montreal uses higher brackets than the Quebec baseline. A provincial average hides the line that matters.",
      },
      {
        name: "Test the first-time rule that province actually uses",
        text: "Ontario looks at any home you have ever owned. British Columbia looks at a principal residence and adds a residency test. Prince Edward Island can waive the tax and claw it back if you do not occupy the home.",
      },
      {
        name: "Separate a resale from a new build",
        text: "A resale usually has no GST. A new build can have GST or HST, and the rebate depends on the price and on whether you are a first-time buyer.",
      },
      {
        name: "Replace every placeholder with a quote",
        text: "Legal fees, title insurance, an inspection, an appraisal, and the move are quotes. The tax and the land-titles fee are the lines you can calculate before those quotes arrive.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "What you pay on closing day",
      paragraphs: [
        "On a resale purchase, the cash due on closing is the down payment, the transfer tax or land-titles fee, the lawyer's or notary's bill, and the adjustments on the statement of adjustments. The tax on a $500,000 home and an $800,000 home is not the same percentage of the price, because the provinces that charge a transfer tax do it in slices, and a first-time rebate, where one exists, is a dollar cap.",
        `The mortgage rate is a different bill, paid monthly after you close. In the reported-rate file dated ${REPORTED.asOf}, the rounded 5-year fixed median where insured status was not stated is ${REPORTED.fixedMedian} (N = ${REPORTED.fixedN}) and the rounded 5-year variable median is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}). Those figures are self-reported by Canadian borrowers online. They do not change the transfer tax. Compare live shelves on the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages, and the distribution on <a href="/real-mortgage-rates/">real mortgage rates</a>. A written quote goes in the <a href="/tools/renewal-offer-checker/">renewal offer checker</a>. The payment on whatever rate you sign goes in the <a href="/tools/mortgage-calculator/">mortgage calculator</a>.`,
      ],
    },
    {
      id: "table",
      heading: "The tax or fee at $500,000 and $800,000",
      paragraphs: [
        "The table is the tax or land-titles fee on the price, for a resale, using the price as the statutory value. It leaves out the down payment, the legal bill, and mortgage registration except where a later section adds it. Price your own deal in the <a href=\"/tools/land-transfer-tax-calculator/\">land transfer tax calculator</a> and the <a href=\"/tools/closing-costs-calculator/\">closing costs calculator</a>. The closing-costs calculator uses the 2026 Quebec brackets and the Alberta and Saskatchewan schedules.",
        provinceTable,
        "Toronto's two taxes match at these prices because a one- or two-unit home under $2 million uses the same slices. They diverge above $3 million. Alberta, Saskatchewan, and Newfoundland and Labrador rows are registration charges. The mortgage is often charged again.",
      ],
    },
    {
      id: "ontario",
      heading: "Ontario, and the second tax inside Toronto",
      paragraphs: [
        `<a href="${ON}">Ontario</a>, for an agreement signed after November 14, 2016 and registered on or after January 1, 2017, charges 0.5% to $55,000, 1% to $250,000, 1.5% to $400,000, 2% above $400,000, and 2.5% above $2 million on one- or two-unit homes. HST is not in the base. The province's $400,000 example is $4,475.`,
        `Outside Toronto, ${cad(p500)} is $275 + $1,950 + $2,250 + $2,000 = ${cad(on500)}. A qualifying first-time buyer registered on or after January 1, 2017 gets up to ${cad(onRefund)} back, so ${cad(on500 - onRefund)}. You must be 18, a citizen or permanent resident, occupy within nine months, and neither you nor your spouse can ever have owned a home anywhere. The <a href="${SOURCES.ontarioLtt}">refund page</a> (updated February 10, 2026) says a four-year Home Buyers' Plan wait does not re-qualify you. At ${cad(p800)} the tax is ${cad(on800)} and the refund is still ${cad(onRefund)}, so ${cad(on800 - onRefund)}. The rest of Ontario does not pay Toronto's tax.`,
        `<a href="${TOR_RATES}">Toronto</a> has added its own tax since February 1, 2008. On a one- or two-unit home the slices match the province through $2 million, then 2.5% to $3 million. From April 1, 2026 the municipal slices above $3 million are 4.40% to $4 million, 5.45% to $5 million, 6.50% to $10 million, 7.55% to $20 million, and 8.60% above that. Other property stays at 2% above $400,000. At ${cad(p500)} the two taxes are ${cad(on500)} each, ${cad(on500 * 2)} together. The <a href="${SOURCES.torontoMltt}">municipal rebate</a> is up to ${cad(torRebate)}. A qualifying buyer pays ${cad(on500 * 2 - onRefund - torRebate)}. At ${cad(p800)} the two taxes are ${cad(on800)} each, ${cad(on800 * 2)} together, and the same two rebates leave ${cad(on800 * 2 - onRefund - torRebate)}. The administration fee is $102.56 plus 13% HST, ${cents(admin + adminHst)} together, unless the deal is fully exempt. A rebate claimed after registration costs another $221.22. Ontario's 25% non-resident speculation tax, and Toronto's extra 10% from January 1, 2025, sit outside both examples.`,
      ],
    },
    {
      id: "bc",
      heading: "British Columbia property transfer tax",
      paragraphs: [
        `<a href="${BC_TAX}">British Columbia</a> (page updated December 3, 2025) charges 1% on the first $200,000, 2% to $2 million, and 3% above $2 million. Residential value above $3 million draws a further 2%. That arithmetic is ${cad(bc500)} on ${cad(p500)} and ${cad(bc800)} on ${cad(p800)}. <a href="${BC_EXAMPLES}">The province's own examples</a> use the same slices.`,
        `From April 1, 2024, a qualifying first-time buyer pays no tax at ${cad(p500)} or less. To $835,000 the exemption is $8,000, then it falls to zero at $860,000. <a href="${SOURCES.bcPttAmounts}">At ${cad(p800)}</a> the tax is ${cad(bc800)}, the exemption is ${cad(bcEx800)}, and ${cad(bc800 - bcEx800)} is payable. You need citizenship or permanent residence, the B.C. residency test, no prior registered principal residence, and no prior use of this exemption. The home must be your principal residence, residential, and 0.5 hectares or smaller. Foreign buyers in Metro Vancouver, the Capital Regional District, the Fraser Valley, the Central Okanagan, or Nanaimo can also owe the <a href="${BC_FOREIGN}">additional 20%</a>. A separate newly built home exemption exists. Its dollar cap is on that page, not in the first-time table.`,
      ],
    },
    {
      id: "quebec",
      heading: "Quebec welcome tax, including Montreal",
      paragraphs: [
        `<a href="${QC_DUTIES}">Quebec</a> makes every municipality collect a transfer duty. For 2026 the baseline, indexed 2.3438%, is 0.5% to $62,900, 1% to $315,000, and 1.5% above that. The base is the highest of the price, the deed, and the assessment times that year's comparative factor. A municipality may go up to 3% above $500,000. Montreal may go higher.`,
        `If ${cad(p500)} is that highest figure, the baseline duty is ${cents(qc500)}. At ${cad(p800)} it is ${cents(qc800)}. <a href="${MTL}">Montreal's 2026 table</a> (comparative factor 1.00) matches the baseline until $552,300, then 2% to $1,104,700, 2.5% to $2,136,500, 3.5% to $3,113,000, and 4% above that. The city's $700,000 example is $9,349. Montreal at ${cad(p500)} is still ${cents(mt500)}. At ${cad(p800)} it is ${cents(mt800)}.`,
        `<a href="${SOURCES.quebecCredit}">Revenu Québec's</a> refundable credit, for a qualifying first home in a taxation year beginning after December 31, 2025, is 100% of the first $5,000 of duties plus 25% of the next $3,500 (maximum $5,875), then minus 2.35% of the basis above $750,000, gone at $1 million. You pay the city, then claim. The credit is ${cents(qcCredit500)} on the ${cad(p500)} baseline duty and ${cents(qcCredit800)} on the ${cad(p800)} baseline duty. The <a href="/guides/first-time-home-buyer-programs-canada/">first-time programs guide</a> stacks the FHSA and the Home Buyers' Plan, which this page does not.`,
      ],
    },
    {
      id: "prairies",
      heading: "Alberta and Saskatchewan register title instead",
      paragraphs: [
        `Alberta does not charge a land transfer tax. <a href="${SOURCES.albertaFees}">Land Titles</a>, for documents received on or after October 1, 2026, charges $50 plus $5 for each $5,000 or part of $5,000 of value, on a transfer of land and again on a mortgage. A ${cad(p500)} transfer is $50 + (100 × $5) = ${cad(abT500)}. With 20% down, the $400,000 mortgage is another ${cad(abM500)}. Together that is ${cad(abT500 + abM500)}, before the lawyer's bill. At ${cad(p800)} the transfer is ${cad(abT800)} and a $640,000 mortgage is ${cad(abM800)}, together ${cad(abT800 + abM800)}. There is no first-time rebate of a tax that does not exist. The closing-costs calculator includes both registrations and uses the down payment you enter for the mortgage amount.`,
        `<a href="${SK_FEES}">Saskatchewan</a> also has no provincial land transfer tax. <a href="${SK_PDF}">Information Services Corporation's fee table</a>, effective April 15, 2026, charges a title transfer of 0.4% of value once the title is above $6,300, and a separate mortgage registration: $275 from $250,000 to $500,000, and $525 from $500,000.01 to $750,000, covering the first four titles or interests. A ${cad(p500)} transfer is ${cad(skT500)}. The $400,000 mortgage at 20% down is ${cad(skM500)}. At ${cad(p800)} the transfer is ${cad(skT800)} and the $640,000 mortgage is ${cad(skM800)}. Nothing in that fee table waives either charge for a first home.`,
        `The same ${cad(p800)} resale is ${cad(on800 * 2)} of Toronto transfer tax before any rebate, and ${cad(abT800 + abM800)} of Calgary land-titles fees at 20% down. Add the legal quote in the <a href="/tools/closing-costs-calculator/">closing costs calculator</a>.`,
      ],
    },
    {
      id: "rest",
      heading: "Manitoba and the Atlantic provinces",
      paragraphs: [
        `<a href="${MB}">Manitoba</a> charges nothing to $30,000, then 0.5%, 1%, and 1.5% through $200,000, and 2% above that. Tax to $200,000 is $1,650, so ${cad(p500)} is ${cad(mb500)} and ${cad(p800)} is ${cad(mb800)}. The finance page has no first-time refund. <a href="${MB_FEES}">Teranet</a> posts a separate registration fee, effective January 4, 2026. This guide does not guess that dollar.`,
        `<a href="${NS_PAGE}">Nova Scotia's</a> deed transfer tax is municipal. <a href="${NS_LIST}">The July 2026 list</a> runs from 1% to 1.5%, and it says to confirm locally. <a href="${HALIFAX}">Halifax</a> is 1.5%: ${cad(hx500)} and ${cad(hx800)}. Antigonish County, Pictou and its towns, and several Digby and Yarmouth municipalities are at 1% on that list, which is ${cad(nb500)} and ${cad(nb800)} at these prices. "Nova Scotia is 1.5%" overstates those towns.`,
        `<a href="${NB}">New Brunswick</a> has charged 1% since April 1, 2016, on the greater of price and assessed value, to the nearest dollar. If the price is higher, that is ${cad(nb500)} and ${cad(nb800)}. The Act's published exemptions (short leases, wills, estates) do not include an Ontario-style first-time refund. <a href="${PEI_RATE}">Prince Edward Island</a> is also 1% of the greater of price and assessed value: ${cad(pei500)} and ${cad(pei800)}. <a href="${SOURCES.peiTransfer}">A qualifying first-time buyer</a> can have it waived. The <a href="${PEI_GUIDE}">$200,000 cap</a> was removed for purchases on or after October 1, 2016. The residency test remains, and the tax comes back if you do not occupy for 183 consecutive days.`,
        `Newfoundland and Labrador uses a registration charge, not a percentage tax. The <a href="${NL}">2013 Services Charges Act amendment</a> is $100 plus $0.40 per $100, or part, above $500, once on the conveyance and again on the mortgage. On ${cad(p500)} the conveyance is ${cents(nl500)} and a $400,000 mortgage is ${cents(nlM500)}. On ${cad(p800)} the conveyance is ${cents(nl800)} and a $640,000 mortgage is ${cents(nlM800)}. Confirm the registry still uses that tariff. Territorial fees are not estimated here.`,
      ],
    },
    {
      id: "other",
      heading: "Legal fees, title insurance, inspections, and adjustments",
      paragraphs: [
        `Legal fees, a status certificate, an inspection, an appraisal, and a survey are quotes. This page does not invent a national average. Type the quote into the closing-costs calculator. Title insurance is a premium. <a href="${SK_PST}">Saskatchewan PST-73</a> (April 2020) taxes it at 6%. <a href="${ON_RST}">Ontario</a> charges 8% retail sales tax on taxable insurance premiums. The statement of adjustments shows whether yours was taxed.`,
        `Property tax and utilities are adjustments. If the seller prepaid the year, you reimburse the days you will own the home. On a labelled bill of ${cad(taxYear)}, not a claim about any city's actual levy, a June 15, 2026 closing leaves 199 days (June 15 is day 166 of 365). The buyer pays 199/365 × ${cad(taxYear)} = ${cents(taxAdjustment)} if the agreement starts the buyer's share on June 16. Arrears reverse the credit. The move and any overlap of two rents are cash the same week. They are not added to the mortgage unless a lender agrees in writing.`,
      ],
    },
    {
      id: "insurance-tax",
      heading: "Sales tax on a CMHC premium",
      paragraphs: [
        `<a href="${CMHC_COST}">CMHC</a> says the premium in Quebec, Ontario, and Saskatchewan is subject to provincial sales tax, and that the tax cannot be added to the loan. <a href="${SOURCES.cmhcPremiums}">The premium schedule</a> for a traditional down payment, amortization of 25 years or less, in the band above 90% loan-to-value and at or under 95%, is 4.00%. An amortization longer than 25 years is a different row. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> on this site can disagree with that schedule. Use CMHC when they differ. The premium itself is usually added to the mortgage. The sales tax on it is cash.`,
        `On ${cad(p500)} with 5% down the loan is ${cad(loan500)} and the 4.00% premium is ${cad(prem500)}. Cash tax is ${cad(prem500 * 0.08)} in Ontario at 8%, ${cad(prem500 * 0.09)} in <a href="${QC_INS}">Quebec at 9%</a>, and ${cad(prem500 * 0.06)} in Saskatchewan at 6%. <a href="${QC_INS_2027}">Revenu Québec</a> raises that tax to 9.975% for premiums paid after December 31, 2026. GST and HST do not apply. On ${cad(p800)} the minimum down payment is ${cad(minimumDownPayment(p800))}, the loan is ${cad(loan800)}, and the premium is ${cad(prem800)}. Cash tax is ${cad(prem800 * 0.08)}, ${cad(prem800 * 0.09)}, and ${cad(prem800 * 0.06)}. At 20% down there is usually no premium. CMHC names those three provinces, so this page stops there.`,
      ],
    },
    {
      id: "new-build",
      heading: "GST and HST on a new build",
      paragraphs: [
        `A private resale generally has no GST. A new or substantially renovated home does. <a href="${CRA_RATES}">The CRA table</a> is 5% GST in Alberta, British Columbia, Manitoba, Saskatchewan, Quebec, and the territories; 13% HST in Ontario; 14% in Nova Scotia when ownership and possession both transfer on or after April 1, 2025 (<a href="${NS_HST}">Notice 343</a>); and 15% in New Brunswick, Newfoundland and Labrador, and Prince Edward Island. Quebec's QST has its own housing rules. No QST rebate dollar is invented here.`,
        `<a href="${NEW_HOUSING}">The older rebate</a> is generally 36% of the federal tax, capped at $6,300, and gone from $450,000. Neither example price gets it. <a href="${SOURCES.gstRebate}">The first-time GST/HST rebate</a> can return 100% of the federal tax, up to $50,000, at or under $1 million, for an agreement on or after March 20, 2025. On ${cad(p800)} in a 5% province that federal tax is ${cad(p800 * 0.05)}. Ontario's 8% slice on the same consideration is ${cad(p800 * 0.08)}; the provincial rebate is <a href="${SOURCES.gstMemo}">memorandum 19-3-10</a>, not a number made up here. Nova Scotia rebates 18.75% of the provincial HST, up to $3,000 (<a href="${NS_REBATE}">application</a>). A ${cad(p500)} new Ontario house is ${cad(p500 * 0.13)} of HST before rebates, and land transfer tax ignores the HST.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Brackets in this guide are from the provincial, municipal, CMHC, and CRA pages linked above, as read in October 2026. The statement of adjustments is the bill.",
      ],
    },
  ],
  faqs: [
    {
      question: "Are closing costs part of the down payment?",
      answer:
        "No. The down payment is your equity. Closing costs are the extra cash: transfer tax or land-titles fees, the legal bill, adjustments, and, in Ontario, Quebec, and Saskatchewan, sales tax on a mortgage-insurance premium.",
    },
    {
      question: "Does Toronto charge land transfer tax twice?",
      answer:
        "Toronto charges a municipal tax on top of Ontario's. At $500,000 and $800,000 the two bills match for a one- or two-unit home. Above $3 million the municipal rates from April 1, 2026 are higher. The rest of Ontario pays only the provincial tax.",
    },
    {
      question: "Do Alberta and Saskatchewan have land transfer tax?",
      answer:
        "No. Alberta charges $50 plus $5 per $5,000, on the transfer and again on the mortgage, from October 1, 2026. Saskatchewan charges 0.4% to transfer title above $6,300, plus a stepped mortgage fee, from April 15, 2026. Neither fee has a first-time rebate.",
    },
    {
      question: "Can I add the sales tax on CMHC insurance to the mortgage?",
      answer:
        "CMHC says no. The premium can be added to the loan. The tax, 8% in Ontario, 9% in Quebec through 2026, and 6% in Saskatchewan, is cash. On a $500,000 home with 5% down and a 4% premium, Ontario's tax is $1,520.",
    },
    {
      question: "Do I pay GST on a resale condo?",
      answer:
        "A private resale generally has no GST or HST. A new or substantially renovated home does. The older federal rebate ends at $450,000, so it does not apply at these prices. The first-time GST/HST rebate can still remove the federal portion at or under $1 million.",
    },
    {
      question: "Why might a calculator disagree on Quebec?",
      answer:
        "The 2026 baseline brackets are $62,900 and $315,000, and Montreal adds higher rates from $552,300. The duty uses the highest of the price, the deed, and the assessment times the comparative factor.",
    },
    {
      question: "Does a first-time buyer in P.E.I. or B.C. pay nothing?",
      answer:
        "Sometimes. P.E.I. can waive its 1% tax at any price and claw it back if you do not occupy for 183 days. B.C. wipes the tax at $500,000 and takes $8,000 off at $800,000. Ontario's refund never exceeds $4,000, so an $800,000 home outside Toronto still costs $8,475.",
    },
  ],
};
