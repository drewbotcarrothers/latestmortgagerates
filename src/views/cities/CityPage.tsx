import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import SocialShare from "@/components/SocialShare";
import CityLendersSidebar from "@/components/CityLendersSidebar";
import CityTools from "@/components/CityTools";
import CityLocalContent from "@/components/CityLocalContent";
import { requireCity } from "@/lib/cities";
import { getCityContent } from "@/lib/cityContent";
import ratesData from "@data/rates.json";
import metadata from "@data/metadata.json";

interface Rate {
  lender_name: string;
  lender_slug: string;
  term_months: number;
  rate_type: string;
  rate: number;
  mortgage_type: string;
}

function bestRate(term: number, type: string): Rate | undefined {
  return (ratesData as Rate[])
    .filter((r) => r.term_months === term && r.rate_type === type)
    .sort((a, b) => a.rate - b.rate)[0];
}

function formatUpdated(iso?: string): string {
  if (!iso) return "daily";
  const normalized = /(?:Z|[+-]\d{2}:?\d{2})$/.test(iso) ? iso : `${iso}Z`;
  const d = new Date(normalized);
  if (Number.isNaN(d.getTime())) return "daily";
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

export default function CityPage({ slug }: { slug: string }) {
  const city = requireCity(slug);
  const content = getCityContent(slug);
  const bestFixed = bestRate(60, "fixed");
  const bestVariable = bestRate(60, "variable");
  const updated = formatUpdated(metadata?.last_updated);

  return (
    <main className="min-h-screen bg-slate-50">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Cities", url: "/cities/" },
          { name: city.name },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: content.seo.h1,
            description: content.seo.description,
            url: content.seo.canonical,
            isPartOf: {
              "@type": "WebSite",
              name: "Latest Mortgage Rates Canada",
              url: "https://latestmortgagerates.ca/",
            },
            about: {
              "@type": "City",
              name: city.name,
              containedInPlace: {
                "@type": "AdministrativeArea",
                name: content.provinceName,
              },
            },
          }),
        }}
      />

      <Header currentPage="rates" />

      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/" className="hover:text-teal-600">
                  Home
                </a>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li>
                <a href="/cities/" className="hover:text-teal-600">
                  Cities
                </a>
              </li>
              <li>
                <span className="text-slate-400">/</span>
              </li>
              <li className="text-slate-900 font-medium">{city.name}</li>
            </ol>
          </nav>
          <div className="flex flex-col gap-3">
            {!content.lttHasProvincialTax && (
              <div className="inline-flex w-fit items-center gap-2 bg-emerald-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                No provincial land transfer tax in {content.provinceName}
              </div>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{content.seo.h1}</h1>
            <p className="text-slate-600 text-lg">{content.heroTagline}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Current mortgage rates for {city.name} shoppers
              </h2>
              <p className="text-slate-600 mb-6">
                These are live national postings from lenders we track (updated {updated})—not a
                made-up “average {city.name} rate.” Lenders generally price the product and the
                borrower, not the city. Closing costs in {city.name} still follow{" "}
                {content.provinceName} tax rules below.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-teal-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Best 5-year fixed we track</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {bestFixed ? `${bestFixed.rate.toFixed(2)}%` : "See table"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {bestFixed
                      ? `${bestFixed.lender_name} · ${bestFixed.mortgage_type}`
                      : "Compare all lenders"}
                  </p>
                </div>
                <div className="bg-emerald-50 rounded-lg p-4">
                  <p className="text-sm text-slate-600">Best 5-year variable we track</p>
                  <p className="text-3xl font-bold text-emerald-600">
                    {bestVariable ? `${bestVariable.rate.toFixed(2)}%` : "See table"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {bestVariable
                      ? `${bestVariable.lender_name} · ${bestVariable.mortgage_type}`
                      : "Compare all lenders"}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="/"
                  className="block text-center px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
                >
                  Compare all live rates →
                </a>
                <a
                  href="/rates/5-year-fixed/"
                  className="block text-center px-6 py-3 border border-slate-200 rounded-lg font-medium text-slate-800 hover:border-teal-300 transition"
                >
                  5-year fixed hub
                </a>
              </div>
            </section>

            <CityLocalContent slug={slug} />
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-bold text-slate-900 mb-2">{city.name} payment calculator</h3>
              <p className="text-slate-600 text-sm mb-4">
                Model a monthly payment from your offer price—not from an invented city average.
              </p>
              <a
                href="/tools/mortgage-calculator/"
                className="block text-center px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition"
              >
                Calculate payments
              </a>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mt-6">
              <h3 className="font-bold text-slate-900 mb-4">Tools and rate hubs</h3>
              <ul className="space-y-2 text-sm">
                {content.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-teal-600 hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <CityLendersSidebar cityName={city.name} />
          </aside>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-bold text-slate-900 mb-2">Share {city.name} mortgage rates</h3>
          <p className="text-slate-600 text-sm mb-4">
            Send someone the live comparison plus {content.provinceName} closing-cost notes.
          </p>
          <SocialShare
            url={content.seo.canonical}
            title={content.seo.h1}
            description={content.seo.description}
          />
        </div>
      </div>

      <CityTools cityName={city.name} province={content.provinceName} />
      <Footer />
    </main>
  );
}
