import {
  AUTHOR_ABOUT_ITEMS,
  AUTHOR_ABOUT_LIST_AFTER,
  AUTHOR_ABOUT_PARAGRAPHS,
} from "../lib/author";

export interface EditorialTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface EditorialSection {
  id?: string;
  heading: string;
  paragraphs: string[];
  /** Bulleted HTML items, rendered after this paragraph index. */
  listAfter?: number;
  items?: string[];
  table?: EditorialTable;
}

export function editorialWordCount(sections: EditorialSection[]): number {
  const text = sections
    .flatMap((section) => [
      section.heading,
      ...section.paragraphs,
      ...(section.items ?? []),
      section.table?.caption ?? "",
      ...(section.table?.headers ?? []),
      ...(section.table?.rows.flat() ?? []),
    ])
    .join(" ")
    .replace(/<[^>]+>/g, " ");
  return text.split(/\s+/).filter(Boolean).length;
}

export const authorAboutSection: EditorialSection = {
  id: "who",
  heading: "About Andrew",
  paragraphs: [...AUTHOR_ABOUT_PARAGRAPHS],
  listAfter: AUTHOR_ABOUT_LIST_AFTER,
  items: [...AUTHOR_ABOUT_ITEMS],
};

export const aboutSections: EditorialSection[] = [
  {
    ...authorAboutSection,
    paragraphs: [
      ...AUTHOR_ABOUT_PARAGRAPHS,
      "The public byline on every article and guide is Andrew. The list of articles is on the <a href=\"/author/andrew/\">author page</a>. This is an independent publishing project. It is not a bank, a mortgage brokerage, or a lender, and it does not take applications or negotiate a rate on your behalf.",
    ],
  },
  {
    id: "why",
    heading: "Why the site exists",
    paragraphs: [
      "Canadian mortgage rates are public, and they are still hard to compare. Each bank, credit union, and monoline posts its own grid. The number on a billboard is often the posted rate, which is higher than the rate a qualified borrower is offered. Insured and uninsured columns sit beside each other and are easy to mix up. A renewal letter, a broker’s email, and a bank’s special can all be called “the rate” and still not be the same product. The site exists so you can see the public postings side by side, then read what the labels mean before you call anyone.",
      "The tables are a research aid. They are not a rate offer, a pre-approval, or a recommendation to pick one lender. A figure can be stale by the afternoon if a lender edits a page, and it never includes the fees, the penalty method, or the conditions on your file. Read the <a href=\"/disclaimer/\">disclaimer</a> before you treat a number as something you can sign. The calculators are the same kind of aid: they show the math with the assumptions written down, and the lender’s disclosure is the payment you will actually agree to.",
      "A second job of the site is to separate two kinds of numbers that people blur together. One kind is the rate a lender publishes. The other is the rate a borrower says they received, which is often below that published rate. Putting both on one site, clearly labeled, is the reason the real-mortgage-rates pages exist next to the posted tables. Neither set is a promise that you will be offered the same figure tomorrow.",
    ],
  },
  {
    id: "posted",
    heading: "How posted rates are collected",
    paragraphs: [
      "Posted rates are collected from lender websites. They are not taken from a broker’s rate sheet and they are not taken from a borrower. A scheduled job reads the public rate pages we track, pulls the fixed and variable rows those pages show, and writes them into the snapshot the site is built from. Collection runs daily. Each row keeps the lender, the term, whether the rate is fixed or variable, the rate itself, and insured or uninsured when the source page says so. If the source page does not say, the row stays unlabelled rather than guessed.",
      "The homepage, the lender pages, and the rate hubs for <a href=\"/rates/5-year-fixed/\">5-year fixed</a>, <a href=\"/rates/variable/\">variable</a>, <a href=\"/rates/insured/\">insured</a>, and <a href=\"/rates/uninsured/\">uninsured</a> products read that same snapshot. Order in a table follows the rates in the snapshot, lowest first. A lender does not buy a higher rank, a badge, or a removal. If a scrape fails or a page changes shape, that lender can be missing until the next successful read. The “last updated” time on the homepage is the snapshot time. It is not a claim that every lender changed a rate that day.",
      "City pages use those same national posted rates. We do not publish a city average mortgage rate or a city average sale price, because we do not collect sale prices and the lenders do not file a separate grid for Saskatoon or Halifax. Local notes cover taxes and programs that actually differ by province or municipality, such as land transfer tax. A borrower in Winnipeg and a borrower in Vancouver can see the same lender grid and different closing-cost notes. Confirm any rate with the lender before you rely on it. The page is a copy of a public posting, not the contract.",
    ],
  },
  {
    id: "below-posted",
    heading: "How below-posted rates are aggregated",
    paragraphs: [
      "Real Mortgage Rates summarizes rates self-reported by Canadian borrowers online. Those reports are not the posted snapshot. Someone describes an approval, a renewal, or an offer they received. A row is kept when the post states a rate, a term, and whether it is fixed or variable, and when it reads as an offer they got rather than a question, a forecast, or a quote of an advertised rate. The published file does not include the original wording or account names.",
      "The median is the midpoint of the reports in a window, usually 30 days. A public table cell is shown only when the count, called N, meets the cutoff written on the <a href=\"/methodology/\">methodology</a> page. Rates on the charts are rounded. Variable reports are stored as an effective rate using the prime rate recorded in that file. Posted rates and reported rates are never averaged into one number. The <a href=\"/blog/below-the-line-mortgage-rate-report-october-2026/\">below-the-line report</a> is the written version of that comparison for the month it covers. The <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a> places one rate you type against the same distribution. None of those figures is a quote you will be offered.",
      "Small samples stay off the public tables on purpose. A single unusual report can move a cell of five. That is why the checker refuses to score an offer when it cannot find enough reports, instead of printing a confident percentile. Insured status is often missing from what people write, so many reports sit in an “not stated” group and are compared with every posted rate for that term, not only the insured shelf or the uninsured shelf. Read the methodology before you cite a median in a negotiation.",
    ],
  },
  {
    id: "independence",
    heading: "Independence and compensation",
    paragraphs: [
      "The site is independent of the lenders in the tables. Lenders do not pay for inclusion, for rank, or for a kinder sentence. When there is compensation, it is separate from the rate order, and this section says what it is.",
      "Advertising: the site runs Google AdSense, including Auto ads, on pages that are open to search engines. Google labels its ads. An ad is not an endorsement of the advertiser, and a lender’s ad, if one appears, does not move that lender’s row. Pages we ask search engines not to index do not load the AdSense script. The <a href=\"/privacy/\">privacy policy</a> explains cookies, AdSense, and requests under PIPEDA.",
      "Our own product: some pages link to a $29 mortgage guide, a PDF we write and sell. It is optional. The rate tables, the city notes, and the calculators stay free if you never buy it. The paid guide is labeled as ours. It is not a lender’s rate special.",
      "Other sites: we link to <a href=\"https://canadiancreditcardfinder.com/\">Canadian Credit Card Finder</a> as a cross-promotion. The <a href=\"/disclaimer/\">disclaimer</a> covers affiliate disclosure. A click does not change a mortgage rate on this site. We do not sell personal information. Privacy mail goes to the same address as everything else: <a href=\"mailto:contact@latestmortgagerates.ca\">contact@latestmortgagerates.ca</a>.",
    ],
  },
  {
    id: "cadence",
    heading: "Editorial and update cadence",
    paragraphs: [
      "Andrew writes the guides and reviews the editorial pages. The rate snapshot is rebuilt from the daily collection, so the numbers on a lender page can change without a new essay. A weekly 5-year fixed roundup is a dated article about one scrape. When a new weekly roundup is published, older weekly roundups stay on the site for anyone who has the link, and only the latest weekly roundup is the one we present as current. A news recap, such as a Bank of Canada decision, stays attached to the decision it describes. It is not rewritten into a later decision.",
      "Lender, city, and rate-hub pages show a “Last reviewed” date. That date is the build date of the page: when the snapshot and the copy were assembled. It is not a claim that a human re-read every cell that morning. If you need the live number, use the table and then open the lender’s own rate page. Guides are updated when a rule changes, such as a stress-test threshold or a land-transfer rebate, not on a fixed weekday. The methodology page is the standing description of the reported-rate rules. If a rule changes, that page changes with it.",
    ],
  },
  {
    id: "corrections",
    heading: "Corrections",
    paragraphs: [
      "If a rate, a tax figure, a calculator result, or an explanation is wrong, email <a href=\"mailto:contact@latestmortgagerates.ca\">contact@latestmortgagerates.ca</a> with the page address and what you think is off. Andrew reads that mailbox. We check the lender page, the statute, or the calculator formula, and we correct the standing page when the source shows we were wrong. Say what you expected to see and where you saw the other figure. A screenshot of the lender’s page, or a link to the statute, makes the check faster.",
      "We do not quietly change a historical weekly article so that it matches a later scrape. That article describes the scrape it names. A correction to a standing page, such as a tax rule or a step in the methodology, is made on that page. We also correct a byline, a broken calculator, or a link that points at the wrong lender. We cannot quote a personal mortgage rate, approve an application, or act as your broker. For a rate on your file, ask the lender or a licensed broker, and use this site to prepare the questions. The same address and the same corrections standard are repeated on the <a href=\"/contact/\">contact page</a>.",
    ],
  },
];

export const contactSections: EditorialSection[] = [
  {
    heading: "Email",
    paragraphs: [
      "Email <a href=\"mailto:contact@latestmortgagerates.ca\">contact@latestmortgagerates.ca</a>. That is the only address. There is no contact form, no phone line, and no social-media inbox for corrections. The same address is on the <a href=\"/about/\">about</a> page, the <a href=\"/disclaimer/\">disclaimer</a>, and the <a href=\"/privacy/\">privacy policy</a>.",
    ],
  },
  {
    heading: "What to write about",
    paragraphs: [
      "Write about a page on this site. Useful notes are a wrong rate compared with the lender’s own page, a tax figure that does not match the statute, a calculator result that does not match the formula described under the tool, a broken link, or a privacy request. If you bought the $29 mortgage guide and the file did not arrive, include the email you used at checkout.",
      "We cannot quote a personal mortgage rate, pre-approve you, or negotiate with your bank. Andrew is not your broker. Compare the live tables, run the calculator, and confirm the offer with the lender. A question about how a table is built is welcome. Pointing at the <a href=\"/methodology/\">methodology</a> is often the whole answer, and we will say so if it is.",
      "Please include the page address, the figure you saw, and the figure you expected. For a posted rate, the lender’s public page is the source we will check. For a reported median, the source is the data file described on the methodology page, and those rates are self-reported by Canadian borrowers online. We cannot verify someone else’s story, and we will not add or remove a single anecdote because a reader asks.",
    ],
  },
  {
    heading: "Response time",
    paragraphs: [
      "Andrew reads the mailbox and aims to reply within three business days. A correction that needs a statute or a lender page can take longer than a broken link. Weekends and Canadian statutory holidays are not business days. There is no live chat. If you do not get a reply after three business days, send the note again with the original date. Mail that asks for a personal rate quote will get a short reply pointing at the tables, or no product recommendation at all.",
    ],
  },
  {
    heading: "Corrections policy",
    paragraphs: [
      "A correction starts with the email above. We compare the page with the source: the lender’s public rate page for a posted rate, the statute or municipal page for a tax, and the formula on the tool page for a calculator. If we were wrong, we change the standing page. We do not rewrite a dated weekly roundup so that last month’s scrape matches this week’s rates. That article is a record of the scrape it names.",
      "We will say when a figure was wrong if you ask. We do not publish a separate corrections log. The updated page is the correction. Lender rank is not for sale, so a request to move a lender up the table, hide a rate, or add a badge will be declined. Affiliate and advertising relationships are described on the about page and do not change that rule.",
      "Privacy requests under PIPEDA use the same address. The privacy policy lists what the site stores, what AdSense and analytics cookies do, and how to ask about your information. Do not send account numbers, a social insurance number, or a full mortgage application. We do not need them to fix a page, and we do not want them in the mailbox.",
    ],
  },
];

export const expertsSections: EditorialSection[] = [
  {
    heading: "What an outside expert is for",
    paragraphs: [
      "A mortgage rate on this site is a number we copied from a lender’s public page, or a median of rates self-reported by Canadian borrowers online. An expert, in the list below, is a person who comments on the market in public. Those are different jobs. The commentator can tell you why a Bank of Canada decision landed the way it did, or why a bond yield moved a fixed rate, in language a rate table cannot. The table can tell you what a lender was posting on the day we scraped it. Neither one is a personal recommendation, and neither one replaces the contract.",
      "Use a commentator to understand the mechanism, then use this site to check the price. If someone says fixed rates should follow the five-year Government of Canada bond, open the <a href=\"/trends/\">trends</a> page and the <a href=\"/rates/5-year-fixed/\">5-year fixed</a> table and see whether the posted quotes actually moved. If someone says variable borrowers are waiting on the next overnight-rate decision, read the latest Bank of Canada recap on the <a href=\"/blog/\">blog</a> and remember that your payment changes only when your lender’s prime changes, on the schedule in your contract. A confident thread is not a quote.",
      "People who sell mortgages have a reason to talk. A broker, a bank economist, and a housing analyst can all be worth reading, and they can all have a book of business, an employer, or a forecast they would rather not walk back. That does not make them useless. It means you should ask what they are selling and what they can see that you cannot. A broker who says “the street is at 4.3%” may be describing deals in their office this week. That is closer to the reported-rate pages here than to a posted grid, and it is still one office. Our reported medians are only published when the count is large enough. A single anecdote, even from a well-known person, is not a median.",
    ],
  },
  {
    heading: "How to read commentary next to a rate table",
    paragraphs: [
      "Separate the forecast from the observation. “The Bank held the overnight rate” is an observation you can check on the Bank of Canada’s site. “They will cut in the spring” is a forecast. Fixed mortgage rates do not wait for that meeting. They move with the bond market, sometimes weeks earlier, and they move by lender, not as one national number. Variable and adjustable payments are the ones tied to prime. If a commentator blends those two, the rate table will look like it “disagrees” when it is just a different product.",
      "Separate posted from discounted. Bank economists often talk about the housing market, not about the discount a retention desk will offer you in month 58 of a five-year term. The posted rate on our lender pages is the shelf price. The gap people report, on the <a href=\"/real-mortgage-rates/\">real mortgage rates</a> page, is how far under that shelf recent stories have landed. A commentator who says “rates are 5%” without saying posted or discounted, insured or uninsured, fixed or variable, has not given you a number you can compare. Ask which one they mean, or don’t use the sentence as a benchmark.",
      "Separate Canada from your city. National commentary is about inflation, employment, and the policy rate. Your payment also depends on the provincial tax at closing, the insurer’s rules if you put less than 20% down, and whether your lender even lends on that property. City pages on this site do not invent a local average rate. They attach the national grid to the local tax notes. If an expert posts a city price chart, that is a different dataset from ours. We do not publish sale prices.",
      "Then decide what you will do this month. If you are renewing, the useful sequence is the offer in writing, the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a>, a second quote, and the conversation described in the <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a>. If you are buying, the useful sequence is a posted-rate comparison, the stress test, and the cash due at closing. Commentary can change how worried you are. It should not replace those steps. The accounts below are a reading list, not a ranking and not an endorsement. Andrew does not speak for them, and they do not review this site.",
    ],
  },
];

export const trendsSections: EditorialSection[] = [
  {
    heading: "What the charts are measuring",
    paragraphs: [
      "The charts on this page are built from our own daily collection of posted rates, not from a borrower’s story and not from a bond-trading terminal. Each day the scrape keeps the best fixed rate and the best variable rate we found, split into insured and uninsured when the lender pages label them that way. “Best” here means the lowest posted quote in that slice on that day. It is one number per series, so a chart can move because a single aggressive lender changed a cell, or because that lender dropped out of the scrape. It is not an average of every Canadian mortgage, and it is not the rate you will be offered.",
      "The long chart lets you look back 7, 30, 60, or 90 days, and it lets you show insured or uninsured and fixed, variable, or both. The shorter cards near the top are a snapshot of the current file: where the lowest quotes sit today and whether the recent points moved up, down, or not enough to call. Use the long chart to see a path. Use the homepage table to see which lender is holding today’s low. A line without a lender name is easy to over-read.",
      "History on this page is only as long as the file we have stored. It is not a 20-year Bank of Canada series. If you need the overnight rate itself, read the Bank’s decision. If you need the five-year bond yield, read a market source. This page is the retail mortgage quotes that followed those markets, on the days we successfully read lender sites.",
    ],
  },
  {
    heading: "Why fixed and variable lines do not move together",
    paragraphs: [
      "Variable and adjustable mortgage rates in Canada are priced off prime, and prime moves when the Bank of Canada moves the overnight rate, usually by the same amount, on the lender’s schedule. Between decisions, a variable posted quote can still change if a lender changes its discount to prime. A hold, like the September 2026 decision to leave the overnight rate at 2.25%, means prime should not reprice from that meeting alone. It does not freeze the discount.",
      "Fixed mortgage rates are priced off the lender’s cost of funds, which tracks Government of Canada bonds of a similar term more closely than it tracks next week’s policy meeting. The five-year fixed quote you see on the chart can rise while everyone is still discussing a cut, if the five-year yield has already risen. It can fall in a quiet week if a monoline decides to buy volume. That is why a fixed line and a variable line on the same chart can slope in opposite directions. They are not two measurements of one rate.",
      "Insured and uninsured quotes diverge for a credit reason. A high-ratio mortgage carries default insurance, so the lender’s loss is covered and the contract rate is often lower. The premium is not free: it is added to the balance. An uninsured quote, with 20% or more down, has no premium and often a higher contract rate. The chart’s insured toggle is that distinction. Comparing an insured low from last month with an uninsured low from today will look like a jump that never happened in either product.",
    ],
  },
  {
    heading: "How to use a trend without turning it into a forecast",
    paragraphs: [
      "A falling 30-day line means the lowest posted quote we stored is lower than it was at the start of the window. It does not mean your renewal letter will match that low, and it does not mean next month continues the slope. Posted rates are shelf prices. Rates self-reported by Canadian borrowers online, on the <a href=\"/real-mortgage-rates/\">real mortgage rates</a> page, are a different series and are not drawn here. If you want to place one offer on that other series, use the <a href=\"/tools/renewal-offer-checker/\">renewal offer checker</a>. If you want the weekly written version of the posted 5-year fixed grid, read the latest roundup on the <a href=\"/blog/\">blog</a>. Older weekly roundups stay up for the link, and the latest one is the current write-up.",
      "Before you lock a term because a line moved, name the product. Fixed or variable, insured or uninsured, and the term. Then read the penalty and the prepayment, because a tenth of a point the wrong way on a break fee dominates a small move on this chart. The <a href=\"/compare/fixed-vs-variable/\">fixed versus variable</a> guide and the <a href=\"/guides/negotiate-mortgage-rate/\">negotiation guide</a> are the pages for that decision. The chart is the backdrop. The lender’s current page is the quote. Andrew reviews the explanation on this page; the points themselves come from the daily scrape.",
    ],
  },
];
