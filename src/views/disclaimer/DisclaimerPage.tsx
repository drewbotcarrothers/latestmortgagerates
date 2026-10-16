import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function DisclaimerPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Disclaimer</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>
          <p className="text-slate-600 mt-2">Last updated: October 9, 2026</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8 space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Not financial advice</h2>
            <p>
              LatestMortgageRates.ca publishes information so you can compare Canadian mortgage rates and learn the terms. It is not financial, legal, tax, or mortgage advice. It is not an offer to lend, a commitment to a rate, or a recommendation that any product is suitable for you. Decisions about a mortgage should be made with a qualified mortgage professional who can look at your file.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Rate accuracy</h2>
            <p>
              Rates on this site are copied from lenders’ public pages and can be incomplete, delayed, or withdrawn by the time you read them. A posted rate is not the rate you will be offered. Insurance, credit, down payment, property, and term all change the price. Always verify the current rate, fees, and conditions with the lender before you apply, sign, or renew.
            </p>
            <p className="mt-3">
              Self-reported figures on <a href="/real-mortgage-rates/" className="text-teal-700 hover:underline">Real Mortgage Rates</a> are unverified stories from public posts. They are not a survey of the market and not an offer. The <a href="/methodology/" className="text-teal-700 hover:underline">methodology</a> explains how those pages are compiled.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">The $29 mortgage guide</h2>
            <p>
              The mortgage negotiation guide sold for $29 CAD is our own product. We write it and sell it through Stripe. Buying it is optional. The rate comparison, calculators, glossary, and city notes stay free whether or not you buy the guide. The guide is educational material, not a personalized rate quote.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Cross-promotion and affiliates</h2>
            <p>
              Some pages link to <a href="https://canadiancreditcardfinder.com/" className="text-teal-700 hover:underline">canadiancreditcardfinder.com</a> (Canadian Credit Card Finder). That is a cross-promotion of a related site, not a paid placement and not an affiliate link.
            </p>
            <p className="mt-3">
              This site does not use affiliate links today. Lender names link to our own pages or, where marked, to the lender’s site so you can confirm a rate. If we add affiliate links in the future, we will disclose them on this page before they are published, and the link will be labeled so you can tell it is commercial.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Contact</h2>
            <p>
              Questions about this disclaimer, a rate on the site, or the mortgage guide go to{" "}
              <a href="mailto:contact@latestmortgagerates.ca" className="text-teal-700 hover:underline">contact@latestmortgagerates.ca</a>.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Advertising</h2>
            <p>
              Google AdSense may show ads, including Auto ads. Advertisers do not review our articles, and an ad next to a rate is not a recommendation. Cookie and opt-out details are in the <a href="/privacy/" className="text-teal-700 hover:underline">privacy policy</a>.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}
