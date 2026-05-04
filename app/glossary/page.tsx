import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";
import { glossaryTermsWithTools } from "./terms";

// Force static generation for static export
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Glossary | Key Terms & Definitions | Latest Mortgage Rates Canada",
  description: "Comprehensive mortgage glossary explaining key terms for Canadian homebuyers. Understand amortization, CMHC, GDS ratio, LTV, and more mortgage terminology.",
  keywords: [
    "mortgage glossary",
    "mortgage terms canada",
    "cmhc meaning",
    "amortization definition",
    "mortgage terminology",
    "home buying terms",
  ],
  alternates: {
    canonical: "https://latestmortgagerates.ca/glossary",
  },
  openGraph: {
    title: "Mortgage Glossary | Key Terms & Definitions",
    description: "Clear explanations of mortgage terminology for Canadian homebuyers",
    type: "website",
    url: "https://latestmortgagerates.ca/glossary",
  },
};

const categories = [...new Set(glossaryTermsWithTools.map((t) => t.category))].sort();

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="glossary" />

      <div className="bg-white shadow-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600 transition">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Glossary</li>
            </ol>
          </nav>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mortgage Glossary</h1>
            <p className="text-slate-600 mt-2">Key terms and definitions every Canadian homebuyer should know</p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: glossaryTermsWithTools.map((term) => ({
              "@type": "Question",
              name: `What is ${term.term}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: term.definition,
              },
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <span className="text-sm text-slate-500">
            {glossaryTermsWithTools.length} terms across {categories.length} categories
          </span>
        </div>

        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500">Jump to:</span>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Terms by Category */}
        {categories.map((category) => {
          const terms = glossaryTermsWithTools.filter((t) => t.category === category);
          return (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, "-")}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-teal-500">
                {category}
              </h2>
              <div className="space-y-4">
                {terms.map((term) => (
                  <article
                    key={term.slug}
                    id={term.slug}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 scroll-mt-20 hover:shadow-md hover:border-teal-200 transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h3 className="text-xl font-semibold text-slate-900">
                        <Link
                          href={`/glossary/${term.slug}`}
                          className="hover:text-teal-600 transition-colors"
                        >
                          {term.term}
                        </Link>
                      </h3>
                      <Link
                        href={`/glossary/${term.slug}`}
                        className="text-xs text-teal-600 hover:text-teal-700 font-medium whitespace-nowrap"
                      >
                        Read more →
                      </Link>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      {term.definition}
                    </p>
                    {term.relatedTools && term.relatedTools.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 mr-1">Related:</span>
                        {term.relatedTools.map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Find Your Rate?
          </h2>
          <p className="text-slate-300 mb-6">
            Compare mortgage rates from Canada's top lenders and save thousands.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-200"
          >
            Compare Rates Now
          </Link>
        </div>
      </div>
    </main>
  );
}
