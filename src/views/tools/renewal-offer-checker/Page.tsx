import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdUnit from "@/components/AdUnit";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import CommunityDisclaimer from "@/components/community/CommunityDisclaimer";
import RenewalOfferChecker from "@/components/community/RenewalOfferChecker";
import { communityRates, formatAsOf } from "@/lib/communityRates";

export default function RenewalOfferCheckerPage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/" },
          { name: "Renewal Offer Checker" },
        ]}
      />
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="offer-check" />
        <section className="hero-gradient text-white">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <nav className="mb-4 text-sm text-teal-200" aria-label="Breadcrumb">
              <a href="/" className="hover:text-white">Home</a>
              <span className="mx-2">/</span>
              <a href="/tools/" className="hover:text-white">Tools</a>
              <span className="mx-2">/</span>
              <span>Renewal offer checker</span>
            </nav>
            <h1 className="max-w-3xl text-4xl font-bold">Renewal offer checker</h1>
            <p className="mt-4 max-w-3xl text-lg text-slate-200">
              Enter the rate a bank offered you. See how it ranks against rates {communityRates.attribution}, and against that bank&apos;s posted rate. As of {formatAsOf()}. The check runs in your browser.
            </p>
          </div>
        </section>
        <div className="mx-auto max-w-7xl space-y-8 px-4 py-8">
          <CommunityDisclaimer />
          <RenewalOfferChecker />
          <AdUnit format="display" />
          <CalculatorRelatedTools currentTool="/tools/renewal-offer-checker/" />
        </div>
        <Footer />
      </main>
    </>
  );
}
