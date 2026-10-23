import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug } from "@/content/blog";
import { IN_DEPTH_GUIDES } from "@/content/inDepthGuides";
import { COMPARE_PAGES } from "@/lib/siteLinks";

const report = getPostBySlug("below-the-line-mortgage-rate-report-october-2026");

const featured = [
  {
    href: "/guides/negotiate-mortgage-rate/",
    title: "How much below posted can you negotiate?",
    description: "Place a bank’s posted rate next to rates self-reported by Canadian borrowers online, then walk through a renewal conversation.",
  },
  {
    href: "/real-mortgage-rates/",
    title: "Real mortgage rates",
    description: "Medians, distributions, and the gap versus posted rates. The figures are unverified reports, not offers.",
  },
  {
    href: report ? `/blog/${report.slug}/` : "/blog/",
    title: report?.title ?? "Below-the-line mortgage rate report",
    description: report?.excerpt ?? "The monthly write-up of reported rates versus the posted snapshot.",
  },
  {
    href: "/compare/",
    title: "Compare mortgages",
    description: "Fixed versus variable, insured versus uninsured, and side-by-side lender pairs. Live percentages come from the daily rate file.",
  },
  {
    href: "/glossary/",
    title: "Mortgage glossary",
    description: "Short definitions for the terms that show up in a commitment: amortization, stress test, IRD, loan-to-value, and the rest.",
  },
];

export default function GuidesIndex() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
            <a href="/" className="hover:text-white">Home</a>
            <span className="mx-2">/</span>
            <span>Guides</span>
          </nav>
          <h1 className="text-4xl font-bold">Mortgage guides</h1>
          <p className="mt-4 max-w-3xl text-lg text-slate-200">
            Explanations that sit next to the rate tables: how to read a posted rate, how reported rates are aggregated, and which comparison to open before you renew or buy. Andrew writes these pages. The numbers in a comparison come from the daily scrape or from the reported-rate file, and the page says which.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-10 px-4 py-8">
        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">In-depth guides</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {IN_DEPTH_GUIDES.map((guide) => (
              <a key={guide.path} href={guide.path} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300">
                <h3 className="text-lg font-semibold text-teal-800">{guide.cardTitle}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{guide.cardDescription}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Start here</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {featured.map((item) => (
              <a key={item.href} href={item.href} className="rounded-xl border border-slate-200 bg-white p-5 hover:border-teal-300">
                <h3 className="text-lg font-semibold text-teal-800">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Comparisons</h2>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {COMPARE_PAGES.map((page) => (
              <li key={page.href}>
                <a href={page.href} className="block rounded-xl border border-slate-200 bg-white p-4 hover:border-teal-300">
                  <span className="font-medium text-slate-900">{page.title}</span>
                  <span className="mt-1 block text-sm text-slate-600">{page.description}</span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold text-slate-900">Also on the site</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
            <li><a href="/methodology/" className="text-teal-700 hover:underline">How reported rates are compiled</a></li>
            <li><a href="/tools/" className="text-teal-700 hover:underline">Calculators</a>, including the renewal offer checker, CMHC premium, and rent versus buy</li>
            <li><a href="/blog/" className="text-teal-700 hover:underline">Blog</a> for the weekly 5-year fixed roundup and Bank of Canada recaps</li>
            <li><a href="/author/andrew/" className="text-teal-700 hover:underline">Andrew</a>, the author of the guides and articles</li>
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
