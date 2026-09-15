export interface SiteLink {
  href: string;
  title: string;
  description: string;
  icon?: string;
}

/** Canonical calculator URLs (trailingSlash: always). */
export const TOOL_LINKS: SiteLink[] = [
  {
    href: "/tools/mortgage-calculator/",
    icon: "🧮",
    title: "Payment Calculator",
    description: "Calculate monthly payments",
  },
  {
    href: "/tools/affordability-calculator/",
    icon: "🏠",
    title: "Affordability Calculator",
    description: "How much can you afford?",
  },
  {
    href: "/tools/land-transfer-tax-calculator/",
    icon: "📋",
    title: "Land Transfer Tax",
    description: "Provincial & municipal taxes",
  },
  {
    href: "/tools/cmhc-insurance-calculator/",
    icon: "🛡️",
    title: "CMHC Calculator",
    description: "Insurance premiums",
  },
  {
    href: "/tools/closing-costs-calculator/",
    icon: "💰",
    title: "Closing Costs",
    description: "Total fees to close",
  },
  {
    href: "/tools/rent-vs-buy-calculator/",
    icon: "⚖️",
    title: "Rent vs Buy",
    description: "Which saves more?",
  },
  {
    href: "/tools/mortgage-penalty-calculator/",
    icon: "📉",
    title: "Penalty Calculator",
    description: "Break fee estimate",
  },
  {
    href: "/tools/mortgage-renewal-calculator/",
    icon: "🔄",
    title: "Renewal Calculator",
    description: "Compare renewal options",
  },
  {
    href: "/tools/refinance-calculator/",
    icon: "💡",
    title: "Refinance Calculator",
    description: "Break-even analysis",
  },
  {
    href: "/tools/stress-test-qualifier/",
    icon: "✅",
    title: "Stress Test",
    description: "Do you qualify?",
  },
];

/** Product-type rate hubs that exist as real routes. */
export const RATE_HUBS: SiteLink[] = [
  {
    href: "/rates/5-year-fixed/",
    title: "5-Year Fixed Rates",
    description: "Today’s best locked-in 5-year rates",
  },
  {
    href: "/rates/variable/",
    title: "Variable Rates",
    description: "Prime-linked variable mortgage rates",
  },
  {
    href: "/rates/insured/",
    title: "Insured Rates",
    description: "High-ratio rates with under 20% down",
  },
  {
    href: "/rates/uninsured/",
    title: "Uninsured Rates",
    description: "Conventional rates with 20%+ down",
  },
];

export const TOOLS_INDEX_HREF = "/tools/";

export function normalizePath(href: string): string {
  return href.replace(/\/$/, "");
}

export function filterCurrent(links: SiteLink[], currentHref?: string): SiteLink[] {
  if (!currentHref) return [...links];
  const current = normalizePath(currentHref);
  return links.filter((link) => normalizePath(link.href) !== current);
}
