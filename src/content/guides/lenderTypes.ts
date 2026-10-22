import type { InDepthGuide } from "./shared";
import {
  GUIDE_REVIEWED_ISO,
  IRD_ILLUSTRATION as ird,
  LENDER_RATE_GAP as gap,
  SOURCES,
  REPORTED,
  cad,
  pct,
} from "./shared";

export const lenderTypes: InDepthGuide = {
  slug: "banks-vs-monoline-lenders-vs-credit-unions",
  path: "/guides/banks-vs-monoline-lenders-vs-credit-unions/",
  metaTitle: "Big Banks vs Monoline Lenders vs Credit Unions | Mortgage Guide",
  description:
    "How Canada's big banks, monoline mortgage lenders, and credit unions differ on rates, penalties, portability, service, and regulation. Deposit insurance does not cover the mortgage.",
  keywords:
    "big banks vs monoline mortgage Canada, credit union mortgage, mortgage penalty comparison, CDIC mortgage",
  cardTitle: "Big banks, monolines, and credit unions",
  cardDescription:
    "Rates, penalties, portability, service, and who actually regulates the lender. Deposit insurance is about savings, not the loan.",
  h1: "Big banks, monoline lenders, and credit unions",
  dek: "The logo on the offer changes the rate, the break fee, the registration, and the regulator. It does not change the fact that a mortgage is a debt you owe. Deposit insurance does not pay it off if a lender fails.",
  sourcesLine:
    "Sources: OSFI, FCAC, CDIC, CMHC, and the Department of Finance. The commitment names your lender and the penalty. The category is a starting point.",
  reviewedIso: GUIDE_REVIEWED_ISO,
  sections: [
    {
      id: "three",
      heading: "Three ways a Canadian mortgage gets funded",
      paragraphs: [
        "A big bank is a federally regulated deposit-taker under the Bank Act. You can walk into a branch, keep your chequing account in the same place, and attach a line of credit to the house. RBC, TD, BMO, Scotiabank, CIBC, and National Bank are the group people mean. Posted rates from the ones we track sit on the <a href=\"/lenders/rbc/\">RBC</a>, <a href=\"/lenders/td/\">TD</a>, <a href=\"/lenders/bmo/\">BMO</a>, and <a href=\"/lenders/cibc/\">CIBC</a> pages, and on the <a href=\"/\">rate comparison</a>.",
        "A monoline lender's business is the mortgage. There is often no branch, and the application often arrives through a mortgage broker. Funding can come from a bank line, from investors, or from the sale of the mortgage into securities backed by the loan, including National Housing Act mortgage-backed securities when the loan is insured. The name on the commitment might be a trust company, a loan company, or a lender you have never banked with. Service is a phone number, a portal, and the broker who placed the deal. The rate is often the reason the file landed there.",
        "A credit union is a member-owned cooperative. Most are regulated by a province and limited to that province's membership rules. Vancity and Meridian are examples with pages on this site: <a href=\"/lenders/vancity/\">Vancity</a> and <a href=\"/lenders/meridian/\">Meridian</a>. A federal credit union is a different creature. It continues under federal law, can operate more broadly, and its eligible deposits are insured by CDIC. A provincial credit union's deposits are insured by that province's plan. ATB Financial, which also appears in our tables, is an Alberta bank, not a credit union. The category on the sign and the regulator in the fine print are not always the same.",
        "None of these categories is a recommendation. The same borrower can be offered three contracts in a week. The comparison that matters is the contract: rate, term, privilege, penalty method, portability, and how the mortgage is registered.",
      ],
    },
    {
      id: "rates",
      heading: "Rates, posted and reported",
      paragraphs: [
        "Big banks publish a posted rate and then discount it. The discount is not a secret, and it is not automatic. It shows up when you ask, and it shows up faster at renewal if you have another quote. Monoline offers are often already close to the bottom of the posted comparison, because there is no branch shelf to defend. Credit unions sit in both worlds: some publish a competitive special, some match a bank when a member asks, and the special may be limited to a city or a membership class.",
        `In the reported-rate file dated ${REPORTED.asOf}, the rounded 30-day median 5-year fixed rate, insured status not stated, is ${REPORTED.fixedMedian} (N = ${REPORTED.fixedN}), against a Big Five posted median of ${REPORTED.fixedBig5}. The rounded 5-year variable median is ${REPORTED.variableMedian} (N = ${REPORTED.variableN}). These figures are self-reported by Canadian borrowers online. ${REPORTED.disclaimer} The distribution is on <a href="/real-mortgage-rates/">real mortgage rates</a>.`,
        `On a labelled ${cad(gap.balance)} mortgage amortized over ${gap.years} years, ${pct(gap.low)} costs ${cad(gap.lowPayment)} a month and ${pct(gap.high)} costs ${cad(gap.highPayment)}. The gap is ${cad(gap.paymentGap)} a month, about ${cad(gap.interestGap)} of extra interest over five years, using the <a href="/tools/mortgage-calculator/">payment formula</a> on this site. The <a href="/guides/mortgage-prepayment-penalties/">penalty guide</a> shows a posted-rate IRD of ${cad(ird.postedIrd)} against a discounted IRD of ${cad(ird.fairIrd)} on the same balance. One break fee can erase years of a ${pct(gap.high - gap.low, 2)} advantage.`,
        "Insured rates are often lower than uninsured rates because the lender is protected. The premium that bought the protection is your cost, added to the balance. Compare the two shelves on the <a href=\"/rates/insured/\">insured</a> and <a href=\"/rates/uninsured/\">uninsured</a> pages, and the term shelves on <a href=\"/rates/5-year-fixed/\">5-year fixed</a> and <a href=\"/rates/variable/\">variable</a>. A broker quoting a monoline and a bank quoting its own special are not quoting the same product until the term, the insured status, the privilege, and the penalty match.",
      ],
    },
    {
      id: "penalty",
      heading: "Penalties and prepayments",
      paragraphs: [
        "The usual closed-mortgage penalty in Canada is the greater of three months' interest and an interest rate differential. <a href=\"" + SOURCES.fcacPenalty + "\">FCAC</a> describes both, including the version that subtracts your original discount from today's posted rate. That posted-rate method is common in big-bank contracts. It is the reason a bank penalty can dwarf the rate gap you thought you were paying. A discounted, or fair, IRD compares your rate with the lender's current rate for a similar remaining term. That method is more common at monolines and at many credit unions. It is still a contract term, not a law of the category. Ask, and read the information box.",
        "Prepayment privileges are the other half of the same clause. Banks often write 10% or 20% of the original principal as an annual lump sum, sometimes with a matching increase to the regular payment. Monoline and credit-union privileges are all over the map, including products that allow more. FCAC's point, which holds everywhere, is that unused room usually does not carry into the next year, and that a privilege used before a payout shrinks the balance the penalty multiplies. A 20% privilege on a mortgage you will not touch is worth less than a fair IRD on a mortgage you might have to break.",
        "Variable-rate contracts, whoever the lender is, usually charge three months' interest and skip the IRD. Fixed contracts are where the method splits. <a href=\"" + SOURCES.interestAct + "\">Section 10 of the Interest Act</a> caps further interest at three months after five years when the original term was longer than five years, for an individual rather than a corporation. That cap applies to the mortgage, not to the logo. A ten-year fixed from a bank and a ten-year fixed from a monoline both meet it on the day after the fifth anniversary.",
      ],
    },
    {
      id: "port",
      heading: "Portability, collateral charges, and switching",
      paragraphs: [
        "Portability is the right, if the contract gives it, to take the rate and the remaining term to a new house. Banks usually offer it, with conditions on timing and on the new property. The increase, if the new house costs more, is a separate slice at the current rate. Monoline portability exists and is less uniform. Some products are explicitly not portable, which is acceptable only if you know you will not move. Credit-union ports can be limited by the membership geography. If the credit union does not lend on the new property because it is in another province, the port is a dead end and the penalty is back.",
        "Registration is the quiet difference. A standard charge secures that mortgage. It can often be assigned to a new lender. A collateral charge secures a relationship. Banks use it so a line of credit can sit behind the same registration, often for more than you borrowed. Switching a collateral charge usually means a lawyer, a discharge, and a new registration. The new lender sometimes pays that cost on a switch at maturity and does not pay it mid-term. Ask which charge you have before you compare a monoline's rate with your bank's, and ask again before you accept a line of credit you do not need. The line is useful. The charge is what makes the next switch slower.",
        "At maturity, a straight switch is the clean comparison. The new lender pays out the balance, you do not borrow more, and the amortization does not grow. Since November 21, 2024, <a href=\"" + SOURCES.osfiMqr + "\">OSFI</a> does not require the set stress-test rate for that switch between federally regulated lenders. Insured switches were already outside a fresh stress test, which the <a href=\"" + SOURCES.financeReforms + "\">Department of Finance</a> restated through the Canadian Mortgage Charter. A credit union is not an OSFI lender unless it is a federal credit union. Ask a provincial credit union whether a switch onto its book is qualified at the contract rate or at a buffer. The <a href=\"/guides/2026-mortgage-renewal-playbook/\">renewal playbook</a> and the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> are the tools for the rate. The <a href=\"/tools/mortgage-renewal-calculator/\">renewal calculator</a> is the tool for the costs of leaving.",
      ],
    },
    {
      id: "service",
      heading: "Service, and who you call when something breaks",
      paragraphs: [
        "A bank branch is a real convenience when you want a bank draft, a payment changed, or a person who can see the mortgage and the chequing account on one screen. It is a weak convenience when the renewal offer is mediocre and the penalty clause is harsh. The person in the branch may not be the person who can move the rate. Retention groups often can. A broker placing a monoline deal is paid to shop, and after funding the broker may not be the servicer. Find out who receives the payments, who issues the tax slip, and who produces a payout statement. Those are different desks.",
        "Credit unions are membership organizations, sometimes limited to a region. If you move provinces, a provincial credit union can be a lender you cannot port. Monoline servicing is the loan, not the rest of your banking. If the servicing is sold, you still owe the same contract. The letter that changes the payment address is not a new application and not a chance to reprice you mid-term.",
      ],
    },
    {
      id: "regulation",
      heading: "Regulation, and why deposit insurance is the wrong comfort",
      paragraphs: [
        "OSFI supervises federally regulated lenders, including the big banks and federal credit unions, and it writes Guideline B-20. That guideline is why those lenders qualify an uninsured borrower at the minimum qualifying rate described in the <a href=\"/guides/mortgage-stress-test/\">stress test guide</a>. A provincially regulated credit union answers to a provincial regulator. It is not bound by B-20. An insured mortgage is bound by the insurer's rules whichever logo is on the letter, and CMHC's qualifying rate is the greater of the contract rate plus 2 points or 5.25%. A monoline that is itself a federal trust or loan company is inside OSFI's perimeter. A lender that only originates and sells the loan may be outside it, while the insurer's rules still apply if the mortgage is insured. The commitment tells you the legal name. That name, not the advertising brand, is what you look up.",
        "Deposit insurance is the point people import from savings accounts, and it does not do the job they want. <a href=\"" + SOURCES.cdic + "\">CDIC</a> insures eligible deposits at a member institution, up to $100,000 per category, including chequing, savings, and GICs. An FHSA deposit can be its own category. A mortgage is not a deposit. CDIC's covered list is money the institution owes you. The mortgage is money you owe the institution. If a bank failed, deposit insurance would speak to your savings. It would not forgive, pay down, or guarantee the terms of your mortgage. The loan is an asset. A buyer or a receiver keeps collecting it.",
        "<a href=\"" + SOURCES.fcacDeposit + "\">FCAC</a> says provincial plans cover deposits at provincially regulated credit unions and caisses populaires, and that the limits differ. Ontario's FSRA, for example, covers eligible non-registered deposits up to $250,000 and does not cap eligible registered deposits. Those plans insure deposits. Default insurance from CMHC, Sagen, or Canada Guaranty protects the lender. You pay the premium. Choose the lender for the rate, the penalty, the port, the registration, and the service. A deposit-insurance logo does not make the mortgage safer. Use <a href=\"/real-mortgage-rates/\">real mortgage rates</a> as a benchmark and the <a href=\"/tools/cmhc-insurance-calculator/\">CMHC insurance calculator</a> only when the down payment is under 20%. The <a href=\"/disclaimer/\">disclaimer</a> applies.",
      ],
    },
    {
      id: "choose",
      heading: "A way to decide",
      paragraphs: [
        "Line the offers up: legal name, rate, term, insured status, privilege, penalty method, portable or not, standard or collateral charge, switch fees, and who services the loan. One revised bank offer, one other bank, one monoline, and a credit union if you can join. Drop any row that fails a constraint you already have, such as a move to another province.",
        "Then look at money. The payment gap is the <a href=\"/tools/mortgage-calculator/\">mortgage calculator</a>. The break fee, if you are not at maturity, is the <a href=\"/tools/mortgage-penalty-calculator/\">penalty calculator</a> plus the lender's payout. The qualifying question, if you are adding money, is the <a href=\"/tools/stress-test-qualifier/\">stress test qualifier</a>. A renewal that is a straight switch skips that qualifier at a federally regulated lender and still has to survive the credit review. If two rows are close, prefer the one whose penalty you understand. You will live with the rate for the term. You will meet the penalty only if you leave, and that is when the contract shows its teeth.",
      ],
    },
    {
      id: "sources",
      heading: "Sources",
      paragraphs: [
        "Category descriptions are a map. The contract and the regulator's page are the territory.",
      ],
      listAfter: 0,
      items: [
        `<a href="${SOURCES.osfiMqr}">OSFI, minimum qualifying rate</a> and the <a href="${SOURCES.osfiSwitch}">November 21, 2024 backgrounder</a>.`,
        `<a href="${SOURCES.fcacPenalty}">FCAC, prepayment penalties</a> and <a href="${SOURCES.fcacPrepare}">preparing to get a mortgage</a>.`,
        `<a href="${SOURCES.fcacDeposit}">FCAC, deposit insurance</a> and <a href="${SOURCES.cdic}">CDIC, what's covered</a>. Deposits, not mortgages.`,
        `<a href="${SOURCES.cmhcQualify}">CMHC, homeowner insurance requirements</a>.`,
        `<a href="${SOURCES.financeReforms}">Department of Finance Canada, September 16, 2024</a>.`,
        `<a href="${SOURCES.interestAct}">Interest Act, section 10</a>.`,
        `<a href="${SOURCES.boc}">Bank of Canada, September 2, 2026</a>. Overnight rate 2.25%.`,
      ],
    },
  ],
  faqs: [
    {
      question: "Are monoline mortgage rates always lower than the bank?",
      answer:
        "Often the first quote is lower, because a monoline is not defending a posted shelf. A bank retention offer, especially at renewal, can match it. Compare the written rates on the same day, with the same term and the same insured status. Then compare the penalty method. A lower rate with a posted-rate IRD can cost more if you break the term.",
    },
    {
      question: "Does CDIC insure my mortgage?",
      answer:
        "No. CDIC insures eligible deposits, such as chequing accounts, savings, and GICs, up to $100,000 per category at a member institution. A mortgage is a loan you owe. Deposit insurance does not pay it down and does not guarantee the rate. Provincial credit-union deposit plans work the same way: they cover deposits, within that province's limits, and they do not cover the mortgage. Default insurance protects the lender, and you pay the premium.",
    },
    {
      question: "Do credit unions have to use the federal stress test?",
      answer:
        "OSFI's minimum qualifying rate binds federally regulated lenders. A provincially regulated credit union follows its provincial regulator and its own policy. Many use a similar buffer. An insured mortgage, anywhere, still has to meet the insurer's qualifying rate. A federal credit union is inside OSFI's perimeter. Ask the lender which rate they will use on your file, in writing.",
    },
    {
      question: "What is a collateral mortgage, and why does it matter?",
      answer:
        "A collateral charge can secure the mortgage and a line of credit under one registration, often for more than the amount you borrowed. It is common at big banks. Switching it to a new lender usually needs a lawyer to discharge it and register a new charge. A standard charge is often assignable. The registration, not the interest rate, decides how heavy a switch will be.",
    },
    {
      question: "If my monoline lender fails or sells my mortgage, what happens to the loan?",
      answer:
        "You still owe it. Mortgage loans are assets and they get sold or serviced by someone else. The terms of your contract travel with the loan. Watch for a letter that changes the payment address. That sale is not a renewal and it is not a new stress test. Deposit insurance is not the safety net for this event, because the mortgage was never a deposit.",
    },
  ],
};
