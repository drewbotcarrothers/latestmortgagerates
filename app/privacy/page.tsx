import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Privacy Policy | Latest Mortgage Rates Canada",
  description: "Privacy Policy for LatestMortgageRates.ca - Learn how we collect, use, and protect your personal information.",
  alternates: {
    canonical: "https://latestmortgagerates.ca/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 dark:text-white font-medium">Privacy Policy</li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Privacy Policy
              </h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                Last updated: March 4, 2026
              </p>
            </div>
            <Navigation />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 prose dark:prose-invert max-w-none">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Overview</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              LatestMortgageRates.ca ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              By accessing or using our website, you consent to the practices described in this Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Information We Collect</h2>
            
            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mt-4 mb-2">Personal Information</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We do not actively collect personal information unless you voluntarily provide it to us. This may include:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Email addresses (if you sign up for rate alerts)</li>
              <li>Contact information (if you use our contact forms)</li>
              <li>Mortgage preferences and location data</li>
            </ul>

            <h3 className="text-lg font-semibold text-slate-800 dark:text-gray-200 mt-4 mb-2">Automatically Collected Information</h3>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              When you visit our website, we may automatically collect certain information about your device and usage, including:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>IP address and browser type</li>
              <li>Device information (operating system, screen size)</li>
              <li>Pages visited and time spent on site</li>
              <li>Referring website addresses</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Cookies and Tracking Technologies</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We use cookies and similar tracking technologies to enhance your browsing experience. These may include:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li><strong>Essential Cookies:</strong> Required for basic site functionality</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site (Google Analytics)</li>
              <li><strong>Preference Cookies:</strong> Remember your settings (like dark mode preference)</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              You can control cookies through your browser settings. However, disabling cookies may affect site functionality.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">How We Use Your Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Provide and maintain our services</li>
              <li>Improve our website and user experience</li>
              <li>Send mortgage rate alerts (if subscribed)</li>
              <li>Analyze usage patterns and trends</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Information Sharing</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">We do not sell your personal information. We may share data with:</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Service providers (hosting, analytics, email delivery)</li>
              <li>Legal authorities when required by law</li>
              <li>Business partners (with your consent)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Data Security</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Your Rights</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Access your personal data</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your data</li>
              <li>Opt-out of marketing communications</li>
              <li>Withdraw consent for data processing</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              To exercise these rights, contact us at privacy@latestmortgagerates.ca
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Third-Party Links</h2>
            <p className="text-slate-700 dark:text-slate-300">
              Our website contains links to third-party websites (lenders, credit bureaus). We are not responsible for the privacy practices of these sites. Please review their privacy policies before providing any personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Changes to This Policy</h2>
            <p className="text-slate-700 dark:text-slate-300">
              We may update this Privacy Policy from time to time. Changes will be posted with a revised "Last updated" date. Continued use of the site after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Us</h2>
            <p className="text-slate-700 dark:text-slate-300">
              If you have questions about this Privacy Policy, please contact us at:{' '}
              <a href="mailto:privacy@latestmortgagerates.ca" className="text-teal-600 hover:underline">
                privacy@latestmortgagerates.ca
              </a>
            </p>
          </section>

        </article>
      </div>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8 mt-8 border-t border-slate-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-center text-sm text-slate-500">
            © 2026 LatestMortgageRates.ca - All rights reserved.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</Link>
            <Link href="/terms" className="text-teal-600 hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
