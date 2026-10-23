import type { InDepthGuide } from "./shared";
import { REPORTED, SOURCES, cad, pct } from "./shared";
import { GUIDE_REVIEWED_ISO_BATCH4, PORT as p, RATE_FILE_AS_OF } from "./batch4Math";

const scotiaSchedule = "https://www.scotiabank.com/ca/common/pdf/mortgage/2345011%28TLS%29_%2805-14%29_BC.pdf";
const cibcPort = "https://www.cibc.com/en/personal-banking/mortgages/resource-centre/port-replace-mortgage.html";
const rbcPort = "https://www.rbcroyalbank.com/mortgages/product-advice/porting-a-mortgage.html";
const tdBreak = "https://www.td.com/ca/en/personal-banking/products/mortgages/what-happens-break-mortgage-penalty";
const tdBlend = "https://stories.td.com/ca/en/article/the-truth-behind-three-common-mortgage-myths";
const bmoPort = "https://www.bmo.com/en-ca/main/personal/mortgages/pay-mortgage-faster/";
const bmoRefi = "https://www.bmo.com/en-ca/main/personal/mortgages/refinance/";

export const portingMortgage: InDepthGuide = {
  slug: "porting-mortgage-canada",
  path: "/guides/porting-mortgage-canada/",
  metaTitle: "Porting a Mortgage in Canada | Latest Mortgage Rates",
  description:
    "How a Canadian mortgage port works: the blended rate on a port-and-increase, re-approval, closing gaps, bridge loans, and when porting loses to breaking the term.",
  keywords:
    "port mortgage Canada, port and increase blended rate, mortgage portability window, bridge financing closing gap, port vs break mortgage",
  cardTitle: "Porting a mortgage",
  cardDescription:
    "Same lender, remaining term, and a blend if you need more money. The day-count between closings is in the contract, and it is not the same at every bank.",
  h1: "Porting a mortgage in Canada",
  dek: "A port moves the rate and the time left on your term to a new house, with the same lender. Extra money is a second slice at a current rate, and the two slices are often blended.",
  sourcesLine:
    "Sources: lender portability pages and schedules from RBC, TD, Scotiabank, BMO, and CIBC; CMHC's premium table; OSFI on the qualifying rate. The commitment, not this page, is the window.",
  reviewedIso: GUIDE_REVIEWED_ISO_BATCH4,
  howTo: {
    name: "How to port a Canadian mortgage to a new house",
    description:
      "Confirm the mortgage is portable, price a blend if you need a larger loan, and line the two closing dates up inside the lender's window before you waive conditions.",
    steps: [
      {
        name: "Read the port clause",
        text: "Ask whether this product can move, whether a sale and a purchase both have to happen, and how many days may sit between the two closings.",
      },
      {
        name: "Separate the old balance from any increase",
        text: "The old balance keeps its rate for the time left. New money is priced at a current rate for a similar term. Write down the blend the lender will actually register.",
      },
      {
        name: "Get re-approved on the new house",
        text: "Income, credit, the property, and the insurer if the loan is insured all get looked at again. An increase is new borrowing.",
      },
      {
        name: "Price the break before you give up the old rate",
        text: "Ask for the prepayment charge in writing. Compare that one-time cost with the payment on a full new mortgage at today's rate.",
      },
    ],
  },
  sections: [
    {
      id: "how",
      heading: "A port stays with the lender you already have",
      paragraphs: [
        `Porting keeps the rate and the remaining term of a mortgage you already have, and moves them onto a new property with the same lender. It is not a way to carry that rate to a different bank, and the lender still has to approve the new house and your file.`,
        `The useful version is a closed term whose rate is lower than today's offer. <a href="${rbcPort}">RBC</a> describes taking the current rate and terms to the new home when you buy and sell. <a href="${tdBreak}">TD</a> says principal, rate, remaining term, and amortization move, and the payout charge does not. <a href="${cibcPort}">CIBC's example</a> of a straight port: two years left on a five-year term at 2.99% becomes a two-year term at 2.99% on that principal. The 2.99% is CIBC's illustration, not a rate from this site's file.`,
        `A decrease is a partial prepayment, because the new mortgage is smaller. Scotiabank's schedule says the charge on the difference is yours. CIBC says a partial charge is waived or reimbursed based on the new balance, and the rate on what remains is still the old rate. Read which sentence is in the commitment before you agree to a cheaper house.`,
        `The rounded 5-year fixed median in the file dated ${REPORTED.asOf} is ${REPORTED.fixedMedian}. Those figures are self-reported by Canadian borrowers online and sit on <a href="/real-mortgage-rates/">real mortgage rates</a>. A port is priced off your contract, then off the new-money slice. Posted specials are on the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages.`,
      ],
    },
    {
      id: "blend",
      heading: "Port-and-increase, and one worked blend",
      paragraphs: [
        `When the new house needs a larger loan, the old balance does not get rewritten at today's rate. The extra dollars do. <a href="${cibcPort}">CIBC calls this a port and increase</a>: the rate on the new mortgage is a blend of the rate on the remaining balance and CIBC's current rate for a product with a similar term, applied to the additional funds. <a href="${tdBlend}">TD's description</a> is the same shape. The existing rate and term move with the existing principal, additional funds are priced at current rates for the term closest to the time you have left, and the registered rate is a blend of the two. <a href="${bmoPort}">BMO's prepayment page</a> names the new-money rate more tightly. The existing fixed rate is blended with the current fixed posted rate on the additional amount, subject to qualification.`,
        `Posted, in that BMO sentence, is not a rate-sheet special, so a blend that uses it on the new slice sits higher than one that uses a discounted special. The arithmetic below uses a special, and it is labelled. It keeps the remaining term. It is not a blend-and-extend. On BMO's <a href="${bmoRefi}">refinance page</a>, a blended portable keeps the remaining term and a blend-and-extend portable lengthens it, which starts the higher rate sooner and gives away the cheap months.`,
        `Take ${cad(p.oldBalance)} still owing at ${pct(p.oldRate)}. That rate is the Bank of Canada's volume-weighted average for uninsured fixed mortgages of five years and over that chartered banks advanced in January 2022, not a personal contract. Pair it with ${cad(p.increase)} of new money at ${pct(p.newRate)}, RBC's 3-year uninsured fixed special in the rate file scraped ${RATE_FILE_AS_OF}. There is no 2-year RBC row, so the 3-year special stands in for a similar term when 24 months are left. The dollar-weighted blend is (${cad(p.oldBalance)} × ${pct(p.oldRate)} + ${cad(p.increase)} × ${pct(p.newRate)}) ÷ ${cad(p.total)} = ${pct(p.blendRaw, 3)}, which rounds to ${pct(p.blend)}.`,
        `On a 20-year amortization, the same monthly formula as the <a href="/tools/mortgage-calculator/">payment calculator</a>, the old piece alone is ${cad(p.oldPayment)} a month. The blended loan of ${cad(p.total)} at ${pct(p.blend)} is ${cad(p.blendPayment)}. A full new loan of ${cad(p.total)} at RBC's uninsured 5-year fixed special of ${pct(p.breakRate)} is ${cad(p.breakPayment)}, about ${cad(p.saveVsBreak)} a month more. Three months of interest at ${pct(p.oldRate)} on ${cad(p.oldBalance)} is ${cad(p.penalty)}. After that charge, the blend is still about ${cad(p.termSaveVsBreak)} ahead over the 24 months left, in this illustration, if the interest-rate differential is zero because today's comparison rates are higher than ${pct(p.oldRate)}. The <a href="/guides/mortgage-prepayment-penalties/">penalties guide</a> is where a posted-rate differential still changes the answer. Canadian mortgages compound semi-annually, so a disclosure will not match these dollars to the cent.`,
      ],
      table: p.table,
    },
    {
      id: "qualify",
      heading: "You re-qualify, and the insurer may charge the increase",
      paragraphs: [
        `A port is a new mortgage on a new house. Scotiabank's schedule says you must meet the bank's approval and transfer criteria, including any insurer requirement, and you pay processing fees, legal costs, an appraisal, and any insurance premium. RBC's footnote is shorter: standard lending criteria apply. Neither page says a port skips underwriting because you were approved once.`,
        `An increase is new borrowing. <a href="${SOURCES.osfiMqr}">OSFI's minimum qualifying rate</a> for an uninsured mortgage at a federally regulated lender is the greater of the contract rate plus 2 percentage points and the 5.25% floor. The exemption OSFI published for straight switches is a renewal rule: same balance, amortization not extended, moving between federally regulated lenders when the term ends. A purchase port is not that exemption. If the new loan is bigger, or the amortization is stretched to make the payment fit, expect the stress test. The <a href="/guides/mortgage-stress-test/">stress test guide</a> is the ratio math. The <a href="/tools/stress-test-qualifier/">stress-test calculator</a> is the same test with your income typed in.`,
        `Insured files have a second bill. <a href="${SOURCES.cmhcPremiums}">CMHC's homeowner schedule</a> has a column for the premium on an increase when insurance is ported, and that column is harsher than the column for a new loan once the loan-to-value is above 65%. From 90.01% to 95%, the premium on a new loan is 4.00% of the total, and the portability premium on the increase is 6.30%. CMHC then takes the lesser of those two calculations. On an increase of ${cad(p.cmhcIncrease)} and a new loan of ${cad(p.cmhcTotal)} in that band, 6.30% of the increase is ${cad(p.cmhcOnIncrease)} and 4.00% of the whole loan is ${cad(p.cmhcOnTotal)}. The premium is ${cad(p.cmhcPremium)}. A brand-new insured loan of only the ${cad(p.cmhcIncrease)} increase, at 4.00%, would have been ${cad(p.cmhcNewLoanPremium)}. The portability column costs ${cad(p.cmhcExtraVsNew)} more on that slice before any credit for premium you already paid.`,
        `CMHC adds a 0.60% surcharge on the increase if the amortization is blended. On ${cad(p.cmhcIncrease)} that is ${cad(p.cmhcBlendSurcharge)}. Credits for premium already paid shrink with time: CMHC's examples are a full credit six months after the old closing, half at twelve months, and a quarter at twenty-four. The <a href="/tools/cmhc-insurance-calculator/">CMHC calculator</a> prices a new purchase, not this portability column. Provincial tax on the premium, where it applies, is cash.`,
      ],
    },
    {
      id: "gaps",
      heading: "Closing dates, the gap, and a bridge",
      paragraphs: [
        `The two closings are rarely the same afternoon. The contract's portability window is the number of days the lender will let sit between the sale and the purchase. There is no federal number. The pages that publish one do not publish the same one.`,
        `Scotiabank's schedule, form 2345011 dated 05-14, says you can move the mortgage if you sell and buy within 90 days of the sale, you are not in default, and the bank agrees in writing. The privilege is one new mortgage. It excludes construction and non-personal residential mortgages. You pay the prepayment charge, the discharge fee, and any cashback when you sell. A completed port refunds the charge and the cashback, not the discharge fee. A smaller new loan leaves the charge on the difference. A 2014 form can be older than your commitment. It is the public window, not a promise that every Scotia mortgage since then uses 90 days.`,
        `<a href="${cibcPort}">CIBC publishes 120 days twice</a>, for two different privileges. A delayed or reverse port advances the new fixed mortgage up to 120 days before the old one is paid off. A Variable Flex is not ported on those fixed-rate terms. If you sell and buy within 120 days, CIBC may finance the new purchase and refund all or part of the prepayment charge. CIBC calls that a replacement. Construction is a third clock: draws within 90 days of the sale, and the house finished within a year. RBC's public page says you can port when you buy and sell at the same time, and it prints no day count. TD describes the port and the blend and prints no day count either. Filling those blanks with 30 or 60 days is not a substitute for the commitment.`,
        `If the purchase closes first, the down payment has to arrive before the sale proceeds. CIBC says a delayed or reverse port may need bridge financing for the down payment or closing costs. A bridge is a short loan, often interest-only. Its rate, fee, and last day are in the bridge commitment. The port pages do not publish a national bridge rate, so this page does not invent one. If the sale closes first, the 90-day and 120-day clauses are the refund window. Miss the window and the penalty refund does not arrive, because the port did not happen.`,
      ],
    },
    {
      id: "fails",
      heading: "When the port does not happen",
      paragraphs: [
        `The port fails when the lender will not approve the new file inside the window. The house can be the problem: a property type the lender will not take, a condo the insurer will not take, or a purchase outside the lending area. The borrower can be the problem: income that no longer fits, a credit change, or an increase that fails the qualifying rate. The calendar can be the problem: a purchase that closes past a 90-day or 120-day clause.`,
        `The product can fail first. CIBC says every CIBC mortgage can be ported except the Variable Flex, which uses the replacement rules. Cashback can be repayable on sale even when a completed port later refunds it. A collateral charge that also secures a line of credit does not carry the line to the new house. A straight switch to a new lender, covered in the <a href="/guides/switching-mortgage-lenders-at-renewal/">switching guide</a>, happens at the end of a term, not in the middle of a move.`,
        `If the port fails after you have sold, the payout includes the prepayment charge. The <a href="/tools/mortgage-penalty-calculator/">penalty calculator</a> estimates three months' interest or a simple differential. It is not the payout. Ask for the figure before you waive a condition that depends on the port. The <a href="/tools/renewal-offer-checker/">renewal offer checker</a> belongs in the file only if the term is also ending. A mid-term move is a port or a break, not a renewal.`,
      ],
    },
    {
      id: "choose",
      heading: "Port, break, or blend without moving",
      paragraphs: [
        `Port when the old rate is worth keeping and the new house will be approved inside the window. On the worked file, ${pct(p.oldRate)} stays on ${cad(p.oldBalance)} and ${pct(p.newRate)} applies only to the new ${cad(p.increase)}, which is why the blend is ${pct(p.blend)}. Breaking puts all ${cad(p.total)} at ${pct(p.breakRate)}, about ${cad(p.saveVsBreak)} more a month, before the ${cad(p.penalty)} charge.`,
        `Break when the port will fail, or when the old rate is not cheap. A late-2022 contract can sit above a special in the ${RATE_FILE_AS_OF} file. Keeping it keeps a worse rate, and the <a href="/guides/mortgage-prepayment-penalties/">penalties guide</a> may show an interest-rate differential large enough to change the answer. You pay out, rather than port, when you are leaving the lender. A port cannot follow you to another bank.`,
        `Blend without moving when you are not buying. That is an early renewal or a blend-and-extend on the house you live in. It can avoid a penalty, and it starts a blended rate now, so you stop earning the old rate on the months left. BMO's split is the clean version: a blended portable keeps the clock, and a blend-and-extend restarts a longer term. The <a href="/guides/2026-mortgage-renewal-playbook/">2026 renewal playbook</a> prices that giveaway at maturity.`,
        `Run the payment on the <a href="/tools/mortgage-calculator/">calculator</a> with the blend the lender wrote down, not the ${pct(p.blend)} on this page. The <a href="/lenders/rbc/">RBC</a>, <a href="/lenders/td/">TD</a>, <a href="/lenders/bmo/">BMO</a>, <a href="/lenders/cibc/">CIBC</a>, and <a href="/lenders/scotiabank/">Scotiabank</a> pages carry the rate specials. The port window is the lender's schedule, linked above, and your commitment.`,
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The day counts and the blend descriptions are the lender pages named in the text. The January 2022 rate used as the old contract is a Bank of Canada average, not a personal rate. The new-money rate is a row in this site's rate file. CMHC's percentages are its published homeowner schedule.",
      ],
      listAfter: 0,
      items: [
        `<a href="${cibcPort}">CIBC, porting and replacing a mortgage</a>. Straight port, port and increase, port and decrease, 120-day delayed port, Variable Flex replacement, construction timing.`,
        `<a href="${scotiaSchedule}">Scotiabank prepayment schedule, form 2345011 (05-14)</a>. Ninety days from sale to purchase, refund rules, and the charge that remains on a decrease.`,
        `<a href="${rbcPort}">RBC on porting</a>, <a href="${tdBreak}">TD on porting instead of breaking</a>, <a href="${tdBlend}">TD on the blend</a>, and <a href="${bmoPort}">BMO on blending with the posted rate</a>.`,
        `<a href="${SOURCES.cmhcPremiums}">CMHC premium schedule</a>, including the portability column and the 0.60% blended-amortization surcharge on the increase.`,
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a>. The greater of contract plus 2 points or 5.25% for uninsured mortgages at federally regulated lenders.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Can I port my mortgage to a different bank?",
      answer:
        "No. A port keeps the same lender. Moving the loan to another bank in the middle of the term is a payout, and the prepayment charge applies. At the end of the term you can switch lenders. That is a renewal decision, not a port.",
    },
    {
      question: "Does a port-and-increase keep my old rate on the whole new loan?",
      answer:
        "It keeps the old rate on the old balance. The extra money is priced at a current rate for a similar term, and the registered rate is a blend. In the worked example, $420,000 at 2.61% and $160,000 at 4.99% blend to about 3.27%. BMO's page says the new slice uses the posted rate, which can be higher than a special.",
    },
    {
      question: "How long can the sale and the purchase be apart?",
      answer:
        "Whatever the commitment says. Scotiabank's published schedule uses 90 days from the sale. CIBC publishes 120 days for a delayed or reverse port of a fixed mortgage, and 120 days for a Variable Flex replacement. RBC and TD describe the port without printing a day count on the pages reviewed here. A missed window means the penalty refund does not happen.",
    },
    {
      question: "Will I pass without a new stress test?",
      answer:
        "Do not count on it. The lender re-approves the new property and your income. An increase is new borrowing. OSFI's qualifying rate for uninsured mortgages at federally regulated lenders is the greater of the contract rate plus 2 percentage points and 5.25%. The straight-switch exemption is for a renewal with the same balance and amortization, not for a purchase port.",
    },
    {
      question: "What does CMHC charge if the insured loan gets bigger?",
      answer:
        "CMHC has a separate premium on the increase. From 90.01% to 95% loan-to-value, that rate is 6.30%, against 4.00% on a new loan. CMHC charges the lesser of the premium on the increase and the premium on the whole new loan. A blended amortization adds 0.60% of the increase. Credits for premium you already paid shrink as the old closing gets further away.",
    },
    {
      question: "Is a bridge loan the same thing as a port?",
      answer:
        "No. The port is the mortgage moving to the new house. The bridge is short-term money so you can close the purchase before the sale proceeds arrive. CIBC says a delayed port may need one for the down payment or closing costs. The bridge rate is in its own commitment.",
    },
  ],
};
