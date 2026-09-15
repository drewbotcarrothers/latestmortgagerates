import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StressTestQualifier from "@/components/StressTestQualifier";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import FAQSection from "@/components/FAQSection";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";

const faqs = [
  {
    question: "What is the mortgage stress test in Canada?",
    answer:
      "Federally regulated lenders must qualify you at a higher interest rate than the contract rate on the mortgage. This calculator uses the same rule of thumb as OSFI Guideline B-20: the qualifying rate is the greater of the Bank of Canada five-year conventional mortgage rate (this tool uses a 5.25% floor) or your contract rate plus 2%. You still make payments at the contract rate; the higher rate is only used to test whether the loan is affordable if rates rise.",
  },
  {
    question: "What are GDS and TDS ratios?",
    answer:
      "GDS (gross debt service) is housing costs divided by gross income. Housing costs here are the mortgage payment at the qualifying rate, property tax, heating, and condo fees. TDS (total debt service) adds other monthly debts such as car loans, student loans, and credit-card minimums. This calculator uses maximums of 39% GDS and 44% TDS, which match common federal and insurer guidelines. Both ratios are calculated at the stress-test rate, not the rate on your offer letter.",
  },
  {
    question: "What happens if I fail the stress test?",
    answer:
      "You can lower the mortgage (larger down payment or a less expensive home), reduce other monthly debts, add a co-borrower’s income, or wait until income is higher. A longer amortization lowers the qualifying payment but usually costs more interest and may not be available on every insured product. Some provincially regulated credit unions and private lenders use different rules, often at a higher rate. Failing this estimate does not always mean every lender will decline you, but it is a strong signal to reshape the deal before you waive conditions.",
  },
  {
    question: "Does the stress test apply to all mortgages?",
    answer:
      "It applies to new mortgages and refinances from OSFI-regulated lenders (the big banks, most Schedule I banks, and federally regulated trusts). Insured (high-ratio) mortgages must also meet insurer rules, which include a qualifying-rate test. Renewing with your current lender typically does not require a new stress test. Switching lenders at renewal usually does. Provincial credit unions and private lenders set their own policies; they may skip or modify the federal test and price for the extra risk.",
  },
  {
    question: "Do I have to pass the stress test when I renew?",
    answer:
      "If you stay with the same federally regulated lender, you generally do not re-qualify under the stress test just to renew. If you move the mortgage to a new lender, that new lender will qualify you as a new origination, including the qualifying-rate test. That is why a slightly higher renewal offer from your current bank can still be cheaper than switching if you would not pass elsewhere.",
  },
  {
    question: "Is the qualifying rate the same as the Bank of Canada overnight rate?",
    answer:
      "No. The overnight rate is the policy rate that influences prime and variable mortgages. The stress-test floor used here is the Bank of Canada five-year conventional mortgage rate (also called the qualifying rate), a different published series. Variable-rate borrowers still qualify at the greater of that floor or contract rate plus 2%, even if prime later moves.",
  },
  {
    question: "How can I improve my chances of passing?",
    answer:
      "Pay down revolving debt first (it hits TDS every month). Increase the down payment to shrink the mortgage—and potentially avoid default insurance if you reach 20%. A co-borrower with stable income can help if they will be on title and the mortgage. Choosing a longer amortization reduces the qualifying payment. Pre-approval is the practical way to test a real lender’s interpretation of your income (overtime, self-employment, and bonuses are often treated more strictly than this form).",
  },
  {
    question: "Does a co-signer automatically make me qualify?",
    answer:
      "A co-borrower whose income is used must also take on the debt, and lenders still apply GDS and TDS to the combined picture. A guarantor is treated differently than a co-borrower and is not always accepted. This calculator has a co-applicant income field so you can see the combined ratios; it is not a substitute for the lender’s credit and income policy.",
  },
];

export default function StressTestPage() {
  return (
    <>
      <HowToSchema
        name="How to Check Mortgage Stress Test Qualification"
        description="Verify if you qualify for a mortgage under Canada's stress test rules using GDS and TDS at the qualifying rate."
        totalTime="PT5M"
        steps={[
          {
            name: "Enter Household Income",
            text: "Input your gross annual income and any co-applicant income.",
          },
          {
            name: "Add Monthly Debts",
            text: "Enter existing monthly debt payments such as car loans and credit cards.",
          },
          {
            name: "Enter Housing Costs",
            text: "Add monthly property tax, heating, and condo fees.",
          },
          {
            name: "Enter Mortgage Details",
            text: "Input the mortgage amount, expected contract rate, and amortization.",
          },
          {
            name: "Review Qualification",
            text: "See GDS and TDS at the qualifying rate and whether you pass the 39% and 44% caps used in this tool.",
          },
        ]}
      />

      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools/" },
          { name: "Mortgage Stress Test Calculator" },
        ]}
      />

      <main className="min-h-screen bg-slate-50">
        <Header currentPage="tools" />
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-teal-300 mb-4">
                <a href="/tools/" className="hover:text-white transition-colors">Tools</a>
                <span>/</span>
                <span>Stress Test Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Mortgage Stress Test Calculator</h1>
              <p className="text-xl text-slate-300">
                Check whether your income, debts, and mortgage amount pass Canada’s qualifying-rate rules before you make an offer.
                This page is for buyers, refinancers, and anyone switching lenders who needs a GDS/TDS read at the stress-test rate—not the payment on the rate sheet.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          <StressTestQualifier />
        </div>

        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Who this calculator is for
                </h2>
                <p className="text-slate-600 mb-4">
                  Use it when you want a fast yes/no on the federal-style stress test: salaried buyers getting pre-approved, couples combining income, and homeowners who might refinance or switch at renewal.
                  It is not a credit decision. Lenders still verify employment, down-payment source, credit score, and property type.
                </p>
                <p className="text-slate-600">
                  If you already know the mortgage size, start here. If you do not, use the{" "}
                  <a href="/tools/affordability-calculator/" className="text-teal-600 hover:underline font-medium">
                    affordability calculator
                  </a>{" "}
                  first, then come back. Compare the contract rate you type in against{" "}
                  <a href="/rates/5-year-fixed/" className="text-teal-600 hover:underline font-medium">
                    current 5-year fixed rates
                  </a>{" "}
                  or{" "}
                  <a href="/rates/variable/" className="text-teal-600 hover:underline font-medium">
                    variable rates
                  </a>
                  .
                </p>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  How the qualifying rate is calculated
                </h2>
                <p className="text-slate-600 mb-4">
                  OSFI requires federally regulated lenders to qualify most uninsured mortgages at the greater of:
                </p>
                <ul className="space-y-2 text-slate-600 mb-4">
                  <li>
                    <strong className="text-slate-800">Contract rate + 2 percentage points</strong>, or
                  </li>
                  <li>
                    <strong className="text-slate-800">the Bank of Canada five-year conventional mortgage rate</strong> (this calculator’s floor is 5.25%).
                  </li>
                </ul>
                <p className="text-slate-600 mb-4">
                  Example: a 4.50% contract rate is tested at 6.50% (4.50 + 2), because 6.50 is higher than 5.25. A 3.10% contract rate is tested at 5.25%, because the floor is higher than 5.10%. The monthly payment shown in the results is the qualifying payment, which is higher than the payment you would actually write each month.
                </p>
                <p className="text-sm text-slate-500">
                  The 5.25% floor is the value built into this tool. The Bank of Canada series can move; lenders may update their qualifying rate when that published rate changes. Treat a result near the 39% / 44% limits as a yellow light, not a guarantee.
                </p>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  GDS and TDS, in plain terms
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">GDS — housing only</h3>
                    <p className="text-sm text-slate-600">
                      Qualifying mortgage payment + property tax + heating + condo fees, divided by gross monthly income. This tool’s cap is 39%.
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-slate-900 mb-2">TDS — housing plus other debt</h3>
                    <p className="text-sm text-slate-600">
                      GDS items plus car loans, lines of credit, student loans, and credit-card payments. This tool’s cap is 44%.
                    </p>
                  </div>
                </div>
                <p className="text-slate-600">
                  Most lenders count <strong>50% of condo fees</strong> in GDS. This calculator includes the <strong>full condo fee</strong>, so a condo purchase may look slightly harder to qualify here than on a bank worksheet. Heating is a required housing cost even if it is bundled; the default $100 is a planning figure, not your utility bill.
                </p>
              </section>

              <section className="card-default p-6">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Who has to pass—and who might not
                </h2>
                <ul className="space-y-3 text-slate-600">
                  <li>
                    <strong className="text-slate-800">Big banks and other OSFI-regulated lenders</strong> (for example{" "}
                    <a href="/lenders/td/" className="text-teal-600 hover:underline font-medium">TD</a>
                    {" "}and{" "}
                    <a href="/lenders/manulife/" className="text-teal-600 hover:underline font-medium">Manulife Bank</a>
                    ) apply the federal test on new purchases and refinances.
                  </li>
                  <li>
                    <strong className="text-slate-800">High-ratio (insured) mortgages</strong> must satisfy the insurer as well. Compare{" "}
                    <a href="/rates/insured/" className="text-teal-600 hover:underline font-medium">insured rates</a>
                    {" "}after you know the premium from the{" "}
                    <a href="/tools/cmhc-insurance-calculator/" className="text-teal-600 hover:underline font-medium">CMHC calculator</a>.
                  </li>
                  <li>
                    <strong className="text-slate-800">Same-lender renewals</strong> usually skip a new stress test. Shopping the renewal to a new lender brings it back.
                  </li>
                  <li>
                    <strong className="text-slate-800">Some provincial credit unions and private lenders</strong> use different qualification.{" "}
                    <a href="/lenders/atb/" className="text-teal-600 hover:underline font-medium">ATB Financial</a>
                    {" "}is Alberta-based and provincially regulated; insured deals still have to meet insurer rules.
                  </li>
                </ul>
              </section>

              <FAQSection faqs={faqs} />
            </div>

            <div className="space-y-6">
              <AdUnit format="sidebar" />
              <div className="card-default p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Related tools</h3>
                <div className="space-y-3">
                  <a href="/tools/affordability-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🏠</span>
                    <div>
                      <p className="font-medium text-slate-900">Affordability Calculator</p>
                      <p className="text-sm text-slate-500">Work backwards from income</p>
                    </div>
                  </a>
                  <a href="/tools/mortgage-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🧮</span>
                    <div>
                      <p className="font-medium text-slate-900">Payment Calculator</p>
                      <p className="text-sm text-slate-500">Actual payment at the contract rate</p>
                    </div>
                  </a>
                  <a href="/tools/cmhc-insurance-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🛡️</span>
                    <div>
                      <p className="font-medium text-slate-900">CMHC Calculator</p>
                      <p className="text-sm text-slate-500">Premium if down payment is under 20%</p>
                    </div>
                  </a>
                  <a href="/tools/mortgage-renewal-calculator/" className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                    <span className="text-2xl">🔄</span>
                    <div>
                      <p className="font-medium text-slate-900">Renewal Calculator</p>
                      <p className="text-sm text-slate-500">Stay vs switch at renewal</p>
                    </div>
                  </a>
                </div>
              </div>

              <div className="card-default p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Rates to test against</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="/rates/5-year-fixed/" className="text-teal-600 hover:underline font-medium">
                      5-year fixed rates
                    </a>
                  </li>
                  <li>
                    <a href="/rates/variable/" className="text-teal-600 hover:underline font-medium">
                      Variable rates
                    </a>
                  </li>
                  <li>
                    <a href="/rates/insured/" className="text-teal-600 hover:underline font-medium">
                      Insured rates
                    </a>
                  </li>
                  <li>
                    <a href="/rates/uninsured/" className="text-teal-600 hover:underline font-medium">
                      Uninsured rates
                    </a>
                  </li>
                  <li>
                    <a href="/glossary/stress-test/" className="text-teal-600 hover:underline font-medium">
                      Stress test glossary
                    </a>
                  </li>
                  <li>
                    <a href="/mortgage-guide/" className="text-teal-600 hover:underline font-medium">
                      Mortgage negotiation guide
                    </a>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl p-6 text-white">
                <h3 className="text-lg font-bold mb-2">Passed on paper? Compare lenders next</h3>
                <p className="text-teal-100 text-sm mb-4">
                  Qualification and rate are different questions. Once the ratios clear, shop the contract rate across lenders.
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

        <CalculatorRelatedTools currentTool="/tools/stress-test-qualifier/" />

        <Footer />
      </main>
    </>
  );
}
