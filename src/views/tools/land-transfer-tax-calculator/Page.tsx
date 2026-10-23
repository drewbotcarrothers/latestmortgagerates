import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LandTransferCalculator from "@/components/LandTransferCalculator";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import FAQSection from "@/components/FAQSection";
import {
  albertaLandTitlesFee,
  BC_PTT_FTHB_FULL_PROGRAM_FMV,
  BC_PTT_FTHB_MAX_EXEMPTION,
  BC_PTT_FTHB_PHASE_OUT_END_FMV,
  calculateBcFthbExemption,
  calculateBcPropertyTransferTax,
  ontarioFirstTimeRebates,
  ontarioProvincialLandTransferTax,
  quebecWelcomeTaxOutsideMontreal,
} from "@/lib/mortgageMath";


export default function LandTransferTaxCalculatorPage() {
  const bcFull = BC_PTT_FTHB_FULL_PROGRAM_FMV.toLocaleString("en-CA");
  const bcPhaseOut = BC_PTT_FTHB_PHASE_OUT_END_FMV.toLocaleString("en-CA");
  const bcMax = BC_PTT_FTHB_MAX_EXEMPTION.toLocaleString("en-CA");
  const examplePrice = 600_000;
  const ontarioTax = ontarioProvincialLandTransferTax(examplePrice);
  const ontarioRebate = ontarioFirstTimeRebates(ontarioTax, 0).total;
  const torontoRebate = ontarioFirstTimeRebates(ontarioTax, ontarioTax).total;
  const bcTax = calculateBcPropertyTransferTax(examplePrice);
  const bcExemption = calculateBcFthbExemption(examplePrice);
  const quebecTax = quebecWelcomeTaxOutsideMontreal(examplePrice);
  const albertaFee = albertaLandTitlesFee(examplePrice);
  const money = (amount: number) =>
    amount.toLocaleString("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 });

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
                <a href="/tools/" className="hover:text-white transition-colors">
                  Tools
                </a>
                <span>/</span>
                <span>Land Transfer Tax Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Land Transfer Tax Calculator Canada
              </h1>
              <p className="text-xl text-slate-300">
                Ontario refunds up to $4,000 of provincial land transfer tax, Toronto adds a municipal rebate of up to $4,475, and British Columbia’s first-time buyer exemption covers the property transfer tax on the first $500,000 through an $835,000 home. The formulas and a $600,000 worked example for each of those are under the calculator.
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
                  Ontario and Toronto first-time buyer rebates
                </h2>
                <div className="text-slate-600 space-y-4">
                  <p>
                    Ontario land transfer tax uses brackets published by the Ministry of Finance: 0.5% on the first $55,000, 1% from $55,000 to $250,000, 1.5% from $250,000 to $400,000, 2% from $400,000 to $2 million, and 2.5% above $2 million. Eligible first-time buyers can receive a refund of up to $4,000. That maximum fully offsets provincial tax only up to about $368,000 of price. On a typical Toronto or Ottawa purchase you still owe provincial tax after the refund.
                  </p>
                  <p>
                    The City of Toronto charges municipal land transfer tax (MLTT) as well. Eligible first-time buyers can claim an MLTT rebate of up to $4,475, on top of Ontario’s $4,000 refund, for a combined maximum of $8,475. Mississauga, Ottawa, Hamilton, and other Ontario cities do not charge Toronto’s MLTT, so they do not get the $4,475 municipal rebate. Your lawyer usually claims both rebates at registration. If not, Ontario gives you 18 months to apply to the Ministry of Finance; confirm Toronto’s deadline with the City.
                  </p>
                  <p>
                    Typical tests: you are at least 18, a Canadian citizen or permanent resident (Toronto allows a path to claim the municipal rebate if you become a citizen or permanent resident within 18 months — confirm with the City), you will occupy the home as your principal residence within nine months, and neither you nor your spouse owned a home anywhere while you were spouses. The calculator’s Toronto estimate applies a second tax on the provincial brackets. The City’s MLTT schedule is what is collected if the brackets differ.
                  </p>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  British Columbia first-time buyer property transfer tax
                </h2>
                <div className="text-slate-600 space-y-4">
                  <p>
                    British Columbia calls this property transfer tax, not land transfer tax. Standard PTT is 1% on the first $200,000 of fair market value, 2% from $200,000 to $2 million, 3% from $2 million to $3 million, and 5% above $3 million.
                  </p>
                  <p>
                    {`For registrations on or after 1 April 2024, the first-time home buyers’ program exempts PTT on the first $500,000 of value (a maximum exemption of $${bcMax}). The full program applies when fair market value is at or below $${bcFull}. Between $${bcFull} and $${bcPhaseOut} the exemption phases out. At $${bcPhaseOut} and above it is $0. Those ceilings are the same constants the calculator uses.`}
                  </p>
                  <p>
                    {`The exemption also expects a residential property you will live in, generally under 0.5 hectares, with the buyers meeting the province’s first-time and citizenship tests. Many Metro Vancouver purchases sit above $${bcPhaseOut}, so first-time status does not erase PTT. Additional property transfer tax on foreign entities in specified areas is separate and is not modelled here. Confirm the file with your notary and the current page on gov.bc.ca.`}
                  </p>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Formulas at {money(examplePrice)}
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    <strong className="text-slate-900">Ontario.</strong> 0.5% on the first $55,000, 1% to $250,000, 1.5% to $400,000, 2% to $2 million, and 2.5% above $2 million. On {money(examplePrice)} the provincial tax is {money(ontarioTax)}. A first-time refund of up to $4,000 leaves {money(ontarioTax - ontarioRebate)}.
                  </p>
                  <p>
                    <strong className="text-slate-900">Toronto.</strong> Municipal land transfer tax uses the same brackets, so the municipal tax is also {money(ontarioTax)}. The first-time municipal rebate is up to $4,475, on top of the provincial $4,000, {money(torontoRebate)} combined. Tax still due is {money(ontarioTax * 2 - torontoRebate)}. Other Ontario cities do not pay this second tax.
                  </p>
                  <p>
                    <strong className="text-slate-900">British Columbia property transfer tax, first-time buyers.</strong> 1% on the first $200,000, 2% to $2 million, 3% to $3 million, and 5% above $3 million. On {money(examplePrice)} the tax is {money(bcTax)}. The first-time exemption for registrations on or after 1 April 2024 is {money(bcExemption)} at this price, so {money(bcTax - bcExemption)} remains. The exemption is the tax on the first $500,000, capped at ${bcMax}, while fair market value is at or under ${bcFull}. It phases out and is $0 at ${bcPhaseOut}.
                  </p>
                  <p>
                    <strong className="text-slate-900">Alberta.</strong> There is no land transfer tax. The Land Titles fee on the transfer, for submissions on or after 1 October 2026, is $50 plus $5 per $5,000 or part, which is {money(albertaFee)} on this price. A mortgage registration is a separate instrument.
                  </p>
                  <p>
                    <strong className="text-slate-900">Quebec, outside Montreal.</strong> The calculator’s planning brackets are 0.5% on the first $55,500, 1% to $255,000, and 1.5% above that, which is {money(quebecTax)} here. The optional $5,000 first-time reduction in the tool is not Revenu Québec’s credit. That credit maxes at $5,875 and phases out above $750,000. Montreal’s higher municipal slices are not in the formula.
                  </p>
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
                      <p className="text-sm text-slate-600"><strong>Maximum Exemption:</strong> $8,000</p>
                      <p className="text-sm text-slate-600 mt-1">Exempts PTT on the first $500,000. Full program eligibility up to $835,000; partial phase-out under $860,000 (registrations on or after 1 April 2024).</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <h3 className="font-semibold text-slate-900 mb-2">Prince Edward Island</h3>
                      <p className="text-sm text-slate-600"><strong>Waiver:</strong> the full transfer tax</p>
                      <p className="text-sm text-slate-600 mt-1">No price cap. You must occupy the home, or the tax comes back after 183 days.</p>
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

              <FAQSection
                faqs={[
                  {
                    question: "When do I pay land transfer tax?",
                    answer:
                      "Land transfer tax is paid on closing day, when title transfers. Your lawyer or notary collects it with the other closing funds. It is not added to the mortgage.",
                  },
                  {
                    question: "What first-time buyer rebates does this calculator apply?",
                    answer:
                      "Ontario refunds up to $4,000 of provincial land transfer tax. Toronto adds a municipal rebate of up to $4,475, for a combined maximum of $8,475. British Columbia’s first-time buyer exemption, for registrations on or after 1 April 2024, covers property transfer tax on the first $500,000 (maximum $8,000) through a fair market value of $835,000, then phases out to zero at $860,000. Prince Edward Island waives the transfer tax for a qualifying first-time buyer with no price cap, if you occupy the home.",
                  },
                  {
                    question: "Can I add land transfer tax to my mortgage?",
                    answer:
                      "No. Land transfer tax is cash due on closing. Mortgage default insurance is a different cost and can be added to the loan when the down payment is under 20%. It does not pay the transfer tax.",
                  },
                  {
                    question: "Do I pay land transfer tax when refinancing?",
                    answer:
                      "Generally no. Transfer tax is charged when ownership changes. A refinance that keeps the same owner does not trigger it. Confirm with your lawyer if someone is being added to or removed from title.",
                  },
                  {
                    question: "Does Alberta charge land transfer tax?",
                    answer:
                      "No. Alberta charges a Land Titles registration fee. For submissions on or after 1 October 2026 the tariff is $50 plus $5 per $5,000 of value, or part of $5,000. The mortgage is registered separately.",
                  },
                ]}
              />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <AdUnit format="sidebar" />
              <div className="card-default p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Related Tools</h3>
                <div className="space-y-3">
                  <a href="/tools/mortgage-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🧮</span>
                    <div>
                      <p className="font-medium text-slate-900">Payment Calculator</p>
                      <p className="text-sm text-slate-500">Calculate monthly payments</p>
                    </div>
                  </a>
                  <a href="/tools/affordability-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <p className="font-medium text-slate-900">Affordability Calculator</p>
                      <p className="text-sm text-slate-500">How much can you afford?</p>
                    </div>
                  </a>
                  <a href="/tools/cmhc-insurance-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="font-medium text-slate-900">CMHC Calculator</p>
                      <p className="text-sm text-slate-500">Calculate insurance premiums</p>
                    </div>
                  </a>
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

        <CalculatorRelatedTools currentTool="/tools/land-transfer-tax-calculator" />


        <Footer />
      </main>
    </>
  );
}
