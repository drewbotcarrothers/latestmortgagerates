export interface LenderAnchorLink {
  href: string;
  anchor: string;
}

/** Internal links for the striking-distance "[lender] mortgage rates" pages. */
export const STRIKING_DISTANCE_LENDER_LINKS: LenderAnchorLink[] = [
  { href: "/lenders/atb/", anchor: "ATB mortgage rates" },
  { href: "/lenders/wealthsimple/", anchor: "Wealthsimple mortgage rates" },
  { href: "/lenders/vancity/", anchor: "Vancity mortgage rates" },
  { href: "/lenders/meridian/", anchor: "Meridian mortgage rates" },
];

export function isWeeklyRatePost(slug: string): boolean {
  return slug.startsWith("best-5-year-fixed-rates-week");
}
