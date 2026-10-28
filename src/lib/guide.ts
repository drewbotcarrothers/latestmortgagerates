/** Paid Mortgage Guide + Renewal Toolkit. Variant A: Andrew confirmed the 2026 core PDF. */

export const GUIDE_VARIANT = "A" as const;

export const GUIDE_BUY_BASE = "https://buy.stripe.com/7sY4gz8ZtbAqg2s8nw9oc00";
export const GUIDE_CAMPAIGN = "mortgage_guide";
export const GUIDE_PRICE_LABEL = "$29 CAD";

export const SALES_TITLE =
  "Mortgage Guide + Renewal Toolkit: Scripts, Worksheets, Checklist | $29 CAD";
export const SALES_DESCRIPTION =
  "Word-for-word negotiation scripts, 8 printable worksheets, a 180-day renewal checklist and a 50-page Renewal Playbook. For Canadian homeowners renewing or switching. $29 CAD, instant PDF download, 30-day refund.";
export const SALES_OG_TITLE = "The Mortgage Guide + Renewal Toolkit ($29 CAD)";

export const SALES_EYEBROW = "THE PAID GUIDE · BY ANDREW · UPDATED OCTOBER 2026";
export const SALES_H1 = "Walk into your renewal with the script, the numbers and a plan";
export const SALES_SUBHEAD =
  "Our free guides explain how mortgage negotiation works. This $29 toolkit helps you actually do it: word-for-word phone and email scripts, 8 printable worksheets, a 180-day checklist and a 50-page Renewal Playbook for Canadian homeowners.";
export const SALES_PRIMARY_CTA = "Get the Guide + Toolkit — $29 CAD";
export const SALES_MICROCOPY =
  "Instant PDF download · 30-day full refund · 12 months of free updates · Secure checkout by Stripe";
export const SALES_ONLY_HEADING = "What you only get when you buy";
export const SALES_INSIDE_HEADING = "6 files, instant download";
export const SALES_INSIDE_CTA = "Download all 6 files — $29 CAD";
export const SALES_MID_CTA = "Get the scripts and worksheets — $29 CAD";
export const SALES_FINAL_H2 = "Your renewal letter is an opening offer. Show up ready.";
export const SALES_FINAL_MICRO = "Instant download · 30-day refund · Educational, not financial advice";

export const SCRIPT_1_PREVIEW =
  "Hi, my name is [name]. My mortgage, number [number], matures on [date]. I'd like to talk about renewing. Before I decide, I want to make sure I'm getting your best available rate, not the rate on the renewal letter…";

/** One line only. Free pages may quote this. They do not get the rest of Script 1. */
export const SCRIPT_TEASER_LINE =
  "Before I decide, I want to make sure I'm getting your best available rate, not the rate on the renewal letter.";

export const CORE_GUIDE_TITLE =
  "The Guide to Getting the Best Deal on Your Next Mortgage (2026 Edition)";

export const CORE_CHAPTERS = [
  "The Hidden Mortgage Market: why the posted rate isn't the rate you should pay",
  "Timing: Bank of Canada decisions, bond yields and when rates move",
  "The Negotiation Playbook: how to ask banks and brokers for a better rate",
  "Fixed vs Variable: the real math",
  "Shopping Strategies: getting several quotes without hurting your credit",
  "First-Time Buyer Programs: FHSA, the Home Buyers' Plan and rebates",
  "Renewal: don't let your bank auto-renew you",
  "The Fine Print: prepayments, porting and penalties",
  "Reading the Rate Outlook: what forecasts can and can't tell you",
  "Your Action Plan: a step-by-step checklist from shopping to closing",
] as const;

export interface InsideFile {
  title: string;
  note: string;
  body?: string;
  chapters?: readonly string[];
}

export const WHATS_INSIDE: InsideFile[] = [
  {
    title: CORE_GUIDE_TITLE,
    note: "Core guide",
    chapters: CORE_CHAPTERS,
  },
  {
    title: "Negotiation Script Pack",
    note: "3 pages",
    body: "7 scripts, 4 objection replies, rate-gap table, a \"before you hang up\" checklist.",
  },
  {
    title: "Printable Worksheet Pack",
    note: "9 pages",
    body: "8 worksheets: snapshot, timeline, quote comparison, negotiation log, fixed vs variable scorecard, penalty estimator, payment-shock planner and documents.",
  },
  {
    title: "Mortgage Renewal Checklist",
    note: "2 pages",
    body: "The 180-day plan, key dates, documents, 8 lender questions, key rules (October 2026) and common mistakes.",
  },
  {
    title: "The Mortgage Renewal Playbook 2027",
    note: "Bonus ebook · 50 pages",
    body: "A 50-page bonus ebook with 3 worked scenarios ($300k, $500k, $700k) and sourced endnotes.",
  },
  {
    title: "Start Here",
    note: "1 page",
    body: "The 60-minute fastest path through everything.",
  },
];

export const THANK_YOU_H1 = "You're in. Download your files.";
export const THANK_YOU_FOLDER_BUTTON = "Open your files";
export const THANK_YOU_BUTTON = "Download all files";
export const THANK_YOU_PENDING =
  "Your download link is on its way by email. If it hasn't arrived within 24 hours, email contact@latestmortgagerates.ca.";
export const THANK_YOU_NOTE =
  "Bookmark this page. Updates for 12 months: email us from your purchase address. Refunds within 30 days: contact@latestmortgagerates.ca.";

/** File names on the download page. Variant A keeps 01 The Guide. */
export const THANK_YOU_FILES = [
  "00 Start Here",
  "01 The Guide",
  "02 Renewal Checklist",
  "03 Negotiation Script Pack",
  "04 Worksheet Pack",
  "05 Bonus: Mortgage Renewal Playbook 2027",
] as const;

export const PAID_COMPARE_ROWS: { free: string; paid: string }[] = [
  {
    free: "How renewals, switching and penalties work",
    paid: "7 word-for-word scripts to read on the call or paste into email",
  },
  {
    free: "A 5-step renewal conversation outline",
    paid: "4 objection replies for when the lender pushes back",
  },
  {
    free: "Calculators for your own numbers",
    paid: "Rate-gap table showing what 0.10% to 0.50% is worth over 5 years",
  },
  {
    free: "Rate tables and reported medians",
    paid: "8 printable worksheets: snapshot, timeline, quote comparison, negotiation log, fixed vs variable scorecard, penalty estimator, payment-shock planner, documents",
  },
  {
    free: "One-page explainers",
    paid: "2-page Renewal Checklist with your key dates, documents and lender questions",
  },
  {
    free: "",
    paid: "The Mortgage Renewal Playbook 2027, a 50-page bonus ebook with 3 worked scenarios ($300k, $500k, $700k) and sourced endnotes",
  },
];

export const GUIDE_AUDIENCES = [
  {
    title: "Renewing in the next 6 to 12 months.",
    body: "Your 2021 or 2022 rate is ending and the renewal letter looks high.",
  },
  {
    title: "Thinking about switching lenders.",
    body: "You want a straight-switch quote and to know what it costs, without triggering a new stress test.",
  },
  {
    title: "Buying or refinancing.",
    body: "You want to compare offers on more than the rate: penalties, prepayments, portability and fees.",
  },
] as const;

export const GUIDE_BENEFITS = [
  {
    title: "Say the right thing on the call.",
    body: "7 word-for-word scripts for your current lender, a broker or another lender, by phone or email.",
  },
  {
    title: "Answer the pushback.",
    body: "Ready replies to \"that's our best rate\", \"sign today\" and \"switching is a hassle\".",
  },
  {
    title: "Know what a rate gap is worth in dollars.",
    body: "A table for $300k, $500k and $700k balances.",
    illustration: "on $500,000, a 0.25% gap is about $6,000 of extra interest over five years.",
  },
  {
    title: "Compare the whole offer, not just the rate.",
    body: "A 3-quote comparison worksheet covering rate holds, prepayments, penalty method, portability, charge type and fees.",
  },
  {
    title: "Estimate a penalty before you sign.",
    body: "A step-by-step IRD and three-months'-interest estimator.",
  },
  {
    title: "Never miss a date.",
    body: "A 180-day timeline and checklist, from snapshot to signing day.",
  },
  {
    title: "Plan for payment shock.",
    body: "Six options side by side (lump sum, amortization, term, refinance, HELOC, asking for relief).",
  },
] as const;

export const GUIDE_TRUST = [
  {
    title: "30-day full refund.",
    body: "If it doesn't help, email contact@latestmortgagerates.ca within 30 days and you'll get your money back.",
  },
  {
    title: "12 months of updates.",
    body: "Rules and examples get refreshed. Email from your purchase address for the latest edition.",
  },
  {
    title: "Sourced.",
    body: "Rules checked against OSFI, the Department of Finance, FCAC and the Bank of Canada (October 2026), with endnotes.",
  },
  {
    title: "Independent.",
    body: "Written by Andrew at Latest Mortgage Rates. We don't sell mortgages, and this isn't a lender offer.",
  },
  {
    title: "Secure checkout by Stripe.",
    body: "No account needed.",
  },
] as const;

export const SALES_FAQS: { question: string; answer: string }[] = [
  {
    question: "How is this different from the free guides on this site?",
    answer:
      "The free guides explain how things work, and they'll stay free. The paid guide is the toolkit for doing it: word-for-word scripts, objection replies, 8 printable worksheets, a 2-page checklist, a rate-gap dollar table and a 50-page Renewal Playbook with worked scenarios. None of those are published on the site.",
  },
  {
    question: "I'm renewing soon. Is it too late?",
    answer:
      "No. The checklist starts at 180 days, but if you have a few weeks left, start with Worksheet 1, Script 5 (get a competing quote) and Script 2 (counter-offer). Federally regulated lenders must send your renewal statement at least 21 days before maturity.",
  },
  {
    question: "Will negotiating actually lower my rate?",
    answer:
      "It might not. Many borrowers report getting a better rate after asking, especially with a written competing offer, but that's anecdote, not a guarantee. Your result depends on your lender, equity, credit and the day you lock. If it doesn't help, the 30-day refund applies.",
  },
  {
    question: "How much could a better rate be worth?",
    answer:
      "It depends on your balance and term. As an illustration, on a $500,000 balance over a 25-year amortization, a 0.25% lower rate is about $69 a month, or about $6,000 less interest over five years. The guide includes the full table and a rule of thumb for your own balance.",
  },
  {
    question: "Is this for first-time buyers?",
    answer:
      "Partly. The comparison worksheets, penalty estimator and scripts work for any purchase or refinance. The core guide covers first-time buyer programs. The bonus playbook is written for renewals and switches.",
  },
  {
    question: "Does switching lenders mean passing the stress test again?",
    answer:
      "Not for a straight switch (same balance, same or shorter amortization) under the OSFI and federal insured-mortgage rules in effect since late 2024. The new lender still reviews your application. Adding money or years makes it a refinance. Chapter 5 of the playbook covers this with sources.",
  },
  {
    question: "What format is it, and how do I get it?",
    answer:
      "PDFs that work on a phone, tablet or computer, and print on letter paper. After checkout you're taken straight to your download page. Bookmark it. If you lose it, email us from your purchase address.",
  },
  {
    question: "Is there a refund policy?",
    answer: "Yes. Email contact@latestmortgagerates.ca within 30 days of purchase for a full refund.",
  },
  {
    question: "How current is it?",
    answer: "Rules are as of October 2026. Your purchase includes free updated editions for 12 months.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. It's educational. Rates in the guide are examples, not offers. Confirm details with your lender, a licensed mortgage professional or a lawyer.",
  },
];

export type GuideContext = "renewal" | "penalty" | "switch" | "buyer";

export const GUIDE_CONTEXTS: Record<GuideContext, { heading: string; body: string }> = {
  renewal: {
    heading: "Your renewal letter is an opening offer",
    body: "Get the 180-day checklist, 7 scripts and the 50-page Renewal Playbook.",
  },
  penalty: {
    heading: "Get the penalty in writing first",
    body: "Script 6 and the Penalty Estimator worksheet help you check your lender's number.",
  },
  switch: {
    heading: "Ask for a straight-switch quote",
    body: "Script 5 gets a written quote without new money or a longer amortization.",
  },
  buyer: {
    heading: "Compare offers on more than the rate",
    body: "A 3-quote worksheet covering penalties, prepayments, portability and fees.",
  },
};

export const GUIDE_FULL_HEADING = "Get the scripts, worksheets and checklist";
export const GUIDE_FULL_BODY =
  "Our free guides explain it. The $29 toolkit helps you do it: 7 word-for-word negotiation scripts, 8 printable worksheets, a 180-day renewal checklist and a 50-page Renewal Playbook.";
export const GUIDE_BUY_LABEL_FULL = "Buy the Toolkit — $29 CAD";
export const GUIDE_BUY_LABEL_COMPACT = "Get the Toolkit — $29";
export const GUIDE_MICROCOPY = "Instant PDF · 30-day refund";

export const GUIDE_CONTEXT_BY_SLUG: Record<string, GuideContext> = {
  "2026-mortgage-renewal-playbook": "renewal",
  "2027-mortgage-renewal-wave": "renewal",
  "switching-mortgage-lenders-at-renewal": "switch",
  "mortgage-stress-test": "switch",
  "mortgage-prepayment-penalties": "penalty",
  "blend-and-extend-mortgage": "penalty",
  "first-time-home-buyer-programs-canada": "buyer",
  "closing-costs-canada-by-province": "buyer",
  "cmhc-mortgage-insurance-canada": "buyer",
};

/** Free guides that may quote the one-line opener. Not the full scripts. */
export const GUIDE_TEASER_SLUGS = [
  "2026-mortgage-renewal-playbook",
  "negotiate-mortgage-rate",
  "switching-mortgage-lenders-at-renewal",
  "mortgage-prepayment-penalties",
  "blend-and-extend-mortgage",
] as const;

export function guideContextForSlug(slug: string): GuideContext | undefined {
  return GUIDE_CONTEXT_BY_SLUG[slug];
}

export function guideHasInlineTeaser(slug: string): boolean {
  return (GUIDE_TEASER_SLUGS as readonly string[]).includes(slug);
}

export function buildGuideBuyUrl({
  source = "site",
  medium,
  content,
}: {
  source?: string;
  medium: string;
  content: string;
}): string {
  const url = new URL(GUIDE_BUY_BASE);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", medium);
  url.searchParams.set("utm_campaign", GUIDE_CAMPAIGN);
  url.searchParams.set("utm_content", content);
  return url.toString();
}

export function buildGuidePageUrl({
  source = "site",
  medium,
  content,
}: {
  source?: string;
  medium: string;
  content: string;
}): string {
  const params = new URLSearchParams();
  params.set("utm_source", source);
  params.set("utm_medium", medium);
  params.set("utm_campaign", GUIDE_CAMPAIGN);
  params.set("utm_content", content);
  return `/mortgage-guide/?${params.toString()}`;
}
