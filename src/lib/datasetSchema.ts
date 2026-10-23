import { SITE_ORIGIN } from "./articleSchema";
import { communityRates } from "./communityRates";

export const MEASUREMENT_TECHNIQUE =
  "self-reported by Canadian borrowers online, plus a daily lender posted-rate scrape";

export function communityDatasetJsonLd(input: { name: string; description: string; url: string }) {
  const window30 = communityRates.windows["30d"];
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    url: input.url,
    temporalCoverage: `${window30.from}/${window30.to}`,
    dateModified: communityRates.asOf,
    creator: {
      "@type": "Organization",
      name: "Latest Mortgage Rates Canada",
      url: `${SITE_ORIGIN}/`,
    },
    license: `${SITE_ORIGIN}/terms/`,
    isAccessibleForFree: true,
    variableMeasured: [
      "reported mortgage rate",
      "mortgage term",
      "fixed or variable",
      "insured status",
      "sample size (N)",
      "posted lender rate",
    ],
    measurementTechnique: MEASUREMENT_TECHNIQUE,
  };
}

export function realRatesDatasetJsonLd() {
  return communityDatasetJsonLd({
    name: "Real mortgage rates in Canada",
    description: `Median mortgage rates ${communityRates.attribution}, compared with posted rates from a daily lender scrape. As of ${communityRates.asOf}. ${communityRates.disclaimer}`,
    url: `${SITE_ORIGIN}/real-mortgage-rates/`,
  });
}

export function monthlyReportDatasetJsonLd(input: { slug: string; name: string; description: string }) {
  return communityDatasetJsonLd({
    name: input.name,
    description: input.description,
    url: `${SITE_ORIGIN}/blog/${input.slug}/`,
  });
}
