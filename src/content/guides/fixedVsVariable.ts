import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO_BATCH2,
  POSTED_HISTORY as hist,
  RATE_CONTEXT,
  SOURCES,
  SPREAD,
  TERM_CHOICE as t,
  cad,
  pct,
  reportedRatesParagraph,
} from "./shared";
import { formatAsOf } from "../../lib/communityRates";

export const fixedVsVariable: InDepthGuide = {
  slug: "fixed-vs-variable-mortgage-2026",
  path: "/guides/fixed-vs-variable-mortgage-2026/",
  metaTitle: "Fixed vs Variable Mortgage in 2026 | Latest Mortgage Rates Canada",
  description:
    "A 2026 comparison of fixed and variable Canadian mortgages using this site's posted history and rates self-reported by borrowers: the spread, a break-even hike, and what a rising prime does to the payment.",
  keywords:
    "fixed vs variable mortgage Canada 2026, prime rate discount, mortgage break even, variable trigger rate, Bank of Canada mortgage",
  cardTitle: "Fixed vs variable in 2026",
  cardDescription:
    "The spread in this site's rate file, a break-even if prime rises, and the difference between a payment that moves and a payment that does not.",
  h1: "Fixed vs variable mortgage in 2026",
  dek: "A fixed rate holds the payment still. A variable rate starts lower, in the file we publish, and moves when prime moves. The useful question is how far prime has to go before the cheaper start is gone.",
  sourcesLine:
    "Sources: Bank of Canada, OSFI, FCAC, and this site's posted snapshot and reported-rate file. The commitment says whether your payment changes.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH2,
  howTo: {
    name: "How to compare a fixed and a variable mortgage in Canada",
    description:
      "Read the starting spread, price a flat prime and a rising prime on the same balance, and check the penalty and the qualifying rate before you pick a term.",
    steps: [
      {
        name: "Write down the starting rates and which prime applies",
        text: "Put the fixed offer next to the variable offer. For the variable, write the discount off prime and which prime the contract uses.",
      },
      {
        name: "Price five years with prime unchanged",
        text: "Compare the monthly payment and the interest over the term on the same balance and the same amortization.",
      },
      {
        name: "Price a rise and a cut",
        text: "Add the hike that makes the variable rate equal the fixed rate on day one. Then try a slower path, a quarter point a year, and one cut.",
      },
      {
        name: "Read the penalty and the payment rule",
        text: "Fixed contracts usually charge the greater of three months' interest and an interest rate differential. Variable contracts usually charge three months' interest. Confirm whether the payment itself changes.",
      },
    ],
  },
  sections: [
    {
      id: "choice",
      heading: "What you are choosing in 2026",
      paragraphs: [
        "A fixed mortgage sets the rate for the term. The payment calculated from that rate does not change because the Bank of Canada met. A variable mortgage sets a discount, or occasionally a premium, against prime. When prime changes, the contract rate changes by the same amount. Two products hide inside that sentence. On an adjustable-rate mortgage the payment is recalculated. On a variable-rate mortgage with a fixed payment, the payment stays put and the split between interest and principal changes. The second kind can hit a trigger rate, where the interest alone is larger than the payment. The commitment uses one of those two designs. The word variable on a rate sheet does not tell you which.",
        `${RATE_CONTEXT} Through the decisions published on the <a href="${SOURCES.bocPolicy}">Bank of Canada's policy-rate page</a>, the target has been 2.25% at every announcement from October 29, 2025 through September 2, 2026. Prime on this site has sat at ${pct(SPREAD.prime)} across that hold. A variable borrower in 2026 has not been collecting monthly surprises from the overnight rate. The fixed borrower has been living with a different market. Bond yields move the price of a new fixed term between Bank of Canada dates. That is why a five-year fixed quote in July and a five-year fixed quote in October can disagree while the variable discount still reads as the same number of points off prime.`,
        "Nothing below is a forecast of the October 28, 2026 announcement. The arithmetic uses the rates in our files on the day this page was reviewed, and it says which file. A lender's offer can sit away from both.",
      ],
    },
    {
      id: "file",
      heading: "The spread in the rate files",
      paragraphs: [
        reportedRatesParagraph(),
        `The rounded gap between those two medians is ${pct(SPREAD.gap)}. The variable median of ${pct(SPREAD.variableMedian)} is ${pct(SPREAD.discount)} under big-bank prime of ${pct(SPREAD.prime)}, and the reported-rate file's own median prime discount on that 5-year variable cell is 0.90 points. In the same 30-day window, ${ (SPREAD.fixedShare * 100).toFixed(1) }% of the 5-year fixed reports with insured status not stated sit below the Big Five posted median (N = ${SPREAD.fixedShareN}), and ${ (SPREAD.variableShare * 100).toFixed(1) }% of the matching variable reports do (N = ${SPREAD.variableShareN}). Those shares are self-reported by Canadian borrowers online. They describe the file. They do not describe the rate you will be given.`,
        `Inside the same file, the week of September 14, 2026 shows a 5-year fixed median of ${pct(SPREAD.earlyWeek.fixed)} (N = ${SPREAD.earlyWeek.fixedN}) and a variable median of ${pct(SPREAD.earlyWeek.variable)} (N = ${SPREAD.earlyWeek.variableN}). The week of October 12 shows ${pct(SPREAD.lateWeek.fixed)} fixed (N = ${SPREAD.lateWeek.fixedN}) and ${pct(SPREAD.lateWeek.variable)} variable (N = ${SPREAD.lateWeek.variableN}). The variable row is ${pct(SPREAD.variableMedian)} at both ends. The fixed row is higher in October. The posted snapshot tells the same story from lender pages. Across ${hist.days} days from ${formatAsOf(hist.from)} to ${formatAsOf(hist.to)}, prime stays ${pct(hist.prime)}. The lowest uninsured 5-year fixed rate ranges from ${pct(hist.fixedUninsuredBestMin)} to ${pct(hist.fixedUninsuredBestMax)} and ends at ${pct(hist.fixedUninsuredBestLast)}. The lowest insured 5-year variable ranges from ${pct(hist.variableInsuredBestMin)} to ${pct(hist.variableInsuredBestMax)}. Best-in-file is not a median and not an offer. It shows fixed postings moving while prime did not. Reported rates are on <a href="/real-mortgage-rates/">real mortgage rates</a>. Posted shelves are on <a href="/rates/5-year-fixed/">5-year fixed</a> and <a href="/rates/variable/">variable</a>. The <a href="/compare/fixed-vs-variable/">comparison page</a> puts a live pair side by side.`,
      ],
    },
    {
      id: "flat",
      heading: "If prime does not move",
      paragraphs: [
        `Same mortgage, two contracts, payments recalculated the way an adjustable-rate mortgage does it. Balance ${cad(t.balance)}. Amortization ${t.years} years, which is also the remaining amortization, so the payment formula matches the <a href="/tools/mortgage-calculator/">mortgage calculator</a>. Fixed rate ${pct(t.fixed)}, the rounded reported 5-year fixed median. Variable rate ${pct(t.variable)}, the rounded reported 5-year variable median, held flat. The fixed payment is ${cad(t.matched.payments[0].payment)}. The variable payment is ${cad(t.flat.payments[0].payment)}. The difference is ${cad(t.paymentGap)} a month, about ${cad(t.paymentGap * 60)} of payments over five years.`,
        `Interest over those 60 months is about ${cad(t.interestGap)} higher on the fixed contract. The fixed borrower also owes about ${cad(t.balanceGap)} more at the end of the five years, because more of each payment went to interest. Canadian disclosures usually compound semi-annually, so a lender's figure can differ by a few dollars. The gap is the point. On a hold from the Bank of Canada, the variable borrower in this file is paid, every month, for taking the risk that the hold ends.`,
        `That payment is not the qualifying payment. <a href="${SOURCES.osfiMqr}">OSFI's minimum qualifying rate</a> for an uninsured mortgage at a federally regulated lender is the greater of the contract rate plus 2 percentage points and 5.25%. Both of these contracts clear the floor. The variable file qualifies at ${pct(t.qualifyingVariable)}, with a payment near ${cad(t.qualifyingVariablePayment)} on this balance. The fixed file qualifies at ${pct(t.qualifyingFixed)}, with a payment near ${cad(t.qualifyingFixedPayment)}. A lower contract rate is easier to qualify on while the floor is not binding. The <a href="/guides/mortgage-stress-test/">stress test guide</a> works the debt ratios. The <a href="/tools/stress-test-qualifier/">stress test qualifier</a> runs a file. Insured and uninsured contract rates are different shelves: use the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> pages, and the <a href="/tools/cmhc-insurance-calculator/">CMHC insurance calculator</a> only when the down payment is under 20%.`,
      ],
    },
    {
      id: "breakeven",
      heading: "The hike that erases the head start",
      paragraphs: [
        `The day-one break-even is the gap itself. If prime rises ${pct(SPREAD.gap)} immediately and the discount stays ${pct(SPREAD.discount)}, the variable contract becomes ${pct(t.fixed)}, the same as the fixed median used here. The payment becomes ${cad(t.matched.payments[0].payment)} and the five-year interest matches the fixed case. Any smaller immediate, permanent hike leaves the variable borrower ahead on this illustration. Any larger one leaves the fixed borrower ahead. Prime today is ${pct(SPREAD.prime)}, so that break-even prime is ${pct(SPREAD.prime + SPREAD.gap)}. A single Bank of Canada move has recently been a quarter point. The ${pct(SPREAD.gap)} gap is more than three of those steps, taken all at once, on the day the term starts, and then held for five years.`,
        `A slower path is the more honest stress. Raise the variable rate a quarter point at each anniversary and leave the discount alone: ${pct(t.variable)} in year one, then ${pct(t.variable + 0.25)}, ${pct(t.variable + 0.5)}, ${pct(t.variable + 0.75)}, and ${pct(t.variable + 1)} in year five. The payment, recalculated on the remaining amortization, steps from ${cad(t.gradual.payments[0].payment)} to ${cad(t.gradual.payments[1].payment)}, ${cad(t.gradual.payments[2].payment)}, ${cad(t.gradual.payments[3].payment)}, and ${cad(t.gradual.payments[4].payment)}. The year-five payment is above the fixed payment of ${cad(t.matched.payments[0].payment)}. Cumulative interest over the 60 months is still about ${cad(t.gradualInterestSaved)} lower than the fixed contract, because the first years were cheap. The payment can cross before the interest does. A household that can afford the crossed payment, and that cares about the five-year interest bill, is still ahead on this path. A household that needed the payment to stay at ${cad(t.flat.payments[0].payment)} is not.`,
        `A cut runs the other way. Drop prime half a point on day one and hold it, and the variable rate is ${pct(t.variable - 0.5)}. The payment is ${cad(t.cut.payments[0].payment)}. Interest over five years is about ${cad(t.cutInterestSaved)} lower than the flat variable case, and further below the fixed case. The October 28 decision can do that, or the opposite, or nothing. The fixed contract ignores it until renewal. Price the renewal of either term with the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> and the <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> when the five years are the decision, not the monthly payment.`,
      ],
    },
    {
      id: "trigger",
      heading: "When the payment is not allowed to change",
      paragraphs: [
        `Some variable contracts keep the payment fixed at the amount set on day one. On this ${cad(t.balance)} illustration the opening payment is ${cad(t.flat.payments[0].payment)}. Interest on the full balance equals that payment when the contract rate is about ${pct(t.triggerRate)}. With a ${pct(SPREAD.discount)} discount, that is prime near ${pct(t.triggerPrime)}, about ${pct(t.primeRiseToTrigger)} above today's ${pct(SPREAD.prime)}. Past that line, the payment does not cover the interest, the balance starts to grow, and the lender's trigger-rate clause tells you what happens next. Common versions ask you to raise the payment, make a lump sum, or convert to a fixed rate. The clause is in the contract. As the balance falls, the trigger rate creeps up, so the day-one figure is the strictest one.`,
        `Qualifying the variable contract at ${pct(t.qualifyingVariable)} produces a payment near ${cad(t.qualifyingVariablePayment)}. That is the test for getting the loan. The trigger rate is the test for a fixed payment that no longer covers interest. An adjustable-rate mortgage raises the payment instead. Ask which of the two you were offered. A conversion option locks the lender's fixed rate on the day you convert.`,
      ],
    },
    {
      id: "penalty",
      heading: "The penalty is part of the rate",
      paragraphs: [
        `A fixed borrower who may sell, separate, or refinance is not only buying a payment that sits still. <a href="${SOURCES.fcacPenalty}">FCAC</a> describes the usual closed-term penalty as the higher of three months' interest and the interest rate differential. Lenders reach for the differential when the contract rate is above current rates. Many bank contracts measure that differential off posted rates and then subtract the original discount, which makes the fee larger than the gap a new customer can see. The <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> works both methods. The <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted guide</a> is why the shelf rate exists. The <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> runs the simple version.`,
        `A variable contract usually has no interest rate differential. The typical charge is three months' interest. That is a reason variable wins for a household that expects to break the term, even when the starting rate is not the whole argument. It is a weak reason for a household that will finish the term and cannot absorb a higher payment. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">comparison of banks, monolines, and credit unions</a> is about that penalty clause as much as it is about the rate. Read the information box. A reputation is not your commitment.`,
        `Insured status changes the contract rate more often than it changes this logic. A high-ratio loan is insured, and the premium is already in the balance. The term choice does not refund it. A straight renewal later is a different decision from the one on this page, and the stress test does not automatically come back. That exemption is described in the renewal playbook. If the plan is to break the term early and borrow more, you are in a refinance, and the qualifying rate applies again.`,
      ],
    },
    {
      id: "tools",
      heading: "Where to check a number",
      paragraphs: [
        `Use the <a href="/tools/mortgage-calculator/">mortgage calculator</a> for a payment at one rate, and run it twice, once at the fixed offer and once at the variable offer. Use the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> if the quote in your hand is a renewal rather than a purchase. Use the <a href="/tools/cmhc-insurance-calculator/">CMHC insurance calculator</a> when the down payment is under 20%, then remember that the calculator's premium bands and the insurer's current schedule can differ. The <a href="/real-mortgage-rates/">real mortgage rates</a> page is the reported distribution behind the medians on this page. Posted shelves are on <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a>. The figures people report are self-reported by Canadian borrowers online. The <a href="/disclaimer/">disclaimer</a> applies: this is the arithmetic, and the commitment is the contract.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The payments use this site's formula, annual rate divided by 12. Confirm the semi-annual figure, the prime, and the penalty method with the lender before you sign.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. Target overnight rate held at 2.25%. Bank Rate 2.50%. Deposit rate 2.20%. Next announcement October 28, 2026.`,
        `<a href="${SOURCES.bocPolicy}">Bank of Canada, policy interest rate</a>. The target has been 2.25% at each announcement from October 29, 2025 through September 2, 2026.`,
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a>. Greater of the contract rate plus 2% or 5.25% for uninsured mortgages at federally regulated lenders.`,
        `<a href="${SOURCES.fcacPenalty}">FCAC, prepayment penalties</a>. The greater of three months' interest and the IRD, and the posted-rate method.`,
        `<a href="${SOURCES.fcacPrepare}">FCAC, preparing to get a mortgage</a>. The qualifying rate for insured and uninsured mortgages when the stress test applies.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is the variable rate always cheaper in 2026?",
      answer:
        "In this site's reported-rate file the rounded 5-year variable median is below the rounded 5-year fixed median, by 0.80 points where insured status was not stated. That is a starting spread, measured on rates self-reported by Canadian borrowers online. It lasts only while prime stays where it is. A rise in prime of that same 0.80 points, immediately and for the whole term, removes the advantage on the illustration in this guide.",
    },
    {
      question: "Does the Bank of Canada set my fixed rate?",
      answer:
        "It sets the overnight rate. Prime at the big banks follows that rate, and a variable mortgage follows prime. A new fixed rate is priced off the lender's funding cost, which tracks the bond market and can move between announcements. From October 29, 2025 through September 2, 2026 the overnight target stayed at 2.25%. Fixed postings on this site still moved inside that window.",
    },
    {
      question: "What is a trigger rate?",
      answer:
        "On a variable mortgage whose payment does not change, the trigger rate is the contract rate at which interest on the balance is at least as large as the payment. On the $500,000 illustration here, that rate is about 6.04% at the start, which is prime near 6.94% if the discount is 0.90 points. An adjustable-rate mortgage raises the payment instead of building toward a trigger.",
    },
    {
      question: "Which one is easier to break?",
      answer:
        "Variable contracts usually charge three months' interest and skip the interest rate differential. Fixed contracts usually charge the higher of three months' interest and the differential, and many bank differentials use posted rates. FCAC describes both. The information box in your commitment is the version you will be charged. A slightly lower fixed rate can be the expensive product if you sell before maturity.",
    },
    {
      question: "Will I be stress-tested at a higher rate if I pick variable?",
      answer:
        "You are qualified at the greater of your contract rate plus 2 points and 5.25%, when the stress test applies. A lower variable contract qualifies at a lower rate than a higher fixed contract, as long as both sit above the floor. The payment you qualify on is still higher than the payment you start with. Adding money or years later can bring the test back. A straight switch at renewal has its own rule, covered in the renewal playbook.",
    },
  ],
};
