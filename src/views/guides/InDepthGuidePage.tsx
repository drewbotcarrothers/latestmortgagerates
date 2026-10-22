import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import GuideCTA from "@/components/GuideCTA";
import FAQSection from "@/components/FAQSection";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import EditorialByline from "@/components/EditorialByline";
import EditorialSections from "@/components/EditorialSections";
import { guideBySlug } from "@/content/inDepthGuides";

export default function InDepthGuidePage({ slug }: { slug: string }) {
  const guide = guideBySlug(slug);

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Guides", url: "/guides/" },
          { name: guide.h1 },
        ]}
      />
      {guide.howTo ? (
        <HowToSchema
          name={guide.howTo.name}
          description={guide.howTo.description}
          totalTime="PT45M"
          steps={guide.howTo.steps}
        />
      ) : null}
      <main className="min-h-screen bg-slate-50">
        <Header />
        <article>
          <section className="hero-gradient text-white">
            <div className="mx-auto max-w-3xl px-4 py-12">
              <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
                <a href="/" className="hover:text-white">Home</a>
                <span className="mx-2">/</span>
                <a href="/guides/" className="hover:text-white">Guides</a>
                <span className="mx-2">/</span>
                <span>{guide.cardTitle}</span>
              </nav>
              <h1 className="text-4xl font-bold tracking-tight">{guide.h1}</h1>
              <EditorialByline reviewedIso={guide.reviewedIso} sources={guide.sourcesLine} tone="onDark" />
              <p className="mt-4 text-lg text-slate-200">{guide.dek}</p>
            </div>
          </section>

          <div className="mx-auto max-w-3xl space-y-8 px-4 py-8">
            <EditorialSections sections={guide.sections} />
            <AdUnit format="display" />
            <section>
              <h2 className="text-2xl font-bold text-slate-900">A note on the paid guide</h2>
              <p className="mt-3 leading-relaxed text-slate-700">
                The explanation on this page is free. The $29 PDF is a separate guide we write and sell. You can use the calculators and the rate tables without buying it.
              </p>
            </section>
            <GuideCTA />
            <FAQSection faqs={guide.faqs} title="Questions" />
          </div>
        </article>
        <Footer />
      </main>
    </>
  );
}
