export interface DiscoveryLink {
  href: string;
  label: string;
}

/**
 * Pages Google had not indexed, or had only discovered, in the 28 days to
 * November 13, 2026. Linked from the guides index, lender index, rate tables,
 * the Big 5 guide, and related guides.
 */
export const DISCOVERY_LINKS: DiscoveryLink[] = [
  { href: "/guides/heloc-rates-canada/", label: "HELOC rates in Canada" },
  { href: "/lenders/nesto/", label: "nesto mortgage rates" },
  { href: "/lenders/cmls/", label: "CMLS mortgage rates" },
  { href: "/lenders/scotiabank/", label: "Scotiabank mortgage rates" },
  { href: "/lenders/simplii/", label: "Simplii mortgage rates" },
];
