import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LandTransferCalculator from "../../components/LandTransferCalculator";
import HowToSchema from "../../components/HowToSchema";
import BreadcrumbSchema from "../../components/BreadcrumbSchema";
import GuideCTA from "../../components/GuideCTA";

export const metadata: Metadata = {
  title: "Land Transfer Tax Calculator Canada | Provincial & Municipal Taxes",
  description: "Calculate land transfer taxes for any Canadian province. Includes first-time homebuyer rebates, Toronto municipal tax, and provincial rates. Free instant calculation.",
  keywords: "land transfer tax calculator, Ontario land transfer tax, Toronto land transfer tax, first time home buyer rebate, provincial land transfer tax calculator",
  alternates: {
    canonical: "https://latestmortgagerates.ca/tools/land-transfer-tax-calculator",
  },
  openGraph: {
    title: "Land Transfer Tax Calculator Canada | Provincial & Municipal Taxes",
    description: "Calculate land transfer taxes for any Canadian province. Includes first-time homebuyer rebates and Toronto municipal tax.",
    type: "website",
    url: "https://latestmortgagerates.ca/tools/land-transfer-tax-calculator",
    siteName: "Latest Mortgage Rates Canada",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Land Transfer Tax Calculator Canada",
    description: "Calculate provincial and municipal land transfer taxes",
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function LandTransferTaxCalculatorPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate Land Transfer Tax"
        description="Calculate the land transfer tax for your Canadian property purchase, including provincial taxes, municipal taxes, and first-time homebuyer rebates."
        totalTime="PT3M"
        steps={[
          {
            name: "Select Your Province",
            text: "Choose the province where you are purchasing the property. Each province has different tax rates.",
          },
          {
            name: "Enter Purchase Price",
            text: "Input the total purchase price of the home or property.",
          },
          {
            name: "Indicate First-Time Buyer Status",
            text: "Check if you qualify as a first-time homebuyer to calculate available rebates.",
          },
          {
            name: "Specify Toronto Property",
            text: "If buying in Toronto, indicate this to include the additional municipal land transfer tax.",
          },
          {
            name: "Review Tax Breakdown",
            text: "See your total land transfer tax, provincial and municipal amounts, and any rebates applied.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "Land Transfer Tax Calculator" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="tools" />

        {/* Hero Section */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <Link href="/tools" className="hover:text-white transition-colors">
                  Tools
                </Link>
                <span>/</span>
                <span>Land Transfer Tax Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Land Transfer Tax Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Calculate provincial and municipal land transfer taxes for any Canadian province. 
                Includes first-time homebuyer rebates and Toronto's municipal tax.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LandTransferCalculator />
        </div>

        {/* Information Section */}
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  What is Land Transfer Tax?
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Land Transfer Tax (LTT) is a provincial tax paid when you purchase property in Canada. 
                    In some municipalities (like Toronto), you may also pay a municipal land transfer tax. 
                    This tax is typically one of the largest closing costs when buying a home.
                  </p>
                  <p className="text-slate-600 mb-4">
                    The amount you pay depends on the purchase price of the property and the province where it's located. 
                    Each province has its own tax rates and calculation method.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                    <p className="text-amber-800 font-medium">
                      💡 First-time homebuyers may be eligible for rebates of up to $8,475 in Ontario 
                      (including Toronto's municipal rebate).
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Provincial Land Transfer Tax Rates
                </h2>
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Ontario</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>0.5% on the first $55,000</li>
                      <li>1.0% on $55,000 to $250,000</li>
                      <li>1.5% on $250,000 to $400,000</li>
                      <li>2.0% on $400,000 to $2,000,000</li>
                      <li>2.5% on amounts over $2,000,000</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">British Columbia</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>1.0% on the first $200,000</li>
                      <li>2.0% on $200,000 to $2,000,000</li>
                      <li>3.0% on $2,000,000 to $3,000,000</li>
                      <li>5.0% on amounts over $3,000,000</li>
                    </ul>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Alberta</h3>
                    <p className="text-sm text-slate-600">
                      No land transfer tax! Only a small registration fee based on property value.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Quebec (Montreal)</h3>
                    <ul className="text-sm text-slate-600 space-y-1">
                      <li>0.5% on the first $50,000</li>
                      <li>1.0% on $50,000 to $250,000</li>
                      <li>1.5% on amounts over $250,000</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  First-Time Homebuyer Rebates
                </h2>
                <div className="prose prose-slate max-w-none">
                  <p className="text-slate-600 mb-4">
                    Many provinces offer rebates to first-time homebuyers to help with the cost of land transfer tax. 
                    Eligibility requirements vary by province.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Ontario</h3>
                      <p className="text-sm text-slate-600"><strong>Maximum Rebate:</strong> $4,000</p>
                      <p className="text-sm text-slate-600 mt-1">Full rebate on homes up to $368,333</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Toronto Municipal</h3>
                      <p className="text-sm text-slate-600"><strong>Maximum Rebate:</strong> $4,475</p>
                      <p className="text-sm text-slate-600 mt-1">Combined with Ontario: up to $8,475 total</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">British Columbia</h3>
                      <p className="text-sm text-slate-600"><strong>Maximum Rebate:</strong> $8,000</p>
                      <p className="text-sm text-slate-600 mt-1">Full rebate on homes up to $500,000</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Prince Edward Island</h3>
                      <p className="text-sm text-slate-600"><strong>Maximum Rebate:</strong> $2,000</p>
                      <p className="text-sm text-slate-600 mt-1">Full rebate on homes up to $200,000</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-3">General Eligibility Requirements:</h3>
                  <ul className="space-y-2 text-slate-600">
                    <li>Must be a Canadian citizen or permanent resident</li>
                    <li>Must be at least 18 years old</li>
                    <li>Must occupy the home as your principal residence within 9 months</li>
                    <li>Cannot have owned a home anywhere in the world previously</li>
                    <li>Spouse cannot have owned a home while being your spouse</li>
                  </ul>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">When do I pay land transfer tax?</h3>
                    <p className="text-slate-600">
                      Land transfer tax is paid on closing day when the property title is transferred to your name. 
                      Your lawyer will handle the payment as part of the closing process.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Can I add land transfer tax to my mortgage?</h3>
                    <p className="text-slate-600">
                      No, land transfer tax cannot be added to your mortgage. It must be paid upfront as part of your closing costs. 
                      Make sure to budget for this expense when saving for your down payment.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-2">Do I pay land transfer tax when refinancing?</h3>
                    <p className="text-slate-600">
                      Generally, no. Land transfer tax is only paid when the property ownership changes. 
                      Refinancing with the same owner typically doesn't trigger land transfer tax.
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
                  <Link href="/tools/cmhc-insurance-calculator" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="font-medium text-slate-900">CMHC Calculator</p>
                      <p className="text-sm text-slate-500">Calculate insurance premiums</p>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Buying in Toronto?</h3>
                <p className="text-teal-100 text-sm mb-4">
                  Toronto buyers pay both provincial AND municipal land transfer tax. 
                  Make sure to factor both into your closing costs.
                </p>
                <div className="text-sm text-teal-100">
                  <p><strong>Example on $800,000 home:</strong></p>
                  <ul className="mt-2 space-y-1">
                    <li>Ontario LTT: $12,475</li>
                    <li>Toronto LTT: $12,475</li>
                    <li>First-time rebate: -$8,475</li>
                    <li className="font-semibold">Total: $16,475</li>
                  </ul>
                </div>
              </div>

              <GuideCTA variant="compact" />
            </div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  );
}
