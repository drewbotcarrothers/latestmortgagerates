import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialSections from "@/components/EditorialSections";
import { aboutSections } from "@/content/editorialPages";

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
        <article className="bg-white rounded-lg shadow-md p-8">
          <EditorialSections sections={aboutSections} />
        </article>
      </div>
      <Footer />
    </main>
  );
}
