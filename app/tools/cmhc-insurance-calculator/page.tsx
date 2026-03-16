import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../../components/Navigation";
import Footer from "../../components/Footer";
import CMHCCalculator from "../../components/CMHCCalculator";

export const metadata: Metadata = {
  title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2024",
  description: "Calculate your CMHC mortgage insurance premium. See how your down payment affects insurance costs. Updated with 2024 CMHC premium rates for Canada.",
  keywords: "CMHC calculator, mortgage insurance calculator Canada, CMHC premium rates, mortgage default insurance, high ratio mortgage calculator",
  openGraph: {
    title: "CMHC Mortgage Insurance Calculator Canada | Premium Rates 2024",
    description: "Calculate your CMHC mortgage insurance premium based on your down payment and home price.",
    type: "website",
  },
};

export default function CMHCCalculatorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt="Latest Mortgage Rates Canada"
                  width={56}
                  height={56}
                  className="rounded-lg"
                  priority
                />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Latest Mortgage Rates Canada
                </h1>
              </div>
            </div>
            <Navigation currentPage="tools" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-teal-300 mb-4">
              <Link href="/tools" className="hover:text-white transition-colors">
                Tools
              </Link>
              <span>/</span>
              <span>CMHC Insurance Calculator</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              CMHC Mortgage Insurance Calculator
            </h1>
            <p className="text-xl text-slate-300">
              Calculate your mortgage default insurance premium. See how your down payment affects 
              your insurance costs and total mortgage amount.
            </p>
          </div>
        </div>
      </div>

      {/* Calculator Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CMHCCalculator />
      </div>

      {/* Information Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                What is CMHC Mortgage Insurance?
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  CMHC (Canada Mortgage and Housing Corporation) mortgage loan insurance protects lenders 
                  against mortgage default. It's required when your down payment is less than 20% of the purchase price.
                </p>
                <p className="text-slate-600 mb-4">
                  The insurance premium is calculated as a percentage of your mortgage amount and can be paid upfront 
                  or added to your mortgage principal. Adding it to your mortgage means you'll pay interest on the premium too.
                </p>
                <div className="bg-teal-50 border border-teal-200 p-4 rounded-lg">
                  <p className="text-teal-800 font-medium mb-2">Key Points:</p>
                  <ul className="text-teal-700 space-y-1">
                    <li>✓ Required for down payments under 20%</li>
                    <li>✓ Premium ranges from 2.8% to 4.0% of mortgage amount</li>
                    <li>✓ Protects the lender, not the borrower</li>
                    <li>✓ Available from CMHC, Sagen (formerly Genworth), and Canada Guaranty</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2024 CMHC Premium Rates
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  Premium rates are based on your loan-to-value (LTV) ratio - the amount you borrow 
                  compared to the property value. Higher LTV means higher risk and higher premiums.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-100">
                        <th className="text-left p-3 font-semibold text-slate-900">Loan-to-Value (LTV)</th>
                        <th className="text-left p-3 font-semibold text-slate-900">Down Payment</th>
                        <th className="text-left p-3 font-semibold text-slate-900">Premium Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-slate-600">Up to 65%</td>
                        <td className="p-3 text-slate-600">35% or more</td>
                        <td className="p-3 font-medium text-slate-900">0.60%</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-slate-600">65.01% - 75%</td>
                        <td className="p-3 text-slate-600">25% - 35%</td>
                        <td className="p-3 font-medium text-slate-900">1.70%</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-slate-600">75.01% - 80%</td>
                        <td className="p-3 text-slate-600">20% - 25%</td>
                        <td className="p-3 font-medium text-slate-900">2.40%</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-slate-600">80.01% - 85%</td>
                        <td className="p-3 text-slate-600">15% - 20%</td>
                        <td className="p-3 font-medium text-slate-900">2.80%</td>
                      </tr>
                      <tr className="border-b border-slate-200">
                        <td className="p-3 text-slate-600">85.01% - 90%</td>
                        <td className="p-3 text-slate-600">10% - 15%</td>
                        <td className="p-3 font-medium text-slate-900">3.10%</td>
                      </tr>
                      <tr>
                        <td className="p-3 text-slate-600">90.01% - 95%</td>
                        <td className="p-3 text-slate-600">5% - 10%</td>
                        <td className="p-3 font-medium text-slate-900">4.00%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg mt-6">
                  <p className="text-amber-800 text-sm">
                    <strong>Note:</strong> For purchases over $1 million, mortgage insurance is not available. 
                    You must have at least 20% down payment.
                  </p>
                </div>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Minimum Down Payment Requirements
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 mb-4">
                  The minimum down payment depends on the purchase price of the home:
                </p>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Under $500,000</h3>
                    <p className="text-slate-600">Minimum down payment: <strong>5%</strong> of purchase price</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">$500,000 to $999,999</h3>
                    <p className="text-slate-600"><strong>5%</strong> of first $500,000 + <strong>10%</strong> of remainder</p>
                    <p className="text-sm text-slate-500 mt-1">Example: $600,000 home = $25,000 + $10,000 = $35,000 minimum</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">$1,000,000 or more</h3>
                    <p className="text-slate-600">Minimum down payment: <strong>20%</strong> of purchase price</p>
                    <p className="text-sm text-slate-500 mt-1">Mortgage insurance not available for homes over $1M</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="card-default p-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Can I avoid paying CMHC insurance?</h3>
                  <p className="text-slate-600">
                    Yes, by making a down payment of 20% or more. This is called a "conventional" mortgage 
                    and doesn't require mortgage default insurance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Is CMHC insurance the same as mortgage life insurance?</h3>
                  <p className="text-slate-600">
                    No. CMHC insurance protects the lender if you default on your mortgage. 
                    Mortgage life insurance pays off your mortgage if you die - that's optional and protects your family.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Can I get a refund if I sell my home early?</h3>
                  <p className="text-slate-600">
                    Generally no. However, if you port your mortgage to a new property with the same lender, 
                    you may receive a partial premium credit depending on how much you've paid down.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Are there alternatives to CMHC?</h3>
                  <p className="text-slate-600">
                    Yes. Sagen (formerly Genworth Canada) and Canada Guaranty also provide mortgage default insurance. 
                    Your lender chooses which insurer to use, and rates are typically similar.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="card-default p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Related Tools</h3>
              <div className="space-y-3">
                <Link href="/tools/mortgage-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">🧮</span>
                  <div>
                    <p className="font-medium text-slate-900">Payment Calculator</p>
                    <p className="text-sm text-slate-500">Calculate monthly payments</p>
                  </div>
                </Link>
                <Link href="/tools/affordability-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">🏠</span>
                  <div>
                    <p className="font-medium text-slate-900">Affordability Calculator</p>
                    <p className="text-sm text-slate-500">How much can you afford?</p>
                  </div>
                </Link>
                <Link href="/tools/land-transfer-tax-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <span className="text-2xl">📋</span>
                  <div>
                    <p className="font-medium text-slate-900">Land Transfer Tax</p>
                    <p className="text-sm text-slate-500">Calculate closing costs</p>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Save on Insurance</h3>
              <p className="text-teal-100 text-sm mb-4">
                Increasing your down payment from 10% to 15% can save thousands in CMHC premiums.
              </p>
              <div className="text-sm text-teal-100">
                <p><strong>Example on $500,000 home:</strong></p>
                <ul className="mt-2 space-y-1">
                  <li>10% down: $13,950 premium</li>
                  <li>15% down: $11,900 premium</li>
                  <li className="font-semibold text-emerald-300">Savings: $2,050</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
