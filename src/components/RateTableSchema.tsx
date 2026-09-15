"use client";

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

interface RateTableSchemaProps {
  rates: Rate[];
  lastUpdated: string;
  termLabel: string;
  rateTypeLabel: string;
  mortgageTypeLabel: string;
}

export default function RateTableSchema({
  rates,
  lastUpdated,
  termLabel,
  rateTypeLabel,
  mortgageTypeLabel,
}: RateTableSchemaProps) {
  if (rates.length === 0) return null;

  const baseUrl = "https://latestmortgagerates.ca";

  // Build FinancialProduct schema for each rate
  const itemList = rates.slice(0, 20).map((rate, index) => {
    const termYears = rate.term_months / 12;
    const rateType = rate.rate_type === "fixed" ? "Fixed" : "Variable";
    const mortgageType = rate.mortgage_type === "insured" ? "Insured" : "Uninsured";

    return {
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "FinancialProduct",
        name: `${rate.lender_name} ${termYears}-Year ${rateType} Mortgage`,
        description: `${rateType} ${mortgageType} mortgage with ${termYears}-year term at ${rate.rate.toFixed(2)}% interest rate`,
        url: `${baseUrl}/lenders/${rate.lender_slug}`,
        provider: {
          "@type": "BankOrCreditUnion",
          name: rate.lender_name,
        },
        annualPercentageRate: {
          "@type": "QuantitativeValue",
          value: rate.rate,
          unitText: "PERCENT",
        },
        interestRate: {
          "@type": "QuantitativeValue",
          value: rate.rate,
          unitText: "PERCENT",
        },
        ...(rate.posted_rate
          ? {
              feesAndCommissionsSpecification: `Posted rate: ${rate.posted_rate}%`,
            }
          : {}),
        ...(rate.apr
          ? {
              additionalProperty: {
                "@type": "PropertyValue",
                name: "APR",
                value: rate.apr,
              },
            }
          : {}),
        availableAtOrFrom: {
          "@type": "Place",
          name: "Canada",
        },
        dateModified: lastUpdated,
      },
    };
  });

  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${termLabel} ${rateTypeLabel} Mortgage Rates - ${mortgageTypeLabel}`,
    description: `Compare ${rates.length} ${mortgageTypeLabel} ${rateTypeLabel} mortgage rates from Canadian lenders. Updated daily.`,
    numberOfItems: itemList.length,
    itemListElement: itemList,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
