import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Unsubscribed | Latest Mortgage Rates Canada",
  description: "You have been unsubscribed from our mortgage rate alerts.",
};

export default function UnsubscribedPage() {
  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Successfully Unsubscribed
        </h1>

        <p className="text-gray-600 mb-6">
          You&apos;ve been removed from our mortgage rate alert list. 
          You won&apos;t receive any more emails from us.
        </p>

        <p className="text-sm text-gray-500 mb-8">
          Changed your mind? You can always resubscribe from our homepage.
        </p>

        <Link
          href="/"
          className="inline-block w-full bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-700 transition"
        >
          Return to Homepage
        </Link>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400">
            We&apos;re sorry to see you go! If you have feedback about our emails, 
            we&apos;d love to hear it.
          </p>
        </div>
      </div>
    </main>
  );
}
