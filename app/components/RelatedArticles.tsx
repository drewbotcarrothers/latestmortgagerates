"use client";

import Link from "next/link";
import { blogPosts } from "../blog/data";

interface RelatedArticlesProps {
  currentSlug: string;
  tags: string[];
  category: string;
  maxArticles?: number;
}

export default function RelatedArticles({ 
  currentSlug, 
  tags, 
  category,
  maxArticles = 3 
}: RelatedArticlesProps) {
  // Find related posts by matching tags and category
  const related = blogPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      let score = 0;
      // Category match is worth 2 points
      if (post.category === category) score += 2;
      // Tag matches are worth 1 point each
      const matchingTags = post.tags.filter(tag => tags.includes(tag));
      score += matchingTags.length;
      return { ...post, score };
    })
    .filter(post => post.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxArticles);

  if (related.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-slate-200">
      <h3 className="text-xl font-bold text-slate-900 mb-6">Related Articles</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {related.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-5">
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                <span className="px-2 py-0.5 bg-slate-100 rounded-full">{post.category}</span>
                <span>{post.readTime} min read</span>
              </div>
              <h4 className="font-semibold text-slate-900 mb-2 group-hover:text-teal-600 transition-colors line-clamp-2">
                {post.title}
              </h4>
              <p className="text-sm text-slate-600 line-clamp-2">{post.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
