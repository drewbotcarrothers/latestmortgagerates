import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Terms of Service | Latest Mortgage Rates Canada",
  description: "Terms of Service for LatestMortgageRates.ca - Read our terms and conditions for using our mortgage rate comparison service.",
  alternates: {
    canonical: "https://latestmortgagerates.ca/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 dark:text-slate-400 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 dark:text-white font-medium">Terms of Service</li>
            </ol>
          </nav>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Terms of Service
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
        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-8">
          
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Acceptance of Terms</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              By accessing and using LatestMortgageRates.ca ("the Website"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use the Website.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
              Your continued use of the Website after changes constitutes acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Description of Service</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              LatestMortgageRates.ca provides a platform for comparing mortgage rates from various Canadian lenders, 
              including financial calculators, educational content, and rate information. Our services include:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Mortgage rate comparisons from Canadian lenders</li>
              <li>Mortgage calculators (payment, affordability, land transfer tax, CMHC)</li>
              <li>Educational articles and guides about mortgages</li>
              <li>Glossary of mortgage terms</li>
              <li>Rate alert email notifications (optional)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Disclaimer: Not Financial Advice</h2>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Important: The information provided on this website is for informational and educational purposes only 
                and does not constitute financial, legal, or professional advice.
              </p>
            </div>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Key points to understand:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Mortgage rates displayed are subject to change without notice</li>
              <li>Actual rates may vary based on your credit score, income, property, and other factors</li>
              <li>Calculators provide estimates only - actual amounts may differ</li>
              <li>We do not guarantee approval or specific rates from any lender</li>
              <li>Always consult with qualified mortgage professionals before making financial decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">User Responsibilities</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">By using this Website, you agree to:</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Provide accurate information when using calculators or forms</li>
              <li>Use the Website for lawful purposes only</li>
              <li>Not attempt to access restricted areas or interfere with site functionality</li>
              <li>Not use automated tools (bots, scrapers) without permission</li>
              <li>Not reproduce, duplicate, copy, sell, or resell any part of the Website</li>
              <li>Comply with all applicable Canadian laws and regulations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              All content on this Website, including text, graphics, logos, icons, images, calculators, and software, 
              is the property of LatestMortgageRates.ca and is protected by Canadian and international copyright laws.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-4">You may not:</p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Reproduce, modify, or distribute our content without written permission</li>
              <li>Remove any copyright or proprietary notices from content</li>
              <li>Frame or mirror the Website without authorization</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              You may print or download content for personal, non-commercial use only.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Third-Party Content and Links</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              The Website may contain links to third-party websites, advertisers, or services. We do not control 
              and are not responsible for the content or practices of any third-party websites.
            </p>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              Lender information and rates are provided by third parties. We do not guarantee the accuracy, 
              completeness, or timeliness of such information. Always verify rates and terms directly with lenders 
              before making decisions.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Your interactions with lenders or other third parties found through the Website are solely between 
              you and the third party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              To the maximum extent permitted by law, LatestMortgageRates.ca and its owners, employees, and agents shall not be liable for:
            </p>
            <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 space-y-2 mb-4">
              <li>Any direct, indirect, incidental, special, or consequential damages</li>
              <li>Loss of profits, data, or business opportunities</li>
              <li>Damages resulting from decisions made based on information on this Website</li>
              <li>Technical failures, viruses, or security breaches</li>
              <li>Errors or omissions in rate information or calculator results</li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
              This limitation applies regardless of the legal theory (contract, tort, negligence, strict liability, etc.)
              and even if we have been advised of the possibility of such damages.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Indemnification</h2>
            <p className="text-slate-700 dark:text-slate-300">
              You agree to indemnify and hold harmless LatestMortgageRates.ca, its owners, employees, and agents from any claims, 
              damages, losses, liabilities, costs, or expenses (including attorney fees) arising out of or relating to your use of 
              the Website, violation of these Terms, or infringement of any rights of another party.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Governing Law</h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms shall be governed by and construed in accordance with the laws of the Province of Ontario, Canada, 
              without regard to its conflict of law provisions. Any legal action relating to these Terms shall be brought in 
              the courts of Toronto, Ontario.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Contact Information</h2>
            <p className="text-slate-700 dark:text-slate-300 mb-4">If you have questions about these Terms of Service, please contact us:</p>
            <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-4">
              <p className="text-slate-700 dark:text-slate-300">Email:{' '}
                <a href="mailto:legal@latestmortgagerates.ca" className="text-teal-600 dark:text-teal-400 hover:underline">
                  legal@latestmortgagerates.ca
                </a>
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Entire Agreement</h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms, along with our Privacy Policy, constitute the entire agreement between you and 
              LatestMortgageRates.ca regarding the use of the Website.
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
