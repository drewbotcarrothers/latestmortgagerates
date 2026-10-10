import Footer from "@/components/Footer";

export default function UnsubscribedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <main className="flex-1 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Unsubscribe
        </h1>

        <p className="text-slate-600 mb-6">
          To stop the monthly mortgage rate report, use the unsubscribe link in any newsletter email.
          That link removes your address from the list.
        </p>

        <p className="text-sm text-slate-500 mb-8">
          Changed your mind? You can subscribe again from the homepage.
        </p>

        <a
          href="/"
          className="inline-block w-full bg-teal-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-teal-700 transition"
        >
          Return to Homepage
        </a>
      </div>
      </main>
      <Footer />
    </div>
  );
}
