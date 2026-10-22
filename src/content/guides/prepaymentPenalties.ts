import type { InDepthGuide } from "./shared";
import {
  FCAC_PENALTY,
  GUIDE_REVIEWED_ISO,
  IRD_ILLUSTRATION as ird,
  SOURCES,
  cad,
  pct,
} from "./shared";
import { threeMonthInterestOnBalance } from "../../lib/mortgageMath";

const variableThreeMonths = threeMonthInterestOnBalance(400_000, 3.55);

export const prepaymentPenalties: InDepthGuide = {
  slug: "mortgage-prepayment-penalties",
  path: "/guides/mortgage-prepayment-penalties/",
  metaTitle: "How Mortgage Prepayment Penalties Work in Canada | Latest Mortgage Rates",
  description:
    "How Canadian lenders calculate a mortgage break fee: three months' interest versus the interest rate differential, the posted-rate method versus a discounted rate, and worked examples.",
  keywords:
    "mortgage prepayment penalty Canada, IRD, three months interest, posted rate penalty, Interest Act mortgage",
  cardTitle: "How prepayment penalties are calculated",
  cardDescription:
    "Three months' interest versus the IRD, the posted-rate method versus a discounted comparison rate, and the moves that shrink the bill.",
  h1: "How mortgage prepayment penalties are calculated in Canada",
  dek: "The fee for leaving a closed term early is usually the greater of three months' interest and an interest rate differential. Which version of the differential your contract uses is the difference between a painful number and a brutal one.",
  sourcesLine:
    "Sources: FCAC, the Interest Act, CMHC, and OSFI. Your mortgage contract's information box is the formula that will be charged.",
  reviewedIso: GUIDE_REVIEWED_ISO,
  howTo: {
    name: "How to estimate a Canadian mortgage prepayment penalty",
    description:
      "Read the contract method, estimate three months' interest and the IRD, then use a prepayment privilege only if the lender still allows it before a payout.",
    steps: [
      {
        name: "Read the information box",
        text: "Find the prepayment privilege and the penalty method. Federally regulated lenders must disclose both.",
      },
      {
        name: "Estimate three months' interest",
        text: "Multiply the outstanding balance by the contract rate and by 3/12. That is the simple estimate FCAC publishes. The lender's per-diem can differ.",
      },
      {
        name: "Estimate the IRD",
        text: "Ask which comparison rate the lender uses: a posted rate minus your original discount, or the lender's current rate for a similar remaining term.",
      },
      {
        name: "Pay the greater of the two, plus fees",
        text: "The penalty is usually the higher figure. An administration or discharge fee can sit on top. Confirm the payout quote in writing.",
      },
    ],
  },
  sections: [
    {
      id: "what",
      heading: "When a penalty shows up",
      paragraphs: [
        "A closed Canadian mortgage lets you pay it out early, and it charges for the privilege. <a href=\"" + SOURCES.fcacPenalty + "\">The Financial Consumer Agency of Canada</a> describes a prepayment penalty, also called a prepayment charge or a breakage cost, as the fee a lender may charge if you pay more than the privilege allows, break the contract, transfer the mortgage before the term ends, or pay the balance off early, including when you sell. An open mortgage is the exception: you can prepay without that fee, and you pay for the flexibility in the interest rate.",
        "At maturity the closed-term penalty is normally zero. That is why a renewal is the cheap time to leave, and why the <a href=\"/guides/2026-mortgage-renewal-playbook/\">2026 renewal playbook</a> spends its time on the rate rather than on a break fee. Mid-term, the fee can be thousands of dollars. FCAC says federally regulated lenders have to put the privilege and the penalty in an information box at the front of the agreement, and they have to explain the calculation in clear language. They also post a calculator. Use the lender's calculator for the quote, and use this page to see which method produced it.",
        "The penalty is usually the higher of an amount equal to three months' interest on what you still owe, and the interest rate differential (IRD). FCAC notes that lenders usually reach for the IRD when your contract rate is higher than current rates and the contract is less than five years old. If your rate is lower than current rates, the differential is zero or negative and the penalty falls back to three months' interest. A borrower still holding a discounted 2021 fixed rate is typically in that second group. A borrower who locked a high fixed rate in 2023 or 2024 and now wants a lower one is typically in the first group, which is where the posted-rate method does its damage.",
      ],
    },
    {
      id: "privilege",
      heading: "The privilege comes off the balance first",
      paragraphs: [
        "The prepayment privilege is the amount you may add, on top of the regular payment, without a penalty. FCAC says privileges vary. A common pattern is a lump-sum limit and a payment-increase limit, each expressed as a percentage of the original principal, often in the range lenders advertise as 10% or 20%. The contract is the source, not a category average. Most lenders will not let unused room carry into the next year. Some restrict a lump-sum prepayment when you are already on the way to a full payout. Ask before you send the money.",
        "The privilege matters because every penalty method multiplies by the balance. A smaller balance is a smaller fee. It also matters because a penalty quoted on the full balance, after you were entitled to prepay a slice for free, is a quote worth challenging.",
      ],
    },
    {
      id: "fcac",
      heading: "FCAC's own arithmetic",
      paragraphs: [
        `FCAC publishes a worked example, and the arithmetic is simple enough to redo. Outstanding balance ${cad(FCAC_PENALTY.balance)}. Contract rate ${pct(FCAC_PENALTY.rate, 0)}. Thirty-six months left on a five-year term. The lender's current posted rate for a 36-month term is ${pct(FCAC_PENALTY.comparison, 0)}. Three months' interest is ${cad(FCAC_PENALTY.balance)} × ${pct(FCAC_PENALTY.rate, 0)} × 3/12 = ${cad(FCAC_PENALTY.threeMonths)}. The IRD, as FCAC approximates it, is the rate gap times the balance times the years left: (${pct(FCAC_PENALTY.rate, 0)} − ${pct(FCAC_PENALTY.comparison, 0)}) × ${cad(FCAC_PENALTY.balance)} × 3 = ${cad(FCAC_PENALTY.ird)}. The penalty is the higher figure, ${cad(FCAC_PENALTY.ird)}, and an administration fee may be added.`,
        "That example uses the contract rate against a current posted rate. It does not claw back an original discount. Many big-bank contracts do claw it back. The next section is that method. Both estimates match the simple formulas in the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> on this site: three months of interest on the balance, not three monthly payments, and an IRD of (contract rate − comparison rate) × years left × balance. A lender that accrues interest on a per-diem, or that compounds semi-annually, will not match to the dollar. Get the payout statement.",
      ],
    },
    {
      id: "posted",
      heading: "The posted-rate method, with a worked example",
      paragraphs: [
        "Posted rates are the shelf prices on a bank's rate page. The rate in your contract is often a discount to the posted rate that was on the shelf the day you signed. The posted-rate IRD keeps that discount in the comparison. In outline: original discount = posted rate for your original term, on the day you signed, minus your contract rate. Comparison rate = today's posted rate for a term closest to the time you have left, minus that same original discount. IRD = (your contract rate − that comparison rate) × balance × years remaining. If the comparison rate is above your contract rate, this IRD is zero.",
        `Labelled illustration, not a live grid. Balance ${cad(ird.balance)}. Contract rate ${pct(ird.contract)}. Posted five-year rate on the day you signed ${pct(ird.originalPosted)}, so the original discount is ${pct(ird.discount)}. Thirty-six months left. Today's posted rate for a three-year term ${pct(ird.currentPosted)}. Comparison rate = ${pct(ird.currentPosted)} − ${pct(ird.discount)} = ${pct(ird.postedComparison)}. Gap = ${pct(ird.contract)} − ${pct(ird.postedComparison)} = ${pct(ird.contract - ird.postedComparison)}. IRD = ${cad(ird.balance)} × ${pct(ird.contract - ird.postedComparison)} × 3 years = ${cad(ird.postedIrd)}. Three months' interest = ${cad(ird.balance)} × ${pct(ird.contract)} × 3/12 = ${cad(ird.threeMonths)}. You pay ${cad(ird.postedIrd)}, the greater of the two.`,
        "The clawback is the reason the fee feels unrelated to the rate you actually pay. You borrowed at 5.49% in this illustration. The comparison rate used against you is 3.79%, not the 5.09% posted rate a new customer sees, and not the discounted rate a new customer would actually be offered. The original discount is subtracted a second time. FCAC describes this pattern directly: the second rate can be the current posted rate for a similar term, or that posted rate minus the discount you were originally offered. Read which of those two sentences is in your contract.",
      ],
    },
    {
      id: "fair",
      heading: "The discounted method on the same mortgage",
      paragraphs: [
        `The other method compares your contract rate with the rate the lender would charge today for a term matching the time left. People call the result a fair penalty. It is still an IRD. It simply refuses to re-charge the original discount. Using a labelled current discounted three-year rate of ${pct(ird.discountedComparison)} on the same ${cad(ird.balance)} mortgage: gap = ${pct(ird.contract)} − ${pct(ird.discountedComparison)} = ${pct(ird.contract - ird.discountedComparison)}. IRD = ${cad(ird.balance)} × ${pct(ird.contract - ird.discountedComparison)} × 3 = ${cad(ird.fairIrd)}. Three months' interest is still ${cad(ird.threeMonths)}, so the penalty is ${cad(ird.fairIrd)}.`,
        `Against the posted-rate result of ${cad(ird.postedIrd)}, the discounted method saves ${cad(ird.methodGap)} on this illustration. The rate, the balance, and the months left did not change. The comparison rate did. That is why two lenders can advertise rates a tenth of a point apart and still be different products. When you are choosing the next term, at renewal or at purchase, ask the question in writing: is the IRD measured against posted rates with the original discount removed, or against your current discounted rate for the remaining term? The <a href="/guides/banks-vs-monoline-lenders-vs-credit-unions/">comparison of banks, monolines, and credit unions</a> is about that contract term as much as it is about the rate on the sign.`,
        "Monoline lenders have a reputation for the discounted method, and big banks have a reputation for the posted method. Reputations are not your commitment. Some bank products, and some credit-union contracts, use a fairer comparison, and a broker-channel lender can still write a harsh one. The information box beats the category.",
      ],
    },
    {
      id: "variable",
      heading: "Variable rates, and the five-year rule in the Interest Act",
      paragraphs: [
        `A variable or adjustable mortgage usually has no IRD, because there is no fixed contract rate to compare with a replacement fixed rate. The typical charge is three months' interest. On a labelled ${cad(400_000)} balance at ${pct(3.55)}, three months' interest is ${cad(variableThreeMonths)}. The rounded 5-year variable median in the current reported-rate file is 3.55%, which is why that rate is used here. It is <a href="/real-mortgage-rates/">self-reported by Canadian borrowers online</a>, and your variable discount may be different. Read the contract. A handful of products still define a differential on a variable loan. The word "usually" is doing work in this paragraph.`,
        `There is a statutory backstop, and it is narrower than people hope. <a href="${SOURCES.interestAct}">Section 10 of the Interest Act</a> says that if principal or interest secured by a mortgage on real property, or a hypothec on immovables, is not payable until a time more than five years after the date of the mortgage, then any individual liable to pay may, after those five years, tender the principal and interest owing plus three months' further interest in lieu of notice, and no further interest is chargeable. The section does not apply to a mortgage given by a corporation. A five-year term never meets the "more than five years" test. A seven-year or ten-year term does, on the day after the fifth anniversary.`,
        `Apply that to the posted-rate illustration. The IRD was ${cad(ird.postedIrd)} and three months' interest was ${cad(ird.threeMonths)}. If that mortgage had an original term longer than five years, and an individual borrower paid it out after the fifth anniversary, the statute cuts the further interest down to three months. The ${cad(ird.postedIrd)} figure cannot be charged as further interest. Before the fifth anniversary, the contract penalty stands. This is one reason terms longer than five years are less common: the lender cannot keep an individual borrower in the rate past year five except for a three-month charge.`,
      ],
    },
    {
      id: "reduce",
      heading: "Ways to make the number smaller",
      paragraphs: [
        `Use the privilege before you break, if the lender still allows it. On the posted-rate illustration, a ${cad(ird.prepayment)} lump sum takes the balance from ${cad(ird.balance)} to ${cad(ird.prepaidBalance)}. The IRD falls from ${cad(ird.postedIrd)} to ${cad(ird.prepaidIrd)}, a reduction of ${cad(ird.irdSaved)}. Three months' interest falls from ${cad(ird.threeMonths)} to ${cad(ird.prepaidThreeMonths)}. The penalty is still the IRD. You paid down principal you owed anyway. You did not pay it twice. Confirm the lender will accept the lump sum when a payout is already booked. FCAC warns that some will not.`,
        "Wait for maturity when the IRD is large. The interest you save has to clear the penalty and the discharge fee. Use the <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a> and the <a href=\"/tools/refinance-calculator/\">refinance calculator</a>. If the pressure is an early renewal letter, read the <a href=\"/guides/2026-mortgage-renewal-playbook/\">renewal playbook</a> before you give up a cheap rate.",
        "Port the mortgage if the contract allows it. A larger loan is a separate slice at today's rate, and an insured increase can trigger a premium on that increase. <a href=\"" + SOURCES.cmhcPremiums + "\">CMHC's schedule</a> charges more on a portability increase than on a new insured loan at the same loan-to-value. A sale you cannot port means the penalty plus a new application, which may include the <a href=\"/guides/mortgage-stress-test/\">stress test</a>. A blend skips the IRD and starts a blended rate now. Price it against the penalty.",
        "Pick the method before you sign the next term. A slightly higher rate with a discounted IRD can beat a lower rate with a posted-rate IRD if you might sell. Posted shelves for <a href=\"/lenders/rbc/\">RBC</a>, <a href=\"/lenders/td/\">TD</a>, <a href=\"/lenders/bmo/\">BMO</a>, and <a href=\"/lenders/cibc/\">CIBC</a> are on this site. The penalty is on the commitment. Compare <a href=\"/rates/5-year-fixed/\">5-year fixed</a>, <a href=\"/rates/variable/\">variable</a>, <a href=\"/rates/insured/\">insured</a>, and <a href=\"/rates/uninsured/\">uninsured</a>.",
      ],
    },
    {
      id: "tools",
      heading: "Check the estimate, then get the payout",
      paragraphs: [
        "Use the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> for the simple three-month and IRD arithmetic, the <a href=\"/tools/mortgage-calculator/\">payment calculator</a> for the interest you hope to save, and the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> if the real question is the rate at maturity rather than a break today. Reported rates, which are self-reported by Canadian borrowers online, are on <a href=\"/real-mortgage-rates/\">real mortgage rates</a>. The <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> belongs in the file only when a break is tied to a new purchase with less than 20% down. The estimate on this page is not a payout quote. Ask the lender for the statement, and ask them to show which comparison rate they used.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "The formulas above follow FCAC's published approximation and section 10 of the Interest Act. Lender contracts add details this page cannot see.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.fcacPenalty}">FCAC, mortgage fees: prepayment penalties</a>. The definition, the greater-of test, the posted-versus-discounted description, the $200,000 example, and the tips on privileges, waiting, porting, and shopping.`,
        `<a href="${SOURCES.interestAct}">Interest Act, section 10</a>. Three months' interest after five years, when the original term is longer than five years, for an individual borrower.`,
        `<a href="${SOURCES.cmhcPremiums}">CMHC, mortgage loan insurance premiums</a>. The portability column charges the premium on the increase to the loan, and an amortization beyond 25 years carries a 0.20% surcharge.`,
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a>. A refinance that pays a penalty by adding it to the loan is new underwriting.`,
        `<a href="${SOURCES.fcacPrepare}">FCAC, preparing to get a mortgage</a>. Qualifying at the greater of 5.25% and the contract rate plus 2% when the stress test applies.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Is the penalty always the IRD?",
      answer:
        "No. FCAC describes the usual charge as the higher of three months' interest and the IRD. When your contract rate is below the comparison rate, the IRD is zero and you pay three months' interest. Variable contracts usually charge three months' interest and skip the IRD. After five years of a term that was longer than five years, section 10 of the Interest Act caps further interest at three months for an individual borrower.",
    },
    {
      question: "Why is a big-bank penalty so much larger than the rate gap I can see?",
      answer:
        "Many bank contracts calculate the IRD from posted rates and then subtract the discount you were given at the start. The comparison rate is lower than any rate the bank is actually offering a new customer. On the labelled illustration in this guide, that method produced a penalty $4,800 higher than a comparison with a discounted replacement rate, on the same balance and the same months left. Your contract decides which method applies.",
    },
    {
      question: "Can I prepay a lump sum and then break the mortgage?",
      answer:
        "Often, and only if the privilege is still open. FCAC says some lenders restrict prepayments when you are close to breaking the contract. A lump sum inside the privilege reduces the balance that the penalty multiplies. Unused privilege from last year is usually gone. Ask the lender to confirm the privilege and the payout figure on the same statement.",
    },
    {
      question: "Does the penalty calculator on this site replace the bank's quote?",
      answer:
        "It applies the simple formulas FCAC uses in its example: three months of interest on the balance, and an IRD from the rate gap, the balance, and the months left. A lender's per-diem, a posted-rate discount clawback, and an administration fee will change the number. Use the estimate to see the scale, then ask the lender for the payout.",
    },
    {
      question: "If I sell my house, can I avoid the penalty?",
      answer:
        "You can avoid it by porting the mortgage to the new house, if the contract allows a port and the timing works. You can also wait until the term ends, which is realistic only if the sale can wait. Otherwise the payout on closing includes the penalty. An insured port of a larger loan can still cost a premium on the increased amount. CMHC publishes that premium separately from the premium on a new loan.",
    },
  ],
};
