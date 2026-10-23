import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import { calculateMonthlyPayment } from "../../lib/mortgageMath";
import { PRIME_RATE } from "../../lib/primeRate";
import { guideTable } from "./guideTable";

const REVIEWED = "2026-10-23T20:00:00Z";

const RBC_HOLD = "https://www.rbcroyalbank.com/services/mortgages/mortgage-rates-s-or.html";
const TD_HOLD = "https://www.td.com/ca/en/personal-banking/products/mortgages/first-time-home-buyer/pre-approval";
const TD_RATES = "https://www.td.com/ca/en/personal-banking/products/mortgages/mortgage-rates";
const TD_BREAK = "https://www.td.com/ca/en/personal-banking/products/mortgages/what-happens-break-mortgage-penalty";
const BMO_READI = "https://www.bmo.com/en-ca/main/personal/mortgages/homeowner-readiline/";
const FCAC_RENEW = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/renew-mortgage.html";

const holdTable = guideTable(
  ["Lender", "What the page says", "If fixed rates fall during the hold"],
  [
    ["RBC", "Up to 120 days on a fixed-rate residential purchase mortgage", "Automatic: you get the lowest rate during the hold"],
    ["TD", "Up to 120 days, and only on a fixed rate", "You have to ask; it is not automatic"],
    ["BMO", "130 days from the date the rate guarantee starts, on a fixed rate", "The guarantee page does not describe an automatic reduction"],
    ["Scotiabank", "No hold length on the prepayment or STEP pages reviewed", "Not stated"],
    ["CIBC", "No hold length on the Home Power Plan page or the Alberta terms reviewed", "Not stated"],
  ],
);

const exampleBalance = 500_000;
const heldRate = REPORTED.fixedMedianNumber;
const floatedRate = Math.round((heldRate - 0.2) * 100) / 100;
const heldPayment = calculateMonthlyPayment(exampleBalance, heldRate, 25);
const floatedPayment = calculateMonthlyPayment(exampleBalance, floatedRate, 25);
const paymentGap = heldPayment - floatedPayment;

export const rateHold: InDepthGuide = {
  slug: "mortgage-rate-hold-canada",
  path: "/guides/mortgage-rate-hold-canada/",
  metaTitle: "Mortgage Rate Holds in Canada (2026): 120 Days and Float-Downs",
  description:
    "How Canadian mortgage rate holds work in 2026: the RBC, TD, and BMO windows, when a hold is honoured, how a float-down works, and why a renewal statement is a different promise.",
  keywords:
    "mortgage rate hold Canada, 120 day rate hold, mortgage pre-approval rate guarantee, float down mortgage rate, rate hold at renewal Canada",
  cardTitle: "Mortgage rate holds",
  cardDescription:
    "RBC and TD publish 120-day fixed holds and BMO publishes 130. A hold is honoured only if you fund in time and still qualify, and a renewal statement is a shorter, different promise.",
  h1: "Mortgage rate holds in Canada",
  dek: "A hold is a written rate with an expiry, not a feeling that you were pre-approved. The banks that publish a length use 120 or 130 days, and only on a fixed rate.",
  sourcesLine:
    "Sources: RBC, TD, and BMO rate-guarantee pages, TD's early-renewal page, and FCAC's renewal rules. The commitment in your file controls the date.",
  reviewedIso: REVIEWED,
  howTo: {
    name: "How to use a Canadian mortgage rate hold",
    description: "Take a written hold, read whether a lower rate is applied for you, and fund before the expiry.",
    steps: [
      {
        name: "Get the hold in writing",
        text: "The letter should name the rate, the term, the product, the expiry date, and whether a lower rate is applied automatically.",
      },
      {
        name: "Match it to the funding date",
        text: "Count the days from the hold to the day the mortgage will be funded. RBC and TD publish 120 days. BMO publishes 130 from the date the guarantee starts.",
      },
      {
        name: "Ask, if the float-down is not automatic",
        text: "TD says you can ask to move to a lower fixed rate. RBC applies the lowest fixed rate during the hold without a separate request.",
      },
      {
        name: "Keep a renewal statement in its own pile",
        text: "A renewal statement sent at least 21 days before maturity cannot be raised before the renewal date. That is not a 120-day purchase hold.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "What a rate hold actually promises",
      paragraphs: [
        "A Canadian mortgage rate hold is a written promise to lend at a named rate if you complete that mortgage before the promise expires and you still meet the conditions. RBC and TD both publish holds of up to 120 days on fixed-rate purchase mortgages, and BMO publishes 130 days from the date its rate guarantee starts.",
        "The promise is narrower than a pre-approval letter makes it sound. It usually covers one product, one term, and one closing window. It does not freeze every rate the lender posts, it does not survive a failed condition, and a renewal offer from your current lender is a different document with its own dates.",
      ],
    },
    {
      id: "lengths",
      heading: "Hold lengths the big banks publish",
      paragraphs: [
        "These lengths come from each bank's own pages, read on 23 October 2026. Scotiabank and CIBC describe prepayments, ports, and readvanceable plans in detail and do not state a hold length on those pages, so this table leaves them blank rather than borrowing a number from a rate advertisement.",
        holdTable,
        `<a href="${RBC_HOLD}">RBC's rate page</a> says a fixed-rate residential purchase mortgage can be held for up to 120 days, and that if fixed rates fall during the hold you receive the lowest rate. The hold expires if the mortgage is not funded by the end of the 120 days, and the mortgage still has to meet RBC's standard lending criteria. <a href="${TD_HOLD}">TD's pre-approval page</a> uses the same 120-day window and adds the limit that matters when prime is moving: the guarantee is for fixed rates only. <a href="${TD_RATES}">TD's rates page</a> says a variable rate is not held, because it moves with TD Mortgage Prime. <a href="${BMO_READI}">BMO's Homeowner ReadiLine page</a> says a selected fixed rate can be guaranteed for 130 days from the date the guarantee starts, and that the guarantee expires if the mortgage is not funded in time.`,
        "A footnote on BMO's page, dated 15 September 2025, called 130 days the longest guarantee among the big banks then. This guide reports the 130 days and does not repeat the ranking. There is no federal length. A commitment that says 90 days means 90 for that file. A commitment that names no date is not a hold. Broker and credit-union windows are whatever those lenders wrote down.",
      ],
    },
    {
      id: "honoured",
      heading: "When the held rate is honoured",
      paragraphs: [
        "Funding has to happen before the expiry. RBC says the guarantee ends if the mortgage is not funded within 120 days. BMO starts its 130 days on the guarantee date, which may not be the day you first spoke to the branch. A delayed new-build closing, a sale that falls through and restarts, or a second set of conditions that pushes the purchase past the date puts you on whatever rate is then available, unless the lender agrees in writing to extend. A verbal \"we'll look after you\" is not an extension.",
        "The property, the amount, and your file still have to qualify on funding day. A pre-approval estimates borrowing room. The full file looks at the purchase agreement, the appraisal, the down payment, and a fresh credit check. A low appraisal can shrink the loan. Changing term, or moving from insured to uninsured because the down payment crossed 20 percent, is a new quote. TD will not hold a variable rate, and RBC's 120-day wording is for a fixed-rate residential purchase.",
        "A float-down, where one exists, applies inside that same product. RBC applies the lowest fixed rate during the hold without a request. TD says you can ask to move to a lower rate before closing, which means the lower rate is not applied unless someone makes the request. BMO's guarantee page states the 130 days and does not describe an automatic float-down. If your lender's commitment is silent, assume you must ask, and get the answer by email before the funding instructions go to the lawyer.",
      ],
    },
    {
      id: "purchase-vs-renewal",
      heading: "A purchase hold is not a renewal offer",
      paragraphs: [
        `<a href="${FCAC_RENEW}">The Financial Consumer Agency of Canada</a> says your current lender must provide a renewal statement at least 21 days before the term ends. The rate on that statement will not increase before the renewal date. That is a short protection against a last-minute increase on the offer already in your hands. It is not a 120-day hold, and it does not require the lender to cut the offer if bond yields fall during those 21 days. If you want the lower rate, you ask. The statement does not move by itself.`,
        `<a href="${TD_BREAK}">TD</a> describes a separate renewal window. You can renew early, up to 120 days before maturity, without a prepayment charge. Renewing earlier than that can trigger a charge. That 120-day early-renewal option is about avoiding a penalty on the existing loan. It is not the same sentence as TD's 120-day purchase rate guarantee, even though both numbers are 120. One starts from an application on a purchase. The other counts backward from the day the current term ends.`,
        `A purchase hold does not automatically cover a switch. A collateral charge often has to be paid out in full, line of credit included, before another lender can register. Ask the new lender whether the held rate names a switch, and get the discharge figure first. The shopping calendar is the <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a>. Leaving before maturity is priced in <a href="/guides/mortgage-prepayment-penalties/">prepayment penalties</a>. At maturity that penalty is zero.`,
      ],
    },
    {
      id: "using-it",
      heading: "How to use a hold without wasting it",
      paragraphs: [
        "Take the hold when 120 days can actually reach the funding date. RBC's page says the guarantee ends if the mortgage is not funded in time, and the TD and BMO pages do not describe a free extension. A builder's outside date past the hold needs a written extension before you waive conditions.",
        `Hold the term you mean to sign. TD cannot hold a variable, so a fixed hold beside an open variable decision protects only the fixed quote. Big-bank prime on this site is ${pct(PRIME_RATE)}, and TD uses TD Mortgage Prime, so "prime minus" is not a rate until the contract names the prime. The financing-condition date and the hold expiry are different clocks. Neither one extends the other.`,
        `At renewal, collect the renewal statement as soon as it arrives and run it through the <a href="/tools/renewal-offer-checker/">renewal offer checker</a>. The 21-day rule stops that particular offer from being raised before maturity. It does not tell you whether another lender is cheaper. If you want the option to leave, ask the new lender for a written hold that names a switch, and count backward from your maturity date so the new closing can fund before the hold dies. A switch that also needs a discharge of a collateral charge needs the lawyer's timeline inside that same count.`,
        `If the early-renewal quote is a blend, price it against breaking and against waiting. The arithmetic is in <a href="/guides/blend-and-extend-mortgage/">blend-and-extend versus break versus wait</a>. A hold on a brand-new loan from another lender is often the number the blend has to beat, and only after the penalty and the discharge costs. Blending in order to \"lock something in\" gives up the float-down you would have had by waiting with a hold that reaches your maturity date.`,
      ],
    },
    {
      id: "worked",
      heading: "A worked timeline",
      paragraphs: [
        "The rates in this timeline are a median from the reported-rate file and a labelled 0.20-point float-down. They are not a prediction of what a hold will contain, and they are not a special from the daily scrape.",
        "A purchase signed on 23 October 2026 and funded on 20 January 2027 is 89 days, inside a 120-day RBC or TD hold taken that day. Funding on 5 March 2027 is 133 days, past those holds and past BMO's 130. The guarantee is then over unless the lender extends it in writing. BMO counts from the guarantee start, which can be earlier than the purchase.",
        `Suppose the held five-year fixed rate is ${pct(heldRate)}, the median discounted five-year fixed in the borrower file dated ${REPORTED.asOf}, insured status not stated (N = ${REPORTED.fixedN}). That figure is self-reported by Canadian borrowers online. It is a stand-in so the payment can be calculated, not a rate RBC, TD, or BMO has agreed to hold. If fixed rates then fall by 0.20 of a point, RBC's page says the funded rate becomes the lower one. TD's page says you can ask for the lower rate. A borrower who never asks TD can close on the original held number while an RBC borrower in the same market is moved down without a request. That is the practical difference between the two clauses, and it is why the hold letter should say which kind you have.`,
        `On a labelled balance of ${cad(exampleBalance)}, 25-year amortization, monthly payments, ${pct(heldRate)} costs ${cad(heldPayment)} a month. The same balance at ${pct(floatedRate)} costs ${cad(floatedPayment)}. The gap is about ${cad(paymentGap)} a month, before any change in the penalty math. A wider discount from the posted rate can make a later interest-rate differential larger at a bank that subtracts the original discount from a posted comparison rate. The float-down is not free in every future. Model a quote you were actually given in the <a href="/tools/mortgage-calculator/">mortgage calculator</a>. The distribution behind the median is on <a href="/real-mortgage-rates/">real mortgage rates</a>.`,
      ],
    },
    {
      id: "decision-week",
      heading: "A hold through a Bank of Canada decision",
      paragraphs: [
        `<a href="${SOURCES.boc}">The Bank of Canada</a> held the overnight rate on 2 September 2026. The next scheduled announcement is 28 October 2026. A fixed hold taken before that meeting keeps the named fixed quote through it. It does not freeze prime or a variable special. TD will not hold a variable. The rounded five-year variable median in the reported file is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}). It is not a hold. Live shelves are <a href="/rates/5-year-fixed/">five-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a>.`,
        "If specials drop after the announcement, RBC's clause moves you to the lower fixed rate. TD's clause waits until you ask. Send that request the day the new special is posted, and keep the reply.",
      ],
    },
    {
      id: "what-it-does-not-do",
      heading: "What a hold does not do",
      paragraphs: [
        "It does not cap a penalty. The rate you held becomes the contract rate later used in a three-month-interest or interest-rate-differential calculation. A float-down that lowers your rate can widen the discount from the posted rate. At a bank that builds the differential from the posted rate minus that discount, the cheaper closing can be the more expensive break. Read the penalty clause of the product you are holding, not a generic description of \"bank mortgages.\" The Big Five differences that are actually published are in <a href=\"/guides/big-5-bank-mortgages-compared/\">the bank comparison</a>.",
        "It does not insure the mortgage. If the down payment is under 20 percent, the premium and any provincial sales tax on it are still due. The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> is a sketch. The insurer's schedule on closing day controls, and the sales tax, where a province charges it, is cash. A hold on an insured special also does not follow you if the down payment rises past 20 percent and the file becomes uninsured. That is a new product.",
        "It does not grow with the loan. A larger amount, a readvanceable line, or a switch from a standard charge to a collateral charge is a new approval. Confirm the amortization in the same letter: a 30-year payment quote beside a rate held for a 25-year insured file is two products.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Hold lengths below are from the bank page that states them. A renewal rule is from FCAC or from TD's own early-renewal description. Where a page does not state a length, this guide does not supply one.",
      ],
      listAfter: 0,
      items: [
        `<a href="${RBC_HOLD}">RBC</a>: 120-day fixed purchase hold, lowest rate if rates fall, expires if not funded.`,
        `<a href="${TD_HOLD}">TD pre-approval</a> and <a href="${TD_RATES}">rates</a>: 120 days, fixed only; you ask to float down. <a href="${TD_BREAK}">Early renewal</a> up to 120 days before maturity can avoid a charge.`,
        `<a href="${BMO_READI}">BMO</a>: 130 days from the guarantee start. The ranking footnote is dated 15 September 2025.`,
        `<a href="${FCAC_RENEW}">FCAC renewal rules</a> and the <a href="${SOURCES.boc}">2 September 2026 Bank of Canada decision</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "How long is a mortgage rate hold in Canada?",
      answer:
        "RBC and TD publish up to 120 days for a fixed-rate purchase mortgage. BMO publishes 130 days from the date the rate guarantee starts. Scotiabank and CIBC do not state a length on the pages reviewed for this guide. There is no single national length, and a commitment that says 90 days means 90 days for that file.",
    },
    {
      question: "Does a rate hold go down if rates fall?",
      answer:
        "At RBC, yes: the fixed-rate purchase hold pays the lowest rate during the 120 days. At TD you have to ask, and the guarantee does not apply to a variable rate. BMO's page states the 130-day guarantee and does not describe an automatic float-down. If the commitment is silent, ask in writing.",
    },
    {
      question: "Does a pre-approval lock the rate?",
      answer:
        "Only if the pre-approval includes a rate guarantee with an expiry date. Qualifying for a loan amount is not the same document. The mortgage still has to meet the lender's criteria on closing day, and RBC's hold expires if the loan is not funded in time.",
    },
    {
      question: "Can I hold a variable rate?",
      answer:
        "Not at TD. TD's pre-approval and rates pages limit the 120-day guarantee to fixed rates, because a variable rate moves with TD Mortgage Prime. RBC's 120-day wording on its rate page is also for a fixed-rate purchase mortgage. A variable quote needs its own written terms.",
    },
    {
      question: "Is a renewal offer a rate hold?",
      answer:
        "No. Lenders must send a renewal statement at least 21 days before the term ends, and the rate on it will not increase before the renewal date. That rule does not require the lender to cut the offer if rates fall. TD also allows an early renewal up to 120 days before maturity without a prepayment charge. Neither of those is a purchase pre-approval.",
    },
    {
      question: "What if my closing is later than the hold?",
      answer:
        "The published guarantees end. RBC says the hold expires if the mortgage is not funded within 120 days, and BMO's 130 days run from the guarantee start. You would need a written extension or a new quote. A delay from 23 October 2026 to 5 March 2027 is 133 days, past the RBC, TD, and BMO windows in this guide.",
    },
    {
      question: "Should I hold a rate while I decide to switch lenders?",
      answer:
        "Ask the new lender for a written hold that covers a switch, and get the current lender's payout figure first. A collateral mortgage often has to be repaid in full, including a line of credit, before another lender can register. The renewal statement from your current lender only protects the offer already on that statement.",
    },
  ],
};
