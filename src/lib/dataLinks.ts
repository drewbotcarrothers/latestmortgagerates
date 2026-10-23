export interface DataLink {
  href: string;
  title: string;
  description: string;
}

/** Hub links for the rate-data pages. Trailing slashes match the site. */
export const DATA_LINKS: DataLink[] = [
  {
    href: "/prime-rate/",
    title: "Prime rate in Canada today",
    description: "Big-bank prime, scraped lender primes, and the Bank of Canada policy rate",
  },
  {
    href: "/mortgage-break-costs/",
    title: "What breaking a 5-year fixed costs",
    description: "Posted-rate IRD illustration for the Big Five, from today's rate file",
  },
  {
    href: "/rate-changes/",
    title: "Mortgage rate-change tracker",
    description: "Dated log of published rate moves across the lenders in the rate file",
  },
  {
    href: "/blog/bond-yields-mortgage-rates-explained/",
    title: "Bond yield and 5-year fixed spread",
    description: "Lowest and Big Five median 5-year fixed versus the Canada 5-year bond",
  },
  {
    href: "/mortgage-rate-forecast-2027/",
    title: "Mortgage rate forecast 2027",
    description: "Published bank forecasts for the policy rate and 5-year yields",
  },
  {
    href: "/reports/discount-by-bank/",
    title: "Discount below posted, by bank",
    description: "Median points below each lender's own posted rate, when N is at least 10",
  },
  {
    href: "/real-mortgage-rates/",
    title: "Real mortgage rates",
    description: "Median rates self-reported by Canadian borrowers online, versus posted rates",
  },
  {
    href: "/blog/below-the-line-mortgage-rate-report-october-2026/",
    title: "October 2026 rate report",
    description: "The monthly written report on reported rates versus posted rates",
  },
];

export const DATA_HUB = {
  href: "/rate-data/",
  title: "Rate data",
  description: "Prime, break costs, rate changes, the bond spread, forecasts, and reported discounts",
};
