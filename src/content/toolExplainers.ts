import type { GuideSection } from "./calculatorGuides";
import {
  albertaLandTitlesFee,
  calculateBcFthbExemption,
  calculateBcPropertyTransferTax,
  manitobaLandTransferTax,
  newfoundlandRegistrationFee,
  ontarioFirstTimeRebates,
  ontarioProvincialLandTransferTax,
  peiTransferTax,
  quebecWelcomeTaxOutsideMontreal,
  saskatchewanMortgageRegistrationFee,
  saskatchewanTitleTransferFee,
} from "../lib/mortgageMath";

function cad(amount: number): string {
  return `$${Math.round(amount).toLocaleString("en-CA")}`;
}

export function sectionWordCount(sections: GuideSection[]): number {
  const text = sections
    .flatMap((section) => [section.heading, ...section.paragraphs])
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export function penaltyGuide(): GuideSection[] {
  return [
    {
      heading: "What this penalty estimate is, and what it is not",
      paragraphs: [
        "A closed Canadian mortgage charges a prepayment penalty when you pay the balance off before the term ends. The calculator on this page estimates that charge two ways and keeps the larger one. Three months’ interest is the contract rate divided by 12, times the outstanding balance, times 3. It is interest only. It is not three times your regular payment, because that payment also includes principal. The interest-rate differential is the gap between your contract rate and a comparison rate, times the years left in the term, times the balance. If the comparison rate is higher than your contract rate, that differential is zero and the three-month figure is the one that remains.",
        "Variable-rate and adjustable-rate contracts on this tool use only the three-month interest figure. Fixed-rate contracts use whichever of the two numbers is higher. That matches the usual closed-term rule described by the Financial Consumer Agency of Canada: the lender charges the greater of three months’ interest and the interest-rate differential. The comparison rate you type is the rate the lender would use for the remaining term. Big banks often start from a posted rate rather than from the discounted rate a new borrower would actually be offered. A posted comparison rate makes the differential larger. Ask the lender which rate is in the formula before you treat this estimate as a payout.",
        "The number is a planning figure. It does not include a discharge fee, an assignment fee, legal fees, or a cash-back clawback. Some contracts add those on top. A collateral charge, which is common when a mortgage is bundled with a line of credit, can also change the legal bill even when the penalty math is the same. The lender’s own statement is the amount you would have to pay. Use this page to see which method is likely to win, then ask the lender to show the comparison rate in writing.",
      ],
    },
    {
      heading: "How to use the estimate before you break the term",
      paragraphs: [
        "Porting keeps the same lender and moves the mortgage to a new property. If the new loan is the same size, many contracts charge no penalty. If you need more money, the extra amount is often a new segment at the current rate, and the original segment keeps its rate. Blend-and-extend stays with the same lender, mixes the old rate with a new one, and starts a new term. Both options can cost less than a full payout, and both can also lock you in for longer. Read the <a href=\"/guides/mortgage-prepayment-penalties/\">prepayment penalty guide</a> before you choose one.",
        "Prepayment privileges reduce the balance the penalty is calculated on. A typical closed term lets you prepay 10% to 20% of the original principal each year without a charge. If you are going to break the mortgage anyway, using the unused privilege first can shrink the fee. Do it in the order the contract allows. A lump sum after you have already asked for a payout quote may be too late.",
        "Compare the penalty with the interest you would save, not with the payment alone. A lower payment can still lose money if the penalty is large and you only have a short time left. The <a href=\"/tools/refinance-calculator/\">refinance calculator</a> puts the penalty next to the new payment. The <a href=\"/tools/mortgage-calculator/\">payment calculator</a> shows the interest on the new rate. At maturity the closed-term penalty is normally zero, which is why the <a href=\"/guides/2026-mortgage-renewal-playbook/\">renewal playbook</a> treats renewal week as the cheap time to leave.",
      ],
    },
  ];
}

export function affordabilityGuide(): GuideSection[] {
  return [
    {
      heading: "How this affordability calculator sizes a mortgage",
      paragraphs: [
        "The tool works backwards from income. It takes gross annual income, divides by 12, and allows housing costs up to 39% of that month and housing plus other debts up to 44%. Those two ceilings are the gross debt service and total debt service limits CMHC publishes for insured mortgages. OSFI does not publish 39% and 44% as a universal cap for every uninsured file, so a bank can be stricter. The tighter of the two ratios sets the maximum payment. Property tax, heating, and half of the condo fee you type are subtracted before any payment is left for the mortgage. Half of the condo fee matches the usual insurer worksheet. It is not 100%.",
        "The interest rate in the form is the qualifying rate the payment is calculated at. The default is 5.25%. The tool does not look up a contract rate and add 2 percentage points for you. If a lender has offered 4% and the stress test applies, type the greater of 6% and 5.25% into the field yourself. A same-lender renewal, or a straight switch that does not add money or years, may not use that qualifying rate at all. This page is for a new purchase or a refinance, where the test usually applies.",
        "The payment formula is the same monthly compounding the mortgage calculator uses: the annual qualifying rate divided by 12. A lender’s disclosure on a fixed rate usually compounds semi-annually, so the signed payment can differ by a few dollars. That gap is small next to the difference between the contract payment and the qualifying payment. The <a href=\"/guides/mortgage-stress-test/\">mortgage stress test guide</a> explains the qualifying-rate rule. The <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> runs one mortgage amount instead of solving for the maximum.",
      ],
    },
    {
      heading: "Down payment, insurance, and the price cap this tool does not apply",
      paragraphs: [
        "If the loan is more than 80% of the price the tool just solved for, it adds a default-insurance premium to the mortgage and recalculates the payment. The bands inside this affordability tool are simple: down payment under 10% uses 4.00% of the loan, 10% to under 15% uses 3.10%, and 15% to 20% uses 2.80%. At 20% down or more the premium is zero. Those three bands are a shortcut. They are not the full CMHC schedule, and they do not add the extra 0.20 point CMHC charges when the amortization is longer than 25 years.",
        "This affordability tool also does not enforce the insured price cap. A purchase price of $1,500,000 or more cannot be insured, and the minimum down payment becomes 20%. The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> applies that cap and the traditional premium table. Use it once you have a real price. Use this page only to see how far income and the qualifying rate stretch.",
        "First-time buyer programs change the cash you need, not the ratio math. The FHSA, the Home Buyers’ Plan, and provincial land-transfer refunds are described in the <a href=\"/guides/first-time-home-buyer-programs-canada/\">first-time home buyer programs guide</a>. A larger down payment can push the loan to 80% or below and remove the premium. It does not remove the stress test on a new insured or uninsured purchase from a federally regulated lender. Confirm the payment with the lender before you waive a financing condition.",
      ],
    },
  ];
}

export function rentVsBuyExtra(): GuideSection[] {
  return [
    {
      heading: "What the rent-versus-buy result is actually comparing",
      paragraphs: [
        "The calculator compares two piles of wealth at the end of the period you choose. On the buy side it tracks the mortgage balance, the equity in a home whose value you assume will change, and the cash you spent to get in: down payment, closing costs, and the monthly ownership costs that rent does not have. On the rent side it tracks the rent you pay and invests the cash you did not sink into a down payment, at the return you type. Neither pile is a prediction. Both are the arithmetic of the assumptions. Change the appreciation rate or the investment return and the winner can flip.",
        "Buying has costs the monthly rent figure hides. Land transfer tax or property transfer tax, legal fees, and an inspection are paid up front and are gone even if you sell the next year. Selling later usually means a real-estate commission. The tool’s closing-cost field is where those belong. A rough national range is 1.5% to 4% of the price on top of the down payment, higher in Toronto and in B.C. once transfer tax is included, lower in Alberta where there is no provincial land transfer tax. The <a href=\"/tools/closing-costs-calculator/\">closing costs calculator</a> is the detailed version.",
        "The mortgage payment inside a buy scenario is principal and interest. Principal is savings you are forced to make. Interest, property tax, insurance, maintenance, and condo fees are costs, closer to rent. In the early years most of a Canadian mortgage payment is interest, so the forced-savings piece is smaller than the payment looks. A longer amortization lowers the payment and slows the equity. The <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a> shows that split.",
      ],
    },
    {
      heading: "When the comparison is the wrong question",
      paragraphs: [
        "A five-year window in Vancouver or Toronto often favours renting if you assume modest price growth and a positive return on the down payment you kept. A longer window, or a city where the price is a smaller multiple of rent, more often favours buying. That is a statement about the inputs, not a rule. Job mobility matters. A penalty for breaking a closed mortgage can erase several years of payment savings if you have to move. Price that penalty on the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> before you treat a buy result as a plan.",
        "Qualification is a separate test from the wealth comparison. You may “win” on the buy side in this tool and still fail the stress test at the qualifying rate. Run the <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> with the contract rate you would actually sign. First-time programs such as the FHSA and the Home Buyers’ Plan change how you assemble the down payment. They are set out in the <a href=\"/guides/first-time-home-buyer-programs-canada/\">first-time home buyer guide</a>. They do not change the rent-versus-buy math once the down payment is in the form.",
        "Use the result as a break-even check. If buying only wins when prices rise quickly and your investments earn nothing, you are betting on the house. If renting only wins when you truly invest the difference every month, be honest about whether you will. The calculator will not do that for you.",
      ],
    },
  ];
}

export function refinanceGuide(): GuideSection[] {
  return [
    {
      heading: "A refinance is new credit, not a renewal",
      paragraphs: [
        "Renewing keeps the balance and the remaining amortization and picks a new rate for a new term. Refinancing replaces the loan. People refinance to take cash out, to roll other debt into the mortgage, or to stretch the amortization so the payment drops. Any of those is new borrowing. The old charge is discharged and a new one is registered. If you do it before the term ends, the current lender is also owed a prepayment penalty. At maturity that penalty is normally zero, which is why the same rate drop can look very different in month 6 of a term and in month 60.",
        "This calculator lines the current payment up against a new payment and subtracts the penalty and fees you type. The break-even month is the point where the payment savings have covered those one-time costs. A break-even of 18 months is only attractive if you expect to keep the new mortgage at least that long. Selling or breaking again before then can hand the savings back. The comparison rate and the penalty both have to be quotes, not guesses. Use the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> to see whether three months’ interest or the interest-rate differential is the likely charge.",
        "Adding money or years brings the stress test back, even at renewal. The qualifying rate is the greater of the contract rate plus 2 percentage points and the 5.25% floor. A straight switch that does not increase the loan or the amortization can be exempt between federally regulated lenders. A refinance is not that switch. The <a href=\"/guides/mortgage-renewal-vs-refinance-vs-heloc/\">renewal versus refinance versus HELOC guide</a> separates the three. A home-equity line of credit can be the better tool when you need a smaller, revolving amount and do not want to reset the whole mortgage.",
      ],
    },
    {
      heading: "Costs that sit outside the rate",
      paragraphs: [
        "Budget an appraisal if the new lender wants one, a legal or notary fee to register the new charge, a discharge fee from the old lender, and title insurance if it is required. Those amounts vary by province and by whether the current charge is a standard charge or a collateral charge. This page does not invent a single national fee. Type the quotes you have. Some new lenders will pay part of a straight switch. That offer is less common on a refinance that takes cash out, because the lender’s work and the risk are different.",
        "A lower rate on a larger balance can raise the payment. Taking $40,000 out to pay a car loan moves the debt from a short loan to a 20-year mortgage. The monthly bill may fall while the interest over the full amortization rises. Compare the total interest, not only the monthly delta. The <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a> runs the new balance at the new rate.",
        "Shop the refinance rate the same way you would shop a purchase. Posted bank rates are not the contract. The <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> shows how far below posted borrowers report landing, and the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> page is the published specials. Get the term, the prepayment privilege, and the penalty method in writing. A slightly higher rate with a fairer break fee can be cheaper if you might move.",
      ],
    },
  ];
}

export function cmhcExtra(): GuideSection[] {
  return [
    {
      heading: "Read the premium next to the price cap",
      paragraphs: [
        "Default insurance is required when the down payment is under 20% and the purchase price is below $1,500,000. At $1,500,000 or more the loan cannot be insured, the minimum down payment is 20%, and this calculator returns a premium of zero. That cap is the homeowner rule CMHC states for a high-ratio purchase. The premium, when it applies, is a percentage of the mortgage and is usually added to the balance, so you pay interest on it for the life of the loan.",
        "The table in the tool is CMHC’s traditional schedule for an amortization of 25 years or less. The bands run from 0.60% when the loan is 65% of the price or less, up to 4.00% when the loan is above 90% and at or under 95%. A $600,000 purchase with $60,000 down is a 90% loan-to-value and falls in the 85.01% to 90% band at 3.10%, which is $16,740 of premium before any provincial sales tax. The tool does not add the 0.20 point CMHC charges when the amortization is longer than 25 years, and it does not add Ontario, Quebec, or Saskatchewan sales tax on the premium. CMHC says that tax cannot be added to the loan.",
        "The minimum down payment on an insurable price is 5% of the first $500,000 and 10% of the rest. On a price at or above $1,500,000 the 5% and 10% schedule no longer applies. The <a href=\"/guides/cmhc-mortgage-insurance-canada/\">CMHC insurance guide</a> walks through the bands, the tax, and the difference between an insured loan and an insurable loan that still has 20% down. Sagen and Canada Guaranty insure high-ratio loans as well. Their premiums are similar and are not always identical. Confirm the insurer named in the commitment.",
      ],
    },
    {
      heading: "What the premium does not buy",
      paragraphs: [
        "The premium protects the lender if you default. It does not insure you, and it does not pay land transfer tax, legal fees, or an inspection. Those are closing costs. A first-time buyer can still use the FHSA, the Home Buyers’ Plan, and a provincial transfer-tax refund while paying a premium. Those programs are in the <a href=\"/guides/first-time-home-buyer-programs-canada/\">first-time buyer guide</a>. Putting more cash down can move you into a cheaper band or past 20%, where the premium disappears.",
        "An insured mortgage is also stress-tested. The qualifying rate is the greater of the contract rate plus 2 percentage points and 5.25%, and CMHC caps gross debt service at 39% and total debt service at 44% for the insured product. Passing the premium calculator does not mean you pass those ratios. Use the <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> with the mortgage after the premium has been added, because the premium increases the balance and the payment.",
        "If you are renewing an insured mortgage and not buying again, you do not pay a new premium just to renew or to make a straight switch. A refinance that increases the insured loan can trigger a premium on the increase. That is a different transaction from the purchase this page is built for.",
      ],
    },
  ];
}

export function renewalCalculatorGuide(): GuideSection[] {
  return [
    {
      heading: "What to compare on a renewal",
      paragraphs: [
        "At maturity the closed-term penalty is normally zero, so the decision is the rate, the term, and the features, not a break fee. Your current lender mails a renewal statement at least 21 days before the end of the term if it is federally regulated. That statement is one offer. It is not a survey of the market. Type it into this calculator as the current-lender rate, then type a competing quote as the new rate, with any appraisal, legal, and discharge costs you have actually been quoted.",
        "The savings figure is the difference in payments over the term you enter, minus the switching costs. A small rate gap on a large balance is still real money. A small rate gap on a small balance can be smaller than the legal bill of moving. Do not use a sample pair of rates from an old article. Use the two quotes in front of you. Published specials on the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> and <a href=\"/rates/variable/\">variable</a> pages are a starting list, not a promise that your file will get the lowest row.",
        "A straight switch keeps the balance and does not lengthen the amortization. Since 21 November 2024, OSFI does not require the minimum qualifying rate on an uninsured straight switch between federally regulated lenders when the loan amount and the amortization do not increase. Insured straight switches were already exempt. Adding even a modest amount of new money, or stretching the amortization, turns the file into a refinance and the qualifying rate comes back. The <a href=\"/guides/mortgage-renewal-vs-refinance-vs-heloc/\">renewal, refinance, and HELOC guide</a> draws that line.",
      ],
    },
    {
      heading: "How to push the renewal rate",
      paragraphs: [
        "Posted rates are a shelf price. Borrowers report paying less. The <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> lists the median gap below each bank’s own posted rate when at least 10 people have reported a rate from that bank. Take a written quote from a broker or another lender back to the bank that sent the renewal letter. Ask them to match the term, the prepayment privilege, and the penalty method, not only the rate.",
        "Start about four months out. A pre-approval or a rate hold at many lenders lasts 90 to 120 days, so a quote you collect early can still be alive on closing week. The <a href=\"/guides/2026-mortgage-renewal-playbook/\">2026 renewal playbook</a> is the calendar: what to collect, when to shop, and when doing nothing rolls you into a non-discounted rate. The <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> places one number against rates self-reported by Canadian borrowers online.",
        "Read the next contract before you celebrate a tenth of a point. A harsh interest-rate differential, a collateral charge, or a tight prepayment privilege can cost more than the rate saved if you sell mid-term. The <a href=\"/guides/mortgage-prepayment-penalties/\">prepayment penalty guide</a> is that trade-off. This calculator does not know your contract. It only does the arithmetic you type in.",
      ],
    },
  ];
}

export function closingProvinceGuide(): GuideSection[] {
  const price = 600_000;
  const ontario = ontarioProvincialLandTransferTax(price);
  const ontarioRebate = ontarioFirstTimeRebates(ontario, 0);
  const torontoRebate = ontarioFirstTimeRebates(ontario, ontario);
  const bc = calculateBcPropertyTransferTax(price);
  const bcExempt = calculateBcFthbExemption(price);
  const quebec = quebecWelcomeTaxOutsideMontreal(price);
  const manitoba = manitobaLandTransferTax(price);
  const pei = peiTransferTax(price);
  const albertaTransfer = albertaLandTitlesFee(price);
  const albertaMortgage = albertaLandTitlesFee(price * 0.8);
  const saskatchewanTransfer = saskatchewanTitleTransferFee(price);
  const saskatchewanMortgage = saskatchewanMortgageRegistrationFee(price * 0.8);
  const ns = price * 0.015;
  const nb = price * 0.01;
  const nl = newfoundlandRegistrationFee(price);

  return [
    {
      heading: "Closing costs by province, on a $600,000 home",
      paragraphs: [
        `Transfer tax is usually the largest closing cost, and it is provincial. The figures below use a ${cad(price)} price and the same formulas as the calculator. They leave out legal fees, title insurance, and an inspection, which you add in the form. A longer province-by-province write-up is in the <a href="/guides/closing-costs-canada-by-province/">closing costs by province guide</a>.`,
        `Ontario land transfer tax on ${cad(price)} is ${cad(ontario)}. The brackets are 0.5% on the first $55,000, 1% to $250,000, 1.5% to $400,000, 2% to $2 million, and 2.5% above that. A qualifying first-time buyer gets a refund of up to $4,000, so ${cad(ontarioRebate.total)} comes off and ${cad(ontario - ontarioRebate.total)} of provincial tax remains. The refund clears the tax only up to roughly $368,000 of price. Outside Toronto there is no municipal land transfer tax.`,
        `Inside the City of Toronto the municipal tax on this price matches the provincial tax, another ${cad(ontario)}. A qualifying first-time buyer can claim up to $4,475 of that municipal tax as well as the $4,000 provincial refund, ${cad(torontoRebate.total)} combined. Tax still due is ${cad(ontario * 2 - torontoRebate.total)}. Mississauga, Ottawa, Hamilton, and the rest of Ontario do not charge Toronto’s municipal tax and do not get the $4,475 rebate. You generally have to be 18, a citizen or permanent resident, and occupy the home as a principal residence. Ontario and Toronto both ask that you and your spouse have not owned a home before.`,
        `British Columbia property transfer tax on a ${cad(price)} fair market value is ${cad(bc)}: 1% on the first $200,000 and 2% on the rest up to $2 million. A qualifying first-time buyer at this price is under the $835,000 full-program ceiling, so the exemption is ${cad(bcExempt)} and the net tax is ${cad(bc - bcExempt)}. The exemption is the tax on the first $500,000, capped at $8,000, through $835,000, then it phases out and is zero at $860,000. Many Vancouver-area prices sit above $860,000, so first-time status does not erase the tax. Foreign-buyer additional tax is not in this calculator.`,
        `Alberta has no land transfer tax. Land Titles, for submissions on or after 1 October 2026, charges $50 plus $5 per $5,000 of value or part of that value, on the transfer and again on the mortgage. On a ${cad(price)} transfer that fee is ${cad(albertaTransfer)}. With 20% down the mortgage registration is ${cad(albertaMortgage)}. Saskatchewan’s ISC schedule, effective 15 April 2026, charges 0.4% of title value above $6,300, ${cad(saskatchewanTransfer)} here, and a stepped mortgage fee, ${cad(saskatchewanMortgage)} on the same 20% down payment. The closing-costs calculator adds both registrations.`,
        `Quebec’s 2026 baseline welcome tax is 0.5% to $62,900, 1% to $315,000, and 1.5% above that, which is ${cad(quebec)} on this price. Turn on the Montreal checkbox for the higher brackets. The city’s $700,000 example is $9,349. The land-transfer tool’s optional $5,000 first-time reduction is a planning cap, not Revenu Québec’s credit. That credit, for a qualifying first home acquired after 2025, is 100% of the first $5,000 of duties plus 25% of the next $3,500, a maximum of $5,875, and it phases out above $750,000. You pay the municipality, then claim the credit.`,
        `Manitoba’s provincial tax on ${cad(price)}, using the calculator’s brackets, is ${cad(manitoba)}. There is no Ontario-style first-time refund. Nova Scotia deed-transfer tax is municipal. This tool uses 1.5% as a planning average because Halifax and many other municipalities charge 1.5%, which is ${cad(ns)} here. Confirm the local rate. New Brunswick is modelled at 1% of value, ${cad(nb)}. Newfoundland and Labrador is a registration-style fee in the tool, ${cad(nl)} on this price, not a bracket tax.`,
        `Prince Edward Island’s calculator charges 1% once the price is above $30,000, so ${cad(pei)} on this home. A qualifying first-time buyer who will occupy the home gets a full waiver. The province’s page states no price cap. The old $200,000 ceiling is not the rule. The tax comes back if you do not occupy the home for 183 consecutive days. The waiver is larger than the legal bill, and the legal bill is still cash.`,
      ],
    },
  ];
}
