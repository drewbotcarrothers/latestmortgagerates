import type { InDepthGuide } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH3, SOURCES } from "./shared";
import {
  RATE_FILE_DATE,
  REPORTED_AS_OF,
  REPORTED_FIXED,
  REPORTED_FIXED_N,
  REPORTED_VARIABLE,
  REPORTED_VARIABLE_N,
  STRETCH as s,
  cad,
  pct,
} from "./batch3Math";

export const thirtyYearAmortization: InDepthGuide = {
  slug: "30-year-amortization-canada",
  path: "/guides/30-year-amortization-canada/",
  metaTitle: "30-Year Mortgage Amortization in Canada (2026) | Latest Mortgage Rates",
  description:
    "Who can take a 30-year insured mortgage in Canada, how it changes the payment and the stress test, what the extra interest costs, and how prepayments pull the loan back toward 25 years.",
  keywords:
    "30 year amortization Canada, insured 30 year mortgage, first-time buyer amortization, stress test 30 year, CMHC Home Start",
  cardTitle: "30-year amortizations",
  cardDescription:
    "Who qualifies for an insured 30-year amortization, the payment and the stress test, and what the extra interest costs on a worked example.",
  h1: "30-year mortgage amortizations in Canada",
  dek: "An insured 30-year amortization is a high-ratio product for a first-time buyer or a buyer of a new build, on a home priced under $1.5 million. The payment falls. The premium rises by 0.20 points. The interest bill is the part the lower payment does not show.",
  sourcesLine:
    "Sources: the Insurable Housing Loan Regulations, the Department of Finance, and CMHC Home Start. The insurer decides whether your file is one of the two eligible kinds.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH3,
  howTo: {
    name: "How to test a 30-year insured amortization",
    description:
      "Confirm the file is high-ratio and that a borrower is a first-time buyer or the home is newly built, then price the payment, the stress test, and a prepayment that shortens it.",
    steps: [
      {
        name: "Confirm the loan is high-ratio",
        text: "Insured 30-year amortizations sit on loans above 80% loan-to-value. A 20% down payment is outside the product.",
      },
      {
        name: "Match the borrower or the building",
        text: "At least one borrower has to be a first-time home buyer, or the home has to be newly built and not previously lived in. A repeat buyer of a resale stays at 25 years if the mortgage is insured.",
      },
      {
        name: "Price both the contract payment and the qualifying payment",
        text: "The stress test uses the contractual amortization. A 30-year schedule lowers the payment you qualify on, and it lowers the payment you make.",
      },
      {
        name: "Decide whether you will actually take 30 years to pay it",
        text: "An extra monthly amount equal to the gap between the 25-year and 30-year payments puts the loan back on a 25-year pace, if the contract allows the prepayment.",
      },
    ],
  },
  sections: [
    {
      id: "who",
      heading: "Who can insure 30 years",
      paragraphs: [
        `<a href="${SOURCES.financeParameters}">The Department of Finance</a> widened insured 30-year amortizations on December 15, 2024. The loan has to be high-ratio, meaning loan-to-value above 80%, and the property value has to be less than $1.5 million. At least one borrower has to be a first-time home buyer, or the home has to be newly built. <a href="${SOURCES.insurableRegs}">The regulation</a> puts that permission in the high-ratio section only. From August 1, 2024 until December 15, 2024, the 30-year option was narrower: a first-time buyer of a new build. The wider rule replaced it. Both dates are in the amending regulation.`,
        `A first-time home buyer, for this regulation, meets any one of three tests at the purchase. They have never before bought an eligible home in Canada. Or they have not, in that calendar year or the four calendar years before it, occupied as a principal residence a home in Canada that they or their current spouse or common-law partner owned. Or they have lived separate and apart from a spouse or common-law partner because the relationship broke down, for at least 90 days, and the separation started in that year or the four years before it. Passing one test is enough. It is not the same test as Ontario's land transfer refund, which asks whether you have ever owned a home anywhere. The <a href="/guides/first-time-home-buyer-programs-canada/">first-time buyer programs guide</a> keeps those tests apart.`,
        `Newly built means the home has never been occupied as a residence. A condominium can still qualify if the only occupancy was an interim period before the declaration was registered or before possession. A repeat buyer of a resale house does not get an insured 30-year amortization. <a href="${SOURCES.cmhcPurchase}">CMHC's purchase page</a> still caps the ordinary product at 25 years and points 30-year files to Home Start. The home is owner-occupied, by the borrower or by a spouse, common-law partner, or parent or child, on a rent-free basis. GDS stays at 39% and TDS at 44%.`,
      ],
    },
    {
      id: "not",
      heading: "Who stays at 25 years, including many 20% down files",
      paragraphs: [
        `Twenty percent down takes the loan out of the high-ratio section. The low-ratio rules, which are what let a lender portfolio-insure a conventional mortgage, still cap a purchase amortization at 25 years. <a href="${SOURCES.insurableRegs}">Section 6</a> was not given the 30-year permission that section 5 received. A lender can offer 30 years anyway, on an uninsured conventional mortgage. That offer is the lender's own product. It is not CMHC Home Start, the borrower does not pay the Home Start premium, and the rate is the uninsured or, if the file still fits, a different shelf. The <a href="/guides/cmhc-mortgage-insurance-canada/">CMHC insurance guide</a> is the line between insured, insurable, and uninsured.`,
        `The value cap is the same one as the rest of high-ratio insurance: below $1,500,000. A first-time buyer of a $1.6 million resale cannot insure the mortgage at all, at 25 years or at 30. The down payment becomes 20%, and the amortization is whatever that uninsured lender will sign. Stretching an uninsured loan to 30 years to make the payment fit is a different decision from the one in the worked example below. The qualifying rate still applies to a new uninsured mortgage at a federally regulated lender. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is that rule. The <a href="/tools/stress-test-qualifier/">stress test qualifier</a> runs the ratios.`,
      ],
    },
    {
      id: "payment",
      heading: "The payment, the premium, and the interest",
      paragraphs: [
        `Take a ${cad(s.price)} purchase by a buyer who qualifies for Home Start. The minimum down payment is 5% of the first $500,000 and 10% of the remaining ${cad(s.price - 500_000)}, which is ${cad(s.down)}, or ${s.downPct.toFixed(2)}%. The loan before insurance is ${cad(s.base)}. Loan-to-value is ${s.ltv.toFixed(2)}%, inside the band from 90.01% to 95%. CMHC's traditional premium is ${s.premium25Rate.toFixed(2)}%, or ${cad(s.premium25)}. The 30-year schedule adds 0.20 points, so the premium is ${s.premium30Rate.toFixed(2)}%, or ${cad(s.premium30)}. The extra premium is ${cad(s.extraPremium)}. Balances are ${cad(s.balance25)} at 25 years and ${cad(s.balance30)} at 30 years. Ontario tax on the 30-year premium, at 8%, is ${cad(s.ontarioTax)} in cash. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> does not add the 0.20 points or the tax.`,
        `The contract rate in the arithmetic is RBC's high-ratio 5-year fixed special of ${pct(s.contract)} from the rate file dated ${RATE_FILE_DATE}. It is one lender's scraped special, not a quote you will be offered and not a forecast. At that rate the 25-year payment is ${cad(s.pay25)} and the 30-year payment is ${cad(s.pay30)}. The longer amortization saves ${cad(s.paymentSave)} a month. Over the full schedules the 30-year loan costs about ${cad(s.extraInterest)} more interest. A large share of that gap is years 26 through 30, which the 25-year loan never has. The cleaner look at the first term is five years: about ${cad(s.fiveInterestGap)} more interest, and a balance about ${cad(s.fiveBalanceGap)} higher. The <a href="/tools/mortgage-calculator/">payment calculator</a> uses a monthly rate, annual rate divided by 12. A lender that compounds semi-annually can differ by a few dollars.`,
        `For a sense of where contract rates sit apart from this special, the reported-rate file dated ${REPORTED_AS_OF} has a rounded 5-year fixed median of ${REPORTED_FIXED} (N = ${REPORTED_FIXED_N}) and a rounded 5-year variable median of ${REPORTED_VARIABLE} (N = ${REPORTED_VARIABLE_N}), insured status not stated. Those medians are self-reported by Canadian borrowers online. They are not the insured shelf. Compare a live insured special on the <a href="/rates/insured/">insured</a> page with the <a href="/rates/uninsured/">uninsured</a> page before you assume the 30-year payment you like is available on the file you actually have. The <a href="/rates/5-year-fixed/">5-year fixed</a> and <a href="/rates/variable/">variable</a> hubs are the same snapshot, sorted by product.`,
      ],
    },
    {
      id: "stress",
      heading: "The stress test uses the longer schedule too",
      paragraphs: [
        `<a href="${SOURCES.insurableRegs}">The regulation</a> calculates GDS and TDS from the payments that would keep the loan on its amortization schedule if the interest rate were the greater of the contract rate plus 2 percentage points and 5.25%. The schedule in that sentence is the one in the commitment. A 30-year commitment is tested on a 30-year payment. The lower payment is why the product helps a buyer qualify, and it is also why the help is not free.`,
        `On this example the contract is ${pct(s.contract)}, so the qualifying rate is ${pct(s.qualifying)}. The 5.25% floor does not bind, because the contract plus 2 points is higher. The qualifying payment is ${cad(s.qualify25)} on the 25-year balance and ${cad(s.qualify30)} on the 30-year balance, a difference of ${cad(s.qualifySave)} a month. Suppose property tax is ${cad(s.taxBill)} a month and heat is ${cad(s.heatBill)}, labelled assumptions for the ratio and not a city's bill. At a 39% GDS cap, and with no condo fee and no other debt in the ratio, the income that fills the cap is about ${cad(s.income25)} on 25 years and about ${cad(s.income30)} on 30 years. The longer amortization reduces the income that hits the line by about ${cad(s.incomeSave)}. Other debt pulls the binding test over to TDS at 44%, and a condo fee counts at half. This is the shape of the test, not an approval.`,
        `The payment you make is still the contract payment, ${cad(s.pay30)}, not the qualifying payment. Qualifying at a lower monthly figure and then keeping the loan for 30 years is how buyers end up payment-poor in the sixth year. If the only way the file passes is the 30-year qualifying payment, read the prepayment section before you waive a condition. The <a href="/guides/fixed-vs-variable-mortgage-2026/">fixed versus variable guide</a> is the term. The qualifying rate is the same idea on either one: contract plus 2, or the floor.`,
      ],
    },
    {
      id: "shorten",
      heading: "Prepayments that put it back on a 25-year pace",
      paragraphs: [
        `The 30-year payment on the larger balance is ${cad(s.pay30)}. The payment that would amortize that same balance over 25 years is ${cad(s.sameBalancePay25)}. The gap is ${cad(s.extraMonthly)} a month. Paying that extra, every month, is a 25-year loan wearing a 30-year contract. The interest you avoid over the life of the loan is about ${cad(s.sameBalanceInterestSaved)}, which is the cost of keeping the lower payment. The privilege has to allow it. Some contracts cap the annual prepayment at a percentage of the original principal, and a monthly increase can be a separate privilege from a lump sum. The <a href="/guides/mortgage-prepayment-penalties/">prepayment penalty guide</a> is what happens if you are breaking the term rather than using the privilege. The <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> is the simple version of that fee.`,
        `A second lever is to pay the premium in cash instead of adding it to the loan. On this file the 30-year premium is ${cad(s.cashPremium)}. Financing it produces a payment of ${cad(s.pay30)}. Leaving it out of the balance produces a payment of ${cad(s.cashPremiumPayment)}, about ${cad(s.cashPaymentSave)} less a month, and about ${cad(s.cashInterestSaved)} less interest over 30 years. The cash has to be real: the premium, plus provincial tax where it applies, plus the down payment. Borrowing the premium from a line of credit can also push the down payment into CMHC's non-traditional band, which is 4.70% rather than 4.20% at this loan-to-value once the amortization is past 25 years. A gift that does not have to be repaid stays in the traditional band. Ask the insurer which bucket the funds are in before you treat the cash saving as clean.`,
        `Renewal is the third lever, and it is years away. A lower payment today does not freeze the balance you will renew. After five years this 30-year example still owes about ${cad(s.fiveBalanceGap)} more than the 25-year example. That is the principal the next term is priced on. The <a href="/guides/2026-mortgage-renewal-playbook/">renewal playbook</a> and the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> are the tools for that day. <a href="/real-mortgage-rates/">Real mortgage rates</a> is the reported distribution you would set an offer against. None of those pages knows whether your insurer allowed 30 years in the first place.`,
      ],
    },
    {
      id: "next-term",
      heading: "The payment can still look kind at renewal",
      paragraphs: [
        `After five years at ${pct(s.contract)}, the 25-year example owes about ${cad(s.balanceAfterFive25)} and has 20 years left. The 30-year example owes about ${cad(s.balanceAfterFive30)} and has 25 years left. The gap is the ${cad(s.fiveBalanceGap)} already counted. Suppose the renewal rate is one point higher than today's special, ${pct(s.renewalExampleRate)}. That rate is an example, not a forecast and not a second row from the rate file.`,
        `Keep each loan on the amortization it has left, and the 30-year file renews at ${cad(s.renewalPay30)} against ${cad(s.renewalPay25)} for the 25-year file. The longer loan's payment is still lower, by ${cad(s.renewalPay25 - s.renewalPay30)}, because it still has five more years to run. The lower payment is the same trade as day one. Force both renewals onto a 20-year remaining schedule and the order flips: the larger balance costs ${cad(s.renewalPay30Matched)} a month, ${cad(s.renewalPay30Matched - s.renewalPay25)} more than the loan that started at 25 years. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switching guide</a> is how you move that balance without turning the renewal into a refinance. The <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted guide</a> is why the special you are offered at renewal is not the posted shelf.`,
        `Nothing in the five-year hold promises that the insurer will let you stretch again. An insured loan that was allowed 30 years at purchase does not earn a fresh 30 years at renewal just because the payment would be easier. A straight switch keeps the remaining amortization. Extending it is new credit. Price the renewal you would actually sign, on the balance this schedule leaves, before you treat ${cad(s.paymentSave)} a month as found money.`,
      ],
    },
    {
      id: "banked",
      heading: "The monthly saving is not found money",
      paragraphs: [
        `The monthly saving of ${cad(s.paymentSave)} is cash you do not send in the first term. Over five years that is about ${cad(s.paymentSave * 60)} left out of the contractual payment. Part of it is the extra interest of ${cad(s.fiveInterestGap)}. The rest is principal you have not paid, which is why the balance is ${cad(s.fiveBalanceGap)} higher. Those are different costs. The interest is spent. The unpaid principal is still owed, and it is the balance the renewal is priced on.`,
        `Banking the difference, in an account the mortgage does not see, lets you hand it back as a prepayment and shrink that larger balance. Spending it buys five years of a lower payment and a bigger renewal. The contract requires neither. Whether the banking plan is even allowed depends on the prepayment privilege, which is where a bank, a monoline, and a credit union often disagree. The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">lender comparison</a> is that difference.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Eligibility is the regulation and the Department of Finance parameters. The premium surcharge is CMHC's schedule. The payments are this site's monthly formula at the scraped special named above.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.insurableRegs}">Insurable Housing Loan Regulations</a>, subsection 5(1.1) and the first-time and newly-built definitions.`,
        `<a href="${SOURCES.financeParameters}">Department of Finance, December 15, 2024 parameters</a>, including the August 1, 2024 starting point.`,
        `<a href="${SOURCES.cmhcHomeStart}">CMHC Home Start</a> and the <a href="${SOURCES.cmhcPremiums}">premium schedule</a>.`,
        `RBC high-ratio 5-year fixed special of ${pct(s.contract)} in the rate file dated ${RATE_FILE_DATE}.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Can a repeat buyer get 30 years on an insured mortgage?",
      answer:
        "Only if the home is newly built and has not been lived in, apart from a condominium interim-occupancy period. A repeat buyer of a resale stays at 25 years when the mortgage is insured. The first-time test is an alternative to the new-build test, not an extra requirement on top of it.",
    },
    {
      question: "I have 20% down. Can I still amortize over 30 years?",
      answer:
        "A lender can offer 30 years on an uninsured conventional mortgage. That loan is not the insured Home Start product, and the low-ratio insurance rules still cap a purchase amortization at 25 years. The rate is priced as uninsured unless the rest of the file fits portfolio insurance, which the 30-year term itself prevents.",
    },
    {
      question: "Does the stress test ignore the extra five years?",
      answer:
        `No. Gross and total debt service are calculated on the amortization in the commitment, at the greater of the contract rate plus 2 points and 5.25%. On the $1.1 million example the qualifying rate is ${pct(s.qualifying)}, and the 30-year qualifying payment is ${cad(s.qualifySave)} lower than the 25-year one. The payment you actually make is the contract payment.`,
    },
    {
      question: "Is the interest saving from a prepayment guaranteed?",
      answer:
        "The arithmetic is guaranteed only if you actually pay the extra amount and the contract accepts it. On this example, about $510 a month above the 30-year payment puts that balance on a 25-year pace. A privilege cap, a missed year, or a higher rate at renewal changes the result. The penalty for breaking the term is a separate charge.",
    },
    {
      question: "Do the reported medians include a 30-year discount?",
      answer:
        "No. The 4.35% fixed and 3.55% variable medians are self-reported by Canadian borrowers online, and insured status was not stated. The worked payment uses RBC's high-ratio special of 4.84% from the rate file. A 30-year insured loan is priced on the insured shelf, plus the premium surcharge.",
    },
  ],
};
