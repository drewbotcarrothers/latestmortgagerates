import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, pct } from "./shared";
import { INSURED_UNINSURED_EXPLANATION } from "../../lib/mortgageTypeCopy";
import { PRIME_RATE } from "../../lib/primeRate";
import {
  BIG5_SLUGS,
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderBySlug,
  lenderName,
  publicLenderProducts,
  termLabel,
} from "../../lib/communityRates";
import rawRatesFile from "../../../data/rates.json";
import { guideTable } from "./guideTable";

const REVIEWED = "2026-10-23T20:00:00Z";

const RBC_HOLD = "https://www.rbcroyalbank.com/services/mortgages/mortgage-rates-s-or.html";
const RBC_PENALTY = "https://www.rbcroyalbank.com/mortgages/understanding-mortgage-prepayment-charges.html";
const RBC_PORT = "https://www.rbcroyalbank.com/mortgages/product-advice/porting-a-mortgage.html";
const RBC_VAR = "https://www.rbcroyalbank.com/mortgages/variable-rate-mortgage.html";
const RBC_HOME = "https://www.rbcroyalbank.com/mortgages/rbc-homeline-plan.html";
const TD_HOLD = "https://www.td.com/ca/en/personal-banking/products/mortgages/first-time-home-buyer/pre-approval";
const TD_RATES = "https://www.td.com/ca/en/personal-banking/products/mortgages/mortgage-rates";
const TD_PREPAY = "https://www.td.com/ca/en/personal-banking/products/mortgages/flexible-mortgage-payment-features";
const TD_BREAK = "https://www.td.com/ca/en/personal-banking/products/mortgages/what-happens-break-mortgage-penalty";
const TD_STORY = "https://stories.td.com/ca/en/article/the-truth-behind-three-common-mortgage-myths";
const TD_FLEX = "https://www.td.com/ca/en/personal-banking/products/mortgages/td-home-equity-flexline";
const SCOTIA_PREPAY = "https://www.scotiabank.com/ca/en/personal/mortgages/understanding-mortgage-prepayments-charges.html";
const SCOTIA_FLEX = "https://www.scotiabank.com/ca/en/personal/mortgages/variable-rate/flex-value-closed-term.html";
const SCOTIA_STEP = "https://www.scotiabank.com/ca/en/personal/mortgages/scotia-total-equity-plan-step.html";
const BMO_READI = "https://www.bmo.com/en-ca/main/personal/mortgages/homeowner-readiline/";
const BMO_PREPAY = "https://www.bmo.com/assets/pdfs/mortgage-prepayments-en.pdf";
const CIBC_HPP = "https://www.cibc.com/en/personal-banking/mortgages/home-power-plan-mortgage.html";
const CIBC_TERMS = "https://www.cibc.com/content/dam/cibc-public-assets/closingdocs/mortgage/ab/5453ab-set-of-standard-charge-mortgage-terms_Version_A.pdf";
const FCAC_CHOOSE = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/choose-mortgage.html";
const FCAC_RENEW = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html";

type Scraped = {
  lender_slug: string;
  lender_name: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  posted_rate: number | null;
  scraped_at?: string;
  raw_data?: { section?: string };
};

function pick(slug: string, rateType: string, mortgageType: string): Scraped | undefined {
  const rows = (rawRatesFile as Scraped[]).filter(
    (row) =>
      row.lender_slug === slug &&
      row.term_months === 60 &&
      row.rate_type === rateType &&
      row.mortgage_type === mortgageType,
  );
  return rows.find((row) => row.raw_data?.section === "special") ?? rows[0];
}

function showRate(row: Scraped | undefined): string {
  return row ? pct(row.rate) : "Not in the scrape";
}

function showPosted(row: Scraped | undefined): string {
  if (!row) return "Not in the scrape";
  return row.posted_rate == null ? "Not stored" : pct(row.posted_rate);
}

const scrapedAt = ((rawRatesFile as Scraped[]).find((row) => row.lender_slug === "td" && row.scraped_at)?.scraped_at ?? "").slice(0, 10);

const featureTable = guideTable(
  ["Bank", "Uninsured (20%+ down)", "Posted", "Prepayment", "Fixed penalty", "Rate hold", "30-year amortization"],
  [
    [
      "RBC",
      showRate(pick("rbc", "fixed", "uninsured")),
      showPosted(pick("rbc", "fixed", "uninsured")),
      "No single % published",
      "Posted minus your discount, then present-valued; or 3 months' interest",
      "120 days, fixed purchase, automatic float-down",
      "Not stated",
    ],
    [
      "TD",
      showRate(pick("td", "fixed", "uninsured")),
      showPosted(pick("td", "fixed", "uninsured")),
      "15% lump sum; payment increase up to 100%",
      "Posted minus your discount, or 3 months' interest",
      "120 days, fixed only; you ask to float down",
      "Rate sheet covers 30 years or less",
    ],
    [
      "Scotiabank",
      showRate(pick("scotiabank", "fixed", "uninsured")),
      showPosted(pick("scotiabank", "fixed", "uninsured")),
      "Flex Value 15% + 15%; other options 10% or 20%",
      "Greater of 3 months and a differential; comparison rate not spelled out",
      "Not stated",
      "Not stated",
    ],
    [
      "BMO",
      showRate(pick("bmo", "fixed", "uninsured")),
      showPosted(pick("bmo", "fixed", "uninsured")),
      "Smart fixed 10% + 10%; other closed 20% + 20%",
      "Greater of 3 months and an IRD; not spelled as posted minus discount",
      "130 days on a selected fixed rate",
      "Not stated",
    ],
    [
      "CIBC",
      showRate(pick("cibc", "fixed", "uninsured")),
      showPosted(pick("cibc", "fixed", "uninsured")),
      "Fixed closed 10% a year; Variable Flex 20%",
      "Alberta terms: 3 months plus any discount, or a posted differential",
      "Not stated",
      "Not stated",
    ],
  ],
);

const discountLines = BIG5_SLUGS.map((slug) => {
  const lender = lenderBySlug(slug);
  const products = lender ? publicLenderProducts(lender) : [];
  if (products.length === 0) {
    return `${lenderName(slug)}: no product in this file has both N of at least ${communityRates.thresholds.publicMinN} and a posted rate stored beside the reports.`;
  }
  const detail = products
    .map(
      (product) =>
        `${termLabel(product.termMonths)} ${product.rateType}, reported median ${formatRate(product.reportedMedian)} against posted ${formatRate(product.postedRate)} (N = ${product.n}), ${formatSpread(product.spreadVsPosted)} posted`,
    )
    .join("; ");
  return `${lenderName(slug)}: ${detail}.`;
}).join(" ");

const scotiaVariable = lenderBySlug("scotiabank")?.products.find(
  (product) => product.termMonths === 60 && product.rateType === "variable",
);

const fiveYearFixedPublished = BIG5_SLUGS.every((slug) => {
  const products = publicLenderProducts(lenderBySlug(slug) ?? { slug, matchedN: 0, medianSpreadVsOwnPosted: null, products: [] });
  return !products.some((product) => product.termMonths === 60 && product.rateType === "fixed");
});

if (!fiveYearFixedPublished) {
  throw new Error("A Big Five 5-year fixed cell now clears N of 10. Update the sentence that says none do.");
}

export const bigFiveBanks: InDepthGuide = {
  slug: "big-5-bank-mortgages-compared",
  path: "/guides/big-5-bank-mortgages-compared/",
  metaTitle: "Big 5 Mortgages Compared: Rates, Penalties, Holds",
  description:
    "Compare RBC, TD, Scotiabank, BMO, and CIBC on posted rates, prepayment privileges, penalty method, rate-hold length, and 30-year amortization where a bank states it.",
  keywords:
    "Big 5 bank mortgages compared, RBC vs TD vs Scotiabank vs BMO vs CIBC, Homeline FlexLine STEP ReadiLine Home Power Plan, collateral charge, posted rate IRD",
  cardTitle: "Big 5 banks compared",
  cardDescription:
    "Posted and special 5-year rates from the scrape, reported discounts only where the sample is large enough, and the penalty, hold, and HELOC terms each bank publishes.",
  h1: "RBC, TD, Scotiabank, BMO, and CIBC mortgages compared",
  dek: "The special is the advertisement. The posted rate can come back as a penalty. The table below is the prepayment privilege, the penalty method, the hold, and whether a 30-year amortization is actually stated.",
  sourcesLine:
    "Sources: each bank's own pages, FCAC, the daily rate scrape, and the reported-rate file. The commitment controls your file.",
  reviewedIso: REVIEWED,
  updatedDate: "2026-11-23",
  howTo: {
    name: "How to compare a Big Five mortgage offer",
    description:
      "Read the special and the posted rate, then the penalty, the prepayment privilege, the hold, and whether a line of credit will register a collateral charge.",
    steps: [
      {
        name: "Split insured from uninsured",
        text: "A 5-year fixed insured special and a 5-year fixed uninsured special are different rows. Compare the row that matches your down payment.",
      },
      {
        name: "Write down the posted rate",
        text: "If the scrape does not store one, ask the bank. RBC and TD both say a fixed closed penalty can use the posted rate minus the discount you were given.",
      },
      {
        name: "Match the sample before you quote a discount",
        text: "A reported median is published here only when at least 10 reports sit next to a posted rate. A smaller cell is not a bargaining number.",
      },
      {
        name: "Decide if you want the line of credit",
        text: "Homeline, FlexLine, STEP, ReadiLine, and Home Power Plan are readvanceable plans. They are convenient, and they are usually collateral charges, which makes a later switch heavier.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "The short answer",
      paragraphs: [
        `RBC, TD, Scotiabank, BMO, and CIBC each publish a 5-year price. The special is the advertisement. The posted rate beside an uninsured 5-year fixed is the shelf a fixed penalty may use later. This table was scraped on ${scrapedAt}. "Not in the scrape" means that row was missing. "Not stored" means a special was captured with no posted figure. ${INSURED_UNINSURED_EXPLANATION} No Big Five 5-year fixed cell in the borrower-reported file has both 10 reports and a posted rate, so this page does not quote a 5-year fixed discount.`,
        featureTable,
        `The rate columns are uninsured 5-year fixed. Insured specials are a different product. Price a high-ratio premium in the <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a>, then read the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> shelves. Bank pages: <a href="/lenders/rbc/">RBC</a>, <a href="/lenders/td/">TD</a>, <a href="/lenders/scotiabank/">Scotiabank</a>, <a href="/lenders/bmo/">BMO</a>, and <a href="/lenders/cibc/">CIBC</a>. Side by side: <a href="/compare/td-vs-rbc/">TD versus RBC</a> and <a href="/compare/bmo-vs-cibc/">BMO versus CIBC</a>.`,
      ],
    },
    {
      id: "reported",
      heading: "Where a reported discount is large enough to print",
      paragraphs: [
        `The file dated ${formatAsOf()} compares a rate self-reported by Canadian borrowers online with that bank's posted rate. A row is public only when N is at least ${communityRates.thresholds.publicMinN} and a posted rate is stored. Rates in this paragraph are rounded to the nearest 0.05, the same way <a href="/real-mortgage-rates/">real mortgage rates</a> rounds them. ${communityRates.disclaimer} None of the five banks currently has a 5-year fixed cell that clears both tests, so this page does not quote a 5-year fixed discount for any of them.`,
        discountLines,
        scotiaVariable && scotiaVariable.n >= 10 && scotiaVariable.postedRate == null
          ? `Scotiabank's 5-year variable reports reach N = ${scotiaVariable.n}, and the reported median before nickel-rounding is ${scotiaVariable.reportedMedian.toFixed(2)}%. No posted rate is stored beside them, so the discount is not published. A sample without the shelf it is being compared with is not a discount.`
          : "Scotiabank's variable sample should be re-read if a posted rate is later stored beside it.",
        `Market-wide, insured status not stated, the 5-year fixed median is ${REPORTED.fixedMedian} (N = ${REPORTED.fixedN}) against a Big Five posted median of ${REPORTED.fixedBig5}. The variable median is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}) against ${REPORTED.variableBig5}. Those cells mix lenders. Put one written offer in the <a href="/tools/renewal-offer-checker/">renewal offer checker</a>. The shelf itself is explained in <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted</a>.`,
      ],
    },
    {
      id: "ird",
      heading: "The fixed penalty, and who says it uses the posted rate",
      paragraphs: [
        `<a href="${SOURCES.fcacPenalty}">FCAC</a> describes an interest-rate differential that can use today's posted rate minus the discount you were given. The penalty is the higher of that differential and three months' interest. Subtracting the discount widens the fee. The <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> is the simple screen. A present-value step, or a clause that adds the discount on top of three months' interest, will not match it. The <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> is the longer version.`,
        `<a href="${RBC_PENALTY}">RBC</a> and <a href="${TD_STORY}">TD</a> both use posted minus your discount on a closed fixed mortgage. RBC then present-values the result. <a href="${CIBC_TERMS}">CIBC's Alberta terms</a> (April 2026) use the higher of three months' interest plus any discount, or a posted-rate differential, and other provinces can differ. <a href="${BMO_PREPAY}">BMO</a> and <a href="${SCOTIA_PREPAY}">Scotiabank</a> publish a differential and do not spell it as posted minus discount, so this page does not claim that they do. A variable closed charge is three months' interest. <a href="${TD_BREAK}">TD</a> also lets you renew 120 days before maturity without a prepayment charge.`,
      ],
    },
    {
      id: "prepay",
      heading: "What you can pay off without a charge",
      paragraphs: [
        `<a href="${TD_PREPAY}">TD</a> allows one lump sum a year of up to 15% of the original principal and a payment increase of up to 100%. <a href="${SCOTIA_FLEX}">Scotiabank Flex Value</a> is 15% plus a 15% payment increase. Other Scotia options are 10% or 20%. <a href="${BMO_PREPAY}">BMO</a> gives a smart fixed closed mortgage 10% and 10%. Other closed BMO mortgages get 20% and 20%. <a href="${CIBC_HPP}">CIBC</a> allows 10% a year on a fixed closed mortgage and 20% on Variable Flex. RBC does not publish one percentage for every mortgage, so none is invented here. The product name is the privilege.`,
      ],
    },
    {
      id: "hold-port",
      heading: "Rate holds and porting",
      paragraphs: [
        `<a href="${RBC_HOLD}">RBC</a> honours a fixed-rate residential quote for up to 120 days, and if rates fall you get the lowest rate for that term. The guarantee dies if the mortgage is not funded in time. <a href="${TD_HOLD}">TD</a> holds a fixed rate for 120 days. If rates rise, the held rate stays. If they fall, you can ask for the lower one. <a href="${TD_RATES}">A variable is not held</a>, because it moves with TD Mortgage Prime. <a href="${BMO_READI}">BMO</a> guarantees a selected fixed rate for 130 days from the guarantee start. Its "longest guarantee" footnote is dated September 15, 2025, so the ranking is not repeated here. Scotia and CIBC do not state a hold length on the pages checked. Purchase holds and renewal holds are separated in the <a href="/guides/mortgage-rate-hold-canada/">rate-hold guide</a>.`,
        `<a href="${RBC_PORT}">RBC</a> lets you port the rate. A larger loan blends the old rate with the current rate on the extra funds. <a href="${RBC_VAR}">A variable</a> can be ported with a firm sale and a firm purchase. <a href="${TD_BREAK}">TD</a> may port a fixed rate without a prepayment charge and blend an increase at current rates. <a href="${CIBC_TERMS}">CIBC's Alberta terms</a> use 60 days and do not transfer Variable Flex at the old rate. BMO and Scotiabank port windows were not on the pages checked.`,
      ],
    },
    {
      id: "heloc",
      heading: "The five readvanceable plans, and the charge on title",
      paragraphs: [
        `<a href="${FCAC_CHOOSE}">FCAC</a> separates a standard charge, which secures the mortgage you borrowed, from a collateral charge, which can secure that mortgage and other loans and may be registered for more than you take today. <a href="${FCAC_RENEW}">Switching at renewal</a> then means repaying every loan the charge secures and paying to discharge and re-register. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switch guide</a> is where that meets the stress-test exemption.`,
        `<a href="${RBC_HOME}">RBC Homeline</a> pairs a mortgage with a line you can repay any time, interest-only allowed. RBC's overview requires 20% equity or 20% down. <a href="${TD_FLEX}">TD FlexLine</a> goes to 80% of value. The revolving portion is TD Prime, interest-only or more, with no prepayment charge, and the closed portion keeps the 15% lump sum. Credit returns as you pay the balance down. Big-bank prime here is ${pct(PRIME_RATE)}. TD Mortgage Prime is TD's own, so "prime minus" is not comparable until the contract names which prime.`,
        `<a href="${SCOTIA_STEP}">Scotia STEP</a> can hold up to three mortgage components plus a line of credit, and you choose where a prepayment goes. The page does not state a loan-to-value cap, so none is invented. <a href="${BMO_READI}">BMO ReadiLine</a> goes to 80%, split between a mortgage and a revolving line at BMO prime plus an adjustment. Paying the mortgage down raises the revolving limit, and the 130-day guarantee applies to the fixed mortgage portion. <a href="${CIBC_HPP}">CIBC Home Power Plan</a> also goes to 80% with at least 20% equity, from $10,000, and CIBC's solicitor instructions register it as a collateral mortgage.`,
        "The convenience is the collateral charge. If you want the line and expect to stay, the product is doing its job. If you might move the mortgage at renewal for a rate, a standard charge leaves a cleaner file. The <a href=\"/guides/heloc-rates-canada/\">HELOC rates guide</a> is the 65% revolving cap on these plans. <a href=\"/lenders/simplii/\">Simplii</a>, CIBC’s no-branch division, is a separate page from this five-bank table. <a href=\"/lenders/scotiabank/\">Scotiabank’s</a> STEP terms are on its lender page.",
      ],
    },
    {
      id: "verdict",
      heading: "Which borrower should care about which difference",
      paragraphs: [
        `Under 20% down, compare insured specials and price the premium first. On the ${scrapedAt} scrape the insured 5-year fixed rows are RBC ${showRate(pick("rbc", "fixed", "insured"))}, TD ${showRate(pick("td", "fixed", "insured"))}, BMO ${showRate(pick("bmo", "fixed", "insured"))}, and CIBC ${showRate(pick("cibc", "fixed", "insured"))}. Scotiabank has no insured 5-year row in that file. Those are one day's advertisements. The payment is the <a href="/tools/mortgage-calculator/">mortgage calculator</a>. Qualifying is the <a href="/guides/mortgage-stress-test/">stress test</a>.`,
        `Someone who might sell in year three should rank the penalty ahead of a tenth of a point. Someone who wants the line of credit should use the cap the bank actually publishes: TD, BMO, and CIBC say 80%, RBC's overview requires 20% equity, and Scotia's STEP page states no cap. A renewer who might switch should separate a straight switch from a blend, then use the <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> and the <a href="/rates/5-year-fixed/">5-year fixed</a> and <a href="/rates/variable/">variable</a> pages. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">monoline and credit-union guide</a> is the comparison once you leave the branch.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Product rules below are from the bank's own page or standard terms. Rate cells are from the scrape. Reported discounts are from the file, and only where N and a posted rate both qualify.",
      ],
      listAfter: 0,
      items: [
        `<a href="${RBC_PENALTY}">RBC prepayment charges</a>, <a href="${RBC_HOLD}">120-day fixed hold</a>, <a href="${RBC_PORT}">porting</a>, and <a href="${RBC_HOME}">Homeline</a>.`,
        `<a href="${TD_STORY}">TD on the posted-rate IRD</a>, <a href="${TD_BREAK}">breaking, porting, and the 120-day early renewal</a>, <a href="${TD_PREPAY}">the 15% privilege</a>, and <a href="${TD_FLEX}">FlexLine</a>.`,
        `<a href="${SCOTIA_PREPAY}">Scotiabank prepayments</a>, <a href="${SCOTIA_FLEX}">Flex Value at 15%</a>, and <a href="${SCOTIA_STEP}">STEP</a>.`,
        `<a href="${BMO_PREPAY}">BMO prepayment options</a> and <a href="${BMO_READI}">Homeowner ReadiLine</a>, including the 130-day guarantee.`,
        `<a href="${CIBC_HPP}">CIBC Home Power Plan</a> and the <a href="${CIBC_TERMS}">Alberta standard charge terms (April 2026)</a>.`,
        `<a href="${FCAC_CHOOSE}">FCAC on standard and collateral charges</a> and <a href="${SOURCES.fcacPenalty}">FCAC on prepayment penalties</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "How does switching a mortgage to RBC compare with switching to BMO?",
      answer:
        "A straight switch keeps the balance and the remaining amortization. Adding money or years is a refinance. RBC Homeline and BMO ReadiLine are usually collateral charges, so every loan on the charge has to be paid out. RBC publishes a port and blends a larger loan. BMO's port window was not on the pages checked. Before maturity, RBC's fixed penalty uses posted minus your discount, then present-values it. BMO uses the higher of three months' interest and an interest-rate differential, and does not spell that rate as posted minus discount.",
    },
    {
      question: "How do RBC mortgage discounts compare with CIBC?",
      answer: `Neither bank has a 5-year fixed cell with 10 borrower reports beside a posted rate, so no borrower-reported discount is quoted. On the ${scrapedAt} scrape the uninsured 5-year fixed special is ${showRate(pick("rbc", "fixed", "uninsured"))} at RBC (posted ${showPosted(pick("rbc", "fixed", "uninsured"))}) and ${showRate(pick("cibc", "fixed", "uninsured"))} at CIBC (posted ${showPosted(pick("cibc", "fixed", "uninsured"))}). That gap is the special versus the posted shelf. It is not a rate someone was confirmed to have signed.`,
    },
    {
      question: "How do RBC mortgage prepayment penalties compare with BMO?",
      answer:
        "RBC's closed fixed charge is the greater of three months' interest and a differential: your rate versus RBC's posted rate for a similar remaining term, less the reduction you received. RBC then present-values the result. BMO's fixed closed charge, including a ReadiLine fixed instalment, is the higher of three months' interest and an interest-rate differential. BMO's guide does not spell the comparison rate as posted minus discount, so this page does not claim that it does. A variable closed charge at both is three months' interest.",
    },
    {
      question: "How do RBC prepayment options compare with Scotiabank?",
      answer:
        "RBC's prepayment page does not publish one percentage for every mortgage, so this guide does not invent an accelerated-payment matchup. Scotiabank Flex Value is 15% of the original principal plus a 15% payment increase. Other Scotia options are 10% or 20%. The product name is the privilege. An accelerated payment frequency, where a lender offers one, is not the same clause as that annual privilege.",
    },
    {
      question: "How does an RBC pre-approval compare with CIBC?",
      answer:
        "RBC's rate page holds a fixed-rate residential purchase for up to 120 days, and if fixed rates fall you get the lowest rate during the hold. A pre-approval is not the same document as a funded approval. CIBC did not state a hold length on the Home Power Plan page or the Alberta standard terms we checked. This page does not compare app screens it has not read.",
    },
    {
      question: "Does TD offer a 30-year amortization on an uninsured mortgage?",
      answer:
        "TD's rate page says those posted rates apply to new first-priority mortgages on already built, owner-occupied homes with amortizations of 30 years or less. The footnote is not limited to insured files, and it is not an approval. Uninsured means 20% down or more, which puts a 30-year amortization outside the low-ratio insurance cap. CMHC's 30-year insured product is a separate rule for first-time buyers and new builds.",
    },
    {
      question: "Does RBC offer an extended rate hold?",
      answer:
        "RBC publishes a hold of up to 120 days on a fixed-rate residential purchase, and applies the lowest fixed rate during that hold. The hold ends if the mortgage is not funded in time. We did not find a public RBC hold longer than 120 days. BMO publishes 130 days on a selected fixed rate. Scotiabank and CIBC did not state a length on the pages checked.",
    },
    {
      question: "Which Big Five bank has the lowest 5-year rate?",
      answer:
        "Whichever row is lowest that day, in the column that matches your file. A missing row is not a high rate. No Big Five 5-year fixed cell in this file has both 10 reports and a posted rate, so no 5-year fixed discount is quoted.",
    },
    {
      question: "Is a Homeline, FlexLine, STEP, ReadiLine, or Home Power Plan just a mortgage with a nickname?",
      answer:
        "No. Each one pairs a mortgage portion with a revolving line, and paying the mortgage down can restore room on the line. TD, BMO, and CIBC publish a cap of 80% of the home's value. The registration is a collateral charge, or is described that way in CIBC's solicitor instructions. Switching lenders later means dealing with every loan the charge secures.",
    },
    {
      question: "Can I port a Big Five mortgage to the next house?",
      answer:
        "RBC and TD publish it, including a blend when the new loan is larger. CIBC's Alberta terms use 60 days and do not carry a Variable Flex mortgage at the old rate. BMO and Scotiabank were not confirmed on the pages checked. Fees, an appraisal, and a new premium on any increase can still apply.",
    },
    {
      question: "Are the discounts on this page the rates people got at that bank?",
      answer:
        "They are medians self-reported by Canadian borrowers online, unverified, and shown only where at least 10 reports sit next to a posted rate. They are not an offer from the bank. The 5-year fixed cells at all five banks are too small, or lack a posted rate, so they are left out on purpose.",
    },
  ],
};
