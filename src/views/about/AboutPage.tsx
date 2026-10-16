import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">About</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">About LatestMortgageRates.ca</h1>
          <p className="text-slate-600 mt-2">Who runs this site, what it is for, and how the rate tables are built.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Who runs this site</h2>
            <p>
              LatestMortgageRates.ca is run by Andrew. Andrew researches Canadian mortgage rates, writes the guides on this site, and maintains the comparison tables. The byline on lender, city, and rate pages is Andrew. This is an independent publishing project, not a bank, broker, or lender.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Mission</h2>
            <p>
              The mission is to make Canadian mortgage rates easier to compare. Posted rates are scattered across bank and monoline websites, and the number on a billboard is often not the number a borrower is offered. This site puts those public rates in one table, explains the terms that change the payment, and points to free calculators for payments, the stress test, and closing costs.
            </p>
            <p className="mt-3">
              Nothing here is a rate offer, a pre-approval, or a recommendation to pick a lender. Read the <a href="/disclaimer/" className="text-teal-700 hover:underline">disclaimer</a> before you rely on a figure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">How rate data is collected</h2>
            <p>
              The comparison tables use rates that lenders publish on their own websites. We collect those public pages into a snapshot, label each row by lender, term, fixed or variable, and insured or uninsured when the source page says so, and show that snapshot on the homepage and on the lender and rate-hub pages. A row is a published posting, not a quote for your file.
            </p>
            <p className="mt-3">
              A separate set of pages, Real Mortgage Rates, summarizes rates that Canadian borrowers describe in public posts. Those figures are self-reported and unverified. The rules for what is kept, how medians are calculated, and the sample-size cutoff are written up on the <a href="/methodology/" className="text-teal-700 hover:underline">methodology</a> page. Posted rates and reported rates are not mixed into one average.
            </p>
            <p className="mt-3">
              City pages use the same national posted rates. We do not publish a city average rate or a city average sale price. Local notes cover taxes and programs that actually differ by province or municipality.
            </p>
          </section>

          <section id="editorial-policy">
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Editorial policy</h2>
            <p>
              Andrew writes and reviews the editorial pages. Rate tables are ordered from the snapshot, not arranged to favor a lender. Lenders do not pay for a higher position, a badge, or removal from the table.
            </p>
            <ul className="list-disc pl-5 mt-3 space-y-2">
              <li>Corrections: if a rate, tax figure, or explanation is wrong, email <a href="mailto:contact@latestmortgagerates.ca" className="text-teal-700 hover:underline">contact@latestmortgagerates.ca</a> and we will check the source page.</li>
              <li>Advertising: the site uses Google AdSense, including Auto ads. Ads are labeled by Google. An ad is not an endorsement of the advertiser.</li>
              <li>Our own product: the $29 mortgage guide linked from some pages is a PDF we publish and sell. It is optional. The rate tables and calculators stay free.</li>
              <li>Other sites: we link to <a href="https://canadiancreditcardfinder.com/" className="text-teal-700 hover:underline">Canadian Credit Card Finder</a> as a cross-promotion. See the <a href="/disclaimer/" className="text-teal-700 hover:underline">disclaimer</a> for affiliate disclosure.</li>
              <li>Review: lender, city, and rate-hub pages show a “Last reviewed” date, which is the date that version of the page was built.</li>
            </ul>
            <p className="mt-3">
              Privacy requests go to <a href="mailto:contact@latestmortgagerates.ca" className="text-teal-700 hover:underline">contact@latestmortgagerates.ca</a>. The <a href="/privacy/" className="text-teal-700 hover:underline">privacy policy</a> explains cookies, AdSense, and PIPEDA rights.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}
