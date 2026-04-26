import { Metadata } from "next";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import RelatedArticles from "../../components/RelatedArticles";
import RelatedTools from "../../components/RelatedTools";
import GlossaryLink from "../../components/GlossaryLink";
import { blogPosts, getPostBySlug, categories, getRecentPosts } from "../data";

// Tool mapping for contextual sidebar links
const toolMapping: Record<string, { href: string; icon: string; title: string; description: string }[]> = {
  calculator: [
    { href: "/tools/mortgage-calculator", icon: "🧮", title: "Payment Calculator", description: "Calculate monthly payments" },
    { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", description: "How much can you afford?" },
    { href: "/tools/land-transfer-tax-calculator", icon: "📋", title: "Land Transfer Tax", description: "Calculate closing costs" },
  ],
  rates: [
    { href: "/", icon: "📊", title: "Compare Rates", description: "See today's best rates" },
    { href: "/trends", icon: "📈", title: "Rate Trends", description: "Historical rate analysis" },
    { href: "/tools/mortgage-renewal-calculator", icon: "🔄", title: "Renewal Calculator", description: "Should you renew or switch?" },
  ],
  affordability: [
    { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", description: "How much house can you afford?" },
    { href: "/tools/cmhc-insurance-calculator", icon: "🛡️", title: "CMHC Calculator", description: "Calculate insurance premiums" },
    { href: "/tools/closing-costs-calculator", icon: "💰", title: "Closing Costs", description: "Total costs to buy a home" },
  ],
  renewal: [
    { href: "/tools/mortgage-renewal-calculator", icon: "🔄", title: "Renewal Calculator", description: "Compare renewal options" },
    { href: "/tools/refinance-calculator", icon: "📉", title: "Refinance Calculator", description: "Should you refinance?" },
    { href: "/", icon: "📊", title: "Current Rates", description: "Compare today's rates" },
  ],
  firsttime: [
    { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", description: "What can you afford?" },
    { href: "/tools/land-transfer-tax-calculator", icon: "📋", title: "Land Transfer Tax", description: "First-time buyer rebates" },
    { href: "/tools/cmhc-insurance-calculator", icon: "🛡️", title: "CMHC Calculator", description: "Insurance for <20% down" },
  ],
  default: [
    { href: "/tools/mortgage-calculator", icon: "🧮", title: "Payment Calculator", description: "Calculate monthly payments" },
    { href: "/tools/affordability-calculator", icon: "🏠", title: "Affordability Calculator", description: "How much can you afford?" },
    { href: "/", icon: "📊", title: "Compare Rates", description: "See today's best rates" },
  ],
};

function getRelatedTools(post: typeof blogPosts[0]) {
  // Check tags for contextual tools
  if (post.tags.some(tag => tag.toLowerCase().includes('renewal'))) return toolMapping.renewal;
  if (post.tags.some(tag => tag.toLowerCase().includes('first') || tag.toLowerCase().includes('buyer'))) return toolMapping.firsttime;
  if (post.tags.some(tag => tag.toLowerCase().includes('afford'))) return toolMapping.affordability;
  if (post.tags.some(tag => tag.toLowerCase().includes('calculator') || tag.toLowerCase().includes('payment'))) return toolMapping.calculator;
  if (post.category === 'rates' || post.tags.some(tag => tag.toLowerCase().includes('rate'))) return toolMapping.rates;
  return toolMapping.default;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  
  if (!post) {
    return {
      title: "Post Not Found | Latest Mortgage Rates Canada",
    };
  }
  
  return {
    title: `${post.title} | Latest Mortgage Rates Canada`,
    description: post.excerpt,
    keywords: post.tags,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://latestmortgagerates.ca/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `https://latestmortgagerates.ca/blog/${post.slug}`,
      locale: "en_CA",
      siteName: "Latest Mortgage Rates Canada",
      authors: [post.author],
      publishedTime: post.date,
      modifiedTime: post.date,
      section: categories[post.category].label,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

function generateStructuredData(post: typeof blogPosts[0]) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    author: {
      "@type": "Person",
      name: post.author,
    },
    datePublished: post.date,
    dateModified: post.date,
    publisher: {
      "@type": "Organization",
      name: "Latest Mortgage Rates Canada",
      logo: {
        "@type": "ImageObject",
        url: "https://latestmortgagerates.ca/logo.png",
      },
    },
    articleSection: categories[post.category].label,
    keywords: post.tags.join(", "),
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  const recentPosts = getRecentPosts(3).filter(p => p.slug !== slug);
  
  if (!post) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Article Not Found</h1>
            <p className="text-slate-600 mb-6">The article you're looking for doesn't exist.</p>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </main>
    );
  }
  
  const categoryInfo = categories[post.category];
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateStructuredData(post)),
        }}
      />
      
      <main className="min-h-screen bg-slate-50">
        <Header currentPage="blog" />

        <article className="max-w-4xl mx-auto px-4 py-8">
          <nav className="text-sm text-slate-500 mb-6">
            <Link href="/" className="hover:text-slate-700">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/blog" className="hover:text-slate-700">Blog</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-900">{post.title}</span>
          </nav>

          <header className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-sm font-medium rounded-full">
                {categoryInfo.label}
              </span>
              <span className="text-slate-500">{post.readTime} min read</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              {post.title}
            </h1>
            
            <p className="text-xl text-slate-600">{post.excerpt}</p>
            
            <div className="flex items-center gap-4 mt-6 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center text-xl">👤</div>
                <div>
                  <p className="font-medium text-slate-900">{post.author}</p>
                  <p className="text-sm text-slate-500">{post.authorTitle}</p>
                </div>
              </div>
              
              <div className="ml-auto text-right">
                <time dateTime={post.date} className="text-slate-600">
                  {new Date(post.date).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
            </div>
          </header>

          <div className="aspect-video bg-slate-200 rounded-xl mb-8 relative overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
              <span className="text-slate-500 text-8xl">📰</span>
            </div>
          </div>

          <div 
            id="blog-content"
            className="prose prose-base max-w-none prose-headings:text-slate-900 prose-headings:font-semibold prose-h2:text-xl prose-h3:text-lg prose-p:text-slate-600 prose-p:mb-4 prose-p:leading-relaxed prose-a:text-teal-600 hover:prose-a:text-teal-700 prose-strong:font-semibold prose-strong:text-slate-800 prose-li:text-slate-600 prose-table:border-collapse prose-table:w-full prose-th:bg-slate-100 prose-th:p-3 prose-th:text-left prose-th:text-sm prose-th:font-semibold prose-td:p-3 prose-td:text-sm prose-td:border-t prose-td:border-slate-200 prose-blockquote:border-l-4 prose-blockquote:border-teal-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-slate-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Auto-link glossary terms */}
          <GlossaryLink contentSelector="#blog-content" />

          {/* Related Articles */}
          <RelatedArticles 
            currentSlug={post.slug}
            tags={post.tags}
            category={post.category}
            maxArticles={3}
          />

          {/* Related Tools Sidebar */}
          <div className="mt-12">
            <RelatedTools tools={getRelatedTools(post)} title="Tools Mentioned in This Article" />
          </div>

          <div className="mt-12 pt-8 border-t border-slate-200">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-slate-100 text-slate-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-12 bg-blue-50 rounded-xl p-6 border border-blue-100">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Compare Today's Best Rates</h3>
            <p className="text-slate-600 mb-4">
              See how rates from Canada's top lenders compare before your renewal or purchase.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors"
            >
              View Current Rates
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {recentPosts.length > 0 && (
            <div className="mt-12">
              <h3 className="text-xl font-bold text-slate-900 mb-6">More Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentPosts.map((recentPost) => (
                  <Link
                    key={recentPost.slug}
                    href={`/blog/${recentPost.slug}`}
                    className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs font-medium text-teal-600 uppercase">
                      {categories[recentPost.category].label}
                    </span>
                    <h4 className="font-semibold text-slate-900 mt-2 line-clamp-2">
                      {recentPost.title}
                    </h4>
                    <p className="text-sm text-slate-500 mt-2">
                      {recentPost.readTime} min read
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>

        <Footer />
      </main>
    </>
  );
}
