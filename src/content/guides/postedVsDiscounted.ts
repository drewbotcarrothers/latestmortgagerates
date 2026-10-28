import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO_BATCH2,
  IRD_ILLUSTRATION as ird,
  RATE_SHEET as sheet,
  REPORTED,
  SHEET_PENALTY as pen,
  SOURCES,
  SPREAD,
  cad,
  pct,
  reportedRatesParagraph,
} from "./shared";
import { BOC_POLICY_RATE } from "../../lib/primeRate";

export const postedVsDiscounted: InDepthGuide = {
  slug: "posted-vs-discounted-mortgage-rates",
  path: "/guides/posted-vs-discounted-mortgage-rates/",
  metaTitle: "Posted vs Discounted Mortgage Rates in Canada | Latest Mortgage Rates",
  description:
    "Why Canadian banks publish a posted mortgage rate above the rate they actually offer, how the discount works, how that discount is reused in an IRD penalty, and how to read a rate sheet.",
  keywords:
    "posted vs discounted mortgage rates Canada, mortgage rate discount, IRD posted rate, how to read a bank rate sheet, big bank special rate",
  cardTitle: "Posted vs discounted rates",
  cardDescription:
    "Why the shelf rate exists, how a discount is applied, and how that same discount comes back in a prepayment penalty.",
  h1: "Posted vs discounted mortgage rates",
  dek: "The number in the bold type and the number in the contract are often different. The gap is the discount. On many bank mortgages that discount is saved, and it is used again if you break the term.",
  sourcesLine:
    "Sources: FCAC, the rate rows scraped from lender pages, and the reported-rate file on this site. Your information box names the comparison rate.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH2,
  howTo: {
    name: "How to read a Canadian bank mortgage rate sheet",
    description:
      "Separate the posted rate from the special, write down the discount, and ask which of those rates the penalty will use.",
    steps: [
      {
        name: "Find both columns",
        text: "A chartered-bank sheet usually shows a posted rate and a special, or discounted, rate for the same term. Write both down. The special is the one a qualified borrower is being offered in the advertisement. The posted rate is the shelf.",
      },
      {
        name: "Subtract",
        text: "Posted minus special is the advertised discount. A further discretionary discount may still be available. The contract rate is the only one that matters, and it should be in the commitment.",
      },
      {
        name: "Split insured from uninsured",
        text: "The same term often has two specials. A high-ratio insured mortgage and a conventional mortgage are not the same row.",
      },
      {
        name: "Ask about the penalty",
        text: "Ask whether an interest rate differential will subtract your original discount from a posted comparison rate. That sentence is worth more than a small difference in the special.",
      },
    ],
  },
  sections: [
    {
      id: "two-numbers",
      heading: "Two numbers, one term",
      paragraphs: [
        "A posted rate is the shelf price a lender publishes for a term. A discounted rate, often labelled a special, is the lower number on the same row, or a further reduction a borrower negotiates off that special. <a href=\"" + SOURCES.fcacPenalty + "\">FCAC</a> describes it in one paragraph: lenders advertise posted rates for the terms they offer, the rate in your contract may be higher or lower than the posted rate, and a lower contract rate is a discounted rate. The discount is not a feeling that you bargained well. It is posted minus contract, on the day you signed, for the term you signed.",
        "Banks keep the shelf for a few reasons that show up in the contract, not in the marketing. The special can change every week while the posted rate moves less often, so the bank can advertise \"off posted\" without reprinting the whole grid. The posted rate is also an input. Many prepayment clauses, especially at the big banks, calculate an interest rate differential from posted rates and then subtract the discount you were originally given. A rate that nobody qualified is expected to pay can still decide the fee for leaving. Posted rates are not the stress test. The stress test is the greater of the contract rate plus 2 points and 5.25%, when it applies. Posted rates are not prime. Prime is the moving reference for a variable mortgage.",
        reportedRatesParagraph(),
      ],
    },
    {
      id: "sheet",
      heading: "A rate sheet from the file we scrape",
      paragraphs: [
        `The rows below are from the rate snapshot scraped on ${sheet.scrapedAt}. They are the lender's public numbers that day, not a median of what borrowers later report. On TD's 5-year fixed uninsured row, the special is ${pct(sheet.tdFixedSpecial)} and the posted rate stored beside it is ${pct(sheet.tdFixedPosted)}. The advertised discount is ${pct(sheet.tdFixedDiscount)}. TD's 3-year fixed uninsured special is ${pct(sheet.tdThreeSpecial)} against a posted rate of ${pct(sheet.tdThreePosted)}. CIBC's 5-year fixed posted rate on the uninsured and insured rows is ${pct(sheet.cibcPosted)}. The uninsured special is ${pct(sheet.cibcSpecial)}, a discount of ${pct(sheet.cibcDiscount)}. The insured special is ${pct(sheet.cibcInsuredSpecial)}, a discount of ${pct(sheet.cibcInsuredDiscount)}. One posted rate, two specials. The insured column is not a kinder version of the same product. It is a different loan, with an insurer in the file.`,
        `RBC's scrape the same day did not store a separate posted figure on these rows. The specials it did store, in the special section of the page, are a 5-year fixed uninsured rate of ${pct(sheet.rbcFixed)}, a 5-year fixed insured rate of ${pct(sheet.rbcInsured)}, a 5-year variable uninsured rate of ${pct(sheet.rbcVariable)}, and a 5-year variable insured rate of ${pct(sheet.rbcVariableInsured)}. Read that as the advertisement, not as the shelf used in a penalty clause. If the posted column is missing from a comparison table, including ours, ask the lender for it before you estimate a break fee. The pages for <a href="/lenders/td/">TD</a>, <a href="/lenders/cibc/">CIBC</a>, and <a href="/lenders/rbc/">RBC</a> show the rows we track. The <a href="/">homepage</a> is the full snapshot.`,
        `Borrowers report rates below those specials. In the 30-day reported file, ${ (SPREAD.fixedShare * 100).toFixed(1) }% of 5-year fixed reports with insured status not stated are below the Big Five figure beside that cell (N = ${SPREAD.fixedShareN}), and ${ (SPREAD.variableShare * 100).toFixed(1) }% of the matching variable reports are below theirs (N = ${SPREAD.variableShareN}). The rounded 5-year fixed median is ${REPORTED.fixedMedian} against a Big Five median of ${REPORTED.fixedBig5}. The rounded 5-year variable median is ${REPORTED.variableMedian} against ${REPORTED.variableBig5}. The gap from a bank's own special down to a reported median is a second discount, discretionary and unpublished. It is self-reported by Canadian borrowers online. See <a href="/real-mortgage-rates/">real mortgage rates</a> for the distribution and the <a href="/guides/negotiate-mortgage-rate/">negotiation guide</a> for the conversation. Do not subtract the two gaps twice and call the result your offer.`,
      ],
    },
    {
      id: "variable",
      heading: "A variable discount is a discount off prime",
      paragraphs: [
        `A fixed discount is a number of points off a posted fixed rate, frozen at funding. A variable discount is a number of points off prime, and prime moves. In the reported file the median prime discount on the 5-year variable cell, insured status not stated, is 0.90 points. Big-bank prime on this site is ${pct(SPREAD.prime)}. Prime minus 0.90 is ${pct(SPREAD.variableMedian)}, which is the rounded median itself. The discount stays. The rate moves when prime moves. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> prices what that movement does to a payment.`,
        `Which prime is the whole argument. The headline prime on this site is the big-bank prime of ${pct(SPREAD.prime)}. The overnight target is ${pct(BOC_POLICY_RATE)}. TD publishes its own mortgage prime, higher than that headline. A contract that says "prime minus 0.90" at TD is not the same rate as "prime minus 0.90" at a bank that uses the lower prime. RBC's variable specials above are already effective rates, ${pct(sheet.rbcVariable)} uninsured and ${pct(sheet.rbcVariableInsured)} insured, not a discount you still have to subtract. When a sheet shows both "P − 1.00" and an effective rate, trust the effective rate only after you confirm the P. The <a href="/rates/variable/">variable rate page</a> is the shelf. The commitment is the prime.`,
      ],
    },
    {
      id: "ird",
      heading: "How the discount comes back as a penalty",
      paragraphs: [
        `FCAC's description of the interest rate differential is the reason to care about a posted rate you will never pay. The lender compares your contract rate with another rate. That other rate can be the current posted rate for a term close to the time you have left, or that posted rate minus the discount you were originally given. Subtracting the discount makes the comparison rate lower, the gap larger, and the fee larger. The penalty is the higher of that differential and three months' interest. The <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> walks the arithmetic in full, including the labelled case where the posted-rate method costs thousands more than a discounted comparison. The <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> uses the simple formulas.`,
        `Apply the method to TD's own rows, on a labelled balance of ${cad(pen.balance)}, with 36 months left. Contract rate ${pct(pen.contract)}, the 5-year special. Original discount ${pct(pen.discount)}, from the posted rate on that same row. Today's 3-year posted rate on TD's sheet is ${pct(sheet.tdThreePosted)}. Comparison rate = ${pct(sheet.tdThreePosted)} − ${pct(pen.discount)} = ${pct(pen.comparison)}. The contract rate is ${pct(pen.contract)}. The comparison rate is higher, so the differential is zero. Three months' interest is ${cad(pen.balance)} × ${pct(pen.contract)} × 3/12 = ${cad(pen.threeMonths)}. You would pay ${cad(pen.threeMonths)}, not a five-figure IRD. In a year when posted rates have not fallen away from your contract, the scary method can still produce a zero differential. The fee falls back to three months' interest. That is worth knowing before you refuse a bank solely because its penalty clause mentions posted rates.`,
        `The other year is the one the clause is built for. The labelled illustration in the penalty guide keeps the same balance math: contract ${pct(ird.contract)}, original posted ${pct(ird.originalPosted)}, discount ${pct(ird.discount)}, current posted for the remaining term ${pct(ird.currentPosted)}, comparison ${pct(ird.postedComparison)}. The IRD is ${cad(ird.postedIrd)}. Three months' interest is ${cad(ird.threeMonths)}. A comparison that uses a discounted replacement rate of ${pct(ird.discountedComparison)} instead produces ${cad(ird.fairIrd)}. The method, not the balance, is the ${cad(ird.methodGap)} gap. A borrower who locked a high fixed rate in 2023 or 2024 and wants out in 2026 is in that story. A borrower signing TD's current special, on these rows, is in the paragraph above. Ask which story your contract will tell in three years. The question, in writing, is: will the IRD use the posted rate minus my original discount, or the rate you would offer today for the time I have left?`,
      ],
    },
    {
      id: "read",
      heading: "How to read the sheet before you sign",
      paragraphs: [
        "Start with the term and the open-or-closed label. An open rate is higher because the penalty for leaving is waived. A closed special is the number people compare, and it is the one with the penalty. Then split insured from uninsured, as the CIBC row does. A broker who quotes the insured special on a file with 20% down is quoting a product you may not be allowed to have. Then find the posted rate on the same term, even if you never expect to pay it, because the penalty may. Then read the hold. A special that expires Thursday is not a rate you can renew into next month.",
        "Variable rows need the prime, the discount, and whether the payment changes. Fixed rows need the compound period. Canadian mortgages are usually compounded semi-annually, and a rate sheet rarely shows the resulting payment. Use the <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a> for the payment and the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> if the sheet is being used to answer a renewal letter. A rate that is only for a purchase, or only for a switch, will say so in a footnote. A rate that requires a chequing account, a credit card, or a minimum balance is a bundle. Price the bundle.",
        `The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">monoline comparison</a> matters here. A lender that publishes the rate it actually funds, with no posted shelf above it, often calculates the differential against that rate. The fee for leaving tracks the market the borrower can see. A big-bank special can still be the right product when you want the branch, the line of credit, and you expect to finish the term. It is a weaker product when you might sell in year three and the clause uses the posted-rate method. Insured status, if you are putting less than 20% down, goes through the <a href="/tools/cmhc-insurance-calculator/">CMHC insurance calculator</a> and the <a href="/rates/insured/">insured</a> shelf. At 20% down or more, use the <a href="/rates/uninsured/">uninsured</a> shelf. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switch guide</a> is how you leave at maturity, when the posted-rate penalty is no longer the toll. The <a href="/disclaimer/">disclaimer</a> applies to every figure on this page.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The TD, CIBC, and RBC figures are the public rows in this site's rate snapshot. They will move. The penalty method will not move unless the contract says so.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.fcacPenalty}">FCAC, prepayment penalties</a>. Posted rates, discounted rates, and the two ways to pick a comparison rate for the IRD.`,
        `<a href="${SOURCES.fcacPrepare}">FCAC, preparing to get a mortgage</a>. The qualifying rate is the contract plus 2 points or 5.25%, not the posted rate.`,
        `<a href="${SOURCES.interestAct}">Interest Act, section 10</a>. The three-month cap after five years, when the original term was longer than five years, for an individual borrower.`,
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a>. The stress test uses the contract rate, not the posted shelf.`,
        `<a href="/lenders/td/">TD rate page on this site</a>, <a href="/lenders/cibc/">CIBC</a>, and <a href="/lenders/rbc/">RBC</a>. The scraped rows behind the examples.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is the posted rate the rate the bank expects me to pay?",
      answer:
        "No. FCAC describes the posted rate as the advertised rate for a term, and a lower contract rate as a discounted rate. On TD's 5-year fixed row in our October 23, 2026 snapshot, the posted rate is 6.14% and the special is 5.39%. Borrowers also report rates below the specials. The contract in your commitment is the rate you pay. The posted rate still matters if the penalty clause uses it.",
    },
    {
      question: "Does a bigger discount always mean a better mortgage?",
      answer:
        "It means a lower contract rate relative to that lender's shelf. CIBC's insured and uninsured 5-year specials in the same snapshot carry different discounts off the same posted rate. The larger discount can also make a future interest rate differential larger, if the clause subtracts that discount from the comparison rate. Compare the contract rate, the penalty method, and the prepayment privilege. The discount is one of those three.",
    },
    {
      question: "Why is my break fee so high when rates have fallen?",
      answer:
        "Many bank contracts set the comparison rate at today's posted rate for the remaining term, minus the discount you received at the start. The comparison rate is then lower than the rate a new customer is offered, and the gap charged to you is wider. On the labelled illustration used on this site, that method produced a much larger penalty than a comparison with a discounted replacement rate. If rates have not fallen, the same method can produce a zero differential, and you pay three months' interest instead.",
    },
    {
      question: "The bank's website shows one 5-year rate. Is that the posted rate?",
      answer:
        "Sometimes it is the special, and the posted rate is in another column or another tab. RBC's rows in our snapshot are stored as specials, without a separate posted figure. TD's and CIBC's rows include both. If you cannot see the posted rate, ask for it before you estimate a penalty. A single bold number on a landing page is not the whole sheet.",
    },
    {
      question: "Are the rates people report the same thing as a discounted rate?",
      answer:
        "They are a third number. The posted rate is the shelf. The special is the advertised discount. The rates on the real-mortgage-rates page are self-reported by Canadian borrowers online, and the median often sits below the special. They are unverified, and they are not an offer. Use the renewal offer checker to place one written quote on that distribution. Use the lender's commitment for the rate you will sign.",
    },
  ],
};
