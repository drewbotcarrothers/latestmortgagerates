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
];

const categories = [...new Set(blogPosts.map((post) => post.category))];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <nav className="text-sm text-gray-500 mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><span className="text-gray-400">/</span></li>
              <li className="text-gray-900 font-medium">Blog</li>
            </ol>
          </nav>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mortgage Guides & Resources</h1>
              <p className="text-gray-600 mt-2">Expert advice and tips for Canadian homebuyers</p>
            </div>
            <Navigation currentPage="guides" />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {blogPosts.map((post) => (
                <article
                  key={post.slug}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <Link href={`/blog/${post.slug}`} className="block p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 transition">
                      {post.title}
                    </h2>
                    <p className="text-gray-600">{post.excerpt}</p>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-blue-600 font-medium">Read more →</span>
                      <time className="text-sm text-gray-500">
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
          </div>

          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-blue-600 transition"
                    >
                      {category}
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Compare Rates</h3>
                <p className="text-gray-600 text-sm mb-4">
                  See today&apos;s best mortgage rates from all major Canadian lenders.
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
