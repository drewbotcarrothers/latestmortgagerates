import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RateHubLinks from "@/components/RateHubLinks";
import { blogPosts, categories, getFeaturedPosts, getRecentPosts } from "@/content/blog";



function BlogCard({ post }: { post: typeof blogPosts[0] }) {
  const categoryInfo = categories[post.category];
  
  return (
    <article className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
      <a href={`/blog/${post.slug}/`} className="block">
        <div className="aspect-video bg-slate-200 relative">
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-300 to-slate-400">
            <span className="text-slate-500 text-6xl">📰</span>
          </div>
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-teal-500 text-white text-xs font-medium rounded-full">
              {categoryInfo.label}
            </span>
          </div>
        </div>
      </a>
      
      <div className="p-6">
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
          <span>{new Date(post.date).toLocaleDateString('en-CA', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          })}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>
        
        <a href={`/blog/${post.slug}/`}>
          <h2 className="text-xl font-bold text-slate-900 mb-3 hover:text-teal-600 transition-colors line-clamp-2">
            {post.title}
          </h2>
        </a>
        
        <p className="text-slate-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm">👤</div>
            <span className="text-sm text-slate-700">{post.author}</span>
          </div>
          
          <a 
            href={`/blog/${post.slug}/`}
            className="text-teal-600 font-medium text-sm hover:text-teal-700 flex items-center gap-1"
          >
            Read More
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

function FeaturedPost({ post }: { post: typeof blogPosts[0] }) {
  return (
    <article className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="aspect-video lg:aspect-auto bg-slate-700 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-slate-500 text-8xl">📰</span>
          </div>
        </div>
        
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-teal-500 text-white text-xs font-bold rounded-full">
              Featured
            </span>
            <span className="text-slate-400 text-sm">{categories[post.category].label}</span>
          </div>
          
          <a href={`/blog/${post.slug}/`}>
            <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 hover:text-teal-300 transition-colors">
              {post.title}
            </h2>
          </a>
          
          <p className="text-slate-300 mb-6">{post.excerpt}</p>
          
          <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
            <span>{new Date(post.date).toLocaleDateString('en-CA', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
            <span>•</span>
            <span>{post.readTime} min read</span>
          </div>
          
          <a 
            href={`/blog/${post.slug}/`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-teal-500 text-white font-medium rounded-lg hover:bg-teal-600 transition-colors"
          >
            Read Article
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
}

export default function BlogPage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts(6);

  return (
    <main className="min-h-screen bg-slate-50">
      <Header currentPage="blog" />

      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <nav className="text-sm text-slate-300 mb-4">
            <a href="/" className="hover:text-white transition">Home</a>
            <span className="mx-2">/</span>
            <span>Blog</span>
          </nav>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">Mortgage News & Insights</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Stay informed with the latest mortgage news, rate updates, market analysis, and home buying guides from our expert team.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {featuredPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Featured Articles</h2>
            <div className="space-y-6">
              {featuredPosts.slice(0, 2).map(post => (
                <FeaturedPost key={post.slug} post={post} />
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map(post => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <div className="mt-16 bg-white rounded-xl p-8 border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Never Miss an Update</h3>
              <p className="text-slate-600">Subscribe to our weekly mortgage rate roundup and market analysis.</p>
            </div>
            
            <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 min-w-[280px]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categories).map(([key, info]) => (
            <a
              key={key}
              href="/blog/"
              className="bg-white rounded-lg p-4 border border-slate-200 hover:border-teal-300 hover:shadow-md transition-all"
            >
              <h4 className="font-semibold text-slate-900">{info.label}</h4>
              <p className="text-sm text-slate-500">{info.description}</p>
            </a>
          ))}
        </div>

        <div className="mt-12 space-y-6">
          <RateHubLinks
            title="Compare today's mortgage rates"
            description="Use these rate hubs alongside our guides — then run the numbers with a calculator."
          />
          <div className="card-default p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Mortgage calculators</h2>
            <p className="text-slate-600 mb-4">Free tools to estimate payments, affordability, closing costs, and qualification.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { href: "/tools/mortgage-calculator/", title: "Payment Calculator" },
                { href: "/tools/affordability-calculator/", title: "Affordability Calculator" },
                { href: "/tools/closing-costs-calculator/", title: "Closing Costs" },
                { href: "/tools/stress-test-qualifier/", title: "Stress Test" },
                { href: "/tools/cmhc-insurance-calculator/", title: "CMHC Calculator" },
                { href: "/tools/", title: "All calculators" },
              ].map((tool) => (
                <a
                  key={tool.href}
                  href={tool.href}
                  className="p-3 rounded-lg bg-slate-50 hover:bg-white border border-slate-200 text-sm font-medium text-slate-900 hover:text-teal-600 transition"
                >
                  {tool.title} →
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
