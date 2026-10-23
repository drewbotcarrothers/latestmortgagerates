import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, pct } from "./shared";
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

const order = ["rbc", "td", "scotiabank", "bmo", "cibc"] as const;
const labels: Record<(typeof order)[number], string> = {
  rbc: "RBC",
  td: "TD",
  scotiabank: "Scotiabank",
  bmo: "BMO",
  cibc: "CIBC",
};

const scrapedAt = ((rawRatesFile as Scraped[]).find((row) => row.lender_slug === "td" && row.scraped_at)?.scraped_at ?? "").slice(0, 10);

const rateRows = order.map((slug) => [
  labels[slug],
  showRate(pick(slug, "fixed", "uninsured")),
  showPosted(pick(slug, "fixed", "uninsured")),
  showRate(pick(slug, "fixed", "insured")),
  showPosted(pick(slug, "fixed", "insured")),
  showRate(pick(slug, "variable", "uninsured")),
  showPosted(pick(slug, "variable", "uninsured")),
  showRate(pick(slug, "variable", "insured")),
  showPosted(pick(slug, "variable", "insured")),
]);

const uninsuredFixed = order.map((slug) => ({ slug, row: pick(slug, "fixed", "uninsured") }));
const notStored = uninsuredFixed.filter(({ row }) => row && row.posted_rate == null).map(({ slug }) => labels[slug]);
const postedLead =
  notStored.length === 0
    ? "RBC, TD, Scotiabank, BMO, and CIBC all publish a 5-year price you can see, and the scrape stores a higher posted rate beside each uninsured 5-year fixed special, which is the shelf a fixed-rate penalty may use later."
    : `RBC, TD, Scotiabank, BMO, and CIBC all publish a 5-year price you can see. ${notStored.join(", ")} ${notStored.length === 1 ? "has" : "have"} a special stored with no posted figure. That posted figure, where the scrape has it, is the shelf a fixed-rate penalty may use later.`;
const storedNote =
  notStored.length === 0
    ? "None of the five uninsured 5-year fixed rows are in that second group."
    : `${notStored.join(" and ")} ${notStored.length === 1 ? "is" : "are"} in that second group.`;

const rateTable = guideTable(
  [
    "Bank",
    "5-yr fixed uninsured",
    "Posted",
    "5-yr fixed insured",
    "Posted",
    "5-yr variable uninsured",
    "Posted",
    "5-yr variable insured",
    "Posted",
  ],
  rateRows,
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
  metaTitle: "Big 5 Bank Mortgages Compared (2026) | Latest Mortgage Rates",
  description:
    "RBC, TD, Scotiabank, BMO, and CIBC compared on the 5-year rates in our scrape, borrower-reported discounts where N is at least 10, posted-rate penalties, prepayments, rate holds, and readvanceable lines.",
  keywords:
    "Big 5 bank mortgages compared, RBC vs TD vs Scotiabank vs BMO vs CIBC, Homeline FlexLine STEP ReadiLine Home Power Plan, collateral charge, posted rate IRD",
  cardTitle: "Big 5 banks compared",
  cardDescription:
    "Posted and special 5-year rates from the scrape, reported discounts only where the sample is large enough, and the penalty, hold, and HELOC terms each bank publishes.",
  h1: "RBC, TD, Scotiabank, BMO, and CIBC mortgages compared",
  dek: "Five banks, one kind of decision. The special on the website is the advertisement. The posted rate beside it can come back as a penalty. The line of credit, if you add one, changes the charge on title.",
  sourcesLine:
    "Sources: each bank's own pages, FCAC, the daily rate scrape, and the reported-rate file. The commitment controls your file.",
  reviewedIso: REVIEWED,
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
      heading: "What actually differs",
      paragraphs: [
        `${postedLead} A discount below that shelf shows up in the borrower-reported file only for a product with at least 10 reports and a posted rate stored beside them, and on the current file that test is failed by every Big Five 5-year fixed cell.`,
        `The table was scraped on ${scrapedAt}. "Not in the scrape" means that row was missing. "Not stored" means a special was captured with no posted figure. ${storedNote} Do not fill a blank, and do not treat the special as the penalty's comparison rate.`,
        rateTable,
        `Insured and uninsured are different products. A high-ratio mortgage, under 20% down, is the insured column and usually carries a premium you can price in the <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a>. At 20% down or more, read the uninsured column and the <a href="/rates/uninsured/">uninsured shelf</a>. The <a href="/rates/insured/">insured shelf</a> is the other one. Side-by-side lender pages already on this site are <a href="/compare/td-vs-rbc/">TD versus RBC</a>, <a href="/compare/bmo-vs-cibc/">BMO versus CIBC</a>, and <a href="/compare/wealthsimple-vs-td/">Wealthsimple versus TD</a>. The bank pages are <a href="/lenders/rbc/">RBC</a>, <a href="/lenders/td/">TD</a>, <a href="/lenders/scotiabank/">Scotiabank</a>, <a href="/lenders/bmo/">BMO</a>, and <a href="/lenders/cibc/">CIBC</a>.`,
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
        `<a href="${SOURCES.fcacPenalty}">FCAC</a> describes two comparison rates for an interest-rate differential. One is close to what you would be offered today. The other is today's posted rate for a similar remaining term, minus the discount you were given. Subtracting the discount widens the fee. The penalty is the higher of that differential and three months' interest. The simple version is in the <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> and the <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a>. A present-value discount, or a clause that adds the original discount on top of three months' interest, will not match that screen.`,
        `<a href="${RBC_PENALTY}">RBC</a> uses the greater of three months' interest and a differential: your rate versus RBC's posted rate that day for a similar remaining term and the same prepayment options, less the reduction you received. RBC then present-values the result, which it says reduces the charge. A variable closed charge is three months' interest. Use RBC's worksheet for the number.`,
        `<a href="${TD_STORY}">TD</a> uses the same shape on a closed fixed mortgage: the higher of three months' interest, or a differential against the posted rate for a similar mortgage minus your discount. A closed variable charge is three months' interest. <a href="${TD_BREAK}">TD</a> says you may renew 120 days before maturity without a prepayment charge. Earlier than that, a charge can still apply. That is an early renewal, not a promise that every blend is free.`,
        `<a href="${CIBC_TERMS}">CIBC's Alberta standard terms</a> (April 2026) set the fixed closed charge at the higher of three months' interest at your rate plus any discount, or a differential against the posted rate for a mapped term: 6 months if a year or less remains, then 1, 2, 3, 4, 5, 7, or 10 years. The discount includes a Better Than Posted promotion. A Variable Flex payout in those terms is three months' interest at CIBC Prime. Other provinces can use different standard terms.`,
        `<a href="${BMO_PREPAY}">BMO</a> sets a fixed closed charge, including a ReadiLine fixed instalment, at the higher of three months' interest and an interest-rate differential, and a variable closed charge at three months' interest. After five years of a longer term, only three months' interest applies. The guide does not spell the comparison rate out as posted minus discount, so this page does not claim that it does. <a href="${SCOTIA_PREPAY}">Scotiabank</a> says a fixed payout is typically the greater of three months' interest and a differential, and a variable payout is typically three months' interest. Ask which comparison rate they use before you rank either bank against RBC, TD, or CIBC.`,
      ],
    },
    {
      id: "prepay",
      heading: "What you can pay off without a charge",
      paragraphs: [
        `<a href="${TD_PREPAY}">TD</a> allows a closed mortgage one lump sum a year of up to 15% of the original principal, and a payment increase of up to 100%. An open mortgage can be prepaid in any amount. <a href="${SCOTIA_FLEX}">Scotiabank Flex Value</a> is 15% of the original principal plus a 15% payment increase. The prepayment page says other Scotia options are 10% or 20%. The product name is the privilege.`,
        `<a href="${BMO_PREPAY}">BMO</a> gives a smart fixed closed mortgage a 10% payment increase and a 10% lump sum. Other closed mortgages, and a ReadiLine instalment that is not a smart fixed, get 20% and 20%. Open mortgages and the revolving portion have no charge. In the first five years a smart fixed closed mortgage cannot be paid out in full except in the cases BMO lists. <a href="${CIBC_HPP}">CIBC</a> allows 10% a year on a fixed closed mortgage and 20% on Variable Flex. RBC's prepayment page does not publish one percentage for every RBC mortgage, so this guide does not invent one. A former HSBC file can differ. The disclosure states it.`,
      ],
    },
    {
      id: "hold-port",
      heading: "Rate holds and porting",
      paragraphs: [
        `<a href="${RBC_HOLD}">RBC</a> honours a fixed-rate residential quote for up to 120 days, and if rates fall you get the lowest rate for that term. The guarantee dies if the mortgage is not funded in time. <a href="${TD_HOLD}">TD</a> holds a fixed rate for 120 days. If rates rise, the held rate stays. If they fall, you can ask for the lower one. <a href="${TD_RATES}">A variable is not held</a>, because it moves with TD Mortgage Prime. <a href="${BMO_READI}">BMO</a> guarantees a selected fixed rate for 130 days from the guarantee start. Its "longest guarantee" footnote is dated September 15, 2025, so the ranking is not repeated here. Scotia and CIBC do not state a hold length on the pages checked. Purchase holds and renewal holds are separated in the <a href="/guides/mortgage-rate-hold-canada/">rate-hold guide</a>.`,
        `<a href="${RBC_PORT}">RBC</a> lets you port the rate to a new home. A larger loan blends the old rate with the current rate on the extra funds. A smaller port follows ordinary prepayment rules. <a href="${RBC_VAR}">A variable</a> can be ported with a firm sale and a firm purchase, generally with two months left, and the closings within 120 days. Fees, an appraisal, and sometimes more insurance premium still apply. <a href="${TD_BREAK}">TD</a> may port a fixed rate without a prepayment charge and blend any increase at current rates. <a href="${CIBC_TERMS}">CIBC's Alberta terms</a> use 60 days. Variable Flex is not transferred at the old rate. Other CIBC mortgages keep the old rate at the same size or smaller, and blend when the new loan is larger. You pay processing, insurance, legal, and appraisal costs. BMO and Scotiabank port windows were not on the pages checked.`,
      ],
    },
    {
      id: "heloc",
      heading: "The five readvanceable plans, and the charge on title",
      paragraphs: [
        `<a href="${FCAC_CHOOSE}">FCAC</a> separates a standard charge, which secures the mortgage you borrowed, from a collateral charge, which can secure that mortgage and other loans and may be registered for more than you take today. <a href="${FCAC_RENEW}">Switching at renewal</a> then means repaying every loan the charge secures and paying to discharge and re-register. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switch guide</a> is where that meets the stress-test exemption.`,
        `<a href="${RBC_HOME}">RBC Homeline</a> pairs a mortgage with a line you can repay any time, interest-only allowed. RBC's overview requires 20% equity or 20% down. <a href="${TD_FLEX}">TD FlexLine</a> goes to 80% of value. The revolving portion is TD Prime, interest-only or more, with no prepayment charge, and the closed portion keeps the 15% lump sum. Credit returns as you pay the balance down. Big-bank prime here is ${pct(PRIME_RATE)}. TD Mortgage Prime is TD's own, so "prime minus" is not comparable until the contract names which prime.`,
        `<a href="${SCOTIA_STEP}">Scotia STEP</a> can hold up to three mortgage components plus a line of credit, and you choose where a prepayment goes. The page does not state a loan-to-value cap, so none is invented. <a href="${BMO_READI}">BMO ReadiLine</a> goes to 80%, split between a mortgage and a revolving line at BMO prime plus an adjustment. Paying the mortgage down raises the revolving limit, and the 130-day guarantee applies to the fixed mortgage portion. <a href="${CIBC_HPP}">CIBC Home Power Plan</a> also goes to 80% with at least 20% equity, from $10,000, and CIBC's solicitor instructions register it as a collateral mortgage.`,
        "The convenience is the collateral charge. If you want the line and expect to stay, the product is doing its job. If you might move the mortgage at renewal for a rate, a standard charge leaves a cleaner file.",
      ],
    },
    {
      id: "verdict",
      heading: "Which borrower should care about which difference",
      paragraphs: [
        `Under 20% down, compare insured specials and price the premium first. On the ${scrapedAt} scrape the insured 5-year fixed rows are RBC ${showRate(pick("rbc", "fixed", "insured"))}, TD ${showRate(pick("td", "fixed", "insured"))}, BMO ${showRate(pick("bmo", "fixed", "insured"))}, and CIBC ${showRate(pick("cibc", "fixed", "insured"))}. Scotiabank has no insured 5-year row in that file. Those are one day's advertisements. The payment is the <a href="/tools/mortgage-calculator/">mortgage calculator</a>. Qualifying is the <a href="/guides/mortgage-stress-test/">stress test</a>.`,
        "Someone who might sell in year three should rank the penalty method ahead of a tenth of a point. RBC and TD publish a posted-rate differential that subtracts the original discount. CIBC's Alberta terms add that discount on top of three months' interest and also run a posted-rate differential. A buyer who will stay the full term can weigh the special, and can use the 10%, 15%, or 20% privilege, depending on the product, without triggering the clause.",
        "Someone who wants the line of credit should compare the cap that is actually published: TD, BMO, and CIBC say 80%. RBC's overview requires 20% equity. Scotia's STEP page does not state a cap. If the line is only a maybe, do not register the collateral charge on the purchase.",
        `A renewer who might switch should separate a straight switch from a blend. Shop with the <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> and the <a href="/rates/5-year-fixed/">5-year fixed</a> and <a href="/rates/variable/">variable</a> pages. A readvanceable plan with a line still drawn needs a lawyer and a longer runway. A closing more than 120 days out can use BMO's 130-day fixed guarantee, and should not assume Scotia or CIBC published a matching window. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">monoline and credit-union guide</a> is the comparison once you leave the branch.`,
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
      question: "Which Big Five bank has the lowest 5-year rate?",
      answer:
        "Whichever row is lowest that day, in the column that matches your file. A missing row is not a high rate. No Big Five 5-year fixed cell in this file has both 10 reports and a posted rate, so no 5-year fixed discount is quoted.",
    },
    {
      question: "Do all five banks calculate a break fee from the posted rate?",
      answer:
        "RBC and TD do, for a closed fixed mortgage: posted rate minus the discount you were given. CIBC's Alberta terms do too, and they also add the discount to the three-month alternative. BMO and Scotiabank publish a differential and do not spell it out that way on the pages checked. A variable closed charge is generally three months' interest.",
    },
    {
      question: "Is a Homeline, FlexLine, STEP, ReadiLine, or Home Power Plan just a mortgage with a nickname?",
      answer:
        "No. Each one pairs a mortgage portion with a revolving line, and paying the mortgage down can restore room on the line. TD, BMO, and CIBC publish a cap of 80% of the home's value. The registration is a collateral charge, or is described that way in CIBC's solicitor instructions. Switching lenders later means dealing with every loan the charge secures.",
    },
    {
      question: "How long will a Big Five bank hold a rate?",
      answer:
        "RBC and TD publish 120 days on a fixed purchase. BMO publishes 130 days. RBC applies a lower rate automatically. TD makes you ask. Scotia and CIBC did not state a length. TD's separate renewal rule lets you renew 120 days before maturity without a prepayment charge.",
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
