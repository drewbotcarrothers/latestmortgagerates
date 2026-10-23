/**
 * Exact legacy paths that must resolve on Hostinger.
 *
 * hCDN returns its own 404 for a URL that has no file, and that response
 * never reaches LiteSpeed, so the matching RewriteRule in public/.htaccess
 * does not run. Astro static redirects emit index.html (meta refresh plus
 * a canonical link) so the edge has a file to fetch. The .htaccess rules
 * stay for requests that do reach Apache.
 *
 * Destinations are the final URL. None of them is also a source.
 * The /blog/category/ prefix rule cannot be prebuilt for unknown children;
 * the index and the four blog categories are emitted here.
 */

export const legacyRedirects = {
  "/rates": "/",
  "/tools/mortgage-payment-calculator": "/tools/mortgage-calculator/",
  "/lenders/eqbank": "/lenders/nesto/",
  "/lenders/mcap": "/",
  "/lenders/hsbc": "/lenders/rbc/",
  "/unsubscribe": "/unsubscribed/",
  "/blog/closing-costs-canada": "/tools/closing-costs-calculator/",
  "/blog/first-time-home-buyer-guide-canada": "/guides/first-time-home-buyer-programs-canada/",
  "/blog/first-time-buyer-guide-2025": "/guides/first-time-home-buyer-programs-canada/",
  "/blog/first-time-buyer-guide-2026": "/guides/first-time-home-buyer-programs-canada/",
  "/blog/best-mortgage-rates-vancouver": "/cities/vancouver/",
  "/blog/best-mortgage-rates-toronto": "/cities/toronto/",
  "/blog/bank-of-canada-rate-hold-january-2025": "/blog/bank-of-canada-holds-rate-march-2025/",
  "/blog/spring-housing-market-2025": "/mortgage-rate-forecast-2027/",
  "/blog/spring-2026-housing-market-outlook": "/mortgage-rate-forecast-2027/",
  "/blog/spring-2026-outlook": "/mortgage-rate-forecast-2027/",
  "/blog/variable-vs-fixed-2025": "/blog/bond-yields-mortgage-rates-explained/",
  "/blog/renewal-strategy-2025": "/tools/mortgage-renewal-calculator/",
  "/blog/category": "/blog/",
  "/blog/category/rates": "/blog/",
  "/blog/category/news": "/blog/",
  "/blog/category/guides": "/blog/",
  "/blog/category/market": "/blog/",
  "/glossary/fixed-rate": "/glossary/fixed-rate-mortgage/",
  "/glossary/variable-rate": "/glossary/variable-rate-mortgage/",
  "/glossary/ltv-ratio": "/glossary/ltv/",
  "/glossary/prepayment-privilege": "/glossary/prepayment-privileges/",
  "/glossary/portability": "/glossary/portable-mortgage/",
  "/glossary/closing-costs": "/tools/closing-costs-calculator/",
};

/** Path without a trailing slash, except the site root. */
export function normalizeRedirectPath(pathname) {
  if (!pathname) return "/";
  const withLead = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (withLead.length > 1 && withLead.endsWith("/")) return withLead.slice(0, -1);
  return withLead;
}

export function isLegacyRedirectPath(pathname) {
  return Object.prototype.hasOwnProperty.call(legacyRedirects, normalizeRedirectPath(pathname));
}

/** Exact `RewriteRule ^path/?$ /dest/ [R=301,L]` lines. Prefix rules are omitted. */
export function htaccessExactRedirects(htaccess) {
  const map = {};
  const re = /^RewriteRule \^(\S+?)\/\?\$ (\S+) \[R=301,L\]/gm;
  for (const match of htaccess.matchAll(re)) {
    map[`/${match[1]}`] = match[2];
  }
  return map;
}
