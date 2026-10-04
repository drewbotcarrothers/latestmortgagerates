import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import FAQSection from "@/components/FAQSection";
import GuideCTA from "@/components/GuideCTA";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CommunityDisclaimer from "@/components/community/CommunityDisclaimer";
import DumbbellChart from "@/components/community/DumbbellChart";
import DistributionChart from "@/components/community/DistributionChart";
import WeeklyTrendChart from "@/components/community/WeeklyTrendChart";
import {
  buildFaqs,
  buildTakeaways,
  chartProducts,
  communityRates,
  formatAsOf,
  formatRate,
  formatSpread,
  lenderName,
  productLabel,
  publicProducts,
} from "@/lib/communityRates";

export default function RealRatesPage() {
  const takeaways = buildTakeaways();
  const faqs = buildFaqs();
  const published = publicProducts("30d");
  const chart = chartProducts("30d");
  const recent = publicProducts("7d");
  const window30 = communityRates.windows["30d"];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Real Mortgage Rates" },
        ]}
      />
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="real-rates" />
        <section className="hero-gradient text-white">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
              <a href="/" className="hover:text-white">Home</a>
              <span className="mx-2">/</span>
              <span>Real mortgage rates</span>
            </nav>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-5xl">
              Real Mortgage Rates Canadians Are Getting
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">
              What mortgage rate are people getting, and what is a realistic mortgage rate in Canada?
              This page compares the median rate {communityRates.attribution} with the lowest posted rate and the Big-5 posted median.
            </p>
            <p className="mt-4 text-sm text-teal-100">
              As of {formatAsOf()} · {window30.from} to {window30.to} · {window30.usableRecords} reports · prime {formatRate(communityRates.prime)}
            </p>
          </div>
        </section>

        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
          <CommunityDisclaimer />

          <section className="card-default p-6" aria-labelledby="takeaways">
            <h2 id="takeaways" className="text-2xl font-bold text-slate-900">Key takeaways</h2>
            <ul className="mt-4 space-y-3 text-slate-700">
              {takeaways.map((line) => (
                <li key={line} className="leading-relaxed">{line}</li>
              ))}
            </ul>
          </section>

          <section className="card-default p-6" aria-labelledby="product-gap">
            <h2 id="product-gap" className="text-2xl font-bold text-slate-900">Reported median vs posted</h2>
            <p className="mt-2 text-slate-600">
              Big-5 posted median, then the lowest posted rate from any lender, then the median {communityRates.attribution}.
              Rates are rounded to the nearest 0.05. N is the unrounded count.
            </p>
            <div className="mt-6">
              <DumbbellChart products={chart} />
            </div>
            <div className="mt-8 overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="mb-2 text-left text-xs text-slate-500">
                  Public cells only: N at least {communityRates.thresholds.publicMinN}. As of {formatAsOf()}.
                </caption>
                <thead>
                  <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Product</th>
                    <th className="py-2 pr-3">N</th>
                    <th className="py-2 pr-3">Reported median</th>
                    <th className="py-2 pr-3">25th percentile</th>
                    <th className="py-2 pr-3">Lowest posted</th>
                    <th className="py-2 pr-3">Big-5 posted</th>
                    <th className="py-2">Vs Big-5</th>
                  </tr>
                </thead>
                <tbody>
                  {published.map((product) => (
                    <tr key={`${product.termMonths}-${product.rateType}-${product.insured}`} className="border-b border-slate-100">
                      <td className="py-3 pr-3 font-medium text-slate-900">{productLabel(product)}</td>
                      <td className="py-3 pr-3">{product.n}</td>
                      <td className="py-3 pr-3">{formatRate(product.median)}</td>
                      <td className="py-3 pr-3">{formatRate(product.p25)}</td>
                      <td className="py-3 pr-3">
                        {formatRate(product.lowestPosted)}
                        {product.lowestPostedLender ? ` (${lenderName(product.lowestPostedLender)})` : ""}
                      </td>
                      <td className="py-3 pr-3">{formatRate(product.big5PostedMedian)}</td>
                      <td className="py-3">{formatSpread(product.spreadVsBig5Median)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {recent.length > 0 && (
            <section className="card-default p-6" aria-labelledby="seven-day">
              <h2 id="seven-day" className="text-2xl font-bold text-slate-900">Last 7 days</h2>
              <p className="mt-2 text-sm text-slate-600">
                Same rule: a cell is shown only when N is at least {communityRates.thresholds.publicMinN}. Window {communityRates.windows["7d"].from} to {communityRates.windows["7d"].to}.
              </p>
              <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {recent.map((product) => (
                  <li key={`7-${product.termMonths}-${product.rateType}-${product.insured}`} className="rounded-lg bg-slate-50 px-4 py-3">
                    <p className="font-medium text-slate-900">{productLabel(product)}</p>
                    <p className="text-sm text-slate-600">
                      {formatRate(product.median)} · N = {product.n} · {formatSpread(product.spreadVsBig5Median)} Big-5 posted {formatRate(product.big5PostedMedian)}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="card-default p-6" aria-labelledby="distribution">
            <h2 id="distribution" className="text-2xl font-bold text-slate-900">Where reported 5-year rates land</h2>
            <p className="mt-2 text-slate-600">
              Each bar counts reports from the last 30 days, all insured statuses. Lines mark the reported median and the posted benchmarks.
            </p>
            <div className="mt-6">
              <DistributionChart />
            </div>
          </section>

          <section className="card-default p-6" aria-labelledby="weekly">
            <h2 id="weekly" className="text-2xl font-bold text-slate-900">Reported 5-year rates, week by week</h2>
            <p className="mt-2 text-slate-600">
              Weekly median {communityRates.attribution}. The dashed lines are a single posted snapshot, not a week-by-week posted history.
            </p>
            <div className="mt-6">
              <WeeklyTrendChart />
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <a href="/guides/negotiate-mortgage-rate/" className="card-default p-5 hover:border-teal-300">
              <h2 className="font-bold text-slate-900">How much below posted can you negotiate?</h2>
              <p className="mt-2 text-sm text-slate-600">Bank-by-bank gaps and a renewal script.</p>
            </a>
            <a href="/tools/renewal-offer-checker/" className="card-default p-5 hover:border-teal-300">
              <h2 className="font-bold text-slate-900">Check a renewal offer</h2>
              <p className="mt-2 text-sm text-slate-600">See the percentile of the rate you were offered.</p>
            </a>
            <a href="/methodology/" className="card-default p-5 hover:border-teal-300">
              <h2 className="font-bold text-slate-900">Methodology</h2>
              <p className="mt-2 text-sm text-slate-600">How reports are kept, how medians work, and the N rule.</p>
            </a>
          </section>

          <AdUnit format="display" />

          <FAQSection faqs={faqs} title="Real mortgage rate questions" />

          <GuideCTA />
        </div>
        <Footer />
      </main>
    </>
  );
}
