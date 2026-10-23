import type { InDepthGuide } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH3, SOURCES } from "./shared";
import {
  CHOICE as c,
  REPORTED_AS_OF,
  REPORTED_FIXED_N,
  REPORTED_FROM,
  REPORTED_TO,
  REPORTED_VARIABLE,
  REPORTED_VARIABLE_N,
  cad,
  cadCents,
  pct,
} from "./batch3Math";

export const renewalVsRefinance: InDepthGuide = {
  slug: "mortgage-renewal-vs-refinance-vs-heloc",
  path: "/guides/mortgage-renewal-vs-refinance-vs-heloc/",
  metaTitle: "Mortgage Renewal vs Refinance vs HELOC (2026) | Latest Mortgage Rates",
  description:
    "How a Canadian mortgage renewal, a refinance, and a HELOC differ in 2026: the 80% limit, the 65% revolving cap, penalties, the stress test, and a worked decision on one house.",
  keywords:
    "mortgage renewal vs refinance Canada, HELOC 65 percent limit, refinance 80 percent LTV, straight switch stress test, refinance penalty",
  cardTitle: "Renewal, refinance, or HELOC",
  cardDescription:
    "Same house, three different loans: what each one changes, what it costs, and which test you have to pass.",
  h1: "Renewal, refinance, or a HELOC",
  dek: "A renewal keeps the balance you already owe. A refinance borrows more, or stretches the years, and is underwritten as new credit. A HELOC is a revolving limit, and the revolving part stops at 65% of value even when the house can secure 80%.",
  sourcesLine:
    "Sources: OSFI on the qualifying rate and on combined mortgage-HELOC plans, the Department of Finance on portfolio straight switches, and FCAC on renewal statements, penalties, and HELOCs. The commitment is the price.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH3,
  howTo: {
    name: "How to choose a renewal, a refinance, or a HELOC",
    description:
      "Name the cash you actually need, check it against the 65% and 80% limits, and price the penalty and the stress test before you stretch the amortization to make the payment look smaller.",
    steps: [
      {
        name: "Separate a renewal from new money",
        text: "A renewal replaces the term on the balance you owe. Taking equity out, or lengthening the amortization, is a refinance.",
      },
      {
        name: "Cap the revolving piece at 65%",
        text: "A combined plan can go to 80% of value. Anything above 65% has to amortize, and it cannot be readvanced.",
      },
      {
        name: "Price the break and the qualifying payment",
        text: "Mid-term, ask for the penalty, including the interest-rate differential, not only three months of interest. A refinance is qualified at the greater of the contract plus 2 points and 5.25%.",
      },
    ],
  },
  sections: [
    {
      id: "three",
      heading: "Three names for three different loans",
      paragraphs: [
        `A renewal is a new term on the mortgage you already have. The balance stays, the remaining amortization stays or gets shorter, and you are choosing a rate and a term. <a href="${SOURCES.fcacRenew}">FCAC says</a> a federally regulated lender has to send the renewal statement at least 21 days before the term ends. That letter is an offer from the lender who already has the charge. It is not a survey of the market. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is how to shop the weeks before that date. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> places one offer against rates self-reported by Canadian borrowers online.`,
        `A refinance replaces the loan with a larger one, or with a longer amortization, or both. The usual reasons are cash for a renovation, a payout of other debt, or a payment that has become too high. It is new credit. The old charge is discharged and a new one is registered. If you do it before maturity, the current lender is also owed a penalty. A straight switch at maturity, covered in the <a href="/guides/switching-mortgage-lenders-at-renewal/">switching guide</a>, is the renewal that changes lenders without becoming this. The moment you add equity, or add years, the file stops being a switch.`,
        `A HELOC is a revolving limit secured by the house. You pay interest on what you draw, you can repay and draw again, and the rate is typically the lender's prime plus a margin. <a href="${SOURCES.fcacHeloc}">FCAC's HELOC page</a> is the consumer description. It is not a second name for a refinance. A refinance gives you a cheque and an amortizing payment. A HELOC gives you a limit. Most people who say they want to "refinance a little" actually want one of those two, and the costs are not alike.`,
      ],
    },
    {
      id: "limits",
      heading: "One house, an 80% ceiling, and a 65% revolving cap",
      paragraphs: [
        `Use a labelled house worth ${cad(c.home)}. The value is an assumption for the arithmetic, not a price from a sale and not a city median. The mortgage is ${cad(c.owing)} with ${c.yearsLeft} years left, so the loan-to-value is ${c.ltv.toFixed(0)}%. <a href="${SOURCES.osfiHeloc}">OSFI's clarification of Guideline B-20</a> is the limit that matters. The combined authorized amount of a mortgage and a HELOC cannot exceed 80% of value. On this house that combined ceiling is ${cad(c.combinedLimit)}. The room between the balance and that ceiling is ${cad(c.cashTo80)}. That ${cad(c.cashTo80)} is the most new borrowing the house can secure, and only if a lender agrees the value and the income.`,
        `The revolving piece is tighter. Any lending above 65% of value has to be amortizing, and it cannot be readvanced. Principal paid on that slice reduces the overall limit until the combined limit is back to 65%. On this house 65% is ${cad(c.revolvingLimit)}. With the mortgage left at ${cad(c.owing)}, the revolving room is ${cad(c.helocRoom)}. The other ${cad(c.sliceAbove65)} of the 80% room, if you use it, has to be a loan that pays down and does not refill. You cannot stack a ${cad(c.cashTo80)} HELOC on top of the existing mortgage. The ${cad(c.sliceAbove65)} above 65% is not a line of credit.`,
        `Paying the mortgage down increases revolving room, because the 65% cap is on combined lending. Raising the mortgage toward ${cad(c.combinedLimit)} does the opposite: revolving room shrinks to nothing, and ${cad(c.sliceAbove65)} of the new mortgage must amortize. A lender's "up to 80%" is the combined cap. Read the commitment for how much of it revolves. A narrow insured exception covers a loan that adds housing units. It is not a cash-out refinance, and <a href="${SOURCES.cmhcPremiums}">CMHC's purchase-premium schedule</a> does not apply to ordinary equity take-out.`,
      ],
    },
    {
      id: "payments",
      heading: "What the payment does when the rate is held still",
      paragraphs: [
        `The reported-rate file dated ${REPORTED_AS_OF}, covering ${REPORTED_FROM} to ${REPORTED_TO}, rounds both 5-year fixed medians used here to ${pct(c.renewRate)}. Insured status was not stated on one cell (N = ${REPORTED_FIXED_N}). The other is uninsured (N = ${c.reportedUninsuredN}). Both clear 10 reports. The example holds the rate constant on purpose, so the gaps below are the balance and the amortization. A renewal of a mortgage that is already insured can stay on the insured shelf. A cash-out refinance is uninsured. Live specials on the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> pages often differ. If your refinance quote is higher, add that gap on top. The <a href="/guides/cmhc-mortgage-insurance-canada/">CMHC insurance guide</a> works one version of it with a scraped special.`,
        `Renewing ${cad(c.owing)} over the ${c.yearsLeft} years left, at ${pct(c.renewRate)}, is a payment of ${cad(c.renewPay)}. Refinancing up to the ${cad(c.combinedLimit)} combined limit and keeping ${c.yearsLeft} years is ${cad(c.refiSame)}, about ${cad(c.paymentJumpSameAm)} more a month. Refinancing to the same ${cad(c.combinedLimit)} and stretching to 30 years is ${cad(c.refiLong)}, about ${cad(Math.abs(c.paymentChangeLong))} less a month than the renewal. The lower payment is the trap. Over five years that 30-year refinance costs about ${cad(c.extraInterestFiveYears)} more interest than simply renewing, and the balance at the end of those five years is about ${cad(c.extraBalanceFiveYears)} higher. You took ${cad(c.cashTo80)} of cash at the start. The balance gap is larger than that cash because the 30-year schedule repays principal more slowly. The <a href="/tools/mortgage-calculator/">payment calculator</a> will reprice any of these. A lender that compounds semi-annually can differ by a few dollars from this monthly formula.`,
      ],
      table: {
        caption: `Decision on a ${cad(c.home)} house with ${cad(c.owing)} owing and ${c.yearsLeft} years left. Every mortgage row uses ${pct(c.renewRate)}, the rounded reported median. The HELOC row uses an example margin, not that median.`,
        headers: ["Choice", "Balance and term", "Payment", "What the payment is"],
        rows: [
          ["Renew", `${cad(c.owing)} over ${c.yearsLeft} years`, cad(c.renewPay), "The loan you already have"],
          ["Refinance, same years", `${cad(c.combinedLimit)} over ${c.yearsLeft} years`, cad(c.refiSame), `${cad(c.paymentJumpSameAm)} more than the renewal`],
          ["Refinance, 30 years", `${cad(c.combinedLimit)} over 30 years`, cad(c.refiLong), `${cad(Math.abs(c.paymentChangeLong))} less than the renewal, and more interest`],
          ["HELOC, room under 65%", `${cad(c.helocRoom)} drawn, revolving`, `${cad(c.helocMonthly)} interest`, `Example rate of ${pct(c.helocRate)}, interest only`],
        ],
      },
    },
    {
      id: "qualify",
      heading: "The stress test comes back when the loan changes",
      paragraphs: [
        `Renewing with the same lender is generally not a new application, so the set qualifying rate is not re-run the way it is on a purchase. That is a description of how federally regulated lenders treat a renewal, not a promise that your letter will be the best rate in the market. A straight switch is the case where you move lenders and still want that treatment. <a href="${SOURCES.osfiSwitch}">OSFI's November 21, 2024 backgrounder</a> does not set a minimum qualifying rate for an uninsured straight switch between federally regulated lenders when the amortization does not increase and the loan amount does not increase. The new lender can still decline the file.`,
        `<a href="${SOURCES.financeStraightSwitch}">The Department of Finance, on December 16, 2024</a>, removed the minimum qualifying rate for low-ratio renewals that meet straight-switch criteria and are, or will be, portfolio-insured. On those files the balance may increase by up to $3,000 to cover transaction costs. There is no equity take-out, the amortization is maintained, the mortgage was originated at a federally regulated institution and previously assessed against the qualifying rate, and the rule covers applications on or after that date. The $3,000 is this portfolio rule. It is not a sentence in the OSFI backgrounder, which says the loan amount does not increase. An insured borrower switching at renewal without a new stress test is the Canadian Mortgage Charter point in the <a href="${SOURCES.financeReforms}">September 16, 2024 announcement</a>, not the December portfolio note.`,
        `A refinance is outside both of those exemptions. At a federally regulated lender the qualifying rate is the greater of the contract plus 2 percentage points and 5.25%. On this example the contract is ${pct(c.refinanceRate)}, so the qualifying rate is ${pct(c.refiQualifying)}. The floor of 5.25% does not bind. The qualifying payment on ${cad(c.combinedLimit)} over 30 years is ${cad(c.refiQualifyPay)}. You have to support that figure, not the contract payment of ${cad(c.refiLong)}. Stretching the amortization lowers the payment you qualify on, which is the same mechanism as an insured 30-year purchase, but a cash-out refinance is not that product. Insured 30-year amortizations are for eligible high-ratio purchases. The <a href="/guides/30-year-amortization-canada/">30-year amortization guide</a> is who qualifies. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is the ratio. The <a href="/tools/stress-test-qualifier/">stress test qualifier</a> runs it.`,
      ],
    },
    {
      id: "costs",
      heading: "Penalties, and the fees this page will not invent",
      paragraphs: [
        `Break the term to refinance and the penalty is due. On a variable contract it is often three months of interest. On a fixed contract it is often the greater of three months of interest and an interest-rate differential, and the differential can be much larger. Using the ${pct(c.penaltyRate)} reported median as the contract rate, three months of simple interest on ${cad(c.owing)} is about ${cad(c.threeMonths)}. That figure is only the three-month method, calculated as the balance times the rate times three-twelfths. It is not your penalty. An interest-rate differential uses the lender's comparison rate, which is often tied to a posted rate. The <a href="/guides/mortgage-prepayment-penalties/">prepayment penalty guide</a> and the <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> are that calculation. The <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted guide</a> is why the posted shelf shows up inside a break fee.`,
        `Legal or notary fees, an appraisal, and a discharge are real, and they vary by lender, by province, and by whether the charge is collateral. This page does not price them. <a href="${SOURCES.fcacDischarge}">FCAC's discharge page</a> is what to ask for in writing, and <a href="${SOURCES.fcacPenalty}">FCAC's penalty page</a> is the prepayment charge. Get the penalty quote and the fee quote from the lender before you compare a refinance payment with a renewal payment. A new lender sometimes covers part of a straight-switch bill. That offer is a line in a commitment, not a feature of a refinance that takes ${cad(c.cashTo80)} out. At maturity the prepayment penalty usually drops away. The refinance math is cleaner then, and the stress test does not drop away with it.`,
      ],
    },
    {
      id: "heloc",
      heading: "When the HELOC is the smaller tool",
      paragraphs: [
        `Draw the ${cad(c.helocRoom)} of revolving room at an example rate of prime plus ${pct(c.helocMargin, 2).replace("%", "")} points. Prime on this site is ${pct(c.helocRate - c.helocMargin)}, so the example rate is ${pct(c.helocRate)}. That margin is not a posted HELOC grid. Interest on the full draw is about ${cad(c.helocMonthly)} a month, and nothing in that payment reduces the principal. A quarter-point rise in prime adds about ${cadCents(c.helocIfPrimeRises)} a month on that drawn amount. The <a href="/guides/bank-of-canada-rate-and-your-mortgage/">Bank of Canada guide</a> is why prime moves and a fixed mortgage rate does not have to. The <a href="/rates/variable/">variable</a> page is the mortgage version of a prime-based rate. A HELOC margin and a variable-mortgage discount are not the same contract.`,
        `The HELOC wins when the cash need is small, uncertain, or short. ${cad(c.helocMonthly)} a month on ${cad(c.helocRoom)} is a different product from a ${cad(c.paymentJumpSameAm)} payment increase to borrow ${cad(c.cashTo80)}. It loses when you will carry the balance for years, because interest-only revolving debt does not end, and because you cannot revolve the ${cad(c.sliceAbove65)} above 65%. It also loses if the only way to create the room is to refinance the mortgage first and pay a penalty to do it. A readvanceable combined plan from a bank is still subject to the same 65% and 80% split. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender comparison</a> is who actually offers the line. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the mortgage sitting beside it.`,
      ],
    },
    {
      id: "choose",
      heading: "How to pick, on this house",
      paragraphs: [
        `Stay with the renewal at ${cad(c.renewPay)} if you do not need the ${cad(c.cashTo80)}. Shop the rate, including a straight switch, and do not lengthen the ${c.yearsLeft} years to make a letter look kinder. Take the HELOC, and only the ${cad(c.helocRoom)} that can revolve, if the expense is smaller than that room and you can see the month you will repay it. Refinance to ${cad(c.combinedLimit)} over the same ${c.yearsLeft} years if you need the cash and can carry ${cad(c.refiSame)}, and if the penalty, asked for in writing, does not eat the reason you borrowed.`,
        `The 30-year refinance, at ${cad(c.refiLong)}, is the one that looks easier than the renewal and costs about ${cad(c.extraInterestFiveYears)} more interest over five years. Use it only when the qualifying payment of ${cad(c.refiQualifyPay)} fits and the cash has a job that is worth that interest. Then check the rate you were actually offered against the <a href="/rates/5-year-fixed/">5-year fixed</a> table and against <a href="/real-mortgage-rates/">real mortgage rates</a>. The rounded variable median in the same file is ${REPORTED_VARIABLE} (N = ${REPORTED_VARIABLE_N}), which is a different product from the fixed row in the table. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> does not belong on this refinance. Ordinary equity take-out is not an insured purchase.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The 80% and 65% limits are OSFI's combined-plan clarification. The qualifying-rate exemptions are OSFI's November 2024 backgrounder and Finance's December 2024 portfolio note, kept separate. The payments use this site's monthly formula at the reported median named above.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.osfiHeloc}">OSFI, combined loan plans under Guideline B-20</a>. Combined limit 80% of value. Lending above 65% amortizes and is not readvanced.`,
        `<a href="${SOURCES.osfiSwitch}">OSFI, minimum qualifying rate backgrounder, November 21, 2024</a>. No set qualifying rate on an uninsured straight switch when the loan amount and the amortization do not increase.`,
        `<a href="${SOURCES.financeStraightSwitch}">Department of Finance, December 16, 2024</a>. Portfolio straight switches, including up to $3,000 for transaction costs.`,
        `<a href="${SOURCES.fcacRenew}">FCAC, renewing your mortgage</a>, <a href="${SOURCES.fcacHeloc}">HELOCs</a>, and <a href="${SOURCES.fcacPenalty}">prepayment penalties</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is renewing my mortgage the same as refinancing it?",
      answer:
        "No. A renewal sets a new term on the balance you owe, with the same or a shorter amortization. A refinance borrows more, or lengthens the amortization, and is underwritten as new credit. Adding even a renovation budget to a maturity-day switch turns it into a refinance.",
    },
    {
      question: "Does the stress test apply when I renew with my own bank?",
      answer:
        "A renewal with the same lender is generally not a new application, so the set qualifying rate is not re-run. A straight switch to another federally regulated lender can stay outside that set rate if you do not increase the amortization and you do not take equity out. A refinance is tested at the greater of the contract plus 2 points and 5.25%.",
    },
    {
      question: "Can my HELOC go to 80% of the house?",
      answer:
        "The combined mortgage and HELOC can be authorized up to 80% of value. The revolving portion stops at 65%. On a $750,000 house with $465,000 owing, the revolving room is $22,500. The other $112,500 up to the 80% ceiling has to amortize, and it cannot be drawn again.",
    },
    {
      question: "Is $5,057 the penalty to refinance this example?",
      answer:
        "No. That figure is three months of simple interest on $465,000 at the 4.35% reported median. It is an illustration of one method. A fixed-rate penalty is often the greater of that method and an interest-rate differential, which can be larger. Legal fees and an appraisal are separate, and this page does not price them.",
    },
    {
      question: "Why is the refinance rate the same as the renewal rate here?",
      answer:
        "Both rounded medians in the file are 4.35%: the 5-year fixed median where insured status was not stated (N = 40), and the uninsured 5-year fixed median (N = 27). They are self-reported by Canadian borrowers online. Holding the rate still isolates the balance and the amortization. Your refinance quote can be higher, especially if the renewal would have stayed on an insured shelf.",
    },
  ],
};
