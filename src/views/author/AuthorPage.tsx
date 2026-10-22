import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialSections from "@/components/EditorialSections";
import { blogPosts } from "@/content/blog";
import { authorAboutSection } from "@/content/editorialPages";
import { IN_DEPTH_GUIDES } from "@/content/inDepthGuides";
import { AUTHOR_FOCUS, AUTHOR_NAME } from "@/lib/author";

const articles = [...blogPosts].sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
);

export default function AuthorPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <Header />
      <header className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li><a href="/" className="hover:text-teal-600">Home</a></li>
              <li><span className="text-slate-400">/</span></li>
              <li className="font-medium text-slate-900">{AUTHOR_NAME}</li>
            </ol>
          </nav>
          <h1 className="text-3xl font-bold text-slate-900">{AUTHOR_NAME}</h1>
          <p className="mt-2 text-slate-600">Author at LatestMortgageRates.ca</p>
        </div>
      </header>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <article className="rounded-lg bg-white p-8 shadow-md">
          <EditorialSections sections={[authorAboutSection]} />
        </article>

        <section className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Focus areas</h2>
          <ul className="space-y-4">
            {AUTHOR_FOCUS.map((item) => (
              <li key={item.title}>
                <h3 className="font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 leading-relaxed text-slate-700">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Guides</h2>
          <ul className="space-y-3">
            {IN_DEPTH_GUIDES.map((guide) => (
              <li key={guide.path}>
                <a href={guide.path} className="font-medium text-teal-700 hover:underline">
                  {guide.cardTitle}
                </a>
                <p className="text-sm text-slate-600">{guide.cardDescription}</p>
              </li>
            ))}
            <li>
              <a href="/guides/negotiate-mortgage-rate/" className="font-medium text-teal-700 hover:underline">
                How much below posted can you negotiate?
              </a>
              <p className="text-sm text-slate-600">A renewal conversation, using posted rates and rates self-reported by Canadian borrowers online.</p>
            </li>
            <li>
              <a href="/guides/" className="font-medium text-teal-700 hover:underline">All guides</a>
              <p className="text-sm text-slate-600">The hub for comparisons, the glossary, and the below-the-line report.</p>
            </li>
          </ul>
        </section>

        <section className="rounded-lg bg-white p-8 shadow-md">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">Articles</h2>
          <ul className="divide-y divide-slate-200">
            {articles.map((post) => (
              <li key={post.slug} className="py-4">
                <a href={`/blog/${post.slug}/`} className="font-medium text-teal-700 hover:underline">
                  {post.title}
                </a>
                <p className="mt-1 text-sm text-slate-500">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-CA", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  {" · "}
                  {post.authorTitle}
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <Footer />
    </main>
  );
}
