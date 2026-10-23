import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialSections from "@/components/EditorialSections";
import { editorialPolicySections } from "@/content/editorialPages";

export default function EditorialPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="font-medium text-slate-900">Editorial policy</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">Editorial policy</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            How guides are researched and fact-checked, how often pages are updated, how to ask for a correction, and how advertising works.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <article className="rounded-lg bg-white p-8 shadow-md">
          <EditorialSections sections={editorialPolicySections} />
          <p className="mt-8 text-slate-700">
            Questions and corrections go to{" "}
            <a href="mailto:contact@latestmortgagerates.ca" className="font-medium text-teal-700 hover:underline">
              contact@latestmortgagerates.ca
            </a>
            . The <a href="/author/andrew/" className="font-medium text-teal-700 hover:underline">author page</a> lists the guides.
          </p>
        </article>
      </div>
      <Footer />
    </main>
  );
}
