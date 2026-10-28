import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO,
  RATE_CONTEXT,
  RENEWAL_EXAMPLE as ex,
  REPORTED,
  SOURCES,
  cad,
  pct,
  reportedRatesParagraph,
} from "./shared";

const e = ex;

export const renewalPlaybook: InDepthGuide = {
  slug: "2026-mortgage-renewal-playbook",
  path: "/guides/2026-mortgage-renewal-playbook/",
  metaTitle: "2026 Mortgage Renewal Playbook | Latest Mortgage Rates Canada",
  description:
    "A Canada-specific playbook for renewing a 2021 mortgage in 2026: the timeline, what to negotiate, when a switch skips the stress test, and how blend-and-extend actually prices.",
  keywords:
    "mortgage renewal 2026 Canada, 2021 mortgage renewal, blend and extend, switch lenders stress test, mortgage renewal negotiation",
  cardTitle: "2026 mortgage renewal playbook",
  cardDescription:
    "The 2021 five-year terms come due in 2026. Timeline, negotiation, switching, and blend-and-extend, with the stress-test exemption written out.",
  h1: "The 2026 mortgage renewal playbook",
  dek: "Five-year terms signed in 2021 mature in 2026. This is the sequence that keeps a cheap remaining rate from being given away, and that prices a switch before you sign the letter in the envelope.",
  sourcesLine:
    "Sources: Bank of Canada, OSFI, the Department of Finance, FCAC, and the reported-rate file on this site. A renewal letter from your lender controls your contract.",
  reviewedIso: GUIDE_REVIEWED_ISO,
  howTo: {
    name: "How to renew a Canadian mortgage in 2026",
    description:
      "Read the maturity date, price the remaining cheap months, compare a straight switch with a same-lender renewal, and sign only after the penalty and the stress-test rules are clear.",
    steps: [
      {
        name: "Read the maturity date and the charge",
        text: "Get the balance, the maturity date, the prepayment privilege already used this year, the penalty method, and whether the mortgage is a standard charge or a collateral charge.",
      },
      {
        name: "Separate a rate hold from an early start",
        text: "Ask whether a quoted renewal rate starts on the maturity date or starts now. Starting now gives up the remaining months at the old rate.",
      },
      {
        name: "Price a straight switch",
        text: "A straight switch keeps the balance and the remaining amortization the same or smaller. At a federally regulated lender, that switch does not require the set stress-test rate. Adding money or years does.",
      },
      {
        name: "Compare the whole contract",
        text: "Put the renewal offer next to rates people report, then compare the penalty method, prepayment room, and portability before you accept a slightly lower rate.",
      },
    ],
  },
  sections: [
    {
      id: "wave",
      heading: "Why 2026 is a renewal year",
      paragraphs: [
        "A five-year term funded in 2021 matures in 2026. The amortization keeps running, so a 25-year loan started then has about 20 years left. The renewal resets the rate, the term, and the privileges. Many of those 2021 contracts were discounted far below the posted shelf. The new contract rate is higher. That payment shock is not a reason to accept the first letter. At maturity the penalty for leaving is usually zero, which is why the letter is negotiable.",
        `${RATE_CONTEXT} Fixed mortgage rates follow the bond market more than they follow that overnight decision one for one. A variable-rate payment, or the rate on an adjustable mortgage, moves when prime moves. The <a href="${SOURCES.bocOct}">October 28, 2026 rate announcement</a> is the source for the policy rate. Nothing on this page predicts the December 9 decision.`,
        reportedRatesParagraph(),
        "Use the medians as a reference, then confirm a live quote. The <a href=\"/real-mortgage-rates/\">real mortgage rates</a> page has the distribution. The <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> places one number on it. The <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> shows each bank's posted-versus-reported gap.",
      ],
    },
    {
      id: "example",
      heading: "A worked payment on a 2021-style contract",
      paragraphs: [
        `The contract below is a labelled example of the kind of discounted five-year fixed rate many 2021 files still carry. It is not a published average and it is not your rate. Balance ${cad(e.balance)}, 20 years of amortization remaining, contract rate ${pct(e.oldRate)}. Using the same monthly formula as the <a href="/tools/mortgage-calculator/">mortgage calculator</a> on this site (annual rate divided by 12), the payment is ${cad(e.oldPayment)}. Canadian mortgages are usually compounded semi-annually, so a lender's disclosure can differ by a few dollars. The gap between scenarios is the point.`,
        `Renew that same balance and remaining amortization at the rounded reported 5-year fixed median of ${pct(e.fixedRate)}. The payment becomes ${cad(e.fixedPayment)}, which is ${cad(e.extraFixedPayment)} more a month, about ${cad(e.extraFixedPayment * 60)} of extra payments over five years. Interest over those 60 months is about ${cad(e.extraFixedInterest)} higher than staying at ${pct(e.oldRate)}. At the rounded reported 5-year variable median of ${pct(e.variableRate)}, the payment is ${cad(e.variablePayment)}, or ${cad(e.extraVariablePayment)} more a month (${cad(e.extraVariablePayment * 60)} over five years). That variable snapshot holds the rate still. Prime can move it.`,
        `Two things follow. First, even a well-negotiated renewal costs more than 2021, and the household budget has to absorb that before the term is chosen. Second, the remaining months at ${pct(e.oldRate)} are valuable. Giving them up early, to "lock in" before maturity, means paying the higher rate for months you were entitled to keep. On this example, three months of interest at ${pct(e.oldRate)} on ${cad(e.balance)} is only ${cad(e.threeMonths)}. The penalty for breaking is often that small when your rate sits below today's rates. The expensive part is the rate you volunteer to start early, not the penalty line.`,
      ],
    },
    {
      id: "timeline",
      heading: "A practical timeline",
      paragraphs: [
        "There is no single statute that says you must start shopping 120 days out. Lenders send renewal offers on their own schedules, and a rate hold, if you are offered one, expires on the date printed on it. The useful clock is your maturity date, read off the annual statement or the original disclosure.",
      ],
      listAfter: 0,
      items: [
        "About six months out, write down the balance, maturity date, rate, insured status, prepayment room already used, penalty method, and whether the charge is standard or collateral. The <a href=\"/guides/mortgage-prepayment-penalties/\">penalty guide</a> is for the next contract. You usually pay no penalty on the maturity date itself.",
        "About four months out, get the renewal offer in writing and a straight-switch quote from a broker or another lender on the same balance and remaining amortization. The <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> is the conversation.",
        "Before an early start, confirm the date the new rate begins. A hold for the maturity date keeps today's payment. A blend or a refinance starts the new rate now.",
        "In the last weeks, leave time for an assignment or a new registration and any appraisal. Doing nothing can roll you into a non-discounted rate. <a href=\"" + SOURCES.fcacPenalty + "\">FCAC</a> tells borrowers to shop the renewal.",
      ],
    },
    {
      id: "negotiate",
      heading: "What you are actually negotiating",
      paragraphs: [
        "The posted rate is a shelf price. On a renewal the leverage is stronger than it is mid-term, because leaving does not require a break fee. Ask for the prepayment percentage, whether the penalty is three months' interest or an interest-rate differential, and whether you can port. Price a harsh break fee on the <a href=\"/tools/mortgage-renewal-calculator/\">renewal calculator</a> before you trade it for a tenth of a point.",
        `Place the written offer on the <a href="/tools/renewal-offer-checker/">renewal offer checker</a> against rates self-reported by Canadian borrowers online. In this file the rounded 5-year fixed median is ${pct(e.fixedRate)} where insured status was not stated (N = ${REPORTED.fixedN}). A small N is a weak benchmark. Compare insured and uninsured offers with the <a href="/rates/insured/">insured</a> and <a href="/rates/uninsured/">uninsured</a> tables. A five-year term is the familiar default, not a requirement. The <a href="/compare/fixed-vs-variable/">fixed versus variable</a> page is the term choice. A reported median is not an offer.`,
      ],
    },
    {
      id: "switch",
      heading: "Switching, and when the stress test stays out of it",
      paragraphs: [
        `Since November 21, 2024, OSFI does not require a set minimum qualifying rate for an uninsured straight switch at renewal between federally regulated lenders, when the loan amount does not go up and the amortization does not get longer. <a href="${SOURCES.osfiSwitch}">OSFI's backgrounder</a> and the <a href="${SOURCES.osfiMqr}">current minimum-qualifying-rate page</a> both say that. Insured straight switches were already outside that re-test. The Department of Finance, in its <a href="${SOURCES.financeReforms}">September 16, 2024 mortgage reforms</a>, said the strengthened Canadian Mortgage Charter lets insured borrowers switch lenders at renewal without another stress test. The point of both rules is competition at renewal. A lender can still decline a file for credit, income documentation, or property reasons. The exemption is from the prescribed rate, not from underwriting judgment.`,
        "A straight switch means the new loan pays out the old balance and the remaining amortization is the same or shorter. Adding even a small amount of new money, rolling in a penalty or a debt, or stretching the amortization back toward 30 years, is a refinance. Refinances and home-equity lines of credit are underwritten at the qualifying rate. <a href=\"" + SOURCES.fcacPrepare + "\">FCAC's mortgage preparation page</a> lists refinance and a home-equity line as cases where the stress test applies if you already have a mortgage. The <a href=\"/guides/mortgage-stress-test/\">stress test guide</a> works the qualifying math, and the <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> runs a file. Staying with your current lender for a plain renewal is not new underwriting, and lenders generally do not reapply the qualifying rate. If that same-lender offer adds money or years, treat it as a refinance anyway.",
        "A standard charge can often be assigned. A collateral charge, common when a line of credit is attached, usually needs a lawyer. Ask whether the new lender pays that bill at maturity. A provincially regulated credit union is outside OSFI's switch rule and follows its own regulator. Ask, in writing, which qualifying rate they will use. The <a href=\"/guides/banks-vs-monoline-lenders-vs-credit-unions/\">lender comparison</a> covers the difference. An insured mortgage can keep its insurance on a switch. That is different from porting the policy to a new purchase.",
      ],
    },
    {
      id: "blend",
      heading: "Blend-and-extend, priced rather than assumed",
      paragraphs: [
        "Blend-and-extend is a lender option, not a right. You keep the same lender. The lender mixes your remaining contract with a new term at today's rate and produces one blended rate for a new term. You avoid a prepayment penalty because you are not breaking the contract to leave. You do not avoid the cost of the old rate. You start paying the blend immediately, which means the cheap months are gone.",
        `One common illustration weights the rates by months. It is not the formula your bank will print, and some lenders weight by balance or add a fee. On the example file, 24 months left at ${pct(e.oldRate)} and a new 60-month term at ${pct(e.fixedRate)}: (${pct(e.oldRate)} × 24 + ${pct(e.fixedRate)} × 36) ÷ 60 = ${pct(e.blend, 3)}, which rounds to ${pct(e.blendRounded)}. The payment on ${cad(e.balance)} over the remaining 20-year amortization at ${pct(e.blendRounded)} is ${cad(e.blendPayment)}. Against staying at ${pct(e.oldRate)} for those 24 months, the extra payments are about ${cad(e.extraBlendVsStay24)}. Against renewing the whole balance at ${pct(e.fixedRate)} for a full five years, the blend saves about ${cad(e.saveBlendVsMarket60)} of payments over 60 months. That second comparison only helps you if you were going to give up the old rate anyway. If you can wait until maturity, you keep ${pct(e.oldRate)} for the leftover months and you still negotiate the new term with a zero penalty.`,
        "A blend earns its place when you must break the mortgage and it is cheaper than the penalty plus a new loan. It is a weak deal when the only pressure is an early renewal letter. Ask for both numbers the same day: the blend that starts now, and the rate held for maturity. If the blend adds money or years, the stress test can apply.",
      ],
    },
    {
      id: "choose",
      heading: "Choosing the next term",
      paragraphs: [
        `On the reported file, the rounded 5-year variable median (${pct(e.variableRate)}) sits below the rounded 5-year fixed median (${pct(e.fixedRate)}). The variable borrower is paid, at the start, for taking the risk that prime rises. A fixed payment does not move during the term, and the fixed penalty is usually the greater of three months' interest and an interest-rate differential. Variable contracts usually charge three months' interest only. Read the <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> before you pick a fixed term you might not finish. Live shelves are on the <a href="/rates/5-year-fixed/">5-year fixed</a>, <a href="/rates/variable/">variable</a>, <a href="/rates/insured/">insured</a>, and <a href="/rates/uninsured/">uninsured</a> pages.`,
        "Insured contract rates are often lower because the lender's loss is insured. The premium is already in the balance. A straight renewal or switch does not trigger a new one. A refinance or a different purchase can. If the renewal is really a move, portability can keep the old rate on the old balance, with any increase priced at today's rate. Ask before you list. The <a href=\"/tools/refinance-calculator/\">refinance calculator</a> is for pulling equity out on purpose.",
      ],
    },
    {
      id: "tools",
      heading: "Where to check a number",
      paragraphs: [
        "The renewal offer checker, the mortgage calculator, and the renewal calculator are the three tools that match this decision. The <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a> matters when the plan adds money or years. The <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> matters if you would leave before maturity or if you are comparing the break fee on the next contract. The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> matters only if the renewal has turned into a new purchase with less than 20% down. Reported rates live on <a href=\"/real-mortgage-rates/\">real mortgage rates</a>. Posted shelves live on the rate pages linked above. The <a href=\"/disclaimer/\">disclaimer</a> applies: this is education, and the commitment letter is the contract.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Confirm any figure that will be signed with the lender and, where insurance is involved, with the insurer. The rules cited above are the public versions as reviewed for this page.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.bocOct}">Bank of Canada, October 28, 2026 rate announcement</a>. Target raised to 2.50%. Next announcement December 9, 2026.`,
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate for uninsured mortgages</a>. Greater of the contract rate plus 2% or 5.25%, with no set minimum qualifying rate on an uninsured straight switch.`,
        `<a href="${SOURCES.osfiSwitch}">OSFI backgrounder, November 21, 2024</a>. Straight-switch conditions: no increase in loan amount or amortization.`,
        `<a href="${SOURCES.financeReforms}">Department of Finance Canada, September 16, 2024</a>. Insured price cap, 30-year amortizations, and the Mortgage Charter switch statement.`,
        `<a href="${SOURCES.fcacPenalty}">FCAC, mortgage prepayment penalties</a>. Penalty mechanics and the advice to shop at renewal.`,
        `<a href="${SOURCES.fcacPrepare}">FCAC, preparing to get a mortgage</a>. When the stress test applies to a refinance or a home-equity line.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Do I have to pass the stress test to renew my mortgage in 2026?",
      answer:
        "A plain renewal with your current lender is generally not re-tested. An uninsured straight switch to another federally regulated lender, with no increase in the loan and no longer amortization, has been outside OSFI's set minimum qualifying rate since November 21, 2024. Insured switches at renewal were already covered by the Mortgage Charter the Department of Finance described. Adding money or years brings the qualifying rate back.",
    },
    {
      question: "Should I blend-and-extend a 2021 rate before maturity?",
      answer:
        "Only after you price the months of cheap rate you would give up. The blend avoids a break fee and starts the new rate now. If your 2021 rate is well below today's rates, those remaining months are usually worth more than the penalty. A hold that starts on the maturity date is a different product. Ask which quote you were given.",
    },
    {
      question: "What is a straight switch?",
      answer:
        "The new lender pays out the current balance. You do not borrow extra, and the remaining amortization does not increase. That is the switch OSFI described for the stress-test exemption on uninsured mortgages at federally regulated lenders. Rolling consumer debt into the mortgage, capitalizing a penalty, or resetting the amortization to 30 years is a refinance, and the stress test applies.",
    },
    {
      question: "The bank's renewal letter is above rates people report. What do I do with that?",
      answer:
        "Treat the letter as an opening number. Put it through the renewal offer checker, get a second quote on the same term and insured status, and ask the bank to revise it. Reported medians are self-reported by Canadian borrowers online. They are unverified and they are not a rate you will be given. Compare the penalty and the prepayment before you leave over a small gap.",
    },
    {
      question: "Does the Bank of Canada decision on December 9, 2026 set my renewal rate?",
      answer:
        "It sets the overnight rate, which prime follows, which a variable mortgage follows. A fixed renewal is priced off funding costs and the bond market, so it can move before that meeting. The October 28, 2026 decision raised the target to 2.50%. Your contract is the rate the lender offers on the day you lock it.",
    },
  ],
};
