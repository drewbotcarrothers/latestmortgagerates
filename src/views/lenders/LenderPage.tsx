import LenderLogo from "@/components/LenderLogo";
import Navigation from "@/components/Navigation";
import FAQSection from "@/components/FAQSection";
import RateHubLinks from "@/components/RateHubLinks";
import GuideCTA from "@/components/GuideCTA";

// Force static generation for static export

// Import rates data
import ratesData from "@data/rates.json";

// Import lender content data
import lenderContentData from "@/content/lenderContent.json";

interface LenderProduct {
  title: string;
  description: string;
}

interface LenderFaq {
  question: string;
  answer: string;
}

interface LenderRelatedLink {
  href: string;
  label: string;
}

interface LenderContent {
  name: string;
  tagline: string;
  overview: string;
  specialties: string[];
  uniqueFeatures: string[];
  seoKeywords: string[];
  heroIntro?: string;
  whoItsFor?: string;
  products?: LenderProduct[];
  howRatesCompare?: string;
  shoppingTips?: string[];
  faqs?: LenderFaq[];
  relatedLinks?: LenderRelatedLink[];
}

// Get lender content by slug
function getLenderContent(slug: string): LenderContent | null {
  const content = (lenderContentData as Record<string, LenderContent>)[slug];
  return content || null;
}

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

// Generate dynamic metadata for SEO

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
  const pageUrl = `https://latestmortgagerates.ca/lenders/${slug}/`;

  // Do not emit AggregateRating / Review markup. Mortgage percentages are not
  // 1–5 star reviews; GSC flagged ratingValue out of range and missing reviewCount.
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: `${lenderName} Mortgage`,
    description: `Current ${lenderName} mortgage rates in Canada. Compare fixed and variable terms.`,
    url: pageUrl,
    provider: {
      "@type": "BankOrCreditUnion",
      name: lenderName,
      url: rates.find((r) => r.source_url)?.source_url || pageUrl,
    },
    interestRate: {
      "@type": "QuantitativeValue",
      value: Number(lowestRate.toFixed(2)),
      unitText: "PERCENT",
    },
  };
}

export default function LenderPage({ slug }: { slug: string }) {
  const lenderRates = (ratesData as Rate[]).filter((r) => r.lender_slug === slug);
  
  if (lenderRates.length === 0) {
    return null;
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
  
  // Build rate matrix data for the overview table
  const allTerms = [...new Set(lenderRates.map(r => r.term_months))].sort((a, b) => a - b);
  const rateMatrix = allTerms.map(term => {
    const termRates = lenderRates.filter(r => r.term_months === term);
    const fixedInsured = termRates
      .filter(r => r.rate_type === "fixed" && r.mortgage_type === "insured")
      .sort((a, b) => a.rate - b.rate)[0];
    const fixedUninsured = termRates
      .filter(r => r.rate_type === "fixed" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];
    const varInsured = termRates
      .filter(r => r.rate_type === "variable" && r.mortgage_type === "insured")
      .sort((a, b) => a.rate - b.rate)[0];
    const varUninsured = termRates
      .filter(r => r.rate_type === "variable" && r.mortgage_type === "uninsured")
      .sort((a, b) => a.rate - b.rate)[0];
    return { term, label: getTermLabel(term), fixedInsured, fixedUninsured, varInsured, varUninsured };
  });
  
  const structuredData = generateStructuredData(lenderName, lenderRates, slug);
  const content = getLenderContent(slug);

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
                <a href="/" className="hover:text-teal-600 transition">
                  Home
                </a>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li>
                <a href="/#lenders" className="hover:text-teal-600 transition">
                  Lenders
                </a>
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
                  {content?.heroIntro || `Compare current ${lenderName} mortgage rates in Canada`}
                </p>
                {content?.tagline ? (
                  <p className="text-teal-700 font-medium mt-1 text-sm">{content.tagline}</p>
                ) : null}
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

        {/* Rate Matrix — All Terms Overview */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Rate Overview</h2>
                <p className="text-slate-500 text-sm mt-1">Best rate for each term and product type</p>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Best
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-slate-300"></span> Not offered
                </span>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50">
                  <th className="text-left px-6 py-3 font-semibold text-slate-700">Term</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Fixed Insured</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Fixed Uninsured</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Variable Insured</th>
                  <th className="text-center px-4 py-3 font-semibold text-slate-700">Variable Uninsured</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {rateMatrix.map(({ term, label, fixedInsured, fixedUninsured, varInsured, varUninsured }) => {
                  const rowRates = [fixedInsured, fixedUninsured, varInsured, varUninsured].filter(Boolean) as Rate[];
                  const bestRowRate = rowRates.length > 0 ? Math.min(...rowRates.map(r => r.rate)) : Infinity;
                  return (
                  <tr key={term} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{label}</td>
                    
                    <td className="px-4 py-4 text-center">
                      {fixedInsured ? (
                        <div>
                          <span className={`font-bold text-lg ${
                            fixedInsured.rate === bestRowRate ? "text-emerald-600" : "text-slate-700"
                          }`}>
                            {fixedInsured.rate.toFixed(2)}%
                          </span>
                          {fixedInsured.posted_rate && (
                            <span className="block text-xs text-slate-400 line-through">{fixedInsured.posted_rate.toFixed(2)}%</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {fixedUninsured ? (
                        <div>
                          <span className={`font-bold text-lg ${
                            fixedUninsured.rate === bestRowRate ? "text-emerald-600" : "text-slate-700"
                          }`}>
                            {fixedUninsured.rate.toFixed(2)}%
                          </span>
                          {fixedUninsured.posted_rate && (
                            <span className="block text-xs text-slate-400 line-through">{fixedUninsured.posted_rate.toFixed(2)}%</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {varInsured ? (
                        <div>
                          <span className={`font-bold text-lg ${
                            varInsured.rate === bestRowRate ? "text-emerald-600" : "text-slate-700"
                          }`}>
                            {varInsured.rate.toFixed(2)}%
                          </span>
                          {varInsured.spread_to_prime && (
                            <span className="block text-xs text-teal-600">{varInsured.spread_to_prime}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    
                    <td className="px-4 py-4 text-center">
                      {varUninsured ? (
                        <div>
                          <span className={`font-bold text-lg ${
                            varUninsured.rate === bestRowRate ? "text-emerald-600" : "text-slate-700"
                          }`}>
                            {varUninsured.rate.toFixed(2)}%
                          </span>
                          {varUninsured.spread_to_prime && (
                            <span className="block text-xs text-teal-600">{varUninsured.spread_to_prime}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

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

        <div className="mb-8">
          <GuideCTA variant="compact" />
        </div>

        {/* Lender Overview */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 mb-8 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100 flex items-center justify-center">
                  <span className="text-2xl font-bold text-teal-700">{lenderName.charAt(0)}</span>
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">About {lenderName}</h2>
                
                <div className="prose prose-slate max-w-none">
                  <div className="text-slate-600 leading-relaxed">
                    {(() => {
                      const content = getLenderContent(slug);
                      if (content) {
                        return <div dangerouslySetInnerHTML={{ __html: content.overview }} />;
                      }
                      return (
                        <div>
                          <p>{lenderName} is a Canadian mortgage lender offering competitive rates and flexible mortgage products. 
                          Their mortgage solutions cater to first-time homebuyers, renewals, refinances, and investment properties.</p>
                          <p>Compare {lenderName} mortgage rates above to find the best option for your home financing needs. 
                          Their product lineup includes fixed-rate and variable-rate mortgages with various term lengths.</p>
                        </div>
                      );
                    })()}
                  </div>
                  
                  {(() => {
                    const content = getLenderContent(slug);
                    if (!content) return null;
                    return (
                      <>
                        {content.specialties?.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Mortgage Specialties</h3>
                            <div className="flex flex-wrap gap-2">
                              {content.specialties.map((specialty: string) => (
                                <span
                                  key={specialty}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-teal-50 text-teal-700 border border-teal-100"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {content.uniqueFeatures?.length > 0 && (
                          <div className="mt-6">
                            <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wide mb-3">Unique Features</h3>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {content.uniqueFeatures.map((feature: string) => (
                                <li key={feature} className="flex items-start gap-2 text-slate-600">
                                  <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                                  </svg>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>
          </div>
        </section>

        {(() => {
          const content = getLenderContent(slug);
          if (!content) return null;
          const hasDepth =
            Boolean(content.whoItsFor) ||
            Boolean(content.products?.length) ||
            Boolean(content.howRatesCompare) ||
            Boolean(content.shoppingTips?.length) ||
            Boolean(content.faqs?.length) ||
            Boolean(content.relatedLinks?.length);
          if (!hasDepth) return null;

          return (
            <div className="space-y-8 mb-8">
              {content.whoItsFor && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">Who {lenderName} mortgages are for</h2>
                  <div
                    className="text-slate-600 leading-relaxed space-y-3 [&_a]:text-teal-600 [&_a]:font-medium [&_a]:hover:underline [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: content.whoItsFor }}
                  />
                </section>
              )}

              {content.products && content.products.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Mortgage products</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {content.products.map((product) => (
                      <div key={product.title} className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h3 className="font-semibold text-slate-900 mb-2">{product.title}</h3>
                        <p className="text-sm text-slate-600">{product.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {content.howRatesCompare && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-3">How {lenderName} rates typically compare</h2>
                  <div
                    className="text-slate-600 leading-relaxed space-y-3 [&_a]:text-teal-600 [&_a]:font-medium [&_a]:hover:underline [&_p]:mb-3"
                    dangerouslySetInnerHTML={{ __html: content.howRatesCompare }}
                  />
                </section>
              )}

              {content.shoppingTips && content.shoppingTips.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Tips for shopping a {lenderName} mortgage</h2>
                  <ul className="space-y-3">
                    {content.shoppingTips.map((tip) => (
                      <li key={tip} className="flex items-start gap-2 text-slate-600">
                        <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {content.faqs && content.faqs.length > 0 && (
                <FAQSection faqs={content.faqs} />
              )}

              {content.relatedLinks && content.relatedLinks.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8">
                  <h2 className="text-xl font-bold text-slate-900 mb-3">Compare rates and tools</h2>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {content.relatedLinks.map((link) => (
                      <li key={link.href}>
                        <a href={link.href} className="text-teal-600 hover:underline font-medium text-sm">
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
          );
        })()}

        {(() => {
          const content = getLenderContent(slug);
          if (content?.relatedLinks?.length) return null;
          return (
            <RateHubLinks
              className="mb-8"
              title={`Compare ${lenderName} against the market`}
              description={`See how ${lenderName} stacks up on 5-year fixed, variable, insured, and uninsured rates.`}
            />
          );
        })()}

        {/* Related Content */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Popular Cities */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <h3 className="font-bold text-slate-900">Popular Cities</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">See {lenderName} rates in major Canadian markets</p>
            <div className="space-y-2">
              {[
                { href: "/cities/toronto/", label: "Toronto", province: "ON" },
                { href: "/cities/vancouver/", label: "Vancouver", province: "BC" },
                { href: "/cities/calgary/", label: "Calgary", province: "AB" },
                { href: "/cities/montreal/", label: "Montreal", province: "QC" },
                { href: "/cities/ottawa/", label: "Ottawa", province: "ON" },
                { href: "/cities/edmonton/", label: "Edmonton", province: "AB" },
              ].map((city) => (
                <a
                  key={city.href}
                  href={city.href}
                  className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-slate-700 group-hover:text-teal-700 text-sm">{city.label}</span>
                  <span className="text-xs text-slate-400">{city.province}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Related Tools */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/>
              </svg>
              <h3 className="font-bold text-slate-900">Useful Tools</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">Calculate payments and affordability</p>
            <div className="space-y-2">
              {[
                { href: "/tools/mortgage-calculator/", label: "Payment Calculator", desc: "Monthly payments" },
                { href: "/tools/affordability-calculator/", label: "Affordability", desc: "How much home?" },
                { href: "/tools/closing-costs-calculator/", label: "Closing Costs", desc: "Fees to close" },
                { href: "/tools/stress-test-qualifier/", label: "Stress Test", desc: "Qualify?" },
                { href: "/tools/", label: "All calculators", desc: "10 free tools" },
              ].map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="block p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-slate-700 group-hover:text-teal-700 text-sm font-medium">{tool.label}</span>
                  <span className="text-xs text-slate-400 ml-2">{tool.desc}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Related Lenders */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
              </svg>
              <h3 className="font-bold text-slate-900">Compare Lenders</h3>
            </div>
            <p className="text-sm text-slate-500 mb-4">See how {lenderName} stacks up</p>
            <div className="space-y-2">
              {(() => {
                const allLenders = [...new Set((ratesData as Rate[]).map((r: Rate) => r.lender_slug))].sort();
                // Filter out current lender and pick first 6
                const related = allLenders.filter((l: string) => l !== slug).slice(0, 6);
                return related.map((lenderSlug: string) => {
                  const lender = (ratesData as Rate[]).find((r: Rate) => r.lender_slug === lenderSlug);
                  return lender ? (
                    <a
                      key={lenderSlug}
                      href={`/lenders/${lenderSlug}/`}
                      className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <span className="text-slate-700 group-hover:text-teal-700 text-sm">{lender.lender_name}</span>
                      <svg className="w-4 h-4 text-slate-300 group-hover:text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </a>
                  ) : null;
                });
              })()}
            </div>
            <a
              href="/"
              className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View All Lenders
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-teal-50 rounded-xl p-6 text-center border border-teal-100">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Compare All Lenders</h2>
          <p className="text-slate-600 mb-4">
            See how {lenderName} rates compare to other Canadian banks and lenders
          </p>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
          >
            Compare All Rates
          </a>
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
