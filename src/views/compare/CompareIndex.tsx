import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import RateHubLinks from "@/components/RateHubLinks";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import ratesData from "@data/rates.json";
import {
  type MortgageRate,
  compareContext,
  compareHref,
  formatPct,
  lenderComparisons,
  productComparisons,
} from "@/lib/compare";

export default function CompareIndex() {
  const rates = ratesData as MortgageRate[];
  const products = productComparisons();
  const lenders = lenderComparisons();

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Compare" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="rates" />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4 text-sm">
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
                <span>/</span>
                <span>Compare</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Compare Canadian mortgages</h1>
              <p className="text-xl text-slate-300">
                Mid-funnel guides for fixed vs variable, insured vs uninsured, and high-intent lender pairs. Live
                percentages come from the same daily feed as our rate hubs — we never invent a current rate.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Product comparisons</h2>
            <p className="text-slate-600 mb-4">
              Start here if you are choosing a structure, then jump into{" "}
              <a href="/rates/5-year-fixed/" className="text-teal-600 hover:underline font-medium">
                5-year fixed
              </a>
              ,{" "}
              <a href="/rates/variable/" className="text-teal-600 hover:underline font-medium">
                variable
              </a>
              ,{" "}
              <a href="/rates/insured/" className="text-teal-600 hover:underline font-medium">
                insured
              </a>
              , and{" "}
              <a href="/rates/uninsured/" className="text-teal-600 hover:underline font-medium">
                uninsured
              </a>{" "}
              hubs.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((page) => {
                const ctx = compareContext(rates, page);
                return (
                  <a
                    key={page.slug}
                    href={compareHref(page.slug)}
                    className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-sm transition"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {page.left.shortName} vs {page.right.shortName}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">{page.intro.slice(0, 180)}…</p>
                    <p className="text-sm text-teal-700 font-medium">
                      Live 5-year fixed: insured {formatPct(ctx.bestFixed5Insured)} · uninsured{" "}
                      {formatPct(ctx.bestFixed5Uninsured)}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Lender vs lender</h2>
            <p className="text-slate-600 mb-4">
              Pairs grounded in how Canadians actually shop this site: digital vs Big 5, bank vs bank, and digital vs
              digital. Each page uses real{" "}
              <a href="/" className="text-teal-600 hover:underline font-medium">
                lender slugs
              </a>{" "}
              from our feed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {lenders.map((page) => {
                const ctx = compareContext(rates, page);
                const left = ctx.leftLender;
                const right = ctx.rightLender;
                return (
                  <a
                    key={page.slug}
                    href={compareHref(page.slug)}
                    className="block bg-white rounded-xl border border-slate-200 p-6 hover:border-teal-300 hover:shadow-sm transition"
                  >
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {page.left.shortName} vs {page.right.shortName}
                    </h3>
                    <p className="text-slate-600 text-sm mb-4">{page.left.summary}</p>
                    <p className="text-sm text-teal-700 font-medium">
                      {left?.name}: {formatPct(left?.fixed5Insured || left?.fixed5Uninsured || left?.lowest)} ·{" "}
                      {right?.name}: {formatPct(right?.fixed5Insured || right?.fixed5Uninsured || right?.lowest)}
                    </p>
                  </a>
                );
              })}
            </div>
          </section>

          <div className="mb-8">
            <GuideCTA variant="compact" />
          </div>

          <AdUnit format="display" className="mt-12 mb-10" />

          <RateHubLinks className="mb-8" />

          <section className="card-default p-6 mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Tools to use with these guides</h2>
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
            </ul>
          </section>
        </div>

        <Footer />
      </main>
    </>
  );
}
