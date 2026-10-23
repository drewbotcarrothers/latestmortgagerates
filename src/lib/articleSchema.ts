import { communityRates } from "./communityRates";

export const SITE_ORIGIN = "https://latestmortgagerates.ca";

export const ARTICLE_AUTHOR = {
  "@type": "Person" as const,
  name: "Andrew",
  url: `${SITE_ORIGIN}/author/andrew/`,
};

export const ARTICLE_PUBLISHER = {
  "@type": "Organization" as const,
  name: "Latest Mortgage Rates Canada",
  url: `${SITE_ORIGIN}/`,
  logo: {
    "@type": "ImageObject" as const,
    url: `${SITE_ORIGIN}/logo.png`,
  },
};

export function isoDate(value: string): string {
  return value.slice(0, 10);
}

export function articleJsonLd(input: {
  type?: "Article" | "BlogPosting";
  headline: string;
  description: string;
  datePublished: string;
  dateModified: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": input.type ?? "Article",
    headline: input.headline,
    description: input.description,
    datePublished: isoDate(input.datePublished),
    dateModified: isoDate(input.dateModified),
    author: ARTICLE_AUTHOR,
    publisher: ARTICLE_PUBLISHER,
    mainEntityOfPage: input.url,
    inLanguage: "en-CA",
  };
}

/** Guides store dates on the content object (the stand-in for frontmatter). */
export function guideDates(guide: { reviewedIso: string; publishedIso?: string; updatedDate?: string }) {
  return {
    datePublished: isoDate(guide.publishedIso ?? guide.reviewedIso),
    dateModified: isoDate(guide.updatedDate ?? guide.reviewedIso),
  };
}

export function isMonthlyRateReport(slug: string): boolean {
  return slug.startsWith("below-the-line-mortgage-rate-report-");
}

/**
 * dateModified for a post. A monthly rate report uses the data as-of date
 * when updatedDate is omitted, so the schema does not stay on the original publish day.
 */
export function blogDateModified(post: { slug: string; date: string; updatedDate?: string }): string {
  if (post.updatedDate) return isoDate(post.updatedDate);
  if (isMonthlyRateReport(post.slug)) return communityRates.asOf;
  return isoDate(post.date);
}
