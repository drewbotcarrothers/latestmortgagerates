import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "../components/Navigation";

// Force static generation for static export
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Mortgage Guides & Resources | Latest Mortgage Rates Canada",
  description: "Expert mortgage guides, tips, and resources for Canadian homebuyers. Learn about fixed vs variable rates, stress tests, first-time buyer programs, and more.",
  keywords: ["mortgage guide", "Canadian mortgage tips", "first time home buyer", "mortgage advice Canada"],
  alternates: {
    canonical: "https://latestmortgagerates.ca/blog",
  },
  openGraph: {
    title: "Mortgage Guides & Resources",
    description: "Expert mortgage guides for Canadian homebuyers",
    type: "website",
    url: "https://latestmortgagerates.ca/blog",
  },
};

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
}

const blogPosts: BlogPost[] = [
  // Original posts
  {
    slug: "fixed-vs-variable-mortgage-rates",
    title: "Fixed vs Variable Mortgage Rates: Which is Right for You?",
    excerpt: "Compare the pros and cons of fixed and variable rate mortgages. Learn when each option makes sense based on your risk tolerance and market conditions.",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
  },
  {
    slug: "first-time-home-buyer-guide-canada",
    title: "First-Time Home Buyer Guide: Everything You Need to Know",
    excerpt: "A complete guide for first-time buyers in Canada. From down payment requirements to the First Home Savings Account and government programs.",
    category: "First-Time Buyers",
    readTime: "8 min read",
    publishedAt: "2026-03-03",
  },
  {
    slug: "mortgage-stress-test-canada",
    title: "Understanding the Mortgage Stress Test in Canada",
    excerpt: "What is the mortgage stress test and how does it affect your borrowing power? Learn the current qualifying rate and how to prepare.",
    category: "Mortgage Rules",
    readTime: "6 min read",
    publishedAt: "2026-03-03",
  },
  {
    slug: "insured-vs-uninsured-mortgages",
    title: "Insured vs Uninsured Mortgages: CMHC Premiums Explained",
    excerpt: "Understanding the difference between insured and conventional mortgages. When do you need mortgage insurance and how much does it cost?",
    category: "Mortgage Basics",
    readTime: "5 min read",
    publishedAt: "2026-03-03",
  },
  {
    slug: "mortgage-prepayment-penalties",
    title: "Mortgage Prepayment Penalties: What You Need to Know",
    excerpt: "Learn how prepayment penalties work, how to calculate them, and strategies to minimize or avoid penalties when breaking your mortgage.",
    category: "Mortgage Strategy",
    readTime: "7 min read",
    publishedAt: "2026-03-03",
  },
  {
    slug: "prime-rate-explained-canada",
    title: "What is the Prime Rate and How Does It Affect Your Mortgage?",
    excerpt: "Everything you need to know about Canada's prime rate, how it's set, and its impact on variable rate mortgages and lines of credit.",
    category: "Mortgage Basics",
    readTime: "4 min read",
    publishedAt: "2026-03-03",
  },
  // NEW POSTS - 10 new blog posts
  {
    slug: "closing-costs-canada",
    title: "Closing Costs in Canada: Complete Guide for Homebuyers",
    excerpt: "Understand all the costs involved when buying a home in Canada, from down payments to land transfer tax, legal fees, and more. Budget 1.5-4% of purchase price.",
    category: "Home Buying",
    readTime: "10 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "mortgage-pre-approval-guide",
    title: "How to Get Mortgage Pre-Approval in Canada",
    excerpt: "A step-by-step guide to mortgage pre-approval, including required documents, how long it takes, and tips to improve your chances of approval.",
    category: "Home Buying",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "variable-vs-fixed-rates-2025",
    title: "Variable vs Fixed Rates: 2025 Market Outlook",
    excerpt: "Expert analysis of the 2024-2025 mortgage rate outlook. Should you choose variable or fixed based on current market conditions and predictions?",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "best-mortgage-rates-toronto",
    title: "Best Mortgage Rates in Toronto 2025",
    excerpt: "Find the lowest mortgage rates in Toronto and GTA. Compare rates from top lenders, understand Toronto market conditions, and get local insights.",
    category: "City Guides",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "best-mortgage-rates-vancouver",
    title: "Best Mortgage Rates in Vancouver 2025",
    excerpt: "Find the lowest mortgage rates in Vancouver and Greater Vancouver Area. Compare rates for BC homebuyers and understand the local market.",
    category: "City Guides",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "best-mortgage-rates-calgary-montreal",
    title: "Best Mortgage Rates in Calgary and Montreal 2025",
    excerpt: "Compare mortgage rates in Calgary and Montreal, two of Canada's most affordable major housing markets. Learn about unique local factors.",
    category: "City Guides",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "refinancing-your-mortgage",
    title: "Refinancing Your Mortgage: When Does It Make Sense?",
    excerpt: "Learn when to refinance your mortgage, how much you can save, what costs to expect, and strategies to minimize fees.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "porting-vs-breaking-mortgage",
    title: "Porting vs Breaking Your Mortgage: What You Need to Know",
    excerpt: "Understand the difference between porting your mortgage and breaking it when selling your home. Save thousands by making the right choice.",
    category: "Mortgage Strategy",
    readTime: "7 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "mortgage-default-insurance-explained",
    title: "Mortgage Default Insurance (CMHC) Explained",
    excerpt: "Everything you need to know about mortgage default insurance, including costs, providers like CMHC/Sagen/Canada Guaranty, and how it affects your mortgage.",
    category: "Mortgage Basics",
    readTime: "8 min read",
    publishedAt: "2026-03-04",
  },
  {
    slug: "improve-credit-score-mortgage",
    title: "How to Improve Your Credit Score for Better Mortgage Rates",
    excerpt: "Actionable strategies to boost your credit score and qualify for the best mortgage rates. Quick wins and long-term improvements.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-04",
  },
  // NEW POSTS - March 2026
  {
    slug: "how-much-mortgage-can-i-afford",
    title: "How Much Mortgage Can I Afford? Complete Affordability Guide",
    excerpt: "Calculate how much house you can afford in Canada. Learn about GDS/TDS ratios, stress test rules, and down payment requirements.",
    category: "Mortgage Calculator",
    readTime: "8 min read",
    publishedAt: "2026-03-07",
  },
  {
    slug: "mortgage-renewal-guide-2025",
    title: "Mortgage Renewal Guide 2025: How to Save Thousands",
    excerpt: "Everything you need to know about renewing your mortgage in 2025. Learn when to renew, how to negotiate, and strategies to get the best rate.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-07",
  },
  {
    slug: "self-employed-mortgage-canada",
    title: "Self-Employed Mortgage Guide: How to Qualify",
    excerpt: "How to get a mortgage when you're self-employed in Canada. Learn about income verification, stated income programs, and documentation requirements.",
    category: "Mortgage Basics",
    readTime: "8 min read",
    publishedAt: "2026-03-07",
  },
  {
    slug: "investment-property-mortgages",
    title: "Investment Property Mortgages: What You Need to Know",
    excerpt: "How to finance rental properties in Canada. Learn about down payments, rental income qualification, and financing strategies for investors.",
    category: "Mortgage Strategy",
    readTime: "9 min read",
    publishedAt: "2026-03-07",
  },
  {
    slug: "home-buyer-incentive-canada",
    title: "First-Time Home Buyer Incentive: Complete Guide",
    excerpt: "Everything you need to know about the Government of Canada's First-Time Home Buyer Incentive program. Is it right for you?",
    category: "First-Time Buyers",
    readTime: "7 min read",
    publishedAt: "2026-03-07",
  },
];

const categories = [...new Set(blogPosts.map((post) => post.category))];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-slate-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-teal-600">Home</Link></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="text-slate-900 font-medium">Blog</li>
            </ol>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Mortgage Guides & Resources</h1>
              <p className="text-slate-600 mt-2">Expert advice and tips for Canadian homebuyers</p>
            </div>
            <Navigation currentPage="guides" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-gray-700 hover:bg-teal-50 hover:border-teal-200 transition"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="space-y-6">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <Link href={`/blog/${post.slug}`} className="block p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-slate-500">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 mb-2 hover:text-teal-600 transition">
                      {post.title}
                    </h2>
                    <p className="text-slate-600">{post.excerpt}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-teal-600 font-medium">Read more →</span>
                      <time className="text-sm text-slate-500">
                        {new Date(post.publishedAt).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {/* Pagination - simplified */}
            <div className="mt-8 flex justify-center">
              <p className="text-slate-500 text-sm">Showing all {blogPosts.length} guides</p>
            </div>
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-semibold text-slate-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <span className="text-slate-600">
                      {category}
                    </span>
                    <span className="ml-2 text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                      {blogPosts.filter(p => p.category === category).length}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Popular Cities</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <Link href="/cities/toronto" className="text-teal-600 hover:underline">Toronto</Link>
                  <Link href="/cities/vancouver" className="text-teal-600 hover:underline">Vancouver</Link>
                  <Link href="/cities/calgary" className="text-teal-600 hover:underline">Calgary</Link>
                  <Link href="/cities/montreal" className="text-teal-600 hover:underline">Montreal</Link>
                  <Link href="/cities/ottawa" className="text-teal-600 hover:underline">Ottawa</Link>
                  <Link href="/cities/edmonton" className="text-teal-600 hover:underline">Edmonton</Link>
                  <Link href="/cities/hamilton" className="text-teal-600 hover:underline">Hamilton</Link>
                  <Link href="/cities/kitchener" className="text-teal-600 hover:underline">Kitchener</Link>
                  <Link href="/cities/london" className="text-teal-600 hover:underline">London</Link>
                  <Link href="/cities/winnipeg" className="text-teal-600 hover:underline">Winnipeg</Link>
                  <Link href="/cities/halifax" className="text-teal-600 hover:underline">Halifax</Link>
                  <Link href="/cities/saskatoon" className="text-teal-600 hover:underline">Saskatoon</Link>
                  <Link href="/cities/regina" className="text-teal-600 hover:underline">Regina</Link>
                  <Link href="/cities/barrie" className="text-teal-600 hover:underline">Barrie</Link>
                </div>
                <Link href="/" className="text-sm text-teal-600 hover:underline mt-3 inline-block">
                  View all cities →
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Compare Rates</h3>
                <p className="text-slate-600 text-sm mb-4">
                  See today's best mortgage rates from all major Canadian lenders.
                </p>
                <Link
                  href="/"
                  className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Rates
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
