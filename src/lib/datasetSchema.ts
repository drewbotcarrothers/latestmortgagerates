export interface DatasetSchemaInput {
  name: string;
  description: string;
  url: string;
  temporalCoverage: string;
  dateModified: string;
  variableMeasured: string[];
}

/** Schema.org Dataset block for the citable rate-data pages. */
export function datasetJsonLd(input: DatasetSchemaInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: input.name,
    description: input.description,
    url: input.url,
    temporalCoverage: input.temporalCoverage,
    dateModified: input.dateModified,
    creator: [
      { "@type": "Person", name: "Andrew" },
      {
        "@type": "Organization",
        name: "Latest Mortgage Rates",
        url: "https://latestmortgagerates.ca",
      },
    ],
    variableMeasured: input.variableMeasured,
  };
}
