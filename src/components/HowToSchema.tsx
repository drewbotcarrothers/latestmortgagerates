"use client";

interface Step {
  name: string;
  text: string;
  url?: string;
}

interface HowToSchemaProps {
  name: string;
  description: string;
  totalTime?: string;  // ISO 8601 duration format, e.g., "PT5M"
  steps: Step[];
  estimatedCost?: {
    currency: string;
    value: string;
  };
}

export default function HowToSchema({ 
  name, 
  description, 
  totalTime = "PT5M",
  steps,
  estimatedCost
}: HowToSchemaProps) {
  const baseUrl = "https://latestmortgagerates.ca";
  
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name,
    description,
    totalTime,
    ...(estimatedCost && {
      estimatedCost: {
        "@type": "MonetaryAmount",
        currency: estimatedCost.currency,
        value: estimatedCost.value,
      },
    }),
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
      url: step.url || `${baseUrl}/tools`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
    />
  );
}
