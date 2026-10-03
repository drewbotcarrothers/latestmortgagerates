import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CommunityDisclaimer from "@/components/community/CommunityDisclaimer";
import { communityRates, formatAsOf, formatRate } from "@/lib/communityRates";

export default function MethodologyPage() {
  const window30 = communityRates.windows["30d"];
  const window7 = communityRates.windows["7d"];
  const weekly = communityRates.weekly;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Real Mortgage Rates", url: "/real-mortgage-rates/" },
          { name: "Methodology" },
        ]}
      />
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="real-rates" />
        <article className="mx-auto max-w-3xl px-4 py-10">
          <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
            <a href="/" className="hover:text-slate-800">Home</a>
            <span className="mx-2">/</span>
            <a href="/real-mortgage-rates/" className="hover:text-slate-800">Real mortgage rates</a>
            <span className="mx-2">/</span>
            <span>Methodology</span>
          </nav>
          <h1 className="text-4xl font-bold text-slate-900">How real mortgage rates are compiled</h1>
          <p className="mt-4 text-lg text-slate-600">
            As of {formatAsOf()}. The pages that quote these rates read one data file. A later update replaces that file; the wording below describes the rules, not a second set of numbers.
          </p>

          <div className="mt-8 space-y-8 text-slate-700 leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-slate-900">How reports are collected</h2>
              <p className="mt-3">
                We keep mortgage rates that Canadian borrowers describe in public online posts when they mention an approval, a renewal, or an offer they received.
                The published file does not include the original wording, account names, or links. A row is kept only when the post states a rate, a term, and whether the rate is fixed or variable, and the context reads as an offer the person got rather than a question, a forecast, a payment on a mortgage they already have, or a quote of a lender&apos;s advertised rate.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">What is extracted</h2>
              <p className="mt-3">
                Each kept report stores the rate, the term, fixed or variable, the lender when the person names one, and insured status only when they state it.
                Many people never say whether the mortgage is insured, insurable, or uninsured. Those reports stay in an &quot;insured status not stated&quot; group. That group is compared with every posted rate for the same term and type, not only the insured shelf or the uninsured shelf.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Medians, windows, and N</h2>
              <p className="mt-3">
                The median is the midpoint of the rates in the window. The 30-day window is {window30.from} to {window30.to} ({window30.usableRecords} reports). The 7-day window is {window7.from} to {window7.to} ({window7.usableRecords} reports).
                The weekly chart uses weeks starting Monday from {weekly.from} to {weekly.to}, and only plots a week when that series has N of at least {communityRates.thresholds.chartMinN}.
              </p>
              <p className="mt-3">
                A public table cell is shown only when N is at least {communityRates.thresholds.publicMinN}. A chart may include a cell with N from {communityRates.thresholds.chartMinN} to {communityRates.thresholds.publicMinN - 1} when the label says the sample is small.
                N on the page is the unrounded count. Rates and gaps are rounded to the nearest 0.05 percentage point for display.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">Posted rates and prime</h2>
              <p className="mt-3">
                Posted rates are the rates in our lender snapshot for the same day as this file, not a second survey. &quot;Lowest posted&quot; is the lowest snapshot rate for that term and type. &quot;Big-5 posted median&quot; is the median of TD, RBC, CIBC, BMO, and Scotiabank rates in that comparison.
                On a bank page, the posted dot is that bank&apos;s uninsured rate for the term and type. If the snapshot has no such rate, the comparison is omitted.
              </p>
              <p className="mt-3">
                Variable reports are stored as an effective rate: prime minus the discount the person described. This file assumes prime is {formatRate(communityRates.prime)}. If prime changes, variable effective rates in a future file change with it. The discount itself is what was reported.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900">What this is not</h2>
              <p className="mt-3">
                {communityRates.disclaimer} The rates were {communityRates.attribution}. They are not a representative survey of every Canadian mortgage, they are not weighted by balance or province, and a single unusual report can move a small cell. That is why cells under N = {communityRates.thresholds.publicMinN} stay off the public tables.
              </p>
            </section>
          </div>

          <CommunityDisclaimer className="mt-8" />
          <p className="mt-6 text-sm">
            <a href="/real-mortgage-rates/" className="font-semibold text-teal-700 hover:underline">Back to real mortgage rates</a>
          </p>
          <AdUnit format="display" className="mt-8" />
        </article>
        <Footer />
      </main>
    </>
  );
}
