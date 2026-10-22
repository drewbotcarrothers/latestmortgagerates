import { readFileSync } from "node:fs";
import { join } from "node:path";

/** Weekly roundup slugs. Only the highest year+week stays indexable. */
export const WEEKLY_RATE_SLUG = /^best-5-year-fixed-rates-week-(\d+)-(\d{4})$/;

function readProjectFile(relativePath) {
  return readFileSync(join(process.cwd(), relativePath), "utf8");
}

/**
 * Literal `slug: "..."` posts in src/content/blog.ts, plus a noIndex flag
 * when that post object sets `noIndex: true`. The October community report
 * assigns its slug from another module, so it is not in this list.
 */
export function blogPostRecords(source = readProjectFile("src/content/blog.ts")) {
  const re = /slug:\s*"([^"]+)"/g;
  const matches = [...source.matchAll(re)];
  return matches.map((match, index) => {
    const end = index + 1 < matches.length ? matches[index + 1].index : source.length;
    const chunk = source.slice(match.index, end);
    return {
      slug: match[1],
      noIndex: /noIndex:\s*true/.test(chunk),
    };
  });
}

/** Highest ISO year, then week number. Pass records to test a future week. */
export function latestWeeklySlug(records = blogPostRecords()) {
  let best = null;
  for (const record of records) {
    const match = record.slug.match(WEEKLY_RATE_SLUG);
    if (!match) continue;
    const key = Number(match[2]) * 100 + Number(match[1]);
    if (!best || key > best.key) best = { slug: record.slug, key };
  }
  return best ? best.slug : null;
}

/** Lender pages with `"noIndex": true` in src/content/lenderContent.json. */
export function noIndexLenderSlugs(
  content = JSON.parse(readProjectFile("src/content/lenderContent.json")),
) {
  return Object.entries(content)
    .filter(([, value]) => value && value.noIndex === true)
    .map(([slug]) => slug);
}

let cache;

function policy() {
  if (!cache) {
    const records = blogPostRecords();
    cache = {
      latestWeekly: latestWeeklySlug(records),
      noIndexBlog: new Set(records.filter((record) => record.noIndex).map((record) => record.slug)),
      noIndexLenders: new Set(noIndexLenderSlugs()),
    };
  }
  return cache;
}

function sectionSlug(path, section) {
  if (!path.startsWith(`/${section}/`) || path === `/${section}/`) return null;
  return path.split("/").filter(Boolean)[1] || null;
}

/** True when a blog post or lender page carries a noindex flag or is an older weekly roundup. */
export function isNoindexedContent(pathname) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const current = policy();
  const lender = sectionSlug(path, "lenders");
  if (lender && current.noIndexLenders.has(lender)) return true;
  const post = sectionSlug(path, "blog");
  if (!post) return false;
  if (current.noIndexBlog.has(post)) return true;
  if (WEEKLY_RATE_SLUG.test(post) && post !== current.latestWeekly) return true;
  return false;
}
