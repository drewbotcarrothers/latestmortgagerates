import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClosingCostsCalculator from "@/components/ClosingCostsCalculator";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import FAQSection from "@/components/FAQSection";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";

const faqs = [
  {
    question: "What are closing costs when buying a home in Canada?",
    answer:
      "Closing costs are the cash expenses you pay when title transfers, on top of your down payment. In most provinces the largest item is land transfer tax (or property transfer tax). Typical extras include legal fees, title insurance, a home inspection, an appraisal if the lender requires one, and moving costs. Across Canada, plan on about 1.5% to 4% of the purchase price, with Ontario, B.C., and Toronto at the high end because of transfer taxes.",
  },
  {
    question: "How much should I budget for closing costs?",
    answer:
      "A practical budget is 1.5% to 4% of the purchase price, not counting your down payment. On a $500,000 home that is roughly $7,500 to $20,000. Alberta and Saskatchewan buyers often land near the low end because there is no provincial land transfer tax. Toronto and Vancouver-area purchases sit at the high end once provincial and, in Toronto, municipal transfer tax are included. Use the calculator above with your province and price for a tighter estimate.",
  },
  {
    question: "Do first-time buyers get closing cost rebates?",
    answer:
      "Several provinces reduce land transfer tax for eligible first-time buyers. Ontario refunds up to $4,000 of provincial land transfer tax. Toronto adds a municipal rebate of up to $4,475, so a qualifying Toronto first-time buyer can receive up to $8,475 combined. This calculator models B.C.’s first-time buyer exemption as a full rebate on homes at or below $500,000 and a partial rebate up to $525,000 (about $8,000 at the $500,000 threshold). P.E.I. is modelled as a full exemption on homes at or below $200,000. Programs and eligibility rules change, so confirm with your lawyer before you firm up an offer.",
  },
  {
    question: "Are closing costs different in each province?",
    answer:
      "Yes. Ontario, British Columbia, and Quebec charge the most visible transfer taxes. Manitoba, Nova Scotia, New Brunswick, Newfoundland and Labrador, and P.E.I. use their own land-transfer or deed-transfer formulas. Alberta and Saskatchewan do not charge a provincial land transfer tax; buyers still pay land-titles registration and legal fees. Toronto is the main city that adds a municipal land transfer tax on top of the provincial tax.",
  },
  {
    question: "Can closing costs be added to my mortgage?",
    answer:
      "Usually no. Land transfer tax, legal fees, and most other closing items must be paid in cash on closing. Mortgage default insurance (CMHC, Sagen, or Canada Guaranty) is a separate cost that is typically added to the mortgage when your down payment is under 20%, but it does not cover transfer tax or legal fees. Some lenders offer cash-back mortgages that can offset closing costs in exchange for a higher rate—run the numbers before you take that trade-off.",
  },
  {
    question: "What is the difference between closing costs and a down payment?",
    answer:
      "Your down payment is the equity you put into the purchase and it reduces the mortgage. Closing costs are transaction fees and taxes paid so the deal can complete. You need both amounts in cash (or readily available funds) unless a specific program, gift, or cash-back product covers part of them. First-time buyers sometimes underestimate this split and come up short on closing day.",
  },
  {
    question: "Do I pay land transfer tax in Alberta?",
    answer:
      "No provincial land transfer tax. Alberta buyers still budget for land-titles registration, legal fees, title insurance if you buy it, inspections, and any condo estoppel or status-certificate fees. That is why Alberta cash-to-close is often lower than an equivalent purchase in Ontario or B.C.",
  },
  {
    question: "When do I actually pay closing costs?",
    answer:
      "Your lawyer or notary collects most of them just before closing, including land transfer tax and legal fees. Inspections and appraisals are usually paid earlier, when you book them. Property-tax and utility adjustments are settled on the statement of adjustments. Build a cash buffer above the calculator total for last-minute adjustments.",
  },
];

export default function ClosingCostsPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate Closing Costs"
        description="Calculate all closing costs including land transfer tax, legal fees, and other expenses when buying a home in Canada."
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Purchase Price",
            text: "Input the purchase price of the home.",
          },
          {
            name: "Select Province",
            text: "Choose your province for applicable taxes and rebates.",
          },
          {
            name: "Enter Down Payment",
            text: "Input your down payment amount.",
          },
          {
            name: "Add Additional Costs",
            text: "Include legal fees, inspection costs, and other expenses.",
          },
          {
            name: "Review Total",
            text: "See your total closing costs and cash required.",
          },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/" },
          { name: "Closing Costs Calculator" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="tools" />

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <a href="/tools/" className="hover:text-white transition-colors">
                  Tools
                </a>
                <span>/</span>
                <span>Closing Costs Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Closing Costs Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Estimate land transfer tax, legal fees, and cash to close for a home purchase in Canada.
                Built for buyers who already have a price in mind and need a realistic closing-day budget—not just a down-payment number.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <ClosingCostsCalculator />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Who this calculator is for
                </h2>
                <p className="text-slate-600 mb-4">
                  Use this if you are buying a home in Canada and need to know how much extra cash to have ready on closing day.
                  It is especially useful for first-time buyers comparing Ontario, B.C., and Alberta, and for anyone who has only budgeted the down payment so far.
                </p>
                <p className="text-slate-600">
                  The tool estimates transfer taxes by province, optional first-time buyer rebates where we model them, and the usual professional fees.
                  Pair it with the{" "}
                  <a href="/tools/land-transfer-tax-calculator/" className="text-teal-600 hover:underline font-medium">
                    land transfer tax calculator
                  </a>{" "}
                  if you only need the tax line, and the{" "}
                  <a href="/tools/cmhc-insurance-calculator/" className="text-teal-600 hover:underline font-medium">
                    CMHC insurance calculator
                  </a>{" "}
                  if your down payment is under 20%.
                </p>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  How the calculator works
                </h2>
                <ol className="space-y-3 text-slate-600 list-decimal list-inside">
                  <li>
                    <strong className="text-slate-800">Enter the purchase price and province.</strong> Transfer tax is the piece that changes most by location.
                  </li>
                  <li>
                    <strong className="text-slate-800">Mark Toronto if you are buying there.</strong> Toronto charges municipal land transfer tax on top of Ontario’s provincial tax.
                  </li>
                  <li>
                    <strong className="text-slate-800">Add your down payment.</strong> That is included in “total cash needed,” separate from fees and tax.
                  </li>
                  <li>
                    <strong className="text-slate-800">Adjust legal, inspection, appraisal, title insurance, and moving costs</strong> to match the quotes you actually have.
                  </li>
                  <li>
                    <strong className="text-slate-800">Check first-time buyer</strong> if you qualify. The rebate logic follows the same Ontario, Toronto, B.C., and P.E.I. thresholds described in the FAQ.
                  </li>
                </ol>
                <p className="text-slate-600 mt-4">
                  Results are estimates for planning, not a lawyer’s statement of adjustments. HST on new construction, condo status certificates, estoppel fees, and prepaid property-tax adjustments can still move the final number.
                </p>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  What usually shows up on a Canadian closing statement
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Transfer taxes and registration</h3>
                    <p className="text-sm text-slate-600">
                      Land transfer tax or property transfer tax, plus land-titles registration. This is often the largest closing line outside Alberta and Saskatchewan.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Legal or notary fees</h3>
                    <p className="text-sm text-slate-600">
                      Commonly about $800–$1,500 plus disbursements, higher on complex titles or new builds. Get more than one quote.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Title insurance and inspection</h3>
                    <p className="text-sm text-slate-600">
                      Title insurance is often $200–$500. A home inspection is typically $400–$600 and is paid before closing if you waive conditions later.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">Lender and moving items</h3>
                    <p className="text-sm text-slate-600">
                      Appraisals (about $300–$500 when required), moving, and sometimes a survey or estoppel certificate. High-ratio deals also add default-insurance premium—see the CMHC calculator.
                    </p>
                  </div>
                </div>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  How provinces typically compare
                </h2>
                <p className="text-slate-600 mb-4">
                  Use these as planning ranges. The calculator applies the tax brackets for each province; Alberta and Saskatchewan return $0 transfer tax and you should still budget registration and legal fees.
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-1">Ontario and Toronto</h3>
                    <p className="text-sm text-slate-600">
                      Provincial land transfer tax is bracketed (0.5%–2.5%). Toronto doubles the hit with municipal tax. First-time buyer rebates can take a meaningful slice off, but they do not erase tax on higher-priced homes.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-1">British Columbia</h3>
                    <p className="text-sm text-slate-600">
                      Property transfer tax starts at 1% on the first $200,000 and 2% on the next band. First-time buyer relief in this tool is tied to the $500,000 / $525,000 thresholds above—not a blank cheque on a $1 million home.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-1">Alberta and Saskatchewan</h3>
                    <p className="text-sm text-slate-600">
                      No provincial land transfer tax. Closing cash is mostly legal, registration, and due diligence. Shop{" "}
                      <a href="/lenders/atb/" className="text-teal-600 hover:underline font-medium">
                        ATB mortgage rates
                      </a>{" "}
                      if you are buying in Alberta, then confirm cash to close here.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-1">Quebec and the Atlantic provinces</h3>
                    <p className="text-sm text-slate-600">
                      Quebec uses the well-known “welcome tax” brackets. Nova Scotia deed transfer is municipal and this calculator uses a 1.5% planning average. New Brunswick is modelled at 1% of value. Always verify the local rate with your lawyer or notary.
                    </p>
                  </div>
                </div>
              </section>

              <FAQSection faqs={faqs} />
            </div>

            <div className="space-y-6">
              <AdUnit format="sidebar" />
              <div className="card-default p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Related tools</h3>
                <div className="space-y-3">
                  <a href="/tools/land-transfer-tax-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">📋</span>
                    <div>
                      <p className="font-medium text-slate-900">Land Transfer Tax</p>
                      <p className="text-sm text-slate-500">Provincial and Toronto tax only</p>
                    </div>
                  </a>
                  <a href="/tools/cmhc-insurance-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="font-medium text-slate-900">CMHC Calculator</p>
                      <p className="text-sm text-slate-500">Premium if you put less than 20% down</p>
                    </div>
                  </a>
                  <a href="/tools/affordability-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <p className="font-medium text-slate-900">Affordability Calculator</p>
                      <p className="text-sm text-slate-500">How much home can you carry?</p>
                    </div>
                  </a>
                  <a href="/tools/stress-test-qualifier/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">✅</span>
                    <div>
                      <p className="font-medium text-slate-900">Stress Test</p>
                      <p className="text-sm text-slate-500">Will the mortgage qualify?</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="card-default p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Rates and lenders</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/rates/5-year-fixed/" className="text-teal-600 hover:underline font-medium">
                      5-year fixed rates
                    </a>
                  </li>
                  <li>
                    <a href="/rates/insured/" className="text-teal-600 hover:underline font-medium">
                      Insured mortgage rates
                    </a>
                  </li>
                  <li>
                    <a href="/rates/uninsured/" className="text-teal-600 hover:underline font-medium">
                      Uninsured mortgage rates
                    </a>
                  </li>
                  <li>
                    <a href="/lenders/td/" className="text-teal-600 hover:underline font-medium">
                      TD mortgage rates
                    </a>
                  </li>
                  <li>
                    <a href="/lenders/manulife/" className="text-teal-600 hover:underline font-medium">
                      Manulife Bank rates
                    </a>
                  </li>
                  <li>
                    <a href="/glossary/land-transfer-tax/" className="text-teal-600 hover:underline font-medium">
                      Land transfer tax glossary
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Compare rates after you know cash to close</h3>
                <p className="text-teal-100 text-sm mb-4">
                  Closing costs do not change the posted rate, but they change how much house you can actually complete. Shop current rates once the cash number is clear.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center text-sm font-semibold text-white hover:text-teal-100"
                >
                  Compare today&apos;s rates →
                </a>
              </div>

              <GuideCTA variant="compact" />
            </div>
          </div>
        </div>

        <CalculatorRelatedTools currentTool="/tools/closing-costs-calculator/" />

        <Footer />
      </main>
    </>
  );
}
