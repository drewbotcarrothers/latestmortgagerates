import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FAQSection from "@/components/FAQSection";
import RateHubLinks from "@/components/RateHubLinks";
import CompareLinks from "@/components/CompareLinks";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import LenderLogo from "@/components/LenderLogo";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import ratesData from "@data/rates.json";
import {
  type MortgageRate,
  type RatePick,
  COMPARE_INDEX_HREF,
  compareContext,
  formatPct,
  getComparison,
  lowerToday,
} from "@/lib/compare";

function RateCell({ pick }: { pick: RatePick | null }) {
  if (!pick) {
    return <span className="text-slate-400">—</span>;
  }
  return (
    <span>
      <span className="font-bold text-teal-700">{formatPct(pick)}</span>
    </span>
  );
}

function ProductRateCard({
  label,
  pick,
  href,
}: {
  label: string;
  pick: RatePick | null;
  href: string;
}) {
  return (
    <a
      href={href}
      className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:border-teal-300 transition-colors"
    >
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-3xl font-bold text-teal-600 mt-1">{formatPct(pick)}</p>
      <p className="text-sm text-slate-500 mt-1">
        {pick ? pick.lender_name : "Not in today's feed"}
      </p>
    </a>
  );
}

export default function ComparePage({ slug }: { slug: string }) {
  const page = getComparison(slug);
  if (!page) return null;

  const ctx = compareContext(ratesData as MortgageRate[], page);
  const faqs = page.faqs(ctx);
  const isLender = page.kind === "lender";

  const lenderRows = isLender
    ? [
        {
          label: "5-year fixed insured",
          left: ctx.leftLender?.fixed5Insured ?? null,
          right: ctx.rightLender?.fixed5Insured ?? null,
          hub: "/rates/insured/",
        },
        {
          label: "5-year fixed uninsured",
          left: ctx.leftLender?.fixed5Uninsured ?? null,
          right: ctx.rightLender?.fixed5Uninsured ?? null,
          hub: "/rates/uninsured/",
        },
        {
          label: "5-year variable insured",
          left: ctx.leftLender?.variable5Insured ?? null,
          right: ctx.rightLender?.variable5Insured ?? null,
          hub: "/rates/variable/",
        },
        {
          label: "5-year variable uninsured",
          left: ctx.leftLender?.variable5Uninsured ?? null,
          right: ctx.rightLender?.variable5Uninsured ?? null,
          hub: "/rates/variable/",
        },
      ]
    : [];

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Compare", url: COMPARE_INDEX_HREF },
          { name: `${page.left.shortName} vs ${page.right.shortName}` },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-teal-300 mb-4 text-sm">
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
                <span>/</span>
                <a href={COMPARE_INDEX_HREF} className="hover:text-white transition-colors">
                  Compare
                </a>
                <span>/</span>
                <span>
                  {page.left.shortName} vs {page.right.shortName}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.h1}</h1>
              <p className="text-xl text-slate-300">{page.intro}</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-sm text-slate-500 mb-6">
            Percentages below are live from our daily lender feed. A dash means that product is not in today&apos;s
            scrape — we do not invent a current rate. Always confirm with the lender.
          </p>

          {isLender && ctx.leftLender && ctx.rightLender ? (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">
                  Live {page.left.shortName} vs {page.right.shortName} rates
                </h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <a href={page.left.href} className="text-teal-600 hover:underline font-medium inline-flex items-center gap-2">
                    {page.left.lenderSlug && <LenderLogo lenderSlug={page.left.lenderSlug} size="sm" showText={false} />}
                    {page.left.name} page →
                  </a>
                  <a href={page.right.href} className="text-teal-600 hover:underline font-medium inline-flex items-center gap-2">
                    {page.right.lenderSlug && <LenderLogo lenderSlug={page.right.lenderSlug} size="sm" showText={false} />}
                    {page.right.name} page →
                  </a>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        {page.left.shortName}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        {page.right.shortName}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                        Lower in today&apos;s feed
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {lenderRows.map((row) => (
                      <tr key={row.label} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">
                          <a href={row.hub} className="hover:text-teal-700">
                            {row.label}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <RateCell pick={row.left} />
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <RateCell pick={row.right} />
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{lowerToday(row.left, row.right)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <ProductRateCard
                label="Best 5-year fixed insured"
                pick={ctx.bestFixed5Insured}
                href="/rates/5-year-fixed/"
              />
              <ProductRateCard
                label="Best 5-year fixed uninsured"
                pick={ctx.bestFixed5Uninsured}
                href="/rates/5-year-fixed/"
              />
              <ProductRateCard
                label="Best 5-year variable insured"
                pick={ctx.bestVariable5Insured}
                href="/rates/variable/"
              />
              <ProductRateCard
                label="Best 5-year variable uninsured"
                pick={ctx.bestVariable5Uninsured}
                href="/rates/variable/"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[page.left, page.right].map((side) => (
              <section key={side.name} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h2 className="text-2xl font-bold text-slate-900">When to choose {side.shortName}</h2>
                  {side.lenderSlug && <LenderLogo lenderSlug={side.lenderSlug} size="md" showText={false} />}
                </div>
                <p className="text-slate-600 mb-4">{side.summary}</p>
                <ul className="space-y-2 mb-4">
                  {side.whenToChoose.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-slate-600 text-sm">
                      <span className="text-teal-600 mt-0.5">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <a href={side.href} className="text-sm font-medium text-teal-600 hover:underline">
                  {isLender ? `View ${side.name} rates` : `Open ${side.name} rates`} →
                </a>
              </section>
            ))}
          </div>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-slate-900">
                {page.left.shortName} vs {page.right.shortName}: pros and cons
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
              {[page.left, page.right].map((side) => (
                <div key={side.name} className="p-6">
                  <h3 className="font-semibold text-slate-900 mb-3">{side.name}</h3>
                  <p className="text-xs uppercase tracking-wide text-emerald-700 font-semibold mb-2">Pros</p>
                  <ul className="space-y-2 mb-4">
                    {side.pros.map((item) => (
                      <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-emerald-600">+</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold mb-2">Cons</p>
                  <ul className="space-y-2">
                    {side.cons.map((item) => (
                      <li key={item} className="text-sm text-slate-600 flex items-start gap-2">
                        <span className="text-slate-400">−</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">How to decide</h2>
            <div className="space-y-6">
              {page.framework.map((step, index) => (
                <div key={step.heading} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">{step.heading}</h3>
                    <p className="text-slate-600">{step.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="mb-8">
            <GuideCTA variant="compact" />
          </div>

          <AdUnit format="display" className="mt-12 mb-10" />

          <RateHubLinks
            className="mb-8"
            title="Live rate hubs"
            description="Jump from this comparison into today's 5-year fixed, variable, insured, and uninsured tables."
          />

          <section className="card-default p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Calculators and the negotiation guide</h2>
            <p className="text-slate-600 mb-4">
              Run the payment, affordability, and stress-test numbers on a live contract rate, then use the mortgage
              guide when you negotiate.
            </p>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <li>
                <a href="/tools/mortgage-calculator/" className="text-teal-600 hover:underline font-medium text-sm">
                  Mortgage payment calculator
                </a>
              </li>
              <li>
                <a href="/tools/affordability-calculator/" className="text-teal-600 hover:underline font-medium text-sm">
                  Affordability calculator
                </a>
              </li>
              <li>
                <a href="/tools/stress-test-qualifier/" className="text-teal-600 hover:underline font-medium text-sm">
                  Stress-test qualifier
                </a>
              </li>
              <li>
                <a href="/mortgage-guide/" className="text-teal-600 hover:underline font-medium text-sm">
                  Mortgage negotiation guide
                </a>
              </li>
              {isLender && page.left.lenderSlug && (
                <li>
                  <a href={page.left.href} className="text-teal-600 hover:underline font-medium text-sm">
                    {page.left.name} lender page
                  </a>
                </li>
              )}
              {isLender && page.right.lenderSlug && (
                <li>
                  <a href={page.right.href} className="text-teal-600 hover:underline font-medium text-sm">
                    {page.right.name} lender page
                  </a>
                </li>
              )}
              <li>
                <a href="/rates/5-year-fixed/" className="text-teal-600 hover:underline font-medium text-sm">
                  5-year fixed rates
                </a>
              </li>
              <li>
                <a href="/rates/variable/" className="text-teal-600 hover:underline font-medium text-sm">
                  Variable rates
                </a>
              </li>
              <li>
                <a href="/rates/insured/" className="text-teal-600 hover:underline font-medium text-sm">
                  Insured rates
                </a>
              </li>
              <li>
                <a href="/rates/uninsured/" className="text-teal-600 hover:underline font-medium text-sm">
                  Uninsured rates
                </a>
              </li>
            </ul>
          </section>

          <CompareLinks currentSlug={page.slug} className="mb-8" />

          <FAQSection faqs={faqs} />

          <CalculatorRelatedTools currentTool={`/compare/${page.slug}/`} showRateHubs={false} />
        </div>

        <Footer />
      </main>
    </>
  );
}
