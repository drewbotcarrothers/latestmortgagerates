import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { DISCOVERY_LINKS } from "@/lib/discoveryLinks";
import { publishedRates } from "@/lib/publishedRates";

const lenders = [...new Map(
  publishedRates.map((row) => [row.lender_slug, row.lender_name] as const),
).entries()].sort((a, b) => a[1].localeCompare(b[1]));

export default function LendersIndex() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="lenders" />
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span>Lenders</span>
          </nav>
          <h1 className="text-4xl font-bold">Mortgage lenders in Canada</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Every lender in the daily rate scrape has a page. The figures on those pages are the quotes we captured, split by term and by insured or uninsured when the source labelled them.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Where to start</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            <a href="/lenders/scotiabank/" className="text-teal-700 font-medium hover:underline">Scotiabank mortgage rates</a> are the Big 5 bank page, including the Scotia Total Equity Plan.
            <a href="/lenders/simplii/" className="text-teal-700 font-medium hover:underline"> Simplii mortgage rates</a> are CIBC’s no-branch division.
            <a href="/lenders/nesto/" className="text-teal-700 font-medium hover:underline"> nesto mortgage rates</a> and <a href="/lenders/cmls/" className="text-teal-700 font-medium hover:underline">CMLS mortgage rates</a> are broker-channel lenders; nesto has owned CMLS since June 2024.
            Home-equity lines are not rows in these mortgage tables. Read the <a href="/guides/heloc-rates-canada/" className="text-teal-700 font-medium hover:underline">HELOC rates guide</a>, then compare a closed term on the <a href="/rates/5-year-fixed/" className="text-teal-700 font-medium hover:underline">5-year fixed</a> or <a href="/rates/variable/" className="text-teal-700 font-medium hover:underline">variable</a> table.
          </p>
          <ul className="mt-4 flex flex-wrap gap-3">
            {DISCOVERY_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="inline-block rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-sm font-medium text-teal-800 hover:border-teal-400">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">All lenders in the scrape</h2>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {lenders.map(([slug, name]) => (
              <li key={slug}>
                <a href={`/lenders/${slug}/`} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300">
                  <span className="font-medium text-slate-900">{name} mortgage rates</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
