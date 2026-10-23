import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import {
  calculateMonthlyPayment,
  interestPaidOverMonths,
  threeMonthInterestOnBalance,
} from "../../lib/mortgageMath";
import { guideTable } from "./guideTable";

const REVIEWED = "2026-10-23T20:00:00Z";

const FCAC_BREAK = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/break-mortgage-contract.html";
const FCAC_RELIEF = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/relief-options.html";
const TD_BREAK = "https://www.td.com/ca/en/personal-banking/products/mortgages/what-happens-break-mortgage-penalty";
const TD_PREPAY = "https://www.td.com/ca/en/personal-banking/products/mortgages/flexible-mortgage-payment-features/prepayments";
const RBC_PORT = "https://www.rbcroyalbank.com/mortgages/product-advice/porting-a-mortgage.html";
const CIBC_TERMS = "https://www.cibc.com/content/dam/cibc-public-assets/closingdocs/mortgage/ab/5453ab-set-of-standard-charge-mortgage-terms_Version_A.pdf";

function segment(balance: number, rate: number, yearsLeft: number, months: number) {
  const payment = calculateMonthlyPayment(balance, rate, yearsLeft);
  const result = interestPaidOverMonths(balance, rate, payment, months);
  return { payment, interest: result.interest, endingBalance: result.endingBalance };
}

/** FCAC's published illustration: 5.5% for 24 months and 4% for 36 months, over a new 60-month term. */
const fcacBlend = (5.5 * 24 + 4 * 36) / 60;

const balance = 400_000;
const yearsLeft = 20;
const monthsLeft = 24;
const newTerm = 60;
const oldRate = 3.19;
const newRate = REPORTED.fixedMedianNumber;
const rawBlend = (oldRate * monthsLeft + newRate * (newTerm - monthsLeft)) / newTerm;
const blendRate = Math.round(rawBlend * 100) / 100;

const stay = segment(balance, oldRate, yearsLeft, monthsLeft);
const thenRenew = segment(stay.endingBalance, newRate, yearsLeft - monthsLeft / 12, newTerm - monthsLeft);
const blended = segment(balance, blendRate, yearsLeft, newTerm);
const broken = segment(balance, newRate, yearsLeft, newTerm);
const penalty = threeMonthInterestOnBalance(balance, oldRate);
const waitInterest = stay.interest + thenRenew.interest;
const blendExtra = blended.interest - waitInterest;
const breakExtra = broken.interest + penalty - waitInterest;

const decisionTable = guideTable(
  ["Your situation", "What to price first", "Why"],
  [
    [
      "You can wait until the maturity date",
      "A rate hold that starts on that date",
      "The months left at the old rate are still yours. A blend spends them now.",
    ],
    [
      "You must sell, and the new house needs a mortgage",
      "A port, then a blend only on any increase",
      "Porting can keep the old rate on the amount you move. The increase is the part that gets today's rate.",
    ],
    [
      "You want a lower payment and rates have fallen",
      "Blend-and-extend against the penalty plus a new loan",
      "FCAC's illustration is this case. If your old rate is the cheap one, the blend is usually the expensive way to feel busy.",
    ],
    [
      "The penalty is three months' interest and another lender is much cheaper",
      "Break, then the net over the new term",
      "Divide the penalty and any unrefunded costs by the monthly saving. If you will not keep the new mortgage that long, do not break it.",
    ],
    [
      "You need to borrow more",
      "Call it a refinance",
      "A larger balance can bring the stress test, a new charge, and a new insurance premium. It is not a pure blend.",
    ],
    [
      "The lender will only blend off a posted rate",
      "Ask for the rate a new customer would get, in writing",
      "A blend against the shelf can cost more than waiting, even when the formula looks fair.",
    ],
  ],
);

export const blendAndExtend: InDepthGuide = {
  slug: "blend-and-extend-mortgage",
  path: "/guides/blend-and-extend-mortgage/",
  metaTitle: "Blend-and-Extend vs Break vs Wait | Latest Mortgage Rates",
  description:
    "The weighted-rate formula for a Canadian blend-and-extend, a worked example against waiting and against breaking, who publishes a blend, and the costs the worksheet leaves out.",
  keywords:
    "blend and extend mortgage Canada, blended mortgage rate formula, early renewal, break mortgage vs blend, blend to term",
  cardTitle: "Blend-and-extend vs break vs wait",
  cardDescription:
    "The month-weighted formula, a worked example against waiting and against a three-month penalty, and the costs a blend hides.",
  h1: "Blend-and-extend vs break vs wait",
  dek: "A blend feels like a favour because nobody says the word penalty. The cost is the cheap months you stop living in. The arithmetic is short. The decision is which clock you are willing to restart.",
  sourcesLine:
    "Sources: FCAC's blend example, TD, RBC, and CIBC's Alberta standard terms. Your lender's worksheet overrides the illustration.",
  reviewedIso: REVIEWED,
  howTo: {
    name: "How to price a blend-and-extend against waiting or breaking",
    description:
      "Weight the old rate by the months left and the new rate by the rest of the new term, then compare that payment with staying put and with paying the penalty.",
    steps: [
      {
        name: "Get three numbers the same day",
        text: "The blend that starts now, the rate that would be held until maturity, and the penalty to leave. A quote that is only one of those three is not a comparison.",
      },
      {
        name: "Ask which rate is being blended",
        text: "The new rate in the formula might be the special a new customer sees, or a posted rate. The formula does not save you from a high second input.",
      },
      {
        name: "Keep the amortization out of the sales pitch",
        text: "FCAC says a blend does not change the amortization. If the lender is also stretching the years, you are looking at a different product.",
      },
      {
        name: "Restart the term on purpose",
        text: "A new five-year term means a new penalty clock. Leaving in year two of the blend is a fresh break, not a continuation of the old one.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "The choice in one paragraph",
      paragraphs: [
        "A blend-and-extend keeps you with the same lender, mixes the rate you have left with a rate that lender will offer today, and starts a new longer term now, usually without a prepayment penalty. Waiting until maturity keeps the old rate for the months that are left, and breaking the contract trades a penalty for the right to take a different lender's rate.",
        `<a href="${FCAC_BREAK}">FCAC</a> calls the blend an early renewal. The lender has to tell you how the new rate is calculated. You may still pay an administration fee. <a href="${FCAC_RELIEF}">A blend-to-term</a> uses the mixed rate only until the original maturity date. A blend-and-extend uses it for a new, longer term. Neither one changes the amortization. The payment can fall when today's rate is below yours. It rises when today's rate is above yours, which is the case for a lot of mortgages written before 2022. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is the calendar around that maturity date. This page is the arithmetic for leaving it early.`,
      ],
    },
    {
      id: "formula",
      heading: "The weighted-rate formula FCAC publishes",
      paragraphs: [
        `FCAC labels its method as a simplified illustration, not every lender's contract. Multiply the current rate by the months left. Multiply today's rate for the new term by the months being added. Add those two products. Divide by the number of months in the new term.`,
        `FCAC's own figures: balance $200,000, 22 years of amortization left, contract rate 5.5%, 24 months left, today's 5-year rate 4%, payments monthly. Step 1 is 5.5% × 24 = 132. Step 2 is 60 − 24 = 36. Step 3 is 4% × 36 = 144. Step 4 is 132 + 144 = 276. Step 5 is 276 / 60 = 4.6. The blended rate in the illustration is 4.6% for the next 60 months. You can check the division on a phone. You cannot check, from the illustration alone, whether your bank uses months, a present-value blend, or a posted rate as the "today" input.`,
        `The same weights on a file that is not FCAC's: ${cad(balance)} owing, ${yearsLeft} years of amortization left, a labelled example contract rate of ${pct(oldRate)} with ${monthsLeft} months to go. The ${pct(oldRate)} is an example standing in for a rate signed when mortgages were cheaper. It is not a row in the scrape. The new-rate input is the rounded 5-year fixed median from the reported-rate file, ${pct(newRate)}, insured status not stated (N = ${REPORTED.fixedN}), as of ${REPORTED.asOf}. That median is self-reported by Canadian borrowers online. It is not the rate your bank will type into a blend. (${pct(oldRate)} × ${monthsLeft} + ${pct(newRate)} × ${newTerm - monthsLeft}) / ${newTerm} = ${pct(rawBlend, 3)}, which rounds to ${pct(blendRate)} for the payment math below.`,
      ],
    },
    {
      id: "example",
      heading: "What the three paths cost on that file",
      paragraphs: [
        `Waiting keeps ${cad(stay.payment)} a month for ${monthsLeft} months on ${cad(balance)} at ${pct(oldRate)}. Interest in that slice is about ${cad(stay.interest)}, and the balance falls to about ${cad(stay.endingBalance)}. The illustration then renews at ${pct(newRate)} for ${newTerm - monthsLeft} months. That payment is ${cad(thenRenew.payment)}, interest in the second slice is about ${cad(thenRenew.interest)}, and interest over 60 months is about ${cad(waitInterest)}. This assumes ${pct(newRate)} is still available at maturity. A hold is how you pin that down: <a href="/guides/mortgage-rate-hold-canada/">rate holds</a>.`,
        `Blending now at ${pct(blendRate)} for 60 months costs ${cad(blended.payment)} a month, about ${cad(blended.payment - stay.payment)} more than the current payment, and about ${cad(blended.interest)} of interest. Against waiting, that is about ${cad(blendExtra)} more. You spent it to give up ${monthsLeft} months at ${pct(oldRate)}. The blend is the bargain in FCAC's story, where 5.5% falls to 4%. It is not the bargain on this file, where the old rate is the low one.`,
        `Breaking is the third path. Because ${pct(newRate)} is above ${pct(oldRate)}, a simple interest-rate differential here is zero, so the charge is three months' interest: ${cad(balance)} × ${pct(oldRate)} × 3/12 = ${cad(penalty)}. That is the <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a>. RBC's present-value step, and CIBC's Alberta terms that can add the original discount on top of three months' interest, can come out higher. Interest at the new rate for 60 months is about ${cad(broken.interest)}. Penalty plus that interest, minus waiting, is about ${cad(breakExtra)}. Breaking does not win on these inputs.`,
        decisionTable,
        `Run the three quotes you were actually given through the <a href="/tools/renewal-offer-checker/">renewal offer checker</a>. It places one rate on the distribution at <a href="/real-mortgage-rates/">real mortgage rates</a>. It does not blend. Insured and uninsured shelves are <a href="/rates/insured/">here</a> and <a href="/rates/uninsured/">here</a>. Five-year rows are on <a href="/rates/5-year-fixed/">fixed</a> and <a href="/rates/variable/">variable</a>. The rounded variable median is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}). Compare a blend with a variable only if the commitment says the new term is variable.`,
      ],
    },
    {
      id: "lenders",
      heading: "Which lenders will do it",
      paragraphs: [
        `FCAC says lenders may allow an early blend, and that some institutions offer it. It is not a right, and this page will not invent a list of every bank that says yes. The pages that do describe a blend, or an early renewal that can avoid a penalty, are narrower than the slogan.`,
        `<a href="${TD_BREAK}">TD</a> lets you renew up to 120 days before maturity without a prepayment charge. Earlier than that, <a href="${TD_PREPAY}">a charge can apply</a>. A blend eight months out is not the 120-day renewal. TD also blends on a port when you need more money: the old balance keeps its rate, the extra funds take a current rate, and you get one blended rate. That moves a house. It does not reprice a mortgage you are staying in. <a href="${RBC_PORT}">RBC</a> publishes the same port blend for a larger loan, and ordinary prepayment rules when the new loan is smaller. The port page is not a promise that every RBC borrower can blend in place.`,
        `<a href="${CIBC_TERMS}">CIBC's Alberta terms</a> (April 2026) blend on a port only when the new loan is larger. More than 12 months left, the second rate is that day's similar fixed term. Twelve months or less, it is the 6-month fixed. The same size keeps the old rate. A Variable Flex mortgage is not ported at the old rate. Those terms do not describe an in-place blend for someone who is not selling. Ask for the formula, the fee, and the start date. Monolines and credit unions are outside these pages. The question is the same, and the published penalty methods are in the <a href="/guides/big-5-bank-mortgages-compared/">Big Five comparison</a> and the <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender-type guide</a>.`,
      ],
    },
    {
      id: "hidden",
      heading: "The costs the blended rate does not show",
      paragraphs: [
        `On a low contract rate, every month you blend away is a month you no longer pay ${pct(oldRate)}. The new payment starts now. A blend-and-extend into five years also restarts the penalty clock. A posted-rate differential, where the contract uses one, is then calculated on a longer remainder. A blend-to-term does not do that: FCAC says it ends on the original maturity date, and the amortization does not change either way.`,
        `Nothing forces the lender to blend against the website special. Ask for the rate inside the blend and the rate the same bank would offer a new five-year term if you were already at maturity. A wide gap is a markup. FCAC also allows an administration fee. Cashback can be clawed back. An appraisal, a registration, and a new collateral charge, if a line of credit is added to "make it easier," change what you can switch later. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switch guide</a> is that later bill.`,
        `Borrowing more is a refinance, not a plain blend. The stress test can apply to the new money. An insured increase can owe a further premium, and <a href="${SOURCES.cmhcPremiums}">CMHC's port rules</a> are not a brand-new insured loan. Provincial sales tax on that premium is cash in Ontario, Quebec, and Saskatchewan. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> can disagree with the schedule. Stretching the amortization at the same time is a third product. Price it alone.`,
        `The last cost is the rate you can no longer take. A funded blend does not float down if specials fall in September. A borrower who waits, with a hold, still can. If the only pressure is an early renewal letter, ask for the hold that reaches maturity and leave the blend for a day you actually have to move.`,
      ],
    },
    {
      id: "when",
      heading: "When the blend is the right tool",
      paragraphs: [
        `Use it when you have to end the term and the blend is cheaper than the penalty plus the replacement loan. A sale you cannot port is the clean case. So is a divorce or a job transfer with a real closing date. Price the penalty from the lender's worksheet, not from a guess, and price the replacement rate from a written commitment. If the blend's extra interest over the new term is smaller than that penalty, the blend is doing a job.`,
        `Leave it when the old rate is below anything you can get today and nobody is forcing you to move. The worked example is that file: about ${cad(blendExtra)} of extra interest to start the blend now, against a wait that keeps ${pct(oldRate)} for ${monthsLeft} months and only then pays ${pct(newRate)}. The <a href="/tools/mortgage-calculator/">mortgage calculator</a> will show the higher payment. It will not show the months you gave up unless you run both paths. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the next decision, after you have decided to be in a new term at all.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The 4.6% figure is FCAC's, reproduced so the steps can be checked. The second example uses a labelled 3.19% contract rate and the reported 5-year fixed median as the new-rate input. It is not a blend any bank has offered.",
      ],
      listAfter: 0,
      items: [
        `<a href="${FCAC_BREAK}">FCAC, breaking your mortgage</a>, including the five-step blend illustration.`,
        `<a href="${FCAC_RELIEF}">FCAC, blend-to-term and blend-and-extend</a>. The amortization does not change.`,
        `<a href="${TD_BREAK}">TD, early renewal from 120 days out</a> and <a href="${TD_PREPAY}">prepayment charges on an earlier renewal</a>.`,
        `<a href="${RBC_PORT}">RBC, porting and blending an increase</a>.`,
        `<a href="${CIBC_TERMS}">CIBC Alberta standard charge terms</a>, port blends when the new loan is larger.`,
        `<a href="${SOURCES.fcacPenalty}">FCAC, how a prepayment penalty is built</a>, and <a href="${SOURCES.cmhcPremiums}">CMHC on premiums</a> if the balance grows.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is the blended rate just the average of the two rates?",
      answer:
        "Only if the two pieces of time are equal. FCAC weights each rate by the months it covers. In its example, 24 months at 5.5% and 36 months at 4% produce 4.6%, not 4.75%. A lender can use a different weighting, or a present-value blend. Ask which one is on the worksheet.",
    },
    {
      question: "Does a blend-and-extend avoid the prepayment penalty?",
      answer:
        "FCAC says you do not pay a prepayment penalty on this option, and that an administration fee is possible. TD says a renewal inside 120 days of maturity can avoid a charge, and that an earlier renewal may not. Get the fee in writing. A port that keeps the old rate on the same balance is a different way to avoid the charge, and it only applies when you are moving.",
    },
    {
      question: "Will a blend lower my payment?",
      answer:
        "It lowers the payment when the new rate is below your contract rate. It raises the payment when the new rate is higher, which is the usual case for a mortgage signed at a low rate. On the labelled example, the blend payment is higher than the payment at 3.19% because the reported median used as the new rate is higher than 3.19%.",
    },
    {
      question: "Does the blend change how many years I have left?",
      answer:
        "FCAC says no. The term changes. The amortization does not, unless you and the lender agree to stretch it as a separate change. Stretching the amortization lowers the payment and increases the interest. Price that change on its own line.",
    },
    {
      question: "Can I blend and then switch lenders next year?",
      answer:
        "You can, and you will likely pay a penalty on the new term. The point of the blend was to avoid a penalty by staying. Leaving a year later spends the penalty you postponed, on a longer remaining term. If you already know you want a different lender, price the break today rather than blending first.",
    },
    {
      question: "What if I need to borrow more at the same time?",
      answer:
        "That is a refinance, or a port increase, not a plain blend. The extra money is priced at a current rate. The stress test can apply. An insured increase can trigger a new premium, and the sales tax on that premium is cash in Ontario, Quebec, and Saskatchewan. A line of credit added in the same paperwork can turn the registration into a collateral charge.",
    },
    {
      question: "Are the rates in the worked example today's bank rates?",
      answer:
        "The 3.19% is a labelled example of an older contract. The new-rate input is the rounded 5-year fixed median self-reported by Canadian borrowers online, not a special from a bank's website and not a blend quote. FCAC's 5.5% and 4% are FCAC's teaching numbers. Your lender's two inputs will be different.",
    },
  ],
};
