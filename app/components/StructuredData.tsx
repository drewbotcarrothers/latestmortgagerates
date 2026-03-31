"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

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
  const pathname = usePathname();
  
  const structuredData = useMemo(() => {
    const baseUrl = "https://latestmortgagerates.ca";
    const pageUrl = `${baseUrl}${pathname}`;
    
    // Get best rates for featured snippets
    const best5YearFixed = rates
      .filter((r) => r.term_months === 60 && r.rate_type === "fixed" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];

    const best5YearVariable = rates
      .filter((r) => r.term_months === 60 && r.rate_type === "variable" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];

    const uniqueLenders = [...new Set(rates.map((r) => r.lender_slug))];
    const avgRate = rates.length > 0 
      ? (rates.reduce((sum, r) => sum + r.rate, 0) / rates.length).toFixed(2)
      : "0.00";

    const schemas = [];

    // Organization Schema
    const organizationSchema = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "@id": `${baseUrl}/#/schema/Organization/1`,
      name: "Latest Mortgage Rates Canada",
      url: baseUrl,
      logo: {
        "@type": "ImageObject",
        url: `${baseUrl}/logo.png`,
        width: 512,
        height: 512,
      },
      sameAs: [
        "https://twitter.com/latestmortgage",
      ],
      description: "Compare current mortgage rates from Canada's top lenders including Big 6 Banks, monoline lenders, and credit unions.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer service",
        availableLanguage: ["English", "French"],
      },
    };
    schemas.push(organizationSchema);

    // Website Schema with Search
    const websiteSchema = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": `${baseUrl}/#/schema/WebSite/1`,
      url: baseUrl,
      name: "Latest Mortgage Rates Canada",
      description: "Compare current mortgage rates from 30+ Canadian lenders",
      publisher: {
        "@id": `${baseUrl}/#/schema/Organization/1`,
      },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${baseUrl}/?search={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    };
    schemas.push(websiteSchema);

    // WebPage Schema
    const webpageSchema = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: "Latest Mortgage Rates Canada",
      description: `Current best rates: 5-year fixed at ${best5YearFixed?.rate.toFixed(2) || "N/A"}% from ${best5YearFixed?.lender_name || "various lenders"}, 5-year variable at ${best5YearVariable?.rate.toFixed(2) || "N/A"}% from ${best5YearVariable?.lender_name || "various lenders"}. Compare ${uniqueLenders.length}+ Canadian lenders.`,
      dateModified: lastUpdated,
      datePublished: "2025-01-01",
      inLanguage: "en-CA",
      isPartOf: {
        "@id": `${baseUrl}/#/schema/WebSite/1`,
      },
      about: {
        "@type": "Thing",
        name: "Canadian Mortgage Rates",
        description: `Current mortgage rates in Canada. Best 5-year fixed: ${best5YearFixed?.rate.toFixed(2) || "N/A"}% from ${best5YearFixed?.lender_name || "various lenders"}. Best 5-year variable: ${best5YearVariable?.rate.toFixed(2) || "N/A"}% from ${best5YearVariable?.lender_name || "various lenders"}.`,
      },
      mainEntity: {
        "@type": "ItemList",
        name: "Current Mortgage Rates",
        itemListElement: rates.slice(0, 10).map((rate, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: `${rate.lender_name} ${rate.term_months}-month ${rate.rate_type}`,
          item: {
            "@type": "FinancialProduct",
            name: `${rate.lender_name} Mortgage`,
            description: `${rate.rate_type === "fixed" ? "Fixed" : "Variable"} rate mortgage with ${rate.term_months}-month term`,
            provider: {
              "@type": "BankOrCreditUnion",
              name: rate.lender_name,
            },
            annualPercentageRate: {
              "@type": "QuantitativeValue",
              value: rate.rate,
              unitText: "PERCENT",
            },
            loanTerm: {
              "@type": "QuantitativeValue",
              value: rate.term_months,
              unitText: "MONTH",
            },
          },
        })),
      },
    };
    schemas.push(webpageSchema);

    // Create comprehensive FAQ structured data
    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What are the current mortgage rates in Canada?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Current mortgage rates in Canada vary by lender. As of ${lastUpdated}, the best 5-year fixed uninsured rate is ${best5YearFixed?.rate.toFixed(2) || "N/A"}% from ${best5YearFixed?.lender_name || "various lenders"}, and the best 5-year variable uninsured rate is ${best5YearVariable?.rate.toFixed(2) || "N/A"}% from ${best5YearVariable?.lender_name || "various lenders"}. The average rate across all ${uniqueLenders.length} lenders is ${avgRate}%. Rates are updated twice daily from major Canadian lenders.`,
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between fixed and variable mortgage rates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Fixed mortgage rates remain constant throughout your term, providing payment stability and protection against rate increases. Variable mortgage rates fluctuate with your lender's prime rate (currently 5.45%), which means your payments may increase or decrease following Bank of Canada policy changes. Variable rates typically start 0.3% to 0.7% lower than comparable fixed rates but carry more interest rate risk.",
          },
        },
        {
          "@type": "Question",
          name: "Should I choose an insured or uninsured mortgage?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Insured mortgages (with less than 20% down payment) typically offer rates 0.2% to 0.5% lower than uninsured mortgages but require mortgage insurance premiums of 0.6% to 4% of the loan amount through CMHC, Sagen, or Canada Guaranty. Uninsured mortgages (with 20% or more down payment) have slightly higher rates but no insurance premiums. For most buyers with less than 20% down, insured is the only option. With 20%+, calculate whether the lower rate justifies the insurance cost.",
          },
        },
        {
          "@type": "Question",
          name: "How often are mortgage rates updated?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mortgage rates on LatestMortgageRates.ca are updated twice daily at 6:00 AM EST and 6:00 PM EST. Our automated system scrapes rates directly from ${uniqueLenders.length} Canadian lender websites including the Big 6 Banks (RBC, TD, Scotiabank, BMO, CIBC, National Bank), monoline lenders (First National, MCAP), credit unions, and digital banks to ensure accuracy within hours of any changes.",
          },
        },
        {
          "@type": "Question",
          name: "What is the Bank of Canada prime rate and how does it affect mortgages?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The Bank of Canada prime rate is currently 5.45%. Variable mortgage rates are quoted as 'prime minus X%' or 'prime plus X%'. When the Bank of Canada changes its overnight rate, lenders typically adjust their prime rate accordingly, which directly affects variable mortgage payments. Fixed rates are more influenced by government bond yields than the prime rate.",
          },
        },
        {
          "@type": "Question",
          name: "How much can I save by shopping around for mortgage rates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: `Shopping around can save thousands over your mortgage term. Rate differences between lenders often range from 0.5% to 1.0%. On a $500,000 mortgage over 5 years, a 0.5% lower rate saves approximately $12,500 in interest. Using LatestMortgageRates.ca to compare ${uniqueLenders.length}+ lenders ensures you find the best available rate for your situation.",
          },
        },
        {
          "@type": "Question",
          name: "What's the difference between posted rates and contract rates?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Posted rates are the advertised 'rack' rates banks display publicly, often 1% to 2% higher than what qualified borrowers actually pay. Contract rates (or discounted rates) are the actual rates negotiated between you and the lender. Big banks often quote posted rates but provide discounts. Monoline lenders typically advertise their actual contract rates directly, which is why they often appear lower in comparisons.",
          },
        },
        {
          "@type": "Question",
          name: "Should I get a mortgage from a bank or a monoline lender?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Banks offer convenience (existing relationship, bundled products) and branch access but typically have higher rates. Monoline lenders (mortgage-only specialists like First National, MCAP) offer lower rates and specialize in mortgages, but work through brokers rather than branches. Many borrowers use monoline lenders for better rates while keeping day-to-day banking at their main institution. Both are regulated and safe choices.",
          },
        },
      ],
    };
    schemas.push(faqSchema);

    return schemas;
  }, [rates, lastUpdated, pathname]);

  return (
    <>
      {structuredData.map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
      ))}
    </>
  );
}
