import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialSections from "@/components/EditorialSections";
import { contactSections } from "@/content/editorialPages";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Contact</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Contact</h1>
          <p className="text-slate-600 mt-2">
            Email is the only way to reach the site. There is no contact form.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8">
          <p className="mb-8 text-lg text-slate-700">
            <a href="mailto:contact@latestmortgagerates.ca" className="font-medium text-teal-700 hover:underline">
              contact@latestmortgagerates.ca
            </a>
          </p>
          <EditorialSections sections={contactSections} />
        </article>
      </div>
      <Footer />
    </main>
  );
}
