/**
 * Largest markets that stay indexable. Other /cities/* pages stay live
 * with noindex,follow and are omitted from the sitemap.
 * Laval is not in this list because the site has no Laval page.
 * Winnipeg, Halifax, Saskatoon, and Regina stay live but noindexed until
 * those pages are expanded. Add the slug back here to index them again.
 *
 * Blog posts and lender pages are filtered in sitemapFilter.mjs so this
 * file stays free of filesystem reads (city pages import it in the browser).
 */
export const INDEXED_CITY_SLUGS = [
  "toronto",
  "montreal",
  "vancouver",
  "calgary",
  "edmonton",
  "ottawa",
  "quebec-city",
  "hamilton",
  "kitchener",
  "london",
  "victoria",
  "mississauga",
  "brampton",
  "surrey",
  "oshawa",
];

const INDEXED = new Set(INDEXED_CITY_SLUGS);

export function isIndexedCity(slug) {
  return INDEXED.has(slug);
}

/** Utility and city rules. Content flags are applied by sitemapFilter.mjs. */
export function isIndexablePath(pathname) {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  if (path.startsWith("/widget")) return false;
  if (path.startsWith("/unsubscribed")) return false;
  if (path.startsWith("/unsubscribe")) return false;
  if (path.startsWith("/subscribe/confirmed")) return false;
  if (path.startsWith("/subscribe/thank-you")) return false;
  if (path.startsWith("/api/")) return false;
  if (path.startsWith("/glossary/") && path !== "/glossary/") return false;
  if (path.startsWith("/cities/") && path !== "/cities/") {
    const slug = path.split("/").filter(Boolean)[1];
    if (!INDEXED.has(slug)) return false;
  }
  return true;
}
