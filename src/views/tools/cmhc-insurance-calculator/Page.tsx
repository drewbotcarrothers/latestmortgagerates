import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CMHCCalculator from "@/components/CMHCCalculator";
import HowToSchema from "@/components/HowToSchema";
import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import CalculatorRelatedTools from "@/components/CalculatorRelatedTools";
import FAQSection from "@/components/FAQSection";
import GuideCTA from "@/components/GuideCTA";
import AdUnit from "@/components/AdUnit";
import CalculatorGuide from "@/components/CalculatorGuide";
import { cmhcInsuranceFaqs, cmhcInsuranceGuide } from "@/content/calculatorGuides";
import { cmhcExtra } from "@/content/toolExplainers";


export default function CMHCCalculatorPage() {
  return (
    <>
      <HowToSchema
        name="How to Calculate CMHC Mortgage Insurance"
        description="Calculate your CMHC mortgage default insurance premium based on your home price and down payment"
        totalTime="PT3M"
        steps={[
          {
            name: "Enter Home Price",
            text: "Input the purchase price of the home you're considering.",
          },
          {
            name: "Enter Down Payment",
            text: "Under $1,500,000 the minimum is 5% of the first $500,000 and 10% of the rest. At $1,500,000 or more the minimum is 20%, because default insurance is not available.",
          },
          {
            name: "Review Premium",
            text: "The premium uses CMHC's traditional homeowner bands for an amortization of 25 years or less. It does not include the 0.20 point surcharge for a longer amortization or provincial sales tax.",
          },
        ]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "/" },
          { name: "Tools", url: "/tools" },
          { name: "CMHC Insurance Calculator" },
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
                <span>CMHC Insurance Calculator</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                CMHC Mortgage Insurance Calculator
              </h1>
              <p className="text-xl text-slate-300">
                Default insurance applies when the down payment is under 20% and the price is below $1.5 million. At $1.5 million or more this calculator charges no premium and the minimum down payment is 20%.
              </p>
            </div>
          </div>
        </div>

        {/* Calculator Section */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <CMHCCalculator />
          <div className="mt-8 max-w-md mx-auto">
            <GuideCTA variant="compact" context="buyer" utmMedium="cta_compact" utmContent="tool_cmhc-insurance-calculator" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          <CalculatorGuide sections={cmhcInsuranceGuide()} />
          <CalculatorGuide sections={cmhcExtra()} />
        </div>

        <CalculatorRelatedTools currentTool="/tools/cmhc-insurance-calculator" />

        <div className="max-w-4xl mx-auto px-4 pt-4">
          <AdUnit format="display" />
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <FAQSection
            faqs={[
              {
                question: "What is CMHC mortgage insurance?",
                answer: "CMHC (Canada Mortgage and Housing Corporation) mortgage insurance protects lenders if you default on your mortgage. It's required in Canada when your down payment is less than 20% of the purchase price. The premium is added to your mortgage amount and paid over the life of the loan.",
              },
              {
                question: "How much does CMHC insurance cost?",
                answer: "On this calculator the premium follows CMHC's traditional homeowner schedule for 25 years or less: 0.60% up to 65% loan-to-value, 1.70% to 75%, 2.40% to 80%, 2.80% to 85%, 3.10% to 90%, and 4.00% from 90.01% to 95%. At 20% down or more the page charges no premium. A price of $1,500,000 or more is not eligible. A longer amortization adds 0.20 points on CMHC's schedule, and this tool does not add it. Provincial sales tax can be extra. Confirm the premium on the commitment.",
              },
              {
                question: "Is CMHC insurance mandatory?",
                answer: "CMHC insurance is mandatory for high-ratio mortgages (less than 20% down) from federally regulated lenders. If you put 20% or more down, you avoid CMHC insurance entirely. Some credit unions and private lenders may have different requirements.",
              },
              {
                question: "Can I avoid CMHC insurance?",
                answer: "Yes, by making a down payment of 20% or more. Other options include getting a gifted down payment to reach 20%, using the Home Buyers' Plan to withdraw from your RRSP, or purchasing a less expensive home. Some alternative lenders also offer no-CMHC options with higher rates.",
              },
              {
                question: "Is CMHC insurance tax deductible?",
                answer: "The premium itself is not a personal tax deduction on a home you live in. Ontario (8% retail sales tax), Quebec (9% tax on insurance premiums, rising to 9.975% for premiums paid after December 31, 2026), and Saskatchewan (6% PST) tax the premium. CMHC says that provincial tax cannot be added to the loan. The calculator does not include it.",
              },
              ...cmhcInsuranceFaqs(),
            ]}
          />
        </div>

        <Footer />
      </main>
    </>
  );
}
