import type { InDepthGuide } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH3, RATE_SHEET, SOURCES } from "./shared";
import {
  DOWN_PAYMENT_TABLE,
  PREMIUM_TABLE,
  PREMIUM_TAX as tax,
  RATE_FILE_DATE,
  REPORTED_AS_OF,
  REPORTED_FIXED,
  REPORTED_FIXED_N,
  REPORTED_FROM,
  REPORTED_TO,
  TWENTY_DOWN as w,
  cad,
  cadCents,
  pct,
} from "./batch3Math";

export const cmhcMortgageInsurance: InDepthGuide = {
  slug: "cmhc-mortgage-insurance-canada",
  path: "/guides/cmhc-mortgage-insurance-canada/",
  metaTitle: "CMHC Mortgage Insurance in Canada (2026) | Latest Mortgage Rates",
  description:
    "How Canadian mortgage default insurance works in 2026: premium tiers, the 5% and 10% down-payment rules, the under-$1.5 million price cap, provincial tax, and insured versus insurable rates.",
  keywords:
    "CMHC mortgage insurance Canada, default insurance premium, minimum down payment, insured mortgage cap 1.5 million, insurable vs uninsured",
  cardTitle: "CMHC mortgage insurance",
  cardDescription:
    "Premium tiers, the down-payment formula, the price cap under $1.5 million, provincial tax, and why 20% down is not always the cheaper loan.",
  h1: "CMHC mortgage insurance in Canada",
  dek: "Default insurance is the toll for borrowing more than 80% of a home's value. The premium is set by loan-to-value, the price has to come in under $1.5 million, and three provinces tax the premium in cash. The cheaper contract rate on the insured shelf does not automatically beat a 20% down payment.",
  sourcesLine:
    "Sources: CMHC, the Insurable Housing Loan Regulations, the Department of Finance, Ontario, Revenu Québec, and Saskatchewan. The insurer's commitment is the premium you pay.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH3,
  howTo: {
    name: "How to price Canadian mortgage default insurance",
    description:
      "Check the price against the cap, work the minimum down payment, read the premium band, and then compare that larger insured balance with a 20% down quote.",
    steps: [
      {
        name: "Check the price against the cap",
        text: "A high-ratio insured mortgage needs a property value below $1,500,000. At $1,500,000 the loan is not eligible for default insurance.",
      },
      {
        name: "Work the minimum down payment",
        text: "Use 5% of the first $500,000 and 10% of the rest. The result is more than 5% once the price clears $500,000.",
      },
      {
        name: "Read the premium band and the tax",
        text: "CMHC's traditional schedule runs from 0.60% to 4.00%. Add 0.20 points if the amortization is longer than 25 years. Budget provincial tax in Ontario, Quebec, or Saskatchewan as cash.",
      },
      {
        name: "Compare 20% down on the same house",
        text: "Put the insured balance and its contract rate next to a 20% down balance. On a price of $1,000,000 or more, that 20% down loan is uninsured, not merely insurable.",
      },
    ],
  },
  sections: [
    {
      id: "what",
      heading: "What the premium actually buys",
      paragraphs: [
        `Mortgage default insurance pays the lender if you default. It does not pay your mortgage for you, and it is not the life or disability policy a bank offers at the signing table. <a href="${SOURCES.cmhcPremiums}">CMHC</a> describes the premium as a one-time charge that may be added to the insured loan. You then repay that larger balance, with interest, over the amortization. Sagen and Canada Guaranty insure the same kind of loan. The percentages in this guide are CMHC's. The commitment names the insurer and the premium.`,
        `A federally regulated lender cannot fund a conventional uninsured mortgage above 80% of value. <a href="${SOURCES.insurableRegs}">The Insurable Housing Loan Regulations</a> call a loan high-ratio when the principal, together with any equal or prior claim, is greater than 80% of the property value. That is the file that needs default insurance. Under 80%, insurance is a choice the lender may still make in a portfolio. You are not billed CMHC's borrower premium just because the lender bought that coverage.`,
        `The rate tables on this site split the shelves. Open <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> before you treat one number as "the" five-year fixed. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> uses the traditional 25-year homeowner bands and the cap below $1.5 million. It does not add the 0.20 point surcharge for a longer amortization, and it does not add provincial tax. The <a href="/tools/mortgage-calculator/">payment calculator</a> is where the premium, once you have the dollar figure, changes the payment.`,
      ],
    },
    {
      id: "down",
      heading: "Minimum down payment, and the cap under $1.5 million",
      paragraphs: [
        `<a href="${SOURCES.financeParameters}">The Department of Finance</a> set the rules that took effect for insurance applications on or after December 15, 2024. The property value has to be less than $1.5 million. The down payment is 5% on the portion of the price up to $500,000 and 10% on the portion above $500,000. <a href="${SOURCES.cmhcHomeStart}">CMHC Home Start</a> writes the same equity test as 5% of the first $500,000 of lending value and 10% of the remainder, and it requires the purchase price or lending value to be below $1,500,000. <a href="${SOURCES.insurableRegs}">The regulation</a> states the loan limit as 95% of value up to $500,000, and as $475,000 plus 90% of the value above $500,000. Those two sentences are the same down payment.`,
        `A price of $1,500,000 does not qualify. CMHC's consumer explainer sometimes says "$1.5 million or less" and sometimes "over $1.5 million." The regulation and Home Start are the tighter wording: the value must be below $1,500,000. This site's calculator treats $1,500,000 as outside default insurance and asks for 20% down. Just under the cap, at $1,499,999, the minimum is still 5% of the first $500,000 plus 10% of $999,999, which is ${cadCents(124_999.9)}, about 8.33% down. The old rule that a price of $1 million required 20% down is gone for high-ratio insurance.`,
        `Five percent is the minimum only while the price is $500,000 or less. On ${cad(tax.price)} that is ${cad(tax.down)}, a loan of ${cad(tax.loan)}, and loan-to-value of 95%. On ${cad(700_000)} the minimum is ${cad(45_000)}, which is 6.43%, not 5%. On ${cad(w.price)} it is ${cad(w.insuredDown)}, or 7.50%, and the loan before the premium is ${cad(w.insuredLoan)}. Loan-to-value is ${w.insuredLtv.toFixed(2)}%, still inside the top band. A buyer who only saved 5% of a $1 million price is short. The shortfall is $25,000 before closing costs.`,
      ],
      table: DOWN_PAYMENT_TABLE,
    },
    {
      id: "bands",
      heading: "Premium tiers, including the 30-year surcharge",
      paragraphs: [
        `<a href="${SOURCES.cmhcPremiums}">CMHC's homeowner schedule</a> for an owner-occupied property of one to four units, on a traditional down payment and an amortization of 25 years or less, is 0.60% up to 65% loan-to-value, 1.70% from 65.01% to 75%, 2.40% to 80%, 2.80% to 85%, 3.10% to 90%, and 4.00% from 90.01% to 95%. A non-traditional down payment, such as borrowed funds, is 4.50% in that top band. An amortization longer than 25 years adds 0.20 points. <a href="${SOURCES.cmhcHomeStart}">Home Start</a>, which is the high-ratio 30-year product, prints the result: 3.00%, 3.30%, 4.20%, and 4.70% for a non-traditional down payment. Exactly 90% loan-to-value is still the 3.10% band. The 4.00% band starts at 90.01%.`,
        `On the ${cad(tax.price)} purchase with ${cad(tax.down)} down, the loan sits at 95% and the traditional premium is 4.00%, or ${cad(tax.premium)}. Added to the mortgage, the balance is ${cad(tax.loan + tax.premium)}. On the ${cad(w.price)} purchase the minimum-down loan is in the same 4.00% band, so the premium is ${cad(w.premium)} and the insured balance is ${cad(w.insuredBalance)}. You pay interest on that ${cad(w.premium)} for as long as it stays in the principal. The <a href="/guides/30-year-amortization-canada/">30-year amortization guide</a> prices the 0.20 point surcharge on a larger house. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is the qualifying payment on the balance that includes the premium.`,
        `Bands at 80% loan-to-value and below are real CMHC prices, and they are not the premium a high-ratio buyer pays. Default insurance is required only once loan-to-value is above 80%. At 20% down the calculator on this site hides the premium. A lender can still insure a low-ratio loan in a portfolio. That premium is the lender's cost, not a line the borrower usually finances. Do not add 2.40% to a 20% down mortgage unless the commitment says the borrower is paying it.`,
      ],
      table: PREMIUM_TABLE,
    },
    {
      id: "tax",
      heading: "Provincial sales tax in Ontario, Quebec, and Saskatchewan",
      paragraphs: [
        `<a href="${SOURCES.cmhcPremiums}">CMHC</a> says Ontario, Quebec, and Saskatchewan currently apply provincial sales tax to the mortgage insurance premium, and that the tax cannot be added to the loan. It is cash, due when the premium is paid, on top of the down payment. The other provinces are not on that list. GST and HST are not charged on the premium. <a href="${SOURCES.quebecPremiumTax}">Revenu Québec</a> says GST and QST do not apply to insurance premiums. The separate tax on insurance premiums does.`,
        `<a href="${SOURCES.ontarioRst}">Ontario</a> charges retail sales tax at 8% on premiums under taxable insurance contracts. The HST replaced the old retail sales tax for most goods, and left the 8% tax on insurance. <a href="${SOURCES.quebecPremiumTax}">Quebec's tax</a> is 9% of the premium. <a href="${SOURCES.quebecPremiumTax2027}">Revenu Québec has already announced</a> that the rate rises to 9.975% for premiums paid after December 31, 2026, to match the QST rate. <a href="${SOURCES.saskatchewanPst}">Saskatchewan</a> describes its provincial sales tax as 6%, and the Provincial Sales Tax Act applies that 6% to insurance premiums. CMHC is the source for the tax landing on this premium. A life or disability policy sold with the mortgage is a different product and can be exempt. Do not net the two.`,
        `On the ${cad(tax.premium)} premium from the ${cad(tax.price)} example, Ontario's tax is ${cad(tax.ontario)}, Quebec's tax at 9% is ${cad(tax.quebec)}, and Saskatchewan's tax is ${cad(tax.saskatchewan)}. Quebec's 2027 rate on the same premium is ${cadCents(tax.quebecLater)}. On the ${cad(w.price)} premium of ${cad(w.premium)}, Ontario alone is ${cad(w.ontarioTax)} in cash. None of those amounts is in the <a href="/tools/cmhc-insurance-calculator/">calculator</a> total. The <a href="/tools/closing-costs-calculator/">closing costs calculator</a> is the rest of the cheque: land transfer tax, the lawyer, and the adjustments. The premium tax sits with them, not inside the mortgage.`,
      ],
    },
    {
      id: "twenty",
      heading: "When 20% down beats the insured rate",
      paragraphs: [
        `The insured contract is often cheaper than the uninsured contract at the same lender, because the lender's default risk is covered. That discount is fighting a larger loan. On ${cad(w.price)}, minimum down is ${cad(w.insuredDown)} and the insured balance is ${cad(w.insuredBalance)} after the ${cad(w.premium)} premium. Twenty percent down is ${cad(w.conventionalDown)}, a loan of ${cad(w.conventionalBalance)}, and no premium. The extra cash to reach 20% is ${cad(w.extraCash)}, and in Ontario you also skip the ${cad(w.ontarioTax)} tax on the premium.`,
        `The rate file dated ${RATE_FILE_DATE} has RBC's 5-year fixed high-ratio special at ${pct(w.rbcInsured)} and its uninsured 5-year fixed special at ${pct(w.rbcUninsured)}. CIBC's specials that day are ${pct(RATE_SHEET.cibcInsuredSpecial)} insured and ${pct(RATE_SHEET.cibcSpecial)} uninsured. Both banks show a lower high-ratio special. Using RBC's pair over 25 years, the insured payment is ${cad(w.shelfInsured.payment)} and the 20% down payment is ${cad(w.shelfConventional.payment)}. The insured loan costs ${cad(w.shelfPaymentGap)} more a month even though its rate is 0.30 points lower. Over five years the extra interest is about ${cad(w.shelfFiveGap)}. Over the full 25 years it is about ${cad(w.shelfInterestGap)}. The lower rate did not pay for the extra principal.`,
        `A second comparison uses a different dataset. In the reported-rate file dated ${REPORTED_AS_OF}, covering ${REPORTED_FROM} to ${REPORTED_TO}, the rounded 5-year fixed median where insured status was not stated is ${REPORTED_FIXED} (N = ${REPORTED_FIXED_N}). The rounded uninsured 5-year fixed median is also ${pct(w.reportedUninsured)} (N = ${w.reportedUninsuredN}). Those medians are self-reported by Canadian borrowers online. They are not offers. The insured slice of that file has N = ${w.insuredSampleN}, under the cutoff of ${w.publicMinN} this site uses before it publishes a cell, so it is not used as a rate here. At the uninsured median, the 20% down payment on ${cad(w.conventionalBalance)} is ${cad(w.reportedConventional.payment)}, and the insured structure costs ${cad(w.reportedPaymentGap)} more a month. Five-year extra interest is about ${cad(w.reportedFiveGap)}. Someone who does not have the ${cad(w.extraCash)} cannot choose this file. Run both quotes. The <a href="/compare/insured-vs-uninsured/">insured versus uninsured comparison</a> is the live shelves. <a href="/real-mortgage-rates/">Real mortgage rates</a> is the reported distribution.`,
      ],
    },
    {
      id: "three-kinds",
      heading: "Insured, insurable, and uninsured",
      paragraphs: [
        `The three words describe eligibility, not a mood. An insured mortgage, in ordinary speech, is the high-ratio loan the borrower pays to insure. Under the regulation it needs a value below $1.5 million, loan-to-value above 80%, a purpose that includes the purchase (or the payout of a prior uninsured low-ratio loan), and an amortization of 25 years unless a borrower is a first-time home buyer or the home is newly built, in which case 30 years is allowed. At least one borrower or guarantor needs a credit score of 600, with a small portfolio exception. Gross debt service cannot pass 39%, or total debt service 44%, calculated at the greater of the contract rate plus 2 points and 5.25%. At least one unit is occupied by the borrower or by a spouse, common-law partner, or a parent or child.`,
        `Insurable is the market name for a low-ratio loan that still fits portfolio insurance. <a href="${SOURCES.insurableRegs}">Section 6 of the regulation</a> keeps that value test at less than $1,000,000. The December 2024 increase to $1.5 million was for high-ratio loans. It did not move the low-ratio cap. A purchase amortization cannot exceed 25 years. The balance cannot be increased above the original schedule, which is why a cash-out refinance fails. A one-unit property has to be occupied by the borrower or a close relative. The lender may buy portfolio insurance and keep the premium. The borrower shops a rate that assumes that option exists. This site does not publish a separate insurable median. Where a lender's page splits "insurable" from "uninsured," read the column headings before you compare two specials.`,
        `Uninsured is what is left. A price of $1,500,000 or more cannot be high-ratio insured, so 20% down is the floor and the rate is uninsured. A price of exactly $1,000,000 with 20% down is also outside the low-ratio value test, because the test is less than $1,000,000, so that loan is uninsured even though the high-ratio version of the same house, at ${cad(w.insuredDown)} down, is insured. A 30-year amortization with 20% down fails the 25-year low-ratio limit and is uninsured, which is why lenders still offer it and why it is priced off the uninsured shelf. A refinance that takes cash out fails both insurance paths, aside from the narrow insured loan for adding a housing unit. The <a href="/guides/mortgage-renewal-vs-refinance-vs-heloc/">renewal, refinance, and HELOC guide</a> is that choice. The <a href="/rates/5-year-fixed/">5-year fixed</a> and <a href="/rates/variable/">variable</a> pages mix lenders. Sort by insured status before you rank them. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> is for a later term, once you know which status you are in.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The cap and the down-payment formula are in the regulation and the Department of Finance parameters. Premium percentages are CMHC's schedule. Tax rates are the provincial pages named here. A commitment can still differ.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.insurableRegs}">Insurable Housing Loan Regulations</a>, high-ratio and low-ratio criteria, as amended by SOR/2025-55.`,
        `<a href="${SOURCES.financeParameters}">Department of Finance, parameters for the December 15, 2024 reforms</a>.`,
        `<a href="${SOURCES.cmhcPremiums}">CMHC premium schedule</a>, <a href="${SOURCES.cmhcHomeStart}">Home Start</a>, and <a href="${SOURCES.cmhcPurchase}">Purchase</a>.`,
        `<a href="${SOURCES.ontarioRst}">Ontario retail sales tax</a>, <a href="${SOURCES.quebecPremiumTax}">Revenu Québec</a>, and <a href="${SOURCES.saskatchewanPst}">Saskatchewan provincial sales tax</a>.`,
        `Rate file dated ${RATE_FILE_DATE}, RBC and CIBC 5-year fixed specials. Reported medians dated ${REPORTED_AS_OF}.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is the minimum down payment still 5% on a $1.2 million home?",
      answer:
        "No. Five percent applies only to the first $500,000. On $1.2 million the minimum is $25,000 plus 10% of $700,000, which is $95,000, about 7.92% down. The house is insurable on a high-ratio basis because the price is under $1.5 million. It is not insurable on a low-ratio basis, because that cap is still under $1 million.",
    },
    {
      question: "Does $1,500,000 still qualify if I put exactly 10% down?",
      answer:
        "No. The regulation requires the value to be less than $1,500,000. At $1,500,000 default insurance is not available, and a federally regulated lender will look for at least 20% down. One dollar under the cap is still on the 5% and 10% formula.",
    },
    {
      question: "Can I add the provincial tax to the mortgage?",
      answer:
        "CMHC says the sales tax in Ontario, Quebec, and Saskatchewan cannot be added to the loan. The premium itself usually can. On a $19,000 premium the tax is $1,520 in Ontario, $1,710 in Quebec at the 2026 rate of 9%, and $1,140 in Saskatchewan. Quebec's rate rises to 9.975% for premiums paid after December 31, 2026.",
    },
    {
      question: "Why is my 20% down rate higher than my friend's insured rate?",
      answer:
        "The friend's loan may be high-ratio insured, or it may be a low-ratio loan that still qualifies for portfolio insurance. A 20% down purchase at $1 million or more, a 30-year amortization, or a refinance generally does not. On the October 23, 2026 rate file, RBC's high-ratio 5-year fixed special was 4.84% and its uninsured special was 5.14%. The discount does not repay the insurance premium by itself.",
    },
    {
      question: "Are the medians on this page an insured rate?",
      answer:
        "The 4.35% figures are self-reported by Canadian borrowers online. One cell did not state insured status. The other is the uninsured cell. The insured 5-year fixed slice has only 7 reports, below the cutoff of 10, so it is not published as a median. Use them beside a written quote, and keep the lender's insured and uninsured specials apart.",
    },
  ],
};
