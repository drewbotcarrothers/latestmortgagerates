import type { InDepthGuide } from "./shared";
import {
  BUYER_MATH as b,
  GUIDE_REVIEWED_ISO_BATCH2,
  REPORTED,
  SOURCES,
  cad,
  pct,
} from "./shared";

export const firstTimeBuyerPrograms: InDepthGuide = {
  slug: "first-time-home-buyer-programs-canada",
  path: "/guides/first-time-home-buyer-programs-canada/",
  metaTitle: "First-Time Home Buyer Programs in Canada (2026) | Latest Mortgage Rates",
  description:
    "FHSA, the Home Buyers' Plan, the first-time GST/HST rebate on new homes, the home buyers' amount, 30-year insured amortizations, and land transfer tax relief by province, with the dollars worked out.",
  keywords:
    "first-time home buyer Canada 2026, FHSA, Home Buyers Plan, GST rebate new home, land transfer tax rebate, 30-year insured mortgage",
  cardTitle: "First-time home buyer programs",
  cardDescription:
    "FHSA, the Home Buyers' Plan, the new-home GST/HST rebate, provincial transfer taxes, and who can still get a 30-year insured amortization.",
  h1: "First-time home buyer programs in Canada",
  dek: "Ottawa and the provinces do not share one definition of a first home. A withdrawal, a tax credit, a transfer-tax refund, and a 30-year amortization can each accept a buyer the others turn away. Here is what each one pays, and what it refuses.",
  sourcesLine:
    "Sources: CRA, CMHC, the Department of Finance, Ontario, Toronto, British Columbia, Prince Edward Island, Revenu Québec, and Alberta Land Titles. Your lawyer and the CRA account control the claim.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH2,
  howTo: {
    name: "How to stack Canadian first-time buyer programs",
    description:
      "Check the FHSA and the Home Buyers' Plan separately from the GST rebate and the provincial transfer tax, then see whether a 30-year insured amortization is even available on the house.",
    steps: [
      {
        name: "Open the FHSA before you need the room",
        text: "Participation room starts in the year you open the account. It does not pile up for the years you meant to open one.",
      },
      {
        name: "Match each program to its own first-time test",
        text: "The FHSA, the Home Buyers' Plan, the GST rebate, and a provincial land transfer refund do not use the same look-back. Write down which test you pass.",
      },
      {
        name: "Separate a new home from a resale",
        text: "The first-time GST/HST rebate is for a new or substantially renovated home. A resale can still use the FHSA, the Home Buyers' Plan, and a provincial transfer-tax program.",
      },
      {
        name: "Price the amortization before you fall in love with the payment",
        text: "An insured 30-year amortization is for a first-time buyer or a buyer of a new build, on a high-ratio loan under $1.5 million. It lowers the payment and raises the premium.",
      },
    ],
  },
  sections: [
    {
      id: "tests",
      heading: "Four programs, four definitions",
      paragraphs: [
        "A first home is several tests. The FHSA and the Home Buyers' Plan ask whether you lived in a home you or your spouse owned in the withdrawal year and the four calendar years before it. Ontario's land transfer refund asks whether you have ever owned a home anywhere. British Columbia asks about a registered principal residence and adds a residency test. The GST/HST rebate is only for a new or substantially renovated home, with an agreement on or after March 20, 2025. Passing one test is not a pass on the others.",
        "They also pay different things. The FHSA and the Home Buyers' Plan move savings into the down payment. The GST rebate reduces tax on a new build. A land transfer refund reduces tax due on closing. The home buyers' amount is a non-refundable credit. A 30-year insured amortization stretches the loan. It does not hand you cash. Write each program on its own line, then add only the lines you qualify for.",
        `The rate on the loan is a separate stack. In the reported-rate file dated ${REPORTED.asOf}, the rounded 5-year fixed median, insured status not stated, is ${REPORTED.fixedMedian}, and the rounded 5-year variable median is ${REPORTED.variableMedian}. Those figures are self-reported by Canadian borrowers online. They are not a first-time discount. Compare live shelves on the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages, and the distribution on <a href="/real-mortgage-rates/">real mortgage rates</a>. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the term choice. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is the qualifying math.`,
      ],
    },
    {
      id: "fhsa",
      heading: "The First Home Savings Account",
      paragraphs: [
        `<a href="${SOURCES.fhsaRoom}">The CRA</a> sets FHSA participation room at $8,000 in the year you open your first account. Room does not accumulate for the years before that. Each later year adds another $8,000, up to a lifetime limit of $40,000. Unused room carries forward, and the carryforward itself is capped at $8,000, so a year you skip can make the next contribution as large as $16,000 and no larger. Five years of the full $8,000 uses the lifetime limit. Income inside the account does not consume room. A transfer from an RRSP uses the same room, and it is not deducted a second time. More than one FHSA does not create more room.`,
        `Contributions are deductible. On a labelled 30% combined marginal rate, an illustration and not a 2026 bracket, $8,000 of contributions reduces tax by ${cad(b.fhsaDeductionIllustration)}. <a href="${SOURCES.fhsaWithdraw}">A qualifying withdrawal</a> is not taxed and is not repaid. Nothing has to sit in the account for a minimum number of days. You need a written agreement to buy or build, with completion before October 1 of the year after the withdrawal, and you need to occupy the home as your principal residence within a year. You cannot cancel the withdrawal. Putting the money back is a new contribution.`,
        `Each buyer withdraws from their own FHSA. Five years at the maximum, before investment growth, is ${cad(b.fhsaLifetime)} per person and ${cad(b.coupleFhsa)} for a couple. Growth can come out tax-free on a qualifying withdrawal. A withdrawal that misses the test is taxable. The account ends at 15 years, at age 71, or the year after the first qualifying withdrawal. Leftover money can move to an RRSP or a RRIF.`,
      ],
    },
    {
      id: "hbp",
      heading: "The Home Buyers' Plan, including the 2026 repayment window",
      paragraphs: [
        `<a href="${SOURCES.hbp}">The Home Buyers' Plan</a> lets you withdraw up to ${cad(b.hbpLimit)} from your RRSPs to buy or build a qualifying home, without withholding if you stay inside the limit. A couple can each withdraw ${cad(b.hbpLimit)} from their own plans, ${cad(b.coupleHbp)} combined. The CRA says you can do that and make an FHSA qualifying withdrawal for the same home, if you meet each set of conditions at the time of each withdrawal. On the no-growth FHSA illustration above, the couple's FHSA contributions plus both Home Buyers' Plan withdrawals are ${cad(b.coupleCash)} of principal. That is a ceiling made of contribution limits, not a balance anyone is guaranteed to have.`,
        `You repay over 15 years. For a first withdrawal in 2026, the CRA says relief has been extended and the first repayment year is 2031. The same delay runs through a first withdrawal on December 31, 2028. On a full ${cad(b.hbpLimit)} withdrawal the minimum is ${cad(b.hbpAnnualRepayment)} a year if you have not paid early. A missed minimum is income. Repayments do not use RRSP room. Designate them on Schedule 7.`,
        `<a href="${SOURCES.hbpWithdraw}">Contributions in the 89 days before the withdrawal</a> can lose their deduction. You cannot deduct the amount by which those contributions exceed the fair market value of that RRSP just after the withdrawal. Using that formula: contribute $10,000 during the 89 days, withdraw, and leave the RRSP worth $6,000. The non-deductible amount is $4,000. Locked-in and many group RRSPs do not allow the withdrawal. Withdrawals have to fall in the year of the first one and in January of the next year.`,
      ],
    },
    {
      id: "gst",
      heading: "The GST/HST rebate on a new home",
      paragraphs: [
        `<a href="${SOURCES.gstRebate}">The first-time home buyers' GST/HST rebate</a> is open. It recovers GST, or the federal part of the HST, on a new or substantially renovated primary residence. At or below $1 million the rebate is 100% of that federal tax, up to $50,000. From $1 million to $1.5 million it phases down. At $1.5 million there is no rebate. <a href="${SOURCES.gstMemo}">Memorandum 19-3-10</a> writes the phase-out as the lesser of $50,000 and the federal tax, times ($1,500,000 minus the consideration) divided by $500,000. The older new housing rebate, 36% up to $6,300 and gone above $450,000, is subtracted where it also applies.`,
        `In a 5% GST province such as Alberta, with the older rebate already zero above $450,000, a ${cad(b.price)} new home carries GST of ${cad(b.modestGst)}. The first-time rebate is ${cad(b.modestRebate)}, so federal GST left is zero. On the CRA's midpoint, a new home valued at ${cad(b.phasedPrice)}, the federal tax at 5% is ${cad(b.phasedGst)} and the rebate is ${cad(b.phasedRebate)}, half of the $50,000 cap. Federal tax left is ${cad(b.phasedNet)}. A resale has no GST to rebate. A substantial renovation, for this rebate, generally means 90% or more of the interior is removed or replaced.`,
        `<a href="${SOURCES.gstWho}">Eligibility</a> is 18 or older, a citizen or permanent resident, and you did not live in a home you or your spouse owned as a primary residence in that calendar year or the four before it. For a builder purchase the test is applied when ownership transfers. The agreement has to be dated on or after March 20, 2025 and before 2031. A March 18, 2025 agreement is the memorandum's ineligible example. Ontario has a parallel rebate of the provincial part of the HST, described in the same memorandum. Builders can credit the rebate. If they do not, you apply to the CRA, generally within two years.`,
      ],
    },
    {
      id: "credit",
      heading: "The home buyers' amount on the tax return",
      paragraphs: [
        `<a href="${SOURCES.homeBuyersAmount}">Line 31270</a> is a non-refundable credit. The CRA page for the 2025 return lets an eligible buyer claim up to $10,000. The amount has been $10,000 since the 2022 tax year. It reduces federal tax and does not refund you if you owe none. A 2026 purchase is claimed on the 2026 return. Eligible buyers of the same home can split the amount, and the total cannot exceed the maximum. The usual look-back is the year of purchase and the four years before it. A person eligible for the disability tax credit can qualify without being a first-time buyer when the home is more accessible or better suited to their needs.`,
      ],
    },
    {
      id: "thirty",
      heading: "Who can take 30 years on an insured mortgage",
      paragraphs: [
        `<a href="${SOURCES.cmhcHomeStart}">CMHC Home Start</a> insures a high-ratio mortgage, loan-to-value above 80%, for up to 30 years when at least one borrower is a first-time homebuyer or the home is newly built and has not been lived in. The price has to be below $1,500,000. The home is owner-occupied. GDS is capped at 39% and TDS at 44%, at the greater of the contract rate plus 2 points and 5.25%. A repeat buyer of a resale stays at 25 years if the mortgage is insured. The <a href="${SOURCES.financeReforms}">Department of Finance</a> widened these 30-year insured amortizations effective December 15, 2024. An uninsured mortgage, 20% down or more, is outside the program. Lenders commonly offer 30 years on those files themselves.`,
        `The down payment on a ${cad(b.price)} home with less than 20% down is 5% of the first $500,000 and 10% of the rest, which is ${cad(b.down)}. The loan before insurance is ${cad(b.base)}, loan-to-value ${b.ltv.toFixed(2)}%. That sits in the band above 90% and at or under 95%. <a href="${SOURCES.cmhcPremiums}">CMHC's premium schedule</a> charges 4.00% on a traditional down payment in that band, ${cad(b.premium25)}, for an amortization of 25 years or less. Longer than 25 years adds 0.20 points, so 4.20% is ${cad(b.premium30)}. Balances are ${cad(b.balance25)} and ${cad(b.balance30)}.`,
        `At the rounded reported 5-year fixed median of ${pct(b.rate)}, the 25-year payment is ${cad(b.pay25)} and the 30-year payment is ${cad(b.pay30)}, about ${cad(b.paymentSave)} less a month. Over five years the longer loan costs about ${cad(b.extraInterest)} more interest, and the balance is about ${cad(b.extraBalance)} higher. The extra premium is ${cad(b.extraPremium)}. Ontario, Quebec, and Saskatchewan charge sales tax on the premium, and CMHC says that tax cannot be added to the loan. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> uses 25-year bands and stops at $1,500,000, without the surcharge or provincial tax. See the <a href="/guides/30-year-amortization-canada/">30-year guide</a> and the <a href="/guides/cmhc-mortgage-insurance-canada/">insurance guide</a>. The payment is the <a href="/tools/mortgage-calculator/">mortgage calculator</a>. The stress is the <a href="/tools/stress-test-qualifier/">stress test qualifier</a>.`,
      ],
    },
    {
      id: "provinces",
      heading: "Land transfer tax, province by province",
      paragraphs: [
        `<a href="${SOURCES.ontarioLtt}">Ontario</a> refunds up to $4,000 of land transfer tax for a registration on or after January 1, 2017. That clears the tax on about the first $368,000. You must be 18, a citizen or permanent resident, occupy within nine months, and neither you nor your spouse can ever have owned a home anywhere. On a ${cad(b.price)} purchase the tax is ${cad(b.ontario)} before the refund and ${cad(b.ontarioNet)} after it. Claim it at registration or within 18 months. <a href="${SOURCES.torontoMltt}">Toronto</a> adds a municipal tax and rebates up to $4,475. At this price the municipal brackets match the province, so the municipal tax is also ${cad(b.toronto)} and the rebate is ${cad(b.torontoRefund)}. Combined tax falls from ${cad(b.combinedTransfer)} to ${cad(b.combinedNet)}. The rest of the GTA does not charge Toronto's tax. The <a href="/tools/land-transfer-tax-calculator/">land transfer tax calculator</a> is a planning estimate.`,
        `<a href="${SOURCES.bcPtt}">British Columbia</a>, for registrations on or after April 1, 2024, exempts property transfer tax on the first $500,000 when fair market value is $835,000 or less. The exemption shrinks to zero at $860,000. <a href="${SOURCES.bcPttAmounts}">The province's table</a> shows ${cad(b.price)} with tax of ${cad(b.bcTax)}, an exemption of ${cad(b.bcExemption)}, and ${cad(b.bcPayable)} payable. You must be a citizen or permanent resident, meet the B.C. residency test, and never have held a registered principal residence anywhere or received this exemption. The property must be your principal residence, 0.5 hectares or smaller, and residential.`,
        `Alberta has no land transfer tax. <a href="${SOURCES.albertaFees}">Land Titles</a>, for submissions on or after October 1, 2026, charges $50 plus $5 per $5,000 of value. A ${cad(b.price)} transfer is ${cad(b.albertaTransfer)}. Registering the 25-year insured mortgage of ${cad(b.balance25)} is ${cad(b.albertaMortgage)}. Saskatchewan and Newfoundland and Labrador charge registration fees, not a percentage tax. Manitoba generally exempts the first $30,000 and has no first-time refund. Nova Scotia's deed transfer tax is municipal, often 1.5% in Halifax. New Brunswick charges 1% and does not refund it.`,
        `Quebec municipalities still collect the welcome tax at the notary. <a href="${SOURCES.quebecCredit}">Revenu Québec</a> added a refundable credit for a qualifying first home acquired in a taxation year beginning after December 31, 2025: 100% of the first $5,000 of duties plus 25% of the next $3,500, a maximum of ${cad(b.quebecMaxCredit)}. It shrinks by 2.35% of the basis above $750,000 and is zero at $1 million. On a labelled $800,000 basis with duties of at least $8,500, the credit is ${cad(b.quebecPhaseExample)}. You pay the municipality, then claim the credit. <a href="${SOURCES.peiTransfer}">Prince Edward Island</a> waives its transfer tax for an eligible first-time buyer who will occupy the home. Its page states no price cap. The tax comes back if you do not occupy for 183 consecutive days. The <a href="/tools/closing-costs-calculator/">closing costs calculator</a> covers the legal bill, which none of these programs rebate.`,
      ],
    },
    {
      id: "cash",
      heading: "What still has to be cash",
      paragraphs: [
        `The couple who arrives with ${cad(b.coupleCash)} of FHSA and Home Buyers' Plan principal against a ${cad(b.price)} price is at about 28% down before closing costs. That can take the loan out of default insurance, which removes the CMHC premium and also removes Home Start's 30-year rule. The lender's own uninsured amortization, often 30 years, is what is left. A buyer who uses only the ${cad(b.down)} minimum down stays insured, pays the premium, and can use 30 years if the first-time or new-build test is met. Run both structures before you treat the largest possible withdrawal as the obvious one.`,
        `Closing costs sit outside the stress test. Budget the transfer tax that survives the rebate and the legal bill. Years later, the <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> and the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> are the tools. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender comparison</a> and the <a href="/guides/negotiate-mortgage-rate/">negotiation guide</a> are the contract and the conversation.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Program names change less often than dollar caps. Confirm the cap on the page linked here before you waive a condition.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.fhsaRoom}">CRA, FHSA participation room</a> and <a href="${SOURCES.fhsaWithdraw}">withdrawals</a>.`,
        `<a href="${SOURCES.hbp}">CRA, Home Buyers' Plan</a> and the <a href="${SOURCES.hbpWithdraw}">89-day contribution rule</a>.`,
        `<a href="${SOURCES.gstRebate}">CRA, first-time GST/HST rebate</a> and <a href="${SOURCES.gstMemo}">memorandum 19-3-10</a>.`,
        `<a href="${SOURCES.homeBuyersAmount}">CRA, line 31270</a>. Up to $10,000 on the 2025 return.`,
        `<a href="${SOURCES.cmhcHomeStart}">CMHC Home Start</a> and the <a href="${SOURCES.cmhcPremiums}">premium schedule</a>.`,
        `<a href="${SOURCES.ontarioLtt}">Ontario</a>, <a href="${SOURCES.torontoMltt}">Toronto</a>, <a href="${SOURCES.bcPttAmounts}">British Columbia</a>, <a href="${SOURCES.quebecCredit}">Revenu Québec</a>, <a href="${SOURCES.albertaFees}">Alberta Land Titles</a>, and <a href="${SOURCES.peiTransfer}">Prince Edward Island</a>.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Can I use the FHSA and the Home Buyers' Plan on the same house?",
      answer:
        "Yes. The CRA allows an FHSA qualifying withdrawal and a Home Buyers' Plan withdrawal for the same home, if you meet each test at each withdrawal. Each spouse uses their own accounts. Only the Home Buyers' Plan amount is repaid.",
    },
    {
      question: "Does the GST rebate apply to a resale condo?",
      answer:
        "The GST/HST rebate is for a new or substantially renovated primary residence, with an agreement on or after March 20, 2025. A resale can still use the FHSA, the Home Buyers' Plan, the home buyers' amount, and a provincial transfer-tax program.",
    },
    {
      question: "I owned a home in 2018 and sold it. Am I a first-time buyer in 2026?",
      answer:
        "For the FHSA and the Home Buyers' Plan, a 2018 sale is outside the four-year look-back if you have not owned and lived in a home since. Ontario's refund is stricter: any prior home, anywhere, disqualifies you.",
    },
    {
      question: "Does a 30-year amortization mean I pay less?",
      answer:
        "The payment is lower and the interest is higher. On the $700,000 illustration, 30 years saves about $331 a month and costs about $2,598 more interest over five years, plus a 0.20 point premium. Insured 30-year terms are for first-time buyers and buyers of new builds under $1.5 million. A repeat buyer of a resale stays at 25 years.",
    },
    {
      question: "Are the rates people report online a first-time buyer rate?",
      answer:
        "The medians are self-reported by Canadian borrowers online. They are not a first-time discount. Use them beside a written quote, and keep insured and uninsured shelves apart. The renewal offer checker is for a later renewal.",
    },
  ],
};
