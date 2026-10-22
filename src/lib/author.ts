/** Public byline. Do not publish a surname. */
export const AUTHOR_NAME = "Andrew";

export const AUTHOR_PATH = "/author/andrew/";

export const AUTHOR_BIO =
  "Andrew is a personal finance expert, DIY investor and life optimizer based in Toronto, Canada. With over 19 years of corporate experience at a leading Canadian company, Andrew combines deep industry knowledge with a passion for technology to help others navigate personal finance and streamline their daily lives.";

/** Sister sites from the About Andrew note. This site is the one he runs here, so it is not in the list. */
export const AUTHOR_RELATED_SITES = [
  {
    href: "https://savingoptimizer.com/",
    name: "SavingOptimizer.com",
    detail: "Canadian guides to household spending.",
  },
  {
    href: "https://canadianoptimizer.com/",
    name: "CanadianOptimizer.com",
    detail: "Tax, investing, and retirement strategies for Canadians.",
  },
  {
    href: "https://makemoneyoptimizer.com/",
    name: "MakeMoneyOptimizer.com",
    detail: "Side hustle and extra-income guides for Canadians.",
  },
  {
    href: "https://canadiancreditcardfinder.com/",
    name: "CanadianCreditCardFinder.com",
    detail: "A tool for comparing Canadian credit cards.",
  },
  {
    href: "https://canadiandatainsights.com/",
    name: "CanadianDataInsights.com",
    detail: "Interactive Statistics Canada census insights.",
  },
  {
    href: "https://stocksummarizer.com/",
    name: "StockSummarizer.com",
    detail: "Plain-English stock and market briefs for DIY investors.",
  },
] as const;

/**
 * About Andrew copy, shared by /about/ and /author/andrew/.
 * Adapted from the About Andrew section on savingoptimizer.com/about.html:
 * this site is the one he runs, and the source checks are the mortgage ones.
 * The list of related sites is inserted after paragraph index 1.
 */
export const AUTHOR_ABOUT_LIST_AFTER = 1;

export const AUTHOR_ABOUT_PARAGRAPHS = [
  AUTHOR_BIO,
  "Andrew runs Latest Mortgage Rates, and every guide on the site carries his byline. He also runs a small group of related Canadian sites:",
  'Andrew also publishes videos for Saving Optimizer on YouTube at <a href="https://www.youtube.com/@SavingOptimizer">@SavingOptimizer</a>.',
  'Guides on Latest Mortgage Rates are researched and drafted with AI assistance and checked against official Canadian sources such as lender rate pages, the Bank of Canada, CMHC, the Canada Revenue Agency, canada.ca, provincial government sites, and regulators. Examples use labelled example figures, not invented figures. The full process, including how dates and affiliate disclosures work, is on the <a href="/about/">about page</a> and the <a href="/methodology/">methodology</a> page.',
  "Latest Mortgage Rates is education only. It is not mortgage, financial, tax, legal, or insurance advice, and it does not know your situation. Confirm anything that matters with the official source or a licensed professional.",
  'Spotted an error or an out-of-date number, or want to reach Andrew? Use the <a href="/contact/">contact page</a>.',
];

export const AUTHOR_ABOUT_ITEMS = AUTHOR_RELATED_SITES.map(
  (site) => `<a href="${site.href}">${site.name}</a>: ${site.detail}`,
);

export const AUTHOR_FOCUS = [
  {
    title: "Posted mortgage rates",
    body: "Daily comparisons of fixed and variable rates that Canadian lenders publish on their own sites, split by term and by insured or uninsured when the source page says so.",
  },
  {
    title: "Renewals and rates below posted",
    body: "How a renewal letter compares with rates self-reported by Canadian borrowers online, and what that gap is for when you talk to a bank.",
  },
  {
    title: "The math around the rate",
    body: "Payments, the stress test, default-insurance premiums, closing costs, and rent versus buy, with the formula written down next to the calculator.",
  },
  {
    title: "What actually moves a quote",
    body: "Bank of Canada decisions for variable rates, bond yields for fixed rates, and the difference between a posted shelf rate and a discounted offer.",
  },
] as const;
