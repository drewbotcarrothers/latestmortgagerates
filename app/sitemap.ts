import type { MetadataRoute } from "next";
import ratesData from "../data/rates.json";

interface Rate {
  lender_slug: string;
}

// Force static generation for static export
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const uniqueLenders = [...new Set((ratesData as Rate[]).map((r) => r.lender_slug))];
  
  const blogPosts = [
    "fixed-vs-variable-mortgage-rates",
    "first-time-home-buyer-guide-canada",
    "mortgage-stress-test-canada",
    "insured-vs-uninsured-mortgages",
    "mortgage-prepayment-penalties",
    "prime-rate-explained-canada",
  ];

  return [
    {
      url: "https://latestmortgagerates.ca",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://latestmortgagerates.ca/blog",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: "https://latestmortgagerates.ca/glossary",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://latestmortgagerates.ca/tools",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: "https://latestmortgagerates.ca/privacy",
      lastModified: new Date("2026-03-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: "https://latestmortgagerates.ca/terms",
      lastModified: new Date("2026-03-04"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...uniqueLenders.map((slug) => ({
      url: `https://latestmortgagerates.ca/lenders/${slug}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...blogPosts.map((slug) => ({
      url: `https://latestmortgagerates.ca/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
