import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO_BATCH2,
  RATE_CONTEXT,
  RATE_SHEET,
  REPORTED,
  SOURCES,
  SWITCH_MATH as s,
  cad,
  pct,
} from "./shared";

export const switchingLenders: InDepthGuide = {
  slug: "switching-mortgage-lenders-at-renewal",
  path: "/guides/switching-mortgage-lenders-at-renewal/",
  metaTitle: "Switching Mortgage Lenders at Renewal | Latest Mortgage Rates Canada",
  description:
    "How a straight switch at renewal works in Canada: discharge, legal, and appraisal costs, what the new lender often pays, the documents, the timeline, and when the stress test stays out of it.",
  keywords:
    "switch mortgage lenders at renewal Canada, straight switch stress test, mortgage discharge fee, collateral charge switch, mortgage renewal timeline",
  cardTitle: "Switching lenders at renewal",
  cardDescription:
    "Discharge, legal, and appraisal costs, the straight-switch exemption from the set stress-test rate, and the papers to have ready before maturity.",
  h1: "Switching mortgage lenders at renewal",
  dek: "Maturity is the day the break fee usually drops to zero. A straight switch keeps the balance and the remaining amortization, and since late 2024 the set stress-test rate stays out of that file at a federally regulated lender. The bill that remains is paperwork, and someone has to pay it.",
  sourcesLine:
    "Sources: OSFI, the Department of Finance, FCAC, and the rate files on this site. The payout statement from your current lender is the balance that gets switched.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH2,
  howTo: {
    name: "How to switch Canadian mortgage lenders at renewal",
    description:
      "Confirm the maturity date and the charge, get a straight-switch quote on the same balance, and fund on the maturity date so the penalty stays at zero.",
    steps: [
      {
        name: "Read the charge and the maturity date",
        text: "Write down the balance, the rate, the maturity date, the remaining amortization, whether the mortgage is insured, and whether the charge is a standard charge or a collateral charge tied to a line of credit.",
      },
      {
        name: "Ask for a straight switch, not a refinance",
        text: "The new loan pays out the old balance. You do not take equity out, and the amortization does not get longer. OSFI allows up to $3,000 of transaction costs to be added.",
      },
      {
        name: "Get the costs in the commitment",
        text: "Ask the new lender, in writing, whether it will pay the discharge fee, the legal or notary bill, and the appraisal. If it will not, price those amounts against the payment you save.",
      },
      {
        name: "Fund on the maturity date",
        text: "A switch that funds on maturity avoids the prepayment penalty. Leave time for the payout statement, the lawyer or notary, and any registration.",
      },
    ],
  },
  sections: [
    {
      id: "why",
      heading: "Why renewal is the day to leave",
      paragraphs: [
        `A closed mortgage charges a penalty for leaving early. On the maturity date that penalty is normally zero. <a href="${SOURCES.fcacPenalty}">FCAC</a> tells borrowers to shop the renewal for that reason. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> is the longer version of the same calendar, including blend-and-extend, which is a same-lender product and not a switch. This page is the move to a different lender.`,
        `${RATE_CONTEXT} A fixed offer you lock for the maturity date does not have to wait for that announcement. A variable offer will follow prime after it.`,
        `Put the letter you were mailed on the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> before you decide the gap is worth a move. The rounded 5-year fixed median in the file, insured status not stated, is ${pct(s.market)} (N = ${REPORTED.fixedN}). The figures are self-reported by Canadian borrowers online. A small sample is a weak benchmark. Insured and uninsured letters belong on the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> shelves, not in one blended number.`,
      ],
    },
    {
      id: "straight",
      heading: "What a straight switch is",
      paragraphs: [
        `Since November 21, 2024, <a href="${SOURCES.osfiMqr}">OSFI</a> does not require a set minimum qualifying rate when an uninsured borrower switches at renewal from one federally regulated lender to another, the loan amount does not go up, and the remaining amortization does not get longer. <a href="${SOURCES.osfiStraightSwitch}">The guidance</a> is tighter than the slogan. The mortgage has to be a stand-alone amortizing loan, not readvanceable, and outside a combined loan plan. A standard charge and a collateral charge can both qualify if they are stand-alone. The unpaid balance may be increased by $3,000 to cover transaction costs such as penalties or fees. Equity take-out is not allowed. The new lender still underwrites the file under Guideline B-20. It can decline you for credit, income, or the property. It can use its own stressed rate. The exemption is from the prescribed rate, the greater of the contract plus 2 points and 5.25%, not from having a lender at all.`,
        `Insured straight switches were already outside a fresh stress test. The <a href="${SOURCES.financeReforms}">Department of Finance</a>, in September 2024, said the Canadian Mortgage Charter lets insured borrowers switch at renewal without another one. A straight switch of an insured loan is not a new insured purchase, so it does not start a new premium. Confirm the new lender is approved with the insurer, and confirm the policy number travels. Adding money beyond the costs OSFI described, or stretching the amortization, turns the file into a refinance. The qualifying rate comes back, and an insured increase can trigger a premium on the increase. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is that math. The <a href="/tools/stress-test-qualifier/">stress test qualifier</a> runs it. The <a href="/tools/refinance-calculator/">refinance calculator</a> is the tool when you actually want to take cash out.`,
        `A provincially regulated credit union is outside OSFI's rule. Ask, in writing, which qualifying rate it will use. A federal credit union is in the federal system. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender comparison</a> is the regulatory difference, and it is also the penalty you will live with after the switch. Leaving a harsh interest-rate differential behind is a reason to switch that a tenth of a point does not capture. Read the <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> before you trade into a new five-year fixed term you might not finish.`,
      ],
    },
    {
      id: "costs",
      heading: "Discharge, legal, appraisal, and who pays",
      paragraphs: [
        `<a href="${SOURCES.fcacDischarge}">FCAC's discharge page</a> splits the bill into three pieces. The lender may charge a discharge fee. Where a province does not cap it, FCAC says the fee typically runs from no charge up to $400, and a federally regulated lender has to disclose it in the contract. Some provinces and territories set a maximum. A lawyer, a notary, or both, registers the discharge and the new charge. FCAC puts those professional fees, in the typical case, between $400 and $2,500. An appraisal, an administration fee, or a reinvestment fee can show up if you are breaking a term rather than waiting for maturity. At maturity the prepayment penalty itself should be zero. Ask for the payout statement anyway. It is the number the new lender funds.`,
        `<a href="${SOURCES.fcacBreak}">FCAC also says</a> lenders may be willing to pay some or all of the fees, and it tells you to ask the new lender whether it will cover the discharge. On a straight switch at maturity, that ask is ordinary. Many commitments say the new lender will pay the discharge, the legal or notary bill, and the appraisal. That sentence is a negotiation, not a statute. Get it in the commitment. A verbal "we usually cover it" does not survive a collateral-charge file that needs a fuller registration. If the lender caps what it will pay, the overage is yours.`,
        `Labelled arithmetic, so the gap has a size. Balance ${cad(s.balance)}, ${s.yearsLeft} years of amortization left, which matches the kind of 2021 loan the renewal playbook uses. One reference point is the 5-year fixed uninsured special on RBC's page in our scrape dated ${RATE_SHEET.scrapedAt}, ${pct(s.letter)}. The other is the rounded reported 5-year fixed median, ${pct(s.market)}. Payments on this site's formula are ${cad(s.letterPayment)} and ${cad(s.marketPayment)}. The difference is ${cad(s.monthlySave)} a month, about ${cad(s.termSave)} over five years. A labelled stack of a $400 discharge, the top of FCAC's unregulated range, plus $1,100 of legal and appraisal, ${cad(s.uncovered)} together, is recovered in about ${s.monthsToRecover.toFixed(1)} months at that gap. Net of that stack, the five-year payment difference is still about ${cad(s.netIfUncovered)}. If the new lender pays the stack, the cost of the switch at maturity is zero and the whole gap remains. Neither reference rate is a promise. A tenth of a point may not survive a harsh penalty on the new contract. Price the payment on the <a href="/tools/mortgage-calculator/">mortgage calculator</a> and the break fee on the <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a>. The <a href="/tools/mortgage-renewal-calculator/">renewal calculator</a> will take a switching-cost figure and put it next to the interest.`,
      ],
    },
    {
      id: "timeline",
      heading: "A timeline that fits a maturity date",
      paragraphs: [
        "No statute tells you to start 120 days out. The useful dates are the maturity date on your statement, the expiry on any rate hold, and the time a lawyer or notary needs to register. Four months is enough for most straight switches. Six months is comfortable when the charge is collateral, the property is a leasehold, or you are self-employed and the new lender will want more paper. A hold that starts the new rate now is not a switch at maturity. It gives up the remaining months of the old rate. Ask which date the quote uses.",
      ],
      listAfter: 0,
      items: [
        "Read the annual statement. Balance, rate, maturity, prepayment room already used, penalty method, insurer if there is one, and standard charge or collateral charge.",
        "Get the current lender's renewal offer in writing. Put it through the renewal offer checker. Get a second quote on the same balance, the same remaining amortization, and the same insured status.",
        "Tell the new lender it is a straight switch. Ask about the $3,000 cost allowance, the stress-test treatment, and which fees are covered. Ask the current lender for the discharge fee in writing.",
        "The new lender orders the payout statement and, if it wants one, the appraisal. You sign the commitment. The lawyer or notary gets instructions.",
        "Fund on the maturity date. The old lender is paid out. The new charge is registered and the old one is discharged. Keep the payout confirmation. A switch that misses the date can land in an open rate, or in the renewal you meant to refuse, until the paperwork catches up.",
      ],
    },
    {
      id: "documents",
      heading: "Documents the new lender actually asks for",
      paragraphs: [
        "The exemption from a prescribed qualifying rate does not exempt the file from income documents. OSFI still expects the new lender to assess your capacity. A straight switch is often thinner than a purchase, and it is not a blank form. Have these ready. Names differ by lender. The list is the substance.",
      ],
      listAfter: 0,
      items: [
        "Government photo identification for each borrower.",
        "The current mortgage statement or annual mortgage statement: balance, rate, payment, maturity date, lender, and, if insured, the insurer and policy number.",
        "The renewal offer, if it has arrived, and the most recent property tax bill.",
        "Home insurance, with the new lender named as the loss payee once the commitment says so.",
        "Income: recent pay stubs, a letter from the employer, and T4s. Self-employed files usually add notices of assessment and, where the lender asks, financial statements. Two years is the ordinary request. The commitment will say if it wants more.",
        "A void cheque or a direct-deposit form for the new payment.",
        "If the charge is collateral, or a line of credit is registered against the house, the current lender's statement for that line and its instructions for a discharge. A combined loan plan is outside OSFI's straight-switch exemption.",
      ],
    },
    {
      id: "charge",
      heading: "Collateral charges, insurance, and credit unions",
      paragraphs: [
        "A standard charge secures one mortgage. It can often be assigned or replaced with a straightforward discharge and a new registration. A collateral charge secures the house for a wider borrowing relationship. OSFI's exemption can still cover a collateral charge that is stand-alone, amortizing, and not readvanceable. In practice the new lender often cannot take an assignment of it, so the lawyer discharges it and registers a new charge. That is more work, and it is where a cap on legal fees gets used up. If a home-equity line is part of the same charge, paying the line out or leaving it behind has to be decided before anyone calls the file a straight switch. Equity you roll into the new mortgage is a refinance.",
        "An insured switch should keep the existing insurance. You are not buying a new policy, and you should not be quoted a new premium on the same balance. The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> belongs to a new purchase with less than 20% down, or to a refinance that needs fresh insurance. It is the wrong tool for a straight switch of a loan that is already insured. If the switch somehow increases the loan, stop and ask the insurer what premium applies to the increase. The <a href=\"/guides/posted-vs-discounted-mortgage-rates/\">posted versus discounted guide</a> is worth reading before you accept a bank's special as the switch rate. The special and the posted shelf are different numbers, and the posted shelf is an input to many break fees on the term you are about to sign.",
        "Compare the switch rate with the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> and <a href=\"/rates/variable/\">variable</a> pages, and with <a href=\"/real-mortgage-rates/\">real mortgage rates</a>. A monoline is a common destination because the rate is the product. A branch bank is a common destination because the chequing account is already there. The <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> is the conversation with the lender who wants to keep you. They will often revise a letter once a written switch quote is on the table. The <a href=\"/disclaimer/\">disclaimer</a> applies.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Fee ranges below are FCAC's published typical ranges, not a quote from your lender. The $3,000 figure is OSFI's allowance for transaction costs on an uninsured straight switch.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a>. No set minimum qualifying rate on an uninsured straight switch at renewal.`,
        `<a href="${SOURCES.osfiStraightSwitch}">OSFI, straight-switch guidance, November 21, 2024</a>. Stand-alone loan, no longer amortization, no equity take-out, up to $3,000 for transaction costs.`,
        `<a href="${SOURCES.osfiSwitch}">OSFI backgrounder</a>. The same conditions, in shorter form.`,
        `<a href="${SOURCES.financeReforms}">Department of Finance, September 16, 2024</a>. Insured borrowers and the Mortgage Charter switch statement.`,
        `<a href="${SOURCES.fcacDischarge}">FCAC, discharging a mortgage</a>. Discharge fees typically from $0 to $400 where unregulated, professional fees typically $400 to $2,500.`,
        `<a href="${SOURCES.fcacBreak}">FCAC, breaking a mortgage contract</a>. Ask whether the new lender will pay some or all of the fees.`,
        `<a href="${SOURCES.fcacPenalty}">FCAC, prepayment penalties</a>. Why maturity is the cheap day to leave.`,
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. Overnight target held at 2.25%. Next announcement October 28, 2026.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Do I have to pass the stress test to switch lenders at renewal?",
      answer:
        "Not at the prescribed minimum qualifying rate, if the switch is straight. For an uninsured mortgage, OSFI has not required that set rate since November 21, 2024 when you move between federally regulated lenders, the balance does not rise except for up to $3,000 of transaction costs, and the amortization does not get longer. Insured switches were already covered. The new lender can still decline the file, and a credit union that is not federally regulated sets its own test. Adding equity or years brings the qualifying rate back.",
    },
    {
      question: "Will the new lender pay the legal fees and the discharge?",
      answer:
        "Often, on a straight switch at maturity, and only if the commitment says so. FCAC tells you to ask. Discharge fees, where a province does not cap them, typically run from nothing up to $400. Lawyer or notary fees typically run from $400 to $2,500. An appraisal may be extra. A cap on what the lender will reimburse leaves the overage with you, which is more likely when a collateral charge has to be discharged and registered again.",
    },
    {
      question: "What is the difference between a switch and a refinance?",
      answer:
        "A switch pays out the current balance and keeps the remaining amortization the same or shorter. A refinance borrows more, rolls in other debts, or resets the amortization longer. OSFI treats equity take-out as outside the straight-switch exemption. The stress test applies to that refinance at a federally regulated lender. The $3,000 allowance is for transaction costs, not for a renovation.",
    },
    {
      question: "Can I switch a collateral mortgage?",
      answer:
        "Yes, and it is more work. OSFI's exemption can include a collateral charge that is stand-alone, amortizing, and not readvanceable. Many of those charges cannot be assigned, so a lawyer discharges the old registration and registers a new one. A home-equity line on the same charge is a combined loan plan. That structure is outside the exemption until the line is dealt with. Ask both lenders what they need before you book the maturity date.",
    },
    {
      question: "Does a switch at renewal cost a prepayment penalty?",
      answer:
        "Not if it funds on the maturity date. The penalty for a closed term is for leaving early. FCAC describes that penalty as the higher of three months' interest and the interest rate differential. Waiting for maturity is how you avoid it. Starting the new lender's rate before maturity, or breaking the term to chase a lower rate today, puts the penalty back on the payout. Read the renewal playbook before you give up months that are still at the old rate.",
    },
  ],
};
