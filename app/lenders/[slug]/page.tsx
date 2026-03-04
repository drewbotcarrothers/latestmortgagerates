import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LenderLogo from "../../components/LenderLogo";

// Force static generation for static export
export const dynamic = "force-static";

// Import rates data
import ratesData from "../../../data/rates.json";

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

// Generate static paths for all lenders
export function generateStaticParams() {
  const uniqueLenders = [...new Set((ratesData as Rate[]).map((r) => r.lender_slug))];
  return uniqueLenders.map((slug) => ({ slug }));
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const lenderRates = (ratesData as Rate[]).filter((r) => r.lender_slug === slug);
  
  if (lenderRates.length === 0) {
    return {
      title: "Lender Not Found | Latest Mortgage Rates Canada",
      description: "The requested lender could not be found.",
    };
  }
  
  const lenderName = lenderRates[0].lender_name;
  const lowestRate = Math.min(...lenderRates.map((r) => r.rate));
  
  const title = `${lenderName} Mortgage Rates | Latest Mortgage Rates Canada`;
  const description = `Compare current ${lenderName} mortgage rates in Canada. Fixed and variable rates from ${lowestRate.toFixed(2)}%. Updated daily with the latest rates.`;
  
  return {
    title,
    description,
    keywords: [`${lenderName} mortgage rates`, `${lenderName} rates`, "Canadian mortgage rates", "fixed mortgage", "variable mortgage", `${lenderName} Canada`],
    alternates: {
      canonical: `https://latestmortgagerates.ca/lenders/${slug}`,
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://latestmortgagerates.ca/lenders/${slug}`,
      locale: "en_CA",
      siteName: "Latest Mortgage Rates Canada",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

function getTermLabel(months: number): string {
  if (months < 12) return `${months} months`;
  if (months === 12) return "1 year";
  return `${months / 12} years`;
}

function formatRateType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}

// Generate JSON-LD structured data
function generateStructuredData(lenderName: string, rates: Rate[], slug: string) {
  const lowestRate = Math.min(...rates.map((r) => r.rate));
  const lowestRateObj = rates.find((r) => r.rate === lowestRate);
  
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${lenderName} Mortgage Rates`,
    provider: {
      "@type": "BankOrCreditUnion",
      name: lenderName,
      url: rates.find((r) => r.source_url)?.source_url || `https://latestmortgagerates.ca/lenders/${slug}`,
    },
    offers: rates
      .filter((rate) => rate.source_url)
      .map((rate) => ({
        "@type": "AggregateOffer",
        price: rate.rate.toString(),
        priceCurrency: "CAD",
        description: `${formatRateType(rate.rate_type)} rate for ${getTermLabel(rate.term_months)}`,
        availability: "https://schema.org/InStock",
        url: rate.source_url,
      })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: lowestRate.toFixed(2),
      bestRating: lowestRate.toFixed(2),
      worstRating: Math.max(...rates.map((r) => r.rate)).toFixed(2),
    },
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function LenderPage({ params }: PageProps) {
  const { slug } = await params;
  const lenderRates = (ratesData as Rate[]).filter((r) => r.lender_slug === slug);
  
  if (lenderRates.length === 0) {
    notFound();
  }
  
  const lenderName = lenderRates[0].lender_name;
  const sortedRates = [...lenderRates].sort((a, b) => a.rate - b.rate);
  
  // Group rates by type
  const fixedRates = sortedRates.filter((r) => r.rate_type === "fixed");
  const variableRates = sortedRates.filter((r) => r.rate_type === "variable");
  
  // Get best rates
  const bestFixed = fixedRates[0];
  const bestVariable = variableRates[0];
  
  const structuredData = generateStructuredData(lenderName, lenderRates, slug);

  return (
    <main className="min-h-screen bg-gray-100">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-blue-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                <Link href="/#lenders" className="hover:text-blue-600 transition">
                  Lenders
                </Link>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 font-medium">{lenderName}</li>
            </ol>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LenderLogo lenderSlug={slug} size="lg" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{lenderName} Mortgage Rates</h1>
                <p className="text-gray-600 mt-1">
                  Compare current {lenderName} mortgage rates in Canada
                </p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/" className="text-gray-600 hover:text-blue-600 transition">Rates</Link>
              <Link href="/blog" className="text-gray-600 hover:text-blue-600 transition">Guides</Link>
              <Link href="/glossary" className="text-gray-600 hover:text-blue-600 transition">Glossary</Link>
              <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition">Tools</Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Best Rates Hero */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {bestFixed && (
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Best Fixed Rate</h2>
              <div className="text-4xl font-bold">{bestFixed.rate.toFixed(2)}%</div>
              <p className="text-green-100 mt-1">
                {getTermLabel(bestFixed.term_months)} {formatRateType(bestFixed.mortgage_type)}
              </p>
              {bestFixed.source_url && (
                <a
                  href={bestFixed.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  View Rate
                </a>
              )}
            </div>
          )}
          
          {bestVariable && (
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-2">Best Variable Rate</h2>
              <div className="text-4xl font-bold">{bestVariable.rate.toFixed(2)}%</div>
              <p className="text-blue-100 mt-1">
                {getTermLabel(bestVariable.term_months)} {formatRateType(bestVariable.mortgage_type)}
              </p>
              {bestVariable.source_url && (
                <a
                  href={bestVariable.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 px-6 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-gray-100 transition"
                >
                  View Rate
                </a>
              )}
            </div>
          )}
        </div>

        {/* Fixed Rates Section */}
        {fixedRates.length > 0 && (
          <section className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Fixed Rate Mortgages</h2>
              <p className="text-gray-600 text-sm mt-1">Lock in your rate for the term of your mortgage</p>
            </div>
            <div className="divide-y divide-gray-100">
              {fixedRates.map((rate, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{getTermLabel(rate.term_months)}</div>
                    <div className="text-sm text-gray-500">{formatRateType(rate.mortgage_type)}</div>
                    {rate.ltv_tier && (
                      <div className="text-sm text-gray-600 mt-1">LTV: {rate.ltv_tier}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600">{rate.rate.toFixed(2)}%</div>
                    {rate.posted_rate && (
                      <div className="text-sm text-gray-500 line-through">
                        Posted: {rate.posted_rate.toFixed(2)}%
                      </div>
                    )}
                    {rate.apr && (
                      <div className="text-sm text-gray-600">APR: {rate.apr}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Variable Rates Section */}
        {variableRates.length > 0 && (
          <section className="bg-white rounded-lg shadow-md mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Variable Rate Mortgages</h2>
              <p className="text-gray-600 text-sm mt-1">Rates change with the prime rate</p>
            </div>
            <div className="divide-y divide-gray-100">
              {variableRates.map((rate, index) => (
                <div key={index} className="p-6 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <div className="font-semibold text-lg text-gray-900">{getTermLabel(rate.term_months)}</div>
                    <div className="text-sm text-gray-500">{formatRateType(rate.mortgage_type)}</div>
                    {rate.spread_to_prime && (
                      <div className="text-sm text-gray-600 mt-1">Spread: {rate.spread_to_prime}</div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">{rate.rate.toFixed(2)}%</div>
                    {rate.posted_rate && (
                      <div className="text-sm text-gray-500 line-through">
                        Posted: {rate.posted_rate.toFixed(2)}%
                      </div>
                    )}
                    {rate.apr && (
                      <div className="text-sm text-gray-600">APR: {rate.apr}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-blue-50 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Compare All Lenders</h2>
          <p className="text-gray-600 mb-4">
            See how {lenderName} rates compare to other Canadian banks and lenders
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Compare All Rates
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-500">
          <p>Rates are for comparison purposes only. Visit {lenderName}'s website for actual rates.</p>
          {
            (() => {
              const firstSourceUrl = lenderRates[0]?.source_url;
              return firstSourceUrl ? (
                <p className="mt-2">
                  Data source:{" "}
                  <a
                    href={firstSourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {lenderName} Official Website
                  </a>
                </p>
              ) : null;
            })()
          }
        </footer>
      </div>
    </main>
  );
}
