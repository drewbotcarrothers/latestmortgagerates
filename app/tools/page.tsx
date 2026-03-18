import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: "Mortgage Calculators & Tools | Latest Mortgage Rates Canada",
  description: "Free Canadian mortgage calculators: payment calculator, affordability calculator, land transfer tax calculator, and CMHC insurance calculator. Plan your home purchase with accurate tools.",
  keywords: "mortgage calculator Canada, mortgage payment calculator, affordability calculator, land transfer tax calculator, CMHC calculator, home buying tools",
  openGraph: {
    title: "Mortgage Calculators & Tools | Latest Mortgage Rates Canada",
    description: "Free Canadian mortgage calculators to plan your home purchase. Calculate payments, affordability, taxes, and insurance.",
    type: "website",
  },
};

interface ToolCardProps {
  title: string;
  description: string;
  href: string;
  icon: string;
  questions: string[];
}

function ToolCard({ title, description, href, icon, questions }: ToolCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="card-default p-6 h-full transition-all duration-200 hover:shadow-lg hover:border-teal-200">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-teal-200 transition-colors">
            {icon}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-teal-700 transition-colors">
              {title}
            </h2>
            <p className="text-slate-600 mb-4">{description}</p>
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700">This tool answers:</p>
              <ul className="space-y-1">
                {questions.map((question, i) => (
                  <li key={i} className="text-sm text-slate-500 flex items-start gap-2">
                    <span className="text-teal-500 mt-0.5">✓</span>
                    {question}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex items-center text-teal-600 font-medium text-sm group-hover:text-teal-700">
              Try Calculator
              <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

const tools: ToolCardProps[] = [
  {
    title: "Mortgage Payment Calculator",
    description: "Calculate your monthly mortgage payments, amortization schedule, and see how much interest you'll pay over the life of your loan.",
    href: "/tools/mortgage-calculator",
    icon: "🧮",
    questions: [
      "What will my monthly mortgage payment be?",
      "How much interest will I pay over 25 years?",
      "How do extra payments affect my mortgage?",
      "What's the difference between monthly and bi-weekly payments?",
    ],
  },
  {
    title: "Mortgage Affordability Calculator",
    description: "Find out how much house you can afford based on your income, debts, and down payment. Includes GDS and TDS ratio calculations.",
    href: "/tools/affordability-calculator",
    icon: "🏠",
    questions: [
      "How much mortgage can I afford?",
      "What price range should I look at?",
      "Do I meet the stress test requirements?",
      "How do my existing debts affect affordability?",
    ],
  },
  {
    title: "Land Transfer Tax Calculator",
    description: "Calculate land transfer taxes for any Canadian province. Includes first-time homebuyer rebates and Toronto municipal tax.",
    href: "/tools/land-transfer-tax-calculator",
    icon: "📋",
    questions: [
      "How much land transfer tax will I pay?",
      "Do I qualify for first-time buyer rebates?",
      "What's the difference between provincial and municipal tax?",
      "How much can I save with rebates?",
    ],
  },
  {
    title: "CMHC Insurance Calculator",
    description: "Calculate your CMHC mortgage insurance premium. See how your down payment affects your insurance costs and total mortgage amount.",
    href: "/tools/cmhc-insurance-calculator",
    icon: "🛡️",
    questions: [
      "How much CMHC insurance will I pay?",
      "What's the minimum down payment required?",
      "How does a larger down payment save on insurance?",
      "Is mortgage insurance required for my purchase?",
    ],
  },
  {
    title: "Rent vs Buy Calculator",
    description: "Compare the financial impact of renting vs buying a home. See your break-even point and long-term net worth with each option.",
    href: "/tools/rent-vs-buy-calculator",
    icon: "⚖️",
    questions: [
      "Should I rent or buy a home?",
      "What's my break-even point?",
      "Which option builds more wealth?",
      "How do appreciation and investments compare?",
    ],
  },
  {
    title: "Refinance Calculator",
    description: "Calculate if refinancing your mortgage makes sense. Compare rates, estimate penalties, and see your break-even point and savings.",
    href: "/tools/refinance-calculator",
    icon: "🔄",
    questions: [
      "Should I refinance my mortgage?",
      "What's my penalty to break early?",
      "When will I break even?",
      "How much will I save by refinancing?",
    ],
  },
  {
    title: "Closing Costs Calculator",
    description: "Calculate total closing costs for buying a home in Canada. Includes land transfer tax, legal fees, and province-specific rebates.",
    href: "/tools/closing-costs-calculator",
    icon: "💰",
    questions: [
      "How much are closing costs?",
      "What fees do I pay when buying?",
      "Do I qualify for first-time buyer rebates?",
      "How much cash do I need to close?",
    ],
  },
  {
    title: "Mortgage Penalty Calculator",
    description: "Calculate your penalty for breaking your mortgage early. Estimate 3-month interest or IRD penalties for fixed and variable rates.",
    href: "/tools/mortgage-penalty-calculator",
    icon: "⚠️",
    questions: [
      "How much is my mortgage penalty?",
      "3 months interest or IRD - which applies?",
      "Can I reduce my penalty?",
      "What's the cost to break my mortgage?",
    ],
  },
  {
    title: "Stress Test Qualifier",
    description: "Check if you qualify for a mortgage under Canada's stress test rules. Calculate GDS and TDS ratios to see if you can get approved.",
    href: "/tools/stress-test-qualifier",
    icon: "✅",
    questions: [
      "Will I pass the stress test?",
      "What are my GDS and TDS ratios?",
      "How much income do I need?",
      "Do I qualify for a mortgage?",
    ],
  },
];

export default function ToolsPage() {
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
                  width={70}
                  height={70}
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
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mortgage Calculators & Tools
            </h1>
            <p className="text-xl text-slate-300 mb-8">
              Free Canadian mortgage calculators to help you plan your home purchase. 
              Calculate payments, affordability, taxes, and insurance with accurate, up-to-date formulas.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                100% Free
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Canadian-Specific
              </span>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                No Registration Required
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>

      {/* Why Use Our Calculators */}
      <div className="bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">
            Why Use Our Mortgage Calculators?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accurate Calculations</h3>
              <p className="text-slate-600">
                Built with Canadian mortgage rules including stress test requirements and provincial tax rates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Instant Results</h3>
              <p className="text-slate-600">
                Get immediate answers to your mortgage questions with our fast, easy-to-use calculators.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Private & Secure</h3>
              <p className="text-slate-600">
                No personal information required. All calculations happen in your browser.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card-default p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Are these calculators accurate?</h3>
            <p className="text-slate-600">
              Yes, our calculators use standard Canadian mortgage formulas and current rates. However, final approval depends on your lender's specific criteria.
            </p>
          </div>
          <div className="card-default p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Do I need to create an account?</h3>
            <p className="text-slate-600">
              No, all our calculators are completely free and require no registration or personal information.
            </p>
          </div>
          <div className="card-default p-6">
            <h3 className="font-semibold text-slate-900 mb-2">What's the mortgage stress test?</h3>
            <p className="text-slate-600">
              Canadian lenders must qualify you at a higher rate (currently 5.25% or your contract rate + 2%, whichever is higher) to ensure you can handle rate increases.
            </p>
          </div>
          <div className="card-default p-6">
            <h3 className="font-semibold text-slate-900 mb-2">Can I save my calculations?</h3>
            <p className="text-slate-600">
              While we don't save calculations, you can bookmark any calculator page with your inputs in the URL to return later.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Ready to Compare Real Rates?</h2>
              <p className="text-teal-100">
                See today's best mortgage rates from 31+ Canadian lenders.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-white text-teal-700 font-semibold rounded-lg hover:bg-teal-50 transition-colors"
            >
              View Current Rates
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
