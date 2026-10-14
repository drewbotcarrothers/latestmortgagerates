import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
          <p className="text-slate-600 mt-2">Email is the only way to reach the site. There is no contact form.</p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-lg shadow-md p-8 space-y-6 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Email</h2>
            <p>
              For questions about a page, a correction, the mortgage guide, or a privacy request, email{" "}
              <a href="mailto:contact@latestmortgagerates.ca" className="text-teal-700 font-medium hover:underline">
                contact@latestmortgagerates.ca
              </a>
              .
            </p>
            <p className="mt-3">
              That is the only contact address. It is also listed in the <a href="/about/" className="text-teal-700 hover:underline">about</a> page, the <a href="/disclaimer/" className="text-teal-700 hover:underline">disclaimer</a>, and the <a href="/privacy/" className="text-teal-700 hover:underline">privacy policy</a>.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">What we can help with</h2>
            <p>
              Andrew reads the mailbox. We can explain how a table is built, fix a broken link, or point you to the <a href="/methodology/" className="text-teal-700 hover:underline">methodology</a>. We cannot quote a personal mortgage rate, approve an application, or act as your broker. Compare the live tables, then confirm the offer with the lender.
            </p>
          </section>
        </article>
      </div>
      <Footer />
    </main>
  );
}
