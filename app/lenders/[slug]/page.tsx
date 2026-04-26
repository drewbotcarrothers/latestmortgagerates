import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LenderLogo from "../../components/LenderLogo";
import Navigation from "../../components/Navigation";

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
  
  // Group rates for display
  const fixedRates = sortedRates.filter((r) => r.rate_type === "fixed");
  const variableRates = sortedRates.filter((r) => r.rate_type === "variable");
  
  // Get best rates
  const bestFixed = fixedRates[0];
  const bestVariable = variableRates[0];
  
  // Best 5-year rates by mortgage type (for hero cards)
  const bestFixed5YInsured = fixedRates.find((r) => r.term_months === 60 && r.mortgage_type === "insured");
  const bestFixed5YUninsured = fixedRates.find((r) => r.term_months === 60 && r.mortgage_type === "uninsured");
  const bestVariable5YInsured = variableRates.find((r) => r.term_months === 60 && r.mortgage_type === "insured");
  const bestVariable5YUninsured = variableRates.find((r) => r.term_months === 60 && r.mortgage_type === "uninsured");
  
  // Helper to group rates by term
  function groupByTerm(rates: Rate[]) {
    const groups: Record<number, Rate[]> = {};
    for (const r of rates) {
      if (!groups[r.term_months]) groups[r.term_months] = [];
      groups[r.term_months].push(r);
    }
    // Sort terms ascending
    return Object.entries(groups)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .map(([term, rates]) => ({ term: parseInt(term), rates: rates.sort((a, b) => a.rate - b.rate) }));
  }
  
  const fixedByTerm = groupByTerm(fixedRates);
  const variableByTerm = groupByTerm(variableRates);

  function RateCard({ rate, isBest }: { rate: Rate; isBest?: boolean }) {
    return (
      <div className={`relative rounded-xl p-5 border transition-all duration-200 ${
        isBest 
          ? "bg-emerald-50/80 border-emerald-200 shadow-sm" 
          : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
      }`}>
        {isBest && (
          <div className="absolute -top-2.5 left-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white shadow-sm">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Best Rate
            </span>
          </div>
        )}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                rate.mortgage_type === "insured" 
                  ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                  : "bg-slate-100 text-slate-700 border border-slate-200"
              }`}>
                {formatRateType(rate.mortgage_type)}
              </span>
              {rate.ltv_tier && (
                <span className="text-xs text-slate-500">{rate.ltv_tier}</span>
              )}
            </div>
            <div className="text-sm text-slate-500">
              {rate.rate_type === "variable" && rate.spread_to_prime 
                ? <span>Spread: {rate.spread_to_prime}</span> 
                : null}
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${isBest ? "text-emerald-600" : "text-slate-900"}`}>
              {rate.rate.toFixed(2)}%
            </div>
            {rate.posted_rate && (
              <div className="text-sm text-slate-400 line-through">
                {rate.posted_rate.toFixed(2)}%
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          {rate.apr && (
            <span className="text-xs text-slate-500">APR {rate.apr}%</span>
          )}
          {rate.source_url && (
            <a
              href={rate.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto inline-flex items-center gap-1 text-sm font-medium text-teal-600 hover:text-teal-700 transition"
            >
              Get This Rate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    );
  }
  
  const structuredData = generateStructuredData(lenderName, lenderRates, slug);

  return (
    <main className="min-h-screen bg-slate-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Breadcrumb Navigation */}
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <Link href="/" className="hover:text-teal-600 transition">
                  Home
                </Link>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li>
                <Link href="/#lenders" className="hover:text-teal-600 transition">
                  Lenders
                </Link>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li className="text-slate-900 font-medium">{lenderName}</li>
            </ol>
          </nav>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <LenderLogo lenderSlug={slug} size="lg" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">{lenderName} Mortgage Rates</h1>
                <p className="text-slate-600 mt-1">
                  Compare current {lenderName} mortgage rates in Canada
                </p>
              </div>
            </div>
            <Navigation currentPage="rates" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Best Rates Hero — 4-card layout matching homepage */}
        <div className="hero-gradient rounded-2xl p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h2 className="text-lg font-medium text-slate-200 tracking-wide uppercase">Best {lenderName} Rates</h2>
            <p className="text-sm text-slate-400 mt-1 md:mt-0">Lowest rates by product type</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Fixed Insured */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  5-Year Fixed
                </h3>
                <span className="text-xs text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded">Insured</span>
              </div>
              {bestFixed5YInsured ? (
                <>
                  <div className="text-3xl font-bold text-emerald-300 mb-1">{bestFixed5YInsured.rate.toFixed(2)}%</div>
                  <p className="text-slate-300 text-sm">{formatRateType(bestFixed5YInsured.mortgage_type)}</p>
                  {bestFixed5YInsured.posted_rate && (
                    <p className="text-xs text-slate-400 line-through mt-1">Posted: {bestFixed5YInsured.posted_rate.toFixed(2)}%</p>
                  )}
                  {bestFixed5YInsured.source_url && (
                    <a
                      href={bestFixed5YInsured.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-1.5 bg-white/20 text-white text-sm rounded-lg font-medium hover:bg-white/30 transition"
                    >
                      View Rate
                    </a>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm">No rate available</p>
              )}
            </div>
            
            {/* Fixed Uninsured */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  5-Year Fixed
                </h3>
                <span className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded">Uninsured</span>
              </div>
              {bestFixed5YUninsured ? (
                <>
                  <div className="text-3xl font-bold text-slate-200 mb-1">{bestFixed5YUninsured.rate.toFixed(2)}%</div>
                  <p className="text-slate-300 text-sm">{formatRateType(bestFixed5YUninsured.mortgage_type)}</p>
                  {bestFixed5YUninsured.posted_rate && (
                    <p className="text-xs text-slate-400 line-through mt-1">Posted: {bestFixed5YUninsured.posted_rate.toFixed(2)}%</p>
                  )}
                  {bestFixed5YUninsured.source_url && (
                    <a
                      href={bestFixed5YUninsured.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-1.5 bg-white/20 text-white text-sm rounded-lg font-medium hover:bg-white/30 transition"
                    >
                      View Rate
                    </a>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm">No rate available</p>
              )}
            </div>
            
            {/* Variable Insured */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  5-Year Variable
                </h3>
                <span className="text-xs text-teal-300 bg-teal-500/20 px-2 py-0.5 rounded">Insured</span>
              </div>
              {bestVariable5YInsured ? (
                <>
                  <div className="text-3xl font-bold text-teal-300 mb-1">{bestVariable5YInsured.rate.toFixed(2)}%</div>
                  <p className="text-slate-300 text-sm">{formatRateType(bestVariable5YInsured.mortgage_type)}</p>
                  {bestVariable5YInsured.spread_to_prime && (
                    <p className="text-xs text-teal-300 mt-1">Spread: {bestVariable5YInsured.spread_to_prime}</p>
                  )}
                  {bestVariable5YInsured.source_url && (
                    <a
                      href={bestVariable5YInsured.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-1.5 bg-white/20 text-white text-sm rounded-lg font-medium hover:bg-white/30 transition"
                    >
                      View Rate
                    </a>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm">No rate available</p>
              )}
            </div>
            
            {/* Variable Uninsured */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/10">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-teal-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  5-Year Variable
                </h3>
                <span className="text-xs text-slate-300 bg-slate-500/20 px-2 py-0.5 rounded">Uninsured</span>
              </div>
              {bestVariable5YUninsured ? (
                <>
                  <div className="text-3xl font-bold text-slate-200 mb-1">{bestVariable5YUninsured.rate.toFixed(2)}%</div>
                  <p className="text-slate-300 text-sm">{formatRateType(bestVariable5YUninsured.mortgage_type)}</p>
                  {bestVariable5YUninsured.spread_to_prime && (
                    <p className="text-xs text-teal-300 mt-1">Spread: {bestVariable5YUninsured.spread_to_prime}</p>
                  )}
                  {bestVariable5YUninsured.source_url && (
                    <a
                      href={bestVariable5YUninsured.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-1.5 bg-white/20 text-white text-sm rounded-lg font-medium hover:bg-white/30 transition"
                    >
                      View Rate
                    </a>
                  )}
                </>
              ) : (
                <p className="text-slate-400 text-sm">No rate available</p>
              )}
            </div>
          </div>
        </div>

        {/* Fixed Rates — Grouped by Term */}
        {fixedByTerm.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Fixed Rate Mortgages</h2>
                <p className="text-slate-500 text-sm">Lock in your rate for the term of your mortgage</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {fixedByTerm.map(({ term, rates }) => (
                <div key={term} id={`fixed-${term}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{getTermLabel(term)}</h3>
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-xs text-slate-400">{rates.length} option{rates.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rates.map((rate, idx) => (
                      <RateCard key={idx} rate={rate} isBest={idx === 0} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Variable Rates — Grouped by Term */}
        {variableByTerm.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Variable Rate Mortgages</h2>
                <p className="text-slate-500 text-sm">Rates change with the prime rate</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {variableByTerm.map(({ term, rates }) => (
                <div key={term} id={`variable-${term}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">{getTermLabel(term)}</h3>
                    <div className="flex-1 h-px bg-slate-200"></div>
                    <span className="text-xs text-slate-400">{rates.length} option{rates.length > 1 ? "s" : ""}</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {rates.map((rate, idx) => (
                      <RateCard key={idx} rate={rate} isBest={idx === 0} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Compare All Lenders</h2>
          <p className="text-slate-600 mb-4">
            See how {lenderName} rates compare to other Canadian banks and lenders
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Compare All Rates
          </Link>
        </section>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-slate-500">
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
                    className="text-teal-600 hover:underline"
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
