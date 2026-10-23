import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH4, HELOC as h, RATE_FILE_AS_OF, SPREAD } from "./batch4Math";

const nbcRates = "https://www.nbc.ca/rates/loan-line-of-credit-rates.html";
const nbcPrime = "https://www.nbc.ca/rates.html";
const nbcHeloc = "https://www.nbc.ca/personal/mortgages/all-in-one.html";
const cibcHeloc = "https://www.cibc.com/en/personal-banking/loans-and-lines-of-credit/lines-of-credit/home-equity-line-of-credit.html";
const rbcHomeline = "https://www.rbcroyalbank.com/mortgages/rbc-homeline-plan.html";
const tdFlex = "https://www.td.com/ca/en/personal-banking/products/mortgages/td-home-equity-flexline";
const tdEquity = "https://www.td.com/ca/en/personal-banking/products/mortgages/taking-equity-on-home";
const tdPrime = "https://www.td.com/ca/en/personal-banking/products/todays-rates-and-prime";
const tangerineHeloc = "https://www.tangerine.ca/en/personal/borrow/home-equity-line-of-credit";
const osfiB20 = "https://www.osfi-bsif.gc.ca/en/guidance/guidance-library/residential-mortgage-underwriting-practices-procedures-guideline-2017";

export const helocRates: InDepthGuide = {
  slug: "heloc-rates-canada",
  path: "/guides/heloc-rates-canada/",
  metaTitle: "HELOC Rates in Canada | Latest Mortgage Rates",
  description:
    "How Canadian HELOC rates are priced off prime, which lenders publish a margin, the 65% revolving limit and 80% combined limit, and how a HELOC compares with a refinance or a second mortgage.",
  keywords:
    "HELOC rates Canada, prime plus HELOC, OSFI 65 percent HELOC, readvanceable mortgage, HELOC vs refinance vs second mortgage",
  cardTitle: "HELOC rates in Canada",
  cardDescription:
    "Prime plus a margin, a revolving cap at 65% of value, and a combined cap at 80%. The margin is in the commitment unless the lender actually posts it.",
  h1: "HELOC rates in Canada",
  dek: "A home equity line of credit is priced off the lender's prime, plus or minus a margin the commitment names. You pay interest on what you draw, and the revolving piece stops at 65% of the home's value.",
  sourcesLine:
    "Sources: OSFI Guideline B-20 and its 2022 clarification, FCAC's HELOC page, and the rate pages of National Bank, CIBC, RBC, TD, and Tangerine. A margin that is not on the lender's page is not guessed here.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH4,
  howTo: {
    name: "How to read a Canadian HELOC offer",
    description:
      "Separate prime from the margin, check the revolving limit against 65% of value, and compare an interest-only payment with a refinance before you sign.",
    steps: [
      {
        name: "Name the prime and the margin",
        text: "The rate is the lender's prime plus or minus a spread. TD Prime and TD's mortgage prime are not the same number. Write down which one the line uses.",
      },
      {
        name: "Split 65% from 80%",
        text: "The revolving limit stops at 65% of value. The mortgage and the line together stop at 80%. Anything above 65% has to amortize, and it is not readvanced.",
      },
      {
        name: "Ask for the qualifying payment",
        text: "Banks stress-test the line. The minimum you will pay can be interest only, which is lower than the payment used to qualify you.",
      },
      {
        name: "Compare it with a refinance and a second mortgage",
        text: "A refinance replaces the mortgage and gives you an amortizing payment. A second mortgage is another loan behind the first. A HELOC is a limit you can redraw.",
      },
    ],
  },
  sections: [
    {
      id: "price",
      heading: "The rate is prime, plus a margin the contract sets",
      paragraphs: [
        `A HELOC is a revolving loan secured by your home, and the rate is usually the lender's prime plus a margin that the commitment names. You pay interest only on the amount you have drawn, not on the unused limit, and at a federally regulated lender the revolving portion stops at 65% of value even when the house can secure 80% once an amortizing mortgage is included.`,
        `<a href="${SOURCES.fcacHeloc}">FCAC</a> matches that shape. Most HELOCs have a variable rate, typically the lender's prime. FCAC's teaching example is prime plus 1%: if prime were 5.85%, the line would be 6.85%. That 5.85% is not today's prime. A federally regulated institution has to give written notice within 30 days of a rate change. Prime on this site is ${pct(h.prime)}, the Bank of Canada target of ${pct(h.policy)} plus ${pct(h.spread)}. <a href="${SOURCES.boc}">The target was held at ${pct(h.policy)} on September 2, 2026.</a> A drawn HELOC reprices when that prime reprices. It does not wait for a renewal date.`,
        `Big-bank prime is not a single contract term at every bank. <a href="${tdPrime}">TD's prime-rate page</a> showed TD Prime at 4.45%, effective October 30, 2025. The mortgage rate file scraped ${RATE_FILE_AS_OF} shows TD's uninsured 5-year variable special at ${pct(SPREAD.tdUninsured.variable)} next to a posted variable of ${pct(SPREAD.tdUninsured.variablePosted ?? 0)}. That 4.60% posted variable is the separate mortgage prime this site already flags. <a href="${tdFlex}">TD's FlexLine page</a> prices the revolving portion off the TD Prime Rate. If your line says TD Prime, 4.45% is the index. If a mortgage segment says mortgage prime, do not use 4.45%. The <a href="/guides/bank-of-canada-rate-and-your-mortgage/">Bank of Canada guide</a> is why the index moves. The <a href="/rates/variable/">variable mortgage page</a> is a different contract that also mentions prime.`,
      ],
    },
    {
      id: "posted",
      heading: "Which lenders actually publish a HELOC rate",
      paragraphs: [
        `A margin that is not on the lender's own page is left blank here. Comparison sites that print "prime plus 0.50" for every big bank were not matched to the official pages read for this article, so those grids are not repeated.`,
        `<a href="${nbcRates}">National Bank's loan-rate page</a> does publish one. The All-In-One line is prime plus 1.000, shown as 5.450. <a href="${nbcPrime}">National Bank's prime</a> was 4.450 as of October 22, 2026, and 4.45 plus 1.00 is 5.45, which matches. <a href="${nbcHeloc}">The product page</a> caps the revolving portion at 65% of value, says the minimum payment is interest and any insurance, and charges $7 a month per account. The rate is variable and moves with National Bank's prime. A negotiated file can differ from the posted margin. The page is the posted one.`,
        `<a href="${cibcHeloc}">CIBC's Home Power Plan</a> advertises an introductory line rate equal to CIBC Prime through December 6, 2027, then the ongoing rate in the agreement. The posted offer asks you to apply by April 30, 2027 and to open the line by August 31, 2027, and it includes a $300 valuation fee. The page defines CIBC Prime as CIBC's own prime. The copy we could read did not print a standalone percentage beside those words, because the number is inserted by the page template. This site's big-bank prime is ${pct(h.prime)}. The introductory rate is not the permanent margin.`,
        `<a href="${rbcHomeline}">RBC's Homeline page</a> says the Royal Credit Line has a variable rate that may rise and fall with RBC's prime, and that the rate is generally among the lowest RBC offers because the line is secured. It does not print prime plus a number. The limit is numeric: up to 80% of value, with the Royal Credit Line going to 65% as you pay the mortgage down. <a href="${tdFlex}">TD's FlexLine</a> prices the revolving portion off TD Prime, with a minimum of interest only, and uses a term portion to reach 80% of value. <a href="${tdEquity}">TD's equity page</a> puts the revolving cap at 65%. The term-portion specials did not render as numbers on the page we read. <a href="${tangerineHeloc}">Tangerine</a> says the agreement rate is Tangerine Prime plus or minus an adjustment factor, and prints no factor. BMO's Homeowner ReadiLine and Scotiabank's Total Equity Plan are those banks' combined products. No posted margin was on a page we could verify for either, so none is stated.`,
      ],
    },
    {
      id: "limits",
      heading: "65% revolving, 80% combined",
      paragraphs: [
        `<a href="${osfiB20}">OSFI's Guideline B-20</a> expects a federally regulated lender to cap the non-amortizing HELOC at 65% loan-to-value or less. The legal maximum for an uninsured mortgage is 80%. <a href="${SOURCES.osfiHeloc}">The June 30, 2022 clarification</a> applies the same split to a combined plan: anything above 65% has to amortize and cannot be readvanced, and principal paid on that slice reduces the authorized limit until the whole plan is back to 65%. The combined limit cannot exceed 80%.`,
        `<a href="${SOURCES.fcacHeloc}">FCAC's equity test</a> is the same rule from the other side. A standalone HELOC needs more than 35% equity, the other face of a 65% loan. Combined with a mortgage, it needs 20% equity, the other face of an 80% limit, and the line itself may go to 65% of value. Credit unions outside federal regulation are not inside OSFI's guideline. Their cap can differ.`,
        `Take a house worth ${cad(h.value)} with ${cad(h.mortgage)} still owing. The value is an assumption so the percentages have a denominator. Sixty-five percent is ${cad(h.sixtyFive)}. The mortgage already uses ${cad(h.mortgage)} of that room, so revolving room left is ${cad(h.room)}. Eighty percent is ${cad(h.eighty)}. The slice between 65% and 80% is ${cad(h.amortizingSlice)}, and it cannot be a line of credit. Total room up to 80% is ${cad(h.combinedRoom)}. You cannot stack that on top of the existing mortgage. The <a href="/guides/mortgage-renewal-vs-refinance-vs-heloc/">renewal, refinance, and HELOC guide</a> runs a different house through the same split.`,
        `Draw the ${cad(h.room)} of revolving room at National Bank's posted margin, prime plus ${pct(h.margin, 2).replace("%", "")} point, which is ${pct(h.rate)} at a prime of ${pct(h.prime)}. Interest only is about ${cad(h.interestOnly)} a month. A quarter-point rise in prime adds about ${cad(h.quarter)} a month on that full draw. Nothing in the ${cad(h.interestOnly)} reduces the principal. The $7 account fee at National Bank sits on top of the interest. An amortizing payment on the same ${cad(h.room)} at ${pct(h.rate)} over 25 years is about ${cad(h.amortizingPayment)}. That second figure is a comparison of payment shapes. It is not OSFI's qualifying formula, which the guideline does not publish as a 25-year HELOC payment.`,
      ],
      table: h.table,
    },
    {
      id: "readvance",
      heading: "A readvanceable mortgage refills the line",
      paragraphs: [
        `<a href="${SOURCES.fcacHeloc}">FCAC calls the combined product a readvanceable mortgage</a> when available credit increases as you pay the mortgage down. Both pieces have to be at the same lender. A standalone HELOC does not grow when you pay the mortgage, and it can sit at a different lender. RBC's Homeline is the readvanceable version: the Royal Credit Line limit rises as the mortgage is paid, up to 65% of value. National Bank says the portion above 65% is a loan whose repaid principal you cannot draw again.`,
        `Readvancing is convenient, and it is how a paid-down mortgage can become a permanent debt. Principal paid on the mortgage segment can reappear as available credit. Spend it, and the combined balance does not fall. OSFI's objection to readvancing above 65% is that the debt never has to end. Below 65%, the lender may let it revolve. FCAC's risk list is the household version: a higher prime raises the payment on a large draw, missed payments put the house at risk, interest-only payments never retire the debt, and easy access makes a holiday look like equity.`,
        `The mortgage sitting beside the line is still a mortgage. Its rate is on the <a href="/rates/5-year-fixed/">5-year fixed</a> or <a href="/rates/variable/">variable</a> shelf, insured or uninsured as the file actually is. A HELOC margin and a variable-mortgage discount are not substitutes. One is prime plus a spread on a revolving balance. The other is prime minus a discount on an amortizing loan. Reported medians, self-reported by Canadian borrowers online, are on <a href="/real-mortgage-rates/">real mortgage rates</a>. The file dated ${REPORTED.asOf} shows a rounded 5-year variable median of ${REPORTED.variableMedian}. That is not a HELOC quote. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> will not score a HELOC margin, because the distribution behind it is mortgage rates.`,
      ],
    },
    {
      id: "stress",
      heading: "The stress test, and the interest-only payment",
      paragraphs: [
        `<a href="${SOURCES.fcacHeloc}">FCAC says</a> you have to pass a stress test to qualify for a HELOC at a bank: you prove you can afford payments at a qualifying rate, not at the rate you hope to pay. <a href="${SOURCES.osfiMqr}">OSFI's minimum qualifying rate</a> for uninsured mortgages is the greater of the contract rate plus 2 percentage points and the floor of 5.25%. Guideline B-20 covers HELOCs inside residential mortgage underwriting, so a federally regulated lender applies that qualifying rate to most newly underwritten files. On National Bank's posted ${pct(h.rate)}, the qualifying rate is ${pct(h.qualifying)}, because ${pct(h.rate)} plus 2 points is above the floor.`,
        `What the lender counts as the payment inside that test is its method. The guideline requires a qualifying rate. The public text does not say the HELOC must be turned into a 25-year amortization. Some lenders do that. Some use another schedule. Ask which payment they typed into the debt-service ratios. Interest only of about ${cad(h.interestOnly)} on ${cad(h.draw)} will not be the number if they qualify you on principal and interest. A 25-year payment at ${pct(h.qualifying)}, shown only as a comparison, is about ${cad(h.qualifyingPayment)}. If approval used a figure near that and the statement asks for ${cad(h.interestOnly)}, the minimum does not retire the debt you just proved you could amortize.`,
        `The <a href="/guides/mortgage-stress-test/">stress test guide</a> and the <a href="/tools/stress-test-qualifier/">qualifier</a> are the mortgage version of this test. Use them for the amortizing slice. Do not type an interest-only HELOC payment in as though it were a mortgage payment. A line that is undrawn on the day you apply can still be counted as if you will draw it. The <a href="/tools/mortgage-calculator/">payment calculator</a> turns a rate and an amortization into a mortgage payment. Interest-only is balance times rate, divided by 12.`,
      ],
    },
    {
      id: "choose",
      heading: "HELOC, refinance, or a second mortgage",
      paragraphs: [
        `Choose the HELOC when the amount fits inside the revolving room and you can see the month you pay it off. On the worked house that room is ${cad(h.room)}, and interest only at a posted prime-plus-one rate is about ${cad(h.interestOnly)} a month, plus any account fee. You can repay and draw again. There is no interest-rate differential on the revolving balance, and no end date unless you create one.`,
        `Choose a refinance when you need more than the revolving room, or you want the debt to die on a schedule. Refinancing replaces the mortgage, often pays a penalty if you are mid-term, and is underwritten as new credit, including the qualifying rate if you add money or stretch the amortization. The <a href="/tools/refinance-calculator/">refinance calculator</a> is the break-even against that penalty. The <a href="/guides/mortgage-prepayment-penalties/">penalties guide</a> is the charge itself. A refinance can include the ${cad(h.amortizingSlice)} that a HELOC is not allowed to revolve. It cannot turn that slice into a line. Insured borrowers should look at the <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> only if the new loan is a high-ratio purchase. A cash-out refinance is generally not an insured loan.`,
        `A second mortgage is another loan registered behind the first. It does not refill as you pay it down unless that contract says so. Federally regulated lenders still live with the 80% combined ceiling. A private second can be offered above that, at a rate this page will not invent, because no official schedule of private second-mortgage rates was used. The cost of second position is a higher rate and a lender who is paid after the first mortgage if the house is sold. The <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages price the first mortgage. They do not price the second. If the only number a lender will give you for the line is "prime plus something, we'll see," you do not yet have an offer. National Bank is the major lender in this review that prints the something.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The 65% and 80% limits are OSFI's. The consumer translation is FCAC's. Posted HELOC numbers are limited to the lenders whose pages printed them. Prime is this site's big-bank figure, checked against the Bank of Canada's September 2, 2026 decision.",
      ],
      listAfter: 0,
      items: [
        `<a href="${osfiB20}">OSFI, Guideline B-20</a>. Non-amortizing HELOC component at or under 65% loan-to-value. <a href="${SOURCES.osfiHeloc}">June 30, 2022 clarification</a>: above 65%, amortizing and not readvanceable, combined limit at or under 80%.`,
        `<a href="${SOURCES.fcacHeloc}">FCAC, home equity lines of credit</a>. Prime-based variable rates, interest-only payments, the stress test at a bank, and readvanceable plans.`,
        `<a href="${nbcRates}">National Bank loan rates</a>. All-In-One at prime plus 1.000, shown as 5.450. Prime 4.450 as of October 22, 2026.`,
        `<a href="${cibcHeloc}">CIBC Home Power Plan</a>. Introductory rate equal to CIBC Prime through December 6, 2027.`,
        `<a href="${rbcHomeline}">RBC Homeline</a> and <a href="${tdFlex}">TD Home Equity FlexLine</a>. Variable rates tied to each bank's prime. No single margin printed on the pages reviewed.`,
      ],
    },
  ],
  faqs: [
    {
      question: "What is a typical HELOC rate?",
      answer:
        "FCAC says the rate is typically prime plus a margin. Its teaching example is prime plus 1%. National Bank posts that margin: prime plus 1.000, or 5.45%, with prime at 4.45% as of October 22, 2026. RBC, TD, and Tangerine describe a prime-based variable rate and do not print one margin on the pages reviewed here.",
    },
    {
      question: "Can a HELOC go to 80% of my home?",
      answer:
        "The mortgage and the HELOC together can be authorized up to 80% at a federally regulated lender. The revolving portion stops at 65%. On a $900,000 house with $500,000 owing, the revolving room is $85,000. The other $135,000 up to the 80% ceiling has to amortize, and principal paid on that slice is not readvanced.",
    },
    {
      question: "Do I only pay interest?",
      answer:
        "Often the minimum is interest only, on the amount you have drawn. National Bank says that, and so does TD for the revolving portion of a FlexLine. Interest-only does not reduce the balance. A quarter-point rise in prime on an $85,000 draw at prime plus 1% adds about $18 a month. Paying more than the minimum is what retires the debt.",
    },
    {
      question: "Is the HELOC stress-tested?",
      answer:
        "At a bank, yes. FCAC says you have to show you can afford payments at a qualifying rate. OSFI's minimum qualifying rate for uninsured mortgages is the greater of the contract rate plus 2 percentage points and 5.25%. On a posted 5.45% line, that qualifying rate is 7.45%. Ask whether the lender's test payment is interest-only or a principal-and-interest payment. The minimum on the statement can be lower than the payment that got you approved.",
    },
    {
      question: "How is a HELOC different from a refinance?",
      answer:
        "A refinance replaces the mortgage, sets an amortization, and can pull out more than the revolving 65% room, up to the 80% combined limit if you qualify. It can also trigger a prepayment penalty mid-term. A HELOC is a limit you can draw, repay, and draw again, and the interest follows prime.",
    },
    {
      question: "How is a second mortgage different?",
      answer:
        "A second mortgage is another loan registered behind the first. It does not automatically refill as you pay it down. A private lender may offer a higher loan-to-value than a bank, at a rate that is not published in any official table used here. Get the rate, the fees, and the position in writing, and compare them with the HELOC room and with a refinance quote.",
    },
  ],
};
