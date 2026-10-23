import ratesData from "../../data/rates.json";
import { blogPosts } from "../content/blog";
import lenderContentData from "../content/lenderContent.json";
import { negotiateGuide } from "../content/guides/negotiateMeta";
import { IN_DEPTH_GUIDES } from "../content/inDepthGuides";
import { communityRates, PUBLIC_MIN_N } from "./communityRates";
import { lenderCountLabel } from "./lenderCount";
import { COMPARE_PAGES, RATE_HUBS, TOOL_LINKS } from "./siteLinks";

interface RateRow {
  lender_name?: string;
  lender_slug?: string;
}

interface LenderContentName {
  name?: string;
}

const ORIGIN = "https://latestmortgagerates.ca";

function abs(path: string): string {
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${ORIGIN}${path.startsWith("/") ? path : `/${path}`}`;
}

function link(path: string, title: string, description?: string): string {
  const detail = description ? `: ${description}` : "";
  return `- [${title}](${abs(path)})${detail}`;
}

/** Markdown summary for /llms.txt. Built from the same lists the site renders. */
export function buildLlmsTxt(): string {
  const guides = [
    ...IN_DEPTH_GUIDES.map((guide) => link(guide.path, guide.cardTitle, guide.cardDescription)),
    link(negotiateGuide.path, negotiateGuide.headline, negotiateGuide.description),
  ];
  const tools = [
    link("/tools/", "Calculators and tools", "Payment, stress test, penalty, renewal, and closing-cost calculators"),
    ...TOOL_LINKS.map((tool) => link(tool.href, tool.title, tool.description)),
  ];
  const rates = [
    link("/", "Current posted rates", `Posted rates from ${lenderCountLabel} Canadian lenders, updated daily`),
    ...RATE_HUBS.map((hub) => link(hub.href, hub.title, hub.description)),
  ];
  const reports = blogPosts
    .filter((post) => post.slug.startsWith("below-the-line-mortgage-rate-report-"))
    .map((post) => link(`/blog/${post.slug}/`, post.title, post.excerpt));
  const contentNames = lenderContentData as Record<string, LenderContentName>;
  const lenderNames = new Map<string, string>();
  for (const row of ratesData as RateRow[]) {
    if (!row.lender_slug || lenderNames.has(row.lender_slug)) continue;
    lenderNames.set(row.lender_slug, contentNames[row.lender_slug]?.name || row.lender_name || row.lender_slug);
  }
  const lenders = [...lenderNames.entries()]
    .sort((a, b) => a[1].localeCompare(b[1], "en-CA"))
    .map(([slug, name]) => link(`/lenders/${slug}/`, name, "Posted rates from this lender"));
  const data = [
    link("/real-mortgage-rates/", "Real mortgage rates", "Medians of rates self-reported by Canadian borrowers online, next to posted rates"),
    link("/prime-rate/", "Prime rate in Canada today", "Lender prime next to the Bank of Canada policy rate"),
    link("/rate-changes/", "Mortgage rate-change tracker", "How posted rates moved in the daily scrape"),
    link("/mortgage-break-costs/", "Mortgage break costs", "What breaking a 5-year fixed costs at each Big Five bank"),
    link("/mortgage-rate-forecast-2027/", "Canadian mortgage rate forecast 2027", "Published forecasts from Canadian institutions"),
    link("/reports/discount-by-bank/", "Discount by bank", "How far rates self-reported by Canadian borrowers online sit below each bank's posted rate"),
    link("/rate-data/", "Rate data", "The posted-rate file behind the tables"),
    link("/methodology/", "Methodology", "How posted rates and borrower-reported rates are compiled"),
    link("/trends/", "Rate trends", "Posted-rate history from the daily scrape"),
    ...reports,
  ];

  const lines = [
    "# Latest Mortgage Rates",
    "",
    `> LatestMortgageRates.ca compares posted mortgage rates from ${lenderCountLabel} Canadian lenders and updates them daily. A second dataset summarizes rates ${communityRates.attribution}. Guides and calculators explain the contract in plain language. The site is education. It is not a mortgage offer and it is not a lender.`,
    "",
    "Andrew writes the guides. The public byline is Andrew. Email contact@latestmortgagerates.ca.",
    "",
    "## Key sections",
    "",
    link("/", "Current rates", "Posted fixed and variable rates"),
    link("/real-mortgage-rates/", "Real mortgage rates", "What borrowers report versus posted rates"),
    link("/prime-rate/", "Prime rate", "Policy rate and lender prime"),
    link("/rate-data/", "Rate data", "Posted rates, changes, break costs, and forecasts"),
    link("/guides/", "Guides", "Renewals, penalties, the stress test, and fixed versus variable"),
    link("/tools/", "Calculators", "Payments, qualification, penalties, and closing costs"),
    link("/rates/5-year-fixed/", "Rate hubs", "5-year fixed, variable, insured, and uninsured"),
    link("/glossary/", "Mortgage terms glossary (Canada)", "Plain-language definitions"),
    link("/blog/", "News and rate reports", "Weekly posted-rate roundups and the monthly below-the-line report"),
    link("/methodology/", "Methodology", "Sample size, rounding, and the scrape"),
    link("/editorial-policy/", "Editorial policy", "Research, fact-checking, updates, corrections, and advertising"),
    link("/author/andrew/", "Author", "Andrew"),
    link("/about/", "About", "What the site is for"),
    link("/contact/", "Contact", "contact@latestmortgagerates.ca"),
    "",
    "## Guides",
    "",
    ...guides,
    "",
    "## Tools",
    "",
    ...tools,
    "",
    "## Rates",
    "",
    ...rates,
    "",
    "## Comparisons",
    "",
    link("/compare/", "Compare mortgages", "Side-by-side product and lender comparisons"),
    ...COMPARE_PAGES.map((page) => link(page.href, page.title, page.description)),
    "",
    "## Data",
    "",
    ...data,
    "",
    "## Lenders",
    "",
    link("/lenders/", "All lenders", "Posted rates for each lender we track"),
    ...lenders,
    "",
    "## Data methodology",
    "",
    "Posted rates are read from each lender's public rate pages. The scrape runs twice a day, once in the morning and once in the evening, Eastern time. A failed read can leave that lender out until the next successful scrape.",
    "",
    `Borrower-reported rates are ${communityRates.attribution}. A row is kept when a public post states a rate, a term, and fixed or variable, and reads as an approval, a renewal, or an offer that person received. The published file does not include the original wording or account names. N, the unrounded count, is shown on every published cell. A cell is published only when N is at least ${PUBLIC_MIN_N}. Displayed rates are rounded to the nearest 0.05 percentage point. The figures are unverified and not an offer. The published number is a median. A high or low report is not deleted, and one report is not enough to publish a cell.`,
    "",
    `The current borrower-reported file is as of ${communityRates.asOf}. Variable effective rates in that file assume prime of ${communityRates.prime.toFixed(2)}%.`,
    "",
    "## Contact",
    "",
    "Email contact@latestmortgagerates.ca.",
    "Editorial policy: https://latestmortgagerates.ca/editorial-policy/",
    "Author: https://latestmortgagerates.ca/author/andrew/",
    "",
  ];

  return lines.join("\n");
}
