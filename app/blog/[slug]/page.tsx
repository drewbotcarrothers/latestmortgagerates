import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Force static generation for static export
export const dynamic = "force-static";

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  content: string[];
  faqs?: { question: string; answer: string }[];
}

const blogPosts: Record<string, BlogPost> = {
  "fixed-vs-variable-mortgage-rates": {
    slug: "fixed-vs-variable-mortgage-rates",
    title: "Fixed vs Variable Mortgage Rates: Which is Right for You?",
    excerpt: "Compare the pros and cons of fixed and variable rate mortgages in Canada.",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What Are Fixed Rate Mortgages?",
      "",
      "A fixed rate mortgage guarantees your interest rate stays the same for the entire term of your mortgage, typically 1-10 years. Your monthly payments remain constant, giving you predictable budgeting and peace of mind.",
      "",
      "**Key benefits of fixed rates:**",
      "",
      "- **Payment stability**: Your monthly payment never changes",
      "- **Budgeting ease**: Perfect for first-time buyers and those on fixed incomes",
      "- **Protection from rate increases**: If rates go up, your payment stays the same",
      "- **Lower stress**: No need to worry about market fluctuations",
      "",
      "**Current best 5-year fixed rates**: Starting from 4.19%",
      "",
      "## What Are Variable Rate Mortgages?",
      "",
      "A variable rate mortgage has an interest rate that fluctuates with your lender's prime rate. When the Bank of Canada changes its overnight rate, your lender's prime rate typically follows, affecting your monthly payment or amortization.",
      "",
      "**Key benefits of variable rates:**",
      "",
      "- **Lower initial rates**: Variable rates are typically lower than fixed rates",
      "- **Potential savings**: Historically, variable rates have cost less over time",
      "- **Flexibility**: Often come with lower prepayment penalties",
      "- **Benefits from rate drops**: When rates decrease, you pay less interest",
      "",
      "**Current best 5-year variable rates**: Starting from 3.85%",
      "",
      "## Which Should You Choose?",
      "",
      "### Choose a Fixed Rate If:",
      "",
      "- You prefer predictable monthly payments",
      "- You're buying your first home and want stability",
      "- You believe interest rates will rise significantly",
      "- You have a fixed income or tight budget",
      "- You value peace of mind over potential savings",
      "",
      "### Choose a Variable Rate If:",
      "",
      "- You can handle some payment uncertainty",
      "- You have financial cushion for rate increases",
      "- You believe rates will stay stable or decrease",
      "- You may sell or refinance before term ends (lower penalties)",
      "- You're comfortable with market fluctuations",
      "",
      "## The Hybrid Approach",
      "",
      "Some borrowers split their mortgage into fixed and variable portions—typically 50/50 or 60/40. This hedges your bets: you get some payment stability while potentially benefiting from rate decreases on the variable portion.",
      "",
      "## Current Market Outlook (March 2026)",
      "",
      "With the Bank of Canada having cut rates recently, variable rate mortgages are looking attractive for risk-tolerant borrowers. However, fixed rates have also become more competitive, offering near-historic lows.",
      "",
      "**Bottom line**: There's no universally right answer. Your choice should reflect your risk tolerance, financial situation, and market outlook. Always compare current rates and speak with a mortgage professional before deciding.",
    ],
    faqs: [
      {
        question: "Can I switch from variable to fixed during my term?",
        answer: "Yes, most lenders allow you to convert from a variable rate to a fixed rate at any time without penalty. However, you'll be locked into the fixed rate available at that time, which may be higher than your current variable rate.",
      },
      {
        question: "What happens when my mortgage term ends?",
        answer: "At the end of your term (typically 5 years), you'll need to renew your mortgage. This is an opportunity to renegotiate your rate and potentially switch between fixed and variable. Most Canadians renew every 5 years.",
      },
      {
        question: "How much can variable rates change?",
        answer: "Variable rates change with the lender's prime rate, which typically follows the Bank of Canada's overnight rate. Changes are usually 0.25% increments, but can be larger. Over a 5-year term, variable rates could potentially move 2-3% in either direction.",
      },
    ],
  },
  "first-time-home-buyer-guide-canada": {
    slug: "first-time-home-buyer-guide-canada",
    title: "First-Time Home Buyer Guide: Everything You Need to Know",
    excerpt: "A complete guide for first-time buyers in Canada.",
    category: "First-Time Buyers",
    readTime: "8 min read",
    publishedAt: "2026-03-03",
    content: [
      "## Introduction",
      "",
      "Buying your first home is one of the biggest financial decisions you'll make. This guide covers everything Canadian first-time buyers need to know, from saving your down payment to closing the deal.",
      "",
      "## Down Payment Requirements",
      "",
      "In Canada, your minimum down payment depends on the purchase price:",
      "",
      "- **Under $500,000**: Minimum 5% of purchase price",
      "- **$500,000 to $999,999**: 5% on first $500,000 + 10% on remainder",
      "- **$1,000,000 or more**: Minimum 20% required",
      "",
      "**Pro tip**: Saving 20% avoids CMHC insurance (0.6% - 4% of mortgage amount), but isn't always practical in expensive markets.",
      "",
      "## First-Time Buyer Programs",
      "",
      "### 1. First Home Savings Account (FHSA)",
      "",
      "The FHSA is a game-changer for first-time buyers:",
      "",
      "- Contribute up to $8,000/year (lifetime max $40,000)",
      "- Contributions are tax-deductible (like RRSP)",
      "- Withdrawals for home purchase are tax-free (like TFSA)",
      "- Can combine with RRSP Home Buyers' Plan",
      "",
      "### 2. RRSP Home Buyers' Plan (HBP)",
      "",
      "- Withdraw up to $35,000 from your RRSP ($70,000 for couples)",
      "- Must repay over 15 years, starting second year after withdrawal",
      "- No tax on withdrawal if used for qualifying home purchase",
      "",
      "### 3. Land Transfer Tax Rebates",
      "",
      "Many provinces offer rebates for first-time buyers:",
      "",
      "- **Ontario**: Up to $4,000 rebate",
      "- **BC**: Up to $8,000 rebate (varies by region)",
      "- **Toronto**: Additional municipal rebate up to $4,475",
      "",
      "## The Mortgage Pre-Approval Process",
      "",
      "**Step 1: Check your credit score**",
      "Aim for 680+ for best rates. You can check free at Borrowell or Credit Karma.",
      "",
      "**Step 2: Calculate what you can afford**",
      "Use the rule of thumb: maximum 32% of gross income for housing costs (mortgage, property tax, heating).",
      "",
      "**Step 3: Stress test qualification**",
      "You must qualify at the greater of: your contract rate + 2%, or the Bank of Canada 5-year benchmark rate (currently ~5.25%).",
      "",
      "**Step 4: Get pre-approved**",
      "A mortgage pre-approval shows sellers you're serious and locks in a rate (usually 90-120 days).",
      "",
      "## Additional Costs to Budget For",
      "",
      "Beyond the down payment, budget for:",
      "",
      "- **Closing costs**: 1.5% - 4% of purchase price",
      "  - Legal fees: $1,000 - $2,000",
      "  - Home inspection: $300 - $600",
      "  - Appraisal: $300 - $500",
      "  - Title insurance: $250 - $400",
      "- **Land transfer tax**: 0.5% - 2% of purchase price",
      "- **CMHC insurance**: 0.6% - 4% (if less than 20% down)",
      "- **Moving costs**: $500 - $5,000+",
      "- **Immediate repairs/updates**: Varies",
      "",
      "## The Buying Process Timeline",
      "",
      "1. **Month 1-3**: Save, check credit, get pre-approved",
      "2. **Month 3-6**: House hunt with realtor",
      "3. **Week of purchase**: Make offer, negotiate, get accepted",
      "4. **Week 1-2**: Home inspection, finalize mortgage",
      "5. **Week 2-4**: Lawyer review, title search",
      "6. **Closing day**: Sign papers, get keys, move in!",
    ],
    faqs: [
      {
        question: "What's the minimum credit score needed for a mortgage?",
        answer: "Most lenders require a minimum credit score of 600, but 680+ is needed for the best rates and insured mortgages (less than 20% down). Scores below 600 may require private or alternative lenders with higher rates.",
      },
      {
        question: "Can I buy a home with no down payment?",
        answer: "Generally no in Canada. The minimum down payment is 5% for properties under $500,000. However, you can use gifted funds from family, RRSP Home Buyers' Plan withdrawals, or FHSA savings to fund your down payment.",
      },
      {
        question: "Should I use a mortgage broker or bank?",
        answer: "A mortgage broker shops multiple lenders and often finds better rates than going directly to your bank. They're especially helpful if you have a unique situation (self-employed, bruised credit). Banks may offer relationship discounts if you have multiple products with them. Consider both options.",
      },
    ],
  },
  "mortgage-stress-test-canada": {
    slug: "mortgage-stress-test-canada",
    title: "Understanding the Mortgage Stress Test in Canada",
    excerpt: "What is the mortgage stress test and how does it affect your borrowing power?",
    category: "Mortgage Rules",
    readTime: "6 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What is the Mortgage Stress Test?",
      "",
      "The mortgage stress test is a requirement from Canada's banking regulator (OSFI) that ensures borrowers can afford their mortgage payments even if interest rates rise. It applies to all federally regulated lenders.",
      "",
      "## How Does the Stress Test Work?",
      "",
      "When you apply for a mortgage, lenders must calculate your qualification using the **higher** of:",
      "",
      "1. **Your contract rate + 2%**",
      "2. **The Bank of Canada 5-year benchmark rate** (currently ~5.25%)",
      "",
      "**Example**: If you're offered a 5-year fixed rate of 4.5%:",
      "- Stress test rate = 4.5% + 2% = **6.5%**",
      "- Since 6.5% > 5.25%, the lender uses 6.5% to qualify you",
      "",
      "## What is the Gross Debt Service (GDS) Ratio?",
      "",
      "Your GDS ratio includes:",
      "",
      "- Mortgage payments (at stress test rate)",
      "- Property taxes",
      "- Heating costs",
      "- 50% of condo fees (if applicable)",
      "",
      "**Maximum GDS: 32%** of your gross monthly income",
      "",
      "## What is the Total Debt Service (TDS) Ratio?",
      "",
      "Your TDS ratio includes everything in GDS plus:",
      "",
      "- Credit card payments",
      "- Car loans",
      "- Student loans",
      "- Other debt payments",
      "",
      "**Maximum TDS: 40%** of your gross monthly income",
      "",
      "## How to Pass the Stress Test",
      "",
      "**1. Reduce your debt**",
      "Pay down credit cards and loans to lower your TDS ratio.",
      "",
      "**2. Increase your down payment**",
      "More down = smaller mortgage = lower stress test payment.",
      "",
      "**3. Consider a longer amortization**",
      "Extending from 25 to 30 years lowers monthly payments (but costs more long-term).",
      "",
      "**4. Add a co-signer**",
      "Their income can help you qualify, but they're equally responsible for the mortgage.",
      "",
      "**5. Shop for the lowest rate**",
      "A lower contract rate means a lower stress test rate (contract + 2%).",
      "",
      "## Does the Stress Test Apply to Everyone?",
      "",
      "**Yes, if:**",
      "- Getting a mortgage from a federally regulated bank",
      "- Switching lenders at renewal (if your mortgage is uninsured)",
      "- Refinancing your mortgage",
      "",
      "**No (lower requirements), if:**",
      "- Renewing with your current lender (grandfathered)",
      "- Using a provincially regulated credit union (some have lower requirements)",
      "- Mortgage was funded before stress test rules began",
    ],
    faqs: [
      {
        question: "Will the stress test rate change?",
        answer: "The Bank of Canada benchmark rate can change. It typically follows the trend in market 5-year fixed rates. The +2% buffer may be adjusted by OSFI if market conditions warrant it. Check current rates at bankofcanada.ca.",
      },
      {
        question: "Can I avoid the stress test?",
        answer: "If you're putting 20%+ down and stay with your current lender at renewal, you typically avoid the stress test. You can also use credit unions with lower qualifying rates, though you'll likely pay a higher interest rate.",
      },
      {
        question: "How much less can I borrow because of the stress test?",
        answer: "Generally 15-20% less than without the stress test. For example, if you could qualify for a $600,000 mortgage at your contract rate, the stress test might reduce your approval to $480,000-$510,000.",
      },
    ],
  },
  "insured-vs-uninsured-mortgages": {
    slug: "insured-vs-uninsured-mortgages",
    title: "Insured vs Uninsured Mortgages: CMHC Premiums Explained",
    excerpt: "Understanding the difference between insured and conventional mortgages.",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What is an Insured Mortgage?",
      "",
      "An insured mortgage (also called high-ratio) requires mortgage default insurance when you put down less than 20% of the purchase price. This protects the lender if you default on payments.",
      "",
      "## What is an Uninsured (Conventional) Mortgage?",
      "",
      "A conventional mortgage requires at least 20% down and doesn't require default insurance. The lender assumes all the risk.",
      "",
      "## CMHC Insurance Premiums",
      "",
      "Premium rates as of March 2026:",
      "",
      "| Down Payment | Premium Rate* |",
      "|--------------|---------------|",
      "| 5% - 9.99%   | 4.00%         |",
      "| 10% - 14.99% | 3.10%         |",
      "| 15% - 19.99% | 2.80%         |",
      "| 20%+         | $0 (no insurance) |",
      "",
      "*Applied to mortgage amount. Added to your mortgage balance.",
      "",
      "**Example**: $500,000 home with 10% down ($50,000)",
      "- Mortgage amount: $450,000",
      "- CMHC premium (3.10%): $13,950",
      "- **Total mortgage**: $463,950",
      "",
      "## Key Differences",
      "",
      "| Feature | Insured | Uninsured |",
      "|---------|---------|-----------|",
      "| Minimum Down Payment | 5% | 20% |",
      "| Insurance Required | Yes | No |",
      "| Amortization | Max 25 years | Up to 30 years |",
      "| Rates | Often lower | Standard rates |",
      "| Stress Test | Contract + 2% or 5.25% | Usually contract + 2% |",
      "| Refinance Options | Limited | More flexible |",
      "",
      "## Pros and Cons of Insured Mortgages",
      "",
      "**Pros:**",
      "- Get into the market sooner with just 5% down",
      "- Insured mortgages often have the lowest interest rates",
      "- More lender options available",
      "",
      "**Cons:**",
      "- CMHC premium adds thousands to your mortgage",
      "- Maximum 25-year amortization",
      "- Can't refinance easily to access equity",
      "- Provincial sales tax on premium (not financed)",
      "",
      "## Should You Wait for 20% Down?",
      "",
      "**Put 5-19% down if:**",
      "- Home prices are rising faster than you can save",
      "- Renting is more expensive than owning (including CMHC cost)",
      "- You have stable income and can handle the payments",
      "",
      "**Wait for 20% if:**",
      "- You can save 20% within 1-2 years",
      "- You want lower monthly payments",
      "- You want maximum flexibility for refinancing",
      "- You want to avoid the CMHC premium cost",
    ],
  },
  "mortgage-prepayment-penalties": {
    slug: "mortgage-prepayment-penalties",
    title: "Mortgage Prepayment Penalties: What You Need to Know",
    excerpt: "Learn how prepayment penalties work and strategies to minimize them.",
    category: "Mortgage Strategy",
    readTime: "7 min read",
    publishedAt: "2026-03-03",
    content: [
      "## When Do Prepayment Penalties Apply?",
      "",
      "You may face a prepayment penalty when you:",
      "",
      "- Sell your home before the mortgage term ends",
      "- Refinance to access equity or get a better rate",
      "- Switch lenders before maturity",
      "- Pay off your mortgage early",
      "- Make lump-sum payments exceeding your prepayment privileges",
      "",
      "## How Penalties Are Calculated",
      "",
      "The penalty depends on your mortgage type and terms:",
      "",
      "### Fixed Rate Mortgages (Most Common)",
      "",
      "The greater of:",
      "",
      "**1. Interest Rate Differential (IRD):**",
      "- Your current rate minus the lender's current rate for remaining term",
      "- Multiplied by remaining balance and time left",
      "",
      "**2. Three Months' Interest:**",
      "- Your mortgage balance × your rate ÷ 4",
      "",
      "**Example IRD calculation:**",
      "- Current mortgage: $400,000 at 4.5%, 3 years remaining",
      "- Lender's 3-year rate now: 3.5%",
      "- Rate difference: 1.0%",
      "- IRD: $400,000 × 1.0% × 3 years = **$12,000**",
      "",
      "### Variable Rate Mortgages",
      "",
      "Simple: **Three months' interest only**",
      "",
      "- $400,000 × (prime rate) ÷ 4 ≈ **$4,000**",
      "",
      "Variable rates typically have **much lower penalties** than fixed rates.",
      "",
      "## How to Minimize or Avoid Penalties",
      "",
      "**1. Use Your Prepayment Privileges**",
      "",
      "Most mortgages allow annual prepayments of 10-20% of the original balance without penalty. Use these to reduce your balance before breaking the mortgage.",
      "",
      "**2. Port Your Mortgage**",
      "",
      "If buying a new home, ask your lender to 'port' (transfer) your mortgage to the new property. You keep your rate and avoid penalties.",
      "",
      "**3. Blend and Extend**",
      "",
      "Combine your existing rate with current rates and extend your term. No penalty, but you may lock in at less favorable blended rates.",
      "",
      "**4. Wait Until Renewal**",
      "",
      "You can switch lenders or refinance at renewal with no penalties—only legal and appraisal costs.",
      "",
      "**5. Calculate if Breaking Makes Sense**",
      "",
      "If breaking saves you more than the penalty costs, it can be worth it:",
      "",
      "Example: $10,000 penalty to save $15,000 in interest = worthwhile",
      "",
      "## Questions to Ask Your Lender",
      "",
      "Before signing, understand:",
      "",
      "- What's the exact penalty formula?",
      "- Can I port the mortgage to a new property?",
      "- What are my prepayment privileges?",
      "- Is there a 'no-frills' version with lower prepayment options?",
      "",
      "## Negotiating Penalty Terms",
      "",
      "Some items are negotiable:",
      "",
      "- **Increased prepayment privileges** (ask for 20% instead of 10%)",
      "- **Portability terms** (longer time to find new property)",
      "- **Blend and extend options**",
      "",
      "Always get competing quotes and use them as leverage.",
    ],
  },
  "prime-rate-explained-canada": {
    slug: "prime-rate-explained-canada",
    title: "What is the Prime Rate and How Does It Affect Your Mortgage?",
    excerpt: "Everything you need to know about Canada's prime rate.",
    category: "Mortgage Basics",
    readTime: "4 min read",
    publishedAt: "2026-03-03",
    content: [
      "## What is the Prime Rate?",
      "",
      "The prime rate is the interest rate that banks charge their most creditworthy customers for loans and lines of credit. In Canada, each major bank sets its own prime rate, though they almost always move in unison.",
      "",
      "**Current Prime Rate (March 2026): Approximately 5.45%**",
      "",
      "## How is the Prime Rate Set?",
      "",
      "The prime rate is typically calculated as:",
      "",
      "**Prime Rate = Bank of Canada Overnight Rate + 2.0% to 2.2%**",
      "",
      "The Bank of Canada sets the overnight lending rate, which influences what banks pay to borrow money. When the BoC changes the overnight rate, banks usually adjust prime rate within 1-2 business days.",
      "",
      "## How Prime Rate Affects Your Mortgage",
      "",
      "### Variable Rate Mortgages",
      "",
      "Your rate is expressed as: **Prime -/+ X%**",
      "",
      "- Example: Prime (5.45%) - 0.45% = **5.00%**",
      "- If prime drops to 5.20%, your new rate = **4.75%**",
      "",
      "When prime changes:",
      "- **Payment stays the same**: More/less goes to principal",
      "- **Payment adjusts**: Your monthly amount changes (less common)",
      "",
      "### Home Equity Lines of Credit (HELOC)",
      "",
      "HELOC rates are typically: **Prime + 0.5% to 1.0%**",
      "",
      "- Very sensitive to rate changes",
      "- Payments adjust as prime changes",
      "",
      "### Fixed Rate Mortgages",
      "",
      "**Not directly affected**. Fixed rates follow government bond yields, not prime rate. However, broader interest rate trends eventually affect all mortgage products.",
      "",
      "## Historical Prime Rate in Canada",
      "",
      "| Year | Prime Rate | Context |",
      "|------|------------|---------|",
      "| 2020 | 2.45% | COVID-19 emergency cuts |",
      "| 2022 | 5.45% | Aggressive rate hikes start |",
      "| 2023 | 7.20% | Peak of rate cycle |",
      "| 2024 | 6.95% | Gradual rate decreases |",
      "| 2026 | ~5.45% | Continued normalization |",
      "",
      "## Should You Worry About Prime Rate Changes?",
      "",
      "**If you have a fixed rate**: Changes don't affect you until renewal.",
      "",
      "**If you have a variable rate**: Keep an eye on Bank of Canada announcements (8 times per year).",
      "",
      "Typical change size: **0.25% increments**",
      "",
      "A 0.25% rate change on a $500,000 mortgage:",
      "- Monthly payment change: ~$75-100",
      "",
      "## Predicting Prime Rate Changes",
      "",
      "While no one can predict rates perfectly, watch for:",
      "",
      "- **Inflation reports**: High inflation = potential rate hikes",
      "- **Employment data**: Strong job market = pressure for hikes",
      "- **Bank of Canada statements**: Forward guidance on rate direction",
      "- **Economic growth**: Weak growth may lead to cuts",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: "Post Not Found | Latest Mortgage Rates Canada",
    };
  }
  
  const relatedKeywords = [
    "Canadian mortgage",
    "mortgage rates Canada",
    "home buyer tips",
    "mortgage advice",
  ];
  
  return {
    title: `${post.title} | Latest Mortgage Rates Canada`,
    description: post.excerpt,
    keywords: [...post.title.split(" "), post.category.toLowerCase(), ...relatedKeywords],
    alternates: {
      canonical: `https://latestmortgagerates.ca/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://latestmortgagerates.ca/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      authors: ["Latest Mortgage Rates Canada"],
      section: post.category,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            author: {
              "@type": "Organization",
              name: "Latest Mortgage Rates Canada",
              url: "https://latestmortgagerates.ca",
            },
            datePublished: post.publishedAt,
            articleSection: post.category,
            mainEntityOfPage: {
              "@type": "WebPage",
              "@id": `https://latestmortgagerates.ca/blog/${post.slug}`,
            },
            ...(post.faqs && {
              "@type": ["BlogPosting", "FAQPage"],
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }),
        }}
      />

      <header className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium truncate max-w-xs">{post.title}</li>
            </ol>
          </nav>
          
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-3">
            {post.category}
          </span>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{post.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>{post.readTime}</span>
            <span>•</span>
            <time>{new Date(post.publishedAt).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </div>
        </div>
      </header>

      <article className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="prose prose-lg max-w-none">
            {post.content.map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">{paragraph.replace("## ", "")}</h2>;
              }
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                return <p key={index} className="font-bold text-gray-900">{paragraph.replace(/\*\*/g, "")}</p>;
              }
              if (paragraph.startsWith("- ")) {
                return <li key={index} className="ml-6 text-gray-700">{paragraph.replace("- ", "")}</li>;
              }
              if (paragraph.startsWith("|")) {
                return null;
              }
              if (paragraph === "") {
                return <br key={index} />;
              }
              return <p key={index} className="text-gray-700 mb-4">{paragraph}</p>;
            })}
          </div>

          {/* FAQs Section */}
          {post.faqs && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {post.faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-12 bg-blue-50 rounded-lg p-6">
            <h3 className="font-bold text-gray-900 mb-2">Ready to Compare Mortgage Rates?</h3>
            <p className="text-gray-600 mb-4">
              See today&apos;s best rates from Canada&apos;s top lenders and find your perfect mortgage.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
              >
                Compare Rates
              </Link>
              <Link
                href="/blog"
                className="px-6 py-2 bg-white text-blue-600 border border-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                More Guides
              </Link>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}
