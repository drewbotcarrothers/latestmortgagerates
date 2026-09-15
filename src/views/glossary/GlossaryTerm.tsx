import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import { glossaryTerms } from "@/content/glossary";

// Force static generation

// Generate static paths for all glossary terms

// Generate metadata for each term page

export default function GlossaryTermPage({ slug }: { slug: string }) {
  const term = glossaryTerms.find((t) => t.slug === slug);

  if (!term) {
    return null;
  }

  const relatedTools = term.relatedTools || [];
  const relatedTerms = glossaryTerms
    .filter((t) => t.category === term.category && t.slug !== term.slug)
    .slice(0, 5);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://latestmortgagerates.ca" },
          { name: "Glossary", url: "https://latestmortgagerates.ca/glossary/" },
          { name: term.term },
        ]}
      />

      {/* FAQPage Schema for this term */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is ${term.term}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: term.definition,
                },
              },
              ...(relatedTools.length > 0
                ? [
                    {
                      "@type": "Question",
                      name: `How do I calculate ${term.term}?`,
                      acceptedAnswer: {
                        "@type": "Answer",
                        text: `Use our free mortgage calculators: ${relatedTools
                          .map((tool) => tool.label)
                          .join(", ")}.&lt;br/&gt;Available at latestmortgagerates.ca/tools`,
                      },
                    },
                  ]
                : []),
            ],
          }),
        }}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="glossary" />

        <div className="bg-white shadow-sm border-b border-slate-200 py-6">
          <div className="max-w-4xl mx-auto px-4">
            <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <a href="/" className="hover:text-teal-600 transition">
                    Home
                  </a>
                </li>
                <li><span className="text-slate-400">/</span></li>
                <li>
                  <a href="/glossary/" className="hover:text-teal-600 transition">
                    Glossary
                  </a>
                </li>
                <li><span className="text-slate-400">/</span></li>
                <li className="text-slate-900 font-medium">{term.term}</li>
              </ol>
            </nav>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                {term.category}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
              {term.term}
            </h1>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Definition */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 md:p-8 mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              What is {term.term}?
            </h2>
            <p className="text-lg text-slate-700 leading-relaxed">
              {term.definition}
            </p>
          </div>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Related Calculators & Tools
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.map((tool) => (
                  <a
                    key={tool.href}
                    href={tool.href}
                    className="flex items-center gap-3 p-4 rounded-lg bg-slate-50 hover:bg-teal-50 border border-slate-200 hover:border-teal-300 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-200 transition-colors">
                      🧮
                    </div>
                    <div>
                      <p className="font-medium text-slate-900 group-hover:text-teal-700 transition-colors">
                        {tool.label}
                      </p>
                      <p className="text-sm text-slate-500">
                        Free online calculator
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Related Terms */}
          {relatedTerms.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                Related Terms in {term.category}
              </h2>
              <div className="flex flex-wrap gap-2">
                {relatedTerms.map((t) => (
                  <a
                    key={t.slug}
                    href={`/glossary/${t.slug}/`}
                    className="px-4 py-2 bg-slate-50 hover:bg-teal-50 text-slate-700 hover:text-teal-700 rounded-lg text-sm font-medium border border-slate-200 hover:border-teal-300 transition-all"
                  >
                    {t.term}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Browse More */}
          <div className="text-center">
            <a
              href="/glossary/"
              className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              ← Browse all {glossaryTerms.length} mortgage terms
            </a>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
