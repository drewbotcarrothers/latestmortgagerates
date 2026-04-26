import type { Metadata } from "next";
import Link from "next/link";
import Header from "../components/Header";

// Force static generation for static export
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Glossary | Key Terms & Definitions | Latest Mortgage Rates Canada",
  description: "Comprehensive mortgage glossary explaining key terms for Canadian homebuyers. Understand amortization, CMHC, GDS ratio, LTV, and more mortgage terminology.",
  keywords: [
    "mortgage glossary",
    "mortgage terms canada",
    "cmhc meaning",
    "amortization definition",
    "mortgage terminology",
    "home buying terms",
  ],
  alternates: {
    canonical: "https://latestmortgagerates.ca/glossary",
  },
  openGraph: {
    title: "Mortgage Glossary | Key Terms & Definitions",
    description: "Clear explanations of mortgage terminology for Canadian homebuyers",
    type: "website",
    url: "https://latestmortgagerates.ca/glossary",
  },
};

interface GlossaryTerm {
  term: string;
  slug: string;
  definition: string;
  category: string;
  relatedTools?: { href: string; label: string }[];
}

// Related tools mapping for glossary terms
const relatedToolsMap: Record<string, { href: string; label: string }[]> = {
  "amortization-period": [
    { href: "/tools/mortgage-calculator", label: "Payment Calculator" },
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "apr": [
    { href: "/tools/mortgage-calculator", label: "Payment Calculator" },
  ],
  "cmhc-insurance": [
    { href: "/tools/cmhc-insurance-calculator", label: "CMHC Calculator" },
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "down-payment": [
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
    { href: "/tools/cmhc-insurance-calculator", label: "CMHC Calculator" },
  ],
  "fhsa": [
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "fixed-rate-mortgage": [
    { href: "/", label: "Compare Fixed Rates" },
    { href: "/tools/mortgage-calculator", label: "Payment Calculator" },
  ],
  "variable-rate-mortgage": [
    { href: "/", label: "Compare Variable Rates" },
    { href: "/tools/mortgage-calculator", label: "Payment Calculator" },
  ],
  "heloc": [
    { href: "/tools/refinance-calculator", label: "Refinance Calculator" },
  ],
  "high-ratio-mortgage": [
    { href: "/tools/cmhc-insurance-calculator", label: "CMHC Calculator" },
  ],
  "land-transfer-tax": [
    { href: "/tools/land-transfer-tax-calculator", label: "Land Transfer Tax Calculator" },
  ],
  "mortgage-broker": [
    { href: "/", label: "Compare Lenders" },
  ],
  "mortgage-default-insurance": [
    { href: "/tools/cmhc-insurance-calculator", label: "CMHC Calculator" },
  ],
  "mortgage-pre-approval": [
    { href: "/tools/stress-test-qualifier", label: "Stress Test Qualifier" },
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "mortgage-renewal": [
    { href: "/tools/mortgage-renewal-calculator", label: "Renewal Calculator" },
  ],
  "mortgage-stress-test": [
    { href: "/tools/stress-test-qualifier", label: "Stress Test Qualifier" },
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "open-mortgage": [
    { href: "/tools/mortgage-penalty-calculator", label: "Penalty Calculator" },
  ],
  "refinancing": [
    { href: "/tools/refinance-calculator", label: "Refinance Calculator" },
  ],
  "stress-test": [
    { href: "/tools/stress-test-qualifier", label: "Stress Test Qualifier" },
  ],
  "gds-ratio": [
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "tds-ratio": [
    { href: "/tools/affordability-calculator", label: "Affordability Calculator" },
  ],
  "closing-costs": [
    { href: "/tools/closing-costs-calculator", label: "Closing Costs Calculator" },
  ],
};

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Amortization Period",
    slug: "amortization-period",
    category: "Basic Terms",
    definition: "The total length of time it takes to pay off your mortgage in full. In Canada, the maximum amortization is 25 years for insured mortgages and up to 30 years for conventional mortgages. A longer amortization means lower monthly payments but more interest paid over time.",
  },
  {
    term: "APR (Annual Percentage Rate)",
    slug: "apr",
    category: "Rates",
    definition: "The total cost of borrowing expressed as an annual rate. APR includes the interest rate plus any fees, giving you a more accurate comparison between different mortgage offers.",
  },
  {
    term: "Assumable Mortgage",
    slug: "assumable-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage that can be transferred to a new buyer when a property is sold. The buyer takes over the existing mortgage terms, which can be attractive if the rate is lower than current market rates.",
  },
  {
    term: "Blend and Extend",
    slug: "blend-and-extend",
    category: "Features",
    definition: "Combining your existing mortgage rate with current rates and extending your term. This avoids prepayment penalties while securing a new rate for a longer period.",
  },
  {
    term: "Cash Back Mortgage",
    slug: "cash-back-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage where the lender provides a cash lump sum (usually 1-5% of the mortgage amount) at closing. These typically come with higher interest rates and restrictions on breaking the mortgage early.",
  },
  {
    term: "Closed Mortgage",
    slug: "closed-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage with restrictions on prepayment. You typically can't pay off the mortgage early without penalties, though most allow annual prepayments of 10-20% without penalty. Closed mortgages usually have lower rates than open mortgages.",
  },
  {
    term: "CMHC Insurance",
    slug: "cmhc-insurance",
    category: "Insurance",
    definition: "Canada Mortgage and Housing Corporation insurance (or similar from Sagen or Canada Guaranty) required when your down payment is less than 20%. Premiums range from 0.6% to 4% of the mortgage amount and protect the lender if you default.",
  },
  {
    term: "Conventional Mortgage",
    slug: "conventional-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage with at least 20% down payment that doesn't require CMHC insurance. Also called an uninsured mortgage. You can amortize up to 30 years and have more refinancing flexibility.",
  },
  {
    term: "Debt Service Ratios",
    slug: "debt-service-ratios",
    category: "Qualification",
    definition: "Lenders use two ratios to determine how much you can borrow: GDS (Gross Debt Service) which includes housing costs (max 32% of income) and TDS (Total Debt Service) which includes all debts (max 40% of income).",
  },
  {
    term: "Down Payment",
    slug: "down-payment",
    category: "Basic Terms",
    definition: "The portion of the home purchase price you pay upfront. In Canada, minimum down payment is 5% for homes under $500,000, 5% on first $500k and 10% on remainder up to $999,999, and 20% for $1M+ properties.",
  },
  {
    term: "First Home Savings Account (FHSA)",
    slug: "fhsa",
    category: "Programs",
    definition: "A registered account allowing first-time buyers to save up to $40,000 ($8,000/year) tax-free for a home purchase. Contributions are tax-deductible like an RRSP, and withdrawals are tax-free like a TFSA.",
  },
  {
    term: "Fixed Rate Mortgage",
    slug: "fixed-rate-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage where the interest rate stays constant for the entire term (typically 1-5 years). Your payments remain the same, providing budgeting certainty and protection from rate increases.",
  },
  {
    term: "GDS Ratio (Gross Debt Service)",
    slug: "gds-ratio",
    category: "Qualification",
    definition: "The percentage of your gross monthly income that covers housing costs (mortgage payment, property taxes, heating, and 50% of condo fees). Maximum GDS is 32% for qualification purposes.",
  },
  {
    term: "HELOC (Home Equity Line of Credit)",
    slug: "heloc",
    category: "Products",
    definition: "A revolving line of credit secured by your home equity. You can borrow up to 65% of your home's value (or 80% including your mortgage). Interest rates are variable and payments are interest-only on the amount borrowed.",
  },
  {
    term: "High-Ratio Mortgage",
    slug: "high-ratio-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage with less than 20% down payment that requires mortgage default insurance (CMHC/Sagen/Canada Guaranty). These mortgages typically have slightly better interest rates but include insurance premiums.",
  },
  {
    term: "Home Buyers' Plan (HBP)",
    slug: "home-buyers-plan",
    category: "Programs",
    definition: "A program allowing first-time buyers to withdraw up to $35,000 ($70,000 for couples) from their RRSP to buy a home. The amount must be repaid over 15 years, starting the second year after withdrawal.",
  },
  {
    term: "Interest Rate Differential (IRD)",
    slug: "ird",
    category: "Penalties",
    definition: "A method of calculating prepayment penalties on fixed-rate mortgages. It's the difference between your mortgage rate and the current rate for your remaining term, multiplied by your balance and time remaining.",
  },
  {
    term: "Land Transfer Tax",
    slug: "land-transfer-tax",
    category: "Closing Costs",
    definition: "A provincial tax paid when transferring property ownership. Rates vary by province (0.5% to 2% of purchase price). First-time buyers in Ontario and BC may receive rebates up to $4,000-$8,000.",
  },
  {
    term: "LTV (Loan to Value Ratio)",
    slug: "ltv",
    category: "Basic Terms",
    definition: "The mortgage amount divided by the property value, expressed as a percentage. For example, a $400,000 mortgage on a $500,000 home has an 80% LTV. Higher LTV means more risk and potentially higher rates.",
  },
  {
    term: "Maturity Date",
    slug: "maturity-date",
    category: "Basic Terms",
    definition: "The end of your mortgage term when your contract expires. At maturity, you must either renew with your current lender, switch to a new lender, or pay off the mortgage balance.",
  },
  {
    term: "Monoline Lender",
    slug: "monoline-lender",
    category: "Lenders",
    definition: "A lender that only offers mortgages (no banking products or branches). Examples include First National, MCAP, and CMLS. They often offer lower rates than banks but with less flexibility.",
  },
  {
    term: "Mortgage Broker",
    slug: "mortgage-broker",
    category: "Professionals",
    definition: "A licensed professional who shops multiple lenders to find you the best mortgage rate and terms. They work for you (not the lender) and are paid by the lender, typically at no cost to you.",
  },
  {
    term: "Mortgage Default Insurance",
    slug: "mortgage-default-insurance",
    category: "Insurance",
    definition: "Insurance that protects the lender (not you) if you fail to make mortgage payments. Required when your down payment is less than 20%. Premiums range from 0.6% to 4% and are usually added to your mortgage balance.",
  },
  {
    term: "Mortgage Pre-Approval",
    slug: "mortgage-pre-approval",
    category: "Process",
    definition: "A lender's conditional commitment to lend you a specific amount, based on your financial information. Pre-approvals typically last 90-120 days and lock in an interest rate while you shop for a home.",
  },
  {
    term: "Mortgage Term",
    slug: "mortgage-term",
    category: "Basic Terms",
    definition: "The length of time your mortgage agreement is in effect, typically 1 to 10 years. At the end of the term, you must renew your mortgage, renegotiate terms, or pay it off. Most Canadians choose 5-year terms.",
  },
  {
    term: "Open Mortgage",
    slug: "open-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage that can be paid off partially or in full at any time without penalties. These offer maximum flexibility but come with higher interest rates than closed mortgages.",
  },
  {
    term: "Portable Mortgage",
    slug: "portable-mortgage",
    category: "Features",
    definition: "A mortgage that can be transferred to a new property if you move before the term ends. You keep your existing rate and terms while avoiding prepayment penalties.",
  },
  {
    term: "Posted Rate",
    slug: "posted-rate",
    category: "Rates",
    definition: "The advertised interest rate that banks display publicly. Most borrowers receive a discount from the posted rate. The difference between posted and contract rates affects prepayment penalty calculations.",
  },
  {
    term: "Prepayment Penalty",
    slug: "prepayment-penalty",
    category: "Penalties",
    definition: "A fee charged when you break your mortgage early, pay more than your prepayment privilege, or transfer to another lender. On fixed rates, it's the greater of 3 months' interest or the Interest Rate Differential (IRD).",
  },
  {
    term: "Prepayment Privileges",
    slug: "prepayment-privileges",
    category: "Features",
    definition: "The amount you can pay toward your mortgage principal each year without penalty. Typical privileges include: 10-20% of the original balance as a lump sum, and/or increasing payments by 10-20%.",
  },
  {
    term: "Prime Rate",
    slug: "prime-rate",
    category: "Rates",
    definition: "The interest rate banks charge their best customers, typically set at the Bank of Canada overnight rate plus 2-2.2%. Currently around 5.45%. Variable mortgage rates are expressed as Prime minus or plus a certain percentage.",
  },
  {
    term: "Property Tax",
    slug: "property-tax",
    category: "Closing Costs",
    definition: "An annual municipal tax based on your property's assessed value, typically 0.5% to 1.5% of the property value. Can be paid directly to the municipality or through your mortgage lender (PIT).",
  },
  {
    term: "Refinancing",
    slug: "refinancing",
    category: "Process",
    definition: "Replacing your existing mortgage with a new one, typically to access equity, get a better rate, or change terms. Refinancing involves new qualification criteria and may incur prepayment penalties.",
  },
  {
    term: "Renewal",
    slug: "renewal",
    category: "Process",
    definition: "The process of renegotiating your mortgage at the end of your term. You can renew with your current lender or switch to a new one. Shopping around at renewal can save thousands over the new term.",
  },
  {
    term: "Reverse Mortgage",
    slug: "reverse-mortgage",
    category: "Products",
    definition: "A loan available to homeowners 55+ that allows them to access up to 55% of their home equity without selling. No payments are required until the home is sold or the last borrower moves out or passes away.",
  },
  {
    term: "Second Mortgage",
    slug: "second-mortgage",
    category: "Products",
    definition: "An additional loan secured against your home, behind the first mortgage in priority. Second mortgages have higher rates due to increased lender risk and are often used to access home equity.",
  },
  {
    term: "Stress Test",
    slug: "stress-test",
    category: "Qualification",
    definition: "A requirement that borrowers qualify at a higher interest rate than their contract rate. You must qualify at the greater of your rate + 2% or the Bank of Canada 5-year benchmark rate (currently ~5.25%).",
  },
  {
    term: "TDS Ratio (Total Debt Service)",
    slug: "tds-ratio",
    category: "Qualification",
    definition: "The percentage of your gross monthly income needed to cover all housing costs (GDS) plus all other debt payments (car loans, credit cards, student loans). Maximum TDS is 40% for qualification.",
  },
  {
    term: "Title Insurance",
    slug: "title-insurance",
    category: "Insurance",
    definition: "Insurance that protects against title defects, fraud, and ownership disputes. Required by most lenders in Canada. A one-time premium (~$250-$400) covers you for as long as you own the property.",
  },
  {
    term: "Variable Rate Mortgage",
    slug: "variable-rate-mortgage",
    category: "Mortgage Types",
    definition: "A mortgage where the interest rate fluctuates with your lender's prime rate. Your payment typically stays the same, but the amount going to principal versus interest changes as rates move up or down.",
  },
];

const categories = [...new Set(glossaryTerms.map((t) => t.category))].sort();

export default function GlossaryPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="glossary" />

      <div className="bg-white shadow-sm border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600 transition">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Glossary</li>
            </ol>
          </nav>
          
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mortgage Glossary</h1>
            <p className="text-slate-600 mt-2">Key terms and definitions every Canadian homebuyer should know</p>
          </div>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: glossaryTerms.map((term) => ({
              "@type": "Question",
              name: `What is ${term.term}?`,
              acceptedAnswer: {
                "@type": "Answer",
                text: term.definition,
              },
            })),
          }),
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Categories */}
        <div className="mb-8 flex flex-wrap gap-2 items-center">
          <span className="text-sm text-slate-500">Jump to:</span>
          {categories.map((cat) => (
            <a
              key={cat}
              href={`#${cat.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
            >
              {cat}
            </a>
          ))}
        </div>

        {/* Terms by Category */}
        {categories.map((category) => {
          const terms = glossaryTerms.filter((t) => t.category === category);
          return (
            <section
              key={category}
              id={category.toLowerCase().replace(/\s+/g, "-")}
              className="mb-12"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-2 border-b-2 border-teal-500">
                {category}
              </h2>
              <div className="space-y-4">
                {terms.map((term) => (
                  <article
                    key={term.slug}
                    id={term.slug}
                    className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 scroll-mt-20 hover:shadow-md hover:border-teal-200 transition-all duration-200"
                  >
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {term.term}
                    </h3>
                    <p className="text-slate-700 leading-relaxed mb-4">
                      {term.definition}
                    </p>
                    {relatedToolsMap[term.slug] && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                        <span className="text-xs text-slate-500 mr-1">Related:</span>
                        {relatedToolsMap[term.slug].map((tool) => (
                          <Link
                            key={tool.href}
                            href={tool.href}
                            className="text-xs inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-100 hover:bg-teal-100 transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                            </svg>
                            {tool.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to Find Your Rate?
          </h2>
          <p className="text-slate-300 mb-6">
            Compare mortgage rates from Canada's top lenders and save thousands.
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-all duration-200"
          >
            Compare Rates Now
          </Link>
        </div>
      </div>
    </main>
  );
}
