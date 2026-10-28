import type { InDepthGuide } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH3, SOURCES } from "./shared";
import {
  DECISION as d,
  REPORTED_AS_OF,
  REPORTED_FIXED,
  REPORTED_FIXED_N,
  REPORTED_VARIABLE,
  REPORTED_VARIABLE_N,
  cad,
  pct,
} from "./batch3Math";

export const bankOfCanadaMortgage: InDepthGuide = {
  slug: "bank-of-canada-rate-and-your-mortgage",
  path: "/guides/bank-of-canada-rate-and-your-mortgage/",
  metaTitle: "Bank of Canada Rate and Your Mortgage (2026) | Latest Mortgage Rates",
  description:
    "How the Bank of Canada overnight rate moves prime, variable mortgages, and HELOCs, why fixed rates follow bond yields, and how to read a decision day. Includes the eight 2026 dates.",
  keywords:
    "Bank of Canada overnight rate mortgage, prime rate variable mortgage, trigger rate, fixed rates bond yields, 2026 rate announcement dates",
  cardTitle: "Bank of Canada rate and your mortgage",
  cardDescription:
    "Overnight rate, prime, variable versus adjustable payments, trigger rates, and why a fixed quote can move when the Bank holds.",
  h1: "The Bank of Canada rate and your mortgage",
  dek: "The overnight rate is the Bank's target for one day of lending between banks. Prime follows it. A variable or adjustable mortgage, and most HELOCs, follow prime. A new fixed rate follows the bond market, which does not wait for the announcement.",
  sourcesLine:
    "Sources: the Bank of Canada decision of October 28, 2026, the September 2, 2026 hold, the 2026 announcement schedule, and FCAC's pages on trigger rates and HELOCs. Your contract names the prime and the payment rule.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH3,
  howTo: {
    name: "How to read a Bank of Canada decision against your mortgage",
    description:
      "Separate the overnight rate from prime, separate a fixed-payment variable mortgage from an adjustable one, and check the bond market before you treat a hold as a freeze on fixed quotes.",
    steps: [
      {
        name: "Read the three policy rates",
        text: "The announcement gives the target overnight rate, the Bank Rate, and the deposit rate. The mortgage is not any of those three numbers.",
      },
      {
        name: "Ask which prime the contract uses",
        text: "Big-bank prime on this site is still 4.45% until a lender publishes a change. TD publishes its own mortgage prime. A discount is meaningless until the contract names the prime.",
      },
      {
        name: "See whether the payment moves",
        text: "An adjustable mortgage changes the payment when prime changes. A fixed-payment variable mortgage keeps the payment and changes the amortization, until the trigger rate.",
      },
      {
        name: "Price the fixed quote off bonds, not off the meeting",
        text: "A hold does not freeze five-year fixed specials. Check the rate tables the same day, including the days before the announcement.",
      },
    ],
  },
  sections: [
    {
      id: "overnight",
      heading: "The overnight rate is not your mortgage rate",
      paragraphs: [
        `<a href="${SOURCES.bocOct}">On October 28, 2026</a> the Bank of Canada raised the target for the overnight rate by 25 basis points to ${pct(d.policy)}. The Bank Rate is 2.75% and the deposit rate is 2.45%. The next scheduled announcement is December 9, 2026. The next Monetary Policy Report is January 27, 2027. <a href="${SOURCES.boc}">On September 2, 2026</a> the Bank had held the target at 2.25%, with the Bank Rate at 2.50% and the deposit rate at 2.20%. From January 28, 2026 through that September hold, the target did not move. The decision is released at 9:45 a.m. Eastern time.`,
        `Those three rates are how the Bank keeps the overnight market inside a corridor. The target is the middle. The Bank Rate, a quarter point higher, is what the Bank charges on overnight loans to financial institutions. The deposit rate, set a little under the target, is what it pays on deposits. None of them is a five-year mortgage. A borrower who hears "rates are ${pct(d.policy)}" and expects a ${pct(d.policy)} mortgage is reading the wrong market. The <a href="/blog/bank-of-canada-raises-rate-october-2026/">October 2026 recap on this site</a> is this decision in plain language. The <a href="/blog/bank-of-canada-holds-rate-september-2026/">September 2026 recap</a> is the hold that came before it. The <a href="/trends/">trends page</a> is what posted mortgage quotes did around those dates.`,
        `Prime is a lender's number. Big-bank prime on this site is still ${pct(d.prime)}. The usual spread has been ${pct(d.spread)} over the target, and this page does not publish a new prime until a lender does. The Bank does not publish prime. Lenders move it, usually by the same amount as the target, and they do not have to. This page does not state an effective date for a prime change. TD publishes a mortgage prime of its own, separate from the headline prime used here, so a discount of "prime minus 0.60" is a different rate at TD than at a bank using ${pct(d.prime)}. Read the definition in the commitment before you compare two variable specials.`,
      ],
    },
    {
      id: "dates",
      heading: "The eight decision dates in 2026",
      paragraphs: [
        `<a href="${SOURCES.bocSchedule}">The Bank published the 2026 schedule</a> on August 6, 2025. There are eight fixed announcement dates. Four of them, January, April, July, and October, also release the Monetary Policy Report. The other four are an announcement without that report. The Bank can still move between dates. It treats that as exceptional. The schedule is the ordinary calendar. The same policy-rate page posts the 2027 dates. The first of those is January 27, 2027.`,
        `From January through September 2026 the target did not move. On October 28 it rose to 2.50%. December 9 is the next date. A renewal that matures in the coming months is not waiting on the overnight rate for a fixed quote. It is waiting on the lender's funding cost that week, which may already have moved. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is the shopping window. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> places one offer against rates self-reported by Canadian borrowers online. It does not predict the December decision.`,
      ],
      table: {
        caption: "Bank of Canada fixed announcement dates for 2026. Decision time is 9:45 a.m. Eastern.",
        headers: ["Date", "What is published"],
        rows: d.dates,
      },
    },
    {
      id: "variable",
      heading: "Prime, variable mortgages, and HELOCs",
      paragraphs: [
        `A variable-rate mortgage in Canada is a contract rate expressed as prime minus a discount, or sometimes prime plus a premium. When the lender changes prime, the contract rate changes by the same amount if the discount stays put. The discount is the part you negotiate. The prime is the part the lender resets. <a href="${SOURCES.fcacHeloc}">FCAC</a> describes the same link for a HELOC: the rate is typically based on the lender's prime, the lender may change it, and a federally regulated lender has to give written notice within 30 days of a change. A HELOC priced as prime plus a margin gets more expensive the day prime rises, on the balance you have actually drawn. You do not pay interest on the undrawn limit.`,
        `The rate file's RBC high-ratio 5-year variable special is ${pct(d.rate)}, which is ${pct(d.prime)} minus ${pct(d.discount)}. On a ${cad(d.balance)} balance and a 25-year amortization, the opening payment on this site's monthly formula is ${cad(d.payment)}. A quarter-point rise in prime, passed through in full, takes the contract to ${pct(d.upQuarter)}. If the payment adjusts, it becomes ${cad(d.armQuarter)}, about ${cad(d.quarterPaymentIncrease)} more a month. A full point, to ${pct(d.upPoint)}, takes an adjustable payment to ${cad(d.armPoint)}, about ${cad(d.pointPaymentIncrease)} more. Those are illustrations at the opening balance, as if the rise happened before any principal was paid. A later rise is calculated on whatever you still owe.`,
        `Reported medians are a different shelf. The file dated ${REPORTED_AS_OF} shows a rounded 5-year variable median of ${REPORTED_VARIABLE} (N = ${REPORTED_VARIABLE_N}) and a rounded 5-year fixed median of ${REPORTED_FIXED} (N = ${REPORTED_FIXED_N}), insured status not stated. Use the <a href="/rates/variable/">variable</a> page for posted variable specials and the <a href="/rates/5-year-fixed/">5-year fixed</a> page for the fixed ones. <a href="/real-mortgage-rates/">Real mortgage rates</a> is the reported distribution. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the term choice. The <a href="/tools/mortgage-calculator/">payment calculator</a> will reprice an adjustable payment. It will not know whether your contract adjusts.`,
      ],
    },
    {
      id: "trigger",
      heading: "Fixed payments, adjustable payments, and the trigger rate",
      paragraphs: [
        `Lenders sell two different variable contracts, and the advertisements use the names loosely. On an adjustable-rate mortgage the payment changes when the rate changes, and the amortization stays on schedule. On a variable-rate mortgage with a fixed payment, the payment stays put. More of it goes to interest when prime rises, and the amortization stretches. <a href="${SOURCES.fcacVariableBox}">FCAC says</a> a federally regulated lender has to disclose, for a fixed-payment variable mortgage, the rate at which the payment would no longer cover the interest due. That rate is the trigger rate. <a href="${SOURCES.fcacTrigger}">Past the trigger</a>, unpaid interest is added to the balance. The loan is in negative amortization. The lender can require a higher payment, a lump sum, or a conversion to a fixed rate. Extending the amortization, if any room remains, avoids the higher payment and raises the interest you will pay.`,
        `On the RBC special above, the opening payment of ${cad(d.payment)} covers the interest until the rate reaches about ${pct(d.triggerRate)}. That is ${pct(d.roomToTrigger)} above the contract. The figure is this page's illustration: one month of simple interest on the opening balance, set equal to the payment. The contract's trigger uses the lender's own formula, often with semi-annual compounding, and it changes as the balance changes. Ask for the number in the disclosure. Do not use ${pct(d.triggerRate)} as yours. After a quarter-point rise, about ${cad(d.coverQuarter)} of the opening payment would still be principal. After a full point, about ${cad(d.coverPoint)} would. This particular discount is not near its trigger.`,
        `A payment that was set at a much lower rate can be. Suppose the same ${cad(d.balance)} had been amortized at ${pct(d.exampleOldRate)}, an example rate and not a figure from the rate file. The payment would be ${cad(d.exampleOldPayment)} and the illustrated trigger about ${pct(d.exampleTrigger)}. At an example contract rate of ${pct(d.exampleNowRate)}, monthly interest on the opening balance would exceed that payment by about ${cad(d.exampleShortfall)}. That is the shape of a trigger problem: the payment belongs to an old rate, and the contract rate has moved past the point where interest fits inside it. A borrower in that position should call the lender before the unpaid interest compounds. The <a href="/guides/mortgage-stress-test/">stress test</a> does not measure this. It measured whether you qualified at the start.`,
      ],
    },
    {
      id: "fixed",
      heading: "Why fixed rates follow bonds instead",
      paragraphs: [
        `A lender funding a five-year fixed mortgage is promising a rate for five years. The cost of that promise tracks the five-year Government of Canada bond, plus a spread for the lender's own funding, the cost of securitization or deposits, and the risk of the loan. The overnight rate can sit still while that bond yield moves. The September 2, 2026 announcement said long-term bond yields had moved up globally, including in Canada, even as the target was held. The release did not print a yield. This page will not invent one. The fact that matters for a borrower is the direction the Bank itself reported: funding costs for longer terms rose during a hold.`,
        `That is why a fixed special on the <a href="/rates/5-year-fixed/">5-year fixed</a> table can change on a Tuesday when the Bank's next meeting is weeks away, and why it can change again on the morning of a hold. Insured and uninsured specials do not have to move together. A high-ratio loan can be sold into a different funding program than an uninsured one. Check both columns on the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> pages. The <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted guide</a> explains why the posted rate, which feeds many break penalties, is a third number again.`,
        `Variable borrowers feel the decision in prime. Fixed borrowers who are already signed feel nothing until renewal, unless they break the term. Fixed borrowers who are shopping feel the bond market immediately. If your maturity is December 9, get the fixed quote before the morning of the announcement and ask how long it is good for. A hold will not rewind a quote that was repriced last week. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> does not belong in this decision unless the mortgage you are signing is a new high-ratio purchase. A renewal of a loan that is already insured does not generate a new premium.`,
      ],
    },
    {
      id: "day",
      heading: "How to read the morning of a decision",
      paragraphs: [
        `Start with the three rates in the first paragraph of the release, and with the date of the next announcement in the information note. Then read one sentence on inflation and one on growth, because those are what the Bank says it will watch. Skip any sentence that tells you what the Bank will do on December 9. The October 28 release said there could be a need to raise the policy rate further, and that Governing Council would proceed carefully. That is not a path for your payment.`,
        `If you have an adjustable mortgage, multiply the change in prime, once your lender announces it, by the balance and divide by 12 for a rough monthly interest change. The payment change is close to that on a long amortization and a bit different on a short one, because principal is in the payment too. The calculator is the exact figure. If you have a fixed-payment variable mortgage, ask whether the new rate is still under the trigger printed in your disclosure. If you have a fixed term with years left, the decision does not reprice you. If you are renewing or buying, open the rate tables after the lender has had a day to move prime, and open them for fixed rates without waiting.`,
        `The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender comparison</a> matters on decision day because a monoline and a bank do not post on the same clock. A credit union is not bound by OSFI's guideline the way a federal bank is, and its prime can be its own. The contract you sign still has to say which index it uses. Bring the index, the discount, the payment rule, and the trigger to the conversation. Leave the overnight rate in the press release.`,
        `A HELOC does not wait for renewal. Interest on the amount you have drawn moves with prime, once the lender changes prime. Undrawn room does not accrue interest, so a headline overstates the bill when the limit is large and the balance is small. <a href="${SOURCES.fcacHeloc}">FCAC's HELOC page</a> describes the product. The <a href="/guides/mortgage-renewal-vs-refinance-vs-heloc/">renewal, refinance, and HELOC guide</a> is the choice between that limit and a new amortizing loan. Prime on this site is still ${pct(d.prime)}. A margin of prime plus 1.00 is an example, not a posted HELOC grid, and it would price at ${pct(d.prime + 1)} on that prime. The commitment names the margin.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The target, the Bank Rate, the deposit rate, and the next date are the October 28, 2026 release. The September 2 figures are that earlier hold. The eight dates are the Bank's 2026 schedule. Trigger-rate duties are FCAC's. The payment arithmetic uses this site's monthly formula.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.bocOct}">Bank of Canada, October 28, 2026</a>. Target ${pct(d.policy)}. Bank Rate 2.75%. Deposit rate 2.45%. Next announcement December 9, 2026. Next Monetary Policy Report January 27, 2027.`,
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. Target 2.25%. Bank Rate 2.50%. Deposit rate 2.20%.`,
        `<a href="${SOURCES.bocPolicy}">Policy interest rate</a>, including the 2026 decisions through September and the note that a change takes effect the next day.`,
        `<a href="${SOURCES.bocSchedule}">2026 announcement schedule</a>, published August 6, 2025.`,
        `<a href="${SOURCES.fcacTrigger}">FCAC on trigger rates</a> and <a href="${SOURCES.fcacVariableBox}">the variable-rate disclosure</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Does a Bank of Canada hold freeze my variable payment?",
      answer:
        "A hold freezes the part of the payment that comes from prime, if your lender does not change prime on its own. The October 28, 2026 decision was not a hold. It raised the target to 2.50%. Prime on this site is still 4.45% until a lender publishes a change. A decision does not freeze a fixed-rate quote.",
    },
    {
      question: "Will my fixed mortgage rate fall if the Bank changes the overnight rate?",
      answer:
        "Not by an automatic link. A five-year fixed special is priced off longer-term funding, which tracks Government of Canada bond yields. The October 28, 2026 release said advanced-economy sovereign bond yields are higher. Shop the fixed table. Do not subtract the overnight rate from your renewal letter.",
    },
    {
      question: "What is a trigger rate in one sentence?",
      answer:
        "It is the contract rate at which your fixed payment only covers interest. Above it, unpaid interest is added to the balance. FCAC says the lender has to disclose that rate on a fixed-payment variable mortgage. The illustration on this page, about 6.24% on one RBC special, is not your trigger.",
    },
    {
      question: "How many times can the Bank change the overnight rate in 2026?",
      answer:
        "Eight scheduled announcements: January 28, March 18, April 29, June 10, July 15, September 2, October 28, and December 9. January, April, July, and October include the Monetary Policy Report. An unscheduled move is possible and rare. Through September 2 the target was held at 2.25%. On October 28 it was raised to 2.50%. The next date is December 9.",
    },
    {
      question: "Are the variable medians the same thing as prime minus a discount?",
      answer:
        "The 3.55% median is self-reported by Canadian borrowers online, as an effective rate, not as a discount. The RBC special used in the trigger example is prime minus 0.60, or 3.85%, from the rate file. A reported median and a lender special are not an average of each other.",
    },
  ],
};
