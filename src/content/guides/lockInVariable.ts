import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH4, LOCK as k, RATE_FILE_AS_OF, SPREAD as s, SPREAD_TABLE, points } from "./batch4Math";
import { BOC_POLICY_RATE, PRIME_RATE, PRIME_SPREAD } from "../../lib/primeRate";

const rbcFixedVariable = "https://www.rbcroyalbank.com/mortgages/fixed-vs-variable-rates.html";
const rbcQuestions = "https://www.rbcroyalbank.com/en-ca/my-money-matters/goals-aspirations/buying-a-home/buying-your-first-home/top-burning-mortgage-questions-canadians-are-asking/";
const tdFixed = "https://www.td.com/ca/en/personal-banking/products/mortgages/fixed-rate-mortgages";
const tdPrime = "https://www.td.com/ca/en/personal-banking/products/todays-rates-and-prime";
const fcacInterest = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/interest-on-mortgages.html";
const fcacChoose = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/choose-mortgage.html";
const fcacRelief = "https://www.canada.ca/en/financial-consumer-agency/services/mortgages/relief-options.html";
const fsrHouseholds = "https://www.bankofcanada.ca/publications/financial-stability-report/financial-stability-report-2026/households/";

export const lockInVariable: InDepthGuide = {
  slug: "should-i-lock-in-variable-rate",
  path: "/guides/should-i-lock-in-variable-rate/",
  metaTitle: "Should You Lock In a Variable Mortgage Rate? | Latest Mortgage Rates",
  description:
    "When converting a Canadian variable mortgage to a fixed term pays: lender conversion rules, the fixed-variable spread in the rate file, a break-even table, and what the Bank of Canada has and has not said.",
  keywords:
    "should I lock in my variable mortgage, convert variable to fixed Canada, fixed variable spread, mortgage break even prime, VRM vs ARM",
  cardTitle: "Should you lock in a variable rate?",
  cardDescription:
    "The conversion is usually into a fixed term at least as long as the time left, at the rate the lender offers that day. The spread in the rate file is the break-even, not a forecast.",
  h1: "Should you lock in your variable rate?",
  dek: "Locking in swaps the variable contract you have for a fixed term at the same lender. The useful comparison is that fixed offer against your variable rate, and the payment if prime rises, not a prediction of the next announcement.",
  sourcesLine:
    "Sources: RBC and TD on conversion, FCAC on fixed payments versus adjustable payments, the Bank of Canada decision of September 2, 2026, and this site's rate file. The offer on the day you call is the rate.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH4,
  howTo: {
    name: "How to decide whether to lock a variable mortgage into a fixed rate",
    description:
      "Get the fixed rate the lender will actually give you for a term at least as long as the time left, then see how far prime has to rise before that fixed rate is cheaper.",
    steps: [
      {
        name: "Ask which fixed terms you are allowed to take",
        text: "Many closed variable contracts convert without a penalty only into a fixed term at least as long as the months you have left. A shorter term can be a break.",
      },
      {
        name: "Write down the rate, not the category",
        text: "Ask whether the conversion rate is the posted fixed rate or a discounted special, and which prime your variable discount uses.",
      },
      {
        name: "Price the gap",
        text: "Subtract your variable rate from the fixed offer. That difference is how far prime has to rise, if your discount stays, before the two rates match.",
      },
      {
        name: "Check the payment rule before you stay variable",
        text: "A fixed-payment variable mortgage can hit a trigger rate. An adjustable mortgage changes the payment when prime changes. They are not the same product.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "Lock in for the offer in front of you, not for the headline",
      paragraphs: [
        `Locking in means converting the variable mortgage you have into a fixed term with the same lender, usually for a term at least as long as the time left, at the fixed rate that lender is offering that day. Whether that is worth doing depends on the gap between your variable rate and that fixed offer, and on a payment you can still carry if prime rises, not on a guess about the next Bank of Canada announcement.`,
        `The gap is not a national constant. In the rate file scraped ${RATE_FILE_AS_OF}, ${s.pairCount} lenders have both a 5-year fixed and a 5-year variable in the same insured status. The fixed rate is higher in almost every pair. The median uninsured gap is ${points(s.medianUninsuredSpread)}. The widest is ${s.widest.name}, ${s.widest.mortgageType}, at ${points(s.widest.spread)}. The narrowest is ${s.narrowest.name}, ${s.narrowest.mortgageType}, at ${points(s.narrowest.spread)}, so fixed is the cheaper of the two in that row.`,
        `<a href="${SOURCES.boc}">On September 2, 2026</a> the Bank of Canada held the target for the overnight rate at ${pct(BOC_POLICY_RATE)}. The next scheduled announcement is October 28, 2026. This page was reviewed on October 23, so that decision had not been published. Big-bank prime on this site is ${pct(PRIME_RATE)}. A hold, a cut, or a rise on October 28 is a fact only after the Bank prints it. The <a href="/guides/bank-of-canada-rate-and-your-mortgage/">Bank of Canada guide</a> separates the overnight rate, prime, and a fixed quote. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the choice at the start of a term. This page is the choice in the middle of one.`,
      ],
    },
    {
      id: "rules",
      heading: "What the conversion is allowed to be",
      paragraphs: [
        `<a href="${fcacInterest}">FCAC</a> calls convertibility the option, if the lender offers it, to move a variable mortgage to a fixed rate during the term. <a href="${fcacRelief}">The relief page</a> adds that a conversion can limit the damage if rates jump. Neither page says the new rate will be posted, a special, or the rate you were first offered.`,
        `<a href="${rbcFixedVariable}">RBC's fixed-versus-variable page</a> says most lenders let you convert during the term, typically at no cost, if the new fixed term is equal to or longer than the time left. <a href="${rbcQuestions}">RBC's own book</a> is tighter. A convertible RBC variable can move at any time, including at maturity, without a prepayment charge, into a fixed closed term of one year or longer, at the rate being offered that day, and the new term has to meet or exceed the time remaining. Three years left means three years or more. A shorter term can carry a prepayment charge. An open variable, on that same options sheet, can convert to any term without the charge.`,
        `<a href="${tdFixed}">TD</a> does not use RBC's sentence. When you switch a variable mortgage to a fixed rate, the term must be at least the lesser of three years and the remaining period of the original term. Four years left and eighteen months left are different minimums. TD also publishes two primes. <a href="${tdPrime}">TD Prime</a> was 4.45% effective October 30, 2025. The rate file, scraped ${RATE_FILE_AS_OF}, shows TD's uninsured 5-year variable special at ${pct(s.tdUninsured.variable)} beside a posted variable of ${pct(s.tdUninsured.variablePosted ?? 0)}. That posted 4.60% is the mortgage prime this site already treats as TD's separate figure. Do not subtract ${pct(s.tdUninsured.variable)} from 4.45% and call the result your discount. Read which prime the contract names.`,
        `The offer can be a special or the posted rate, and the break-even moves with that choice. CIBC's uninsured rows are a ${pct(s.cibcUninsured.variable)} variable special, a ${pct(s.cibcUninsured.fixed)} fixed special, and a posted fixed rate of ${pct(s.cibcUninsured.fixedPosted ?? 0)}. The special-to-special gap is ${points(s.cibcUninsured.spread)}. The gap from the variable special up to the posted fixed rate is ${points(k.postedGap ?? 0)}. This page did not find a CIBC sentence that says a conversion uses the posted rate. The two gaps are the arithmetic if the form shows one number or the other. BMO's port page, a different product, does blend new money with the posted fixed rate. A conversion and a port are not the same request.`,
      ],
    },
    {
      id: "spread",
      heading: "The fixed-variable spread in the rate file",
      paragraphs: [
        `Every row is built from data/rates.json at build time, scraped ${RATE_FILE_AS_OF}. Insured and uninsured stay apart. A lender with no 5-year variable in that status is absent. Scotiabank's uninsured 5-year fixed is in the file and its variable is not, so Scotiabank does not appear. That is not a claim that Scotiabank has no variable mortgage.`,
        `RBC's uninsured pair, the one in the break-even, is fixed ${pct(s.rbcUninsured.fixed)} and variable ${pct(s.rbcUninsured.variable)}, a gap of ${points(s.rbcUninsured.spread)}. The insured pair is the same gap at a lower level: ${pct(s.rbcInsured.fixed)} and ${pct(s.rbcInsured.variable)}. TD's uninsured gap is ${points(s.tdUninsured.spread)}. ${s.narrowest.name}'s insured fixed rate is below its variable rate, so paying up for certainty runs backwards on that row. A conversion can still receive a posted rate well above the special in the table. Ask which one is on the form.`,
        `Reported medians are a different shelf. The file dated ${REPORTED.asOf} has a rounded 5-year fixed median of ${REPORTED.fixedMedian} and a rounded 5-year variable median of ${REPORTED.variableMedian}, insured status not stated. Those medians are self-reported by Canadian borrowers online. They are not the conversion offer. See them on <a href="/real-mortgage-rates/">real mortgage rates</a>, and the specials on the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> places one number on that distribution. It does not know the conversion rate.`,
      ],
      table: SPREAD_TABLE,
    },
    {
      id: "breakeven",
      heading: "A break-even if prime rises and the discount stays",
      paragraphs: [
        `Use RBC's uninsured specials. Both numbers are in the file, and the gap is close to the uninsured median. Balance ${cad(k.balance)}, 22 years of amortization left, 36 months left on the term. Those years give the payment a denominator. They are not your amortization. Staying at ${pct(s.rbcUninsured.variable)} costs ${cad(k.flat.payment)} a month on this site's formula, and about ${cad(k.flat.interest)} of interest over 36 months. Locking into the 5-year uninsured special of ${pct(s.rbcUninsured.fixed)} costs ${cad(k.lockedFivePayment)} a month and about ${cad(k.lockedFiveInterest)} of interest over the same 36 months. The 3-year uninsured special, ${pct(s.rbcThreeFixed)}, is a term RBC's equal-or-longer rule allows when three years remain, and it may be the rate you are offered. That payment is ${cad(k.lockedThreePayment)}, and 36 months of interest is about ${cad(k.lockedThreeInterest)}.`,
        `The break-even against the 5-year special is a rise of ${points(k.breakEvenFive)}. That is ${k.quarterMovesFive.toFixed(2)} quarter-point moves if each move passes through in full and the discount does not change. Against the 3-year special the break-even is ${points(k.breakEvenThree)}. The table holds each new variable rate flat for the rest of the 36 months. It is the payment if that rise happened now, not a forecast. A rise in the second year costs less than a rise tomorrow, because fewer months sit at the higher rate. The <a href="/tools/mortgage-calculator/">payment calculator</a> reprices one rate. It does not run this ladder.`,
        `At a full point higher, the variable payment sits a few dollars above the locked 5-year payment, which is what a ${points(k.breakEvenFive)} gap should do. Interest over 36 months at the unchanged variable rate is still lower, because the early months were cheap. The question is whether prime stays high long enough to eat that head start. If you cannot afford the payment at ${pct(s.rbcUninsured.variable + 1)}, the head start is not a comfort. After you lock, the <a href="/guides/mortgage-prepayment-penalties/">penalties guide</a> applies: breaking the new fixed term is usually the greater of three months' interest and an interest-rate differential. The variable contract you leave is usually three months' interest, and a same-lender conversion on the terms above is often neither.`,
      ],
      table: k.table,
    },
    {
      id: "outlook",
      heading: "What the Bank has said, and what it has not",
      paragraphs: [
        `The target is ${pct(BOC_POLICY_RATE)}. The Bank Rate is ${pct(BOC_POLICY_RATE + 0.25)} and the deposit rate is ${pct(Math.round((BOC_POLICY_RATE - 0.05) * 100) / 100)}. Prime on this site is ${pct(PRIME_RATE)}, the target plus ${points(PRIME_SPREAD)}. TD's mortgage prime in the rate file is a different number. The September 2, 2026 release said the Bank was prepared to adjust policy as needed. That sentence is not a path for your payment.`,
        `<a href="${fsrHouseholds}">The 2026 Financial Stability Report</a> estimated renewal payments with market expectations as they stood on May 19, 2026. It says the last of the five-year fixed-payment mortgages from the pandemic years, about 12% of outstanding mortgages, would see payments rise by about 15% on average over the following twelve months, and that by the second half of 2027 nearly all of the mortgages facing large payment increases will have renewed. Those sentences are about renewals. They use a path the Bank labelled as a market expectation. They are not a promise about prime on the morning you convert. This page does not adopt that path as a forecast.`,
        `If years remain, the October 28 announcement changes your variable rate only if your lender changes prime, and only by that amount. It does not reprice a fixed rate you have already locked. It can reprice the fixed special offered on October 29, because fixed specials follow funding costs, not the overnight rate one for one. Get the conversion quote in writing, with an expiry. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> does not belong on a conversion that leaves the loan amount and the house alone.`,
      ],
    },
    {
      id: "vrm",
      heading: "A fixed payment and an adjustable payment are different contracts",
      paragraphs: [
        `<a href="${fcacChoose}">FCAC splits variable mortgages in two</a>. One keeps the payment the same when the rate moves, so a higher rate sends more of the payment to interest and stretches the amortization. That is a variable-rate mortgage with a fixed payment. The other changes the payment when the rate changes, so the amortization stays on schedule. FCAC calls that an adjustable payment. Advertisements use "variable" for both.`,
        `The fixed-payment version has a trigger rate. <a href="${SOURCES.fcacTrigger}">FCAC</a> defines it as the rate at which the payment only covers interest. Above it, unpaid interest is added to the balance, and the lender can require a higher payment, a lump sum, or a conversion. TD uses two labels: the trigger rate, when the payment no longer covers the interest, and the trigger point, when you have to raise the payment, prepay, or switch to a fixed rate. RBC's standard variable mortgage is the fixed-payment kind. Its page says an increase in RBC prime can produce a triggering interest rate.`,
        `Locking in a fixed-payment contract stops the rate and rebuilds a payment that finishes on time. On an adjustable contract the amortization was never the problem. The payment was. Locking in there is only a comparison of the fixed offer with the variable rate you would have lived through. If you are already past the trigger, call the lender. Unpaid interest compounds while you wait. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is the conversation if the term is also about to end. A conversion three years early and a renewal letter are not the same document.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The spread and the payments come from this site's rate file. The overnight rate is the Bank's September 2, 2026 decision. The 15% figure is the May 2026 stability report, labelled there as a market expectation, and it is not a forecast adopted here.",
      ],
      listAfter: 0,
      items: [
        `<a href="${rbcFixedVariable}">RBC, fixed versus variable</a> and <a href="${rbcQuestions}">converting mid-term</a>. Equal or longer, at the rate then offered, no prepayment charge.`,
        `<a href="${tdFixed}">TD fixed-rate mortgages</a>. Minimum term is the lesser of three years and the time left. <a href="${tdPrime}">TD Prime</a> was 4.45% on October 30, 2025.`,
        `<a href="${fcacInterest}">FCAC on convertibility</a>, <a href="${fcacChoose}">adjustable payments</a>, and <a href="${SOURCES.fcacTrigger}">trigger rates</a>.`,
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. Target ${pct(BOC_POLICY_RATE)}. Next announcement October 28, 2026.`,
        `<a href="${fsrHouseholds}">Financial Stability Report 2026, households</a>. Expectations as at May 19, 2026.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Do I pay a penalty to lock in a variable mortgage?",
      answer:
        "Often no, if you stay with the same lender and take a fixed term at least as long as the time left. RBC says a convertible variable can move on those terms without a prepayment charge, at the fixed rate offered that day. A shorter term can be a break. TD's minimum is the lesser of three years and the time remaining. Read the offer.",
    },
    {
      question: "Will I get the special, or the posted fixed rate?",
      answer: `The pages reviewed here do not promise either one. RBC says the rate being offered at the time of conversion. In the rate file, CIBC's uninsured fixed special is ${pct(s.cibcUninsured.fixed)} and its posted fixed rate is ${pct(s.cibcUninsured.fixedPosted ?? 0)}, against a variable special of ${pct(s.cibcUninsured.variable)}. The break-even is about ${points(s.cibcUninsured.spread)} against the special and about ${points(k.postedGap ?? 0)} against the posted rate. Ask which number is on the form.`,
    },
    {
      question: "How far does prime have to rise before locking in wins?",
      answer: `On RBC's uninsured specials in the ${RATE_FILE_AS_OF} file, the 5-year fixed rate is ${points(s.rbcUninsured.spread)} above the variable rate, if the discount stays put. A rise late in the term costs less than a rise now. The table prices an immediate rise, not a forecast.`,
    },
    {
      question: "Should I lock in before the October 28, 2026 announcement?",
      answer:
        `Only if today's fixed offer is a rate you want even if the Bank holds. The September 2 decision held the target at ${pct(BOC_POLICY_RATE)}. This page does not call October 28. A hold does not freeze a fixed special. Get the quote and its expiry in writing.`,
    },
    {
      question: "What is the difference between a VRM and an ARM?",
      answer:
        "A variable-rate mortgage with a fixed payment keeps the payment still and lets the amortization stretch until the trigger rate. An adjustable-rate mortgage changes the payment so the amortization stays on schedule. FCAC describes both. Locking in a fixed payment also rebuilds a payment that finishes on time. Locking in an adjustable payment is only a rate decision.",
    },
    {
      question: "Are the medians on this site the conversion rate?",
      answer:
        `No. The rounded medians, ${REPORTED.fixedMedian} fixed and ${REPORTED.variableMedian} variable in the current reported file, are self-reported by Canadian borrowers online. The RBC specials used in the break-even are ${pct(s.rbcUninsured.fixed)} and ${pct(s.rbcUninsured.variable)}, from the rate file. A conversion uses the rate your lender offers that day.`,
    },
  ],
};
