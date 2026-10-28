import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import {
  GUIDE_REVIEWED_ISO_BATCH4,
  HIST_2022 as h,
  RATE_FILE_AS_OF,
  SPREAD,
  TRIGGER as t,
  WAVE_BY_MONTH,
  WAVE_PAYMENTS as w,
} from "./batch4Math";
import { BOC_POLICY_RATE, PRIME_RATE } from "../../lib/primeRate";

const bocPosted = "https://www.bankofcanada.ca/rates/banking-and-financial-statistics/posted-interest-rates-offered-by-chartered-banks/";
const bocCharged = "https://www.bankofcanada.ca/rates/banking-and-financial-statistics/interest-rates-for-new-and-existing-lending-by-chartered-banks/";
const fsrHouseholds = "https://www.bankofcanada.ca/publications/financial-stability-report/financial-stability-report-2026/households/";
const osfiAro = "https://www.osfi-bsif.gc.ca/en/about-osfi/reports-publications/osfis-annual-risk-outlook-fiscal-year-2026-2027";
const cmhcFall2025 = "https://eppd1strscr01.blob.core.windows.net/cmhcprdcontainer/sf/project/archive/publications/residential_mortgage_industry_report/residential-mortgage-industry-report-fall-2025-en.pdf";
const bmoRenew = "https://www.bmo.com/en-ca/main/personal/mortgages/renewal/";
const tdSwitch = "https://www.td.com/ca/en/personal-banking/products/mortgages/switch-to-td";
const tdEarly = "https://www.td.com/ca/en/personal-banking/products/mortgages/what-happens-break-mortgage-penalty";

export const renewalWave2027: InDepthGuide = {
  slug: "2027-mortgage-renewal-wave",
  path: "/guides/2027-mortgage-renewal-wave/",
  metaTitle: "The 2027 Mortgage Renewal Wave | Latest Mortgage Rates",
  description:
    "What 2022 borrowers face at renewal in 2027: Bank of Canada posted and actual 2022 rates, payment changes against today's rate file, trigger rates, and the 120-to-180-day clock.",
  keywords:
    "2027 mortgage renewal wave, 2022 mortgage renewal Canada, payment shock renewal, variable mortgage trigger rate, OSFI renewal risk",
  cardTitle: "The 2027 renewal wave",
  cardDescription:
    "Five-year terms from 2022 mature in 2027. January's borrowers and December's borrowers are not facing the same payment.",
  h1: "The 2027 renewal wave: what 2022 borrowers face",
  dek: "A five-year term signed in 2022 matures in 2027. The year those mortgages were signed ran from a 4.79% posted five-year rate to 6.49%, and the rates banks actually advanced moved even more.",
  sourcesLine:
    "Sources: Bank of Canada posted and funds-advanced series for 2022, the Bank's 2026 Financial Stability Report, OSFI's 2026-27 Annual Risk Outlook, and CMHC's Fall 2025 mortgage report. Your renewal letter is the offer.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH4,
  howTo: {
    name: "How to prepare for a 2027 mortgage renewal",
    description:
      "Find the rate you actually signed in 2022, price today's payment on the balance you will owe, and start the lender conversation inside the 120-to-180-day window your bank will honour.",
    steps: [
      {
        name: "Get the contract rate and the maturity date",
        text: "Use the disclosure or the annual statement, not the posted rate from the year you bought. Write down the balance, the amortization left, and whether the payment is fixed while the rate floats.",
      },
      {
        name: "Price one renewal at a rate from a live file",
        text: "Compare that payment with the renewal letter. A straight switch keeps the balance and the amortization. Adding money or years is a different test.",
      },
      {
        name: "If the payment has been fixed since a low variable rate, ask for the trigger",
        text: "A fixed-payment variable mortgage can already be past the point where the payment covers interest. The lender can require a higher payment, a lump sum, or a conversion.",
      },
      {
        name: "Open the file four to six months out",
        text: "BMO will renew without a penalty up to 180 days early. TD tells switchers to start around 120 days out. FCAC says the renewal statement arrives at least 21 days before maturity, which is late to begin.",
      },
    ],
  },
  sections: [
    {
      id: "answer",
      heading: "2022 was not one mortgage rate",
      paragraphs: [
        `Five-year terms signed in 2022 come up for renewal in 2027, and 2022 was not one rate: the Bank of Canada's conventional five-year posted rate went from 4.79% in January to 6.49% in October, while the rates chartered banks actually advanced on uninsured five-year-and-over fixed mortgages went from 2.61% in January to 5.22% in December. A borrower who signed near the January average faces a higher payment at the rates in today's file; a borrower who signed near the December average may not.`,
        `That split is why a single "payment shock" percentage misleads. <a href="${osfiAro}">OSFI's 2026-27 Annual Risk Outlook</a> says that as of January 2026, 3.1 million mortgages, 52% of the total, would renew by the end of 2027. Of those, 1.3 million, 22% of all mortgages, are fixed-rate loans or variable-rate loans with fixed payments renewing for the first time since they were originated in the low-rate period of 2021 and 2022. OSFI expects material monthly payment increases for that group. <a href="${fsrHouseholds}">The Bank's 2026 Financial Stability Report</a> uses a different frame: over the twelve months from that report, the last of the five-year fixed-payment mortgages taken out in the pandemic, about 12% of outstanding mortgages, would see payments rise by about 15% on average. The Bank's figure uses market expectations as of May 19, 2026. It is an average across a cohort, not the change from 2.61% to one special in October 2026.`,
        `<a href="${cmhcFall2025}">CMHC's Fall 2025 Residential Mortgage Industry Report</a> counted 1.15 million mortgages coming up in 2026 and 940,000 scheduled for 2027. CMHC's own illustration of the earlier book is an average uninsured five-year fixed rate of 2.36% in July 2020 against 3.95% in July 2025. Those two months are not 2022. They are a warning against grabbing the nearest low number and calling it the rate you signed. The <a href="/guides/2026-mortgage-renewal-playbook/">2026 renewal playbook</a> is the shopping sequence for the cohort maturing now. This page is the one maturing next.`,
      ],
    },
    {
      id: "posted",
      heading: "Posted rates and the rates banks actually charged",
      paragraphs: [
        `<a href="${bocPosted}">The weekly posted series</a> for the conventional five-year mortgage, V80691335, is the most typical posted rate at the six major chartered banks. It was 4.79% on January 5, 2022 and every Wednesday through April 13, then 4.99% on April 20, 5.39% on May 25, 5.64% on June 15, 6.04% on June 22, 6.14% on July 27, and 6.49% on October 19. It was still 6.49% on December 28. On October 21, 2026 the same series was 6.19%. Posted is the shelf, not the discounted commitment, and it feeds many interest-rate differentials if you break early. The <a href="/guides/posted-vs-discounted-mortgage-rates/">posted versus discounted guide</a> is that mechanism.`,
        `<a href="${bocCharged}">The series that is closer to a contract rate</a> is the volume-weighted average of funds advanced by chartered banks: new credit, draws, renewals, and refinances, in Canadian dollars, to households. Credit unions are not in it. "Five years and over" is every fixed term of at least five years, not a pure five-year bucket. For uninsured mortgages that average was ${pct(h.uninsuredFixed.jan)} in January 2022, ${pct(h.uninsuredFixed.jun)} in June, and ${pct(h.uninsuredFixed.dec)} in December. The insured fixed averages were ${pct(h.insuredFixed.jan)}, ${pct(h.insuredFixed.jun)}, and ${pct(h.insuredFixed.dec)}. The discount to the posted shelf was enormous in January, when 4.79% posted sat beside a 2.61% uninsured average, and it was much smaller by December, when 6.49% posted sat beside 5.22%.`,
        `Variable averages followed prime. The weekly prime series was ${pct(h.primeJan)} on January 5, 2022 and ${pct(h.primeDec)} on December 14. The daily target was ${pct(h.targetJan)} on January 4 and ${pct(h.targetDec)} on December 8, after the steps dated March 3, April 14, June 2, July 14, September 8, October 27, and December 8 in the daily series. Uninsured variable funds advanced averaged ${pct(h.uninsuredVariable.jan)} in January, ${pct(h.uninsuredVariable.jun)} in June, and ${pct(h.uninsuredVariable.dec)} in December. Insured variable averages were ${pct(h.insuredVariable.jan)}, ${pct(h.insuredVariable.jun)}, and ${pct(h.insuredVariable.dec)}. A January 2022 variable and a December 2022 variable are different 2027 renewals.`,
        `Today's comparison on this page is not the 6.19% posted rate. It is the median of the lowest uninsured 5-year fixed rate at each lender in data/rates.json on ${RATE_FILE_AS_OF}: ${pct(SPREAD.todayUninsuredFixedMedian)}, across ${SPREAD.todayUninsuredFixedLenders} lenders. The lowest of those lender rows is ${pct(SPREAD.todayUninsuredFixedMin)} and the highest is ${pct(SPREAD.todayUninsuredFixedMax)}. RBC's own uninsured 5-year fixed special in that file is ${pct(SPREAD.rbcUninsured.fixed)}. Reported medians are another dataset. The file dated ${REPORTED.asOf} shows a rounded 5-year fixed median of ${REPORTED.fixedMedian} and a rounded 5-year variable median of ${REPORTED.variableMedian}, insured status not stated. Those figures are self-reported by Canadian borrowers online. They are on <a href="/real-mortgage-rates/">real mortgage rates</a>. Do not average them into the Bank's 2022 series or into the scrape. Live shelves are the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages.`,
      ],
    },
    {
      id: "payments",
      heading: "What the payment does on the way from 2.61% to today's median",
      paragraphs: [
        `A 25-year amortization that started in 2022 has about 20 years left in 2027. The tables use 20 years and the balance at renewal, not the amount you borrowed. The formula is this site's monthly formula, the same one as the <a href="/tools/mortgage-calculator/">payment calculator</a>. A lender's semi-annual compounding changes the dollars slightly. The gap is the point.`,
        `At ${pct(w.origin)} versus ${pct(w.today)}, a ${cad(500_000)} balance goes from ${w.table.rows[1][1]} to ${w.table.rows[1][2]}. The five-year column multiplies the monthly gap by 60. It is not extra interest, because part of a higher payment is principal. Keeping the remaining amortization, rather than stretching it, pays the higher amount and leaves less owing at the next maturity. Stretching the years is a refinance. It lowers the payment, raises the interest, and at a federally regulated lender it is no longer a straight switch.`,
        `The second table stops the wave being one number. On ${cad(WAVE_BY_MONTH.balance)} and 20 years, the January 2022 uninsured average renews higher, the June average renews higher by less, and the December average renews slightly lower against this file's median. Slightly lower is not a promise. The median is ${pct(w.today)} and RBC's uninsured special is ${pct(SPREAD.rbcUninsured.fixed)}. A household that locked in late 2022, after posted rates had reached 6.49% and the uninsured average had reached 5.22%, is not the household OSFI means by the 2021 and 2022 low-rate vintages. Know which month you signed.`,
        `The Bank's "about 15%" is an average across the remaining five-year fixed-payment pandemic mortgages, on a rate path marked to May 19, 2026. The January row is one month's chartered-bank average against one October 2026 median, on a balance this page chose. Both can be true. Put the renewal letter into the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> and the <a href="/tools/mortgage-renewal-calculator/">renewal calculator</a>. The checker compares a rate with reports. A renewal at maturity usually has no penalty.`,
      ],
      table: w.table,
    },
    {
      id: "months",
      heading: "January, June, and December were different renewals",
      paragraphs: [
        `Hold the balance at ${cad(WAVE_BY_MONTH.balance)} so the only thing that moves is the 2022 average. The payment change in the last column is against ${pct(w.today)} from the rate file, not against the 6.19% posted rate. A posted-rate renewal would look worse for every row. The <a href="/guides/switching-mortgage-lenders-at-renewal/">switching guide</a> is the comparison with another lender once the penalty is zero.`,
      ],
      table: WAVE_BY_MONTH.table,
    },
    {
      id: "trigger",
      heading: "Fixed-payment variable mortgages and the trigger",
      paragraphs: [
        `Borrowers who took a variable rate with a fixed payment in early 2022 had a different five years. The payment was set at a low rate, then prime rose from ${pct(h.primeJan)} to ${pct(h.primeDec)} inside that year. <a href="${SOURCES.fcacTrigger}">FCAC's trigger rate</a> is the point where the fixed payment only covers interest. Past it, unpaid interest is added to the balance, and the lender can require a higher payment, a lump sum, or a conversion. OSFI treats this product, a VRMFP, as higher risk. In the same Annual Risk Outlook, VRMFP originations and renewals were 36% of mortgage flows in December 2025, close to the 41% share of March 2022.`,
        `The illustration uses the Bank's averages, not a made-up contract. A payment at ${pct(t.contract)} on ${cad(t.balance)} over ${t.years} years is ${cad(t.payment)} a month. Set equal to one month of simple interest on that opening balance, the payment covers interest only up to about ${pct(t.triggerRate)}. The December 2022 uninsured variable average was ${pct(t.laterRate)}. One month of interest on the same opening balance at that rate is about ${cad(t.laterMonthlyInterest)}, roughly ${cad(t.shortfall)} more than the payment. The real December balance would have been a little lower, and the lender's trigger uses its own compounding, so ${pct(t.triggerRate)} is not the number in your disclosure. The shape is the point: a payment built at the January 2022 variable average does not cover a contract rate at the December 2022 variable average.`,
        `If that is your mortgage, 2027 is not the first time the math has mattered. The balance may be higher than a normal amortization would have left it. The <a href="/guides/bank-of-canada-rate-and-your-mortgage/">Bank of Canada guide</a> walks through trigger rates with a current special, and the <a href="/guides/should-i-lock-in-variable-rate/">lock-in guide</a> is the mid-term conversion. Prime on this site is still ${pct(PRIME_RATE)}. The overnight target is ${pct(BOC_POLICY_RATE)} after October 28, 2026. That is not the prime of December 2022.`,
      ],
    },
    {
      id: "clock",
      heading: "What to do 120 to 180 days before maturity",
      paragraphs: [
        `There is no statute that says you must start at 180 days. <a href="${SOURCES.fcacRenew}">FCAC</a> says a federally regulated lender has to send the renewal statement at least 21 days before the term ends. Twenty-one days is enough time to sign the letter. It is a poor time to see whether another lender will take the file.`,
        `<a href="${bmoRenew}">BMO</a> will renew with BMO as early as 180 days before the end of the term without a penalty. Earlier than that, a prepayment charge can apply. <a href="${tdSwitch}">TD</a> recommends starting a switch about 120 days before maturity. <a href="${tdEarly}">TD also says</a> you can renew 120 days early without a prepayment charge, and that renewing earlier can cost the charge. A rate hold expires on the date printed on it. RBC's public pages talk about holds of up to 120 days on a pre-approval. That is a purchase clock, not automatically a renewal clock.`,
        `Inside the window, get the balance, the maturity date, the remaining amortization, the penalty method, and whether the charge is a standard charge or a collateral charge. Price a same-balance, same-amortization renewal against a straight switch. Since November 21, 2024, OSFI has not required the prescribed qualifying rate on an uninsured straight switch at renewal when the amount and the amortization do not increase. Adding money, or stretching the years, puts the stress test back. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is the threshold and the <a href="/tools/stress-test-qualifier/">qualifier</a> is the arithmetic. Insured straight switches were already outside that test. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> belongs in the file only for a new high-ratio purchase.`,
        `Keeping the remaining amortization, and paying the higher amount, is the clean renewal. A shorter term because you think rates will fall is a view, not a fact the Bank has published. A longer amortization should be priced as extra interest. If the fixed-payment variable balance has grown, deal with that before you argue about an eighth of a point. The <a href="/guides/mortgage-prepayment-penalties/">penalties guide</a> applies if someone offers to blend you early: those months at a January 2022 rate are the valuable ones.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Posted rates are V80691335. Funds-advanced averages are the Bank's chartered-bank lending table. The 3.1 million and 1.3 million figures are OSFI's outlook as of January 2026. The 12% and 15% figures are the Bank's May 2026 stability report, using market expectations as at May 19, 2026. The 940,000 count is CMHC's Fall 2025 report. Today's median is this site's rate file.",
      ],
      listAfter: 0,
      items: [
        `<a href="${bocPosted}">Bank of Canada, posted rates at the major chartered banks</a>. Conventional 5-year: 4.79% in January 2022, 6.49% from October 19, 2022, 6.19% on October 21, 2026.`,
        `<a href="${bocCharged}">Bank of Canada, interest rates charged on funds advanced</a>. Uninsured fixed, five years and over: 2.61% in January 2022, 3.70% in June, 5.22% in December.`,
        `<a href="${osfiAro}">OSFI, Annual Risk Outlook 2026-27</a>. 3.1 million renewals by the end of 2027, including 1.3 million first renewals from the 2021-22 low-rate vintages.`,
        `<a href="${fsrHouseholds}">Bank of Canada, Financial Stability Report 2026, households</a>. About 12% of mortgages, average payment increase about 15%, on expectations as at May 19, 2026.`,
        `<a href="${cmhcFall2025}">CMHC, Residential Mortgage Industry Report, Fall 2025</a>. 940,000 mortgages scheduled for 2027.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Does every 2022 borrower face a higher payment in 2027?",
      answer:
        "No. Chartered banks' average rate on uninsured fixed mortgages of five years and over was 2.61% in January 2022 and 5.22% in December 2022. Against the median uninsured 5-year fixed rate in this site's October 23, 2026 file, the January average renews higher and the December average renews slightly lower, on the same balance and the same 20 years left. Your disclosure picks the row.",
    },
    {
      question: "Is the posted five-year rate the rate people signed?",
      answer:
        "It is the shelf rate. The Bank's conventional five-year posted rate was 4.79% at the start of 2022 and 6.49% from October 19. The average rate on uninsured fixed funds advanced was 2.61% in January, more than two points below the posted rate. By December the average was 5.22%, closer to the 6.49% posted rate. Posted rates still matter if you break early, because many penalties use them.",
    },
    {
      question: "Why does the Bank of Canada say about 15% if some rows jump more?",
      answer:
        "The 15% is an average for the last of the five-year fixed-payment mortgages from the pandemic years, about 12% of outstanding mortgages, using market expectations as of May 19, 2026. The tables here compare three months of 2022 chartered-bank averages with one median from a rate file scraped on October 23, 2026. An average across a cohort and a single January contract are allowed to differ.",
    },
    {
      question: "What if my variable payment never went up?",
      answer:
        "You may have a fixed-payment variable mortgage. A payment set at the January 2022 uninsured variable average of 1.50%, on $500,000 over 25 years, covers interest only up to about 4.80% in this page's simple illustration. The December 2022 uninsured variable average was 6.14%. Ask the lender for your trigger rate. Unpaid interest above it is added to the balance.",
    },
    {
      question: "When should I start on a 2027 maturity?",
      answer:
        "Four to six months before the date in the statement is the window the banks themselves describe. BMO will renew with BMO up to 180 days early without a penalty. TD suggests about 120 days for a switch, and will renew 120 days early without a charge. The legal minimum for the renewal statement is 21 days, which is late to shop.",
    },
    {
      question: "Can I switch lenders without the stress test?",
      answer:
        "At renewal, an uninsured straight switch to another federally regulated lender does not require OSFI's prescribed qualifying rate if the loan amount and the remaining amortization do not increase. That exemption dates from November 21, 2024. Insured straight switches were already exempt. Adding funds, or stretching the amortization, puts the test back.",
    },
  ],
};
