"use client";

import { useMemo } from "react";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
  apr?: string | null;
  posted_rate?: number | null;
  ltv_tier?: string | null;
  spread_to_prime?: string | null;
  source_url?: string | null;
}

interface StructuredDataProps {
  rates: Rate[];
  lastUpdated: string;
}

export default function StructuredData({ rates, lastUpdated }: StructuredDataProps) {
  const structuredData = useMemo(() => {
    // Get best rates for featured snippets
    const best5YearFixed = rates
      .filter((r) => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];

    const best5YearVariable = rates
      .filter((r) => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];

    const uniqueLenders = [...new Set(rates.map((r) => r.lender_slug))];

    // Create FAQ structured data
    const faqData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the current mortgage rates in Canada?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Current mortgage rates in Canada vary by lender. As of ${lastUpdated}, the best 5-year fixed uninsured rate is ${best5YearFixed?.rate.toFixed(2) || "N/A"}% from ${best5YearFixed?.lender_name || "various lenders"}, and the best 5-year variable uninsured rate is ${best5YearVariable?.rate.toFixed(2) || "N/A"}% from ${best5YearVariable?.lender_name || "various lenders"}. Rates are updated daily from ${uniqueLenders.length} Canadian lenders.`,
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between fixed and variable mortgage rates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fixed mortgage rates remain constant throughout your term, providing payment stability and protection against rate increases. Variable mortgage rates fluctuate with the prime rate, which means your payments may increase or decrease depending on Bank of Canada policy changes. Variable rates typically start lower than fixed rates but carry more risk.",
          },
        },
        {
          "@type": "Question",
          name: "Should I choose an insured or uninsured mortgage?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Insured mortgages (with less than 20% down payment) typically offer lower rates but require mortgage insurance premiums through CMHC, Sagen, or Canada Guaranty. Uninsured mortgages (with 20% or more down payment) have slightly higher rates but no insurance premiums. Choose based on your down payment amount and long-term cost calculations.",
          },
        },
        {
          "@type": "Question",
          name: "How often are mortgage rates updated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mortgage rates are updated daily at 6:00 AM UTC from major Canadian lenders including the Big 5 banks, monoline lenders, and credit unions. Our automated system scrapes rates directly from lender websites to ensure accuracy.",
          },
        },
      ],
    };

    // Create ItemList structured data for top lenders
    const itemListData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Canadian Mortgage Lenders",
      itemListElement: uniqueLenders.slice(0, 10).map((slug, index) => {
        const lenderRates = rates.filter((r) => r.lender_slug === slug);
        const lowestRate = Math.min(...lenderRates.map((r) => r.rate));
        const lenderName = lenderRates[0]?.lender_name || slug;
        
        return {
          "@type": "ListItem",
          position: index + 1,
          name: lenderName,
          url: `https://latestmortgagerates.ca/lenders/${slug}`,
          item: {
            "@type": "FinancialProduct",
            name: `${lenderName} Mortgage Rates`,
            provider: {
              "@type": "BankOrCreditUnion",
              name: lenderName,
            },
            offers: {
              "@type": "AggregateOffer",
              price: lowestRate.toFixed(2),
              priceCurrency: "CAD",
            },
          },
        };
      }),
    };

    // Create featured snippet optimized data
    const featuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Latest Mortgage Rates Canada",
      description: "Compare current mortgage rates from Canada's top lenders",
      url: "https://latestmortgagerates.ca",
      dateModified: lastUpdated,
      about: {
        "@type": "Thing",
        name: "Canadian Mortgage Rates",
        description: `Current best rates: 5-year fixed at ${best5YearFixed?.rate.toFixed(2) || "N/A"}% from ${best5YearFixed?.lender_name || "various lenders"}, 5-year variable at ${best5YearVariable?.rate.toFixed(2) || "N/A"}% from ${best5YearVariable?.lender_name || "various lenders"}.`,
      },
    };

    return [faqData, itemListData, featuredData];
  }, [rates, lastUpdated]);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />      ))}
    </>
  );
}
